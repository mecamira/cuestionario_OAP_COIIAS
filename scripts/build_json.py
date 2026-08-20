# -*- coding: utf-8 -*-
"""Fusiona material/meta/<id>.json + data/resumenes/<id>.json -> data/videos.json

Los ficheros de data/resumenes/ los genera el proceso de resumen (IA) con campos:
  resumen, temas[], areas[], nivel, publico_objetivo, sustituye_a (opcional, lista de ids)

sustituye_a marca que este video actualiza/reemplaza el contenido de otro(s) video(s)
mas antiguos sobre la misma necesidad concreta (p.ej. un webinar de IA de 2026 que
actualiza uno de 2022 sobre el mismo tema puntual). vigencia se deriva automaticamente:
cualquier video referenciado en el sustituye_a de otro pasa a vigencia="sustituido";
el resto queda vigencia="vigente". El recomendador debe evitar sugerir videos
"sustituido" cuando exista una alternativa "vigente" que cubra la misma necesidad.

Si un video aun no tiene resumen, entra en el JSON con resumen_generado=false.
"""
import json
import io
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
META = ROOT / "material" / "meta"
RES = ROOT / "data" / "resumenes"
OUT = ROOT / "data" / "videos.json"
RES.mkdir(parents=True, exist_ok=True)

ORDEN_LISTA = []
for line in (ROOT / "scripts" / "video_list.txt").read_text(encoding="utf-8").splitlines():
    line = line.strip()
    if line and not line.startswith("#"):
        ORDEN_LISTA.append(line.split("|")[0])

videos = []
sin_resumen = 0
for vid in ORDEN_LISTA:
    meta_path = META / f"{vid}.json"
    if not meta_path.exists():
        continue
    v = json.loads(meta_path.read_text(encoding="utf-8"))
    v.pop("capitulos", None)
    v.pop("descripcion_youtube", None)
    res_path = RES / f"{vid}.json"
    if res_path.exists():
        r = json.loads(res_path.read_text(encoding="utf-8"))
        v.update({
            "resumen": r.get("resumen"),
            "temas": r.get("temas", []),
            "areas": r.get("areas", []),
            "nivel": r.get("nivel"),
            "publico_objetivo": r.get("publico_objetivo"),
            "resumen_generado": True,
            "sustituye_a": r.get("sustituye_a", []),
            "vigencia": "vigente",
        })
    else:
        v.update({"resumen": None, "temas": [], "areas": [], "nivel": None,
                  "publico_objetivo": None, "resumen_generado": False,
                  "sustituye_a": [], "vigencia": "vigente"})
        sin_resumen += 1
    videos.append(v)

# Derivar vigencia: cualquier id referenciado en el sustituye_a de otro video
# queda marcado como sustituido (a menos que el propio catalogo no lo contenga,
# en cuyo caso se ignora silenciosamente aqui y se reporta en validate_json.py).
por_id = {v["id"]: v for v in videos}
sustituidos = set()
for v in videos:
    for otro_id in v.get("sustituye_a", []):
        sustituidos.add(otro_id)
for vid in sustituidos:
    if vid in por_id:
        por_id[vid]["vigencia"] = "sustituido"

doc = {
    "descripcion": "Material didactico de la Oficina Acelera Pyme del COIIAS (canal YouTube @coiias) para asesoria en digitalizacion de pymes.",
    "areas_posibles": [
        "estrategia-y-transformacion-digital", "presencia-web-y-ecommerce",
        "marketing-digital", "inteligencia-artificial", "datos-y-business-intelligence",
        "ciberseguridad", "productividad-y-colaboracion", "administracion-digital",
        "industria-4.0", "emprendimiento-e-innovacion", "habilidades-y-liderazgo",
        "tecnologias-emergentes", "ayudas-y-financiacion",
    ],
    "niveles_posibles": ["basico", "intermedio", "avanzado"],
    "nota_vigencia": (
        "vigencia='sustituido' significa que otro video mas reciente del catalogo "
        "cubre la misma necesidad de forma actualizada (ver su campo sustituye_a). "
        "El recomendador debe priorizar los videos 'vigente' y solo ofrecer un "
        "'sustituido' cuando no haya alternativa vigente para esa area/necesidad."
    ),
    "total_videos": len(videos),
    "videos": videos,
}
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"data/videos.json generado: {len(videos)} videos, {sin_resumen} sin resumen")

# -*- coding: utf-8 -*-
"""Valida data/cuestionario.json: sumas de puntos, IDs unicos, areas referenciadas
existen en data/videos.json."""
import json
import io
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
q = json.loads((ROOT / "data" / "cuestionario.json").read_text(encoding="utf-8"))
videos = json.loads((ROOT / "data" / "videos.json").read_text(encoding="utf-8"))
areas_validas = set(videos["areas_posibles"])
videos_por_id = {v["id"]: v for v in videos["videos"]}

errs = []
ids_preguntas = set()
total_max_global = 0
suma_areas_dim = set()
ids_recomendados = set()

for dim in q["dimensiones"]:
    suma_opts_max = 0
    for vid in dim.get("recomendacion_sector", {}).get("ids", []):
        ids_recomendados.add(vid)
        v = videos_por_id.get(vid)
        if v is None:
            errs.append(f"{dim['id']} (recomendacion_sector): id de video '{vid}' no existe en videos.json")
        elif v.get("categoria") == "pildora":
            errs.append(f"{dim['id']} (recomendacion_sector): '{vid}' es una pildora, no debe recomendarse")
    for pregunta in dim["preguntas"]:
        if pregunta["id"] in ids_preguntas:
            errs.append(f"id de pregunta duplicado: {pregunta['id']}")
        ids_preguntas.add(pregunta["id"])
        valores_numericos = [o["valor"] for o in pregunta["opciones"] if isinstance(o.get("valor"), int)]
        opciones_no_aplica = [o for o in pregunta["opciones"] if o.get("no_aplica")]
        if opciones_no_aplica and any(o.get("valor") is not None for o in opciones_no_aplica):
            errs.append(f"{pregunta['id']}: la opcion no_aplica debe tener valor null")
        max_opt = max(valores_numericos)
        suma_opts_max += max_opt
        for nivel_resp, ids in pregunta.get("recomendaciones", {}).items():
            for vid in ids:
                ids_recomendados.add(vid)
                v = videos_por_id.get(vid)
                if v is None:
                    errs.append(f"{pregunta['id']} (respuesta {nivel_resp}): id de video '{vid}' no existe en videos.json")
                elif v.get("categoria") == "pildora":
                    errs.append(f"{pregunta['id']} (respuesta {nivel_resp}): '{vid}' es una pildora, no debe recomendarse")
                elif v.get("vigencia") == "sustituido":
                    errs.append(f"{pregunta['id']} (respuesta {nivel_resp}): '{vid}' esta sustituido, revisar si hay alternativa vigente")
    if suma_opts_max != dim["max_puntos"]:
        errs.append(f"{dim['id']}: max_puntos={dim['max_puntos']} pero suma de opciones max={suma_opts_max}")
    for a in dim["areas_json"]:
        if a not in areas_validas:
            errs.append(f"{dim['id']}: area '{a}' no existe en videos.json")
        suma_areas_dim.add(a)
    total_max_global += dim["max_puntos"]

areas_no_punt = set(q.get("areas_no_puntuadas", {}).keys())
todas_cubiertas = suma_areas_dim | areas_no_punt
faltantes = areas_validas - todas_cubiertas
sobrantes = areas_no_punt - areas_validas

print(f"dimensiones: {len(q['dimensiones'])}, preguntas: {len(ids_preguntas)}")
print(f"max_puntos total (asumiendo todo aplicable): {total_max_global}")
print(f"videos distintos recomendados en el cuestionario: {len(ids_recomendados)}")
print(f"areas de videos.json sin cubrir en el cuestionario: {faltantes or 'ninguna'}")
print(f"areas_no_puntuadas invalidas: {sobrantes or 'ninguna'}")
print("errores:", errs if errs else "ninguno")

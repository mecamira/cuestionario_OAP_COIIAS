# -*- coding: utf-8 -*-
"""Valida data/videos.json: esquema, areas/niveles permitidos y estadisticas."""
import json
import io
import sys
from collections import Counter
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
d = json.loads((ROOT / "data" / "videos.json").read_text(encoding="utf-8"))
areas_ok = set(d["areas_posibles"])
niveles_ok = set(d["niveles_posibles"])
ids_validos = {v["id"] for v in d["videos"]}
vigencia_ok = {"vigente", "sustituido"}
errs = []
palabras = []
for v in d["videos"]:
    for campo in ("id", "titulo", "url", "duracion_seg", "resumen", "temas", "areas", "nivel"):
        if not v.get(campo):
            errs.append(f"{v['id']}: falta {campo}")
    for a in v["areas"]:
        if a not in areas_ok:
            errs.append(f"{v['id']}: area invalida {a}")
    if v["nivel"] not in niveles_ok:
        errs.append(f"{v['id']}: nivel invalido {v['nivel']}")
    if v.get("vigencia") not in vigencia_ok:
        errs.append(f"{v['id']}: vigencia invalida {v.get('vigencia')!r}")
    for otro_id in v.get("sustituye_a", []):
        if otro_id not in ids_validos:
            errs.append(f"{v['id']}: sustituye_a referencia id inexistente {otro_id}")
        if otro_id == v["id"]:
            errs.append(f"{v['id']}: sustituye_a se referencia a si mismo")
    palabras.append(len(v["resumen"].split()))

sustituidos = [v["id"] for v in d["videos"] if v.get("vigencia") == "sustituido"]
relaciones = [(v["id"], v["sustituye_a"]) for v in d["videos"] if v.get("sustituye_a")]

print("videos:", d["total_videos"])
print("errores:", errs if errs else "ninguno")
print("palabras/resumen: min", min(palabras), "max", max(palabras), "media", sum(palabras) // len(palabras))
print("por categoria:", dict(Counter(v["categoria"] for v in d["videos"])))
print("por nivel:", dict(Counter(v["nivel"] for v in d["videos"])))
print("por area:", dict(Counter(a for v in d["videos"] for a in v["areas"]).most_common()))
print(f"videos sustituidos: {len(sustituidos)} ->", sustituidos)
print("relaciones sustituye_a (nuevo -> [antiguos]):")
for nuevo, antiguos in relaciones:
    print(f"  {nuevo} -> {antiguos}")

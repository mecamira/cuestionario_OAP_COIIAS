# -*- coding: utf-8 -*-
"""Vuelca data/videos.json agrupado por area, excluyendo pildoras, para
apoyar la auditoria manual de recomendaciones por pregunta/nivel."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
d = json.loads((ROOT / "data" / "videos.json").read_text(encoding="utf-8"))
vids = [v for v in d["videos"] if v.get("categoria") != "pildora"]

by_area = {}
for v in vids:
    for a in v.get("areas", []):
        by_area.setdefault(a, []).append(v)

out_lines = []
for a in sorted(by_area):
    out_lines.append(f"== {a} ({len(by_area[a])}) ==")
    orden_nivel = {"basico": 0, "intermedio": 1, "avanzado": 2}
    for v in sorted(by_area[a], key=lambda x: orden_nivel.get(x.get("nivel"), 9)):
        vig = v.get("vigencia")
        marca = "" if vig == "vigente" else " [SUSTITUIDO]"
        out_lines.append(
            f"  {v['id']} | {v.get('nivel')} | {v['duracion_seg']//60}min | {v['categoria']} | {v['titulo']}{marca}"
        )
    out_lines.append("")

out_path = ROOT / "scripts" / "_by_area.txt"
out_path.write_text("\n".join(out_lines), encoding="utf-8")
print(f"Escrito {out_path} ({len(out_lines)} lineas)")

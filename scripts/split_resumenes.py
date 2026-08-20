# -*- coding: utf-8 -*-
"""Divide data/resumenes_batches/batch_NN.json (dict id -> resumen) en
ficheros individuales data/resumenes/<id>.json y valida campos."""
import json
import io
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
BATCHES = ROOT / "data" / "resumenes_batches"
RES = ROOT / "data" / "resumenes"
RES.mkdir(parents=True, exist_ok=True)

REQUIRED = {"resumen", "temas", "areas", "nivel", "publico_objetivo"}
NIVELES = {"basico", "intermedio", "avanzado"}

total, errors = 0, []
for bf in sorted(BATCHES.glob("batch_*.json")):
    data = json.loads(bf.read_text(encoding="utf-8"))
    for vid, r in data.items():
        missing = REQUIRED - set(r)
        if missing:
            errors.append(f"{bf.name}/{vid}: faltan {missing}")
            continue
        if r["nivel"] not in NIVELES:
            errors.append(f"{bf.name}/{vid}: nivel invalido {r['nivel']!r}")
        wc = len(str(r["resumen"]).split())
        if wc < 80:
            errors.append(f"{bf.name}/{vid}: resumen corto ({wc} palabras)")
        (RES / f"{vid}.json").write_text(
            json.dumps(r, ensure_ascii=False, indent=2), encoding="utf-8")
        total += 1
print(f"{total} resumenes escritos en data/resumenes/")
for e in errors:
    print("AVISO:", e)

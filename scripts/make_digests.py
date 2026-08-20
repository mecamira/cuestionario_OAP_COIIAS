# -*- coding: utf-8 -*-
"""Genera digests compactos por video para el proceso de resumen con IA.

Por video: titulo, serie, duracion, descripcion (recortada), capitulos y una
muestra representativa de la transcripcion (completa si es corta, muestreo
uniforme si es larga). Agrupa ~8 videos por fichero en material/digests/.
"""
import json
import io
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
META = ROOT / "material" / "meta"
TRANS = ROOT / "material" / "transcripts"
DIG = ROOT / "material" / "digests"
DIG.mkdir(parents=True, exist_ok=True)

BATCH = 8
FULL_LIMIT = 6000      # si la transcripcion cabe en esto, va entera
SAMPLE_CHUNKS = 8      # si no, N trozos uniformes
CHUNK_CHARS = 650
DESC_LIMIT = 1200

order = []
for line in (ROOT / "scripts" / "video_list.txt").read_text(encoding="utf-8").splitlines():
    line = line.strip()
    if line and not line.startswith("#"):
        order.append(line.split("|")[0])


def sample_transcript(text: str) -> str:
    text = " ".join(text.split())  # colapsar saltos
    if len(text) <= FULL_LIMIT:
        return text
    step = (len(text) - CHUNK_CHARS) // (SAMPLE_CHUNKS - 1)
    parts = []
    for i in range(SAMPLE_CHUNKS):
        start = i * step
        parts.append(text[start:start + CHUNK_CHARS])
    return "\n[...]\n".join(parts)


entries = []
for vid in order:
    meta_path = META / f"{vid}.json"
    if not meta_path.exists():
        continue
    m = json.loads(meta_path.read_text(encoding="utf-8"))
    trans = (TRANS / f"{vid}.txt")
    ttext = trans.read_text(encoding="utf-8") if trans.exists() else ""
    desc = (m.get("descripcion_youtube") or "")[:DESC_LIMIT]
    caps = "; ".join(c["titulo"] for c in m.get("capitulos", []) if c.get("titulo"))
    dur_min = round((m.get("duracion_seg") or 0) / 60)
    block = [
        f"=== VIDEO {vid} ===",
        f"TITULO: {m.get('titulo')}",
        f"SERIE: {m.get('serie')} | CATEGORIA: {m.get('categoria')} | DURACION: {dur_min} min | FECHA: {m.get('fecha_publicacion')}",
    ]
    if desc.strip():
        block.append(f"DESCRIPCION: {desc}")
    if caps:
        block.append(f"CAPITULOS: {caps}")
    if ttext.strip():
        block.append("TRANSCRIPCION (muestra):")
        block.append(sample_transcript(ttext))
    else:
        block.append("TRANSCRIPCION: (no disponible)")
    entries.append("\n".join(block))

for f in DIG.glob("batch_*.txt"):
    f.unlink()
n_batches = 0
for i in range(0, len(entries), BATCH):
    n_batches += 1
    (DIG / f"batch_{n_batches:02d}.txt").write_text(
        "\n\n".join(entries[i:i + BATCH]), encoding="utf-8")
print(f"{len(entries)} videos en {n_batches} batches -> material/digests/")

# -*- coding: utf-8 -*-
"""Descarga metadatos y subtitulos (es) de los videos didacticos del canal @coiias.

Lee scripts/video_list.txt (id|categoria|serie) y genera:
  - material/meta/<id>.json      metadatos basicos del video
  - material/subs/<id>.*.vtt     subtitulos originales
  - material/transcripts/<id>.txt  transcripcion en texto plano (limpia)

Es reanudable: se salta los videos que ya tienen meta + transcripcion.
"""
import json
import re
import sys
import io
from pathlib import Path

import yt_dlp

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
META = ROOT / "material" / "meta"
SUBS = ROOT / "material" / "subs"
TRANS = ROOT / "material" / "transcripts"
for d in (META, SUBS, TRANS):
    d.mkdir(parents=True, exist_ok=True)


def load_list():
    videos = []
    for line in (ROOT / "scripts" / "video_list.txt").read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        vid, cat, serie = line.split("|")
        videos.append({"id": vid, "categoria": cat, "serie": serie})
    return videos


def vtt_to_text(vtt: str) -> str:
    """Convierte VTT (incl. auto-subs con lineas rodantes duplicadas) a texto plano."""
    lines = []
    for raw in vtt.splitlines():
        line = raw.strip()
        if (not line or line == "WEBVTT" or line.startswith(("Kind:", "Language:", "NOTE"))
                or "-->" in line or line.isdigit()):
            continue
        line = re.sub(r"<[^>]+>", "", line)  # tags de karaoke <00:00:01.ix><c>
        line = line.replace("&nbsp;", " ").replace("&amp;", "&").replace("&gt;", ">").replace("&lt;", "<")
        line = line.strip()
        if not line:
            continue
        if lines and (line == lines[-1]):  # duplicados consecutivos de auto-subs
            continue
        lines.append(line)
    # segunda pasada: auto-subs repiten cada linea dos veces en bloques rodantes
    out = []
    for ln in lines:
        if out and ln == out[-1]:
            continue
        out.append(ln)
    return "\n".join(out)


def fetch(video):
    vid = video["id"]
    meta_path = META / f"{vid}.json"
    trans_path = TRANS / f"{vid}.txt"
    if meta_path.exists() and trans_path.exists():
        return "skip"

    opts = {
        "skip_download": True,
        "writesubtitles": True,
        "writeautomaticsub": True,
        "subtitleslangs": ["es", "es-orig", "es-419", "es-ES"],
        "subtitlesformat": "vtt",
        "outtmpl": str(SUBS / "%(id)s.%(ext)s"),
        "quiet": True,
        "no_warnings": True,
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={vid}", download=True)

    meta = {
        "id": vid,
        "titulo": info.get("title"),
        "url": f"https://www.youtube.com/watch?v={vid}",
        "duracion_seg": info.get("duration"),
        "fecha_publicacion": info.get("upload_date"),
        "descripcion_youtube": (info.get("description") or "")[:3000],
        "capitulos": [
            {"inicio_seg": int(c.get("start_time") or 0), "titulo": c.get("title")}
            for c in (info.get("chapters") or [])
        ],
        "categoria": video["categoria"],
        "serie": video["serie"],
    }
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")

    # localizar el vtt descargado (puede ser <id>.es.vtt, <id>.es-orig.vtt, ...)
    vtts = sorted(SUBS.glob(f"{vid}.*.vtt"))
    if vtts:
        text = vtt_to_text(vtts[0].read_text(encoding="utf-8", errors="replace"))
        trans_path.write_text(text, encoding="utf-8")
        return "ok"
    trans_path.write_text("", encoding="utf-8")
    return "sin_subs"


def main():
    videos = load_list()
    print(f"{len(videos)} videos en lista")
    results = {"ok": 0, "skip": 0, "sin_subs": 0, "error": 0}
    errores = []
    for i, video in enumerate(videos, 1):
        try:
            r = fetch(video)
        except Exception as e:  # noqa: BLE001
            r = "error"
            errores.append((video["id"], str(e)[:200]))
        results[r] += 1
        print(f"[{i}/{len(videos)}] {video['id']} -> {r}", flush=True)
    print(json.dumps(results))
    for vid, err in errores:
        print(f"ERROR {vid}: {err}")


if __name__ == "__main__":
    main()

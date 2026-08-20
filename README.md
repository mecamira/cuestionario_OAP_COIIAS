# Cuestionario de Digitalización — OAP COIIAS

Plataforma de la Oficina Acelera Pyme del COIIAS para diagnosticar el nivel de
digitalización de empresas y asesorarlas con el material didáctico del canal
[YouTube @coiias](https://www.youtube.com/@coiias).

## Fases del proyecto

1. **JSON de material didáctico** (en curso): metadatos + resumen largo de cada
   vídeo didáctico del canal, pensado para que una IA lo recorra con agilidad.
2. Web pública en Netlify con el cuestionario dinámico.
3. Sección privada (equipo COIIAS) con dashboard de resultados.
4. Firebase (Firestore + Auth) como base de datos.
5. Recomendador IA por resultado (vía Netlify Function) que explora el JSON y
   justifica los vídeos recomendados.
6. Informe HTML autogenerado y editable para enviar a la empresa.

## Fase 1 — Estructura

```
scripts/
  video_list.txt     Lista curada de vídeos didácticos (id|categoria|serie).
                     Excluidos: oposiciones, premios, eventos institucionales y
                     webinars sectoriales de construcción/energía.
  fetch_material.py  Descarga metadatos + subtítulos (es) con yt-dlp. Reanudable.
  build_json.py      Fusiona metadatos + resúmenes -> data/videos.json
material/
  meta/<id>.json         Metadatos por vídeo (título, duración, fecha, descripción, capítulos)
  subs/<id>.<lang>.vtt   Subtítulos originales
  transcripts/<id>.txt   Transcripción en texto plano
data/
  resumenes/<id>.json    Resumen largo + clasificación por vídeo (generado con IA)
  videos.json            RESULTADO: el JSON de material didáctico completo
```

### Esquema de `data/resumenes/<id>.json`

```json
{
  "resumen": "150-300 palabras sobre qué enseña el vídeo, a quién y qué se lleva el espectador",
  "temas": ["etiquetas", "concretas"],
  "areas": ["una o más de areas_posibles (ver data/videos.json)"],
  "nivel": "basico | intermedio | avanzado",
  "publico_objetivo": "una frase"
}
```

### Comandos

```bash
python scripts/fetch_material.py   # descargar/actualizar material
python scripts/build_json.py       # regenerar data/videos.json
```

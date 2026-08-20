# Cuestionario de Digitalización — OAP COIIAS

Plataforma de la Oficina Acelera Pyme del COIIAS para diagnosticar el nivel de
digitalización de empresas y asesorarlas con el material didáctico del canal
[YouTube @coiias](https://www.youtube.com/@coiias).

## Fases del proyecto

1. **Completada.** JSON de material didáctico: metadatos + resumen largo de
   cada vídeo del canal (`data/videos.json`, 197 vídeos), pensado para que una
   IA lo recorra con agilidad.
2. **Completada.** Cuestionario dinámico (`data/cuestionario.json`) y
   prototipo autocontenido de referencia (`docs/prototipo-cuestionario.html`).
3. **Completada.** App real (React + Vite, en `app/`) con el cuestionario
   público escribiendo en Firestore, y un dashboard privado (Firebase Auth)
   para el equipo COIIAS: listado/filtro de respuestas, detalle con
   puntuación y recomendaciones, control del ciclo del informe
   (generado/enviado/respondido) y un editor de informe imprimible a PDF.
4. **Pendiente de credenciales reales.** El código está construido y probado
   contra los emuladores locales de Firebase (ver `app/README.md`); falta
   que el proyecto de Firebase real exista y se compartan sus 6 valores de
   configuración para desplegar con datos reales (ver sección "Siguiente
   paso" más abajo).
5. Recomendador IA por resultado (vía Netlify Function) que explora el JSON y
   justifica los vídeos recomendados — futuro, no empezado.
6. Ampliar el editor de informe con generación asistida por IA del texto —
   futuro; hoy el texto inicial es una plantilla determinista y el equipo lo
   edita a mano antes de exportar a PDF.

## App (`app/`)

React + Vite. El cuestionario público vive en `/`, el dashboard privado en
`/dashboard` (login con Firebase Auth, una cuenta por persona del equipo).
Consume `data/cuestionario.json` y `data/videos.json` directamente — no los
duplica — y porta fielmente la lógica de puntuación/recomendación del
prototipo (`app/src/lib/scoring.ts`).

Ver `app/README.md` para instrucciones de desarrollo local, emuladores de
Firebase y cómo desplegar con un proyecto de Firebase real.

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

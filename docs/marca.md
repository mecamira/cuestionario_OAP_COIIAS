# Identidad visual — OAP COIIAS

Extraída de la web oficial vigente **https://www.oapasturias.es/** (WordPress + Elementor)
el 2026-08-18. (Nota: la URL otdasturias.com pasada inicialmente es una versión anterior/Wix
de la misma oficina; se descarta en favor de esta, que es la que enlaza el propio COIIAS hoy).

## Logos oficiales (descargados en este directorio)

- `logo-acelera-coiipa.svg` — logotipo combinado OAP + COIIAS (cabecera del sitio).
- `logo-sticky.svg` — variante compacta para header al hacer scroll.
- `logo-oap3.png` — lockup "OAP" con banda de financiación FEDER.

Colores extraídos directamente de los SVG oficiales (`fill:` en el propio archivo) y
confirmados por muestreo de píxeles del PNG:

## Paleta oficial

| Token | Hex | Origen / uso |
|---|---|---|
| `--azul-coiias` | `#124B91` | Azul institucional COIIAS. Color primario, texto de botón sobre fondo blanco, enlaces. |
| `--azul-coiias-vivo` | `#0063E3` | Variante más viva usada puntualmente en la web (hover, iconos). |
| `--verde-acelerapyme` | `#76BC21` | Verde del programa nacional Acelera Pyme. Acento secundario / CTA. |
| `--verde-acelerapyme-claro` | `#95C11F` | Variante clara del verde, detalles y hover. |
| `--negro-marca` | `#1D1D1B` | Negro cálido de los logos (no #000 puro). |
| `--gris-texto` | `#555555` | Texto de cuerpo. |
| `--gris-medio` | `#AEAEAF` | Líneas, iconografía secundaria del logo. |
| `--gris-suave` | `#EEEEEE` | Fondos de sección alternos. |
| `--blanco` | `#FFFFFF` | Fondo base. |

Colores puntuales vistos en la web (usar con moderación, no son núcleo de marca):
rosa `#CC3366` (algún badge/etiqueta), verde estado `#61CE70`.

Semáforo del diagnóstico (estándar, no forma parte de la marca):
rojo `#D64541` · ámbar `#E8A33D` · verde `#76BC21` (reutiliza el verde Acelera Pyme — encaja perfecto).

## Tipografía

Cargadas vía Google Fonts en la web real:

- **Títulos**: `Poppins` (SemiBold/Bold para h1-h2, tamaños grandes ~40-67px en desktop).
- **Cuerpo**: `Roboto` (Regular/Medium).
- Familias adicionales cargadas pero de uso puntual: `Advent Pro`, `Oswald` (no imprescindibles).
- Google Fonts: `Poppins:400,500,600,700` + `Roboto:400,500,700`.

## Estilo

- WordPress + Elementor: secciones con imagen de fondo oscura y texto blanco superpuesto
  en el hero (h2 blanco 67px sobre fondo oscuro/foto), alternadas con bloques de fondo claro.
- Botones **rectangulares con esquinas ligeramente redondeadas** (border-radius ~4px, no pill),
  fondo blanco + texto azul `#124B91`, padding generoso (15px 30px).
- Iconografía de servicios en tarjetas simples (línea + texto).
- Pie de página oscuro con menús en columnas y el aviso de financiación FEDER/NextGenerationEU
  obligatorio por normativa de subvención — **debe mantenerse igual en cualquier pieza nueva**.
- Selector de idioma ES/EN visible en cabecera (plugin TRP) — nuestro cuestionario podría
  quedarse en español únicamente en la v1, pero dejar la puerta abierta.

## Contexto funcional relevante (hallado en la web, 2026-08-18)

La web ya anuncia un **"Test de Diagnóstico en Transformación Digital"** en
`/asesoramiento/#test`, pero hoy es solo:
1. Un **Google Form** de captación (nombre, NIF, email, teléfono, empresa, CIF, CP,
   tramo de empleados: <3 / 3-9 / 10-49 / 50-249 / 250+) —
   sin diagnóstico real embebido.
2. Tras enviarlo, prometen mandar "otro correo con el enlace al Test de Diagnóstico" —
   proceso manual/semi-manual, no una herramienta interactiva.

**Implicación para el proyecto**: nuestro cuestionario dinámico + dashboard + recomendador IA
es una mejora sustancial de un proceso que hoy es casi 100% manual. Podemos reutilizar los
mismos campos de empresa que ya recogen (nombre/razón social, NIF/CIF, email, teléfono,
código postal, tramo de empleados) para no reinventar el intake y encajar con lo que ya
esperan internamente, y sustituir el "email con el enlace" por el test real e inmediato.

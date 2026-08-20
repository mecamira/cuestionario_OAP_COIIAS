# -*- coding: utf-8 -*-
"""Ensambla docs/prototipo-cuestionario.html: artefacto autocontenido con las
tipografias de marca (Poppins/Roboto) embebidas como data URI, el cuestionario
completo (data/cuestionario.json) y una muestra curada de videos reales para
las recomendaciones de resultado.
"""
import io
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "assets" / "fonts"
DOCS = ROOT / "docs"


def png_data_uri(filename):
    import base64

    data = (DOCS / filename).read_bytes()
    return "data:image/png;base64," + base64.b64encode(data).decode("ascii")


poppins600 = (FONTS / "poppins-600.woff2.b64").read_text()
poppins700 = (FONTS / "poppins-700.woff2.b64").read_text()
roboto = (FONTS / "roboto-400-500.woff2.b64").read_text()

LOGO_OAP_URI = png_data_uri("logo-oap3.png")
LOGO_FEDER_URI = png_data_uri("logo-feder.png")
LOGO_COFINANCIACION_URI = png_data_uri("logo-cofinanciacion.png")

UNICODE_RANGE = (
    "U+20-22, U+25, U+27-29, U+2c-3b, U+3f, U+41-5a, U+61-7a, U+a1, U+bf, U+c1, "
    "U+c3-c4, U+c9, U+cb, U+cd, U+cf, U+d1, U+d3, U+d5-d6, U+da, U+dc-dd, U+e1, "
    "U+e3-e4, U+e9, U+eb, U+ed, U+ef, U+f1, U+f3, U+f5-f6, U+fa, U+fc-fd, U+ff, "
    "U+106-107, U+128-129, U+139-13a, U+143-144, U+154-155, U+15a-15b, U+168-169, "
    "U+178-17a, U+1d7-1d8, U+1f4-1f5, U+301, U+303, U+308, U+1e26-1e27, U+1e2e-1e31, "
    "U+1e3e-1e3f, U+1e4c-1e4f, U+1e54-1e55, U+1e78-1e79, U+1e7c-1e7d, U+1e82-1e85, "
    "U+1e8c-1e8d, U+1e97, U+1ebc-1ebd, U+1ef8-1ef9, U+2013-2014, U+2019, U+20ac"
)

FONT_CSS = f"""
@font-face {{
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(data:font/woff2;charset=utf-8;base64,{poppins600}) format('woff2');
  unicode-range: {UNICODE_RANGE};
}}
@font-face {{
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(data:font/woff2;charset=utf-8;base64,{poppins700}) format('woff2');
  unicode-range: {UNICODE_RANGE};
}}
@font-face {{
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;charset=utf-8;base64,{roboto}) format('woff2');
  unicode-range: {UNICODE_RANGE};
}}
@font-face {{
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(data:font/woff2;charset=utf-8;base64,{roboto}) format('woff2');
  unicode-range: {UNICODE_RANGE};
}}
"""

HTML_TEMPLATE = """<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Test de Madurez Digital</title>
<style>
__FONT_CSS__

/* ============ TOKENS ============ */
:root {
  --azul: #124B91;
  --azul-fuerte: #0B2E5E;
  --azul-suave: #E8F0FB;
  --anillo: #0063E3;
  --verde: #76BC21;
  --verde-texto: #4B7A15;
  --verde-suave: #EEF6E1;
  --tinta: #1D1D1B;
  --tinta-suave: #58564F;
  --papel: #F6F5F3;
  --superficie: #FFFFFF;
  --superficie-alt: #FBFAF8;
  --linea: #E4E1DC;
  --linea-fuerte: #CBC7C0;
  --rojo: #C2402F;
  --rojo-suave: #FBEAE7;
  --ambar: #B8791A;
  --ambar-suave: #FBF1DF;
  --sombra: 0 1px 2px rgba(29,29,27,.05), 0 8px 24px -12px rgba(29,29,27,.18);

  --font-display: 'Poppins', 'Century Gothic', 'Segoe UI Semibold', system-ui, sans-serif;
  --font-body: 'Roboto', 'Segoe UI', system-ui, sans-serif;

  --dur: .22s;
  --ease: cubic-bezier(.2,.7,.3,1);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --azul: #6CA3EA;
    --azul-fuerte: #9CC3F2;
    --azul-suave: rgba(108,163,234,.14);
    --anillo: #6CA3EA;
    --verde: #8FD337;
    --verde-texto: #A6E357;
    --verde-suave: rgba(143,211,55,.12);
    --tinta: #EDECE9;
    --tinta-suave: #ADAAA2;
    --papel: #17191A;
    --superficie: #1F2224;
    --superficie-alt: #24272A;
    --linea: #34373A;
    --linea-fuerte: #45484B;
    --rojo: #E8756A;
    --rojo-suave: rgba(232,117,106,.14);
    --ambar: #E3B054;
    --ambar-suave: rgba(227,176,84,.14);
    --sombra: 0 1px 2px rgba(0,0,0,.3), 0 8px 24px -12px rgba(0,0,0,.5);
  }
}
:root[data-theme="dark"] {
  --azul: #6CA3EA;
  --azul-fuerte: #9CC3F2;
  --azul-suave: rgba(108,163,234,.14);
  --anillo: #6CA3EA;
  --verde: #8FD337;
  --verde-texto: #A6E357;
  --verde-suave: rgba(143,211,55,.12);
  --tinta: #EDECE9;
  --tinta-suave: #ADAAA2;
  --papel: #17191A;
  --superficie: #1F2224;
  --superficie-alt: #24272A;
  --linea: #34373A;
  --linea-fuerte: #45484B;
  --rojo: #E8756A;
  --rojo-suave: rgba(232,117,106,.14);
  --ambar: #E3B054;
  --ambar-suave: rgba(227,176,84,.14);
  --sombra: 0 1px 2px rgba(0,0,0,.3), 0 8px 24px -12px rgba(0,0,0,.5);
}

/* ============ BASE ============ */
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--papel);
  color: var(--tinta);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: .001ms !important; transition-duration: .001ms !important; }
}

h1, h2, h3 { font-family: var(--font-display); font-weight: 600; margin: 0; text-wrap: balance; color: var(--tinta); }
p { margin: 0; }
button { font-family: inherit; }

.envoltorio {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.tarjeta {
  width: 100%;
  max-width: 640px;
  background: var(--superficie);
  border: 1px solid var(--linea);
  border-radius: 10px;
  box-shadow: var(--sombra);
  overflow: hidden;
  position: relative;
}
.tarjeta::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--azul), var(--verde));
}

.marca {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 22px 28px 0;
}
.marca-monograma {
  width: 30px; height: 30px;
  border-radius: 7px;
  background: var(--azul);
  color: #fff;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 13px;
  flex: none;
}
.marca-texto {
  font-size: 12px;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--tinta-suave);
  font-weight: 500;
}
.marca-texto strong { color: var(--tinta); font-weight: 600; }

.panel { padding: 26px 28px 28px; }

/* ============ INTRO ============ */
.intro-titular { font-size: clamp(26px, 4.4vw, 34px); line-height: 1.18; margin-top: 14px; }
.intro-cuerpo { margin-top: 12px; color: var(--tinta-suave); font-size: 16px; max-width: 52ch; }
.intro-meta {
  display: flex; flex-wrap: wrap; gap: 10px 20px;
  margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--linea);
  font-size: 13.5px; color: var(--tinta-suave);
}
.intro-meta span { display: flex; align-items: center; gap: 7px; }
.intro-meta .punto { width: 5px; height: 5px; border-radius: 50%; background: var(--verde); flex: none; }

.dimensiones-preview {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(150px,1fr));
  gap: 8px; margin-top: 22px;
}
.dim-chip {
  border: 1px solid var(--linea); border-radius: 6px; padding: 9px 11px;
  font-size: 13px; color: var(--tinta-suave); background: var(--superficie-alt);
}

/* ============ PROGRESO ============ */
.progreso-envoltorio { padding: 18px 28px 0; }
.progreso-fila {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 12.5px; color: var(--tinta-suave); margin-bottom: 8px;
}
.progreso-fila .paso-num { font-variant-numeric: tabular-nums; font-weight: 500; }
.progreso-pista { height: 5px; background: var(--linea); border-radius: 3px; overflow: hidden; }
.progreso-relleno {
  height: 100%; background: linear-gradient(90deg, var(--azul), var(--verde));
  border-radius: 3px; transition: width var(--dur) var(--ease);
}
.dimension-eyebrow {
  font-size: 12.5px; letter-spacing: .05em; text-transform: uppercase;
  color: var(--azul); font-weight: 500; margin-top: 22px;
}

/* ============ PREGUNTA ============ */
.pregunta-texto { font-size: clamp(19px, 3vw, 22px); font-family: var(--font-display); font-weight: 600; margin-top: 8px; line-height: 1.32; }
.opciones { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
.opcion {
  text-align: left;
  border: 1.5px solid var(--linea);
  background: var(--superficie);
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 15.5px;
  color: var(--tinta);
  cursor: pointer;
  display: flex; align-items: center; gap: 12px;
  transition: border-color .15s var(--ease), background .15s var(--ease), transform .1s var(--ease);
}
.opcion:hover { border-color: var(--azul); background: var(--azul-suave); }
.opcion:focus-visible { outline: 2.5px solid var(--anillo); outline-offset: 2px; }
.opcion:active { transform: scale(.99); }
.opcion.seleccionada { border-color: var(--azul); background: var(--azul-suave); }
.opcion-marca {
  width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--linea-fuerte);
  flex: none; display: grid; place-items: center; transition: border-color .15s, background .15s;
}
.opcion.seleccionada .opcion-marca { border-color: var(--azul); background: var(--azul); }
.opcion.seleccionada .opcion-marca::after { content: ""; width: 7px; height: 7px; border-radius: 50%; background: #fff; }
.opcion-no-aplica { border-style: dashed; color: var(--tinta-suave); font-style: italic; }
.opcion-no-aplica:hover { border-color: var(--linea-fuerte); background: var(--superficie-alt); }
.opcion-no-aplica.seleccionada { border-style: solid; font-style: normal; }

.nav-fila { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; }
.btn-atras {
  background: none; border: none; color: var(--tinta-suave); font-size: 14px;
  cursor: pointer; padding: 8px 4px; display: flex; align-items: center; gap: 6px;
}
.btn-atras:hover { color: var(--tinta); }
.btn-atras:focus-visible { outline: 2px solid var(--anillo); outline-offset: 2px; border-radius: 4px; }

/* ============ BOTONES / CAMPOS ============ */
.btn-primario {
  background: var(--verde); color: #14330A; border: none; border-radius: 4px;
  font-family: var(--font-display); font-weight: 600; font-size: 15.5px;
  padding: 14px 26px; cursor: pointer; display: inline-flex; align-items: center; gap: 9px;
  transition: background .15s var(--ease), transform .1s var(--ease);
}
.btn-primario:hover { background: var(--verde-texto); color: #fff; }
.btn-primario:focus-visible { outline: 2.5px solid var(--anillo); outline-offset: 2px; }
.btn-primario:active { transform: scale(.98); }
.btn-primario:disabled { opacity: .5; cursor: not-allowed; }

.campo { margin-top: 16px; }
.campo label { display: block; font-size: 13.5px; font-weight: 500; margin-bottom: 6px; color: var(--tinta); }
.campo .req { color: var(--rojo); }
.campo input, .campo select {
  width: 100%; font: inherit; font-size: 15px; padding: 11px 13px;
  border: 1.5px solid var(--linea-fuerte); border-radius: 6px; background: var(--superficie); color: var(--tinta);
}
.campo input:focus, .campo select:focus { outline: 2.5px solid var(--anillo); outline-offset: 1px; border-color: var(--anillo); }
.campo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 480px) { .campo-grid { grid-template-columns: 1fr; } }
.campo-nota { font-size: 12.5px; color: var(--tinta-suave); margin-top: 4px; }

/* ============ RESULTADO ============ */
.resultado-cabecera { text-align: left; }
.tier-pill {
  display: inline-flex; align-items: center; gap: 7px; padding: 6px 13px;
  border-radius: 100px; font-size: 12.5px; font-weight: 500; letter-spacing: .02em;
}
.tier-pill .punto { width: 7px; height: 7px; border-radius: 50%; }
.tier-rojo { background: var(--rojo-suave); color: var(--rojo); }
.tier-rojo .punto { background: var(--rojo); }
.tier-ambar { background: var(--ambar-suave); color: var(--ambar); }
.tier-ambar .punto { background: var(--ambar); }
.tier-verde { background: var(--verde-suave); color: var(--verde-texto); }
.tier-verde .punto { background: var(--verde-texto); }

.resultado-titular { font-size: clamp(24px,4vw,30px); margin-top: 14px; }
.resultado-cuerpo { margin-top: 10px; color: var(--tinta-suave); max-width: 56ch; }

.marcador {
  display: flex; align-items: baseline; gap: 8px; margin-top: 22px;
  font-family: var(--font-display); font-weight: 700; font-variant-numeric: tabular-nums;
}
.marcador .num { font-size: 44px; color: var(--tinta); }
.marcador .max { font-size: 20px; color: var(--tinta-suave); font-weight: 500; }

.barras { margin-top: 26px; display: flex; flex-direction: column; gap: 16px; }
.barra-fila { }
.barra-cabecera { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; gap: 12px; }
.barra-nombre { font-size: 14.5px; font-weight: 500; }
.barra-valor { font-size: 13px; color: var(--tinta-suave); font-variant-numeric: tabular-nums; flex: none; }
.barra-pista { height: 8px; background: var(--linea); border-radius: 4px; overflow: hidden; }
.barra-relleno { height: 100%; border-radius: 4px; width: 0; transition: width .8s var(--ease); }
.barra-relleno.b-rojo { background: var(--rojo); }
.barra-relleno.b-ambar { background: var(--ambar); }
.barra-relleno.b-verde { background: var(--verde); }
.barra-video {
  display: flex; align-items: center; gap: 8px; margin-top: 7px;
  font-size: 13px; color: var(--tinta-suave);
}
.barra-video .icono-play {
  width: 16px; height: 16px; border-radius: 50%; background: var(--azul-suave); color: var(--azul);
  display: grid; place-items: center; flex: none; font-size: 8px;
}
.barra-video b { color: var(--tinta); font-weight: 500; }

.cta-plataforma {
  margin-top: 30px; padding: 20px; border-radius: 8px;
  background: var(--verde-suave); border: 1px solid var(--linea);
}
.cta-plataforma h3 { font-size: 16.5px; }
.cta-plataforma p { margin-top: 6px; font-size: 14px; color: var(--tinta-suave); }
.cta-plataforma .btn-primario { margin-top: 14px; text-decoration: none; }

.cta-informe {
  margin-top: 16px; padding: 20px; border-radius: 8px;
  background: var(--azul-suave); border: 1px solid var(--linea);
}
.cta-informe h3 { font-size: 16.5px; }
.cta-informe p { margin-top: 6px; font-size: 14px; color: var(--tinta-suave); }
.cta-form { display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap; }
.cta-form input {
  flex: 1; min-width: 180px; font: inherit; font-size: 14.5px; padding: 11px 13px;
  border: 1.5px solid var(--linea-fuerte); border-radius: 6px; background: var(--superficie); color: var(--tinta);
}
.cta-form input:focus { outline: 2.5px solid var(--anillo); outline-offset: 1px; }
.confirmacion { display: flex; align-items: center; gap: 10px; font-size: 14.5px; color: var(--verde-texto); font-weight: 500; }

.pie-nota {
  margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--linea);
  font-size: 12px; color: var(--tinta-suave); text-align: center;
}

/* ============ TRANSICIONES DE PANTALLA ============ */
.pantalla { animation: entra var(--dur) var(--ease); }
@keyframes entra { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.oculto { display: none !important; }

.reset-flotante {
  position: fixed; bottom: 16px; right: 16px; font-size: 12px; color: var(--tinta-suave);
  background: var(--superficie); border: 1px solid var(--linea); border-radius: 100px;
  padding: 7px 13px; cursor: pointer;
}
.reset-flotante:hover { color: var(--tinta); border-color: var(--linea-fuerte); }

/* ============ LOGOS INSTITUCIONALES ============ */
.marca-cabecera {
  position: fixed; top: 14px; right: 14px; z-index: 20;
  background: #fff; border-radius: 8px; padding: 6px 10px;
  box-shadow: var(--sombra); border: 1px solid var(--linea);
  display: flex; align-items: center;
}
.marca-cabecera img { display: block; height: 22px; width: auto; }

.pie-financiacion {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  max-width: 420px; margin: 0 auto; padding: 4px 16px 28px;
}
.pie-financiacion img {
  display: block; width: 100%; height: auto;
  background: #fff; border-radius: 6px; padding: 7px 12px;
  border: 1px solid var(--linea);
}
</style>

<div class="marca-cabecera"><img src="__LOGO_OAP__" alt="Oficina Acelera Pyme &middot; COIIAS"></div>

<div class="envoltorio">
  <div class="tarjeta" id="tarjeta"></div>
</div>

<div class="pie-financiacion">
  <img src="__LOGO_FEDER__" alt="FEDER &middot; Fondo Europeo de Desarrollo Regional">
  <img src="__LOGO_COFINANCIACION__" alt="Cofinanciado por la Uni&oacute;n Europea &middot; Ministerio de Hacienda &middot; Fondos Europeos &middot; red.es">
</div>

<button class="reset-flotante" id="btnReset" title="Reiniciar el prototipo">&#8635; Reiniciar</button>

<script>
/* ============================================================
   DATOS DEL CUESTIONARIO (derivado de data/cuestionario.json)
   ============================================================ */
var META = __META_JS__;
var PLATAFORMA = __PLATAFORMA_JS__;
var CTA = __CTA_JS__;
var DIMENSIONES = __DIMENSIONES_JS__;

/* Metadatos (titulo/duracion/nivel) de los videos que aparecen en al menos
   una recomendacion del cuestionario, para poder pintar las tarjetas de
   resultado sin tener que embeber el catalogo completo de 197 videos. */
var VIDEOS = __VIDEOS_JS__;

var TIERS = [
  { id: "rojo", label: "Empezando", min: 0, max: 39,
    titular: "Tu empresa est&aacute; empezando su digitalizaci&oacute;n.",
    cuerpo: "Es el punto de partida de la mayor&iacute;a de pymes: hay margen de mejora en casi todas las &aacute;reas, y eso tambi&eacute;n significa que cualquier paso que des va a notarse mucho. Lo prioritario es elegir dos o tres focos concretos, no abordarlo todo a la vez." },
  { id: "ambar", label: "En camino", min: 40, max: 74,
    titular: "Tu empresa est&aacute; en camino.",
    cuerpo: "Ya tienes bases digitales, pero hay huecos concretos que est&aacute;n limitando el resultado. Las barras de abajo te muestran exactamente d&oacute;nde. Cerrar dos o tres de esos huecos puede tener un impacto grande." },
  { id: "verde", label: "Bien encaminada", min: 75, max: 100,
    titular: "Tu empresa est&aacute; bien encaminada en su digitalizaci&oacute;n.",
    cuerpo: "Tienes un nivel de madurez digital por encima de la media de las pymes asturianas. Toca ya no tanto sentar bases como optimizar, integrar y escalar lo que ya funciona." }
];

function idsRecomendadosDimension(dim) {
  var ids = [];
  function agregar(id) { if (ids.indexOf(id) === -1) ids.push(id); }

  /* Recomendaciones condicionadas al sector, al margen de la respuesta dada
     (ver cuestionario.json > dimensiones > d5 > recomendacion_sector). */
  var extra = dim.recomendacion_sector;
  if (extra && extra.sectores.indexOf(state.perfil.sector) !== -1) {
    extra.ids.forEach(agregar);
  }
  dim.preguntas.forEach(function (p) {
    var v = state.respuestas[p.id];
    if (v === "no_aplica" || v === undefined) return;
    var lista = (p.recomendaciones && p.recomendaciones[String(v)]) || [];
    lista.forEach(agregar);
  });
  return ids.slice(0, 3);
}

/* ============================================================
   ESTADO
   ============================================================ */
var state = {
  pantalla: "intro",       // intro | perfil | pregunta | resultado
  preguntaIdx: 0,
  perfil: {},
  respuestas: {},          // { qId: valor }
  dimsActivas: []          // se calcula tras el perfil (gate de sector)
};

var tarjeta = document.getElementById("tarjeta");

/* Todas las dimensiones se muestran a todo el mundo, sin excepcion por
   sector: las preguntas que no aplican a una actividad concreta (p. ej.
   Industria 4.0 para un despacho de consultoria) se descartan una a una
   con la opcion "no me aplica", no ocultando la dimension entera. */
function calcularDimensionesActivas() {
  return DIMENSIONES;
}

function maxDePregunta(preg) {
  var vals = preg.opciones.filter(function (o) { return !o.no_aplica; }).map(function (o) { return o.valor; });
  return Math.max.apply(null, vals);
}

function listaPreguntasPlano() {
  var out = [];
  state.dimsActivas.forEach(function (d) {
    d.preguntas.forEach(function (p) { out.push({ dim: d, pregunta: p }); });
  });
  return out;
}

/* ============================================================
   RENDER: INTRO
   ============================================================ */
function renderIntro() {
  var chips = DIMENSIONES.map(function (d) {
    return '<div class="dim-chip">' + d.nombre + '</div>';
  }).join("");

  tarjeta.innerHTML =
    '<div class="pantalla panel">' +
      '<div class="marca" style="padding:0 0 4px;">' +
        '<div class="marca-monograma">OAP</div>' +
        '<div class="marca-texto"><strong>Oficina Acelera Pyme</strong> &middot; COIIAS</div>' +
      '</div>' +
      '<h1 class="intro-titular">' + META.titulo + '</h1>' +
      '<p class="intro-cuerpo">' + META.descripcion + '</p>' +
      '<div class="intro-meta">' +
        '<span><span class="punto"></span> ' + META.duracion_estimada_min + ' minutos aprox.</span>' +
        '<span><span class="punto"></span> Tu puntuaci&oacute;n y recomendaciones al instante</span>' +
        '<span><span class="punto"></span> Datos de uso exclusivo de la OAP COIIAS</span>' +
      '</div>' +
      '<div class="dimensiones-preview">' + chips + '</div>' +
      '<div style="margin-top:26px;">' +
        '<button class="btn-primario" id="btnEmpezar">Empezar el diagn&oacute;stico &rarr;</button>' +
      '</div>' +
    '</div>';

  document.getElementById("btnEmpezar").addEventListener("click", function () {
    state.pantalla = "perfil";
    render();
  });
}

/* ============================================================
   RENDER: PERFIL DE EMPRESA
   ============================================================ */
function renderPerfil() {
  var p = state.perfil;
  tarjeta.innerHTML =
    '<div class="pantalla panel">' +
      '<div class="dimension-eyebrow" style="margin-top:0;">Antes de empezar</div>' +
      '<h2 style="margin-top:8px; font-size:22px;">Cu&eacute;ntanos sobre tu empresa</h2>' +
      '<p style="margin-top:6px; color:var(--tinta-suave); font-size:14.5px;">Solo lo usamos para adaptar las preguntas y las recomendaciones finales.</p>' +

      '<div class="campo-grid">' +
        '<div class="campo"><label>Nombre y apellidos <span class="req">*</span></label>' +
          '<input type="text" id="f_nombre" value="' + esc(p.nombre_contacto) + '" placeholder="Ej. Mar&iacute;a Fern&aacute;ndez"></div>' +
        '<div class="campo"><label>Empresa <span class="req">*</span></label>' +
          '<input type="text" id="f_empresa" value="' + esc(p.empresa) + '" placeholder="Nombre o raz&oacute;n social"></div>' +
      '</div>' +
      '<div class="campo-grid">' +
        '<div class="campo"><label>Email <span class="req">*</span></label>' +
          '<input type="email" id="f_email" value="' + esc(p.email) + '" placeholder="tu@empresa.es"></div>' +
        '<div class="campo"><label>C&oacute;digo postal <span class="req">*</span></label>' +
          '<input type="text" id="f_cp" value="' + esc(p.codigo_postal) + '" placeholder="33004" inputmode="numeric" maxlength="5"></div>' +
      '</div>' +
      '<div class="campo-grid">' +
        '<div class="campo"><label>N&ordm; de trabajadores <span class="req">*</span></label>' +
          '<select id="f_tamano">' +
            opt("autonomo-menos-3", "Aut&oacute;nomo/a o menos de 3", p.tamano_empresa) +
            opt("3-9", "Entre 3 y 9", p.tamano_empresa) +
            opt("10-49", "Entre 10 y 49", p.tamano_empresa) +
            opt("50-249", "Entre 50 y 249", p.tamano_empresa) +
            opt("250-mas", "250 o m&aacute;s", p.tamano_empresa) +
          '</select></div>' +
        '<div class="campo"><label>Sector principal <span class="req">*</span></label>' +
          '<select id="f_sector">' +
            opt("industrial", "Industria / fabricaci&oacute;n", p.sector) +
            opt("construccion", "Construcci&oacute;n / ingenier&iacute;a", p.sector) +
            opt("comercio", "Comercio / retail", p.sector) +
            opt("hosteleria-turismo", "Hosteler&iacute;a / turismo", p.sector) +
            opt("servicios-profesionales", "Servicios profesionales", p.sector) +
            opt("otro", "Otro", p.sector) +
          '</select></div>' +
      '</div>' +
      '<p class="campo-nota">El test es el mismo para todos los sectores; el bloque sobre procesos productivos e Industria 4.0 incluye una opci&oacute;n &laquo;no me aplica&raquo; en cada pregunta para quien no tenga planta u obra.</p>' +

      '<div class="nav-fila">' +
        '<button class="btn-atras" id="btnAtrasPerfil">&larr; Volver</button>' +
        '<button class="btn-primario" id="btnContinuar">Continuar &rarr;</button>' +
      '</div>' +
    '</div>';

  document.getElementById("btnAtrasPerfil").addEventListener("click", function () {
    state.pantalla = "intro"; render();
  });
  document.getElementById("btnContinuar").addEventListener("click", function () {
    var nombre = val("f_nombre"), empresa = val("f_empresa"), email = val("f_email"),
        cp = val("f_cp"), tamano = val("f_tamano"), sector = val("f_sector");
    if (!nombre || !empresa || !email || !cp || !tamano || !sector) {
      flashCamposFaltantes();
      return;
    }
    state.perfil = { nombre_contacto: nombre, empresa: empresa, email: email,
                      codigo_postal: cp, tamano_empresa: tamano, sector: sector };
    state.dimsActivas = calcularDimensionesActivas();
    state.preguntaIdx = 0;
    state.pantalla = "pregunta";
    render();
  });
}

function flashCamposFaltantes() {
  var campos = ["f_nombre","f_empresa","f_email","f_cp","f_tamano","f_sector"];
  campos.forEach(function (id) {
    var el = document.getElementById(id);
    if (el && !el.value) { el.style.borderColor = "var(--rojo)"; }
  });
}

function opt(value, label, current) {
  return '<option value="' + value + '"' + (current === value ? " selected" : "") + '>' + label + '</option>';
}
function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
function esc(v) { return v ? String(v).replace(/"/g, "&quot;") : ""; }

/* ============================================================
   RENDER: PREGUNTA
   ============================================================ */
function renderPregunta() {
  var plano = listaPreguntasPlano();
  var total = plano.length;
  var actual = plano[state.preguntaIdx];
  var dim = actual.dim, preg = actual.pregunta;
  var pct = Math.round(((state.preguntaIdx) / total) * 100);
  var seleccionActual = state.respuestas[preg.id];

  var opciones = preg.opciones.map(function (o, i) {
    var val = o.no_aplica ? "no_aplica" : o.valor;
    var sel = seleccionActual === val ? " seleccionada" : "";
    var extra = o.no_aplica ? " opcion-no-aplica" : "";
    return '<button class="opcion' + sel + extra + '" data-valor="' + val + '">' +
             '<span class="opcion-marca"></span><span>' + o.label + '</span>' +
           '</button>';
  }).join("");

  tarjeta.innerHTML =
    '<div class="progreso-envoltorio">' +
      '<div class="progreso-fila">' +
        '<span>' + dim.nombre + '</span>' +
        '<span class="paso-num">Pregunta ' + (state.preguntaIdx + 1) + ' de ' + total + '</span>' +
      '</div>' +
      '<div class="progreso-pista"><div class="progreso-relleno" style="width:' + pct + '%"></div></div>' +
    '</div>' +
    '<div class="pantalla panel" style="padding-top:6px;">' +
      '<p class="pregunta-texto">' + preg.texto + '</p>' +
      '<div class="opciones">' + opciones + '</div>' +
      '<div class="nav-fila">' +
        '<button class="btn-atras" id="btnAtrasPregunta">&larr; Atr&aacute;s</button>' +
        '<span></span>' +
      '</div>' +
    '</div>';

  document.getElementById("btnAtrasPregunta").addEventListener("click", function () {
    if (state.preguntaIdx === 0) { state.pantalla = "perfil"; }
    else { state.preguntaIdx -= 1; }
    render();
  });

  Array.prototype.forEach.call(document.querySelectorAll(".opcion"), function (btn) {
    btn.addEventListener("click", function () {
      var raw = btn.getAttribute("data-valor");
      var valor = raw === "no_aplica" ? "no_aplica" : parseInt(raw, 10);
      state.respuestas[preg.id] = valor;
      setTimeout(function () {
        if (state.preguntaIdx < total - 1) {
          state.preguntaIdx += 1;
        } else {
          state.pantalla = "resultado";
        }
        render();
      }, 220);
      render(); // feedback visual inmediato de seleccion antes del avance
    });
  });
}

/* ============================================================
   CALCULO DE RESULTADO
   ============================================================ */
function calcularResultado() {
  var filas = [];
  state.dimsActivas.forEach(function (d) {
    var score = 0, maxAplicable = 0;
    d.preguntas.forEach(function (p) {
      var v = state.respuestas[p.id];
      if (v === "no_aplica") return; // no suma ni cuenta en el maximo
      maxAplicable += maxDePregunta(p);
      if (typeof v === "number") score += v;
    });
    if (maxAplicable === 0) return; // todas las preguntas de la dimension no aplican: no se muestra
    var pct = Math.round((score / maxAplicable) * 100);
    filas.push({ dim: d, score: score, max: maxAplicable, pct: pct });
  });

  var scoreTotal = filas.reduce(function (a, f) { return a + f.score; }, 0);
  var maxTotal = filas.reduce((a, f) => a + f.max, 0);
  var pctGlobal = Math.round((scoreTotal / maxTotal) * 100);
  var tier = TIERS.find(function (t) { return pctGlobal >= t.min && pctGlobal <= t.max; }) || TIERS[0];

  filas.sort(function (a, b) { return a.pct - b.pct; }); // mas debil primero

  return { filas: filas, scoreTotal: scoreTotal, maxTotal: maxTotal, pctGlobal: pctGlobal, tier: tier };
}

function claseBarra(pct) {
  if (pct < 40) return "b-rojo";
  if (pct < 75) return "b-ambar";
  return "b-verde";
}

/* ============================================================
   RENDER: RESULTADO
   ============================================================ */
function renderResultado() {
  var r = calcularResultado();

  var barras = r.filas.map(function (f) {
    var ids = idsRecomendadosDimension(f.dim);
    var videosHtml = ids.map(function (id) {
      var v = VIDEOS[id];
      if (!v) return "";
      return '<div class="barra-video"><span class="icono-play">&#9654;</span><span><b>&laquo;' + v.titulo + '&raquo;</b> &middot; ' + v.duracion + ' min &middot; nivel ' + v.nivel + '</span></div>';
    }).join("");
    return (
      '<div class="barra-fila">' +
        '<div class="barra-cabecera">' +
          '<span class="barra-nombre">' + f.dim.nombre + '</span>' +
          '<span class="barra-valor">' + f.score + ' / ' + f.max + '</span>' +
        '</div>' +
        '<div class="barra-pista"><div class="barra-relleno ' + claseBarra(f.pct) + '" data-target="' + f.pct + '"></div></div>' +
        videosHtml
      + '</div>'
    );
  }).join("");

  tarjeta.innerHTML =
    '<div class="pantalla panel">' +
      '<div class="resultado-cabecera">' +
        '<span class="tier-pill tier-' + r.tier.id + '"><span class="punto"></span>' + r.tier.label + '</span>' +
        '<h2 class="resultado-titular">' + r.tier.titular + '</h2>' +
        '<p class="resultado-cuerpo">' + r.tier.cuerpo + '</p>' +
        '<div class="marcador"><span class="num" id="numAnimado">0</span><span class="max">/ 100</span></div>' +
      '</div>' +

      '<div class="barras">' + barras + '</div>' +

      '<div class="cta-plataforma">' +
        '<h3>Accede a estos v&iacute;deos</h3>' +
        '<p>' + CTA.texto_recomendaciones + '</p>' +
        '<a class="btn-primario" href="' + PLATAFORMA.url + '" target="_blank" rel="noopener">' + CTA.boton_plataforma + ' &rarr;</a>' +
      '</div>' +

      '<div class="cta-informe">' +
        '<h3>&iquest;Quieres el informe en tu email?</h3>' +
        '<p>' + CTA.texto_informe + '</p>' +
        '<div id="ctaZona">' +
          '<form class="cta-form" id="ctaForm">' +
            '<input type="email" id="ctaEmail" placeholder="tu@empresa.es" value="' + esc(state.perfil.email) + '" required>' +
            '<button class="btn-primario" type="submit">' + CTA.boton_informe + '</button>' +
          '</form>' +
        '</div>' +
      '</div>' +

      '<p class="pie-nota">Oficina Acelera Pyme del COIIAS &middot; Financiado por Red.es y la Uni&oacute;n Europea &ndash; NextGenerationEU</p>' +
    '</div>';

  // animar barras
  requestAnimationFrame(function () {
    Array.prototype.forEach.call(document.querySelectorAll(".barra-relleno"), function (el) {
      el.style.width = el.getAttribute("data-target") + "%";
    });
  });

  // animar marcador numerico
  animarNumero(document.getElementById("numAnimado"), r.pctGlobal);

  document.getElementById("ctaForm").addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("ctaZona").innerHTML =
      '<div class="confirmacion">&#10003; Gracias, ' + (state.perfil.nombre_contacto.split(" ")[0] || "") + '. Te escribiremos en breve a ' + esc(document.getElementById("ctaEmail").value) + '.</div>';
  });
}

function animarNumero(el, destino) {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { el.textContent = destino; return; }
  var inicio = null, duracion = 700;
  function paso(ts) {
    if (!inicio) inicio = ts;
    var p = Math.min(1, (ts - inicio) / duracion);
    var facil = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(facil * destino);
    if (p < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}

/* ============================================================
   ROUTER
   ============================================================ */
function render() {
  if (state.pantalla === "intro") renderIntro();
  else if (state.pantalla === "perfil") renderPerfil();
  else if (state.pantalla === "pregunta") renderPregunta();
  else if (state.pantalla === "resultado") renderResultado();
}

document.getElementById("btnReset").addEventListener("click", function () {
  state = { pantalla: "intro", preguntaIdx: 0, perfil: {}, respuestas: {}, dimsActivas: [] };
  render();
});

render();
</script>
"""


def dim_to_js(dims):
    """Convierte la estructura de dimensiones a un literal JS embebible."""
    import json as _json

    trimmed = []
    for d in dims:
        trimmed.append(
            {
                "id": d["id"],
                "nombre": d["nombre"],
                "max_puntos": d["max_puntos"],
                "recomendacion_sector": d.get("recomendacion_sector"),
                "preguntas": [
                    {
                        "id": p["id"],
                        "texto": p["texto"],
                        "opciones": p["opciones"],
                        "recomendaciones": p.get("recomendaciones", {}),
                    }
                    for p in d["preguntas"]
                ],
            }
        )
    return _json.dumps(trimmed, ensure_ascii=False)


def videos_lookup_js(dims, videos_doc):
    """Extrae, solo para los ids realmente recomendados en el cuestionario,
    los metadatos minimos (titulo/duracion/nivel) que necesita el prototipo
    para mostrar la tarjeta de cada video recomendado."""
    import json as _json

    ids = set()
    for d in dims:
        if d.get("recomendacion_sector"):
            ids.update(d["recomendacion_sector"].get("ids", []))
        for p in d["preguntas"]:
            for lista in p.get("recomendaciones", {}).values():
                ids.update(lista)

    por_id = {v["id"]: v for v in videos_doc["videos"]}
    lookup = {}
    for vid in ids:
        v = por_id.get(vid)
        if not v:
            continue
        lookup[vid] = {
            "titulo": v["titulo"],
            "duracion": v["duracion_seg"] // 60,
            "nivel": v.get("nivel") or "",
        }
    return _json.dumps(lookup, ensure_ascii=False)


def main():
    import json

    cuestionario = json.loads((ROOT / "data" / "cuestionario.json").read_text(encoding="utf-8"))
    videos_doc = json.loads((ROOT / "data" / "videos.json").read_text(encoding="utf-8"))
    dims_js = dim_to_js(cuestionario["dimensiones"])
    videos_js = videos_lookup_js(cuestionario["dimensiones"], videos_doc)
    meta_js = json.dumps(cuestionario["meta"], ensure_ascii=False)
    plataforma_js = json.dumps(cuestionario["plataforma_contenidos"], ensure_ascii=False)
    cta_js = json.dumps(cuestionario["cta_resultado"], ensure_ascii=False)

    html = (
        HTML_TEMPLATE.replace("__FONT_CSS__", FONT_CSS)
        .replace("__DIMENSIONES_JS__", dims_js)
        .replace("__VIDEOS_JS__", videos_js)
        .replace("__META_JS__", meta_js)
        .replace("__PLATAFORMA_JS__", plataforma_js)
        .replace("__CTA_JS__", cta_js)
        .replace("__LOGO_OAP__", LOGO_OAP_URI)
        .replace("__LOGO_FEDER__", LOGO_FEDER_URI)
        .replace("__LOGO_COFINANCIACION__", LOGO_COFINANCIACION_URI)
    )
    out = ROOT / "docs" / "prototipo-cuestionario.html"
    out.write_text(html, encoding="utf-8")
    print(f"Generado {out} ({out.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()

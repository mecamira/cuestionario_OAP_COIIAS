// Port fiel de la logica de docs/prototipo-cuestionario.html (funciones
// maxDePregunta, idsRecomendadosDimension, calcularResultado). No reinventar
// esta logica en otro sitio: si cambia el criterio de puntuacion o de
// recomendacion, se cambia aqui.
//
// Invariante que ya garantiza scripts/validate_cuestionario.py en tiempo de
// autoria: ningun id en `recomendaciones` es una pildora ni un video
// sustituido salvo que no exista alternativa vigente. Este modulo no
// necesita re-filtrar esos casos en tiempo real.

import type { Dimension, Pregunta, TierGlobal } from "../types/cuestionario";
import type { RespuestaValor } from "../types/respuesta";
import { cuestionario } from "./cuestionario";

export type MapaRespuestas = Record<string, RespuestaValor>;

export interface FilaResultado {
  dimension: Dimension;
  score: number;
  max: number;
  pct: number;
}

export interface ResultadoCalculo {
  filas: FilaResultado[];
  scoreTotal: number;
  maxTotal: number;
  pctGlobal: number;
  tier: TierGlobal;
}

/** Maximo posible de una pregunta: el mayor valor numerico entre sus
 * opciones que no sean "no me aplica". */
export function maxDePregunta(pregunta: Pregunta): number {
  const valores = pregunta.opciones
    .filter((o) => !o.no_aplica)
    .map((o) => o.valor)
    .filter((v): v is number => typeof v === "number");
  return Math.max(...valores);
}

/** Todas las dimensiones se muestran a todo el mundo, sin excepcion por
 * sector: las preguntas que no aplican a una actividad concreta (p. ej.
 * Industria 4.0 para un despacho de consultoria) se descartan una a una
 * con la opcion "no me aplica", no ocultando la dimension entera. */
export function dimensionesActivas(): Dimension[] {
  return cuestionario.dimensiones;
}

export function calcularResultado(respuestas: MapaRespuestas): ResultadoCalculo {
  const filas: FilaResultado[] = [];

  for (const dim of dimensionesActivas()) {
    let score = 0;
    let maxAplicable = 0;
    for (const pregunta of dim.preguntas) {
      const v = respuestas[pregunta.id];
      if (v === "no_aplica") continue; // no suma ni cuenta en el maximo
      maxAplicable += maxDePregunta(pregunta);
      if (typeof v === "number") score += v;
    }
    if (maxAplicable === 0) continue; // todas las preguntas de la dimension no aplican: no se muestra
    const pct = Math.round((score / maxAplicable) * 100);
    filas.push({ dimension: dim, score, max: maxAplicable, pct });
  }

  const scoreTotal = filas.reduce((a, f) => a + f.score, 0);
  const maxTotal = filas.reduce((a, f) => a + f.max, 0);
  const pctGlobal = maxTotal > 0 ? Math.round((scoreTotal / maxTotal) * 100) : 0;

  const tiers = cuestionario.resultado.tiers_globales;
  const tier =
    tiers.find((t) => pctGlobal >= t.min_pct && pctGlobal <= t.max_pct) ?? tiers[0];

  filas.sort((a, b) => a.pct - b.pct); // mas debil primero

  return { filas, scoreTotal, maxTotal, pctGlobal, tier };
}

/** Ids de video recomendados para una dimension, dadas las respuestas
 * actuales y el sector de la empresa (para la recomendacion_sector de d5).
 * Devuelve como maximo `maxIds` (3 en el resultado del test, mas en el
 * informe/PDF que es un documento de trabajo mas completo). */
export function idsRecomendadosDimension(
  dim: Dimension,
  perfilSector: string,
  respuestas: MapaRespuestas,
  maxIds = 3,
): string[] {
  const ids: string[] = [];
  const agregar = (id: string) => {
    if (!ids.includes(id)) ids.push(id);
  };

  const extra = dim.recomendacion_sector;
  if (extra && extra.sectores.includes(perfilSector)) {
    extra.ids.forEach(agregar);
  }

  for (const pregunta of dim.preguntas) {
    const v = respuestas[pregunta.id];
    if (v === "no_aplica" || v === undefined) continue;
    const lista = pregunta.recomendaciones?.[String(v)] ?? [];
    lista.forEach(agregar);
  }

  return maxIds > 0 ? ids.slice(0, maxIds) : ids;
}

export function claseBarra(pct: number): "b-rojo" | "b-ambar" | "b-verde" {
  if (pct < 40) return "b-rojo";
  if (pct < 75) return "b-ambar";
  return "b-verde";
}

export function listaPreguntasPlano(): { dimension: Dimension; pregunta: Pregunta }[] {
  const out: { dimension: Dimension; pregunta: Pregunta }[] = [];
  for (const dim of dimensionesActivas()) {
    for (const pregunta of dim.preguntas) {
      out.push({ dimension: dim, pregunta });
    }
  }
  return out;
}

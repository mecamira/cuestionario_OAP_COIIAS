import data from "../../../data/cuestionario.json";
import type { Cuestionario } from "../types/cuestionario";

// data/cuestionario.json es la unica fuente de verdad (ver scripts/validate_cuestionario.py).
// Esta app solo lo importa y lo tipa, nunca lo duplica a mano.
export const cuestionario = data as unknown as Cuestionario;

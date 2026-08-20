import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";
import { db } from "./firebase";
import { informeEstadoInicial } from "../types/respuesta";
import type {
  InformeEstado,
  PerfilEmpresa,
  Respuesta,
  RespuestaDoc,
  RespuestaValor,
  ResultadoCalculado,
} from "../types/respuesta";

const COLECCION = "respuestas";

/** Guarda una respuesta completa del cuestionario publico. Si Firebase no
 * esta configurado (sin app/.env), avisa por consola y no hace nada — el
 * cuestionario sigue siendo usable localmente sin backend. */
export async function submitRespuesta(
  perfil: PerfilEmpresa,
  respuestas: Record<string, RespuestaValor>,
  resultado: ResultadoCalculado,
): Promise<string | null> {
  if (!db) {
    console.warn("[firestore] Sin Firebase configurado: la respuesta no se ha guardado.");
    return null;
  }
  const docData: RespuestaDoc = {
    perfil,
    respuestas,
    resultado,
    informe: informeEstadoInicial(),
    meta: {
      creado_en: serverTimestamp(),
      actualizado_en: serverTimestamp(),
      origen: "web-publica",
    },
  };
  const ref = await addDoc(collection(db, COLECCION), docData);
  return ref.id;
}

/** Suscripcion en tiempo real a todas las respuestas, mas recientes primero.
 * Pensada para el dashboard (requiere sesion, ver firestore.rules).
 * Devuelve una funcion para cancelar la suscripcion. */
export function suscribirRespuestas(onChange: (respuestas: Respuesta[]) => void): () => void {
  if (!db) return () => {};
  const q = query(collection(db, COLECCION), orderBy("meta.creado_en", "desc"));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...(d.data() as RespuestaDoc) })));
  });
}

/** Suscripcion en tiempo real a una respuesta concreta por id. Llama a
 * `onChange(null)` si el documento no existe (o al cancelar sin dato). */
export function suscribirRespuesta(
  id: string,
  onChange: (respuesta: Respuesta | null) => void,
): Unsubscribe {
  if (!db) {
    onChange(null);
    return () => {};
  }
  return onSnapshot(doc(db, COLECCION, id), (snap) => {
    onChange(snap.exists() ? ({ id: snap.id, ...(snap.data() as RespuestaDoc) } as Respuesta) : null);
  });
}

/** Actualiza el estado del informe (generado/enviado/respondido/notas) de
 * una respuesta concreta. Solo los campos pasados en `patch` se tocan. */
export async function actualizarInforme(id: string, patch: Partial<InformeEstado>): Promise<void> {
  if (!db) return;
  const updates: Record<string, unknown> = { "meta.actualizado_en": serverTimestamp() };
  for (const [k, v] of Object.entries(patch)) {
    updates[`informe.${k}`] = v;
  }
  await updateDoc(doc(db, COLECCION, id), updates);
}

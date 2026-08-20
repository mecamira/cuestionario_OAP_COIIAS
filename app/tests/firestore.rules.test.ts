// Tests de firestore.rules contra el emulador local (Firestore en 127.0.0.1:8080).
// Requiere `firebase emulators:start --only firestore,auth --project demo-oap-coiias`
// corriendo en paralelo. Ver README para instrucciones.
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { setLogLevel } from "firebase/firestore";

const PROJECT_ID = "demo-oap-coiias";

function respuestaValida(overrides: Record<string, unknown> = {}) {
  return {
    perfil: {
      nombre_contacto: "Marta Suárez",
      empresa: "Taller Suárez SL",
      email: "marta@tallersuarez.es",
      telefono: null,
      codigo_postal: "33012",
      tamano_empresa: "autonomo-menos-3",
      sector: "industrial",
      rol_contacto: null,
    },
    respuestas: { q1: 2, q9: "no_aplica" },
    resultado: { version_cuestionario: "3.2", pct_global: 50, tier: "ambar", dimensiones: [] },
    informe: {
      generado: false,
      fecha_generado: null,
      enviado: false,
      fecha_envio: null,
      empresa_respondio: false,
      fecha_respuesta_empresa: null,
      notas: "",
    },
    meta: { creado_en: new Date(), actualizado_en: new Date(), origen: "web-publica" },
    ...overrides,
  };
}

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  setLogLevel("error");
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync("../firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

describe("firestore.rules > respuestas", () => {
  test("crear sin autenticar con datos validos: permitido", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(
      db.collection("respuestas").add({
        ...respuestaValida(),
        meta: { ...respuestaValida().meta, creado_en: (await import("firebase/firestore")).serverTimestamp() },
      }),
    );
  });

  test("crear sin campos obligatorios: denegado", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const { perfil: _perfil, ...sinPerfil } = respuestaValida();
    void _perfil;
    await assertFails(db.collection("respuestas").add(sinPerfil));
  });

  test("crear con email invalido: denegado", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const data = respuestaValida();
    data.perfil = { ...data.perfil, email: "no-es-un-email" };
    await assertFails(db.collection("respuestas").add(data));
  });

  test("crear con sector fuera de la lista permitida: denegado", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const data = respuestaValida();
    data.perfil = { ...data.perfil, sector: "otro-sector-inventado" };
    await assertFails(db.collection("respuestas").add(data));
  });

  test("crear con informe.generado = true (intento de falsear estado): denegado", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const data = respuestaValida();
    data.informe = { ...data.informe, generado: true };
    await assertFails(db.collection("respuestas").add(data));
  });

  test("crear con fecha falseada (no serverTimestamp): denegado", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.collection("respuestas").add(respuestaValida()));
  });

  test("leer sin autenticar: denegado", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().collection("respuestas").doc("r1").set(respuestaValida());
    });
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.collection("respuestas").doc("r1").get());
  });

  test("leer autenticado (cualquier cuenta): permitido", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().collection("respuestas").doc("r2").set(respuestaValida());
    });
    const db = testEnv.authenticatedContext("equipo-coiias-uid").firestore();
    await assertSucceeds(db.collection("respuestas").doc("r2").get());
  });

  test("actualizar autenticado (marcar informe enviado): permitido", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().collection("respuestas").doc("r3").set(respuestaValida());
    });
    const db = testEnv.authenticatedContext("equipo-coiias-uid").firestore();
    await assertSucceeds(
      db.collection("respuestas").doc("r3").update({ "informe.enviado": true }),
    );
  });

  test("borrar autenticado: denegado (nunca se borra desde la app)", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().collection("respuestas").doc("r4").set(respuestaValida());
    });
    const db = testEnv.authenticatedContext("equipo-coiias-uid").firestore();
    await assertFails(db.collection("respuestas").doc("r4").delete());
  });
});

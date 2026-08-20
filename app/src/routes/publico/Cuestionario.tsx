import { useState } from "react";
import { MarcaCabecera } from "../../components/MarcaCabecera";
import { PieFinanciacion } from "../../components/PieFinanciacion";
import { IntroScreen } from "./IntroScreen";
import { PerfilForm, type PerfilValores } from "./PerfilForm";
import { PreguntaScreen } from "./PreguntaScreen";
import { ResultadoScreen } from "./ResultadoScreen";
import { listaPreguntasPlano } from "../../lib/scoring";
import type { MapaRespuestas } from "../../lib/scoring";
import type { RespuestaValor } from "../../types/respuesta";
import type { PerfilEmpresa } from "../../types/respuesta";
import { firebaseConfigurado } from "../../lib/firebase";

type Pantalla = "intro" | "perfil" | "pregunta" | "resultado";

function perfilValoresAPerfilEmpresa(v: PerfilValores): PerfilEmpresa {
  return {
    nombre_contacto: v.nombre_contacto ?? "",
    empresa: v.empresa ?? "",
    email: v.email ?? "",
    telefono: v.telefono?.trim() ? v.telefono : null,
    codigo_postal: v.codigo_postal ?? "",
    tamano_empresa: v.tamano_empresa ?? "",
    sector: v.sector ?? "",
    rol_contacto: v.rol_contacto?.trim() ? v.rol_contacto : null,
  };
}

export function Cuestionario() {
  const [pantalla, setPantalla] = useState<Pantalla>("intro");
  const [perfilValores, setPerfilValores] = useState<PerfilValores>({});
  const [preguntaIdx, setPreguntaIdx] = useState(0);
  const [respuestas, setRespuestas] = useState<MapaRespuestas>({});

  const plano = listaPreguntasPlano();
  const total = plano.length;

  function seleccionar(valor: RespuestaValor) {
    const actual = plano[preguntaIdx];
    setRespuestas((prev) => ({ ...prev, [actual.pregunta.id]: valor }));
    window.setTimeout(() => {
      if (preguntaIdx < total - 1) {
        setPreguntaIdx((i) => i + 1);
      } else {
        setPantalla("resultado");
      }
    }, 220);
  }

  function atrasEnPregunta() {
    if (preguntaIdx === 0) {
      setPantalla("perfil");
    } else {
      setPreguntaIdx((i) => i - 1);
    }
  }

  return (
    <>
      <MarcaCabecera />
      {!firebaseConfigurado && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 30,
            background: "var(--rojo)",
            color: "#fff",
            textAlign: "center",
            fontSize: 13,
            padding: "6px 10px",
          }}
        >
          Aviso interno: Firebase no está configurado en este despliegue — las respuestas NO se están
          guardando. Revisa las variables VITE_FIREBASE_* en Netlify.
        </div>
      )}
      <div className="envoltorio">
        <div className="tarjeta">
          {pantalla === "intro" && <IntroScreen onEmpezar={() => setPantalla("perfil")} />}

          {pantalla === "perfil" && (
            <PerfilForm
              valores={perfilValores}
              onChange={(id, valor) => setPerfilValores((prev) => ({ ...prev, [id]: valor }))}
              onAtras={() => setPantalla("intro")}
              onContinuar={() => {
                setPreguntaIdx(0);
                setPantalla("pregunta");
              }}
            />
          )}

          {pantalla === "pregunta" && (
            <PreguntaScreen
              dimension={plano[preguntaIdx].dimension}
              pregunta={plano[preguntaIdx].pregunta}
              indice={preguntaIdx}
              total={total}
              seleccionActual={respuestas[plano[preguntaIdx].pregunta.id]}
              onSeleccionar={seleccionar}
              onAtras={atrasEnPregunta}
            />
          )}

          {pantalla === "resultado" && (
            <ResultadoScreen perfil={perfilValoresAPerfilEmpresa(perfilValores)} respuestas={respuestas} />
          )}
        </div>
      </div>
      <PieFinanciacion />
    </>
  );
}

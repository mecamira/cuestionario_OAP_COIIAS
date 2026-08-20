import { useEffect, useState } from "react";
import { cuestionario } from "../../lib/cuestionario";
import { videoPorId } from "../../lib/videos";
import { calcularResultado, claseBarra, idsRecomendadosDimension } from "../../lib/scoring";
import type { MapaRespuestas } from "../../lib/scoring";
import type { PerfilEmpresa } from "../../types/respuesta";

interface Props {
  perfil: PerfilEmpresa;
  respuestas: MapaRespuestas;
  /** true si submitRespuesta se completo antes de llegar aqui, false si fallo,
   * null si no se intento (Firebase no configurado). El guardado en si ya ha
   * ocurrido (o fallado) en Cuestionario.tsx ANTES de montar esta pantalla —
   * aqui solo se informa del resultado, no se reintenta. */
  guardadoOk: boolean | null;
}

export function ResultadoScreen({ perfil, respuestas, guardadoOk }: Props) {
  const resultado = calcularResultado(respuestas);
  const { plataforma_contenidos: plataforma, cta_resultado: cta } = cuestionario;

  const [numeroAnimado, setNumeroAnimado] = useState(0);
  const [email, setEmail] = useState(perfil.email);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // rAF no se ejecuta (o se retrasa mucho) en pestañas en segundo plano: si
    // la pantalla de resultado se monta oculta, no dejar el marcador en 0.
    if (reduce || document.hidden) {
      setNumeroAnimado(resultado.pctGlobal);
      return;
    }
    let inicio: number | null = null;
    const duracion = 700;
    let frame: number;
    function paso(ts: number) {
      if (inicio === null) inicio = ts;
      const p = Math.min(1, (ts - inicio) / duracion);
      const facil = 1 - Math.pow(1 - p, 3);
      setNumeroAnimado(Math.round(facil * resultado.pctGlobal));
      if (p < 1) frame = requestAnimationFrame(paso);
    }
    frame = requestAnimationFrame(paso);
    const respaldo = window.setTimeout(() => setNumeroAnimado(resultado.pctGlobal), duracion + 300);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(respaldo);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultado.pctGlobal]);

  return (
    <div className="pantalla panel">
      {guardadoOk === false && (
        <div
          style={{
            background: "var(--rojo-suave)",
            color: "var(--rojo)",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 13.5,
            marginBottom: 16,
          }}
        >
          No hemos podido guardar tu respuesta automáticamente. Escríbenos a{" "}
          <a href="mailto:otd@coiias.es" style={{ color: "inherit" }}>
            otd@coiias.es
          </a>{" "}
          y te ayudamos.
        </div>
      )}
      <div className="resultado-cabecera">
        <span className={`tier-pill tier-${resultado.tier.id}`}>
          <span className="punto" />
          {resultado.tier.label}
        </span>
        <h2 className="resultado-titular">{resultado.tier.titular}</h2>
        <p className="resultado-cuerpo">{resultado.tier.descripcion}</p>
        <div className="marcador">
          <span className="num">{numeroAnimado}</span>
          <span className="max">/ 100</span>
        </div>
      </div>

      <div className="barras">
        {resultado.filas.map((f) => {
          const ids = idsRecomendadosDimension(f.dimension, perfil.sector, respuestas);
          return (
            <div className="barra-fila" key={f.dimension.id}>
              <div className="barra-cabecera">
                <span className="barra-nombre">{f.dimension.nombre}</span>
                <span className="barra-valor">
                  {f.score} / {f.max}
                </span>
              </div>
              <div className="barra-pista">
                <div
                  className={`barra-relleno ${claseBarra(f.pct)}`}
                  style={{ width: `${f.pct}%` }}
                />
              </div>
              {ids.map((id) => {
                const v = videoPorId(id);
                if (!v) return null;
                return (
                  <div className="barra-video" key={id}>
                    <span className="icono-play">▶</span>
                    <span>
                      «<b>{v.titulo}</b>» · {Math.round(v.duracion_seg / 60)} min · nivel {v.nivel}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="cta-plataforma">
        <h3>Accede a estos vídeos</h3>
        <p>{cta.texto_recomendaciones}</p>
        <a className="btn-primario" href={plataforma.url} target="_blank" rel="noopener noreferrer">
          {cta.boton_plataforma} →
        </a>
      </div>

      <div className="cta-informe">
        <h3>¿Quieres el informe en tu email?</h3>
        <p>{cta.texto_informe}</p>
        {enviado ? (
          <div className="confirmacion">
            ✓ Gracias, {perfil.nombre_contacto.split(" ")[0] || ""}. Te escribiremos en breve a {email}.
          </div>
        ) : (
          <form
            className="cta-form"
            onSubmit={(e) => {
              e.preventDefault();
              setEnviado(true);
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@empresa.es"
              required
            />
            <button className="btn-primario" type="submit">
              {cta.boton_informe}
            </button>
          </form>
        )}
      </div>

      <p className="pie-nota">
        Oficina Acelera Pyme del COIIAS · Financiado por Red.es y la Unión Europea – NextGenerationEU
      </p>
    </div>
  );
}

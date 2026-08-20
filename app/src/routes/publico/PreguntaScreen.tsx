import type { Dimension, Pregunta } from "../../types/cuestionario";
import type { RespuestaValor } from "../../types/respuesta";

interface Props {
  dimension: Dimension;
  pregunta: Pregunta;
  indice: number;
  total: number;
  seleccionActual: RespuestaValor | undefined;
  onSeleccionar: (valor: RespuestaValor) => void;
  onAtras: () => void;
}

export function PreguntaScreen({
  dimension,
  pregunta,
  indice,
  total,
  seleccionActual,
  onSeleccionar,
  onAtras,
}: Props) {
  const pct = Math.round((indice / total) * 100);

  return (
    <>
      <div className="progreso-envoltorio">
        <div className="progreso-fila">
          <span>{dimension.nombre}</span>
          <span className="paso-num">
            Pregunta {indice + 1} de {total}
          </span>
        </div>
        <div className="progreso-pista">
          <div className="progreso-relleno" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="pantalla panel" style={{ paddingTop: 6 }}>
        <p className="pregunta-texto">{pregunta.texto}</p>
        <div className="opciones">
          {pregunta.opciones.map((o, i) => {
            const valor: RespuestaValor = o.no_aplica ? "no_aplica" : (o.valor as number);
            const seleccionada = seleccionActual === valor;
            return (
              <button
                key={i}
                className={
                  "opcion" + (seleccionada ? " seleccionada" : "") + (o.no_aplica ? " opcion-no-aplica" : "")
                }
                onClick={() => onSeleccionar(valor)}
              >
                <span className="opcion-marca" />
                <span>{o.label}</span>
              </button>
            );
          })}
        </div>
        <div className="nav-fila">
          <button className="btn-atras" onClick={onAtras}>
            ← Atrás
          </button>
          <span />
        </div>
      </div>
    </>
  );
}

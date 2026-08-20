import { cuestionario } from "../../lib/cuestionario";

interface Props {
  onEmpezar: () => void;
}

export function IntroScreen({ onEmpezar }: Props) {
  const { meta, dimensiones } = cuestionario;
  return (
    <div className="pantalla panel">
      <div className="marca" style={{ padding: "0 0 4px" }}>
        <div className="marca-monograma">OAP</div>
        <div className="marca-texto">
          <strong>Oficina Acelera Pyme</strong> · COIIAS
        </div>
      </div>
      <h1 className="intro-titular">{meta.titulo}</h1>
      <p className="intro-cuerpo">{meta.descripcion}</p>
      <div className="intro-meta">
        <span>
          <span className="punto" /> {meta.duracion_estimada_min} minutos aprox.
        </span>
        <span>
          <span className="punto" /> Tu puntuación y recomendaciones al instante
        </span>
        <span>
          <span className="punto" /> Datos de uso exclusivo de la OAP COIIAS
        </span>
      </div>
      <div className="dimensiones-preview">
        {dimensiones.map((d) => (
          <div className="dim-chip" key={d.id}>
            {d.nombre}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 26 }}>
        <button className="btn-primario" onClick={onEmpezar}>
          Empezar el diagnóstico →
        </button>
      </div>
    </div>
  );
}

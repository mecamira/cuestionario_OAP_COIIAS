import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { suscribirRespuesta } from "../../lib/firestore";
import { cuestionario } from "../../lib/cuestionario";
import { videoPorId } from "../../lib/videos";
import { idsRecomendadosDimension, claseBarra } from "../../lib/scoring";
import type { Respuesta } from "../../types/respuesta";

function textoSaludoInicial(r: Respuesta): string {
  const nombre = r.perfil.nombre_contacto.split(" ")[0] || r.perfil.nombre_contacto;
  return (
    `Hola ${nombre},\n\n` +
    `Gracias por completar el Test de Madurez Digital de la Oficina Acelera Pyme del COIIAS. ` +
    `A continuación encontrarás un resumen del resultado de ${r.perfil.empresa} y las recomendaciones ` +
    `formativas que, según tus respuestas, consideramos más útiles para vosotros ahora mismo.`
  );
}

function textoCierreInicial(): string {
  return (
    `Quedamos a tu disposición para resolver cualquier duda o ampliar esta información: ` +
    `escríbenos a otd@coiias.es. Puedes acceder a estos vídeos y a todo el catálogo formativo del COIIAS ` +
    `dándote de alta gratis en la Plataforma de Contenidos.`
  );
}

function textoDimensionInicial(nombre: string, pct: number): string {
  if (pct < 40) {
    return `Es una de las áreas con más margen de mejora ahora mismo. Recomendamos empezar por aquí.`;
  }
  if (pct < 75) {
    return `Ya hay una base en "${nombre}", pero cerrar los huecos que quedan puede tener un impacto notable.`;
  }
  return `Buen nivel en "${nombre}". Los siguientes vídeos son para consolidar y dar un paso más.`;
}

/** Bloque de texto editable a mano. El contenido inicial se pinta una vez;
 * los cambios solo se sincronizan a React en el blur (no en cada tecla),
 * para no pelear el cursor con contentEditable. */
function EditableBlock({
  value,
  onSave,
  className = "informe-editable informe-editable-texto",
  as: Tag = "div",
}: {
  value: string;
  onSave: (texto: string) => void;
  className?: string;
  as?: "div" | "h1" | "h2" | "p" | "span";
}) {
  return (
    <Tag
      className={className}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: React.FocusEvent<HTMLElement>) => onSave(e.currentTarget.textContent ?? "")}
    >
      {value}
    </Tag>
  );
}

export function ReportEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [respuesta, setRespuesta] = useState<Respuesta | null | undefined>(undefined);
  const inicializado = useRef(false);
  const [textos, setTextos] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    return suscribirRespuesta(id, (r) => {
      setRespuesta(r);
      if (r && !inicializado.current) {
        inicializado.current = true;
        const tier = cuestionario.resultado.tiers_globales.find((t) => t.id === r.resultado.tier);
        const fecha = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
        const iniciales: Record<string, string> = {
          cabecera_titulo: "Informe de diagnóstico digital",
          cabecera_subtitulo: `${r.perfil.empresa} · ${fecha}`,
          saludo: textoSaludoInicial(r),
          tier_pill: tier?.label ?? "",
          tier_titular: tier?.titular ?? "",
          tier_cuerpo: tier?.descripcion ?? "",
          cierre: textoCierreInicial(),
        };
        for (const fila of r.resultado.dimensiones) {
          const dim = cuestionario.dimensiones.find((d) => d.id === fila.id);
          if (dim) {
            iniciales[`dim_nombre_${fila.id}`] = dim.nombre;
            iniciales[`dim_comentario_${fila.id}`] = textoDimensionInicial(dim.nombre, fila.pct);
          }
        }
        setTextos(iniciales);
      }
    });
  }, [id]);

  if (respuesta === undefined) {
    return <div className="dash-panel dash-vacio">Cargando…</div>;
  }
  if (respuesta === null || !id) {
    return <div className="dash-panel dash-vacio">No se ha encontrado esta respuesta.</div>;
  }

  const r = respuesta;
  const tier = cuestionario.resultado.tiers_globales.find((t) => t.id === r.resultado.tier);

  function guardarTexto(clave: string) {
    return (texto: string) => setTextos((prev) => ({ ...prev, [clave]: texto }));
  }

  function handleExportar() {
    document.title = `Informe - ${r.perfil.empresa}`;
    window.print();
  }

  return (
    <>
      <div className="dash-panel informe-barra-acciones no-imprimir">
        <button className="dash-volver" onClick={() => navigate(`/dashboard/${id}`)}>
          ← Volver a la respuesta
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <p className="campo-nota" style={{ margin: 0, maxWidth: 260, textAlign: "right" }}>
            Antes de guardar: en el diálogo de impresión, abre "Más ajustes" y desactiva "Encabezados y pies de
            página" para que no salga la URL.
          </p>
          <button className="btn-primario" onClick={handleExportar}>
            Exportar a PDF
          </button>
        </div>
      </div>

      <div className="informe-hoja">
        <div className="informe-cabecera">
          <img src="/logo-oap3.png" alt="Oficina Acelera Pyme · COIIAS" />
          <div className="informe-cabecera-texto">
            <EditableBlock
              as="h1"
              value={textos.cabecera_titulo ?? ""}
              onSave={guardarTexto("cabecera_titulo")}
              className="informe-editable informe-editable-titulo"
            />
            <EditableBlock
              as="p"
              value={textos.cabecera_subtitulo ?? ""}
              onSave={guardarTexto("cabecera_subtitulo")}
              className="informe-editable informe-editable-pequeno"
            />
          </div>
        </div>

        <EditableBlock value={textos.saludo ?? ""} onSave={guardarTexto("saludo")} />

        {tier && (
          <div className="informe-resultado-global">
            <span className={`tier-pill tier-${tier.id}`}>
              <span className="punto" />
              <EditableBlock
                as="span"
                value={textos.tier_pill ?? ""}
                onSave={guardarTexto("tier_pill")}
                className="informe-editable-inline"
              />
            </span>
            <div className="informe-marcador">{r.resultado.pct_global}/100</div>
            <EditableBlock
              as="h2"
              value={textos.tier_titular ?? ""}
              onSave={guardarTexto("tier_titular")}
              className="informe-editable informe-editable-titulo"
            />
            <EditableBlock value={textos.tier_cuerpo ?? ""} onSave={guardarTexto("tier_cuerpo")} />
          </div>
        )}

        <h2 className="informe-seccion-titulo">Resultado por área</h2>
        <div className="barras">
          {r.resultado.dimensiones.map((fila) => {
            const dim = cuestionario.dimensiones.find((d) => d.id === fila.id);
            if (!dim) return null;
            const ids = idsRecomendadosDimension(dim, r.perfil.sector, r.respuestas, 4);
            return (
              <div className="barra-fila informe-dimension" key={fila.id}>
                <div className="barra-cabecera">
                  <EditableBlock
                    as="span"
                    value={textos[`dim_nombre_${fila.id}`] ?? dim.nombre}
                    onSave={guardarTexto(`dim_nombre_${fila.id}`)}
                    className="informe-editable-inline barra-nombre"
                  />
                  <span className="barra-valor">
                    {fila.score} / {fila.max}
                  </span>
                </div>
                <div className="barra-pista">
                  <div className={`barra-relleno ${claseBarra(fila.pct)}`} style={{ width: `${fila.pct}%` }} />
                </div>
                <EditableBlock
                  value={textos[`dim_comentario_${fila.id}`] ?? ""}
                  onSave={guardarTexto(`dim_comentario_${fila.id}`)}
                  className="informe-editable informe-editable-pequeno"
                />
                {ids.map((vid) => {
                  const v = videoPorId(vid);
                  if (!v) return null;
                  return (
                    <div className="barra-video" key={vid}>
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

        <EditableBlock value={textos.cierre ?? ""} onSave={guardarTexto("cierre")} />

        <a
          className="btn-primario informe-cta no-imprimir"
          href={cuestionario.plataforma_contenidos.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {cuestionario.plataforma_contenidos.nombre} →
        </a>

        <div className="informe-pie">
          <img src="/logo-feder.png" alt="FEDER · Fondo Europeo de Desarrollo Regional" />
          <img
            src="/logo-cofinanciacion.png"
            alt="Cofinanciado por la Unión Europea · Ministerio de Hacienda · Fondos Europeos · red.es"
          />
        </div>
      </div>
    </>
  );
}

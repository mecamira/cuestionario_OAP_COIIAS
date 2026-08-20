import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import { suscribirRespuesta, actualizarInforme } from "../../lib/firestore";
import { cuestionario } from "../../lib/cuestionario";
import { videoPorId } from "../../lib/videos";
import { idsRecomendadosDimension, claseBarra } from "../../lib/scoring";
import type { Respuesta } from "../../types/respuesta";

function formatoFechaHora(valor: unknown): string {
  if (!valor || typeof valor !== "object" || !("toDate" in valor)) return "—";
  const fecha = (valor as { toDate: () => Date }).toDate();
  return fecha.toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const CAMPOS_PERFIL = cuestionario.perfil_empresa.campos;

function etiquetaOpcion(campoId: string, valor: string): string {
  const campo = CAMPOS_PERFIL.find((c) => c.id === campoId);
  return campo?.opciones?.find((o) => o.value === valor)?.label ?? valor;
}

export function ResponseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [respuesta, setRespuesta] = useState<Respuesta | null | undefined>(undefined);
  const [notas, setNotas] = useState("");

  useEffect(() => {
    if (!id) return;
    return suscribirRespuesta(id, (r) => {
      setRespuesta(r);
      if (r) setNotas(r.informe.notas);
    });
  }, [id]);

  if (respuesta === undefined) {
    return <div className="dash-panel dash-vacio">Cargando…</div>;
  }
  if (respuesta === null || !id) {
    return <div className="dash-panel dash-vacio">No se ha encontrado esta respuesta.</div>;
  }

  const r = respuesta;
  const idSeguro: string = id;

  async function toggle(campo: "generado" | "enviado" | "empresa_respondio") {
    const yaActivo = r.informe[campo];
    const fechaCampo = ({ generado: "fecha_generado", enviado: "fecha_envio", empresa_respondio: "fecha_respuesta_empresa" } as const)[campo];
    await actualizarInforme(idSeguro, {
      [campo]: !yaActivo,
      [fechaCampo]: !yaActivo ? serverTimestamp() : null,
    } as Parameters<typeof actualizarInforme>[1]);
  }

  return (
    <div className="dash-panel">
      <div className="dash-detalle-cabecera">
        <div>
          <button className="dash-volver" onClick={() => navigate("/dashboard")}>
            ← Volver al listado
          </button>
          <h2 style={{ marginTop: 10 }}>{r.perfil.empresa}</h2>
          <div className="dash-detalle-meta">
            <span>{r.perfil.nombre_contacto}</span>
            <span>{r.perfil.email}</span>
            <span>Enviado el {formatoFechaHora(r.meta.creado_en)}</span>
          </div>
        </div>
        <Link className="btn-primario" to={`/dashboard/${id}/informe`}>
          Ver / editar informe
        </Link>
      </div>

      <div className="dash-detalle-cuerpo">
        <div className="dash-seccion">
          <h3>Perfil de la empresa</h3>
          <div className="dash-perfil-grid">
            <div className="dash-perfil-item">
              <div className="label">Teléfono</div>
              <div className="valor">{r.perfil.telefono ?? "—"}</div>
            </div>
            <div className="dash-perfil-item">
              <div className="label">Código postal</div>
              <div className="valor">{r.perfil.codigo_postal}</div>
            </div>
            <div className="dash-perfil-item">
              <div className="label">Tamaño</div>
              <div className="valor">{etiquetaOpcion("tamano_empresa", r.perfil.tamano_empresa)}</div>
            </div>
            <div className="dash-perfil-item">
              <div className="label">Sector</div>
              <div className="valor">{etiquetaOpcion("sector", r.perfil.sector)}</div>
            </div>
            <div className="dash-perfil-item">
              <div className="label">Rol</div>
              <div className="valor">{r.perfil.rol_contacto ? etiquetaOpcion("rol_contacto", r.perfil.rol_contacto) : "—"}</div>
            </div>
          </div>
        </div>

        <div className="dash-seccion">
          <h3>
            Resultado: {r.resultado.pct_global}/100 ·{" "}
            <span className={`tier-pill tier-${r.resultado.tier}`}>
              <span className="punto" />
              {r.resultado.tier}
            </span>
          </h3>
          <div className="barras" style={{ marginTop: 16 }}>
            {r.resultado.dimensiones.map((fila) => {
              const dim = cuestionario.dimensiones.find((d) => d.id === fila.id);
              if (!dim) return null;
              const ids = idsRecomendadosDimension(dim, r.perfil.sector, r.respuestas, 5);
              return (
                <div className="barra-fila" key={fila.id}>
                  <div className="barra-cabecera">
                    <span className="barra-nombre">{dim.nombre}</span>
                    <span className="barra-valor">
                      {fila.score} / {fila.max}
                    </span>
                  </div>
                  <div className="barra-pista">
                    <div className={`barra-relleno ${claseBarra(fila.pct)}`} style={{ width: `${fila.pct}%` }} />
                  </div>
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
        </div>

        <div className="dash-seccion">
          <h3>Ciclo del informe</h3>
          <div className="dash-informe-controles">
            <div className="dash-toggle-fila">
              <div className="dash-toggle-texto">
                Informe generado
                {Boolean(r.informe.fecha_generado) && (
                  <span className="fecha">{formatoFechaHora(r.informe.fecha_generado)}</span>
                )}
              </div>
              <button
                className={`dash-switch ${r.informe.generado ? "on" : ""}`}
                onClick={() => toggle("generado")}
                aria-pressed={r.informe.generado}
                aria-label="Marcar informe generado"
              />
            </div>
            <div className="dash-toggle-fila">
              <div className="dash-toggle-texto">
                Enviado a la empresa
                {Boolean(r.informe.fecha_envio) && (
                  <span className="fecha">{formatoFechaHora(r.informe.fecha_envio)}</span>
                )}
              </div>
              <button
                className={`dash-switch ${r.informe.enviado ? "on" : ""}`}
                onClick={() => toggle("enviado")}
                aria-pressed={r.informe.enviado}
                aria-label="Marcar informe enviado"
              />
            </div>
            <div className="dash-toggle-fila">
              <div className="dash-toggle-texto">
                La empresa ha respondido
                {Boolean(r.informe.fecha_respuesta_empresa) && (
                  <span className="fecha">{formatoFechaHora(r.informe.fecha_respuesta_empresa)}</span>
                )}
              </div>
              <button
                className={`dash-switch ${r.informe.empresa_respondio ? "on" : ""}`}
                onClick={() => toggle("empresa_respondio")}
                aria-pressed={r.informe.empresa_respondio}
                aria-label="Marcar respuesta de la empresa"
              />
            </div>
            <div className="campo dash-notas" style={{ marginTop: 4 }}>
              <label htmlFor="notas">Notas internas</label>
              <textarea
                id="notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                onBlur={() => actualizarInforme(idSeguro, { notas })}
                placeholder="Seguimiento, próximos pasos, contexto de la llamada…"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

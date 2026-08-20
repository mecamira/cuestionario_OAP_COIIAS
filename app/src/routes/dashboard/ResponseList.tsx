import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { suscribirRespuestas } from "../../lib/firestore";
import type { Respuesta } from "../../types/respuesta";
import { cuestionario } from "../../lib/cuestionario";

type FiltroInforme = "todos" | "sin_generar" | "sin_enviar" | "sin_respuesta";

const SECTOR_LABEL = Object.fromEntries(
  (cuestionario.perfil_empresa.campos.find((c) => c.id === "sector")?.opciones ?? []).map((o) => [
    o.value,
    o.label,
  ]),
);

function formatoFecha(valor: unknown): string {
  if (!valor || typeof valor !== "object" || !("toDate" in valor)) return "—";
  const fecha = (valor as { toDate: () => Date }).toDate();
  return fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export function ResponseList() {
  const navigate = useNavigate();
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [sector, setSector] = useState("todos");
  const [filtroInforme, setFiltroInforme] = useState<FiltroInforme>("todos");

  useEffect(() => {
    const cancelar = suscribirRespuestas((r) => {
      setRespuestas(r);
      setCargando(false);
    });
    return cancelar;
  }, []);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return respuestas.filter((r) => {
      if (sector !== "todos" && r.perfil.sector !== sector) return false;
      if (filtroInforme === "sin_generar" && r.informe.generado) return false;
      if (filtroInforme === "sin_enviar" && (!r.informe.generado || r.informe.enviado)) return false;
      if (filtroInforme === "sin_respuesta" && (!r.informe.enviado || r.informe.empresa_respondio)) return false;
      if (q) {
        const texto = `${r.perfil.empresa} ${r.perfil.nombre_contacto} ${r.perfil.email}`.toLowerCase();
        if (!texto.includes(q)) return false;
      }
      return true;
    });
  }, [respuestas, busqueda, sector, filtroInforme]);

  return (
    <div className="dash-panel">
      <div className="dash-filtros">
        <input
          type="search"
          placeholder="Buscar por empresa, contacto o email…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={sector} onChange={(e) => setSector(e.target.value)}>
          <option value="todos">Todos los sectores</option>
          {Object.entries(SECTOR_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select value={filtroInforme} onChange={(e) => setFiltroInforme(e.target.value as FiltroInforme)}>
          <option value="todos">Cualquier estado de informe</option>
          <option value="sin_generar">Sin generar informe</option>
          <option value="sin_enviar">Generado, sin enviar</option>
          <option value="sin_respuesta">Enviado, sin respuesta de la empresa</option>
        </select>
      </div>

      <p className="dash-contador">
        {cargando ? "Cargando respuestas…" : `${filtradas.length} de ${respuestas.length} respuestas`}
      </p>

      {!cargando && filtradas.length === 0 ? (
        <div className="dash-vacio">No hay respuestas que coincidan con estos filtros.</div>
      ) : (
        <div className="dash-tabla-wrap">
          <table className="dash-tabla">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Sector</th>
                <th>Fecha</th>
                <th>Puntuación</th>
                <th>Estado del informe</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((r) => (
                <tr key={r.id} onClick={() => navigate(`/dashboard/${r.id}`)}>
                  <td>
                    <div className="dash-empresa-nombre">{r.perfil.empresa}</div>
                    <div className="dash-empresa-sub">
                      {r.perfil.nombre_contacto} · {r.perfil.email}
                    </div>
                  </td>
                  <td>{SECTOR_LABEL[r.perfil.sector] ?? r.perfil.sector}</td>
                  <td>{formatoFecha(r.meta.creado_en)}</td>
                  <td>
                    <span className={`tier-pill tier-${r.resultado.tier}`}>
                      <span className="punto" />
                      {r.resultado.pct_global}%
                    </span>
                  </td>
                  <td>
                    <div className="dash-estado-fila">
                      <span className={`dash-badge ${r.informe.generado ? "ok" : "pendiente"}`}>
                        <span className="punto" />
                        {r.informe.generado ? "Generado" : "Sin generar"}
                      </span>
                      <span className={`dash-badge ${r.informe.enviado ? "ok" : "no"}`}>
                        <span className="punto" />
                        {r.informe.enviado ? "Enviado" : "Sin enviar"}
                      </span>
                      {r.informe.enviado && (
                        <span className={`dash-badge ${r.informe.empresa_respondio ? "ok" : "pendiente"}`}>
                          <span className="punto" />
                          {r.informe.empresa_respondio ? "Respondió" : "Sin respuesta"}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

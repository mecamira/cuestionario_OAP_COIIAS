import { useState } from "react";
import { cuestionario } from "../../lib/cuestionario";

export type PerfilValores = Record<string, string>;

interface Props {
  valores: PerfilValores;
  onChange: (id: string, valor: string) => void;
  onAtras: () => void;
  onContinuar: () => void;
}

export function PerfilForm({ valores, onChange, onAtras, onContinuar }: Props) {
  const { campos, descripcion } = cuestionario.perfil_empresa;
  const [faltantes, setFaltantes] = useState<Set<string>>(new Set());

  function handleContinuar() {
    const vacios = campos.filter((c) => c.obligatorio && !valores[c.id]?.trim());
    if (vacios.length > 0) {
      setFaltantes(new Set(vacios.map((c) => c.id)));
      return;
    }
    setFaltantes(new Set());
    onContinuar();
  }

  return (
    <div className="pantalla panel">
      <div className="dimension-eyebrow" style={{ marginTop: 0 }}>
        Antes de empezar
      </div>
      <h2 style={{ marginTop: 8, fontSize: 22 }}>Cuéntanos sobre tu empresa</h2>
      <p style={{ marginTop: 6, color: "var(--tinta-suave)", fontSize: 14.5 }}>{descripcion}</p>

      <div className="campo-grid">
        {campos.map((campo) => (
          <div className="campo" key={campo.id}>
            <label htmlFor={campo.id}>
              {campo.label} {campo.obligatorio && <span className="req">*</span>}
            </label>
            {campo.tipo === "select" ? (
              <select
                id={campo.id}
                value={valores[campo.id] ?? ""}
                onChange={(e) => onChange(campo.id, e.target.value)}
                style={faltantes.has(campo.id) ? { borderColor: "var(--rojo)" } : undefined}
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                {campo.opciones?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={campo.id}
                type={campo.tipo}
                value={valores[campo.id] ?? ""}
                onChange={(e) => onChange(campo.id, e.target.value)}
                style={faltantes.has(campo.id) ? { borderColor: "var(--rojo)" } : undefined}
              />
            )}
            {campo.nota && <p className="campo-nota">{campo.nota}</p>}
          </div>
        ))}
      </div>

      <div className="nav-fila">
        <button className="btn-atras" onClick={onAtras}>
          ← Volver
        </button>
        <button className="btn-primario" onClick={handleContinuar}>
          Continuar →
        </button>
      </div>
    </div>
  );
}

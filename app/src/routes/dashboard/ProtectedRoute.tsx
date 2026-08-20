import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="dash-login-envoltorio">
        <p style={{ color: "var(--tinta-suave)" }}>Cargando…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/dashboard/login" replace />;
  }

  return <>{children}</>;
}

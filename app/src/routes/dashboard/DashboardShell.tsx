import { Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../lib/AuthContext";

export function DashboardShell() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    if (auth) await signOut(auth);
    navigate("/dashboard/login", { replace: true });
  }

  return (
    <div className="dash-envoltorio">
      <div className="dash-cabecera">
        <div className="dash-cabecera-marca">
          <img src="/logo-oap3.png" alt="Oficina Acelera Pyme · COIIAS" />
          <span>Panel de respuestas</span>
        </div>
        <div className="dash-usuario">
          <span>{user?.email}</span>
          <button className="btn-secundario" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

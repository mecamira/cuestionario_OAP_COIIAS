import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Cuestionario } from "./routes/publico/Cuestionario";
import { AuthProvider } from "./lib/AuthContext";

// El dashboard privado (auth Firebase, listado/detalle de respuestas,
// editor de informe) se carga de forma perezosa para que quien solo visite
// el cuestionario publico no descargue ese codigo.
const Login = lazy(() => import("./routes/dashboard/Login").then((m) => ({ default: m.Login })));
const DashboardShell = lazy(() =>
  import("./routes/dashboard/DashboardShell").then((m) => ({ default: m.DashboardShell })),
);
const ProtectedRoute = lazy(() =>
  import("./routes/dashboard/ProtectedRoute").then((m) => ({ default: m.ProtectedRoute })),
);
const ResponseList = lazy(() =>
  import("./routes/dashboard/ResponseList").then((m) => ({ default: m.ResponseList })),
);
const ResponseDetail = lazy(() =>
  import("./routes/dashboard/ResponseDetail").then((m) => ({ default: m.ResponseDetail })),
);
const ReportEditor = lazy(() =>
  import("./routes/dashboard/ReportEditor").then((m) => ({ default: m.ReportEditor })),
);

function CargandoDashboard() {
  return (
    <div className="dash-login-envoltorio">
      <p style={{ color: "var(--tinta-suave)" }}>Cargando…</p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Cuestionario />} />

          <Route
            path="/dashboard/login"
            element={
              <Suspense fallback={<CargandoDashboard />}>
                <Login />
              </Suspense>
            }
          />

          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<CargandoDashboard />}>
                <ProtectedRoute>
                  <DashboardShell />
                </ProtectedRoute>
              </Suspense>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={<CargandoDashboard />}>
                  <ResponseList />
                </Suspense>
              }
            />
            <Route
              path=":id"
              element={
                <Suspense fallback={<CargandoDashboard />}>
                  <ResponseDetail />
                </Suspense>
              }
            />
            <Route
              path=":id/informe"
              element={
                <Suspense fallback={<CargandoDashboard />}>
                  <ReportEditor />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

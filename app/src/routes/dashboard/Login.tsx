import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, firebaseConfigurado } from "../../lib/firebase";

const MENSAJES_ERROR: Record<string, string> = {
  "auth/invalid-credential": "Email o contraseña incorrectos.",
  "auth/invalid-email": "El email no tiene un formato válido.",
  "auth/user-disabled": "Esta cuenta está deshabilitada. Contacta con el equipo técnico.",
  "auth/too-many-requests": "Demasiados intentos. Espera unos minutos y vuelve a intentarlo.",
};

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [avisoReset, setAvisoReset] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth) {
      setError("Firebase no está configurado en este entorno.");
      return;
    }
    setError(null);
    setEnviando(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const codigo = (err as { code?: string }).code ?? "";
      setError(MENSAJES_ERROR[codigo] ?? "No se ha podido iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleReset() {
    if (!auth || !email) {
      setAvisoReset("Escribe primero tu email arriba.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setAvisoReset("Te hemos enviado un email para restablecer la contraseña.");
    } catch {
      setAvisoReset("No se ha podido enviar el email. Comprueba que la dirección es correcta.");
    }
  }

  return (
    <div className="dash-login-envoltorio">
      <div className="dash-login-tarjeta">
        <div className="marca-monograma">OAP</div>
        <h1>Panel del equipo COIIAS</h1>
        <p className="sub">Inicia sesión con tu cuenta para ver las respuestas del test.</p>

        {!firebaseConfigurado && (
          <div className="dash-login-error">
            Firebase no está configurado en este entorno (faltan las variables VITE_FIREBASE_*).
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="campo">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="dash-login-error">{error}</div>}

          <button className="btn-primario" type="submit" disabled={enviando}>
            {enviando ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <button className="dash-link-discreto" type="button" onClick={handleReset}>
          ¿Has olvidado tu contraseña?
        </button>
        {avisoReset && <p className="campo-nota">{avisoReset}</p>}
      </div>
    </div>
  );
}

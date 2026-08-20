import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/** false hasta que app/.env tenga las 6 claves VITE_FIREBASE_* reales (o de
 * emulador). El cuestionario publico y el dashboard deben degradar con
 * gracia (avisar, no petar) cuando esto es false. */
export const firebaseConfigurado = Boolean(config.apiKey && config.projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (firebaseConfigurado) {
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);

  if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true") {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }
} else if (import.meta.env.DEV) {
  console.warn(
    "[firebase] Sin configurar: copia app/.env.example a app/.env y rellena las claves VITE_FIREBASE_* " +
      "(o las de un emulador local) para activar el guardado de respuestas y el dashboard.",
  );
}

export { app, auth, db };

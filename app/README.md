# App — Test de Madurez Digital (OAP COIIAS)

React + Vite. Cuestionario público en `/`, dashboard privado en `/dashboard`.

## Desarrollo local

```bash
npm install
cp .env.example .env      # rellena las claves, ver mas abajo
npm run dev
```

### Contra los emuladores de Firebase (sin proyecto real)

No hace falta un proyecto de Firebase real para desarrollar. Los emuladores
soportan un project id `demo-*` sin conexion a la nube:

```bash
# necesita Java 11+ instalado (el emulador de Firestore corre sobre JVM)
firebase emulators:start --only firestore,auth --project demo-oap-coiias
```

Y en `app/.env`:

```
VITE_FIREBASE_API_KEY=demo-api-key
VITE_FIREBASE_AUTH_DOMAIN=demo-oap-coiias.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo-oap-coiias
VITE_FIREBASE_STORAGE_BUCKET=demo-oap-coiias.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:0000000000000000000000
VITE_USE_FIREBASE_EMULATOR=true
```

La UI de los emuladores queda en `http://127.0.0.1:4000`. Para crear un
usuario de prueba del dashboard (el emulador de Auth no tiene UI de alta por
email/password desde cero, se hace por API):

```bash
curl -X POST "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key" \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.es","password":"loquesea","returnSecureToken":true}'
```

### Sin ningun Firebase configurado

Si `app/.env` no existe o le faltan claves, la app sigue funcionando (el
cuestionario se puede recorrer entero) pero avisa explicitamente — por
consola y con un banner rojo visible en la propia pagina — de que las
respuestas no se estan guardando. Es una comprobacion deliberada para que un
despliegue mal configurado en Netlify no falle en silencio.

## Tests

```bash
npm run test   # tests de firestore.rules, requieren el emulador de Firestore corriendo
```

## Build y despliegue

`npm run build` no necesita Firebase real (usa placeholders si no hay
`.env`). El despliegue en Netlify esta configurado en `netlify.toml` (raiz
del repo): `base = app`, `command = npm run build`, `publish = dist`.

### Pasar de emuladores a un proyecto de Firebase real

1. Crear el proyecto en <https://console.firebase.google.com>, habilitar
   **Firestore** (modo nativo, region `europe-west1` recomendada) y
   **Authentication > Email/Password**.
2. Registrar una "app web" dentro del proyecto (Project settings > General >
   Tus apps) para obtener los 6 valores `apiKey`, `authDomain`, `projectId`,
   `storageBucket`, `messagingSenderId`, `appId`.
3. Dar de alta al equipo en Authentication > Users.
4. Añadir el dominio de Netlify en Authentication > Settings > Authorized
   domains.
5. Poner esos 6 valores como variables de entorno del sitio en Netlify (Site
   settings > Environment), con `VITE_USE_FIREBASE_EMULATOR` sin definir o
   en `false`.
6. Desplegar las reglas de seguridad: `firebase deploy --only firestore:rules --project <id-real>`
   (ejecutar desde la raiz del repo, donde esta `firebase.json`).

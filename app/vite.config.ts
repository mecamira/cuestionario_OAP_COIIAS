import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // permite importar ../../data/*.json (fuera de app/) durante `npm run dev`
    fs: { allow: ['..'] },
  },
})

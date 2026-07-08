import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Project page (lanthanum89.github.io/Sound-Stars/), not a user/org root page.
  // Revisit if/when a custom domain is added for the TWA/Play Store phase.
  base: '/Sound-Stars/',
})

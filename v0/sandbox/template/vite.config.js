import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [ react(), tailwindcss() ],
  host: '0.0.0.0',
  server: {
    allowedHosts: true,
    port: 5173,
    watch: {
      usePolling: true,
      interval: 300
    },
    hmr: {
      clientPort: 5173
    }
  }
})

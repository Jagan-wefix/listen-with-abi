import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Group large vendor libs into separate chunks for better caching and faster subsequent loads
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor_react'
            if (id.includes('bootstrap')) return 'vendor_bootstrap'
            if (id.includes('lucide-react')) return 'vendor_icons'
            return 'vendor'
          }
        }
      }
    },
    // Raise chunk warning limit so single large modules don't spam warnings
    chunkSizeWarningLimit: 2000
  }
})

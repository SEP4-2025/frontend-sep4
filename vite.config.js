import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()], //new way od adding tailwind to the project
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // wherever json-server is running
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
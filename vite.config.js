import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'; // Import svgr

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()], // Add svgr back
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
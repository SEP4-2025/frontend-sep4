import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'; // Import svgr
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
  // Base path for GitHub Pages deployment
  base: '/frontend-sep4/',
  plugins: [react(), tailwindcss(), svgr(), flowbiteReact()], // Add svgr back
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
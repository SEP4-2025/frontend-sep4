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
        // eslint-disable-next-line no-undef
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:8000',  // Use environment variable
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Corrected regex
      }
    }
  }
})
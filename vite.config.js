import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
  base: '/frontend-sep4/',
  plugins: [react(), tailwindcss(), svgr(), flowbiteReact()],
  server: {
    proxy: {
      '/api': {
        // eslint-disable-next-line no-undef
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
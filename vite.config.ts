import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Local dev: proxy /api to `vercel dev` (default :3000) when running the
  // Vite dev server standalone. With `vercel dev` serving everything this
  // proxy is simply unused.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-router')) return 'vendor-router'
          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('i18next') || id.includes('react-i18next')) return 'vendor-i18n'
          if (id.includes('zustand')) return 'vendor-store'
          if (id.includes('lenis')) return 'vendor-lenis'
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/')
          ) {
            return 'vendor-react'
          }
        },
      },
    },
  },
})

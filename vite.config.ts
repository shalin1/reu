import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.csv'],
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.SERVER_DOMAIN,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, 'netlify/functions'),
      },
    },
  },
})

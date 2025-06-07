import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5175,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/sugoroku': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sugoroku/, ''),
      },
    },
  },
  build: {
    outDir: '../dist/housing',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
  base: '/housing/',
  define: {
    global: 'globalThis',
  },
}) 
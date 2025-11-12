import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    eslint: {
      lintOnStart: false,
      failOnError: false,
    }
  })],
  server: {
    port: 3001,
    open: true,
    cors: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: 'public',
  // Исключаем статические HTML файлы из корня, чтобы они не конфликтовали с React Router
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
    outDir: 'dist',
  },
  base: process.env.NODE_ENV === 'production' ? '/Landing/' : '/',
})


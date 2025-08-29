import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,  // 프론트엔드 포트
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // 백엔드 포트
        changeOrigin: true
      }
    }
  }
})
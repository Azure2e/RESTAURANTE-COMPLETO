import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // Qualquer requisição que comece com /api será redirecionada
        target: 'http://localhost:3001', // Onde seu backend está rodando
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Opcional: remover /api do caminho
      }
    }
  }
});
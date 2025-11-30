import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 'base' handles the path for assets. 
  // './' is great for relative hosting (GitHub Pages), but on Vercel root '/' is often standard.
  // We keep './' for compatibility but ensure outDir is correct.
  base: './', 
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
});
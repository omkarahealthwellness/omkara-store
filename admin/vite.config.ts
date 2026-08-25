import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(import.meta.dirname!, '../shared'),
      'shared': path.resolve(import.meta.dirname!, '../shared'),
      '@': path.resolve(import.meta.dirname!, './src'),
    },
  },
  server: {
    port: 3001,
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: false,
    cssMinify: true,
    minify: 'esbuild'
  },
});

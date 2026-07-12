import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        anasayfa: resolve(import.meta.dirname, 'index.html'),
        bulunamadi: resolve(import.meta.dirname, '404.html'),
        harita: resolve(import.meta.dirname, 'harita/index.html'),
      },
    },
  },
});

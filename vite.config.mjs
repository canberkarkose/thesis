import path from 'path';

import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, '/src/components'),
      '@src': path.resolve(__dirname, '/src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.svg'],
  },
  server: {
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});

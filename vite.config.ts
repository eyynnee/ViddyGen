import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Simplified config — no API key or environment variable handling
export default defineConfig({
  server: {
    port: 5173, // Vite default port
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});

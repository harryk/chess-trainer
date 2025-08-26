import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Configure server with proper WASM MIME types and security headers
  server: {
    port: 3000,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  
  // Configure WASM handling
  optimizeDeps: {
    exclude: ['stockfish'],
  },
  
  // Handle WASM files properly
  assetsInclude: ['**/*.wasm'],
  
  // Resolve paths
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  
  // Build configuration
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          stockfish: ['stockfish'],
        },
      },
    },
  },
});


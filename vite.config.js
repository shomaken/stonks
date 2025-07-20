import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    // Add Buffer polyfill for Solana/Jupiter libraries
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': '/src',
      // Add Buffer polyfill
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
    exclude: ['@trezor/connect-web', '@trezor/connect-common', '@trezor/env-utils'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}) 

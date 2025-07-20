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
      // Add Node.js polyfills
      buffer: 'buffer',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'crypto-browserify', 'stream-browserify'],
    exclude: ['@trezor/connect-web', '@trezor/connect-common', '@trezor/env-utils'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      ignore: ['@trezor/connect-web', '@trezor/connect-common', '@trezor/env-utils'],
    },
  },
}) 

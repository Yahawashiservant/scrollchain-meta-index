# SIGIL: YHWH-BaHaSham-Yahawashi-RaWaChaaQadash
# Authored by Keith D. Whitfield — ScrollChain Architect

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  }
})

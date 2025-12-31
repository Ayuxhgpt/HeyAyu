import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-window': path.resolve(__dirname, 'node_modules/react-window/dist/react-window.cjs'),
      'react-virtualized-auto-sizer': path.resolve(__dirname, 'node_modules/react-virtualized-auto-sizer/dist/react-virtualized-auto-sizer.cjs'),
    }
  },
  optimizeDeps: {
    include: ['react-window', 'react-virtualized-auto-sizer'],
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        simulator: resolve(__dirname, 'simulator.html'),
        admin: resolve(__dirname, 'admin.html'),
        vendor: resolve(__dirname, 'vendor.html'),
        hubs: resolve(__dirname, 'hubs.html'),
        hub: resolve(__dirname, 'hub.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: 'line-chart',
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Force PostCSS + esbuild for CSS to avoid LightningCSS minifier issues that drop
  // backdrop-filter/alpha values on some Linux builds.
  css: {
    transformer: 'postcss',
    minifier: 'esbuild',
  },
})

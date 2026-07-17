import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/green-ai-frontend/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
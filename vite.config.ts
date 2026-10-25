import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Site publié sur https://ilanguage.github.io/objectif-b2/
export default defineConfig({
  base: '/objectif-b2/',
  plugins: [react(), tailwindcss()],
  build: {
    // Le contenu des leçons (texte) représente l'essentiel du bundle et sert sur toutes les pages.
    chunkSizeWarningLimit: 800,
  },
})

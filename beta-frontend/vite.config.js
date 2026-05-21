import { defineConfig } from 'vite'
import react from '@vitejs/react-refresh' // or @vitejs/plugin-react

export default defineConfig({
  plugins: [react()],
  base: './', // 🌟 This forces Vite to look for assets relative to the current folder!
})
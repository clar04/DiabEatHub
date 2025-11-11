import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // contoh kalau perlu; sesuaikan target sesuai dokumen API
      '/nutri': {
        target: 'https://trackapi.nutritionix.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/nutri/, ''),
      },
      '/spoon': {
        target: 'https://api.spoonacular.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/spoon/, ''),
      },
    }
  }
})

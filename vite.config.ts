
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel ortam değişkenlerinin istemci tarafında güvenli kullanımı için
    'process.env': process.env
  }
})

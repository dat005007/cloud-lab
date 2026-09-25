import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Dòng lệnh phép thuật giúp mở khóa lỗi 502
    port: 5173
  }
})
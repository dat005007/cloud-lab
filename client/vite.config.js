import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    host: true,
    allowedHosts: true // Dòng này cho phép mọi tên miền truy cập, khắc phục lỗi bị chặn
=======
    host: true, // Dòng lệnh phép thuật giúp mở khóa lỗi 502
    port: 5173
>>>>>>> 273283d9a5a67a2205b7bacf6f61dc93a061e0fa
  }
})
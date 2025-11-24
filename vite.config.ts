import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 明确指定端口为 3000
    host: true,   // 监听所有地址，允许从 Docker 外部访问
  },
})

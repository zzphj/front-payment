import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

const baseUrl = 'http://localhost:8080' // 后端接口

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // vite 相关配置
  server: {
    port: 8082,
    host: true,
    open: true,
    proxy: {
      // https://cn.vitejs.dev/config/#server-proxy
      '/dev-api': {
        target: baseUrl,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/dev-api/, '')
      },
       // springdoc proxy
       '^/v3/api-docs/(.*)': {
        target: baseUrl,
        changeOrigin: true,
      }
    }
  },
})

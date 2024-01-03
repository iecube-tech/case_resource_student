import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass",
          // directives: true,
          // version: "2.1.5",
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/dev-api': {
        // 后台地址
        target: 'http://192.168.1.24:8088/',
        // target: 'http://43.139.68.165:8088',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dev-api/, '')
      },
      '/local-resource': {
        target: 'http://192.168.1.24:8088/files/',
        // target: 'http://43.139.68.165:8088/files/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/local-resource/, '')
      }
    }
  }
})

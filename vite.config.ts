import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts'
    }),
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
    port: 5174,
    open: true,
    proxy: {
      '/dev-api': {
        // 后台地址
        // target: 'http://192.168.1.13:8088/',
        // target: 'http://192.168.1.252:9000/',
        // target: 'http://192.168.1.80:8088/',
        target: 'http://47.94.161.154:8088',
        // target: "http://192.168.1.20:8088",
        // target: "http://192.168.124.8:8088",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dev-api/, '')
      },
      '/local-resource': {
        // target: 'http://192.168.1.13:8088/files/',
        // target: 'http://192.168.1.80:8088/files',
        // target: 'http://192.168.10.6:8088/files/',
        target: 'http://47.94.161.154:8088/files/',
        // target: "http://192.168.124.8:8088/files",
        // target: "http://192.168.1.20:8088/files",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/local-resource/, '')
      },
      '/so-cket': {
        // target: 'http://192.168.1.13:8088/wsv1/',
        // target: 'http://192.168.1.80:8088/wsv1/',
        target: 'http://47.94.161.154:8088/',
        // target: "http://192.168.124.8:8088",
        // target: "http://192.168.1.20:8088",
        // target: 'http://192.168.10.6:8088/',
        ws: true, // 开启websocket代理  注意
        changeOrigin: true,
        rewrite: path => path.replace(/^\/so-cket/, '')
      },
      '/device-front': {
        // target: "http://192.168.1.13:8088/ws/front/",
        // target: 'http://192.168.1.80:8088/ws/front/',
        // target: 'http://192.168.1.80:8088/ws/front/',
        target: 'http://47.94.161.154:8088/ws/front/',

        ws: true,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/device-front/, '')
      },
      '/ai-assistant': {
        // target: "http://192.168.1.13:8088/ai/server/assistant/",
        // target: 'http://192.168.1.80:8088/ai/server/assistant/',
        target: 'http://47.94.161.154:8088/ai/server/assistant/',
        ws: true,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/ai-assistant/, '')
      },
      '/2830-assistant': {
        // target: "http://192.168.1.13:8088/ai/server/assistant/",
        // target: 'http://192.168.1.80:8088/ai2830/server/assistant/',
        target: 'http://47.94.161.154:8088/ai2830/server/assistant/',
        ws: true,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/2830-assistant/, '')
        // rewrite: path => path.replace(/^\//, '')
      },

      // '/2830-api': {
      //   target: 'http://192.168.1.10:5000/',
      //   changeOrigin: true,
      //   rewrite: path => path.replace(/^\/2830-api/, '')
      // },
      // '/2830-socket': {
      //   target: 'http://192.168.1.16:5000/',
      //   ws: true,
      //   changeOrigin: true,
      //   rewrite: path => path.replace(/^\/2830-socket/, '')
      // }
    }
  }
})

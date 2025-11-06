import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [
            vue(),
            AutoImport({
                imports: ["vue", "vue-router"],
                resolvers: [ElementPlusResolver()],
                dts: "src/auto-imports.d.ts",
            }),
            Components({
                resolvers: [
                    ElementPlusResolver({
                        importStyle: "sass",
                    }),
                ],
            }),
        ],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/styles/element/index.scss" as *;`,
                },
            },
        },
        server: {
            host: "0.0.0.0",
            port: 5174,
            open: true,
            proxy: {
                "/dev-api": {
                    // 后台地址
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/dev-api/, ""),
                },
                "/local-resource": {
                    target: env.VITE_API_URL + "/files/",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/local-resource/, ""),
                },
                "/so-cket": {
                    target: env.VITE_API_URL,
                    ws: true, // 开启websocket代理  注意
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/so-cket/, ""),
                },
                "/device-front": {
                    target: env.VITE_API_URL + "/ws/front/",
                    ws: true,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/device-front/, ""),
                },
                "/ai-assistant": {
                    target: env.VITE_API_URL + "/ai/server/assistant/",
                    ws: true,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/ai-assistant/, ""),
                },
                "/2830-assistant": {
                    target: env.VITE_API_URL + "/ai2830/server/assistant/",
                    ws: true,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/2830-assistant/, ""),
                },
                "/aicheck": {
                    // 后台地址
                    target: "https://student.iecube.online/aicheck/",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/aicheck/, ""),
                },
            },
        },
    };
});

import { resolve } from "path"
import { defineConfig, externalizeDepsPlugin } from "electron-vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias: { "@config": resolve(__dirname, "src/config"), "@utils": resolve(__dirname, "src/utils") } }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias: { "@config": resolve(__dirname, "src/config"), "@utils": resolve(__dirname, "src/utils") } }
  },
  renderer: {
    build: {
      rollupOptions: {
        external: ["*.json"]
      }
    },
    resolve: {
      alias: {
        "@renderer": resolve(__dirname, "src/renderer/src"),
        "@components": resolve(__dirname, "src/renderer/src/components"),
        "@routes": resolve(__dirname, "src/renderer/src/routes"),
        "@assets": resolve(__dirname, "src/renderer/src/assets"),
        "@contexts": resolve(__dirname, "src/renderer/src/contexts"),
        "@hooks": resolve(__dirname, "src/renderer/src/hooks")
      }
    },
    plugins: [react()]
  }
})

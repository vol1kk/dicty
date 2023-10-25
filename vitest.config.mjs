import { resolve } from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

// https://vitejs.dev/config/
export default defineConfig({
  // @ts-ignore https://github.com/vitejs/vite/issues/13027#issuecomment-1538775351
  plugins: [react()],
  resolve: {
    alias: [{ find: "~", replacement: resolve(__dirname, "./src") }, { find: "#tests", replacement: resolve(__dirname, "./__tests__") }]
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./__tests__/setup"],
  },
})

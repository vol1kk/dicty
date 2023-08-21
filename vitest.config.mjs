import { resolve } from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "~", replacement: resolve(__dirname, "./src") }, { find: "#tests", replacement: resolve(__dirname, "./__tests__") }]
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./__tests__/setup"],
  },
})

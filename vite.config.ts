/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config"
import vue from "@vitejs/plugin-vue"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  test: {
    environment: "node",
    include: ["src/**/*.spec.ts"],
    passWithNoTests: true,
  },
})

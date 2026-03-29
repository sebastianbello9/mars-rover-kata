/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { fileURLToPath } from "url";

export default defineConfig({
  resolve: {
    alias: {
      "@src": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "node",
  },
});

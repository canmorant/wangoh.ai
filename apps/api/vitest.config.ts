import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    root: "./",
    include: ["src/**/*.spec.ts", "test/**/*.e2e-spec.ts"],
    // Her e2e dosyası kendi PGlite örneğini açar (WASM başlatma birkaç yüz ms sürer).
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});

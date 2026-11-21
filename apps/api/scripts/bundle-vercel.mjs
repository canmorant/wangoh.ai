/**
 * Vercel işlevi için derlenmiş API'yi (dist/) tek bir ESM dosyasına paketler: `api/server.mjs`.
 *
 * Neden: Vercel'in Node çalışma zamanı CommonJS paketlerinin ESM paketleri `require()` etmesine izin vermiyor
 * (`@nestjs/throttler` → `@nestjs/common`, ERR_REQUIRE_ESM). Paketleme bu bağımlılıkları derleme anında çözer.
 * Nest'in isteğe bağlı modülleri (mikroservis, websocket...) ve yerelde kullanılan PGlite pakete girmez:
 * hepsi çalışma anında yalnız gerekirse yüklenir.
 */
import { build } from "esbuild";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

await build({
  absWorkingDir: root,
  stdin: {
    contents: 'export { createApp } from "./dist/bootstrap.js";\nexport { formatStartupError } from "./dist/common/startup-error.js";\n',
    resolveDir: root,
    sourcefile: "vercel-entry.js",
    loader: "js",
  },
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  outfile: "api/_server.mjs",
  keepNames: true,
  sourcemap: false,
  logLevel: "warning",
  external: [
    "@nestjs/microservices",
    "@nestjs/microservices/*",
    "@nestjs/websockets",
    "@nestjs/websockets/*",
    "@nestjs/platform-socket.io",
    "@fastify/*",
    "class-transformer/storage",
    "@electric-sql/pglite",
    "@electric-sql/pglite/*",
    "drizzle-orm/pglite",
    "drizzle-orm/pglite/*",
    "pg-native",
    "@swc/*",
  ],
  // CommonJS bağımlılıkların `require` çağrıları için (Node yerleşik modülleri).
  banner: { js: 'import { createRequire as __wangohCreateRequire } from "node:module"; const require = __wangohCreateRequire(import.meta.url);' },
});
console.log("api/_server.mjs yazıldı.");

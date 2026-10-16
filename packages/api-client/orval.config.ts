import { defineConfig } from "orval";

// Belge: docs/backend-mobil-mimarisi.md, bölüm 9. Girdi API'nin dışa aktardığı sözleşmedir
// (`pnpm generate:api` önce onu üretir); çıktı commit'lenir. WANGOH_OPENAPI_INPUT yalnız
// üretim hattını başka bir belgeyle denemek içindir (mutlak yol ver).
export default defineConfig({
  wangoh: {
    input: {
      target: process.env.WANGOH_OPENAPI_INPUT ?? "../../apps/api/openapi.json",
    },
    output: {
      client: "react-query",
      httpClient: "fetch",
      mode: "tags-split",
      target: "src/generated",
      schemas: "src/generated/models",
      // Ana dizine ve model klasörüne `index.ts` yazar; paket girişi `src/index.ts`.
      indexFiles: true,
      clean: true,
      override: {
        mutator: {
          path: "./src/mutator.ts",
          name: "apiFetch",
        },
        // 2xx'te `{ data, status, headers }` zarfı değil doğrudan gövde tipi dönsün;
        // hata durumunu mutator `ApiError` fırlatarak bildirir.
        fetch: {
          includeHttpResponseReturnType: false,
        },
        query: {
          // `useQuery`/`useMutation` bayraklarını verme: ikisi de bütün uçları kendi türüne
          // zorlar. Varsayılan doğru: GET kancası sorgu, diğer metotlar mutasyon olur.
          // Sorgu iptali (react-query'nin AbortSignal'i) isteğe iletilir.
          signal: true,
          version: 5,
        },
      },
    },
  },
});

import { QueryClient } from "@tanstack/react-query";

import { retryDelay, shouldRetry } from "./retryPolicy";

/** İçerik (ülke, rehber, blog) sık değişmez; bu süre içinde aynı sorgu ağa gitmeden önbellekten gelir. */
export const QUERY_STALE_TIME_MS = 60_000;
/** Kullanılmayan sorgu verisi bellekte bu kadar kalır (geri dönüşte anında görünür). */
export const QUERY_GC_TIME_MS = 10 * 60_000;

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        gcTime: QUERY_GC_TIME_MS,
        retry: shouldRetry,
        retryDelay,
      },
      // Yazma işlemleri (giriş, cevap gönderme) asla otomatik tekrarlanmaz: çift gönderim olmasın.
      mutations: { retry: false },
    },
  });
}

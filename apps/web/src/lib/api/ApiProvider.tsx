"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError, configureApiClient } from "@wangoh/api-client";
import { useState, type ReactNode } from "react";

/**
 * Ortak API istemcisinin (@wangoh/api-client) web kablolaması. Henüz hiçbir sayfaya
 * bağlı değil: sitenin içeriği hâlâ statik; sayfalar bu sağlayıcıyı kullanmaya
 * başladığında `<ApiProvider>` ile sarılır.
 *
 * Next.js `NEXT_PUBLIC_*` değerlerini derleme anında gömer, bu yüzden değişken
 * dinamik değil, bu ifadeyle okunmalı. Tanımlı değilse geliştirmede yerel API
 * (apps/api, 3001), üretimde boş adres (siteyle aynı kaynak) kullanılır.
 */
const API_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/+$/, "") ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3001");

type ApiTokens = { accessToken: string; refreshToken: string };

// Belirteçler yalnız bellekte durur (sayfa yenilenince gider): localStorage'a yazılan
// belirteç XSS'e açıktır. Yalnız tarayıcıda çağır; sunucuda bu modül durumu istekler arası paylaşılır.
let tokens: ApiTokens | null = null;

export function setApiTokens(next: ApiTokens | null): void {
  tokens = next;
}

export function getApiTokens(): ApiTokens | null {
  return tokens;
}

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        // 4xx istemci hatasıdır, tekrar denemek sonucu değiştirmez; ağ ve sunucu hatalarını iki kez dene.
        retry: (failureCount, error) =>
          failureCount < 2 && !(error instanceof ApiError && error.status >= 400 && error.status < 500),
      },
    },
  });
}

export function ApiProvider({ children }: { children: ReactNode }) {
  // Kancalar ilk istekten önce yapılandırılmış olmalı. Çocukların efektleri ebeveynin efektinden
  // önce çalıştığı için yapılandırma `useEffect`te değil, başlatıcıda yapılır (tekrar çağrısı zararsız).
  const [queryClient] = useState(() => {
    configureApiClient({
      baseUrl: API_URL,
      getAccessToken: () => tokens?.accessToken ?? null,
      getRefreshToken: () => tokens?.refreshToken ?? null,
      onTokensRefreshed: (next) => {
        tokens = next;
      },
      onAuthFailure: () => {
        tokens = null;
      },
    });
    return createQueryClient();
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

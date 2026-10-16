import type { ApiClientConfig } from "@wangoh/api-client";

import type { AuthTokens } from "@/auth/tokenStorageCore";

export interface ApiSetupOptions {
  /** Kayıtlı belirteçler; yoksa null (oturum açılmamış). */
  getTokens: () => AuthTokens | null | Promise<AuthTokens | null>;
  /** İstemci erişim belirtecini yenilediğinde çağrılır; yeni çifti kalıcı yazın. */
  saveTokens: (tokens: AuthTokens) => void | Promise<void>;
  /** Yenileme belirteci reddedildi: oturumu kapatın. */
  onAuthFailure: () => void;
  /** Varsayılan: `config.apiUrl`. */
  baseUrl?: string;
  fetch?: typeof fetch;
}

/** `setupApi` seçeneklerini api-client sözleşmesine (docs/backend-mobil-mimarisi.md bölüm 9) çevirir. */
export function buildApiClientConfig(options: ApiSetupOptions & { baseUrl: string }): ApiClientConfig {
  return {
    baseUrl: options.baseUrl.replace(/\/+$/, ""),
    getAccessToken: async () => (await options.getTokens())?.accessToken ?? null,
    getRefreshToken: async () => (await options.getTokens())?.refreshToken ?? null,
    onTokensRefreshed: (tokens) => options.saveTokens({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }),
    onAuthFailure: options.onAuthFailure,
    ...(options.fetch ? { fetch: options.fetch } : {}),
  };
}

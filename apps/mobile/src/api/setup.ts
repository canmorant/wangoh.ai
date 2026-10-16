import { configureApiClient } from "@wangoh/api-client";
import { focusManager } from "@tanstack/react-query";
import { AppState, Platform } from "react-native";

import { config } from "@/config";

import { buildApiClientConfig, type ApiSetupOptions } from "./apiConfig";

export { createQueryClient, QUERY_GC_TIME_MS, QUERY_STALE_TIME_MS } from "./queryClient";
export { DEFAULT_ERROR_MESSAGE, getErrorMessage, getErrorStatus, isNetworkError } from "./errors";
export { MAX_QUERY_RETRIES, retryDelay, shouldRetry } from "./retryPolicy";
export type { ApiSetupOptions } from "./apiConfig";

/**
 * API istemcisini bağlar (belge bölüm 9). Uygulama açılışında bir kez çağrılır; aynı belirteç
 * deposu ve oturum kapatma işleyicisi burada verilir, 401 yenilemesi ve Bearer ekleme
 * api-client içindedir. Yeniden çağırmak güvenlidir (yapılandırmayı değiştirir).
 */
export function setupApi(options: ApiSetupOptions): void {
  configureApiClient(buildApiClientConfig({ ...options, baseUrl: options.baseUrl ?? config.apiUrl }));
}

let focusWired = false;

/**
 * React Native'de pencere odağı yoktur; uygulama ön plana dönünce bayat sorguların yenilenmesi için
 * TanStack Query odak yöneticisini AppState'e bağlar. Web'de tarayıcı odak olayı zaten çalışır.
 */
export function setupQueryFocusManager(): void {
  if (focusWired || Platform.OS === "web") return;
  focusWired = true;
  focusManager.setEventListener((handleFocus) => {
    const subscription = AppState.addEventListener("change", (state) => handleFocus(state === "active"));
    return () => subscription.remove();
  });
}

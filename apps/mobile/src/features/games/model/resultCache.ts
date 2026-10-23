/**
 * Bitirilen oyunun sonucunu (`finish` yanıtı) sonuç ekranına taşır: oyun ekranı bitirir, sonuç ekranı
 * aynı yanıtı yeniden istemeden gösterir. Önbellekte yoksa (sayfa yenilendi) sonuç ekranı `finish`i
 * kendisi çağırır; çağrı idempotenttir ve aynı puanı döner. Bellek içidir, kalıcı değildir.
 */

import type { FinishResponseDto } from "@wangoh/api-client";

const MAX_ENTRIES = 20;

export interface ResultCache {
  get(sessionId: string): FinishResponseDto | undefined;
  put(result: FinishResponseDto): void;
  clear(): void;
}

export function createResultCache(): ResultCache {
  const entries = new Map<string, FinishResponseDto>();
  return {
    get: (sessionId) => entries.get(sessionId),
    put: (result) => {
      entries.delete(result.sessionId);
      entries.set(result.sessionId, result);
      while (entries.size > MAX_ENTRIES) {
        const oldest = entries.keys().next().value;
        if (oldest === undefined) break;
        entries.delete(oldest);
      }
    },
    clear: () => entries.clear(),
  };
}

/** Uygulamanın tek sonuç önbelleği. */
export const resultCache = createResultCache();

import type { AppLocale } from "@/i18n/routing";
import { isTranslatable, textKey, type Translate } from "@/content/i18n/core";
import type { GuideTemplates } from "./templates/types";
import { tr } from "./templates/tr";

/**
 * Rehber fabrikalarının çalıştığı dil bağlamı.
 *
 * - `t`: değişkensiz metinleri (profil verisi, sabit cümleler, kaynak adları)
 *   çeviri belleğinden çevirir; bulamadığını Türkçe bırakır.
 * - `T`: değişken içeren cümle kalıpları (bkz. templates/types.ts).
 * - `scope`: sonraki eksik çevirileri hangi rehbere yazacağını söyler. Böylece
 *   her rehberin o dilde tam çevrilip çevrilmediği ayrı ayrı bilinir.
 */
export interface GuideContext {
  locale: AppLocale;
  T: GuideTemplates;
  t: Translate;
  scope(guideKey: string): void;
  /** rehber anahtarı ("JP:Tokyo") → o rehberde çevirisi bulunamayan metinler */
  readonly missing: Map<string, Set<string>>;
}

export function createGuideContext(
  locale: AppLocale,
  memory: ReadonlyMap<string, string> | null,
  T: GuideTemplates
): GuideContext {
  const missing = new Map<string, Set<string>>();
  let current: Set<string> | null = null;
  return {
    locale,
    T,
    missing,
    scope(guideKey) {
      current = new Set();
      missing.set(guideKey, current);
    },
    t(source) {
      if (!memory || !isTranslatable(source)) return source;
      const hit = memory.get(textKey(source));
      if (hit !== undefined) return hit;
      current?.add(source);
      return source;
    },
  };
}

/** Türkçe: çeviri yok, kalıplar özgün hâliyle. Fabrikaların varsayılanı. */
export const TR_CONTEXT = createGuideContext("tr", null, tr);

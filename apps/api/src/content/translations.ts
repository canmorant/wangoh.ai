import { type Lang, resolveTranslation, type ResolvedTranslation } from "../common/lang.js";
import type { Translations } from "../db/schema/types.js";

/**
 * Liste sorguları büyük `translations` jsonb'sini yüklemez: yalnız `translations -> 'tr'` ve `translations -> <lang>`
 * nesneleri gelir. Bu işlev ikisini ortak `resolveTranslation` kuralıyla birleştirir:
 * istenen dil varsa ve (`completeLangs` verildiyse) tam ise o, yoksa Türkçe; `complete` istenen dilin sunulup
 * sunulmadığını söyler. Çeviri uydurulmaz.
 */
export function pickTranslation<T>(
  tr: T,
  localized: T | null | undefined,
  completeLangs: readonly string[] | null | undefined,
  lang: Lang,
): ResolvedTranslation<T> {
  const translations = { tr, ...(lang !== "tr" && localized ? { [lang]: localized } : {}) } as Translations<T>;
  return resolveTranslation(translations, completeLangs, lang);
}

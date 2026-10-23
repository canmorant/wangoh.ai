import { FIELD_LIMITS, SLUG_PATTERN } from "../blog/contentRules";

/** Türkçe harfleri ASCII karşılığına çevirir (yerel ayara bağlı `toLowerCase` kullanılmaz). */
const TURKISH_ASCII: Readonly<Record<string, string>> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

/**
 * Başlıktan adres (slug) önerisi: küçük harf, rakam ve tire. "Japonya Gezi Rehberi: 8 Şehir!" -> "japonya-gezi-rehberi-8-sehir".
 * En çok 120 karakter; kesilen yerde tire kalmaz. Üretilemezse (yalnız simge/emoji) boş metin.
 */
export function slugify(title: string): string {
  const ascii = title
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (char) => TURKISH_ASCII[char] ?? char)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
  const slug = ascii
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, FIELD_LIMITS.slugMax)
    .replace(/-+$/g, "");
  return slug;
}

export const SLUG_RULE_MESSAGE = "Adres yalnız küçük harf (a-z), rakam ve tire içerebilir; tire başta, sonda ya da art arda olamaz.";

/** Adres geçerliyse null, değilse Türkçe hata mesajı. Sunucu kırpar ve küçük harfe çevirir; burada da öyle. */
export function validateSlug(input: string): string | null {
  const slug = input.trim().toLowerCase();
  if (slug === "") return "Adres (slug) gerekli.";
  if (slug.length < FIELD_LIMITS.slugMin) return `Adres en az ${FIELD_LIMITS.slugMin} karakter olmalı.`;
  if (slug.length > FIELD_LIMITS.slugMax) return `Adres en fazla ${FIELD_LIMITS.slugMax} karakter olabilir.`;
  if (!SLUG_PATTERN.test(slug)) return SLUG_RULE_MESSAGE;
  return null;
}

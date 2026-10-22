/**
 * Şehir adresi (slug) üretimi. `apps/web/src/lib/slug.ts` ile BİREBİR aynı olmalı: tohumdaki slug'lar
 * web'in `slugify(şehir adı)` çıktısıdır ve web adresleriyle (/japonya/tokyo) eşleşir. Eşitlik gerçek
 * tohum testinde (`test/content-real-seed.e2e-spec.ts`) her şehir için doğrulanır.
 *
 * `String.normalize("NFD")` Türkçe'ye tek başına yetmez: noktasız "ı" ayrışmaz ve "İ" küçültülünce ardında
 * birleşen bir nokta bırakır. Bu yüzden eşleme açıkça tanımlıdır.
 */
const TR_MAP: Record<string, string> = {
  ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", I: "i", İ: "i", i: "i",
  ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u", â: "a", î: "i", û: "u",
  ł: "l", Ł: "l", ø: "o", Ø: "o", æ: "ae", Æ: "ae",
};

export function slugify(input: string): string {
  return input
    .split("")
    .map((ch) => TR_MAP[ch] ?? ch)
    .join("")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Geçerli bir şehir slug'ı: küçük harf/rakam, tireyle ayrılmış. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAX_SLUG_LENGTH = 80;

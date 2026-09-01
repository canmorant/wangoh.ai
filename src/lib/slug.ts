/**
 * Türkçe karakterleri koruyarak SEO dostu slug üretir.
 *
 * `String.normalize("NFD")` Türkçe'ye tek başına yetmez: noktasız "ı" ayrışmaz
 * ve "İ" küçültülünce ardında birleşen bir nokta bırakır. Bu yüzden eşleme
 * açıkça tanımlandı.
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

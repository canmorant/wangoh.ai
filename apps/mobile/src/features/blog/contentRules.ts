/**
 * Blog içeriği için saf kurallar. Sunucudaki `apps/api/src/blog/blog-blocks.ts` ile aynı sınırlar ve
 * aynı metin denetimleridir: istemci hatayı göndermeden önce yakalar, asıl yetki yine sunucudadır.
 * Hem blog okuyucusu (güvenli çizim) hem yönetim editörü (doğrulama) bunu kullanır.
 */

/** Gövde bloğu sınırları (sunucu `BLOCK_LIMITS` ile birebir). */
export const BLOCK_LIMITS = {
  maxBlocks: 300,
  /** Bir çevirideki tüm blok metinlerinin toplamı. */
  maxTotalChars: 100_000,
  heading: 200,
  paragraph: 10_000,
  listItems: 100,
  listItem: 1_000,
  quote: 2_000,
  cite: 200,
  url: 2_048,
  alt: 300,
  caption: 500,
} as const;

/** Başlık, özet, etiket vb. alan sınırları (sunucu `blog-requests.dto.ts`). */
export const FIELD_LIMITS = {
  title: 200,
  excerpt: 1_000,
  slugMin: 3,
  slugMax: 120,
  tags: 20,
  tag: 50,
} as const;

/**
 * Kontrol karakterleri (NUL, ESC, DEL, C1...), satır/paragraf ayırıcılar, çift yönlü metin kontrolleri ve BOM.
 * ZWJ/ZWNJ gibi meşru biçim karakterleri (emoji dizileri) serbesttir.
 */
const FORBIDDEN_CHARS = /[\p{Cc}\u{2028}\u{2029}\u{200e}\u{200f}\u{061c}\u{202a}-\u{202e}\u{2066}-\u{2069}\u{feff}]/u;
const ALLOWED_WHITESPACE_CONTROLS = /[\n\r\t]/g;

/** Metinde yasak karakter var mı? `multiline` true ise `\n`, `\r`, `\t` serbesttir. */
export function hasForbiddenChars(text: string, multiline = false): boolean {
  return FORBIDDEN_CHARS.test(multiline ? text.replace(ALLOWED_WHITESPACE_CONTROLS, "") : text);
}

/**
 * Görünür hiçbir şey çizmeyen metin: boşluklar (NBSP dahil), sıfır genişlikli/yumuşak/yön belirsiz karakterler ve
 * Braille boşluğu. `trim()` bunların çoğunu kırpmaz.
 */
const BLANK_TEXT = /^[\p{White_Space}\p{Default_Ignorable_Code_Point}\u{2800}]*$/u;
export function isBlankText(text: string): boolean {
  return BLANK_TEXT.test(text);
}

/** Adres içinde yasak olanlar: boşluk, kontrol, görünmez/yön belirleyici karakter ve ters eğik çizgi. */
const FORBIDDEN_IN_URL = /[\s\p{Cc}\p{Default_Ignorable_Code_Point}\\]/u;
/** `[::1]` biçimi ya da ad: noktalarla ayrılmış, tireyle başlamayan/bitmeyen etiketler + isteğe bağlı kapı. */
const AUTHORITY = /^(?:\[[0-9a-fA-F:.]+\]|[^\s@:/?#[\]]+)(?::\d{1,5})?$/u;

/**
 * Yalnız https adresi: `javascript:`, `http:`, `data:`, `//host`, göreli yollar, kimlik bilgili
 * (`https://kullanici@host`) ve boşluk/kontrol karakteri/ters eğik çizgi içeren adresler geçersizdir.
 * `URL` sınıfına dayanmaz (React Native'in `URL` gerçeklemesi eksiktir), sunucunun denetimini ham metinde uygular.
 */
export function isHttpsUrl(value: unknown, maxLength: number = BLOCK_LIMITS.url): value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > maxLength) return false;
  if (FORBIDDEN_IN_URL.test(value)) return false;
  const authority = /^https:\/\/([^/?#]*)/i.exec(value)?.[1];
  if (authority === undefined || authority === "" || authority.includes("@")) return false;
  if (!AUTHORITY.test(authority)) return false;
  const host = authority.replace(/:\d{1,5}$/, "");
  return !host.startsWith(".") && !host.endsWith(".") && !host.startsWith("-") && !host.includes("..");
}

/**
 * Etiket normalleştirme: sunucudaki `normalizeTag` ile aynı (NFC, `İ` -> `i`, yerel ayarsız küçük harf).
 * Böylece ekranda gördüğün etiket sunucunun sakladığı etiketle aynıdır.
 */
export function normalizeTag(value: string): string {
  return value.trim().normalize("NFC").replace(/İ/g, "i").toLowerCase().normalize("NFC");
}

/** Etiket biçimi: harf/rakamla başlar; harf, rakam, birleşik işaret ve tire içerir (sunucu `TAG_PATTERN`). */
export const TAG_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}\p{M}-]*$/u;
/** Küçük harf, rakam ve tire; tire kenarda ya da art arda olamaz (sunucu `SLUG_PATTERN`). */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/;

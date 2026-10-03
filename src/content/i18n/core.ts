/**
 * İçerik çevirisinin çekirdeği — saf fonksiyonlar, sunucu/istemci ayrımı yok.
 *
 * Türkçe içerik (rehberler, ülke sayfaları, beslenme önerileri, destinasyon
 * verisi) kaynak olarak yerinde kalıyor. Çeviriler ayrı bir çeviri belleğinde
 * (tm/<dil>.json) Türkçe metnin karmasıyla anahtarlanıyor:
 *
 *   textKey("Kalabalıklar gelmeden Fushimi Inari'de şafak") → "1x9k2…"
 *   tm/en.json: { "destinations": { "1x9k2…": "Dawn at Fushimi Inari before the crowds" } }
 *
 * Neden karma: Türkçe metin değişirse anahtarı da değişir, eski çeviri
 * kendiliğinden devre dışı kalır ve sayfa o dilde "çevrilmemiş" sayılır —
 * güncelliğini yitirmiş bir çeviri asla yeni Türkçe metnin yerine geçmez.
 */

export type Translate = (source: string) => string;

/** cyrb53: hızlı, kararlı 53 bit karma. Kriptografik değil, gerekmiyor. */
export function textKey(source: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < source.length; i++) {
    const ch = source.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/** Metin değil, anahtar ya da kod olan alanlar: hiçbir dilde çevrilmez. */
export const STRUCTURAL_KEYS: ReadonlySet<string> = new Set([
  "city",
  "countryCode",
  "code",
  "id",
  "url",
  "sourceUrl",
  "officialUrl",
  "reviewed",
  "lastVerified",
  "price",
  "category",
  "status",
  "sourceType",
  "image",
  "flag",
  "iata",
  "accent",
]);

/**
 * İç içe veri yapısındaki her metni çevirir; yapısal alanlara dokunmaz.
 * Kaynağı değiştirmez, yeni nesne döndürür.
 */
export function translateDeep<T>(value: T, t: Translate, skip: ReadonlySet<string> = STRUCTURAL_KEYS): T {
  const walk = (v: unknown, key: string | null): unknown => {
    if (typeof v === "string") return key !== null && skip.has(key) ? v : t(v);
    if (Array.isArray(v)) return v.map((item) => walk(item, key));
    if (v && typeof v === "object") {
      return Object.fromEntries(Object.entries(v).map(([k, item]) => [k, walk(item, k)]));
    }
    return v;
  };
  return walk(value, null) as T;
}

/** Çevrilecek bir metin mi? Boş, yalnız sayı/işaret ya da URL olanlar değil. */
export const isTranslatable = (s: string) => /\p{L}/u.test(s) && !/^https?:\/\//.test(s);

/**
 * Çeviri belleğine bakan çevirici. Bulamadığını kaynak dilde bırakır ve
 * `misses`e kaydeder; böylece hem eksik çeviriler hem de bir sayfanın tam
 * çevrilip çevrilmediği aynı mekanizmayla ölçülür. Kaynak Türkçe ise kimlik.
 */
export class Translator {
  readonly misses = new Set<string>();
  constructor(private readonly memory: ReadonlyMap<string, string> | null) {}

  readonly t: Translate = (source) => {
    if (!this.memory || !isTranslatable(source)) return source;
    const hit = this.memory.get(textKey(source));
    if (hit === undefined) {
      this.misses.add(source);
      return source;
    }
    return hit;
  };

  get isIdentity() {
    return this.memory === null;
  }
}

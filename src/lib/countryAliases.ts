import worldCountries from "world-countries";
import { countries, type Country } from "@/data/destinations";
import { SECRET_DESTINATION } from "@/data/secret";
import { slugify } from "@/lib/slug";

/**
 * Ülke adreslerinin diğer yazımları → asıl Türkçe adres.
 *
 * Site Türkçe ve adresler de Türkçe: /portekiz, /japonya, /turkiye. Türk
 * okuyucu "Portekiz gezi rehberi" diye arıyor ve adresteki kelimenin aramayla
 * eşleşmesi sıralamaya yardım ediyor, o yüzden asıl adres bu kalmalı.
 *
 * Ama /portugal yazan biri 404 görmemeli. Bu modül şunları asıl adrese bağlar:
 *   - İngilizce adlar        /portugal, /japan, /united-kingdom
 *   - Resmî adlar            /portuguese-republic
 *   - Yaygın kısaltmalar     /usa, /uk
 *   - Büyük harf, aksan      /Portekiz, /türkiye
 *
 * Yalnızca sunucuda kullanılır ([ulke] sayfaları). world-countries ~1 MB veri;
 * istemci bileşenine import edilmemeli.
 */

/**
 * world-countries'te olmayan ama insanların gerçekten yazdığı adlar.
 * Türkiye'nin ortak adı artık "Türkiye"; düz "Turkey" listede yok.
 */
const EXTRA: Record<string, string[]> = {
  TR: ["Turkey"],
  GB: ["UK", "England"],
};

const ALL: Country[] = [...countries, SECRET_DESTINATION];
const canonicalSlug = (c: Country) => slugify(c.name);

const CANONICAL = new Map(ALL.map((c) => [canonicalSlug(c), c]));

const ALIASES: Map<string, Country> = (() => {
  const map = new Map<string, Country>();
  for (const country of ALL) {
    const wc = worldCountries.find((w) => w.cca2 === country.code);
    const names = wc ? [wc.name.common, wc.name.official, ...wc.altSpellings] : [];
    const extra = EXTRA[country.code] ?? [];

    for (const name of [...names, ...extra]) {
      const slug = slugify(name);
      // İki harfli ISO kodlarını (pt, jp, tr) dışarıda bırak: ileride /tr gibi
      // bir dil yolu açılırsa çakışmasın. Elle eklenen "UK" bunun istisnası.
      if (slug.length < 3 && !extra.includes(name)) continue;
      // Başka bir ülkenin asıl adresini asla gölgeleme.
      if (CANONICAL.has(slug)) continue;
      if (!map.has(slug)) map.set(slug, country);
    }
  }
  return map;
})();

/**
 * Tanınmayan bir ülke adresi için asıl Türkçe slug'ı döndürür; bulunamazsa
 * null. Girdi zaten asıl slug'sa null döner — çağıran tarafta yönlendirme
 * döngüsü oluşmasın diye.
 */
export function canonicalCountrySlug(input: string): string | null {
  let decoded = input;
  try {
    decoded = decodeURIComponent(input);
  } catch {
    /* bozuk kodlama: olduğu gibi dene */
  }
  const normalized = slugify(decoded);
  if (!normalized) return null;

  const alias = ALIASES.get(normalized);
  const target = CANONICAL.has(normalized)
    ? normalized
    : alias
      ? canonicalSlug(alias)
      : null;

  // Girdi zaten asıl adresse yönlendirme yok — döngü olmasın.
  if (!target || target === input) return null;

  /**
   * Yalnızca büyük/küçük harf farkı olan varyantları (/Portekiz) YÖNLENDİRME.
   *
   * Bu yönlendirme sayfayı dinamik çalıştırıyor ve Next sonucu önbelleğe
   * "Portekiz.html" olarak yazıyor. Harf duyarsız bir dosya sisteminde (macOS
   * varsayılanı) bu, önceden üretilmiş gerçek "portekiz.html"in üzerine yazdı:
   * /portekiz kendine yönlenen önbellek kaydını servis etmeye başladı ve
   * sayfa bozuldu. Yerelde birebir yaşandı.
   *
   * Vercel harf duyarlı olduğu için orada büyük ihtimalle olmaz, ama yanılırsak
   * bedeli bir ülke sayfasının kalıcı olarak kırılması — kazancı ise adresi
   * büyük harfle yazan nadir kullanıcı. /portugal ve /türkiye gibi adresler
   * güvenli: önceden üretilmiş hiçbir dosyayla aynı adı taşımıyorlar.
   */
  if (input.toLowerCase() === target) return null;

  return target;
}

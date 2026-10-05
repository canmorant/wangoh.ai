import type { AppLocale } from "./routing";
import { LOCALIZED_SLUGS, SLUG_LOCALES, type SlugLocale } from "./slugs.gen";

/**
 * Dile göre adresler.
 *
 * Uygulamanın İÇ yolları Türkçe slug'larla tutuluyor (route klasörleri,
 * generateStaticParams, kodda yazılan href'ler): /fransa/paris,
 * /gezi-rehberleri. Türkçe sitede dışarıya görünen adres de bu.
 *
 * SLUG_LOCALES'teki dillerde (en, es) ziyaretçinin ve Google'ın gördüğü
 * adres o dilin kelimeleriyle: /en/france/paris, /en/travel-guides,
 * /es/francia/paris. Çeviri iki yönlü ve tamamen bu dosyada:
 *   localizePath  iç yol  → o dildeki yol   (bağlantılar, canonical, hreflang, sitemap)
 *   internalPath  o dildeki yol → iç yol    (proxy rewrite, dil seçici)
 *
 * Kurallar:
 *   - Yalnız ilk iki parça çevrilir: ülke (ya da kurumsal sayfa) ve şehir.
 *   - Haritada olmayan parça olduğu gibi kalır (paris, tests, flags).
 *   - Sorgu (?…) ve #çapa korunur.
 */

/** Kurumsal ve dizin sayfalarının adresleri. Anahtar: iç (Türkçe) parça. */
const STATIC_SEGMENTS: Record<string, Record<SlugLocale, string>> = {
  "gezi-rehberleri": { en: "travel-guides", es: "guias-de-viaje" },
  hakkimizda: { en: "about", es: "sobre-nosotros" },
  iletisim: { en: "contact", es: "contacto" },
  "gizlilik-politikasi": { en: "privacy-policy", es: "politica-de-privacidad" },
  "cerez-politikasi": { en: "cookie-policy", es: "politica-de-cookies" },
  "kullanim-kosullari": { en: "terms-of-use", es: "condiciones-de-uso" },
};

interface Maps {
  /** iç ilk parça → yerel (ülke + kurumsal sayfalar) */
  top: Map<string, string>;
  /** "iç-ülke/iç-şehir" → yerel şehir */
  city: Map<string, string>;
  /** yerel ilk parça → iç */
  topBack: Map<string, string>;
  /** "iç-ülke/yerel-şehir" → iç şehir */
  cityBack: Map<string, string>;
}

const isSlugLocale = (locale: string): locale is SlugLocale =>
  (SLUG_LOCALES as readonly string[]).includes(locale);

const cache = new Map<SlugLocale, Maps>();

function maps(locale: AppLocale): Maps | null {
  if (!isSlugLocale(locale)) return null;
  let m = cache.get(locale);
  if (!m) {
    const table = LOCALIZED_SLUGS[locale] ?? { countries: {}, cities: {} };
    const top = new Map<string, string>([
      ...Object.entries(STATIC_SEGMENTS).map(([k, v]) => [k, v[locale]] as const),
      ...Object.entries(table.countries),
    ]);
    const city = new Map(Object.entries(table.cities));
    m = {
      top,
      city,
      topBack: new Map([...top].map(([internal, local]) => [local, internal])),
      cityBack: new Map(
        [...city].map(([key, local]) => {
          const [country, internal] = key.split("/");
          return [`${country}/${local}`, internal];
        })
      ),
    };
    cache.set(locale, m);
  }
  return m;
}

/** "/a/b?x#y" → ["/a/b", "?x#y"] */
function split(path: string): [string, string] {
  const i = path.search(/[?#]/);
  return i === -1 ? [path, ""] : [path.slice(0, i), path.slice(i)];
}

/** Bu dilde adresler çevriliyor mu? */
export const hasLocalizedPaths = (locale: string): boolean => isSlugLocale(locale);

/** İç (Türkçe) yol → verilen dildeki yol. Önek eklemez: "/fransa/paris" → "/france/paris". */
export function localizePath(path: string, locale: AppLocale): string {
  const m = maps(locale);
  if (!m || !path.startsWith("/")) return path;
  const [pathname, tail] = split(path);
  const segs = pathname.split("/");
  const first = segs[1];
  if (!first) return path;
  if (segs[2]) segs[2] = m.city.get(`${first}/${segs[2]}`) ?? segs[2];
  segs[1] = m.top.get(first) ?? first;
  return segs.join("/") + tail;
}

/** Verilen dildeki yol → iç (Türkçe) yol. "/france/paris" → "/fransa/paris". */
export function internalPath(path: string, locale: AppLocale): string {
  const m = maps(locale);
  if (!m || !path.startsWith("/")) return path;
  const [pathname, tail] = split(path);
  const segs = pathname.split("/");
  if (!segs[1]) return path;
  segs[1] = m.topBack.get(segs[1]) ?? segs[1];
  if (segs[2]) segs[2] = m.cityBack.get(`${segs[1]}/${segs[2]}`) ?? segs[2];
  return segs.join("/") + tail;
}

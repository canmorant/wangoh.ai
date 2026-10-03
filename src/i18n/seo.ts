import type { Metadata } from "next";
import { absolute } from "@/lib/site";
import { getPathname } from "./navigation";
import { routing, type AppLocale } from "./routing";

/** Bir yolun verilen dildeki mutlak adresi. tr öneksiz, diğerleri /en/... */
export const localizedUrl = (path: string, locale: AppLocale) =>
  absolute(getPathname({ href: path, locale }));

/**
 * Arayüzü ve içeriği tamamen çevrilmiş sayfalar (ana sayfa, testler,
 * bayrak oyunu): her dilin kendi canonical'ı var ve hreflang altı dili
 * birden gösteriyor. x-default Türkçe.
 */
export function translatedAlternates(
  path: string,
  locale: AppLocale,
  locales: readonly AppLocale[] = routing.locales
): Metadata["alternates"] {
  return {
    canonical: localizedUrl(path, locale),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localizedUrl(path, l)])),
      "x-default": localizedUrl(path, routing.defaultLocale),
    },
  };
}

/**
 * İçerik sayfaları (rehber, ülke, kurumsal): `available` o sayfanın içeriği
 * TAM çevrilmiş diller (Türkçe her zaman dahil). Bu dillerde sayfa kendi
 * canonical'ıyla dizine açık ve hreflang yalnız bu dilleri listeler; içeriği
 * henüz çevrilmemiş bir dilde turkishOnlySeo geçerli. Böylece arama motoru
 * hiçbir zaman yarım çevrilmiş bir sürüme yönlendirilmez.
 */
export function contentSeo(
  path: string,
  locale: AppLocale,
  available: readonly AppLocale[]
): Pick<Metadata, "alternates" | "robots"> {
  return available.includes(locale)
    ? { alternates: translatedAlternates(path, locale, available) }
    : turkishOnlySeo(path, locale);
}

/**
 * Ana içeriği henüz yalnızca Türkçe olan sayfalar (şehir rehberleri, ülke
 * hub'ları, kurumsal metinler, rehber dizini).
 *
 * Diğer dillerde bu sayfalar yerelleşmiş arayüzle Türkçe içerik gösteriyor.
 * Google'a "İngilizce sürüm" diye Türkçe metin sunmak yinelenen içerik ve
 * yanıltıcı hreflang demek; o yüzden:
 *   - canonical her dilde Türkçe asıl sayfayı gösteriyor,
 *   - hreflang yalnızca gerçekten var olan Türkçeyi bildiriyor,
 *   - Türkçe dışındaki sürümler noindex (bağlantılar yine izleniyor).
 * İçerik çevrildiğinde ilgili sayfa translatedAlternates'e geçirilmeli.
 */
export function turkishOnlySeo(path: string, locale: AppLocale): Pick<Metadata, "alternates" | "robots"> {
  const tr = localizedUrl(path, routing.defaultLocale);
  return {
    alternates: { canonical: tr, languages: { tr, "x-default": tr } },
    ...(locale === routing.defaultLocale ? {} : { robots: { index: false, follow: true } }),
  };
}

/** OpenGraph locale biçimi: tr → tr_TR. */
export const OG_LOCALE: Record<AppLocale, string> = {
  tr: "tr_TR",
  en: "en_US",
  de: "de_DE",
  ru: "ru_RU",
  es: "es_ES",
  fr: "fr_FR",
};

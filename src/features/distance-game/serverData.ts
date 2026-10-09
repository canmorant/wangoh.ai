import { countries } from "@/data/countries";
import { allCountries, citySlug, countrySlug, guideFor } from "@/content/guides";
import { placeName } from "@/content/localized";
import { countryName } from "@/lib/countryNames";
import { TR_CITY_NAMES } from "@/data/worldCityNames";
import type { AppLocale } from "@/i18n/routing";
import { CITIES, cityKey } from "./cities";

/**
 * Oyun sayfasının SUNUCU tarafı verisi (derleme anında üretilir, istemciye
 * yalnız küçük sonuçlar prop olarak iner). İstemci bileşenleri bu dosyayı içe
 * aktarmamalı: rehber ve çeviri belleği megabaytlarca.
 */

/** "ISO2:veri adı" → o şehrin rehberinin iç (Türkçe) yolu. */
export type GuideLinks = Record<string, string>;
/** "ISO2:veri adı" → sitenin kendi (Türkçe) şehir adı; rehberi olanlar için. */
export type GuideNames = Record<string, string>;

interface GuideMatch {
  href: string;
  name: string;
}

let cachedMatches: Record<string, GuideMatch> | undefined;

/**
 * Oyundaki şehirlerden sitenin rehberi olanları eşler. Eşleşme: AYNI ülke
 * kodu ve şehir adı, rehberdeki (Türkçe) adla şu üç yoldan biriyle aynı:
 *   1. veri adının Türkçe tablodaki karşılığı (Münih, Marakeş…),
 *   2. veri adının kendisi (Tokyo, Nice…),
 *   3. rehber adının İngilizce çevirisi (Roma → Rome).
 * Rehberi yazılmamış şehirler (guideFor boş) bağlanmaz. Bağlantı da ad da
 * (guideLinks, guideNames) tek bu eşleşmeden türer; ayrı bir eşleştirme yok.
 */
function guideMatches(): Record<string, GuideMatch> {
  if (cachedMatches) return cachedMatches;
  const matches: Record<string, GuideMatch> = {};
  for (const city of CITIES) {
    const country = allCountries.find((c) => c.code === city.iso2);
    if (!country) continue;
    const key = cityKey(city);
    const turkish = TR_CITY_NAMES[key];
    const match = country.cities.find(
      (c) => c.name === turkish || c.name === city.name || placeName(c.name, "en") === city.name
    );
    if (match && guideFor(country.code, match.name)) {
      matches[key] = { href: `/${countrySlug(country)}/${citySlug(match)}`, name: match.name };
    }
  }
  cachedMatches = matches;
  return matches;
}

/**
 * Rehberi olan şehirlerin bağlantıları. Anahtarlar aynı zamanda oyunun A
 * kademesinin ilk kuralıdır ("rehberi olan şehir tanınır", bkz. cities.ts isTierA).
 */
export function guideLinks(): GuideLinks {
  return Object.fromEntries(Object.entries(guideMatches()).map(([key, m]) => [key, m.href]));
}

/**
 * Rehberi olan şehirlerin sitedeki Türkçe adı. Türkçe arayüzde ekranda bu ad
 * görünür (oyun ile rehber aynı yazımı kullansın); en ve es'te veri adı kalır.
 */
export function guideNames(): GuideNames {
  return Object.fromEntries(Object.entries(guideMatches()).map(([key, m]) => [key, m.name]));
}

/** Oyundaki her ülke kodunun o dildeki adı (repodaki ülke adı çevirileri). */
export function countryNamesFor(locale: AppLocale): Record<string, string> {
  const byIso2 = new Map(countries.map((c) => [c.iso2, c.name]));
  const names: Record<string, string> = {};
  for (const iso2 of new Set(CITIES.map((c) => c.iso2))) {
    names[iso2] = countryName(iso2, locale, byIso2.get(iso2) ?? iso2);
  }
  return names;
}

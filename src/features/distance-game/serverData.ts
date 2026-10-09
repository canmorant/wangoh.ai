import { countries } from "@/data/countries";
import { allCountries, citySlug, countrySlug, guideFor } from "@/content/guides";
import { placeName } from "@/content/localized";
import { countryName } from "@/lib/countryNames";
import { TR_CITY_NAMES } from "@/data/worldCityNames";
import type { AppLocale } from "@/i18n/routing";
import { CITIES } from "./cities";

/**
 * Oyun sayfasının SUNUCU tarafı verisi (derleme anında üretilir, istemciye
 * yalnız küçük sonuçlar prop olarak iner). İstemci bileşenleri bu dosyayı içe
 * aktarmamalı: rehber ve çeviri belleği megabaytlarca.
 */

/** "ISO2:veri adı" → o şehrin rehberinin iç (Türkçe) yolu. */
export type GuideLinks = Record<string, string>;

let cachedLinks: GuideLinks | undefined;

/**
 * Oyundaki şehirlerden sitenin rehberi olanları eşler. Eşleşme: AYNI ülke
 * kodu ve şehir adı, rehberdeki (Türkçe) adla şu üç yoldan biriyle aynı:
 *   1. veri adının Türkçe tablodaki karşılığı (Münih, Marakeş…),
 *   2. veri adının kendisi (Tokyo, Nice…),
 *   3. rehber adının İngilizce çevirisi (Roma → Rome).
 * Rehberi yazılmamış şehirler (guideFor boş) bağlanmaz.
 */
export function guideLinks(): GuideLinks {
  if (cachedLinks) return cachedLinks;
  const links: GuideLinks = {};
  for (const city of CITIES) {
    const country = allCountries.find((c) => c.code === city.iso2);
    if (!country) continue;
    const turkish = TR_CITY_NAMES[`${city.iso2}:${city.name}`];
    const match = country.cities.find(
      (c) => c.name === turkish || c.name === city.name || placeName(c.name, "en") === city.name
    );
    if (match && guideFor(country.code, match.name)) {
      links[`${city.iso2}:${city.name}`] = `/${countrySlug(country)}/${citySlug(match)}`;
    }
  }
  cachedLinks = links;
  return links;
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

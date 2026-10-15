import { countries, type Country } from "@/data/destinations";
import { SECRET_DESTINATION } from "@/data/secret";
import { ORIGIN_CITIES } from "@/data/origins";
import type { AppLocale } from "@/i18n/routing";
import { textKey } from "./core";
import { translationMemory } from "./memory";

export const ALL_DESTINATIONS: Country[] = [...countries, SECRET_DESTINATION];

/** Ana sayfa, ülke görünümleri ve aramanın paylaştığı kısa metinler. */
export function destinationTexts(country: Country): string[] {
  return [
    country.description,
    country.signature,
    country.capital,
    country.gateway,
    ...country.cities.flatMap((city) => [city.name, city.description]),
  ];
}

/** Uzun rehberleri yüklemeden istemciye gereken destinasyon çevirileri. */
export function destinationDictionary(locale: AppLocale): Record<string, string> {
  const memory = translationMemory(locale);
  if (!memory) return {};
  const dict: Record<string, string> = {};
  const texts = [
    ...ALL_DESTINATIONS.flatMap(destinationTexts),
    ...ORIGIN_CITIES.map((city) => city.name),
  ];
  for (const text of texts) {
    const key = textKey(text);
    const hit = memory.get(key);
    if (hit !== undefined) dict[key] = hit;
  }
  return dict;
}

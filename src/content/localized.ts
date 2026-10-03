import { routing, type AppLocale } from "@/i18n/routing";
import type { Country } from "@/data/destinations";
import { textKey, Translator, translateDeep } from "@/content/i18n/core";
import { translationMemory } from "@/content/i18n/memory";
import { ALL_DESTINATIONS, destinationTexts } from "@/content/i18n/sources";
import { DIETARY_KEYS, HUB_KEYS } from "@/content/i18n/keys";
import { buildGuides, guideFor } from "@/content/guides";
import { createGuideContext } from "@/content/guides/context";
import { GUIDE_TEMPLATES } from "@/content/guides/templates";
import type { CityGuide } from "@/content/guides/types";
import { countryHubFor, type CountryHubContent } from "@/content/countryHubs";
import { dietaryGuideFor, type DestinationDietaryGuide } from "@/content/dietary";

/**
 * İçeriğin istenen dildeki hâli — YALNIZCA SUNUCUDA.
 *
 * Her erişim `complete` bilgisini de döndürür: o sayfanın bütün metinleri
 * bu dilde çevrilmiş mi? Sayfalar buna göre karar veriyor:
 *   tam çevrilmiş → kendi canonical'ı, hreflang, dizine açık;
 *   eksik        → Türkçe metin + içerik notu, canonical Türkçe, noindex.
 * Türkçede her şey özgün hâliyle ve her zaman tam.
 */

export interface Localized<T> {
  value: T;
  complete: boolean;
}

/** Yeni bir çevirici; kaçırdıklarını `misses`te toplar. */
export const contentTranslator = (locale: AppLocale) => new Translator(translationMemory(locale));

/* ------------------------------ rehberler ------------------------------ */

const guideCache = new Map<AppLocale, { byKey: Map<string, CityGuide>; missing: Map<string, Set<string>> }>();

function guidesIn(locale: AppLocale) {
  let cached = guideCache.get(locale);
  if (!cached) {
    const ctx = createGuideContext(locale, translationMemory(locale), GUIDE_TEMPLATES[locale]);
    const list = buildGuides(ctx);
    cached = { byKey: new Map(list.map((g) => [`${g.countryCode}:${g.city}`, g])), missing: ctx.missing };
    guideCache.set(locale, cached);
  }
  return cached;
}

export function localizedGuide(countryCode: string, city: string, locale: AppLocale): Localized<CityGuide> | null {
  if (locale === "tr") {
    const guide = guideFor(countryCode, city);
    return guide && { value: guide, complete: true };
  }
  const key = `${countryCode}:${city}`;
  const { byKey, missing } = guidesIn(locale);
  const guide = byKey.get(key);
  return guide ? { value: guide, complete: (missing.get(key)?.size ?? 0) === 0 } : null;
}

/* --------------------- beslenme, ülke sayfası, veri --------------------- */

export function localizedDietary(
  countryCode: string,
  city: string,
  locale: AppLocale
): Localized<DestinationDietaryGuide> | null {
  const entry = dietaryGuideFor(countryCode, city);
  if (!entry) return null;
  if (locale === "tr") return { value: entry, complete: true };
  const tr = contentTranslator(locale);
  const value = translateDeep(entry, tr.t, DIETARY_KEYS);
  return { value, complete: tr.misses.size === 0 };
}

export function localizedHub(countryCode: string, locale: AppLocale): Localized<CountryHubContent> | null {
  const hub = countryHubFor(countryCode);
  if (!hub) return null;
  if (locale === "tr") return { value: hub, complete: true };
  const tr = contentTranslator(locale);
  const value = translateDeep(hub, tr.t, HUB_KEYS);
  return { value, complete: tr.misses.size === 0 };
}

/**
 * Destinasyonun görünen metinleri hedef dilde. `name` alanları (ülke ve
 * şehir) anahtar olduğu için DEĞİŞMEZ; görünen şehir adı için `placeName`.
 */
export function localizedCountry(country: Country, locale: AppLocale): Localized<Country> {
  if (locale === "tr") return { value: country, complete: true };
  const tr = contentTranslator(locale);
  const value: Country = {
    ...country,
    description: tr.t(country.description),
    signature: tr.t(country.signature),
    capital: tr.t(country.capital),
    gateway: tr.t(country.gateway),
    cities: country.cities.map((city) => ({ ...city, description: tr.t(city.description) })),
  };
  for (const city of country.cities) tr.t(city.name);
  return { value, complete: tr.misses.size === 0 };
}

/** Şehir/yer adının görünen hâli ("Lizbon" → "Lisbon"). */
export const placeName = (name: string, locale: AppLocale) => contentTranslator(locale).t(name);

/**
 * İstemci bileşenlerine (ana sayfa, testler) inen destinasyon sözlüğü:
 * Türkçe metnin karması → çevirisi. Yalnız o dilin metinleri gider.
 */
export function destinationDictionary(locale: AppLocale): Record<string, string> {
  const memory = translationMemory(locale);
  if (!memory) return {};
  const dict: Record<string, string> = {};
  for (const country of ALL_DESTINATIONS) {
    for (const text of destinationTexts(country)) {
      const key = textKey(text);
      const hit = memory.get(key);
      if (hit !== undefined) dict[key] = hit;
    }
  }
  return dict;
}

/* ------------------- bir sayfanın tam çevrildiği diller ------------------- */

/** Şehir sayfası: rehber, beslenme önerileri ve destinasyon metinleri. */
export function cityPageLocales(country: Country, city: string): AppLocale[] {
  return routing.locales.filter(
    (locale) =>
      locale === "tr" ||
      ((localizedGuide(country.code, city, locale)?.complete ?? true) &&
        (localizedDietary(country.code, city, locale)?.complete ?? true) &&
        localizedCountry(country, locale).complete)
  );
}

/** Ülke sayfası: hub metinleri ve destinasyon metinleri. */
export function countryPageLocales(country: Country): AppLocale[] {
  return routing.locales.filter(
    (locale) =>
      locale === "tr" ||
      ((localizedHub(country.code, locale)?.complete ?? true) && localizedCountry(country, locale).complete)
  );
}

/** Rehber dizini: yalnız yer adları. */
export function guideIndexLocales(): AppLocale[] {
  return routing.locales.filter(
    (locale) => locale === "tr" || ALL_DESTINATIONS.every((country) => localizedCountry(country, locale).complete)
  );
}

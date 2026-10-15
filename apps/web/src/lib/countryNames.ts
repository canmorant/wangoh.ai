import type { AppLocale } from "@/i18n/routing";
import { COUNTRY_NAMES, type ForeignLocale } from "./countryNames.gen";

/**
 * world-countries'in ISO kaydından farklı gösterilmesi gereken yerler.
 * SJ: ISO kaydı "Svalbard ve Jan Mayen"; sitedeki gizli rota yalnızca
 * Svalbard takımadası. Rusçada takımadanın yerleşik adı Шпицберген.
 */
const NAME_OVERRIDES: Partial<Record<string, Partial<Record<ForeignLocale, string>>>> = {
  SJ: { en: "Svalbard", de: "Svalbard", ru: "Шпицберген", es: "Svalbard", fr: "Svalbard" },
};

/**
 * Ülke adının görünen hâli, dile göre.
 *
 * Türkçede projenin kendi verisindeki ad aynen kullanılıyor (davranış
 * değişmesin). Diğer dillerde world-countries'in resmî çevirisi; bulunamazsa
 * Türkçe ada düşülüyor.
 *
 * ÖNEMLİ: Bu yalnızca GÖRÜNEN ad. Slug'lar ve eşleştirmeler hâlâ Türkçe
 * `country.name` üzerinden; o alan hiçbir dilde değiştirilmemeli.
 */
export function countryName(code: string, locale: AppLocale, turkishName: string): string {
  if (locale === "tr") return turkishName;
  const l = locale as ForeignLocale;
  return NAME_OVERRIDES[code]?.[l] ?? COUNTRY_NAMES[code]?.[l] ?? turkishName;
}

/**
 * Kart başlıkları gibi dar yerler için kısa ad. Türkçede veride shortName
 * yalnızca üç ülke için var (Amerika, Japonya, Çekya); ABD'nin tam adı her
 * dilde başlığa sığmayacak kadar uzun, onun için yerleşik kısaltmalar.
 */
const SHORT: Partial<Record<string, Partial<Record<ForeignLocale, string>>>> = {
  US: { en: "USA", de: "USA", ru: "США", es: "EE. UU.", fr: "États-Unis" },
};

export function countryShortName(
  code: string,
  locale: AppLocale,
  turkishName: string,
  turkishShortName?: string
): string {
  if (locale === "tr") return turkishShortName || turkishName;
  return SHORT[code]?.[locale as ForeignLocale] ?? countryName(code, locale, turkishName);
}

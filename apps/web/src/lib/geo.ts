import type { useTranslations } from "next-intl";

/**
 * Kıta ve alt bölge adları.
 *
 * world-countries bu alanları yalnızca İngilizce tutuyor ve paket içinde
 * çevirileri yok. Çeviriler messages/*.json'da (Geo namespace); bu dosya
 * yalnızca veri kümesindeki İngilizce değerden mesaj anahtarına eşleme yapıyor.
 * Hem çark hem bayrak oyunu bunu kullanıyor.
 *
 * Eşlemede olmayan bir değer gelirse olduğu gibi (İngilizce) gösterilir.
 */

const CONTINENT_KEYS = {
  Africa: "africa",
  Americas: "americas",
  Asia: "asia",
  Europe: "europe",
  Oceania: "oceania",
  Antarctic: "antarctic",
} as const;

const SUBREGION_KEYS = {
  "Australia and New Zealand": "australiaNewZealand",
  Caribbean: "caribbean",
  "Central America": "centralAmerica",
  "Central Asia": "centralAsia",
  "Central Europe": "centralEurope",
  "Eastern Africa": "easternAfrica",
  "Eastern Asia": "easternAsia",
  "Eastern Europe": "easternEurope",
  Melanesia: "melanesia",
  Micronesia: "micronesia",
  "Middle Africa": "middleAfrica",
  "North America": "northAmerica",
  "Northern Africa": "northernAfrica",
  "Northern Europe": "northernEurope",
  Polynesia: "polynesia",
  "South America": "southAmerica",
  "South-Eastern Asia": "southEasternAsia",
  "Southeast Europe": "southeastEurope",
  "Southern Africa": "southernAfrica",
  "Southern Asia": "southernAsia",
  "Southern Europe": "southernEurope",
  "Western Africa": "westernAfrica",
  "Western Asia": "westernAsia",
  "Western Europe": "westernEurope",
} as const;

type GeoT = ReturnType<typeof useTranslations<"Geo">>;

export function continentLabel(value: string, t: GeoT): string {
  const key = CONTINENT_KEYS[value as keyof typeof CONTINENT_KEYS];
  return key ? t(`continent.${key}`) : value;
}

export function subregionLabel(value: string, t: GeoT): string {
  const key = SUBREGION_KEYS[value as keyof typeof SUBREGION_KEYS];
  return key ? t(`subregion.${key}`) : value;
}

import type { Country } from "@/data/destinations";
import { allCountries } from "@/content/guides";

/**
 * Ülkelerin bölgeleri: rehber dizinini bölge bölge gruplamak ve ülke
 * sayfalarından aynı bölgedeki diğer ülke rehberlerine bağlantı vermek için.
 * Şehir → ülke → bölge → komşu ülkeler zinciri, sitenin konu kümelerini
 * hem okura hem arama motoruna gösteriyor.
 *
 * Türkiye ve Rusya iki kıtaya yayılıyor; seyahat rehberciliğindeki yaygın
 * kullanımla Avrupa grubunda. Svalbard Norveç'e bağlı, Avrupa'da.
 */
export const REGIONS = ["europe", "asia", "americas", "africa"] as const;
export type Region = (typeof REGIONS)[number];

const REGION_OF: Record<string, Region> = {
  AE: "asia", GE: "asia", BG: "europe", MT: "europe", CY: "europe",
  EG: "africa", MA: "africa",
  IT: "europe", FR: "europe", ES: "europe", TR: "europe", GB: "europe", NL: "europe",
  AT: "europe", PT: "europe", DE: "europe", CH: "europe", BE: "europe", HU: "europe",
  CZ: "europe", PL: "europe", RU: "europe", RS: "europe", ME: "europe", BA: "europe",
  AL: "europe", GR: "europe", HR: "europe", SI: "europe", NO: "europe", SE: "europe",
  DK: "europe", FI: "europe", SJ: "europe",
  JP: "asia", TH: "asia", KR: "asia", ID: "asia", CN: "asia",
  US: "americas", MX: "americas", BR: "americas", AR: "americas", CA: "americas",
};

export function regionOf(country: Country): Region {
  const region = REGION_OF[country.code];
  if (!region) throw new Error(`Bölgesi tanımsız ülke: ${country.code}`);
  return region;
}

/** Bölgeler ve içindeki ülkeler, verideki sırayla. */
export const countriesByRegion = (): { region: Region; countries: Country[] }[] =>
  REGIONS.map((region) => ({
    region,
    countries: allCountries.filter((c) => regionOf(c) === region),
  }));

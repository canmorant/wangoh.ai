import type { Country } from "@/data/destinations";
import { allCountries } from "@/content/guides";
import { REGIONS, REGION_OF, type Region } from "@/data/continents";

/**
 * Ülkelerin bölgeleri: rehber dizinini bölge bölge gruplamak ve ülke
 * sayfalarından aynı bölgedeki diğer ülke rehberlerine bağlantı vermek için.
 * Şehir → ülke → bölge → komşu ülkeler zinciri, sitenin konu kümelerini
 * hem okura hem arama motoruna gösteriyor.
 *
 * Türkiye ve Rusya iki kıtaya yayılıyor; seyahat rehberciliğindeki yaygın
 * kullanımla Avrupa grubunda. Svalbard Norveç'e bağlı, Avrupa'da.
 */
export { REGIONS, type Region };

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

import { countries, type Country } from "./destinations";

/**
 * Ülkelerin kıtaları (bölgeleri). Bu dosya bilerek HAFİF: @/content/guides içe
 * aktarmıyor, çünkü ana sayfanın istemci paketine giriyor (bkz. HomeExperience).
 * src/content/regions.ts rehber tarafında aynı veriyi buradan alıyor.
 *
 * Türkiye ve Rusya iki kıtaya yayılıyor; seyahat rehberciliğindeki yaygın
 * kullanımla Avrupa grubunda. Svalbard Norveç'e bağlı, Avrupa'da. Amerika kıtası
 * Kuzey, Orta ve Güney Amerika'yı birlikte taşır.
 */
export const REGIONS = ["europe", "asia", "americas", "africa"] as const;
export type Region = (typeof REGIONS)[number];

export const REGION_OF: Record<string, Region> = {
  AE: "asia", GE: "asia", BG: "europe", MT: "europe", CY: "europe",
  EG: "africa", MA: "africa",
  IT: "europe", FR: "europe", ES: "europe", TR: "europe", GB: "europe", NL: "europe",
  AT: "europe", PT: "europe", DE: "europe", CH: "europe", BE: "europe", HU: "europe",
  CZ: "europe", PL: "europe", RU: "europe", RS: "europe", ME: "europe", BA: "europe",
  AL: "europe", GR: "europe", HR: "europe", SI: "europe", NO: "europe", SE: "europe",
  DK: "europe", FI: "europe", SJ: "europe",
  JP: "asia", TH: "asia", KR: "asia", ID: "asia", CN: "asia", VN: "asia",
  US: "americas", MX: "americas", BR: "americas", AR: "americas", CA: "americas",
};

/** "Regions" ad alanındaki anahtarlar; şablon dizgisi yerine açık eşleme, çünkü tür denetimi birleşimi çözemiyor. */
export const REGION_NAME_KEY = {
  europe: "europe.name",
  asia: "asia.name",
  americas: "americas.name",
  africa: "africa.name",
} as const satisfies Record<Region, string>;

export const isRegion = (value: string | null | undefined): value is Region =>
  !!value && (REGIONS as readonly string[]).includes(value);

/** Ana sayfadaki ülke listesinden (rehbersiz olanlar dahil) bir kıtanın ülkeleri, verideki sırayla. */
export const homeCountriesOf = (region: Region): Country[] =>
  countries.filter((c) => REGION_OF[c.code] === region);

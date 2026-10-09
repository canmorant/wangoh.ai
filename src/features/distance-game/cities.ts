import rawCities from "@/data/worldCities.json";

/**
 * Şehir verisi (src/data/worldCities.json; scripts/gen-world-cities.mjs üretir).
 * Bu modül yalnız oyun sayfasının paketine girer; ana sayfa içe aktarmaz.
 */
export interface City {
  /** Veri içindeki sıra; oturumda tekrar denetimi için. */
  id: number;
  /** Veri adı (İngilizce/yerel). Görünen ad için cityDisplayName. */
  name: string;
  iso2: string;
  lat: number;
  lng: number;
  /** Nüfus, bin kişi. */
  popK: number;
  capital: boolean;
}

type Row = [name: string, iso2: string, lat: number, lng: number, popK: number, capital: 0 | 1];

export const CITIES: readonly City[] = (rawCities as unknown as Row[]).map(
  ([name, iso2, lat, lng, popK, capital], id) => ({ id, name, iso2, lat, lng, popK, capital: capital === 1 })
);

/** Oyundaki şehrin sözlük anahtarı: "ISO2:veri adı" (rehber bağlantıları ve adları bununla aranır). */
export const cityKey = (c: Pick<City, "iso2" | "name">) => `${c.iso2}:${c.name}`;

/**
 * Soruya girebilen en küçük şehir: başkent (nüfusu ne olursa olsun) ya da
 * nüfusu en az 100.000. Nüfusu 100.000'in altındaki başkent olmayan yer
 * (veri, ülke başına 5 şehre tamamlansın diye bunlardan da taşır) hiçbir
 * soruda çıkmaz; rehberi olsa da.
 */
export const RELAXED_POP_K = 100;
export const isEligible = (c: City) => c.capital || c.popK >= RELAXED_POP_K;

/**
 * B kademesi ("bilinen"): başkent ya da nüfusu en az 500.000. Soruların yalnız
 * gevşek turunda (%10) bir ucu A'dan değil B'den gelebilir.
 */
export const KNOWN_POP_K = 500;
export const isTierB = (c: City) => c.capital || c.popK >= KNOWN_POP_K;

/**
 * A kademesi ("tanınan"): soruların %90'ında iki şehir de buradan gelir.
 * Nüfus, ünlülük için kötü bir ölçüt (Nelspruit, Ta'izz, Porto-Novo...); o yüzden
 * önce sitenin kendi rehberi olan şehirler (gezgin bunları bilir), sonra büyük
 * başkentler ve çok büyük şehirler:
 *   1. sitenin rehberi olan şehir (`guided`: serverData.guideLinks anahtarları), VEYA
 *   2. başkent ve nüfusu en az 1.000.000, VEYA
 *   3. nüfusu en az 2.000.000.
 * Hepsi için önce isEligible geçerli (nüfusu < 100 bin olan yalnız başkentse çıkar).
 */
export const FAMOUS_CAPITAL_POP_K = 1000;
export const FAMOUS_POP_K = 2000;
export function isTierA(c: City, guided?: ReadonlySet<string>): boolean {
  if (!isEligible(c)) return false;
  return (guided?.has(cityKey(c)) ?? false) || (c.capital && c.popK >= FAMOUS_CAPITAL_POP_K) || c.popK >= FAMOUS_POP_K;
}

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

/** "Tanınan" şehir: başkent ya da nüfusu en az 500.000. */
export const RECOGNIZED_POP_K = 500;
export const isRecognized = (c: City) => c.capital || c.popK >= RECOGNIZED_POP_K;

/**
 * Nadir "gevşek" turlarda da çıkabilen şehir: başkent (nüfusu ne olursa olsun)
 * ya da nüfusu en az 100.000. Nüfusu 100.000'in altındaki başkent olmayan yer
 * hiçbir soruda çıkmaz.
 */
export const RELAXED_POP_K = 100;
export const isEligible = (c: City) => c.capital || c.popK >= RELAXED_POP_K;

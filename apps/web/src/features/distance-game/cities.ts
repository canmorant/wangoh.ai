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
 * Soruya girebilen en küçük şehir: başkent (nüfusu ne olursa olsun), nüfusu en
 * az 100.000 ya da sitenin REHBERİ OLAN şehri (nüfusu ne olursa olsun: Hvar,
 * Zermatt, Larnaka...). Bunların dışındaki yerler (veri, ülke başına 5 şehre
 * tamamlansın diye küçük şehirlerden de taşır) hiçbir soruda çıkmaz.
 */
export const RELAXED_POP_K = 100;
export const isGuided = (c: Pick<City, "iso2" | "name">, guided?: ReadonlySet<string>) =>
  guided?.has(cityKey(c)) ?? false;
export const isEligible = (c: City, guided?: ReadonlySet<string>) =>
  c.capital || c.popK >= RELAXED_POP_K || isGuided(c, guided);

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
 *   1. sitenin rehberi olan şehir (`guided`: serverData.guideLinks anahtarları),
 *      nüfusu ne olursa olsun: rehberli şehir = HER ZAMAN A, VEYA
 *   2. başkent ve nüfusu en az 1.000.000, VEYA
 *   3. nüfusu en az 2.000.000.
 * 2. ve 3. kural için önce isEligible geçerli.
 */
export const FAMOUS_CAPITAL_POP_K = 1000;
export const FAMOUS_POP_K = 2000;
export function isTierA(c: City, guided?: ReadonlySet<string>): boolean {
  if (isGuided(c, guided)) return true;
  if (!isEligible(c)) return false;
  return (c.capital && c.popK >= FAMOUS_CAPITAL_POP_K) || c.popK >= FAMOUS_POP_K;
}

/**
 * "Güçlü" A şehri: ortalama gezginin adını duyduğu yer. Yalnız nüfusu en az
 * 2.000.000 olan şehirler ve nüfusu en az 100.000 olan REHBERLİ şehirler.
 * A'nın geri kalanı "zayıf"tır: nüfusu 1–2 milyon olan rehbersiz başkentler
 * (Bamako, Konakri, Vagadugu...) ve küçük rehberli yerler (Hvar, Giethoorn...).
 * Soru seçici her soruda en az bir ucun güçlü olmasını ister; böylece iki
 * zayıf uç yan yana gelmez (Bamako–Konakri).
 */
export const STRONG_GUIDED_MIN_POP_K = 100;
export function isStrong(c: City, guided?: ReadonlySet<string>): boolean {
  return c.popK >= FAMOUS_POP_K || (isGuided(c, guided) && c.popK >= STRONG_GUIDED_MIN_POP_K);
}

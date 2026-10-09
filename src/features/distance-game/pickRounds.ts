import { CITIES, cityKey, isStrong, isTierA, isTierB, type City } from "./cities";
import { haversineKm } from "./haversine";
import { ROUNDS_PER_GAME } from "./scoring";

/* ------------------------------------------------------------------ *
 *  Soru seçimi
 *
 *  Kurallar (hepsi bir oyun için; varsayılan 10 tur):
 *   - Turların %90'ında iki şehir de A kademesinden (bkz. cities.ts isTierA:
 *     sitenin rehberi olan şehirler, ≥ 1 milyonluk başkentler, ≥ 2 milyonluk
 *     şehirler). Kalan %10'da (10 turda 1) "gevşek" tur: bir şehir B kademesinden
 *     (başkent ya da ≥ 500 bin; A'da olmayan), öteki yine A'dan. Böylece bir
 *     soruda en çok bir ucu görece az bilinir. Nüfusu 100 bin altındaki yer yalnız
 *     başkentse çıkar (cities.ts isEligible); rehberi olsa da.
 *   - Aynı ülkeden iki şehir sorusu en fazla %10 (10 turda en çok 1; yarı
 *     olasılıkla hiç yok).
 *   - Mesafe kovaları dengeli: kısa (<1000 km), orta (1000–5000), uzun (>5000).
 *   - Oturumda bir şehir iki kez çıkmaz; bir oyundaki iki şehir birbirine
 *     MIN_SEPARATION_KM'den yakın olmaz (Tokyo ve Yokohama aynı oyunda iki ayrı
 *     soruda çıkmaz) ve bir ülkeden en çok MAX_PER_COUNTRY şehir gelir.
 *   - Her soruda en az bir uç "güçlü" (cities.ts isStrong: ≥ 2 milyon ya da
 *     rehberli ve ≥ 100 bin). İki zayıf uç (Bamako–Konakri, Hvar–Kranjska Gora)
 *     hiç yan yana gelmez; bir oyunda en çok MAX_WEAK_PER_GAME zayıf A şehri çıkar.
 *   - `seed` verilirse sonuç deterministik; verilmezse Math.random.
 *
 *  Adalet: şehirler tek tek eşit olasılıkla seçilseydi 350 Çin ve 330 Hint
 *  şehri soruları doldururdu. Önce ülke (güçlü şehirleri tam, zayıf şehirleri
 *  yarım sayan toplamın kareköküyle ağırlıklı), sonra ülke içinde şehir (başkent
 *  ağırlığı 2, rehberli şehir ağırlığı 2, nüfusun kareköküyle) seçilir. Ülke
 *  başına tek zayıf şehri olan ülkeler (çoğu küçük ülke başkenti) böylece
 *  bir güçlü şehri olan ülkeden de az çıkar.
 * ------------------------------------------------------------------ */

export type Bucket = "short" | "mid" | "long";

export interface Round {
  a: City;
  b: City;
  /** Gerçek mesafe, km (tam sayıya yuvarlanmış; ekran ve puan bunu kullanır). */
  km: number;
  bucket: Bucket;
  /** Gevşek tur mu (bir şehir A kademesi dışından, B'den gelir)? */
  relaxed: boolean;
  sameCountry: boolean;
}

export interface PickOptions {
  /** Verilirse deterministik; verilmezse Math.random. */
  seed?: number;
  rounds?: number;
  cities?: readonly City[];
  /**
   * Sitenin rehberi olan şehirlerin anahtarları ("ISO2:veri adı"; serverData.guideLinks'in
   * anahtarları). A kademesinin birinci kuralı; verilmezse yalnız nüfus kuralları geçerli.
   */
  guided?: ReadonlySet<string>;
}

/** Soru mesafelerinin alt sınırı: kaydırıcının (10 km) hemen üstünde, tahmin edilebilir. */
export const MIN_QUESTION_KM = 50;
export const SHORT_MAX_KM = 1000;
export const MID_MAX_KM = 5000;
/** Gevşek turların payı. */
export const RELAXED_SHARE = 0.1;
/** Bir oyunda aynı ülkeden iki şehir sorusu payı üst sınırı. */
export const SAME_COUNTRY_MAX_SHARE = 0.1;
/** Aynı ülke sorusu olacak oyunların oranı (olursa en çok SAME_COUNTRY_MAX_SHARE). */
const SAME_COUNTRY_GAME_PROBABILITY = 0.5;
/** Bir oyundaki iki şehir (farklı sorularda) birbirine bu kadar km'den yakın olmaz. */
export const MIN_SEPARATION_KM = 100;
/** Bir oyunda aynı ülkeden en çok bu kadar şehir (aynı ülke sorusu bunun ikisini kullanır). */
export const MAX_PER_COUNTRY = 2;
/** Zayıf bir şehrin ülke ağırlığına katkısı (güçlü şehir 1). */
const WEAK_COUNTRY_WEIGHT = 0.5;
/** A kademesinde tek şehri olan bir ülkenin ağırlık çarpanı (Kabil, Bamako...: sayıca çok ama tek tek sönük). */
const SINGLETON_COUNTRY_FACTOR = 0.5;
/** Bir oyunda en çok bu kadar "zayıf" A şehri (küçük rehberli yerler, rehbersiz 1–2 milyonluk başkentler). */
export const MAX_WEAK_PER_GAME = 1;

export const bucketOf = (km: number): Bucket => (km < SHORT_MAX_KM ? "short" : km <= MID_MAX_KM ? "mid" : "long");

/** mulberry32: küçük, hızlı, tohumdan deterministik. */
export function makeRng(seed?: number): () => number {
  if (seed === undefined) return Math.random;
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Ağırlıklı seçim; ağırlıklar 0'dan büyük. */
function weighted<T>(items: readonly T[], weight: (item: T) => number, rng: () => number): T {
  let total = 0;
  const weights = items.map((item) => {
    const w = weight(item);
    total += w;
    return w;
  });
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r < 0) return items[i];
  }
  return items[items.length - 1];
}

/** Önce ülke, sonra şehir. Boş listede undefined. */
function pickCity(
  candidates: readonly City[],
  rng: () => number,
  guided: ReadonlySet<string> | undefined,
  singletons: ReadonlySet<string>
): City | undefined {
  if (candidates.length === 0) return undefined;
  const byCountry = new Map<string, City[]>();
  for (const c of candidates) {
    const list = byCountry.get(c.iso2);
    if (list) list.push(c);
    else byCountry.set(c.iso2, [c]);
  }
  const countryCities = weighted(
    [...byCountry.values()],
    (list) =>
      Math.sqrt(list.reduce((sum, c) => sum + (isStrong(c, guided) ? 1 : WEAK_COUNTRY_WEIGHT), 0)) *
      (singletons.has(list[0].iso2) ? SINGLETON_COUNTRY_FACTOR : 1),
    rng
  );
  return weighted(
    countryCities,
    (c) => (c.capital ? 2 : 1) * (guided?.has(cityKey(c)) ? 2 : 1) * Math.sqrt(c.popK + 100),
    rng
  );
}

interface Spec {
  bucket: Bucket;
  relaxed: boolean;
  sameCountry: boolean;
}

/** n tur için kova sayıları: eşit bölüş, artan her fazlalık rastgele bir kovaya. */
function bucketPlan(rounds: number, rng: () => number): Bucket[] {
  const base = Math.floor(rounds / 3);
  const buckets: Bucket[] = ["short", "mid", "long"];
  const counts: Record<Bucket, number> = { short: base, mid: base, long: base };
  for (const b of shuffle([...buckets], rng).slice(0, rounds - base * 3)) counts[b]++;
  return shuffle(buckets.flatMap((b) => Array<Bucket>(counts[b]).fill(b)), rng);
}

export function pickRounds(options: PickOptions = {}): Round[] {
  const { seed, rounds = ROUNDS_PER_GAME, cities = CITIES, guided } = options;
  const rng = makeRng(seed);

  const famous = cities.filter((c) => isTierA(c, guided));
  // A kademesinde tek şehri olan ülkeler.
  const perCountryA = new Map<string, number>();
  for (const c of famous) perCountryA.set(c.iso2, (perCountryA.get(c.iso2) ?? 0) + 1);
  const singletons: ReadonlySet<string> = new Set([...perCountryA].filter(([, n]) => n === 1).map(([k]) => k));
  const isWeak = (c: City) => isTierA(c, guided) && !isStrong(c, guided);
  // Gevşek turun A dışı ucu: B kademesinden, A'da olmayan (küçük başkent, 500 bin – 2 milyon arası şehir).
  const outsiders = cities.filter((c) => isTierB(c) && !isTierA(c, guided));

  const buckets = bucketPlan(rounds, rng);
  const relaxedCount = Math.round(rounds * RELAXED_SHARE);
  const relaxedSlots = new Set(shuffle([...buckets.keys()], rng).slice(0, relaxedCount));

  // Aynı ülke sorusu: en çok payın izin verdiği kadar, kısa kovadaki (gevşek olmayan) bir yerde.
  const sameCountryMax = Math.floor(rounds * SAME_COUNTRY_MAX_SHARE);
  const sameCountrySlots = new Set<number>();
  if (sameCountryMax > 0 && rng() < SAME_COUNTRY_GAME_PROBABILITY) {
    const slots = [...buckets.keys()].filter((i) => buckets[i] === "short" && !relaxedSlots.has(i));
    for (const i of shuffle(slots, rng).slice(0, sameCountryMax)) sameCountrySlots.add(i);
  }

  const used = new Set<number>();
  const usedCities: City[] = [];
  let weakUsed = 0;
  const countryUse = new Map<string, number>();
  const result: Round[] = [];

  const room = (c: City) => (countryUse.get(c.iso2) ?? 0) < MAX_PER_COUNTRY && (weakUsed < MAX_WEAK_PER_GAME || !isWeak(c));
  const apart = (c: City) => usedCities.every((u) => haversineKm(u.lat, u.lng, c.lat, c.lng) >= MIN_SEPARATION_KM);

  const fits = (a: City, b: City, spec: Spec, strict: boolean): number | null => {
    if (a.id === b.id || used.has(b.id) || a.name === b.name) return null;
    if (strict && (a.iso2 === b.iso2) !== spec.sameCountry) return null;
    // Aynı ülkeden iki uç ancak o ülkeden hiç şehir kullanılmamışsa (ikisi birden bir yuvayı doldurur).
    if (a.iso2 === b.iso2 && (countryUse.get(a.iso2) ?? 0) + 2 > MAX_PER_COUNTRY) return null;
    // Her soruda en az bir güçlü uç: iki zayıf uç (Bamako–Konakri) yan yana gelmez.
    if (!isStrong(a, guided) && !isStrong(b, guided)) return null;
    if (!room(b) || !apart(b)) return null;
    const km = Math.round(haversineKm(a.lat, a.lng, b.lat, b.lng));
    if (km < MIN_QUESTION_KM) return null;
    if (strict && bucketOf(km) !== spec.bucket) return null;
    return km;
  };

  for (let i = 0; i < buckets.length; i++) {
    const spec: Spec = { bucket: buckets[i], relaxed: relaxedSlots.has(i), sameCountry: sameCountrySlots.has(i) };
    // Eş her zaman A'dan; gevşek turda ilk şehir B'den (A dışı).
    const pool = famous.filter((c) => !used.has(c.id));
    const firstPool = (spec.relaxed ? outsiders : famous).filter((c) => !used.has(c.id) && room(c) && apart(c));

    let round: Round | null = null;
    // 1) Tüm kurallar; 2) kova/ülke kuralı gevşetilmiş (havuz bu kadar daralırsa; pratikte hiç gerekmez).
    for (const strict of [true, false]) {
      for (let attempt = 0; attempt < 300 && !round; attempt++) {
        const a = pickCity(firstPool, rng, guided, singletons);
        if (!a) break;
        const options: { b: City; km: number }[] = [];
        for (const b of pool) {
          const km = fits(a, b, spec, strict);
          if (km !== null) options.push({ b, km });
        }
        const chosen = pickCity(options.map((o) => o.b), rng, guided, singletons);
        if (!chosen) continue;
        const km = options.find((o) => o.b.id === chosen.id)!.km;
        // Ekranda hangi şehrin önce göründüğü de rastgele.
        const [first, second] = rng() < 0.5 ? [a, chosen] : [chosen, a];
        round = {
          a: first,
          b: second,
          km,
          bucket: bucketOf(km),
          relaxed: spec.relaxed,
          sameCountry: a.iso2 === chosen.iso2,
        };
      }
      if (round) break;
    }
    if (!round) throw new Error("pickRounds: uygun şehir çifti bulunamadı");
    for (const c of [round.a, round.b]) {
      if (isWeak(c)) weakUsed++;
      used.add(c.id);
      usedCities.push(c);
      countryUse.set(c.iso2, (countryUse.get(c.iso2) ?? 0) + 1);
    }
    result.push(round);
  }
  return result;
}

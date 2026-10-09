import { CITIES, isEligible, isRecognized, type City } from "./cities";
import { haversineKm } from "./haversine";
import { ROUNDS_PER_GAME } from "./scoring";

/* ------------------------------------------------------------------ *
 *  Soru seçimi
 *
 *  Kurallar (hepsi bir oyun için; varsayılan 10 tur):
 *   - Turların %90'ında iki şehir de "tanınan" (başkent ya da ≥ 500 bin).
 *     Kalan %10'da (10 turda 1) başkentler / orta boy şehirler de çıkabilir;
 *     o turda en az bir şehir tanınanlar dışından gelir. Nüfusu 100 bin
 *     altındaki yer yalnız başkentse çıkabilir (bkz. cities.ts isEligible).
 *   - Aynı ülkeden iki şehir sorusu en fazla %10 (10 turda en çok 1; yarı
 *     olasılıkla hiç yok).
 *   - Mesafe kovaları dengeli: kısa (<1000 km), orta (1000–5000), uzun (>5000).
 *   - Oturumda bir şehir iki kez çıkmaz.
 *   - `seed` verilirse sonuç deterministik; verilmezse Math.random.
 *
 *  Adalet: şehirler tek tek eşit olasılıkla seçilseydi 350 Çin ve 330 Hint
 *  şehri soruları doldururdu. Önce ülke (kullanılabilir şehir sayısının kareköküyle
 *  ağırlıklı), sonra ülke içinde şehir (başkent ağırlığı 2, nüfusun kareköküyle)
 *  seçilir.
 * ------------------------------------------------------------------ */

export type Bucket = "short" | "mid" | "long";

export interface Round {
  a: City;
  b: City;
  /** Gerçek mesafe, km (tam sayıya yuvarlanmış; ekran ve puan bunu kullanır). */
  km: number;
  bucket: Bucket;
  /** Gevşek tur mu (tanınan olmayan şehir de çıkabilir)? */
  relaxed: boolean;
  sameCountry: boolean;
}

export interface PickOptions {
  /** Verilirse deterministik; verilmezse Math.random. */
  seed?: number;
  rounds?: number;
  cities?: readonly City[];
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
function pickCity(candidates: readonly City[], rng: () => number): City | undefined {
  if (candidates.length === 0) return undefined;
  const byCountry = new Map<string, City[]>();
  for (const c of candidates) {
    const list = byCountry.get(c.iso2);
    if (list) list.push(c);
    else byCountry.set(c.iso2, [c]);
  }
  const countryCities = weighted([...byCountry.values()], (list) => Math.sqrt(list.length), rng);
  return weighted(countryCities, (c) => (c.capital ? 2 : 1) * Math.sqrt(c.popK + 100), rng);
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
  const { seed, rounds = ROUNDS_PER_GAME, cities = CITIES } = options;
  const rng = makeRng(seed);

  const recognized = cities.filter(isRecognized);
  const eligible = cities.filter(isEligible);
  // Gevşek turun "tanınan olmayan" ucu: orta boy şehir ya da küçük başkent.
  const outsiders = eligible.filter((c) => !isRecognized(c));

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
  const result: Round[] = [];

  const fits = (a: City, b: City, spec: Spec, strict: boolean): number | null => {
    if (a.id === b.id || used.has(b.id) || a.name === b.name) return null;
    if (strict && (a.iso2 === b.iso2) !== spec.sameCountry) return null;
    const km = Math.round(haversineKm(a.lat, a.lng, b.lat, b.lng));
    if (km < MIN_QUESTION_KM) return null;
    if (strict && bucketOf(km) !== spec.bucket) return null;
    return km;
  };

  for (let i = 0; i < buckets.length; i++) {
    const spec: Spec = { bucket: buckets[i], relaxed: relaxedSlots.has(i), sameCountry: sameCountrySlots.has(i) };
    const pool = (spec.relaxed ? eligible : recognized).filter((c) => !used.has(c.id));
    const firstPool = (spec.relaxed ? outsiders : recognized).filter((c) => !used.has(c.id));

    let round: Round | null = null;
    // 1) Tüm kurallar; 2) kova/ülke kuralı gevşetilmiş (havuz bu kadar daralırsa; pratikte hiç gerekmez).
    for (const strict of [true, false]) {
      for (let attempt = 0; attempt < 300 && !round; attempt++) {
        const a = pickCity(firstPool, rng);
        if (!a) break;
        const options: { b: City; km: number }[] = [];
        for (const b of pool) {
          const km = fits(a, b, spec, strict);
          if (km !== null) options.push({ b, km });
        }
        const chosen = pickCity(options.map((o) => o.b), rng);
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
    used.add(round.a.id);
    used.add(round.b.id);
    result.push(round);
  }
  return result;
}

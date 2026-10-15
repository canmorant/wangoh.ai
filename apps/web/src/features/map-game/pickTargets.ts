import { CITIES, cityKey, isEligible, isGuided, type City } from "../distance-game/cities";
import { haversineKm } from "../distance-game/haversine";
import { makeRng, pickCity } from "../distance-game/pickRounds";
import { MAP_ROUNDS } from "./scoring";

/* ------------------------------------------------------------------ *
 *  Soru seçimi — "Haritada Bul"
 *
 *  Bir oyunun sekiz şehri kolaydan zora doğru dizilir:
 *    kolay (3)  : herkesin bildiği şehirler (rehberli, ≥ 800 bin ve ülkesinin ilk üç şehrinden biri; ≥ 3 milyonluk başkent;
 *                 ülkesinin ilk iki şehrinden biri ve ≥ 5 milyon)
 *    orta (3)   : rehberli (≥ 100 bin), ≥ 1 milyonluk başkent, ülkesinin ilk dört şehrinden biri (≥ 1,5 milyon)
 *    zor (2)    : kalan başkentler ve küçük rehberli yerler (Vagadugu, Hvar...)
 *  Soru gerçek bir coğrafya bilgisi sınar, o yüzden ülke adı hep gösterilir; zor tur
 *  bile ülkeyi bilene puan verir.
 *
 *  Kurallar: bir ülkeden en çok bir şehir; şehirler birbirine en az MIN_SPREAD_KM
 *  uzakta (oyun dünyanın farklı yerlerini gezer); aynı şehir iki kez çıkmaz. `seed`
 *  verilirse sonuç deterministik (Günün Turu). Seçim ağırlığı Kaç kilometre? ile aynı:
 *  önce ülke (karekök ağırlıklı), sonra ülke içinde şehir; Çin ve Hindistan soruları
 *  doldurmaz.
 * ------------------------------------------------------------------ */

export type Tier = "easy" | "medium" | "hard";

export interface Target {
  city: City;
  tier: Tier;
}

export const TIER_PLAN: readonly Tier[] = ["easy", "easy", "easy", "medium", "medium", "medium", "hard", "hard"];
export const MIN_SPREAD_KM = 1500;
/** Havuz daralırsa kademeli gevşetilen en küçük aralık. */
const RELAXED_SPREAD_KM = 700;

export const EASY_GUIDED_POP_K = 800;
export const EASY_GUIDED_RANK = 3;
export const EASY_CAPITAL_POP_K = 3000;
export const EASY_BIGGEST_POP_K = 5000;
export const MEDIUM_CAPITAL_POP_K = 1000;
export const MEDIUM_RANK_POP_K = 1500;
/** Ülkenin en kalabalık bu kadar şehri "bilinen" sayılır (rehbersiz, başkent olmayan şehirler için). */
export const MEDIUM_RANK = 4;

/**
 * Ülke içi nüfus sırası (0 = en kalabalık). Nüfus tek başına ünlülüğü ölçmez: GeoNames'te Çin
 * şehirlerinin nüfusu il bütününü sayar (Puyang 3,6 milyon). "Ülkesinin ilk dört şehri"
 * kuralı Şanghay'ı ve Karaçi'yi alır, Puyang'ı almaz.
 */
export function countryRanks(cities: readonly City[]): Map<number, number> {
  const byCountry = new Map<string, City[]>();
  for (const c of cities) {
    const list = byCountry.get(c.iso2);
    if (list) list.push(c);
    else byCountry.set(c.iso2, [c]);
  }
  const ranks = new Map<number, number>();
  for (const list of byCountry.values()) {
    list.sort((a, b) => b.popK - a.popK || a.id - b.id).forEach((c, i) => ranks.set(c.id, i));
  }
  return ranks;
}

/** Şehrin kademesi; soruya hiç girmeyecekse null. `rank`: countryRanks değeri. */
export function targetTier(c: City, rank: number, guided?: ReadonlySet<string>): Tier | null {
  if (!isEligible(c, guided)) return null;
  const g = isGuided(c, guided);
  if ((g && c.popK >= EASY_GUIDED_POP_K && rank < EASY_GUIDED_RANK) || (c.capital && c.popK >= EASY_CAPITAL_POP_K) || (rank < 2 && c.popK >= EASY_BIGGEST_POP_K)) {
    return "easy";
  }
  if (
    (g && c.popK >= 100) ||
    (c.capital && c.popK >= MEDIUM_CAPITAL_POP_K) ||
    (rank < MEDIUM_RANK && c.popK >= MEDIUM_RANK_POP_K)
  ) {
    return "medium";
  }
  // Kalan başkentler ve küçük rehberli yerler.
  return c.capital || g ? "hard" : null;
}

export interface PickOptions {
  seed?: number;
  count?: number;
  cities?: readonly City[];
  guided?: ReadonlySet<string>;
}

export function pickTargets(options: PickOptions = {}): Target[] {
  const { seed, count = MAP_ROUNDS, cities = CITIES, guided } = options;
  const rng = makeRng(seed);
  const pools: Record<Tier, City[]> = { easy: [], medium: [], hard: [] };
  const ranks = countryRanks(cities);
  for (const c of cities) {
    const tier = targetTier(c, ranks.get(c.id) ?? Infinity, guided);
    if (tier) pools[tier].push(c);
  }
  const plan = Array.from({ length: count }, (_, i) => TIER_PLAN[Math.min(TIER_PLAN.length - 1, Math.floor((i * TIER_PLAN.length) / count))]);

  const picked: Target[] = [];
  const noSingletons: ReadonlySet<string> = new Set();
  for (const tier of plan) {
    let chosen: City | undefined;
    // Önce tam kurallar, sonra aralık gevşetilir, en sonda ülke kuralı da (pratikte hiç gerekmez).
    for (const [spread, uniqueCountry] of [
      [MIN_SPREAD_KM, true],
      [RELAXED_SPREAD_KM, true],
      [RELAXED_SPREAD_KM, false],
    ] as const) {
      const candidates = pools[tier].filter(
        (c) =>
          picked.every(
            (p) =>
              p.city.id !== c.id &&
              (!uniqueCountry || p.city.iso2 !== c.iso2) &&
              haversineKm(p.city.lat, p.city.lng, c.lat, c.lng) >= spread,
          ),
      );
      chosen = pickCity(candidates, rng, guided, noSingletons);
      if (chosen) break;
    }
    if (!chosen) throw new Error(`pickTargets: ${tier} kademesinde uygun şehir bulunamadı`);
    picked.push({ city: chosen, tier });
  }
  return picked;
}

export { cityKey };

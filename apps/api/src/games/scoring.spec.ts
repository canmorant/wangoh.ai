import { describe, expect, it } from "vitest";
import { CHOICE_ROUNDS, MAP_GUESS_ROUNDS, MAX_SESSION_SCORE } from "./games.constants.js";
import { haversineKm, mapPointsForKm, scoreChoiceRound, scoreMapGuess, speedBonus, streakBonus, validateLatLng } from "./scoring.js";

describe("hız bonusu: round(50 * max(0, 1 - ms / 15000))", () => {
  it("sınır değerleri: 0 ms tam bonus, 15000 ms ve ötesi sıfır", () => {
    expect(speedBonus(0)).toBe(50);
    expect(speedBonus(15_000)).toBe(0);
    expect(speedBonus(15_001)).toBe(0);
    expect(speedBonus(1_000_000)).toBe(0);
  });

  it("doğrusal azalır ve yuvarlanır", () => {
    expect(speedBonus(1)).toBe(50); // 49.9967 -> 50
    expect(speedBonus(7_500)).toBe(25);
    expect(speedBonus(3_000)).toBe(40);
    expect(speedBonus(14_999)).toBe(0); // 0.0033 -> 0
    expect(speedBonus(14_700)).toBe(1); // 1.0 -> 1
  });

  it("tam .5 değerlerinde belgedeki formül gibi yukarı yuvarlar (kayan nokta artığı aşağı düşürmez)", () => {
    // 50 * (1 - ms / 15000) tam olarak x,5 olduğu süreler: 150 + 300 k ms. `1 - 8250 / 15000` kayan noktada
    // 0,44999999999999996 verdiğinden eski hesap 22,5 yerine 22 üretiyordu.
    expect(speedBonus(8_250)).toBe(23);
    expect(speedBonus(10_050)).toBe(17);
    expect(speedBonus(13_950)).toBe(4);
    expect(speedBonus(150)).toBe(50);
    expect(speedBonus(14_850)).toBe(1);
    for (let k = 0; k < 50; k++) {
      const ms = 150 + 300 * k;
      expect(speedBonus(ms), `${ms} ms`).toBe(50 - k); // (15000 - ms) / 300 = 49,5 - k -> yukarı yuvarlanınca 50 - k
    }
  });

  it("her tam sayı milisaniyede kesin (tam sayı) aritmetikle aynı: round-half-up((15000 - ms) / 300)", () => {
    for (let ms = 0; ms <= 15_000; ms++) {
      const exact = Math.floor((2 * (15_000 - ms) + 300) / 600);
      expect(speedBonus(ms), `${ms} ms`).toBe(exact);
    }
  });

  it("monoton azalan, 0-50 arası tam sayı", () => {
    let prev = Infinity;
    for (let ms = 0; ms <= 16_000; ms += 37) {
      const bonus = speedBonus(ms);
      expect(Number.isInteger(bonus)).toBe(true);
      expect(bonus).toBeGreaterThanOrEqual(0);
      expect(bonus).toBeLessThanOrEqual(50);
      expect(bonus).toBeLessThanOrEqual(prev);
      prev = bonus;
    }
  });

  it("geçersiz süre: negatif 0 ms sayılır, NaN ve sonsuz bonus vermez", () => {
    expect(speedBonus(-1)).toBe(50);
    expect(speedBonus(-1e9)).toBe(50);
    expect(speedBonus(Number.NaN)).toBe(0);
    expect(speedBonus(Infinity)).toBe(0);
    expect(speedBonus(-Infinity)).toBe(0);
  });
});

describe("seri bonusu: min(50, 10 * (seri - 1))", () => {
  it("seri 1..7", () => {
    expect([1, 2, 3, 4, 5, 6, 7].map(streakBonus)).toEqual([0, 10, 20, 30, 40, 50, 50]);
  });

  it("çok uzun seri 50'de kalır; geçersiz seri bonus vermez", () => {
    expect(streakBonus(1000)).toBe(50);
    expect(streakBonus(0)).toBe(0);
    expect(streakBonus(-3)).toBe(0);
    expect(streakBonus(Number.NaN)).toBe(0);
    expect(streakBonus(Infinity)).toBe(0);
    expect(streakBonus(2.9)).toBe(10); // tam sayıya indirilir
  });
});

describe("çoktan seçmeli tur puanı", () => {
  it("yanlış cevap 0 puan ve seriyi sıfırlar", () => {
    expect(scoreChoiceRound({ correct: false, elapsedMs: 0, streakBefore: 5 })).toEqual({ points: 0, speedBonus: 0, streakBonus: 0, streak: 0 });
  });

  it("ilk doğru: 100 + hız, seri bonusu yok", () => {
    expect(scoreChoiceRound({ correct: true, elapsedMs: 0, streakBefore: 0 })).toEqual({ points: 150, speedBonus: 50, streakBonus: 0, streak: 1 });
    expect(scoreChoiceRound({ correct: true, elapsedMs: 15_000, streakBefore: 0 })).toEqual({ points: 100, speedBonus: 0, streakBonus: 0, streak: 1 });
    expect(scoreChoiceRound({ correct: true, elapsedMs: 15_001, streakBefore: 0 }).points).toBe(100);
  });

  it("seri bu turu da sayar", () => {
    // Önceden 1 doğru varsa bu tur 2. doğrudur: seri bonusu 10.
    expect(scoreChoiceRound({ correct: true, elapsedMs: 15_000, streakBefore: 1 })).toEqual({ points: 110, speedBonus: 0, streakBonus: 10, streak: 2 });
    expect(scoreChoiceRound({ correct: true, elapsedMs: 0, streakBefore: 5 }).points).toBe(200); // 100 + 50 + 50
    expect(scoreChoiceRound({ correct: true, elapsedMs: 0, streakBefore: 50 }).points).toBe(200); // tavan
  });

  it("geçersiz önceki seri 0 sayılır", () => {
    expect(scoreChoiceRound({ correct: true, elapsedMs: 15_000, streakBefore: Number.NaN }).streak).toBe(1);
    expect(scoreChoiceRound({ correct: true, elapsedMs: 15_000, streakBefore: -4 }).streak).toBe(1);
  });

  it("tavan: mükemmel oyun 1850, belgedeki 2000 sınırının altında", () => {
    let streak = 0;
    let total = 0;
    for (let i = 0; i < CHOICE_ROUNDS; i++) {
      const r = scoreChoiceRound({ correct: true, elapsedMs: 0, streakBefore: streak });
      streak = r.streak;
      total += r.points;
    }
    expect(total).toBe(1850);
    expect(total).toBeLessThanOrEqual(MAX_SESSION_SCORE["flag-quiz"]);
  });
});

describe("haversine", () => {
  it("aynı nokta 0 km", () => {
    expect(haversineKm(0, 0, 0, 0)).toBe(0);
    expect(haversineKm(41.0082, 28.9784, 41.0082, 28.9784)).toBe(0);
  });

  it("antipodal noktalar yarım çevre (≈ 20015 km), NaN değil", () => {
    const half = Math.PI * 6371;
    expect(haversineKm(0, 0, 0, 180)).toBeCloseTo(half, 6);
    expect(haversineKm(90, 0, -90, 0)).toBeCloseTo(half, 6);
    expect(haversineKm(10, 20, -10, -160)).toBeCloseTo(half, 2); // asin(1 - eps) antipodlarda ~0,2 m hassastır
    expect(Number.isNaN(haversineKm(0, 0, 0, 180))).toBe(false);
  });

  it("±180 boylam sarması: 179 ile -179 arası 2 derecedir, 180 ile -180 aynı nokta", () => {
    expect(haversineKm(0, 180, 0, -180)).toBe(0);
    expect(haversineKm(37, 180, 37, -180)).toBeCloseTo(0, 9);
    expect(haversineKm(0, 179, 0, -179)).toBeCloseTo(haversineKm(0, 0, 0, 2), 9);
    expect(haversineKm(0, 179, 0, -179)).toBeCloseTo(222.39, 1);
    // Sarma, doğudan ve batıdan eşit.
    expect(haversineKm(10, 170, 10, -170)).toBeCloseTo(haversineKm(10, -170, 10, 170), 9);
  });

  it("bilinen bir çift: Paris - Londra ≈ 343-344 km", () => {
    const km = haversineKm(48.8566, 2.3522, 51.5074, -0.1278);
    expect(km).toBeGreaterThan(342);
    expect(km).toBeLessThan(345);
  });

  it("simetrik ve üçgen eşitsizliğine uyar", () => {
    const a = haversineKm(10, 20, -30, 140);
    expect(haversineKm(-30, 140, 10, 20)).toBeCloseTo(a, 9);
    expect(a).toBeLessThanOrEqual(haversineKm(10, 20, 0, 80) + haversineKm(0, 80, -30, 140) + 1e-9);
  });

  it("sonlu olmayan girdi NaN döner", () => {
    expect(haversineKm(Number.NaN, 0, 0, 0)).toBeNaN();
    expect(haversineKm(0, Infinity, 0, 0)).toBeNaN();
    expect(haversineKm(0, 0, -Infinity, 0)).toBeNaN();
  });
});

describe("harita puanı (web ile aynı formül)", () => {
  it("50 km'ye (dahil) kadar tam puan", () => {
    expect(mapPointsForKm(0)).toBe(1000);
    expect(mapPointsForKm(50)).toBe(1000);
    expect(mapPointsForKm(51)).toBe(999);
  });

  it("web ile aynı sabit değerler: 300 km → 812, 600 km → 632, 1000 km → 453, 2000 km → 197, 5000 km → 16", () => {
    expect(mapPointsForKm(300)).toBe(812);
    expect(mapPointsForKm(600)).toBe(632);
    expect(mapPointsForKm(1000)).toBe(453);
    expect(mapPointsForKm(2000)).toBe(197);
    expect(mapPointsForKm(5000)).toBe(16);
  });

  it("yarım dünya uzaklıkta 0, hep 0-1000 tam sayı ve monoton", () => {
    expect(mapPointsForKm(20_015)).toBe(0);
    let prev = 1000;
    for (let km = 0; km <= 20_100; km += 7) {
      const p = mapPointsForKm(km);
      expect(Number.isInteger(p)).toBe(true);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1000);
      expect(p).toBeLessThanOrEqual(prev);
      prev = p;
    }
  });

  it("geçersiz uzaklık 0 puan: NaN, Infinity, negatif", () => {
    expect(mapPointsForKm(Number.NaN)).toBe(0);
    expect(mapPointsForKm(Infinity)).toBe(0);
    expect(mapPointsForKm(-Infinity)).toBe(0);
    expect(mapPointsForKm(-1)).toBe(0);
  });

  it("scoreMapGuess: uzaklık tam sayıya yuvarlanır ve puan yuvarlanmış km'den hesaplanır (web gibi)", () => {
    const target = { lat: 0, lng: 0 };
    expect(scoreMapGuess({ lat: 0, lng: 0 }, target)).toEqual({ distanceKm: 0, points: 1000 });
    // 0,45 derece boylam ≈ 50,03 km -> 50 km -> tam puan
    expect(scoreMapGuess({ lat: 0, lng: 0.45 }, target)).toEqual({ distanceKm: 50, points: 1000 });
    // 1 derece ≈ 111,19 km -> 111 km
    expect(scoreMapGuess({ lat: 0, lng: 1 }, target)).toEqual({ distanceKm: 111, points: mapPointsForKm(111) });
    // antipodal
    const far = scoreMapGuess({ lat: 0, lng: 180 }, target);
    expect(far.distanceKm).toBe(20_015);
    expect(far.points).toBe(0);
  });

  it("scoreMapGuess: sonlu olmayan girdi 0 puan, NaN sızdırmaz", () => {
    expect(scoreMapGuess({ lat: Number.NaN, lng: 0 }, { lat: 0, lng: 0 })).toEqual({ distanceKm: 0, points: 0 });
    expect(scoreMapGuess({ lat: 0, lng: Infinity }, { lat: 0, lng: 0 })).toEqual({ distanceKm: 0, points: 0 });
  });

  it("tavan: 5 turluk mükemmel oyun 5000", () => {
    expect(MAP_GUESS_ROUNDS * 1000).toBe(MAX_SESSION_SCORE["map-guess"]);
  });
});

describe("koordinat doğrulama", () => {
  const issues = (lat: unknown, lng: unknown) => validateLatLng({ lat, lng }).map((i) => i.field);

  it("sınırlar dahil geçerli", () => {
    expect(issues(0, 0)).toEqual([]);
    expect(issues(90, 180)).toEqual([]);
    expect(issues(-90, -180)).toEqual([]);
  });

  it("aralık dışı reddedilir", () => {
    expect(issues(90.0001, 0)).toEqual(["answer.lat"]);
    expect(issues(-91, 0)).toEqual(["answer.lat"]);
    expect(issues(0, 180.0001)).toEqual(["answer.lng"]);
    expect(issues(0, -181)).toEqual(["answer.lng"]);
    expect(issues(100, 200)).toEqual(["answer.lat", "answer.lng"]);
  });

  it("NaN, Infinity ve sayı olmayan değerler reddedilir", () => {
    expect(issues(Number.NaN, 0)).toEqual(["answer.lat"]);
    expect(issues(0, Number.NaN)).toEqual(["answer.lng"]);
    expect(issues(Infinity, 0)).toEqual(["answer.lat"]);
    expect(issues(0, -Infinity)).toEqual(["answer.lng"]);
    expect(issues("10", 0)).toEqual(["answer.lat"]);
    expect(issues(null, undefined)).toEqual(["answer.lat", "answer.lng"]);
    expect(issues(true, [])).toEqual(["answer.lat", "answer.lng"]);
  });
});

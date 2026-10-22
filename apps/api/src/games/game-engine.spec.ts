import { describe, expect, it } from "vitest";
import { AppException } from "../common/errors.js";
import { capitalQuizStrategy, flagQuizStrategy, mapGuessStrategy, streakBefore, strategyFor } from "./game-engine.js";
import { GAME_TYPES } from "../db/schema/enums.js";
import type { PoolCountry, StoredRound } from "./games.types.js";
import { cryptoRng, sample, seededRng, shuffle } from "./rng.js";

const CONTINENTS = ["africa", "americas", "asia", "europe", "oceania"] as const;

/** `n` ülkelik sahte havuz; kıtalara `perContinent` ağırlığına göre dağıtılır. */
function makePool(n: number, continentOf: (i: number) => string = (i) => CONTINENTS[i % CONTINENTS.length]!): PoolCountry[] {
  return Array.from({ length: n }, (_, i) => {
    const code = `${String.fromCharCode(65 + Math.floor(i / 26))}${String.fromCharCode(65 + (i % 26))}`;
    return {
      code,
      continentSlug: continentOf(i),
      flag: `F-${code}`,
      names: { tr: { name: `Ülke ${code}` }, en: { name: `Country ${code}` } },
      capital: [`Başkent ${code}`],
      latitude: ((i * 7) % 160) - 80,
      longitude: ((i * 13) % 340) - 170,
    };
  });
}

const codesOf = (round: StoredRound): string[] => round.options.map((o) => o.code);

describe("rastgelelik", () => {
  it("cryptoRng [0, 1) aralığında ve değişken", () => {
    const values = Array.from({ length: 2000 }, () => cryptoRng());
    expect(values.every((v) => v >= 0 && v < 1)).toBe(true);
    expect(new Set(values).size).toBeGreaterThan(1990);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    expect(mean).toBeGreaterThan(0.45);
    expect(mean).toBeLessThan(0.55);
  });

  it("seededRng deterministiktir; shuffle ve sample girdiyi değiştirmez", () => {
    const a = Array.from({ length: 5 }, seededRng(42));
    const b = Array.from({ length: 5 }, seededRng(42));
    expect(a).toEqual(b);
    expect(Array.from({ length: 5 }, seededRng(43))).not.toEqual(a);

    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const copy = [...input];
    expect(shuffle(input, seededRng(1)).slice().sort()).toEqual(copy);
    expect(sample(input, 3, seededRng(1))).toHaveLength(3);
    expect(new Set(sample(input, 8, seededRng(2))).size).toBe(8);
    expect(sample(input, 20, seededRng(3))).toHaveLength(8); // sayıyı aşarsa hepsi
    expect(input).toEqual(copy);
  });
});

describe("çoktan seçmeli motor (flag-quiz)", () => {
  const pool = makePool(60);

  it("bayrağı başka ülkeyle aynı olan bağımlı bölge (Svalbard) ne hedef ne seçenek olur", () => {
    const base = makePool(30);
    const norway = { ...base[0]!, code: "NO", flag: "F-NO", names: { tr: { name: "Norveç" } } };
    const svalbard = { ...base[1]!, code: "SJ", flag: "F-NO", names: { tr: { name: "Svalbard ve Jan Mayen" } } };
    const withSj = [norway, svalbard, ...base.slice(2)];
    for (let seed = 1; seed <= 200; seed++) {
      for (const round of flagQuizStrategy.buildRounds(withSj, seededRng(seed))) {
        expect(round.code).not.toBe("SJ");
        expect(codesOf(round)).not.toContain("SJ");
      }
    }
    // Ülke adını gösteren oyunlar etkilenmez: Svalbard başkent ve harita havuzunda kalır.
    expect(capitalQuizStrategy.isEligible(svalbard)).toBe(true);
    expect(mapGuessStrategy.isEligible(svalbard)).toBe(true);
  });

  it("10 tur, her turda 4 benzersiz seçenek, doğru cevap seçenekler arasında, hedefler tekrar etmez", () => {
    const rounds = flagQuizStrategy.buildRounds(pool, seededRng(7));
    expect(rounds).toHaveLength(10);
    expect(new Set(rounds.map((r) => r.code)).size).toBe(10);
    for (const round of rounds) {
      expect(round.options).toHaveLength(4);
      expect(new Set(codesOf(round)).size).toBe(4);
      expect(codesOf(round)).toContain(round.code);
      expect(new Set(round.options.map((o) => o.names.tr.name)).size).toBe(4);
      expect(round.result).toBeUndefined();
    }
  });

  it("aynı tohum aynı oyunu, farklı tohum farklı oyunu üretir (rastgelelik enjekte edilebilir)", () => {
    const a = flagQuizStrategy.buildRounds(pool, seededRng(11));
    const b = flagQuizStrategy.buildRounds(pool, seededRng(11));
    const c = flagQuizStrategy.buildRounds(pool, seededRng(12));
    expect(a).toEqual(b);
    expect(a.map((r) => r.code)).not.toEqual(c.map((r) => r.code));
  });

  it("yanlış seçenekler aynı kıtadan öncelikli", () => {
    // Kıta başına 12 ülke: her hedefin aynı kıtadan en az 11 adayı var.
    const rounds = flagQuizStrategy.buildRounds(pool, seededRng(3));
    const continentOf = new Map(pool.map((c) => [c.code, c.continentSlug]));
    for (const round of rounds) {
      const target = continentOf.get(round.code);
      for (const code of codesOf(round)) expect(continentOf.get(code), `${round.code} -> ${code}`).toBe(target);
    }
  });

  it("aynı kıtada yeterli ülke yoksa kalan seçenekler diğer kıtalardan tamamlanır", () => {
    // 2 ülkelik bir kıta ve 28 ülkelik büyük kıta: küçük kıtanın hedefi için yalnız 1 aynı-kıta yanlış seçeneği var.
    const small = makePool(30, (i) => (i < 2 ? "oceania" : "asia"));
    const continentOf = new Map(small.map((c) => [c.code, c.continentSlug]));
    let sawSmall = false;
    for (let seed = 1; seed <= 40; seed++) {
      for (const round of flagQuizStrategy.buildRounds(small, seededRng(seed))) {
        if (continentOf.get(round.code) !== "oceania") continue;
        sawSmall = true;
        const others = round.options.filter((o) => o.code !== round.code);
        expect(others).toHaveLength(3);
        const sameContinent = others.filter((o) => continentOf.get(o.code) === "oceania");
        expect(sameContinent).toHaveLength(1); // önce aynı kıtadaki tek ülke
        expect(others.filter((o) => continentOf.get(o.code) === "asia")).toHaveLength(2); // kalanı başka kıtadan
      }
    }
    expect(sawSmall).toBe(true);
  });

  it("doğru cevabın konumu dört konuma eşit dağılır", () => {
    const counts = [0, 0, 0, 0];
    const rng = seededRng(99);
    for (let g = 0; g < 100; g++) {
      for (const round of flagQuizStrategy.buildRounds(pool, rng)) counts[codesOf(round).indexOf(round.code)]!++;
    }
    // 1000 tur, beklenen 250/konum; çok gevşek sınır (düzgünlük gerçekten bozuksa yakalar).
    for (const count of counts) {
      expect(count).toBeGreaterThan(190);
      expect(count).toBeLessThan(310);
    }
  });

  it("aynı adı taşıyan ülke iki seçenekte birden görünmez", () => {
    const dup = makePool(14);
    for (const c of dup.slice(1, 6)) c.names.tr.name = "Aynı Ad"; // 5 ülke aynı Türkçe ad
    for (let seed = 1; seed <= 30; seed++) {
      for (const round of flagQuizStrategy.buildRounds(dup, seededRng(seed))) {
        const names = round.options.map((o) => o.names.tr.name);
        expect(new Set(names).size).toBe(4);
      }
    }
  });

  it("havuz küçükse (< 10) anlamlı 409 hatası", () => {
    for (const size of [0, 1, 9]) {
      try {
        flagQuizStrategy.buildRounds(makePool(size), seededRng(1));
        expect.unreachable("havuz küçükken tur kurulmamalıydı");
      } catch (err) {
        expect(err).toBeInstanceOf(AppException);
        expect((err as AppException).getStatus()).toBe(409);
        expect((err as AppException).code).toBe("GAME_POOL_TOO_SMALL");
      }
    }
    expect(flagQuizStrategy.buildRounds(makePool(10), seededRng(1))).toHaveLength(10); // tam 10 yeter
  });

  it("havuzda 10 ülke olsa da benzersiz seçenek bulunamıyorsa hata verir, sonsuz döngüye girmez", () => {
    const same = makePool(12);
    for (const c of same) c.names.tr.name = "Hep Aynı";
    expect(() => flagQuizStrategy.buildRounds(same, seededRng(1))).toThrow(AppException);
  });

  it("soru görünümü hedefin kodunu ya da doğru seçeneği ele vermez; bayrak sorunun kendisidir", () => {
    const [round] = flagQuizStrategy.buildRounds(pool, seededRng(5));
    const question = flagQuizStrategy.question(round!, "tr", "https://assets.test");
    expect(question).toEqual({ flag: round!.flag, flagUrl: `https://assets.test/flags/${round!.code.toLowerCase()}.svg`, countryName: null });
    const options = flagQuizStrategy.options(round!, "en")!;
    expect(options).toHaveLength(4);
    expect(options.every((o) => o.label.startsWith("Country "))).toBe(true);
    expect(Object.keys(options[0]!).sort()).toEqual(["id", "label"]);
    expect(flagQuizStrategy.correctAnswer(round!, "tr")).toEqual({ code: round!.code, label: `Ülke ${round!.code}`, lat: null, lng: null });
  });

  it("dil çevirisi yoksa Türkçeye düşer", () => {
    const only = makePool(12);
    for (const c of only) delete c.names.en;
    const [round] = flagQuizStrategy.buildRounds(only, seededRng(5));
    expect(flagQuizStrategy.options(round!, "es")!.every((o) => o.label.startsWith("Ülke "))).toBe(true);
  });
});

describe("capital-quiz", () => {
  it("yalnız başkenti olan ülkeler hedef ve seçenek olur", () => {
    const pool = makePool(40);
    for (const c of pool.slice(0, 15)) c.capital = [];
    const withCapital = new Set(pool.filter((c) => c.capital.length > 0).map((c) => c.code));
    for (let seed = 1; seed <= 20; seed++) {
      for (const round of capitalQuizStrategy.buildRounds(pool, seededRng(seed))) {
        expect(withCapital.has(round.code)).toBe(true);
        for (const code of codesOf(round)) expect(withCapital.has(code)).toBe(true);
      }
    }
  });

  it("başkenti olan ülke sayısı 10'dan azsa havuz küçüktür", () => {
    const pool = makePool(30);
    for (const c of pool.slice(9)) c.capital = [];
    expect(() => capitalQuizStrategy.buildRounds(pool, seededRng(1))).toThrow(/yeterli/);
    pool[9]!.capital = ["Başkent X"];
    expect(capitalQuizStrategy.buildRounds(pool, seededRng(1))).toHaveLength(10);
  });

  it("aynı başkent adını paylaşan ülkeler aynı soruda seçenek olmaz; boş başkent dizgisi sayılmaz", () => {
    const pool = makePool(20);
    for (const c of pool.slice(0, 8)) c.capital = ["Victoria"]; // 8 ülke aynı başkent adı
    pool[10]!.capital = ["", "  "];
    for (let seed = 1; seed <= 30; seed++) {
      for (const round of capitalQuizStrategy.buildRounds(pool.filter((c) => c.capital.some((x) => x.trim())), seededRng(seed))) {
        const labels = capitalQuizStrategy.options(round, "tr")!.map((o) => o.label.toLowerCase());
        expect(new Set(labels).size).toBe(4);
      }
    }
  });

  it("çoklu başkent ' / ' ile birleşir; soru yalnız ülke adını taşır (kodu ya da başkenti değil)", () => {
    const pool = makePool(20);
    pool[0]!.capital = ["Pretoria", "Cape Town"];
    let found: StoredRound | undefined;
    for (let seed = 1; seed <= 200 && !found; seed++) found = capitalQuizStrategy.buildRounds(pool, seededRng(seed)).find((r) => r.code === "AA");
    expect(found).toBeDefined();
    expect(capitalQuizStrategy.correctAnswer(found!, "tr").label).toBe("Pretoria / Cape Town");
    expect(capitalQuizStrategy.options(found!, "tr")!.map((o) => o.label)).toContain("Pretoria / Cape Town");

    const question = capitalQuizStrategy.question(found!, "en", "https://assets.test");
    expect(question).toEqual({ flag: null, flagUrl: null, countryName: "Country AA" });
    expect(JSON.stringify(question)).not.toMatch(/Pretoria|"AA"/);
  });
});

describe("map-guess", () => {
  it("5 tur, benzersiz hedef, seçenek yok; koordinatsız ülke havuzda olmaz", () => {
    const pool = makePool(30);
    for (const c of pool.slice(0, 15)) {
      c.latitude = null;
      c.longitude = null;
    }
    pool[16]!.latitude = 91; // geçersiz koordinat
    const eligible = new Set(pool.filter((c) => mapGuessStrategy.isEligible(c)).map((c) => c.code));
    expect(eligible.size).toBe(14);
    for (let seed = 1; seed <= 20; seed++) {
      const rounds = mapGuessStrategy.buildRounds(pool, seededRng(seed));
      expect(rounds).toHaveLength(5);
      expect(new Set(rounds.map((r) => r.code)).size).toBe(5);
      for (const round of rounds) {
        expect(eligible.has(round.code)).toBe(true);
        expect(round.options).toEqual([]);
        expect(mapGuessStrategy.options(round, "tr")).toBeNull();
      }
    }
  });

  it("havuz küçükse (< 10) 409; soru yalnız ülke adını taşır, koordinat yok", () => {
    expect(() => mapGuessStrategy.buildRounds(makePool(9), seededRng(1))).toThrow(AppException);
    const [round] = mapGuessStrategy.buildRounds(makePool(20), seededRng(1));
    const question = mapGuessStrategy.question(round!, "tr", "https://assets.test");
    expect(question).toEqual({ flag: null, flagUrl: null, countryName: `Ülke ${round!.code}` });
    const target = mapGuessStrategy.correctAnswer(round!, "tr");
    expect(target).toEqual({ code: round!.code, label: `Ülke ${round!.code}`, lat: round!.latitude, lng: round!.longitude });
  });
});

describe("cevap doğrulama", () => {
  const flagRound = flagQuizStrategy.buildRounds(makePool(20), seededRng(1))[0]!;
  const mapRound = mapGuessStrategy.buildRounds(makePool(20), seededRng(1))[0]!;
  const reject = (fn: () => unknown): AppException => {
    try {
      fn();
    } catch (err) {
      return err as AppException;
    }
    throw new Error("hata beklenirdi");
  };

  it("çoktan seçmeli: yalnız sunulan seçenekler; küçük harf ve boşluk kabul edilir", () => {
    const code = flagRound.options[2]!.code;
    expect(flagQuizStrategy.parseAnswer(code, flagRound)).toBe(code);
    expect(flagQuizStrategy.parseAnswer(`  ${code.toLowerCase()} `, flagRound)).toBe(code);
    const outside = makePool(20).find((c) => !codesOf(flagRound).includes(c.code))!.code;
    for (const bad of [outside, "", "XX", 5, undefined, { lat: 1, lng: 2 }, ["AA"], true]) {
      const err = reject(() => flagQuizStrategy.parseAnswer(bad, flagRound));
      expect(err.getStatus(), String(bad)).toBe(400);
      expect(err.code).toBe("VALIDATION_FAILED");
      expect(JSON.stringify(err.getResponse())).not.toContain(`"${flagRound.code}"`); // doğru cevap hata gövdesinde yok
    }
  });

  it("null her türde geçerli bir 'cevap yok' (süre doldu ya da pas) ve 0 puan verir", () => {
    expect(flagQuizStrategy.parseAnswer(null, flagRound)).toBeNull();
    expect(capitalQuizStrategy.parseAnswer(null, flagRound)).toBeNull();
    expect(mapGuessStrategy.parseAnswer(null, mapRound)).toBeNull();
    const zero = { correct: false, points: 0, speedBonus: 0, streakBonus: 0, streak: 0, distanceKm: null };
    expect(flagQuizStrategy.grade(flagRound, null, { elapsedMs: 0, streakBefore: 4 })).toEqual(zero);
    expect(mapGuessStrategy.grade(mapRound, null, { elapsedMs: 0, streakBefore: 0 })).toEqual(zero);
  });

  it("map-guess: yalnız { lat, lng } sonlu sayılar ve aralıkta", () => {
    expect(mapGuessStrategy.parseAnswer({ lat: 12.5, lng: -45 }, mapRound)).toEqual({ lat: 12.5, lng: -45 });
    expect(mapGuessStrategy.parseAnswer({ lat: -90, lng: 180 }, mapRound)).toEqual({ lat: -90, lng: 180 });
    const bads: unknown[] = [
      "TR", 5, [], [1, 2], {}, { lat: 1 }, { lng: 1 }, { lat: "1", lng: 2 }, { lat: 91, lng: 0 }, { lat: 0, lng: 181 },
      { lat: Number.NaN, lng: 0 }, { lat: 0, lng: Infinity }, { lat: -Infinity, lng: 0 },
    ];
    for (const bad of bads) {
      const err = reject(() => mapGuessStrategy.parseAnswer(bad, mapRound));
      expect(err.getStatus(), JSON.stringify(bad)).toBe(400);
      expect(err.code).toBe("VALIDATION_FAILED");
    }
    const details = reject(() => mapGuessStrategy.parseAnswer({ lat: 100, lng: 200 }, mapRound)).details as Array<{ field: string }>;
    expect(details.map((d) => d.field)).toEqual(["answer.lat", "answer.lng"]);
  });
});

describe("notlandırma", () => {
  it("çoktan seçmeli: doğru cevap puan alır, yanlış 0", () => {
    const round = flagQuizStrategy.buildRounds(makePool(20), seededRng(1))[0]!;
    const wrong = round.options.find((o) => o.code !== round.code)!.code;
    expect(flagQuizStrategy.grade(round, round.code, { elapsedMs: 0, streakBefore: 0 })).toEqual({
      correct: true, points: 150, speedBonus: 50, streakBonus: 0, streak: 1, distanceKm: null,
    });
    expect(flagQuizStrategy.grade(round, wrong, { elapsedMs: 0, streakBefore: 3 })).toEqual({
      correct: false, points: 0, speedBonus: 0, streakBonus: 0, streak: 0, distanceKm: null,
    });
  });

  it("map-guess: tam isabet 1000, uzak tahmin düşük; 500 puan ve üzeri doğru sayılır", () => {
    const round = mapGuessStrategy.buildRounds(makePool(20), seededRng(1))[0]!;
    const exact = mapGuessStrategy.grade(round, { lat: round.latitude!, lng: round.longitude! }, { elapsedMs: 0, streakBefore: 0 });
    expect(exact).toEqual({ correct: true, points: 1000, speedBonus: 0, streakBonus: 0, streak: 0, distanceKm: 0 });
    const farLat = round.latitude! > 0 ? -round.latitude! : 80;
    const far = mapGuessStrategy.grade(round, { lat: farLat, lng: round.longitude! > 0 ? round.longitude! - 180 : round.longitude! + 180 }, { elapsedMs: 0, streakBefore: 0 });
    expect(far.points).toBeLessThan(500);
    expect(far.correct).toBe(false);
    // hız ve seri map-guess'i etkilemez
    expect(mapGuessStrategy.grade(round, { lat: round.latitude!, lng: round.longitude! }, { elapsedMs: 99_999, streakBefore: 9 }).points).toBe(1000);
  });

  it("map-guess: 'doğru' eşiği tam 500 puandır (882 km → 500 puan doğru, 883 km → 499 puan yanlış)", () => {
    const base = mapGuessStrategy.buildRounds(makePool(20), seededRng(1))[0]!;
    const round: StoredRound = { ...base, latitude: 0, longitude: 0 };
    // Ekvatorda 0°'dan meridyen boyunca tam `km` uzaklıktaki nokta (haversine ile birebir `km`).
    const at = (km: number) => ({ lat: (km * 180) / (Math.PI * 6371), lng: 0 });
    const ctx = { elapsedMs: 0, streakBefore: 0 };
    expect(mapGuessStrategy.grade(round, at(882), ctx)).toMatchObject({ distanceKm: 882, points: 500, correct: true });
    expect(mapGuessStrategy.grade(round, at(883), ctx)).toMatchObject({ distanceKm: 883, points: 499, correct: false });
    expect(mapGuessStrategy.grade(round, at(50), ctx)).toMatchObject({ distanceKm: 50, points: 1000, correct: true });
  });

  it("streakBefore: kesintisiz doğrular sayılır, yanlış ya da cevapsız tur seriyi böler", () => {
    const mk = (correct: boolean | undefined): StoredRound => ({
      code: "AA", names: { tr: { name: "A" } }, flag: null, capital: [], latitude: null, longitude: null, options: [],
      ...(correct === undefined ? {} : { result: { answer: "AA", correct, points: 0, speedBonus: 0, streakBonus: 0, streak: 0, elapsedMs: 0, timedOut: false, distanceKm: null, answeredAt: "" } }),
    });
    const rounds = [mk(true), mk(true), mk(false), mk(true), mk(true), mk(true), mk(undefined)];
    expect(streakBefore(rounds, 0)).toBe(0);
    expect(streakBefore(rounds, 2)).toBe(2);
    expect(streakBefore(rounds, 3)).toBe(0);
    expect(streakBefore(rounds, 6)).toBe(3);
    expect(streakBefore(rounds, 7)).toBe(0);
  });

  it("strategyFor üç türü de çözer; tur sayıları belgedeki gibi", () => {
    expect(GAME_TYPES.map((t) => strategyFor(t).rounds)).toEqual([10, 10, 5]);
    for (const type of GAME_TYPES) expect(strategyFor(type).type).toBe(type);
  });
});

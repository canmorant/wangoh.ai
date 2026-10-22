import { flagUrl } from "../content/assets.js";
import type { GameType } from "../db/schema/enums.js";
import { resolveTranslation, type Lang } from "../common/lang.js";
import { AppException, type FieldErrorDetail } from "../common/errors.js";
import { CHOICE_OPTIONS, CHOICE_ROUNDS, GameErrorCode, MAP_GUESS_ROUNDS, MIN_POOL_SIZE, SHARED_FLAG_DEPENDENCIES } from "./games.constants.js";
import type { CountryNames, GradeContext, Graded, PoolCountry, StoredAnswer, StoredOption, StoredRound } from "./games.types.js";
import { type Rng, sample, shuffle } from "./rng.js";
import { scoreChoiceRound, scoreMapGuess, validateLatLng } from "./scoring.js";

/** Harita oyununda bir turun "doğru" sayılması için en düşük tur puanı (≈ 880 km içi). */
export const MAP_CORRECT_MIN_POINTS = 500;

/** İstemciye giden soru: hedefin KENDİSİNİ ele vermez (bayrak sorusunda bayrağın kendisi sorudur). */
export interface QuestionView {
  /** Emoji bayrak (yalnız `flag-quiz`). */
  flag: string | null;
  /** Bayrak görseli (yalnız `flag-quiz`). */
  flagUrl: string | null;
  /** Sorulan ülkenin adı (`capital-quiz`, `map-guess`). */
  countryName: string | null;
}

export interface OptionView {
  id: string;
  label: string;
}

export interface CorrectAnswerView {
  code: string;
  label: string;
  /** Yalnız `map-guess`: hedef konum. */
  lat: number | null;
  lng: number | null;
}

/**
 * Tür başına oyun kuralı. Motor saftır: veritabanı, saat ve rastgelelik dışarıdan gelir (`Rng`), böylece
 * birim testlerde deterministik, üretimde `crypto` tabanlıdır.
 */
export interface GameStrategy {
  readonly type: GameType;
  readonly rounds: number;
  /** Havuza girmeye uygun ülke mi? (`capital-quiz`: başkenti var; `map-guess`: koordinatı var.) */
  isEligible(country: PoolCountry): boolean;
  /** Havuzdan `rounds` turu kurar. Havuz yetersizse 409 `GAME_POOL_TOO_SMALL`. */
  buildRounds(pool: readonly PoolCountry[], rng: Rng): StoredRound[];
  /**
   * Ham cevabı bu turun biçimine göre doğrular; geçersizse 400 `VALIDATION_FAILED` (doğru cevabı sızdırmaz).
   * `null` ("cevap yok": süre doldu ya da pas) her türde geçerlidir ve `null` döner.
   */
  parseAnswer(raw: unknown, round: StoredRound): StoredAnswer;
  grade(round: StoredRound, answer: StoredAnswer, ctx: GradeContext): Graded;
  question(round: StoredRound, lang: Lang, assetsBase: string): QuestionView;
  /** Çoktan seçmeli: 4 seçenek; `map-guess`: `null`. */
  options(round: StoredRound, lang: Lang): OptionView[] | null;
  correctAnswer(round: StoredRound, lang: Lang): CorrectAnswerView;
}

export function poolTooSmall(): AppException {
  return AppException.conflict("Bu oyun için yeterli ülke verisi yok. Lütfen daha sonra tekrar deneyin.", GameErrorCode.POOL_TOO_SMALL);
}

const invalidAnswer = (details: FieldErrorDetail[]): AppException => AppException.validation(details, "Cevap geçersiz.");

const nameOf = (names: CountryNames, lang: Lang): string => resolveTranslation(names, undefined, lang).value.name;

const norm = (text: string): string => text.normalize("NFKC").trim().toLowerCase();

/** Havuzdaki bir ülkeden, hedefle çakışmayan 3 yanlış seçenek: önce aynı kıta, yetmezse diğer kıtalar. */
function pickDistractors(target: PoolCountry, pool: readonly PoolCountry[], count: number, keysOf: (c: PoolCountry) => string[], rng: Rng): PoolCountry[] {
  const used = new Set(keysOf(target));
  const candidates = pool.filter((c) => c.code !== target.code);
  const sameContinent = shuffle(
    candidates.filter((c) => c.continentSlug === target.continentSlug),
    rng,
  );
  const elsewhere = shuffle(
    candidates.filter((c) => c.continentSlug !== target.continentSlug),
    rng,
  );
  const picked: PoolCountry[] = [];
  for (const candidate of [...sameContinent, ...elsewhere]) {
    if (picked.length === count) break;
    const keys = keysOf(candidate);
    // Etiketi hedefle ya da seçilmiş başka bir seçenekle aynı olan ülke (ör. aynı başkent adı) belirsizlik yaratır.
    if (keys.length === 0 || keys.some((k) => used.has(k))) continue;
    for (const k of keys) used.add(k);
    picked.push(candidate);
  }
  if (picked.length < count) throw poolTooSmall();
  return picked;
}

function storedOption(c: PoolCountry): StoredOption {
  return { code: c.code, names: c.names, capital: c.capital };
}

function baseRound(c: PoolCountry): Omit<StoredRound, "options"> {
  return { code: c.code, names: c.names, flag: c.flag, capital: c.capital, latitude: c.latitude, longitude: c.longitude };
}

interface ChoiceSpec {
  type: Extract<GameType, "flag-quiz" | "capital-quiz">;
  isEligible(c: PoolCountry): boolean;
  /** Seçenek etiketinin karşılaştırma anahtarları (aynı anahtar iki seçenekte olamaz). */
  keysOf(c: PoolCountry): string[];
  optionLabel(o: StoredOption, lang: Lang): string;
  question(round: StoredRound, lang: Lang, assetsBase: string): QuestionView;
}

/** `flag-quiz` ve `capital-quiz` için ortak çoktan seçmeli motor. */
function choiceStrategy(spec: ChoiceSpec): GameStrategy {
  return {
    type: spec.type,
    rounds: CHOICE_ROUNDS,
    isEligible: spec.isEligible,

    buildRounds(pool, rng) {
      const eligible = pool.filter(spec.isEligible);
      if (eligible.length < MIN_POOL_SIZE) throw poolTooSmall();
      return sample(eligible, CHOICE_ROUNDS, rng).map((target) => {
        const distractors = pickDistractors(target, eligible, CHOICE_OPTIONS - 1, spec.keysOf, rng);
        // Fisher-Yates: doğru cevap dört konumdan birinde, eşit olasılıkla.
        const options = shuffle([target, ...distractors], rng).map(storedOption);
        return { ...baseRound(target), options };
      });
    },

    parseAnswer(raw, round) {
      if (raw === null) return null;
      if (typeof raw !== "string") {
        throw invalidAnswer([{ field: "answer", code: "isString", message: "Cevap, seçeneklerden birinin ülke kodu olmalı." }]);
      }
      const code = raw.trim().toUpperCase();
      if (!round.options.some((o) => o.code === code)) {
        throw invalidAnswer([{ field: "answer", code: "isOption", message: "Cevap, sunulan seçeneklerden biri olmalı." }]);
      }
      return code;
    },

    grade(round, answer, ctx) {
      const correct = answer !== null && answer === round.code;
      return { correct, ...scoreChoiceRound({ correct, elapsedMs: ctx.elapsedMs, streakBefore: ctx.streakBefore }), distanceKm: null };
    },

    question: spec.question,
    options: (round, lang) => round.options.map((o) => ({ id: o.code, label: spec.optionLabel(o, lang) })),

    correctAnswer(round, lang) {
      const target: StoredOption = { code: round.code, names: round.names, capital: round.capital };
      return { code: round.code, label: spec.optionLabel(target, lang), lat: null, lng: null };
    },
  };
}

export const flagQuizStrategy: GameStrategy = choiceStrategy({
  type: "flag-quiz",
  isEligible: (c) => c.names.tr.name.trim() !== "" && !SHARED_FLAG_DEPENDENCIES.has(c.code),
  keysOf: (c) => [norm(c.names.tr.name)],
  optionLabel: (o, lang) => nameOf(o.names, lang),
  question: (round, _lang, assetsBase) => ({ flag: round.flag, flagUrl: flagUrl(assetsBase, round.code), countryName: null }),
});

export const capitalQuizStrategy: GameStrategy = choiceStrategy({
  type: "capital-quiz",
  isEligible: (c) => c.names.tr.name.trim() !== "" && c.capital.some((x) => x.trim() !== ""),
  keysOf: (c) => c.capital.filter((x) => x.trim() !== "").map(norm),
  optionLabel: (o) => o.capital.filter((x) => x.trim() !== "").join(" / "),
  question: (round, lang) => ({ flag: null, flagUrl: null, countryName: nameOf(round.names, lang) }),
});

const hasCoordinates = (c: PoolCountry): boolean => c.latitude !== null && c.longitude !== null && validateLatLng({ lat: c.latitude, lng: c.longitude }).length === 0;

export const mapGuessStrategy: GameStrategy = {
  type: "map-guess",
  rounds: MAP_GUESS_ROUNDS,
  isEligible: (c) => c.names.tr.name.trim() !== "" && hasCoordinates(c),

  buildRounds(pool, rng) {
    const eligible = pool.filter((c) => mapGuessStrategy.isEligible(c));
    if (eligible.length < MIN_POOL_SIZE) throw poolTooSmall();
    return sample(eligible, MAP_GUESS_ROUNDS, rng).map((target) => ({ ...baseRound(target), options: [] }));
  },

  parseAnswer(raw) {
    if (raw === null) return null;
    if (typeof raw !== "object" || Array.isArray(raw)) {
      throw invalidAnswer([{ field: "answer", code: "isObject", message: "Cevap { lat, lng } biçiminde olmalı." }]);
    }
    const point = raw as { lat?: unknown; lng?: unknown };
    if (Object.keys(point).some((k) => k !== "lat" && k !== "lng")) {
      throw invalidAnswer([{ field: "answer", code: "whitelistValidation", message: "Cevapta yalnız lat ve lng alanları olabilir." }]);
    }
    const issues = validateLatLng(point);
    if (issues.length > 0) {
      throw invalidAnswer(
        issues.map((i) =>
          i.code === "isLatitude"
            ? { field: i.field, code: i.code, message: "Enlem -90 ile 90 arasında sonlu bir sayı olmalı." }
            : { field: i.field, code: i.code, message: "Boylam -180 ile 180 arasında sonlu bir sayı olmalı." },
        ),
      );
    }
    return { lat: point.lat as number, lng: point.lng as number };
  },

  grade(round, answer) {
    if (answer === null) return { correct: false, points: 0, speedBonus: 0, streakBonus: 0, streak: 0, distanceKm: null };
    const target = { lat: round.latitude as number, lng: round.longitude as number };
    const { distanceKm, points } = scoreMapGuess(answer as { lat: number; lng: number }, target);
    return { correct: points >= MAP_CORRECT_MIN_POINTS, points, speedBonus: 0, streakBonus: 0, streak: 0, distanceKm };
  },

  question: (round, lang) => ({ flag: null, flagUrl: null, countryName: nameOf(round.names, lang) }),
  options: () => null,
  correctAnswer: (round, lang) => ({ code: round.code, label: nameOf(round.names, lang), lat: round.latitude, lng: round.longitude }),
};

const STRATEGIES: Record<GameType, GameStrategy> = {
  "flag-quiz": flagQuizStrategy,
  "capital-quiz": capitalQuizStrategy,
  "map-guess": mapGuessStrategy,
};

export function strategyFor(type: GameType): GameStrategy {
  return STRATEGIES[type];
}

/** Bir turdan önceki art arda doğru sayısı (seri bonusu için). Cevaplanmamış tur seriyi bitirir. */
export function streakBefore(rounds: readonly StoredRound[], index: number): number {
  let streak = 0;
  for (let i = index - 1; i >= 0; i--) {
    if (!rounds[i]?.result?.correct) break;
    streak++;
  }
  return streak;
}


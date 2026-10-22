import type { Translations } from "../db/schema/types.js";

/** Çeviri biçimi: yalnız ad. Oyun, ülke adını oturum anında dondurur (yönetici düzenlemesi oyunu bozmasın). */
export type CountryNames = Translations<{ name: string }>;

/** Havuzdaki bir ülke (motor girdisi). */
export interface PoolCountry {
  code: string;
  continentSlug: string;
  /** Emoji bayrak. */
  flag: string | null;
  names: CountryNames;
  /** Kaynak biçimiyle başkent(ler); `capital-quiz` havuzunda boş değildir. */
  capital: string[];
  latitude: number | null;
  longitude: number | null;
}

/** Çoktan seçmeli bir seçenek: seçeneğin kimliği ülke kodudur. */
export interface StoredOption {
  code: string;
  names: CountryNames;
  capital: string[];
}

/** `null`: cevap verilmedi (süre doldu ya da pas). */
export type StoredAnswer = string | { lat: number; lng: number } | null;

/** Verilmiş cevabın kaydı. Tur sonucunu ve denetim bilgisini taşır (yalnız sunucuda). */
export interface StoredResult {
  answer: StoredAnswer;
  correct: boolean;
  points: number;
  speedBonus: number;
  streakBonus: number;
  /** Bu turdan sonraki art arda doğru sayısı. */
  streak: number;
  /** Sunucunun ölçtüğü süre. */
  elapsedMs: number;
  timedOut: boolean;
  /** Yalnız `map-guess`: tam sayıya yuvarlanmış uzaklık. */
  distanceKm: number | null;
  answeredAt: string;
}

/**
 * `game_sessions.rounds` jsonb elemanı. TÜMÜ SUNUCU SIRRIDIR: hedef, seçenekler ve (cevaplandıysa) sonuç.
 * İstemciye bu nesne asla gitmez; `GameStrategy.question/options` (game-engine.ts) yalnız soru görünümünü üretir.
 */
export interface StoredRound {
  code: string;
  names: CountryNames;
  flag: string | null;
  capital: string[];
  latitude: number | null;
  longitude: number | null;
  /** Çoktan seçmeli: 4 seçenek, görüntülenme sırasıyla (doğru cevap rastgele konumda). `map-guess`: boş. */
  options: StoredOption[];
  result?: StoredResult;
}

export interface Graded {
  correct: boolean;
  points: number;
  speedBonus: number;
  streakBonus: number;
  streak: number;
  distanceKm: number | null;
}

export interface GradeContext {
  elapsedMs: number;
  /** Bu turdan önceki art arda doğru sayısı. */
  streakBefore: number;
}

/** Skor yönetimi için saf yardımcılar: oyun türü etiketleri, "şüpheli" süre ön ayarları, süre biçimi. */

export const GAME_TYPES = ["flag-quiz", "capital-quiz", "map-guess"] as const;
export type GameTypeValue = (typeof GAME_TYPES)[number];

/** Arayüz etiketleri (içerik değil). */
export const GAME_TYPE_LABELS: Record<GameTypeValue, string> = {
  "flag-quiz": "Bayrak",
  "capital-quiz": "Başkent",
  "map-guess": "Harita",
};

export function gameTypeLabel(type: string): string {
  return (GAME_TYPE_LABELS as Record<string, string>)[type] ?? type;
}

export interface DurationPreset {
  /** `maxDurationMs` değeri; `undefined` süzgeci kapatır. */
  value: number | undefined;
  label: string;
}

/**
 * Şüpheli oyun süzgeci için hazır seçenekler. Sunucu `maxDurationMs`i "bu süreye eşit ya da daha kısa" okur;
 * on turluk bir oyunu bu kadar kısa sürede bitirmek insan için neredeyse imkânsızdır (bot belirtisi).
 */
export const DURATION_PRESETS: readonly DurationPreset[] = [
  { value: undefined, label: "Tüm süreler" },
  { value: 2_000, label: "En çok 2 sn" },
  { value: 5_000, label: "En çok 5 sn" },
  { value: 10_000, label: "En çok 10 sn" },
  { value: 20_000, label: "En çok 20 sn" },
];

function decimal(value: number, digits: number): string {
  return value.toFixed(digits).replace(/\.?0+$/, "").replace(".", ",");
}

/** Süreyi okunur yazar: 205 ms -> "0,2 sn", 1800 -> "1,8 sn", 18500 -> "18,5 sn", 125000 -> "2 dk 5 sn". */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "";
  if (ms < 10_000) return `${decimal(ms / 1000, 2)} sn`;
  if (ms < 60_000) return `${decimal(ms / 1000, 1)} sn`;
  let minutes = Math.floor(ms / 60_000);
  let seconds = Math.round((ms % 60_000) / 1000);
  if (seconds === 60) {
    minutes += 1;
    seconds = 0;
  }
  return seconds === 0 ? `${minutes} dk` : `${minutes} dk ${seconds} sn`;
}

/** Tek satırlık sonuç özeti: "1850 puan · 10/10 doğru". */
export function scoreSummary(score: number, correctCount: number, roundsTotal: number): string {
  return `${score} puan · ${correctCount}/${roundsTotal} doğru`;
}

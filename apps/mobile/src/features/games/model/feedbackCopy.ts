/**
 * Cevap sonrası geri bildirim metinleri ve sonuç/lider tablosu açıklamaları. Saf modül.
 * Puan, bonus, seri, mesafe ve doğru cevap SUNUCUDAN gelir; burada yalnız metne dökülür (hesap yok).
 */

import type { AnswerResponseDto, GameSessionDto, LeaderboardEntryDto, LeaderboardMeDto } from "@wangoh/api-client";

import { formatNumber, type GameKind, type LeaderboardPeriodKey } from "./gameTypes";
import type { RoundOutcome } from "./playMachine";

export type FeedbackTone = "success" | "danger";

export interface FeedbackCopy {
  tone: FeedbackTone;
  title: string;
  /** "+135 puan" / "0 puan" */
  pointsLabel: string;
  /** Ek satırlar: doğru cevap, uzaklık. */
  lines: string[];
  /** Küçük rozetler: hız/seri bonusu. */
  chips: string[];
  /** Ekran okuyucuya tek seferde okunacak özet. */
  announcement: string;
}

export function pointsLabel(points: number): string {
  return points > 0 ? `+${formatNumber(points)} puan` : "0 puan";
}

/**
 * @param answered Kullanıcı bir cevap gönderdi mi (false: pas / süre dolunca otomatik `null`).
 */
export function feedbackCopy(kind: GameKind, result: AnswerResponseDto, answered: boolean): FeedbackCopy {
  const lines: string[] = [];
  const chips: string[] = [];
  const target = result.correctAnswer.label;

  let title: string;
  if (result.timedOut) title = "Süre doldu";
  else if (!answered) title = "Cevap verilmedi";
  else if (kind === "map") title = result.correct ? "Yakın tahmin!" : "Hedeften uzak kaldın";
  else title = result.correct ? "Doğru!" : "Yanlış";

  if (kind === "map") {
    lines.push(`Hedef: ${target}`);
    if (result.distanceKm !== null) lines.push(`Tahminin hedefe ${formatNumber(result.distanceKm)} km uzaklıkta`);
  } else if (!result.correct) {
    lines.push(`Doğru cevap: ${target}`);
  }

  if (kind === "choice" && result.correct) {
    if (result.speedBonus > 0) chips.push(`Hız bonusu +${formatNumber(result.speedBonus)}`);
    if (result.streakBonus > 0) chips.push(`Seri bonusu +${formatNumber(result.streakBonus)}`);
    if (result.streak >= 2) chips.push(`${result.streak} üst üste`);
  }

  const label = pointsLabel(result.points);
  const announcement = [title, label, ...lines, ...chips].join(". ");
  return { tone: result.correct ? "success" : "danger", title, pointsLabel: label, lines, chips, announcement };
}

/** Tur şeridindeki bir kutunun ekran okuyucu metni. */
export function outcomeLabel(outcome: Pick<RoundOutcome, "index" | "correct" | "timedOut" | "points">): string {
  const number = outcome.index + 1;
  if (outcome.timedOut) return `Tur ${number}: süre doldu`;
  if (outcome.correct) return `Tur ${number}: doğru, ${pointsLabel(outcome.points)}`;
  return `Tur ${number}: ${outcome.points > 0 ? `${pointsLabel(outcome.points)}` : "yanlış"}`;
}

/** Sonuç ekranı tur özeti: GET oturum yanıtındaki sonuçlardan. */
export function outcomesFromSession(session: Pick<GameSessionDto, "results">): RoundOutcome[] {
  return session.results.map((r) => ({ index: r.index, correct: r.correct, timedOut: r.timedOut, points: r.points }));
}

/** Liderlik satırının ekran okuyucu metni. */
export function entryLabel(entry: Pick<LeaderboardEntryDto, "rank" | "displayName" | "score" | "isMe">): string {
  const base = `${entry.rank}. sıra, ${entry.displayName}, ${formatNumber(entry.score)} puan`;
  return entry.isMe ? `${base}. Bu sensin` : base;
}

export interface RankSummary {
  /** "12. sıra" / "Henüz puanın yok" */
  headline: string;
  detail: string;
  ranked: boolean;
}

const NO_SCORE_DETAIL: Record<LeaderboardPeriodKey, string> = {
  all: "Henüz puanlı bir oyunun yok; oynayıp listeye gir.",
  week: "Son 7 günde puanlı bir oyunun yok; oynayıp listeye gir.",
  day: "Son 24 saatte puanlı bir oyunun yok; oynayıp listeye gir.",
};

/** "Kendi sıram" kartı: sıra yoksa dönemde puanı yok demektir. */
export function rankSummary(me: LeaderboardMeDto, period: LeaderboardPeriodKey): RankSummary {
  if (me.rank === null || me.personalBest === null) {
    return { headline: "Bu dönemde puanın yok", detail: NO_SCORE_DETAIL[period], ranked: false };
  }
  const players = me.totalPlayers > 0 ? ` / ${formatNumber(me.totalPlayers)} oyuncu` : "";
  return {
    headline: `${formatNumber(me.rank)}. sıradasın${players}`,
    detail: `En iyi puanın: ${formatNumber(me.personalBest)}`,
    ranked: true,
  };
}

/** Liste boşken gösterilen metin. */
export function emptyLeaderboardMessage(period: LeaderboardPeriodKey): string {
  switch (period) {
    case "all":
      return "Henüz puanlı oyun yok. İlk puanı sen al.";
    case "week":
      return "Son 7 günde puanlı oyun yok. İlk puanı sen al.";
    case "day":
      return "Son 24 saatte puanlı oyun yok. İlk puanı sen al.";
  }
}

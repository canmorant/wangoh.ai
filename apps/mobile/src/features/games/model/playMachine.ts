/**
 * Oyun akışının saf durum makinesi (React Native içe aktarmaz; birim testle kanıtlanır).
 *
 * Oyun SUNUCU kontrollüdür: doğru cevap oturum bitmeden istemcide yoktur, puanı ve süreyi sunucu
 * hesaplar. Bu makine yalnız "hangi ekranda olmalıyız?" sorusunu yanıtlar; puan/süre hesabı yapmaz.
 * Sunucudan gelen değerler (puan, seri, mesafe, doğru cevap) olduğu gibi taşınır.
 *
 * Yan etkiler (ağ çağrıları, depolama) kancada (`usePlayGame`) çalışır ve sonucu olay olarak bildirir:
 *   idle ─START→ starting ─STARTED→ question ─SUBMIT→ submitting ─ANSWERED→ feedback ─NEXT→ question
 *                                                                              └─(son tur)→ finishing ─FINISHED→ done
 *   idle ─RESTORE→ restoring ─RESTORED→ question | finishing | ended
 * Hata kolları: LOAD_FAILED/FINISH_FAILED → failed (RETRY ile yeniden), SUBMIT_FAILED → question (hata bannerı),
 * SESSION_ENDED → ended (süre doldu, etkin değil, bulunamadı).
 */

import type { AnswerResponseDto, GameRoundDto, GameSessionDto, StartSessionResponseDto } from "@wangoh/api-client";

import { roundTimingOf, type RoundTiming } from "./countdown";
import type { EndReason } from "./gameErrors";
import type { PlayableGameType } from "./gameTypes";

export interface Point {
  lat: number;
  lng: number;
}

/** Seçenek kimliği (ülke kodu), harita noktası ya da `null` (pas / süre doldu). */
export type Answer = string | Point | null;

export interface SessionMeta {
  sessionId: string;
  gameType: PlayableGameType;
  roundsTotal: number;
  expiresAt: string;
}

/**
 * Cevap bekleyen tur ve yanıtın alındığı anda dondurulan saati (yalnız geri sayım göstergesi için).
 * Saat sunucu saatine göre kurulur (`serverNow`), yerel monotonik zamanla işler; aygıt saati kullanılmaz (bkz. `countdown.ts`).
 */
export interface RoundClock {
  round: GameRoundDto;
  timing: RoundTiming;
}

/** Cevaplanmış turun sunucu özeti (ilerleme şeridi için). */
export interface RoundOutcome {
  index: number;
  correct: boolean;
  timedOut: boolean;
  points: number;
}

export type FailedAction = "start" | "restore" | "finish";

interface LiveFields {
  session: SessionMeta;
  current: RoundClock;
  /** Sunucunun bildirdiği toplam puan. */
  score: number;
  history: RoundOutcome[];
}

export type PlayState =
  | { phase: "idle" }
  | { phase: "starting" }
  | { phase: "restoring"; sessionId: string }
  | ({
      phase: "question";
      /** Son seçilen/gönderilmeye çalışılan cevap (harita noktası ya da yeniden gönderilecek seçenek). */
      selection: string | Point | null;
      /** Son gönderim hatası; varsa banner çıkar, cevap yeniden gönderilebilir. */
      error: unknown | null;
      /** Geçici bilgi (ör. eşitleme sonrası "kaldığın yerden devam"). */
      notice: string | null;
    } & LiveFields)
  | ({ phase: "submitting"; answer: Answer } & LiveFields)
  | ({ phase: "feedback"; answer: Answer; result: AnswerResponseDto; next: RoundClock | null } & LiveFields)
  | { phase: "finishing"; session: SessionMeta; score: number }
  | { phase: "done"; sessionId: string }
  | { phase: "ended"; reason: EndReason; sessionId: string | null }
  | { phase: "failed"; action: FailedAction; error: unknown; sessionId: string | null; session: SessionMeta | null; score: number };

/** Olaylardaki `now`: yanıtın alındığı yerel MONOTONİK an (`monotonicNow()`), duvar saati değil. */
export type PlayEvent =
  | { type: "START" }
  | { type: "STARTED"; response: StartSessionResponseDto; now: number }
  | { type: "RESTORE"; sessionId: string }
  | { type: "RESTORED"; snapshot: GameSessionDto; now: number; notice?: string }
  | { type: "LOAD_FAILED"; action: "start" | "restore"; error: unknown }
  | { type: "SELECT"; answer: string | Point }
  | { type: "SUBMIT"; answer: Answer }
  | { type: "ANSWERED"; response: AnswerResponseDto; now: number }
  | { type: "SUBMIT_FAILED"; error: unknown }
  | { type: "NEXT" }
  | { type: "FINISHED" }
  | { type: "FINISH_FAILED"; error: unknown }
  | { type: "RETRY" }
  | { type: "SESSION_ENDED"; reason: EndReason };

export const initialPlayState: PlayState = { phase: "idle" };

function metaOf(source: { sessionId: string; gameType: PlayableGameType; roundsTotal: number; expiresAt: string }): SessionMeta {
  return { sessionId: source.sessionId, gameType: source.gameType, roundsTotal: source.roundsTotal, expiresAt: source.expiresAt };
}

function clockOf(round: GameRoundDto, receivedAt: number): RoundClock {
  return { round, timing: roundTimingOf(round, receivedAt) };
}

function questionState(
  session: SessionMeta,
  current: RoundClock,
  score: number,
  history: RoundOutcome[],
  notice: string | null = null,
): PlayState {
  return { phase: "question", session, current, score, history, selection: null, error: null, notice };
}

/** GET oturum yanıtını ekrana çevirir (geri yükleme ve 409 sonrası eşitleme). */
function stateFromSnapshot(snapshot: GameSessionDto, now: number, notice: string | null): PlayState {
  const session = metaOf(snapshot);
  switch (snapshot.status) {
    case "active": {
      if (snapshot.round) {
        const history = snapshot.results.map((r) => ({ index: r.index, correct: r.correct, timedOut: r.timedOut, points: r.points }));
        const current = clockOf(snapshot.round, now);
        return questionState(session, current, snapshot.score, history, notice);
      }
      // Tüm turlar cevaplanmış ama oyun bitirilmemiş: bitirme çağrısı idempotenttir.
      return { phase: "finishing", session, score: snapshot.score };
    }
    case "finished":
      return { phase: "finishing", session, score: snapshot.score };
    case "expired":
      return { phase: "ended", reason: "expired", sessionId: snapshot.sessionId };
    case "abandoned":
      return { phase: "ended", reason: "notActive", sessionId: snapshot.sessionId };
  }
}

export function playReducer(state: PlayState, event: PlayEvent): PlayState {
  switch (event.type) {
    case "START":
      if (state.phase === "idle" || state.phase === "ended" || state.phase === "failed") return { phase: "starting" };
      return state;

    case "STARTED": {
      if (state.phase !== "starting") return state;
      const { response } = event;
      const current = clockOf(response.round, event.now);
      return questionState(metaOf(response), current, 0, []);
    }

    case "RESTORE":
      if (state.phase === "idle" || state.phase === "ended" || state.phase === "failed") {
        return { phase: "restoring", sessionId: event.sessionId };
      }
      return state;

    case "RESTORED":
      // finishing: "oyun bitmedi" (409) yanıtı sonrası sunucuyla eşitleme.
      if (
        state.phase === "restoring" ||
        state.phase === "submitting" ||
        state.phase === "question" ||
        state.phase === "feedback" ||
        state.phase === "finishing"
      ) {
        return stateFromSnapshot(event.snapshot, event.now, event.notice ?? null);
      }
      return state;

    case "LOAD_FAILED":
      if (state.phase === "starting") return { phase: "failed", action: "start", error: event.error, sessionId: null, session: null, score: 0 };
      if (state.phase === "restoring") {
        return { phase: "failed", action: "restore", error: event.error, sessionId: state.sessionId, session: null, score: 0 };
      }
      return state;

    case "SELECT":
      if (state.phase !== "question") return state;
      return { ...state, selection: event.answer, error: null, notice: null };

    case "SUBMIT":
      // Çift dokunma koruması: yalnız "question" aşamasından geçilir; submitting'de gelen olay yok sayılır.
      if (state.phase !== "question") return state;
      return {
        phase: "submitting",
        answer: event.answer,
        session: state.session,
        current: state.current,
        score: state.score,
        history: state.history,
      };

    case "ANSWERED": {
      if (state.phase !== "submitting") return state;
      const { response } = event;
      const outcome: RoundOutcome = {
        index: state.current.round.index,
        correct: response.correct,
        timedOut: response.timedOut,
        points: response.points,
      };
      // Sonraki turun sayacı geri bildirim payının sonunda başlar (startedAt gelecekte); saat bu yanıttan itibaren işler.
      const next: RoundClock | null = response.nextRound ? clockOf(response.nextRound, event.now) : null;
      return {
        phase: "feedback",
        answer: state.answer,
        result: response,
        next,
        session: state.session,
        current: state.current,
        score: response.score,
        history: [...state.history, outcome],
      };
    }

    case "SUBMIT_FAILED":
      if (state.phase !== "submitting") return state;
      return {
        phase: "question",
        selection: state.answer,
        error: event.error,
        notice: null,
        session: state.session,
        current: state.current,
        score: state.score,
        history: state.history,
      };

    case "NEXT":
      if (state.phase !== "feedback") return state;
      if (state.next) return questionState(state.session, state.next, state.score, state.history);
      return { phase: "finishing", session: state.session, score: state.score };

    case "FINISHED":
      if (state.phase !== "finishing") return state;
      return { phase: "done", sessionId: state.session.sessionId };

    case "FINISH_FAILED":
      if (state.phase !== "finishing") return state;
      return {
        phase: "failed",
        action: "finish",
        error: event.error,
        sessionId: state.session.sessionId,
        session: state.session,
        score: state.score,
      };

    case "RETRY": {
      if (state.phase !== "failed") return state;
      if (state.action === "start") return { phase: "starting" };
      if (state.action === "restore" && state.sessionId) return { phase: "restoring", sessionId: state.sessionId };
      if (state.action === "finish" && state.session) return { phase: "finishing", session: state.session, score: state.score };
      return state;
    }

    case "SESSION_ENDED": {
      if (state.phase === "idle" || state.phase === "done") return state;
      const sessionId =
        "session" in state && state.session ? state.session.sessionId : state.phase === "restoring" ? state.sessionId : null;
      return { phase: "ended", reason: event.reason, sessionId };
    }
  }
}

/** Oyun sürüyor mu (çıkış onayı gerektirir)? */
export function isInProgress(state: PlayState): boolean {
  return state.phase === "question" || state.phase === "submitting" || state.phase === "feedback";
}

/** Ağ çağrısı bekleniyor mu (etkileşimi kilitle, yükleniyor göster)? */
export function isBusy(state: PlayState): boolean {
  return state.phase === "starting" || state.phase === "restoring" || state.phase === "finishing" || state.phase === "submitting";
}

/** Oyun ekranının ortak alanları; ilerleyen oyun dışında null. */
export function liveOf(state: PlayState): LiveFields | null {
  if (state.phase === "question" || state.phase === "submitting" || state.phase === "feedback") {
    return { session: state.session, current: state.current, score: state.score, history: state.history };
  }
  return null;
}

/** 1 tabanlı tur numarası ("Tur 3 / 10"). */
export function roundNumberOf(state: PlayState): number | null {
  const live = liveOf(state);
  return live ? live.current.round.index + 1 : null;
}

/** Sunucunun doğru saydığı tur sayısı (ilerleme şeridi özeti). */
export function correctCountOf(history: readonly RoundOutcome[]): number {
  return history.reduce((total, outcome) => total + (outcome.correct ? 1 : 0), 0);
}

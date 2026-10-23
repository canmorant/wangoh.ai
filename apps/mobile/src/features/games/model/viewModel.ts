/**
 * Durum -> ekran eşlemeleri (saf): seçeneğin görünümü ve sonuç ekranının ne yapacağı.
 * Oturum durumu ekranı belirler; puan/süre hesabı yoktur.
 */

import type { GameSessionDto } from "@wangoh/api-client";

import type { EndReason } from "./gameErrors";
import type { Answer, PlayState, Point } from "./playMachine";

/** Seçeneğin görünümü: bekleyen (gönderiliyor), açıklanan doğru, yanlış seçilen, silikleşen. */
export type OptionVisual = "idle" | "pending" | "correct" | "wrong" | "dimmed";

export interface OptionView {
  visual: OptionVisual;
  /** Kullanıcı bu seçeneği seçti mi (doğru olsa da olmasa da)? */
  chosen: boolean;
  /** Dokunulamaz mı (gönderim sürerken ve cevap sonrası)? */
  disabled: boolean;
}

/**
 * Çoktan seçmeli bir seçeneğin görünümü.
 * question: seçim yok ya da başarısız gönderimin seçimi vurgulu (yeniden denenebilir, başka seçenek de seçilebilir);
 * submitting: seçilen "gönderiliyor", diğerleri kilitli; feedback: doğru cevap yeşil, yanlış seçim kırmızı, kalanlar silik.
 */
export function optionViewFor(state: PlayState, optionId: string): OptionView {
  switch (state.phase) {
    case "question": {
      const chosen = state.selection === optionId;
      return { visual: chosen ? "pending" : "idle", chosen, disabled: false };
    }
    case "submitting": {
      const chosen = state.answer === optionId;
      return { visual: chosen ? "pending" : "idle", chosen, disabled: true };
    }
    case "feedback": {
      const chosen = state.answer === optionId;
      if (optionId === state.result.correctAnswer.code) return { visual: "correct", chosen, disabled: true };
      if (chosen) return { visual: "wrong", chosen, disabled: true };
      return { visual: "dimmed", chosen: false, disabled: true };
    }
    default:
      return { visual: "idle", chosen: false, disabled: true };
  }
}

/** Sonuç ekranı, oturumun GET yanıtına göre ne yapar? */
export type ResultPlan =
  | { type: "finish" }
  /** Oyun bitmemiş: devam et. */
  | { type: "unfinished" }
  | { type: "ended"; reason: EndReason };

export function resultPlan(session: Pick<GameSessionDto, "status" | "round">): ResultPlan {
  switch (session.status) {
    case "finished":
      return { type: "finish" };
    case "active":
      // Tüm turlar cevaplanmışsa (round null) bitirme çağrısı idempotent ve geçerlidir.
      return session.round === null ? { type: "finish" } : { type: "unfinished" };
    case "expired":
      return { type: "ended", reason: "expired" };
    case "abandoned":
      return { type: "ended", reason: "notActive" };
  }
}

/** Yükleme ekranı metni: hangi aşamadayız? */
export function loadingMessage(phase: PlayState["phase"]): string {
  switch (phase) {
    case "starting":
      return "Oyun hazırlanıyor…";
    case "restoring":
      return "Oyun yükleniyor…";
    case "finishing":
      return "Sonuç hesaplanıyor…";
    case "done":
      return "Sonuç açılıyor…";
    default:
      return "Yükleniyor…";
  }
}

/** Cevap bir harita noktasıysa onu verir (seçenek kimliği ya da `null` ise null). */
export function pointOf(answer: Answer): Point | null {
  return typeof answer === "object" && answer !== null ? answer : null;
}

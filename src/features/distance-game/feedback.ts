/* ------------------------------------------------------------------ *
 *  Dokunsal ve işitsel geri bildirim — yalnız istemcide, yalnız kullanıcı
 *  etkileşiminde çağrılır.
 *
 *  Titreşim: navigator.vibrate (Android tarayıcı/WebView; iOS desteklemez ve
 *  sessizce atlanır). Çok kısa darbeler. "Hareketi azalt" açıksa titreşim yok.
 *
 *  Ses: dosya yok; WebAudio ile sentezlenen kısa tonlar. Varsayılan KAPALI,
 *  tercih localStorage'da (useDistanceGame). Ses bağlamı ilk kullanıcı
 *  hareketinde kurulur (tarayıcılar kendiliğinden başlatmaya izin vermez).
 * ------------------------------------------------------------------ */

import type { Verdict } from "./scoring";

/** Kaydırıcıda "tık" hissi verilen mesafeler (km): 1-2-5 dizisi. */
export const DETENTS_KM = [100, 200, 500, 1000, 2000, 5000, 10000] as const;

/** km değerinin geçtiği "tık" sayısı; iki değer arasında farklıysa bir eşik aşıldı. */
export const detentIndex = (km: number): number => DETENTS_KM.filter((d) => km >= d).length;

const reducedMotion = (): boolean => {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

/** Kısa titreşim. Desteklenmiyorsa, izin yoksa ya da hareket azaltılmışsa sessizce hiçbir şey yapmaz. */
export function vibrate(pattern: number | number[]): void {
  try {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function" || reducedMotion()) return;
    navigator.vibrate(pattern);
  } catch {
    /* titreşim API'si izin vermedi: yok say */
  }
}

/* -------------------------------- ses -------------------------------- */

type AudioCtor = typeof AudioContext;

let context: AudioContext | null = null;
let enabled = false;

/** Ses efektlerini aç/kapat (tercihi useDistanceGame saklar). */
export function setSoundEnabled(on: boolean): void {
  enabled = on;
}

/** Kullanıcı hareketi içinde çağrılır: ses bağlamını kurar / uyandırır. */
export function unlockAudio(): void {
  try {
    if (!context) {
      const Ctor: AudioCtor | undefined =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
      if (!Ctor) return;
      context = new Ctor();
    }
    if (context.state === "suspended") void context.resume().catch(() => {});
  } catch {
    context = null;
  }
}

interface Note {
  /** Hz */
  freq: number;
  /** Başlangıç gecikmesi, sn */
  at?: number;
  /** Süre, sn */
  dur: number;
  type?: OscillatorType;
  /** 0–1; genel ses zaten düşük tutuluyor. */
  gain?: number;
  /** Frekansın süre boyunca kayacağı hedef (Hz). */
  glideTo?: number;
}

const MASTER_GAIN = 0.16;

function play(notes: Note[]): void {
  if (!enabled) return;
  try {
    unlockAudio();
    const ctx = context;
    if (!ctx || ctx.state === "closed") return;
    const t0 = ctx.currentTime + 0.01;
    for (const note of notes) {
      const start = t0 + (note.at ?? 0);
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = note.type ?? "sine";
      osc.frequency.setValueAtTime(note.freq, start);
      if (note.glideTo) osc.frequency.exponentialRampToValueAtTime(note.glideTo, start + note.dur);
      const peak = (note.gain ?? 1) * MASTER_GAIN;
      // Tıklama sesi çıkmasın diye hızlı yükseliş, üstel sönüm.
      amp.gain.setValueAtTime(0.0001, start);
      amp.gain.exponentialRampToValueAtTime(peak, start + 0.008);
      amp.gain.exponentialRampToValueAtTime(0.0001, start + note.dur);
      osc.connect(amp).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + note.dur + 0.02);
    }
  } catch {
    /* ses kullanılamıyor: oyun sessiz devam eder */
  }
}

// Notalar: do majör pentatonik (hoş ve gergin olmayan).
const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;
const C6 = 1046.5;

/** Kaydırıcıda bir eşiğin geçilmesi. */
export const soundTick = () => play([{ freq: 1480, dur: 0.035, type: "triangle", gain: 0.45 }]);

/** "Tahmin et" düğmesi. */
export const soundGuess = () => play([{ freq: 260, glideTo: 130, dur: 0.14, type: "sine", gain: 0.9 }]);

/** Tur sonucu: yoruma göre kısa bir ezgi. */
export function soundResult(verdict: Verdict): void {
  switch (verdict) {
    case "perfect":
      play([
        { freq: C5, at: 0, dur: 0.18 },
        { freq: E5, at: 0.09, dur: 0.18 },
        { freq: G5, at: 0.18, dur: 0.18 },
        { freq: C6, at: 0.27, dur: 0.5, gain: 0.9 },
      ]);
      break;
    case "great":
      play([
        { freq: E5, at: 0, dur: 0.16 },
        { freq: G5, at: 0.1, dur: 0.38 },
      ]);
      break;
    case "good":
      play([{ freq: G5, dur: 0.3, gain: 0.8 }]);
      break;
    case "fair":
      play([{ freq: E5, dur: 0.26, gain: 0.6 }]);
      break;
    default:
      play([{ freq: 220, glideTo: 165, dur: 0.34, type: "triangle", gain: 0.6 }]);
  }
}

/** Oyun bitti. */
export const soundFinish = () =>
  play([
    { freq: C5, at: 0, dur: 0.22 },
    { freq: G5, at: 0.12, dur: 0.22 },
    { freq: C6, at: 0.24, dur: 0.6, gain: 0.9 },
  ]);

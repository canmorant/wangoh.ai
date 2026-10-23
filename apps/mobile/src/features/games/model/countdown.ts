/**
 * Geri sayım GÖSTERGESİ için saat hesabı. Saf modül.
 *
 * Süreyi ve zaman aşımını SUNUCU belirler (tur başına 20 sn + 3 sn ağ payı); istemci yalnız kalan
 * süreyi gösterir ve süre dolunca "cevap yok" (null) gönderir. Burada puan ya da süre kararı yoktur.
 *
 * AYGIT SAATİ (Date.now, duvar saati) HİÇ KULLANILMAZ: aygıt saati kayık ya da elle değiştirilmiş olabilir.
 * Tur görünümü sunucu saatini taşır (`serverNow`); iki fark yanıt alındığı anda hesaplanır
 *   msToStart    = max(0, startedAt − serverNow)   (turun sayacının başlamasına kalan; geri bildirim payı yüzünden > 0 olabilir)
 *   msToDeadline = deadlineAt − serverNow          (bitişe kalan)
 * ve yanıtın alındığı YEREL MONOTONİK an (`receivedAt`, bkz. `monotonic.ts`) ile birlikte saklanır. Sonrası yalnız monotonik
 * zaman farkıdır: geçen = şimdi − receivedAt. Geri yüklenen oturum (GET) da aynı hesabı kullanır.
 */

/** Kalan süre uyarı rengine dönünce (ms). */
export const URGENT_THRESHOLD_MS = 5000;

/** Tur görünümünün saat alanları (`GameRoundDto`nun alt kümesi). */
export interface ServerRoundClock {
  /** Tur süresi (ms). */
  timeLimitMs: number;
  /** Sayacın başladığı (başlayacağı) sunucu anı (ISO); geri bildirim payı yüzünden yanıtta gelecekte olabilir. */
  startedAt: string;
  /** `startedAt + timeLimitMs` (ISO). */
  deadlineAt: string;
  /** Yanıtın üretildiği sunucu saati (ISO). */
  serverNow: string;
}

/** Yanıt alındığı anda dondurulan tur saati. Değerler yerel monotonik zaman ekseninde yorumlanır. */
export interface RoundTiming {
  /** Yanıtın alındığı yerel monotonik an (ms). */
  receivedAt: number;
  /** Yanıt alındığında turun başlamasına kalan süre (≥ 0). */
  msToStart: number;
  /** Yanıt alındığında bitişe kalan süre (negatif: bitiş yanıttan önce geçmişti). */
  msToDeadline: number;
}

/**
 * Tur görünümünden saat hesabı. Ayrıştırılamayan sunucu saati ya da bitişte güvenli geri dönüş:
 * sayaç yanıt anında başlamış ve tam süre kalmış sayılır (cevabı yine sunucu karara bağlar).
 * Bitiş, sözleşmeye göre `startedAt + timeLimitMs`ten ileri olamaz; olursa bu üst sınıra çekilir
 * (bozuk bir bitiş göstergeyi sonsuza uzatmasın).
 */
export function roundTimingOf(round: ServerRoundClock, receivedAt: number): RoundTiming {
  const limit = Math.max(0, round.timeLimitMs);
  const serverNow = Date.parse(round.serverNow);
  const deadline = Date.parse(round.deadlineAt);
  if (!Number.isFinite(serverNow) || !Number.isFinite(deadline)) return { receivedAt, msToStart: 0, msToDeadline: limit };
  const startedAt = Date.parse(round.startedAt);
  const msToStart = Number.isFinite(startedAt) ? Math.max(0, startedAt - serverNow) : 0;
  return { receivedAt, msToStart, msToDeadline: Math.min(deadline - serverNow, msToStart + limit) };
}

export interface RoundProgress {
  /** Tur henüz başlamadı (sayaç işlemiyor). */
  waiting: boolean;
  /** Turun başlamasına kalan süre (ms, ≥ 0). */
  msToStart: number;
  /** Bitişe kalan süre, 0..timeLimitMs (başlamadan önce tam süre). */
  remainingMs: number;
  /** Çubuğun doluluğu, 0..1. */
  fraction: number;
  /** Bitiş geçti. */
  expired: boolean;
}

/** Yanıt alındığından beri geçen yerel monotonik süre (ms, ≥ 0). */
function elapsedSince(timing: RoundTiming, now: number): number {
  return Math.max(0, now - timing.receivedAt);
}

/** `now` anında turun başlamasına kalan süre (ms, ≥ 0). */
export function msToStartAt(timing: RoundTiming, now: number): number {
  return Math.max(0, timing.msToStart - elapsedSince(timing, now));
}

/** Yerel monotonik `now` anında turun durumu. `now`, `receivedAt` ile aynı saatten (monotonicNow) olmalıdır. */
export function progressAt(timing: RoundTiming, timeLimitMs: number, now: number): RoundProgress {
  const limit = Math.max(0, timeLimitMs);
  const elapsed = elapsedSince(timing, now);
  const msToStart = msToStartAt(timing, now);
  const toDeadline = timing.msToDeadline - elapsed;
  const remainingMs = Math.min(limit, Math.max(0, toDeadline));
  return {
    waiting: msToStart > 0,
    msToStart,
    remainingMs,
    fraction: remainingFraction(remainingMs, limit),
    expired: toDeadline <= 0,
  };
}

/**
 * Geri bildirimden sonra otomatik ilerleme gecikmesi: istenen süre, sonraki turun sayacı başlamadan kalan süreyi
 * (sunucunun geri bildirim payı) AŞMAZ; böylece oyuncu soruya geldiğinde süre onun için harcanmamış olur.
 * Pay bilinmiyorsa (son tur ya da pay 0) istenen süre aynen döner.
 */
export function autoAdvanceDelay(desiredMs: number, next: RoundTiming | null, now: number): number {
  const desired = Math.max(0, desiredMs);
  if (!next || next.msToStart <= 0) return desired;
  return Math.min(desired, msToStartAt(next, now));
}

/** Ekranda gösterilen tam saniye (yukarı yuvarlanır: 0,2 sn kala "1"). */
export function remainingSeconds(ms: number): number {
  return Math.ceil(Math.max(0, ms) / 1000);
}

/** Çubuğun doluluğu, 0..1. */
export function remainingFraction(ms: number, timeLimitMs: number): number {
  if (timeLimitMs <= 0) return 0;
  return Math.min(1, Math.max(0, ms / timeLimitMs));
}

export function isUrgent(ms: number): boolean {
  return ms > 0 && ms <= URGENT_THRESHOLD_MS;
}

/** Ekran okuyucu: "Kalan süre 12 saniye" / "Tur 2 saniye sonra başlıyor. Süre 20 saniye". */
export function countdownLabel(remainingMs: number, msToStart = 0): string {
  const seconds = remainingSeconds(remainingMs);
  if (msToStart > 0) return `Tur ${remainingSeconds(msToStart)} saniye sonra başlıyor. Süre ${seconds} saniye`;
  return `Kalan süre ${seconds} saniye`;
}

/** Geri bildirim ekranında sonraki turun durumu: payın sonuna kadar "başlıyor", sonra "süre işliyor". */
export function nextRoundNotice(progress: Pick<RoundProgress, "waiting" | "msToStart" | "remainingMs">): string {
  if (progress.waiting) return `Sonraki tur ${remainingSeconds(progress.msToStart)} sn içinde başlıyor`;
  return `Süre işliyor: ${remainingSeconds(progress.remainingMs)} sn kaldı`;
}

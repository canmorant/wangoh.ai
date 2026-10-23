/**
 * Geri sayım GÖSTERGESİ için saat yardımcıları. Saf modül.
 *
 * Süreyi ve zaman aşımını SUNUCU belirler (tur başına 20 sn + 3 sn ağ payı); istemci yalnız kalan
 * süreyi gösterir ve süre dolunca "cevap yok" (null) gönderir. Burada puan ya da süre hesabı yoktur.
 * Tüm değerler yerel saat (Date.now) milisaniyesidir; sunucu saatiyle karşılaştırılmaz.
 */

/** Kalan süre uyarı rengine dönünce (ms). */
export const URGENT_THRESHOLD_MS = 5000;

export interface RoundClockInput {
  /** Sunucunun bildirdiği tur süresi (ms). */
  timeLimitMs: number;
  /** Sunucu saatiyle bitiş anı (ISO). */
  deadlineAt: string;
}

/**
 * Yeni gelen tur (başlatma ya da cevap yanıtı): saat, yanıtın ulaştığı andan işler. Sunucu turu biraz
 * önce başlattığından gösterge birkaç yüz ms iyimser kalır; sunucunun 3 sn ağ payı bunu karşılar.
 */
export function deadlineForFreshRound(now: number, timeLimitMs: number): number {
  return now + Math.max(0, timeLimitMs);
}

/**
 * Geri yüklenen tur: kalan süre sunucunun `deadlineAt` anına göre aygıt saatinden hesaplanır.
 * Aygıt saati sunucudan geriyse gösterge tur süresini aşamaz (üst sınır); ayrıştırılamazsa tam süre verilir.
 * Aygıt saati ileriyse gösterge erken biter; bu durumda cevap yine de sunucuda geçerlidir (3 sn pay + sunucu karar verir).
 */
export function deadlineForRestoredRound(round: RoundClockInput, now: number): number {
  const parsed = Date.parse(round.deadlineAt);
  const limit = Math.max(0, round.timeLimitMs);
  if (!Number.isFinite(parsed)) return now + limit;
  return Math.min(parsed, now + limit);
}

export function remainingMs(deadline: number, now: number): number {
  return Math.max(0, deadline - now);
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

export function isExpired(deadline: number, now: number): boolean {
  return now >= deadline;
}

/** Ekran okuyucu: "Kalan süre 12 saniye". */
export function countdownLabel(ms: number): string {
  return `Kalan süre ${remainingSeconds(ms)} saniye`;
}

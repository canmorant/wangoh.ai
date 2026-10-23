/**
 * Yerel MONOTONİK zaman (ms). Geri sayım, aygıt saatinden (Date.now) bağımsız olsun diye bununla ölçülür:
 * kullanıcı saati değiştirse ya da ağ saati ayarlansa da değerler yalnız ileri akar.
 * Mutlak değerin anlamı yoktur; yalnız iki değerin FARKI kullanılır. `performance.now()` yoksa (beklenmez) Date.now'a düşer;
 * bu durumda da tüm hesap aynı fonksiyondan beslenir, kendi içinde tutarlı kalır.
 */
export function monotonicNow(): number {
  const clock = (globalThis as { performance?: { now?: () => number } }).performance;
  return clock && typeof clock.now === "function" ? clock.now() : Date.now();
}

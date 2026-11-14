/**
 * Ana sayfadaki pencere sahnesinin kaydırma mesafesi ve tekerlek desteği.
 *
 * Sahne, yapışkan bir kutunun (100svh) sabit kaldığı mesafe boyunca oynar;
 * kamera ilerlemesi bu mesafenin 0 → 1 oranıdır (bkz. lib/camera). Mesafe
 * kısa tutulur ki ziyaretçi pencereden en çok iki kaydırmada geçsin:
 *
 *   - Dokunmatik ekranda mesafe bir ekran boyundan kısadır; tek bir kaydırma
 *     hareketi çoğu zaman yeter, iki hareket her zaman yeter.
 *   - Fare tekerleği çentik başına ~100 px kaydırır, yani aynı mesafe 8–9 çentik
 *     ederdi. Bu yüzden sahnenin içinde tekerlek güçlendirilir: iki çentik
 *     (WHEEL.full) sahnenin tamamını geçirir, kamera hedefe yumuşakça yaklaşır.
 *     Sahnenin dışında kaydırma bire birdir ve tarayıcıya bırakılır.
 *
 * Eşlemeler saf fonksiyonlardır (`npx tsx scripts/hero-scroll.test.ts`);
 * DOM'a yalnız `attachHeroWheel` dokunur.
 */
import { normalizeWheel } from "@/lib/shake";

/** İki sahnenin (WindowHero, CinematicHero) ortak yüksekliği; kaydırma mesafesi bunun 100svh eksiğidir. */
export const HERO_STAGE_HEIGHT = "h-[190svh] sm:h-[200vh]";

export const WHEEL = {
  /** Sahnenin tamamını geçiren tekerlek miktarı (px): fare tekerleğinin iki çentiği. */
  full: 200,
  /** Çentikli bir tekerleğin tek adımı en az bu kadar sayılır. */
  notch: 100,
  /** Kameranın hedefe yaklaşmasının zaman sabiti (sn): iki çentik ~0,6 sn'de pencereden geçirir. */
  settle: 0.24,
} as const;

const gainFor = (travel: number) => Math.max(1, travel / WHEEL.full);

/** Kaydırma konumunu "tekerlek ekseni"ne çevirir: sahnenin başı 0, sonu `travel / kazanç`. */
export function scrollToWheel(y: number, start: number, travel: number): number {
  const gain = gainFor(travel);
  if (y <= start) return y - start;
  if (y >= start + travel) return travel / gain + (y - start - travel);
  return (y - start) / gain;
}

/** `scrollToWheel`in tersi. */
export function wheelToScroll(v: number, start: number, travel: number): number {
  const gain = gainFor(travel);
  const span = travel / gain;
  if (v <= 0) return start + v;
  if (v >= span) return start + travel + (v - span);
  return start + v * gain;
}

/** `from` konumundayken `delta` px tekerlek hareketinin götüreceği kaydırma konumu. */
export function nextTarget(from: number, delta: number, start: number, travel: number): number {
  return wheelToScroll(scrollToWheel(from, start, travel) + delta, start, travel);
}

export interface WheelLike {
  deltaY: number;
  deltaMode: number;
  /** Standart dışı ama yaygın: çentikli farede ±120'nin katı gelir. */
  wheelDeltaY?: number;
}

/**
 * Tekerlek olayının piksel karşılığı. Çentikli fare bazı sistemlerde (macOS'un
 * hızlandırması, Firefox'un satır birimi) çentik başına birkaç piksel bildirir;
 * iki çentiğin her yerde yetmesi için çentik en az WHEEL.notch sayılır.
 * İzleme dörtgeni sürekli küçük değerler gönderir, ona dokunulmaz.
 */
export function wheelDelta(e: WheelLike, viewportH: number): number {
  const px = normalizeWheel(e.deltaY, e.deltaMode, viewportH);
  if (px === 0) return 0;
  const stepped =
    e.deltaMode === 1 ||
    (typeof e.wheelDeltaY === "number" && e.wheelDeltaY !== 0 && Math.abs(e.wheelDeltaY) % 120 === 0);
  return stepped ? Math.sign(px) * Math.max(Math.abs(px), WHEEL.notch) : px;
}

/**
 * Sahnenin içindeki tekerlek hareketini güçlendirir. Yalnız fare/izleme dörtgeni
 * olan cihazlarda ve hareket azaltma istenmemişse çalışır; dokunmatik, klavye ve
 * kaydırma çubuğu her zaman tarayıcının kendi kaydırmasıdır ve süren hareketi keser.
 * İmleç sahnenin dışına çıkınca (sahne geçildikten sonraki bölümler) olaylar buraya
 * gelmez; tarayıcının kaydırması devralır ve `tick` bunu görüp bırakır.
 */
export function attachHeroWheel(stage: HTMLElement, view: HTMLElement): () => void {
  if (typeof window === "undefined") return () => {};
  if (!window.matchMedia("(pointer: fine)").matches) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  let target: number | null = null;
  let pos = 0;
  let wrote = 0;
  let frame = 0;
  let last = 0;

  const stop = () => {
    target = null;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  const tick = (now: number) => {
    frame = 0;
    if (target === null) return;
    // Araya başka bir kaydırma girdiyse (kaydırma çubuğu, bağlantı, kod) kontrolü bırak.
    if (Math.abs(window.scrollY - wrote) > 2) {
      stop();
      return;
    }
    // Üst sınır yalnız uzun duraklamalar (arka plandaki sekme) için; yavaş cihazda süre uzamasın.
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    pos += (target - pos) * (1 - Math.exp(-dt / WHEEL.settle));
    const done = Math.abs(target - pos) < 0.5;
    if (done) pos = target;
    window.scrollTo(0, pos);
    wrote = window.scrollY;
    if (done) target = null;
    else frame = requestAnimationFrame(tick);
  };

  const onWheel = (e: WheelEvent) => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const travel = stage.offsetHeight - view.clientHeight;
    if (travel <= 0) return;
    const start = stage.getBoundingClientRect().top + window.scrollY;
    const end = start + travel;
    const from = target ?? window.scrollY;
    const delta = wheelDelta(e as WheelEvent & { wheelDeltaY?: number }, view.clientHeight);
    if (delta === 0) return;
    // Hareket sürmüyorsa ve sahnenin dışına doğru/dışında kaydırılıyorsa tarayıcıya bırak.
    if (target === null) {
      const outside = delta > 0 ? from >= end - 0.5 || from < start - 0.5 : from <= start + 0.5 || from > end + 0.5;
      if (outside) return;
    }
    e.preventDefault();
    const limit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    target = Math.min(limit, Math.max(0, nextTarget(from, delta, start, travel)));
    if (!frame) {
      pos = window.scrollY;
      wrote = pos;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };

  stage.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", stop);
  window.addEventListener("mousedown", stop);
  window.addEventListener("touchstart", stop, { passive: true });
  return () => {
    stop();
    stage.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", stop);
    window.removeEventListener("mousedown", stop);
    window.removeEventListener("touchstart", stop);
  };
}

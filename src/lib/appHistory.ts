import { routing } from "@/i18n/routing";

/**
 * Uygulamada gezinti geçmişi yardımcıları (geri tuşu ve kenardan çekme hareketi).
 *
 * Ana sayfanın kıta ve ülke görünümleri ayrı sayfa değil, aynı belgede pushState
 * ile açılan görünümler (HomeExperience); sayfalar arası geçiş ise gerçek
 * dosya yüklemesi. İkisinde de history.back() doğru yere döner.
 */

export const LOCATION_CHANGE = "wangoh:locationchange";

/** Ana sayfanın kökünde mi? (Kıta ya da ülke görünümü açık değil, başka sayfa değil.) */
export function isHomeRoot(loc: Pick<Location, "pathname" | "search">): boolean {
  const parts = loc.pathname.replace(/\/index\.html$/, "").split("/").filter(Boolean);
  const atRoot = parts.length === 0 || (parts.length === 1 && (routing.locales as readonly string[]).includes(parts[0]));
  return atRoot && !new URLSearchParams(loc.search).has("kita");
}

/** pushState/replaceState adres değişince de haber versin (popstate bunları yakalamıyor). */
export function patchHistoryEvents(): void {
  const w = window as unknown as { __wangohHistoryPatched?: boolean };
  if (w.__wangohHistoryPatched) return;
  w.__wangohHistoryPatched = true;
  for (const method of ["pushState", "replaceState"] as const) {
    const original = window.history[method];
    window.history[method] = function (this: History, ...args: Parameters<History["pushState"]>) {
      const result = original.apply(this, args);
      window.dispatchEvent(new Event(LOCATION_CHANGE));
      return result;
    };
  }
}

/** Bir önceki yere dön; geçmiş yoksa (uygulama doğrudan bu sayfada açıldıysa) ana sayfaya. */
export function goBackOrHome(homeHref: string): void {
  if (window.history.length > 1) window.history.back();
  else window.location.href = homeHref;
}

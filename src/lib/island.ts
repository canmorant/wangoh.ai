/**
 * Dynamic Island ölçüleri (yalnız uygulama; bkz. IslandFrame ve WindowHero).
 *
 * Ada ≈126×37pt, üst kenarı üst güvenli alanın 48px üstünde (59→11, 62→14).
 * Üst güvenli alan adalı iPhone'larda ≥ 59; çentikli eski modellerde 44–50.
 */
export const ISLAND = {
  /** Çerçevenin siyah zemini: adadan her yönde 1px büyük. */
  W: 128,
  H: 39,
  INSET_TO_TOP: 48,
  MIN_INSET: 55,
} as const;

/** env(safe-area-inset-top), px olarak (WebView ilk karede bildirmeyebilir; çağıran yeniden denemeli). */
export function readSafeTop(): number {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top)";
  document.body.appendChild(probe);
  const value = parseFloat(getComputedStyle(probe).paddingTop) || 0;
  probe.remove();
  return value;
}

/** Adanın ekranın üstünden dikey ortası (px). */
export const islandCenterY = (safeTop: number): number => safeTop - ISLAND.INSET_TO_TOP + ISLAND.H / 2;

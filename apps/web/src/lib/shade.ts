/* ------------------------------------------------------------------ *
 *  Uçak penceresi perdesi — saf sürükleme matematiği
 *
 *  Bileşenden ayrı tutuldu ki sınırlar, atalet ve bırakma davranışı
 *  tarayıcı olmadan da doğrulanabilsin.
 *
 *  Konum bir orandır: 0 = tamamen açık (panel açıklığın üstünde),
 *  1 = tamamen kapalı (panel açıklığı örtüyor).
 * ------------------------------------------------------------------ */

export const SHADE_CONFIG = {
  /** Sayfa açıldığında perdenin durduğu yer. */
  initial: 0.12,
  /**
   * Bırakıldıktan sonraki hafif kayma. Her karede hız bu oranla azalır;
   * 1'e yaklaştıkça perde daha uzun süzülür.
   */
  glideFriction: 0.9,
  /** Bu hızın altında kayma biter (oran/kare). */
  glideStop: 0.0008,
  /** Kaymanın taşıyabileceği en fazla mesafe (oran) — savrulmayı engeller. */
  maxGlide: 0.18,
  /** Tıklama ile sürüklemeyi ayıran piksel eşiği. */
  dragSlop: 4,
  /** Tıklama sonrası yumuşama yayı. */
  spring: { stiffness: 260, damping: 30, mass: 0.6 },
  /** Tamamen kapalıyken dış görüntünün karartma oranı. */
  maxBlackout: 0.97,
};

/** 0 ile 1 arasına sert kilit. Perde hiçbir koşulda çerçeveden taşmaz. */
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Hareketsiz bir basış = TIKLAMA. Perde iki uç arasında gidip gelir.
 */
export function resolveClick(startVal: number): number {
  return startVal > 0.5 ? 0 : 1;
}

/**
 * Ekran pikselini perde oranına çevirir.
 *
 * Kamera ölçeğine bölmek, kahraman sahnesi yakınlaşsa bile tutuşun 1:1
 * hissettirmesini sağlar.
 */
export function dragDelta(
  screenDeltaPx: number,
  openingHeightSvgUnits: number,
  cameraScale: number
): number {
  return screenDeltaPx / Math.max(0.001, cameraScale) / openingHeightSvgUnits;
}

/** Sürükleme sırasındaki konum: doğrudan, gecikmesiz, sınırlar içinde. */
export function dragTo(startVal: number, delta: number): number {
  return clamp01(startVal + delta);
}

/**
 * Bırakma anındaki hızdan (oran/ms) ilk kayma hızını (oran/kare) üretir.
 * Toplam kayma `maxGlide` ile sınırlanır ki hızlı bir savurma perdeyi
 * bir uçtan diğerine fırlatmasın.
 */
export function initialGlide(velocityPerMs: number, cfg = SHADE_CONFIG): number {
  const perFrame = velocityPerMs * 16.7;
  // Geometrik serinin toplamı: v / (1 - f). Bunu maxGlide ile sınırla.
  const maxPerFrame = cfg.maxGlide * (1 - cfg.glideFriction);
  return Math.max(-maxPerFrame, Math.min(maxPerFrame, perFrame));
}

/**
 * Kaymanın tek bir karesi. Yeni konumu ve kalan hızı döndürür; hız
 * eşiğin altına düştüğünde ya da bir uca çarptığında `done` olur.
 */
export function glideStep(
  value: number,
  velocity: number,
  cfg = SHADE_CONFIG
): { value: number; velocity: number; done: boolean } {
  const next = clamp01(value + velocity);
  const nextVel = velocity * cfg.glideFriction;
  const hitEdge = (next === 0 && velocity < 0) || (next === 1 && velocity > 0);
  return {
    value: next,
    velocity: nextVel,
    done: hitEdge || Math.abs(nextVel) < cfg.glideStop,
  };
}

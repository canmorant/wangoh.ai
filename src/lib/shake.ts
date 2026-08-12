/**
 * Shake-to-reveal detection.
 *
 * WHY THIS READS RAW INPUT, NOT scrollY
 * -------------------------------------
 * The first implementation watched `window.scrollY`. That cannot work on this
 * site: Lenis interpolates the scroll position (lerp 0.085), so a fast wheel
 * flick up-then-down is smoothed into a slow, rounded oscillation. The sharp
 * direction reversals the detector needs never survive the damping, so the
 * gesture felt broken no matter how hard the user shook.
 *
 * Feeding raw wheel / touch deltas sidesteps the smoothing entirely and works
 * identically for trackpads, mouse wheels and touch.
 *
 * All thresholds live in SHAKE_CONFIG so they can be tuned in one place.
 */

export interface ShakeConfig {
  /** Direction reversals required inside `windowMs` to fire. */
  reversals: number;
  /** Rolling window, ms. */
  windowMs: number;
  /**
   * Minimum |delta| for an event to count as intent. Filters trackpad
   * momentum settle, which decays toward zero and would otherwise register
   * as a flurry of fake reversals.
   */
  minDelta: number;
  /**
   * Minimum gap between two counted reversals, ms. A single physical flick
   * emits a burst of events; without this, one flick could count several
   * times.
   */
  minReversalGapMs: number;
  /** Refractory period after firing, ms. */
  cooldownMs: number;
}

export const SHAKE_CONFIG: ShakeConfig = {
  // ~2 full up-down cycles. Reachable in well under 2s of deliberate shaking,
  // but unreachable by reading, skimming, or any one-way scroll.
  reversals: 5,
  windowMs: 2500,
  minDelta: 8,
  minReversalGapMs: 70,
  cooldownMs: 8000,
};

export class ShakeDetector {
  private dir = 0;
  private reversals: number[] = [];
  private lastReversalAt = -Infinity;
  private firedAt = -Infinity;

  constructor(private cfg: ShakeConfig = SHAKE_CONFIG) {}

  /**
   * Feed one raw input delta.
   * @returns true exactly once, on the event that completes a shake.
   */
  push(delta: number, now: number): boolean {
    if (!Number.isFinite(delta) || Math.abs(delta) < this.cfg.minDelta) return false;

    const d = delta > 0 ? 1 : -1;

    if (this.dir !== 0 && d !== this.dir && now - this.lastReversalAt >= this.cfg.minReversalGapMs) {
      this.lastReversalAt = now;
      this.reversals.push(now);
      this.reversals = this.reversals.filter((t) => now - t <= this.cfg.windowMs);

      if (this.reversals.length >= this.cfg.reversals && now - this.firedAt >= this.cfg.cooldownMs) {
        this.firedAt = now;
        this.reversals = [];
        this.dir = 0;
        return true;
      }
    }

    this.dir = d;
    return false;
  }

  /** Current progress toward a trigger, 0…1 — drives the pre-reveal feedback. */
  charge(now: number): number {
    const live = this.reversals.filter((t) => now - t <= this.cfg.windowMs).length;
    return Math.min(1, live / this.cfg.reversals);
  }

  reset() {
    this.dir = 0;
    this.reversals = [];
    this.lastReversalAt = -Infinity;
  }
}

/** Normalise WheelEvent.deltaY across deltaMode units to pixels. */
export function normalizeWheel(deltaY: number, deltaMode: number, viewportH = 800): number {
  if (deltaMode === 1) return deltaY * 16; // lines
  if (deltaMode === 2) return deltaY * viewportH; // pages
  return deltaY; // pixels
}

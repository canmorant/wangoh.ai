/**
 * Wheel geometry, in degrees.
 *
 * ONE angle model is used for rendering, for the highlight, and for resolving
 * the result. That is the whole point of this file: a wheel that visually stops
 * on one slice but reports another is always caused by two different pieces of
 * maths, so there is only one here.
 *
 * Convention
 * ----------
 * Angles are measured CLOCKWISE FROM 12 O'CLOCK in wheel-local space.
 * Segment i owns [i * segmentAngle, (i + 1) * segmentAngle).
 * The pointer is fixed at 12 o'clock (0°).
 * `rotation` is the wheel's clockwise rotation in degrees.
 */

export const normalizeDeg = (deg: number) => ((deg % 360) + 360) % 360;

export const segmentAngle = (count: number) => 360 / count;

export const startAngle = (index: number, count: number) => index * segmentAngle(count);

export const endAngle = (index: number, count: number) => (index + 1) * segmentAngle(count);

export const centerAngle = (index: number, count: number) =>
  startAngle(index, count) + segmentAngle(count) / 2;

/**
 * Index of the segment under the pointer for a given wheel rotation.
 * Handles rotations beyond ±360 and negative rotations.
 */
export function selectedIndex(rotation: number, count: number): number {
  const local = normalizeDeg(-rotation);
  const i = Math.floor(local / segmentAngle(count));
  // Defend the boundary where floating point lands exactly on 360.
  return i >= count ? count - 1 : i < 0 ? 0 : i;
}

/** Rotation that puts segment `index` exactly under the pointer. */
export function rotationForIndex(index: number, count: number): number {
  return normalizeDeg(-centerAngle(index, count));
}

/** Shortest signed rotation from `from` to `to`, in degrees. */
export function shortestDeltaDeg(from: number, to: number): number {
  let d = normalizeDeg(to) - normalizeDeg(from);
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

/**
 * Canvas draws angles counter-clockwise-positive from 3 o'clock. Converts a
 * wheel-local clockwise-from-12 angle plus the wheel rotation into the radian
 * value canvas arc() expects.
 */
export function toCanvasRadians(localDeg: number, rotation: number): number {
  return ((localDeg + rotation - 90) * Math.PI) / 180;
}

/**
 * Largest label font size that still fits between neighbouring segments.
 *
 * This is what actually caused the "same country repeated across slices" bug:
 * with 195 segments the labels were larger than the arc spacing between them,
 * so adjacent codes physically overlapped and smeared into looking duplicated.
 */
export function labelFontSize(radius: number, count: number, max = 11, min = 5): number {
  const arcSpacing = (2 * Math.PI * radius) / count;
  return Math.max(min, Math.min(max, arcSpacing * 0.82));
}

/**
 * Verification for the shake-to-reveal detector.
 * Run:  npx tsx scripts/shake.test.ts
 *
 * Simulates realistic wheel/touch event streams. A "flick" is a burst of
 * same-sign events ~16ms apart, which is what a real wheel or trackpad emits.
 */
import { ShakeDetector, SHAKE_CONFIG } from "../src/lib/shake";

type Ev = { d: number; t: number };

/** Build a burst of same-sign events. */
function flick(dir: number, magnitude: number, count: number, startT: number, gap = 16): Ev[] {
  return Array.from({ length: count }, (_, i) => ({ d: dir * magnitude, t: startT + i * gap }));
}

function run(events: Ev[], cfg = SHAKE_CONFIG) {
  const det = new ShakeDetector(cfg);
  const fires: number[] = [];
  for (const e of events) if (det.push(e.d, e.t)) fires.push(e.t);
  return fires;
}

let pass = 0;
let fail = 0;

function check(name: string, actual: boolean, expected: boolean, detail = "") {
  const ok = actual === expected;
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? "  PASS" : "  FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
  if (!ok) console.log(`        expected fire=${expected}, got fire=${actual}`);
}

console.log("\nSHAKE DETECTOR\n" + "=".repeat(60));
console.log(JSON.stringify(SHAKE_CONFIG), "\n");

// 1. Deliberate shake: alternating flicks, ~5/sec — the target gesture.
{
  const evs: Ev[] = [];
  let t = 0;
  for (let i = 0; i < 8; i++) {
    evs.push(...flick(i % 2 === 0 ? 1 : -1, 120, 4, t));
    t += 180;
  }
  const f = run(evs);
  check("deliberate shake (8 flicks over 1.44s)", f.length > 0, true, `fired at ${f[0]}ms`);
}

// 2. Fast one-direction scroll — must never fire.
{
  const evs = flick(1, 240, 120, 0, 12);
  check("fast one-direction scroll (120 events)", run(evs).length > 0, false);
}

// 3. Reading: down, pause, back up once, pause, down again.
{
  const evs = [
    ...flick(1, 100, 10, 0),
    ...flick(-1, 100, 6, 1400),
    ...flick(1, 100, 10, 3000),
  ];
  check("reading pattern (2 reversals, spread out)", run(evs).length > 0, false);
}

// 4. Trackpad momentum settle: small decaying alternating deltas.
{
  const evs: Ev[] = [];
  let t = 0;
  for (let i = 0; i < 60; i++) {
    evs.push({ d: (i % 2 === 0 ? 1 : -1) * (6 - (i % 5)), t });
    t += 14;
  }
  check("trackpad settle noise (sub-threshold deltas)", run(evs).length > 0, false);
}

// 5. One physical flick with jitter inside the burst.
{
  const evs: Ev[] = [];
  let t = 0;
  for (let i = 0; i < 14; i++) {
    // occasional single opposite-sign blip, as real hardware emits
    evs.push({ d: i === 5 || i === 9 ? -90 : 110, t });
    t += 14;
  }
  check("single flick with hardware jitter", run(evs).length > 0, false);
}

// 6a. Cooldown blocks an immediate second shake.
{
  const evs: Ev[] = [];
  let t = 0;
  for (let i = 0; i < 20; i++) {
    evs.push(...flick(i % 2 === 0 ? 1 : -1, 120, 4, t));
    t += 180;
  }
  const f = run(evs);
  check("cooldown blocks repeat", f.length === 1, true, `fires=${f.length}`);
}

// 6b. After the cooldown elapses it can fire again.
{
  const evs: Ev[] = [];
  let t = 0;
  for (let i = 0; i < 8; i++) {
    evs.push(...flick(i % 2 === 0 ? 1 : -1, 120, 4, t));
    t += 180;
  }
  t += SHAKE_CONFIG.cooldownMs + 500;
  for (let i = 0; i < 8; i++) {
    evs.push(...flick(i % 2 === 0 ? 1 : -1, 120, 4, t));
    t += 180;
  }
  const f = run(evs);
  check("fires again after cooldown", f.length === 2, true, `fires=${f.length}`);
}

// 7. Reversals too slow to fall inside the rolling window.
{
  const evs: Ev[] = [];
  let t = 0;
  for (let i = 0; i < 10; i++) {
    evs.push(...flick(i % 2 === 0 ? 1 : -1, 120, 3, t));
    t += 700; // ~1.4 reversals/sec — under the required rate
  }
  check("slow deliberate reversals (0.7s apart)", run(evs).length > 0, false);
}

// 8. Touch: smaller deltas, slower cadence, still a real shake.
{
  const evs: Ev[] = [];
  let t = 0;
  for (let i = 0; i < 8; i++) {
    evs.push(...flick(i % 2 === 0 ? 1 : -1, 30, 5, t, 20));
    t += 220;
  }
  const f = run(evs);
  check("touch-scale shake (30px deltas)", f.length > 0, true, `fired at ${f[0]}ms`);
}

// 9. Time-to-trigger for a vigorous shake — discoverability check.
{
  const evs: Ev[] = [];
  let t = 0;
  for (let i = 0; i < 12; i++) {
    evs.push(...flick(i % 2 === 0 ? 1 : -1, 150, 3, t, 14));
    t += 150;
  }
  const f = run(evs);
  console.log(`\n  time-to-trigger, vigorous shake: ${f[0]}ms`);
  check("vigorous shake fires within 2s", f.length > 0 && f[0] <= 2000, true);
}

console.log("\n" + "=".repeat(60));
console.log(`${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);

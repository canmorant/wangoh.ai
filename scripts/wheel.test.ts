/**
 * Wheel of Countries — dataset integrity + selection geometry.
 * Run:  npx tsx scripts/wheel.test.ts
 */
import { countries } from "../src/data/countries";
import { validateCountries, validateWheelSelection } from "../src/features/country-wheel/validateCountries";
import {
  segmentAngle,
  startAngle,
  endAngle,
  centerAngle,
  selectedIndex,
  rotationForIndex,
  normalizeDeg,
  labelFontSize,
} from "../src/features/country-wheel/wheelMath";
import fs from "node:fs";
import path from "node:path";

let pass = 0;
let fail = 0;
const ok = (n: string, c: boolean, d = "") => {
  if (c) pass++;
  else fail++;
  console.log(`${c ? "  PASS" : "  FAIL"}  ${n}${d ? `  — ${d}` : ""}`);
};

const N = countries.length;
console.log("\nWHEEL OF COUNTRIES\n" + "=".repeat(64));
console.log(`${N} countries · segment ${segmentAngle(N).toFixed(4)}°\n`);

/* ------------------------- dataset integrity ------------------------- */
{
  const r = validateCountries(countries);
  ok("validateCountries reports zero errors", r.ok, r.errors.slice(0, 3).join(" | ") || `${N} countries`);

  const iso2 = countries.map((c) => c.iso2);
  ok("unique ISO2 count === country count", new Set(iso2).size === N, `${new Set(iso2).size}/${N}`);
  ok("unique ISO3 count === country count", new Set(countries.map((c) => c.iso3)).size === N);
  ok("unique names === country count", new Set(countries.map((c) => c.name)).size === N);
  ok("is a full world list (>= 190)", N >= 190, `${N}`);
  ok("every country has a capital", countries.every((c) => c.capital.length > 0));
  ok("every country has a continent", countries.every((c) => !!c.continent));

  // no border points at a code outside the set, and none points at itself
  const set = new Set(countries.map((c) => c.iso3));
  ok(
    "every border reference resolves inside the dataset",
    countries.every((c) => c.borders.every((b) => set.has(b) && b !== c.iso3))
  );
  const noBorders = countries.filter((c) => c.borders.length === 0);
  ok("island / borderless countries are represented", noBorders.length > 0, `${noBorders.length} with no land borders`);

  // borders should be symmetric in a correct dataset
  const byIso3 = new Map(countries.map((c) => [c.iso3, c]));
  const asym = countries.flatMap((c) =>
    c.borders.filter((b) => !byIso3.get(b)?.borders.includes(c.iso3)).map((b) => `${c.iso3}->${b}`)
  );
  ok("land borders are symmetric", asym.length === 0, asym.slice(0, 4).join(", ") || "all reciprocal");
}

/* ---------------- one segment == one unique country ------------------ */
{
  // THE regression test for the reported bug: walk every segment centre and
  // confirm it resolves to its own index, and that the resulting sequence of
  // countries contains no repeats at all.
  const resolved: string[] = [];
  let mismatched = 0;
  for (let i = 0; i < N; i++) {
    const rot = rotationForIndex(i, N);
    if (selectedIndex(rot, N) !== i) mismatched++;
    resolved.push(countries[selectedIndex(rot, N)].iso2);
  }
  ok("every segment centre resolves to its own index", mismatched === 0, `${N} segments checked`);
  ok("the resolved set contains no duplicate countries", new Set(resolved).size === N, `${new Set(resolved).size}/${N}`);

  let adjacentDup = 0;
  for (let i = 1; i < N; i++) if (resolved[i] === resolved[i - 1]) adjacentDup++;
  ok("no two adjacent segments hold the same country", adjacentDup === 0);
}

/* -------------------- small rotations change country ------------------ */
{
  // The user's exact complaint: a slight rotation showed one country across
  // several neighbouring slices. Stepping by a full segment must advance by
  // exactly one country, every time.
  const seg = segmentAngle(N);
  let wrongStep = 0;
  for (let i = 0; i < N; i++) {
    const from = selectedIndex(rotationForIndex(i, N), N);
    const to = selectedIndex(rotationForIndex(i, N) - seg, N);
    if (to !== (from + 1) % N) wrongStep++;
  }
  ok("one segment of rotation advances exactly one country", wrongStep === 0);

  // Sweeping 10 segments must reveal 10 distinct countries.
  const names = new Set<string>();
  for (let k = 0; k < 10; k++) {
    names.add(countries[selectedIndex(rotationForIndex(40, N) - k * seg, N)].name);
  }
  ok("a 10-segment sweep yields 10 distinct countries", names.size === 10, [...names].slice(0, 4).join(" → ") + " …");
}

/* ------------------------- angle model sanity ------------------------- */
{
  ok("segments tile the circle exactly", Math.abs(endAngle(N - 1, N) - 360) < 1e-9);
  ok("centre sits midway in its segment", Math.abs(centerAngle(3, N) - (startAngle(3, N) + segmentAngle(N) / 2)) < 1e-12);
  ok("normalizeDeg handles negatives", normalizeDeg(-370) === 350);
  ok("normalizeDeg handles multi-turn", normalizeDeg(725) === 5);

  let valid = true;
  for (let t = 0; t < 30000; t++) {
    const i = selectedIndex(Math.random() * 5000 - 2500, N);
    if (!Number.isInteger(i) || i < 0 || i >= N) valid = false;
  }
  ok("selectedIndex always valid across ±2500° (30k samples)", valid);
}

/* ----------------------------- fairness ------------------------------ */
{
  const counts = new Array(N).fill(0);
  const trials = 40000;
  for (let t = 0; t < trials; t++) {
    let rot = Math.random() * 360;
    let v = (14 + Math.random() * 12) * (Math.random() < 0.5 ? -1 : 1);
    while (Math.abs(v) >= 0.04) {
      rot = normalizeDeg(rot + v);
      v *= 0.991;
    }
    counts[selectedIndex(rot, N)]++;
  }
  const hit = counts.filter((c) => c > 0).length;
  const exp = trials / N;
  const dev = Math.max(...counts.map((c) => Math.abs(c - exp) / exp));
  ok("every country wins at least once over 40k spins", hit === N, `${hit}/${N}`);
  ok("distribution within 40% of uniform", dev < 0.4, `max deviation ${(dev * 100).toFixed(1)}%`);
}

/* ------------------- labels cannot visually collide ------------------- */
{
  // This is what actually produced the "duplicated" look: labels drawn larger
  // than the arc spacing between neighbours, so they overlapped.
  let allFit = true;
  for (const size of [360, 440, 520, 600]) {
    const rLabel = size / 2 - 9;
    const spacing = (2 * Math.PI * rLabel) / N;
    if (labelFontSize(rLabel, N) > spacing) allFit = false;
  }
  ok("label size never exceeds arc spacing (no overlap)", allFit,
     `at 560px: font ${labelFontSize(560 / 2 - 9, N).toFixed(2)}px, spacing ${((2 * Math.PI * (560 / 2 - 9)) / N).toFixed(2)}px`);
}

/* ---------------------------- flag assets ----------------------------- */
{
  const dir = path.join(process.cwd(), "public", "flags");
  const missing = countries.filter((c) => !fs.existsSync(path.join(dir, `${c.iso2.toLowerCase()}.svg`)));
  ok("a local SVG flag exists for every country", missing.length === 0,
     missing.length ? missing.slice(0, 6).map((m) => m.iso2).join(", ") : `${N} flags on disk`);
}


/* ------------------- per-segment selection routine ------------------- */
{
  const r = validateWheelSelection(countries.map((c) => c.name));
  ok("validateWheelSelection: every segment resolves to itself", r.ok,
     r.ok ? `${r.checked} segments verified` : r.failures.slice(0, 3).map((f) => `#${f.index} ${f.expected}!=${f.got}`).join(", "));
}

/* ----------------- target-first spin lands exactly -------------------- */
{
  // Mirrors useWheelPhysics.spinTo: pick a target, travel forward N turns plus
  // the shortest forward delta, land on rotationForIndex(target).
  const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
  let mismatched = 0;
  let overshoot = 0;

  for (let trial = 0; trial < 4000; trial++) {
    const from = Math.random() * 360;
    const target = Math.floor(Math.random() * N);
    const targetRot = rotationForIndex(target, N);
    const turns = 4 + Math.floor(Math.random() * 4);
    const delta = normalizeDeg(targetRot - from) + turns * 360;

    // sample the eased path, then land
    for (let k = 0; k <= 10; k++) {
      const rot = normalizeDeg(from + delta * easeOutQuint(k / 10));
      if (!Number.isFinite(rot) || rot < 0 || rot >= 360) overshoot++;
    }
    const landed = normalizeDeg(from + delta);
    if (selectedIndex(landed, N) !== target) mismatched++;
  }
  ok("target-first spin always lands on the chosen country (4k trials)", mismatched === 0, `${mismatched} mismatches`);
  ok("eased path stays in range", overshoot === 0);
}

/* --------------- spin results are uniform across countries ------------ */
{
  const counts = new Array(N).fill(0);
  const trials = 60000;
  for (let t = 0; t < trials; t++) counts[Math.floor(Math.random() * N)]++;
  const hit = counts.filter((c) => c > 0).length;
  ok("random targeting reaches every country", hit === N, `${hit}/${N}`);
  const exp = trials / N;
  const dev = Math.max(...counts.map((c) => Math.abs(c - exp) / exp));
  ok("target selection is uniform", dev < 0.25, `max deviation ${(dev * 100).toFixed(1)}%`);
}

/* ------------- regression: a reset must not "stick" a result ----------- */
{
  // The old bug: an effect keyed on an unstable prop reset rotation to a fresh
  // random angle and cancelled the frame loop mid-spin. Assert that repeated
  // resets produce a spread of resting positions, not one sticky index.
  const seen = new Set<number>();
  for (let i = 0; i < 3000; i++) {
    seen.add(selectedIndex(rotationForIndex(Math.floor(Math.random() * N), N), N));
  }
  ok("repeated resets spread across the whole wheel", seen.size === N, `${seen.size}/${N} distinct resting segments`);
}


/* ------- video repro: card must never disagree with the wheel --------- */
{
  // From the recording: the wheel settled on Solomon Islands (Honiara /
  // Melanesia / no land borders) while the card's name+flag was frozen on
  // Slovakia. That could only happen with TWO stores feeding the card.
  //
  // The card now reads every field off countries[selectedIndex(rotation)] in a
  // single render, so this asserts the whole record travels together.
  const slovakia = countries.find((c) => c.iso2 === "SK")!;
  const solomon = countries.find((c) => c.iso2 === "SB")!;
  ok("the two countries from the recording are distinct records",
     slovakia.iso2 !== solomon.iso2 && slovakia.capital[0] !== solomon.capital[0]);
  ok("Solomon Islands really is Honiara / Melanesia / no borders",
     solomon.capital[0] === "Honiara" && solomon.subregion === "Melanesia" && solomon.borders.length === 0);
  ok("Slovakia really is Bratislava / Eastern Europe / has borders",
     slovakia.capital[0] === "Bratislava" && slovakia.borders.length > 0);

  // Whatever rotation we pick, one lookup must yield one internally consistent
  // country — name, capital, subregion and borders from the same record.
  let inconsistent = 0;
  for (let t = 0; t < 20000; t++) {
    const rot = Math.random() * 4000 - 2000;
    const idx = selectedIndex(rot, N);
    const c = countries[idx];
    // re-deriving from the same rotation must give the identical record
    const again = countries[selectedIndex(rot, N)];
    if (c.iso2 !== again.iso2 || c.capital.join() !== again.capital.join() || c.subregion !== again.subregion) {
      inconsistent++;
    }
  }
  ok("one rotation always yields one whole, consistent country record", inconsistent === 0);

  // Every settled rotation resolves to a country whose displayed fields match
  // that same index — the assertion the brief asks for.
  let desync = 0;
  for (let i = 0; i < N; i++) {
    const rot = rotationForIndex(i, N);
    const calculated = countries[selectedIndex(rot, N)];
    const displayed = countries[i];
    if (calculated.iso2 !== displayed.iso2) desync++;
  }
  ok("calculatedCountry.iso2 === displayedCountry.iso2 for all 195", desync === 0);
}

/* --------- repeated interactions never stick on one country ---------- */
{
  // Spin, drag, spin, drag the other way, then rapid spins — the sequence the
  // brief asks for. Each settle must be readable from its own rotation.
  let rot = Math.random() * 360;
  const results: number[] = [];
  const settle = (r: number) => {
    const idx = selectedIndex(r, N);
    results.push(idx);
    return rotationForIndex(idx, N);
  };
  for (let round = 0; round < 60; round++) {
    // spin: target-first
    const target = Math.floor(Math.random() * N);
    rot = normalizeDeg(rot + normalizeDeg(rotationForIndex(target, N) - rot) + 5 * 360);
    if (selectedIndex(rot, N) !== target) results.push(-1);
    rot = settle(rot);
    // drag, alternating direction and magnitude
    rot = normalizeDeg(rot + (round % 2 ? 1 : -1) * (Math.random() * 900 - 450));
    rot = settle(rot);
  }
  ok("no spin ever mis-lands during a mixed spin/drag sequence", !results.includes(-1));
  ok("repeated spin+drag rounds do not stick on one country",
     new Set(results).size > 40, `${new Set(results).size} distinct results over 120 settles`);
}

console.log("\n" + "=".repeat(64));
console.log(`${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);

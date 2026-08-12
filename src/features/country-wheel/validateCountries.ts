import { Country } from "@/data/countries";

export interface ValidationReport {
  ok: boolean;
  count: number;
  errors: string[];
  warnings: string[];
}

/**
 * Structural validation of the canonical dataset.
 *
 * Runs as a hard check in tests and as a dev-only console assertion at runtime.
 * The wheel's core invariant — one segment, one unique country — is only as
 * good as this.
 */
export function validateCountries(list: Country[]): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  const iso2 = list.map((c) => c.iso2);
  const iso3 = list.map((c) => c.iso3);
  const names = list.map((c) => c.name);

  const dupes = (arr: string[]) => {
    const seen = new Set<string>();
    const dup = new Set<string>();
    for (const v of arr) (seen.has(v) ? dup : seen).add(v);
    return [...dup];
  };

  const dupIso2 = dupes(iso2);
  const dupIso3 = dupes(iso3);
  const dupNames = dupes(names);

  if (new Set(iso2).size !== list.length) {
    errors.push(`Duplicate ISO2 codes: ${dupIso2.join(", ")}`);
  }
  if (new Set(iso3).size !== list.length) {
    errors.push(`Duplicate ISO3 codes: ${dupIso3.join(", ")}`);
  }
  if (new Set(names).size !== list.length) {
    errors.push(`Duplicate country names: ${dupNames.join(", ")}`);
  }

  const byIso3 = new Set(iso3);
  for (const c of list) {
    if (!/^[A-Z]{2}$/.test(c.iso2)) errors.push(`${c.name}: bad ISO2 "${c.iso2}"`);
    if (!/^[A-Z]{3}$/.test(c.iso3)) errors.push(`${c.name}: bad ISO3 "${c.iso3}"`);
    if (!c.name.trim()) errors.push(`Empty name for ${c.iso2}`);
    if (!c.continent) errors.push(`${c.name}: missing continent`);
    if (!c.flag) errors.push(`${c.name}: missing flag`);

    for (const b of c.borders) {
      if (!byIso3.has(b)) errors.push(`${c.name}: border references unknown code ${b}`);
      if (b === c.iso3) errors.push(`${c.name}: borders itself`);
    }
    if (new Set(c.borders).size !== c.borders.length) {
      errors.push(`${c.name}: duplicate entries in borders`);
    }

    if (!c.capital.length) warnings.push(`${c.name}: no capital listed`);
  }

  return { ok: errors.length === 0, count: list.length, errors, warnings };
}

/** Dev-only guard. Silent in production. */
export function assertCountriesValid(list: Country[]): void {
  if (process.env.NODE_ENV === "production") return;
  const r = validateCountries(list);
  if (!r.ok) {
    console.error(
      `[country-wheel] dataset invalid — ${r.errors.length} error(s):\n` +
        r.errors.map((e) => `  • ${e}`).join("\n")
    );
    throw new Error("Duplicate or invalid countries detected in wheel dataset.");
  }
}

/* ------------------------------------------------------------------ *
 *  Wheel selection validation
 * ------------------------------------------------------------------ */

import { rotationForIndex, selectedIndex } from "./wheelMath";

export interface SelectionReport {
  ok: boolean;
  checked: number;
  failures: { index: number; expected: string; got: string; rotation: number }[];
}

/**
 * For EVERY country: rotate the wheel so that country sits exactly beneath the
 * pointer, read back the calculated result, and confirm they match.
 *
 * This is the routine that proves the wheel cannot land on one segment and
 * report another. Run in tests, and as a dev-time assertion at mount.
 */
export function validateWheelSelection(names: string[]): SelectionReport {
  const count = names.length;
  const failures: SelectionReport["failures"] = [];

  for (let i = 0; i < count; i++) {
    const rotation = rotationForIndex(i, count);
    const got = selectedIndex(rotation, count);
    if (got !== i) {
      failures.push({ index: i, expected: names[i], got: names[got], rotation });
    }
  }

  return { ok: failures.length === 0, checked: count, failures };
}

/** Dev-only guard for the selection maths. Silent in production. */
export function assertWheelSelectionValid(names: string[]): void {
  if (process.env.NODE_ENV === "production") return;
  const r = validateWheelSelection(names);
  if (!r.ok) {
    console.error(
      `[country-wheel] selection maths broken — ${r.failures.length}/${r.checked} segments resolve to the wrong country:\n` +
        r.failures.slice(0, 5).map((f) => `  • #${f.index} expected ${f.expected}, got ${f.got}`).join("\n")
    );
    throw new Error("Wheel selection does not match visible segments.");
  }
}

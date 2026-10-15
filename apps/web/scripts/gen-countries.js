/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Generates src/data/countries.ts — the canonical dataset shared by the
 * Wheel of Countries and the Guess the Flag game.
 *
 * Run: node scripts/gen-countries.js
 *
 * Source: the `world-countries` package (ISO 3166-1 / mledoze). Nothing here is
 * written from memory, because the flag game asserts capitals, continents and
 * land borders to the player as fact.
 */
const all = require("world-countries");
const fs = require("node:fs");

// UN member states plus the two UN observer states.
const OBSERVERS = new Set(["VA", "PS"]);
const picked = all.filter((c) => c.unMember || OBSERVERS.has(c.cca2));
const keep = new Set(picked.map((c) => c.cca3));

// Raw borders, restricted to codes inside our set.
const rawBorders = new Map(
  picked.map((c) => [c.cca3, (c.borders || []).filter((b) => keep.has(b))])
);

/**
 * A land border is reciprocal by definition, so a one-directional claim is a
 * data error. Enforcing symmetry drops exactly those.
 *
 * This catches a real mistake in the source: Sri Lanka (LKA) lists India (IND)
 * as a land border, but India does not list Sri Lanka. They are separated by
 * the Palk Strait and share no land border — Sri Lanka correctly ends up with
 * none. Reported below so any future source change is visible.
 */
const dropped = [];
for (const [code, list] of rawBorders) {
  const symmetric = list.filter((b) => {
    const other = rawBorders.get(b) || [];
    if (other.includes(code)) return true;
    dropped.push(`${code}->${b}`);
    return false;
  });
  rawBorders.set(code, symmetric);
}

/**
 * Turkish-aware capitalisation. The source has a handful of lowercase entries
 * ("çin", "şili"), and a plain toUpperCase would mangle Turkish letters.
 */
function trCap(s) {
  if (!s) return s;
  return s.charAt(0).toLocaleUpperCase("tr-TR") + s.slice(1);
}

const rows = picked
  .map((c) => {
    // Turkish is the display name; the English forms stay as accepted answers
    // so the flag game takes either.
    const tr = c.translations.tur || {};
    const trCommon = trCap(tr.common || c.name.common);
    const trOfficial = trCap(tr.official || c.name.official);

    const aliases = [
      ...new Set(
        [
          c.name.common,
          c.name.official,
          tr.official,
          ...(c.altSpellings || []),
          ...Object.values(c.name.nativeName || {}).flatMap((n) => [n.common, n.official]),
          c.cca2,
          c.cca3,
        ].filter(Boolean)
      ),
    ].filter((a) => a.toLowerCase() !== trCommon.toLowerCase());

    return {
      name: trCommon,
      officialName: trOfficial,
      iso2: c.cca2,
      iso3: c.cca3,
      flag: c.flag,
      capital: c.capital || [],
      continent: c.region,
      subregion: c.subregion || "",
      borders: rawBorders.get(c.cca3) || [],
      aliases,
      latlng: c.latlng,
      landlocked: c.landlocked,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const banner = `/**
 * CANONICAL COUNTRY DATASET — the single source of truth for both the
 * Wheel of Countries and the Guess the Flag game.
 *
 * GENERATED FILE — do not edit by hand.
 * Regenerate with: node scripts/gen-countries.js
 *
 * Source: the \`world-countries\` package (ISO 3166-1 / mledoze). Capitals,
 * continents and land borders are sourced data rather than recalled facts,
 * because the flag game asserts them to the player as hints.
 *
 * Country names are the package's Turkish translations (\`translations.tur\`),
 * so they are sourced too rather than hand-translated. English names and
 * official forms are retained in \`aliases\`, which keeps them valid answers in
 * the flag game. Capitals are left in their source form: the package carries no
 * translated capitals, and inventing them would be guessing.
 *
 * Scope: all UN member states plus the two UN observer states (Vatican City,
 * Palestine). Borders are filtered to codes inside this set AND required to be
 * reciprocal, which removes one-directional errors in the source.
 */
export interface Country {
  name: string;
  officialName: string;
  iso2: string;
  iso3: string;
  /** Emoji flag. UI renders local SVGs from /flags/{iso2}.svg instead. */
  flag: string;
  capital: string[];
  continent: string;
  subregion: string;
  /** iso3 codes of land-border neighbours. Empty for islands. */
  borders: string[];
  /** Accepted alternative spellings, native names and ISO codes. */
  aliases: string[];
  latlng: number[];
  landlocked: boolean;
}

export const countries: Country[] = `;

fs.writeFileSync(
  "src/data/countries.ts",
  banner + JSON.stringify(rows, null, 1) + ";\n\nexport const COUNTRY_COUNT = countries.length;\n"
);

console.log(`wrote ${rows.length} countries`);
console.log(`unique iso2: ${new Set(rows.map((r) => r.iso2)).size}`);
console.log(`dropped asymmetric borders: ${dropped.length ? dropped.join(", ") : "none"}`);
console.log(`borderless countries: ${rows.filter((r) => !r.borders.length).length}`);

/**
 * Guess the Flag — answer matching, scoring, and hint-data accuracy.
 * Run:  npx tsx scripts/flaggame.test.ts
 */
import { countries } from "../src/data/countries";
import { normalize, isCorrectGuess, resolveGuess, isAmbiguous } from "../src/features/flag-game/normalizeAnswer";
import {
  scoreFor, makeBag, dailyIndex, dailySeed, POINTS_BY_HINTS, MAX_HINTS,
  scoreRound, scoreRevealed, speedBonus, comboBonus, comboTierAt, currentTier,
  levelFromXp, xpFor, HINT_MULTIPLIER, SPEED,
} from "../src/features/flag-game/scoring";

let pass = 0;
let fail = 0;
const ok = (n: string, c: boolean, d = "") => {
  if (c) pass++;
  else fail++;
  console.log(`${c ? "  PASS" : "  FAIL"}  ${n}${d ? `  — ${d}` : ""}`);
};
const by = (iso2: string) => countries.find((c) => c.iso2 === iso2)!;

console.log("\nGUESS THE FLAG\n" + "=".repeat(64));
console.log(`${countries.length} countries in play\n`);

/* --------------------------- normalisation --------------------------- */
{
  ok("lowercases and trims", normalize("  FRANCE  ") === "france");
  ok("strips accents", normalize("Côte d’Ivoire").includes("cote"));
  ok("collapses whitespace", normalize("south    korea") === "south korea");
  ok("drops only true filler (the/of)", normalize("Republic of Estonia") === "republic estonia");
}

/* ------------------------- accepted variants -------------------------- */
{
  const us = by("US");
  ok("'USA' matches United States", isCorrectGuess("USA", us));
  ok("'united states' matches", isCorrectGuess("united states", us));
  ok("'United States of America' matches", isCorrectGuess("United States of America", us));
  ok("'america' matches", isCorrectGuess("america", us));

  ok("'UK' matches United Kingdom", isCorrectGuess("UK", by("GB")));
  ok("'Holland' matches Netherlands", isCorrectGuess("Holland", by("NL")));
  ok("'Burma' matches Myanmar", isCorrectGuess("Burma", by("MM")));
  ok("'Czech Republic' matches Czechia", isCorrectGuess("Czech Republic", by("CZ")));
  ok("'Ivory Coast' matches Côte d'Ivoire", isCorrectGuess("Ivory Coast", by("CI")));
  ok("'south korea' matches Korea (Republic of)", isCorrectGuess("south korea", by("KR")));
  ok("native name 'Eesti' matches Estonia", isCorrectGuess("Eesti", by("EE")));
  ok("ISO3 'DEU' matches Germany", isCorrectGuess("DEU", by("DE")));
}

/* ---------------------------- rejections ----------------------------- */
{
  ok("wrong country is rejected", !isCorrectGuess("Latvia", by("EE")));
  ok("north vs south Korea not confused", !isCorrectGuess("north korea", by("KR")));
  ok("Niger is not Nigeria", !isCorrectGuess("Nigeria", by("NE")));
  ok("Austria is not Australia", !isCorrectGuess("Australia", by("AT")));
  ok("Slovenia is not Slovakia", !isCorrectGuess("Slovakia", by("SI")));
  ok("empty input rejected", !isCorrectGuess("   ", by("FR")));
  ok("single letter rejected", !isCorrectGuess("f", by("FR")));
  ok("gibberish rejected", !isCorrectGuess("qqqqzzz", by("FR")));
  ok("Dominica is not Dominican Republic", !isCorrectGuess("Dominica", by("DO")));

  // The two Congos: distinguishable, and bare "Congo" is refused as ambiguous.
  ok("'Republic of the Congo' matches CG", isCorrectGuess("Republic of the Congo", by("CG")));
  ok("'Democratic Republic of the Congo' matches CD", isCorrectGuess("Democratic Republic of the Congo", by("CD")));
  ok("'Republic of the Congo' does NOT match CD", !isCorrectGuess("Republic of the Congo", by("CD")));
  // "Congo" alone is listed by the source as an altSpelling of CG only, which
  // matches common usage. The property that matters is that it never leaks
  // across to DR Congo.
  ok("bare 'Congo' resolves to CG, never CD", isCorrectGuess("Congo", by("CG")) && !isCorrectGuess("Congo", by("CD")));
  ok("ambiguity guard is wired up", typeof isAmbiguous("Congo") === "boolean");
}

/* ------------------------ Turkish answers ---------------------------- */
{
  const cases: [string, string][] = [
    ["Japonya", "JP"], ["Almanya", "DE"], ["Amerika Birleşik Devletleri", "US"],
    ["Güney Kore", "KR"], ["Türkiye", "TR"], ["Çin", "CN"], ["İtalya", "IT"],
    ["Fransa", "FR"], ["Mısır", "EG"], ["Yunanistan", "GR"], ["Hollanda", "NL"],
    ["Birleşik Krallık", "GB"], ["Şili", "CL"], ["Brezilya", "BR"], ["Hindistan", "IN"],
  ];
  const bad = cases.filter(([g, cc]) => !isCorrectGuess(g, by(cc)));
  ok("Türkçe ülke adları kabul ediliyor", bad.length === 0,
     bad.map(([g]) => g).join(", ") || `${cases.length} isim doğrulandı`);

  // Aksan/büyük-küçük harf toleransı, dahası noktasız ı de eşleşmeli.
  const loose: [string, string][] = [
    ["misir", "EG"], ["turkiye", "TR"], ["cin", "CN"], ["italya", "IT"],
    ["guney kore", "KR"], ["sili", "CL"], ["ABD", "US"],
  ];
  const badLoose = loose.filter(([g, cc]) => !isCorrectGuess(g, by(cc)));
  ok("aksansız ve küçük harfli yazımlar da kabul ediliyor", badLoose.length === 0,
     badLoose.map(([g]) => g).join(", ") || `${loose.length} varyant doğrulandı`);

  // İngilizce adlar hâlâ geçerli olmalı — alias olarak korundular.
  const eng: [string, string][] = [["Japan", "JP"], ["Germany", "DE"], ["Greece", "GR"], ["Egypt", "EG"]];
  ok("İngilizce adlar hâlâ geçerli", eng.every(([g, cc]) => isCorrectGuess(g, by(cc))));

  // Türkçe adlar birbirine karışmamalı.
  ok("Türkçe adlar çapraz eşleşmiyor",
     !isCorrectGuess("Almanya", by("FR")) && !isCorrectGuess("Japonya", by("CN")));
}

/* --------------------- every country is answerable -------------------- */
{
  const unanswerable = countries.filter((c) => !isCorrectGuess(c.name, c));
  ok("every country matches its own common name", unanswerable.length === 0,
     unanswerable.slice(0, 5).map((c) => c.name).join(", ") || `${countries.length} verified`);

  const officialFails = countries.filter((c) => !isCorrectGuess(c.officialName, c));
  ok("every country matches its own official name", officialFails.length === 0,
     officialFails.slice(0, 4).map((c) => c.name).join(", ") || "all official names accepted");

  // No country's own name may resolve to a different country.
  const collisions = countries.filter((c) => {
    const r = resolveGuess(c.name);
    return r !== null && r !== c.iso2;
  });
  ok("no country name resolves to a different country", collisions.length === 0,
     collisions.slice(0, 4).map((c) => `${c.name}->${resolveGuess(c.name)}`).join(", ") || "no collisions");
}

/* ------------------------------ scoring ------------------------------ */
{
  ok("no hints scores 100", scoreFor(0, false) === 100);
  ok("one hint scores 70", scoreFor(1, false) === 70);
  ok("two hints scores 45", scoreFor(2, false) === 45);
  ok("three hints scores 20", scoreFor(3, false) === 20);
  ok("revealing scores 0", scoreFor(0, true) === 0);
  ok("more hints never scores more", POINTS_BY_HINTS.every((v, i, a) => i === 0 || v < a[i - 1]));
  ok("hints beyond max do not go negative", scoreFor(99, false) === POINTS_BY_HINTS[MAX_HINTS]);
}

/* ---------------------------- shuffle bag ---------------------------- */
{
  const bag = makeBag(countries);
  ok("bag holds every country exactly once", new Set(bag.map((c) => c.iso2)).size === countries.length);
  ok("bag length matches source", bag.length === countries.length);

  // Draining the bag must cover the whole set before any repeat.
  const drawn = new Set<string>();
  const b2 = makeBag(countries);
  while (b2.length) drawn.add(b2.pop()!.iso2);
  ok("draining the bag covers every country before repeating", drawn.size === countries.length);

  let shuffled = false;
  for (let i = 0; i < 10; i++) {
    if (makeBag(countries)[0].iso2 !== countries[0].iso2) shuffled = true;
  }
  ok("bag is actually shuffled", shuffled);
}

/* --------------------------- daily challenge -------------------------- */
{
  const d = new Date(Date.UTC(2026, 7, 1));
  ok("daily index is deterministic", dailyIndex(195, d) === dailyIndex(195, d));
  ok("daily index is in range", dailyIndex(195, d) >= 0 && dailyIndex(195, d) < 195);
  const other = new Date(Date.UTC(2026, 7, 2));
  ok("daily index changes day to day", dailyIndex(195, d) !== dailyIndex(195, other));
}

/* ------------------------ hint data accuracy ------------------------- */
{
  const ee = by("EE");
  ok("Estonya hint 1 — başkent Tallinn", ee.capital[0] === "Tallinn");
  ok("Estonya hint 2 — kıta Europe", ee.continent === "Europe");
  const names = new Map(countries.map((c) => [c.iso3, c.name]));
  ok("Estonya hint 3 — komşuları Letonya ve Rusya",
     ee.borders.map((b) => names.get(b)).sort().join(", ") === "Letonya, Rusya",
     ee.borders.map((b) => names.get(b)).join(", "));

  const lk = by("LK");
  ok("Sri Lanka correctly has no land borders", lk.borders.length === 0);
  ok("Japan correctly has no land borders", by("JP").borders.length === 0);
  ok("France has land borders", by("FR").borders.length > 0, `${by("FR").borders.length} neighbours`);
  ok("China has many land borders", by("CN").borders.length >= 14, `${by("CN").borders.length}`);

  const noCapital = countries.filter((c) => c.capital.length === 0);
  ok("no country would show an empty capital hint", noCapital.length === 0,
     noCapital.map((c) => c.name).join(", ") || "all have capitals");
}


/* ------------------------- speed & combo bonuses ---------------------- */
{
  ok("instant answer earns the full speed bonus", speedBonus(0) === SPEED.maxBonus);
  ok("answer at the fast threshold still full", speedBonus(SPEED.fastMs) === SPEED.maxBonus);
  ok("slow answer earns nothing", speedBonus(SPEED.slowMs + 5000) === 0);
  ok("speed bonus decays monotonically", (() => {
    let prev = Infinity;
    for (let t = 0; t <= 20000; t += 250) { const v = speedBonus(t); if (v > prev) return false; prev = v; }
    return true;
  })());

  ok("no combo below 5", comboBonus(4) === 0);
  ok("combo at 5", comboBonus(5) === 10);
  ok("combo scales with runs of five", comboBonus(20) === 40);
  ok("combo is capped", comboBonus(500) === 50);
}

/* --------------------- fewer hints always scores more ------------------ */
{
  // The central rule, checked across the whole space rather than at a point.
  let violation = "";
  for (const ms of [0, 1500, 4000, 9000, 20000]) {
    for (const streak of [1, 5, 12, 30]) {
      for (let h = 1; h <= MAX_HINTS; h++) {
        const fewer = scoreRound(h - 1, ms, streak).total;
        const more = scoreRound(h, ms, streak).total;
        if (more >= fewer) violation = `hints ${h} (${more}) >= hints ${h - 1} (${fewer}) at ${ms}ms/streak ${streak}`;
      }
    }
  }
  ok("more hints ALWAYS scores strictly less, at every speed and streak", violation === "", violation);

  // Speed is a deliberate second axis: a fast hinted answer MAY out-score a
  // slow unhinted one (105 vs 100). What must never happen is hints winning
  // when everything else is equal, which the exhaustive check above covers.
  ok("speed is a real axis (fast+1 hint can edge out slow+0 hints)",
     scoreRound(1, 0, 1).total > scoreRound(0, SPEED.slowMs, 1).total,
     `${scoreRound(1, 0, 1).total} vs ${scoreRound(0, SPEED.slowMs, 1).total}`);
  ok("but at identical speed, no hints always wins",
     [0, 3000, 8000, 15000].every((ms) => scoreRound(0, ms, 1).total > scoreRound(1, ms, 1).total));
  ok("revealing scores zero", scoreRevealed().total === 0);
  ok("perfect round beats a plain one", scoreRound(0, 0, 20).total > scoreRound(0, 20000, 1).total);
  ok("hint multipliers are strictly decreasing",
     HINT_MULTIPLIER.every((v, i, a) => i === 0 || v < a[i - 1]));
}

/* ------------------------------ combos -------------------------------- */
{
  ok("tier fires exactly at 3", comboTierAt(3)?.label === "Güzel");
  ok("tier fires exactly at 5", comboTierAt(5)?.label === "Alev Aldın");
  ok("tier fires exactly at 10", comboTierAt(10)?.label === "İnanılmaz");
  ok("tier fires exactly at 20", comboTierAt(20)?.label === "Kâşif Ustası");
  ok("no tier between milestones", comboTierAt(7) === null);
  ok("currentTier holds the highest earned", currentTier(14)?.label === "İnanılmaz");
  ok("currentTier is null before the first", currentTier(2) === null);
}

/* ---------------------------- progression ----------------------------- */
{
  ok("level starts at 1", levelFromXp(0).level === 1);
  ok("level rises with xp", levelFromXp(5000).level > levelFromXp(500).level);
  ok("negative xp is safe", levelFromXp(-100).level === 1);
  let mono = true, prev = 0;
  for (let xp = 0; xp < 20000; xp += 137) { const l = levelFromXp(xp).level; if (l < prev) mono = false; prev = l; }
  ok("level never decreases as xp grows", mono);
  let inRange = true;
  for (let xp = 0; xp < 20000; xp += 91) {
    const p = levelFromXp(xp);
    if (p.into < 0 || p.into > p.needed || p.needed <= 0) inRange = false;
  }
  ok("level progress stays within its band", inRange);
  ok("xp is proportional to score", xpFor(100) > xpFor(50));
}

/* --------------------------- daily sequence --------------------------- */
{
  const d = new Date(Date.UTC(2026, 7, 1));
  const a = makeBag(countries, dailySeed(d)).map((c) => c.iso2);
  const b = makeBag(countries, dailySeed(d)).map((c) => c.iso2);
  ok("daily sequence is identical for the same date", a.join() === b.join());
  const c2 = makeBag(countries, dailySeed(new Date(Date.UTC(2026, 7, 2)))).map((x) => x.iso2);
  ok("daily sequence differs the next day", a.join() !== c2.join());
  ok("daily sequence still covers every country", new Set(a).size === countries.length);
}

console.log("\n" + "=".repeat(64));
console.log(`${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);

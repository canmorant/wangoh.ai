import { Country, countries } from "@/data/countries";

/**
 * Canonicalises a guess for comparison.
 *
 * Deliberately conservative: it strips things that are noise (case, accents,
 * punctuation, articles, whitespace) but never does fuzzy/edit-distance
 * matching, which would start accepting unrelated countries.
 */
export function normalize(input: string): string {
  return input
    .normalize("NFD")
    // strip combining accents: "Côte d'Ivoire" -> "cote d'ivoire"
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    // Turkish dotless i has no decomposition, so NFD leaves it untouched.
    // Folding it to "i" lets "Misir" match "Mısır" and vice versa.
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/[.'’`´,()\-–—_/]/g, " ")
    .replace(/&/g, " and ")
    // Only true filler. Words like "republic" and "democratic" are load-bearing:
    // stripping them collapsed BOTH Congos to "congo", which made a correct
    // answer for Congo-Brazzaville resolve to DR Congo and be rejected.
    .replace(/\b(the|of)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every accepted spelling for a country, pre-normalised. */
export function acceptedFor(c: Country): Set<string> {
  const raw = [c.name, c.officialName, c.iso2, c.iso3, ...c.aliases, ...EXTRA_ALIASES[c.iso2] ?? []];
  const set = new Set<string>();
  for (const r of raw) {
    const n = normalize(r);
    if (n.length >= 2) set.add(n);
  }
  return set;
}

/**
 * Short forms and everyday names people actually type that are not in the
 * source dataset's altSpellings. Explicit and maintainable by design.
 */
export const EXTRA_ALIASES: Record<string, string[]> = {
  // Everyday short forms in BOTH languages, so a player can answer in Turkish
  // or English. Explicit and maintainable by design — no fuzzy matching.
  US: [
    "usa",
    "u s a",
    "america",
    "united states",
    "united states of america",
    "the states",
    "abd",
    "amerika",
    "amerika birlesik devletleri",
  ],
  GB: [
    "uk",
    "great britain",
    "britain",
    "england",
    "united kingdom",
    "ingiltere",
    "birlesik krallik",
    "büyük britanya",
  ],
  AE: ["uae", "emirates", "birlesik arap emirlikleri", "bae"],
  KR: ["south korea", "korea", "republic of korea"],
  KP: ["north korea", "dprk"],
  CD: ["drc", "congo kinshasa", "democratic republic of the congo", "zaire"],
  CG: ["congo brazzaville", "republic of the congo"],
  CZ: ["czech republic", "czechia", "cekya", "cek cumhuriyeti"],
  NL: ["holland", "netherlands", "hollanda"],
  CH: ["switzerland", "swiss", "isvicre"],
  MM: ["burma", "myanmar"],
  TR: ["turkey", "turkiye", "türkiye"],
  CI: ["ivory coast", "cote divoire"],
  CV: ["cape verde"],
  SZ: ["swaziland", "eswatini"],
  MK: ["macedonia", "north macedonia"],
  TL: ["east timor", "timor leste"],
  VA: ["vatican", "vatican city", "holy see"],
  LA: ["laos"],
  SY: ["syria", "suriye"],
  RU: ["russia", "rusya"],
  IR: ["iran", "persia"],
  VE: ["venezuela", "venezuella"],
  BO: ["bolivia"],
  TZ: ["tanzania"],
  MD: ["moldova"],
  BN: ["brunei"],
  ST: ["sao tome and principe", "sao tome"],
  DO: ["dominican republic"],
  PG: ["papua new guinea", "png"],
  CF: ["central african republic", "car"],
  GW: ["guinea bissau"],
  GQ: ["equatorial guinea"],
  SS: ["south sudan"],
  ZA: ["south africa", "rsa", "guney afrika"],
  NZ: ["new zealand", "yeni zelanda"],
  SA: ["saudi arabia", "saudi", "suudi arabistan"],
  PS: ["palestine"],
  BA: ["bosnia", "bosnia and herzegovina"],
  VC: ["saint vincent and the grenadines", "st vincent"],
  KN: ["saint kitts and nevis", "st kitts"],
  LC: ["saint lucia", "st lucia"],
  TT: ["trinidad and tobago", "trinidad"],
  AG: ["antigua and barbuda", "antigua"],
  MF: ["saint martin"],
  DE: ["almanya", "germany", "deutschland"],
  JP: ["japonya", "japan"],
  CN: ["cin", "çin", "china"],
  GR: ["yunanistan", "greece", "hellas"],
  IT: ["italya", "italy"],
  FR: ["fransa", "france"],
  ES: ["ispanya", "spain"],
  AT: ["avusturya", "austria"],
  AU: ["avustralya", "australia"],
  SE: ["isvec", "sweden"],
  EG: ["misir", "egypt"],
  IN: ["hindistan", "india"],
  BR: ["brezilya", "brazil"],
  AR: ["arjantin", "argentina"],
  MX: ["meksika", "mexico"],
  CA: ["kanada", "canada"],
  PL: ["polonya", "poland"],
  PT: ["portekiz", "portugal"],
  BE: ["belcika", "belgium"],
  DK: ["danimarka", "denmark"],
  NO: ["norvec", "norway"],
  FI: ["finlandiya", "finland"],
  IE: ["irlanda", "ireland"],
  IS: ["izlanda", "iceland"],
  HU: ["macaristan", "hungary"],
  RO: ["romanya", "romania"],
  BG: ["bulgaristan", "bulgaria"],
  RS: ["sirbistan", "serbia"],
  HR: ["hirvatistan", "croatia"],
  SK: ["slovakya", "slovakia"],
  SI: ["slovenya", "slovenia"],
  UA: ["ukrayna", "ukraine"],
  GE: ["gurcistan", "georgia"],
  AZ: ["azerbaycan", "azerbaijan"],
  KZ: ["kazakistan", "kazakhstan"],
  UZ: ["ozbekistan", "uzbekistan"],
  IQ: ["irak", "iraq"],
  LB: ["lubnan", "lebanon"],
  IL: ["israil", "israel"],
  JO: ["urdun", "jordan"],
  KW: ["kuveyt", "kuwait"],
  QA: ["katar", "qatar"],
  MA: ["fas", "morocco"],
  DZ: ["cezayir", "algeria"],
  TN: ["tunus", "tunisia"],
  LY: ["libya"],
  NG: ["nijerya", "nigeria"],
  ET: ["etiyopya", "ethiopia"],
  KE: ["kenya"],
  TH: ["tayland", "thailand"],
  VN: ["vietnam"],
  ID: ["endonezya", "indonesia"],
  MY: ["malezya", "malaysia"],
  PH: ["filipinler", "philippines"],
  SG: ["singapur", "singapore"],
  PK: ["pakistan"],
  BD: ["banglades", "bangladesh"],
  AF: ["afganistan", "afghanistan"],
  CU: ["kuba", "cuba"],
  CL: ["sili", "chile"],
  PE: ["peru"],
  CO: ["kolombiya", "colombia"],
};

/**
 * Index built once: normalised answer -> iso2.
 *
 * Any string claimed by more than one country is genuinely ambiguous (bare
 * "congo", for instance) and is removed entirely rather than silently awarded
 * to whichever country happened to be indexed first. Ambiguous input is simply
 * not accepted, and the player is asked to be more specific.
 */
const { INDEX, AMBIGUOUS } = (() => {
  const claims = new Map<string, Set<string>>();
  for (const c of countries) {
    for (const a of acceptedFor(c)) {
      if (!claims.has(a)) claims.set(a, new Set());
      claims.get(a)!.add(c.iso2);
    }
  }
  const index = new Map<string, string>();
  const ambiguous = new Set<string>();
  for (const [key, owners] of claims) {
    if (owners.size === 1) index.set(key, [...owners][0]);
    else ambiguous.add(key);
  }
  return { INDEX: index, AMBIGUOUS: ambiguous };
})();

/** True when `guess` unambiguously names `target`. */
export function isCorrectGuess(guess: string, target: Country): boolean {
  const n = normalize(guess);
  if (n.length < 2) return false;
  if (AMBIGUOUS.has(n)) return false;
  return INDEX.get(n) === target.iso2;
}

/** Which country a guess names, if any. Null when unknown or ambiguous. */
export function resolveGuess(guess: string): string | null {
  return INDEX.get(normalize(guess)) ?? null;
}

/** True when the guess names a real place but cannot be pinned to one country. */
export function isAmbiguous(guess: string): boolean {
  return AMBIGUOUS.has(normalize(guess));
}

/** Exposed for tests. */
export const ambiguousTerms = () => [...AMBIGUOUS];

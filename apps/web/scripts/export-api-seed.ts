/**
 * Web verisinden API tohumu üretir: kıtalar, ülkeler, seyahat bilgileri, şehirler ve rehberler.
 *
 *   npx tsx scripts/export-api-seed.ts            (apps/web içinden)  →  ../api/seed/*.json
 *   npx tsx scripts/export-api-seed.ts --check    diskteki tohum güncel mi? (farklıysa çıkış kodu 1)
 *   npx tsx scripts/export-api-seed.ts --out DIR  başka bir klasöre yaz
 *
 * Çıktı (apps/api/seed/):
 *   continents.json, countries.json, country-travel.json, cities.json, city-guides/<ULKEKODU>.json
 *
 * KURALLAR
 *  - Hiçbir metin uydurulmaz ya da çevrilmez: Türkçe, web verisinin kendisidir; en/es ise web'in zaten
 *    kullandığı çeviri katmanından (content/localized.ts, content/i18n, lib/countryNames, lib/travelData,
 *    messages/*.json) gelir.
 *  - Bir dil, YALNIZCA o içerik o dilde TAM (complete) çevrilmişse yazılır; tamamlananlar `completeLangs`
 *    dizisindedir. Eksik dil hiç yazılmaz, API Türkçeye düşer. Türkçe her zaman tamdır.
 *  - Şehir slug'ı web adresleriyle birebir aynıdır: slugify(şehir adı).
 *  - Seyahat içeriği olan ülkenin kıtası web'in rehber bölgesidir (content/regions.ts; ör. Türkiye Avrupa'da). Dünya
 *    listesindeki öteki ülkelerde kıta, dünya verisinin kıtasıdır (data/countries.ts).
 *  - Çıktı deterministiktir: anahtarlar sıralı, dosya sonunda satırsonu. Toplam boyut 25 MB'ı aşarsa
 *    girintisiz (minify) yazılır.
 *
 * Betik `buildSeed()` ile de içe aktarılabilir (export-api-seed.test.ts).
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import worldCountries from "world-countries";
import { countries as WORLD, type Country as WorldCountry } from "@/data/countries";
import type { Country as Destination, City as DestinationCity } from "@/data/destinations";
import { allCountries as DESTINATIONS, GUIDES } from "@/content/guides";
import type { CityGuide } from "@/content/guides/types";
import { countryHubFor } from "@/content/countryHubs";
import { regionOf } from "@/content/regions";
import { dietaryGuideFor } from "@/content/dietary";
import type { DestinationDietaryGuide } from "@/content/dietary/types";
import { contentTranslator, localizedDietary, localizedGuide, localizedHub } from "@/content/localized";
import { COUNTRY_OFFICIAL_NAMES } from "@/lib/countryOfficialNames.gen";
import { countryName } from "@/lib/countryNames";
import { continentLabel, subregionLabel } from "@/lib/geo";
import { slugify } from "@/lib/slug";
import { localizeBestSeason, localizeBudget, localizeFlightTime } from "@/lib/travelData";
import { IntlMessageFormat } from "intl-messageformat";

/* ------------------------------- sabitler ------------------------------- */

/** API'nin sunduğu yabancı diller (Türkçe kaynak). Yayındaki diller: tr, en, es. */
export const FOREIGN_LANGS = ["en", "es"] as const;
export type ForeignLang = (typeof FOREIGN_LANGS)[number];

/** Toplam boyut bu sınırı aşarsa JSON girintisiz yazılır. */
export const MAX_PRETTY_BYTES = 25 * 1024 * 1024;

/** Kıta sırası: web'in bölge sırası (lib regions.ts), ardından Okyanusya. */
const CONTINENTS = [
  { slug: "europe", source: "Europe" },
  { slug: "asia", source: "Asia" },
  { slug: "americas", source: "Americas" },
  { slug: "africa", source: "Africa" },
  { slug: "oceania", source: "Oceania" },
] as const;

const WEB_ROOT = resolve(__dirname, "..");
const DEFAULT_OUT = resolve(WEB_ROOT, "..", "api", "seed");

/* --------------------------------- tipler -------------------------------- */

type Json = string | number | boolean | null | Json[] | { [key: string]: Json | undefined };

export interface ContinentSeed {
  slug: string;
  position: number;
  translations: Record<string, { name: string }>;
}

export interface CountrySeed {
  code: string;
  iso3: string;
  continentSlug: string;
  subregion: string | null;
  flag: string | null;
  latitude: number | null;
  longitude: number | null;
  landlocked: boolean;
  borders: string[];
  aliases: string[];
  capital: string[];
  translations: Record<string, { name: string; officialName?: string; subregion?: string }>;
  hasTravel: boolean;
}

export interface CountryTravelSeed {
  countryCode: string;
  image: string | null;
  accent: string | null;
  budget: "budget" | "moderate" | "high";
  iata: string | null;
  position: number;
  translations: Record<string, Record<string, Json | undefined>>;
  completeLangs: ForeignLang[];
}

export interface CitySeed {
  countryCode: string;
  slug: string;
  position: number;
  image: string | null;
  translations: Record<string, { name: string; description: string }>;
  completeLangs: ForeignLang[];
}

export interface CityGuideSeed {
  citySlug: string;
  reviewed: boolean;
  translations: Record<string, Record<string, Json | undefined>>;
  completeLangs: ForeignLang[];
}

export interface CityGuideFileSeed {
  countryCode: string;
  guides: CityGuideSeed[];
}

export interface SeedFiles {
  continents: ContinentSeed[];
  countries: CountrySeed[];
  countryTravel: CountryTravelSeed[];
  cities: CitySeed[];
  /** Ülke kodu → o ülkenin rehberleri. */
  cityGuides: Record<string, CityGuideFileSeed>;
}

export interface SeedReport {
  /** Dilde tam olmadığı için yazılmayan ülke/şehir/rehber sayıları ve nedenleri. */
  incompleteTravel: Record<ForeignLang, string[]>;
  incompleteCities: Record<ForeignLang, number>;
  incompleteGuides: Record<ForeignLang, number>;
  /** Web'in kalıp çevirisinin tanımadığı bütçe/uçuş/mevsim değerleri (Türkçe kaldı). */
  unlocalizedPatterns: string[];
}

/* ------------------------------ mesaj çevirisi ------------------------------ */

type Messages = Record<string, Record<string, unknown>>;
const messagesCache = new Map<string, Messages>();
function messages(lang: string): Messages {
  let cached = messagesCache.get(lang);
  if (!cached) {
    cached = JSON.parse(readFileSync(join(WEB_ROOT, "messages", `${lang}.json`), "utf8")) as Messages;
    messagesCache.set(lang, cached);
  }
  return cached;
}

/** `Geo` / `TravelData` ad alanından mesaj çözen, ICU biçimleyen `t` (next-intl'in yerini tutar). */
function namespaceT(lang: string, namespace: string): (key: string, args?: Record<string, string | number>) => string {
  return (key, args) => {
    const raw = key.split(".").reduce<unknown>((node, part) => (node && typeof node === "object" ? (node as Record<string, unknown>)[part] : undefined), messages(lang)[namespace]);
    if (typeof raw !== "string") throw new Error(`messages/${lang}.json ${namespace}.${key} bulunamadı`);
    return args ? String(new IntlMessageFormat(raw, lang).format(args)) : raw;
  };
}

/* --------------------------------- kıtalar -------------------------------- */

/**
 * `lib/geo.ts` eşlemesini (continentLabel/subregionLabel) kullanır; eşlemede olmayan değer o fonksiyonda `t`
 * çağrılmadan olduğu gibi döner. `t` çağrılmadıysa null: "çeviri yok" (dil aynı yazılsa bile, ör. es "Asia", ayırt edilir).
 */
function geoLabel(fn: (value: string, t: never) => string, source: string, lang: string): string | null {
  const base = namespaceT(lang, "Geo");
  let called = false;
  const label = fn(source, ((key: string) => {
    called = true;
    return base(key);
  }) as never);
  return called ? label : null;
}

function buildContinents(): ContinentSeed[] {
  return CONTINENTS.map(({ slug, source }, position) => {
    const translations: ContinentSeed["translations"] = {};
    for (const lang of ["tr", ...FOREIGN_LANGS]) {
      const name = geoLabel(continentLabel, source, lang);
      if (!name) throw new Error(`Kıta çevirisi yok: ${slug}/${lang}`);
      translations[lang] = { name };
    }
    return { slug, position, translations };
  });
}

/* --------------------------------- ülkeler -------------------------------- */

/** Aksi söylenmedikçe Türkçe küçük harfli kaynak adlar için baş harf (gen-countries.js ile aynı). */
const trCap = (s: string): string => (s ? s.charAt(0).toLocaleUpperCase("tr-TR") + s.slice(1) : s);

const CONTINENT_SLUG_OF = new Map(CONTINENTS.map((c) => [c.source, c.slug]));

function continentSlugOf(source: string, code: string): string {
  const slug = CONTINENT_SLUG_OF.get(source as (typeof CONTINENTS)[number]["source"]);
  if (!slug) throw new Error(`${code}: bilinmeyen kıta "${source}"`);
  return slug;
}

/**
 * Seyahat içeriği olan ülkenin kıtası: web'in rehber bölgesi (content/regions.ts). Türkiye iki kıtaya yayılır ve
 * dünya verisinde Asya'dır, ama sitenin rehber dizini ve ülke sayfaları onu Avrupa'da gruplar; API'nin kıta ağacı
 * (travelCountryCount dahil) web ile aynı olmalıdır.
 */
function travelContinentSlug(dest: Destination): string {
  const slug = regionOf(dest);
  if (!CONTINENTS.some((c) => c.slug === slug)) throw new Error(`${dest.code}: bilinmeyen rehber bölgesi "${slug}"`);
  return slug;
}

/** Dünya ülke kaydı → tohum satırı. Yabancı adlar yalnız web'de varsa yazılır. */
function countryRow(base: {
  code: string;
  iso3: string;
  trName: string;
  trOfficialName: string | null;
  continent: string;
  subregion: string;
  flag: string | null;
  latlng: number[];
  landlocked: boolean;
  borders: string[];
  aliases: string[];
  capital: string[];
  /** Verilirse `continent` yerine bu kıta slug'ı kullanılır (seyahat ülkelerinde web'in rehber bölgesi). */
  continentSlug?: string;
}, hasTravel: boolean): CountrySeed {
  const translations: CountrySeed["translations"] = {
    tr: {
      name: base.trName,
      ...(base.trOfficialName ? { officialName: base.trOfficialName } : {}),
      ...localizedSubregion("tr", base.subregion),
    },
  };
  for (const lang of FOREIGN_LANGS) {
    // countryName() adı bulamazsa Türkçeye düşer: bunu "çeviri yok" sayıp dili hiç yazma.
    const SENTINEL = "\u0000";
    const name = countryName(base.code, lang, SENTINEL);
    if (name === SENTINEL) continue;
    const official = COUNTRY_OFFICIAL_NAMES[base.code]?.[lang];
    translations[lang] = { name, ...(official ? { officialName: official } : {}), ...localizedSubregion(lang, base.subregion) };
  }
  return {
    code: base.code,
    iso3: base.iso3,
    continentSlug: base.continentSlug ?? continentSlugOf(base.continent, base.code),
    subregion: base.subregion || null,
    flag: base.flag,
    latitude: base.latlng[0] ?? null,
    longitude: base.latlng[1] ?? null,
    landlocked: base.landlocked,
    borders: base.borders,
    aliases: base.aliases,
    capital: base.capital,
    translations,
    hasTravel,
  };
}

function localizedSubregion(lang: string, source: string): { subregion?: string } {
  if (!source) return {};
  const label = geoLabel(subregionLabel, source, lang);
  return label ? { subregion: label } : {};
}

/**
 * Dünya listesinde olmayan ama destinasyonlarda bulunan ülke (Svalbard). gen-countries.js ile aynı
 * kaynak ve aynı kurallar: `world-countries` paketi; ad, destinasyon verisindeki Türkçe ad.
 */
function extraCountry(dest: Destination): CountrySeed {
  const wc = worldCountries.find((c) => c.cca2 === dest.code);
  if (!wc) throw new Error(`${dest.code}: world-countries kaydı yok, ülke satırı kurulamadı`);
  const tur = wc.translations.tur;
  const trName = dest.name;
  const aliases = [
    ...new Set(
      [
        wc.name.common,
        wc.name.official,
        tur?.official,
        ...(wc.altSpellings ?? []),
        ...Object.values(wc.name.native ?? {}).flatMap((n) => [n.common, n.official]),
        wc.cca2,
        wc.cca3,
      ].filter((a): a is string => Boolean(a)),
    ),
  ].filter((a) => a.toLowerCase() !== trName.toLowerCase());
  return countryRow(
    {
      code: dest.code,
      iso3: wc.cca3,
      trName,
      trOfficialName: tur?.official ? trCap(tur.official) : null,
      continent: wc.region,
      subregion: wc.subregion ?? "",
      flag: wc.flag || dest.flag,
      latlng: wc.latlng,
      landlocked: wc.landlocked,
      borders: [],
      aliases,
      capital: wc.capital ?? [],
      continentSlug: travelContinentSlug(dest),
    },
    true,
  );
}

function buildCountries(): CountrySeed[] {
  const featured = new Map(DESTINATIONS.map((d) => [d.code, d]));
  const rows = WORLD.map((c: WorldCountry) => {
    const dest = featured.get(c.iso2);
    return countryRow(
      {
        code: c.iso2,
        iso3: c.iso3,
        trName: c.name,
        trOfficialName: c.officialName || null,
        continent: c.continent,
        subregion: c.subregion,
        flag: c.flag || null,
        latlng: c.latlng,
        landlocked: c.landlocked,
        borders: c.borders,
        aliases: c.aliases,
        capital: c.capital,
        ...(dest ? { continentSlug: travelContinentSlug(dest) } : {}),
      },
      dest !== undefined,
    );
  });
  const have = new Set(rows.map((r) => r.code));
  for (const dest of DESTINATIONS) if (!have.has(dest.code)) rows.push(extraCountry(dest));
  return rows.sort((a, b) => a.code.localeCompare(b.code, "en"));
}

/* ----------------------------- seyahat bilgisi ----------------------------- */

const BUDGET_KEY = { Yüksek: "high", Orta: "moderate", Ekonomik: "budget" } as const;

/** Web'in kalıp yerelleştiricilerini (lib/travelData.ts) olduğu gibi kullanır; tanımadığını Türkçe bırakır. */
function localizeStructured(dest: Destination, lang: ForeignLang, report: SeedReport): Record<string, string> | null {
  const t = namespaceT(lang, "TravelData") as never;
  const format = {
    dateTime: (date: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(lang, options).format(date),
  };
  const budget = localizeBudget(dest.budget, lang, t);
  const flightTime = localizeFlightTime(dest.flightTime, lang, t);
  const bestSeason = localizeBestSeason(dest.bestSeason, lang, t, format as never);
  const unlocalized = (
    [
      ["budget", dest.budget, budget],
      ["flightTime", dest.flightTime, flightTime],
      ["bestSeason", dest.bestSeason, bestSeason],
    ] as const
  ).filter(([, source, localized]) => localized === source);
  for (const [field, source] of unlocalized) report.unlocalizedPatterns.push(`${dest.code}/${lang}/${field}: "${source}"`);
  return unlocalized.length > 0 ? null : { budget, flightTime, bestSeason };
}

function buildTravel(report: SeedReport): CountryTravelSeed[] {
  return DESTINATIONS.map((dest, position) => {
    const budgetKey = BUDGET_KEY[dest.budget as keyof typeof BUDGET_KEY];
    if (!budgetKey) throw new Error(`${dest.code}: tanınmayan bütçe "${dest.budget}"`);
    const hubTr = countryHubFor(dest.code);
    const translations: CountryTravelSeed["translations"] = {
      tr: {
        description: dest.description,
        signature: dest.signature,
        gateway: dest.gateway,
        capital: dest.capital,
        bestSeason: dest.bestSeason,
        flightTime: dest.flightTime,
        budget: dest.budget,
        ...(hubTr ? { hub: hubTr as unknown as Json } : {}),
      },
    };
    const completeLangs: ForeignLang[] = [];
    for (const lang of FOREIGN_LANGS) {
      const tr = contentTranslator(lang);
      const description = tr.t(dest.description);
      const signature = tr.t(dest.signature);
      const capital = tr.t(dest.capital);
      const gateway = tr.t(dest.gateway);
      const textsComplete = tr.misses.size === 0;
      const hub = localizedHub(dest.code, lang);
      const hubComplete = hub ? hub.complete : true;
      const structured = localizeStructured(dest, lang, report);
      if (textsComplete && hubComplete && structured) {
        translations[lang] = {
          description,
          signature,
          gateway,
          capital,
          bestSeason: structured.bestSeason,
          flightTime: structured.flightTime,
          budget: structured.budget,
          ...(hub ? { hub: hub.value as unknown as Json } : {}),
        };
        completeLangs.push(lang);
      } else {
        report.incompleteTravel[lang].push(`${dest.code}${textsComplete ? "" : " (metin)"}${hubComplete ? "" : " (hub)"}${structured ? "" : " (kalıp)"}`);
      }
    }
    return {
      countryCode: dest.code,
      image: dest.image || null,
      accent: dest.accent || null,
      budget: budgetKey,
      iata: dest.iata || null,
      position,
      translations,
      completeLangs,
    };
  });
}

/* ---------------------------------- şehirler --------------------------------- */

function buildCities(report: SeedReport): CitySeed[] {
  const rows: CitySeed[] = [];
  for (const dest of DESTINATIONS) {
    dest.cities.forEach((city: DestinationCity, position) => {
      const translations: CitySeed["translations"] = { tr: { name: city.name, description: city.description } };
      const completeLangs: ForeignLang[] = [];
      for (const lang of FOREIGN_LANGS) {
        const tr = contentTranslator(lang);
        const name = tr.t(city.name);
        const description = tr.t(city.description);
        if (tr.misses.size === 0) {
          translations[lang] = { name, description };
          completeLangs.push(lang);
        } else {
          report.incompleteCities[lang]++;
        }
      }
      rows.push({
        countryCode: dest.code,
        slug: slugify(city.name),
        position,
        image: city.image || null,
        translations,
        completeLangs,
      });
    });
  }
  return rows;
}

/* ---------------------------------- rehberler --------------------------------- */

/** Nesneden verilen anahtarları çıkarır (kaynağı değiştirmez). */
function omit<T extends object>(value: T, keys: readonly string[]): Record<string, Json | undefined> {
  return Object.fromEntries(Object.entries(value).filter(([key]) => !keys.includes(key))) as Record<string, Json | undefined>;
}

/** Rehber gövdesi: `city`/`countryCode` kimlik alanları satırda; `reviewed` tarihi `reviewedAt` olur. */
function guideBody(guide: CityGuide, dietary: DestinationDietaryGuide | null): Record<string, Json | undefined> {
  const body: Record<string, Json | undefined> = { ...omit(guide, ["city", "countryCode", "reviewed"]), reviewedAt: guide.reviewed };
  if (dietary) body.dietary = omit(dietary, ["countryCode", "city"]) as Json;
  return body;
}

function buildCityGuides(cities: CitySeed[], report: SeedReport): Record<string, CityGuideFileSeed> {
  const slugOf = new Map<string, string>();
  for (const dest of DESTINATIONS) for (const city of dest.cities) slugOf.set(`${dest.code}:${city.name}`, slugify(city.name));
  const positionOf = new Map(cities.map((c) => [`${c.countryCode}:${c.slug}`, c.position]));

  const files: Record<string, CityGuideFileSeed> = {};
  for (const guide of GUIDES) {
    const slug = slugOf.get(`${guide.countryCode}:${guide.city}`);
    if (!slug) throw new Error(`Rehberin şehri destinasyon verisinde yok: ${guide.countryCode}:${guide.city}`);
    const translations: CityGuideSeed["translations"] = {
      tr: guideBody(guide, dietaryGuideFor(guide.countryCode, guide.city)),
    };
    const completeLangs: ForeignLang[] = [];
    for (const lang of FOREIGN_LANGS) {
      const localized = localizedGuide(guide.countryCode, guide.city, lang);
      const dietary = localizedDietary(guide.countryCode, guide.city, lang);
      if (localized && localized.complete && (dietary?.complete ?? true)) {
        translations[lang] = guideBody(localized.value, dietary ? dietary.value : null);
        completeLangs.push(lang);
      } else {
        report.incompleteGuides[lang]++;
      }
    }
    (files[guide.countryCode] ??= { countryCode: guide.countryCode, guides: [] }).guides.push({
      citySlug: slug,
      reviewed: Boolean(guide.reviewed),
      translations,
      completeLangs,
    });
  }
  for (const file of Object.values(files)) {
    file.guides.sort((a, b) => (positionOf.get(`${file.countryCode}:${a.citySlug}`) ?? 0) - (positionOf.get(`${file.countryCode}:${b.citySlug}`) ?? 0));
  }
  return files;
}

/* ----------------------------------- derleme ---------------------------------- */

export function buildSeed(): { files: SeedFiles; report: SeedReport } {
  const report: SeedReport = {
    incompleteTravel: { en: [], es: [] },
    incompleteCities: { en: 0, es: 0 },
    incompleteGuides: { en: 0, es: 0 },
    unlocalizedPatterns: [],
  };
  const cities = buildCities(report);
  const files: SeedFiles = {
    continents: buildContinents(),
    countries: buildCountries(),
    countryTravel: buildTravel(report),
    cities,
    cityGuides: buildCityGuides(cities, report),
  };
  return { files, report };
}

/* ------------------------------- yazma/okuma ------------------------------- */

/** Anahtarları özyinelemeli sıralar, `undefined` değerleri atar: çıktı bayt bayt kararlı. */
function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort()) {
      const item = (value as Record<string, unknown>)[key];
      if (item !== undefined) out[key] = sortKeysDeep(item);
    }
    return out;
  }
  return value;
}

const render = (value: unknown, pretty: boolean): string => `${JSON.stringify(sortKeysDeep(value), null, pretty ? 1 : undefined)}\n`;

/** Dosya adı → içerik. `pretty` yanlışsa girintisiz. */
export function renderSeed(files: SeedFiles, pretty: boolean): Map<string, string> {
  const out = new Map<string, string>();
  out.set("continents.json", render(files.continents, pretty));
  out.set("countries.json", render(files.countries, pretty));
  out.set("country-travel.json", render(files.countryTravel, pretty));
  out.set("cities.json", render(files.cities, pretty));
  for (const code of Object.keys(files.cityGuides).sort()) out.set(`city-guides/${code}.json`, render(files.cityGuides[code], pretty));
  return out;
}

const totalBytes = (rendered: Map<string, string>): number => [...rendered.values()].reduce((sum, text) => sum + Buffer.byteLength(text), 0);

/** Girintili yazılır; toplam boyut 25 MB'ı aşarsa girintisiz. */
export function renderSeedAuto(files: SeedFiles): { rendered: Map<string, string>; pretty: boolean; bytes: number } {
  const pretty = renderSeed(files, true);
  const prettyBytes = totalBytes(pretty);
  if (prettyBytes <= MAX_PRETTY_BYTES) return { rendered: pretty, pretty: true, bytes: prettyBytes };
  const compact = renderSeed(files, false);
  return { rendered: compact, pretty: false, bytes: totalBytes(compact) };
}

function listSeedFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of ["continents.json", "countries.json", "country-travel.json", "cities.json"]) if (existsSync(join(dir, name))) out.push(name);
  const guideDir = join(dir, "city-guides");
  if (existsSync(guideDir)) for (const name of readdirSync(guideDir).sort()) if (name.endsWith(".json")) out.push(`city-guides/${name}`);
  return out;
}

/** Diskteki tohumun, üretilenle bayt bayt aynı olup olmadığı. Farklı dosyaların adları döner. */
export function diffSeed(dir: string, rendered: Map<string, string>): string[] {
  const diffs: string[] = [];
  for (const [name, text] of rendered) {
    const path = join(dir, name);
    if (!existsSync(path) || readFileSync(path, "utf8") !== text) diffs.push(name);
  }
  for (const name of listSeedFiles(dir)) if (!rendered.has(name)) diffs.push(`${name} (fazla)`);
  return diffs;
}

function writeSeed(dir: string, rendered: Map<string, string>): void {
  mkdirSync(join(dir, "city-guides"), { recursive: true });
  for (const [name, text] of rendered) writeFileSync(join(dir, name), text);
  for (const name of listSeedFiles(dir)) if (!rendered.has(name)) rmSync(join(dir, name));
}

/* -------------------------------------- CLI ------------------------------------- */

function main(): void {
  const args = process.argv.slice(2);
  const outIndex = args.indexOf("--out");
  const outDir = outIndex >= 0 ? resolve(args[outIndex + 1] ?? "") : DEFAULT_OUT;
  const check = args.includes("--check");

  const started = Date.now();
  const { files, report } = buildSeed();
  const { rendered, pretty, bytes } = renderSeedAuto(files);

  const guideCount = Object.values(files.cityGuides).reduce((n, f) => n + f.guides.length, 0);
  const lines = [
    `kıta: ${files.continents.length}`,
    `ülke: ${files.countries.length} (seyahat bilgisi olan: ${files.countryTravel.length})`,
    `şehir: ${files.cities.length}`,
    `rehber: ${guideCount} (${Object.keys(files.cityGuides).length} dosya)`,
    ...FOREIGN_LANGS.map(
      (lang) =>
        `${lang}: seyahat ${files.countryTravel.filter((t) => t.completeLangs.includes(lang)).length}/${files.countryTravel.length}, ` +
        `şehir ${files.cities.filter((c) => c.completeLangs.includes(lang)).length}/${files.cities.length}, ` +
        `rehber ${Object.values(files.cityGuides).reduce((n, f) => n + f.guides.filter((g) => g.completeLangs.includes(lang)).length, 0)}/${guideCount}`,
    ),
    `boyut: ${(bytes / 1024 / 1024).toFixed(2)} MB (${pretty ? "girintili" : "girintisiz"})`,
  ];
  for (const lang of FOREIGN_LANGS) {
    if (report.incompleteTravel[lang].length > 0) lines.push(`${lang} eksik ülke: ${report.incompleteTravel[lang].join(", ")}`);
  }
  if (report.unlocalizedPatterns.length > 0) lines.push(`kalıpları tanınmayan alanlar: ${report.unlocalizedPatterns.join("; ")}`);

  if (check) {
    const diffs = diffSeed(outDir, rendered);
    console.log(lines.join("\n"));
    if (diffs.length > 0) {
      console.error(`\nTohum güncel değil (${diffs.length} dosya): ${diffs.slice(0, 8).join(", ")}${diffs.length > 8 ? ", ..." : ""}\nGüncellemek için: npx tsx scripts/export-api-seed.ts`);
      process.exit(1);
    }
    console.log("\nTohum güncel.");
    return;
  }
  writeSeed(outDir, rendered);
  console.log(lines.join("\n"));
  console.log(`\n${rendered.size} dosya yazıldı: ${outDir} (${((Date.now() - started) / 1000).toFixed(1)} sn)`);
}

if (require.main === module) main();

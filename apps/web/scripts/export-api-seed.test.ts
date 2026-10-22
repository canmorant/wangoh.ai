/**
 * API tohumunun (apps/api/seed) bütünlüğü ve web verisiyle uyumu.
 * Run:  npx tsx scripts/export-api-seed.test.ts   (apps/web içinden)
 *
 * Denetlenenler:
 *  - sayılar: dünya ülkeleri + Svalbard, 45 seyahat ülkesi, 360 şehir, 358 rehber
 *  - benzersizlik: ISO2/ISO3, ülke başına şehir slug'ı; slug = slugify(Türkçe ad) (web adresleriyle birebir)
 *  - her şehirde/ülkede Türkçe çeviri var; `completeLangs` ile `translations` anahtarları tutarlı
 *  - kıta: seyahat ülkesinde web'in rehber bölgesi (content/regions.ts), öteki ülkelerde dünya verisinin kıtası
 *  - yabancı anahtarlar: kıta, ülke, şehir, rehber, sınır (ISO3) ve görsel dosyaları
 *  - biçim: anahtarlar sıralı, dosya sonu satırsonu, boyut kuralı (>25 MB ise girintisiz)
 *  - güncellik: diskteki tohum, web verisinden şimdi üretilenle bayt bayt aynı (aksi halde
 *    `npx tsx scripts/export-api-seed.ts` çalıştırın) ve üretim deterministik
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { allCountries as DESTINATIONS, GUIDES } from "@/content/guides";
import { countriesByRegion, regionOf } from "@/content/regions";
import { countries as WORLD } from "@/data/countries";
import { slugify } from "@/lib/slug";
import {
  FOREIGN_LANGS,
  MAX_PRETTY_BYTES,
  buildSeed,
  diffSeed,
  renderSeedAuto,
  type CityGuideFileSeed,
  type CitySeed,
  type ContinentSeed,
  type CountrySeed,
  type CountryTravelSeed,
} from "./export-api-seed";

let pass = 0;
let fail = 0;
const ok = (name: string, condition: boolean, detail = "") => {
  if (condition) pass++;
  else fail++;
  if (!condition || process.env.VERBOSE) console.log(`${condition ? "  PASS" : "  FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};
const sample = (items: readonly unknown[]) => items.slice(0, 5).join(", ");

const WEB_ROOT = resolve(__dirname, "..");
const SEED_DIR = resolve(WEB_ROOT, "..", "api", "seed");
const read = <T>(name: string): T => JSON.parse(readFileSync(join(SEED_DIR, name), "utf8")) as T;

const continents = read<ContinentSeed[]>("continents.json");
const countries = read<CountrySeed[]>("countries.json");
const travel = read<CountryTravelSeed[]>("country-travel.json");
const cities = read<CitySeed[]>("cities.json");
const guideFiles = readdirSync(join(SEED_DIR, "city-guides"))
  .filter((name) => name.endsWith(".json"))
  .sort()
  .map((name) => ({ name, data: read<CityGuideFileSeed>(`city-guides/${name}`) }));
const guides = guideFiles.flatMap((f) => f.data.guides.map((g) => ({ ...g, countryCode: f.data.countryCode })));

const LANG_SET = new Set<string>(FOREIGN_LANGS);
const nonEmpty = (v: unknown): boolean => typeof v === "string" && v.trim().length > 0;

/* ----------------------------------- sayılar ----------------------------------- */

const worldCodes = new Set(WORLD.map((c) => c.iso2));
const extraCodes = DESTINATIONS.filter((d) => !worldCodes.has(d.code)).map((d) => d.code);
const webCityCount = DESTINATIONS.reduce((n, d) => n + d.cities.length, 0);

ok("kıta sayısı 5", continents.length === 5, String(continents.length));
ok("ülke sayısı = dünya ülkeleri + dünya listesinde olmayan destinasyonlar", countries.length === WORLD.length + extraCodes.length, `${countries.length} vs ${WORLD.length}+${extraCodes.length}`);
ok("dünya listesinde olmayan destinasyon yalnız Svalbard (SJ)", extraCodes.join() === "SJ", extraCodes.join());
ok("seyahat ülkesi sayısı = destinasyon sayısı (45)", travel.length === DESTINATIONS.length && travel.length === 45, String(travel.length));
ok("şehir sayısı 360", cities.length === 360 && cities.length === webCityCount, String(cities.length));
ok("rehber sayısı 358", guides.length === 358 && guides.length === GUIDES.length, String(guides.length));
ok("rehber dosyası, rehberi olan ülke başına bir tane", guideFiles.length === new Set(GUIDES.map((g) => g.countryCode)).size && guideFiles.every((f) => f.name === `${f.data.countryCode}.json`));

/* ----------------------------------- kıtalar ----------------------------------- */

const continentSlugs = new Set(continents.map((c) => c.slug));
ok("kıta slug'ları: africa, americas, asia, europe, oceania", [...continentSlugs].sort().join() === "africa,americas,asia,europe,oceania");
ok("kıta konumları 0..4 benzersiz", new Set(continents.map((c) => c.position)).size === 5 && continents.every((c) => c.position >= 0 && c.position <= 4));
ok("her kıtada tr, en, es adı var", continents.every((c) => nonEmpty(c.translations.tr?.name) && nonEmpty(c.translations.en?.name) && nonEmpty(c.translations.es?.name)));

/* ----------------------------------- ülkeler ----------------------------------- */

const countryByCode = new Map(countries.map((c) => [c.code, c]));
const iso3s = new Set(countries.map((c) => c.iso3));
ok("ülke kodları benzersiz ve ISO2", countryByCode.size === countries.length && countries.every((c) => /^[A-Z]{2}$/.test(c.code)));
ok("iso3 benzersiz ve 3 harf", iso3s.size === countries.length && countries.every((c) => /^[A-Z]{3}$/.test(c.iso3)));
ok("her ülkenin kıtası var", countries.every((c) => continentSlugs.has(c.continentSlug)), sample(countries.filter((c) => !continentSlugs.has(c.continentSlug)).map((c) => c.code)));
ok("sınır komşuları var olan ISO3 kodları", countries.every((c) => c.borders.every((b) => iso3s.has(b))));
ok("her ülkede Türkçe ad var", countries.every((c) => nonEmpty(c.translations.tr?.name)), sample(countries.filter((c) => !nonEmpty(c.translations.tr?.name)).map((c) => c.code)));
ok("ülke çevirileri yalnız tr/en/es", countries.every((c) => Object.keys(c.translations).every((l) => l === "tr" || LANG_SET.has(l))));
ok("web'in adı olan her ülkede en ve es adı var (uydurulmadı: lib/countryNames)", countries.every((c) => nonEmpty(c.translations.en?.name) && nonEmpty(c.translations.es?.name)));
ok("koordinatlar sayı", countries.every((c) => typeof c.latitude === "number" && typeof c.longitude === "number" && Math.abs(c.latitude) <= 90 && Math.abs(c.longitude) <= 180));
ok("bayrak emojisi var", countries.every((c) => nonEmpty(c.flag)));
ok("hasTravel = seyahat satırı olması", countries.every((c) => c.hasTravel === travel.some((t) => t.countryCode === c.code)));
ok("bayrak görselleri public/flags altında", countries.every((c) => existsSync(join(WEB_ROOT, "public", "flags", `${c.code.toLowerCase()}.svg`))), sample(countries.filter((c) => !existsSync(join(WEB_ROOT, "public", "flags", `${c.code.toLowerCase()}.svg`))).map((c) => c.code)));
ok("Türkçe ad web verisiyle aynı (dünya listesi)", WORLD.every((w) => countryByCode.get(w.iso2)?.translations.tr?.name === w.name));
const CONTINENT_SLUG_OF_SOURCE: Record<string, string> = { Europe: "europe", Asia: "asia", Americas: "americas", Africa: "africa", Oceania: "oceania" };
ok(
  "seyahat ülkesinin kıtası web'in rehber bölgesi (regions.ts; Türkiye Avrupa'da)",
  DESTINATIONS.every((d) => countryByCode.get(d.code)?.continentSlug === regionOf(d)) && countryByCode.get("TR")?.continentSlug === "europe",
  sample(DESTINATIONS.filter((d) => countryByCode.get(d.code)?.continentSlug !== regionOf(d)).map((d) => `${d.code}:${countryByCode.get(d.code)?.continentSlug}≠${regionOf(d)}`)),
);
ok(
  "kıta başına seyahat ülkesi sayısı web'in countriesByRegion çıktısıyla aynı",
  countriesByRegion().every(({ region, countries: list }) => countries.filter((c) => c.hasTravel && c.continentSlug === region).length === list.length),
);
ok(
  "seyahat içeriği olmayan ülkenin kıtası dünya verisinin kıtası",
  WORLD.filter((w) => !DESTINATIONS.some((d) => d.code === w.iso2)).every((w) => countryByCode.get(w.iso2)?.continentSlug === CONTINENT_SLUG_OF_SOURCE[w.continent]),
);

/* ------------------------------- seyahat bilgisi ------------------------------- */

const TRAVEL_FIELDS = ["description", "signature", "gateway", "capital", "bestSeason", "flightTime", "budget"] as const;
ok("seyahat konumları 0..n-1 benzersiz", new Set(travel.map((t) => t.position)).size === travel.length && travel.every((t) => t.position >= 0 && t.position < travel.length));
ok("seyahat ülke kodları var olan ülkeler ve benzersiz", new Set(travel.map((t) => t.countryCode)).size === travel.length && travel.every((t) => countryByCode.has(t.countryCode)));
ok("bütçe anahtarı budget|moderate|high", travel.every((t) => ["budget", "moderate", "high"].includes(t.budget)));
ok("her seyahat ülkesinde Türkçe alanlar ve hub var", travel.every((t) => TRAVEL_FIELDS.every((f) => nonEmpty(t.translations.tr?.[f])) && typeof t.translations.tr?.hub === "object"));
ok("seyahat: completeLangs yalnız en/es, tekrarsız", travel.every((t) => t.completeLangs.every((l) => LANG_SET.has(l)) && new Set(t.completeLangs).size === t.completeLangs.length));
ok(
  "seyahat: completeLangs ↔ translations anahtarları tutarlı",
  travel.every((t) => FOREIGN_LANGS.every((l) => t.completeLangs.includes(l) === (l in t.translations)) && Object.keys(t.translations).every((l) => l === "tr" || LANG_SET.has(l))),
);
ok(
  "seyahat: tam dilde tüm alanlar ve hub dolu",
  travel.every((t) => t.completeLangs.every((l) => TRAVEL_FIELDS.every((f) => nonEmpty(t.translations[l]?.[f])) && (t.translations.tr?.hub === undefined || typeof t.translations[l]?.hub === "object"))),
);
ok("seyahat görselleri: web yolu mevcut dosya ya da https", travel.every((t) => t.image === null || imageOk(t.image)), sample(travel.filter((t) => t.image !== null && !imageOk(t.image)).map((t) => `${t.countryCode}:${t.image}`)));
ok("vurgu rengi #rrggbb", travel.every((t) => t.accent === null || /^#[0-9a-f]{6}$/i.test(t.accent)));

/* ----------------------------------- şehirler ----------------------------------- */

const cityKey = (code: string, slug: string) => `${code}:${slug}`;
const cityByKey = new Map(cities.map((c) => [cityKey(c.countryCode, c.slug), c]));
ok("(ülke, slug) benzersiz", cityByKey.size === cities.length, `${cityByKey.size} vs ${cities.length}`);
ok("slug biçimi", cities.every((c) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.slug)));
ok("slug = slugify(Türkçe ad) (web adresleriyle birebir)", cities.every((c) => c.slug === slugify(c.translations.tr?.name ?? "")), sample(cities.filter((c) => c.slug !== slugify(c.translations.tr?.name ?? "")).map((c) => c.slug)));
ok("her şehirde Türkçe ad ve açıklama var", cities.every((c) => nonEmpty(c.translations.tr?.name) && nonEmpty(c.translations.tr?.description)));
ok("şehrin ülkesi seyahat ülkesi", cities.every((c) => travel.some((t) => t.countryCode === c.countryCode)));
ok("ülke başına şehir sayısı web ile aynı", DESTINATIONS.every((d) => cities.filter((c) => c.countryCode === d.code).length === d.cities.length));
ok("ülke başına konumlar 0..n-1", DESTINATIONS.every((d) => cities.filter((c) => c.countryCode === d.code).map((c) => c.position).sort((a, b) => a - b).every((p, i) => p === i)));
ok("şehir: completeLangs ↔ translations tutarlı", cities.every((c) => FOREIGN_LANGS.every((l) => c.completeLangs.includes(l) === (l in c.translations)) && Object.keys(c.translations).every((l) => l === "tr" || LANG_SET.has(l))));
ok("şehir: tam dilde ad ve açıklama dolu", cities.every((c) => c.completeLangs.every((l) => nonEmpty(c.translations[l]?.name) && nonEmpty(c.translations[l]?.description))));
ok("şehir görselleri: web yolu mevcut dosya ya da https", cities.every((c) => c.image === null || imageOk(c.image)), sample(cities.filter((c) => c.image !== null && !imageOk(c.image)).map((c) => c.image)));
ok("slug'lar web adreslerindekiyle aynı (örnek)", cityByKey.has("JP:tokyo") && cityByKey.has("FR:paris") && cityByKey.has("TR:istanbul"));

/* ----------------------------------- rehberler ----------------------------------- */

const GUIDE_FIELDS = ["seoTitle", "seoDescription", "h1", "lede", "quickFacts", "sections", "places", "itinerary", "faqs", "reviewedAt"] as const;
const guideKeys = guides.map((g) => cityKey(g.countryCode, g.citySlug));
ok("rehber (ülke, şehir) benzersiz", new Set(guideKeys).size === guides.length);
ok("her rehberin şehri var", guideKeys.every((k) => cityByKey.has(k)), sample(guideKeys.filter((k) => !cityByKey.has(k))));
const withoutGuide = cities.filter((c) => !guideKeys.includes(cityKey(c.countryCode, c.slug))).map((c) => cityKey(c.countryCode, c.slug)).sort();
const webWithoutGuide = DESTINATIONS.flatMap((d) => d.cities.filter((city) => !GUIDES.some((g) => g.countryCode === d.code && g.city === city.name)).map((city) => cityKey(d.code, slugify(city.name)))).sort();
ok("rehbersiz şehirler web ile aynı (2: Pyramiden, Barentsburg)", withoutGuide.join() === webWithoutGuide.join() && withoutGuide.length === 2, withoutGuide.join());
ok("her rehberde Türkçe gövde ve zorunlu alanlar var", guides.every((g) => GUIDE_FIELDS.every((f) => g.translations.tr?.[f] !== undefined && g.translations.tr?.[f] !== "")));
ok("rehber gövdesinde kimlik alanı yok (city/countryCode satırda)", guides.every((g) => Object.values(g.translations).every((b) => !("city" in b) && !("countryCode" in b) && !("reviewed" in b))));
ok("rehber: completeLangs ↔ translations tutarlı", guides.every((g) => FOREIGN_LANGS.every((l) => g.completeLangs.includes(l) === (l in g.translations)) && Object.keys(g.translations).every((l) => l === "tr" || LANG_SET.has(l))));
ok("rehber: tam dilde zorunlu alanlar dolu", guides.every((g) => g.completeLangs.every((l) => GUIDE_FIELDS.every((f) => g.translations[l]?.[f] !== undefined && g.translations[l]?.[f] !== ""))));
ok("rehber reviewed bayrağı", guides.every((g) => g.reviewed === true));
ok(
  "ilgili rehberler aynı ülkedeki var olan şehirlere işaret ediyor",
  guides.every((g) => {
    const related = (g.translations.tr?.relatedGuides ?? []) as { city: string }[];
    const names = new Set(cities.filter((c) => c.countryCode === g.countryCode).map((c) => c.translations.tr?.name));
    return related.every((r) => names.has(r.city));
  }),
);
ok(
  "beslenme önerileri (varsa) kaynak adresi https",
  guides.every((g) => {
    const dietary = g.translations.tr?.dietary as { vegan?: { verification?: { sourceUrl?: string } }[]; halal?: { verification?: { sourceUrl?: string } }[] } | undefined;
    return [...(dietary?.vegan ?? []), ...(dietary?.halal ?? [])].every((r) => /^https:\/\//.test(r.verification?.sourceUrl ?? ""));
  }),
);
ok(
  "rehber kaynak adresleri https",
  guides.every((g) => ((g.translations.tr?.sources ?? []) as { url: string }[]).every((s) => /^https:\/\//.test(s.url))),
);

/* ------------------------------- biçim ve boyut ------------------------------- */

const files = [
  "continents.json",
  "countries.json",
  "country-travel.json",
  "cities.json",
  ...guideFiles.map((f) => `city-guides/${f.name}`),
];
const texts = files.map((name) => ({ name, text: readFileSync(join(SEED_DIR, name), "utf8") }));
const total = texts.reduce((n, f) => n + Buffer.byteLength(f.text), 0);
const sortedDeep = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(sortedDeep) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortedDeep((v as Record<string, unknown>)[k])])) : v;
ok("dosyalar satırsonuyla biter", texts.every((f) => f.text.endsWith("\n") && !f.text.endsWith("\n\n")));
ok("anahtarlar sıralı (deterministik çıktı)", texts.every((f) => JSON.stringify(sortedDeep(JSON.parse(f.text))) === JSON.stringify(JSON.parse(f.text))));
const isPretty = texts.every((f) => f.text.includes("\n "));
ok("boyut kuralı: 25 MB altı girintili, üstü girintisiz", isPretty === total <= MAX_PRETTY_BYTES, `${(total / 1024 / 1024).toFixed(2)} MB, girintili=${isPretty}`);
ok("rehber gövdeleri 100 kb gövde sınırının altında (tek dilde yama)", guides.every((g) => Object.values(g.translations).every((b) => Buffer.byteLength(JSON.stringify(b)) < 90 * 1024)));

/* --------------------------- güncellik ve belirlilik --------------------------- */

const first = buildSeed();
const second = buildSeed();
const renderedFirst = renderSeedAuto(first.files);
const renderedSecond = renderSeedAuto(second.files);
ok("üretim deterministik: iki çalıştırma aynı çıktıyı verir", [...renderedFirst.rendered].every(([name, text]) => renderedSecond.rendered.get(name) === text));
const stale = diffSeed(SEED_DIR, renderedFirst.rendered);
ok("diskteki tohum web verisinden üretilenle aynı (güncel)", stale.length === 0, `${sample(stale)} — npx tsx scripts/export-api-seed.ts`);
ok("web çevirisi tam olmayan dil yazılmadı (rapor ile dosyalar tutarlı)", FOREIGN_LANGS.every((l) => travel.filter((t) => !t.completeLangs.includes(l)).length === first.report.incompleteTravel[l].length && cities.filter((c) => !c.completeLangs.includes(l)).length === first.report.incompleteCities[l]));

console.log(`\n${pass} passed, ${fail} failed  (${countries.length} ülke, ${travel.length} seyahat, ${cities.length} şehir, ${guides.length} rehber, ${(total / 1024 / 1024).toFixed(2)} MB)`);
process.exit(fail ? 1 : 0);

/* ------------------------------------ yardımcı ------------------------------------ */

/** Web yolu `/images/<ad>.avif` mevcut ve /og rotasının ad kuralına uyar; ya da https adres. */
function imageOk(image: string): boolean {
  if (/^https:\/\//.test(image)) return true;
  const m = /^\/images\/([a-z0-9][a-z0-9-]{0,180})\.avif$/.exec(image);
  return m !== null && existsSync(join(WEB_ROOT, "public", "images", `${m[1]}.avif`));
}

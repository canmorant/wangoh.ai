/**
 * Dile özel rehber ve ülke başlık/açıklamaları
 * (src/content/guides/seo.en.ts, seo.es.ts, countryHubs.seo.*.ts).
 * Run:  npx tsx scripts/seo-copy.test.ts
 *
 * Arama sonucunda kesilmeyecek uzunluk, her rehberin kendi metni, tekrar ve
 * "…" ile kesilmiş metin yok; başlık şehrin o dildeki adını içerir.
 */
import { countries } from "../src/data/destinations";
import { SECRET_DESTINATION } from "../src/data/secret";
import { guideFor } from "../src/content/guides";
import { EN_GUIDE_SEO } from "../src/content/guides/seo.en";
import { ES_GUIDE_SEO } from "../src/content/guides/seo.es";
import { EN_HUB_TITLES } from "../src/content/countryHubs.seo.en";
import { ES_HUB_SEO } from "../src/content/countryHubs.seo.es";
import { localizedGuide, localizedHub, placeName } from "../src/content/localized";
import type { AppLocale } from "../src/i18n/routing";

let pass = 0;
let fail = 0;
const ok = (n: string, c: boolean, d = "") => {
  if (c) pass++;
  else fail++;
  if (!c || process.env.VERBOSE) console.log(`${c ? "  PASS" : "  FAIL"}  ${n}${d ? `  — ${d}` : ""}`);
};

const allCountries = [...countries, SECRET_DESTINATION];
const keys = allCountries.flatMap((c) =>
  c.cities.filter((city) => guideFor(c.code, city.name)).map((city) => ({ code: c.code, city: city.name }))
);
const known = new Set(keys.map((k) => `${k.code}:${k.city}`));
const norm = (s: string) => s.toLocaleLowerCase("tr").normalize("NFC");

const GUIDES: [AppLocale, Record<string, readonly [string, string]>][] = [["en", EN_GUIDE_SEO], ["es", ES_GUIDE_SEO]];

for (const [locale, table] of GUIDES) {
  ok(`${locale}: her rehberin satırı var`, keys.every((k) => `${k.code}:${k.city}` in table),
    keys.filter((k) => !(`${k.code}:${k.city}` in table)).map((k) => `${k.code}:${k.city}`).join(", "));
  ok(`${locale}: fazla satır yok`, Object.keys(table).every((k) => known.has(k)),
    Object.keys(table).filter((k) => !known.has(k)).join(", "));

  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const { code, city } of keys) {
    const entry = table[`${code}:${city}`];
    if (!entry) continue;
    const [title, description] = entry;
    const id = `${locale} ${code}:${city}`;
    // "Keukenhof and Lisse" gibi çift adlarda başlık ilk adı içerir.
    const first = placeName(city, locale).split(" ")[0];
    ok(`${id} başlık ≤ 60`, title.length <= 60, `${title.length}: ${title}`);
    ok(`${id} başlık şehir adını içeriyor`, norm(title).includes(norm(first)), title);
    ok(`${id} açıklama 120–160`, description.length >= 120 && description.length <= 160, `${description.length}`);
    ok(`${id} kesik metin yok`, !/…|\.\.\./.test(title + description));
    ok(`${id} başlık tekil`, !titles.has(title));
    ok(`${id} açıklama tekil`, !descriptions.has(description));
    titles.add(title);
    descriptions.add(description);
    const guide = localizedGuide(code, city, locale)?.value;
    ok(`${id} rehbere uygulanıyor`, guide?.seoTitle === title && guide?.seoDescription === description);
  }
}

// Ülke sayfaları
const HUBS: [AppLocale, (code: string) => readonly [string, string | undefined] | undefined][] = [
  ["en", (code) => (EN_HUB_TITLES[code] ? [EN_HUB_TITLES[code], undefined] : undefined)],
  ["es", (code) => ES_HUB_SEO[code]],
];
for (const [locale, get] of HUBS) {
  const seen = new Set<string>();
  for (const country of allCountries) {
    const entry = get(country.code);
    ok(`${locale} ${country.code} ülke başlığı var`, !!entry);
    if (!entry) continue;
    const [title, description] = entry;
    ok(`${locale} ${country.code} ülke başlığı ≤ 60`, title.length <= 60, `${title.length}: ${title}`);
    ok(`${locale} ${country.code} ülke başlığı tekil`, !seen.has(title));
    seen.add(title);
    if (description) ok(`${locale} ${country.code} ülke açıklaması 120–160`, description.length >= 120 && description.length <= 160, `${description.length}`);
    const hub = localizedHub(country.code, locale)?.value;
    ok(`${locale} ${country.code} ülke başlığı uygulanıyor`, hub?.seoTitle === title && (!description || hub?.seoDescription === description));
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

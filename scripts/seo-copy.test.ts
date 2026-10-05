/**
 * İngilizce rehber başlık ve açıklamaları (src/content/guides/seo.en.ts).
 * Run:  npx tsx scripts/seo-copy.test.ts
 *
 * Arama sonucunda kesilmeyecek uzunluk, her rehberin kendi metni, tekrar ve
 * "…" ile kesilmiş metin yok; başlık şehrin İngilizce adıyla başlar.
 */
import { countries } from "../src/data/destinations";
import { SECRET_DESTINATION } from "../src/data/secret";
import { guideFor } from "../src/content/guides";
import { EN_GUIDE_SEO } from "../src/content/guides/seo.en";
import { localizedGuide, localizedHub, placeName } from "../src/content/localized";
import { EN_HUB_TITLES } from "../src/content/countryHubs.seo.en";

let pass = 0;
let fail = 0;
const ok = (n: string, c: boolean, d = "") => {
  if (c) pass++;
  else fail++;
  if (!c || process.env.VERBOSE) console.log(`${c ? "  PASS" : "  FAIL"}  ${n}${d ? `  — ${d}` : ""}`);
};

const keys = [...countries, SECRET_DESTINATION].flatMap((c) =>
  c.cities.filter((city) => guideFor(c.code, city.name)).map((city) => ({ code: c.code, city: city.name }))
);
const known = new Set(keys.map((k) => `${k.code}:${k.city}`));

ok("her İngilizce rehberin satırı var", keys.every((k) => `${k.code}:${k.city}` in EN_GUIDE_SEO),
  keys.filter((k) => !(`${k.code}:${k.city}` in EN_GUIDE_SEO)).map((k) => `${k.code}:${k.city}`).join(", "));
ok("fazla satır yok", Object.keys(EN_GUIDE_SEO).every((k) => known.has(k)),
  Object.keys(EN_GUIDE_SEO).filter((k) => !known.has(k)).join(", "));

const titles = new Set<string>();
const descriptions = new Set<string>();
for (const { code, city } of keys) {
  const entry = EN_GUIDE_SEO[`${code}:${city}`];
  if (!entry) continue;
  const [title, description] = entry;
  const name = placeName(city, "en");
  ok(`${code}:${city} başlık ≤ 60`, title.length <= 60, `${title.length}: ${title}`);
  // "Keukenhof and Lisse" gibi çift adlarda başlık ilk adla başlayabilir.
  ok(`${code}:${city} başlık şehir adıyla başlıyor`, title.startsWith(name.split(" ")[0]), title);
  ok(`${code}:${city} açıklama 120–160`, description.length >= 120 && description.length <= 160, `${description.length}`);
  ok(`${code}:${city} kesik metin yok`, !/…|\.\.\./.test(title + description));
  ok(`${code}:${city} başlık tekil`, !titles.has(title));
  ok(`${code}:${city} açıklama tekil`, !descriptions.has(description));
  titles.add(title);
  descriptions.add(description);
  const guide = localizedGuide(code, city, "en")?.value;
  ok(`${code}:${city} rehbere uygulanıyor`, guide?.seoTitle === title && guide?.seoDescription === description);
}

// Ülke sayfaları
const hubTitles = new Set<string>();
for (const country of [...countries, SECRET_DESTINATION]) {
  const title = EN_HUB_TITLES[country.code];
  ok(`${country.code} ülke başlığı var`, !!title);
  if (!title) continue;
  ok(`${country.code} ülke başlığı ≤ 60`, title.length <= 60, `${title.length}: ${title}`);
  ok(`${country.code} ülke başlığı tekil`, !hubTitles.has(title) && !titles.has(title));
  hubTitles.add(title);
  ok(`${country.code} ülke başlığı uygulanıyor`, localizedHub(country.code, "en")?.value.seoTitle === title);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

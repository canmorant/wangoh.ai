/**
 * Yerelleştirilmiş adres parçalarını (ülke ve şehir slug'ları) üretir:
 *   npx tsx scripts/gen-localized-slugs.ts          → src/i18n/slugs.gen.ts'i günceller
 *   npx tsx scripts/gen-localized-slugs.ts --check  → eksik varsa hata verir
 *
 * Kural: bir yer adının o dildeki slug'ı Türkçe slug'dan farklıysa dosyaya
 * girer (japonya → japan). Aynıysa (paris → paris) girmez; iç adres zaten o.
 *
 * Var olan satırlar ASLA değiştirilmez: bir slug yayına çıktıktan sonra
 * adres sabittir. Yalnızca dosyada olmayan yerler eklenir. Bir adresi
 * bilerek değiştirmek gerekirse satır elle düzeltilir ve eski adres için
 * ayrıca yönlendirme düşünülür (Türkçe slug'lı eski adresler zaten kendi
 * kendine yeni adrese yönleniyor, bkz. src/proxy.ts).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { allCountries, countrySlug, citySlug } from "../src/content/guides";
import { placeName } from "../src/content/localized";
import { countryName } from "../src/lib/countryNames";
import { slugify } from "../src/lib/slug";
import { LOCALIZED_SLUGS, SLUG_LOCALES } from "../src/i18n/slugs.gen";

const FILE = join(__dirname, "..", "src", "i18n", "slugs.gen.ts");
const check = process.argv.includes("--check");

type Table = { countries: Record<string, string>; cities: Record<string, string> };
const next: Record<string, Table> = {};
const added: string[] = [];

for (const locale of SLUG_LOCALES) {
  const current = (LOCALIZED_SLUGS as Record<string, Table>)[locale] ?? { countries: {}, cities: {} };
  const table: Table = { countries: { ...current.countries }, cities: { ...current.cities } };
  for (const country of allCountries) {
    const tr = countrySlug(country);
    const local = slugify(countryName(country.code, locale, country.name));
    if (!(tr in table.countries) && local && local !== tr) {
      table.countries[tr] = local;
      added.push(`${locale} ${tr} → ${local}`);
    }
    for (const city of country.cities) {
      const key = `${tr}/${citySlug(city)}`;
      const localCity = slugify(placeName(city.name, locale));
      if (!(key in table.cities) && localCity && localCity !== citySlug(city)) {
        table.cities[key] = localCity;
        added.push(`${locale} ${key} → ${localCity}`);
      }
    }
  }
  next[locale] = table;
}

if (check) {
  if (added.length) {
    console.error(`slugs.gen.ts eksik (${added.length}):\n  ${added.join("\n  ")}\nÇalıştırın: npx tsx scripts/gen-localized-slugs.ts`);
    process.exit(1);
  }
  console.log("✓ slugs.gen.ts güncel");
  process.exit(0);
}

const quote = (s: string) => JSON.stringify(s);
const block = (entries: Record<string, string>) =>
  Object.entries(entries)
    .map(([k, v]) => `      ${quote(k)}: ${quote(v)},`)
    .join("\n");

const header = readFileSync(FILE, "utf8").split("export const LOCALIZED_SLUGS")[0];
const body = `export const LOCALIZED_SLUGS: Partial<Record<SlugLocale, SlugTable>> = {\n${SLUG_LOCALES.map(
  (locale) =>
    `  ${locale}: {\n    countries: {\n${block(next[locale].countries)}\n    },\n    cities: {\n${block(next[locale].cities)}\n    },\n  },`
).join("\n")}\n};\n`;
writeFileSync(FILE, header + body);
console.log(added.length ? `Eklendi (${added.length}):\n  ${added.join("\n  ")}` : "Değişiklik yok.");

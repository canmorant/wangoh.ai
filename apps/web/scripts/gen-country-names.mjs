/**
 * Ülke adlarının yerelleştirilmiş tablosunu üretir: src/lib/countryNames.gen.ts
 *
 * Kaynak world-countries (ISO 3166-1, mledoze): İngilizce ortak ad ve
 * deu/rus/spa/fra çevirileri. Hiçbir ad elle uydurulmuyor; tek istisna aşağıda
 * belgelenen kısa adlar.
 *
 * Türkçe adlar bilerek BURADA YOK: Türkçe arayüz eskisi gibi projenin kendi
 * verisindeki adları (destinations.ts, countries.ts) kullanmaya devam ediyor.
 * Ayrıca slug'lar Türkçe addan üretildiği için o alan hiç değişmemeli.
 *
 * Çalıştır:  node scripts/gen-country-names.mjs
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import worldCountries from "world-countries";

const OUT = fileURLToPath(new URL("../src/lib/countryNames.gen.ts", import.meta.url));
// Resmî adlar ayrı dosyada: yalnızca bayrak oyunu kullanıyor, ana sayfa paketine girmesin.
const OUT_OFFICIAL = fileURLToPath(new URL("../src/lib/countryOfficialNames.gen.ts", import.meta.url));

const LANGS = { de: "deu", ru: "rus", es: "spa", fr: "fra" };

const names = {};
const officials = {};
for (const c of worldCountries) {
  const entry = { en: c.name.common };
  const official = { en: c.name.official };
  for (const [locale, key] of Object.entries(LANGS)) {
    entry[locale] = c.translations?.[key]?.common ?? c.name.common;
    official[locale] = c.translations?.[key]?.official ?? c.name.official;
  }
  names[c.cca2] = entry;
  officials[c.cca2] = official;
}

const body = `/* Otomatik üretildi — elle düzenlemeyin. Üreten: scripts/gen-country-names.mjs
 * Kaynak: world-countries (ISO 3166-1). ${Object.keys(names).length} ülke, tr hariç 5 dil. */

export type ForeignLocale = "en" | "de" | "ru" | "es" | "fr";

export const COUNTRY_NAMES: Record<string, Record<ForeignLocale, string>> = ${JSON.stringify(names, null, 1)};
`;

writeFileSync(OUT, body);

writeFileSync(
  OUT_OFFICIAL,
  `/* Otomatik üretildi — elle düzenlemeyin. Üreten: scripts/gen-country-names.mjs
 * Kaynak: world-countries. Resmî ülke adları, tr hariç 5 dil. */
import type { ForeignLocale } from "./countryNames.gen";

export const COUNTRY_OFFICIAL_NAMES: Record<string, Record<ForeignLocale, string>> = ${JSON.stringify(officials, null, 1)};
`
);
console.log(`yazıldı: src/lib/countryNames.gen.ts ve countryOfficialNames.gen.ts (${Object.keys(names).length} ülke)`);

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Logger } from "@nestjs/common";
import { inArray, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { OperationalError } from "../common/startup-error.js";
import type { Database } from "../db/client.js";
import { cities, cityGuides, continents, countries, countryTravel, imageCredits } from "../db/schema/index.js";
import { isWebImagePath } from "./assets.js";
import { FOREIGN_LANGS } from "./content.constants.js";

export interface ContentSeedOptions {
  /** Tohum JSON klasörü (`apps/api/seed`). Yoksa sessizce atlanır. */
  dir: string;
  /**
   * `false` (varsayılan): YALNIZ EKSİK satırlar eklenir (`ON CONFLICT DO NOTHING`); yöneticinin sonradan yaptığı
   * düzenlemeler yeniden açılışta ezilmez. `true`: mevcut satırlar tohumdaki değerlerle ezilir (upsert).
   * CLI: `pnpm --filter api db:seed --force`.
   */
  force?: boolean;
}

/** Tablo başına eklenen (force iken: eklenen ya da güncellenen) satır sayısı. */
export interface ContentSeedStats {
  continents: number;
  countries: number;
  countryTravel: number;
  cities: number;
  cityGuides: number;
  imageCredits: number;
}

type Row<T extends { $inferInsert: unknown }> = T["$inferInsert"];

/** Toplu eklemede satır sayısı (PostgreSQL bir ifadede en çok 65535 parametre; guide satırları ise büyük jsonb). */
const CHUNK_SMALL = 100;
const CHUNK_GUIDES = 20;

/**
 * Kıtalar, ülkeler, seyahat bilgileri, şehirler, rehberler ve görsel atıfları için tohum yükleyici. Sıra: continents →
 * countries → country_travel → cities → city_guides → image_credits (yabancı anahtar sırası; atıfların yabancı anahtarı yok).
 * Hepsi tek işlemde (hata olursa yarım tohum kalmaz). Dosyalar `apps/web/scripts/export-api-seed.ts` ile üretilir.
 * İmza sabittir; `force` isteğe bağlı eklentidir.
 */
export async function seedContent(db: Database, opts: ContentSeedOptions): Promise<void> {
  const logger = new Logger("Seed");
  const stats = await loadContentSeed(db, opts);
  if (stats) {
    const verb = opts.force ? "yüklendi/güncellendi" : "eklendi";
    logger.log(
      `İçerik tohumu ${verb}: kıta ${stats.continents}, ülke ${stats.countries}, seyahat ${stats.countryTravel}, şehir ${stats.cities}, rehber ${stats.cityGuides}, görsel atfı ${stats.imageCredits}.`,
    );
  } else {
    // Sözleşme: klasör yoksa hata verilmez (yalnız `dist/` kopyalanan imajda sunucu yine açılır) ama sessiz de kalınmaz;
    // aksi halde `db:seed` "başarılı" görünür, API 0 ülke/0 şehirle ayağa kalkar.
    logger.warn(`İçerik tohum klasörü bulunamadı: ${opts.dir}. Kıtalar, ülkeler ve şehirler YÜKLENMEDİ; \`seed/\` klasörünü pakete ekleyin.`);
  }
}

/** `seedContent` ile aynı; eklenen satır sayılarını döner (klasör yoksa `null`). Testler ve raporlar kullanır. */
export async function loadContentSeed(db: Database, opts: ContentSeedOptions): Promise<ContentSeedStats | null> {
  if (!existsSync(opts.dir)) return null;
  const force = opts.force === true;

  const continentRows = readSeed(opts.dir, "continents.json", parseContinents);
  const countryRows = readSeed(opts.dir, "countries.json", parseCountries);
  const travelRows = readSeed(opts.dir, "country-travel.json", parseTravel);
  const cityRows = readSeed(opts.dir, "cities.json", parseCities);
  const guideFiles = readGuideFiles(opts.dir);
  const creditRows = readSeed(opts.dir, "image-credits.json", parseImageCredits);

  return db.transaction(async (tx) => {
    const stats: ContentSeedStats = { continents: 0, countries: 0, countryTravel: 0, cities: 0, cityGuides: 0, imageCredits: 0 };

    for (const chunk of chunks(continentRows, CHUNK_SMALL)) {
      const q = tx.insert(continents).values(chunk);
      stats.continents += (
        await (force
          ? q.onConflictDoUpdate({ target: continents.slug, set: { position: excluded(continents.position), translations: excluded(continents.translations) } })
          : q.onConflictDoNothing()
        ).returning({ key: continents.slug })
      ).length;
    }

    for (const chunk of chunks(countryRows, CHUNK_SMALL)) {
      const q = tx.insert(countries).values(chunk);
      stats.countries += (
        await (force
          ? q.onConflictDoUpdate({
              target: countries.code,
              set: {
                iso3: excluded(countries.iso3),
                continentSlug: excluded(countries.continentSlug),
                subregion: excluded(countries.subregion),
                flag: excluded(countries.flag),
                latitude: excluded(countries.latitude),
                longitude: excluded(countries.longitude),
                landlocked: excluded(countries.landlocked),
                borders: excluded(countries.borders),
                aliases: excluded(countries.aliases),
                capital: excluded(countries.capital),
                translations: excluded(countries.translations),
                hasTravel: excluded(countries.hasTravel),
              },
            })
          : q.onConflictDoNothing()
        ).returning({ key: countries.code })
      ).length;
    }

    for (const chunk of chunks(travelRows, CHUNK_SMALL)) {
      const q = tx.insert(countryTravel).values(chunk);
      stats.countryTravel += (
        await (force
          ? q.onConflictDoUpdate({
              target: countryTravel.countryCode,
              set: {
                image: excluded(countryTravel.image),
                accent: excluded(countryTravel.accent),
                budget: excluded(countryTravel.budget),
                iata: excluded(countryTravel.iata),
                position: excluded(countryTravel.position),
                translations: excluded(countryTravel.translations),
                completeLangs: excluded(countryTravel.completeLangs),
              },
            })
          : q.onConflictDoNothing()
        ).returning({ key: countryTravel.countryCode })
      ).length;
    }

    for (const chunk of chunks(cityRows, CHUNK_SMALL)) {
      const q = tx.insert(cities).values(chunk);
      stats.cities += (
        await (force
          ? q.onConflictDoUpdate({
              target: [cities.countryCode, cities.slug],
              set: {
                position: excluded(cities.position),
                image: excluded(cities.image),
                translations: excluded(cities.translations),
                completeLangs: excluded(cities.completeLangs),
              },
            })
          : q.onConflictDoNothing()
        ).returning({ key: cities.id })
      ).length;
    }

    if (guideFiles.length > 0) {
      // Şehir kimlikleri satır başına rastgele üretilir; rehberler (ülke, slug) ile bağlanır.
      const codes = [...new Set(guideFiles.map((f) => f.countryCode))];
      const idOf = new Map<string, string>();
      for (const row of await tx.select({ id: cities.id, countryCode: cities.countryCode, slug: cities.slug }).from(cities).where(inArray(cities.countryCode, codes))) {
        idOf.set(`${row.countryCode}:${row.slug}`, row.id);
      }
      const guideRows = guideFiles.flatMap((file) =>
        file.guides.map((guide): Row<typeof cityGuides> => {
          const cityId = idOf.get(`${file.countryCode}:${guide.citySlug}`);
          if (!cityId) throw new OperationalError(`Tohum dosyası bozuk: city-guides/${file.countryCode}.json rehberinin şehri yok: ${guide.citySlug}`);
          return { cityId, translations: guide.translations as never, completeLangs: guide.completeLangs, reviewed: guide.reviewed };
        }),
      );
      for (const chunk of chunks(guideRows, CHUNK_GUIDES)) {
        const q = tx.insert(cityGuides).values(chunk);
        stats.cityGuides += (
          await (force
            ? q.onConflictDoUpdate({
                target: cityGuides.cityId,
                set: {
                  translations: excluded(cityGuides.translations),
                  completeLangs: excluded(cityGuides.completeLangs),
                  reviewed: excluded(cityGuides.reviewed),
                },
              })
            : q.onConflictDoNothing()
          ).returning({ key: cityGuides.cityId })
        ).length;
      }
    }

    for (const chunk of chunks(creditRows, CHUNK_SMALL)) {
      const q = tx.insert(imageCredits).values(chunk);
      stats.imageCredits += (
        await (force
          ? q.onConflictDoUpdate({
              target: imageCredits.image,
              set: {
                author: excluded(imageCredits.author),
                licenseName: excluded(imageCredits.licenseName),
                licenseUrl: excluded(imageCredits.licenseUrl),
                sourceUrl: excluded(imageCredits.sourceUrl),
                attributionRequired: excluded(imageCredits.attributionRequired),
              },
            })
          : q.onConflictDoNothing()
        ).returning({ key: imageCredits.image })
      ).length;
    }

    return stats;
  });
}

/** `ON CONFLICT DO UPDATE SET col = excluded.col` değeri. */
function excluded(column: PgColumn) {
  return sql.raw(`excluded."${column.name}"`);
}

function* chunks<T>(items: readonly T[], size: number): Generator<T[]> {
  for (let i = 0; i < items.length; i += size) yield items.slice(i, i + size);
}

/* ------------------------------- dosya okuma ------------------------------- */

function bad(file: string, path: string, message: string): never {
  throw new OperationalError(`Tohum dosyası bozuk: ${file} ${path}: ${message}`);
}

function readJson(dir: string, file: string): unknown {
  try {
    return JSON.parse(readFileSync(join(dir, file), "utf8"));
  } catch (err) {
    throw new OperationalError(`Tohum dosyası okunamadı: ${file} (${err instanceof Error ? err.message.split("\n")[0] : "bilinmeyen hata"}).`);
  }
}

/** Dosya yoksa tablo atlanır (boş dizi); varsa ayrıştırılır ve doğrulanır. */
function readSeed<T>(dir: string, file: string, parse: (file: string, json: unknown) => T[]): T[] {
  return existsSync(join(dir, file)) ? parse(file, readJson(dir, file)) : [];
}

interface GuideFile {
  countryCode: string;
  guides: Array<{ citySlug: string; reviewed: boolean; translations: Record<string, Record<string, unknown>>; completeLangs: string[] }>;
}

function readGuideFiles(dir: string): GuideFile[] {
  const guideDir = join(dir, "city-guides");
  if (!existsSync(guideDir)) return [];
  return readdirSync(guideDir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => parseGuideFile(`city-guides/${name}`, readJson(dir, `city-guides/${name}`)));
}

/* ------------------------------- doğrulama ------------------------------- */

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);

function array(file: string, json: unknown, path = "kök"): unknown[] {
  if (!Array.isArray(json)) bad(file, path, "dizi bekleniyordu");
  return json;
}
function obj(file: string, v: unknown, path: string): Obj {
  if (!isObj(v)) bad(file, path, "nesne bekleniyordu");
  return v;
}
function text(file: string, v: unknown, path: string): string {
  if (typeof v !== "string" || v === "") bad(file, path, "boş olmayan metin bekleniyordu");
  return v;
}
function textOrNull(file: string, v: unknown, path: string): string | null {
  return v === null || v === undefined ? null : text(file, v, path);
}
function int(file: string, v: unknown, path: string): number {
  if (typeof v !== "number" || !Number.isInteger(v)) bad(file, path, "tam sayı bekleniyordu");
  return v;
}
function numOrNull(file: string, v: unknown, path: string): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v !== "number" || !Number.isFinite(v)) bad(file, path, "sayı bekleniyordu");
  return v;
}
function bool(file: string, v: unknown, path: string): boolean {
  if (typeof v !== "boolean") bad(file, path, "true/false bekleniyordu");
  return v;
}
function textList(file: string, v: unknown, path: string): string[] {
  return array(file, v, path).map((item, i) => text(file, item, `${path}[${i}]`));
}
function completeLangs(file: string, v: unknown, path: string): string[] {
  const list = textList(file, v ?? [], path);
  for (const lang of list) if (!(FOREIGN_LANGS as readonly string[]).includes(lang)) bad(file, path, `geçersiz dil "${lang}" (yalnız en, es)`);
  return list;
}
/** `{ tr: {...}, en?: {...}, es?: {...} }`; Türkçe zorunlu, her dil bir nesne. */
function translations(file: string, v: unknown, path: string, requiredTr: string[]): Record<string, Obj> {
  const t = obj(file, v, path);
  const out: Record<string, Obj> = {};
  for (const [lang, body] of Object.entries(t)) {
    if (lang !== "tr" && !(FOREIGN_LANGS as readonly string[]).includes(lang)) bad(file, `${path}.${lang}`, "bilinmeyen dil");
    out[lang] = obj(file, body, `${path}.${lang}`);
  }
  if (!out.tr) bad(file, `${path}.tr`, "Türkçe çeviri zorunlu");
  for (const key of requiredTr) text(file, out.tr[key], `${path}.tr.${key}`);
  return out;
}

function parseContinents(file: string, json: unknown): Row<typeof continents>[] {
  return array(file, json).map((item, i) => {
    const p = `[${i}]`;
    const o = obj(file, item, p);
    return { slug: text(file, o.slug, `${p}.slug`), position: int(file, o.position, `${p}.position`), translations: translations(file, o.translations, `${p}.translations`, ["name"]) as never };
  });
}

function parseCountries(file: string, json: unknown): Row<typeof countries>[] {
  return array(file, json).map((item, i) => {
    const p = `[${i}]`;
    const o = obj(file, item, p);
    const code = text(file, o.code, `${p}.code`);
    if (!/^[A-Z]{2}$/.test(code)) bad(file, `${p}.code`, "ISO2 kodu bekleniyordu");
    return {
      code,
      iso3: text(file, o.iso3, `${p}.iso3`),
      continentSlug: text(file, o.continentSlug, `${p}.continentSlug`),
      subregion: textOrNull(file, o.subregion, `${p}.subregion`),
      flag: textOrNull(file, o.flag, `${p}.flag`),
      latitude: numOrNull(file, o.latitude, `${p}.latitude`),
      longitude: numOrNull(file, o.longitude, `${p}.longitude`),
      landlocked: bool(file, o.landlocked, `${p}.landlocked`),
      borders: textList(file, o.borders ?? [], `${p}.borders`),
      aliases: textList(file, o.aliases ?? [], `${p}.aliases`),
      capital: textList(file, o.capital ?? [], `${p}.capital`),
      translations: translations(file, o.translations, `${p}.translations`, ["name"]) as never,
      hasTravel: bool(file, o.hasTravel, `${p}.hasTravel`),
    };
  });
}

function parseTravel(file: string, json: unknown): Row<typeof countryTravel>[] {
  return array(file, json).map((item, i) => {
    const p = `[${i}]`;
    const o = obj(file, item, p);
    return {
      countryCode: text(file, o.countryCode, `${p}.countryCode`),
      image: textOrNull(file, o.image, `${p}.image`),
      accent: textOrNull(file, o.accent, `${p}.accent`),
      budget: textOrNull(file, o.budget, `${p}.budget`),
      iata: textOrNull(file, o.iata, `${p}.iata`),
      position: int(file, o.position, `${p}.position`),
      translations: translations(file, o.translations, `${p}.translations`, ["description"]) as never,
      completeLangs: completeLangs(file, o.completeLangs, `${p}.completeLangs`),
    };
  });
}

function parseCities(file: string, json: unknown): Row<typeof cities>[] {
  return array(file, json).map((item, i) => {
    const p = `[${i}]`;
    const o = obj(file, item, p);
    return {
      countryCode: text(file, o.countryCode, `${p}.countryCode`),
      slug: text(file, o.slug, `${p}.slug`),
      position: int(file, o.position, `${p}.position`),
      image: textOrNull(file, o.image, `${p}.image`),
      translations: translations(file, o.translations, `${p}.translations`, ["name"]) as never,
      completeLangs: completeLangs(file, o.completeLangs, `${p}.completeLangs`),
    };
  });
}

/** `http(s)://` adresi (lisans bağlantıları kaynakta bazen `http://creativecommons.org/...`; veri olduğu gibi korunur). */
function webUrl(file: string, v: unknown, path: string): string {
  const value = text(file, v, path);
  if (!/^https?:\/\/\S+$/.test(value)) bad(file, path, "http(s) adresi bekleniyordu");
  return value;
}

function parseImageCredits(file: string, json: unknown): Row<typeof imageCredits>[] {
  const seen = new Set<string>();
  return array(file, json).map((item, i) => {
    const p = `[${i}]`;
    const o = obj(file, item, p);
    const image = text(file, o.image, `${p}.image`);
    if (!isWebImagePath(image)) bad(file, `${p}.image`, "/images/<ad>.avif biçiminde web görsel yolu bekleniyordu");
    if (seen.has(image)) bad(file, `${p}.image`, `yinelenen görsel: ${image}`);
    seen.add(image);
    return {
      image,
      author: textOrNull(file, o.author, `${p}.author`),
      licenseName: textOrNull(file, o.licenseName, `${p}.licenseName`),
      licenseUrl: o.licenseUrl === null || o.licenseUrl === undefined ? null : webUrl(file, o.licenseUrl, `${p}.licenseUrl`),
      sourceUrl: webUrl(file, o.sourceUrl, `${p}.sourceUrl`),
      attributionRequired: bool(file, o.attributionRequired, `${p}.attributionRequired`),
    };
  });
}

function parseGuideFile(file: string, json: unknown): GuideFile {
  const o = obj(file, json, "kök");
  const countryCode = text(file, o.countryCode, "countryCode");
  return {
    countryCode,
    guides: array(file, o.guides, "guides").map((item, i) => {
      const p = `guides[${i}]`;
      const g = obj(file, item, p);
      return {
        citySlug: text(file, g.citySlug, `${p}.citySlug`),
        reviewed: bool(file, g.reviewed, `${p}.reviewed`),
        translations: translations(file, g.translations, `${p}.translations`, ["h1"]),
        completeLangs: completeLangs(file, g.completeLangs, `${p}.completeLangs`),
      };
    }),
  };
}

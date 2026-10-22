import { Inject, Injectable } from "@nestjs/common";
import { and, asc, eq, ne, type SQL, sql } from "drizzle-orm";
import { AppException, isUniqueViolation } from "../common/errors.js";
import type { Lang } from "../common/lang.js";
import { type Page, pageWindow, toPage } from "../common/pagination.js";
import { APP_CONFIG } from "../config/config.module.js";
import type { AppConfig } from "../config/env.js";
import { DATABASE, type Database } from "../db/client.js";
import { cities, cityGuides, countries, countryTravel } from "../db/schema/index.js";
import { flagUrl } from "./assets.js";
import { buildCityLinks, mapCitySummary, mapGuide } from "./content.mapper.js";
import {
  assertRequired,
  mergeTranslations,
  renameCityInGuide,
  renameCityInTravel,
  REQUIRED_CITY_FIELDS,
  REQUIRED_GUIDE_FIELDS,
  resolveCompleteLangs,
  stripGuideDerived,
  toPlain,
} from "./content.merge.js";
import { FOREIGN_LANGS } from "./content.constants.js";
import { jsonAt, localizedObject } from "./content.sql.js";
import type { CityRow, CityTexts, CountryTexts, GuideBody, GuideRow } from "./content.types.js";
import type { CityCountryDto, CityDetailDto, CityGuidePatchDto, CitySummaryDto, CreateCityDto, UpdateCityDto } from "./dto/city.dto.js";
import type { ListCitiesQueryDto } from "./dto/queries.dto.js";
import { foldContains } from "./search.js";
import { MAX_SLUG_LENGTH, SLUG_PATTERN, slugify } from "./slug.js";
import { pickTranslation } from "./translations.js";

const countryNotFound = (): AppException => AppException.notFound("Ülke bulunamadı.");
const cityNotFound = (): AppException => AppException.notFound("Şehir bulunamadı.");

/** Bir ya da birkaç dilde yazılan metinleri düz nesneye çevirir (sınıf örneği değil). */
type Stored<T> = Record<string, T>;

@Injectable()
export class CitiesService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  /* ------------------------------- okuma ------------------------------- */

  /** Ülkenin şehir özetleri (sıralı, sayfasız). Ülke ayrıntısı kullanır. */
  async summaries(countryCode: string, lang: Lang): Promise<{ rows: CityRow[]; items: CitySummaryDto[] }> {
    const rows = await this.rowsOf(countryCode, lang);
    return { rows, items: rows.map((row) => mapCitySummary(row, lang, this.config.assetsBaseUrl)) };
  }

  async list(countryCode: string, query: ListCitiesQueryDto): Promise<Page<CitySummaryDto>> {
    await this.requireCountry(countryCode);
    const conditions: SQL[] = [eq(cities.countryCode, countryCode)];
    if (query.q) {
      const haystack = sql`concat_ws(' ', ${jsonAt(cities.translations, "tr", "name")}, ${jsonAt(cities.translations, "en", "name")}, ${jsonAt(cities.translations, "es", "name")}, ${cities.slug})`;
      const match = foldContains(haystack, query.q);
      if (match) conditions.push(match);
    }
    const where = and(...conditions);
    const { limit, offset } = pageWindow(query);
    const [rows, [count]] = await Promise.all([
      this.select(query.lang).where(where).orderBy(asc(cities.position), asc(cities.slug)).limit(limit).offset(offset),
      this.db.select({ total: sql<number>`count(*)::int` }).from(cities).where(where),
    ]);
    return toPage(
      (rows as CityRow[]).map((row) => mapCitySummary(row, query.lang, this.config.assetsBaseUrl)),
      count?.total ?? 0,
      query,
    );
  }

  /** Şehir kartı + rehber (varsa). Ülke ya da şehir yoksa 404. */
  async get(countryCode: string, slug: string, lang: Lang): Promise<CityDetailDto> {
    const country = await this.countryHeader(countryCode, lang);
    const [row] = await this.select(lang)
      .where(and(eq(cities.countryCode, countryCode), eq(cities.slug, slug)))
      .limit(1);
    if (!row) throw cityNotFound();
    const city = row as CityRow;

    const [guide] = await this.db
      .select({
        reviewed: cityGuides.reviewed,
        completeLangs: cityGuides.completeLangs,
        tr: sql<GuideBody>`${jsonAt(cityGuides.translations, "tr")}`,
        loc: sql<GuideBody | null>`${localizedObject(cityGuides.translations, lang)}`,
      })
      .from(cityGuides)
      .where(eq(cityGuides.cityId, city.id))
      .limit(1);
    // `relatedGuides` ve ülke hub'ı için aynı ülkedeki kardeş şehirler (slug ve görünen ad).
    const links = buildCityLinks(await this.rowsOf(countryCode, lang), lang);

    return {
      ...mapCitySummary(city, lang, this.config.assetsBaseUrl),
      country,
      guide: guide ? mapGuide(guide as GuideRow, lang, links) : null,
    };
  }

  /* ------------------------------- yazma (yönetici) ------------------------------- */

  async create(countryCode: string, dto: CreateCityDto, lang: Lang): Promise<CityDetailDto> {
    const slug = dto.slug ?? slugify(dto.translations.tr.name);
    if (slug.length === 0 || slug.length > MAX_SLUG_LENGTH || !SLUG_PATTERN.test(slug)) {
      throw AppException.validation([{ field: "slug", code: "isSlug", message: "Addan geçerli bir adres üretilemedi; küçük harf, rakam ve tireden oluşan bir `slug` verin." }]);
    }

    await this.db.transaction(async (tx) => {
      // Ülke satırı kilidi: ad denetimi ile ekleme arasına başka bir ekleme/yeniden adlandırma giremez.
      await this.requireCountry(countryCode, tx, true);

      const slugTaken = AppException.conflict("Bu ülkede aynı adreste (slug) bir şehir zaten var.", "SLUG_TAKEN");
      const [sameSlug] = await tx.select({ id: cities.id }).from(cities).where(and(eq(cities.countryCode, countryCode), eq(cities.slug, slug))).limit(1);
      if (sameSlug) throw slugTaken;
      const translations: Stored<CityTexts> = { tr: toPlain(dto.translations.tr) };
      await this.assertNameFree(tx, countryCode, translations.tr!.name);
      for (const foreign of ["en", "es"] as const) if (dto.translations[foreign]) translations[foreign] = toPlain(dto.translations[foreign]);
      // Gövdede ad+açıklama zorunlu olduğundan gönderilen her yabancı dil tamdır; `completeLangs` ile daraltılabilir.
      const completeLangs = resolveCompleteLangs(dto.completeLangs ?? FOREIGN_LANGS.filter((l) => translations[l] !== undefined), [], translations);

      const position = dto.position ?? (await nextPosition(tx, countryCode));
      let id: string;
      try {
        const [inserted] = await tx
          .insert(cities)
          .values({ countryCode, slug, position, image: dto.image ?? null, translations: translations as never, completeLangs })
          .returning({ id: cities.id });
        id = inserted!.id;
      } catch (err) {
        if (isUniqueViolation(err, "cities_country_slug_unique")) throw slugTaken;
        throw err;
      }
      if (dto.guide) await this.applyGuide(tx, id, dto.guide);
    });
    return this.get(countryCode, slug, lang);
  }

  async update(countryCode: string, slug: string, dto: UpdateCityDto, lang: Lang): Promise<CityDetailDto> {
    await this.db.transaction(async (tx) => {
      await this.requireCountry(countryCode, tx, true);
      const [city] = await tx
        .select()
        .from(cities)
        .where(and(eq(cities.countryCode, countryCode), eq(cities.slug, slug)))
        .for("update");
      if (!city) throw cityNotFound();

      const patch: Partial<typeof cities.$inferInsert> = {};
      if (dto.position !== undefined) patch.position = dto.position;
      if (dto.image !== undefined) patch.image = dto.image;
      if (dto.translations !== undefined || dto.completeLangs !== undefined) {
        const merged = mergeTranslations(city.translations as Stored<CityTexts>, dto.translations as never);
        const completeLangs = resolveCompleteLangs(dto.completeLangs, city.completeLangs, merged);
        // Türkçe ve tam sayılan her dilde ad+açıklama, diğer mevcut dillerde en az ad bulunmalı.
        assertRequired("translations", merged, [...new Set(["tr", ...completeLangs])], REQUIRED_CITY_FIELDS);
        assertRequired("translations", merged, Object.keys(merged), ["name"]);
        // Türkçe ad bağlantı anahtarıdır (hub rotaları, ilgili rehberler): benzersiz kalır, değişince başvurular taşınır.
        const from = (city.translations as Stored<CityTexts>).tr?.name;
        const to = merged.tr!.name;
        if (from !== undefined && from !== to) {
          await this.assertNameFree(tx, countryCode, to, city.id);
          await this.renameReferences(tx, countryCode, from, to);
        }
        patch.translations = merged as never;
        patch.completeLangs = completeLangs;
      }
      if (Object.keys(patch).length > 0) await tx.update(cities).set(patch).where(eq(cities.id, city.id));
      if (dto.guide) await this.applyGuide(tx, city.id, dto.guide);
    });
    return this.get(countryCode, slug, lang);
  }

  /** Şehri siler; rehberi yabancı anahtar `ON DELETE CASCADE` ile birlikte gider. */
  async remove(countryCode: string, slug: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      await this.requireCountry(countryCode, tx);
      const deleted = await tx
        .delete(cities)
        .where(and(eq(cities.countryCode, countryCode), eq(cities.slug, slug)))
        .returning({ id: cities.id });
      if (deleted.length === 0) throw cityNotFound();
    });
  }

  /**
   * Türkçe şehir adı ülkede benzersizdir: rota ve ilgili rehber başvuruları şehre bu adla bağlanır, aynı adlı ikinci şehir
   * mevcut bağlantıyı çalardı.
   */
  private async assertNameFree(tx: Database, countryCode: string, name: string, exceptCityId?: string): Promise<void> {
    const conditions = [eq(cities.countryCode, countryCode), sql`${jsonAt(cities.translations, "tr", "name")} = ${name}`];
    if (exceptCityId !== undefined) conditions.push(ne(cities.id, exceptCityId));
    const [taken] = await tx.select({ slug: cities.slug }).from(cities).where(and(...conditions)).limit(1);
    if (taken) throw AppException.conflict("Bu ülkede aynı Türkçe ada sahip bir şehir zaten var.", "CITY_NAME_TAKEN");
  }

  /** Ülkenin hub rotalarındaki ve rehberlerindeki `from` başvurularını `to` yapar (tüm dillerde). */
  private async renameReferences(tx: Database, countryCode: string, from: string, to: string): Promise<void> {
    const [travel] = await tx.select({ translations: countryTravel.translations }).from(countryTravel).where(eq(countryTravel.countryCode, countryCode)).for("update");
    const nextTravel = travel ? renameCityInTravel(travel.translations as never, from, to) : null;
    if (nextTravel) await tx.update(countryTravel).set({ translations: nextTravel as never }).where(eq(countryTravel.countryCode, countryCode));

    // Sabit sırayla kilitlenir; eşzamanlı rehber yazmaları (applyGuide) bu satırları da `for update` ile okur.
    const guides = await tx
      .select({ cityId: cityGuides.cityId, translations: cityGuides.translations })
      .from(cityGuides)
      .innerJoin(cities, eq(cities.id, cityGuides.cityId))
      .where(eq(cities.countryCode, countryCode))
      .orderBy(asc(cityGuides.cityId))
      .for("update", { of: cityGuides });
    for (const guide of guides) {
      const next = renameCityInGuide(guide.translations as never, from, to);
      if (next) await tx.update(cityGuides).set({ translations: next as never }).where(eq(cityGuides.cityId, guide.cityId));
    }
  }

  /** Rehberi oluşturur ya da dil başına birleştirerek günceller. */
  private async applyGuide(tx: Database, cityId: string, patch: CityGuidePatchDto): Promise<void> {
    const [existing] = await tx.select().from(cityGuides).where(eq(cityGuides.cityId, cityId)).for("update");
    const incoming = patch.translations
      ? (Object.fromEntries(
          Object.entries(toPlain(patch.translations)).map(([lang, body]) => [lang, body === null ? null : stripGuideDerived(body as { relatedGuides?: Array<Record<string, unknown>> })]),
        ) as never)
      : undefined;
    const merged = mergeTranslations((existing?.translations ?? {}) as Stored<Record<string, unknown>>, incoming);
    if (merged.tr === undefined) {
      throw AppException.validation([{ field: "guide.translations.tr", code: "missingTranslation", message: "Rehber oluşturmak için Türkçe gövde gerekli." }]);
    }
    const completeLangs = resolveCompleteLangs(patch.completeLangs, existing?.completeLangs ?? [], merged, "guide.completeLangs");
    assertRequired("guide.translations", merged, [...new Set(["tr", ...completeLangs])], REQUIRED_GUIDE_FIELDS);

    if (existing) {
      await tx
        .update(cityGuides)
        .set({ translations: merged as never, completeLangs, ...(patch.reviewed !== undefined ? { reviewed: patch.reviewed } : {}) })
        .where(eq(cityGuides.cityId, cityId));
    } else {
      await tx.insert(cityGuides).values({ cityId, translations: merged as never, completeLangs, reviewed: patch.reviewed ?? false });
    }
  }

  /* ------------------------------- yardımcılar ------------------------------- */

  /** Büyük jsonb yüklenmez: yalnız `tr` ve istenen dilin ad/açıklama nesneleri. */
  private select(lang: Lang) {
    return this.db
      .select({
        id: cities.id,
        countryCode: cities.countryCode,
        slug: cities.slug,
        position: cities.position,
        image: cities.image,
        completeLangs: cities.completeLangs,
        hasGuide: sql<boolean>`exists(select 1 from city_guides g where g.city_id = "cities"."id")`,
        tr: sql<CityTexts>`${jsonAt(cities.translations, "tr")}`,
        loc: sql<CityTexts | null>`${localizedObject(cities.translations, lang)}`,
      })
      .from(cities);
  }

  private async rowsOf(countryCode: string, lang: Lang): Promise<CityRow[]> {
    return (await this.select(lang).where(eq(cities.countryCode, countryCode)).orderBy(asc(cities.position), asc(cities.slug))) as CityRow[];
  }

  /** `lock`: işlem boyunca ülke satırını kilitler (`FOR NO KEY UPDATE`; şehir eklerken yabancı anahtar denetimini engellemez). */
  private async requireCountry(code: string, db: Database = this.db, lock = false): Promise<void> {
    const query = db.select({ code: countries.code }).from(countries).where(eq(countries.code, code)).limit(1);
    const [row] = await (lock ? query.for("no key update") : query);
    if (!row) throw countryNotFound();
  }

  /** Şehir ayrıntısındaki ülke başlığı (kod, ad, bayrak). */
  private async countryHeader(code: string, lang: Lang): Promise<CityCountryDto> {
    const [row] = await this.db
      .select({
        code: countries.code,
        flag: countries.flag,
        tr: sql<CountryTexts>`${jsonAt(countries.translations, "tr")}`,
        loc: sql<CountryTexts | null>`${localizedObject(countries.translations, lang)}`,
      })
      .from(countries)
      .where(eq(countries.code, code))
      .limit(1);
    if (!row) throw countryNotFound();
    return {
      code: row.code,
      name: pickTranslation(row.tr as CountryTexts, row.loc as CountryTexts | null, undefined, lang).value.name,
      flag: row.flag,
      flagUrl: flagUrl(this.config.assetsBaseUrl, row.code),
    };
  }
}

async function nextPosition(tx: Database, countryCode: string): Promise<number> {
  const [row] = await tx.select({ next: sql<number>`coalesce(max(${cities.position}), -1) + 1` }).from(cities).where(eq(cities.countryCode, countryCode));
  return Number(row?.next ?? 0);
}


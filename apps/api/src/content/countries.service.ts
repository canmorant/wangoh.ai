import { Inject, Injectable } from "@nestjs/common";
import { and, asc, eq, type SQL, sql } from "drizzle-orm";
import { AppException } from "../common/errors.js";
import type { Lang } from "../common/lang.js";
import { type Page, pageWindow, toPage } from "../common/pagination.js";
import { APP_CONFIG } from "../config/config.module.js";
import type { AppConfig } from "../config/env.js";
import { DATABASE, type Database } from "../db/client.js";
import { countries, countryTravel } from "../db/schema/index.js";
import { CitiesService } from "./cities.service.js";
import { buildCityLinks, mapCountrySummary, mapTravel } from "./content.mapper.js";
import { assertRequired, mergeTranslations, REQUIRED_COUNTRY_FIELDS, REQUIRED_TRAVEL_FIELDS, requiredHub, resolveCompleteLangs, stripHubDerived, toPlain } from "./content.merge.js";
import { jsonAt, localizedObject } from "./content.sql.js";
import type { CountryRow, CountryTexts, TravelRow, TravelTexts } from "./content.types.js";
import type { CountryDetailDto, CountrySummaryDto, UpdateCountryDto } from "./dto/country.dto.js";
import type { ListCountriesQueryDto } from "./dto/queries.dto.js";
import { foldContains, foldSql } from "./search.js";

const countryNotFound = (): AppException => AppException.notFound("Ülke bulunamadı.");

@Injectable()
export class CountriesService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly cities: CitiesService,
  ) {}

  /**
   * Sayfalı ülke listesi. Sıra: `hasTravel=true` ise destinasyon sırası (`country_travel.position`), değilse istenen
   * dildeki ada göre (katlanmış: ç→c, ş→s, i/ı/İ/I→i; Türkçe harf sırası değil ama kararlı ve sürücüden bağımsız).
   * Büyük jsonb yüklenmez: yalnız ad nesneleri; seyahat metinleri listeye girmez.
   */
  async list(query: ListCountriesQueryDto): Promise<Page<CountrySummaryDto>> {
    const { lang } = query;
    const conditions: SQL[] = [];
    if (query.continent) conditions.push(eq(countries.continentSlug, query.continent));
    if (query.hasTravel !== undefined) conditions.push(eq(countries.hasTravel, query.hasTravel));
    if (query.q) {
      const names = (key: string) => (["tr", "en", "es"] as const).map((l) => jsonAt(countries.translations, l, key));
      const haystack = sql`concat_ws(' ', ${sql.join([...names("name"), ...names("officialName")], sql`, `)}, array_to_string(${countries.capital}, ' '))`;
      const match = foldContains(haystack, query.q);
      if (match) conditions.push(match);
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const { limit, offset } = pageWindow(query);

    const byName = foldSql(sql`coalesce(${jsonAt(countries.translations, lang, "name")}, ${jsonAt(countries.translations, "tr", "name")})`);
    const order = query.hasTravel === true ? [asc(countryTravel.position), asc(countries.code)] : [asc(byName), asc(countries.code)];

    const [rows, [count]] = await Promise.all([
      this.selectCountries(lang).where(where).orderBy(...order).limit(limit).offset(offset),
      this.db.select({ total: sql<number>`count(*)::int` }).from(countries).where(where),
    ]);
    return toPage(
      (rows as CountryRow[]).map((row) => mapCountrySummary(row, lang, this.config.assetsBaseUrl)),
      count?.total ?? 0,
      query,
    );
  }

  /** Ülke + varsa seyahat bilgisi + şehir özetleri. */
  async get(code: string, lang: Lang): Promise<CountryDetailDto> {
    const [row] = await this.selectCountries(lang).where(eq(countries.code, code)).limit(1);
    if (!row) throw countryNotFound();
    const country = row as CountryRow;

    const [borders] = await this.db.select({ borders: countries.borders }).from(countries).where(eq(countries.code, code)).limit(1);
    const [travel] = await this.db
      .select({
        image: countryTravel.image,
        accent: countryTravel.accent,
        budget: countryTravel.budget,
        iata: countryTravel.iata,
        position: countryTravel.position,
        completeLangs: countryTravel.completeLangs,
        tr: sql<TravelTexts>`${jsonAt(countryTravel.translations, "tr")}`,
        loc: sql<TravelTexts | null>`${localizedObject(countryTravel.translations, lang)}`,
      })
      .from(countryTravel)
      .where(eq(countryTravel.countryCode, code))
      .limit(1);
    const { rows: cityRows, items } = await this.cities.summaries(code, lang);

    return {
      ...mapCountrySummary(country, lang, this.config.assetsBaseUrl),
      borders: borders?.borders ?? [],
      travel: travel ? mapTravel(travel as TravelRow, lang, this.config.assetsBaseUrl, buildCityLinks(cityRows, lang)) : null,
      cities: items,
    };
  }

  /** Yönetici: ad/resmî ad/alt bölge çevirileri ve seyahat bilgisi, dil başına birleştirilerek güncellenir. */
  async update(code: string, dto: UpdateCountryDto, lang: Lang): Promise<CountryDetailDto> {
    await this.db.transaction(async (tx) => {
      const [country] = await tx.select({ translations: countries.translations }).from(countries).where(eq(countries.code, code)).for("update");
      if (!country) throw countryNotFound();

      if (dto.translations !== undefined) {
        const merged = mergeTranslations(country.translations as Record<string, CountryTexts>, dto.translations as never);
        assertRequired("translations", merged, Object.keys(merged), REQUIRED_COUNTRY_FIELDS);
        await tx.update(countries).set({ translations: merged as never }).where(eq(countries.code, code));
      }

      if (dto.travel !== undefined) {
        const [travel] = await tx.select().from(countryTravel).where(eq(countryTravel.countryCode, code)).for("update");
        if (!travel) throw AppException.notFound("Bu ülke için seyahat bilgisi tanımlı değil.");
        const t = dto.travel;

        const patch: Partial<typeof countryTravel.$inferInsert> = {};
        if (t.image !== undefined) patch.image = t.image;
        if (t.accent !== undefined) patch.accent = t.accent;
        if (t.budget !== undefined) patch.budget = t.budget;
        if (t.iata !== undefined) patch.iata = t.iata;

        if (t.translations !== undefined || t.completeLangs !== undefined) {
          const incoming = t.translations ? toPlain(t.translations) : undefined;
          for (const body of Object.values(incoming ?? {})) {
            const texts = body as TravelTexts | null;
            if (texts?.hub) texts.hub = stripHubDerived(texts.hub as never);
          }
          const merged = mergeTranslations(travel.translations as Record<string, TravelTexts>, incoming as never);
          const completeLangs = resolveCompleteLangs(t.completeLangs, travel.completeLangs, merged, "travel.completeLangs");
          assertRequired("travel.translations", merged, [...new Set(["tr", ...completeLangs])], REQUIRED_TRAVEL_FIELDS, requiredHub(merged.tr));
          patch.translations = merged as never;
          patch.completeLangs = completeLangs;
        }
        if (Object.keys(patch).length > 0) await tx.update(countryTravel).set(patch).where(eq(countryTravel.countryCode, code));
      }
    });
    return this.get(code, lang);
  }

  private selectCountries(lang: Lang) {
    return this.db
      .select({
        code: countries.code,
        iso3: countries.iso3,
        continentSlug: countries.continentSlug,
        flag: countries.flag,
        latitude: countries.latitude,
        longitude: countries.longitude,
        landlocked: countries.landlocked,
        capital: countries.capital,
        hasTravel: countries.hasTravel,
        image: countryTravel.image,
        tr: sql<CountryTexts>`${jsonAt(countries.translations, "tr")}`,
        loc: sql<CountryTexts | null>`${localizedObject(countries.translations, lang)}`,
      })
      .from(countries)
      .leftJoin(countryTravel, eq(countryTravel.countryCode, countries.code));
  }
}

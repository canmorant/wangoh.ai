import { Inject, Injectable } from "@nestjs/common";
import { asc, eq, sql } from "drizzle-orm";
import { AppException } from "../common/errors.js";
import type { Lang } from "../common/lang.js";
import { DATABASE, type Database } from "../db/client.js";
import { continents } from "../db/schema/index.js";
import { jsonAt, localizedObject } from "./content.sql.js";
import type { ContinentDto } from "./dto/continent.dto.js";
import { pickTranslation } from "./translations.js";

interface ContinentRow {
  slug: string;
  position: number;
  tr: { name: string };
  loc: { name: string } | null;
  countryCount: number;
  travelCountryCount: number;
}

@Injectable()
export class ContinentsService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async list(lang: Lang): Promise<ContinentDto[]> {
    return (await this.select(lang).orderBy(asc(continents.position), asc(continents.slug))).map((row) => toDto(row as ContinentRow, lang));
  }

  async get(slug: string, lang: Lang): Promise<ContinentDto> {
    const [row] = await this.select(lang).where(eq(continents.slug, slug)).limit(1);
    if (!row) throw AppException.notFound("Kıta bulunamadı.");
    return toDto(row as ContinentRow, lang);
  }

  private select(lang: Lang) {
    return this.db
      .select({
        slug: continents.slug,
        position: continents.position,
        tr: sql<{ name: string }>`${jsonAt(continents.translations, "tr")}`,
        loc: sql<{ name: string } | null>`${localizedObject(continents.translations, lang)}`,
        countryCount: sql<number>`(select count(*)::int from countries c where c.continent_slug = "continents"."slug")`,
        travelCountryCount: sql<number>`(select count(*)::int from countries c where c.continent_slug = "continents"."slug" and c.has_travel)`,
      })
      .from(continents);
  }
}

function toDto(row: ContinentRow, lang: Lang): ContinentDto {
  const resolved = pickTranslation(row.tr, row.loc, undefined, lang);
  return {
    slug: row.slug as ContinentDto["slug"],
    position: row.position,
    name: resolved.value.name,
    lang: resolved.lang,
    complete: resolved.complete,
    countryCount: row.countryCount,
    travelCountryCount: row.travelCountryCount,
  };
}

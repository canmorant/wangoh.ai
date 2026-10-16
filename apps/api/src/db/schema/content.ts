import { boolean, doublePrecision, index, integer, jsonb, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import type { LooseTranslation, Translations } from "./types.js";

/** Kıtalar: `africa|americas|asia|europe|oceania`. */
export const continents = pgTable("continents", {
  slug: text("slug").primaryKey(),
  position: integer("position").notNull().default(0),
  /** `{ tr: { name }, en?: { name }, es?: { name } }` */
  translations: jsonb("translations").$type<Translations<{ name: string } & LooseTranslation>>().notNull(),
});

/** Tüm dünya ülkeleri (ISO 3166-1 alpha-2 anahtarlı). */
export const countries = pgTable(
  "countries",
  {
    code: text("code").primaryKey(),
    iso3: text("iso3").notNull().unique(),
    continentSlug: text("continent_slug")
      .notNull()
      .references(() => continents.slug),
    subregion: text("subregion"),
    /** Emoji bayrak. Bayrak görseli adresi (`flagUrl`) API'de `ASSETS_BASE_URL` ile türetilir. */
    flag: text("flag"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    landlocked: boolean("landlocked").notNull().default(false),
    /** Komşu ülkelerin ISO3 kodları. */
    borders: text("borders").array().notNull().default([]),
    /** Kabul edilen yazımlar (oyun doğrulaması). */
    aliases: text("aliases").array().notNull().default([]),
    /** Kaynak biçimiyle başkent(ler). */
    capital: text("capital").array().notNull().default([]),
    /** `{ tr: { name, officialName? }, en?: ..., es?: ... }` */
    translations: jsonb("translations").$type<Translations<{ name: string; officialName?: string } & LooseTranslation>>().notNull(),
    hasTravel: boolean("has_travel").notNull().default(false),
  },
  (t) => [index("countries_continent_idx").on(t.continentSlug), index("countries_has_travel_idx").on(t.hasTravel)],
);

/** Öne çıkan (seyahat içeriği olan) ülkelerin ek bilgileri. */
export const countryTravel = pgTable("country_travel", {
  countryCode: text("country_code")
    .primaryKey()
    .references(() => countries.code, { onDelete: "cascade" }),
  image: text("image"),
  accent: text("accent"),
  budget: text("budget"),
  iata: text("iata"),
  position: integer("position").notNull().default(0),
  /** `description`, `signature`, `gateway`, `capital`, `bestSeason`, `flightTime`, `hub` (ülke sayfası içeriği). */
  translations: jsonb("translations").$type<Translations<LooseTranslation>>().notNull(),
  completeLangs: text("complete_langs").array().notNull().default([]),
});

export const cities = pgTable(
  "cities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    countryCode: text("country_code")
      .notNull()
      .references(() => countries.code, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    position: integer("position").notNull().default(0),
    image: text("image"),
    /** `{ tr: { name, description }, en?: ..., es?: ... }` */
    translations: jsonb("translations").$type<Translations<{ name: string; description?: string } & LooseTranslation>>().notNull(),
    completeLangs: text("complete_langs").array().notNull().default([]),
  },
  (t) => [unique("cities_country_slug_unique").on(t.countryCode, t.slug), index("cities_country_idx").on(t.countryCode)],
);

/** Şehir rehberi gövdesi (isteğe bağlı `dietary` dahil). */
export const cityGuides = pgTable("city_guides", {
  cityId: uuid("city_id")
    .primaryKey()
    .references(() => cities.id, { onDelete: "cascade" }),
  translations: jsonb("translations").$type<Translations<LooseTranslation>>().notNull(),
  completeLangs: text("complete_langs").array().notNull().default([]),
  reviewed: boolean("reviewed").notNull().default(false),
});

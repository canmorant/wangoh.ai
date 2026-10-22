import type { Lang } from "../common/lang.js";

/** Kıta slug'ları (sözleşme: `continents.slug`). */
export const CONTINENT_SLUGS = ["africa", "americas", "asia", "europe", "oceania"] as const;
export type ContinentSlug = (typeof CONTINENT_SLUGS)[number];

/** Türkçe dışındaki diller: yalnız tam çevrildiklerinde tohumda/`complete_langs`ta bulunurlar. */
export const FOREIGN_LANGS = ["en", "es"] as const satisfies readonly Lang[];
export type ForeignLang = (typeof FOREIGN_LANGS)[number];

/** Seyahat bütçesi (web `TravelData.budget` anahtarları). */
export const BUDGETS = ["budget", "moderate", "high"] as const;
export type Budget = (typeof BUDGETS)[number];

/** Genel okuma uçlarının önbellek süresi (saniye). */
export const PUBLIC_CACHE_SECONDS = 300;

/** Arama teriminin en büyük uzunluğu. */
export const MAX_QUERY_LENGTH = 100;

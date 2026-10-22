import type { Lang } from "../common/lang.js";
import { flagUrl, imageUrl } from "./assets.js";
import { BUDGETS, type Budget, type ContinentSlug } from "./content.constants.js";
import type { CityRow, CountryRow, GuideBody, GuideRow, TravelRow } from "./content.types.js";
import type { CitySummaryDto } from "./dto/city.dto.js";
import type { CountryHubDto, CountrySummaryDto, CountryTravelDto } from "./dto/country.dto.js";
import type { CityGuideDto } from "./dto/guide.dto.js";
import { pickTranslation } from "./translations.js";

/** Türkçe şehir adı (rehber/hub içindeki anahtar) → slug ve istenen dildeki görünen ad. */
export type CityLinkIndex = ReadonlyMap<string, { slug: string; name: string }>;

export function buildCityLinks(rows: readonly CityRow[], lang: Lang): CityLinkIndex {
  const index = new Map<string, { slug: string; name: string }>();
  for (const row of rows) index.set(row.tr.name, { slug: row.slug, name: pickTranslation(row.tr, row.loc, row.completeLangs, lang).value.name });
  return index;
}

export function mapCountrySummary(row: CountryRow, lang: Lang, assetsBase: string): CountrySummaryDto {
  const resolved = pickTranslation(row.tr, row.loc, undefined, lang);
  return {
    code: row.code,
    iso3: row.iso3,
    continent: row.continentSlug as ContinentSlug,
    subregion: resolved.value.subregion ?? null,
    flag: row.flag,
    flagUrl: flagUrl(assetsBase, row.code),
    latitude: row.latitude,
    longitude: row.longitude,
    landlocked: row.landlocked,
    capital: row.capital,
    hasTravel: row.hasTravel,
    imageUrl: imageUrl(assetsBase, row.image),
    name: resolved.value.name,
    officialName: resolved.value.officialName ?? null,
    lang: resolved.lang,
    complete: resolved.complete,
  };
}

/** Hub'ı bilinen alanlarıyla yeniden kurar ve rota şehirlerine slug/görünen ad ekler. */
export function mapHub(hub: CountryHubDto, links: CityLinkIndex): CountryHubDto {
  return {
    seoTitle: hub.seoTitle,
    seoDescription: hub.seoDescription,
    planningHeading: hub.planningHeading,
    ...(hub.essentialsHeading !== undefined ? { essentialsHeading: hub.essentialsHeading } : {}),
    ...(hub.citiesHeading !== undefined ? { citiesHeading: hub.citiesHeading } : {}),
    cityGridIntro: hub.cityGridIntro,
    intro: hub.intro,
    ...(hub.essentials !== undefined ? { essentials: hub.essentials } : {}),
    routeIdeas: hub.routeIdeas.map((route) => ({
      title: route.title,
      duration: route.duration,
      cities: route.cities,
      description: route.description,
      cityLinks: route.cities.flatMap((city) => {
        const link = links.get(city);
        return link ? [link] : [];
      }),
    })),
  };
}

export function mapTravel(row: TravelRow, lang: Lang, assetsBase: string, links: CityLinkIndex): CountryTravelDto {
  const resolved = pickTranslation(row.tr, row.loc, row.completeLangs, lang);
  const t = resolved.value;
  return {
    lang: resolved.lang,
    complete: resolved.complete,
    position: row.position,
    imageUrl: imageUrl(assetsBase, row.image),
    accent: row.accent,
    budget: (BUDGETS as readonly string[]).includes(row.budget ?? "") ? (row.budget as Budget) : null,
    budgetLabel: t.budget ?? null,
    iata: row.iata,
    description: t.description ?? null,
    signature: t.signature ?? null,
    gateway: t.gateway ?? null,
    capital: t.capital ?? null,
    bestSeason: t.bestSeason ?? null,
    flightTime: t.flightTime ?? null,
    hub: t.hub ? mapHub(t.hub, links) : null,
  };
}

export function mapCitySummary(row: CityRow, lang: Lang, assetsBase: string): CitySummaryDto {
  const resolved = pickTranslation(row.tr, row.loc, row.completeLangs, lang);
  return {
    slug: row.slug,
    countryCode: row.countryCode,
    position: row.position,
    name: resolved.value.name,
    description: resolved.value.description ?? null,
    imageUrl: imageUrl(assetsBase, row.image),
    hasGuide: row.hasGuide,
    lang: resolved.lang,
    complete: resolved.complete,
  };
}

/** Rehber gövdesindeki yanıt alanları (başka alan sızmaz). */
const GUIDE_FIELDS = [
  "seoTitle", "seoDescription", "h1", "lede", "quickFacts", "sections", "places", "placesKind", "itinerary", "practicalHeading",
  "practicalTips", "faqs", "relatedGuides", "sources", "volatileNote", "reviewedAt", "countryInfoOnHub", "dietary",
] as const satisfies ReadonlyArray<keyof GuideBody>;

export function mapGuide(row: GuideRow, lang: Lang, links: CityLinkIndex): CityGuideDto {
  const resolved = pickTranslation(row.tr, row.loc, row.completeLangs, lang);
  const body = resolved.value as unknown as Record<string, unknown>;
  const picked: Record<string, unknown> = {};
  for (const field of GUIDE_FIELDS) if (body[field] !== undefined) picked[field] = body[field];
  const related = (body.relatedGuides ?? undefined) as GuideBody["relatedGuides"];
  if (related) picked.relatedGuides = related.map((item) => ({ city: item.city, anchor: item.anchor, description: item.description, slug: links.get(item.city)?.slug ?? null }));
  return { lang: resolved.lang, complete: resolved.complete, reviewed: row.reviewed, ...picked } as CityGuideDto;
}

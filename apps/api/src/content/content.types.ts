import type { CityGuideDto } from "./dto/guide.dto.js";
import type { CountryHubDto } from "./dto/country.dto.js";

/** `countries.translations[<dil>]` */
export interface CountryTexts {
  name: string;
  officialName?: string;
  subregion?: string;
}

/** `country_travel.translations[<dil>]` */
export interface TravelTexts {
  description?: string;
  signature?: string;
  gateway?: string;
  capital?: string;
  bestSeason?: string;
  flightTime?: string;
  /** Bütçe düzeyinin görünen adı. */
  budget?: string;
  hub?: CountryHubDto;
}

/** `cities.translations[<dil>]` */
export interface CityTexts {
  name: string;
  description?: string;
}

/** `city_guides.translations[<dil>]`: rehber gövdesi (yanıttaki alanlar; `lang`/`complete`/`reviewed` hariç). */
export type GuideBody = Omit<CityGuideDto, "lang" | "complete" | "reviewed">;

/** Liste/ayrıntı sorgularının ham satırları (büyük jsonb yok: yalnız `tr` ve istenen dil nesneleri). */
export interface CountryRow {
  code: string;
  iso3: string;
  continentSlug: string;
  flag: string | null;
  latitude: number | null;
  longitude: number | null;
  landlocked: boolean;
  capital: string[];
  hasTravel: boolean;
  /** `country_travel.image` (yoksa null). */
  image: string | null;
  tr: CountryTexts;
  loc: CountryTexts | null;
}

export interface TravelRow {
  image: string | null;
  accent: string | null;
  budget: string | null;
  iata: string | null;
  position: number;
  completeLangs: string[];
  tr: TravelTexts;
  loc: TravelTexts | null;
}

export interface CityRow {
  id: string;
  countryCode: string;
  slug: string;
  position: number;
  image: string | null;
  completeLangs: string[];
  hasGuide: boolean;
  tr: CityTexts;
  loc: CityTexts | null;
}

export interface GuideRow {
  reviewed: boolean;
  completeLangs: string[];
  tr: GuideBody;
  loc: GuideBody | null;
}

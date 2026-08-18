import { DIETARY_GUIDES } from "./catalog";
import type { DestinationDietaryGuide } from "./types";

export type { DestinationDietaryGuide, DietaryRestaurant } from "./types";

const dietaryByKey = new Map(
  DIETARY_GUIDES.map((entry) => [`${entry.countryCode}:${entry.city}`, entry])
);

export const dietaryGuideFor = (
  countryCode: string,
  city: string
): DestinationDietaryGuide | null => dietaryByKey.get(`${countryCode}:${city}`) ?? null;

export const dietaryCoverage = () => ({
  destinations: DIETARY_GUIDES.length,
  veganPicks: DIETARY_GUIDES.reduce((sum, entry) => sum + entry.vegan.length, 0),
  halalPicks: DIETARY_GUIDES.reduce((sum, entry) => sum + entry.halal.length, 0),
  researchNotes: DIETARY_GUIDES.filter((entry) => entry.researchNote).length,
});

export const googleMapsSearchUrl = (
  restaurant: string,
  city: string,
  country: string
) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${restaurant}, ${city}, ${country}`
  )}`;

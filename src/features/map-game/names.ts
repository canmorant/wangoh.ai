"use client";

import { useLocale } from "next-intl";
import { cityDisplayName } from "@/data/worldCityNames";
import { cityKey, type City } from "../distance-game/cities";

export interface Names {
  countryNames: Record<string, string>;
  guideLinks: Record<string, string>;
  guideNames: Record<string, string>;
}

/** Ekranda görünen şehir ve ülke adları (Kaç kilometre? ile aynı yazım kuralları). */
export function useNames({ countryNames, guideNames }: Pick<Names, "countryNames" | "guideNames">) {
  const locale = useLocale();
  return {
    city: (c: City) => cityDisplayName(c.name, c.iso2, locale, guideNames[cityKey(c)]),
    country: (c: City) => countryNames[c.iso2] ?? c.iso2,
  };
}

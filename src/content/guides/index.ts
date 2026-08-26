import { countries, Country, City } from "@/data/destinations";
import { SECRET_DESTINATION } from "@/data/secret";
import { slugify } from "@/lib/slug";
import { CityGuide } from "./types";
import { hiroshima } from "./hiroshima";
import { kyoto } from "./kyoto";
import { nara } from "./nara";
import { osaka } from "./osaka";
import { sapporo } from "./sapporo";
import { tokyo } from "./tokyo";
import { newYork } from "./new-york";
import { losAngeles } from "./los-angeles";
import { miami } from "./miami";
import { chicago } from "./chicago";
import { sanFrancisco } from "./san-francisco";
import { lasVegas } from "./las-vegas";
import { bangkok } from "./bangkok";
import { chiangMai } from "./chiang-mai";
import { phuket } from "./phuket";
import { krabi } from "./krabi";
import { kohSamui } from "./koh-samui";
import { ayutthaya } from "./ayutthaya";
import { roma } from "./roma";
import { venedik } from "./venedik";
import { floransa } from "./floransa";
import { milano } from "./milano";
import { amalfiKiyisi } from "./amalfi-kiyisi";
import { napoli } from "./napoli";
import { paris } from "./paris";
import { nice } from "./nice";
import { lyon } from "./lyon";
import { marsilya } from "./marsilya";
import { bordo } from "./bordo";
import { strazburg } from "./strazburg";
import { kobe } from "./kobe";
import { okinawa } from "./okinawa";
import { seul } from "./seul";
import { busan } from "./busan";
import { jejuAdasi } from "./jeju-adasi";
import { gyeongju } from "./gyeongju";
import { incheon } from "./incheon";
import { sokcho } from "./sokcho";
import { spainGuides } from "./spain";
import { turkeyGuides } from "./turkey";
import { unitedKingdomGuides } from "./unitedKingdom";
import { indonesiaGuides } from "./indonesia";
import { chinaGuides } from "./china";
import { netherlandsGuides } from "./netherlands";
import { austriaGuides } from "./austria";
import { portugalGuides } from "./portugal";
import { germanyGuides } from "./germany";
import { mexicoGuides } from "./mexico";
import { brazilGuides } from "./brazil";
import { argentinaGuides } from "./argentina";
import { canadaGuides } from "./canada";
import { switzerlandGuides } from "./switzerland";
import { belgiumGuides } from "./belgium";
import { hungaryGuides } from "./hungary";
import { czechiaGuides } from "./czechia";
import { polandGuides } from "./poland";
import { russiaGuides } from "./russia";
import { serbiaGuides } from "./serbia";
import { montenegroGuides } from "./montenegro";
import { bosniaGuides } from "./bosnia";
import { albaniaGuides } from "./albania";
import { greeceGuides } from "./greece";
import { croatiaGuides } from "./croatia";
import { sloveniaGuides } from "./slovenia";
import { nyAlesund } from "./ny-alesund";
import { longyearbyen } from "./longyearbyen";

export const allCountries: Country[] = [...countries, SECRET_DESTINATION];

/**
 * Yazılmış rehberlerin kaydı.
 *
 * Bir şehir için rehber eklemek = bir dosya yazıp bu diziye eklemek. Rota,
 * meta veri, şema, breadcrumb ve iç bağlantılar otomatik gelir.
 */
export const GUIDES: CityGuide[] = [
  tokyo,
  kyoto,
  osaka,
  hiroshima,
  nara,
  sapporo,
  kobe,
  okinawa,
  newYork,
  losAngeles,
  miami,
  chicago,
  sanFrancisco,
  lasVegas,
  bangkok,
  chiangMai,
  phuket,
  krabi,
  kohSamui,
  ayutthaya,
  roma,
  venedik,
  floransa,
  milano,
  amalfiKiyisi,
  napoli,
  paris,
  nice,
  lyon,
  marsilya,
  bordo,
  strazburg,
  seul,
  busan,
  jejuAdasi,
  gyeongju,
  incheon,
  sokcho,
  nyAlesund,
  longyearbyen,
  ...spainGuides,
  ...turkeyGuides,
  ...unitedKingdomGuides,
  ...indonesiaGuides,
  ...chinaGuides,
  ...netherlandsGuides,
  ...austriaGuides,
  ...portugalGuides,
  ...germanyGuides,
  ...mexicoGuides,
  ...brazilGuides,
  ...argentinaGuides,
  ...canadaGuides,
  ...switzerlandGuides,
  ...belgiumGuides,
  ...hungaryGuides,
  ...czechiaGuides,
  ...polandGuides,
  ...russiaGuides,
  ...serbiaGuides,
  ...montenegroGuides,
  ...bosniaGuides,
  ...albaniaGuides,
  ...greeceGuides,
  ...croatiaGuides,
  ...sloveniaGuides,
];

const byKey = new Map(GUIDES.map((g) => [`${g.countryCode}:${g.city}`, g]));

export const guideFor = (countryCode: string, city: string): CityGuide | null =>
  byKey.get(`${countryCode}:${city}`) ?? null;

export const hasGuide = (countryCode: string, city: string): boolean =>
  byKey.has(`${countryCode}:${city}`);

/* ------------------------- slug <-> veri eşlemesi ------------------------ */

export const countrySlug = (c: Country) => slugify(c.name);
export const citySlug = (c: City) => slugify(c.name);

export function findCountryBySlug(slug: string): Country | null {
  return allCountries.find((c) => countrySlug(c) === slug) ?? null;
}

export function findCityBySlug(country: Country, slug: string): City | null {
  return country.cities.find((c) => citySlug(c) === slug) ?? null;
}

/** Her şehir kartı için bir rota — rehber yazılmış olsun ya da olmasın. */
export function allCityPaths(): { ulke: string; sehir: string }[] {
  return allCountries.flatMap((c) =>
    c.cities.map((city) => ({ ulke: countrySlug(c), sehir: citySlug(city) }))
  );
}

export const cityHref = (country: Country, city: City) =>
  `/${countrySlug(country)}/${citySlug(city)}`;

export const countryHref = (country: Country) => `/${countrySlug(country)}`;

/** Kaç şehrin yazılmış rehberi var — kapsama raporu için. */
export const coverage = () => ({
  total: countries.reduce((n, c) => n + c.cities.length, 0),
  written: GUIDES.length,
});

import { countries, Country, City } from "@/data/destinations";
import { SECRET_DESTINATION } from "@/data/secret";
import { slugify } from "@/lib/slug";
import { CityGuide } from "./types";
import addedGuides from "./addedDestinations.json";
import { translateDeep } from "@/content/i18n/core";
import { TR_CONTEXT, type GuideContext } from "./context";
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
import { norwayGuides } from "./norway";
import { swedenGuides } from "./sweden";
import { denmarkGuides } from "./denmark";
import { finlandGuides } from "./finland";
import { nyAlesund } from "./ny-alesund";
import { longyearbyen } from "./longyearbyen";

export const allCountries: Country[] = [...countries, SECRET_DESTINATION];

/**
 * Yazılmış rehberlerin kaydı.
 *
 * Bir şehir için rehber eklemek = bir dosya yazıp bu diziye eklemek. Rota,
 * meta veri, şema, breadcrumb ve iç bağlantılar otomatik gelir.
 */
/**
 * Rehberleri verilen dilde kurar. Elle yazılmış rehberler çeviri belleğinden
 * çevrilir; fabrika rehberleri (ülke dosyaları) kendi kalıplarıyla o dilde
 * yeniden üretilir. Türkçe bağlamda her şey özgün hâlindedir.
 */
const TRANSPORT_SECTIONS = new Set(["ulasim", "havalimani-ulasimi", "havalimani-ulasim"]);
const ASKS_HOW_TO_GET = /nasıl gidilir|how (do you|to) get to|cómo llegar/i;

/**
 * "Nasıl gidilir" SSS'si yalnız ulaşım bölümünün ilk paragrafının gerçekten
 * "şehre nasıl varılır" cevabı olduğu, tek tek gözden geçirilmiş başkentlerde.
 * Başka şehirlere eklemeden önce her birinin ilk paragrafı kontrol edilmeli
 * (ör. Jeju'da ilk paragraf adaya değil Udo feribotuna ait).
 */
const HOW_TO_GET_FAQ_GUIDES = new Set([
  "TR:Ankara", "DE:Berlin", "AR:Buenos Aires", "AL:Tiran", "AT:Viyana", "BE:Brüksel", "GB:Londra",
  "BA:Saraybosna", "BG:Sofya", "CZ:Prag", "CN:Pekin", "DK:Kopenhag", "ID:Jakarta", "FI:Helsinki",
  "FR:Paris", "KR:Seul", "GE:Tiflis", "HR:Zagreb", "NL:Amsterdam", "ES:Madrid", "SE:Stockholm",
  "CH:Bern", "IT:Roma", "JP:Tokyo", "HU:Budapeşte", "MT:Valletta", "MX:Mexico City", "EG:Kahire",
  "NO:Oslo", "PL:Varşova", "PT:Lizbon", "RU:Moskova", "RS:Belgrad", "ME:Podgorica", "SI:Ljubljana",
  "GR:Atina", "AE:Abu Dabi", "TH:Bangkok",
]);

/**
 * "X'e nasıl gidilir?" SSS'si: en çok aranan sorulardan biri. Cevap, sayfadaki
 * ulaşım bölümünün ilk paragrafıdır (yeni bilgi eklenmez, aynı metin soru-cevap
 * olarak da sunulur). "BER · FEX/S-Bahn" gibi etiketler gerçek cevap sayılmaz;
 * yalnız tam cümleli ulaşım metni olan rehberlere eklenir.
 */
function withHowToGetFaq(guide: CityGuide, ctx: GuideContext): CityGuide {
  if (!HOW_TO_GET_FAQ_GUIDES.has(`${guide.countryCode}:${guide.city}`)) return guide;
  const question = ctx.T.shared.faqHowToGet?.(ctx.t(guide.city));
  if (!question || guide.faqs.some((faq) => ASKS_HOW_TO_GET.test(faq.q))) return guide;
  const answer = guide.sections.find((s) => TRANSPORT_SECTIONS.has(s.id))?.body[0]?.replace(/\*\*/g, "").trim();
  if (!answer || answer.length < 80 || !/[.!?]$/.test(answer)) return guide;
  return { ...guide, faqs: [...guide.faqs, { q: question, a: answer }] };
}

export function buildGuides(ctx: GuideContext): CityGuide[] {
  const own = (guide: CityGuide) => {
    ctx.scope(`${guide.countryCode}:${guide.city}`);
    return ctx.locale === "tr" ? guide : translateDeep(guide, ctx.t);
  };
  const guides = [
    own(tokyo),
    own(kyoto),
    own(osaka),
    own(hiroshima),
    own(nara),
    own(sapporo),
    own(kobe),
    own(okinawa),
    own(newYork),
    own(losAngeles),
    own(miami),
    own(chicago),
    own(sanFrancisco),
    own(lasVegas),
    own(bangkok),
    own(chiangMai),
    own(phuket),
    own(krabi),
    own(kohSamui),
    own(ayutthaya),
    own(roma),
    own(venedik),
    own(floransa),
    own(milano),
    own(amalfiKiyisi),
    own(napoli),
    own(paris),
    own(nice),
    own(lyon),
    own(marsilya),
    own(bordo),
    own(strazburg),
    own(seul),
    own(busan),
    own(jejuAdasi),
    own(gyeongju),
    own(incheon),
    own(sokcho),
    own(nyAlesund),
    own(longyearbyen),
    ...spainGuides(ctx),
    ...turkeyGuides(ctx),
    ...unitedKingdomGuides(ctx),
    ...indonesiaGuides(ctx),
    ...chinaGuides(ctx),
    ...netherlandsGuides(ctx),
    ...austriaGuides(ctx),
    ...portugalGuides(ctx),
    ...germanyGuides(ctx),
    ...mexicoGuides(ctx),
    ...brazilGuides(ctx),
    ...argentinaGuides(ctx),
    ...canadaGuides(ctx),
    ...switzerlandGuides(ctx),
    ...belgiumGuides(ctx),
    ...hungaryGuides(ctx),
    ...czechiaGuides(ctx),
    ...polandGuides(ctx),
    ...russiaGuides(ctx),
    ...serbiaGuides(ctx),
    ...montenegroGuides(ctx),
    ...bosniaGuides(ctx),
    ...albaniaGuides(ctx),
    ...greeceGuides(ctx),
    ...croatiaGuides(ctx),
    ...sloveniaGuides(ctx),
    ...norwayGuides(ctx),
    ...swedenGuides(ctx),
    ...denmarkGuides(ctx),
    ...finlandGuides(ctx),
    ...(addedGuides as CityGuide[]).map(own),
  ];
  return guides.map((guide) => withHowToGetFaq(guide, ctx));
}

export const GUIDES: CityGuide[] = buildGuides(TR_CONTEXT);

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

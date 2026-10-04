import { buildExpandedGuide, type ExpandedGuideProfile } from "./expandedFactory";
import type { CityGuide } from "./types";
import { translateDeep } from "@/content/i18n/core";
import { TR_CONTEXT, type GuideContext } from "./context";

/** Profil çevrilirken dokunulmayan anahtar alanlar. */
const PROFILE_KEYS: ReadonlySet<string> = new Set(["city", "countryCode"]);

type ExpansionCode = "ID" | "CN" | "NL";
type Pair = [title: string, detail: string];

export interface WorldExpansionProfile {
  city: string;
  countryCode: ExpansionCode;
  focus: string;
  lede: string;
  days: string;
  arrival: string;
  local: string;
  best: string;
  timezone?: string;
  identity: [string, string];
  sights: [Pair, Pair, Pair];
  areas: [string, string];
  tastes: [string, string];
  stay: string;
  evenings: string;
  dayTrips: [string, string];
  season: string;
  budget: string;
  cautions: [string, string];
}

const sourceByCountry: Record<ExpansionCode, { name: string; url: string }> = {
  ID: {
    name: "Wonderful Indonesia — destinasyonlar ve gezi planı",
    url: "https://www.indonesia.travel/gb/en/destination",
  },
  CN: {
    name: "Çin Kültür ve Turizm Bakanlığı — seyahat kaynakları",
    url: "https://www.mct.gov.cn/",
  },
  NL: {
    name: "Holland.com — resmî şehirler ve bölgeler",
    url: "https://www.holland.com/global/tourism.htm",
  },
};

const transportByCountry: Record<ExpansionCode, { name: string; url: string }> = {
  ID: { name: "KAI — resmî tren bilgileri", url: "https://www.kai.id/" },
  CN: { name: "China Railway 12306 — resmî tren bileti", url: "https://www.12306.cn/en/index.html" },
  NL: { name: "9292 — Hollanda toplu taşıma planlayıcısı", url: "https://9292.nl/en" },
};


export function makeWorldExpansionGuides(
  profiles: WorldExpansionProfile[],
  ctx: GuideContext = TR_CONTEXT
): CityGuide[] {
  const { t, T } = ctx;
  const grouped = new Map<ExpansionCode, WorldExpansionProfile[]>();
  for (const profile of profiles) {
    grouped.set(profile.countryCode, [...(grouped.get(profile.countryCode) ?? []), profile]);
  }

  return profiles.map((source) => {
    ctx.scope(`${source.countryCode}:${source.city}`);
    const siblings = grouped.get(source.countryCode) ?? [];
    const current = siblings.findIndex((candidate) => candidate.city === source.city);
    const related = [1, 2, 3].map((offset) => siblings[(current + offset) % siblings.length]);
    // Metinler hedef dilde; city/countryCode anahtar olarak Türkçe kalır.
    const profile = ctx.locale === "tr" ? source : translateDeep(source, t, PROFILE_KEYS);
    const city = t(source.city);
    const [firstSight, secondSight, thirdSight] = profile.sights;
    const code = profile.countryCode;
    /** "**Jordaan:** …" → "Jordaan" */
    const areaName = (area: string) => area.replace(/^\*\*([^*]+)\*\*.*/, "$1");

    const expanded: ExpandedGuideProfile = {
      city: profile.city,
      countryCode: profile.countryCode,
      timezone: profile.timezone,
      searchFocus: profile.focus,
      lede: profile.lede,
      idealDays: profile.days,
      arrival: profile.arrival,
      gettingAround: profile.local,
      bestTime: profile.best,
      character: [profile.identity[0], profile.identity[1]],
      highlights: profile.sights,
      neighborhoods: profile.areas,
      cuisine: profile.tastes,
      stay: [profile.stay],
      nightlifeShopping: [profile.evenings, T.world.shopping(city)],
      dayTrips: profile.dayTrips,
      seasons: [profile.season, T.world.season(profile.best)],
      budget: [profile.budget, T.world.budget(firstSight[0])],
      avoid: profile.cautions,
      // Bu kartlar restoran değil, şehrin öne çıkan gezi durakları; fiyat sınıfı
      // verisi olmadığı için gösterilmiyor.
      placesKind: "sights",
      places: profile.sights.map(([name, ,], index) => [
        name,
        t(index === 0 ? "Ana gezi hattı" : index === 1 ? "İkinci rota kümesi" : "Çevre rotası"),
        t(index === 0 ? "Şehrin simge deneyimi" : index === 1 ? "Yerel karakter ve kültür" : "Manzara ve ritim değişimi"),
        profile.sights[index][1],
        undefined,
        t(
          index === 0
            ? "Bilet, giriş penceresi ve son ulaşımı resmî kanaldan önceden kontrol edin."
            : "Yoğun saatten kaçınmak için sabahı veya günün son ziyaret aralığını seçin."
        ),
      ]),
      itinerary: [
        [
          T.world.day1Title(firstSight[0]),
          T.shared.day1Morning(firstSight[0]),
          T.world.day1Afternoon(areaName(profile.areas[0])),
          T.world.day1Evening(profile.tastes[0].split(".")[0]),
        ],
        [
          T.world.day2Title(secondSight[0]),
          T.shared.day2Morning(secondSight[0]),
          T.world.day2Afternoon(areaName(profile.areas[1])),
          profile.evenings,
        ],
        [
          T.world.day3Title(thirdSight[0]),
          T.shared.day3Morning(thirdSight[0]),
          profile.dayTrips[0],
          t("Dönüşten önce ertesi gün bağlantısını, bagaj süresini ve çevrimdışı biletleri hazırlayın; program sıkıştıysa alışverişi bu saate bırakmayın."),
        ],
      ],
      practical: [
        [t("Rezervasyon sırası"), T.shared.bookingOrder(firstSight[0])],
        [t("Çevrimdışı hazırlık"), t("Otel adresini yerel dilde, biletlerin ekran görüntüsünü, acil numaraları ve çevrimdışı haritayı telefona indirin.")],
        [t("Günlük tempo"), T.shared.dailyPace(city)],
        [t("Son kontrol"), t("Çalışma saati, hava, grev, deniz veya park erişimini ziyaret günü resmî kaynaktan yeniden doğrulayın.")],
      ],
      faqs: [
        [T.shared.faqDays(city), T.world.faqDaysAnswer(profile.days)],
        [T.shared.faqStay(city), profile.stay],
        [T.shared.faqWhen(city), T.world.faqWhenAnswer(profile.best, profile.season)],
        [T.world.faqCarQuestion(city), T.world.faqCarAnswer(profile.local)],
        [T.shared.faqCombine(city), T.world.faqCombineAnswer(related.map((item) => t(item.city)).join(", "))],
      ],
      related: related.map((item) => [item.city, T.shared.relatedAnchor(t(item.city)), T.shared.relatedDescription(city)]),
      sourceName: t(sourceByCountry[code].name),
      sourceUrl: sourceByCountry[code].url,
      transportSource: { name: t(transportByCountry[code].name), url: transportByCountry[code].url },
    };

    return buildExpandedGuide(expanded, ctx);
  });
}

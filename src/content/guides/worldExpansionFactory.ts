import { makeExpandedGuide, type ExpandedGuideProfile } from "./expandedFactory";
import type { CityGuide } from "./types";

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

const priceFor = (index: number): "Yüksek" | "Orta" | "Ekonomik" =>
  index === 0 ? "Yüksek" : index === 1 ? "Orta" : "Ekonomik";

export function makeWorldExpansionGuides(profiles: WorldExpansionProfile[]): CityGuide[] {
  const grouped = new Map<ExpansionCode, WorldExpansionProfile[]>();
  for (const profile of profiles) {
    grouped.set(profile.countryCode, [...(grouped.get(profile.countryCode) ?? []), profile]);
  }

  return profiles.map((profile) => {
    const siblings = grouped.get(profile.countryCode) ?? [];
    const current = siblings.findIndex((candidate) => candidate.city === profile.city);
    const related = [1, 2, 3].map((offset) => siblings[(current + offset) % siblings.length]);
    const [firstSight, secondSight, thirdSight] = profile.sights;

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
      nightlifeShopping: [
        profile.evenings,
        `${profile.city}'ta alışverişi tek bir turistik çarşıya sıkıştırmayın. Yerel üretim, tasarım veya gıda hediyesi alırken etiket, sabit fiyat ve bagaj kuralını kontrol edin; koruma altındaki doğal ürünleri ve belgesiz antikaları satın almayın.`,
      ],
      dayTrips: profile.dayTrips,
      seasons: [
        profile.season,
        `Takvimde ${profile.best} öne çıksa da okul tatili, ulusal bayram, festival ve hafta sonu yoğunluğu deneyimi değiştirebilir. Hava ortalamasını son dakika tahmini sanmayın; açık hava gününe kapalı mekân veya yavaş mahalle yürüyüşü alternatifi ekleyin.`,
      ],
      budget: [
        profile.budget,
        `Konaklama, şehirler arası bağlantı ve ${firstSight[0]} gibi ana deneyimleri önce fiyatlandırın. Küçük ödemeler, bagaj, rezervasyon komisyonu ve son kilometre transferi için ayrı pay bırakın; yalnız uçak ve otel toplamını seyahat bütçesi sanmayın.`,
      ],
      avoid: profile.cautions,
      places: profile.sights.map(([name, ,], index) => [
        name,
        index === 0 ? "Ana gezi hattı" : index === 1 ? "İkinci rota kümesi" : "Çevre rotası",
        index === 0 ? "Şehrin simge deneyimi" : index === 1 ? "Yerel karakter ve kültür" : "Manzara ve ritim değişimi",
        profile.sights[index][1],
        priceFor(index),
        index === 0
          ? "Bilet, giriş penceresi ve son ulaşımı resmî kanaldan önceden kontrol edin."
          : "Yoğun saatten kaçınmak için sabahı veya günün son ziyaret aralığını seçin.",
      ]),
      itinerary: [
        [
          `1. Gün — ${firstSight[0]} ve şehirle tanışma`,
          `${firstSight[0]} için erken başlayın; giriş veya ulaşım belirsizliğini günün başında çözün.`,
          `${profile.areas[0].replace(/^\*\*([^*]+)\*\*.*/, "$1")} çevresini yürüyerek okuyun ve plansız bir kahve molası bırakın.`,
          `Akşamı ${profile.tastes[0].split(".")[0].toLocaleLowerCase("tr")} odağında sakin bir yemekle tamamlayın.`,
        ],
        [
          `2. Gün — ${secondSight[0]} ve mahalleler`,
          `${secondSight[0]} çevresindeki ana rotayı kalabalık büyümeden tamamlayın.`,
          `${profile.areas[1].replace(/^\*\*([^*]+)\*\*.*/, "$1")} tarafında küçük sokak, pazar ve yerel gündelik hayatı programa ekleyin.`,
          profile.evenings,
        ],
        [
          `3. Gün — ${thirdSight[0]} ve esnek kapanış`,
          `${thirdSight[0]} için hava, bilet veya transfer durumunu bir gece önce doğrulayın.`,
          profile.dayTrips[0],
          "Dönüşten önce ertesi gün bağlantısını, bagaj süresini ve çevrimdışı biletleri hazırlayın; program sıkıştıysa alışverişi bu saate bırakmayın.",
        ],
      ],
      practical: [
        ["Rezervasyon sırası", `${firstSight[0]}, şehirler arası bağlantı ve konaklamayı önce; esnek mahalle öğünlerini sonra sabitleyin.`],
        ["Çevrimdışı hazırlık", "Otel adresini yerel dilde, biletlerin ekran görüntüsünü, acil numaraları ve çevrimdışı haritayı telefona indirin."],
        ["Günlük tempo", `Aynı güne üç uzak bölge koymayın. ${profile.city}'ta bir ana deneyim, bir mahalle ve uzun bir öğün daha sürdürülebilir bir ritim verir.`],
        ["Son kontrol", "Çalışma saati, hava, grev, deniz veya park erişimini ziyaret günü resmî kaynaktan yeniden doğrulayın."],
      ],
      faqs: [
        [
          `${profile.city} için kaç gün gerekir?`,
          `${profile.days} dengeli bir ilk ziyaret sağlar. Ana gezi noktalarını işaretlemek yerine mahalle, yemek ve olası hava/ulaşım gecikmesi için boşluk bırakırsanız şehir daha anlamlı açılır.`,
        ],
        [
          `${profile.city}'ta nerede kalınır?`,
          profile.stay,
        ],
        [
          `${profile.city}'a ne zaman gidilir?`,
          `${profile.best} genel olarak en dengeli dönemdir. ${profile.season}`,
        ],
        [
          `${profile.city}'ta araç kiralamak gerekir mi?`,
          `${profile.local} Araç kararı vermeden otopark, ehliyet, sigorta ve gece dönüşünü birlikte değerlendirin.`,
        ],
        [
          `${profile.city} hangi rota ile birleştirilir?`,
          `${related.map((item) => item.city).join(", ")} bu rehberdeki doğal devam seçenekleridir. Yalnız haritadaki mesafeye değil, gerçek kapıdan kapıya ulaşım süresine bakın.`,
        ],
      ],
      related: related.map((item) => [
        item.city,
        `${item.city} gezi rehberi`,
        `${profile.city} sonrasında farklı bir şehir ritmi ve yeni bir rota katmanı ekler.`,
      ]),
      sourceName: sourceByCountry[profile.countryCode].name,
      sourceUrl: sourceByCountry[profile.countryCode].url,
      transportSource: transportByCountry[profile.countryCode],
    };

    return makeExpandedGuide(expanded);
  });
}

import { buildExpandedGuide, type ExpandedGuideProfile } from "./expandedFactory";
import type { CityGuide } from "./types";
import { translateDeep } from "@/content/i18n/core";
import { TR_CONTEXT, type GuideContext } from "./context";

/** Profil çevrilirken dokunulmayan anahtar alanlar. */
const PROFILE_KEYS: ReadonlySet<string> = new Set(["city", "countryCode"]);

export type RegionalCode = "AT" | "PT" | "DE" | "MX" | "BR" | "AR" | "CA" | "CH" | "BE" | "HU" | "CZ" | "PL" | "RU" | "RS" | "ME" | "BA" | "AL" | "GR" | "HR" | "SI" | "NO" | "SE" | "DK" | "FI";
type Pair = [title: string, detail: string];

export interface RegionalProfile {
  city: string;
  countryCode: RegionalCode;
  focus: string;
  lede: string;
  days: string;
  arrival: string;
  local: string;
  best: string;
  timezone?: string;
  pulse: string;
  sights: [Pair, Pair, Pair];
  areas: [Pair, Pair];
  foods: [Pair, Pair];
  dayTrips: [Pair, Pair];
  caution: string;
}

const officialSource: Record<RegionalCode, { name: string; url: string }> = {
  AT: { name: "Austria.info — resmî Avusturya rehberi", url: "https://www.austria.info/en/" },
  PT: { name: "Visit Portugal — resmî destinasyon rehberi", url: "https://www.visitportugal.com/en" },
  DE: { name: "Germany Travel — resmî destinasyon rehberi", url: "https://www.germany.travel/en/home.html" },
  MX: { name: "Visit Mexico — resmî destinasyon rehberi", url: "https://visitmexico.com/en/" },
  BR: { name: "Visit Brasil — resmî destinasyon rehberi", url: "https://visitbrasil.com/en/" },
  AR: { name: "Visit Argentina — resmî destinasyon rehberi", url: "https://www.argentina.travel/en" },
  CA: { name: "Destination Canada — resmî destinasyon rehberi", url: "https://travel.destinationcanada.com/en-ca" },
  CH: { name: "Switzerland Tourism — resmî destinasyon rehberi", url: "https://www.myswitzerland.com/en/" },
  BE: { name: "Visit Flanders — resmî destinasyon rehberi", url: "https://www.visitflanders.com/en" },
  HU: { name: "Visit Hungary — resmî destinasyon rehberi", url: "https://visithungary.com/" },
  CZ: { name: "Visit Czechia — resmî destinasyon rehberi", url: "https://www.visitczechia.com/en-us" },
  PL: { name: "Poland Travel — resmî destinasyon rehberi", url: "https://www.poland.travel/en/" },
  RU: { name: "Rusya Hükümeti — Turizm ve Konukseverlik projesi", url: "https://government.ru/rugovclassifier/920/" },
  RS: { name: "Serbia Travel — resmî destinasyon rehberi", url: "https://www.serbia.travel/en/" },
  ME: { name: "Montenegro Travel — resmî destinasyon rehberi", url: "https://www.montenegro.travel/en" },
  BA: { name: "Tourism BiH — destinasyon rehberi", url: "https://www.tourismbih.com/" },
  AL: { name: "Arnavutluk Ulusal Turizm Ajansı", url: "https://akt.gov.al/en/" },
  GR: { name: "Visit Greece — resmî destinasyon rehberi", url: "https://www.visitgreece.gr/" },
  HR: { name: "Croatia Full of Life — resmî destinasyon rehberi", url: "https://croatia.hr/en-gb" },
  SI: { name: "I feel Slovenia — resmî destinasyon rehberi", url: "https://www.slovenia.info/en" },
  NO: { name: "Visit Norway — resmî destinasyon rehberi", url: "https://www.visitnorway.com/" },
  SE: { name: "Visit Sweden — resmî destinasyon rehberi", url: "https://visitsweden.com/" },
  DK: { name: "VisitDenmark — resmî destinasyon rehberi", url: "https://www.visitdenmark.com/" },
  FI: { name: "Visit Finland — resmî destinasyon rehberi", url: "https://www.visitfinland.com/en/" },
};

const transportSource: Record<RegionalCode, { name: string; url: string }> = {
  AT: { name: "ÖBB — tren ve bölgesel bağlantılar", url: "https://www.oebb.at/en/" },
  PT: { name: "CP — Portekiz trenleri", url: "https://www.cp.pt/passageiros/en" },
  DE: { name: "Deutsche Bahn — tren ve canlı sefer", url: "https://int.bahn.de/en" },
  MX: { name: "Visit Mexico — ulaşım ve rezervasyonlar", url: "https://visitmexico.com/en/" },
  BR: { name: "ANTT — yetkili şehirler arası ulaşım", url: "https://www.gov.br/antt/pt-br/assuntos/passageiros" },
  AR: { name: "SUBE — resmî toplu taşıma bilgisi", url: "https://www.argentina.gob.ar/sube" },
  CA: { name: "VIA Rail — şehirler arası tren", url: "https://www.viarail.ca/en" },
  CH: { name: "SBB — tren, otobüs ve tekne bağlantıları", url: "https://www.sbb.ch/en" },
  BE: { name: "SNCB/NMBS — Belçika trenleri", url: "https://www.belgiantrain.be/en" },
  HU: { name: "MÁV — tren, otobüs ve canlı sefer", url: "https://www.mavcsoport.hu/en" },
  CZ: { name: "České dráhy — tren ve canlı sefer", url: "https://www.cd.cz/en/" },
  PL: { name: "PKP Intercity — şehirler arası tren", url: "https://www.intercity.pl/en/" },
  RU: { name: "Russian Railways — resmî tren bilgisi", url: "https://eng.rzd.ru/" },
  RS: { name: "Srbija Voz — resmî tren bilgisi", url: "https://srbijavoz.rs/en/" },
  ME: { name: "ŽPCG — Karadağ trenleri", url: "https://zpcg.me/en" },
  BA: { name: "ŽFBH — Bosna-Hersek Federasyonu trenleri", url: "https://www.zfbh.ba/en/" },
  AL: { name: "Arnavutluk Ulusal Turizm Ajansı — ulaşım bilgisi", url: "https://akt.gov.al/en/" },
  GR: { name: "Hellenic Train — tren ve canlı sefer", url: "https://www.hellenictrain.gr/en" },
  HR: { name: "HŽPP — Hırvatistan trenleri", url: "https://www.hzpp.hr/en" },
  SI: { name: "Slovenske železnice — Slovenya trenleri", url: "https://potniski.sz.si/en/" },
  NO: { name: "Entur — Norveç toplu taşıma planlayıcısı", url: "https://entur.no/" },
  SE: { name: "SJ — İsveç trenleri", url: "https://www.sj.se/en/" },
  DK: { name: "DSB — Danimarka trenleri", url: "https://www.dsb.dk/en/" },
  FI: { name: "VR — Finlandiya trenleri", url: "https://www.vr.fi/en" },
};

const budgetNote: Record<RegionalCode, string> = {
  AT: "Tren ve konaklamayı erken sabitleyin; teleferik, göl teknesi ve spa gibi dağ deneyimlerini günlük bütçeden ayrı yazın.",
  PT: "Lizbon, Algarve ve ada uçuşları yüksek sezonda hızla yükselir; tasca öğünleri ile tren ön alımı bütçeyi dengeler.",
  DE: "Fuar, maç ve festival takvimini kontrol edin; esnek ICE bileti ile sabit tarihli Sparpreis arasındaki farkı yalnız fiyatla değerlendirmeyin.",
  MX: "Arkeoloji transferi, cenote, milli park ve bagaj ücretini ayrıca yazın; kıyı bölgelerindeki dolar fiyatını ülke geneline taşımayın.",
  BR: "İç hat, doğa rehberi ve son kilometre tekne/4x4 maliyeti toplamı büyütür; fiyatın kişi başı mı araç başı mı olduğunu yazılı teyit edin.",
  AR: "Kur ve enflasyon nedeniyle eski günlük rakamlara güvenmeyin; uçuş, oda, öğün ve turu rezervasyon gününde ayrı ayrı fiyatlandırın.",
  CA: "Vergi, bahşiş, park girişi, araç sigortası ve tek yön bırakma ücretini görünen oda/araç fiyatına ekleyin.",
  CH: "Konaklama, dağ treni, teleferik ve panoramik hat maliyetini ayrı yazın; Swiss Travel Pass ile tek tek bilet toplamını gerçek rotanız üzerinden karşılaştırın.",
  BE: "Brüksel ve Brugge hafta sonu konaklaması ile hızlı trenleri erken kontrol edin; müze, bira tadımı ve şehir vergisini görünen oda fiyatına ekleyin.",
  HU: "Budapeşte dışındaki tren, termal banyo, bağ transferi ve Balaton sezon ücretini ayrı hesaplayın; eski forint rakamlarını güncel fiyat sanmayın.",
  CZ: "Prag merkezindeki konaklama ile küçük şehirleri aynı fiyat düzeyinde sanmayın; tren, spa, kale ve bira fabrikası turlarını ayrı kalemlerle güncel fiyatlandırın.",
  PL: "Kraków ve sahil hafta sonları, Tatra transferi, müze rezervasyonu ve hızlı tren ücretini ayrı yazın; zlotiyi eski blog kuruyla hesaplamayın.",
  RU: "Uçuş, uzun mesafe tren, yerel transfer ve ödeme erişimini rezervasyon gününde ayrı doğrulayın; ülke büyüklüğü ve kart kısıtları tek günlük tahmini yanıltabilir.",
  RS: "Belgrad ile Novi Sad etkinlik haftaları, dağ transferi, milli park teknesi ve manastır turunu ayrı kalemlerle hesaplayın; eski dinar kuruna güvenmeyin.",
  ME: "Kotor Körfezi yaz konaklaması, sahil otoparkı, tekne, feribot ve Durmitor transferini ayrı yazın; ülkenin küçük görünmesi günlük ulaşımı otomatik ucuz yapmaz.",
  BA: "Nakit ağırlıklı küçük işletme, şehirler arası otobüs, milli park girişi ve son kilometre taksi/transferini ayrı hesaplayın; KM fiyatını avro etiketiyle karıştırmayın.",
  AL: "Kıyı yaz konaklaması, nakit lek, minibüs, araç sigortası ve dağ transferini ayrı fiyatlandırın; Tiran fiyatını Theth ya da Riviera geneline taşımayın.",
  GR: "Ada uçuşu veya feribotu, bagaj, plaj hizmeti ve arkeoloji biletini ayrı yazın; Santorini ve Mykonos yaz fiyatını ana kara geneline taşımayın.",
  HR: "Dubrovnik, Split ve ada yaz konaklaması; feribot, milli park bileti, otopark ve şehir vergisini ayrı hesaplayın; kıyı ile Zagreb fiyatını eşitlemeyin.",
  SI: "Tren/otobüs, mağara bileti, göl teknesi, park shuttle'ı ve dağ ulaşımını ayrı hesaplayın; küçük ülke haritasını düşük günlük maliyet sanmayın.",
  NO: "Konaklama, uzun mesafe tren, fiyort feribotu, bagaj ve doğa turunu ayrı hesaplayın; Norveç'in yüksek fiyatlarını market öğünü ve erken rezervasyonla dengeleyin.",
  SE: "Tren, gece treni, takımada teknesi, müze ve kuzey aktivitesini ayrı fiyatlandırın; etkinlik haftası ile Lapland sezonunda konaklamayı erken sabitleyin.",
  DK: "Kopenhag konaklaması, şehirler arası tren, köprü/feribot ve müze ücretlerini ayrı yazın; bisiklet kiralama ve restoran servis düzenini de toplam bütçeye ekleyin.",
  FI: "Tren veya gece treni, sauna, göl teknesi, kış ekipmanı ve Lapland turunu ayrı hesaplayın; kuzeyde son kilometre transferi günlük bütçeyi belirgin yükseltebilir.",
};

const priceFor = (index: number): "Yüksek" | "Orta" | "Ekonomik" =>
  index === 0 ? "Yüksek" : index === 1 ? "Orta" : "Ekonomik";

export function makeRegionalGuides(profiles: RegionalProfile[], ctx: GuideContext = TR_CONTEXT): CityGuide[] {
  const { t, T } = ctx;
  const grouped = new Map<RegionalCode, RegionalProfile[]>();
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
    const [first, second, third] = profile.sights;
    const code = profile.countryCode;

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
      character: [
        profile.pulse,
        T.regional.character(city, profile.areas[0][0], profile.areas[1][0], first[0], second[0], third[0]),
      ],
      highlights: profile.sights,
      neighborhoods: profile.areas.map(([name, detail]) => T.shared.bold(name, detail)),
      cuisine: profile.foods.map(([name, detail]) => T.shared.bold(name, detail)),
      stay: [T.regional.stay(profile.areas[0][0], profile.areas[1][0])],
      nightlifeShopping: [
        T.regional.evening(profile.areas[1][0], first[0]),
        T.regional.souvenirs(profile.foods[0][0]),
      ],
      dayTrips: profile.dayTrips.map(([name, detail]) => T.shared.bold(name, detail)),
      seasons: [
        T.regional.season(profile.best),
        t("Ulusal tatil, okul tatili, festival, maç ve hafta sonu yoğunluğu ulaşım ile çalışma saatlerini değiştirebilir. Ana biletleri önceden alın; her açık hava gününe kapalı mekân ya da yavaş mahalle alternatifi ekleyin."),
      ],
      budget: [t(budgetNote[code]), T.regional.budget(first[0])],
      avoid: [
        profile.caution,
        t("Çalışma saatini, hava durumunu, grev veya yol/park kapanışını eski blogdan değil ziyaret günü resmî kaynaktan doğrulayın. Aşırı sıkışık rota, bilette yanlış istasyon ve son dönüşü hesaba katmamak en yaygın zaman kayıplarıdır."),
      ],
      places: profile.sights.map(([name, detail], index) => [
        name,
        t(index === 0 ? "Ana rota" : index === 1 ? "İkinci gezi kümesi" : "Çevre deneyimi"),
        t(index === 0 ? "Destinasyonun simgesi" : index === 1 ? "Kültür ve yerel karakter" : "Manzara ve tempo değişimi"),
        detail,
        priceFor(index),
        t(
          index === 0
            ? "Saatli giriş, kapasite ve son ulaşımı resmî kanaldan önceden kontrol edin."
            : "Kalabalığı azaltmak için sabahı veya günün son ziyaret aralığını seçin."
        ),
      ]),
      itinerary: [
        [
          T.regional.day1Title(first[0]),
          T.shared.day1Morning(first[0]),
          T.regional.day1Afternoon(profile.areas[0][0]),
          T.regional.day1Evening(profile.foods[0][0]),
        ],
        [
          T.regional.day2Title(second[0]),
          T.shared.day2Morning(second[0]),
          T.regional.day2Afternoon(profile.areas[1][0]),
          T.regional.day2Evening(profile.foods[1][0]),
        ],
        [
          T.regional.day3Title(third[0]),
          T.shared.day3Morning(third[0]),
          T.regional.day3Afternoon(profile.dayTrips[0][0]),
          t("Dönüşten önce ertesi gün bağlantısını, bagaj süresini ve çevrimdışı biletleri hazırlayın."),
        ],
      ],
      practical: [
        [t("Rezervasyon sırası"), T.shared.bookingOrder(first[0])],
        [t("Çevrimdışı hazırlık"), t("Otel adresini yerel dilde, bilet ekranlarını, acil numaraları ve çevrimdışı haritayı telefona indirin.")],
        [t("Günlük tempo"), T.shared.dailyPace(city)],
        [t("Son kontrol"), t("Çalışma saati, hava, grev, deniz, yangın veya park erişimini ziyaret günü resmî kaynaktan yeniden doğrulayın.")],
      ],
      faqs: [
        [T.shared.faqDays(city), T.regional.faqDaysAnswer(profile.days)],
        [T.shared.faqStay(city), T.regional.faqStayAnswer(profile.areas[0][0], profile.areas[1][0])],
        [T.shared.faqWhen(city), T.regional.faqWhenAnswer(profile.best)],
        [T.regional.faqCarQuestion(city), T.regional.faqCarAnswer(profile.local)],
        [T.shared.faqCombine(city), T.regional.faqCombineAnswer(related.map((item) => t(item.city)).join(", "))],
      ],
      related: related.map((item) => [item.city, T.shared.relatedAnchor(t(item.city)), T.shared.relatedDescription(city)]),
      sourceName: t(officialSource[code].name),
      sourceUrl: officialSource[code].url,
      transportSource: { name: t(transportSource[code].name), url: transportSource[code].url },
    };

    return buildExpandedGuide(expanded, ctx);
  });
}

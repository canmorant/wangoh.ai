import { makeExpandedGuide, type ExpandedGuideProfile } from "./expandedFactory";
import type { CityGuide } from "./types";

export type RegionalCode = "AT" | "PT" | "DE" | "MX" | "BR" | "AR" | "CA" | "CH" | "BE" | "HU" | "CZ" | "PL" | "RU" | "RS" | "ME" | "BA" | "AL";
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
};

const priceFor = (index: number): "Yüksek" | "Orta" | "Ekonomik" =>
  index === 0 ? "Yüksek" : index === 1 ? "Orta" : "Ekonomik";

export function makeRegionalGuides(profiles: RegionalProfile[]): CityGuide[] {
  const grouped = new Map<RegionalCode, RegionalProfile[]>();
  for (const profile of profiles) {
    grouped.set(profile.countryCode, [...(grouped.get(profile.countryCode) ?? []), profile]);
  }

  return profiles.map((profile) => {
    const siblings = grouped.get(profile.countryCode) ?? [];
    const current = siblings.findIndex((candidate) => candidate.city === profile.city);
    const related = [1, 2, 3].map((offset) => siblings[(current + offset) % siblings.length]);
    const [first, second, third] = profile.sights;

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
        `${profile.city}'ı iyi okumak için ${profile.areas[0][0]} ile ${profile.areas[1][0]} arasında yalnız simgeleri değil, gündelik hayatı da izleyin. ${first[0]}, ${second[0]} ve ${third[0]} aynı güne sıkıştırılmak zorunda değildir; bir ana deneyim, bir mahalle ve uzun bir öğün daha güçlü bir ritim verir.`,
      ],
      highlights: profile.sights,
      neighborhoods: profile.areas.map(([name, detail]) => `**${name}:** ${detail}`),
      cuisine: profile.foods.map(([name, detail]) => `**${name}:** ${detail}`),
      stay: [
        `İlk ziyarette ${profile.areas[0][0]} çevresi ana gezi hattına yakınlık sağlar; daha yerel akşam ve çoğu zaman daha sakin konaklama için ${profile.areas[1][0]} iyi bir alternatiftir. Yalnız haritadaki kilometreye değil, sabah çıkışına ve son toplu taşıma saatine bakın.`,
      ],
      nightlifeShopping: [
        `${profile.areas[1][0]} çevresinde akşam yemeği ve kısa bir yürüyüş planlayın. Gece hayatını ertesi sabahın ${first[0]} rezervasyonunu bozmayacak ölçüde tutun; geç dönüşte lisanslı taksi veya resmî uygulama kullanın.`,
        `${profile.foods[0][0]} ve yerel üretim ürünleri iyi hediyedir. Koruma altındaki doğal ürünleri, belgesiz antikaları veya bagaj ve gümrük kuralı belirsiz gıdaları satın almayın.`,
      ],
      dayTrips: profile.dayTrips.map(([name, detail]) => `**${name}:** ${detail}`),
      seasons: [
        `${profile.best} çoğu ziyaretçi için en dengeli pencere olsa da hava ortalaması günlük tahmin değildir. Şehir, kıyı veya dağ gününü son 48 saatte resmî hava ve işletme duyurusuyla yeniden sıralayın.`,
        "Ulusal tatil, okul tatili, festival, maç ve hafta sonu yoğunluğu ulaşım ile çalışma saatlerini değiştirebilir. Ana biletleri önceden alın; her açık hava gününe kapalı mekân ya da yavaş mahalle alternatifi ekleyin.",
      ],
      budget: [
        budgetNote[profile.countryCode],
        `Önce konaklama, şehirler arası bağlantı ve ${first[0]} gibi ana deneyimi fiyatlandırın. Ardından yerel ulaşım, öğün, bagaj ve son kilometre transferine pay ayırın; yalnız uçak ve otel toplamını gezi bütçesi sanmayın.`,
      ],
      avoid: [
        profile.caution,
        "Çalışma saatini, hava durumunu, grev veya yol/park kapanışını eski blogdan değil ziyaret günü resmî kaynaktan doğrulayın. Aşırı sıkışık rota, bilette yanlış istasyon ve son dönüşü hesaba katmamak en yaygın zaman kayıplarıdır.",
      ],
      places: profile.sights.map(([name, detail], index) => [
        name,
        index === 0 ? "Ana rota" : index === 1 ? "İkinci gezi kümesi" : "Çevre deneyimi",
        index === 0 ? "Destinasyonun simgesi" : index === 1 ? "Kültür ve yerel karakter" : "Manzara ve tempo değişimi",
        detail,
        priceFor(index),
        index === 0
          ? "Saatli giriş, kapasite ve son ulaşımı resmî kanaldan önceden kontrol edin."
          : "Kalabalığı azaltmak için sabahı veya günün son ziyaret aralığını seçin.",
      ]),
      itinerary: [
        [`1. Gün — ${first[0]} ve ilk mahalle`, `${first[0]} için erken başlayın; giriş veya ulaşım belirsizliğini günün başında çözün.`, `${profile.areas[0][0]} çevresini yürüyün ve plansız bir kahve molası bırakın.`, `${profile.foods[0][0]} odağında sakin bir akşam yemeğiyle günü kapatın.`],
        [`2. Gün — ${second[0]} ve yerel ritim`, `${second[0]} çevresindeki ana rotayı kalabalık büyümeden tamamlayın.`, `${profile.areas[1][0]} tarafında küçük sokak, pazar ve gündelik yaşamı programa ekleyin.`, `${profile.foods[1][0]} için içerik, porsiyon ve rezervasyonu önceden konuşun.`],
        [`3. Gün — ${third[0]} ve çevre`, `${third[0]} için hava, bilet veya transfer durumunu bir gece önce doğrulayın.`, `${profile.dayTrips[0][0]} planını enerji ve son dönüşe göre uygulayın.`, "Dönüşten önce ertesi gün bağlantısını, bagaj süresini ve çevrimdışı biletleri hazırlayın."],
      ],
      practical: [
        ["Rezervasyon sırası", `${first[0]}, şehirler arası bağlantı ve konaklamayı önce; esnek mahalle öğünlerini sonra sabitleyin.`],
        ["Çevrimdışı hazırlık", "Otel adresini yerel dilde, bilet ekranlarını, acil numaraları ve çevrimdışı haritayı telefona indirin."],
        ["Günlük tempo", `Aynı güne üç uzak bölge koymayın. ${profile.city}'ta bir ana deneyim, bir mahalle ve uzun bir öğün daha sürdürülebilir bir ritim verir.`],
        ["Son kontrol", "Çalışma saati, hava, grev, deniz, yangın veya park erişimini ziyaret günü resmî kaynaktan yeniden doğrulayın."],
      ],
      faqs: [
        [`${profile.city} için kaç gün gerekir?`, `${profile.days} dengeli bir ilk ziyaret sağlar. Mahalle, yemek ve olası hava/ulaşım gecikmesi için boşluk bırakırsanız gezi daha anlamlı olur.`],
        [`${profile.city}'ta nerede kalınır?`, `${profile.areas[0][0]} ilk ziyaret için pratik; ${profile.areas[1][0]} daha yerel bir alternatiftir. Sabah ve gece bağlantısını oda fiyatıyla birlikte değerlendirin.`],
        [`${profile.city}'a ne zaman gidilir?`, `${profile.best} genel olarak en dengeli dönemdir; yine de son hava, festival ve kapasite durumunu resmî kaynaktan kontrol edin.`],
        [`${profile.city}'ta araç gerekir mi?`, `${profile.local} Kiralamadan önce otopark, ehliyet, sigorta, yakıt ve gece dönüşünü birlikte değerlendirin.`],
        [`${profile.city} hangi rota ile birleştirilir?`, `${related.map((item) => item.city).join(", ")} doğal devam seçenekleridir. Harita mesafesi yerine kapıdan kapıya süreyi kullanın.`],
      ],
      related: related.map((item) => [item.city, `${item.city} gezi rehberi`, `${profile.city} sonrasında farklı bir şehir ritmi ve yeni bir rota katmanı ekler.`]),
      sourceName: officialSource[profile.countryCode].name,
      sourceUrl: officialSource[profile.countryCode].url,
      transportSource: transportSource[profile.countryCode],
    };

    return makeExpandedGuide(expanded);
  });
}

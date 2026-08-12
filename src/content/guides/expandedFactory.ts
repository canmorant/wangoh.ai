import type {
  CityGuide,
  Faq,
  ItineraryDay,
  PlaceCard,
  PracticalTip,
  RelatedGuide,
} from "./types";

type Price = NonNullable<PlaceCard["price"]>;
type PlaceInput = [
  name: string,
  area: string,
  known: string,
  why: string,
  price?: Price,
  tip?: string,
];
type DayInput = [title: string, morning: string, afternoon: string, evening: string];
type TipInput = [title: string, body: string];
type FaqInput = [question: string, answer: string];
type RelatedInput = [city: string, anchor: string, description: string];

export interface ExpandedGuideProfile {
  city: string;
  countryCode: "ES" | "TR" | "GB";
  /** Başlıktaki ikinci arama niyeti; her destinasyonda farklıdır. */
  searchFocus: string;
  lede: string;
  idealDays: string;
  arrival: string;
  gettingAround: string;
  bestTime: string;
  character: string[];
  highlights: [heading: string, text: string][];
  neighborhoods: string[];
  cuisine: string[];
  stay: string[];
  nightlifeShopping: string[];
  football?: string[];
  dayTrips: string[];
  seasons: string[];
  budget: string[];
  avoid: string[];
  places: PlaceInput[];
  itinerary: DayInput[];
  practical: TipInput[];
  faqs: FaqInput[];
  related: RelatedInput[];
  sourceName: string;
  sourceUrl: string;
  transportSource?: { name: string; url: string };
}

const countryResearch = {
  ES: {
    country: "İspanya",
    entry:
      "Umuma mahsus Türk pasaportu taşıyanlar kısa turistik ziyaret için Schengen vizesi almalıdır; yeşil veya diplomatik pasaport gibi istisnalarda kişisel durum ayrıca kontrol edilmelidir. EES 10 Nisan 2026'dan beri dış sınır geçişlerinde elektronik giriş–çıkış kaydı tutuyor. ETIAS ise Türk vatandaşının Schengen vizesinin yerine geçen bir izin değildir.",
    payments:
      "Kart kullanımı yaygındır; küçük bar, pazar ve kırsal duraklar için bir miktar avro taşımak rahattır. Kart terminali TL teklif ederse dinamik kur dönüşümünü reddedip avroyu seçmek çoğu zaman daha şeffaftır. Servis hesaba dahil değilse iyi hizmete küçük yuvarlama yapılabilir; sabit yüzde zorunluluğu yoktur.",
    language:
      "İspanyolca ülke genelinde çalışır; Katalonya, Bask Bölgesi, Valensiya ve Balear Adaları'nda yerel dil kamusal hayatta görünür. Yer adlarının iki yazımını bilmek istasyon ve tabelaları okumayı kolaylaştırır.",
    languageLabel: "İspanyolca · bölgesel diller",
    connectivity:
      "Türkiye hattı AB dolaşım tarifesine otomatik girmez. Kısa gezide operatör paketi veya veri eSIM'i; uzun gezide yerel ön ödemeli hat karşılaştırılabilir. Şehir içinde yerel ulaşım kurumunun resmî uygulamasını, şehirler arasında Renfe/işletmeci uygulamasını ve hava için AEMET'i kullanın; Google Maps saatini son resmî seferle doğrulayın.",
    budgetFrame:
      "Ekonomik planda merkez dışı yatak/oda, menú del día, toplu taşıma ve günde tek ücretli ziyaret; orta bütçede merkezî çift kişilik oda, bir iyi restoran ve iki ücretli ziyaret; rahat planda ise merkezî üst segment otel, taksi ve tadım menüsü öne çıkar. Konaklama fuar, maç ve yaz haftalarında günlük harcamanın tamamından daha hızlı değişebildiği için sabit avro rakamını rezervasyon tarihindeki gerçek fiyatla yenileyin.",
    sources: [
      { name: "Spain.info — resmî destinasyonlar", url: "https://www.spain.info/en/destinations/" },
      { name: "İspanya İstanbul Başkonsolosluğu — Schengen vizesi", url: "https://www.exteriores.gob.es/Consulados/estambul/es/ServiciosConsulares/Paginas/index.aspx?scca=Visados&scco=Turqu%C3%ADa&scd=141&scs=Visado+de+estancia+%28visado+Schengen%29" },
      { name: "Avrupa Komisyonu — EES ve ETIAS", url: "https://home-affairs.ec.europa.eu/news/main-differences-between-ees-and-etias-what-travellers-need-know-2026-04-28_en" },
      { name: "Renfe — tren yolculuğu", url: "https://www.renfe.com/es/en" },
    ],
  },
  TR: {
    country: "Türkiye",
    entry:
      "Bu rehber Türkiye içinde seyahat eden okur için hazırlanmıştır. Uçuş ve şehirlerarası yolculukta geçerli kimliğinizi yanınızda bulundurun; yabancı ziyaretçiler kendi pasaport ve giriş statülerini Göç İdaresi ile dış temsilciliklerden doğrulamalıdır.",
    payments:
      "Kart şehirlerde yaygın olsa da pazar, dolmuş, küçük esnaf ve kırsal duraklarda nakit gerekebilir. Ulaşım kartları şehirden şehre değişir; İstanbulkart'ın Antalya ya da İzmir'de çalışacağını varsaymayın. T.C. vatandaşları için MüzeKart, yabancı ziyaretçiler için MuseumPass ürünleri ayrı koşullara sahiptir.",
    language:
      "Turistik merkezlerde İngilizceyle ilerlemek kolaylaşır; kırsal rota ve küçük işletmelerde Türkçe adres ile telefon kaydetmek daha kullanışlıdır. Bayram, cuma namazı, pazar günü ve mevsimlik işletme düzeni çalışma saatini etkileyebilir.",
    languageLabel: "Türkçe",
    connectivity:
      "Türkiye içinde kendi hattınız çoğu rotada yeterlidir; dağ, kanyon, koy ve yaylada kapsama kesilebilir. Belediye ulaşım uygulaması veya resmî web sayfası, TCDD Taşımacılık ve kullandığınız havayolunun uygulaması pratik araçlardır. Bilet, otel adresi ve çevrimdışı haritayı önceden indirin; sosyal medyadaki sefer ekran görüntüsünü güncel tarife sanmayın.",
    budgetFrame:
      "Ekonomik planda pansiyon/hostel, esnaf lokantası, belediye ulaşımı ve seçilmiş müze; orta bütçede merkezî otel, düzenli restoran ve bir ücretli aktivite; rahat planda butik/resort konaklama, özel transfer ve uzun akşam yemeği öne çıkar. TL fiyatları, bayram ve yaz hafta sonlarında hızlı değiştiğinden sabit günlük rakam yerine konaklama, ulaşım, öğün ve aktiviteyi ayrı ayrı güncel tekliflerle toplayın.",
    sources: [
      { name: "GoTürkiye — tüm destinasyonlar", url: "https://goturkiye.com/all-turkiye-destinations" },
      { name: "Kültür ve Turizm Bakanlığı — MüzeKart", url: "https://muze.gov.tr/MuseumPass" },
      { name: "TCDD Taşımacılık", url: "https://www.tcddtasimacilik.gov.tr/" },
    ],
  },
  GB: {
    country: "Birleşik Krallık",
    entry:
      "Türkiye, Birleşik Krallık'ın vizeye tabi ülke listesinde yer alır. Umuma mahsus Türk pasaportuyla turistik ziyaret öncesinde Standard Visitor vizesi gerekir; ETA bunun yerine geçmez. Başvuru çevrimiçi yapılır ve çoğu standart ziyaret izni tek seferde en fazla altı aylık kalış içindir.",
    payments:
      "Sterlinle temassız ödeme neredeyse her yerde kullanılır; yine de küçük pazar ve kırsal park alanları için az miktarda nakit yararlıdır. Restoranda discretionary service charge eklenmişse ikinci kez aynı oranda bahşiş bırakmanız beklenmez. Terminalde TL yerine GBP seçmek kur maliyetini daha görünür tutar.",
    language:
      "İngilizce her yerde yeterlidir; İskoçça, Galce ve İrlandaca isimler tabelalarda karşınıza çıkabilir. İngiltere, İskoçya, Galler ve Kuzey İrlanda'nın toplu taşıma, resmî tatil ve yerel kart düzenlerini tek sistem sanmayın.",
    languageLabel: "İngilizce · yerel diller",
    connectivity:
      "Türkiye hattı Birleşik Krallık'ta ev tarifesi gibi çalışmaz; operatör paketi, veri eSIM'i veya yerel ön ödemeli hat seçeneğini karşılaştırın. Tren için National Rail, Londra'da TfL, diğer şehirlerde yerel işletmenin resmî uygulaması; hava ve doğa günlerinde Met Office işe yarar. Citymapper yalnız desteklediği kentte yardımcıdır; son sefer ve grev bilgisinde resmî operatör duyurusu üstündür.",
    budgetFrame:
      "Ekonomik planda hostel/merkez dışı oda, meal deal veya pazar öğünü, yürüyüş ve ücretsiz müzeler; orta bütçede merkezî oda, pub/restoran ve bir ücretli ziyaret; rahat planda iyi konumlu otel, taksi ve tiyatro/tadım öne çıkar. Advance tren ve hafta içi konaklama büyük fark yaratır; maç, festival ve cuma–cumartesi için sabit sterlin tahmini kısa sürede geçersizleşebilir.",
    sources: [
      { name: "VisitBritain — destinasyonlar", url: "https://www.visitbritain.com/en/destinations" },
      { name: "VisitBritain — Britanya'da ulaşım", url: "https://www.visitbritain.com/en/plan-your-trip/travelling-around-britain" },
      { name: "GOV.UK — Visitor kuralları", url: "https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-v-visitor" },
      { name: "GOV.UK — vizeye tabi ülke listesi", url: "https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-visitor-visa-national-list" },
      { name: "National Rail — yolculuk planlama", url: "https://www.nationalrail.co.uk/" },
    ],
  },
} as const;

const toPlaces = (items: PlaceInput[]): PlaceCard[] =>
  items.map(([name, area, known, why, price, tip]) => ({ name, area, known, why, price, tip }));

const toItinerary = (items: DayInput[]): ItineraryDay[] =>
  items.map(([title, morning, afternoon, evening]) => ({ title, morning, afternoon, evening }));

const toTips = (items: TipInput[]): PracticalTip[] =>
  items.map(([title, body]) => ({ title, body }));

const toFaqs = (items: FaqInput[]): Faq[] => items.map(([q, a]) => ({ q, a }));

const toRelated = (items: RelatedInput[]): RelatedGuide[] =>
  items.map(([city, anchor, description]) => ({ city, anchor, description }));

export function makeExpandedGuide(profile: ExpandedGuideProfile): CityGuide {
  const shared = countryResearch[profile.countryCode];
  const titleSeed = [...profile.city].reduce((sum, character) => sum + (character.codePointAt(0) ?? 0), 0);
  const seoTitles = [
    `${profile.city} Gezi Rehberi: ${profile.searchFocus}`,
    `${profile.city} Rehberi — ${profile.searchFocus}`,
    `${profile.city}: ${profile.searchFocus} Gezi Rehberi`,
  ];
  const seoTitle = seoTitles[titleSeed % seoTitles.length];
  const metaLead = `${profile.city} gezi rehberi: ${profile.lede}`.replace(/\s+/g, " ").trim();
  const seoDescription =
    metaLead.length <= 158
      ? metaLead
      : `${metaLead.slice(0, 157).replace(/\s+\S*$/, "").replace(/[,:;–—-]+$/, "")}…`;
  const timezone =
    profile.countryCode === "TR"
      ? "UTC+3"
      : profile.countryCode === "GB"
        ? "GMT · yazın BST"
        : ["Tenerife", "Gran Canaria"].includes(profile.city)
          ? "WET · yazın WEST"
          : "CET · yazın CEST";

  return {
    city: profile.city,
    countryCode: profile.countryCode,
    seoTitle,
    seoDescription,
    h1: `${profile.city} Gezi Rehberi`,
    lede: profile.lede,
    quickFacts: [
      { label: "Ülke", value: shared.country },
      { label: "İdeal süre", value: profile.idealDays },
      { label: "Varış", value: profile.arrival },
      { label: "Şehir içi", value: profile.gettingAround },
      { label: "En iyi dönem", value: profile.bestTime },
      { label: "Para", value: profile.countryCode === "GB" ? "Sterlin · kart yaygın" : profile.countryCode === "ES" ? "Avro · kart yaygın" : "TL · kart + nakit" },
      { label: "Dil", value: shared.languageLabel },
      { label: "Saat dilimi", value: timezone },
    ],
    sections: [
      {
        heading: `${profile.city} nasıl bir yer? Rotayı doğru kurmak`,
        id: "rota-omurgasi",
        body: profile.character,
      },
      {
        heading: `${profile.city}'ta gezilecek yerler`,
        id: "gezilecek-yerler",
        body: [
          `Listeyi haritadaki yakınlığa göre kümelendirmek, ${profile.city}'ta aynı yolu tekrar yürümeyi ve günün iyi ışığını transferde harcamayı önler. Biletli büyük durakları sabitleyin; meydan, park, pazar ve kıyı yürüyüşlerini aralara yerleştirin.`,
        ],
        subsections: profile.highlights.map(([heading, text]) => ({ heading, body: [text] })),
      },
      {
        heading: "Semt semt gezi ve konaklama kararı",
        id: "semtler-konaklama",
        body: profile.neighborhoods,
        subsections: [{ heading: "Nerede kalınır?", body: profile.stay }],
      },
      {
        heading: `${profile.city} yeme içme rehberi`,
        id: "yeme-icme",
        body: profile.cuisine,
      },
      {
        heading: "Havalimanı, tren ve şehir içi ulaşım",
        id: "ulasim",
        body: [profile.arrival, profile.gettingAround, shared.payments],
      },
      {
        heading: "Kahve, gece hayatı, alışveriş ve yerel ritim",
        id: "gece-kahve-alisveris",
        body: profile.nightlifeShopping,
      },
      ...(profile.football
        ? [
            {
              heading: `${profile.city}'ta futbol ve maç günü`,
              id: "futbol-mac-gunu",
              body: profile.football,
            },
          ]
        : []),
      {
        heading: "Günübirlik geziler ve rotayı büyütmek",
        id: "gunubirlik-geziler",
        body: profile.dayTrips,
      },
      {
        heading: "Ne zaman gidilir? Mevsim ve kalabalık hesabı",
        id: "ne-zaman-gidilir",
        body: profile.seasons,
      },
      {
        heading: "Bütçe nasıl yönetilir?",
        id: "butce",
        body: [...profile.budget, shared.budgetFrame],
      },
      {
        heading: "Telefon, internet ve gerçekten işe yarayan uygulamalar",
        id: "telefon-uygulamalar",
        body: [shared.connectivity],
      },
      {
        heading: "Güvenlik, giriş kuralları ve sık yapılan hatalar",
        id: "guvenlik-kurallar-hatalar",
        body: [shared.entry, shared.language, ...profile.avoid],
      },
    ],
    places: toPlaces(profile.places),
    itinerary: toItinerary(profile.itinerary),
    practicalHeading: `${profile.city}'ta bilmeden gitmemeniz gerekenler`,
    practicalTips: toTips(profile.practical),
    faqs: toFaqs(profile.faqs),
    relatedGuides: toRelated(profile.related),
    sources: [
      { name: profile.sourceName, url: profile.sourceUrl },
      ...(profile.transportSource ? [profile.transportSource] : []),
      ...shared.sources,
    ],
    volatileNote:
      "Müze ve işletme saatleri, etkinlik takvimi, ulaşım tarifeleri ve giriş ücretleri dönemsel olarak değişir. Rezervasyon gerektiren yerleri yalnız resmî kanaldan, ziyaret gününe yakın yeniden kontrol edin.",
    reviewed: "2026-08-12",
  };
}

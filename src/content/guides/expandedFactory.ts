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
  countryCode: "ES" | "TR" | "GB" | "ID" | "CN" | "NL" | "AT" | "PT" | "DE" | "MX" | "BR" | "AR" | "CA" | "CH" | "BE" | "HU" | "CZ" | "PL" | "RU";
  /** Bir ülkenin birden fazla saat dilimi olduğunda destinasyon bazında kullanılır. */
  timezone?: string;
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
  ID: {
    country: "Endonezya",
    entry:
      "Türk vatandaşlarının güncel e-VOA/VOA uygunluğu, kalış süresi ve giriş noktaları Endonezya Göç İdaresi'nin resmî eVisa portalından yolculuk öncesinde kontrol edilmelidir. Pasaportun ülkeye giriş tarihinde en az altı ay geçerli olması ve dönüş ya da devam bileti istenebilir. Acente görünümlü kopya siteler yerine yalnız resmî uzantıyı kullanın; ada içi uçuşlarda da pasaportu yanınızda taşıyın.",
    payments:
      "Endonezya rupisiyle kart kullanımı Jakarta, Bali ve büyük otellerde yaygınlaşsa da pazar, warung, tekne iskelesi ve uzak adalarda nakit hâlâ önemlidir. ATM'yi banka şubesi veya güvenli kapalı alanda kullanın; terminal TL önerirse rupiyi seçin. QRIS yerel hayatta çok yaygındır fakat yabancı banka uygulaması her QR'ı çalıştırmayabilir.",
    language:
      "Bahasa Indonesia ülke genelinde ortak dildir; Bali dili, Cava dili, Sundaca ve yüzlerce yerel dil günlük yaşamda sürer. Turistik merkezlerde İngilizceyle ilerlenir, uzak köy ve iskelelerde adresi Bahasa Indonesia olarak kaydetmek işleri kolaylaştırır. Tapınak, köy ve tören alanlarında kıyafet ile fotoğraf kurallarına yerel yönlendirme üzerinden uyun.",
    languageLabel: "Bahasa Indonesia · yerel diller",
    connectivity:
      "Büyük adalarda yerel SIM/eSIM ve 4G/5G yeterli olabilir; deniz geçişi, dağ, milli park ve Raja Ampat gibi uzak rotalarda kapsama hızla kesilir. Grab ve Gojek hizmet alanı şehirden şehre değişir. Uçuş için resmî havayolu, tren için KAI Access; hava ve volkan uyarıları için BMKG ile MAGMA Indonesia duyurularını izleyin. Çevrimdışı harita, otel adresi ve bilet ekran görüntüsü indirin.",
    budgetFrame:
      "Ekonomik planda aile işletmesi konaklama, warung, paylaşımlı tekne ve yerel transfer; orta bütçede iyi konumlu butik otel, özel sürücülü birkaç gün ve küçük grup turu; rahat planda iç hat uçuşu, özel tekne ve resort öne çıkar. Bali dışı adalar ucuz görünse de son kilometre teknesi, rehber ve bagaj ücretleri toplamı büyütebilir; fiyatı kişi başı mı araç/tekne başı mı olduğunu yazılı sorun.",
    sources: [
      { name: "Indonesia Travel — resmî destinasyon rehberi", url: "https://www.indonesia.travel/gb/en/destination" },
      { name: "Endonezya Göç İdaresi — resmî eVisa portalı", url: "https://evisa.imigrasi.go.id/" },
      { name: "KAI — Endonezya demiryolları", url: "https://www.kai.id/" },
      { name: "BMKG — hava, deprem ve erken uyarılar", url: "https://www.bmkg.go.id/" },
    ],
  },
  CN: {
    country: "Çin",
    entry:
      "Umuma mahsus Türk pasaportuyla Çin ana karasına turistik seyahat için kural olarak önceden vize gerekir. Türkiye'deki Çin Vize Başvuru Merkezi, bireysel turistik başvuruların güncel kabul yönteminin yerel seyahat acenteleri üzerinden yürüyebileceğini belirtiyor; başvuru biçimini satın alma yapmadan önce resmî merkezden doğrulayın. Ağustos 2026 tarihli 240 saatlik vizesiz transit ülke listesinde Türkiye yer almıyor; bu istisnayı kullanabileceğinizi varsaymayın.",
    payments:
      "Alipay ve WeChat Pay günlük ödemede baskındır; yabancı kart bağlama desteği bulunur fakat banka onayı, kimlik doğrulaması, işlem limiti ve küçük işletme kabulü değişebilir. Visa/Mastercard büyük otellerde daha olası, sokak düzeyinde sınırlıdır. Yedek bir mobil cüzdan, fiziksel kart ve ölçülü miktarda renminbi nakit taşıyın; her sistemi daha Türkiye'deyken küçük bir işlemle test edin.",
    language:
      "Standart Mandarin ortak dildir; Kantonca ve çok sayıda bölgesel dil gündelik hayatta güçlüdür. İngilizce turistik merkez dışında sınırlı kalabilir. Otel adı, istasyon, yemek kısıtı ve dönüş adresini Çince karakterlerle çevrimdışı kaydedin; yalnız Latin harfli yer adına güvenmeyin.",
    languageLabel: "Mandarin · bölgesel diller",
    connectivity:
      "Google, WhatsApp ve bazı küresel servisler Çin ana karasında olağan biçimde çalışmayabilir. Yerel mevzuata uygun bağlantı seçeneklerini operatörünüzden önceden öğrenin; çevrimdışı harita, çeviri paketi, tren bileti ve otel adresi indirin. Tren için resmî Railway 12306, şehir içi için yerel metro uygulaması ve harita olarak Çin'de çalışan bir servis kullanın; pasaportla gerçek ad doğrulaması gerekebilir.",
    budgetFrame:
      "Ekonomik planda metro, hızlı trenin uygun sınıfı, yerel lokanta ve merkez dışı otel; orta bütçede merkezî konaklama, seçilmiş hızlı tren/uçuş ve birkaç biletli gösteri; rahat planda özel transfer, yüksek hızlı trenin üst sınıfı ve uluslararası otel öne çıkar. Ulusal tatil ile festival haftaları ulaşım ve oda fiyatlarını sert biçimde yükseltir; tek günlük rakamdan çok şehirler arası bilet, giriş ve konaklamayı ayrı bütçeleyin.",
    sources: [
      { name: "Çin Ulusal Göç İdaresi — 240 saat transit politikası", url: "https://www.nia.gov.cn/n741440/n741577/c1731205/content.html" },
      { name: "Çin Vize Başvuru Merkezi — İstanbul", url: "https://bio.visaforchina.cn/IST3_EN" },
      { name: "China Railway 12306 — resmî bilet", url: "https://www.12306.cn/en/index.html" },
      { name: "Çin Kültür ve Turizm Bakanlığı", url: "https://www.mct.gov.cn/" },
    ],
  },
  NL: {
    country: "Hollanda",
    entry:
      "Umuma mahsus Türk pasaportuyla kısa turistik seyahat için Schengen vizesi gerekir; kişisel pasaport istisnası ve belge listesi NetherlandsWorldwide üzerinden kontrol edilmelidir. Türkiye'den başvurular yetkili merkez üzerinden yapılır; başvuru en erken altı ay önce ve genel olarak seyahatten en geç 45 gün önce verilebilir. Vize 180 gün içinde en fazla 90 gün kalış kuralını aşma hakkı vermez.",
    payments:
      "Banka kartı ve temassız ödeme çok yaygındır; bazı küçük işletmeler yalnız Maestro/V Pay veya yerel kart düzenini tercih edebilir. Bir yedek kart ile az miktarda avro taşıyın. OVpay'de aynı fiziksel ya da dijital kartla giriş ve çıkış yapmak gerekir; telefonla girip fiziksel kartla çıkmak iki ayrı yolculuk sayılabilir.",
    language:
      "Felemenkçe resmî ve günlük dildir; İngilizceyle hemen her turistik durumda rahat ilerlenir. Friesland'da Frizce, Limburg'da bölgesel lehçeler görünür. Bisiklet yolu, sessiz vagon ve toplu taşıma görgü kurallarını İngilizce iletişim kolaylığı kadar ciddiye alın.",
    languageLabel: "Felemenkçe · İngilizce yaygın",
    connectivity:
      "Türkiye hattı AB dolaşımına otomatik dahil değildir; operatör paketi veya eSIM karşılaştırın. Ülke çapında tren için NS, tüm toplu taşıma bağlantıları için 9292 ve yerel işletme uygulamaları çalışır. OVpay ile banka kartı kullanıyorsanız her aktarmada cihaz talimatını okuyun; bakım ve grev günlerinde uygulamadaki canlı duyuru planlayıcıdan daha önemlidir.",
    budgetFrame:
      "Ekonomik planda hostel/merkez dışı oda, süpermarket–pazar öğünü, OVpay ve ücretsiz yürüyüş; orta bütçede merkezî oda, müze kartı hesabı ve bir iyi restoran; rahat planda kanal manzaralı otel, taksi ve özel tur öne çıkar. Amsterdam konaklaması ile bahar lale haftaları ülke ortalamasını yanıltır; Utrecht, Haarlem, Leiden veya Rotterdam'ı üs yapmak hem bütçeyi hem günü dengeleyebilir.",
    sources: [
      { name: "Holland.com — resmî Hollanda turizm portalı", url: "https://www.holland.com/global/tourism.htm" },
      { name: "NetherlandsWorldwide — Türkiye'den Schengen vizesi", url: "https://www.netherlandsworldwide.nl/visa-the-netherlands/schengen-visa/apply-turkiye" },
      { name: "NS — banka kartıyla OVpay", url: "https://www.ns.nl/en/travel-information/check-in-check-out/debit-card" },
      { name: "9292 — ülke çapında yolculuk planlama", url: "https://9292.nl/en" },
    ],
  },
  AT: {
    country: "Avusturya",
    entry:
      "Umuma mahsus Türk pasaportuyla kısa turistik ziyaret için Schengen vizesi gerekir; pasaport türüne bağlı istisnayı resmî temsilcilikten doğrulayın. EES 10 Nisan 2026'dan beri dış sınırda biyometrik giriş–çıkış kaydı tutuyor; ETIAS ise 2026'nın son çeyreğinden önce başlamayacak ve Schengen vizesinin yerine geçmeyecek.",
    payments:
      "Avro kullanılır. Kart şehirlerde yaygın olsa da dağ kulübesi, küçük pansiyon, pazar ve kırsal otopark için nakit yararlıdır. Terminal TL önerirse avroyu seçin; restoranda servis dahilse yalnız memnuniyet ölçüsünde yuvarlama yeterlidir.",
    language:
      "Almanca resmî dildir; turistik şehirlerde İngilizceyle ilerlemek kolaydır. Tirol, Salzburg gölleri ve kırsal vadilerde yer adını Almanca kaydetmek, son otobüs ve teleferik duyurularını anlamayı kolaylaştırır.",
    languageLabel: "Almanca · İngilizce turistik bölgelerde yaygın",
    connectivity:
      "Türkiye hattı AB dolaşımına otomatik girmez. Tren ve bölgesel otobüs için ÖBB, Viyana'da Wiener Linien; dağ günlerinde ilgili teleferik ve eyalet ulaşım kurumunun resmî duyurusu kullanılmalıdır. Bilet ekranını ve konaklama adresini çevrimdışı saklayın.",
    budgetFrame:
      "Ekonomik planda tren ön alımı, pansiyon, market–fırın öğünü ve ücretsiz yürüyüş; orta bütçede merkezî oda, müze ve bir dağ hattı; rahat planda iyi konumlu otel, teleferik, spa ve restoran öne çıkar. Kayak, festival ve Noel pazarı haftalarında oda ile tren fiyatını ayrı ayrı güncelleyin.",
    sources: [
      { name: "Austria.info — resmî destinasyon rehberi", url: "https://www.austria.info/en/" },
      { name: "AB Türkiye Delegasyonu — Schengen vizesi", url: "https://www.eeas.europa.eu/delegations/t%C3%BCrkiye/visa_en" },
      { name: "Avrupa Komisyonu — EES ve ETIAS", url: "https://home-affairs.ec.europa.eu/news/main-differences-between-ees-and-etias-what-travellers-need-know-2026-04-28_en" },
      { name: "ÖBB — Avusturya tren bağlantıları", url: "https://www.oebb.at/en/reiseplanung-services/oebb-zugverbindungen/zugverbindungen-oesterreich" },
    ],
  },
  PT: {
    country: "Portekiz",
    entry:
      "Umuma mahsus Türk pasaportuyla kısa turistik ziyaret için Schengen vizesi gerekir. Başvuruyu en uzun kalacağınız ülkeye yapın; EES dış sınırda biyometrik giriş–çıkış kaydı tutar. ETIAS vizeye tabi Türk pasaportunun yerine geçen bir izin değildir.",
    payments:
      "Avro kullanılır; kart Lizbon, Porto ve turistik adalarda yaygındır. Küçük tasca, pazar, kırsal otobüs ve otopark için nakit tutun. Bazı ATM'ler ek ücret gösterebilir; işlemi onaylamadan toplamı okuyun ve TL dönüşümünü reddedin.",
    language:
      "Portekizce ülke genelinde yeterlidir; İngilizce turistik merkezlerde yaygındır. Madeira ve Azorlar'da yerel telaffuz farklılaşabilir; feribot, yürüyüş ve hava duyurusunda resmî Portekizce adı kaydedin.",
    languageLabel: "Portekizce · İngilizce turistik bölgelerde yaygın",
    connectivity:
      "Şehirler arası tren için CP, Lizbon'da Carris/Metro, Porto'da Metro do Porto; Madeira ve Azorlar'da yerel otobüs ile hava yolu kaynaklarını kullanın. Ada ve kıyı rotasında rüzgâr, dalga ve yol kapanışını aynı gün resmî kanaldan kontrol edin.",
    budgetFrame:
      "Ekonomik planda hostel/pansiyon, tasca, tren ön alımı ve ücretsiz miradouro; orta bütçede merkezî oda, bir iyi deniz ürünü yemeği ve seçilmiş müze; rahat planda butik otel, özel transfer ve tekne turu öne çıkar. Lizbon, Algarve ve ada uçuşlarında yüksek sezon fiyatı ülke ortalamasını aşar.",
    sources: [
      { name: "Visit Portugal — resmî turizm portalı", url: "https://www.visitportugal.com/en" },
      { name: "AB Türkiye Delegasyonu — Schengen vizesi", url: "https://www.eeas.europa.eu/delegations/t%C3%BCrkiye/visa_en" },
      { name: "CP — Portekiz demiryolları", url: "https://www.cp.pt/passageiros/en" },
      { name: "Visit Portugal — trenle Portekiz", url: "https://www.visitportugal.com/en/content/portugal-train" },
    ],
  },
  DE: {
    country: "Almanya",
    entry:
      "Umuma mahsus Türk pasaportuyla kısa turistik ziyaret için Schengen vizesi gerekir. Başvuru ana destinasyona yapılmalı; EES 10 Nisan 2026'dan beri kısa süreli ziyaretçilerin dış sınır geçişlerini biyometrik olarak kaydediyor. ETIAS, Türk vatandaşının Schengen vizesi yerine kullanabileceği bir belge değildir.",
    payments:
      "Avro kullanılır. Kart ve temassız ödeme yaygınlaşmış olsa da küçük fırın, pazar, bira bahçesi ve kırsal işletmelerde nakit istenebilir. Restoranda servis dahildir; iyi hizmette yuvarlama veya yaklaşık yüzde 5–10 yaygındır.",
    language:
      "Almanca resmî dildir; büyük şehirlerde İngilizceyle ilerlenir. Bölgesel tren değişikliği, peron ve yedek otobüs duyuruları Almanca olabilir; sefer numarası ile istasyon adını çevrimdışı saklayın.",
    languageLabel: "Almanca · İngilizce büyük şehirlerde yaygın",
    connectivity:
      "Deutsche Bahn uygulaması uzun mesafe ve bölgesel tren için temel araçtır; her şehirde yerel ulaşım birliği ayrıca çalışır. Deutschlandticket kuralları ve geçerlilik alanı değişebileceğinden hızlı ICE/IC trenlerini kapsadığını varsaymayın. Grev ve hat çalışmasında resmî canlı duyuruyu izleyin.",
    budgetFrame:
      "Ekonomik planda hostel, fırın/market öğünü, bölgesel ulaşım ve ücretsiz müze zamanı; orta bütçede merkezî oda, bir ICE bağlantısı ve ücretli koleksiyon; rahat planda iyi otel, esnek tren bileti ve uzun akşam yemeği öne çıkar. Fuar, Oktoberfest, maç ve Noel pazarı tarihleri konaklamayı sert yükseltir.",
    sources: [
      { name: "Germany Travel — resmî turizm portalı", url: "https://www.germany.travel/en/home.html" },
      { name: "AB Türkiye Delegasyonu — Schengen vizesi", url: "https://www.eeas.europa.eu/delegations/t%C3%BCrkiye/visa_en" },
      { name: "Deutsche Bahn — resmî tren planlama", url: "https://int.bahn.de/en" },
      { name: "Germany Travel — Almanya'da tren yolculuğu", url: "https://www.germany.travel/en/inspiring-germany/rail-travel.html" },
    ],
  },
  MX: {
    country: "Meksika",
    entry:
      "Türk umuma mahsus bordo pasaport sahipleri, yalnız hava yoluyla ve SAE sistemine katılan bir havayoluyla geliyorsa ücretsiz elektronik izin kullanabilir; izin tek girişli ve düzenlendiği tarihten itibaren 30 gün geçerlidir. Kara veya deniz girişinde ya da SAE uygun değilse konsolosluk vizesi gerekir. Geçerli çok girişli ABD, Kanada, Japonya, Birleşik Krallık veya Schengen vizesi ya da belirli daimi oturumlar ayrı muafiyet sağlayabilir; seyahat öncesi Meksika'nın resmî temsilciliğinden doğrulayın.",
    payments:
      "Meksika pesosu kullanılır. Büyük şehir ve otellerde kart yaygın, pazar, colectivo, küçük lokanta ve uzak köyde nakit önemlidir. ATM'yi banka şubesi içinde kullanın; terminalin TL veya dolar dönüşümünü reddedip pesoyu seçin. Restoranda servis dahil değilse yüzde 10–15 bahşiş yaygındır.",
    language:
      "İspanyolca ülke genelinde çalışır; Maya, Zapotek ve başka yerli diller bölgesel olarak yaşar. Turistik kıyıda İngilizce yaygındır, iç bölgede adres ve otobüs terminalini İspanyolca kaydetmek gerekir.",
    languageLabel: "İspanyolca · yerli diller",
    connectivity:
      "Şehirler arası otobüste yalnız resmî işletme ve terminali kullanın; ADO güneydoğuda güçlüdür. Tren Maya güzergâhı ve bağlantıları 2026'da gelişmeye devam ettiği için istasyon–şehir transferini ayrı doğrulayın. Çevrimdışı harita, konaklama adresi ve acil numaraları indirin.",
    budgetFrame:
      "Ekonomik planda otobüs, merkez dışı oda, mercado ve yerel lokanta; orta bütçede butik otel, seçilmiş iç hat ve küçük grup turu; rahat planda kıyı tesisi, özel transfer ve rehberli arkeoloji günü öne çıkar. Riviera Maya, Los Cabos ve festival dönemleri ülke ortalamasından belirgin pahalıdır.",
    sources: [
      { name: "Visit Mexico — resmî destinasyon portalı", url: "https://visitmexico.com/en/" },
      { name: "Meksika İstanbul Başkonsolosluğu — Türk vatandaşları için elektronik vize", url: "https://consulmex.sre.gob.mx/estambul/index.php/consular-services" },
      { name: "Tren Maya — resmî yolcu bilgileri", url: "https://trenmaya.gob.mx/" },
      { name: "ADO — resmî otobüs bileti", url: "https://international.ado.com.mx/?locale=en" },
    ],
  },
  BR: {
    country: "Brezilya",
    entry:
      "Brezilya Dışişleri Bakanlığı'nın güncel VIVIS muafiyet listesinde Türkiye yer alır; kısa turistik ziyarette vize aranmaz. İzin verilen kalış, pasaport geçerliliği, dönüş bileti ve olası sağlık koşullarını yolculuk öncesi resmî konsolosluk kaynağından doğrulayın; vize muafiyeti sınırda otomatik giriş garantisi değildir.",
    payments:
      "Brezilya reali kullanılır. Kart ve temassız ödeme şehirlerde çok yaygındır; pazar, plaj satıcısı, küçük tekne ve uzak doğa rotası için sınırlı nakit taşıyın. ATM'yi banka/alışveriş merkezi içinde kullanın; dinamik kur dönüşümünde reali seçin. Restoranda yüzde 10 servis çoğu kez hesaba eklenir.",
    language:
      "Portekizce günlük iletişimin anahtarıdır; İspanyolca aynı dil değildir. Rio ve São Paulo'da İngilizce bazı turistik hizmetlerde çalışır, Amazon ve iç bölgelerde adres, sağlık ihtiyacı ve tur ayrıntısını Portekizce yazılı saklayın.",
    languageLabel: "Brezilya Portekizcesi",
    connectivity:
      "Ülke ölçeği nedeniyle iç hat uçuşu sık gerekir; şehirler arası otobüste ANTT yetkili işletmesini ve resmî terminali doğrulayın. Amazon, Pantanal ve Lençóis rotasında telefon kesilebilir; lisanslı rehber, uydu/acil durum planı ve çevrimdışı belge bulundurun.",
    budgetFrame:
      "Ekonomik planda pousada/hostel, kilo restoranı, belediye ulaşımı ve ücretsiz sahil; orta bütçede iyi konumlu otel, bir iç hat uçuşu ve küçük grup doğa turu; rahat planda özel transfer, lodge ve rehber öne çıkar. Karnaval, yılbaşı ve okul tatilinde uçuş ile oda fiyatını erken sabitleyin.",
    sources: [
      { name: "Visit Brasil — resmî turizm portalı", url: "https://visitbrasil.com/en/" },
      { name: "Brezilya Dışişleri — VIVIS muafiyet listesi", url: "https://www.gov.br/mre/pt-br/embaixada-manama/setor-consular/servicos/vistos/do-i-need-a-visa-1/list-of-countries-exempt-from-vivis-do-not-need-a-visit-visa" },
      { name: "ANTT — şehirler arası yolcu taşımacılığı", url: "https://www.gov.br/antt/pt-br/assuntos/passageiros" },
    ],
  },
  AR: {
    country: "Arjantin",
    entry:
      "Arjantin Göç İdaresi'nin güncel ülke tablosunda Türk umuma mahsus pasaport sahipleri turistik ziyaret için vizeden muaftır. İzin verilen kalış süresini, pasaport ve dönüş/konaklama belgelerini bilet almadan önce resmî göç kaynağından doğrulayın; komşu ülkeye çıkıp dönüşte yeni süre verileceğini varsaymayın.",
    payments:
      "Arjantin pesosu kullanılır; kur ve fiyatlar hızlı değişebilir. Kart şehirlerde yaygınlaşsa da küçük işletme, taksi, uzak park ve bahşiş için nakit gerekir. Yasal döviz ve ödeme kurallarını güncel kaynaktan kontrol edin; sokak dövizcisi ve bilinmeyen bağlantılardan kaçının.",
    language:
      "İspanyolca ana dildir; Rioplatense telaffuzu ve vos kullanımı özellikle Buenos Aires'te belirgindir. Patagonya ve kuzeyde son otobüs, park kapısı ve tur toplantı noktasını İspanyolca kaydedin.",
    languageLabel: "İspanyolca",
    connectivity:
      "Buenos Aires ve birçok şehirde SUBE kartı otobüs, metro veya tren için kullanılır; kapsama ve satın alma noktası şehre göre değişir. Patagonya ile kuzeybatıda uzun mesafe uçuş/otobüsleri ayrı gün sayın. Park, yürüyüş ve sınır geçişi için çevrimdışı harita ile resmî hava duyurusu indirin.",
    budgetFrame:
      "Ekonomik planda hostel, menú del día, SUBE ve ücretsiz parkurlar; orta bütçede merkezî oda, iç hat uçuşu ve grup turu; rahat planda estancia/lodge, özel transfer ve tadım öne çıkar. Enflasyon nedeniyle eski bloglardaki peso veya dolar günlük bütçesini kullanmayın; uçuş, oda, öğün ve aktiviteyi rezervasyon gününde ayrı fiyatlandırın.",
    sources: [
      { name: "Visit Argentina — resmî turizm portalı", url: "https://www.argentina.travel/en" },
      { name: "Arjantin Göç İdaresi — vize ülke tablosu", url: "https://www.migraciones.gov.ar/accesible/indexdnm.php?visas=" },
      { name: "SUBE — resmî ulaşım kartı", url: "https://www.argentina.gob.ar/sube" },
    ],
  },
  CA: {
    country: "Kanada",
    entry:
      "Türkiye, Kanada'nın vizeye tabi ülkeler listesinde yer alır; umuma mahsus Türk pasaportuyla turistik ziyaret veya transit için geçerli ziyaretçi vizesi gerekir. eTA, Türk vatandaşları için ziyaretçi vizesinin genel alternatifi değildir. Başvuru, biyometri ve işlem süresini yalnız IRCC üzerinden kontrol edin.",
    payments:
      "Kanada doları kullanılır; kart ve temassız ödeme çok yaygındır. Bazı terminal ve oteller geçici provizyon alabilir. Restoranda vergi fiyat etiketine sonradan eklenir ve masa servisinde vergi öncesi yüzde 15–20 bahşiş yaygındır; otomatik service charge varsa ikinci kez bırakmayın.",
    language:
      "İngilizce ve Fransızca federal resmî dillerdir. Québec'te Fransızca kamusal yaşamın merkezindedir; turistik noktalarda İngilizce çoğunlukla çalışır. Yerli toprakları ve topluluk adlarını yerel yazımıyla kullanın; ziyaret kurallarını doğrudan topluluk veya park kaynağından öğrenin.",
    languageLabel: "İngilizce · Fransızca",
    connectivity:
      "Şehirler arası mesafe büyüktür; VIA Rail koridorlarda işe yarasa da Rockies, Yukon ve Atlantik için uçuş/araç gerekebilir. Milli parkta rezervasyon, yol durumu, yangın ve yaban hayatı duyurusu için Parks Canada ile eyalet kaynaklarını kullanın; çevrimdışı harita ve yakıt planı hazırlayın.",
    budgetFrame:
      "Ekonomik planda hostel, market, toplu taşıma ve ücretsiz şehir parkı; orta bütçede merkezî oda, tren/iç hat ve bir milli park günü; rahat planda iyi otel, kiralık araç ve rehberli doğa turu öne çıkar. Yaz, kayak, yaprak ve kuzey ışığı sezonlarında konaklama ile araç fiyatını çok erken kontrol edin.",
    sources: [
      { name: "Destination Canada — resmî gezi portalı", url: "https://travel.destinationcanada.com/en-ca" },
      { name: "IRCC — ülkeye göre giriş belgesi", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/entry-requirements-country.html" },
      { name: "Parks Canada — park planlama", url: "https://parks.canada.ca/" },
      { name: "VIA Rail — şehirler arası tren", url: "https://www.viarail.ca/en" },
    ],
  },
  CH: {
    country: "İsviçre",
    entry:
      "Umuma mahsus Türk pasaportuyla kısa turistik ziyaret için Schengen vizesi gerekir; İsviçre Schengen'e dahil olsa da AB üyesi değildir. Başvuruyu ana destinasyon kuralına göre yetkili resmî merkezden yapın. EES dış sınırda biyometrik giriş–çıkış kaydı tutar; ETIAS vizeye tabi Türk pasaportunun yerine geçmez.",
    payments:
      "İsviçre frangı kullanılır. Kart ve temassız ödeme çok yaygındır; küçük dağ kulübesi, pazar, kilitli dolap veya kırsal otomat için az miktarda frank yararlıdır. Bazı yerler avro kabul etse de para üstünü frankla ve zayıf kurla verebilir; terminalde CHF seçin.",
    language:
      "Almanca, Fransızca, İtalyanca ve Romanşça resmî dillerdir; bölge değiştikçe tabela ve duyuru dili de değişir. Turistik noktalarda İngilizce yaygındır. İstasyon ile dağ hattı adını yerel yazımıyla kaydetmek, aktarma ve son iniş duyurusunu izlemeyi kolaylaştırır.",
    languageLabel: "Almanca · Fransızca · İtalyanca · Romanşça",
    connectivity:
      "SBB uygulaması tren, otobüs, tekne ve birçok dağ bağlantısını tek planda gösterir; ancak teleferik, özel dağ treni ve koltuk rezervasyonu geçerliliğini ayrıca okuyun. Türkiye hattı İsviçre'de AB dolaşımına otomatik girmez. Dağ gününde MeteoSwiss, işletme durumu ve son iniş saatini aynı gün kontrol edin.",
    budgetFrame:
      "Ekonomik planda hostel, market öğünü, belediye çeşmesi ve ön alımlı ulaşım; orta bütçede merkezî oda, birkaç müze ve tek bir dağ hattı; rahat planda iyi otel, panoramik tren, teleferik ve uzun akşam yemeği öne çıkar. Swiss Travel Pass her rotada otomatik en ucuz seçenek değildir; Half Fare Card ve tek bilet toplamıyla karşılaştırın.",
    sources: [
      { name: "Switzerland Tourism — resmî destinasyon portalı", url: "https://www.myswitzerland.com/en/" },
      { name: "AB Türkiye Delegasyonu — Schengen vizesi", url: "https://www.eeas.europa.eu/delegations/t%C3%BCrkiye/visa_en" },
      { name: "SBB — resmî yolculuk planlama", url: "https://www.sbb.ch/en" },
      { name: "MeteoSwiss — resmî hava ve uyarılar", url: "https://www.meteoswiss.admin.ch/" },
    ],
  },
  BE: {
    country: "Belçika",
    entry:
      "Umuma mahsus Türk pasaportuyla kısa turistik ziyaret için Schengen vizesi gerekir. Türkiye'den başvurular, ana destinasyon kuralı doğrultusunda Belçika'nın yetkili resmî dış hizmet sağlayıcısı üzerinden yürütülür. EES dış sınır geçişini biyometrik kaydeder; ETIAS Türk vatandaşının Schengen vizesine alternatif değildir.",
    payments:
      "Avro kullanılır; kart ve temassız ödeme şehirlerde yaygındır. Küçük pazar, yerel etkinlik ve bazı tuvalet/emanet noktaları için bozuk para yararlı olabilir. Restoranda servis genellikle fiyata dahildir; olağanüstü hizmette küçük yuvarlama yeterlidir. Terminalde TL yerine avroyu seçin.",
    language:
      "Felemenkçe, Fransızca ve Almanca resmî dillerdir. Brüksel resmen iki dilli; Flandre'da Felemenkçe, Valonya'da Fransızca baskındır. İstasyonların iki adı olabilir: Bruxelles-Midi/Brussel-Zuid gibi. Biletteki yerel adı ve doğru garı birlikte kaydedin.",
    languageLabel: "Felemenkçe · Fransızca · Almanca",
    connectivity:
      "Şehirler arası tren için SNCB/NMBS kullanılır; rezervasyon gerekmeyen iç hatlarda bile doğru istasyon, ilk/ikinci sınıf ve etkinlik tarifesini okuyun. Brüksel'de STIB/MIVB, Flandre'da De Lijn, Valonya'da TEC ayrı işletmelerdir. Tek bir şehir kartının bütün ülkede geçerli olduğunu varsaymayın.",
    budgetFrame:
      "Ekonomik planda tren, hostel/merkez dışı oda, fırın ve ücretsiz meydan yürüyüşü; orta bütçede merkezî oda, seçilmiş müze ve bira/çikolata deneyimi; rahat planda butik otel, iyi restoran ve özel tur öne çıkar. Brüksel kurum takvimi, Brugge hafta sonu ve festival günleri konaklamayı hızla yükseltebilir.",
    sources: [
      { name: "Visit Flanders — resmî Flandre rehberi", url: "https://www.visitflanders.com/en" },
      { name: "Visit Wallonia — resmî Valonya rehberi", url: "https://visitwallonia.com/en-gb" },
      { name: "AB Türkiye Delegasyonu — Schengen vizesi", url: "https://www.eeas.europa.eu/delegations/t%C3%BCrkiye/visa_en" },
      { name: "SNCB/NMBS — resmî tren planlama", url: "https://www.belgiantrain.be/en" },
    ],
  },
  HU: {
    country: "Macaristan",
    entry:
      "Umuma mahsus Türk pasaportuyla kısa turistik ziyaret için Schengen vizesi gerekir. Türkiye'den başvuru, Macaristan'ın yetkilendirdiği resmî dış hizmet sağlayıcısı üzerinden ana destinasyon kuralına göre yapılır. EES dış sınırda biyometrik giriş–çıkış kaydı tutar; ETIAS vizeye tabi Türk pasaportunun yerine geçmez.",
    payments:
      "Macar forinti kullanılır; kart şehirlerde yaygındır fakat pazar, kırsal otobüs, küçük büfe ve bahşiş için nakit gerekebilir. Turistik merkezlerde avro fiyatı görülebilir ama kur elverişsiz olabilir. Banka ATM'si kullanın, bağımsız döviz bürosunun komisyonunu okuyun ve terminalde HUF seçin.",
    language:
      "Macarca günlük ve resmî dildir; İngilizce Budapeşte ile turistik merkezlerde daha yaygındır. Yer adları ve telaffuz ilk bakışta zor olabilir; otel, istasyon, termal banyo ve yemek kısıtını Macarca yazılı saklayın. Almanca batı sınırında ve turizmde yardımcı olabilir.",
    languageLabel: "Macarca · İngilizce turistik bölgelerde yaygın",
    connectivity:
      "Ülke içi tren ve birçok bölgesel otobüs için MÁV, Budapeşte'de BKK/BudapestGO temel kaynaklardır. HÉV banliyö hattı, havaalanı otobüsü ve ülke bileti farklı kurallara sahip olabilir. Balaton ile küçük şehirlerde son tren/otobüsü çevrimdışı kaydedin; bakım ve grev duyurusunda resmî canlı bilgiye öncelik verin.",
    budgetFrame:
      "Ekonomik planda pansiyon/hostel, günlük menü, toplu taşıma ve ücretsiz yürüyüş; orta bütçede merkezî oda, termal banyo, tren ve seçilmiş şarap deneyimi; rahat planda butik otel, taksi/özel transfer ve uzun akşam yemeği öne çıkar. Formula 1, Sziget, yılbaşı ve Balaton yazı fiyatları ülke ortalamasını aşar.",
    sources: [
      { name: "Visit Hungary — resmî destinasyon portalı", url: "https://visithungary.com/" },
      { name: "AB Türkiye Delegasyonu — Schengen vizesi", url: "https://www.eeas.europa.eu/delegations/t%C3%BCrkiye/visa_en" },
      { name: "MÁV — resmî tren ve otobüs bilgisi", url: "https://www.mavcsoport.hu/en" },
      { name: "BKK — Budapeşte toplu taşıması", url: "https://bkk.hu/en/" },
    ],
  },
  CZ: {
    country: "Çek Cumhuriyeti",
    entry:
      "Umuma mahsus Türk pasaportuyla kısa turistik ziyaret için Schengen vizesi gerekir; yeşil pasaport sahipleri kısa ve kazanç amacı taşımayan ziyaretlerde muafiyet koşullarını seyahat öncesinde resmî temsilcilikten doğrulamalıdır. Başvuruyu ana destinasyon kuralıyla yetkili vize merkezinden yapın; EES biyometrik giriş–çıkış kaydı tutar, ETIAS ise vize yerine geçmez.",
    payments:
      "Çek korunası kullanılır. Kart şehirlerde yaygın olsa da pazar, küçük kasaba, kırsal otobüs ve bahşiş için az miktarda CZK yararlıdır. Avro fiyatı çoğu zaman elverişsiz kurla çevrilir; banka ATM'sini, ekrandaki toplam komisyonu ve terminalde CZK seçeneğini kullanın.",
    language:
      "Çekçe resmî dildir; Prag ile turistik merkezlerde İngilizce daha yaygındır. Český Krumlov, Plzeň ve Kutná Hora gibi adları yerel yazımıyla kaydetmek peron ile durak ekranını okumayı kolaylaştırır. Slovakça anlaşılabilir olsa da iki dili aynı saymak yerine kısa Çekçe ifadeler kullanın.",
    languageLabel: "Çekçe · İngilizce turistik bölgelerde yaygın",
    connectivity:
      "České dráhy ülke trenlerinin önemli bölümünü, PID Lítačka Prag ve çevresini planlamada işe yarar; RegioJet ve Leo Express ayrı işletmelerdir. Bir bileti bütün operatörlerde geçerli sanmayın. Kaya parkı, kırsal kale ve kaplıca gününde son otobüsü, patika kapanışını ve çevrimdışı haritayı önceden kaydedin.",
    budgetFrame:
      "Ekonomik planda pansiyon/hostel, günlük menü, bölgesel tren ve ücretsiz merkez yürüyüşü; orta bütçede merkezî oda, iki müze ve bir kale/spa deneyimi; rahat planda butik otel, iyi restoran ve özel transfer öne çıkar. Prag hafta sonu ile Karlovy Vary etkinlik takviminde konaklama ülke ortalamasını aşabilir.",
    sources: [
      { name: "Visit Czechia — resmî destinasyon portalı", url: "https://www.visitczechia.com/en-us" },
      { name: "Çekya Ankara Büyükelçiliği — vize bilgisi", url: "https://mzv.gov.cz/ankara/en/visa_and_consular_information/visas/index.html" },
      { name: "České dráhy — resmî tren planlama", url: "https://www.cd.cz/en/" },
      { name: "CzechTourism — erişim ve rota planı", url: "https://www.visitczechia.com/en-us" },
    ],
  },
  PL: {
    country: "Polonya",
    entry:
      "Umuma mahsus Türk pasaportuyla kısa turistik ziyaret için Schengen vizesi gerekir. Başvuruyu yalnız Polonya'nın Türkiye'deki resmî temsilciliği ve yetkili VFS kanalı üzerinden, Polonya ana destinasyon olacak şekilde yürütün. C tipi Schengen vizesi 180 günde en fazla 90 günlük kısa kalış çerçevesindedir; verilen vizenin giriş sayısı ve süresi ayrıca belirleyicidir.",
    payments:
      "Polonya zlotisi kullanılır; kart ve temassız ödeme çok yaygındır. Pazar, dağ kulübesi, küçük emanet dolabı ve kırsal minibüs için biraz PLN taşıyın. Bağımsız ATM'nin yüksek sabit ücretini okuyun; terminalde TL veya avro yerine PLN seçerek dinamik kur dönüşümünü reddedin.",
    language:
      "Lehçe resmî dildir; büyük şehir ve turistik alanlarda İngilizceyle ilerlemek çoğu zaman mümkündür. Wrocław, Łódź ve Gdańsk gibi adları yerel yazımıyla saklamak bilet aramasını kolaylaştırır. Savaş, işgal, Holokost ve komünist dönem mekânlarında kelime seçimi ile fotoğraf davranışı özellikle önemlidir.",
    languageLabel: "Lehçe · İngilizce büyük şehirlerde yaygın",
    connectivity:
      "PKP Intercity uzun mesafe trenlerinde temel kaynaktır; bölgesel trenler farklı işletmelerce yürütülür. Jakdojade birçok şehirde yerel toplu taşımayı gösterse de bilet geçerliliğini işletmeden doğrulayın. Tatra gününde TOPR/TPN hava ve patika duyurularını, kıyıda rüzgârı ve son dönüşü aynı gün kontrol edin.",
    budgetFrame:
      "Ekonomik planda hostel/pansiyon, süt barı, belediye ulaşımı ve seçilmiş müze; orta bütçede merkezî oda, hızlı tren ve iki ücretli ziyaret; rahat planda butik otel, iyi restoran ve rehberli hafıza/doğa turu öne çıkar. Kraków, Gdańsk yazı, yılbaşı ve Zakopane kayak haftaları fiyatları hızlı yükseltir.",
    sources: [
      { name: "Poland Travel — resmî destinasyon portalı", url: "https://www.poland.travel/en/" },
      { name: "Polonya'nın Türkiye temsilciliği — vize bilgisi", url: "https://www.gov.pl/web/turcja/wizy-informacje-ogolne" },
      { name: "PKP Intercity — resmî tren planlama", url: "https://www.intercity.pl/en/" },
      { name: "Tatra Milli Parkı — resmî patika ve bilet", url: "https://tpn.gov.pl/" },
    ],
  },
  RU: {
    country: "Rusya",
    entry:
      "Rusya'daki güvenlik durumu öngörülemez biçimde değişebilir; Birleşik Krallık FCDO 21 Ağustos 2026 itibarıyla devam eden savaş, güvenlik olayları, uçuş kesintileri ve sınırlı konsolosluk desteği nedeniyle Rusya'ya tüm seyahatlere karşı uyarıyor. Bu yabancı uyarı Türk vatandaşları için bağlayıcı değildir; karar vermeden hemen önce T.C. Dışişleri, Türkiye'nin Moskova Büyükelçiliği, sigortacı ve taşıyıcınızın güncel duyurularını birlikte değerlendirin. Türk vatandaşları turistik amaçla seyahat amacına uygun Rusya vizesi veya koşulları sağlanıyorsa birleşik elektronik vize kullanmalıdır. Rusya Dışişleri'nin güncel sisteminde Türkiye uygun ülkeler arasındadır; e-vize tek girişli, düzenlendiği tarihten itibaren 120 gün geçerli ve girişten itibaren en fazla 30 gün kalış sağlar. Başvuru 86 gün ile en geç 4 gün önce yapılabilir; yalnız listelenen sınır noktaları, geçerli sağlık sigortası ve en az altı ay geçerli makine okunur pasaport koşullarını resmî sayfadan yeniden doğrulayın.",
    payments:
      "Rus rublesi kullanılır. Yurt dışında düzenlenmiş kartların fiziksel mağaza, ATM veya çevrimiçi ödemede çalışacağını varsaymayın; seyahatten önce kendi bankanız ve kart ağınızla yazılı teyit alın. Yalnız yasal döviz ve ödeme kanallarını kullanın, nakit taşıma ile gümrük beyan sınırlarını doğrulayın ve tek ödeme yöntemine bağımlı kalmayın.",
    language:
      "Rusça ve Kiril alfabesi günlük seyahatin temelidir; büyük otel ve turistik noktalar dışında İngilizce sınırlı kalabilir. Otel adresini, istasyon adını, ilaç/alerji bilgisini ve acil kişiyi Rusça çevrimdışı saklayın. Tataristan gibi cumhuriyetlerde yerel dil ve dinî kimliğe de saygı gösterin.",
    languageLabel: "Rusça · bölgesel diller",
    connectivity:
      "Uluslararası uygulama, mobil ödeme, roaming ve harita erişimi değişebilir. Yola çıkmadan önce eSIM/roaming uygunluğunu, cihaz ve uygulama erişimini kendi sağlayıcınızdan doğrulayın; bilet, otel ve sigorta belgelerini çevrimdışı saklayın. Uzun mesafede RZD ve resmî havayolu/havalimanı kaynaklarını kullanın; saat dilimi, pasaport kontrolü ve sefer değişikliğine geniş pay bırakın.",
    budgetFrame:
      "Ekonomik planda merkez dışı oda, metro, market/lokanta ve seçilmiş müze; orta bütçede merkezî otel, uzun mesafe tren/uçuş ve birkaç biletli saray; rahat planda iyi otel, rehber ve özel doğa transferi öne çıkar. Kur, uluslararası ödeme erişimi, yaptırımlar ve ulaşım arzı hızlı değişebildiği için sabit ruble hesabını rezervasyon günündeki yasal ödeme olanağıyla birlikte yenileyin.",
    sources: [
      { name: "Rusya Dışişleri — birleşik elektronik vize", url: "https://evisa.kdmid.ru/Home/Instruction" },
      { name: "T.C. Dışişleri — Rusya seyahat duyurusu", url: "https://www.mfa.gov.tr/rusya-federasyonu_na-seyahat-edecek-vatandaslarimizin-dikkatine_.tr.mfa" },
      { name: "Russian Railways — resmî tren bilgisi", url: "https://eng.rzd.ru/" },
      { name: "Birleşik Krallık FCDO — güncel Rusya seyahat uyarısı", url: "https://www.gov.uk/foreign-travel-advice/russia" },
      { name: "Rusya Hükümeti — Turizm ve Konukseverlik projesi", url: "https://government.ru/rugovclassifier/920/" },
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
  const timezone = profile.timezone ??
    (profile.countryCode === "TR"
      ? "UTC+3"
      : profile.countryCode === "GB"
        ? "GMT · yazın BST"
        : profile.countryCode === "CN"
          ? "UTC+8"
          : profile.countryCode === "NL"
            ? "CET · yazın CEST"
          : profile.countryCode === "ID"
              ? "WIB · UTC+7"
              : profile.countryCode === "MX"
                ? "Bölgeye göre UTC−8–UTC−5"
                : profile.countryCode === "BR"
                  ? "Bölgeye göre UTC−5–UTC−2"
                  : profile.countryCode === "AR"
                    ? "UTC−3"
                    : profile.countryCode === "CA"
                      ? "Bölgeye göre UTC−8–UTC−3:30"
        : profile.countryCode === "RU"
          ? "Bölgeye göre UTC+2–UTC+12"
        : ["Tenerife", "Gran Canaria"].includes(profile.city)
          ? "WET · yazın WEST"
          : "CET · yazın CEST");
  const money =
    profile.countryCode === "GB"
      ? "Sterlin · kart yaygın"
      : ["ES", "NL"].includes(profile.countryCode)
        ? "Avro · kart yaygın"
        : ["AT", "PT", "DE", "BE"].includes(profile.countryCode)
          ? "Avro · kart + nakit"
        : profile.countryCode === "CH"
          ? "İsviçre frangı · kart yaygın"
          : profile.countryCode === "HU"
            ? "Macar forinti · kart + nakit"
          : profile.countryCode === "CZ"
            ? "Çek korunası · kart + nakit"
          : profile.countryCode === "PL"
            ? "Polonya zlotisi · kart yaygın"
          : profile.countryCode === "RU"
            ? "Rus rublesi · ödeme yedeği şart"
        : profile.countryCode === "ID"
          ? "Rupi · kart + nakit"
          : profile.countryCode === "CN"
            ? "Renminbi · mobil ödeme"
            : profile.countryCode === "MX"
              ? "Meksika pesosu · kart + nakit"
              : profile.countryCode === "BR"
                ? "Brezilya reali · kart + nakit"
                : profile.countryCode === "AR"
                  ? "Arjantin pesosu · kur değişken"
                  : profile.countryCode === "CA"
                    ? "Kanada doları · kart yaygın"
            : "TL · kart + nakit";

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
      { label: "Para", value: money },
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
    reviewed: ["ID", "CN", "NL", "CH", "BE", "HU", "CZ", "PL", "RU"].includes(profile.countryCode) ? "2026-08-25" : "2026-08-12",
  };
}

import { CityGuide } from "./types";

export const miami: CityGuide = {
  city: "Miami",
  countryCode: "US",
  seoTitle: "Miami Gezi Rehberi: Miami Beach, Ulaşım, Yemek ve İpuçları",
  seoDescription:
    "Miami ve Miami Beach farkı, MIA ulaşımı, temassız transit, SunPass, park, Küba mutfağı, kasırga sezonu, doğru konaklama ve 4 günlük gerçek gezi planı.",
  h1: "Miami Gezi Rehberi",
  lede:
    "Miami'de en pahalı hataların çoğu gezilecek yerlerden değil, coğrafyayı yanlış okumaktan çıkar: Miami Beach ana karadaki Downtown değildir; MIA'dan plaja metro gitmez ve kıyıdaki ucuz otel, vale ile resort ücretleri eklendiğinde ucuz kalmayabilir.",
  quickFacts: [
    { label: "Önerilen süre", value: "4–5 gün" },
    { label: "Havalimanları", value: "MIA · FLL" },
    { label: "Toplu taşıma", value: "Metrorail + Metrobus + Metromover" },
    { label: "Araba", value: "Plajda şart değil" },
    { label: "Hava riski", value: "Kasırga sezonu Haz–Kas" },
  ],
  sections: [
    {
      heading: "Miami'yi anlamak: şehir, plaj ve körfez",
      id: "sehri-anlamak",
      body: [
        "'Miami'de kalıyorum' ifadesi adresi açıklamaz. **Miami Beach**, Biscayne Bay'in karşısında ayrı bir belediye ve ada zinciridir; South Beach, Mid-Beach ve North Beach burada. **Downtown/Brickell**, ana karadaki gökdelen ve iş merkezi; **Wynwood**, **Design District**, **Little Havana** ve **Coconut Grove** yine ana karada farklı yönlerdedir.",
        "Bu ayrım günlük planı belirler. South Beach'ten Brickell'e birkaç kilometre görünmesine rağmen köprü trafiği süreyi büyütebilir. Sabah Wynwood, öğlen plaj, akşam Little Havana gibi zigzag yerine iki günü sahil, iki günü ana kara kümelerine ayırın. Everglades veya Keys düşünüyorsanız bunu ayrı araç günü yapın.",
        "Miami'nin yerel mantığı 'her yere araba' da değildir. South Beach içinde yürüyüş, bisiklet ve yerel otobüsler işe yarar; Downtown/Brickell'de ücretsiz Metromover güçlüdür. Fakat plaj ile ana kara, Coconut Grove ve uzak mahalleler arasında aktarma/seyreklik, uygulama aracı veya kiralık otomobil rolünü artırır.",
      ],
    },
    {
      heading: "Gezilecek yerler: plaj dışında kalan Miami",
      id: "gezilecek-yerler",
      body: [
        "South Beach'te Ocean Drive'ı gündüz Art Deco Historic District mimarisi için, akşam kalabalığın sahneye dönüşmesi için görün. Plajda yalnız havlu bırakıp denize girmeyin; telefon ve pasaport için otel kasası veya grupta nöbet gibi basit düzen kurun. Cankurtaran bayrakları, akıntı ve hava uyarıları dekor değildir.",
        "Little Havana, Calle Ocho'da birkaç tavuk heykeli ve puro dükkânından ibaret değil. Ventanita'da ayakta cafecito içmek, Domino Park çevresini saygılı biçimde gözlemek ve Küba göç tarihini HistoryMiami gibi kurumlarla bağlamak geziyi derinleştirir. Tur grubunun her dükkânı 'yerel' diye pazarlamasına gerek yok; tek bir iyi öğün ve yavaş yürüyüş yeterlidir.",
        "Wynwood duvar resimleri ve galeriler için gündüz; restoran/barlar için akşam çalışır. Wynwood Walls biletli, kontrollü bir alan olabilir; mahalledeki tüm sokak sanatı aynı biletin içinde değildir. Design District kamusal sanat ve mimariyi ücretsiz gezmek için iyi, lüks alışveriş yapmak zorunda değilsiniz.",
        "Vizcaya Museum and Gardens, Coconut Grove ve Key Biscayne bir güney günü oluşturur. Key Biscayne plajı için araç veya doğru otobüs planı gerekir. Everglades gerçek bir ekosistem gezisidir; hava botu fotoğrafı uğruna vahşi yaşama yaklaşan, hayvan refahı belirsiz işletmeler yerine resmî park bilgisi ve izinli operatörleri kontrol edin.",
      ],
    },
    {
      heading: "Nerede kalınır? South Beach her gezgin için doğru değil",
      id: "nerede-kalinir",
      body: [
        "**South Beach**, ilk plaj gezisi, gece hayatı ve arabasız yürüyüş için pratiktir. Karşılığında oda, resort ücreti, vale ve restoran toplamı yükselebilir; hafta sonu gürültüsü bloktan bloğa değişir. **Mid-Beach** daha resort odaklı ve sakin, merkez yürüyüşlerine uzaktır. **North Beach** yerleşim hissi ve daha sakin kıyı sunar, gece seçenekleri sınırlıdır.",
        "**Brickell** yeni oteller, restoranlar, Metromover/Metrorail erişimi ve ana kara gezisi için iyi; plaja her gün geçecekseniz köprü yolculuğu ekler. **Downtown** müze, arena ve liman öncesi/sonrası için işlevsel; her sokağı tatil atmosferi taşımaz. **Coconut Grove** yeşil, sakin ve restoran ağırlıklı; ilk kez gelen kısa program için merkez dışı kalabilir.",
        "Otel ilanında 'beachfront' ile plaj hizmetlerinin ücretsiz olduğu aynı şey değildir. Şezlong/şemsiye, resort fee, valet, minibar ve gecelik provizyonu ayrı sorun. 2025 FTC kuralı zorunlu tesis ücretlerinin gösterilen toplam fiyata dahil edilmesini gerektirir; yine de devlet vergileri ve seçtiğiniz park gibi isteğe bağlı hizmetler ödeme öncesi ayrıca eklenebilir.",
      ],
    },
    {
      heading: "MIA ve FLL: uçuş ucuzluğunu son kilometreyle karşılaştırın",
      id: "havalimani-ulasim",
      body: [
        "**Miami International (MIA)**, Downtown/Brickell için Airport Station'dan Orange Line Metrorail bağlantısına sahiptir. Terminalden MIA Mover ile ulaşım merkezine geçilir. Miami Beach için raylı sistem doğrudan gitmez; güncel **Route 150 Miami Beach Airport Express** Airport Station ile South/Mid-Beach aksını bağlar. Otelinizin Collins/Washington üzerindeki konumuna göre bu otobüs taksiden daha ekonomik olabilir.",
        "**Fort Lauderdale (FLL)**, kuzeydeki fiyat avantajıyla çekici görünür ama South Beach veya Brickell'e transfer daha uzun ve parçalıdır. Tri-Rail/Brightline bağlantıları hedefe göre yardımcı olabilir; gece inişi, bagaj ve istasyon transferini birlikte hesaplayın. FLL uçuşu birkaç dolar ucuz diye iki saatlik uygulama aracı eklemek tasarruf değildir.",
        "MIA ve FLL'de rideshare pickup kat/zone kuralları değişebilir; valizi aldıktan sonra havalimanı tabelasını ve uygulamadaki terminal pinini eşleştirin. Sürücünün mesajla farklı, resmî olmayan bir kat istemesi halinde plaka ve uygulama bilgisini doğrulamadan araca binmeyin.",
      ],
    },
    {
      heading: "Şehir içi ulaşım ve temassız ödeme",
      id: "toplu-tasima",
      body: [
        "Miami-Dade Transit; Metrorail, Metrobus ve ücretsiz Downtown Metromover'dan oluşur. EASY Card/EASY Ticket seçenekleri sürse de ziyaretçi temassız Visa, Mastercard, American Express veya Apple Pay/Google Pay ile doğrudan ödeme yapabilir. Fare cap ve aktarma mantığının bozulmaması için giriş-çıkışta ve tüm yolculuklarda aynı kartı/cihazı kullanın; iPhone ile girip Apple Watch ile çıkmayın.",
        "GO Miami-Dade uygulaması canlı bilgi ve mobil pass için yararlıdır; mobil pass satın almak hesap ister. Fakat sistem genelinde temassız ödeme varken kısa ziyaretçi, sırf bilet için hesap kurmadan seyahat edebilir. App Store bölgesi sorun çıkarırsa resmi web/harita, temassız kart ve durak ekranları yeterli alternatiflerdir.",
        "Metromover ücretsizdir ve Downtown–Brickell içinde kısa mesafeleri iyi çözer; bunu Miami Beach'e giden monoray sanmayın. Plaj otobüsleri trafikten etkilenir. Gece geç dönüşte sefer sıklığını kontrol edin; taksi/rideshare'i tüm gün değil, son bağlantı veya grup maliyeti avantajlı olduğunda kullanın.",
      ],
    },
    {
      heading: "Araba, SunPass ve Miami Beach parkı",
      id: "araba-toll-park",
      body: [
        "Sadece South Beach + Downtown/Brickell gezecekseniz araç şart değildir. Everglades, Keys, outlet veya dağınık banliyö yemekleri eklenince faydalı olur. Kiralama günlerini bu şehir dışı bölüme sıkıştırmak, resort otelinde boş yere günlük park ödemesini azaltır.",
        "Florida'da birçok yol elektronik ücretlidir. **SunPass** ile **TOLL-BY-PLATE** aynı maliyet ve süreç değildir; kiralık araçta fatura plaka sahibine, yani şirkete gider ve şirket idarî/günlük ücret ekleyebilir. Aracı almadan firmanın toll programını, otomatik kaydı, her gün mü yalnız kullanım gününde mi ücret aldığını ve kendi SunPass hesabınıza plaka eklemenin izinli olup olmadığını sorun. Tek eyalet kuralını ülkeye genellemeyin.",
        "Miami Beach belediye parkında ParkMobile ve PayByPhone resmî seçeneklerdir. Uygulama, süreyi uzatmayı kolaylaştırır ama tabeladaki maksimum süreyi, resident alanını veya çekme kuralını aşmaz. Kiralık araç plakasını eksiksiz girin; eyalet ve harf/numara hatası ödeme yapmış olsanız bile eşleşmeyi bozabilir.",
        "Plaj günü arabada bavul ve pasaport bırakmayın. Vale fişini saklayın ve otelin 'in/out privileges' sunup sunmadığını sorun; her girişte yeni ücret çıkabilir. Benzin istasyonunda yabancı kart ZIP kodunda reddedilirse kasada ön ödeme güvenli ve meşru çözümdür.",
      ],
    },
    {
      heading: "Miami mutfağı: Küba etkisi başlangıç, tamamı değil",
      id: "ne-yenir",
      body: [
        "Cuban sandwich, ropa vieja, croqueta, pastelito ve cafecito şehrin göç tarihini anlatır. Ventanita, sokağa açılan küçük servis penceresidir; hızlı kahve ve sohbet için oturmalı restorandan farklı bir ritme sahiptir. Cafecito küçük ama şekerli ve güçlüdür; Türk kahvesi fincanı boyutuna bakıp kafeini hafife almayın.",
        "Miami aynı zamanda Haiti, Bahamalar, Nikaragua, Kolombiya, Peru ve geniş Karayip diasporalarının kentidir. Little Haiti, Sweetwater ve Doral gibi bölgeler kısa şehir merkezinin ötesinde ayrı yemek rotaları yaratır. Deniz ürününde 'local' ifadesini romantikleştirmeden türü, sezonu ve fiyatı sorun.",
        "Florida stone crab mevsimliktir; Joe's Stone Crab'e yazın gidip aynı ürünü beklemek yanlış beklenti yaratır. Restoranın ana sezon, takeaway ve rezervasyon/bekleme listesi düzenini resmi siteden kontrol edin. Miami Beach'teki popüler mekânlarda fatura automatic gratuity veya service charge içerebilir; ek tip yazmadan önce satırları okuyun.",
      ],
    },
    {
      heading: "Hava, kasırga sezonu ve plaj güvenliği",
      id: "hava-guvenlik",
      body: [
        "Atlantik kasırga sezonu resmî olarak 1 Haziran–30 Kasım'dır; en yoğun dönem her yıl aynı günlere kilitlenmez. Bu tarihlerde seyahat etmek 'kesin fırtına' demek değildir. Esnek/iadeli rezervasyon, seyahat sigortasının hava olayları maddesi, havayolu bildirimi ve National Hurricane Center takibi önemlidir. Sosyal medya tahmininden çok resmî uyarıya güvenin.",
        "Yaz sıcağı yalnız sıcaklık değil yüksek nem, öğleden sonra fırtınası ve güçlü UV demektir. Açık hava yürüyüşünü sabah/akşama alın, yıldırım uyarısında plajda beklemeyin. Arabanın içinde çocuk, hayvan, ilaç veya elektronik bırakmayın; iç sıcaklık hızla tehlikeli seviyeye çıkar.",
        "Gece hayatında hesabı açık bırakırken kartınızı kimin tuttuğunu ve kapanış prosedürünü sorun. Uygulama aracının plakasını eşleştirin; plajda içki ve açık kap kuralları belediye/alan bazında değişebilir, 'Florida'da serbest' varsayımı yapmayın. Cannabis eyalette rekreasyonel olarak genel turist kullanımı için serbest değildir; yerel satış tabelalarını hukuk göstergesi sanmayın.",
      ],
    },
    {
      heading: "Alışveriş, günlük ihtiyaç ve bütçe",
      id: "butce",
      body: [
        "Florida ve yerel satış vergileri etiket fiyatına kasada eklenebilir. Yabancı turist için genel satış vergisi iadesi yoktur. Outlet'te 'compare at' veya yüksek indirim yüzdesi gerçek şehir mağazası fiyatıyla aynı karşılaştırma olmayabilir; ürün kodu, iade şartı ve fişi kontrol edin.",
        "CVS/Walgreens, eczane yanında güneş kremi, su, atıştırmalık ve plaj ihtiyacı sunar; sahil oteli minibarından çoğunlukla daha pratiktir. Büyük markete gidecekseniz soğuk ürün taşıma süresini düşünün. Restoranlarda tap water isteyebilirsiniz; plaj yürüyüşünde doldurulabilir şişe taşıyın.",
        "Bütçede dört gizli aday vardır: otel vergisi/tesis toplamı, vale, köprü trafiğinde rideshare surge ve beach club/şezlong. Günlük tek bir ücretli ana deneyim seçip ücretsiz plaj, mahalle yürüyüşü ve Metromover ile denge kurmak, pass kovalamaktan daha iyi olabilir.",
      ],
    },
  ],
  places: [
    { name: "Versailles", area: "Little Havana", known: "Küba lokantası ve ventanita", why: "1971'den beri yalnız restoran değil, Küba diasporasının kamusal buluşma noktası. Oturmalı tabak ile pencereden cafecito deneyimini ayrı ayrı görebilirsiniz.", price: "Orta", tip: "Turistik ama kültürel bağlamı gerçek. Yoğun saatte tam öğün yerine ventanita kısa durak olabilir." },
    { name: "Sanguich", area: "Little Havana", known: "Özenli Cuban sandwich ve batido", why: "Klasik sandviçi malzeme ve üretim tekniğine odaklanan daha çağdaş bir formatta sunar; iki Küba lokantasını aynı büyük öğüne sıkıştırmak yerine paylaşın.", price: "Orta", tip: "Resmî site 2025 Bib Gourmand bilgisini taşıyor; ödül statüsünü seyahat tarihinde yeniden doğrulayın." },
    { name: "Joe's Stone Crab", area: "South Beach", known: "Mevsimlik stone crab", why: "Miami Beach'in tarihî deniz ürünü kurumudur. Taş yengeç mevsiminde ürün, servis ritüeli ve mustard sauce için anlamlı; sezon dışında sırf isim için gitmek şart değil.", price: "Yüksek", tip: "Sezon, ana salon ve takeaway düzenini resmî siteden kontrol edin; bekleme/rezervasyon kuralı değişebilir." },
    { name: "Zak the Baker", area: "Wynwood", known: "Ekşi mayalı ekmek ve fırın", why: "Wynwood'u yalnız duvar resmi ve barlardan çıkarıp gündüz üretim kültürüne bağlar; ekmek, hamur işi ve hafif öğle için iyi duraktır.", price: "Orta", tip: "Fırın ürünleri gün içinde tükenebilir; sabah veya erken öğle gidin." },
    { name: "La Sandwicherie", area: "South Beach", known: "Tezgâh sandviçi ve vinaigrette", why: "Pahalı sahil yemeklerine karşı hızlı, geceye de uyan klasik bir Miami Beach seçeneği. Fransız baget formatı tropik malzemelerle yerelleşir.", price: "Ekonomik", tip: "Birden fazla şube var; orijinal Miami Beach konumunu ve güncel saati resmî siteden seçin." },
    { name: "Garcia's Seafood Grille", area: "Miami River", known: "Balık pazarı ve nehir kıyısı deniz ürünü", why: "Aile işletmesi balık pazarı kökünü korur; bütün balık ve yerel deniz ürünüyle parlak resort salonlarından farklı, sade bir Miami öğünü sunar.", price: "Orta", tip: "Dış mekân için hava durumunu; günlük balık ve çalışma saatini resmî kanaldan sorun." },
  ],
  itinerary: [
    { title: "South Beach ve Art Deco", morning: "Plaja erken gidin; ardından Ocean Drive ve Art Deco bölgesini gölgeli saatlerde yürüyün.", afternoon: "South Pointe'e doğru bisiklet/yürüyüş; öğle yemeğini pahalı sahil terası yerine seçilmiş bir tezgâhta alın.", evening: "Gün batımı sonrası South Beach yemeği; faturada automatic gratuity satırını kontrol edin." },
    { title: "Little Havana ve Downtown", morning: "Calle Ocho, Domino Park çevresi, ventanita kahvesi ve kültürel bağlam için sakin yürüyüş.", afternoon: "Metrorail/uygulama aracıyla Downtown; Pérez Art Museum veya Frost Science'dan birini seçin.", evening: "Ücretsiz Metromover ile Brickell turu ve rezervasyonlu akşam yemeği." },
    { title: "Wynwood ve Design District", morning: "Wynwood sokakları ve biletli duvar alanı tercih ediliyorsa önceden saat kontrolü.", afternoon: "Zak the Baker çevresinde öğün, Design District kamusal sanat ve mimari yürüyüşü.", evening: "Wynwood'da yemek/gece hayatı; dönüş aracını kalabalık cadde üzerindeki resmî pickup noktasından çağırın." },
    { title: "Doğa veya güney mahalleleri", morning: "Araçlı Everglades gezisi ya da Vizcaya + Coconut Grove'dan birini seçin; ikisini aceleye sıkıştırmayın.", afternoon: "Doğa gününde sıcak/fırtına planı; şehir gününde Coconut Grove ve Key Biscayne.", evening: "Miami River'da deniz ürünü veya Coral Gables/Coconut Grove'da sakin yemek." },
  ],
  practicalHeading: "Miami'de küçük görünen ama bütçeyi değiştiren bilgiler",
  practicalTips: [
    { title: "Miami Beach'e metro gitmez", body: "MIA'dan Metrorail ana karaya gider; plaj için Route 150, başka otobüs veya araç gerekir. Otel adresini haritada ada/ana kara olarak doğrulayın." },
    { title: "Temassızda cihaz değiştirmeyin", body: "iPhone ile girip aynı kartın Apple Watch sürümüyle çıkarsanız sistem yeni yolculuk sayabilir ve fare-cap avantajı bozulabilir." },
    { title: "Mobil pass için hesap şart, yolculuk için değil", body: "GO Miami-Dade mobil pass hesabı ister; kısa ziyaretçi temassız banka kartıyla hesap açmadan binebilir." },
    { title: "Resort ücretini değil toplamı kıyaslayın", body: "Zorunlu ücret önden toplamda görünmeli; vergi, park ve isteğe bağlı plaj hizmeti ayrıca gelebilir. Son ödeme ekranını kaydedin." },
    { title: "İki resmî park uygulaması var", body: "Miami Beach hem ParkMobile hem PayByPhone kabul eder. Plaka/eyalet bilgisini doğru girin ve tabela süresini uygulama uzatsa bile aşmayın." },
    { title: "Toll şirket programını otomatik kabul etmeyin", body: "SunPass/TOLL-BY-PLATE yanında kiralama firmasının idarî ücreti vardır. Kullanım gününe mi tüm kiraya mı uygulandığını sorun." },
    { title: "Stone crab mevsimliktir", body: "Ünlü restoran açık olsa bile isim ürünü yıl boyu aynı biçimde mevcut olmayabilir. Sezon ve menüyü resmi siteden kontrol edin." },
    { title: "Kasırga sezonu iptal emri değildir", body: "Haziran–kasım daha dikkatli rezervasyon ve resmî NHC takibi gerektirir. İade/erteleme koşulunu hava oluşmadan önce okuyun." },
  ],
  faqs: [
    { q: "Miami için kaç gün yeterli?", a: "Dört tam gün plaj, Little Havana, Downtown ve Wynwood için dengelidir. Everglades veya Keys eklenecekse 5–6 gün ayırın." },
    { q: "Miami'de araba kiralamak gerekir mi?", a: "South Beach ve Downtown odaklı gezide gerekmez. Everglades, Keys, outlet ve uzak mahallelerde araç yararlıdır; yalnız gerekli günlerde kiralamak park maliyetini azaltır." },
    { q: "Miami Beach ile Downtown Miami aynı yer mi?", a: "Hayır. Miami Beach körfezin karşısında ayrı belediyedir; Downtown/Brickell ana karadadır. Köprü trafiği günlük planı etkiler." },
    { q: "MIA'dan South Beach'e nasıl gidilir?", a: "Airport Station'dan Route 150 Miami Beach Airport Express güncel ana toplu taşıma seçeneğidir. Gece ve bagaj durumunda resmî taksi/rideshare ile karşılaştırın." },
    { q: "Miami'de temassız kartla toplu taşıma kullanılır mı?", a: "Evet. Desteklenen temassız banka kartları ve dijital cüzdanlar çalışır. Aktarma ve ücret tavanı için hep aynı kart/cihazı kullanın." },
    { q: "Kasırga sezonunda Miami'ye gidilir mi?", a: "Gidilebilir; risk her gün aynı değildir. Esnek rezervasyon, sigorta kapsamı ve National Hurricane Center takibi gerekir. Resmî tahliye/uyarılar her planın önündedir." },
  ],
  relatedGuides: [
    { city: "New York", anchor: "Miami'yi New York'la birleştirin", description: "Kışın sık yapılan ama karayolu değil uçuş ayağı olarak planlanması gereken iki zıt şehir deneyimi." },
    { city: "Las Vegas", anchor: "Resort mantığını Las Vegas'ta karşılaştırın", description: "Otel toplamı, vale ve eğlence ücretlerinin geziyi belirlediği; fakat iklimi ve ulaşımı farklı başka bir şehir." },
  ],
  sources: [
    { name: "Miami-Dade — contactless payments", url: "https://www.miamidade.gov/global/faq.page?Mduid_faq=faq162274950677554" },
    { name: "Miami-Dade — GO app FAQ", url: "https://www.miamidade.gov/global/transportation/go-miami-dade-app-faqs.page" },
    { name: "Miami-Dade — Route 150", url: "https://www.miamidade.gov/resources/transportation_publicworks/documents/routes/150.pdf" },
    { name: "Miami Beach — parking apps", url: "https://www.miamibeachfl.gov/city-hall/parking/mobile-apps/" },
    { name: "National Hurricane Center", url: "https://www.nhc.noaa.gov/" },
    { name: "Versailles", url: "https://www.versaillesrestaurant.com/" },
    { name: "Sanguich", url: "https://sanguich.com/" },
    { name: "Joe's Stone Crab", url: "https://joesstonecrab.com/" },
    { name: "La Sandwicherie", url: "https://lasandwicherie.com/" },
    { name: "Garcia's Seafood", url: "https://www.garciasmiami.com/" },
  ],
  volatileNote: "Fırtına uyarıları, plaj koşulları, otobüs tarifesi, toll ve park uygulamaları ile restoran sezonları değişebilir; yolculuk tarihinde resmî kaynakları yeniden kontrol edin.",
  reviewed: "2026-08-09",
};

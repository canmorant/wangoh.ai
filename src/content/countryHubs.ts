export interface CountryHubContent {
  seoTitle: string;
  seoDescription: string;
  planningHeading: string;
  essentialsHeading?: string;
  citiesHeading?: string;
  /** Şehir kartlarının hemen üstünde kullanılan kısa, arama odaklı ülke özeti. */
  cityGridIntro: string;
  intro: string[];
  essentials?: { title: string; body: string }[];
  routeIdeas: {
    title: string;
    duration: string;
    cities: string[];
    description: string;
  }[];
}

const HUBS: Record<string, CountryHubContent> = {
  JP: {
    seoTitle: "Japonya Gezi Rehberi: 8 Şehir ve Rota Planı",
    seoDescription:
      "Japonya gezi rehberi: Tokyo, Kyoto, Osaka, Kobe, Okinawa, Hiroshima, Nara ve Sapporo için kapsamlı şehir yazıları, ulaşım ve rota önerileri.",
    planningHeading: "Japonya rotası nasıl kurulur?",
    cityGridIntro:
      "Japonya'da gezilecek şehirler, aynı yolculuk içinde geleneksel mahallelerden geleceğin metropollerine uzanan güçlü bir çeşitlilik sunar. Tokyo büyük şehir enerjisiyle, Kyoto ve Nara tapınaklarıyla, Osaka ile Kobe ise mutfak ve liman kültürüyle öne çıkar. Hiroshima yakın tarihi, Sapporo kuzeyin doğasını, Okinawa da Ryukyu mirası ve tropik kıyıları keşfetmek isteyenler için farklı bir rota açar.",
    intro: [
      "Japonya'yı tek bir uzun kontrol listesi gibi değil, birbirini tamamlayan bölgesel duraklar olarak planlamak daha iyi sonuç verir. Tokyo büyük şehir ritmini; Kyoto tarihî mahalleleri; Osaka gündelik mutfağı; Kobe liman, sake ve kaplıcaları; Hiroshima hafıza ile ada doğasını; Nara eski başkent dokusunu; Sapporo Hokkaido'nun iklimini, Okinawa ise ayrı Ryukyu tarihini ve mercan denizlerini açar.",
      "İlk yolculukta Honshu üzerindeki Tokyo–Kyoto–Osaka omurgasını hızlı trenle bağlayın; Kobe ve Nara'yı Kansai ayağına, Hiroshima'yı batıya devam eden rotaya yerleştirin. Sapporo ile Okinawa haritanın iki iklim ucudur: ikisini de kısa Honshu programına sıkıştırmak yerine ayrı uçuşlu bölge ayağı sayın.",
    ],
    routeIdeas: [
      {
        title: "İlk Japonya yolculuğu",
        duration: "9–11 gün",
        cities: ["Tokyo", "Kyoto", "Osaka"],
        description:
          "Tokyo'da dört gün, Kyoto'da üç gün, Osaka'da iki gün. Nara'yı Kyoto veya Osaka'dan günübirlik ekleyin.",
      },
      {
        title: "Kansai ve Seto İç Denizi",
        duration: "10–12 gün",
        cities: ["Kyoto", "Nara", "Osaka", "Kobe", "Hiroshima"],
        description:
          "Tapınaklardan sokak mutfağına, Kobe'nin liman ve sake kültüründen Barış Anıtı Parkı ile Miyajima'ya uzanan dengeli batı rotası.",
      },
      {
        title: "Ryukyu adası yolculuğu",
        duration: "5–7 gün",
        cities: ["Okinawa"],
        description:
          "Naha ve Shuri'den başlayıp Onna, Churaumi, Nakijin ve Yanbaru'ya ilerleyin. Miyako ile Ishigaki'yi aynı ana ada rotası sanmayın; onlar ayrı uçuş ayağıdır.",
      },
      {
        title: "Kışın kuzeye",
        duration: "5–7 gün",
        cities: ["Sapporo"],
        description:
          "Sapporo'yu Otaru veya Jozankei ile birleştirin. Festival döneminde uçuş ve konaklamayı çok önceden planlayın.",
      },
    ],
  },
  US: {
    seoTitle: "Amerika Gezi Rehberi: Şehirler, Ulaşım ve Pratik Bilgiler",
    seoDescription:
      "New York, Los Angeles, Miami, Chicago, San Francisco ve Las Vegas için güncel Türkçe rehberler; vergi, bahşiş, ulaşım, otel ve rota bilgileri.",
    planningHeading: "Amerika rotası nasıl kurulur?",
    essentialsHeading: "Amerika'ya gitmeden önce bilinmesi gerekenler",
    citiesHeading: "Amerika Birleşik Devletleri'nde gezilecek şehirler",
    cityGridIntro:
      "Amerika Birleşik Devletleri'nde gezilecek şehirler arasındaki mesafeler kadar karakter farkları da büyüktür. New York ve Chicago mimari, müze ve mahalle yaşamıyla; Los Angeles ile San Francisco Batı Kıyısı kültürüyle öne çıkar. Miami tropik ve Latin etkili bir şehir tatili sunarken Las Vegas gösterileri ve çöl rotalarıyla ayrışır. En iyi Amerika gezisi, bütün şehirleri sıkıştırmak yerine tek bir bölgeye odaklanan plandır.",
    intro: [
      "Amerika Birleşik Devletleri'ni tek bir ülke gezisi gibi değil, kıta ölçeğinde ayrı bölgesel yolculuklar gibi düşünün. New York ve Chicago toplu taşımayla rahat şehir tatilleri sunarken Los Angeles'ta mahalle seçimi ile trafik, Miami'de ana kara ile Miami Beach ayrımı, Las Vegas'ta ise otel toplam maliyeti yolculuğun şeklini belirler.",
      "Bu altı şehri tek rotaya sıkıştırmak çoğu gezgin için iyi fikir değildir. Kıtalar arası uçuşunuzu bir giriş şehrine bağlayın; iç hat uçuşu ekleyecekseniz bagaj, havalimanına gidiş ve güvenlik için kaybolan yarım günü de hesaba katın. Kaliforniya ikilisi coğrafi olarak anlamlıdır; New York–Miami veya Chicago–Las Vegas ise karayolu rotası değil, ayrı bir uçuş ayağıdır.",
    ],
    essentials: [
      {
        title: "Etiket fiyatı son fiyat olmayabilir",
        body: "Satış vergisi eyalet ve yerel yönetimlere göre değişir ve çoğu mağaza/menü fiyatına kasada eklenir. Otel ve etkinlik biletlerinde zorunlu ücretler artık önden görünen toplam fiyata dahil edilmelidir; devlet vergileri ile seçtiğiniz ek hizmetler son adımda eklenebilir.",
      },
      {
        title: "Bahşişi faturadan sonra hesaplayın",
        body: "Masa servisinde vergi öncesi tutarın yüzde 15–20'si yaygın gelenektir; bar, taksi ve otel hizmetleri farklıdır. Counter tabletindeki öneri zorunluluk değildir. Önce service charge veya automatic gratuity satırı var mı kontrol edin; aynı hizmet için ikinci kez tam bahşiş bırakmayın.",
      },
      {
        title: "Provizyon çekim değildir",
        body: "Otel ve kiralık araç şirketi, oda/araç bedelinden daha yüksek bir tutarı geçici olarak kullanılabilir limitten düşebilir. Debit kartta bu bloke doğrudan bakiyeyi bağlar ve çözülmesi bankaya göre sürebilir; yeterli limitli kredi kartı genellikle daha rahattır.",
      },
      {
        title: "Telefon bölgesini aceleyle değiştirmeyin",
        body: "Apple hesap ülkesini değiştirmek kalan bakiyeyi harcamayı, bazı abonelikleri bitirmeyi, Aile Paylaşımı'ndan ayrılmayı ve geçerli ödeme yöntemi girmeyi gerektirebilir. Bir uygulama Türkiye mağazasında yoksa önce web/QR ödeme, misafir kullanımı, fiziksel kart veya temassız banka kartı alternatifine bakın.",
      },
      {
        title: "Araba kararı şehir bazındadır",
        body: "New York, Chicago ve San Francisco merkezinde araç yük olur. Los Angeles'ta rota dağınıksa faydalı; Miami'de plaj dışı planlara, Las Vegas'ta şehir dışı doğa gününe göre değişir. Kiralamadan önce otel parkı, vale, elektronik geçiş ve şirketin toll programı ücretini birlikte karşılaştırın.",
      },
      {
        title: "Vize durumunu resmî kaynaktan kontrol edin",
        body: "Türkiye, ABD Visa Waiver Program ülke listesinde değildir; olağan turist seyahati için ESTA varsayımı yapmayın. Başvuru ve giriş koşulları kişiye göre değişebildiğinden yalnız U.S. Department of State ve resmî temsilcilik sayfalarındaki güncel yönlendirmeyi izleyin.",
      },
    ],
    routeIdeas: [
      {
        title: "İlk büyük şehir yolculuğu",
        duration: "5–7 gün",
        cities: ["New York"],
        description:
          "Arabasız, mahalle odaklı ve yoğun bir ilk Amerika deneyimi. Başka şehir eklemek yerine Brooklyn ve Queens için zaman bırakmak geziyi daha dengeli yapar.",
      },
      {
        title: "Kaliforniya ikilisi",
        duration: "9–12 gün",
        cities: ["San Francisco", "Los Angeles"],
        description:
          "San Francisco'da araçsız başlayıp Los Angeles ayağında araç kiralayın. Kıyı yolunu sürmek istiyorsanız tek güne sıkıştırmayın; yol durumunu ve kapanmaları ayrıca kontrol edin.",
      },
      {
        title: "Tek şehir, güçlü tema",
        duration: "4–6 gün",
        cities: ["Chicago", "Miami", "Las Vegas"],
        description:
          "Mimari ve yemek için Chicago, kış güneşi ve Latin kültürü için Miami, gösteriler ile çöl doğası için Las Vegas. Bunlar birbirine yakın duraklar değil; ilginize göre birini seçin.",
      },
    ],
  },
  TH: {
    seoTitle: "Tayland Gezi Rehberi: Bangkok, Adalar ve Rota Planı",
    seoDescription:
      "Tayland gezi rehberi: Bangkok, Chiang Mai, Phuket, Krabi, Koh Samui ve Ayutthaya için güncel ulaşım, mevsim, ödeme, hukuk ve rota bilgileri.",
    planningHeading: "Tayland rotası nasıl kurulur?",
    essentialsHeading: "Tayland'a gitmeden önce bilinmesi gerekenler",
    citiesHeading: "Tayland'da gezilecek yerler ve şehir rehberleri",
    cityGridIntro:
      "Tayland'da gezilecek yerler; hareketli başkentlerden eski krallık kalıntılarına, kuzey dağlarından tropik adalara kadar uzanır. Bangkok şehir hayatı ve sokak yemekleriyle, Chiang Mai kuzey kültürüyle, Ayutthaya tarihî tapınaklarıyla öne çıkar. Phuket ve Krabi Andaman kıyısını, Koh Samui ise Tayland Körfezi'ni keşfetmek için iyi üslerdir. Şehir ve ada seçerken yalnız mesafeyi değil, bölgelerin farklı yağış dönemlerini de hesaba katın.",
    intro: [
      "Tayland'ı Bangkok'a birkaç tapınak, kuzeye bir fil turu ve güneye tek tip bir plaj tatili eklenen paket gibi planlamayın. Bangkok nehir ile raylı sistemlerin birlikte okunduğu büyük bir metropol; Chiang Mai dağlarla çevrili kuzey kültürü; Phuket ve Krabi Andaman Denizi'nin mevsimine bağlı iki ayrı üs; Koh Samui ise Tayland Körfezi'nde farklı yağış takvimi olan bir ada. Ayutthaya da yalnız fotoğraf molası değil, nehirler arasındaki eski başkentin katmanlarını anlatan bağımsız bir duraktır.",
      "İlk yolculuk için iki veya üç coğrafya yeterlidir. Bangkok'u başlangıç düğümü yapıp kuzeye uçabilir ya da trenle ilerleyebilir; deniz ayağında ise Phuket–Krabi ikilisini karadan/tekneyle birleştirebilirsiniz. Koh Samui'yi sırf haritada güneyde göründüğü için Phuket'in yanına koymak zaman kaybettirir: iki kıyı arasında kara, iskele ve feribot ya da ayrı uçuş gerekir. Muson takvimi de aynı değildir; önce ayı, sonra doğru kıyıyı seçin.",
    ],
    essentials: [
      {
        title: "TDAC'yi resmî siteden doldurun",
        body: "Tayland vatandaşı olmayan yolcular ülkeye girişten önce Thailand Digital Arrival Card kaydı yapmalıdır. Alan adı tdac.immigration.go.th olmayan ücretli aracı sitelere güvenmeyin. 2026'da yeni bir göçmenlik uygulamasına geçiş duyurulsa da resmî geçiş tamamlanana kadar TDAC kuralını izleyin; vize ve pasaport koşulunu ayrıca Tayland'ın resmî temsilciliklerinden doğrulayın.",
      },
      {
        title: "PromptPay logosu yabancı kart demek değildir",
        body: "Tezgâhlardaki QR kodlar çoğunlukla yerel PromptPay ağına bağlıdır; Türk bankacılık uygulamasının bu kodu okuyabilmesi beklenmez. Kartınızı büyük işletmeler için, küçük banknotları pazar, tekne ve songthaew için hazırlayın. Resmî turist cüzdanı hizmeti varsa kayıt koşulunu yerinde kontrol edin ama tüm bütçeyi ona bağlamayın. ATM veya POS yabancı para dönüşümü önerirse hesabın THB olarak kesilmesini tercih etmek genellikle daha şeffaftır.",
      },
      {
        title: "Doğru uygulamalar: Grab, Bolt, LINE ve harita",
        body: "Grab şehir ve havalimanlarında en yaygın çağırma uygulamalarından; Bolt kapsaması bölgeye göre değişir. Bangkok toplu taşıması için Google Maps yanında BTS ve MRT'nin resmî sayfalarını, ada/tekne günlerinde operatör duyurularını kullanın. LINE rezervasyon ve işletme iletişiminde sık görülür. Uygulamaları Türkiye'deyken indirin; hesap ülkesini değiştirmek yerine web, telefon veya otel resepsiyonu alternatifini kullanın.",
      },
      {
        title: "Scooter kiralamak ehliyet yerine geçmez",
        body: "Tayland makamları turistin Tayland'da geçerli sürücü belgesi taşımasını ister; 1949 Cenevre Sözleşmesi kapsamındaki uluslararası sürücü belgesi kabul edilir ve araç sınıfı eşleşmelidir. Otomobil yetkisi motosiklet sürme hakkı vermez. Kask, alkol, hasar kaydı ve sigortanın motosiklet kullanımını kapsayıp kapsamadığı gerçek risklerdir; kiralayıcının anahtarı vermesi yasal veya sigortalı olduğunuzu kanıtlamaz.",
      },
      {
        title: "Tek bir 'Tayland musonu' yoktur",
        body: "Bangkok, Chiang Mai ve Ayutthaya'da sıcak ve yağış; kuzeyde ayrıca şubat–nisan pus riski planı etkiler. Phuket ile Krabi'nin Andaman kıyısında mayıs–ekim döneminde deniz daha değişken olabilir. Koh Samui'nin Körfez düzeninde ise özellikle ekim sonu–aralık yağışlı ve dalgalı dönem öne çıkar. Kırmızı bayrakta yüzmeyin; tekne gününü yolculuğun son saatine sıkıştırmayın.",
      },
      {
        title: "E-sigara ve keyif amaçlı kenevir tuzağı",
        body: "E-sigara ve vape ürünlerinin ithali, satışı ve bulundurulması Tayland'da yasaktır. Haziran 2025'ten beri kenevir çiçeği kontrollü madde olarak tıbbi reçeteye bağlanmıştır; turistik caddede dükkân görmeniz serbestçe satın alabileceğiniz anlamına gelmez. Ürünü ülke sınırından geçirmeyin. Alkol için yasal yaş 20'dir; tapınak, toplu taşıma alanı ve bazı kamusal yerlerde satış/tüketim kısıtları vardır.",
      },
      {
        title: "Tapınakta kıyafet ve beden dili önemlidir",
        body: "Omuz ile dizleri örten kıyafet taşıyın, kutsal alana girerken ayakkabıyı çıkarın ve ayak tabanınızı Buda heykeline ya da insana doğrultmayın. Birinin başına dokunmayın. Buda tasvirini yalnız dekor veya uygunsuz poz malzemesi gibi kullanmayın. Kraliyet ve inançla ilgili yasalar ile toplumsal hassasiyetler ciddidir; tartışmayı turistik eğlenceye çevirmeyin.",
      },
      {
        title: "Sigorta poliçesindeki istisnaları okuyun",
        body: "Seyahat sigortasında motosiklet, dalış, kaya tırmanışı, alkol ve mevcut hastalık istisnaları bulunabilir. Ada transferlerinde hava kaynaklı iptal ve kaçırılan ayrı biletli uçuş da her poliçede karşılanmaz. Yalnız teminat tutarına değil, aktivite ile araç sınıfına ve feribot–uçuş bağlantısının aynı rezervasyonda olup olmadığına bakın.",
      },
      {
        title: "Pazarlık ile dolandırıcılığı ayırın",
        body: "Turistik pazarda nazik pazarlık olağandır; taksimetrenin reddedilmesi, 'tapınak bugün kapalı' bahanesi, ücretsiz şehir turu karşılığında kuyumcu/terzi ziyareti ve belirsiz tekne paketleri değildir. Fiyatı, güzergâhı ve bekleme süresini binmeden önce yazılı gösterin. Pasaportu scooter teminatı olarak bırakmak yerine kopya ve para depozitosu seçeneğini sorun; hasarı teslimde video ile kaydedin.",
      },
    ],
    routeIdeas: [
      {
        title: "İlk Tayland yolculuğu",
        duration: "10–12 gün",
        cities: ["Bangkok", "Chiang Mai", "Krabi"],
        description:
          "Bangkok'ta dört, Chiang Mai'de üç ve Ao Nang/Railay merkezli Krabi'de dört gece. Büyük şehir, kuzey kültürü ve Andaman kıyısı birbirini tekrar etmez.",
      },
      {
        title: "Andaman kıyısı",
        duration: "8–10 gün",
        cities: ["Phuket", "Krabi"],
        description:
          "Phuket'te doğru plaj üssünü seçin, ardından Krabi'de Ao Nang veya Railay'a geçin. Feribotu hava ve deniz durumuna göre esnek bırakın; iki yerde de aynı ada turunu satın almayın.",
      },
      {
        title: "Bangkok, tarih ve Körfez",
        duration: "8–11 gün",
        cities: ["Bangkok", "Ayutthaya", "Koh Samui"],
        description:
          "Ayutthaya'yı Bangkok'tan günübirlik veya bir gecelik ekleyin; sonra Koh Samui'ye uçun. Samui'nin yağış takvimini Phuket/Krabi ile aynı sanmayın.",
      },
    ],
  },
  IT: {
    seoTitle: "İtalya Gezi Rehberi: Şehirler, Ulaşım ve Rota Planı",
    seoDescription:
      "İtalya gezi rehberi: Roma, Venedik, Floransa, Milano, Napoli ve Amalfi Kıyısı için güncel bilet, tren, ZTL, yemek ve rota bilgileri.",
    planningHeading: "İtalya rotası nasıl kurulur?",
    essentialsHeading: "İtalya'ya gitmeden önce bilinmesi gerekenler",
    citiesHeading: "İtalya'da gezilecek şehirler ve kıyı rotaları",
    cityGridIntro:
      "İtalya'da gezilecek şehirler sanat, tarih, yemek ve kıyı manzaralarını birbirine bağlayan doğal bir rota oluşturur. Roma antik mirası, Floransa Rönesans eserleri, Venedik lagün yaşamı ve Milano tasarım kültürüyle farklı beklentilere cevap verir. Napoli ile Amalfi Kıyısı ise Güney İtalya'nın mutfağını ve Akdeniz ritmini öne çıkarır. İlk İtalya gezisinde hızlı trenle bağlanan iki veya üç ana şehir seçmek daha dengeli bir deneyim sağlar.",
    intro: [
      "İtalya'yı Roma, Floransa ve Venedik'i birer gecede işaretleyen hızlı tren yarışına çevirmeyin. Roma antik kent ve Vatikan için en az dört gün; Floransa yoğun müzeler için üç; Venedik lagün ritmini görmek için iki gece ister. Milano kuzeyin sanat–tasarım kapısı, Napoli yaşayan tarih ve Campania mutfağının merkezi, Amalfi Kıyısı ise istasyonsuz ve mevsimsel deniz ulaşımına bağlı ayrı bir lojistik bölgedir.",
      "Hızlı tren Roma–Floransa–Milano–Venedik omurgasında etkilidir; Napoli güneye aynı ağla bağlanır. Amalfi Kıyısı'na son adım Salerno, Napoli/Sorrento ve feribot–otobüs kombinasyonuyla çözülür. Şehir sayısından önce gün sayısını belirleyin: 8–10 günde en fazla üç ana üs, 12–14 günde dört durak sürdürülebilir. Müze bileti kadar otel–istasyon ve son feribot bağlantısını da rota kararı sayın.",
    ],
    essentials: [
      {
        title: "Vize ve 2026 sınır sistemini resmî kaynaktan kontrol edin",
        body: "Umuma mahsus Türk pasaportuyla turistik seyahatte genel olarak Schengen vizesi gerekir; kişisel pasaport/vize durumunuzu İtalya Dışişleri'nin Visa for Italy aracı ve yetkili konsolosluktan doğrulayın. EES, Schengen dış sınırlarında 10 Nisan 2026'dan beri tam faaldir. ETIAS ise Ağustos 2026 itibarıyla henüz başvuru almıyor; 2026'nın son çeyreğinde başlaması bekleniyor ve kesin tarih resmî kanaldan duyurulacak. Ücret isteyen erken ETIAS sitelerinden kaçının.",
      },
      {
        title: "Hızlı tren ile bölgesel trenin bilet mantığı farklıdır",
        body: "Trenitalia ve Italo hızlı trenlerinde bilet belirli tren/saat ve çoğunlukla koltuğa bağlıdır; ucuz tarifenin değişiklik koşulu kısıtlı olabilir. Bölgesel kâğıt bileti binmeden doğrulatın. Trenitalia'nın güncel Dijital Bölgesel Bileti tarifeli kalkışta otomatik doğrulanır; yine de bilet ekranındaki güncel talimatı esas alın ve kimlik taşıyın. Grev/bakım gününde resmî operatör duyurusuna bakın.",
      },
      {
        title: "ZTL kameraları navigasyonun önerisini dinlemez",
        body: "Roma, Floransa, Milano, Napoli ve küçük kıyı kasabalarında kamera denetimli sınırlı trafik bölgeleri vardır; saat ve izin kuralı belediyeye göre değişir. Merkez oteli rezervasyonu otomatik giriş hakkı değildir. Otel veya garajın plakanızı yetkili sisteme nasıl bildireceğini yazılı doğrulamadan tabelayı geçmeyin. Aracı şehir merkezinde değil kırsal ayağa çıkarken almak daha kolaydır.",
      },
      {
        title: "Türk ehliyetiyle araç için IDP gereksinimini doğrulayın",
        body: "AB dışı ehliyetle İtalya'da araç kullanırken uluslararası sürücü belgesi veya resmî çeviri gerekebilir; araç sınıfı eşleşmelidir. Kiralama şirketinin aracı teslim etmesi trafik mevzuatı ve sigortanın tüm koşullarını karşıladığınız anlamına gelmez. ZTL, park rengi, otoyol gişesi ve yakıt politikasını birlikte okuyun.",
      },
      {
        title: "Coperto, servizio ve bahşiş aynı kalem değildir",
        body: "Coperto masa/ekmek düzeni için kişi başı bedel, servizio ise faturaya eklenen hizmet ücretidir; menüde açıkça gösterilmelidir. Bahşiş ABD'deki gibi zorunlu yüzde değildir. Önce faturadaki iki satırı kontrol edin, memnun kaldıysanız küçük yuvarlama veya nakit ek bırakın. Meydan terası, bar tezgâhına göre farklı fiyat uygulayabilir.",
      },
      {
        title: "Kart yaygın, küçük nakit hâlâ işe yarar",
        body: "Otel, müze ve restoranlarda kart yaygındır; küçük bar, pazar, otobüs bileti, kıyı teknesi ve tuvalet için euro nakit taşıyın. ATM veya POS Türk lirasına dönüşüm önerirse hesabın EUR olarak kesilmesini seçmek çoğunlukla daha şeffaftır; kendi bankanızın kur/komisyonunu bilin. Kartı alıp arka odaya götürmek yerine terminali görmeyi isteyin.",
      },
      {
        title: "Turist vergisi oda fiyatından ayrı olabilir",
        body: "Belediye konaklama vergisi şehir, tesis sınıfı, yaş ve gece sayısına göre değişir; rezervasyon ekranında dahil görünmeyebilir ve tesiste tahsil edilebilir. Eski blogdaki sabit tutarı kullanmayın. Otelden güncel kişi/gece tutarını, ödeme biçimini ve makbuzu sorun.",
      },
      {
        title: "Resmî bilet alan adlarını önceden kaydedin",
        body: "Kolezyum, Vatikan Müzeleri, Uffizi, Accademia, Duomo, Son Akşam Yemeği, Pompeii ve San Marco çevresinde reklamla öne çıkan benzer alan adları pahalı aracı olabilir. Müzenin kurumsal sayfasından satış kanalına ilerleyin. İsimli bilette pasaporttaki yazımı kullanın; ücretsiz/indirimli biletin Türk ziyaretçiye otomatik uygulanacağını varsaymayın.",
      },
      {
        title: "Telefon hattında AB dolaşımını varsaymayın",
        body: "Türkiye hattı AB 'roam like at home' kapsamına otomatik girmez; operatörünüzün İtalya paketini kontrol edin. Seyahat eSIM'i veri sağlar ama çoğu zaman İtalyan telefon numarası vermez. Tren, müze ve restoran rezervasyonlarını e-posta/WhatsApp ile yönetebilirsiniz; uygulama için hesap ülkesini değiştirmeden önce web veya misafir ödeme seçeneğini deneyin.",
      },
      {
        title: "Grev ve çalışma duyurusuna bir gün önce bakın",
        body: "Tren, yerel ulaşım ve havayolu grevleri programı etkileyebilir; bazı uzun mesafe trenlerinde garantili sefer listeleri yayımlanır. Söylenti hesabı yerine Ulaştırma Bakanlığı grev takvimi, Trenitalia/Italo ve yerel işletme duyurusunu izleyin. Ayrı biletli uçuş–tren–feribot arasında geniş pay bırakın.",
      },
    ],
    routeIdeas: [
      {
        title: "İlk İtalya yolculuğu",
        duration: "10–12 gün",
        cities: ["Roma", "Floransa", "Venedik"],
        description:
          "Roma'da dört, Floransa'da üç, Venedik'te üç gece. Hızlı tren omurgasıyla ilerleyin; büyük müzeleri ve Vatikan'ı aynı günlere yığmayın.",
      },
      {
        title: "Kuzeyde sanat ve tasarım",
        duration: "7–9 gün",
        cities: ["Milano", "Venedik", "Floransa"],
        description:
          "Milano'da üç, Venedik'te iki–üç, Floransa'da üç gece. Son Akşam Yemeği bileti rotanın tarihlerini belirleyen ilk rezervasyon olsun.",
      },
      {
        title: "Roma ve Campania",
        duration: "10–13 gün",
        cities: ["Roma", "Napoli", "Amalfi Kıyısı"],
        description:
          "Roma'da dört, Napoli'de üç ve kıyıda dört–beş gece. Pompeii'yi Napoli ayağına, kıyı ulaşımını Salerno veya Sorrento kapısına göre yerleştirin.",
      },
      {
        title: "Güneyde yemek ve deniz",
        duration: "7–9 gün",
        cities: ["Napoli", "Amalfi Kıyısı"],
        description:
          "Napoli'de tarih, pizza ve MANN için üç gün; Amalfi Kıyısı'nda tek üs üzerinden köy, yürüyüş ve feribot için dört–beş gece.",
      },
    ],
  },
  FR: {
    seoTitle: "Fransa Gezi Rehberi: Şehirler, Trenler ve Rota Planı",
    seoDescription:
      "Fransa gezi rehberi: Paris, Nice, Lyon, Marsilya, Bordo ve Strazburg için güncel ulaşım, yemek, bilet, konaklama ve rota bilgileri.",
    planningHeading: "Fransa rotası nasıl kurulur?",
    essentialsHeading: "Fransa'ya gitmeden önce bilinmesi gerekenler",
    citiesHeading: "Fransa'da gezilecek şehirler ve şehir rehberleri",
    cityGridIntro:
      "Fransa'da gezilecek şehirler yalnız Paris'ten ibaret değildir. Paris müzeleri ve mahalleleriyle klasik başlangıç noktasıdır; Lyon gastronomi, Marsilya liman kültürü, Nice Akdeniz kıyıları, Bordo şarap coğrafyası ve Strazburg Alsace mimarisiyle yolculuğa farklı katmanlar ekler. Hızlı tren ağı sayesinde şehirleri birleştirmek kolaydır; ancak kısa bir Fransa gezisinde Paris'in yanına tek bir bölge eklemek, sürekli yer değiştirmekten daha keyifli olur.",
    intro: [
      "Fransa'yı yalnız Paris'e eklenen birkaç hızlı durak gibi planlamayın. Paris büyük müzeler ve mahalleler için başlı başına bir yolculuk; Lyon gastronomi ile Roma mirasını, Marsilya Akdeniz'in çok kültürlü liman kimliğini, Nice Côte d'Azur kıyılarını, Bordo şarap coğrafyasını, Strazburg ise Alsace'ın Fransız–Alman katmanlarını açar. Aynı ülke içinde iklim, mutfak ve kent ritmi belirgin biçimde değişir.",
      "TGV ağı Paris'i Lyon, Marsilya, Bordo ve Strazburg'a hızlı bağlar; Nice daha uzun bir güneydoğu ayağıdır. Her hattın Paris'te aynı gardan kalkmadığını, OUIGO ile TGV INOUI'nin bagaj ve değişiklik koşullarının farklı olabildiğini unutmayın. 8–10 günde Paris ile tek bir bölge, 12–14 günde Paris ve iki ana üs dengelidir. Şehirleri haritadaki yakınlığa göre değil, tren süresi ile istediğiniz deneyime göre eşleştirin.",
    ],
    essentials: [
      {
        title: "Vize ve sınır sistemini resmî kanaldan doğrulayın",
        body: "Umuma mahsus Türk pasaportuyla kısa turistik seyahatte genel olarak Schengen vizesi gerekir; pasaport türü ve kişisel durumunuza göre sonucu France-Visas'ın vize asistanından kontrol edin. EES, Schengen dış sınırlarında kısa süreli ziyaretçilerin giriş–çıkışını elektronik kaydeder. ETIAS ise Ağustos 2026 itibarıyla henüz çalışmıyor; başlangıç tarihi için yalnız Avrupa Birliği'nin resmî sayfasını izleyin ve erken başvuru sattığını söyleyen sitelere ödeme yapmayın.",
      },
      {
        title: "TGV, OUIGO ve TER aynı bilet mantığıyla çalışmaz",
        body: "TGV INOUI ile OUIGO belirli tren ve koltuğa bağlıdır; bagaj, istasyon, değişiklik ve iade şartı tarifeye göre değişebilir. TER bölgesel trenlerinde koltuk rezervasyonu çoğunlukla yoktur ve kurallar bölgeye göre farklılaşabilir. SNCF Connect e-bileti peronda ayrıca damgalanmaz; çevrimdışı indirin, bilette yazan yolcu kimliğiyle aynı kimliği taşıyın ve kalkıştan önce doğru garı kontrol edin.",
      },
      {
        title: "Paris'e ait ulaşım kuralını bütün Fransa'ya taşımayın",
        body: "Temassız banka kartı kullanımı şehirden şehre değişir: Lyon'da TCL ağında yaygınken Paris metrosunda 2026 yazında genel turnike ödeme yöntemi değildir; Strazburg'da açık ödeme sistemi henüz tam devrede değildir. Nice, Marsilya ve Bordo'nun kendi kart, uygulama ve doğrulama kuralları vardır. Biletinizi ilk binişte ve gerekiyorsa her aktarmada doğrulayın; aynı banka kartının grup bileti sayılacağını varsaymayın.",
      },
      {
        title: "Restoran fiyatına vergi ve servis dahildir",
        body: "Fransa'da menü fiyatı vergi ile servisi içerir; 'prix service compris' ibaresi bunu açıklar. Bahşiş zorunlu değildir, memnun kaldığınız serviste küçük nakit veya yuvarlama tercihtir. Yemekle birlikte musluk suyu için 'une carafe d'eau, s'il vous plaît' diyebilirsiniz; ücretsiz su sürahisi talebi şişe su siparişi değildir. Popüler küçük restoranlarda akşam rezervasyonu yapın ve pazar–pazartesi kapanışını kontrol edin.",
      },
      {
        title: "Otomobil için ehliyet, ZFE ve Crit'Air birlikte düşünülür",
        body: "Kısa ziyarette AB dışı ehliyet geçerli olmalı ve Fransızca değilse resmî çeviri veya uluslararası sürücü belgesiyle desteklenmelidir; IDP asıl ehliyetin yerine geçmez. Düşük emisyon bölgeleri şehir bazında farklı kural uygular ve yabancı plakalı araç da Crit'Air etiketine ihtiyaç duyabilir. Etiketi yalnız certificat-air.gouv.fr üzerinden önceden alın; kiralık araçla merkeze girmeden şirketten plaka ve etiket durumunu yazılı doğrulayın.",
      },
      {
        title: "Otoyol ve parkta sonradan ödeme tuzağına dikkat edin",
        body: "Bazı Fransız otoyollarında bariyersiz 'flux libre' gişe sistemi vardır; plaka okunur ve ödeme belirlenen süre içinde çevrimiçi ya da yetkili noktadan yapılır. Kiralama şirketinin bunu otomatik çözeceğini varsaymayın; yönetim ücreti eklenebilir. Şehir içinde yol kenarı parkının bölge, saat ve çevre etiketine göre değişen kuralını tabeladan okuyun. Altı rehber şehrin merkezinde araç çoğunlukla avantaj değil yüktür.",
      },
      {
        title: "Turist vergisi rezervasyon toplamından ayrı çıkabilir",
        body: "Konaklama vergisi belediye, tesis sınıfı, kişi ve geceye göre değişir; bazı platformlarda ödeme anında, bazılarında tesiste tahsil edilir. Paris ile Nice'teki tutarı başka şehre kopyalamayın ve eski blogdaki sabit rakama güvenmeyin. Rezervasyon dökümünde 'taxe de séjour' satırını, yaş muafiyetini ve ödeme yöntemini doğrudan tesisten doğrulayın.",
      },
      {
        title: "Türkiye hattı AB içi dolaşım sayılmaz",
        body: "Türkiye'deki mobil hattınız otomatik olarak AB 'roam like at home' kapsamında değildir; Fransa paketini operatörünüzden kontrol edin. Veri eSIM'i harita ve bilet uygulamalarını çalıştırır fakat çoğu Fransız telefon numarası vermez. Uygulama mağazası ülkesini değiştirmeden önce SNCF Connect, şehir ulaşım uygulaması ve müze sitelerinin web veya mobil cüzdan seçeneklerine bakın.",
      },
      {
        title: "Grev ve bakım duyurusunu seyahatten hemen önce okuyun",
        body: "Ulusal tren, kent içi ulaşım ve hava trafiği grevleri ile planlı mühendislik çalışmaları bağlantıları değiştirebilir. Bir gün önce SNCF Connect ve yerel işletmenin trafik sayfasına, havalimanına gideceğiniz sabah yeniden bakın. Ayrı biletli tren–uçuş arasında geniş pay bırakın; aynı gün son uluslararası uçuşa bağlanan uzak günübirlik gezi planlamayın.",
      },
    ],
    routeIdeas: [
      {
        title: "İlk Fransa yolculuğu",
        duration: "9–11 gün",
        cities: ["Paris", "Lyon", "Nice"],
        description:
          "Paris'te beş, Lyon'da iki–üç, Nice'te üç gece. TGV ile kuzeyden güneye ilerleyin; Côte d'Azur günübirliklerini Nice ayağında tutun.",
      },
      {
        title: "Akdeniz ve Rhône hattı",
        duration: "8–10 gün",
        cities: ["Lyon", "Marsilya", "Nice"],
        description:
          "Gastronomiden liman kültürüne ve Riviera kıyılarına uzanan mantıklı tren rotası. Calanques ile plaj günlerini hava ve deniz koşuluna göre esnek bırakın.",
      },
      {
        title: "Şarap ve Atlantik",
        duration: "7–9 gün",
        cities: ["Paris", "Bordo"],
        description:
          "Paris'te dört–beş, Bordo'da üç–dört gece. Saint-Émilion veya Médoc bağ gezisini Bordo'dan rezervasyonlu bir tam gün olarak ekleyin.",
      },
      {
        title: "Kuzeydoğuda iki kültür",
        duration: "6–8 gün",
        cities: ["Paris", "Strazburg"],
        description:
          "Paris müzelerinden TGV ile Alsace'a geçin. Strazburg'u Colmar veya şarap yolu ile birleştirin; Noel pazarı döneminde çok erken konaklama ayırın.",
      },
    ],
  },
  KR: {
    seoTitle: "Güney Kore Gezi Rehberi: 6 Şehir ve Rota Planı",
    seoDescription:
      "Güney Kore gezi rehberi: Seul, Busan, Jeju, Gyeongju, Incheon ve Sokcho için güncel ulaşım, giriş, yemek, konaklama ve rota bilgileri.",
    planningHeading: "Güney Kore rotası nasıl kurulur?",
    essentialsHeading: "Güney Kore'ye gitmeden önce bilinmesi gerekenler",
    citiesHeading: "Güney Kore'de gezilecek şehirler ve ada rehberleri",
    cityGridIntro:
      "Güney Kore'de gezilecek şehirler modern kültür, tarih, kıyı ve doğayı kısa mesafelerde buluşturur. Seul sarayları ve çağdaş mahalleleriyle, Busan sahilleri ve deniz ürünleriyle, Gyeongju eski krallık mirasıyla öne çıkar. Incheon ilk veya son gece için pratik bir durak, Sokcho Seoraksan yürüyüşlerinin kapısı, Jeju Adası ise volkanik manzaralarıyla ayrı bir tatil rotasıdır. Hızlı tren ve iç hat uçuşlarını birlikte kullanmak dengeli bir gezi sağlar.",
    intro: [
      "Güney Kore'yi yalnız Seul'deki saraylar ve K-pop alışverişi olarak planlamayın. Seul büyük metropol ve Joseon tarihini; Gyeongju Silla mirasını; Busan plajlar ile liman mutfağını; Sokcho Seoraksan doğasını; Jeju volkanik ada kültürünü; Incheon ise modern liman tarihiyle havalimanının ötesindeki şehri açar.",
      "Seul–Gyeongju–Busan hattı KTX ile mantıklı bir kara omurgasıdır. Sokcho'ya şehirlerarası otobüsle, Jeju'ya uçuşla gidilir. Incheon Havalimanı, merkez Incheon ve Songdo aynı nokta değildir. İlk yolculukta 10–12 gün Seul, Gyeongju ve Busan için dengeli; Jeju veya Sokcho eklendiğinde 14 güne yaklaşmak transferleri geziye dönüştürür.",
    ],
    essentials: [
      {
        title: "Türk vatandaşları K-ETA koşulunu özellikle kontrol etmeli",
        body: "Kore Cumhuriyeti İstanbul Başkonsolosluğu'nun 2026 yönlendirmesine göre Türk vatandaşları turistik, kültürel, aile ziyareti ve belirli iş amaçlarıyla 90 güne kadar vizeden muaf olabilir; ancak seyahatten önce K-ETA gerekir. Muaf ülke listelerindeki genel haberi Türkiye'ye otomatik uygulamayın. Yalnız k-eta.go.kr alanını kullanın ve pasaport bilgilerini birebir girin.",
      },
      {
        title: "e-Arrival Card ile K-ETA aynı işlem değildir",
        body: "Elektronik geliş kartı ücretsizdir ve resmî e-arrivalcard.go.kr alanından varıştan önceki üç gün içinde gönderilebilir. Geçerli K-ETA sahipleri e-Arrival Card'dan muaf olabilir; kişisel statünüzü resmî yönlendiricide kontrol edin. Ücret isteyen benzer alan adlarına pasaport yüklemeyin.",
      },
      {
        title: "T-money için nakit yedeği taşıyın",
        body: "T-money veya EZL kartı metro, otobüs ve bazı başka ulaşım hizmetlerinde kullanılır. Kart satın alma ve bakiye yükleme noktalarının çoğu nakit ister. Yabancı temassız banka kartını her metro turnikesinde kullanabileceğinizi varsaymayın; inerken otobüste yeniden okutmak aktarma hesabı için önemlidir.",
      },
      {
        title: "Naver Map, Papago ve Kakao T üç temel araçtır",
        body: "Naver Map veya KakaoMap çıkış, otobüs durağı ve yürüme yönünde genellikle daha ayrıntılıdır; adresin Korece adını kaydedin. Papago menü/konuşma çevirisi, Kakao T resmî taksi çağırma için faydalıdır. Çevrimdışı otel adresi, son tren ve acil durum bilgisi de saklayın.",
      },
      {
        title: "KTX biletini KORAIL'ın resmî kanalından alın",
        body: "Şehir adıyla arama yapan taklit veya komisyonlu siteler yerine KORAIL'ın resmî web/app yönlendirmesini kullanın. Seul–Busan omurgası kolaydır; Gyeongju KTX Station tarihî merkezin dışındadır. Koltuk, tren istasyonu, bagaj ve iki uçtaki transferi toplam süreye ekleyin.",
      },
      {
        title: "Kart yaygın, nakit hâlâ işlevlidir",
        body: "Otel, mağaza ve restoranlarda kart yaygındır; pazar, küçük işletme ve ulaşım kartı yüklemesi için won taşıyın. Terminal size TL veya başka para birimi teklif ederse dinamik kur dönüşümünün maliyetini okuyun; çoğu durumda yerel para birimiyle ödeme daha şeffaftır. Bahşiş genel beklenti değildir.",
      },
      {
        title: "Restoranın servis ritmini okuyun",
        body: "Banchan yan tabakları çoğu yerde yemeğin parçasıdır; yenileme mümkün olsa da israf etmeyin. Su, çatal-kaşık ve ödeme self-servis olabilir; masa tableti veya kasada ön ödeme yaygındır. Mangal/set menüsünde kişi başı minimum, gramaj ve aynı masanın tek menü seçme kuralını siparişten önce sorun.",
      },
      {
        title: "eSIM her zaman Kore telefon numarası vermez",
        body: "Veri eSIM'i harita ve mesajlaşma için yeterli olabilir ama restoran sıra sistemi, teslimat veya bazı doğrulamalar Kore numarası isteyebilir. Üründe ses/SMS ve yerel numara olup olmadığını ayırın; kimlik kayıtlı turist SIM'i ile yalnız veri eSIM'ini aynı saymayın.",
      },
      {
        title: "Muson, tayfun ve hava kalitesini aynı gün izleyin",
        body: "Yaz sıcak, nemli ve yağışlı; güney kıyısı ile Jeju tayfundan etkilenebilir. İlkbaharda ince toz/hava kalitesi, kışın buz ve dağ karı programı değiştirir. Resmî hava uyarısını izleyin; feribot, Hallasan ve Seoraksan günlerine yedek bırakın.",
      },
      {
        title: "Yaşayan mahallelerde mahremiyet turizmden önce gelir",
        body: "Bukchon, Gamcheon ve hanok köyleri dekor değil konuttur. Özel kapı/çatıya girmeyin, yüksek sesle konuşmayın ve insanları izinsiz yakın plandan çekmeyin. Tapınak/saray tabelasına, metroda sessizliğe ve ayakkabı çıkarılan mekân kuralına uyun.",
      },
    ],
    routeIdeas: [
      {
        title: "İlk Güney Kore yolculuğu",
        duration: "10–12 gün",
        cities: ["Seul", "Gyeongju", "Busan"],
        description:
          "Seul'de beş, Gyeongju'da iki–üç, Busan'da üç–dört gece. KTX omurgasını kullanın; istasyon–merkez transferlerini ayrı planlayın.",
      },
      {
        title: "Kültür ve ada doğası",
        duration: "10–13 gün",
        cities: ["Busan", "Gyeongju", "Jeju Adası"],
        description:
          "Busan limanından Silla başkentine, ardından uçuşla Jeju'nun volkanik kıyılarına geçin. Hallasan ve Udo için iki ayrı hava yedeği düşünün.",
      },
      {
        title: "Başkent ve Seoraksan",
        duration: "7–9 gün",
        cities: ["Seul", "Sokcho"],
        description:
          "Seul'e beş gün, Sokcho'ya iki–üç gün. Şehirlerarası otobüs terminalini doğru seçin ve dağ gününü varış/dönüş gününe sıkıştırmayın.",
      },
      {
        title: "Havalimanından öte Incheon",
        duration: "2–3 gün",
        cities: ["Incheon"],
        description:
          "Chinatown ve Open Port'a bir, Songdo'ya bir gün verin. Ganghwa'yı ekleyecekseniz üçüncü tam gün ve ayrı ulaşım planı gerekir.",
      },
    ],
  },
  ES: {
    seoTitle: "İspanya Gezi Rehberi: 16 Şehir, Adalar ve Rotalar",
    seoDescription:
      "İspanya gezi rehberi: Barcelona, Madrid, Endülüs, Bask kıyısı, Mallorca, Ibiza ve Kanarya Adaları için 16 kapsamlı Türkçe rota.",
    planningHeading: "İspanya rotası nasıl kurulur?",
    essentialsHeading: "İspanya'ya gitmeden önce bilinmesi gerekenler",
    citiesHeading: "İspanya'da gezilecek şehirler ve adalar",
    cityGridIntro:
      "İspanya'da gezilecek şehirler, ülkenin bölgesel kimlikleri sayesinde her durakta değişen bir deneyim sunar. Madrid sanat müzeleriyle, Barcelona Gaudí mimarisiyle, Sevilla ve Granada Endülüs mirasıyla, Valencia ise Akdeniz yaşamıyla öne çıkar. Bilbao ile San Sebastián Bask kültürünü; Mallorca, Ibiza, Tenerife ve Gran Canaria ada rotalarını temsil eder. İlk seyahatte birbirine trenle bağlanan iki veya üç şehir seçmek, ülkeyi daha yavaş ve anlamlı keşfetmenizi sağlar.",
    intro: [
      "İspanya'yı yalnız Barcelona–Madrid ikilisi olarak planlamayın. Katalonya modernisme ve Akdeniz şehir hayatını; Madrid büyük sanat koleksiyonlarını; Endülüs İslam, Yahudi ve Hristiyan mirasının katmanlarını; Bask kıyısı Atlantik ve pintxos kültürünü; Balear Adaları koylarla tarihî şehirleri; Kanarya Adaları ise volkanik doğa ve yıl boyu değişken mikroiklimleri açar.",
      "Anakara omurgasında hızlı tren güçlüdür: Barcelona–Valencia–Madrid doğu hattı, Madrid–Córdoba–Sevilla/Málaga güney hattı mantıklı akışlardır. San Sebastián–Bilbao otobüsle iyi bağlanır. Mallorca, Ibiza, Tenerife ve Gran Canaria'yı kısa anakara programına sıkıştırmayın; her biri uçuş/feribot ve en az üç–beş günlük ayrı ada ayağıdır.",
    ],
    essentials: [
      {
        title: "Schengen vizesi ve EES",
        body: "Umuma mahsus Türk pasaportu taşıyanlar kısa turistik ziyaret için Schengen vizesi almalıdır. EES 10 Nisan 2026'dan beri dış sınır geçişlerini elektronik kaydeder. ETIAS Türk vatandaşının vizesinin yerine geçmez; pasaport türünüz ve kişisel statünüzü İspanya dış temsilciliğinden doğrulayın.",
      },
      {
        title: "Tren biletini erken karşılaştırın",
        body: "Renfe yanında aynı hızlı hatlarda farklı işletmeciler bulunabilir. Biletin değişiklik, bagaj, istasyon ve tren koşulunu okuyun. Madrid Atocha ile Chamartín; Barcelona Sants; Sevilla Santa Justa gibi doğru istasyonu kontrol edin.",
      },
      {
        title: "Bölgesel diller görünürdür",
        body: "İspanyolca ülke genelinde çalışır; Katalanca/Valensiyaca, Baskça ve diğer bölgesel diller tabela ile yer adlarında kullanılır. Şehrin iki yazımını kaydetmek durak ve navigasyonu kolaylaştırır.",
      },
      {
        title: "Öğün saatini rotaya katın",
        body: "Öğle ve akşam birçok Türk gezginin alıştığından geçtir. Paella gibi bazı yemekler özellikle öğlen hazırlanır; küçük şehirlerde mutfak öğle sonrası kapanabilir. Popüler restoranda servis saatini önceden doğrulayın.",
      },
      {
        title: "Kart yaygın, avro yedeği iyi",
        body: "Kart çoğu yerde çalışır; küçük pazar ve kırsal işletme için nakit taşıyın. Terminal TL dönüşümü önerirse kur ve komisyonu okuyun; çoğu durumda yerel para birimiyle ödeme daha şeffaftır.",
      },
      {
        title: "Ada ve anakara iklimi aynı değildir",
        body: "Sevilla yazı, Bask yağmuru, Balear sezonu ve Kanarya mikroiklimi tek hava tahminiyle planlanmaz. Dağ, kıyı ve şehir katmanlarını aynı gün için ayrı kontrol edin.",
      },
    ],
    routeIdeas: [
      {
        title: "İlk İspanya yolculuğu",
        duration: "7–9 gün",
        cities: ["Barcelona", "Madrid", "Toledo"],
        description:
          "Barcelona'da dört, Madrid'de üç gece; Toledo'yu Madrid'den günübirlik veya bir gece ekleyin. İki ana şehri hızlı trenle bağlayın.",
      },
      {
        title: "Klasik Endülüs",
        duration: "8–10 gün",
        cities: ["Sevilla", "Córdoba", "Granada", "Málaga"],
        description:
          "Sevilla üç, Córdoba bir–iki, Granada iki–üç, Málaga iki gece. Elhamra ve Alcázar biletlerini rota netleşince resmî kanaldan alın.",
      },
      {
        title: "Akdeniz şehirleri",
        duration: "8–10 gün",
        cities: ["Barcelona", "Valencia", "Alicante"],
        description:
          "Mimari yoğun Barcelona'dan bisiklet ve paella odaklı Valencia'ya, ardından kale–plaj ölçekli Alicante'ye trenle güneye inin.",
      },
      {
        title: "Bask gastronomi hattı",
        duration: "5–7 gün",
        cities: ["Bilbao", "San Sebastián"],
        description:
          "Bilbao'ya iki–üç, San Sebastián'a üç gece ayırın; Getxo, Getaria veya Hondarribia'dan yalnız bir kıyı günü seçin.",
      },
      {
        title: "Ada rotası",
        duration: "5–7 gün",
        cities: ["Palma de Mallorca", "Ibiza", "Tenerife", "Gran Canaria"],
        description:
          "Bu dört adayı tek haftaya koymayın. Mallorca–Ibiza ikilisi veya Tenerife/Gran Canaria'dan biri için ayrı beş–yedi günlük rota seçin.",
      },
    ],
  },
  TR: {
    seoTitle: "Türkiye Gezi Rehberi: 19 Şehir, Kıyı ve Kültür Rotası",
    seoDescription:
      "Türkiye gezi rehberi: İstanbul, Antalya, Ege kıyıları, Kapadokya, Karadeniz ve Mezopotamya için 19 kapsamlı şehir ve bölge yazısı.",
    planningHeading: "Türkiye rotası nasıl kurulur?",
    essentialsHeading: "Türkiye içinde seyahati kolaylaştıran bilgiler",
    citiesHeading: "Türkiye'de gezilecek şehirler ve bölgeler",
    cityGridIntro:
      "Türkiye'de gezilecek şehirler; İstanbul'un tarihî mahallelerinden Ege ve Akdeniz kıyılarına, Kapadokya vadilerinden Güneydoğu'nun gastronomi rotalarına uzanır. İzmir, Muğla, Bodrum ve Fethiye deniz odaklı bir geziye; Mardin, Gaziantep ve Şanlıurfa kültür ile mutfağa; Trabzon doğaya, Ankara ve Bursa ise şehir tarihine güçlü başlangıçlar sunar. Mesafeler uzun olduğu için aynı yolculukta yakın bölgeleri eşleştirmek en rahat plandır.",
    intro: [
      "Türkiye'yi tek bir kıyı tatili veya İstanbul–Kapadokya kontrol listesi gibi değil, ayrı coğrafyalar halinde planlayın. İstanbul iki kıtalı metropolü; Ege ve Akdeniz yarımada–antik kent–deniz dengesini; İç Anadolu Selçuklu, Cumhuriyet ve kaya yerleşimlerini; Karadeniz hava odaklı doğayı; Güneydoğu ise Neolitik arkeoloji, taş şehir ve çok katmanlı mutfakları açar.",
      "Bodrum, Fethiye ve Marmaris idari olarak Muğla sınırlarında olsa da ayrı arama ve seyahat niyetleridir. Bu nedenle Muğla rehberi Akyaka–Gökova–Datça eksenine odaklanır. Kapadokya şehir değil bölgedir; Göreme, Uçhisar, Ürgüp ve Avanos üsleriyle planlanır. Kaş ve Alanya da Antalya merkezden saatler uzakta bağımsız kıyı duraklarıdır.",
    ],
    essentials: [
      {
        title: "Şehir kartları birbirinin yerine geçmez",
        body: "İstanbulkart, İzmirim Kart, Antalyakart ve diğer belediye kartları ayrı sistemlerdir. QR, temassız banka kartı ve aktarma koşulu şehirden şehre değişir; yerel ulaşım kurumunun güncel bilgisini kontrol edin.",
      },
      {
        title: "MüzeKart ile MuseumPass ayrı ürünlerdir",
        body: "T.C. vatandaşları MüzeKart, yabancı ziyaretçiler MuseumPass ürünlerini kullanır. Geçerli kurum, gece müzeciliği ve Topkapı Harem, Göreme Karanlık Kilise, Efes Yamaç Evler gibi özel bölümler ayrıca kontrol edilmelidir.",
      },
      {
        title: "İl adı mesafeyi gizleyebilir",
        body: "Antalya merkez–Kaş–Alanya veya Muğla merkez–Bodrum–Datça aynı ilde olsa da saatler süren kara yoludur. Haritayı idari sınıra değil gerçek sürüş, viraj, trafik ve son dolmuş saatine göre okuyun.",
      },
      {
        title: "YHT omurgasını kullanın",
        body: "İstanbul–Eskişehir–Ankara–Konya hattında YHT güçlüdür. Kıyı ve doğu rotalarında uçuş/otobüs daha baskın olabilir. Gar, otogar ve havalimanı çoğu şehirde merkezden farklı yerde bulunur.",
      },
      {
        title: "Kart + nakit birlikte çalışır",
        body: "Şehir oteli ve restoranlarda kart yaygın; dolmuş, pazar, küçük esnaf ve kırsal durakta nakit gerekebilir. Menü, kilo fiyatı, kuver ve tekne/aktivite dahilini siparişten önce netleştirin.",
      },
      {
        title: "İklim bölgeseldir",
        body: "Antalya sıcağı, Karadeniz sisi, Kapadokya rüzgârı ve Doğu/Güneydoğu yazı tek valiz kuralına uymaz. Balon, feribot, yayla ve tekne günlerine hava yedeği bırakın.",
      },
      {
        title: "Yunan adaları uluslararası çıkıştır",
        body: "Bodrum–Kos, Kaş–Meis ve Marmaris–Rodos feribotları iç hat değildir. Pasaport, Yunanistan/Schengen giriş koşulu, liman vergisi ve sefer durumunu resmî kanaldan doğrulayın.",
      },
    ],
    routeIdeas: [
      {
        title: "İlk Türkiye yolculuğu",
        duration: "9–11 gün",
        cities: ["İstanbul", "Kapadokya", "Antalya"],
        description:
          "İstanbul'a dört–beş, Kapadokya'ya üç–dört, Antalya merkeze iki–üç gece. İki uzun geçişi uçuşla bağlayın ve balona hava yedeği bırakın.",
      },
      {
        title: "Ege kıyısı ve antik kentler",
        duration: "10–14 gün",
        cities: ["İzmir", "Bodrum", "Muğla", "Marmaris", "Fethiye"],
        description:
          "İzmir–Efes'ten Bodrum'a, ardından Akyaka/Datça, Marmaris ve Fethiye'ye inin. Her tatil beldesine tek gecelik durak koymak yerine üç üs seçin.",
      },
      {
        title: "Likya ve Batı Akdeniz",
        duration: "8–10 gün",
        cities: ["Fethiye", "Kaş", "Antalya"],
        description:
          "Fethiye'de Ölüdeniz/Kayaköy, Kaş'ta Kekova/dalış, Antalya'da Kaleiçi/antik kent. Sahil yolu manzaralı ama yavaştır.",
      },
      {
        title: "Güneydoğu gastronomi ve arkeoloji",
        duration: "7–9 gün",
        cities: ["Gaziantep", "Şanlıurfa", "Mardin"],
        description:
          "Zeugma ve Antep mutfağından Göbeklitepe'ye, ardından Dara–Midyat–Mardin'e ilerleyin. Öğünleri ve açık alan sıcağını günlere dağıtın.",
      },
      {
        title: "YHT ile İç Anadolu",
        duration: "6–8 gün",
        cities: ["İstanbul", "Eskişehir", "Ankara", "Konya"],
        description:
          "Trenle kompakt şehirler, başkent müzeleri ve Selçuklu mirasını birleştirin; Kapadokya'yı karayoluyla eklemek için üç gün daha ayırın.",
      },
    ],
  },
  GB: {
    seoTitle: "Birleşik Krallık Gezi Rehberi: 16 Şehir ve Doğa Rotası",
    seoDescription:
      "Londra, Edinburgh, Manchester, Liverpool, Bath, York, Highlands, Cotswolds ve Lake District için 16 kapsamlı Türkçe Birleşik Krallık rehberi.",
    planningHeading: "Birleşik Krallık rotası nasıl kurulur?",
    essentialsHeading: "Birleşik Krallık'a gitmeden önce bilinmesi gerekenler",
    citiesHeading: "Birleşik Krallık'ta gezilecek şehirler ve bölgeler",
    cityGridIntro:
      "Birleşik Krallık'ta gezilecek şehirler, başkent deneyiminden üniversite kasabalarına ve büyük doğa rotalarına kadar geniş bir seçenek sunar. Londra müzeler ve mahalleler için güçlü bir başlangıçtır; Edinburgh ile York tarih, Manchester ve Liverpool müzik ile futbol, Bath ve Oxford mimari miras için öne çıkar. Highlands, Cotswolds ve Lake District şehir gezisini doğayla birleştirir. İngiltere, İskoçya, Galler ve Kuzey İrlanda duraklarını yol sürelerine göre bölmek en dengeli plandır.",
    intro: [
      "Birleşik Krallık'ı yalnız Londra ve birkaç günübirlik gezi gibi planlamayın. Londra dünya müzeleri ve mahalle mutfaklarını; İngiltere'nin üniversite ve tarih kentleri farklı dönemleri; Manchester–Liverpool kuzeyin sanayi, müzik ve futbol kültürünü; Edinburgh–Glasgow İskoçya'nın tarih ile çağdaş sanat karşıtlığını; Belfast ve Cardiff ise Kuzey İrlanda ile Galler'in ayrı kimliğini açar.",
      "Demiryolu Londra–York–Edinburgh ve Londra–Manchester–Liverpool omurgalarında güçlüdür; Advance bilet saatli ve daha kısıtlı, Off-Peak esnek olabilir. Highlands, Cotswolds ve Lake District tek şehir değildir: hava, seyrek otobüs, araç ve en az birkaç gece isteyen kırsal bölgelerdir.",
    ],
    essentials: [
      {
        title: "Türk vatandaşına ziyaretçi vizesi gerekir",
        body: "Türkiye Birleşik Krallık'ın vizeye tabi ülke listesindedir. Umuma mahsus pasaportla Standard Visitor vizesi yolculuk öncesi alınmalıdır; ETA vizenin yerine geçmez. Kişisel pasaport ve seyahat amacınızı yalnız GOV.UK üzerinden doğrulayın.",
      },
      {
        title: "Tren bileti türünü okuyun",
        body: "Advance çoğunlukla belirli tren, Off-Peak saat kısıtı, Anytime daha yüksek esneklik sunar. İstasyon adı, operatör, railcard uygunluğu ve aktarmayı National Rail'den kontrol edin; gecikmede yolcu haklarını saklayın.",
      },
      {
        title: "Londra temassız sistemi ülke geneli değildir",
        body: "TfL'de banka kartı/telefonla günlük üst sınır kullanışlıdır; her yolcu ayrı ve yolculuğun iki ucunda aynı ödeme aracını kullanmalıdır. Bu düzeni Manchester tramvayı, Glasgow Subway veya ülke trenlerine otomatik uygulamayın.",
      },
      {
        title: "Sterlin ve servis ücreti",
        body: "Kart/temassız ödeme yaygındır; küçük kırsal durak için az nakit taşıyın. Restoranda discretionary service charge eklenmişse aynı hizmet için tekrar tam bahşiş beklenmez. Terminalde yerel para birimi GBP'yi seçin.",
      },
      {
        title: "İngiltere, İskoçya, Galler ve Kuzey İrlanda",
        body: "Dört ülkenin yerel kimliği, bazı tatilleri ve ulaşım kurumları farklıdır. Galler'i veya İskoçya'yı 'İngiltere' diye adlandırmayın; iki dilli tabela ve yerel adlara saygı gösterin.",
      },
      {
        title: "Yağmurdan çok değişkenlik",
        body: "Su geçirmez ince katman yıl boyu gerekir. Highlands ve Lake District'te şehir hava uygulaması dağ tahmini değildir; yürüyüşte gün ışığı, rüzgâr, çevrimdışı harita ve geri dönüş planı kullanın.",
      },
    ],
    routeIdeas: [
      {
        title: "İlk Birleşik Krallık yolculuğu",
        duration: "8–10 gün",
        cities: ["Londra", "York", "Edinburgh"],
        description:
          "Londra'da beş, York'ta bir–iki, Edinburgh'da üç gece. East Coast Main Line üzerinde doğrudan trenlerle ilerleyin.",
      },
      {
        title: "Güney İngiltere kültür rotası",
        duration: "7–9 gün",
        cities: ["Londra", "Oxford", "Bath", "Bristol"],
        description:
          "Londra'dan Oxford kolejlerine, Bath Roma–Georgian mirasına ve Bristol liman/sokak sanatına. Cotswolds için iki–üç gün ekleyin.",
      },
      {
        title: "Kuzeyin müzik ve futbol şehirleri",
        duration: "5–7 gün",
        cities: ["Manchester", "Liverpool", "York"],
        description:
          "Manchester ve Liverpool'a ikişer gece, York'a iki gece. Maç ve konser fikstürü otel ile tren kararını belirlesin.",
      },
      {
        title: "İskoçya şehir ve doğa",
        duration: "10–14 gün",
        cities: ["Edinburgh", "Glasgow", "İskoçya Highlands"],
        description:
          "İki şehre ikişer–üçer gece, Glencoe–Skye–Inverness hattına en az altı–sekiz gün. Highlands'i Edinburgh'dan tek günlük otobüse indirmeyin.",
      },
      {
        title: "Batı başkentleri ve limanlar",
        duration: "7–9 gün",
        cities: ["Bristol", "Cardiff", "Belfast"],
        description:
          "Bristol ve Cardiff'i kısa trenle bağlayın; Belfast'a uçuşla geçip şehir + Causeway kıyısına üç gün ayırın.",
      },
      {
        title: "İngiltere'nin doğa molası",
        duration: "5–7 gün",
        cities: ["Lake District"],
        description:
          "Windermere/Ambleside ve Keswick'te iki üs kurun. Göl teknesi, düşük seviye yürüyüş ve hava yedeğini aynı programa koyun.",
      },
    ],
  },
  ID: {
    seoTitle: "Endonezya Gezi Rehberi: 18 Rota, Adalar ve Ulaşım",
    seoDescription: "Endonezya gezi rehberi: Bali, Java, Lombok, Komodo, Sumatra, Sulawesi ve Raja Ampat'ta 18 kapsamlı rota, vize, ulaşım ve bütçe.",
    planningHeading: "Endonezya rotası nasıl kurulur?",
    essentialsHeading: "Endonezya'ya gitmeden önce bilinmesi gerekenler",
    citiesHeading: "Endonezya'da gezilecek şehirler, adalar ve doğa rotaları",
    cityGridIntro: "Endonezya'da gezilecek yerler tek bir Bali tatiline sığmaz. Jakarta ve Yogyakarta Java'nın kent-tarih omurgasını; Ubud, Canggu, Uluwatu ve Nusa Penida Bali çevresindeki farklı ritimleri; Lombok, Gili Adaları ve Labuan Bajo Nusa Tenggara'nın deniz-volkan dünyasını açar. Toba Gölü ile Bukittinggi Sumatra'yı, Makassar ve Tana Toraja Sulawesi'yi, Raja Ampat ise uzak Papua denizlerini temsil eder. İlk seyahatte tek bölgeyi derinleştirin; iç hat, feribot ve son kilometre transferlerini gezi günü sayın.",
    intro: [
      "17 bini aşkın adaya yayılan Endonezya'yı ülke kartları arasında yarışılan tek bir rota gibi planlamak en sık yapılan hatadır. Java'nın tren ağı, Bali'nin karayolu trafiği, Nusa Tenggara'nın hızlı tekneleri, Sulawesi'nin dağ otobüsleri ve Raja Ampat'ın özel tekne lojistiği birbirinden tamamen farklıdır. 10–12 günde Java + Bali veya Bali + Lombok/Komodo gibi tek bir bölgesel omurga; üç hafta ve üzerinde ikinci uzak bölge daha gerçekçidir.",
      "Yağış düzeni ülke genelinde aynı değildir. Bali–Java hattında kabaca nisan-ekim kurak dönem öne çıksa da Raja Ampat, Maluku ve Sumatra'nın yerel rüzgâr-deniz düzeni farklılaşır. Volkan uyarısı, dalga ve feribot iptali takvimi bir gecede değiştirebilir. Ayrı biletli uçuşu hızlı tekneye dar bağlamayın; büyük ada geçişlerinden sonra en az bir tampon gece bırakın.",
    ],
    essentials: [
      { title: "Vize ve pasaport koşulunu yalnız resmî eVisa portalından doğrulayın", body: "Türk vatandaşlarının güncel e-VOA/VOA uygunluğu, kullanılabilen giriş kapıları ve kalış süresi Endonezya Göç İdaresi'nin resmî eVisa portalından kontrol edilmelidir. Pasaportun girişte en az altı ay geçerli olması ve dönüş/devam bileti istenebilir. Arama reklamıyla çıkan kopya acente sitelerine pasaport veya kart bilgisi vermeyin." },
      { title: "Tek bir Endonezya mevsimi yoktur", body: "Bali, Java ve Nusa Tenggara'da nisan-ekim çoğunlukla daha kuru; Sumatra yıl boyu yağışlı; Raja Ampat'ta rüzgâr ve deniz düzeni bölgeye göre farklıdır. BMKG hava uyarısı ile MAGMA Indonesia volkan seviyesini etkinlikten hemen önce kontrol edin. Kırmızı bayrakta yüzmeyin, kapalı volkan bölgesine tur şirketi götürüyor diye girmeyin." },
      { title: "Scooter kolaylık değil, yasal ve sigortalı bir araç kararıdır", body: "Kiralayıcının anahtarı vermesi geçerli ehliyetiniz veya sigorta kapsamınız olduğu anlamına gelmez. Uluslararası sürüş belgesi, uygun motosiklet sınıfı, kask ve poliçedeki motosiklet istisnasını kontrol edin. Bali, Lombok ve Nusa Penida'da bozuk yol, gece karanlığı, köpek/hayvan ve yoğun trafik gerçek risktir; deneyimsizseniz sürücülü araç veya uygulama kullanın." },
      { title: "Feribot ile hızlı tekneyi aynı güvenlik standardında sanmayın", body: "Şirket, gerçek liman, can yeleği, bagaj, kara transferi ve hava kaynaklı iptal politikasını yazılı görün. Gili, Nusa Penida, Komodo ve Raja Ampat geçişlerinde aynı gün ayrı biletli uluslararası uçuş planlamayın. Tekneye binmeden can yeleği sayısını ve kaptan talimatını kontrol edin; sert hava uyarısında para kaybı pahasına erteleyin." },
      { title: "Nakit, QRIS ve kart için üçlü yedek kurun", body: "Kart büyük şehir ve turistik işletmelerde yaygın, küçük warung, pazar, iskele ve uzak adada nakit gereklidir. QRIS yerel ödemede baskın olsa da yabancı banka uygulaması her kodu desteklemez. Banka ATM'si kullanın, dinamik kur dönüşümünde TL yerine rupi seçin ve uzak adaya yeterli ama ölçülü nakitle gidin." },
      { title: "Tapınak, köy ve tören yaşayan kültürel alanlardır", body: "Sarong, omuz-diz örtme, ayakkabı, fotoğraf ve âdet dönemi gibi yerel giriş kuralları bölgeye göre değişir. Bali törenini, Toraja cenazesini veya Batak mezarını turistik sahne gibi kullanmayın; insanı fotoğraflamadan izin isteyin. Yerel rehber ve topluluk ücretini kültüre erişimin bir parçası sayın." },
      { title: "Sağlık ve tahliye kapasitesini rotaya göre okuyun", body: "Musluk suyu içmeyin; tropik sıcak, gıda hijyeni ve sivrisinek önlemi alın. Ijen gazı, Rinjani yüksek irtifası, Komodo/Raja Ampat dalışı ve uzak ada teknesi standart şehir sigortasından farklı risklerdir. Poliçede motosiklet, trekking, dalış, deniz tahliyesi ve mevcut hastalık istisnalarını kontrol edin." },
    ],
    routeIdeas: [
      { title: "İlk Endonezya: Java ve Bali", duration: "12–15 gün", cities: ["Jakarta", "Yogyakarta", "Bromo Dağı", "Ubud", "Uluwatu"], description: "Jakarta'ya kısa giriş, Yogyakarta'da üç-dört gece, Doğu Java'da Bromo ve ardından Bali'de Ubud + Bukit üssü. Bromo–Bali geçişini tek gecede aşırı sıkıştırmayın." },
      { title: "Bali dışına ilk adım", duration: "10–13 gün", cities: ["Ubud", "Lombok", "Gili Adaları", "Labuan Bajo"], description: "Bali iç kesiminden Lombok/Gili'ye, ardından uçuşla Labuan Bajo'ya geçin. Hızlı tekne ile ayrı uçuş arasına karada tampon gece koyun." },
      { title: "Sumatra kültür ve kaldera rotası", duration: "8–11 gün", cities: ["Toba Gölü", "Bukittinggi"], description: "Medan–Samosir ve Padang–Bukittinggi bloklarını iç hatla bağlayın. Ada/göl ile yayla kültürüne en az üçer gece ayırın." },
      { title: "Uzak deniz: Raja Ampat", duration: "8–12 gün", cities: ["Raja Ampat"], description: "Sorong ve feribot tamponları dahil tek başına bir seyahat bloğu kurun. Dampier Boğazı veya Misool'den birini seçin; ikisini kısa rotada birleştirmeyin." },
      { title: "Güney Sulawesi", duration: "7–10 gün", cities: ["Makassar", "Tana Toraja"], description: "Makassar'da iki gün, gece otobüsü veya kara transferiyle Rantepao'da dört-beş gün. Tören ve köy ziyaretini yerel rehberle planlayın." },
    ],
  },
  CN: {
    seoTitle: "Çin Gezi Rehberi: 16 Şehir, Trenler ve Rota Planı",
    seoDescription: "Çin gezi rehberi: Pekin, Şanghay, Xi'an, Chengdu, Yunnan ve Zhangjiajie dahil 16 şehir için vize, tren, ödeme ve kapsamlı rotalar.",
    planningHeading: "Çin rotası nasıl kurulur?",
    essentialsHeading: "Çin'e gitmeden önce bilinmesi gerekenler",
    citiesHeading: "Çin'de gezilecek şehirler ve doğa rotaları",
    cityGridIntro: "Çin'de gezilecek şehirler Pekin'in imparatorluk ekseninden Şanghay'ın liman modernizmine, Xi'an'ın İpek Yolu hafızasından Chengdu–Chongqing'in Sichuan mutfağına uzanır. Hangzhou, Suzhou ve Nanjing Jiangnan tarihini; Guilin ile Zhangjiajie güneyin peyzajını; Kunming, Dali ve Lijiang ise Yunnan'ın dağ-kültür hattını açar. Guangzhou ile Shenzhen çağdaş güneyi, Harbin sert kış coğrafyasını gösterir. İlk gezide üç veya dört bölgesel üs seçip hızlı tren mesafelerini gerçek istasyon transferleriyle hesaplayın.",
    intro: [
      "Çin kıta ölçeğinde bir ülkedir. Pekin–Xi'an–Şanghay klasik ilk rota 10–12 gün ister; Chengdu/Chongqing eklenirse iki hafta, Yunnan veya Guilin–Zhangjiajie eklenirse üç hafta daha gerçekçidir. Hızlı tren şehir merkezleri arasında çok etkili olsa da Pekin, Şanghay, Shenzhen ve Kunming gibi kentlerde birden fazla büyük istasyon vardır. Biletteki istasyon adını, pasaport isim sırasını ve şehir içi son bağlantıyı ayrı kontrol edin.",
      "Seyahat öncesi üç dijital altyapıyı kurun: pasaportla çalışan ödeme, çevrimdışı Çince adres/çeviri ve resmî tren bileti. Google, WhatsApp ve bazı küresel hizmetlerin Çin ana karasında olağan biçimde çalışmayabileceğini hesaba katın; yerel mevzuata uygun bağlantıyı operatörünüzle konuşun. Otel, istasyon, yemek kısıtı ve acil irtibatı Çince karakterlerle indirin.",
    ],
    essentials: [
      { title: "Türk pasaportuyla vizeyi seyahat satın almadan önce netleştirin", body: "Umuma mahsus Türk pasaportuyla Çin ana karasına turistik seyahat için kural olarak önceden vize gerekir. Türkiye'deki Çin Vize Başvuru Merkezi güncel başvuru yöntemini ve turistik başvuruda acente sürecini yayımlar. Ağustos 2026 tarihli resmî 240 saatlik vizesiz transit listesinde Türkiye yer almıyor; bu istisnayı kullanabileceğinizi varsaymayın. Hong Kong ve Makao'nun giriş kuralları ana karadan ayrıdır; çıkıp yeniden girişte vizenizin giriş sayısını kontrol edin." },
      { title: "12306 tren hesabında ad-pasaport eşleşmesi kritiktir", body: "China Railway 12306 resmî bileti kullanın. Pasaporttaki Latin harfli ad, belge numarası ve yolcu türü doğru olmalıdır. Bilet çoğunlukla belgeye bağlıdır; yine de pasaport, rezervasyon ekranı ve tren numarasını taşıyın. İstasyon güvenliği, çok büyük terminal ve peron kapanışı için şehir içi istasyona uçuş kadar erken gidin." },
      { title: "Mobil ödeme kurun ama fiziksel yedek bırakın", body: "Alipay ve WeChat Pay yabancı karta bağlanabilir; kimlik, banka güvenlik onayı, limit ve küçük işletme kabulü değişir. Türkiye'deyken iki farklı ödeme yöntemi kurup test edin. Büyük otelde uluslararası kart, küçük işletmede mobil cüzdan daha olasıdır; az miktarda renminbi nakit ve yedek fiziksel kart taşıyın." },
      { title: "Pasaport yalnız sınırda değil, günlük bilette gerekir", body: "Müze, saray, hızlı tren, park ve bazı konaklamalarda gerçek ad/pasaport doğrulaması kullanılır. Yasak Şehir, panda üssü, milli park ve büyük müzelerde belirli gün-saat rezervasyonu olabilir. Pasaportunuzu günlük yanınızda taşıyın; ekran görüntüsünde belgenizi açıkta bırakmayın." },
      { title: "Çince adres olmadan taksi ve son kilometre zorlaşır", body: "Otel ve istasyon adını yalnız İngilizce kaydetmeyin. Çince karakter, telefon, harita pini ve doğru kapıyı çevrimdışı indirin. Pekin ve Şanghay'da istasyon çıkışları; Chongqing'de bina katları; Zhangjiajie'de park kapıları birbirinden kilometre veya onlarca metre yükseklik farkıyla ayrılabilir." },
      { title: "Ulusal tatil haftalarını normal yoğunluk sanmayın", body: "Bahar Bayramı, 1 Mayıs çevresi ve 1 Ekim Altın Hafta'da yüz milyonlarca iç seyahat hareketi tren, park ve oteli doldurabilir. Bu dönemlerde popüler rotayı değiştirmek, bilet açıldığı anda resmî sistemden almak ve yedek plan kurmak gerekir. Kalabalık yalnız fiyat değil, müze erişimini de etkiler." },
      { title: "Yüksek irtifa ve doğa rotalarını şehir gezisinden ayırın", body: "Lijiang–Shangri-La, Jade Dragon Snow Mountain ve dağ parkları yükseklik; Zhangjiajie ile Guilin kaygan merdiven/sel; Harbin aşırı soğuk riski taşır. Resmî kapanışa uyun, bariyer dışına çıkmayın ve faaliyet kapsamlı sigorta alın. Tibet ve bazı sınır bölgeleri ek izin gerektirebilir; bu rehberde izin gerektiren bölgeyi varsayılan rota olarak kullanmıyoruz." },
    ],
    routeIdeas: [
      { title: "İlk Çin yolculuğu", duration: "11–14 gün", cities: ["Pekin", "Xi'an", "Şanghay"], description: "Pekin'de beş, Xi'an'da üç, Şanghay'da dört gece. Hızlı trenle bağlayın; Seddin ve Terracotta'nun şehir dışı tam gün olduğunu hesaba katın." },
      { title: "Sichuan ve üç boyutlu mega kent", duration: "7–9 gün", cities: ["Chengdu", "Chongqing"], description: "Chengdu'da panda, çayevi ve Leshan; Chongqing'de nehir, hotpot ve katmanlı mahalleler. İki şehir arasında hızlı tren kullanın." },
      { title: "Jiangnan kanalları", duration: "8–10 gün", cities: ["Şanghay", "Hangzhou", "Suzhou", "Nanjing"], description: "Kısa hızlı trenlerle dört şehir bağlanır; her gün otel değiştirmek yerine Şanghay ve Hangzhou/Suzhou olmak üzere iki-üç üs kurun." },
      { title: "Yunnan'ın yüksek yaylaları", duration: "10–14 gün", cities: ["Kunming", "Dali", "Lijiang"], description: "Kunming'de alışma ve Taş Ormanı, Dali'de Erhai–Bai köyleri, Lijiang'da Naxi kültürü. Rakımı kademeli artırın; Tiger Leaping Gorge eklenirse iki gün daha bırakın." },
      { title: "Güney Çin doğa rotası", duration: "8–11 gün", cities: ["Guilin ve Yangshuo", "Zhangjiajie"], description: "Yangshuo'da en az üç gece, Wulingyuan'da en az üç gece. İki park arasında uçuş/tren ve istasyon transferini ayrı yolculuk günü sayın." },
    ],
  },
  NL: {
    seoTitle: "Hollanda Gezi Rehberi: 14 Şehir, Tren ve Bisiklet",
    seoDescription: "Hollanda gezi rehberi: Amsterdam, Rotterdam, Utrecht ve 11 rota için tren, OVpay, bisiklet, müze, lale sezonu ve bütçe bilgileri.",
    planningHeading: "Hollanda rotası nasıl kurulur?",
    essentialsHeading: "Hollanda'ya gitmeden önce bilinmesi gerekenler",
    citiesHeading: "Hollanda'da gezilecek şehirler, köyler ve adalar",
    cityGridIntro: "Hollanda'da gezilecek yerler Amsterdam kanal halkasından çok daha geniştir. Rotterdam çağdaş mimari ve limanı, Lahey sanat ile uluslararası kurumları, Utrecht iki seviyeli kanalları, Haarlem–Leiden–Delft kompakt tarih şehirlerini sunar. Maastricht güneyin farklı yemek ritmini, Groningen kuzeyin genç kültürünü, Eindhoven tasarım-sanayi dönüşümünü gösterir. Giethoorn ve Zaanse Schans günübirlik kırsal miras; Keukenhof kısa sezonluk bahar; Texel ise en az iki gecelik Wadden doğasıdır.",
    intro: [
      "Hollanda'nın en büyük avantajı kısa ve sık trenlerdir. Amsterdam'da her gece kalmak zorunda değilsiniz: Utrecht ülke ortasında, Rotterdam güney-batı rotasında, Haarlem ve Leiden Schiphol çevresinde güçlü üslerdir. 7 günde Amsterdam + Rotterdam/Lahey + Utrecht; 10–12 günde Haarlem/Leiden/Delft ile bir kırsal veya ada durağı eklenebilir. Giethoorn, Texel ve Keukenhof'u aynı 'köy günü' gibi düşünmeyin; ulaşım ve mevsimleri farklıdır.",
      "OVpay temassız banka kartıyla ulaşımı kolaylaştırır ama aynı fiziksel/dijital kartla giriş ve çıkış yapılmalıdır. Telefonla giriş yapıp fiziksel kartla çıkmak iki ayrı araç sayılabilir. NS tren, 9292 tüm taşıyıcı planı için temel araçlardır. Bisiklet kiralamak turistik zorunluluk değildir; Amsterdam ve Utrecht'te yoğun bisiklet trafiğine alışık değilseniz yürüyüş ile tramvay daha güvenlidir.",
    ],
    essentials: [
      { title: "Schengen vizesini resmî NetherlandsWorldwide listesinden hazırlayın", body: "Umuma mahsus Türk pasaportuyla kısa turistik ziyaret için Schengen vizesi gerekir. Türkiye'den başvuru yetkili merkez üzerinden; en erken altı ay önce ve genel olarak seyahatten en geç 45 gün önce yapılabilir. Pasaport türü ve kişisel istisnayı resmî kaynaktan doğrulayın. Vize 180 günde en fazla 90 gün kuralını aşma hakkı vermez." },
      { title: "OVpay'de kart ile cihaz eşleşmesini bozmayın", body: "Aynı yolculuğa aynı banka kartı, telefon veya saatle giriş ve çıkış yapın. Bir cihazdaki dijital kart ile cüzdandaki fiziksel kart farklı kimlik sayılır. Trende NS cihazı, aktarmada diğer taşıyıcının cihazı olabilir; ekrandaki check-in/check-out mesajını okuyun ve yabancı işlem ücretini bankanızdan öğrenin." },
      { title: "Bisiklet yolunda yaya olarak durmayın", body: "Kırmızı asfalt ve bisiklet işareti yaya alanı değildir. Karşıya geçerken iki yöne, sessiz e-bike ve scooterlara bakın; tramvay rayını dik açıyla geçin. Kiralarsanız ön-arka ışık, iki kilit, park zonu ve alkol kuralına uyun. Şehir bisikletine alışık değilseniz Amsterdam merkezinde öğrenmeye çalışmayın." },
      { title: "Müze ve popüler ev biletini yalnız resmî kurumdan alın", body: "Anne Frank House, Van Gogh Museum, Rijksmuseum, Rietveld Schröder House, Dom Tower ve bazı mağara turları belirli saatli olabilir. Son dakika sosyal medya aracısına güvenmeyin. Aynı güne iki büyük müze koymak yerine koleksiyonunuzu seçin; ücretsiz şehir yürüyüşü ve mahalle zamanı bırakın." },
      { title: "Lale tarlası kamusal fotoğraf stüdyosu değildir", body: "Keukenhof sergi bahçesi, Lisse çevresindeki tarlalar özel üretim alanıdır. Sıraya girmek bitkiye, toprağa ve çiftçinin gelirine zarar verir; hastalık taşıyabilir. Yalnız izinli patika ve seyir noktasını kullanın. Keukenhof'un her yıl sınırlı açılış tarihini ve çiçeklenmenin havaya bağlı olduğunu kontrol edin." },
      { title: "Kart yaygın olsa da tek karta bağımlı kalmayın", body: "Temassız ödeme güçlüdür; bazı küçük işletmeler belirli banka kartı ağını veya yalnız dijital ödeme tercih edebilir. İki farklı fiziksel kart ve az miktarda avro taşıyın. Terminal TL teklif ederse avroyu seçmek kur maliyetini daha görünür tutar; şehir vergisi oda fiyatına sonradan eklenebilir." },
      { title: "Rüzgâr, yağmur ve Kuzey Denizi planı değiştirir", body: "Hava kısa sürede değişir; ince yağmurluk ve katman yıl boyu gerekir. Scheveningen, Zandvoort ve Texel'de yüzme bayrağına uyun; Wadden çamurluğuna rehbersiz çıkmayın. Texel/feribot, Giethoorn/tekne ve kırsal bisiklet gününe resmî hava ile son dönüş yedeği koyun." },
    ],
    routeIdeas: [
      { title: "İlk Hollanda gezisi", duration: "7–9 gün", cities: ["Amsterdam", "Utrecht", "Rotterdam", "Lahey"], description: "Amsterdam'da üç-dört, Utrecht'te bir-iki, Rotterdam/Lahey hattında üç gece. Trenle kolay ama her gün otel değiştirmeyin." },
      { title: "Sanat ve küçük kanal şehirleri", duration: "6–8 gün", cities: ["Haarlem", "Leiden", "Delft", "Utrecht"], description: "Haarlem veya Leiden'ı Schiphol üssü, Utrecht'i merkez üssü yapın. Frans Hals, bilim müzeleri, Vermeer bağlamı ve Rietveld'i acele etmeden görün." },
      { title: "Bahar çiçek rotası", duration: "4–6 gün", cities: ["Leiden", "Keukenhof ve Lisse", "Haarlem"], description: "Yalnız resmî Keukenhof açılış döneminde planlayın. Bir bahçe günü, bir Leiden müze günü, bir Haarlem/kumul günü kurun; tarlaya girmeyin." },
      { title: "Kuzey ve Wadden", duration: "5–7 gün", cities: ["Groningen", "Texel"], description: "Groningen'de iki-üç gece, Den Helder üzerinden Texel'de en az iki gece. İki bölge arasında ulaşımı ayrı gün sayın." },
      { title: "Tasarım ve güney", duration: "5–7 gün", cities: ["Rotterdam", "Eindhoven", "Maastricht"], description: "Çağdaş mimari, Dutch Design ve Burgonya etkili güney mutfağını trenle bağlayın. Etkinlik takviminde DDW, GLOW ve TEFAF fiyatlarını kontrol edin." },
    ],
  },
  SJ: {
    seoTitle: "Svalbard Gezi Rehberi: Longyearbyen, Ny-Ålesund ve Rotalar",
    seoDescription:
      "78. enlemde kutup gezisi rehberi: Longyearbyen, Ny-Ålesund, Pyramiden ve Barentsburg için yerel ulaşım, iklim, bütçe ve keşif rehberleri.",
    planningHeading: "Svalbard rotası nasıl planlanır?",
    cityGridIntro:
      "Svalbard gezisi klasik bir şehir tatilinden çok, kutup koşullarına göre planlanan bir keşif yolculuğudur. Longyearbyen takımadaların ulaşım ve konaklama merkezi; Ny-Ålesund bilimsel araştırma yerleşimi, Pyramiden ile Barentsburg ise rehberli tekne veya kar motoru rotalarıyla ulaşılabilen özel duraklardır. Mevsim, gün ışığı, deniz buzu ve hava koşulları programı doğrudan belirlediği için yerleşimler arası geçişleri bağımsız şehir ulaşımı gibi düşünmeyin.",
    intro: [
      "Svalbard takımadaları 78. ve 81. kuzey enlemleri arasında yer alan dünyanın en kuzeydeki yerleşim alanıdır. Longyearbyen ana üs ve giriş kapısıdır; Ny-Ålesund bilimsel araştırma yerleşimi, Pyramiden terk edilmiş Sovyet maden şehri, Barentsburg ise yaşayan kömür kasabasıdır.",
      "Kışın kutup gecesi ve Kuzey Işıkları, bahar ve yaz aylarında ise Gece Yarısı Güneşi, deniz turları ve kutup doğası deneyimlenir.",
    ],
    routeIdeas: [
      {
        title: "Kutup İhtişamı Rotası",
        duration: "4–6 gün",
        cities: ["Longyearbyen", "Ny-Ålesund"],
        description:
          "Longyearbyen merkezli konaklama, tekne turlarıyla Ny-Ålesund ve fiyort gezisi.",
      },
    ],
  },
};

export const countryHubFor = (countryCode: string): CountryHubContent | null =>
  HUBS[countryCode] ?? null;

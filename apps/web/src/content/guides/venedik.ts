import { CityGuide } from "./types";

/** Venedik rehberi — Ağustos 2026 araştırması. */
export const venedik: CityGuide = {
  city: "Venedik",
  countryCode: "IT",

  seoTitle: "Venedik Gezi Rehberi: Vaporetto, 2026 Giriş ve 3 Gün",
  seoDescription:
    "Venedik gezi rehberi: 2026 erişim katkısı, vaporetto kullanımı, VCE transferi, kalınacak sestieri, bacari, adalar ve gerçekçi 3 günlük rota.",
  h1: "Venedik Gezi Rehberi",
  lede:
    "Venedik yalnız San Marco ile Rialto arasındaki kalabalık koridor değil; altı sestierenin, çalışan bir lagünün ve yürüyüşle su ulaşımını birlikte okumayı gerektiren kırılgan bir ada kentinin toplamıdır.",

  quickFacts: [
    { label: "Önerilen süre", value: "3 tam gün · en az 2 gece" },
    { label: "Ana istasyon", value: "Venezia Santa Lucia" },
    { label: "Son kara noktası", value: "Piazzale Roma" },
    { label: "Şehir içi", value: "Yürüyüş + vaporetto" },
    { label: "2026 kontrolü", value: "Erişim katkısı / muafiyet QR'ı" },
  ],

  sections: [
    {
      heading: "Venedik'i anlamak: ada kent, Mestre ve altı sestieri",
      id: "sehri-anlamak",
      body: [
        "Venedik'in tarihî merkezi otomobilsizdir. Trenle **Venezia Santa Lucia**'da indiğiniz an Büyük Kanal'ın önündesiniz; **Venezia Mestre** ana karadadır ve aynı deneyim değildir. Oteliniz ada üzerindeyse yanlışlıkla Mestre bileti/konaklaması seçmek her gün tren veya otobüs yolculuğu ekler. Araçlar yalnız Piazzale Roma/Tronchetto'ya kadar gelir.",
        "Kent altı sestiereden oluşur. San Marco ana anıtlara yakın ve en kalabalık; San Polo Rialto ve pazar çevresi; Dorsoduro sanat, öğrenci hayatı ve yürüyüş dengesi; Cannaregio istasyon erişimi ile daha gündelik sokaklar; Castello doğuya gidildikçe sakin; Santa Croce ise Piazzale Roma lojistiğine yakındır. Harita üzerindeki 800 metre, köprüler ve çıkmaz sokaklarla valizli gezgin için iki kat hissedilebilir.",
        "Günübirlik ziyaret San Marco–Rialto görüntüsünü verir ama kentin en iyi saatlerini kaçırır. En az iki gece kalmak sabah erken ve akşam kruvaziyer/günübirlik kalabalık azaldığında Cannaregio, Castello ve Dorsoduro'yu açar. Murano–Burano günü ekleyecekseniz üç tam gün daha gerçekçidir.",
      ],
    },
    {
      heading: "2026 Venedik erişim katkısı: kim ödeme yapar, kim QR gösterir?",
      id: "erisim-katkisi",
      body: [
        "Venedik Belediyesi 2026'da belirlenmiş 60 günde, tarihî merkeze günübirlik giriş için **08.30–16.00** arasında Contributo di Accesso uyguluyor. Tarihler nisan–temmuz dönemine yayılmıştır; her gün geçerli değildir. Yalnız resmî **cda.ve.it** portalından seyahat gününüzü kontrol edin. Erken/son alım tarihine göre ücret değişebilir.",
        "Venedik Belediyesi sınırları içindeki konaklama tesisinde kalan ve belediye konaklama vergisine tabi misafirler genel olarak erişim katkısını ödemez; fakat muafiyet belgesi/QR üretme işlemi gerekebilir. Otelinizin sizin adınıza kayıt yapıp yapmadığını veya portalda hangi muafiyet yolunu seçmeniz gerektiğini yazılı sorun. 'Otelde kalıyorum, hiçbir şey göstermem' varsayımı kontrol noktasında zaman kaybettirebilir.",
        "Mestre'de Venedik Belediyesi sınırları içindeki bir tesiste kalmak ile başka belediyede kalmak aynı muafiyet sonucu vermeyebilir; tesisin açık adresi ve vergi statüsü belirleyicidir. Çocuk, öğrenci, iş, sağlık ve ada sakini gibi kategorilerde de farklı kanıt/istisna vardır. Blog özetine değil portalın seyahat tarihinizdeki sorularına cevap verin.",
        "Kontroller ana giriş noktalarında QR ve kimlik üzerinden yapılabilir; kayıt olmamak/ödememek para cezası riski yaratır. Sponsorlu aracı sitelere kart vermeyin. Resmî QR'ı telefon dışında çevrimdışı ekran görüntüsü veya PDF olarak da saklayın.",
      ],
    },
    {
      heading: "Marco Polo Havalimanı, Treviso ve trenle varış",
      id: "varis-ulasimi",
      body: [
        "Marco Polo (VCE) için kara yolu otobüsleri Piazzale Roma'ya gelir: ACTV Line 5 yerel, ATVO ise farklı durak düzenine sahip ekspres hizmet sunar. Oteliniz Rialto/San Marco yönündeyse buradan vaporettoya aktarırsınız. **Alilaguna** su hattı bazı ada duraklarına doğrudan gider; manzaralı olsa da rotası, ara durakları ve yürüyüş mesafesi otele göre değişir. Özel su taksisi kapıya yakın bırakabilir fakat özel araç fiyatındadır; binmeden toplamı netleştirin.",
        "Treviso (TSF), Venedik adıyla satılsa da başka şehirdeki havalimanıdır. Mestre veya Piazzale Roma otobüsünün son seferini uçuş gününde kontrol edin. Geç varışta ucuz uçak bileti, özel transfer zorunluluğuyla avantajını kaybedebilir.",
        "Trenle ada merkezine gelecekseniz bilette son istasyon **Venezia S. Lucia** olmalı. Mestre'de aktarma gerekebilir; tren numarası ve peronu takip edin. Kâğıt bölgesel bileti binmeden doğrulatın, dijital biletin güncel talimatını Trenitalia ekranından izleyin.",
        "Valizle son kilometreyi hafife almayın. Köprüde asansör/rampa olmayabilir; vaporetto durağından otele güzergâhta kaç köprü olduğunu önceden bakın. Lisanssız 'valiz yardımına' eşyayı vermeyin; gerektiğinde otelin önerdiği kayıtlı taşıma hizmetini kullanın.",
      ],
    },
    {
      heading: "Vaporetto ve ACTV: bilet, doğrulama ve temassız ödeme",
      id: "vaporetto",
      body: [
        "ACTV vaporettoları tur teknesi değil kent içi toplu taşımadır. Tek su otobüsü bileti pahalı olduğundan, aynı gün birkaç biniş yapacaksanız süreli Venezia Unica/ACTV ürününü karşılaştırın. AVM Venezia Official App, Venezia Unica gişeleri, makineler ve yetkili satış noktaları kullanılabilir. Havalimanı Alilaguna ve bazı özel işletmeler ACTV kartına dâhil değildir.",
        "Kâğıt veya dijital bileti **her binişten önce** iskele okuyucusunda doğrulatın; açık bariyer ücretsiz geçiş demek değildir. Temassız EMV sistemi su ve kara ağı üzerinde çalışır, fakat doğru tarifeyi hesaplamak için aynı fiziksel kart/aynı cihazı kullanmanız gerekir. Su ve kara yolculuğu tarifeleri farklı olduğundan, kart hareketini tek sabit ücret sanmayın.",
        "Line 1 Büyük Kanal boyunca yavaş ve manzaralı; Line 2 bazı bölümlerde daha hızlıdır. Durağın iki yön iskelesini karıştırmak çok yaygındır: vaporettonun önündeki son durak ekranını okuyun. Kalabalıkta valizi geçişe koymayın, fotoğraf için iniş bölümünü kapatmayın.",
        "**Traghetto**, belirli noktalarda Büyük Kanal'ı gondolla kısa geçiştir; tur gondolu değildir, çalışma noktaları ve saatleri değişkendir. Sırf ucuz gondol deneyimi diye uzak yürümeyin; açık olup olmadığını yerinde görün. Belediye gondola servisi için resmî süre ve tarife yayımlar; turun rotasını, süresini ve gece/gündüz tarifesini binmeden netleştirin, fiyatın kişi başı değil tekne hizmeti olduğunu doğrulayın.",
      ],
    },
    {
      heading: "San Marco, Palazzo Ducale ve kalabalığı yönetmek",
      id: "san-marco",
      body: [
        "Basilica di San Marco aktif ibadet alanıdır. Ana ziyaret, Pala d'Oro, müze/teras ve çan kulesi farklı bilet ya da sıraya sahip olabilir. Yalnız bazilikanın resmî sitesi üzerinden güncel giriş düzenini kontrol edin; omuz ve dizleri örten kıyafet, küçük çanta ve güvenlik kuralına hazırlanın.",
        "Palazzo Ducale, devlet daireleri, Tintoretto/Veronese salonları, Ahlar Köprüsü ve hapishane rotasıyla en az iki saat ister. MUVE'nin resmî bileti San Marco Meydanı'ndaki başka müzeleri de kapsayabilir. Secret Itineraries gibi özel güzergâhlar sınırlı kapasiteyle ayrı rezervasyon gerektirir; standart biletin otomatik parçası değildir.",
        "San Marco Meydanı'nı sabah 08.00 civarı görmek, öğlen kalabalığına göre bambaşka deneyimdir. Akşam orkestralı tarihî kafe terasında oturmak manzara/hizmet bedeli taşır; oturmadan menü ve varsa müzik servisini okuyun. Güvercin beslemek ve meydana yiyecek dökmek yasaktır.",
        "Rialto Köprüsü'nü yalnız üstten geçip pazarı kaçırmayın. Pescheria'nın açık günü ve sabah saatleri değişebilir; pazar bittikten sonra aynı atmosfer kalmaz. Rialto–San Marco ana işaretli koridorundan bir sokak ayrılmak bile kalabalığı düşürür.",
      ],
    },
    {
      heading: "Dorsoduro, Cannaregio ve Castello: yaşayan Venedik",
      id: "mahalleler",
      body: [
        "Dorsoduro'da Accademia, Peggy Guggenheim Collection, Punta della Dogana ve Zattere aynı sanat–su yürüyüşüne bağlanır. Hepsini bir sabaha sıkıştırmayın; bir büyük koleksiyon seçip Campo Santa Margherita çevresinde gündelik ritme zaman bırakın.",
        "Cannaregio, tren istasyonundan doğuya doğru yoğunlaşan Strada Nova'nın ötesinde sakinleşir. Venedik Gettosu'nun tarihi, yalnız 'gizli mahalle' fotoğrafından daha ağırdır; sinagog ve müze erişimini güncel resmî programdan kontrol edin. Fondamenta della Misericordia akşam bacari rotası için uygundur.",
        "Castello, Arsenale ve Biennale bahçelerine doğru kentin daha konut ağırlıklı yüzünü gösterir. Biennale yılı/etkinlik takvimi ulaşım ve oda fiyatını etkiler; ana sergi alanları tek girişte hızlıca bitmez. Via Garibaldi, yoğun sanat gününde uygun bir öğle eksenidir.",
        "Santa Croce ve San Polo'da Scuola Grande di San Rocco ile Frari, Tintoretto ve Bellini için güçlü iç mekânlardır. Yağmurlu gün planına saklamak akıllıca olsa da kapanış günlerini son dakika kontrol edin.",
      ],
    },
    {
      heading: "Murano, Burano ve Torcello: ada gününü doğru kurmak",
      id: "lagun-adalari",
      body: [
        "Murano cam geleneği, Burano renkli evler ve dantel, Torcello ise lagünün erken yerleşim tarihiyle farklıdır. Üçünü iki saatte 'fotoğraf durakları' yapmak vaporetto bekleyişini hesaba katmaz. İlk kez ve tek gününüz varsa Murano + Burano; tarihe ilginiz yüksekse Burano + Torcello daha tutarlı olabilir.",
        "Ücretsiz cam fabrikası teknesi çoğu zaman satış sunumuna bağlıdır; dönüş ve satın alma baskısını sorun. Murano'ya normal ACTV ile bağımsız gitmek kontrolü sizde tutar. Gerçek Murano camında üretici/menşe belgesi ve şeffaf fiyat arayın; adada satılan her renkli obje yerel üretim değildir.",
        "Burano'nun ana fotoğraf sokakları öğlen çok yoğunlaşır. Erken çıkın, vaporetto dönüş kuyruğu için pay bırakın ve restoran rezervasyonu düşünün. Torcello'ya aktarmanın ve bazilika saatinin denk gelmemesi bekleme yaratabilir.",
        "Lido, plaj ve bisiklet için ayrı bir adadır; yazın plaj günü ile Burano turunu aynı güne koymayın. Biennale döneminde Lido aynı zamanda etkinlik konaklaması olabilir, ancak gece ada merkezine vaporetto süresini hesaba katın.",
      ],
    },
    {
      heading: "Acqua alta, mevsim ve lagün görgüsü",
      id: "acqua-alta",
      body: [
        "Acqua alta yalnız internetteki su basmış meydan görüntüsü değildir; gelgit ve hava koşullarına bağlı, saatler içinde yükselip çekilen olaydır. MOSE şiddetli olayları azaltır fakat yerel yüksek su ve ulaşım değişikliği ihtimalini sıfırlamaz. Venedik Belediyesi **Centro Maree** tahminini ve Telegram uyarısını kullanın; hava uygulamasındaki yağmur simgesi gelgit tahmini değildir.",
        "Yüksek su olasılığında tek kullanımlık ince ayakkabı kılıfı yerine sağlam su geçirmez bot daha güvenlidir; kanal suyuna çıplak ayakla girmeyin. Geçici yaya platformlarının yıl boyu kurulduğunu varsaymayın: belediye 2026'da bazı dönemlerde platform hizmetini askıya aldığını duyurdu.",
        "İlkbahar ve sonbahar yürüyüş için dengeli, yaz sıcak/nemli ve çok kalabalıktır. Kış daha sakin fakat kısa gün, sis ve gelgit olasılığı taşır. Biennale, Karnaval, Paskalya ve büyük etkinlikler oda fiyatını ve vaporetto yoğunluğunu belirler.",
        "Kanala yüzmek için girmeyin, köprüde piknik/oturma ile geçişi tıkamayın ve cruise kalabalığında dar sokakta ani durmayın. Şehir su, atık ve konut baskısı yaşayan bir yerleşimdir; matara doldurmak, çöpü ayrıştırmak ve yerel işletmeden alışveriş küçük ama gerçek etkidir.",
      ],
    },
    {
      heading: "Venedik'te ne yenir? Bacaro, cicchetti ve lagün ürünleri",
      id: "ne-yenir",
      body: [
        "**Bacaro** küçük şarap barı, **cicchetti** ise tezgâhtaki küçük lokmalardır. Ombra denilen küçük yerel şarapla birkaç lokma yemek, her durakta tam tabak söylemekten daha Venedikçe bir akşam kurar. Tezgâhta ayakta fiyat ile masada servis aynı olmayabilir; siparişten önce sorun.",
        "Baccalà mantecato, sarde in saor, polenta, bigoli in salsa, risotto al nero di seppia ve moeche (mevsimsel yumuşak kabuklu yengeç) lagün/kara ticareti tarihini taşır. Deniz ürünü restoranında balığın kilo fiyatını, servis ve copertoyu menüden okuyun. Dondurulmuş ürün işaretleri İtalyan menülerinde sembolle gösterilebilir.",
        "San Marco ve Rialto'nun fotoğraflı turist menüsü yerine Cannaregio, Castello veya Santa Croce'de kısa menü ve günlük balık panosu arayın. 'Cicchetti turu'nu beş bara on dakika ayıran yarışa çevirmeyin; yoğun saatte bir içki–iki lokma alıp tezgâhı kapatmamak görgüdür.",
        "Burano'da risotto di gò ve bussolà/buranelli bisküvisi; Murano'da lagün balığı denenebilir. Ada restoranını dönüş vaporetto saatinden hemen önce planlamak servisi strese sokar; masa ile iskele arasında pay bırakın.",
      ],
    },
  ],

  places: [
    {
      name: "Cantina Do Spade",
      area: "San Polo / Rialto",
      known: "Tarihî bacaro ve cicchetti",
      why:
        "Rialto çevresinde sarde in saor, baccalà ve sıcak cicchetti ile bacaro kültürüne erişilebilir bir başlangıç sunar.",
      price: "Ekonomik",
      tip: "Ayakta cicchetti ile masada tam yemek farklı deneyimdir; yoğun saatte dar geçişi kapatmayın.",
    },
    {
      name: "Osteria alle Testiere",
      area: "Castello",
      known: "Küçük salonda günlük lagün deniz ürünleri",
      why:
        "Kısa, tedarike göre değişen menüsüyle Venedik deniz ürününü turistik karma menüden ayıran adreslerden biridir.",
      price: "Yüksek",
      tip: "Çok az masası vardır; güncel resmî iletişim kanalından önceden rezervasyon yapın.",
    },
    {
      name: "Antiche Carampane",
      area: "San Polo",
      known: "Venedik usulü balık ve makarna",
      why:
        "Rialto'nun arka sokaklarında moeche mevsimi, deniz ürünlü makarna ve klasik tarifler için oturmalı bir akşam seçeneğidir.",
      price: "Yüksek",
      tip: "Mevsimsel ürünü önceden varsaymayın; açık gün ve rezervasyonu işletmeden doğrulayın.",
    },
    {
      name: "Vini da Gigio",
      area: "Cannaregio",
      known: "Lagün mutfağı ve güçlü şarap listesi",
      why:
        "Balık kadar sakatat ve mevsimsel Venedik tabaklarına da yer veren aile restoranı, Cannaregio akşamını tek başına yemek hedefine dönüştürür.",
      price: "Yüksek",
      tip: "Kapalı günleri olabilir; şarap eşleşmesi ve fiyat aralığını siparişten önce konuşun.",
    },
    {
      name: "All'Arco",
      area: "Rialto",
      known: "Pazar çevresinde taze cicchetti",
      why:
        "Rialto pazar ritmiyle şekillenen küçük lokmaları, öğle öncesi kısa bacaro molasında denemek için klasik bir duraktır.",
      price: "Ekonomik",
      tip: "Erken kapanabilir ve pazar/iş gününe göre ritmi değişir; akşam yemeği adresi gibi planlamayın.",
    },
    {
      name: "Trattoria al Gatto Nero",
      area: "Burano",
      known: "Risotto di gò ve lagün balığı",
      why:
        "Burano'yu yalnız renkli ev fonundan çıkarıp balıkçı adası mutfağıyla anlamak için güçlü bir öğle yemeği durağıdır.",
      price: "Yüksek",
      tip: "Rezervasyon yapın ve dönüş vaporettonuza en az bir saatten fazla pay bırakın.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — San Marco'dan Dorsoduro'ya",
      morning:
        "San Marco Meydanı'na erken gidin; resmî düzen uygunsa bazilika, ardından saatli Palazzo Ducale.",
      afternoon:
        "Riva degli Schiavoni'den Castello'ya kısa sapma; vaporetto veya yürüyüşle Accademia ve Dorsoduro.",
      evening:
        "Zattere gün batımı, Campo Santa Margherita çevresinde cicchetti; otelinize ana işaretli rota dışında dönün.",
    },
    {
      title: "2. Gün — Rialto, San Polo ve Cannaregio",
      morning:
        "Rialto pazarını açık gününde erken görün; Frari ve Scuola Grande di San Rocco'dan ilginize göre birini seçin.",
      afternoon:
        "Büyük Kanalı Line 1 ile bir kez baştan sona okuyun; sonra Cannaregio Getto çevresinde saygılı tarih yürüyüşü.",
      evening:
        "Fondamenta della Misericordia'da iki–üç bacaroya yayılan sakin cicchetti akşamı.",
    },
    {
      title: "3. Gün — Lagün adaları ve Castello",
      morning:
        "Erken vaporettoyla Murano veya doğrudan Burano; iki ada seçip aktarma ve dönüş süresini yazın.",
      afternoon:
        "Burano öğle yemeği; zaman/ilgi varsa Torcello, yoksa Venedik'e dönüş.",
      evening:
        "Castello–Via Garibaldi yürüyüşü veya boş kalan San Marco'yu gece görmek; ertesi transferi doğrulayın.",
    },
  ],

  practicalHeading: "Venedik'te turistlerin en çok karıştırdığı ayrıntılar",
  practicalTips: [
    {
      title: "Santa Lucia ile Mestre aynı istasyon değildir",
      body: "Santa Lucia ada üzerindeki son istasyondur; Mestre ana karadadır. Otel ve tren biletinde tam adı kontrol edin.",
    },
    {
      title: "2026 QR'ını resmî portaldan alın",
      body: "cda.ve.it üzerinde gününüzü ve ödeme/muafiyet kategorinizi kontrol edin. Otel misafiri olsanız da muafiyet QR'ı gerekebilir.",
    },
    {
      title: "Vaporetto biletini her binişte okutun",
      body: "Süreli kart da olsa iskele okuyucusunda doğrulatın. Açık kapı veya kontrolsüz iskele biletsiz geçiş anlamına gelmez.",
    },
    {
      title: "Aynı kart ile aynı cihazı karıştırmayın",
      body: "Temassız ödeme sisteminde fiziksel kart ile telefon cüzdanı farklı kimlik sayılabilir; yolculuk boyunca tek yöntemi kullanın.",
    },
    {
      title: "Acqua alta için hava uygulaması yetmez",
      body: "Venedik Belediyesi Centro Maree tahminini izleyin. Yağmur ile gelgit aynı şey değildir; platform hizmeti de yıl boyu garanti değildir.",
    },
    {
      title: "Valiz rotasında köprü sayın",
      body: "Vaporetto durağına yakın görünen otel birkaç merdivenli köprünün ardında olabilir. Büyük valizle son kilometreyi rezervasyondan önce kontrol edin.",
    },
  ],

  faqs: [
    {
      q: "Venedik için kaç gün gerekir?",
      a: "Tarihî merkez için en az iki gece/iki tam gün, Murano–Burano gibi lagün adaları için üç tam gün önerilir.",
    },
    {
      q: "2026'da Venedik'e giriş ücreti her gün var mı?",
      a: "Hayır. Belediye belirli nisan–temmuz tarihlerinde 08.30–16.00 arasında uygular. cda.ve.it üzerinden tarih ve muafiyet durumunuzu kontrol edin.",
    },
    {
      q: "Venedik'te otelde kalanlar erişim katkısı öder mi?",
      a: "Venedik Belediyesi içindeki vergiye tabi konaklama misafirleri genel olarak ödemez; ancak muafiyet kaydı/QR gerekebilir. Tesisten ve resmî portaldan teyit edin.",
    },
    {
      q: "Venedik'te araba kullanılır mı?",
      a: "Tarihî merkez tamamen araçsızdır. Otomobil Piazzale Roma veya Tronchetto'ya kadar gelir; sonrası yürüyüş ya da su ulaşımıdır.",
    },
    {
      q: "Vaporetto için temassız kart kullanılabilir mi?",
      a: "ACTV'nin EMV sistemi uygun hat/okuyucularda kullanılabilir. Doğru tarife için aynı kart veya aynı cihazı kullanın ve her binişte okutun.",
    },
    {
      q: "Venedik'te hangi bölgede kalınır?",
      a: "İlk ziyaret için Dorsoduro veya Cannaregio iyi denge sunar; San Marco en merkezi ve kalabalık, Santa Croce lojistik, Castello daha sakin seçenektir.",
    },
  ],

  relatedGuides: [
    {
      city: "Floransa",
      anchor: "Venedik'ten Floransa'ya: kanallardan Rönesans'a",
      description: "Santa Lucia'dan hızlı trenle SMN'ye geçin; Uffizi ve Duomo için zamanlı biletleri ayrı günlere koyun.",
    },
    {
      city: "Milano",
      anchor: "Venedik'ten Milano'ya: kuzey İtalya sanat rotası",
      description: "Trenle Centrale'ye ilerleyip Duomo terası, Brera ve Son Akşam Yemeği çevresinde üç günlük plan kurun.",
    },
    {
      city: "Roma",
      anchor: "Venedik'ten Roma'ya: lagünden antik başkente",
      description: "Uzun hızlı tren ayağından sonra Kolezyum ile Vatikan'ı ayrı günlere bölerek en az dört gece kalın.",
    },
    {
      city: "Napoli",
      anchor: "Venedik'ten Napoli'ye: kuzeyden güneye hızlı tren",
      description: "Uzun mesafeyi uçuşla da karşılaştırın; Napoli'de tarihî merkez, pizza ve arkeoloji günlerini ayırın.",
    },
    {
      city: "Amalfi Kıyısı",
      anchor: "Venedik'ten Amalfi Kıyısı'na: lagünden Akdeniz yamaçlarına",
      description: "Salerno veya Napoli aktarmalı gidin; son feribot/otobüs ile bagaj lojistiğini konaklama seçmeden çözün.",
    },
  ],

  sources: [
    { name: "Comune di Venezia — 2026 erişim katkısı", url: "https://www.comune.venezia.it/it/node/25697" },
    { name: "Venezia Unica — resmî erişim portalı", url: "https://cda.ve.it/" },
    { name: "ACTV — temassız EMV", url: "https://actv.avmspa.it/en/content/emv-payment" },
    { name: "ACTV — biletler ve fiyatlar", url: "https://actv.avmspa.it/en/content/prezzi-vigore" },
    { name: "Venezia Airport — şehir bağlantıları", url: "https://www.veneziaairport.it/en_gb/transport/from-to/venice" },
    { name: "Palazzo Ducale — ziyaret bilgileri", url: "https://palazzoducale.visitmuve.it/en/visitor-information/" },
    { name: "Comune di Venezia — Centro Maree", url: "https://www.comune.venezia.it/it/content/centro-previsioni-%C3%A8-segnalazioni-maree" },
    { name: "Comune di Venezia — gondola tarifeleri", url: "https://www.comune.venezia.it/it/node/16768" },
  ],

  volatileNote:
    "2026 erişim katkısı tarihleri ve muafiyet süreci; vaporetto/feribot hatları; gelgit, gondola tarifesi, müze ve bazilika girişleri değişebilir. Yalnız resmî kanalları seyahat gününde kontrol edin.",
  reviewed: "2026-08-10",
};

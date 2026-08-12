import { CityGuide } from "./types";

/** Milano rehberi — Ağustos 2026 araştırması. */
export const milano: CityGuide = {
  city: "Milano",
  countryCode: "IT",

  seoTitle: "Milano Gezi Rehberi: Havalimanları, Biletler ve 3 Gün",
  seoDescription:
    "Milano gezi rehberi: MXP, LIN ve BGY transferleri, Son Akşam Yemeği rezervasyonu, ATM ulaşımı, semtler, aperitivo ve gerçekçi 3 günlük rota.",
  h1: "Milano Gezi Rehberi",
  lede:
    "Milano yalnız Duomo önü ile lüks vitrinlerden ibaret değil; Leonardo'nun kırılgan duvar resmi, Brera'nın sanat dokusu, tasarım mahalleleri ve her biri başka ulaşım gerektiren üç havalimanıyla planı ayrıntıda kazanan bir kuzey metropolüdür.",

  quickFacts: [
    { label: "Önerilen süre", value: "2–3 tam gün" },
    { label: "Havalimanları", value: "MXP · LIN · BGY" },
    { label: "Şehir içi", value: "Metro + tramvay + yürüyüş" },
    { label: "Kritik bilet", value: "Cenacolo / Son Akşam Yemeği" },
    { label: "Yerel ritüel", value: "Aperitivo" },
  ],

  sections: [
    {
      heading: "Milano'yu planlamak: iki günde çekirdek, üç günde mahalle",
      id: "sehri-planlamak",
      body: [
        "Milano'nun ana anıtları metro ağıyla yakınlaşır ama aynı hatta değildir. Birinci kümeyi Duomo–Galleria–La Scala–Brera; ikincisini Santa Maria delle Grazie–Sant'Ambrogio–Navigli; üçüncüsünü Porta Nuova–Isola veya Fondazione Prada–Porta Romana oluşturur. İki tam gün çekirdeği, üçüncü gün çağdaş mimari/tasarım ve daha sakin mahalleyi açar.",
        "Son Akşam Yemeği (Cenacolo Vinciano) bileti yolculuğun sabit noktasıdır. Duomo ve Brera saatini ona göre oynatın; resmi görmek için bilet bulamadığınız günü turlar arasında panikle doldurmayın. Milano'da Pinacoteca di Brera, Museo del Novecento, Ambrosiana ve Poldi Pezzoli gibi güçlü alternatifler vardır.",
        "Como Gölü veya Bergamo'yu 'Milano'da üçüncü gün' diye eklemek şehirdeki üçüncü günü siler. İlk gelişiniz ve tasarım/sanat ilginiz varsa üç günü Milano'da bırakın. Daha uzun kuzey rotasında Como'yu ayrı gece veya erken trenli tam gün yapın; vapur tarifesi ve dönüş trenini beraber kontrol edin.",
      ],
    },
    {
      heading: "Malpensa, Linate ve Bergamo: Milano'nun üç havalimanı",
      id: "havalimani-ulasimi",
      body: [
        "**Malpensa (MXP)** merkezden yaklaşık 45 km uzaktadır ve iki terminali vardır. Malpensa Express trenleri Milano Cadorna, Centrale ve Porta Garibaldi yönlerinde farklı hizmetler sunar; her tren tüm merkez istasyonlarına gitmez. Otelinize en yakın varışı seçin ve T1/T2 kalkışınızı bilette kontrol edin. Hat bakım duyuruları olabildiğinden seyahat günü Malpensa Express/Trenord sayfasına bakın.",
        "**Linate (LIN)** merkeze en yakın havalimanıdır ve M4 mavi metro hattıyla San Babila üzerinden kent ağına bağlanır. Şehir içi ATM bileti/temassız ödeme kullanılabilir; metro giriş ve çıkışında aynı kartı okutun. Uçuş fiyatı biraz yüksek olsa bile kısa transfer, iki günlük gezide ciddi zaman kazandırabilir.",
        "**Bergamo Orio al Serio (BGY)** Milano'dan yaklaşık 50 km uzakta, Bergamo ilindedir. Çeşitli otobüsler Milano Centrale'ye gider; trafik, terminal sırası ve son seferi hesaba katın. BGY'yi Linate gibi metroya bağlı sanmak veya yalnız 'Milan' adına bakarak gece uçuşu almak sık hatadır.",
        "Taksi/özel transferde hangi havalimanının yazdığını iki kez kontrol edin. Malpensa–Linate veya BGY–MXP aktarması şehir içi kısa transfer değildir; ayrı biletli uçuşlar arasında geniş süre bırakın. Havalimanı adını yalnız IATA koduyla kaydedin.",
      ],
    },
    {
      heading: "Milano'da toplu taşıma: ATM temassız ödeme nasıl çalışır?",
      id: "sehir-ici-ulasim",
      body: [
        "ATM'nin metro, tramvay, otobüs ve troleybüslerinde uygun okuyucularda banka kartı/telefonla temassız gidilebilir. Metroda girişte ve çıkışta **aynı kart veya aynı cihazı** okutun. Şehir içi yüzey hatlarında binişte dokundurun; bazı dış bölge hatlarında inişte de dokunmak gerekir. Sistem doğru tarifeyi ancak aynı ödeme kimliğiyle hesaplar.",
        "Bir kart aynı anda yalnız bir yolcu içindir. Fiziksel banka kartı ile o karta bağlı Apple/Google Wallet cihazı sistemde aynı görünmeyebilir; yolculuk ortasında değiştirmeyin. Kontrolde kullandığınız kart/cihazı gösterirsiniz. Ücretin banka ekstresine birkaç gün sonra toplu düşmesi yeni veya şüpheli işlem olmak zorunda değildir.",
        "Önemli sınır: ATM temassız sistemi **Trenord ve S banliyö trenlerinde geçerli değildir**. Porta Venezia, Repubblica, Garibaldi veya Dateo'da metrodan S hattına geçiyorsanız metrodan aynı kartla çıkın ve demiryolu için geçerli ayrı bilet alın. Aynı istasyon kompleksinde olmak tek ödeme ağı demek değildir.",
        "ATM uygulamasından alınan QR bileti binmeden etkinleştirin ve metroda giriş/çıkış okuyucusunu kullanın. Kâğıt bileti de ilk binişte doğrulatın. Tarihî sarı tramvay fotojeniktir ama her araç turistik ring yapmaz; hat numarası ve yönü okuyun.",
      ],
    },
    {
      heading: "Son Akşam Yemeği bileti: Milano'daki en zor rezervasyon",
      id: "son-aksam-yemegi",
      body: [
        "Leonardo'nun Son Akşam Yemeği, Santa Maria delle Grazie manastırındaki Cenacolo Vinciano'dadır. Koruma koşulları nedeniyle **her ziyaretçi ve her bilet türü için rezervasyon zorunludur**. Resmî bilgi ve satış yönlendirmesi **cenacolovinciano.org** üzerinden yapılır; bilet dönemleri üç aylık bloklarla açılır ve tarih kuralları duyurulur.",
        "2026 düzeninde biletler isimlidir; çevrimiçi bireysel bilette isim sonradan değiştirilemeyebilir. Müze, bilet teslimi için ziyaret saatinden en az 30 dakika önce yan gişede bulunulmasını ister; geç kalırsanız giriş hakkınızı kaybedebilirsiniz. Kimlik ve ödeme belgesini taşıyın.",
        "Eserin bulunduğu refektoryaya giriş kontrollü gruplarla ve kısa süre içindir; bu bir saatlik serbest müze değildir. Önceden kompozisyonu okumak ve resmî uygulama/sesli içeriği kullanmak 15 dakikayı anlamlı kılar. Santa Maria delle Grazie kilisesinin ziyaret/ayin düzeni müze biletinden ayrıdır.",
        "Bilet tükendiyse resmî siteyi düzenli kontrol edin: müze sonraki hafta için ek biletlerin belirli gün/saatte açılabildiğini duyurur. Arama reklamındaki yüksek fiyatlı 'skip the line' paketi resmî stok olduğu anlamına gelmez. Tur alırsanız bile bilet adınızı, giriş saatini ve müzenin resmî kuralına uygunluğu yazılı görün.",
      ],
    },
    {
      heading: "Duomo terası, Galleria ve La Scala",
      id: "duomo-ve-merkez",
      body: [
        "Milano Duomo kompleksi katedral, çatı terasları, arkeolojik alan ve müzeyi farklı kombinasyonlarda sunar. Çatıya merdiven ve asansör biletleri ayrı olabilir; asansör bileti dahi terasın tüm üst bölümünde basamaksız rota garantisi değildir. Hava, güvenlik veya dinî tören nedeniyle erişim değişebilir. Yalnız **duomomilano.it** resmî kanalından güncel bileti alın.",
        "Katedrale uygun kıyafetle gidin; omuz/diz örtüsü ve güvenlik kontrolü vardır. Çatı için kaymaz ayakkabı seçin, büyük çantayı bırakın. Sabah erken veya gün sonu ışığı güzel olsa da son giriş ve çatı hava kuralını aynı gün kontrol edin.",
        "Galleria Vittorio Emanuele II'de boğa mozaiği geleneği popülerdir; topukla dönmek için mozaiği aşındıran kalabalığa eklenmek zorunda değilsiniz. Duomo cephesini daha iyi görmek için meydanın ortasında ani durmak yerine kenara çekilin. La Scala'nın tiyatro müzesi, prova/etkinlik nedeniyle salona bakışı her zaman garanti etmez; temsil bileti ile müze ziyareti farklıdır.",
        "Museo del Novecento, Duomo manzarasını 20. yüzyıl İtalyan sanatıyla birleştirir ve yağmurlu/çok sıcak gün için güçlü tercihtir. Duomo ile Brera arasındaki yaya aksında yalnız lüks mağazalara değil San Bernardino alle Ossa veya Ambrosiana gibi daha küçük duraklara ilginize göre zaman ayırın.",
      ],
    },
    {
      heading: "Brera, Navigli, Isola ve çağdaş Milano",
      id: "mahalleler",
      body: [
        "**Brera**, Pinacoteca, Orto Botanico ve taş sokaklarıyla sanat günü için doğal üs; akşam restoran fiyatları yükselir. Pinacoteca di Brera için koleksiyon ve restorasyon duyurularını resmî siteden kontrol edin. Mahalle etiketini yalnız Via Brera'nın vitrinlerine indirgemeyin.",
        "**Navigli**, gün batımı aperitivo ve kanal çevresi gece hayatıyla bilinir. Ana kanal kenarı hafta sonu çok yoğun ve turistik olabilir; Darsena, Naviglio Pavese ve Porta Genova çevresini birlikte gezin. Açık büfe fotoğrafı gördüğünüz her içki 'sınırsız ücretsiz yemek' değildir; aperitivo formülü işletmeye göre küçük atıştırma veya ücretli apericena olabilir.",
        "**Porta Nuova–Isola**, Bosco Verticale, Piazza Gae Aulenti ve Fondazione Catella çevresinde çağdaş dönüşümü gösterir. Isola'nın iç sokakları mahalle barı ve restoran için daha iyi; gökdelen fotoğrafından sonra geri dönmeyin. **CityLife** başka yönde çağdaş mimari/alışveriş bölgesidir, kısa gezide ikisini aynı tema diye seçmek gerekir.",
        "**Fondazione Prada** ve Porta Romana güneyde modern sanat/yeniden kullanım için ayrı yarım gündür. Sergi takvimi ilginizi çekmiyorsa sırf Instagram kulesi için gitmeyin. **NoLo** ve Lambrate tasarım haftasında hareketlenir; etkinlik dışı günlerde programın açık olup olmadığını kontrol edin.",
      ],
    },
    {
      heading: "Milano'da nerede kalınır?",
      id: "nerede-kalinir",
      body: [
        "**Duomo/Brera** kısa gezi ve yürüyüş için en merkezi, en pahalı seçeneklerdir. **Centrale** havalimanı/tren bağlantısında pratiktir; istasyonun her cephesi aynı hissi vermez ve geç gece sokak rotasını yorum/haritadan kontrol etmek gerekir. **Porta Venezia** M1, yemek ve LGBTQ+ gece hayatı ile dengeli bir üstür.",
        "**Navigli/Porta Genova** akşam eğlencesi için iyi fakat kanal cephesindeki odalar gürültülü olabilir. **Isola/Garibaldi** çağdaş mahalle, metro ve tren bağlantısı sunar. **Porta Romana** daha konut ağırlıklı, Fondazione Prada ve yeme içme için güçlü; Duomo'ya metro/tramvay gerekir.",
        "Fuar için gelenler Rho Fiera ile Fiera Milano City'yi karıştırmamalıdır. Rho merkez dışında M1/S trenleri yönündedir; tasarım haftası ve büyük fuarlarda konaklama ile toplu taşıma gece kapasitesi değişir. Etkinlik yerini tam adla haritalayın.",
        "Konaklama vergisi tesis sınıfına göre eklenebilir. Odada klima aktif dönem, resepsiyon saati ve bagaj bırakma koşulunu sorun. Centrale'ye yakın diye Malpensa Express'in her seferinin Centrale'ye geldiğini varsaymayın; bilette varış hattını okuyun.",
      ],
    },
    {
      heading: "Milano'da ne yenir? Aperitivo yalnız açık büfe değildir",
      id: "ne-yenir",
      body: [
        "Risotto alla milanese safran ve yoğun et suyuyla; ossobuco uzun pişmiş dana incik; cotoletta alla milanese kemikli/kemiksiz yorumları olan pane et; mondeghili ise şehrin artık et köftesi geleneğidir. Kışın cassoeula daha ağır ve mevsimseldir. Panettone yalnız Noel hediyelik kutusu değil Milano kökenli mayalı hamurdur.",
        "Aperitivo, akşam yemeğinden önce içki yanında küçük ikram ritüelidir. Bazı işletmeler geniş büfeyi **apericena** olarak fiyatlar, bazıları yalnız zeytin/cips getirir. Menüde içkiye neyin dâhil olduğunu ve masaya servis ekini sorun; sosyal medyadaki eski büfe görüntüsünü bugünkü uygulama sanmayın.",
        "Campari, Milano–Torino, Negroni Sbagliato gibi içkiler yerel bar kültüründe görünür. Alkolsüz seçenek istemek olağandır. Navigli'nin ilk sıra kanal masasında manzara bedeli yükselirken Porta Venezia, Isola veya Porta Romana'da içki/yemek kalitesi daha dengeli olabilir.",
        "Kahve barda ayakta ve masada farklı fiyatlanabilir. Coperto veya servizio satırını okuyun; bahşiş zorunlu yüzde değildir. Moda bölgesindeki tarihî pastane/kafede mekân deneyimi için ödediğinizi bilerek oturun.",
      ],
    },
    {
      heading: "Alışveriş, moda ve tasarım haftası gerçeği",
      id: "alisveris-ve-tasarim",
      body: [
        "Quadrilatero della Moda vitrin gezisi ve lüks alışveriş için; Corso Buenos Aires daha geniş orta segment, Via Torino genç zincirler, Brera ve 5VIE bağımsız tasarım için uygundur. Outlet'i şehir merkezinde ucuz butik sanmayın; büyük outlet köyleri transfer ve tam gün maliyeti yaratır.",
        "Tax-free koşulları ikamet, asgari harcama ve AB'den son çıkış noktasına bağlıdır; mağaza formu tek başına iade garantisi değildir. Pasaport bilgisi, ürün, fatura ve gümrük doğrulama adımını resmî AB/İtalya kuralından kontrol edin. Milano'dan trenle başka AB ülkesine geçiyorsanız işlemi yanlış havalimanında aramayın.",
        "Salone del Mobile ve Fuorisalone sırasında sergiler Rho Fiera ile şehir mahallelerine yayılır. Her etkinlik halka açık veya ücretsiz değildir; kayıt, kapasite ve saatleri resmî programdan izleyin. Bu hafta konaklama ve restoranı son dakikaya bırakmak pahalıdır.",
        "Tasarım ürünü alırken 'Made in Italy' ifadesini marka hikâyesinden ayırın; malzeme, üretim yeri ve iade koşulunu sorun. Pazar tezgâhındaki sahte lüks ürünü gümrük/ceza riskine rağmen hatıra diye almayın.",
      ],
    },
  ],

  places: [
    {
      name: "Trattoria Milanese",
      area: "Centro / Cinque Vie",
      known: "Risotto, ossobuco ve cotoletta",
      why:
        "Merkezde klasik Milano tabaklarını aynı menüde karşılaştırmak, kuzey mutfağının pizza/makarnadan farklı çizgisini görmek için uygundur.",
      price: "Orta",
      tip: "Ossobuco–risottoyu birlikte/ayrı servis seçeneklerini ve açık günü doğrulayın; akşam rezervasyon yapın.",
    },
    {
      name: "Ratanà",
      area: "Porta Nuova / Isola",
      known: "Çağdaş Milano ve Lombardiya mutfağı",
      why:
        "Risotto ve mondeghili gibi gelenekleri çağdaş teknikle sunarken Porta Nuova'nın dönüşümünü mahalle yemeğine bağlar.",
      price: "Yüksek",
      tip: "Degüstasyon ve alakart düzeni değişebilir; resmî menüden fiyat/formülü kontrol edip rezervasyon yapın.",
    },
    {
      name: "Trippa",
      area: "Porta Romana",
      known: "Sakatat ve mevsimsel İtalyan tabakları",
      why:
        "Milano'nun çağdaş trattoria sahnesini, güçlü malzeme ve sakatat odaklı kısa menüyle görmek isteyenler için destinasyon niteliğindedir.",
      price: "Orta",
      tip: "Masa bulmak zor olabilir; yalnız resmî rezervasyon kanalını ve güncel servis günlerini kullanın.",
    },
    {
      name: "Luini",
      area: "Duomo",
      known: "Panzerotti",
      why:
        "Duomo arasında hızlı, sıcak ve ekonomik bir mola sunar; Milano'nun göçle şekillenen gündelik yemek tarihinin de parçasıdır.",
      price: "Ekonomik",
      tip: "Kuyruk hızlı ilerler; oturmalı öğün beklemeyin ve çok sıcak dolguyu ilk ısırıkta dikkatli yiyin.",
    },
    {
      name: "Pavé",
      area: "Porta Venezia",
      known: "Kahve, kruvasan ve çağdaş pastane",
      why:
        "İtalyan bar kahvesiyle daha uzun oturmalı modern kahvaltı/pastane kültürü arasındaki Milano yorumunu denemek için iyi duraktır.",
      price: "Orta",
      tip: "Şube ve masa servis düzenini kontrol edin; hafta sonu yoğun saatten önce gidin.",
    },
    {
      name: "Cantine Isola",
      area: "Paolo Sarpi / Chinatown",
      known: "Tarihî şarap barı ve aperitivo",
      why:
        "Navigli'nin büfe odaklı formülünden farklı olarak şarap seçimi, mahalle kalabalığı ve sade atıştırmalarla gerçek aperitivo ritmini gösterir.",
      price: "Orta",
      tip: "Ayakta kalabalık olabilir; kadeh fiyatı ve eşlik eden ikramı siparişte sorun.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — Duomo, merkez ve Brera",
      morning:
        "Resmî biletle Duomo ve hava uygunsa çatı terası; Galleria'dan La Scala meydanına yürüyün.",
      afternoon:
        "Brera'da Pinacoteca veya sokak/Orto Botanico; tek büyük koleksiyon seçin.",
      evening:
        "Brera'dan Porta Venezia'ya passeggiata ve açık içeriği net bir aperitivo.",
    },
    {
      title: "2. Gün — Leonardo, Sant'Ambrogio ve Navigli",
      morning:
        "Cenacolo Vinciano girişinden 30 dakika önce kimlikle gişede olun; Santa Maria delle Grazie çevresi.",
      afternoon:
        "Sant'Ambrogio, ilginize göre Museo della Scienza veya Castello Sforzesco'nun seçili bölümü.",
      evening:
        "Darsena ve Navigli yürüyüşü; ana kanalın ilk masası yerine menüsü açık bir mahalle adresi.",
    },
    {
      title: "3. Gün — Çağdaş Milano",
      morning:
        "Porta Nuova, Piazza Gae Aulenti ve Isola; Bosco Verticale'yi kamusal alandan görün.",
      afternoon:
        "Sergi ilgisine göre Fondazione Prada veya Museo del Novecento; iki uzak noktayı aynı saate sıkıştırmayın.",
      evening:
        "Porta Romana ya da Isola'da akşam yemeği; dönüşte ATM/S hattı ödeme ayrımını hatırlayın.",
    },
  ],

  practicalHeading: "Milano'da ulaşım ve rezervasyon için küçük ama kritik ayrımlar",
  practicalTips: [
    {
      title: "Havalimanını IATA koduyla kaydedin",
      body: "MXP, LIN ve BGY birbirinden uzaktır. Transfer biletini yalnız 'Milan airport' adına bakarak almayın.",
    },
    {
      title: "Malpensa treni tek bir merkeze gitmez",
      body: "Cadorna, Centrale ve Garibaldi yönlerini otelinize göre seçin; terminal, varış istasyonu ve bakım duyurusunu kontrol edin.",
    },
    {
      title: "ATM temassız ödeme S treninde geçmez",
      body: "Metrodan banliyö/Trenord hattına geçerken çıkış yapıp demiryolu için geçerli ayrı bilet alın.",
    },
    {
      title: "Cenacolo'ya 30 dakika erken gidin",
      body: "Bilet isimli, rezervasyon zorunlu ve geç kalma toleransı düşüktür. Kimlik ve satın alma belgesini taşıyın.",
    },
    {
      title: "Aperitivo içeriğini sorun",
      body: "İçeceğin yanında birkaç atıştırma mı, büfe mi, yoksa ücretli apericena mı olduğunu menüden görün; eski fotoğrafa güvenmeyin.",
    },
    {
      title: "Aynı kart ile aynı cihazı kullanın",
      body: "Metro giriş/çıkış ve aktarmalarda fiziksel kartı telefon cüzdanıyla değiştirmeyin; kişi başına ayrı ödeme aracı kullanın.",
    },
  ],

  faqs: [
    {
      q: "Milano için kaç gün gerekir?",
      a: "Duomo, Brera ve Son Akşam Yemeği için 2 tam gün; çağdaş mahalle/müze eklemek için 3 gün idealdir.",
    },
    {
      q: "Milano'da hangi havalimanı merkeze en yakın?",
      a: "Linate (LIN) en yakındır ve M4 metrosuna bağlıdır. Malpensa trenle, Bergamo Orio al Serio ise çoğunlukla otobüsle bağlanır.",
    },
    {
      q: "Son Akşam Yemeği biletini nereden almalıyım?",
      a: "cenacolovinciano.org resmî müze sitesinin yönlendirdiği satış kanalını kullanın. Rezervasyon herkes için zorunlu ve bilet isimlidir.",
    },
    {
      q: "Milano'da banka kartıyla metroya binilir mi?",
      a: "ATM ağında uygun okuyucularda evet. Aynı kart/cihazla giriş ve çıkış yapın; sistem Trenord ve S demiryolu hatlarında geçerli değildir.",
    },
    {
      q: "Milano'da araba gerekir mi?",
      a: "Şehir gezisi için hayır. Metro/tramvay yeterlidir; merkezde Area C/ZTL ve park maliyeti vardır.",
    },
    {
      q: "Milano'da hangi bölgede kalınır?",
      a: "Kısa gezi için Duomo/Brera, ulaşım için Centrale, dengeli gece hayatı için Porta Venezia, çağdaş mahalle için Isola, kanal akşamı için Navigli uygundur.",
    },
  ],

  relatedGuides: [
    {
      city: "Venedik",
      anchor: "Milano'dan Venedik'e: Santa Lucia'ya tren",
      description: "Mestre'de yanlışlıkla bitirmeden ada merkezine geçin; vaporetto ve 2026 erişim QR'ını önceden planlayın.",
    },
    {
      city: "Floransa",
      anchor: "Milano'dan Floransa'ya: hızlı trenle Rönesans",
      description: "SMN'ye varıp Uffizi, Accademia ve Duomo rezervasyonlarını üç ayrı güne yayarak gezinin temposunu düşürün.",
    },
    {
      city: "Roma",
      anchor: "Milano'dan Roma'ya: kuzeyden Ebedî Şehir'e",
      description: "Hızlı trenle Termini'ye geçin; antik Roma, Vatikan ve tarihî merkezi ayrı günlere bölün.",
    },
    {
      city: "Napoli",
      anchor: "Milano'dan Napoli'ye: hızlı tren mi uçak mı?",
      description: "Merkezden merkeze tren ile üç havalimanlı uçuşun gerçek toplam süresini karşılaştırın.",
    },
    {
      city: "Amalfi Kıyısı",
      anchor: "Milano'dan Amalfi Kıyısı'na: Salerno bağlantısı",
      description: "Hızlı tren/uçuş sonrası son kıyı transferini ve feribot mevsimini aynı rezervasyon planında çözün.",
    },
  ],

  sources: [
    { name: "YesMilano — Milano'ya ulaşım", url: "https://www.yesmilano.it/en/traveller-information/how-get-milano" },
    { name: "ATM Milano — temassız ulaşım", url: "https://www.atm.it/EN/VIAGGIACONNOI/BIGLIETTI/Pages/contactless_cards_metro.aspx" },
    { name: "ATM Milano — M4 Linate", url: "https://www.atm.it/en/ViaggiaConNoi/InfoTraffico/Pages/M4passengerserviceinformation2.aspx" },
    { name: "Museo del Cenacolo Vinciano — ziyaret", url: "https://cenacolovinciano.org/en/info/" },
    { name: "Duomo di Milano — resmî site", url: "https://www.duomomilano.it/en/" },
    { name: "Malpensa Express — hatlar", url: "https://www.malpensaexpress.it/" },
  ],

  volatileNote:
    "Cenacolo bilet açılışları, Duomo/La Scala erişimi; MXP trenleri, BGY otobüsleri, ATM tarifesi, fuar programı ve restoran saatleri değişebilir. Resmî kanalları seyahat gününde kontrol edin.",
  reviewed: "2026-08-10",
};

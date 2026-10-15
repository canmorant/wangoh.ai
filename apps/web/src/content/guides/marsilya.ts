import { CityGuide } from "./types";

/** Marsilya rehberi — Ağustos 2026 araştırması. */
export const marsilya: CityGuide = {
  city: "Marsilya",
  countryCode: "FR",

  seoTitle: "Marsilya Gezi Rehberi: Calanques ve 4 Günlük Rota",
  seoDescription:
    "Marsilya gezi rehberi: havalimanı ve RTM ulaşımı, 2026 Calanques rezervasyonu, güvenli semt seçimi, bouillabaisse ve gerçekçi 4 günlük rota.",
  h1: "Marsilya Gezi Rehberi",
  lede:
    "Marsilya pürüzsüz bir kartpostal değil, 2.600 yıllık göçler, balıkçı koyları, Kuzey Afrika mutfağı ve kireçtaşı Calanques arasında yaşayan güçlü bir limandır; onu sevmek için steril bir Riviera şehri beklememek gerekir.",

  quickFacts: [
    { label: "Önerilen süre", value: "3–4 tam gün" },
    { label: "Havalimanı", value: "MRS · A1 servis" },
    { label: "Şehir içi", value: "RTM metro + tramvay + otobüs" },
    { label: "Doğa günü", value: "Calanques · yangın erişimi değişir" },
    { label: "Yerel tat", value: "Bouillabaisse + panisse + navette" },
  ],

  sections: [
    {
      heading: "Marsilya gezisi nasıl planlanır? Liman, mahalle ve doğayı ayırın",
      id: "gezi-planlama",
      body: [
        "Marsilya'nın ana duraklarını üç kümeye bölün: Vieux-Port–Le Panier–Mucem; Notre-Dame de la Garde–Corniche–Vallon des Auffes; Noailles–Cours Julien–La Plaine. Calanques veya Frioul/Château d'If için ayrıca hava koşuluna bağlı tam gün bırakın. Şehir çok katmanlı ve yokuşludur; haritadaki kısa mesafeler sıcak ile merdivende uzar.",
        "İki gün kent merkezini görmeye, üç–dört gün deniz/doğa eklemeye yeter. Calanques yürüyüşünü uçuş gününe veya programın tek boşluğuna koymayın: yangın tehlikesi, kuvvetli mistral, aşırı sıcak ve deniz koşulu erişimi aynı sabah değiştirebilir. Esnek gün, Marsilya'da lüks değil iyi planlamadır.",
        "Marsilya'yı güvenlik klişeleriyle kuzey–güney diye basitleştirmeyin. İstasyon, kalabalık toplu taşıma ve Vieux-Port çevresinde büyük şehir dikkati yeterlidir: telefonu masanın dış kenarında bırakmayın, karanlık kestirmeyi takip etmeyin ve gece dönüşünü ana caddelerle kurun. Mahalleleri yaşayan topluluklar olarak gezin, yoksulluğu fotoğraf dekoruna çevirmeyin.",
      ],
    },
    {
      heading: "Marsilya Provence Havalimanı'ndan Saint-Charles'a ulaşım",
      id: "havalimani-ulasimi",
      body: [
        "Marseille Provence (MRS) ile **Gare Saint-Charles** arasında A1 havaalanı otobüsü temel bağlantıdır. Yol trafik durumuna göre önemli ölçüde uzayabilir; dönüşte teorik süreyi değil, havalimanının güncel tarifesini ve yol payını kullanın. Bilet satış noktasını, peronu ve gece seferini havalimanı resmî sayfasından kontrol edin.",
        "Vitrolles Aéroport Marseille Provence tren istasyonuna havalimanı servis bağlantısı bulunabilir; Aix-en-Provence, Avignon veya başka bölgesel hedefe gidiyorsanız seçenekleri SNCF ile karşılaştırın. Terminalden doğrudan trene yüründüğünü varsaymayın; istasyon transfer süresini ekleyin.",
        "Saint-Charles merdivenleri şehir manzarası verir ama valizle yorucudur; metro bağlantısını veya istasyon içi erişilebilir çıkışı kullanın. Gece otele yürürken yalnız mesafeye değil sokak ve girişe bakın. Takside resmî sıraya gidin, uygulama aracının buluşma alanını terminal tabelasından doğrulayın.",
      ],
    },
    {
      heading: "Marsilya toplu taşıması: RTM, deniz servisleri ve CityPass",
      id: "toplu-tasima",
      body: [
        "RTM ağı iki metro hattı, tramvay ve geniş otobüs sisteminden oluşur. Bileti makine, satış noktası veya uyumlu dijital kanaldan alın; her binişte ve gerekiyorsa aktarmada doğrulayın. Temassız banka kartı kabulü araç ve güncel sisteme göre değişebileceğinden, Paris veya Lyon'daki deneyimi buraya taşımayın. Calanques otobüsünde bilet sırası yerine ürünü önceden hazırlayın.",
        "Vieux-Port'un iki yakası arasında çalışan küçük **Ferry Boat**, Frioul veya Château d'If teknesi değildir; birkaç dakikalık liman geçişidir ve çalışma düzeni hava/bakıma göre değişebilir. Frioul ile If seferleri ayrı deniz hattı ve bilettir. Kuvvetli rüzgârda iptal olabilir; adaya gidiş ile anıt girişinin ayrı olup olmadığını satın alırken okuyun.",
        "Marseille CityPass, seçilen süre içinde RTM ulaşımı ve bazı müze/deniz deneyimlerini birleştirebilir. Her tekne turunu veya Calanques gezisini kapsadığını varsaymayın; güncel seçim hakkını, fiziksel kart teslimini ve rezervasyon gereğini okuyun. Yalnız Mucem ve birkaç metro kullanımı için almadan önce tek tek toplamı hesaplayın.",
      ],
    },
    {
      heading: "Vieux-Port, Le Panier ve Mucem rotası",
      id: "vieux-port-le-panier-mucem",
      body: [
        "Vieux-Port güne balık tezgâhları ve teknelerle başlar, akşam taraftar ve teras kalabalığıyla değişir. Norman Foster'ın aynalı gölgeliği, limanın iki yakası ve belediye binası arasında yürüyün; restoran seçimini yalnız rıhtımın ilk sırasına bağlamayın. Bouillabaisse ilan eden her turistik menü aynı gelenek ve balık kalitesini sunmaz.",
        "Le Panier dar sokak, merdiven, duvar resmi ve küçük atölyelerle limanın arkasında yükselir. La Vieille Charité avlusu bölgenin mimari odağıdır. Mahalle dekor değil konuttur; kapı önü ve insanları izinsiz çekmeyin. Valizle kalacaksanız taksi erişimi ve son merdiveni otelden sorun.",
        "Mucem'in J4 binası ile Fort Saint-Jean köprülerle bağlanır; yalnız dış kafes mimarisini görmek koleksiyonun yerini tutmaz. Sergi bileti ve ücretsiz açık alan kapsamını güncel sayfadan kontrol edin. Fort'tan Panier'ye geçiş, aynı günün coğrafyasını doğal biçimde tamamlar.",
      ],
    },
    {
      heading: "Calanques Ulusal Parkı: 2026 rezervasyon ve yangın kuralı",
      id: "calanques",
      body: [
        "Calanques şehir parkı değil, sıcak, kayalık zemin ve sınırlı su noktası olan bir ulusal parktır. Yazın yangın tehlikesine göre masiflere erişim günlük olarak tamamen kapanabilir. Bir önceki akşam ve sabah **Bouches-du-Rhône / Calanques Ulusal Parkı** resmî erişim haritasını kontrol edin; bariyer veya görevli talimatını aşmayın.",
        "**Sugiton Calanque** için 2026'da 27 Haziran–30 Ağustos arasında her gün, ayrıca belirli haziran ve eylül hafta sonlarında ücretsiz rezervasyon zorunludur. Rezervasyon genellikle ziyaretten üç gün önce açılır ve bir gün önce kapanır; kontenjan dolabilir. Onayı çevrimdışı indirin/çıktı alın ve kimlik taşıyın. Ücretsiz olduğu için ücretli aracıya ödeme yapmayın.",
        "Sugiton'a toplu taşımada Luminy yönü yaygın başlangıçtır; son bölüm uzun ve eğimli yürüyüştür. Yanınıza kişi başı yeterli su, güneş koruması ve tutuşlu ayakkabı alın; terlik kullanmayın, ateş/sigara yakmayın. Tekne turu kıyıyı denizden gösterir ama çoğu tur koyda karaya çıkmaz; yürüyüşün yerine geçtiğini sanmayın.",
      ],
    },
    {
      heading: "Notre-Dame, Corniche ve Vallon des Auffes",
      id: "corniche",
      body: [
        "Notre-Dame de la Garde'a şehir otobüsüyle çıkmak, sıcakta dik yokuşu tırmanmaktan daha akıllıcadır; etkinlik veya trafik düzeninde son durak değişebilir. Bazilika yaşayan ibadet alanıdır. Teraslardan şehir, liman, Frioul adaları ve Calanques yönünü okumak Marsilya coğrafyasını birleştirir.",
        "Corniche Kennedy boyunca kesintisiz yürümek uzun ve güneşli olabilir. Catalans, Vallon des Auffes ve Malmousque bölümlerini otobüsle bağlayıp seçili kesimi yürüyün. Deniz kenarındaki kayalık yüzme noktalarında cankurtaran, giriş merdiveni ve dalga durumunu kontrol edin; sosyal medya atlayışını güvenli örnek saymayın.",
        "Vallon des Auffes küçük balıkçı limanı ve restoranlarıyla gün batımında çok popülerdir. Burada bouillabaisse yiyecekseniz ön sipariş ve kişi başı servis kuralını sorun; yalnız çorba adı değil balık seçimi, ayrı servis ve fiyat deneyimin parçasıdır. Dönüş otobüsü veya taksiyi önceden planlayın.",
      ],
    },
    {
      heading: "Marsilya'da nerede kalınır? Semt ve sokak seçimi",
      id: "nerede-kalinir",
      body: [
        "**Vieux-Port** ilk ziyaret için metro, tekne ve yürüyüşün merkezidir; rıhtım, taraftar gecesi ve bar sesi nedeniyle iç avlu/üst kat önemlidir. **Le Panier** karakterli ve manzaralı, merdiven ile araç erişimi bakımından zordur. **Castellane/Prado**, iki metro hattı ve güney sahilleri/Calanques otobüsü için işlevsel bir üs sunar.",
        "**Endoume** ve Vallon des Auffes çevresi kıyı yaşamı için çekici, metrodan uzak ve yokuşludur. **Cours Julien/La Plaine** sokak sanatı, bar ve genç gece hayatı için canlıdır; sessizlik isteyen oda için uygun olmayabilir. **Saint-Charles** erken tren ve bütçe açısından pratiktir, fakat istasyonun farklı blokları aynı gece deneyimini vermez; güzergâhı güncel yorumlarla kontrol edin.",
        "Klima yazın gerçek ihtiyaçtır; yalnız vantilatör yazan eski odada sıcak ağır olabilir. Liman manzarası fotoğrafının oda kategorisine ait olduğunu, asansör ve bagaj depolamayı sorun. Konaklama vergisi rezervasyonda ayrı görünebilir.",
      ],
    },
    {
      heading: "Marsilya'da ne yenir? Bouillabaisse'ten Noailles'a",
      id: "ne-yenir",
      body: [
        "Gerçek **bouillabaisse** ucuz bir karışık balık çorbası değildir; yerel kaya balıkları, rouille, kruton ve çoğunlukla et suyu ile balığın aşamalı servisini içerir. İyi adresler ön sipariş veya minimum kişi isteyebilir. Balık türlerini, servis biçimini ve kişi başı fiyatı rezervasyonda sorun; yalnız Vieux-Port tabelasına güvenmeyin.",
        "**Panisse** nohut bazlı kızartma, **navette** portakal çiçeği kokulu kuru bisküvi, pieds-paquets ise sakatat geleneğidir. Marsilya pizzası şehrin İtalyan göç tarihini taşır; yarım pizza fikri ve kamyon pizzaları yerel gündelik yaşama aittir. Deniz ürününü mevsim ve tedarik durumuna göre seçin.",
        "Noailles pazarı ve Rue d'Aubagne çevresindeki Tunus, Cezayir, Komor ve Levant mutfakları Marsilya'nın merkezî kimliğidir, 'etnik mola' değil. Baharat, kuskus, leblebi yemeği veya sandviçi tadarken pazarın yoğun işleyişine saygı gösterin. Restoran fiyatına servis dahildir; bahşiş memnuniyet tercihi olarak küçük bırakılır.",
      ],
    },
  ],

  places: [
    { name: "Chez Fonfon", area: "Vallon des Auffes", known: "Bouillabaisse ve bourride", why: "Balıkçı koyunda, uzun süredir aynı uzmanlığı sürdüren bir kurumda Marsilya'nın törensel balık yemeğini deneyimlemek için gidilir.", price: "Yüksek", tip: "Bouillabaisse kuralı ve fiyatı için önceden rezervasyon yapın; güncel açık günü doğrulayın." },
    { name: "Chez Étienne", area: "Le Panier", known: "Marsilya pizzası ve sarımsaklı kalamar", why: "Gösterişsiz, gürültülü ve paylaşmaya uygun masada şehrin İtalyan–Akdeniz damarını görmek için klasik bir duraktır.", price: "Orta", tip: "Rezervasyon/ödeme düzenini ve açık günü önceden kontrol edin; menü seçimi sınırlı olabilir." },
    { name: "L'Épicerie L'Idéal", area: "Noailles", known: "Akdeniz şarküteri ve günlük tabaklar", why: "İyi ürün, sandviç, salata ve ev tipi öğle tabaklarıyla Noailles'ın pazar enerjisini rafine ama rahat biçimde birleştirir.", price: "Orta", tip: "Küçük alan öğlen dolar; servis saatini kontrol edip erken gidin." },
    { name: "Chez Yassine", area: "Noailles", known: "Uygun fiyatlı Tunus mutfağı", why: "Lablabi, kuskus ve baharatlı ev yemekleriyle Marsilya'nın Kuzey Afrika ile kurduğu yaşayan bağı ekonomik bir sofrada gösterir.", price: "Ekonomik", tip: "Acı tercihini söylerken net olun; güncel menü ve haftalık kapanışı kontrol edin." },
    { name: "Tuba Club", area: "Les Goudes", known: "Deniz kenarı, balık ve çağdaş Akdeniz tabakları", why: "Şehir merkezinden uzak bir kıyı deneyiminde gün batımı, deniz ürünü ve yaratıcı küçük tabakları birleştirmek için seçilir.", price: "Yüksek", tip: "Mevsim, hava ve ulaşım belirleyicidir; rezervasyon yapın ve dönüş taksi/otobüsünü önceden çözün." },
    { name: "Four des Navettes", area: "Saint-Victor", known: "Portakal çiçekli navette", why: "Sert dokulu geleneksel bisküviyi tarihî fırın bağlamında tadıp Saint-Victor rotasına kısa, anlamlı bir mola ekler.", price: "Ekonomik", tip: "Navette kuru ve aromatik bir bisküvidir; taze kruvasan beklentisiyle almayın, küçük paket deneyin." },
  ],

  itinerary: [
    { title: "1. Gün — Vieux-Port, Le Panier ve Mucem", morning: "Vieux-Port'ta erken yürüyüş; küçük Ferry Boat çalışıyorsa limanın karşı yakasına geçiş.", afternoon: "Le Panier, Vieille Charité, Mucem ve Fort Saint-Jean köprüleri.", evening: "Noailles'da erken yemek veya Le Panier'de rezervasyonlu pizza; ana caddeden dönüş." },
    { title: "2. Gün — Notre-Dame ve kıyı", morning: "Otobüsle Notre-Dame de la Garde; terastan şehir coğrafyasını okuyun.", afternoon: "Corniche'nin seçili kesimi, Vallon des Auffes ve hava uygunsa güvenli yüzme.", evening: "Ön siparişli bouillabaisse veya Endoume'da deniz ürünü; dönüşü önceden planlayın." },
    { title: "3. Gün — Noailles ve yaşayan mahalleler", morning: "Noailles pazarı, Rue d'Aubagne ve yerel öğle yemeği.", afternoon: "Cours Julien, La Plaine ve ilginize göre Palais Longchamp.", evening: "Cours Julien'de müzik/bar ya da Vieux-Port'ta gün batımı; eşyaya dikkat edin." },
    { title: "4. Gün — Calanques veya Frioul", morning: "Erişim açıksa rezervasyonlu Sugiton yürüyüşüne erken hareket; su ve kimlik alın.", afternoon: "Alternatif olarak hava uygunken Frioul/Château d'If; tekne ve anıt biletini ayırın.", evening: "Merkeze esnek dönüş ve son akşam yemeği; ertesi gün ulaşımını kontrol edin." },
  ],

  practicalHeading: "Marsilya'da Calanques ve deniz gününü güvenli kılan bilgiler",
  practicalTips: [
    { title: "Sugiton için ücretsiz rezervasyon alın", body: "2026 yazındaki zorunlu günlerde resmî park platformunu kullanın; onayı çevrimdışı indirin ve kimlik taşıyın." },
    { title: "Yangın erişimini aynı sabah kontrol edin", body: "Rezervasyonunuz olsa bile risk nedeniyle masif kapanabilir. Bariyeri aşmayın ve alternatif şehir/ada günü tutun." },
    { title: "Tekne turu yürüyüşle aynı deneyim değildir", body: "Çoğu Calanques teknesi koyları denizden gösterir, karaya çıkmaz. Tur süresi ve rota hava koşuluyla değişebilir." },
    { title: "Ferry Boat ile Frioul feribotunu ayırın", body: "Biri Vieux-Port içi kısa geçiş, diğeri adalara giden ayrı seferdir. Bilet ve iskeleyi doğrulayın." },
    { title: "Bouillabaisse'i önceden sorun", body: "Hazırlık, balık türü, minimum kişi ve servis fiyatı adrese göre değişir; spontane ucuz çorba beklentisi kurmayın." },
    { title: "Saint-Charles'ta çıkışa pay bırakın", body: "İstasyon büyük ve merdivenlidir. Havalimanı otobüsü için peron ile trafik süresini güncel tarifeden kontrol edin." },
  ],

  faqs: [
    { q: "Marsilya için kaç gün gerekir?", a: "Şehir için 2–3 gün, Calanques veya Frioul eklemek için 4 gün idealdir. Doğa gününü kapanma ihtimaline karşı esnek tutun." },
    { q: "Marsilya güvenli mi?", a: "Büyük liman şehrine uygun dikkatle gezilebilir. Kalabalık ulaşım ve turistik alanlarda eşyayı önde taşıyın, gece aydınlık ana güzergâh kullanın; mahalleleri toptan damgalamayın." },
    { q: "Calanques için rezervasyon gerekir mi?", a: "Sugiton'da 2026 yazının belirli günlerinde ücretsiz rezervasyon zorunludur. Ayrıca günlük yangın erişim haritası kontrol edilmelidir." },
    { q: "Marsilya'da hangi semtte kalınır?", a: "Vieux-Port ilk ziyaret için merkezî, Castellane/Prado ulaşım için dengeli, Endoume kıyı için güzeldir. Le Panier ve Cours Julien'de merdiven/gece sesi önemlidir." },
    { q: "Marsilya'da araba gerekir mi?", a: "Merkez için hayır. RTM ve yürüyüş yeterlidir; Calanques'ta yaz park/erişim kısıtları nedeniyle araç çözüm olmayabilir." },
    { q: "Château d'If bileti tekneye dahil mi?", a: "Ada teknesi ile anıt girişi ayrı ürün olabilir. Hava nedeniyle tekne iptali mümkündür; resmî satış ekranındaki kapsamı okuyun." },
  ],

  relatedGuides: [
    { city: "Paris", anchor: "Marsilya'dan Paris'e: limandan başkente TGV", description: "Saint-Charles'tan hızlı trenle Akdeniz ritmini müze, anıt ve mahalle odaklı Paris programına bağlayın." },
    { city: "Nice", anchor: "Marsilya–Nice rotası: Akdeniz'in iki yüzü", description: "Büyük liman, Calanques ve çok kültürlü sofradan Riviera plajları ile kıyı kasabalarına geçin." },
    { city: "Lyon", anchor: "Marsilya'dan Lyon'a: Rhône hattında gastronomi", description: "Kısa tren yolculuğuyla bouillabaisse'ten bouchon mutfağına, limandan tarihî tepelere uzanın." },
    { city: "Bordo", anchor: "Marsilya'dan Bordo'ya: Akdeniz'den Atlantik'e", description: "Uzun bağlantıyı planlayıp balıkçı limanı kültürünü Garonne, şarap ve Atlantik ürünleriyle karşılaştırın." },
    { city: "Strazburg", anchor: "Marsilya'dan Strazburg'a: güneyden Alsace'a", description: "İklim ve mesafe farkını ayrı tren/uçuş ayağıyla çözerek Akdeniz göç tarihinden Fransız–Alman mirasına geçin." },
  ],

  sources: [
    { name: "Marseille Provence Airport — şehir bağlantıları", url: "https://www.marseille.aeroport.fr/access-car-parks/access" },
    { name: "RTM — Marsilya toplu taşıması", url: "https://www.rtm.fr/en" },
    { name: "Calanques Ulusal Parkı — Sugiton 2026 rezervasyonu", url: "https://calanques-parcnational.fr/en/node/11524" },
    { name: "Calanques Ulusal Parkı — ziyaret ve erişim", url: "https://www.calanques-parcnational.fr/en/visiting-calanques-national-park" },
    { name: "Marseille Tourism — CityPass", url: "https://www.marseille-tourisme.com/en/experience/citypass-marseille/" },
    { name: "Marseille Tourism — Château d'If", url: "https://www.marseille-tourisme.com/en/discover-marseille/culture-heritage/discover-the-sites-and-monuments-in-marseille/if-castle/" },
    { name: "Mucem — ziyaret", url: "https://www.mucem.org/en" },
  ],
  volatileNote: "Calanques rezervasyon/yangın erişimi, deniz seferleri, RTM ve havalimanı hizmeti ile müze/restoran saatleri sık değişebilir. Resmî duyuruyu aynı gün kontrol edin.",
  reviewed: "2026-08-10",
};

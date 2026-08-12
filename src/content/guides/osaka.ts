import { CityGuide } from "./types";

/**
 * Osaka rehberi.
 *
 * Ağustos 2026 doğrulaması: Osaka resmi turizm, Kansai Airport ve işletmelerin
 * resmî kanalları. Salgın öncesindeki ortak kushikatsu sos kabı anlatısı bütün
 * şubelere genellenmedi; mevcut servis biçimini takip etme kuralı kullanıldı.
 */
export const osaka: CityGuide = {
  city: "Osaka",
  countryCode: "JP",

  seoTitle: "Osaka Gezi Rehberi: Yemek, Gezilecek Yerler ve Konaklama",
  seoDescription:
    "Osaka gezi rehberi: Dotonbori, Kuromon, sokak lezzetleri, gerçek yemek adresleri, Umeda–Namba semt seçimi, KIX ulaşımı, USJ notları ve 3 günlük gezi planı.",
  h1: "Osaka Gezi Rehberi",
  lede:
    "Japonya'da \"kuidaore\" diye bir söz vardır: yiyerek iflas etmek. Bu söz Osaka için söylenmiştir ve şehri anlamak için gereken hemen her şeyi içerir. Osaka görülecek anıtların değil, yenilecek şeylerin ve konuşulan insanların şehri.",

  quickFacts: [
    { label: "Önerilen süre", value: "2–3 gün" },
    { label: "Karakteri", value: "Tüccar şehri, yemek odaklı, gürültülü" },
    { label: "Havalimanı", value: "Kansai (KIX) · Itami (ITM, iç hat)" },
    { label: "İki merkez", value: "Umeda (kuzey) · Namba (güney)" },
    { label: "Kyoto'ya", value: "Trenle ~30 dakika" },
  ],

  sections: [
    {
      heading: "Osaka neden Japonya'nın en rahat şehri?",
      id: "sehri-anlamak",
      body: [
        "Japonya'yı Tokyo'dan tanıyanlar Osaka'ya geldiklerinde bir tuhaflık hisseder: insanlar yabancıyla konuşur. Dükkân sahibi şaka yapar, yan masadaki adam ne yediğinizi sorar, tezgâhtar fazladan bir şey uzatır. Osaka tarih boyunca bir tüccar şehriydi; saray ve tapınak kültürü yerine pazarlık, esprili laf ve doyurucu yemek kültürü gelişti.",
        "Bunun pratik sonucu şu: Osaka'da yapılacaklar listesi kısa, ama şehirde geçirilen zaman keyifli. Tokyo'da müze müze, Kyoto'da tapınak tapınak gezersiniz; Osaka'da bir sokakta durur, üç şey yer, birileriyle konuşursunuz. Program yapmaya en az ihtiyaç duyduğunuz Japon şehri burasıdır.",
        "Şehir ikiye ayrılır. **Kita** (kuzey), yani Umeda: gökdelenler, büyük mağazalar, iş merkezi. **Minami** (güney), yani Namba ve Dotonbori: neon, yeme-içme, gece hayatı. İkisi arasında metroyla on beş dakika var ve karakterleri gerçekten farklıdır.",
      ],
    },
    {
      heading: "Ne yenir? Osaka'nın asıl gezilecek yeri mutfağı",
      id: "ne-yenir",
      body: [
        "Bu rehberde yeme bölümü en sona değil en başa yakın konuldu, çünkü Osaka'da gezi planı yemeğin etrafında kurulur.",
        "**Takoyaki** — ahtapot parçalı hamur topları. Dışı gevrek, içi neredeyse akışkandır ve ilk ısırıkta ağzınızı yakar; bunu bilerek yiyin. Tezgâhtan tezgâha tarif değişir, ikisini denemeden karar vermeyin.",
        "**Okonomiyaki** — lahana ağırlıklı, sacda pişen kalın bir tür krep. Osaka usulünde malzemeler hamura karıştırılır (Hiroshima usulünde katmanlanır — ikisi farklı şeydir). Birçok mekânda kendi masanızdaki sacda pişirirsiniz.",
        "**Kushikatsu** — galeta unlu, kızarmış şiş. Aşağıda ayrı bir bölüm var, çünkü bir kuralı var.",
        "**Kitsune udon**, **negiyaki** ve **horumon** (sakatat ızgarası) da şehrin klasiklerinden. Osaka'da pahalı restoran aramanıza gerek yok; en iyi yemekler genellikle altı sandalyeli, isli, gürültülü yerlerde çıkıyor.",
      ],
    },
    {
      heading: "Kushikatsu kuralı: eski slogan, yeni servis düzenleri",
      id: "kushikatsu-kurali",
      body: [
        "Kushikatsu kültürünün ünlü sloganı **sosa iki kez batırmamak**tır. Bunun nedeni geçmişte masada ortak kullanılan sos kabının hijyenidir: ısırılmış şiş kaba geri sokulmazdı. Ancak salgın sonrasında birçok işletme sıkma şişesi, kişisel kap veya farklı servis yöntemine geçti. Her masada ortak kap ve lahana 'kepçesi' olacağını varsaymayın.",
        "Bugün en doğru kural basit: işletmenin sunduğu servis biçimini izleyin; ortak kap varsa temiz şişi yalnızca bir kez batırın. Personelin verdiği sos şişesini ya da kişisel kabı kullanıyorsanız tarihî ritüeli taklit etmeye çalışmayın.",
        "Geleneğin merkezi **Shinsekai** semtidir; bilinen markalardan **Kushikatsu Daruma** burada doğdu ve şehirde birden fazla şubeyle çalışıyor. Shinsekai'nin kendisi de görülmeye değer: 20. yüzyıl başında 'geleceğin mahallesi' olarak tasarlanmış, sonra zamanda donmuş, biraz eskimiş ama son derece samimi bir bölge.",
      ],
    },
    {
      heading: "Dotonbori ve Kuromon: iki farklı yeme deneyimi",
      id: "dotonbori-kuromon",
      body: [
        "**Dotonbori**, kanal boyunca uzanan dev neon tabelaların ve hareketli yengeç heykellerinin olduğu bölge. Turistik mi? Fazlasıyla. Buna rağmen gidilir, çünkü Osaka'nın kendini nasıl gördüğünü en iyi burası anlatır: abartılı, gürültülü, iddialı. Akşam gidin, kanal kenarında yürüyün, iki üç tezgâhtan bir şeyler alın ve bunu bir akşam yemeği yerine bir yürüyüş olarak planlayın.",
        "**Kuromon Ichiba**, şehrin \"mutfağı\" sayılan üstü kapalı çarşı. Deniz ürünü, meyve, et ve ayaküstü satan tezgâhlar var; birçok dükkân aldığınızı orada pişirip veriyor. Kuromon sabahları daha canlı, öğleden sonra sakinleşir. Dotonbori'den daha az gösterişli ama yemek olarak daha tatmin edici.",
        "Dürüst bir not: Kuromon son yıllarda belirgin şekilde turistleşti ve fiyatlar çarşı standardının üzerine çıktı. Yine de değerli, ancak \"yerel halkın alışveriş ettiği pazar\" beklentisiyle gitmeyin.",
      ],
    },
    {
      heading: "Gezilecek yerler: yemek dışında ne var?",
      id: "gezilecek-yerler",
      body: [
        "Osaka'nın anıt listesi kısadır ve bu bir kusur değil, şehrin karakteri.",
      ],
      subsections: [
        {
          heading: "Osaka Kalesi ve çevresi",
          body: [
            "Kale birçok kez yıkılıp yeniden yapıldı; bugünkü ana kule modern bir yeniden inşa ve içi müze olarak düzenlenmiş. İçini gezmek herkese hitap etmeyebilir, ama çevresindeki geniş park, hendekler ve taş surlar gerçekten etkileyici. İlkbaharda kiraz, sonbaharda renk için şehrin en iyi parkı.",
          ],
        },
        {
          heading: "Shinsekai ve Tsutenkaku",
          body: [
            "Retro tabelalar, kushikatsu dükkânları, eski oyun salonları. Tsutenkaku kulesi semtin simgesi. Gece daha karakterli; gündüz gelirseniz biraz solgun görünebilir.",
          ],
        },
        {
          heading: "Umeda ve modern taraf",
          body: [
            "Umeda Sky Building'in iki kulesini birbirine bağlayan açık gözlem katı, Japonya'daki en özgün manzara noktalarından biri. Şehrin kuzeyi aynı zamanda alışveriş ve yeraltı çarşıları için merkez — Umeda'nın yeraltı labirenti kendi başına bir deneyim.",
          ],
        },
        {
          heading: "Universal Studios Japan — ayrı bir karar",
          body: [
            "Universal Studios Japan, şehir gezisinin arasına sıkıştırılacak iki saatlik bir durak değildir; gitmek istiyorsanız tam gün ayırın. 5 Ocak 2026'dan beri Super Nintendo World için park içindeki Area Timed Entry Ticket/Standby Entry Ticket işlemi resmî USJ uygulamasından yapılıyor. Bazı gün ve saatlerde alan biletsiz açılabilir; bunu garanti saymayın. Uygulamayı gelmeden kurun, park biletinizi ekleyin ve girişte güncel yönlendirmeyi izleyin.",
            "İlk kez Osaka'ya yalnızca iki gün ayırdıysanız seçim yapmanız gerekir: bir tam park günü, Namba–Shinsekai ve kale/Umeda rotalarından birini dışarıda bırakır. Tema parkı önceliğiniz değilse şehir kendisi iki günü hak eder.",
          ],
        },
        {
          heading: "Kansai'nin merkez üssü olarak Osaka",
          body: [
            "Osaka'nın en güçlü yanlarından biri konumu: Kyoto yarım saat, Nara kırk dakika, Kobe yarım saat, Himeji bir saat mesafede. Bölgeyi gezecekseniz Osaka'da konaklayıp günübirlik dağılmak hem ucuz hem pratik bir strateji.",
          ],
        },
      ],
    },
    {
      heading: "Nerede kalınır? Umeda mı Namba mı?",
      id: "nerede-kalinir",
      body: [
        "Bu, Osaka'da vereceğiniz tek önemli karar.",
        "**Namba / Shinsaibashi (güney)** — Yeme-içme ve gece hayatının içinde olursunuz. Dotonbori, Kuromon ve Shinsekai yürüme veya birkaç durak mesafede. Osaka'ya yemek için geliyorsanız burada kalın. Karşılığında gürültülü.",
        "**Umeda (kuzey)** — Daha düzenli, daha kurumsal, ulaşım açısından çok güçlü. Shin-Osaka'ya (Shinkansen) ve havalimanı bağlantılarına yakın. Kansai'yi günübirliklerle gezecekseniz mantıklı.",
        "**Shin-Osaka** — Yalnızca Shinkansen bağlantısı için; semt olarak ilgi çekici değil. Bir gece kalıp erken trene binecekseniz iş görür.",
        "Genel tavsiye: ilk ziyaretinizse Namba çevresi. Osaka'nın enerjisi orada ve akşam otele dönerken hâlâ bir şeyler açık oluyor.",
      ],
    },
    {
      heading: "Havalimanı ve şehir içi ulaşım",
      id: "ulasim",
      body: [
        "**Kansai (KIX)** uluslararası uçuşların ana kapısı; yapay bir ada üzerindedir. Nankai treniyle Namba'ya en hızlı bağlantılar yaklaşık 34 dakika, daha yavaş hizmetler 40 dakikanın üzerindedir; JR ile Osaka/Umeda tarafı yaklaşık bir saat sürer. **Itami (ITM)** şehre daha yakındır ama esas olarak iç hat havalimanıdır.",
        "Şehir içinde metro fazlasıyla yeterli. **Midosuji hattı** (kırmızı) sizin için en önemli hat olacak: Shin-Osaka, Umeda, Shinsaibashi ve Namba'yı tek hatta bağlıyor. Osaka'da kalacağınız otelin bu hatta yakın olması ciddi kolaylık sağlar.",
        "IC kartınız (Suica, Pasmo, ICOCA — hepsi karşılıklı geçerli) burada da çalışır. Kyoto, Nara ve Kobe'ye giden özel demiryolu şirketleri JR'dan ayrıdır; JR Pass'iniz varsa hangi hattın kapsandığını kontrol edin, çünkü Kansai'de en hızlı rota her zaman JR olmayabilir.",
      ],
    },
    {
      heading: "Kaç gün yeter?",
      id: "kac-gun",
      body: [
        "Osaka'nın kendisi için **2 tam gün** yeterlidir; şehir kompakt ve gezilecek yer listesi kısa. Üçüncü günü Nara veya Kobe'ye ayırmak iyi bir fikir.",
        "Kansai turunda yaygın ve işe yarayan bir kurgu şudur: Osaka'da 3 gece kal, buradan Nara ve Kobe'ye günübirlik git, Kyoto için ise ayrıca 2–3 gece Kyoto'da konakla. Kyoto'yu Osaka'dan günübirlik gezmek mümkün ama Kyoto'nun en iyi saatlerini kaçırtır.",
      ],
    },
    {
      heading: "Ne zaman gidilir?",
      id: "ne-zaman",
      body: [
        "Osaka iç kesimde ve nemli; **yaz gerçekten bunaltıcıdır**. Temmuz–ağustosta gündüz yürüyerek gezmek zordur, ama şehir yeraltı çarşıları ve kapalı arkatlarla dolu olduğu için Kyoto'ya göre daha idare edilir.",
        "**İlkbahar ve sonbahar** en dengeli dönemler. Osaka Kalesi parkı kiraz mevsiminde şehrin en güzel yeri hâline gelir.",
        "**Kış** ılıman geçer, kar nadirdir. Kalabalık azalır, fiyatlar düşer ve sıcak sokak yemeği kültürü kışın çok daha keyiflidir. Osaka, Japonya'da kış gitmenin en az ceza kestirdiği şehirlerden.",
      ],
    },
    {
      heading: "Yerel ipuçları ve sık yapılan hatalar",
      id: "ipuclari",
      body: [
        "**Yürüyen merdivende tabelayı izleyin.** Osaka'da geleneksel alışkanlık sağda durup soldan geçmektir; ancak güvenlik kampanyaları yürümemeyi ve iki tarafta da durmayı isteyebilir. Yerel işaret, ezberlenmiş şehir kuralından üstündür.",
        "**Dotonbori'yi akşam yemeği sanmayın.** Orada üç şey atıştırıp asıl yemeği arka sokaklarda yemek daha iyi sonuç verir.",
        "**Kushikatsu servis biçimini gözleyin.** Ortak sos varsa ısırılmış şişi geri batırmayın; kişisel kap veya sıkma şişesi varsa onu kullanın.",
        "**Osaka'yı sadece bir aktarma noktası yapmayın.** Birçok gezgin Kyoto'ya giderken Osaka'da bir gece kalıp geçiyor. Şehir en az bir tam akşam hak ediyor.",
        "**Kansai lehçesi farklıdır.** Kitaptan öğrendiğiniz Japonca burada biraz farklı duyulur; \"arigatou\" yerine \"ookini\" duyabilirsiniz. Endişelenmeyin, sizinle standart Japoncayla konuşurlar.",
      ],
    },
  ],

  places: [
    {
      name: "Endo Sushi",
      area: "Osaka Merkez Toptancı Hali",
      known: "Sabah ve öğlen servis edilen mevsimlik sushi setleri",
      why:
        "Şehir merkezindeki gösterişli sushi deneyimi yerine çalışan toptancı halinin ritminde, günün balıklarıyla hazırlanmış karışık setler için gidilir. 'Maze' setleri farklı parçaları tek siparişte karşılaştırmayı kolaylaştırır.",
      price: "Orta",
      tip: "Sabah/öğlen odaklıdır ve hal tatilleri etkileyebilir. Güncel çalışma gününü resmî siteden doğrulayın.",
    },
    {
      name: "Kushikatsu Daruma (Shinsekai ana dükkânı)",
      area: "Shinsekai",
      known: "Kushikatsu geleneğinin bilinen adreslerinden",
      why:
        "Kushikatsu'yu doğduğu semtin atmosferinde denemek için erişilebilir klasik. Sebze, et ve deniz ürünü şişlerini azar azar sipariş etmek kaplamalar sıcakken yemeyi sağlar.",
      price: "Ekonomik",
      tip: "Şubeye göre sos sunumu değişebilir. Ortak kap varsa ısırılmış şişi geri batırmayın; masadaki güncel yöntemi izleyin.",
    },
    {
      name: "Ajinoya Honten",
      area: "Namba",
      known: "Osaka usulü okonomiyaki",
      why:
        "Lahana ve hamurun karıştırıldığı Osaka stilini, personelin sac üzerinde doğru kıvama getirdiği klasik bir adreste deneyebilirsiniz. İlk kez yiyenler için pişirme sorumluluğunu personele bırakmak iyi fikirdir.",
      price: "Orta",
      tip: "Popüler ana mağazada sıra uzayabilir; işletmenin güncel rezervasyon ve sıra kurallarını kontrol edin.",
    },
    {
      name: "Takoyaki Wanaka Sennichimae",
      area: "Namba",
      known: "Dışı ince kabuklu, içi akışkan takoyaki",
      why:
        "Takoyakinin fırından çıkan kek gibi tamamen katı değil, içeride çok sıcak ve kremamsı olduğunu gösteren güvenilir uzman. Sos, tuz veya farklı üst malzemeleri küçük porsiyonlarla karşılaştırın.",
      price: "Ekonomik",
      tip: "İlk lokmada içini açıp kısa süre soğutun; taze takoyaki beklediğinizden çok daha sıcaktır.",
    },
    {
      name: "Kuromon Ichiba",
      area: "Nipponbashi",
      known: "Deniz ürünü, meyve ve hazır yemek çarşısı",
      why:
        "Restoran değil, ürün karşılaştırma ve küçük tadım rotasıdır. Sabah gezildiğinde tezgâh düzeni daha canlıdır; Osaka'nın ticaret şehri kimliğini yemek üzerinden gösterir.",
      price: "Orta",
      tip: "Belirgin biçimde turistiktir. Fiyatı ve porsiyonu görmeden sipariş vermeyin; yürürken değil tezgâhın gösterdiği yerde yiyin.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — Güney Osaka ve yemek",
      morning:
        "Kuromon Ichiba'da geç kahvaltı; tezgâh tezgâh ilerleyin, tek yerde doymayın.",
      afternoon:
        "Shinsekai ve Tsutenkaku çevresinde yürüyüş; retro sokakları gezin.",
      evening:
        "Shinsekai'de kushikatsu (sunulan sos düzenini izleyin), ardından Dotonbori'de gece yürüyüşü.",
    },
    {
      title: "2. Gün — Kale ve kuzey",
      morning:
        "Osaka Kalesi ve çevresindeki park; hendekler ve surlar boyunca yürüyün.",
      afternoon:
        "Umeda'ya geçin: yeraltı çarşıları, mağazalar, kahve molası.",
      evening:
        "Umeda Sky Building'in açık gözlem katında gün batımı, sonra bir okonomiyaki mekânında akşam yemeği.",
    },
    {
      title: "3. Gün — Kansai'ye açılın",
      morning:
        "Nara'ya günübirlik (yaklaşık 40 dk): Todai-ji ve geyik parkı.",
      afternoon:
        "Alternatif olarak Kobe: liman, sarnıç mahallesi ve et kültürü.",
      evening:
        "Osaka'ya dönüp son akşamı Namba'nın arka sokaklarında geçirin.",
    },
  ],

  practicalHeading: "Osaka'ya gitmeden bilinmesi gerekenler",
  practicalTips: [
    {
      title: "USJ uygulamasını parka gitmeden kurun",
      body:
        "Super Nintendo World zamanlı/standby girişleri 5 Ocak 2026'dan beri resmî uygulamadan alınıyor. Biletinizi önceden ekleyin; alanın biletsiz açılabileceği saatleri bonus kabul edin, plan değil.",
    },
    {
      title: "KIX trenini otelinize göre seçin",
      body:
        "Namba çevresine Nankai, Osaka/Umeda tarafına JR çoğu yolcu için daha doğal rotadır. En hızlı görünen treni değil, aktarma ve bavul yürüyüşü en az olan bağlantıyı seçin.",
    },
    {
      title: "Umeda, Osaka Station ve Shin-Osaka aynı yer değil",
      body:
        "Umeda ile JR Osaka Station aynı merkez çekirdeğindedir; Shinkansen durağı Shin-Osaka daha kuzeydedir. Haritada yalnızca 'Osaka' yazarak rota kurmak gereksiz aktarma yaratabilir.",
    },
    {
      title: "Kushikatsu kuralını servis biçimine göre okuyun",
      body:
        "Ortak sos kabı varsa ısırılmış şişi geri batırmayın. Kişisel kap veya sıkma şişesi verilen güncel düzende eski 'ikinci kez batırma' anlatısını gösteriye çevirmeden işletmenin yöntemini izleyin.",
    },
    {
      title: "Yürüyen merdivende tabelayı izleyin",
      body:
        "Osaka'nın sağda durma alışkanlığı bilinir; güncel güvenlik kampanyaları iki tarafta da sabit durmayı isteyebilir. Kalabalığı zorlamayın ve istasyon işaretini esas alın.",
    },
    {
      title: "Kuromon'u tek öğünlük tadım rotası yapın",
      body:
        "Siparişten önce görünen fiyatı ve porsiyonu kontrol edin. Her tezgahtan almak yerine iki veya üç ürüne odaklanmak, turistik fiyatlarla gereksiz harcamayı önler.",
    },
  ],

  faqs: [
    {
      q: "Osaka kaç günde gezilir?",
      a: "Şehrin kendisi için 2 tam gün yeterli. 3. günü Nara veya Kobe gibi bir günübirlik geziye ayırmak Kansai'yi çok daha verimli kullanmanızı sağlar.",
    },
    {
      q: "Osaka mı Kyoto mu daha iyi bir konaklama merkezi?",
      a: "Kansai'yi günübirliklerle gezecekseniz Osaka daha pratik ve genellikle daha uygun fiyatlı. Ama Kyoto'nun tapınakları en iyi sabah erken ve akşam geç saatlerde görülür; bu yüzden ideal kurgu her iki şehirde de konaklamaktır.",
    },
    {
      q: "Kushikatsu'da sosa neden iki kez batırılmıyor?",
      a: "Bu kural, masanın ortak sos kabını kullandığı geleneksel düzende hijyen içindir. Günümüzde birçok işletme kişisel kap veya sıkma şişesi kullanıyor. Ortak kap varsa ısırılmış şişi geri batırmayın; her durumda işletmenin sunduğu yöntemi izleyin.",
    },
    {
      q: "Osaka'da hangi semtte kalmalıyım?",
      a: "İlk ziyaretinizse Namba/Shinsaibashi: yeme-içme ve gece hayatının içindesiniz. Ulaşım ve günübirlik geziler öncelikliyse Umeda daha mantıklı. Her iki durumda da Midosuji metro hattına yakın olmaya çalışın.",
    },
    {
      q: "Kansai Havalimanı'ndan şehre nasıl gidilir?",
      a: "Tren en pratik yöntemdir. Nankai'nin en hızlı hizmeti Namba'ya yaklaşık 34 dakikada, JR bağlantısı Osaka/Umeda tarafına yaklaşık bir saatte ulaşır. Gideceğiniz semte göre şirketi seçin; Itami daha yakındır ama ağırlıklı olarak iç hatlara hizmet eder.",
    },
    {
      q: "Osaka'da yürüyen merdivende hangi tarafta durulur?",
      a: "Yerel alışkanlık geleneksel olarak sağda durmaktır, fakat güncel güvenlik kampanyaları yürüyen merdivende yürümemeyi ve iki tarafta da durmayı isteyebilir. İstasyondaki işaretleri izleyin ve geçişi zorlamayın.",
    },
  ],

  relatedGuides: [
    {
      city: "Kyoto",
      anchor: "Osaka'dan Kyoto'ya: üç günlük kültür molası",
      description:
        "Yarım saat civarı tren bağlantısı kolaydır; yine de erken ve geç saatleri yaşayabilmek için Kyoto'da konaklayın.",
    },
    {
      city: "Nara",
      anchor: "Osaka'dan Nara'ya: en kolay günübirlik rota",
      description:
        "Namba'dan direkt Kintetsu bağlantısıyla Todai-ji, geyik parkı ve Naramachi aynı güne sığar.",
    },
  ],

  sources: [
    { name: "Osaka official travel guide", url: "https://osaka-info.jp/en/" },
    { name: "Kansai Airport train access", url: "https://www.kansai-airport.or.jp/en/access/from-airport/train" },
    { name: "Endo Sushi", url: "https://www.endo-sushi.com/english.html" },
    { name: "Ajinoya", url: "https://ajinoya-okonomiyaki.com/en/" },
    { name: "Takoyaki Wanaka", url: "https://takoyaki-wanaka.com/en/" },
    { name: "Kushikatsu Daruma", url: "https://www.kushikatu-daruma.com/" },
    { name: "Universal Studios Japan — Super Nintendo World", url: "https://www.usj.co.jp/web/en/us/areas/super-nintendo-world" },
  ],

  volatileNote:
    "Restoran şubeleri, çalışma saatleri ve çarşı fiyatları değişebilir. Kansai'de JR dışında birçok özel demiryolu şirketi çalıştığı için, elinizdeki pasonun hangi hatları kapsadığını yola çıkmadan doğrulayın.",

  reviewed: "2026-08-09",
};

import { CityGuide } from "./types";

/** Bordo rehberi — Ağustos 2026 araştırması. */
export const bordo: CityGuide = {
  city: "Bordo",
  countryCode: "FR",

  seoTitle: "Bordo Gezi Rehberi: Şarap Bağları ve 4 Günlük Rota",
  seoDescription:
    "Bordo gezi rehberi: güncel havalimanı tramvayı, Cité du Vin, kalınacak semtler, Saint-Émilion ve Médoc bağları, tadım ipuçları ve 4 günlük rota.",
  h1: "Bordo Gezi Rehberi",
  lede:
    "Bordo yalnız şarap tadımı için geçilen zarif bir kent değildir; Garonne kıyısındaki 18. yüzyıl cepheleri, canlı pazarları ve dönüşen liman mahalleleri bağ coğrafyasını anlamlı kılan güçlü bir şehir deneyimi kurar.",

  quickFacts: [
    { label: "Önerilen süre", value: "3–4 tam gün" },
    { label: "Havalimanı", value: "BOD · tramvay F" },
    { label: "Şehir içi", value: "TBM tramvay + yürüyüş + Bat³" },
    { label: "Şarap günü", value: "Saint-Émilion · Médoc · Graves" },
    { label: "Yerel tat", value: "Canelé + Capucins + istiridye" },
  ],

  sections: [
    {
      heading: "Bordo gezisi nasıl planlanır? Şehir ile bağ gününü ayırın",
      id: "gezi-planlama",
      body: [
        "Bordo merkezini iki günde, Cité du Vin ve dönüşen kuzey kıyısını üçüncü günde gezebilirsiniz; Saint-Émilion, Médoc veya Graves için ayrıca tam gün gerekir. Place de la Bourse–Saint-Pierre; Hôtel de Ville–Triangle d'Or; Saint-Michel–Capucins; Chartrons–Bacalan kümeleri aktarmayı azaltır.",
        "Şarap üreticisi ziyareti, kapıdan girip bardak alınan serbest bir rota değildir. Çoğu château yalnız rezervasyonlu ve belirli dil/saatte tur verir; iki farklı apelasyonu aynı günde kovalamak yolda zaman kaybettirir. Üretim hikâyesi için iki château yeterlidir. Tadım yapacaksanız sürmeyin; tur, şoför veya tren–yerel transfer kullanın.",
        "Hasat dönemi romantik görünür fakat bazı işletmeler ziyaret kapasitesini azaltabilir; büyük şarap fuarı ve rugby/konser haftalarında konaklama hızla dolar. Yağmurlu günde Cité du Vin, Bassins des Lumières veya Musée d'Aquitaine seçeneği tutun; üçünü aynı gün kapalı alan maratonuna çevirmeyin.",
      ],
    },
    {
      heading: "Bordo Havalimanı'ndan merkeze: artık tramvay F",
      id: "havalimani-ulasimi",
      body: [
        "Eski rehberler havalimanından **tramvay A** yazabilir; bu bilgi güncel değildir. **6 Aralık 2025'ten beri F hattı**, Bordeaux Havalimanı'nı Hôtel de Ville üzerinden Bordeaux Saint-Jean istasyonuna bağlar. Otelinizin durağını ve o günkü çalışma/bakım bilgisini TBM ile havalimanının resmî sayfasından kontrol edin.",
        "F hattı şehir merkezinden geçerek ana istasyona kadar gider; yoğun saatte valizle kalabalık olabilir. Çok erken veya geç uçuşta resmî havaalanı otobüsü/taksi seçeneklerini güncel saat ve toplam kişi sayısıyla karşılaştırın. Uygulama aracının buluşma bölgesini terminal tabelasından bulun.",
        "Bordeaux Saint-Jean, tarihî merkezin güneyindedir. Trenden iner inmez otele yürümek her adres için iyi fikir değildir; tramvay C, D veya F bağlantısını kullanın. Paris bileti **Bordeaux Saint-Jean**, havalimanı durağı ise **Aéroport** olarak geçer; aynı istasyon değildir.",
      ],
    },
    {
      heading: "Bordo toplu taşıması: TBM biletleri, doğrulama ve CityPass",
      id: "toplu-tasima",
      body: [
        "TBM ağı tramvay, otobüs ve Garonne üzerindeki **Bat³** nehir servislerini kapsar. Bilet veya kartı makine, satış noktası ya da uyumlu uygulamadan hazırlayın; her binişte ve aktarmada yeniden doğrulayın. Banka kartının her doğrulayıcıda otomatik bilet olduğunu varsaymayın; güncel açık ödeme kapsamını TBM'den kontrol edin.",
        "Tarihî merkez büyük ölçüde yürünebilir, tramvay Cité du Vin, Bacalan, Saint-Jean ve uzak konaklama için değerlidir. Bisiklet düz şehirde kullanışlıdır; tramvay raylarını dar açıyla kesmeyin, yaya bölgesinde hız düşürün. Nehir teknesi ulaşım aracıdır; turistik gezi teknesinin anlatım veya rotasını beklemeyin.",
        "Bordeaux CityPass, süreye göre sınırsız TBM, Cité du Vin, müzeler ve seçili tur/deneyimleri birleştirebilir. Fiziksel/dijital kullanım, ilk doğrulama ve rezervasyon kuralını okuyun. Saint-Émilion'a tren ulaşımını otomatik kapsamaz; oradaki seçili ziyaret dâhil olsa bile gidiş–dönüşünüz ayrıdır.",
      ],
    },
    {
      heading: "Tarihî merkez, Miroir d'eau ve Garonne kıyısı",
      id: "tarihi-merkez",
      body: [
        "Place de la Bourse ile **Miroir d'eau** Bordo'nun simgesidir; su aynası bakım, kış sezonu veya etkinlik nedeniyle çalışmayabilir. Görmeyi tek saate bağlamayın. Garonne kıyısından Porte Cailhau, Saint-Pierre sokakları ve Grand Théâtre yönüne yürümek 18. yüzyıl cepheleriyle Orta Çağ kapılarını birlikte okutur.",
        "Rue Sainte-Catherine uzun alışveriş aksıdır, şehrin tamamı değildir. Paralel sokaklar, Passage Sarget, Triangle d'Or ve Jardin Public daha sakin bir Bordo gösterir. Pey-Berland kulesi için saatli erişim gerekebilir; dar merdiven ve manzara isteyenler güncel bileti önceden kontrol etsin.",
        "Saint-Michel Bazilikası, Flèche ve Capucins çevresi daha çok kültürlü ve hareketlidir. Pazar sabahı iyi zaman; gece bar çıkışında sokak ritmi değişir. Tek bir güvenlik etiketi yerine otelin blok, ses ve tramvay dönüş yorumuna bakın.",
      ],
    },
    {
      heading: "Cité du Vin, Chartrons ve Bacalan",
      id: "cite-du-vin",
      body: [
        "**Cité du Vin** yalnız Bordeaux şaraplarını tanıtan mahzen değil, dünya şarap kültürünü tarih, coğrafya, duyular ve ticaret üzerinden anlatan büyük bir müzedir. Kalıcı sergiye en az iki–üç saat ayırın; güncel bilete belvedere tadımının dahil olup olmadığını okuyun. Tadım tek küçük ölçüdür, bağ turu yerine geçmez.",
        "Chartrons eski şarap tüccarı depoları, antikacılar, pazar ve kafelerle merkez ile Cité du Vin arasında doğal geçiştir. Quai boyunca yürüyebilir veya tramvay kullanabilirsiniz. Musée du Vin et du Négoce daha küçük ve Bordeaux'nun ticaret tarihine odaklı alternatif sunar; iki şarap müzesini aynı güne koymak tekrar yaratabilir.",
        "Bacalan'daki Bassins des Lumières eski denizaltı üssünde projeksiyon sergisidir; eserlerin asıllarını göreceğiniz klasik müze değildir. Program, giriş saati ve ulaşımı doğrulayın. Halles de Bacalan, Cité du Vin karşısında hızlı öğle için uygundur ama her tezgâhın açık saati aynı değildir.",
      ],
    },
    {
      heading: "Bordo'da nerede kalınır? Saint-Pierre, Chartrons ve istasyon",
      id: "nerede-kalinir",
      body: [
        "**Saint-Pierre** anıt, restoran ve gece hayatının ortasındadır; dar sokak sesi ve hafta sonu kalabalığı taşır. **Triangle d'Or** zarif, merkezî ve pahalıdır. **Chartrons**, yürünebilirlik, yerel kafe ve daha sakin gece arasında en dengeli seçeneklerden biridir; Cité du Vin yönüne de yakındır.",
        "**Saint-Michel/Capucins** pazar ve çok kültürlü yemek için canlı, gece blok bazında gürültülüdür. **Gare Saint-Jean** erken tren ve bütçe için işlevsel, anıtlara günlük tramvay gerektirir. **Bastide**, nehrin doğusunda daha sakin ve manzaralı olabilir; son Bat³ yerine tramvay/otobüs dönüşünü de planlayın.",
        "Tarihî binada klima ve asansör standart olmayabilir; yaz sıcak dalgasında ikisini açıkça sorun. Merkezi yaya sokağında taksi kapıya ulaşamayabilir. Taxe de séjour tesis sınıfına göre ayrıca tahsil edilebilir.",
      ],
    },
    {
      heading: "Bordo'da ne yenir? Canelé, pazar ve şarap eşleşmesi",
      id: "ne-yenir",
      body: [
        "**Canelé**, koyu karamelize kabuk ve rom–vanilya kokulu yumuşak iç dengesidir; farklı fırınları küçük boyla karşılaştırın. Dunes blanches, krema dolgulu choux hamuruyla yakın Cap-Ferret kökenli çağdaş bir tatlıdır. Sırf kutusu güzel diye havalimanından almak yerine şehirde taze deneyin.",
        "Entrecôte à la bordelaise, şarap/şalot sosu; lamproie à la bordelaise mevsimsel ve yoğun nehir balığı yemeğidir. Capucins pazarında Arcachon havzası istiridyesi, peynir, ördek ve şarküteri bulunur. Çiğ kabuklu deniz ürününde soğuk zincir ve kişisel sağlık riskini dikkate alın.",
        "Bordo şarabı tek tat değildir: Médoc cabernet ağırlığı, Saint-Émilion/Pomerol merlot karakteri, Graves/Pessac-Léognan kırmızı–beyazları ve Sauternes tatlı şarabı farklıdır. Restoranda kadehle bölge karşılaştırın; pahalı etiket otomatik olarak yemeğe en iyi eşleşme değildir. Servis fiyata dahil, bahşiş isteğe bağlıdır.",
      ],
    },
    {
      heading: "Saint-Émilion ve Médoc bağlarına günübirlik gezi",
      id: "bag-gezileri",
      body: [
        "Saint-Émilion'a Bordeaux Saint-Jean'dan TER ile gidilebilir; istasyon köy merkezinden yaklaşık 1,5 kilometre uzakta ve merkez yönü yokuşludur. Mevsimsel servis/taksi olup olmadığını turizm ofisinden kontrol edin. Yeraltı anıtları yalnız rehberli ziyaretle görülebilir ve château tadımları rezervasyon ister; trenden inip her yere spontane girme planı kurmayın.",
        "Médoc şatoları geniş bir alana dağılır ve toplu taşıma sınırlıdır. Yarım veya tam günlük küçük grup turu, sürüş–tadım çatışmasını çözer; hangi apelasyon ve kaç château olduğu kadar tadım dilini de sorun. Araç kiralarsanız bir kişi hiç alkol almamalı ve her üreticinin park/giriş talimatına uymalıdır.",
        "Arcachon ve Dune du Pilat şarap gününden farklı bir Atlantik rotasıdır. Trenle Arcachon'a ulaştıktan sonra kumula son bağlantı mevsimsel olabilir. Aynı güne Saint-Émilion ile kumulu koymayın; coğrafi olarak ters yönler ve ayrı deneyimlerdir.",
      ],
    },
  ],

  places: [
    { name: "La Tupina", area: "Porte de la Monnaie", known: "Güneybatı Fransa mutfağı ve açık ateş", why: "Ördek yağı, mevsim sebzesi ve şömine ateşinde pişen etlerle bölgesel mutfağın rustik, cömert tarafını deneyimletir.", price: "Yüksek", tip: "Porsiyonlar güçlüdür; rezervasyon yapın, başlangıçları paylaşın ve güncel menü fiyatını kontrol edin." },
    { name: "Symbiose", area: "Quai des Chartrons", known: "Çağdaş paylaşım tabakları ve kokteyl", why: "Bordo'yu yalnız ağır geleneksel yemek olarak görmeyip aromatik otlar, modern teknik ve canlı bar kültürüyle karşılaştırmak için gidilir.", price: "Orta", tip: "Bar ve restoran düzenini rezervasyonda ayırın; küçük salonda yer için önceden plan yapın." },
    { name: "Tentazioni", area: "Palais Gallien", known: "İtalyan dokunuşlu modern tadım menüsü", why: "Şehrin üst düzey çağdaş yemek sahnesini haftalık değişen, ürün odaklı bir menüyle görmek isteyenler için özel akşam seçeneğidir.", price: "Yüksek", tip: "Tadım süresi ve diyet talebini önceden konuşun; rezervasyonsuz gitmeyin." },
    { name: "Marché des Capucins", area: "Saint-Michel", known: "İstiridye, peynir ve pazar öğleleri", why: "Bordo ile çevre Atlantik ürünlerini tek çatı altında, yerel hafta sonu ritmi içinde ekonomik biçimde karşılaştırır.", price: "Ekonomik", tip: "Erken gidin; tezgâh saatleri farklıdır ve yoğun öğlende oturma yeri sınırlıdır." },
    { name: "Le Noailles", area: "Triangle d'Or", known: "Klasik brasserie", why: "Merkezî bir salonda deniz ürünü, soğan çorbası ve brasserie tabaklarıyla zamansız şehir yemeği isteyenlere uygundur.", price: "Orta", tip: "Etkinlik akşamlarında rezervasyon yapın; günlük deniz ürünü ve servis saatini sorun." },
    { name: "La Toque Cuivrée", area: "Merkezde çeşitli şubeler", known: "Canelé", why: "Küçük boy canelé ile koyu kabuk–yumuşak iç dengesini bütçeyi zorlamadan denemek ve taşımalık almak için pratiktir.", price: "Ekonomik", tip: "Birden fazla şube vardır; tazelik için gün içinde küçük miktar alın, kutuyu sıcakta bekletmeyin." },
  ],

  itinerary: [
    { title: "1. Gün — Tarihî merkez ve Garonne", morning: "Pey-Berland çevresi, katedral ve Rue Sainte-Catherine'in yan sokakları.", afternoon: "Porte Cailhau, Saint-Pierre, Place de la Bourse ve çalışıyorsa Miroir d'eau.", evening: "Garonne gün batımı; Saint-Pierre veya Triangle d'Or'da rezervasyonlu yemek." },
    { title: "2. Gün — Chartrons ve Cité du Vin", morning: "Jardin Public ve Chartrons antikacı/kafe sokakları.", afternoon: "Cité du Vin kalıcı sergisi ve bilete dahilse belvedere tadımı; Bacalan çevresi.", evening: "Bat³ veya tramvayla merkeze dönüş, Chartrons'da çağdaş sofra." },
    { title: "3. Gün — Pazar ve sağ kıyı", morning: "Marché des Capucins'de istiridye veya yerel ürünlü erken öğle.", afternoon: "Saint-Michel, Darwin Ecosystème ve Bastide kıyısından şehir manzarası.", evening: "Merkezde şarap barı; kadehle iki apelasyon karşılaştırın ve ölçülü için." },
    { title: "4. Gün — Saint-Émilion veya Médoc", morning: "Rezervasyonlu TER + köy turu ya da sürücülü Médoc turuyla erken hareket.", afternoon: "En fazla iki château/üretici ve acele etmeyen tadım; su ile öğle yemeğini atlamayın.", evening: "Bordo'ya dönüş; erken tren/uçuş varsa F hattı veya istasyon planını kontrol edin." },
  ],

  practicalHeading: "Bordo'da eski rehber hatalarını önleyen güncel bilgiler",
  practicalTips: [
    { title: "Havalimanı hattı artık F", body: "6 Aralık 2025'ten beri F tramvayı havalimanı–Hôtel de Ville–Saint-Jean bağlantısını kurar; A hattı yazan eski içeriğe güvenmeyin." },
    { title: "TBM'de her aktarmayı doğrulayın", body: "Aynı bilet süresi içinde olsa bile tramvay, otobüs veya Bat³ binişinde kartı yeniden okutun." },
    { title: "CityPass bağ ulaşımı değildir", body: "Cité du Vin ve şehir ulaşımı dahil olabilir; Saint-Émilion trenini veya château transferini otomatik kapsamaz." },
    { title: "Saint-Émilion istasyonu köyün altında", body: "Merkeze yaklaşık 1,5 kilometrelik yokuş vardır. Servis/taksi ve dönüş trenini önceden çözün." },
    { title: "Château ziyareti rezervasyon ister", body: "Kapıya gidip ücretsiz tadım beklemeyin; saat, dil, ücret ve ulaşımı doğrudan üreticiyle doğrulayın." },
    { title: "Tadım sonrası araç kullanmayın", body: "Küçük ölçüler birikir. Tur, sürücü veya tren kullanın; kiralık bisiklet de alkol sonrası güvenli çözüm değildir." },
  ],

  faqs: [
    { q: "Bordo için kaç gün gerekir?", a: "Şehir için 2–3 gün, Saint-Émilion veya Médoc bağ günüyle 4 gün idealdir. Arcachon eklemek için bir gün daha ayırın." },
    { q: "Bordo Havalimanı'ndan merkeze nasıl gidilir?", a: "Güncel bağlantı tramvay F'dir; Hôtel de Ville üzerinden Saint-Jean'a gider. Eski A hattı bilgisini kullanmayın ve bakım duyurusunu kontrol edin." },
    { q: "Saint-Émilion'a trenle gidilir mi?", a: "Evet, Saint-Jean'dan TER vardır. İstasyon köyden yaklaşık 1,5 kilometre uzakta ve yokuş aşağıdadır; château ile yeraltı turunu önceden ayırın." },
    { q: "Bordo'da araba gerekir mi?", a: "Şehir merkezinde hayır. Médoc gibi dağınık bağlarda araç işe yarar; tadım yapacaksanız sürücülü tur daha güvenlidir." },
    { q: "Bordo CityPass almaya değer mi?", a: "Cité du Vin, birkaç müze/tur ve yoğun TBM kullanacaksanız değerli olabilir. Geçerlilik ve rezervasyon kapsamını tek bilet toplamıyla karşılaştırın." },
    { q: "Bordo'da hangi semtte kalınır?", a: "Chartrons dengeli, Saint-Pierre merkezî ve gürültülü, Triangle d'Or zarif ve pahalıdır. Saint-Michel yemek/pazar, Saint-Jean erken tren için pratiktir." },
  ],

  relatedGuides: [
    { city: "Paris", anchor: "Bordo'dan Paris'e: TGV ile başkente", description: "Saint-Jean'dan hızlı trenle şarap ve Garonne rotasını müze, mahalle ve Seine günleriyle birleştirin." },
    { city: "Nice", anchor: "Bordo ile Nice: Atlantik'ten Riviera'ya", description: "Uzak iki kıyıyı aktarmalı tren veya uçuşla bağlayın; kısa tatilde ikisini aynı rotaya sıkıştırmayın." },
    { city: "Lyon", anchor: "Bordo–Lyon rotası: şarap ve gastronomi", description: "Bağ kültüründen bouchon sofralarına geçerken uzun tren bağlantısını ayrı seyahat günü olarak planlayın." },
    { city: "Marsilya", anchor: "Bordo'dan Marsilya'ya: iki liman kültürü", description: "Garonne ve Atlantik ürünlerinden Vieux-Port, Noailles ve Calanques'ın Akdeniz dünyasına uzanın." },
    { city: "Strazburg", anchor: "Bordo'dan Strazburg'a: batıdan Alsace'a", description: "Fransa'nın iki farklı şarap coğrafyasını uzun tren/uçuş ayağıyla bağlayıp üzüm kadar tarih ve mutfağı karşılaştırın." },
  ],

  sources: [
    { name: "Bordeaux Airport — tramvay F", url: "https://www.bordeaux.aeroport.fr/en/tram" },
    { name: "TBM — bilet satın alma ve ağ", url: "https://www.infotbm.com/en/where-buy-your-ticket.html" },
    { name: "Bordeaux Tourism — CityPass", url: "https://www.visiter-bordeaux.com/en/bordeaux-citypass.html" },
    { name: "La Cité du Vin — ziyaret", url: "https://www.laciteduvin.com/en/plan-your-visit" },
    { name: "Saint-Émilion Tourism — resmî rehber", url: "https://www.saint-emilion-tourisme.com/en/" },
    { name: "Bordeaux Tourism — resmî şehir sitesi", url: "https://www.bordeaux-tourism.co.uk/" },
  ],
  volatileNote: "Tramvay F/TBM hizmeti, Miroir d'eau, CityPass kapsamı, château ziyaretleri, bağ transferleri ve restoran saatleri değişebilir. Resmî kanalı seyahat tarihinde doğrulayın.",
  reviewed: "2026-08-10",
};

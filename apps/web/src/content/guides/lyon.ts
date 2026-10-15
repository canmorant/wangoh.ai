import { CityGuide } from "./types";

/** Lyon rehberi — Ağustos 2026 araştırması. */
export const lyon: CityGuide = {
  city: "Lyon",
  countryCode: "FR",

  seoTitle: "Lyon Gezi Rehberi: Ulaşım, Yemek ve 3 Günlük Rota",
  seoDescription:
    "Lyon gezi rehberi: havalimanı ulaşımı, bouchon restoranları, kalınacak semtler, traboule geçitleri, güncel bilet bilgileri ve 3 günlük gezi planı.",
  h1: "Lyon Gezi Rehberi",
  lede:
    "Lyon'u yalnız 'Fransa'nın gastronomi başkenti' etiketiyle okumak eksik kalır; Rhône ile Saône arasındaki kent, Roma tiyatrolarından ipek işçilerinin geçitlerine ve çağdaş Confluence'a yürüyerek açılan katmanlı bir şehir molasıdır.",

  quickFacts: [
    { label: "Önerilen süre", value: "2–3 tam gün" },
    { label: "Havalimanı", value: "LYS · Rhônexpress" },
    { label: "Şehir içi", value: "TCL metro + tramvay + füniküler" },
    { label: "Yokuşlar", value: "Fourvière · Croix-Rousse" },
    { label: "Yerel sofra", value: "Bouchon + Halles Paul Bocuse" },
  ],

  sections: [
    {
      heading: "Lyon gezisi nasıl planlanır? İki nehir, iki tepe, dört mahalle",
      id: "gezi-planlama",
      body: [
        "Lyon'un ana coğrafyası basittir: Saône'un batısında Vieux Lyon ve Fourvière; iki nehir arasında Presqu'île; kuzeyde Croix-Rousse; Rhône'un doğusunda Part-Dieu ve yaşayan mahalleler. İlk gün Presqu'île–Vieux Lyon, ikinci gün Fourvière–Croix-Rousse, üçüncü gün Les Halles–Parc de la Tête d'Or veya Confluence kümeleri iyi çalışır.",
        "İki gün merkez simgelerine, üç gün yemek kültürü ile çağdaş bölgelere yeter. Lyon'u Paris–Nice tren rotasında yalnız bir gece konaklaması yapmak mümkün; ancak akşam bouchon, sabah pazar ve tepeler için en az iki gece bırakmak şehrin güçlü yanlarını görünür kılar. Aralık Işık Festivali döneminde ulaşım ve konaklama normal hafta düzeninden tamamen farklıdır.",
        "Rhône ve Saône kıyıları yürüyüş için düz; Fourvière ile Croix-Rousse yokuşludur. Füniküler veya metro ile yukarı çıkıp aşağı yürümek enerji kazandırır. Eski şehir taşları yağmurda kaygan olabilir; restoran şıklığından önce rahat tabanlı ayakkabı seçin.",
      ],
    },
    {
      heading: "Lyon Havalimanı'ndan merkeze: Rhônexpress ve alternatifler",
      id: "havalimani-ulasimi",
      body: [
        "Lyon–Saint Exupéry Havalimanı'ndan **Rhônexpress**, Part-Dieu Villette tarafına yarım saatten kısa sürede giden özel havaalanı tramvayıdır. Vaulx-en-Velin La Soie ve Meyzieu Z.I. durakları bazı oteller için aktarma sağlar. Koltuk rezervasyonu gerekmez; bileti resmî siteden, makineden veya koşullar uygunsa görevli kanaldan alın ve dönüş ürününün süresini okuyun.",
        "Rhônexpress, normal TCL şehir tramvayı değildir. Standart TCL biletiyle havalimanına gidildiğini varsaymayın; Lyon City Card'ın yalnız bazı sürümlerinde havaalanı transferi bulunabilir. Part-Dieu büyük ve çok çıkışlıdır: Rhônexpress peronu **Villette** cephesindedir, tren biletinizdeki salon/peronla aynı taraf olmayabilir.",
        "Grup veya gece varışında taksi/uygulama aracı toplam fiyat açısından yarışabilir; resmî buluşma noktasını izleyin. Uzun mesafe TGV ile doğrudan havalimanı istasyonuna geliyorsanız Part-Dieu'ya uğramanız gerekmeyebilir; bilette **Lyon Saint-Exupéry TGV** ile **Lyon Part-Dieu** adlarını karıştırmayın.",
      ],
    },
    {
      heading: "Lyon toplu taşıması: TCL'de temassız ödeme ve füniküler",
      id: "toplu-tasima",
      body: [
        "TCL ağında metro, tramvay, otobüs ve füniküler birbirini tamamlar. Bölge 1–2'de uyumlu temassız banka kartı veya telefon çoğu araçta bilet olarak kullanılabilir; her binişte aynı ödeme aracını doğrulayın. Fiziksel kart ile onun telefon cüzdanı sürümü sistemde farklı araç sayılabilir. Banka provizyonunun daha sonra toplu görünmesi yeni bilet alındığı anlamına gelmez.",
        "TCL'nin resmî kuralı uygun doğrulayıcıda aynı banka kartıyla kısa aralıkta birden fazla yolcu eklemeye izin verebilir; grup sayısı ve süre şartını güncel belgede okuyun. Karmaşık geliyorsa her yolcu ayrı kart veya bilet kullansın. Günlük tavan ve aktarma düzeni yalnız doğru kartı her seferinde kullanırsanız işler; Rhônexpress bu kapsama girmez.",
        "Fourvière ve Saint-Just fünikülerleri TCL ağındadır. Bakım döneminde otobüs ikamesi olabilir; tepede akşam kalacaksanız son seferi kontrol edin. Vieux Lyon–Cathédrale Saint-Jean metro/füniküler düğümü hafta sonu kalabalıklaşır; sabah yukarı çıkıp Roma tiyatrolarından eski şehre yürümek daha sakindir.",
      ],
    },
    {
      heading: "Vieux Lyon, Fourvière ve traboule geçitleri",
      id: "vieux-lyon-traboules",
      body: [
        "Vieux Lyon, Saint-Jean, Saint-Paul ve Saint-Georges bölümlerinden oluşur. Katedralden tek alışveriş sokağına takılmak yerine Saône kıyısı, küçük meydanlar ve Rönesans avlularını birlikte görün. Fourvière Bazilikası'nın terası şehir coğrafyasını anlamak için iyi başlangıç, yakındaki Roma tiyatroları ise Lyon'un antik Lugdunum katmanını gösterir.",
        "**Traboule**, bina içinden sokakları veya avluları birbirine bağlayan tarihî geçittir. Bir kısmı kamu geçiş anlaşmasıyla gündüz açıktır, bir kısmı özel konuttur. Kapıyı zorlamayın, yüksek sesle konuşmayın ve avluyu fotoğraf stüdyosuna çevirmeyin. Turizm ofisinin işaretli rota veya rehberli turu, rastgele kapı kodu paylaşan sosyal medya listesinden daha saygılıdır.",
        "Croix-Rousse'daki traboule'ler ipek işçileri **canut** tarihine bağlanır; Vieux Lyon'dakilerle aynı dönemin dekoru değildir. Maison des Canuts veya duvar resimleriyle birlikte gezmek semti yalnız renkli merdivenlerden çıkarır. Yukarı metro ile çıkıp Presqu'île'a doğru yavaşça inin.",
      ],
    },
    {
      heading: "Presqu'île, Les Halles ve çağdaş Lyon",
      id: "presquile-ve-cagdas",
      body: [
        "Presqu'île'da Place Bellecour, Rue de la République ve Hôtel de Ville ana eksendir; asıl karakter yan sokak, pasaj ve Saône kıyısında belirir. Musée des Beaux-Arts büyük bir koleksiyondur ve yağmurlu yarım gün için uygundur. Place des Terreaux'daki etkinlik veya bakım alanını güncel şehir sayfasından kontrol edin.",
        "Les Halles de Lyon Paul Bocuse, sıradan ucuz pazar değil; peynir, şarküteri, deniz ürünü, quenelle ve tatlı üreticilerini bir araya getiren premium kapalı gastronomi merkezidir. Öğle öncesi gidin, tek tezgâhta büyük öğün yerine birkaç ürünü paylaşın. Pazarın tüm dükkânları aynı gün/saat açık olmayabilir.",
        "Confluence eski sanayi alanının çağdaş mimari, alışveriş ve müzeyle dönüşümünü gösterir; vaporetto veya tramvay koşullarını kontrol edin. Parc de la Tête d'Or ise göl, botanik bahçe ve geniş yürüyüşle ücretsiz nefes alanıdır. Kısa gezide ikisini aynı öğleden sonraya yığmak yerine mimari ya da yeşil alan tercih edin.",
      ],
    },
    {
      heading: "Lyon'da nerede kalınır? Presqu'île mı, Part-Dieu mu?",
      id: "nerede-kalinir",
      body: [
        "**Presqu'île**, ilk ziyaret için yürüyüş, restoran ve iki nehir arasında en dengeli üsdür; Bellecour çevresi merkezî, Terreaux tarafı gece daha canlıdır. **Vieux Lyon** romantik ve tarihî, ama turist kalabalığı, geç saat sesi, eski binada asansör eksikliği ve taş sokakta valiz açısından zordur.",
        "**Croix-Rousse** mahalle hissi ve pazar için güçlü, eğim ve merkez dönüşü açısından daha zahmetlidir. **Part-Dieu**, erken tren veya Rhônexpress için işlevsel, şehrin atmosferi için daha kurumsaldır; istasyonun Villette ve Vivier-Merle cephelerini karıştırmayın. **Guillotière** çok kültürlü yemek ve merkez erişimi sunar, blok bazında gece ritmi değişir.",
        "**Confluence** modern otel ve sakin gece isteyenlere uygundur fakat Vieux Lyon'a her gün ulaşım gerekir. Odanın klima durumunu yazın özellikle sorun; tarihî binalarda standart olmayabilir. Taxe de séjour rezervasyon toplamına ayrıca eklenebilir.",
      ],
    },
    {
      heading: "Lyon'da ne yenir? Bouchon seçme rehberi",
      id: "ne-yenir",
      body: [
        "Lyon mutfağı hafif değildir: quenelle de brochet, salade lyonnaise, saucisson brioché, tablier de sapeur, andouillette ve cervelle de canut farklı doku ve sakatat gelenekleri taşır. Adını bilmeden sipariş etmek yerine garsona içerik sorun. Porsiyon paylaşmak, başlangıç–ana yemek–peynir/tatlı düzenini daha rahat deneyimletir.",
        "Her kırmızı kareli masa örtüsü gerçek **bouchon** değildir. Turizm ofisi ve yerel meslek kuruluşunun **Les Bouchons Lyonnais** kalite etiketli güncel listesini kontrol edin. Etiket tek doğru adres demek değildir ama ev yapımı yerel mutfak, karşılama ve ürün standardı için kullanışlı filtredir. Popüler küçük salonlarda özellikle cuma–cumartesi rezervasyon yapın.",
        "Tarte à la praline parlak pembe ve yoğun tatlıdır; coussin de Lyon ile bugne başka yerel tatlardır. Sabah **mâchon** geleneği eskiden ipek işçilerinin güçlü erken öğününe dayanır ve bugün belirli adres/etkinliklerde yaşar; her kafede bulunacağını varsaymayın. Beaujolais ile Côte du Rhône şaraplarını yalnız bölge adına göre değil yemekle eşleştirerek deneyin.",
      ],
    },
    {
      heading: "Lyon'dan günübirlik gezi ve otomobil kararı",
      id: "gunubirlik-ve-arac",
      body: [
        "Pérouges, taş sokaklı Orta Çağ kasabası olarak popülerdir; tren istasyonu Meximieux–Pérouges'ten eski merkeze yürüyüş gerekir. Yağmurda taş zemin kaygan, yoğun hafta sonunda restoranlar dolu olabilir. Yarım günlük fotoğraf molası yerine öğle yemeği ve sur çevresi için zaman bırakın.",
        "Beaujolais köyleri ve bağları toplu taşımayla parçalıdır; tadım için rehberli tur veya sürücülü çözüm daha güvenlidir. Araç kiralayacaksanız alkol, park ve düşük emisyon bölgesini birlikte planlayın. Lyon merkezine otomobille girmek geziyi kolaylaştırmaz; ZFE/Crit'Air kuralını güncel resmî haritadan kontrol edin.",
        "Annecy haritada cazip görünür ama hafta sonu trafik ve bağlantı süresi onu uzun bir güne çevirebilir. Üç günlük Lyon gezisinde şehri eksiltmek yerine Pérouges veya yalnız şehir içinde kalmak daha tutarlıdır; daha uzun Alp rotasında Annecy'yi ayrı konaklama yapın.",
      ],
    },
  ],

  places: [
    { name: "Daniel et Denise", area: "Part-Dieu / Créqui", known: "Etiketli bouchon ve klasik Lyon mutfağı", why: "Quenelle, pâté en croûte ve mevsimlik terroir tabaklarını güçlü teknikle, geleneksel çerçevede denemek için güvenilir bir referanstır.", price: "Orta", tip: "Yaz tatili ve hafta sonu kapanışı olabilir; doğrudan rezervasyon yapıp doğru şubeyi kontrol edin." },
    { name: "Café Comptoir Abel", area: "Ainay", known: "Tarihî bistro ve poularde", why: "Ahşap, ayna ve eski eşyalı salonda Lyon bistro geleneğinin atmosferini klasik, doyurucu yemeklerle birlikte yaşatır.", price: "Orta", tip: "Salon popülerdir; rezervasyon yapın ve özel yemeğin hazırlık süresini sorun." },
    { name: "Daniel et Denise Saint-Jean", area: "Vieux Lyon", known: "Eski şehirde etiketli bouchon", why: "Turistik Vieux Lyon içinde kalite etiketi taşıyan bir adreste geleneksel mutfağa ulaşmak isteyenler için pratiktir.", price: "Orta", tip: "Créqui şubesiyle karıştırmayın; bilet veya rezervasyondaki adresi doğrulayın." },
    { name: "Café du Jura", area: "Presqu'île", known: "Aile tipi Lyon yemekleri", why: "Küçük, gösterişsiz ortamda günlük klasikler ve bouchon ritmini deneyimlemek için yerel karakteri güçlü bir seçenektir.", price: "Orta", tip: "Açılış günleri sınırlı olabilir; telefonla veya resmî kanaldan rezervasyonu doğrulayın." },
    { name: "Les Halles de Lyon Paul Bocuse", area: "Part-Dieu", known: "Peynir, şarküteri, deniz ürünü ve tatlı", why: "Tek masaya bağlı kalmadan Lyon ile çevre terroir ürünlerini aynı çatı altında karşılaştırmak için gidilir.", price: "Yüksek", tip: "Sabah sonu–öğle başı en canlı zamandır; tezgâhların bireysel çalışma saatlerini kontrol edin." },
    { name: "Le Kitchen Café", area: "Guillotière", known: "Mevsimsel çağdaş bistro ve tatlı", why: "Lyon'un gastronomisini yalnız ağır klasiklerden ibaret görmeyip yaratıcı, ürün odaklı modern yüzünü tatmak için iyi karşıtlık sağlar.", price: "Orta", tip: "Servis ve rezervasyon düzeni değişebilir; güncel menüyü ve açık günü kontrol edin." },
  ],

  itinerary: [
    { title: "1. Gün — Presqu'île ve Vieux Lyon", morning: "Bellecour'dan Saône kıyısına, Saint-Jean ve işaretli traboule rotasına yürüyün.", afternoon: "Vieux Lyon sokakları, katedral ve isteğe göre Miniature/Cinema ya da tarih müzesi.", evening: "Ainay veya Vieux Lyon'da rezervasyonlu bouchon; menü içeriğini sorarak sipariş verin." },
    { title: "2. Gün — Fourvière ve Croix-Rousse", morning: "Fünikülerle Fourvière, bazilika terası ve Roma tiyatroları; eski şehre yürüyerek iniş.", afternoon: "Metro ile Croix-Rousse, canut tarihi, duvar resimleri ve saygılı traboule yürüyüşü.", evening: "Presqu'île'da nehir kıyısı ve küçük tabaklar; son ulaşımı kontrol edin." },
    { title: "3. Gün — Pazar ve çağdaş şehir", morning: "Les Halles Paul Bocuse'da ürün tadımı; ardından Parc de la Tête d'Or.", afternoon: "İlginize göre Musée des Confluences ve modern mahalle ya da Musée des Beaux-Arts.", evening: "Guillotière'de çağdaş yemek veya Saône kıyısında son yürüyüş." },
  ],

  practicalHeading: "Lyon'da ulaşım ve sofrayı kolaylaştıran bilgiler",
  practicalTips: [
    { title: "Rhônexpress TCL bileti değildir", body: "Havalimanı hattı özel tarifelidir. Lyon City Card alıyorsanız Rhônexpress dâhil sürümü seçtiğinizi açıkça doğrulayın." },
    { title: "Part-Dieu'nun doğru cephesine gidin", body: "Rhônexpress Villette tarafındadır; tren peronu veya otel çıkışı diğer cephede olabilir. Aktarmaya yürüme payı ekleyin." },
    { title: "Temassızda aynı aracı kullanın", body: "Fiziksel kart ile telefon cüzdanını karıştırmayın ve her binişte doğrulayın; Rhônexpress'i ayrı tutun." },
    { title: "Traboule özel alan olabilir", body: "Yalnız işaretli ve açık geçitleri kullanın; kapıyı zorlamayın, avluda sessiz olun." },
    { title: "Bouchon etiketini kontrol edin", body: "Les Bouchons Lyonnais güncel listesi, turistik taklitleri elemek için yararlı bir ilk filtredir." },
    { title: "ZFE'ye etiketsiz girmeyin", body: "Merkez için araç almayın; gerekiyorsa Lyon'un güncel düşük emisyon bölgesi ve Crit'Air kuralını kontrol edin." },
  ],

  faqs: [
    { q: "Lyon için kaç gün gerekir?", a: "İlk ziyaret için 2 tam gün, müze, pazar ve çağdaş bölgelerle 3 gün idealdir. Paris–Nice hattında en az iki gece bırakın." },
    { q: "Lyon Havalimanı'ndan merkeze nasıl gidilir?", a: "Rhônexpress, Saint-Exupéry'den Part-Dieu Villette'e gider. TCL şehir biletinden ayrıdır ve ara duraklarda metro/tramvay aktarması yapılabilir." },
    { q: "Lyon'da banka kartıyla toplu taşıma kullanılır mı?", a: "TCL'nin uygun doğrulayıcılarında temassız banka kartı/telefon kullanılabilir. Her binişte aynı aracı okutun; Rhônexpress sisteme dahil değildir." },
    { q: "Lyon'da hangi semtte kalınır?", a: "Presqu'île ilk ziyaret için en dengeli, Part-Dieu tren için pratik, Vieux Lyon atmosferlidir. Croix-Rousse mahalle hissi sunar ama yokuşludur." },
    { q: "Bouchon nedir?", a: "Lyon'un aile tipi, geleneksel ve çoğunlukla doyurucu yerel yemekler sunan küçük restoran geleneğidir. Kalite için güncel Les Bouchons Lyonnais etiketli listeye bakın." },
    { q: "Lyon'da araba gerekir mi?", a: "Şehir gezisinde hayır. Metro, tramvay, füniküler ve yürüyüş yeterlidir; bağ rotasında araç/tur düşünürseniz ZFE ve alkol riskini planlayın." },
  ],

  relatedGuides: [
    { city: "Paris", anchor: "Lyon'dan Paris'e: hızlı trenle kültür rotası", description: "Part-Dieu'dan doğru Paris garına geçip bouchon temposunu beş günlük müze ve mahalle programıyla tamamlayın." },
    { city: "Nice", anchor: "Lyon'dan Nice'e: gastronomiden Riviera'ya", description: "Güneydoğu tren hattıyla şehir sofrasından çakıllı plajlara ve kıyı kasabalarına inin." },
    { city: "Marsilya", anchor: "Lyon–Marsilya rotası: Rhône'dan Akdeniz'e", description: "Kısa hızlı tren bağlantısıyla tarihî tepelerden Vieux-Port ve Calanques'a geçin." },
    { city: "Bordo", anchor: "Lyon'dan Bordo'ya: iki gastronomi şehri", description: "Bağlantı süresini göze alıp bouchon kültürünü şarap müzesi, Garonne ve bağ günüyle karşılaştırın." },
    { city: "Strazburg", anchor: "Lyon'dan Strazburg'a: doğu Fransa rotası", description: "Aktarmalı tren planıyla Roma ve ipek mirasından Alsace evleri ile Avrupa kurumlarına uzanın." },
  ],

  sources: [
    { name: "Rhônexpress — resmî ulaşım ve SSS", url: "https://www.rhonexpress.fr/en_GB/faq" },
    { name: "TCL — biletler ve ulaşım", url: "https://www.tcl.fr/en" },
    { name: "ONLYLYON Tourism — resmî şehir rehberi", url: "https://en.visiterlyon.com/" },
    { name: "Les Bouchons Lyonnais — kalite etiketi", url: "https://www.lesbouchonslyonnais.org/" },
    { name: "Lugdunum — Roma müzesi ve tiyatrolar", url: "https://lugdunum.grandlyon.com/en/" },
    { name: "Métropole de Lyon — ZFE", url: "https://www.grandlyon.com/services/zfe-mode-demploi" },
  ],
  volatileNote: "Rhônexpress/TCL tarifeleri, füniküler bakımı, traboule erişimi, müze ve restoran saatleri ile ZFE kuralı değişebilir. Gezi gününde resmî kaynakları kontrol edin.",
  reviewed: "2026-08-10",
};

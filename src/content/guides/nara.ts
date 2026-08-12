import { CityGuide } from "./types";

/**
 * Nara rehberi — Ağustos 2026 doğrulaması.
 * Ana kaynaklar Nara City Tourism Association, Visit Nara, Todai-ji ve
 * Kasuga Taisha'nın resmî sayfalarıdır. Saat/fiyat yerine kalıcı planlama
 * mantığı öne çıkarılmıştır.
 */
export const nara: CityGuide = {
  city: "Nara",
  countryCode: "JP",

  seoTitle: "Nara Gezi Rehberi: Geyikler, Tapınaklar ve 1–2 Günlük Plan",
  seoDescription:
    "Nara gezi rehberi: Todai-ji, Nara Parkı, geyik kuralları, Kintetsu–JR farkı, Naramachi ve gerçek yemek adresleri, konaklama ve ayrıntılı 2 günlük rota.",
  h1: "Nara Gezi Rehberi",
  lede:
    "Nara, yalnızca geyiklerin dolaştığı bir park değil; Japonya'nın ilk kalıcı başkentinin anıtsal tapınaklarla, orman patikalarıyla ve yaşayan mahallelerle hâlâ okunabildiği sakin bir şehir. Doğru sırayla gezildiğinde bir güne sığar, iki günde ise gerçek karakterini gösterir.",

  quickFacts: [
    { label: "Önerilen süre", value: "1 tam gün · ideali 1 gece" },
    { label: "En iyi dönem", value: "Mart–Mayıs, Ekim–Kasım" },
    { label: "En yakın istasyon", value: "Kintetsu-Nara" },
    { label: "Ulaşım", value: "Yürüyüş + kısa otobüs bağlantıları" },
    { label: "Rota tipi", value: "Kyoto veya Osaka'dan kolay bağlantı" },
  ],

  sections: [
    {
      heading: "Nara günübirlik mi, konaklamalı mı?",
      id: "kac-gun",
      body: [
        "Nara'nın başlıca yapıları birbirine yakın olduğu için Kyoto ya da Osaka'dan günübirlik gelmek mantıklıdır. Kintetsu-Nara'dan yürümeye başlayıp Kofuku-ji, Nara Parkı, Todai-ji ve Kasuga Taisha'yı aynı gün içinde görebilirsiniz. Fakat bunun için sabah erken gelmeniz ve rotayı sürekli ileri doğru kurmanız gerekir; istasyona dönüp tekrar parka çıkmak gereksiz enerji kaybettirir.",
        "Bir gece kalmak şehrin tonunu değiştirir. Günübirlik gruplar ayrıldığında park sessizleşir, Naramachi'nin ahşap cepheleri akşam ışığında belirginleşir ve ertesi sabah Isuien gibi bir bahçeye acele etmeden girebilirsiniz. Japonya programınız zaten çok sıkışıksa bir gün yeter; yavaş seyahati seviyorsanız Nara'yı sadece Kyoto'nun uzantısı saymayın.",
        "En verimli sıra şöyledir: Kintetsu-Nara'dan Kofuku-ji'ye yürüyün, parkın batısından Todai-ji'ye geçin, Nigatsu-do'ya yükselin, orman yoluyla Kasuga Taisha'ya inin ve günü Naramachi'de bitirin. Böylece aynı yolu iki kez yürümezsiniz.",
      ],
    },
    {
      heading: "Nara Parkı ve geyiklerle doğru temas",
      id: "geyikler",
      body: [
        "Parktaki geyikler evcil hayvan değil, koruma altındaki **yabani hayvanlardır**. İnsanlara alışık olmaları davranışlarının öngörülebilir olduğu anlamına gelmez. Onları yalnızca park çevresinde satılan shika senbei adlı geyik krakerleriyle besleyin; kâğıt, poşet ya da kendi yiyeceğinizi uzatmayın. Yiyecek ambalajını kapalı çantada tutmak hem hayvanı hem eşyalarınızı korur.",
        "Krakeri gösterip uzun süre bekletmek geyiği sabırsızlandırabilir. Azar azar verin, bittiğinde iki elinizi açık biçimde gösterin ve sakince uzaklaşın. Koşmak, bağırmak, boynuzlara dokunmak ya da fotoğraf için hayvanın yolunu kesmek doğru değildir. Özellikle sonbaharda erkekler; yavrulama döneminde ise anne geyikler daha savunmacı davranabilir. Küçük çocuklarla araya bir yetişkin koyun.",
        "Geyikleri yalnızca ana park düzlüğünde aramayın. Todai-ji ile Kasuga Taisha arasındaki daha sakin çimenliklerde karşılaşma çoğu zaman daha rahattır. Yine de mesafeyi hayvanın belirlemesine izin verin. Parkta çöp kutusu azdır; getirdiğiniz ambalajı geri taşıyacak küçük bir poşet bulundurun.",
      ],
    },
    {
      heading: "Gezilecek yerler: büyük yapıların ötesi",
      id: "gezilecek-yerler",
      body: [
        "Nara'nın çekirdeği, görkemli tek bir anıttan çok birbirine bağlanan kutsal alanlar ve yürüyüşlerdir. Sadece Büyük Buda'yı görüp istasyona dönmek, şehrin orman ve mahalle ölçeğini kaçırır.",
      ],
      subsections: [
        {
          heading: "Todai-ji ve Nigatsu-do",
          body: [
            "Todai-ji'nin Daibutsuden salonu, dev bronz Buda heykelini barındıran anıtsal ahşap yapıdır. Kalabalık artmadan girmek için sabah ilk saatleri hedefleyin. Salonun ölçeğini yalnızca önden fotoğraflamak yerine yan cephe boyunca yürüyerek algılayın; yapının avluya nasıl oturduğu içerideki heykel kadar etkileyicidir.",
            "Ana salondan sonra çoğu grubun dönüp gittiği noktada siz Nigatsu-do tabelalarını izleyin. Taş basamakların üzerindeki teras Nara havzasına açılır; giriş aksının tören havasından orman sessizliğine geçiş burada belirginleşir. Yağmurda taşlar kayganlaşabileceği için tabanı iyi ayakkabı giyin.",
          ],
        },
        {
          heading: "Kasuga Taisha ve fenerli orman yolu",
          body: [
            "Kasuga Taisha'ya düz caddeden değil, Todai-ji tarafındaki orman patikalarından yaklaşın. Taş fenerler, yosun ve sedirler tapınağın kendisine hazırlayan bir eşik oluşturur. Dış alanlarda dolaşmakla iç kutsal bölüme girmek farklı deneyimlerdir; zamanınız varsa iç bölümü de görün, ancak güncel giriş ve tören durumunu resmî siteden kontrol edin.",
            "Fenerler her akşam yakılmaz. İnternetteki gece fotoğrafları özel dönemlere aittir; sırf bu görüntüyü bekleyerek program kurmayın. Gündüz, taş fenerlerin orman içindeki ritmi zaten buranın esas etkisidir.",
          ],
        },
        {
          heading: "Kofuku-ji, Isuien ve Yoshikien",
          body: [
            "Kofuku-ji istasyondan parka geçişte doğal ilk duraktır. Beş katlı pagoda uzun süreli büyük onarımdadır ve örtü/şantiye koşulları değişebilir; ziyareti yalnızca pagoda fotoğrafına bağlamayın. Central Golden Hall ve Ulusal Hazine Müzesi, Nara Budist heykel sanatını anlamak için başlı başına güçlü nedenlerdir.",
            "Isuien, Todai-ji yakınında iki ayrı dönemin bahçe anlayışını tek yürüyüşte gösterir; arka plandaki dağları kompozisyona katan ödünç manzara tekniği özellikle güzeldir. Yanındaki Yoshikien'in erişim ve giriş uygulaması değişebildiğinden güncel durumu kontrol edin. Yoğun bir tapınak sabahından sonra bu iki bahçeden birini seçmek günü dengeler.",
          ],
        },
      ],
    },
    {
      heading: "Naramachi: park bittikten sonra yaşayan şehir",
      id: "naramachi",
      body: [
        "Naramachi, eski Gango-ji arazisi çevresinde gelişen dar sokaklı mahalledir. Machiya denen uzun ve dar tüccar evleri bugün küçük müze, kafe, dükkân ve konukevlerine dönüşmüş durumda. Burası tek bir 'görülecek nokta' değil; avluları ve kafesli ahşap cepheleri fark ederek yavaş yürünecek bir bölgedir.",
        "Gango-ji, Nara'nın dev yapılarından daha alçakgönüllü görünür ama şehrin erken Budist tarihini taşır. Parktan sonra buraya gelmek ölçek değişimini hissettirir. Naramachi Koshino Ie gibi geleneksel ev örnekleri açıksa kısa bir ziyaret, dışarıdan bakılan cephelerin içeride nasıl örgütlendiğini anlatır.",
        "Mahalledeki küçük işletmelerin çoğu günün erken saatlerinde kapanabilir ve bazıları düzensiz tatil yapar. Akşam yemeğini tek bir kırılgan adrese bağlamak yerine öğleden sonra gezip rezervasyonlu restoranınızı önceden teyit edin.",
      ],
    },
    {
      heading: "Nara'ya ulaşım ve şehir içinde hareket",
      id: "ulasim",
      body: [
        "Nara'da iki ana istasyon vardır ve aynı yerde değillerdir. **Kintetsu-Nara**, parkın girişine yürüyerek yaklaşık sekiz dakika mesafededir; **JR Nara** ise yaklaşık yirmi dakika uzaktadır. Osaka-Namba veya Kyoto'dan Kintetsu hattıyla geliyorsanız Kintetsu-Nara çoğu günübirlik rota için daha kullanışlıdır. JR Pass kullananlar JR istasyonunu tercih edebilir; fazladan yürüyüşü plana ekleyin.",
        "Kyoto'dan Kintetsu limited express hızlı ve rahattır fakat temel bilete ek ücret/koltuk bileti gerektirir; daha yavaş trenler aktarma içerebilir. Osaka-Namba'dan direkt Kintetsu treni yaklaşık kırk dakikalık pratik bir bağlantıdır. Dakika ve tren türü sefere göre değiştiği için rota uygulamasında istasyon adını tam yazın.",
        "Park çekirdeği yürünebilir. Otobüs, JR Nara'dan başlıyorsanız veya yorgunluk varsa işe yarar; aksi halde ana anıtlar arasındaki patikaları kaçırmanıza neden olabilir. IC kartlar toplu taşımada yaygın biçimde kullanılır. Bavulla günübirlik geliyorsanız istasyon dolaplarının yoğun günlerde dolabileceğini hesaba katın.",
      ],
    },
    {
      heading: "Ne yenir? Nara'nın saklama kültürü",
      id: "ne-yenir",
      body: [
        "Denizden uzak eski başkent mutfağı, saklama teknikleriyle biçimlenmiştir. **Kakinoha-zushi**, sirkeli pirinç ve çoğunlukla uskumru ya da somonun hurma yaprağına sarılmasıyla hazırlanır. Yaprak yenmez; paketi açıp suşiyi çıkarırsınız. Yolculuğa uygun olduğu için paket almak kolaydır ama ilk kez tadacaksanız oturarak servis yapan bir dükkânda farklı balıkları karşılaştırmak daha anlamlıdır.",
        "**Kamameshi**, küçük metal ya da toprak kapta sipariş üzerine pişen pirinçtir. Hazırlanması zaman aldığı için hızlı bir öğle arasına uygun değildir; tencerenin dibindeki kızarmış kısmı da karıştırarak yemek lezzetin parçasıdır. **Miwa somen**, **cha-gayu** adı verilen çaylı pirinç lapası, narazuke turşusu ve Yamato sebzeleri şehrin daha sessiz ama yerel tatlarıdır.",
        "Geyik biçimli tatlıların hepsi nitelikli değildir. Mochi için üretimi görülebilen uzman dükkânı, öğün için tek yemeğe odaklanan eski işletmeyi seçmek genellikle daha iyi sonuç verir.",
      ],
    },
    {
      heading: "Nerede kalınır?",
      id: "nerede-kalinir",
      body: [
        "Tek gece için **Kintetsu-Nara çevresi** en pratik tabandır: parka sabah yürür, akşam Naramachi'ye kolay geçersiniz. Restoran ve market seçeneği de fazladır. JR ile erken ayrılacaksanız **JR Nara çevresi** işlevseldir ama ana park alanına daha uzaktır.",
        "Atmosfer arıyorsanız **Naramachi** içindeki machiya konukevleri doğru seçimdir. Eski yapılarda ses yalıtımı, dik merdiven ve özel banyo koşulları modern otelden farklı olabilir; rezervasyonda oda ayrıntısını okuyun. Parkın doğusundaki geleneksel ryokanlar ise sakinlik ve yemek deneyimi sunar, fakat akşam şehir merkezine dönmek daha zahmetlidir.",
      ],
    },
    {
      heading: "Mevsimler ve pratik planlama",
      id: "ne-zaman",
      body: [
        "İlkbahar ve sonbahar yürüyüş için en rahat dönemlerdir; kiraz çiçeği ve yaprak renkleri aynı zamanda en yoğun günleri getirir. Yaz sıcak ve nemlidir: Todai-ji ile Kasuga arasındaki uzun yürüyüşü sabaha alın, su taşıyın ve kapalı bir öğle molası verin. Kış daha sakin, hava daha keskin; orman gölgede kaldığı için katmanlı giyinin.",
        "Yağmur Nara'yı bozmaz; yosun ve fener yolları daha etkileyici olur. Fakat geyiklerin davranışı, açık bahçe yolları ve taş basamaklar hava koşulundan etkilenir. Şemsiye yerine elleri serbest bırakan hafif yağmurluk yürüyüşte daha rahattır.",
        "Tapınak salonları, bahçeler ve küçük müzeler aynı saatte kapanmaz. Ana gününüzü saat saat doldurmak yerine iki 'olmazsa olmaz' seçin; geri kalanını rota üzerinde açık olana göre esnetin.",
      ],
    },
    {
      heading: "Sık yapılan hatalar",
      id: "ipuclari",
      body: [
        "**Sadece geyik fotoğrafı çekip dönmek:** Todai-ji'den Nigatsu-do'ya ve Kasuga'ya uzanan yürüyüş, şehrin asıl hafızasıdır.",
        "**Yanlış istasyona göre süre hesaplamak:** Kintetsu-Nara ile JR Nara arasındaki fark küçük görünür, fakat sabah ve akşam toplamında ciddi yürüyüş ekler.",
        "**Geyiği yiyecekle kışkırtmak:** Krakeri saklamak, havaya kaldırmak veya poşetle yaklaşmak ısırma ve itme riskini artırır.",
        "**Her şeyi bir öğleden sonraya bırakmak:** Büyük salonlar ve bahçeler akşam eğlence mekânı gibi geç kapanmaz. Nara'ya öğle sonrası varmak ana rotayı gereksiz sıkıştırır.",
        "**Pagodayı açık sanmak:** Kofuku-ji'nin beş katlı pagodası uzun süreli restorasyondadır; güncel görünürlüğü seyahatten önce kontrol edin.",
      ],
    },
  ],

  places: [
    {
      name: "Hiraso Nara",
      area: "Kintetsu-Nara çevresi",
      known: "Kakinoha-zushi ve mevsimlik Nara yemekleri",
      why:
        "Uzun geçmişi olan uzman işletmede hurma yaprağına sarılı suşiyi yalnızca paket almak yerine oturarak tadabilirsiniz. Uskumru ve somon gibi seçenekleri karşılaştırmak, bu saklama tekniğini anlamanın iyi yoludur.",
      price: "Orta",
      tip: "Şubeyi ve yemek servisi saatini resmî siteden doğrulayın; paket satış ile restoran saatleri aynı olmayabilir.",
    },
    {
      name: "Shizuka Nara Park",
      area: "Nara Parkı",
      known: "Sipariş üzerine pişen kamameshi",
      why:
        "Pirinç, sebze ve seçilen malzeme küçük kapta birlikte pişer; tabandaki kızarmış katman yemeğin en iyi bölümüdür. Turistik konumuna rağmen tek tek pişirme yöntemi nedeniyle gerçek bir yerel öğün sunar.",
      price: "Orta",
      tip: "Pişirme ve sıra süresini hesaba katın. Hızlı öğle yemeği değil, dinlenme molası olarak planlayın.",
    },
    {
      name: "Mizuyachaya",
      area: "Kasuga Taisha–Todai-ji yolu",
      known: "Udon, soba ve geleneksel tatlılar",
      why:
        "Orman içindeki saz çatılı küçük yapı, büyük anıtlar arasındaki yürüyüşe doğal bir mola verir. Menüden çok konumu ve sade sıcak eriştesi için değerlidir.",
      price: "Ekonomik",
      tip: "Küçük ve gündüz odaklıdır; tek öğün seçeneğiniz olarak geç saate bırakmayın.",
    },
    {
      name: "Nakatanidou",
      area: "Sanjo-dori",
      known: "Taze yomogi mochi",
      why:
        "Pelin otlu yeşil mochi, kırmızı fasulye dolgusu ve soya unu kaplamasıyla sıcak-taze yenir. Hızlı dövme gösterisi ünlüdür ama asıl neden dokusu hâlâ yumuşakken tatmaktır.",
      price: "Ekonomik",
      tip: "Mochi dövme gösterisinin sabit saati yoktur; gösteri vaadiyle program kurmayın.",
    },
    {
      name: "Awa Naramachi",
      area: "Naramachi",
      known: "Yamato sebzeleri ve yerel ürünlerle set menü",
      why:
        "Tarihî mahalledeki bu adres, Nara'nın yalnızca suşi ve tatlıdan ibaret olmadığını gösterir. Yerel sebzeleri küçük tabaklar hâlinde sunması, mevsimsel mutfağa iyi bir giriş sağlar.",
      price: "Yüksek",
      tip: "Rezervasyon odaklı çalışır; ziyaret biçimini ve menüyü önceden teyit edin.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — Nara'nın tarihî omurgası",
      morning:
        "Kintetsu-Nara'dan Kofuku-ji'ye yürüyün; ardından kalabalık artmadan Todai-ji Daibutsuden'e girin ve Nigatsu-do terasına çıkın.",
      afternoon:
        "Orman yoluyla Kasuga Taisha'ya ilerleyin. Dönüşte Isuien veya bir çay molası seçin; ikisini birden sıkıştırmayın.",
      evening:
        "Naramachi sokaklarını ve Gango-ji çevresini yürüyün. Rezervasyonlu yerel bir akşam yemeğiyle günü bitirin.",
    },
    {
      title: "2. Gün — Bahçe ve yaşayan mahalle",
      morning:
        "Isuien'i açılışa yakın gezin; sonra Yoshikien'in güncel erişimi uygunsa yan bahçeye geçin.",
      afternoon:
        "Naramachi'de geleneksel evleri, zanaat dükkânlarını ve küçük müzeleri acele etmeden keşfedin.",
      evening:
        "Kyoto veya Osaka'ya dönecekseniz istasyonda kakinoha-zushi alın; kalıyorsanız parkın batı ucunda sakin bir akşam yürüyüşü yapın.",
    },
  ],

  practicalHeading: "Nara'ya gitmeden bilinmesi gerekenler",
  practicalTips: [
    {
      title: "Kintetsu-Nara park için daha yakındır",
      body:
        "Kintetsu-Nara'dan park girişi yaklaşık sekiz, JR Nara'dan yaklaşık yirmi dakika yürüyüştür. Bilet/pas avantajı yoksa istasyon adını rota uygulamasına eksiksiz yazın.",
    },
    {
      title: "Geyikler yabani hayvandır",
      body:
        "Yalnızca resmî shika senbei verin; kendi yiyeceğinizi, kâğıdı veya poşeti uzatmayın. Krakeri gösterip saklamak ya da havada tutmak hayvanı kışkırtabilir.",
    },
    {
      title: "Kraker bitince ellerinizi gösterin",
      body:
        "Avuçlarınızı açık gösterip sakin biçimde uzaklaşın. Çocuğu krakerle tek başına bırakmayın; boynuz ve çiftleşme dönemlerinde daha geniş mesafe koruyun.",
    },
    {
      title: "Pagoda fotoğrafını garanti saymayın",
      body:
        "Kofuku-ji'nin beş katlı pagodası uzun süreli büyük onarım altında. Central Golden Hall ve Ulusal Hazine Müzesi açık rota için daha güvenilir nedenlerdir.",
    },
    {
      title: "Büyük yapılar akşamı beklemez",
      body:
        "Todai-ji ve bahçeleri sabaha alın; küçük müze ve salonların kapanış saatleri birbirinden farklıdır. Naramachi'yi açık hava yürüyüşü olarak günün sonuna bırakın.",
    },
    {
      title: "Bavul dolabına yedek plan yapın",
      body:
        "Yoğun günlerde istasyon dolapları dolabilir. Kyoto veya Osaka'daki otelinizin bagaj saklama/gönderme seçeneğini kullanmak, parkın taş ve orman yollarında valiz taşımaktan kolaydır.",
    },
  ],

  faqs: [
    {
      q: "Nara için bir gün yeter mi?",
      a: "Evet. Sabah erken gelirseniz Kofuku-ji, Todai-ji, Nigatsu-do, Kasuga Taisha ve Naramachi'yi bir günde görebilirsiniz. Bahçeler, müzeler ve sakin akşam için bir gece eklemek deneyimi belirgin biçimde iyileştirir.",
    },
    {
      q: "Nara'ya Kyoto'dan mı Osaka'dan mı gitmek kolay?",
      a: "İkisinden de kolaydır. Kintetsu hatları Kyoto ve Osaka-Namba'yı Kintetsu-Nara'ya bağlar; istasyon park girişine JR Nara'dan daha yakındır. Tren türüne göre aktarma ve ek ücret değişebildiği için günübirlik rotayı seyahat sabahı kontrol edin.",
    },
    {
      q: "Nara geyiklerini beslemek güvenli mi?",
      a: "Kurala uyulduğunda genellikle sorunsuzdur ama hayvanlar yabandır. Yalnızca geyik krakeri verin, paketi saklamayın veya hayvanı kızdırmayın, yiyecek bitince açık ellerinizi gösterin. Çocukları ve yiyecek poşetlerini yakın gözetin.",
    },
    {
      q: "Kintetsu-Nara mı JR Nara mı daha iyi?",
      a: "Park odaklı günübirlik gezi için Kintetsu-Nara daha yakındır. JR Pass kullanıyorsanız JR Nara mantıklı olabilir; parka yaklaşık yirmi dakikalık yürüyüşü veya kısa otobüs bağlantısını hesaba katın.",
    },
    {
      q: "Nara'da bavulla gezilir mi?",
      a: "Park patikaları ve uzun yürüyüş nedeniyle önerilmez. İstasyon dolaplarını ya da bagaj hizmetini kullanın; yoğun günlerde büyük dolapların dolabileceğini düşünerek erken gelin.",
    },
    {
      q: "Nara'da ne yenir?",
      a: "Kakinoha-zushi, kamameshi, Miwa somen, cha-gayu, narazuke ve Yamato sebzeleri öne çıkar. Tatlı için taze yomogi mochi iyi bir kısa moladır.",
    },
  ],

  relatedGuides: [
    {
      city: "Kyoto",
      anchor: "Nara'dan Kyoto'ya: tapınak rotasını derinleştirin",
      description:
        "Kintetsu bağlantısıyla kolay geçiş; Kyoto için en az üç tam gün ve semt bazlı plan gerekir.",
    },
    {
      city: "Osaka",
      anchor: "Nara'dan Osaka'ya: günü sokak lezzetleriyle bitirin",
      description:
        "Namba'ya direkt tren, Nara'nın sakinliğinden Osaka'nın akşam enerjisine pratik bir geçiş sağlar.",
    },
  ],

  sources: [
    { name: "Nara Park — Nara City Tourism Association", url: "https://narashikanko.or.jp/en/spot/detail_10089.html" },
    { name: "Nara deer etiquette", url: "https://narashikanko.or.jp/en/feature/deer/" },
    { name: "Todai-ji visitor information", url: "https://www.todaiji.or.jp/en/information/haikan/" },
    { name: "Travel to Nara — official guide", url: "https://www.visitnara.jp/travel-to-nara/" },
    { name: "Kofuku-ji pagoda repair project", url: "https://kohfukuji-project.jp/five-storied_pagoda/en/index.html" },
    { name: "Hiraso Nara store", url: "https://hiraso.jp/shop/shop-nara/" },
    { name: "Shizuka kamameshi", url: "https://kamameshi-shizuka.jp/" },
    { name: "Awa Naramachi", url: "https://www.visitnara.jp/venues/D00169/" },
  ],

  volatileNote:
    "Tapınak ve bahçe saatleri, tören günleri, Kofuku-ji restorasyon görünürlüğü ve küçük işletmelerin çalışma düzeni değişebilir. Aynı gün resmî kaynaklardan kontrol edin.",
  reviewed: "2026-08-09",
};

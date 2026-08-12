import { CityGuide } from "./types";

/**
 * Tokyo rehberi.
 *
 * Doğrulanan kalıcı bilgiler (Ağustos 2026): GO TOKYO, Haneda Airport,
 * Toyosu Market ve işletmelerin resmî sayfaları. Michelin, kesin fiyat ve
 * işletmeler arası genellenemeyecek çalışma saatleri bilerek kullanılmadı.
 */
export const tokyo: CityGuide = {
  city: "Tokyo",
  countryCode: "JP",

  seoTitle: "Tokyo Gezi Rehberi: Gezilecek Yerler, Nerede Kalınır, Ne Yenir",
  seoDescription:
    "Tokyo'da gezilecek yerler, semt semt konaklama, gerçek yemek adresleri, metro ve havalimanı ulaşımı, 1 ve 3 günlük gezi planları ile bütçe rehberi.",
  h1: "Tokyo Gezi Rehberi",
  lede:
    "Dünyanın en büyük metropol alanlarından biri tek bir merkez etrafında değil, birbirine değen onlarca ayrı şehir gibi kurulmuş. Tokyo'yu anlamanın yolu listeleri kovalamaktan değil, doğru semtte doğru saatte olmaktan geçiyor.",

  quickFacts: [
    { label: "Önerilen süre", value: "4–5 gün" },
    { label: "En iyi dönem", value: "Mart sonu–Mayıs, Ekim–Kasım" },
    { label: "Havalimanı", value: "Haneda (HND) · Narita (NRT)" },
    { label: "Şehir içi ulaşım", value: "Metro + JR hatları, IC kart" },
    { label: "Dil", value: "Japonca; turistik alanlarda İngilizce sınırlı" },
  ],

  sections: [
    {
      heading: "Tokyo'yu anlamak: şehir neden bu kadar dağınık?",
      id: "sehri-anlamak",
      body: [
        "Avrupa şehirleri genellikle bir meydanın etrafında büyür. Tokyo ise demiryolu istasyonlarının etrafında büyüdü. Yamanote adı verilen çember hat şehrin göbeğini bir halka gibi dolaşır ve bu halkanın üzerindeki her büyük istasyon — Shinjuku, Shibuya, Ueno, Tokyo — kendi başına ayrı bir şehir merkezi gibi davranır. Kendi gökdelenleri, kendi yeraltı çarşısı, kendi meyhane sokakları vardır.",
        "Bu yüzden \"Tokyo'nun merkezi neresi\" sorusunun dürüst cevabı yoktur. Gezinizi şehrin tamamını dolaşmak üzerine değil, günde bir ya da iki semti gerçekten görmek üzerine kurarsanız hem daha az yorulur hem daha çok şey görürsünüz. Yamanote hattının bir ucundan diğerine gitmek yarım saatinizi alır; günde üç semt hedefleyen bir plan, günün önemli bölümünü vagonda geçirmek demektir.",
        "Bir başka alışılmadık ayrıntı: Tokyo'da sokakların çoğunun adı yoktur. Adresler mahalle, ada ve bina numarasından oluşur. Yerel halk bile bir yere giderken haritaya bakar; siz de bakacaksınız, bunun utanılacak bir tarafı yok.",
      ],
    },
    {
      heading: "Gezilecek yerler: semt semt Tokyo",
      id: "gezilecek-yerler",
      body: [
        "Aşağıdaki semtler birbirinden gerçekten farklı karakterler taşır. Hepsini aynı güne sıkıştırmak yerine ikişerli gruplayın; coğrafi olarak yakın olanları birleştirmek günü rahatlatır.",
      ],
      subsections: [
        {
          heading: "Asakusa ve Ueno — eski şehrin kaldığı yer",
          body: [
            "Senso-ji, şehrin en eski tapınağı. Ana kapıdan tapınağa uzanan Nakamise caddesi gündüz tıklım tıklımdır; sabah yedide gittiğinizde aynı cadde neredeyse boştur ve tapınak bambaşka bir yer gibi görünür. Tokyo'da erken kalkmanın en çok karşılığını veren yer burasıdır.",
            "Ueno Parkı hemen yanı başında; içinde Tokyo Ulusal Müzesi ve birkaç müze daha var. Japon sanat tarihine bir gün ayıracaksanız burada ayırın. Parkın güneyindeki Ameyoko çarşısı, savaş sonrası karaborsa pazarından bugüne kalmış dar ve gürültülü bir sokak — kuru yemişten deniz ürününe her şey satılır, akşamüstü ayaküstü içki içilen dükkânlar açılır.",
          ],
        },
        {
          heading: "Shibuya ve Shinjuku — kalabalığın estetiği",
          body: [
            "Shibuya kavşağı beklediğinizden küçüktür ama beklediğinizden etkileyicidir. Kavşağı yukarıdan görmek için ücretli seyir teraslarına gerek yok; çevredeki mağaza katlarından ya da istasyon üst geçidinden de izleyebilirsiniz.",
            "Shinjuku ikiye ayrılır. Batı yakası gökdelenler ve otellerdir; Tokyo Metropolitan Hükümet Binası'nın seyir katı yıllardır ücretsizdir ve açık havada berrak bir günde Fuji görünür. Doğu yakası ise Kabukicho'nun neonları ve Omoide Yokocho'nun dar sokaklarıdır: iki üç metre genişliğinde geçitler, altı kişilik ızgara barlar, is ve duman. Tokyo'nun en fotojenik akşam saatleri buradadır.",
          ],
        },
        {
          heading: "Yanaka, Shimokitazawa, Kiyosumi — turistin az gittiği taraf",
          body: [
            "Yanaka, savaş yıkımından büyük ölçüde kurtulmuş nadir mahallelerden. Alçak ahşap evler, bir mezarlık boyunca uzanan kiraz ağaçları, kedi figürleriyle dolu küçük bir çarşı. Yarım günde yürünür ve şehrin gürültüsünden sonra insanı dinlendirir.",
            "Shimokitazawa ikinci el kıyafet ve küçük plak dükkânlarının semti; tiyatroları ve kahveleriyle öğrenci enerjisi taşır. Kiyosumi-Shirakawa ise üçüncü dalga kahvenin Tokyo'daki üssü — eski depolar kavurma atölyelerine dönüşmüş durumda. Kahveyle ilginiz varsa bu semte bir sabah ayırın.",
          ],
        },
      ],
    },
    {
      heading: "Ne yenir? Tokyo mutfağına giriş",
      id: "ne-yenir",
      body: [
        "Tokyo'da kötü yemek yemek gerçekten zordur. Şehrin gücü yıldızlı restoranlarından çok, tek bir işi on yıllardır yapan küçük dükkânlarından gelir. Yedi sandalyeli bir ramen tezgâhı, sadece tempura yapan bir aile işletmesi, istasyon altındaki bir soba büfesi — asıl Tokyo mutfağı buralarda.",
        "Kaçırmayın: **sushi** (özellikle sabah, hal çevresinde), **ramen** (her semtin kendi tarzı var), **tempura**, **tonkatsu**, **soba** ve **unagi**. Sokak yemeği kültürü Osaka kadar güçlü değildir; Tokyo'da yemek çoğunlukla oturarak, sessizce ve hızlıca yenir.",
        "Pratik iki not: Japonya'da bahşiş yoktur ve bırakmaya çalışmak kibarca reddedilir. Birçok küçük mekânda kapıda bilet otomatı bulunur — önce fişinizi alır, sonra tezgâha oturursunuz.",
      ],
    },
    {
      heading: "Balık halleri: Tsukiji mi Toyosu mu?",
      id: "haller",
      body: [
        "Bu ikisi karıştırılıyor, çünkü 2018'de bir bölünme yaşandı. Toptancı hal ve meşhur ton balığı mezatı **Toyosu**'ya taşındı. Ama gezginlerin asıl gittiği yer olan **Tsukiji Dış Çarşı** kapanmadı; çok sayıda dükkân ve lokantayla çalışmayı sürdürüyor.",
        "Pratik ayrım şu: yemek yemeye ve gezmeye gidiyorsanız Tsukiji Dış Çarşı'ya gidin. Burası sabah odaklıdır ama her işletmenin günü ve saati farklıdır; tek bir açılış-kapanış kuralına güvenmeyin. Ton balığı mezadını izlemek istiyorsanız Toyosu'ya gitmeniz gerekir: güncel resmî düzende mezat yaklaşık 05:30–06:30 arasında olur, üstteki ziyaretçi koridoru rezervasyonsuz görülebilir, cama daha yakın alt gözlem alanı ise sınırlı sayıda kişiyle ve önceden kurayla belirlenir.",
        "Dürüst tavsiye: mezat, sabahın dördünde kalkmayı göze alacak kadar meraklı değilseniz atlanabilir. Dış çarşıda sekiz buçukta yenen bir kâse deniz ürünü, çoğu gezgine daha iyi bir sabah yaşatır.",
      ],
    },
    {
      heading: "Nerede kalınır? Semt seçimi rehberi",
      id: "nerede-kalinir",
      body: [
        "Tokyo'da otelin yıldızından çok istasyona olan mesafesi önemlidir. \"Yürüyerek 5 dakika\" ile \"yürüyerek 12 dakika\" arasındaki fark, günde iki kez, bavulla, sıcakta hissedilir.",
        "**Shinjuku** — en fazla hat, en fazla seçenek, gece geç saatte bile hareketli. İlk kez gelenler için en güvenli tercih. Karşılığında gürültülü.",
        "**Tokyo İstasyonu / Marunouchi** — iş oteli ağırlıklı, sakin, Narita ve Shinkansen bağlantısı çok kolay. Akşam hayatı zayıf.",
        "**Asakusa** — daha uygun fiyatlı, geleneksel doku, sabah gezileri için ideal. Merkezî hatlara uzaklığı tek zayıf noktası.",
        "**Shibuya** — genç, hareketli, alışveriş ve yemek yürüme mesafesinde. Fiyatlar yüksek.",
        "**Ueno** — fiyat/konum dengesi en iyi semtlerden; Narita'ya doğrudan bağlantısı var, parka ve çarşıya yürünür.",
      ],
    },
    {
      heading: "Havalimanından şehre ulaşım",
      id: "havalimani-ulasim",
      body: [
        "**Haneda (HND)** şehre çok daha yakındır; monoray ya da Keikyu hattıyla merkeze yarım saat civarında ulaşırsınız. Uçuş seçenekleriniz arasında Haneda varsa, birkaç saat daha uygun fiyatlı olsa bile Narita'yı tercih etmeden önce bu farkı hesaba katın.",
        "**Narita (NRT)** şehre uzaktır; merkeze bağlantı hızlı trenle yaklaşık bir saat, otobüsle trafiğe göre daha uzun sürer. Gece geç inen uçuşlarda son tren saatini önceden kontrol edin — kaçırırsanız taksi ücreti Japonya'da ciddi bir rakamdır.",
        "Şehre indiğinizde bir IC kart (Suica ya da Pasmo) edinmek işi kolaylaştırır. Fiziksel ziyaretçi kartlarının satış noktası değişebilir; uyumlu telefondaki dijital kart da seçenektir. Metro, JR, otobüs ve marketlerde geçer; her binişte bilet almakla uğraşmazsınız.",
      ],
    },
    {
      heading: "Şehir içi ulaşım: metroyu çözmek",
      id: "sehir-ici-ulasim",
      body: [
        "Tokyo'da tek bir metro şirketi yoktur. Tokyo Metro, Toei ve JR farklı işletmelerdir; aynı istasyon adı farklı şirketlerde farklı yerlere denk gelebilir. IC kart bu karmaşayı büyük ölçüde çözer, çünkü hangi şirketin hattına bindiğinizi düşünmenize gerek kalmaz.",
        "Büyük istasyonlarda çıkış numarasına dikkat edin. Shinjuku'nun onlarca çıkışı var ve yanlış çıkıştan çıkmak sizi hedefinizden on dakika uzağa bırakabilir. Gideceğiniz yerin yanındaki çıkış numarasını önceden not almak, Tokyo'da öğrenilen ilk yerel alışkanlıktır.",
        "Son trenler gece yarısı civarı kalkar ve sonrasında şehir sessizleşmez ama ulaşım pahalılaşır. Geç kalacaksanız ya son treni hesaplayın ya da sabahın ilk trenine kadar açık bir yerde olmayı planlayın — Tokyo bunu yapan tek şehir değil ama en rahat yapılan şehirlerden biri.",
      ],
    },
    {
      heading: "Ne zaman gidilir?",
      id: "ne-zaman",
      body: [
        "**İlkbahar (mart sonu–mayıs)** en çok tercih edilen dönem. Kiraz çiçekleri genellikle mart sonu ile nisan başına denk gelir ama tarih her yıl değişir ve bir haftalık bir pencereye sıkışır; buna göre bilet almak risklidir.",
        "**Sonbahar (ekim–kasım)** bence daha iyi seçenek: hava dengeli, nem düşük, kalabalık daha az, kasım sonunda akçaağaç renkleri şehir parklarına iniyor.",
        "**Yaz (haziran–ağustos)** sıcak ve çok nemlidir; haziranda yağmur mevsimi vardır. Ağustosta yürüyerek gezmek gerçekten yorucudur. **Kış** ise berrak ve kuru geçer, kalabalık azalır ve Fuji'yi görme ihtimaliniz artar — üstelik fiyatlar daha uygundur.",
      ],
    },
    {
      heading: "Bütçe: Tokyo gerçekten pahalı mı?",
      id: "butce",
      body: [
        "Tokyo'nun pahalı olduğu algısı biraz eskimiş bir bilgi. Konaklama ve taksi pahalıdır, ama yemek şaşırtıcı derecede makuldür: küçük bir lokantada doyurucu bir öğün, Batı Avrupa'nın büyük şehirlerinden genellikle daha ucuza gelir.",
        "Bütçenizi zorlayan üç kalem olur: otel, uzun mesafe trenler ve müze/kule girişleri. Bunlardan ilkine yatırım yapın (konum gerçekten önemli), diğer ikisini seçici kullanın. Ücretsiz manzara seçenekleri şehirde fazlasıyla mevcut.",
      ],
    },
    {
      heading: "Yerel ipuçları ve sık yapılan hatalar",
      id: "ipuclari",
      body: [
        "**Nakit taşıyın.** Kart kullanımı yaygınlaştı ama küçük lokantalar, tapınak girişleri ve bazı çarşı dükkânları hâlâ sadece nakit çalışıyor.",
        "**Metroda telefonla konuşulmaz.** Sessizlik burada bir nezaket kuralı; vagonda konuşan tek kişi olmak fark edilir.",
        "**Yiyeceğinizi çevreyi kirletmeden, işletmenin gösterdiği yerde bitirin.** Bazı çarşı ve kutsal alanlarda yürürken yemek açıkça istenmez; yerel işaretleri izleyin ve ambalajınızı geri taşıyın.",
        "**Çok şey planlamayın.** Tokyo'da en iyi anlar genellikle plansız olanlardır: yanlış çıkıştan çıkıp bulduğunuz sokak, adını okuyamadığınız bir kapıdan girdiğiniz bar.",
        "**Bavulunuzu kargoyla gönderebilirsiniz.** Şehirler arası geçişte valizi otelden otele yollamak yaygın bir hizmettir; teslim süresi ve kabul koşulunu otelle teyit etmek tren yolculuğunu belirgin biçimde rahatlatır.",
      ],
    },
  ],

  places: [
    {
      name: "Tsukiji Dış Çarşı",
      area: "Tsukiji",
      known: "Deniz ürünü tezgâhları ve sabah yemeği",
      why:
        "Tek bir restoran değil, bir sokak dolusu seçenek. Sabah dokuzda tezgâh tezgâh dolaşıp tamago, deniz kestanesi, ızgara balık ve taze istiridye tadarak ilerlemek Tokyo'nun en keyifli kahvaltısı.",
      price: "Orta",
      tip: "Sabah gidin; her dükkânın çalışma günü ve saati farklıdır. Tek bir pazar takvimine güvenmeyin.",
    },
    {
      name: "Shinjuku Tsunahachi",
      area: "Shinjuku",
      known: "1920'lerden beri tempura",
      why:
        "Tempurayı ağır ve yağlı bir karışık tabak olarak değil, malzemeler sırayla kızartılıp sıcakken servis edilen bir öğün olarak deneyimlemek için güvenilir bir klasik. Ana Shinjuku mağazası şehrin bu yemek geleneğini erişilebilir biçimde anlatır.",
      price: "Orta",
      tip: "Ana mağaza ile diğer şubeleri karıştırmayın; güncel sıra ve rezervasyon düzenini resmî siteden kontrol edin.",
    },
    {
      name: "Kanda Matsuya",
      area: "Kanda–Awajicho",
      known: "Tarihî ahşap yapıda soba",
      why:
        "Soba eriştesinin dokusunu ve dashi temelli sosu sade biçimde anlamak için gidilir. Gösterişli bir tadım değil; Tokyo'nun tek işe odaklanan eski esnaf lokantası kültürünün yaşayan örneğidir.",
      price: "Orta",
      tip: "Yoğun öğle saatleri yerine erken veya geç öğün düşünün; çalışma gününü resmî kanaldan teyit edin.",
    },
    {
      name: "Maisen Aoyama Honten",
      area: "Jingumae–Omotesando",
      known: "Tonkatsu ve karakterli eski hamam salonu",
      why:
        "Çıtır kaplama ile yumuşak domuz etinin dengesini klasik bir tonkatsu düzeninde görmek için iyi başlangıç. Ana mağazanın dönüştürülmüş eski hamam bölümü, zincir şubelerden daha karakterli bir deneyim sunar.",
      price: "Orta",
      tip: "Setlerde et kesimi ve gramaj değişir; ilk kez deniyorsanız personelden daha yağlı/yağsız tercih için yardım isteyin.",
    },
    {
      name: "Tsujihan Nihonbashi",
      area: "Nihonbashi",
      known: "Zengin deniz ürünlü kâse ve dashi ile ikinci servis",
      why:
        "Kaisen-don benzeri kâseyi önce olduğu gibi, ardından ayrılan birkaç lokmayı sıcak dashi ile yemek iki farklı doku verir. Toyosu mezadına kalkmadan deniz ürünü odaklı güçlü bir öğün isteyenlere uygun.",
      price: "Orta",
      tip: "Küçük ana mağazada sıra uzayabilir; işletmenin güncel şubelerini kontrol etmek zaman kazandırabilir.",
    },
    {
      name: "Sometaro",
      area: "Nishi-Asakusa",
      known: "Eski ev atmosferinde okonomiyaki",
      why:
        "Tatami üzerinde, masadaki ızgarada pişen okonomiyaki Tokyo'nun daha gündelik ve katılımcı yemek yüzünü gösterir. Asakusa sabahından sonra zincir dışı, karakterli bir öğle molasıdır.",
      price: "Orta",
      tip: "Izgara kokusu giysiye siner; küçük mekânda güncel çalışma düzenini ziyaret öncesi kontrol edin.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — Eski Tokyo",
      morning:
        "Senso-ji'ye açılışta gidin, Nakamise caddesini kalabalıksız yürüyün. Ardından Asakusa'nın arka sokaklarında kahvaltı.",
      afternoon:
        "Ueno Parkı ve Tokyo Ulusal Müzesi. Müze yorucu gelirse parkta yürüyüp Yanaka'ya geçin; mahalle dükkânları kapanmadan gezin.",
      evening:
        "Ameyoko'ya inip çarşıyı ve ray altındaki akşam hareketini görün; Ueno çevresinde sade bir akşam yemeğiyle günü kapatın.",
    },
    {
      title: "2. Gün — Modern Tokyo",
      morning:
        "Tsukiji Dış Çarşı'da geç kahvaltı. Tezgâh tezgâh ilerleyin, tek yerde doymayın.",
      afternoon:
        "Shibuya: kavşak, arka sokaklardaki plak ve kırtasiye dükkânları, ardından Shimokitazawa'ya kısa tren yolculuğu.",
      evening:
        "Shinjuku. Önce Metropolitan Hükümet Binası'nın ücretsiz seyir katı, sonra Omoide Yokocho'da akşam yemeği.",
    },
    {
      title: "3. Gün — Yavaş Tokyo",
      morning: "Kiyosumi-Shirakawa'da kahve ve Kiyosumi Teien bahçesi.",
      afternoon:
        "Bir semt seçip derinleşin: mimari için Nakameguro, kitap için Jimbocho, elektronik ve alt kültür için Akihabara.",
      evening:
        "Şehri yukarıdan görün, sonra otelinize yakın küçük bir lokantada sade bir akşam yemeği.",
    },
  ],

  faqs: [
    {
      q: "Tokyo kaç günde gezilir?",
      a: "Şehrin karakterini anlamak için en az 4 tam gün gerekir. 3 gün ana semtlere yeter ama tempolu geçer. 5 gün ayırırsanız Nikko ya da Kamakura gibi bir günübirlik geziyi de sığdırabilirsiniz.",
    },
    {
      q: "Tokyo metrosu karışık mı, tek başıma kullanabilir miyim?",
      a: "İlk gün karışık gelir, ikinci gün alışırsınız. Farklı şirketler aynı ağda çalıştığı için IC kart (Suica veya Pasmo) almak en pratik çözüm. İstasyon tabelaları İngilizce ve hatlar renk/numara ile kodlanmış durumda.",
    },
    {
      q: "Tsukiji kapandı mı?",
      a: "Hayır. 2018'de toptancı hal ve ton balığı mezatı Toyosu'ya taşındı, ama gezginlerin gittiği Tsukiji Dış Çarşı çok sayıda bağımsız dükkân ve lokantayla çalışmayı sürdürüyor. Her işletmenin günü ve saati farklıdır.",
    },
    {
      q: "Tokyo'da İngilizce ile idare edilir mi?",
      a: "Ulaşımda ve büyük mekânlarda evet. Küçük lokantalarda sınırlı olabilir, ancak menülerde çoğunlukla fotoğraf bulunur ve işaretle anlaşmak sorun olmaz. Birkaç kelime Japonca öğrenmek karşılığını fazlasıyla verir.",
    },
    {
      q: "Tokyo pahalı bir şehir mi?",
      a: "Konaklama ve taksi pahalı, yemek ise beklenenden ucuz. Küçük lokantalarda doyurucu bir öğün, birçok Batı Avrupa başkentinden daha uygun. Bütçeyi en çok otel ve şehirler arası tren biletleri zorlar.",
    },
    {
      q: "Japonya'da bahşiş veriliyor mu?",
      a: "Hayır. Bahşiş kültürü yoktur ve masada para bırakmak kibarca geri verilir. Hizmet ücreti bazı mekânlarda hesaba eklenir.",
    },
  ],

  relatedGuides: [
    {
      city: "Kyoto",
      anchor: "Tokyo'dan Kyoto'ya: modern ritimden eski başkente",
      description:
        "Shinkansen ile doğal sonraki durak; kalabalığı yönetmek için Kyoto'yu semt ve saat bazında planlayın.",
    },
    {
      city: "Sapporo",
      anchor: "Tokyo'dan Sapporo'ya: ayrı bir Hokkaido ayağı",
      description:
        "Uçuşla kuzeye geçin; kış iklimi, soup curry ve Hokkaido deniz ürünleri bambaşka bir Japonya katmanı açar.",
    },
  ],

  sources: [
    { name: "GO TOKYO — Getting around", url: "https://www.gotokyo.org/en/plan/getting-around/" },
    { name: "GO TOKYO — Getting to Tokyo", url: "https://www.gotokyo.org/en/plan/getting-to-tokyo/" },
    { name: "Haneda Airport train access", url: "https://tokyo-haneda.com/en/access/train/index.html" },
    { name: "Toyosu Market visitor information", url: "https://www.toyosu-market.or.jp/2026/01/30/6841/" },
    { name: "Shinjuku Tsunahachi stores", url: "https://www.tunahachi.co.jp/en/shop/index.html" },
    { name: "Maisen Aoyama", url: "https://mai-sen.com/restaurant/aoyama/" },
  ],

  volatileNote:
    "Çalışma saatleri, giriş ücretleri ve mekânların açık olup olmadığı sık değişir. Yola çıkmadan önce gideceğiniz yerlerin güncel durumunu doğrulayın.",

  reviewed: "2026-08-09",
};

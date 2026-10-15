import { CityGuide } from "./types";

/**
 * Kyoto rehberi.
 *
 * Ağustos 2026 doğrulaması: Kyoto City Tourism Association, Nishiki Market,
 * Fushimi Inari ve işletmelerin resmî kaynakları. Özel yollarla kamuya açık
 * caddeler ayrıştırıldı; evrensel bir fotoğraf cezası iddiası kullanılmadı.
 */
export const kyoto: CityGuide = {
  city: "Kyoto",
  countryCode: "JP",

  seoTitle: "Kyoto Gezi Rehberi: Tapınaklar, Gion Kuralları, Ne Yenir",
  seoDescription:
    "Kyoto gezi rehberi: Fushimi Inari ve tapınak rotaları, Gion kuralları, Nishiki Çarşısı, gerçek yemek adresleri, semtler, ulaşım, görgü ve 3 günlük plan.",
  h1: "Kyoto Gezi Rehberi",
  lede:
    "Kyoto bin yılı aşkın süre imparatorluk başkentiydi; tapınakları, bahçeleri ve tarihî mahalleleri tek bir seyahate sığmayacak kadar katmanlı. Şehri zorlaştıran şey görülecek yerin çokluğu değil, hepsinin aynı saatlerde ve aynı ulaşım koridorlarında ziyaret edilmeye çalışılması.",

  quickFacts: [
    { label: "Önerilen süre", value: "3–4 gün" },
    { label: "En iyi dönem", value: "Kasım (akçaağaç), Nisan başı (sakura)" },
    { label: "Ulaşım", value: "Tren + metro; otobüs seçici kullanım" },
    { label: "Tokyo'dan", value: "Shinkansen ile ~2 saat 15 dk" },
    { label: "Kritik kural", value: "Gion'da özel sokaklara giriş yasak" },
  ],

  sections: [
    {
      heading: "Kyoto'yu doğru gezmenin tek kuralı: saat seçimi",
      id: "saat-secimi",
      body: [
        "Kyoto'da hangi tapınağı gördüğünüzden çok, saat kaçta gördüğünüz belirleyici. Kinkaku-ji'yi öğlen on birde gezmekle sabah dokuzda gezmek iki farklı şehirde bulunmak gibidir. Aynı bahçe, aynı altın kaplama, tamamen başka bir deneyim.",
        "Bunun pratik karşılığı şu: gününüzü sabah yedi buçukta başlatın, en popüler iki yeri sabahın ilk saatlerinde bitirin, öğle saatlerini kalabalığın az olduğu semtlerde ya da bir müzede geçirin, akşamüstü tekrar dışarı çıkın. Kyoto'da öğle 11.00–15.00 arası, gezilecek yer değil dinlenilecek saat.",
        "İkinci kural: bir günde üçten fazla tapınak planlamayın. Kyoto'da tapınaklar arası mesafe uzundur ve şehir trafiği yoğundur. Üç tapınağı sindirerek görmek, altı tapınağı koşarak görmekten hem daha keyifli hem daha akılda kalıcıdır.",
      ],
    },
    {
      heading: "Gezilecek yerler: hangi tapınak, neden?",
      id: "gezilecek-yerler",
      body: [
        "Kyoto'da \"en iyi tapınak\" diye bir şey yok; birbirinden tamamen farklı deneyimler sunan yerler var. Aşağıdakileri karakterlerine göre ayırdım ki listeden seçim yapabilesiniz.",
      ],
      subsections: [
        {
          heading: "Fushimi Inari — en çok bilinen, en yanlış gezilen",
          body: [
            "Binlerce turuncu torii kapısının oluşturduğu tünel, Kyoto'nun en tanınan görüntüsü. Ana yaklaşım ve torii patikalarına günün erken ya da geç saatlerinde erişilebilmesi ziyaretinizi tamamen değiştirebilir; ofisler ve bazı tesisler ise gün boyu açık değildir.",
            "Çoğu ziyaretçi ilk birkaç yüz metredeki yoğun bölümde fotoğraf çekip geri döner. Oysa yol yukarı doğru devam ettikçe kalabalık hızla azalır; yarım saat tırmandığınızda neredeyse yalnız kalırsınız. Zirveye kadar gidiş-dönüş iki–üç saat sürer, ama yarı yola kadar çıkmak bile deneyimi değiştirmeye yeter.",
            "Gerçekten sakin bir ziyaret istiyorsanız gün doğumunda ya da akşam karanlığında gidin; tapınak kapanmıyor. Bir uyarı: işaretli dinlenme alanları dışında yeme-içme yasak, yürürken yemek de buna dahil. En yakın durak JR Nara hattında Inari; Kyoto İstasyonu'ndan yalnızca iki durak.",
          ],
        },
        {
          heading: "Kinkaku-ji ve Ginkaku-ji — altın ve gümüş",
          body: [
            "Kinkaku-ji (Altın Köşk) gölün üzerinde duran, gerçekten altın varakla kaplı bir pavyon. Gezisi kısadır — tek yönlü bir patika, yaklaşık kırk dakika. Bu yüzden açılışa yetişmek kolaydır ve kesinlikle buna değer.",
            "Ginkaku-ji (Gümüş Köşk) ise adının aksine gümüş değildir ve asıl güzelliği bahçesindedir: taraklanmış kum konileri, yosun bahçesi ve tepeye çıkan kısa bir patika. Kinkaku-ji gösterişli, Ginkaku-ji düşünceli. Zamanınız bir tanesine yetiyorsa hangi ruh halinde olduğunuza göre seçin.",
            "Ginkaku-ji'den başlayan **Felsefe Yolu**, kanal boyunca uzanan yaklaşık iki kilometrelik bir yürüyüş. Kiraz mevsiminde ve kasımda muhteşemdir; diğer zamanlarda da şehrin en huzurlu yürüyüşü olmayı sürdürür.",
          ],
        },
        {
          heading: "Arashiyama — bambu ormanından fazlası",
          body: [
            "Bambu ormanı fotoğraflarda göründüğünden çok daha kısadır ve gündüz saatlerinde omuz omuza yürünür. Buna rağmen Arashiyama'ya gitmeye değer, çünkü asıl güzellik ormanın kendisi değil çevresi: Tenryu-ji'nin bahçesi, Katsura Nehri kıyısı, tepedeki maymun parkı ve kuzeye doğru uzanan sakin Sagano bölgesi.",
            "Öneri: bambu ormanına sabah sekizden önce girin, sonra Tenryu-ji açılınca bahçeye geçin, öğleden sonrayı nehir kıyısında geçirin. Arashiyama'yı yarım gün olarak planlarsanız acele etmiş olursunuz; tam gün ayırın.",
          ],
        },
        {
          heading: "Daha az bilinenler",
          body: [
            "**Tofuku-ji** sonbaharda Kyoto'nun en etkileyici akçaağaç manzarasını sunar; köprüden bakan vadide binlerce ağaç aynı anda kızarır. **Nanzen-ji**'nin arkasındaki tuğla su kemeri, Kyoto'da hiç beklemediğiniz bir Roma etkisi taşır ve genellikle boştur.",
            "**Kurama ve Kibune**, şehrin kuzeyinde küçük bir trenle ulaşılan dağ köyleri. İkisi arasında yaklaşık iki saatlik bir orman yürüyüşü var. Kyoto'da bir gününüz fazlaysa, tapınak sayısını artırmak yerine buraya gidin.",
          ],
        },
      ],
    },
    {
      heading: "Gion ve geyko semtleri: bilmeniz gereken yeni kurallar",
      id: "gion-kurallari",
      body: [
        "Gion'da **özel mülke ve girişin yasak olduğunu belirten ara yollara girmeyin**. İşaretler Japonca ve İngilizce olabilir; bazı özel yollarda izinsiz giriş için para cezası uyarısı bulunur. Kamuya açık sokakta olmak da insanları izinsiz yakın plandan çekme, takip etme veya yollarını kesme hakkı vermez.",
        "Kısıtlamalar Gion'un tamamını kapatmaz. **Hanamikoji** araç trafiğine de açık bir kamu caddesidir; **Yasaka Tapınağı** ve çevredeki kamu yolları ziyaret edilebilir. Sınır, tabelalı özel geçitler ve konut girişleridir. Bir yolun statüsünden emin değilseniz ana rotada kalın.",
        "Bu kuralın nedeni turizm düşmanlığı değil. Yıllarca burada yaşayan ve çalışan insanlar izinsiz fotoğraflandı, takip edildi, özel mülke girildi. Geyko'lar turistik bir gösteri değil, işine giden çalışan insanlar. Sokakta biriyle karşılaşırsanız yolunu kesmeyin, fotoğraf için durdurmayın.",
        "Gion'u görmenin en iyi saati akşamüstü, hava kararmaya başlarken. Fenerler yanar, restoranlar açılır, sokak kısa bir süre için sinematik olur. Bunun için hiçbir kuralı çiğnemenize gerek yok.",
      ],
    },
    {
      heading: "Ne yenir? Kyoto mutfağı Tokyo'dan neden farklı",
      id: "ne-yenir",
      body: [
        "Kyoto denize uzak, dağlarla çevrili bir şehir. Mutfağı da bu coğrafyanın üzerine kurulmuş: deniz ürünü değil sebze, tofu, turşu ve dashi merkezli. Tokyo'nun hızlı ve doyurucu mutfağından sonra Kyoto ilk başta hafif gelebilir; birkaç öğün sonra ne kadar incelikli olduğunu fark edersiniz.",
        "**Kaiseki**, Japon mutfağının en resmî hâli: mevsime göre sıralanmış çok tabaklı bir menü. Pahalıdır ve rezervasyon ister. Bütçeniz elverişliyse Kyoto, bunu deneyeceğiniz doğru şehir.",
        "**Shojin ryori** ise tapınak mutfağı — tamamen bitkisel, sadeliği amaçlayan bir gelenek. Vejetaryen veya vegan iseniz Japonya'da işiniz genelde zordur; Kyoto bu konuda ülkenin en kolay şehri.",
        "Denemeniz gerekenler: **yudofu** (sıcak tofu, özellikle kışın), **obanzai** (ev usulü mevsim mezeleri), **yuba** (tofu kaymağı), **matcha** tatlıları ve Kyoto'nun ünlü turşuları **tsukemono**. Uji bölgesi matcha'nın Japonya'daki merkezi; şehirde içtiğiniz çayın kalitesi bu yüzden yüksek.",
      ],
    },
    {
      heading: "Nishiki Çarşısı: bir kural bilmeden gitmeyin",
      id: "nishiki",
      body: [
        "\"Kyoto'nun mutfağı\" denen bu üstü kapalı çarşı, beş yüz metre boyunca uzanan dar bir sokak. Turşudan tofuya, taze deniz ürününden mutfak bıçağına kadar her şey burada.",
        "Bilmeniz gereken kural şu: **yürürken yemek istenmiyor.** Çarşı esnafı ziyaretçilerden, satın aldıkları şeyi aldıkları dükkânın önünde ya da içinde yemelerini rica ediyor. Bunun nedeni hem yere düşen yiyeceklerin dar sokağı kayganlaştırması hem de elde taşınan şişlerin kalabalıkta insanlara çarpması. Kural mantıklı ve uyulması kolay: alın, kenara çekilin, orada yiyin.",
        "Çarşı öğleden sonra hareketlenir ve akşamüstü birçok dükkân kapanmaya başlar. Sabah gitmek daha rahat, ama bazı tezgâhlar geç açar. En dengeli saat öğleden hemen önce.",
      ],
    },
    {
      heading: "Nerede kalınır? Semt seçimi",
      id: "nerede-kalinir",
      body: [
        "**Kyoto İstasyonu çevresi** — Ulaşım açısından en pratik seçenek. Shinkansen, otobüs terminali ve havalimanı bağlantısı ayağınızın altında. Karşılığında bölge ruhsuz; akşam yürüyüşü yapacağınız bir yer değil.",
        "**Gion / Higashiyama** — En atmosferik bölge. Ahşap evler, dar sokaklar, akşam fenerleri. Fiyatlar yüksek, ama Kyoto'ya bir kez geliyorsanız burada kalmak deneyimi değiştirir.",
        "**Kawaramachi / Pontocho** — Şehrin yeme-içme merkezi. Restoranlar, barlar ve Nishiki yürüme mesafesinde. Gece hareketli, gündüz merkezî.",
        "**Arashiyama** — Şehirden uzak, sakin, doğayla iç içe. Kyoto'da ikinci kez bulunuyorsanız ya da huzur arıyorsanız iyi tercih; ilk ziyarette merkeze uzak kalır.",
        "Bir öneri: mümkünse bir gece **machiya**'da kalın. Bunlar dar cepheli, uzun ve derin geleneksel Kyoto evleri; birçoğu restore edilip konaklamaya açıldı. Otel odasından çok daha fazlasını anlatır.",
      ],
    },
    {
      heading: "Ulaşım: tren, metro ve otobüsü dengelemek",
      id: "ulasim",
      body: [
        "Kyoto'nun metro ağı iki hattan oluşur, bu yüzden turistik rotalarda otobüsler önemli rol oynar. Kinkaku-ji ve Gion yönündeki araçlar yoğun sezonda dolabilir ve trafikten etkilenebilir. Büyük bavulla binmek hem sizin hem diğer yolcuların hareketini zorlaştırır; istasyon ve otel bagaj hizmetlerini değerlendirin.",
        "Pratik strateji: mümkün olan her yerde **tren ve metroyu** tercih edin. Fushimi Inari, Arashiyama ve Uji trenle gidilir. Otobüsü yalnızca başka seçenek olmadığında ve mümkünse gün ortasında değil sabah erken kullanın.",
        "Kyoto aynı zamanda **bisiklet için ideal** bir şehir: büyük ölçüde düz ve ızgara planlı. Merkezde kalıyorsanız bir gün bisiklet kiralamak, otobüs beklemekten hem hızlı hem keyifli çıkar.",
        "Bilet ve paso seçenekleri son yıllarda değişti; günlük/çok günlük paso alacaksanız kapsamını ve fiyatını gitmeden önce güncel kaynaktan doğrulayın. IC kartınız (Suica/Pasmo dahil) Kyoto'da da geçer.",
      ],
    },
    {
      heading: "Kaç gün kalınmalı, Osaka'dan günübirlik olur mu?",
      id: "kac-gun",
      body: [
        "Kyoto için **en az 3 tam gün** ayırın. İki gün ana noktaları görmeye yeter ama şehri koşarak gezmiş olursunuz. Dört gün, Nara ya da Uji gibi bir günübirlik geziyi de rahatça sığdırır.",
        "\"Osaka'da kalıp Kyoto'ya günübirlik gidilir mi?\" sorusunun cevabı teknik olarak evet — tren yarım saat sürer. Ama Kyoto'nun en iyi saatleri sabahın erken ve akşamın geç saatleri; günübirlik gitmek tam da bu iki pencereyi kaçırmak demek. Bütçe zorluyorsa yapın, ama tercihen Kyoto'da kalın.",
      ],
    },
    {
      heading: "Ne zaman gidilir?",
      id: "ne-zaman",
      body: [
        "**Kasım** Kyoto'nun zirve ayı. Akçaağaçlar kızarır, hava serin ve kuru olur. Karşılığında şehir yılın en kalabalık dönemini yaşar ve oteller aylar öncesinden dolar.",
        "**Nisan başı** kiraz çiçeği dönemi; muhteşem ama tarihi yıldan yıla kayar ve pencere bir haftadır. Bu tarihe kilitlenerek bilet almak risklidir.",
        "**Aralık–şubat** en az tahmin edilen ama en ödüllendirici dönem: kalabalık dağılır, tapınak bahçeleri sisli ve sessiz olur, nadiren kar yağdığında Kinkaku-ji'nin görüntüsü unutulmaz. Soğuğa hazırlıklı gidin.",
        "**Haziran'daki yağmur mevsimi** ve **ağustos sıcağı** en zor iki dönem. Yaz gidiyorsanız programınızı sabah ve akşama yayın, öğleyi kapalı mekânda geçirin.",
      ],
    },
    {
      heading: "Yerel görgü ve sık yapılan hatalar",
      id: "ipuclari",
      body: [
        "**Tapınak bahçelerinde sessizlik beklenir.** Kyoto'da tapınaklar turistik alan değil, hâlâ ibadet edilen yerler. Yüksek sesle konuşmak fark edilir.",
        "**Fotoğraf yasağı tabelalarına uyun.** Birçok tapınağın iç mekânında fotoğraf yasaktır; kural açıkça yazılmıştır.",
        "**Kimono kiralarken saygılı olun.** Yaygın ve hoş karşılanan bir aktivite, ama giyildiği yerin bir kostüm partisi olmadığını unutmayın.",
        "**Her şeyi bir güne sığdırmaya çalışmayın.** Kyoto'da en sık yapılan hata bu. Sekiz tapınak gezip hiçbirini hatırlamamaktansa üç tapınakta oturup beklemek çok daha iyi.",
        "**Nakit bulundurun.** Küçük tapınaklarda giriş ücreti ve omamori satışı çoğunlukla nakittir.",
      ],
    },
  ],

  places: [
    {
      name: "Omen Ginkaku-ji",
      area: "Ginkaku-ji",
      known: "Kalın udon, mevsimlik sebzeler ve susamlı sos",
      why:
        "Felsefe Yolu veya Ginkaku-ji sonrasında, erişteyi sebze ve baharatlarla kendi kâsenizde tamamladığınız sade ama Kyoto'ya özgü bir öğün sunar. Ağır bir tapınak günü için iyi dengedir.",
      price: "Orta",
      tip: "Ginkaku-ji ve Pontocho şubelerinin rezervasyon düzeni farklıdır; ziyaret edeceğiniz şubeyi resmî listeden kontrol edin.",
    },
    {
      name: "Shigetsu",
      area: "Tenryu-ji · Arashiyama",
      known: "Tapınak tarafından işletilen shojin ryori",
      why:
        "Tenryu-ji bahçesiyle aynı bağlamda, et ve balık kullanmadan hazırlanan çok parçalı Zen tapınak mutfağını deneyimletir. Vejetaryen bir yedek değil, başlı başına tarihî bir yemek geleneğidir.",
      price: "Yüksek",
      tip: "Önceden rezervasyon güçlü biçimde önerilir; tapınak girişi ile yemek rezervasyonu aynı işlem değildir.",
    },
    {
      name: "Honke Tagoto",
      area: "Sanjo Teramachi",
      known: "1868'den beri Kyoto usulü soba ve mevsim yemekleri",
      why:
        "Nishiki ve Teramachi yürüyüşünün ortasında, köklü bir Kyoto lokantasında soba ile mevsimlik setleri aynı menüde karşılaştırma imkânı verir. Yalnızca geçmişi için değil, 2026'da çalışan ve güncel menüsünü yayımlayan gerçek bir alternatif olduğu için listede.",
      price: "Orta",
      tip: "Sanjo Teramachi adresini kullanın; güncel tatil gününü ve son sipariş saatini resmî siteden kontrol edin.",
    },
    {
      name: "Izuu",
      area: "Gion",
      known: "1781'den beri Kyoto usulü saba-zushi",
      why:
        "Denizden uzak Kyoto'da uskumrunun tuz ve sirkeyle korunup pirinçle buluşmasını gösterir. Kelp sargısı servis biçiminin parçasıdır; nasıl yenmesi gerektiğini personelden sormak deneyimi kolaylaştırır.",
      price: "Yüksek",
      tip: "Küçük ve köklü bir işletmedir; güncel servis ve bekleme durumunu önceden doğrulayın.",
    },
    {
      name: "Nishiki Çarşısı",
      area: "Nakagyo",
      known: "Turşu, tofu, yuba ve mutfak ürünleri",
      why:
        "Tek bir restoran değil, Kyoto malzemelerini karşılaştırma rotasıdır. Bir üründe uzmanlaşan dükkânlardan küçük porsiyon alın; çarşıyı beş farklı şişi elde taşıma yarışına çevirmeyin.",
      price: "Ekonomik",
      tip: "Satın aldığınızı yürürken değil, dükkânın gösterdiği yerde yiyin; ambalajı işletmenin yönlendirdiği biçimde atın.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — Doğu Kyoto",
      morning:
        "Fushimi Inari'ye gün doğarken gidin, yarı yola kadar tırmanıp inin. Ardından JR ile merkeze dönüp geç kahvaltı.",
      afternoon:
        "Kiyomizu-dera çevresi ve Higashiyama'nın taş döşeli yokuşları. Kalabalıktan bunalırsanız arka sokaklara sapın.",
      evening:
        "Akşamüstü Gion'da yürüyüş (özel sokaklara girmeden), ardından Pontocho'da akşam yemeği.",
    },
    {
      title: "2. Gün — Kuzey ve batı",
      morning: "Kinkaku-ji açılışta. Kırk dakikada gezilir; erken gitmek her şeyi değiştirir.",
      afternoon:
        "Arashiyama: bambu ormanı, Tenryu-ji bahçesi ve Katsura Nehri kıyısı. Acele etmeyin.",
      evening: "Merkeze dönüp Nishiki çevresinde sakin bir akşam yemeği.",
    },
    {
      title: "3. Gün — Yavaş Kyoto",
      morning: "Ginkaku-ji ve ardından Felsefe Yolu boyunca yürüyüş.",
      afternoon:
        "Nanzen-ji ve su kemeri; sonbaharsa Tofuku-ji'yi bu yarım güne alın.",
      evening:
        "Bir machiya'da ya da obanzai sunan küçük bir lokantada mevsim mezeleriyle kapanış.",
    },
  ],

  practicalHeading: "Kyoto'ya gitmeden bilinmesi gerekenler",
  practicalTips: [
    {
      title: "En ünlü iki durağı öğleden önce bitirin",
      body:
        "Fushimi Inari, Kinkaku-ji ve Arashiyama'nın ikisini aynı sabaha koymayın; coğrafi olarak ayrılar. Birini açılışa/gün doğumuna alın, öğleni daha sakin bir semt veya müzeye ayırın.",
    },
    {
      title: "Gion bütünüyle yasak bölge değil",
      body:
        "Hanamikoji gibi kamu yollarında tabelalara uyarak yürüyebilirsiniz. Özel geçitlere girmeyin; geyko ve maikoları durdurmayın, takip etmeyin veya izinsiz yakın plandan çekmeyin.",
    },
    {
      title: "Nishiki'de yürürken yemeyin",
      body:
        "Satın aldığınızı dükkânın içinde ya da gösterdiği noktada bitirin. Dar geçitte yiyecek ve çöp taşımak yerine birkaç uzman tezgâhta küçük porsiyonlar seçin.",
    },
    {
      title: "Bavulu turistik otobüse taşımayın",
      body:
        "Otel veya istasyon bagaj hizmeti, kalabalık otobüslerde büyük valizle ilerlemekten daha rahattır. Fushimi Inari, Arashiyama ve Uji için otobüs yerine treni kullanın.",
    },
    {
      title: "Tapınak yemeği ile tapınak girişi ayrıdır",
      body:
        "Tenryu-ji içindeki Shigetsu için menüye göre rezervasyon gerekebilir; yemek rezervasyonu bahçe girişini kapsamaz. İki işlemi ve saatlerini ayrı doğrulayın.",
    },
    {
      title: "Eski restoran listelerine güvenmeyin",
      body:
        "Honke Owariya 11 Ocak 2026'dan itibaren soba servisini uzun süreli kapattı ve şekerleme satışını sonlandırdı. Bu rehberde onun yerine faal Honke Tagoto öneriliyor.",
    },
  ],

  faqs: [
    {
      q: "Kyoto kaç günde gezilir?",
      a: "En az 3 tam gün önerilir. 2 gün ana noktalara yeter ama tempolu olur; 4 gün Nara veya Uji gibi bir günübirlik geziye de imkân tanır.",
    },
    {
      q: "Gion'da fotoğraf çekmek yasak mı?",
      a: "Gion'un tamamında genel fotoğraf yasağı yoktur. Kamuya açık sokaklarda tabelalara uyun; özel yollara ve mülke girmeyin. Geyko veya maikoları takip etmek, yollarını kesmek ya da izinsiz yakın plandan çekmek kabul edilmez.",
    },
    {
      q: "Fushimi Inari'ye giriş ücretli mi, ne zaman gidilmeli?",
      a: "Ana tapınak alanı için giriş ücreti yoktur; yaklaşım ve torii patikaları erken/geç saatte erişilebilir, ancak ofis ve tesis saatleri ayrıdır. Kalabalıktan kaçmak için gün doğumu iyi seçimdir. En yakın durak JR Nara hattındaki Inari'dir.",
    },
    {
      q: "Kyoto'da otobüs mü tren mi kullanmalı?",
      a: "Mümkün olan her yerde tren ve metro. Kyoto'nun turistik otobüs hatları sezonda çok kalabalık olur ve trafikte bekler. Fushimi Inari, Arashiyama ve Uji zaten trenle gidilir.",
    },
    {
      q: "Nishiki Çarşısı'nda yürürken yemek yenir mi?",
      a: "Çarşı yönetimi yürürken yememenizi ister. Aldığınız yiyeceği satın aldığınız dükkânın gösterdiği yerde veya içinde bitirin; bu yaklaşım dar geçidi güvenli ve temiz tutar.",
    },
    {
      q: "Kyoto'da vejetaryen yemek bulmak zor mu?",
      a: "Japonya geneline göre en kolay şehir. Tapınak mutfağı shojin ryori tamamen bitkiseldir; yudofu, yuba ve obanzai da büyük ölçüde sebze ağırlıklıdır. Yine de dashi (balık suyu) kullanımı yaygın olduğu için vegan iseniz sormakta fayda var.",
    },
  ],

  relatedGuides: [
    {
      city: "Nara",
      anchor: "Kyoto'dan Nara'ya: bir günlük eski başkent rotası",
      description:
        "Kintetsu veya JR ile kolay ulaşım; geyikler, Todai-ji ve orman içindeki Kasuga Taisha aynı yürüyüşte birleşir.",
    },
    {
      city: "Osaka",
      anchor: "Kyoto'dan Osaka'ya: akşamı mutfak şehrinde sürdürün",
      description:
        "Kısa tren bağlantısıyla tapınak sessizliğinden Namba ve Shinsekai'nin gündelik enerjisine geçin.",
    },
  ],

  sources: [
    { name: "Kyoto responsible travel", url: "https://kyoto.travel/en/responsible-travel" },
    { name: "Gion visitor manners", url: "https://kyoto.travel/en/responsible-travel/gion-manner-message-from-southern-gionmachi/" },
    { name: "Fushimi Inari visitor requests", url: "https://inari.jp/en/request/" },
    { name: "Nishiki Market manners", url: "https://www.kyoto-nishiki.or.jp/en/manner/" },
    { name: "Shigetsu at Tenryu-ji", url: "https://www.tenryuji.com/en/shigetsu/" },
    { name: "Omen shops", url: "https://omen.co.jp/pages/shops" },
    { name: "Honke Tagoto", url: "https://tagoto.com/eng" },
    { name: "Honke Owariya closure notice", url: "https://honke-owariya.co.jp/" },
  ],

  volatileNote:
    "Tapınak giriş ücretleri, açılış saatleri, otobüs/paso kapsamı ve mevsimlik özel açılışlar değişir. Ayrıca sonbahar ve kiraz döneminde bazı tapınaklar özel gece ziyaretleri düzenler. Yola çıkmadan önce güncel bilgiyi doğrulayın.",

  reviewed: "2026-08-09",
};

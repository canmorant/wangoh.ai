import { CityGuide } from "./types";

/**
 * Hiroşima rehberi.
 *
 * Ağustos 2026 doğrulaması: Hiroshima'nın resmî turizm portalı, müze ziyaretçi
 * rehberi, Miyajima resmî haritası ve işletme kanalları. Müzenin yeni 07:30
 * açılışı ve rezervasyon gerektirebilen zaman dilimleri hesaba katıldı.
 */
export const hiroshima: CityGuide = {
  city: "Hiroshima",
  countryCode: "JP",

  seoTitle: "Hiroşima Gezi Rehberi: Barış Parkı, Miyajima ve Yemek",
  seoDescription:
    "Hiroşima gezi rehberi: Barış Müzesi, Miyajima ve gelgit planı, kale durumu, gerçek yemek adresleri, tramvay ulaşımı, konaklama vergisi ve 2 günlük rota.",
  h1: "Hiroşima Gezi Rehberi",
  lede:
    "Hiroşima'yı yalnızca 1945'le anmak, şehre haksızlık etmek olur. Ama 1945'i atlayarak gezmek de mümkün değil. Bu rehber ikisini birlikte ele alıyor: hatırlamayı hak eden bir tarih ve bugün gerçekten yaşayan, yemeği ve nehirleriyle rahat bir şehir.",

  quickFacts: [
    { label: "Önerilen süre", value: "1,5–2 gün (Miyajima dahil)" },
    { label: "Şehir içi ulaşım", value: "Tramvay (streetcar) ağırlıklı" },
    { label: "Miyajima", value: "Feribotla ~10 dakika" },
    { label: "Osaka'dan", value: "Shinkansen ile ~1,5 saat" },
    { label: "Yerel yemek", value: "Hiroşima usulü okonomiyaki, istiridye" },
  ],

  sections: [
    {
      heading: "Barış Anıtı Parkı'nı nasıl gezmeli?",
      id: "baris-parki",
      body: [
        "Şehrin merkezinde, iki nehrin arasındaki delta üzerinde kurulu geniş bir park. Burası bir turistik durak değil, bir anma alanı ve ziyaretinizi buna göre planlamak hem daha saygılı hem daha anlamlı olur.",
        "**Gezi sırası önerisi:** önce **A-Bomb Dome** (Genbaku Dome) ile başlayın. Patlamanın merkezine çok yakın olmasına rağmen iskeleti ayakta kalan bu bina, bilinçli olarak onarılmadan bırakıldı. Sonra parkın içinden güneye doğru yürüyün: Çocuk Barış Anıtı, Anıt Höyük ve Barış Alevi sizi doğal olarak müzeye götürür.",
        "**Müzeyi park yürüyüşünün sonunda görün.** Barış Anıtı Müzesi güncel resmî düzende 07:30'da açılıyor; kapanış mevsime göre değişir. Bazı yoğun saat veya dönemlerde önceden çevrim içi rezervasyon gerekir, diğer zamanlarda da çevrim içi bilet sıra riskini azaltır. Müzenin içeriği ağırdır: kişisel eşyalar, tanıklıklar ve fotoğraflar. Aceleye getirmeyin; en az bir buçuk–iki saat ayırın.",
        "**Çocuklu ailelere not:** müzenin bazı bölümleri küçük çocuklar için sarsıcı olabilir. Parkın kendisi ve Çocuk Barış Anıtı, Sadako'nun hikâyesiyle birlikte, daha uygun bir giriş noktası sunar.",
        "Ziyaretten sonra hemen bir sonraki durağa koşmayın. Nehir kıyısında oturup biraz beklemek, çoğu ziyaretçinin ihtiyaç duyduğu bir aradır.",
      ],
    },
    {
      heading: "Miyajima ve yüzen torii",
      id: "miyajima",
      body: [
        "Hiroşima'ya gelip Miyajima'ya (resmî adıyla Itsukushima) gitmemek, gezinin yarısını atlamak demek. Ada, şehirden trenle ve ardından yaklaşık **on dakikalık bir feribot yolculuğuyla** ulaşılıyor; iki ayrı şirket sefer yapıyor.",
        "**Bilmeniz gereken yeni bir uygulama var:** adaya artık 100 ¥'lik bir **ziyaretçi vergisi** uygulanıyor ve bu tutar feribot biletinize otomatik olarak ekleniyor. Ayrıca ödeme yapmanız gerekmiyor. Toplanan gelir atık yönetimi ve aşırı turizmin baskısını azaltacak önlemler için kullanılıyor.",
        "**Yüzen torii'nin sırrı gelgit.** Kapının suyun üzerinde duruyormuş gibi göründüğü meşhur görüntü ancak **gelgit yüksekken** oluşur. Gelgit alçakken kapının altına kadar yürüyebilirsiniz — bu da güzel bir deneyim ama beklediğiniz fotoğraf değil. Ziyaret saatinizi gelgit çizelgesine göre seçin; ikisini birden görmek isterseniz adada birkaç saat kalın.",
        "**Itsukushima Tapınağı**'nın ayrı bir giriş ücreti var. Tapınağın kendisi de deniz üzerinde kazıklar üzerine kurulu; gelgit yükseldiğinde tapınak da yüzüyormuş gibi görünür.",
        "Adada ayrıca **Misen Dağı** var: teleferikle büyük bölümü çıkılıyor, zirveye son kısım yürüyüş gerektiriyor. Berrak bir günde İç Deniz manzarası olağanüstü. Yarım gün fazladan zamanınız varsa buraya harcayın.",
        "Adada **evcil olmayan geyikler** dolaşıyor. Nara'dakinin aksine burada geyiklere yiyecek vermek istenmiyor; kâğıt ve harita gibi şeyleri de çantanızda tutun, geyikler bunları yemeye çalışıyor.",
      ],
    },
    {
      heading: "İkisini bir güne sığdırmak mümkün mü?",
      id: "planlama",
      body: [
        "Teknik olarak evet, ama sıkışık olur. İşleyen kurgu şu: **07:30 açılışına yakın Barış Parkı'nda olun**, park ve müze için sabahı ayırın, öğleden sonra Miyajima'ya geçin ve adada akşamüstü kalın. Müzenin o günkü rezervasyon gereken zaman dilimlerini önceden kontrol edin.",
        "Dürüst tavsiye: Hiroşima'da **bir gece kalın**. Bunun iki nedeni var. Birincisi, Barış Parkı'ndan çıkıp doğrudan feribota koşmak duygusal olarak yorucu. İkincisi, Miyajima günübirlikçiler ayrıldıktan sonra, akşamüstü ve sabah erken saatlerde bambaşka bir yer oluyor — sessiz, boş ve çok daha güzel.",
        "Adada konaklamak da bir seçenek. Miyajima'daki geleneksel hanlarda kalmak pahalıdır ama akşam ve sabah adayı neredeyse kendinize saklamanızı sağlar.",
      ],
    },
    {
      heading: "Ne yenir? Hiroşima mutfağı",
      id: "ne-yenir",
      body: [
        "**Hiroşima usulü okonomiyaki**, Osaka'dakiyle aynı yemek değil ve bunu yerel halka söylerseniz ciddi bir tartışma başlatabilirsiniz. Osaka'da malzemeler hamurla karıştırılır; Hiroşima'da ise **katman katman** dizilir: ince bir hamur tabakası, üzerine bol lahana, sonra domuz eti ve — ayırt edici kısım — **yakisoba erişte katmanı**, en üstte de yumurta. Sonuç çok daha yüksek ve daha doyurucu bir tabaktır.",
        "Şehirde bu işe adanmış çok katlı binalar bile var; onlarca küçük tezgâh yan yana çalışıyor. Sacın karşısına oturup pişerken izlemek deneyimin parçası.",
        "**İstiridye (kaki)** şehrin ikinci imzası. Hiroşima Körfezi Japonya'nın en büyük istiridye üreticilerinden. Kışın — kabaca kasımdan marta — mevsimi. Izgara, kızarmış ya da çiğ olarak bulabilirsiniz; Miyajima'da ada sokaklarında ızgara istiridye satan tezgâhlar var.",
        "Üçüncü klasik **tsukemen**: soğuk erişteyi acılı sosa batırarak yenen bir tür. Hiroşima tarzı belirgin şekilde acılıdır ve acı seviyesini seçebilirsiniz.",
      ],
    },
    {
      heading: "Barış Parkı dışında şehirde ne görülür?",
      id: "sehirde-diger",
      body: [
        "Hiroşima'nın tarihini yalnızca tek bir güne sabitlememek için parkın kuzey ve doğusuna da zaman ayırın. **Shukkeien**, 1620'de bir daimyo bahçesi olarak kurulan; gölet, adacık, köprü ve küçük vadileri minyatür bir manzara içinde birleştiren yürüyüş bahçesidir. 1945'te ağır biçimde yıkıldıktan sonra restore edilmesi, kentin süreklilik hikâyesini sessiz ama güçlü biçimde anlatır. İstasyona yakın olduğu için varış veya ayrılış gününe yerleştirmek kolaydır; hızlı fotoğraf durağı değil, en az bir saatlik sakin yürüyüş olarak düşünün.",
        "**Hiroşima Kalesi** için eski rehberlere dikkat edin. Yeniden inşa edilen ana kule, yapısal yıpranma nedeniyle 22 Mart 2026'da ziyarete kapandı; dışarıdan görülebiliyor ancak kule müzesine çıkılamıyor. Hendekler, taş duvarlar, Gokoku Tapınağı ve yeniden yapılan Ninomaru yapıları çevrede gezilebilir. Sırf panoramik manzara için gitmeyin; şehir planının kale çevresinde nasıl geliştiğini merak ediyorsanız ekleyin.",
        "Daha sakin yarım gün için JR hattıyla ulaşılan **Mitaki-dera**, üç şelale, taş Buda figürleri ve orman içinde kırmızı bir pagoda sunar. Sonbaharda özellikle güzeldir ama her mevsimde merkezden hızlı bir doğa kaçışıdır. Patikalar eğimli ve yağmurda kaygan olabilir; Barış Parkı ile aynı sıkışık sabaha değil, ikinci günün esnek bölümüne koyun.",
        "Sanatla ilgileniyorsanız Shukkeien'in yanındaki Hiroshima Prefectural Art Museum, kapalı hava yedeğidir. Sergi programı değiştiği için koleksiyon vaadiyle değil, güncel sergiyi kontrol ederek karar verin.",
      ],
    },
    {
      heading: "Şehir içi ulaşım: tramvaylar",
      id: "ulasim",
      body: [
        "Hiroşima, Japonya'da tramvay ağını koruyan az sayıdaki büyük şehirden biri ve bu tramvaylar şehrin karakterinin parçası. Bazı araçlar onlarca yıllık; bir kısmı savaştan sağ çıkmış araçlar olarak hâlâ hizmette.",
        "Turistik olarak ihtiyacınız olan hemen her yer tramvay ağında. Hiroşima İstasyonu'ndan Barış Parkı'na ve Miyajima feribot iskelesine giden hatlar var. Ödeme genellikle inerken yapılır ve IC kartlar geçerlidir.",
        "Şehir aynı zamanda **bisiklet dostu** — delta üzerine kurulu olduğu için düz ve nehir kıyıları boyunca keyifli güzergâhlar var.",
      ],
    },
    {
      heading: "Nerede kalınır?",
      id: "nerede-kalinir",
      body: [
        "**Hiroşima İstasyonu çevresi** — Shinkansen bağlantısı ve tramvay hatlarının başlangıcı. Pratik ama karaktersiz.",
        "**Hondori / Kamiyacho** — Şehrin merkezî alışveriş ve yeme-içme bölgesi; Barış Parkı yürüme mesafesinde. İlk kez gelenler için en dengeli tercih.",
        "**Miyajima adası** — Pahalı ama özel. Günübirlikçiler gittikten sonra adayı sessiz hâlde yaşamak isteyenler için.",
        "Hiroşima genel olarak Tokyo ve Kyoto'dan **belirgin şekilde uygun fiyatlı** olabilir. Ancak 1 Nisan 2026'dan beri Hiroshima Prefecture içindeki uygun konaklamalarda kişi başı/gece **200 ¥ konaklama vergisi** uygulanıyor; bazı düşük fiyatlı ve muaf konaklamalar kapsam dışında. Rezervasyon fiyatında dahil olup olmadığını kontrol edin.",
      ],
    },
    {
      heading: "Ne zaman gidilir?",
      id: "ne-zaman",
      body: [
        "**Sonbahar (ekim–kasım)** en dengeli dönem: hava serin, Miyajima'da akçaağaç vadisi renklenir, nem düşer.",
        "**Kış (kasım–mart)** istiridye mevsimi. Şehir soğuk ama Hokkaido gibi sert değil; yemek için gelecekseniz doğru zaman.",
        "**6 Ağustos** anma günü. Şehirde tören yapılır ve akşam nehre fenerler bırakılır. Çok anlamlı ama çok kalabalıktır; bu tarihte gelecekseniz konaklamayı aylar öncesinden ayırtın.",
        "**Yaz** nemli ve sıcak geçer; Miyajima'da tırmanış planlıyorsanız sabah erken çıkın.",
      ],
    },
    {
      heading: "Ziyaret görgüsü ve pratik notlar",
      id: "ipuclari",
      body: [
        "**Barış Parkı'nda ölçülü davranın.** Burası fotoğraf çekilebilen bir yer, ama anıtların önünde poz vermek yerine sessizce dolaşmak yerinde olur. Anıt Höyük gerçek bir mezar alanıdır.",
        "**Müzeye zaman bırakın.** En sık yapılan hata müzeyi bir saate sıkıştırmak. İki saat ayırın ve sonrasında hiçbir plan koymayın.",
        "**Gelgit çizelgesini kontrol edin.** Miyajima ziyaretinizi buna göre planlamak, torii fotoğrafını çekip çekemeyeceğinizi belirler.",
        "**Miyajima'da geyiklere yem vermeyin.** Nara'dan farklı olarak burada besleme istenmiyor; ayrıca haritanızı ve biletinizi korumaya alın.",
        "**Şehri sadece bir durak olarak görmeyin.** Hiroşima'nın nehir kıyıları, kahve kültürü ve akşamları oldukça keyifli; yalnızca müze için gelip aynı gün ayrılmak eksik bir ziyaret olur.",
      ],
    },
  ],

  places: [
    {
      name: "Micchan Sohonten Hatchobori",
      area: "Naka-ku (merkez)",
      known: "Klasik Hiroshima usulü okonomiyaki",
      why:
        "İnce hamur, bol lahana, domuz eti, erişte ve yumurtanın katmanlandığı şehir stilini köklü bir işletmede görmek için güçlü başlangıç. Sacın yakınında oturursanız yapım sırasını açıkça izlersiniz.",
      price: "Orta",
      tip: "Hatchobori ana mağazasıyla diğer şubeleri karıştırmayın; güncel sıra ve çalışma düzenini resmî siteden kontrol edin.",
    },
    {
      name: "Okonomimura",
      area: "Shintenchi",
      known: "Bir binada çok sayıda okonomiyaki tezgâhı",
      why:
        "Tek bir restoran değil, farklı ustaların küçük sac tezgâhlarını bir araya getiren yapı. Rezervasyonsuz, merkezî ve seçenekli olduğu için ilk akşam kullanışlıdır; boş sandalye bulduğunuz tezgahta oturmak keşfin parçasıdır.",
      price: "Ekonomik",
      tip: "Kat ve tezgâh saatleri aynı olmayabilir. Erişte olarak soba mı udon mu istediğinizi siparişte belirtin.",
    },
    {
      name: "Anagomeshi Ueno",
      area: "Miyajimaguchi",
      known: "Izgara deniz yılanbalığı ve pirinç",
      why:
        "Feribota binmeden önce veya adadan dönüşte, tatlı-tuzlu sosla ızgaralanan anago ve aromalı pirinç için gidilir. Miyajima hattının en karakterli tek tabak öğünlerinden biridir.",
      price: "Yüksek",
      tip: "Çok popüler ve küçük bir adrestir; sıra, paket ve güncel servis düzenini resmî kanaldan kontrol edin.",
    },
    {
      name: "Kakiya",
      area: "Miyajima Omotesando",
      known: "Yalnızca istiridye üzerine uzmanlaşan ada restoranı",
      why:
        "Izgara, kızarmış ve farklı pişirme biçimlerindeki Hiroshima istiridyesini tek yerde karşılaştırmak için gidilir. Ada tezgâhından ayaküstü tek parça almak yerine ürünün dokusuna odaklanan gerçek bir öğün sunar.",
      price: "Orta",
      tip: "Ürün mevsimseldir ve menü değişebilir. Çiğ ürün tüketiminde kendi sağlık koşullarınızı dikkate alın.",
    },
    {
      name: "Bakudan-ya",
      area: "Shintenchi / güncel şubeler",
      known: "Soğuk erişte ve acılı Hiroshima tsukemen sosu",
      why:
        "Susam, biber yağı ve deniz ürünü temelli dashi içeren sosa soğuk erişteyi batırarak şehrin okonomiyaki dışındaki hızlı yemeğini tanıtır. Lahana ve taze soğan dokuyu hafifletir.",
      price: "Ekonomik",
      tip: "Acı seviyesini ilk denemede ölçülü seçin; şube durumunu güncel resmî/şehir turizm listesinden doğrulayın.",
    },
    {
      name: "Kanawa",
      area: "Otemachi / şehir içi şubeler",
      known: "Hiroshima istiridyesi ve Seto İç Denizi mutfağı",
      why:
        "Tek ürünlü sokak tadımından daha kapsamlı bir istiridye öğünü isteyenlere uygun. Pişmiş ve çiğ hazırlıkları karşılaştıran menüler, üretim bölgesinin mutfak çeşitliliğini gösterir.",
      price: "Yüksek",
      tip: "Birden fazla restoranı vardır; manzara, menü ve rezervasyon koşulu şubeye göre değişir.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — Barış Parkı ve şehir",
      morning:
        "A-Bomb Dome ile başlayın, park boyunca güneye yürüyün, müzeye 07:30 açılışına yakın girin. Gerekli zaman dilimi rezervasyonunu önceden tamamlayın.",
      afternoon:
        "Nehir kıyısında ara verin, ardından Hondori arkatında şehrin gündelik hâlini gezin.",
      evening:
        "Okonomimura'da Hiroşima usulü okonomiyaki; kışsa yanına ızgara istiridye.",
    },
    {
      title: "2. Gün — Miyajima",
      morning:
        "Erken trenle feribot iskelesine, ilk feribotlarla adaya geçin. Gelgit yüksekse önce torii ve Itsukushima Tapınağı.",
      afternoon:
        "Misen Dağı'na teleferik ve zirve yürüyüşü; berrak günde İç Deniz manzarası.",
      evening:
        "Günübirlikçiler ayrıldıktan sonra ada sessizleşir — mümkünse son feribotu geç saate bırakın.",
    },
  ],

  practicalHeading: "Hiroşima'ya gitmeden bilinmesi gerekenler",
  practicalTips: [
    {
      title: "Müze için sabah saatini seçin",
      body:
        "Barış Anıtı Müzesi 07:30'da açılıyor; bazı yoğun dönem ve saatlerde çevrim içi rezervasyon gerekir. 8–16 Ağustos 2026 için ziyaretler prensipte rezervasyonludur; bilet ekranını yola çıkmadan kontrol edin.",
    },
    {
      title: "Miyajima'yı gelgit saatine göre kurun",
      body:
        "Yüksek suda torii denizde yüzer gibi görünür, alçak suda kapıya kadar yürünebilir. Tren saatinden önce resmi gelgit tablosuna bakmak, adadaki birkaç saatin değerini değiştirir.",
    },
    {
      title: "100 ¥ ziyaretçi vergisi feribotla toplanır",
      body:
        "Miyajima ziyaretçi vergisi feribot bileti sürecine eklenir. Ayrı gişe aramayın; kullandığınız operatörün bilet ekranındaki toplamı kontrol edin.",
    },
    {
      title: "Otel fiyatına 200 ¥ vergi eklenebilir",
      body:
        "1 Nisan 2026'dan beri uygun konaklamalarda kişi başı/gece 200 ¥ Hiroshima Prefecture konaklama vergisi vardır. Ücretin çevrim içi fiyata dahil olup olmadığını tesisten doğrulayın.",
    },
    {
      title: "Hiroşima Kalesi'ni kule manzarası için seçmeyin",
      body:
        "Ana kule 22 Mart 2026'da ziyarete kapandı. Hendek, taş duvarlar ve Ninomaru çevresi gezilebilir; güncel çalışmaları resmî kaynaktan kontrol edin.",
    },
    {
      title: "Miyajima geyiklerini beslemeyin",
      body:
        "Yiyecek, bilet ve kâğıdı kapalı çantada tutun. Nara'daki geyik krakeri düzenini Miyajima'ya taşımayın; adadaki hayvanlar için besleme istenmiyor.",
    },
  ],

  faqs: [
    {
      q: "Hiroşima kaç günde gezilir?",
      a: "Barış Parkı ve Miyajima için 1,5–2 gün idealdir. Her ikisini tek güne sıkıştırmak mümkün ama yorucu olur; bir gece kalmak hem programı rahatlatır hem Miyajima'yı kalabalıksız görmenizi sağlar.",
    },
    {
      q: "Miyajima'ya giriş ücreti var mı?",
      a: "Adaya 100 ¥'lik bir ziyaretçi vergisi uygulanıyor ve bu tutar feribot biletinize dahil ediliyor; ayrıca ödeme yapmanız gerekmiyor. Itsukushima Tapınağı'nın ise ayrı bir giriş ücreti bulunuyor.",
    },
    {
      q: "Yüzen torii'yi ne zaman görmek gerekir?",
      a: "Kapının suyun üzerinde duruyormuş gibi göründüğü görüntü yalnızca gelgit yüksekken oluşur. Gelgit alçakken kapının altına yürüyebilirsiniz. Ziyaret saatinizi gelgit çizelgesine bakarak seçin.",
    },
    {
      q: "Hiroşima usulü okonomiyaki Osaka'dakinden farklı mı?",
      a: "Evet, belirgin şekilde. Osaka'da malzemeler hamura karıştırılır; Hiroşima'da katman katman dizilir ve araya yakisoba erişte katmanı girer. Daha yüksek ve daha doyurucu bir tabaktır.",
    },
    {
      q: "Barış Anıtı Müzesi çocuklar için uygun mu?",
      a: "Müzenin bazı bölümleri küçük çocuklar için sarsıcı olabilir. Parkın kendisi ve Çocuk Barış Anıtı daha uygun bir başlangıç sunar; müze ziyaretini çocuğunuzun yaşına göre değerlendirin.",
    },
    {
      q: "Barış Anıtı Müzesi için rezervasyon gerekir mi?",
      a: "Bazı yoğun zaman dilimleri veya özel dönemlerde çevrim içi rezervasyon zorunlu olabilir. Diğer saatlerde de önceden bilet almak beklemeyi azaltır. Müze güncel düzende 07:30'da açılır; kapanış mevsime göre değişir.",
    },
    {
      q: "Şehir içinde nasıl dolaşılır?",
      a: "Tramvay ağı turistik noktaların neredeyse tamamını kapsıyor; ödeme genellikle inerken yapılıyor ve IC kartlar geçerli. Şehir düz olduğu için bisiklet de iyi bir seçenek.",
    },
  ],

  relatedGuides: [
    {
      city: "Osaka",
      anchor: "Hiroshima'dan Osaka'ya: hızlı trenle mutfak karşılaştırması",
      description:
        "İki şehir okonomiyakiye farklı yaklaşır; Osaka'da Namba, Shinsekai ve Umeda için en az iki gün ayırın.",
    },
    {
      city: "Kyoto",
      anchor: "Hiroshima'dan Kyoto'ya: batı rotasını tamamlayın",
      description:
        "Shinkansen bağlantısıyla tapınaklar ve tarihî mahallelere geçin; Kyoto'yu günübirliğe sıkıştırmayın.",
    },
  ],

  sources: [
    { name: "Hiroshima Peace Memorial Museum visitor guide", url: "https://dive-hiroshima.com/en/explore/2675/" },
    { name: "Hiroshima museum crowd and ticket guide", url: "https://image.dive-hiroshima.com/wp-content/uploads/2024/10/HPMM_WebTicket_Flyer_Final_E-1.pdf" },
    { name: "Official Miyajima access", url: "https://dive-hiroshima.com/en/information/access-miyajima/" },
    { name: "Miyajima visitor tax", url: "https://dive-hiroshima.com/en/news/post_typenewsp27265/" },
    { name: "Micchan Sohonten", url: "https://www.okonomi.co.jp/" },
    { name: "Anagomeshi Ueno", url: "https://www.anagomeshi.com/" },
    { name: "Kakiya", url: "https://www.kaki-ya.jp/" },
    { name: "Hiroshima Castle current status", url: "https://dive-hiroshima.com/en/explore/1173/" },
    { name: "Shukkeien official tourism entry", url: "https://dive-hiroshima.com/en/explore/306/" },
    { name: "Hiroshima accommodation tax", url: "https://dive-hiroshima.com/en/news/news-42561/" },
    { name: "Peace Museum Obon 2026 reservations", url: "https://dive-hiroshima.com/en/news/news-45728/" },
  ],

  volatileNote:
    "Müzenin rezervasyon gereken saatleri, tapınak girişleri, feribot tarifeleri ve teleferik çalışması değişebilir. Miyajima gelgitini ve tüm güncel durumları resmî kaynaklardan kontrol edin.",

  reviewed: "2026-08-09",
};

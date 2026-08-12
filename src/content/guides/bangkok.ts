import { CityGuide } from "./types";

/**
 * Bangkok rehberi — Ağustos 2026 araştırması.
 * Ulaşım bilgileri AOT, BTS, MRTA ve Chao Phraya Express Boat; restoran
 * statüleri 2026 Michelin seçkisi ve işletmelerin resmî kanallarıyla kontrol edildi.
 */
export const bangkok: CityGuide = {
  city: "Bangkok",
  countryCode: "TH",

  seoTitle: "Bangkok Gezi Rehberi: Semtler, Ulaşım, Yemek ve 4 Gün",
  seoDescription:
    "Bangkok'ta gezilecek yerler, doğru semtte otel, BKK ve DMK ulaşımı, BTS–MRT–tekne farkı, gerçek yemek adresleri, 4 günlük rota ve güncel ipuçları.",
  h1: "Bangkok Gezi Rehberi",
  lede:
    "Bangkok'u yenen şehir listesi değil, birbirine bağlanan ulaşım kümeleri anlatır. Aynı gün üç kez nehri geçmeye çalışmak kaos; tapınakları tekneyle, modern merkezi raylı sistemle ve yemek mahallelerini yürüyerek birleştirmek ise şaşırtıcı derecede akıcıdır.",

  quickFacts: [
    { label: "Önerilen süre", value: "4 tam gün" },
    { label: "En rahat dönem", value: "Kasım–şubat; yıl boyu sıcak" },
    { label: "Havalimanları", value: "Suvarnabhumi BKK · Don Mueang DMK" },
    { label: "Ulaşım omurgası", value: "MRT + BTS + nehir tekneleri" },
    { label: "Ödeme", value: "Kart + THB nakit; PromptPay yerel" },
  ],

  sections: [
    {
      heading: "Bangkok'u çözmenin yolu: haritayı hatlar ve nehir olarak okuyun",
      id: "sehri-cozmek",
      body: [
        "Bangkok'un tek bir merkez meydanı yoktur. Tarihî Rattanakosin adası Chao Phraya kıyısında; gökdelen, alışveriş ve gece hayatı Sukhumvit ile Silom koridorlarında; büyük pazarlar ve otogarlar daha dış halkalardadır. Haritada iki nokta yakın görünse de aralarında kanal, otoyol veya aktarmasız raylı sistem yoksa yolculuk uzun sürebilir. Geziyi semt isimlerinden önce ulaşım omurgasına göre kurmak bu yüzden önemlidir.",
        "Günleri üç kümeye ayırın: **nehir ve eski şehir**, **Siam–Sukhumvit raylı sistem koridoru**, **Silom–Chinatown–Talat Noi**. Chatuchak gibi kuzeydeki ayrı hedefi hafta sonuna veya geliş gününe koyun. Bu mantık, görülmesi gereken yer sayısını azaltmaz; sıcak altında istasyon arayan ve trafikte bekleyen süreyi azaltır.",
        "Kentte 500 metre her zaman beş dakikalık yürüyüş değildir. Kaldırım kesilebilir, kavşak üst geçit gerektirebilir ve öğle sıcağı tempoyu düşürür. Google Maps sürelerini taban değer kabul edin; tapınak kıyafeti, su molası ve tekne bekleme payı ekleyin. Bangkok'ta iyi program, boşluk bırakılmış programdır.",
      ],
    },
    {
      heading: "Gezilecek yerler: aynı güne gerçekten sığan kümeler",
      id: "gezilecek-yerler",
      body: [
        "Bangkok'un simgeleri birbirini tekrar etmez ama hepsini art arda görmek de iyi anlatı kurmaz. Aşağıdaki eşleşmeler coğrafya ve gün ritmi açısından çalışır.",
      ],
      subsections: [
        {
          heading: "Büyük Saray, Wat Pho ve Wat Arun — erken başlayın, nehirden geçin",
          body: [
            "Büyük Saray ile Wat Phra Kaew'i günün ilk saatine koyun. Girişte 'saray kapalı' diyerek sizi başka tura yönlendiren kişilere değil, resmî gişe ve güvenlik görevlilerine bakın. Omuz ve dizleri örten kıyafet zorunluluğunu kapıda pahalı/uygunsuz çözmeye bırakmayın; ince uzun pantolon veya etek ve omzu örten üst taşıyın.",
            "Büyük Saray'dan Wat Pho'ya yürüyün. Ardından Tha Tien çevresindeki kısa nehir geçişiyle Wat Arun'a ulaşmak, aynı yolu trafikte dönmekten daha anlamlıdır. Wat Arun'u karşı kıyıdan gün batımında görmek istiyorsanız tapınak ziyaretini gündüz tamamlayıp akşam nehir kıyısında yeniden konumlanın. Kutsal alanları yalnız fotoğraf fonu gibi değil, aktif ibadet mekânı olarak okuyun.",
          ],
        },
        {
          heading: "Chinatown, Song Wat ve Talat Noi — öğleden geceye",
          body: [
            "Wat Mangkon MRT istasyonu Chinatown'a iyi giriş verir. Gündüz Yaowarat'ın altıncıları ve bitkisel ürün dükkânlarını, Song Wat'ın eski depo cepheleri ile yeni kahvelerini, Talat Noi'nin dar sokaklarını yürüyün. Sokağı motosikletlerle paylaşacağınız için fotoğraf uğruna geçişi kapatmayın.",
            "Yaowarat akşam yemeğinde başka bir yere dönüşür. En uzun kuyruğu otomatik olarak en iyi adres sanmak yerine bir ana yemek, bir atıştırma ve tatlı planı yapın. Michelin tabelası bir işletmenin yıldızlı olduğu anlamına gelmeyebilir; Bib Gourmand, Selected ve yıldız farklı kategorilerdir. Jay Fai 2026 seçkisinde bir yıldızını koruyor fakat sıra/rezervasyon düzeni değişebilir.",
          ],
        },
        {
          heading: "Siam, Jim Thompson ve çağdaş Bangkok",
          body: [
            "Siam, Bangkok'un iklim kontrollü alışveriş merkezlerinden ibaret görünür; aslında şehir içi aktarmaların ve gençlik kültürünün düğümüdür. Jim Thompson House geleneksel ahşap evleri ve ipek hikâyesini derli toplu gösterir; Bangkok Art and Culture Centre güncel sergiler için yakın, düşük eforlu bir karşı ağırlıktır. İkisini Siam çevresiyle aynı yarım güne koyun.",
            "Çatı barı istiyorsanız yalnız manzara fotoğrafına bakmayın. Kıyafet kuralı, minimum harcama, yağmur politikası ve binanın gerçekten halka açık terası olup olmadığını resmî kanaldan kontrol edin. Ücretsiz manzara için alışveriş merkezi terasları veya nehir kıyısı yürüyüşleri çoğu gezgine yeter.",
          ],
        },
        {
          heading: "Chatuchak — hafta sonu pazarını doğru güne koyun",
          body: [
            "Chatuchak'ın tam hafta sonu pazarı cumartesi ve pazar gündüz çalışır; hafta içindeki bitki veya toptan bölümleri aynı deneyim değildir. BTS Mo Chit ya da MRT Kamphaeng Phet erişim verir. İçeride yön duygusu çabuk kaybolur; beğendiğiniz küçük dükkânın bölüm ve soi numarasını o anda kaydedin, 'sonra dönerim' çoğunlukla gerçekleşmez.",
            "Pazarı öğlen sıcağına bırakmayın. Sabah gidip bir–iki saat sonra ayrılmak, bütün günü aynı tip tezgâhlara harcamaktan daha verimlidir. Büyük alışverişte bavul ve uçuş bagaj hakkını; antika veya Buda tasviri alırken ihracat/izin kurallarını düşünün.",
          ],
        },
      ],
    },
    {
      heading: "Nerede kalınır? Bangkok'ta semt seçimi",
      id: "nerede-kalinir",
      body: [
        "**Asok–Phrom Phong**, BTS ve MRT kesişimi sayesinde ilk kez gelen için en kolay üslerden. Restoran ve alışveriş bol, ancak Sukhumvit'in gece trafiği ile yetişkin eğlence bölgeleri sokaktan sokağa değişir. Otelin yalnız 'Sukhumvit' yazmasına değil, en yakın istasyon ve çıkışına bakın.",
        "**Siam–Chit Lom**, raylı sistemle hızlı ve alışveriş odaklıdır; lüksten orta sınıfa çok otel vardır. Eski şehre doğrudan metro her noktadan yoktur ama taksi/tekne kombinasyonu yapılır. **Silom–Sathorn**, MRT ve BTS erişimi, iyi yemek ve daha dengeli gece temposu sunar; iş bölgesi hafta sonu sakinleşebilir.",
        "**Nehir kıyısı**, manzara ve tekne erişimi için güçlüdür. Fakat otel ana iskeleden uzaktaysa ücretsiz otel teknesinin son seferi gününüzü belirler. **Eski şehir–Khao San**, tapınaklara yakın ve sosyal; raylı sistem erişimi her sokakta kolay değil, gece gürültüsü ciddi olabilir. **Chinatown**, yemek ve karakter için mükemmel, büyük otel/rezort olanakları için daha sınırlıdır.",
        "Otel seçerken 'istasyona 8 dakika' ifadesini sokak görünümünde sınayın. Yol üst geçit, karanlık ara sokak ya da kaldırımsız bölüm içeriyorsa bavulla farklı hissedilir. Bangkok'ta iyi konum, oda metrekaresinden daha çok günlük enerji kazandırır.",
      ],
    },
    {
      heading: "BKK ve DMK: hangi havalimanından şehre nasıl gidilir?",
      id: "havalimani-ulasim",
      body: [
        "**Suvarnabhumi (BKK)** uluslararası uçuşların ana kapısıdır. Airport Rail Link bodrum kattaki istasyondan Phaya Thai ve Makkasan yönüne gider; Phaya Thai'de BTS, Makkasan/Phetchaburi bağlantısında MRT düşünülebilir. Çok valiziniz varsa dar aktarma ve merdivenleri hesaba katın. Resmî taksi sırası terminalin 1. katında 4–7 numaralı kapılar çevresindedir; taksimetre, havalimanı ek ücreti ve ücretli yol geçişi ayrı kalemler olabilir. Grab için uygulamadaki belirlenmiş karşılama noktasını takip edin.",
        "**Don Mueang (DMK)** özellikle düşük maliyetli ve bölgesel uçuşlarda kullanılır. SRT Red Line tren bağlantısı Bang Sue/Krung Thep Aphiwat yönünde işe yarar; A1/A2 gibi AOT otobüsleri kuzey raylı sistem düğümlerine bağlanır, fakat trafik payı gerekir. Taksi ve uygulama noktalarında terminal numarasını doğru seçin.",
        "BKK ile DMK aynı havalimanının iki terminali değildir. Aralarında kara yoluyla geçiş gerekir ve Bangkok trafiği nedeniyle kısa bağlantı risklidir. AOT'nin ücretsiz shuttle'ı yalnız aynı gün devam uçuşu belgesi olan yolcular içindir; herkese açık şehir içi servis gibi planlamayın. Ayrı biletlerde göçmenlik, bagaj, transfer ve yeniden güvenlik için geniş pay bırakın.",
        "Gece yarısına yakın gelişte trenin çalışacağını varsaymayın; resmî güncel saatleri uçuş gününde kontrol edin. Otelin adını Tayca ve harita piniyle hazır tutmak, aynı isimli şubeler arasında yanlış anlaşılmayı önler.",
      ],
    },
    {
      heading: "BTS, MRT, tekne ve taksi: tek kart yok, doğru araç var",
      id: "sehir-ici-ulasim",
      body: [
        "BTS Skytrain ve MRT tek bir işletme değildir. **BTS** için tek kullanımlık bilet, günlük bilet veya Rabbit kart; **MRT** için kendi bilet sistemi kullanılır. Haziran 2026 itibarıyla MRTA'nın dört hattında EMV temassız banka kartı kabulü genişletildi. Aynı fiziksel kartı girişte ve çıkışta okutun; bir telefondan girip karttan çıkmayın. BTS tarafında yabancı banka kartını turnikede çalışır varsaymayın; bilet makinesi veya Rabbit çözümünü kullanın.",
        "Chao Phraya Express Boat, eski şehir ile nehir kıyısını trafiksiz bağlar. Tekneye renginden çok **bayrak ve iskele adıyla** binin; turist teknesi ile yerel ekspres servislerin durakları ve fiyat yapısı farklıdır. Operatör 2026'da güzergâh güncellemesi yayımladı; eski blogdaki iskele listesini değil resmî haritayı kontrol edin. İskele görevlisine hedefi söylemek yanlış yöne binmeyi önler.",
        "Taksimetreli taksi kısa ve orta mesafede değerlidir, fakat yoğun saatte raylı sistemden çok yavaş olabilir. Şoför metre açmayı reddederse tartışmayı büyütmeden başka araç çağırın. Grab/Bolt fiyatı önceden gösterir; ücretli yol, bekleme ve havalimanı ek ücretinin uygulama fiyatına dahil olup olmadığını ekranda okuyun. Tuk-tuk deneyimdir, ekonomik toplu taşıma değildir: hedefi ve toplam fiyatı binmeden anlaşın, kuyumcu/terzi duraklı 'ucuz turu' kabul etmeyin.",
      ],
    },
    {
      heading: "Bangkok'ta ne yenir? Mahalle ve saat mantığı",
      id: "ne-yenir",
      body: [
        "Bangkok mutfağını yalnız pad thai, mango sticky rice ve gece pazarı üçlüsüne indirgemeyin. **Kuay teow** erişte çorbaları, **khao man gai**, Çin–Tayland kökenli ördek ve domuz yemekleri, Isan usulü som tam–ızgara tavuk, Güney Tayland körileri ve kraliyet/merkez mutfağı aynı şehirde yan yana yaşar. Menüde acı seviyesini 'medium' diye istemek evrensel ölçü vermez; az acı için *pet nit noi*, acısız için *mai pet* demek işe yarar ama sosun önceden hazırlanmış olabileceğini kabul edin.",
        "Sokak tezgâhında hızlı devir, görünür pişirme, sıcak servis ve temiz su/buz yönetimi önemlidir. Kuyruk yerel müşteri ve hızlı devir göstergesi olabilir; sosyal medya kuyruğu kalite garantisi değildir. Alerjiniz varsa Tayca yazılı kart taşıyın: balık sosu, karides ezmesi ve yer fıstığı yalnız adı görünen yemekte bulunmaz.",
        "Michelin statüsünü doğru okuyun. 2026 Tayland rehberinde yıldız, Bib Gourmand ve Selected ayrı işaretlerdir; bir dönem listede olan işletme sonraki yıl aynı statüde olmayabilir. Restoran kartlarında yalnız güncel resmî seçkide doğrulayabildiğimiz statüyü belirttik, diğerlerini 'eski Michelin' diye pazarlamadık.",
      ],
    },
    {
      heading: "Para, PromptPay ve telefon: küçük kararlar",
      id: "para-ve-uygulamalar",
      body: [
        "Kart kullanımı otel, alışveriş merkezi ve çağdaş restoranlarda yaygındır; pazar, tekne bileti, küçük lokanta ve bazı taksiler için THB nakit gerekir. PromptPay QR kodlarının çokluğu nakitsiz turist deneyimi anlamına gelmez: sistem yerel banka hesabı veya uyumlu cüzdan ister. Bir turist cüzdanına kayıt olabiliyorsanız bile pasaport doğrulaması ve kapsama değişebilir; Bangkok'a nakitsiz inip her tezgâhı telefonla ödemeyi planlamayın.",
        "ATM işleminde makine ücretini ve kendi bankanızın kurunu ayrı düşünün. Ekrandaki TL/EUR dönüşümünü kabul etmek yerine THB çekimini seçmek, dönüşümü kart bankanıza bırakır; onay ekranını okumadan ilerlemeyin. Büyük banknotu sabah ilk müşteride küçük tezgahta bozdurmak yerine markette veya otelde parçalayın.",
        "Grab, toplu taşıma haritası ve hava durumu uygulamasını gelmeden kurun; LINE bazı restoranların rezervasyon/iletişim kanalıdır. Yerel SIM/eSIM, araç sürücüsünün sizi bulması ve rezervasyon araması için yararlıdır. Uygulama Türkiye mağazasında görünmüyorsa hesap bölgesini aceleyle değiştirmeyin; web rezervasyonu ve otel yardımı çoğu zaman daha risksizdir.",
      ],
    },
    {
      heading: "Ne zaman gidilir? Sıcak, yağmur ve hava kalitesi",
      id: "ne-zaman",
      body: [
        "**Kasım–şubat** daha düşük nem ve yağış ihtimaliyle yürümek için en rahat dönemdir; aynı zamanda fiyat ve kalabalık artar. **Mart–mayıs** çok sıcaktır. Tapınak günlerini sabah, müze/alışveriş molasını öğlen, nehir ve sokak yürüyüşünü akşam yapın. Su içmek tek başına yetmez; güneş, tuz kaybı ve klimalı iç mekân–sıcak sokak geçişi yorucudur.",
        "**Mayıs–ekim** yağışlı dönemde tüm gün kesintisiz yağmur şart değildir; kısa ama yoğun sağanak, su birikmesi ve trafikte ani yavaşlama görülür. Uçuş günü şehrin karşı ucuna son aktivite koymayın. Hafif yağmurluk şemsiyeden daha kullanışlı olabilir; tapınak içinde ıslak zemine dikkat edin.",
        "Kuru dönemde Bangkok'ta PM2.5 yükselebilir. Seyahatten önce Tayland'ın resmî hava kalitesi ölçümlerini kontrol edin; hassassanız açık hava sporunu ve uzun nehir kenarı yürüyüşünü daha iyi saate alın. 'Hava güneşli' görüntüsü partikül değerinin iyi olduğunu göstermez.",
      ],
    },
    {
      heading: "Sık yapılan hatalar, dolandırıcılıklar ve görgü",
      id: "hatalar-ve-gorgu",
      body: [
        "En bilinen senaryo 'Büyük Saray bugün kapalı' cümlesiyle başlar, ucuz tuk-tuk turu ve komisyonlu mağazalarla biter. Sarayın durumunu yalnız resmî girişten kontrol edin. Kanal turu alırken toplam süreyi, özel mi paylaşımlı mı olduğunu, hangi iskelede biteceğini ve girişlerin dahil olup olmadığını yazılı netleştirin.",
        "Tapınakta omuz/diz örtmek yalnız kadınlara yönelik değildir. Ayakkabıyı işaret edilen yerde çıkarın, Buda heykeline ayak uzatmayın, rahiplerin ve ibadet edenlerin önünü fotoğraf için kesmeyin. Kraliyet ailesi ve kutsal imgelerle ilgili saygısız davranışın yalnız 'kültür farkı' olarak görülmeyeceğini bilin.",
        "Vape/e-sigara ithali ve bulundurulması yasaktır. Kenevir dükkânlarının görünür olması keyif amaçlı kullanımın serbest olduğu anlamına gelmez; 2025 düzenlemesi çiçeği Tayland'da yetkili sağlık profesyoneli reçetesine bağladı. Satın almayın, sınırdan geçirmeyin. Gece hayatında açık hesabı, şişe fiyatını ve varsa servis ücretini siparişten önce görün.",
      ],
    },
  ],

  places: [
    {
      name: "Jay Fai",
      area: "Samran Rat",
      known: "Wok ateşi, yengeçli omlet · Michelin 2026 bir yıldız",
      why:
        "Bangkok sokak mutfağının uluslararası simgesine dönüşmüş olsa da asıl değer, yüksek ateşte tek tek pişirilen deniz ürünü yemeklerinde. Ünü nedeniyle sırayı yemeğin bir parçası kabul edebilenler için.",
      price: "Yüksek",
      tip: "2026 Michelin statüsü doğrulandı; rezervasyon, sıra ve açık gün bilgisini güncel resmî kanaldan kontrol edin.",
    },
    {
      name: "Thipsamai",
      area: "Samran Rat",
      known: "Kömür ateşi karakterli pad thai",
      why:
        "Pad thai'nin turistik bir klişe olmadan nasıl teknik bir wok yemeğine dönüşebildiğini görmek için klasik durak. Yumurtayla sarılı versiyon ve malzeme dengesi, sokakta rastgele seçilen tabaktan daha öğretici.",
      price: "Orta",
      tip: "Şube ile ana adresi karıştırmayın; akşam kuyruğuna zaman ayırmak istemezseniz yoğun saat dışını deneyin.",
    },
    {
      name: "Polo Fried Chicken",
      area: "Lumphini",
      known: "Sarımsaklı kızarmış tavuk ve Isan eşlikçileri",
      why:
        "Çıtır sarımsak kaplı gai tod'u som tam ve yapışkan pirinçle paylaşmak, Bangkok'taki kuzeydoğu Tayland damarını erişilebilir biçimde gösterir. Lumphini günüyle kolay birleşir.",
      price: "Ekonomik",
      tip: "Yalnız tavuk söylemeyin; som tamın acı seviyesini açıkça belirtip yapışkan pirinçle dengeleyin.",
    },
    {
      name: "Nai Ek Roll Noodle",
      area: "Yaowarat",
      known: "Biberli kuay chap ve çıtır domuz",
      why:
        "Geniş pirinç eriştesi, yoğun biberli et suyu ve sakatat/çıtır domuz seçimi Chinatown'un Tayland–Çin yemek mirasını tek kâsede anlatır. Gece atıştırmasından çok güçlü bir ana öğündür.",
      price: "Ekonomik",
      tip: "Biberli et suyu beklenenden keskin olabilir; sakatat istemiyorsanız siparişte belirtin.",
    },
    {
      name: "Krua Apsorn",
      area: "Dinso / birden çok şube",
      known: "Merkez Tayland ev yemekleri ve yengeç",
      why:
        "Tek tabak sokak yemeğinden sonra paylaşmalı Tayland sofrasına geçmek için iyi karşılık. Yengeçli omlet, sarı köri ve sebze yemekleriyle farklı dokuları birlikte kurabilirsiniz.",
      price: "Orta",
      tip: "Aynı isimli adresleri karıştırmamak için resmî şubeyi haritada kaydedin; birkaç yemek söyleyip paylaşın.",
    },
    {
      name: "Or Tor Kor Market",
      area: "Chatuchak",
      known: "Meyve, hazır yemek ve nitelikli pazar tezgâhları",
      why:
        "Chatuchak kalabalığından sonra Tayland meyvelerini, köri tezgâhlarını ve paketli yerel ürünleri daha düzenli ortamda karşılaştırma fırsatı verir. Tek restoran değil, tadım rotasıdır.",
      price: "Orta",
      tip: "Durian taşımadan önce otel ve havayolu kuralını kontrol edin; kesilmiş meyveyi uzun süre sıcakta bekletmeyin.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — Nehir ve eski şehir",
      morning:
        "Büyük Saray'a ilk saatlerde girin; Wat Pho'ya yürüyün. Tapınak kıyafetini çantanızda hazır tutun.",
      afternoon:
        "Tha Tien'den nehri geçip Wat Arun'u görün. Sıcakta müze veya kafede mola verin; dönüşte ekspres tekne güzergâhını kullanın.",
      evening:
        "Wat Arun manzaralı nehir kıyısında gün batımı, ardından Pak Khlong Talat çiçek pazarı veya eski şehirde akşam yemeği.",
    },
    {
      title: "2. Gün — Chinatown'dan Silom'a",
      morning:
        "MRT ile Wat Mangkon'a gidin; Chinatown tapınaklarını ve Song Wat'ı dükkânlar açılırken yürüyün.",
      afternoon:
        "Talat Noi sokakları ve nehir kıyısı. Sonra MRT ile Lumphini'ye geçip park çevresinde serin saate kadar dinlenin.",
      evening:
        "Yaowarat'a dönüp tek bir kuyruk yerine üç küçük duraklı yemek rotası yapın; dönüşte MRT kullanın.",
    },
    {
      title: "3. Gün — Siam, sanat ve Sukhumvit",
      morning:
        "Jim Thompson House ve Bangkok Art and Culture Centre. Sergi programını ziyaret öncesi kontrol edin.",
      afternoon:
        "Siam–Chit Lom alışveriş geçitleri; öğle sıcağını kapalı mekânda değerlendirin. Erawan Shrine çevresinde saygılı kısa durak.",
      evening:
        "Thong Lo veya Phrom Phong'da mahalle yemeği; çatı barı seçtiyseniz kıyafet ve rezervasyon kuralını önceden doğrulayın.",
    },
    {
      title: "4. Gün — Pazar veya kişisel Bangkok",
      morning:
        "Hafta sonuysa Chatuchak'a açılışa yakın gidin ve bölüm numaralarını kaydedin. Hafta içiyse Khlong Bang Luang ya da Ari seçin.",
      afternoon:
        "Or Tor Kor'da meyve ve öğle yemeği; ardından otelinize dönüp havuz/klima molası. Alışverişi bavula yerleştirin.",
      evening:
        "İlk üç günde en sevdiğiniz mahalleye dönün. Uçuş ertesi günse şehrin öbür ucuna gece planı koymayın.",
    },
  ],

  practicalHeading: "Bangkok'ta planı kurtaran küçük ayrıntılar",
  practicalTips: [
    {
      title: "MRT'de aynı kartla girip çıkın",
      body: "EMV turnikesinde fiziksel kart, telefon ve saat farklı kimlik sayılabilir. Girişte ne kullandıysanız çıkışta onu kullanın; yabancı işlem ücretini bankanızdan kontrol edin.",
    },
    {
      title: "BTS ile MRT'yi tek sistem sanmayın",
      body: "Hatlar aktarma verse de bilet ve kart sistemleri ayrıdır. Rabbit kartın MRT'de, MRT banka kartı kabulünün BTS turnikesinde otomatik çalışacağını varsaymayın.",
    },
    {
      title: "Teknede bayrağı ve yönü sorun",
      body: "İskele panosundaki bayrak, teknenin durak düzenini belirler. Yalnız 'turist teknesi' diyen satıcıya değil, resmî operatör güzergâhına bakın.",
    },
    {
      title: "Taksi için Tayca adres ve pin",
      body: "Otel veya restoranın yalnız Latin harfli adını değil Tayca adres ekranını ve harita pinini kaydedin. Aynı isimli otel/şubeler sık karışır.",
    },
    {
      title: "Büyük banknotu pazarda bozmayın",
      body: "Küçük alışveriş için 20/50/100 THB banknotlar rahatlatır. Pazara girmeden market veya otelde daha büyük banknotu parçalayın.",
    },
    {
      title: "Öğle saatini kapalı mekâna ayırın",
      body: "Mart–mayıs özellikle yorucudur. Tapınağı sabah, müze/alışverişi öğlen, pazar ve nehir yürüyüşünü akşam yapın.",
    },
    {
      title: "AOT shuttle herkese açık değil",
      body: "BKK–DMK ücretsiz servis için devam uçuşu kanıtı gerekir. Havalimanı değiştiriyorsanız bağlantıyı kısa tutmayın ve alternatif kara ulaşım bütçesi ayırın.",
    },
    {
      title: "'Kapalı tapınak' cümlesine kanmayın",
      body: "Durumu resmî kapıda veya web sitesinde kontrol edin. Ucuz tuk-tuk, terzi ve mücevher durağı kombinasyonu klasik komisyon rotasıdır.",
    },
  ],

  faqs: [
    {
      q: "Bangkok kaç günde gezilir?",
      a: "İlk ziyaret için 4 tam gün dengelidir. Üç günde eski şehir, Chinatown ve modern merkezi görebilirsiniz fakat Chatuchak veya yavaş mahalle günü dışarıda kalır. Ayutthaya günübirlik gezisini Bangkok günlerinden saymayın.",
    },
    {
      q: "Bangkok'ta nerede kalınır?",
      a: "İlk kez gelen ve çok hareket edecek biri için Asok, Siam veya Silom raylı sisteme erişim sağlar. Tapınak ve nehir önceliğinde Riverside/Old Town; yemek önceliğinde Chinatown düşünülebilir. Otelin istasyon çıkışına gerçek yürüme yolunu kontrol edin.",
    },
    {
      q: "BTS ve MRT'de tek kart geçiyor mu?",
      a: "Hayır, tek bir evrensel ulaşım kartı yoktur. BTS tek bilet/Rabbit, MRT kendi biletleri ve 2026 itibarıyla MRTA hatlarında EMV temassız kart kabulü kullanır. Her bankanın yabancı kart ücreti farklıdır.",
    },
    {
      q: "Suvarnabhumi'den taksi mi Airport Rail Link mi?",
      a: "Phaya Thai/Makkasan bağlantısına yakın ve hafif bagajlıysanız tren trafiği aşar. Birkaç kişi, çok valiz veya raylı sistemden uzak otelde resmî taksi/Grab daha kolay olabilir. Gece çalışma saatini kontrol edin.",
    },
    {
      q: "Bangkok'ta PromptPay ile ödeme yapabilir miyim?",
      a: "Tezgâhtaki PromptPay QR kodu çoğunlukla Tayland banka hesabı veya uyumlu cüzdan ister; Türk bankacılık uygulamasının çalışacağını varsaymayın. Nakit ve kart yedeği taşıyın.",
    },
    {
      q: "Bangkok güvenli mi, hangi dolandırıcılığa dikkat edilmeli?",
      a: "Turistik bölgelerde temel kişisel önlemlerle gezilebilir. En tipik sorunlar 'tapınak kapalı' bahanesi, taksimetre reddi, komisyonlu tuk-tuk turu ve belirsiz kanal turudur. Fiyat ve güzergâhı binmeden yazılı netleştirin.",
    },
    {
      q: "Bangkok'ta sokak yemeği güvenli mi?",
      a: "Sıfır risk yoktur. Hızlı müşteri devri, görünür şekilde yeni pişirme, sıcak servis ve temiz çalışma alanı iyi işaretlerdir. Hassas mide veya ciddi alerjide Tayca açıklama kartı taşıyın; balık sosu ve karides ezmesi gizli olabilir.",
    },
  ],

  relatedGuides: [
    {
      city: "Ayutthaya",
      anchor: "Bangkok'tan Ayutthaya'ya: eski başkenti acele etmeden görün",
      description:
        "Trenle erişilen tarih adasında ana tapınakları, dış halkayı ve nehir mutfağını bir tam güne veya bir geceye yayın.",
    },
    {
      city: "Chiang Mai",
      anchor: "Bangkok'tan Chiang Mai'ye: kuzeyin daha yavaş ritmi",
      description:
        "Uçuş veya gece treniyle kuzeye geçin; Lanna tapınakları, pazarlar ve dağ iklimi Bangkok'u tekrar etmez.",
    },
    {
      city: "Krabi",
      anchor: "Şehirden denize: Krabi'de doğru üs seçimi",
      description:
        "Ao Nang, Railay ve Krabi Town aynı tatili sunmaz. Uçmadan önce mevsimi ve tekne lojistiğini okuyun.",
    },
  ],

  sources: [
    { name: "Suvarnabhumi Airport — resmî ulaşım bilgileri", url: "https://suvarnabhumi.airportthai.co.th/?lang=en" },
    { name: "Don Mueang Airport — ulaşım", url: "https://donmueang.airportthai.co.th/service/transportation" },
    { name: "AOT — BKK–DMK shuttle koşulları", url: "https://donmueang.aot-web-prod.sawasdeebyaot.com/service/transportation/detail/1093" },
    { name: "BTS — bilet sistemleri", url: "https://www.bts.co.th/eng/library/system-tickets.html" },
    { name: "MRTA — EMV temassız ödeme duyurusu", url: "https://www.mrta.co.th/th/news-release/33436" },
    { name: "Chao Phraya Express Boat — güncel güzergâh", url: "https://www.chaophrayaexpressboat.com/chaophrayaexpressboat?lang=enLa" },
    { name: "TAT — Chatuchak Weekend Market", url: "https://www.thailandtravel.or.jp/chatuchak-weekend-market/" },
    { name: "Michelin Guide Thailand 2026 — yıldızlı restoranlar", url: "https://guide.michelin.com/ph/en/article/michelin-guide-ceremony/full-list-michelin-stars-michelin-guide-thailand-2026" },
    { name: "Thipsamai — resmî site", url: "https://thipsamai.com/" },
    { name: "Polo Fried Chicken — resmî site", url: "https://polofriedchicken.com/" },
  ],

  volatileNote:
    "Raylı sistem/tekne saatleri, tapınak kuralları, pazar günleri, restoran statüsü ve havalimanı karşılama noktaları değişebilir. Uçuş ve ziyaret gününde resmî kanalları yeniden kontrol edin.",
  reviewed: "2026-08-09",
};

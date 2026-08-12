import { CityGuide } from "./types";

/** Floransa rehberi — Ağustos 2026 araştırması. */
export const floransa: CityGuide = {
  city: "Floransa",
  countryCode: "IT",

  seoTitle: "Floransa Gezi Rehberi: Müze Biletleri ve 4 Günlük Rota",
  seoDescription:
    "Floransa gezi rehberi: Uffizi ve Accademia resmî biletleri, Duomo geçişleri, FLR tramvayı, semtler, Toskana mutfağı ve 4 günlük yürüyüş planı.",
  h1: "Floransa Gezi Rehberi",
  lede:
    "Floransa küçük göründüğü için kolay değil; başyapıtların yoğunluğu, zamanlı müze girişleri ve Arno'nun iki yakasındaki mahalleler doğru sıraya konmadığında Rönesans başkenti hızla bir kuyruk maratonuna dönüşür.",

  quickFacts: [
    { label: "Önerilen süre", value: "3–4 tam gün" },
    { label: "Ana istasyon", value: "Firenze Santa Maria Novella" },
    { label: "Havalimanı", value: "FLR · T2 tramvay" },
    { label: "Öncelikli bilet", value: "Uffizi · Accademia · Duomo kubbesi" },
    { label: "Şehir içi", value: "Yürüyüş + tramvay/otobüs" },
  ],

  sections: [
    {
      heading: "Floransa kaç günde ve nasıl gezilir?",
      id: "kac-gun",
      body: [
        "Floransa'nın tarihî merkezi yürünebilir fakat her gün iki büyük müze yapmak iyi plan değildir. Üç tam günde Duomo–Accademia, Uffizi–Piazza della Signoria ve Oltrarno–Pitti eksenleri kurulur. Dördüncü gün Santa Croce/Sant'Ambrogio, daha küçük müzeler veya Fiesole gibi yakın bir kaçış için nefes sağlar.",
        "Uffizi ile Accademia'yı aynı sabah arka arkaya koymak, sanat eserini görmekten çok giriş saatine yetişmeye dönüşür. Bir güne bir ana koleksiyon, yanında açık hava mahalle yürüyüşü kuralı daha iyi işler. Duomo kubbe tırmanışı da fiziksel eforu nedeniyle bağımsız ana rezervasyon sayılmalıdır.",
        "Floransa'yı Toskana'nın tamamı sanmayın. Siena, Lucca, Pisa, Chianti ve Val d'Orcia farklı ulaşım mantığı olan ayrı rotalardır. Şehirde yalnız iki gece varsa kırsal tura gitmek için Uffizi veya Oltrarno'yu feda ettiğinizi bilin; Toskana ayağını ayrı konaklamaya dönüştürmek çoğu zaman daha dengelidir.",
      ],
    },
    {
      heading: "Floransa'ya varış: FLR tramvayı, Pisa ve SMN istasyonu",
      id: "varis-ulasimi",
      body: [
        "Amerigo Vespucci Havalimanı (FLR) merkeze yaklaşık 5 km mesafededir. T2 tramvayı havalimanını Santa Maria Novella çevresi ve San Marco yönüne bağlar. Feel Florence'ın güncel bilgisinde merkez yolculuğu yaklaşık 20 dakikadır; bakım ve hat değişikliği için seyahat gününde tramvay duyurusuna bakın.",
        "Havalimanı durağındaki makineden alınan kâğıt bileti araca binince doğrulatın. Araç içi temassız okuyucuda **her yolcu kendi kartını** kullanmalıdır; aynı kartla art arda iki kişi ödeme yapmayı varsaymayın. Fiziksel kart ve telefon cüzdanını yolculuk boyunca karıştırmayın.",
        "Pisa Havalimanı (PSA), Floransa'da değildir. Pisa Centrale aktarmalı tren veya doğrudan kara transferinin toplam süresini uçuş fiyatına ekleyin. Geç varışta son tren/otobüs ve SMN'den otele yürüyüş, ucuz bilet avantajını silebilir.",
        "Firenze Santa Maria Novella istasyonu merkezin kenarındadır; Duomo'ya yürünebilir. Ancak hızlı treniniz **Firenze Campo di Marte** veya başka istasyona gidiyorsa aynı kolaylığı beklemeyin. Bilette istasyonun tam adını ve bölgesel aktarmanın doğrulama kuralını kontrol edin.",
      ],
    },
    {
      heading: "Uffizi biletleri ve Piazza della Signoria günü",
      id: "uffizi",
      body: [
        "Uffizi için resmî kaynak **uffizi.it** ve yönlendirdiği **tickets.uffizi.it** satış kanalıdır. Sponsorlu aracı sonuçları resmî bilet sanmayın. Botticelli, Leonardo, Michelangelo, Raphael ve Caravaggio salonlarını gerçekten görmek için iki buçuk–üç saat ayırın; yalnız başyapıt odalarına koşmak müzenin Rönesans anlatısını koparır.",
        "Bilet saatine güvenlik ve koleksiyon kuyruğu eklenebilir. Büyük çanta kurallarını okuyun, sesli rehberi önceden seçin ve müze kapanışından hemen önce slot almayın. Vasari Koridoru gibi özel güzergâhların ayrı, isimli ve zamanlı koşulları olabilir; standart Uffizi biletine otomatik dâhil olduğunu varsaymayın.",
        "Müze sonrasında Piazza della Signoria, Loggia dei Lanzi ve Palazzo Vecchio aynı coğrafyadadır. Palazzo Vecchio'nun kule/özel alan erişimi ayrı bilet ve hava koşuluna bağlı olabilir. Uffizi'nin ardından başka büyük koleksiyon yerine Arno kıyısı ve Ponte Vecchio yürüyüşü zihni dinlendirir.",
        "Ponte Vecchio gün ortasında en sıkışık hâlindedir. Köprüyü sabah geçin, öğleden sonra manzarayı Ponte Santa Trinita'dan görün. Kuyumcu vitrinini seyretmek için yaya akışının ortasında durmayın.",
      ],
    },
    {
      heading: "Duomo kompleksi: kubbe bileti, isim ve merdiven gerçeği",
      id: "duomo",
      body: [
        "Santa Maria del Fiore Katedrali'nin ana nefi ücretsizdir ve normalde rezervasyon istemez; buna karşın Brunelleschi Kubbesi, Giotto Çan Kulesi, Vaftizhane, Santa Reparata ve Opera del Duomo Müzesi geçiş ürünlerine göre erişilir. Resmî bilet sitesi **tickets.duomo.firenze.it** üzerindedir.",
        "**Brunelleschi Pass** seçerken kubbe için isim ve kesin saat girilir; kubbe rezervasyonu değiştirilemeyebilir. Kubbe tırmanışı dar, dik, çift yönlü merdivenler ve yaklaşık 463 basamak içerir; asansör yoktur. Klostrofobi, kalp/solunum sorunu veya hareket kısıtı varsa manzara uğruna zorlamayın. Giotto Kulesi de ayrı ve yoğun basamaklıdır.",
        "Duomo geçişleri üç takvim günü geçerli olabilir, fakat her anıta erişim ve zamanlı rezervasyon mantığı aynı değildir. İlk aktivasyonu son güne bırakmayın; biletinizdeki başlangıç, isim ve slotu okuyun. Omuz/dizleri örten kıyafet ve güvenlik kuralı ibadet alanlarında geçerlidir.",
        "Opera del Duomo Müzesi, özgün heykelleri ve katedralin yapım hikâyesini görmek için sadece yağmurlu gün yedeği değildir. Kubbe tırmanışından önce müzeyi görmek, Brunelleschi'nin mühendisliğini ve cephe tarihini daha anlaşılır kılar.",
      ],
    },
    {
      heading: "Accademia, David ve daha küçük müzeler",
      id: "accademia",
      body: [
        "Galleria dell'Accademia'da Michelangelo'nun David'i ana çekimdir; fakat Prisoners, Giambologna modeli, erken dönem resimler ve müzik aletleri koleksiyonu ziyaretin bağlamını kurar. 2026 itibarıyla resmî site, B-Ticket'ın yetkili çevrimiçi kanal olduğunu ve rezervasyonun yoğun dönemde güçlü biçimde önerildiğini belirtir.",
        "İsimli/zamanlı bileti alıp 15 dakikada çıkmak yerine yaklaşık 75–90 dakika ayırın. Müzenin büyük valizler için emanet hizmeti vermediği güncel erişim kurallarında belirtilir; istasyondan çıkıp valizle doğrudan gitmeyin. Ücretsiz günlerde rezervasyon düzeni farklı olabilir.",
        "Bargello, Donatello ve Rönesans heykeli için Accademia'nın doğal tamamlayıcısıdır. Medici Şapelleri hanedan siyaseti, San Marco Müzesi Fra Angelico ve manastır atmosferi, Santa Maria Novella ise kilise–sanat ilişkisi için güçlü ama daha sakin seçeneklerdir. 2026'da bazı kurumlar yeni birleşik biletler sunar; geçerlilik ve kapsamı resmî siteden kontrol edin.",
        "Her kiliseyi 'ücretsiz hızlı durak' sanmayın. Santa Croce gibi komplekslerin müze, şapel ve restorasyon alanları için bilet/erişim düzeni vardır. Dinî tören sırasında turistik gezinin kısıtlanmasına saygı gösterin.",
      ],
    },
    {
      heading: "Oltrarno, Pitti ve Michelangelo Tepesi",
      id: "oltrarno",
      body: [
        "Arno'nun güneyi tek bir mahalle değildir. Santo Spirito zanaat, pazar ve akşam meydanı; San Frediano daha yerel restoran/barlar; San Niccolò ise Piazzale Michelangelo ve tepe yürüyüşüne yakındır. Ponte Vecchio'dan geçip yalnız Pitti Sarayı'nı görerek dönmek Oltrarno'yu kaçırır.",
        "Pitti Sarayı içindeki koleksiyonlar ve Boboli Bahçeleri birkaç saat ister. Uffizi ile aynı gün tam Pitti yapmak müze yorgunluğu yaratır. Bahçeler eğimli, güneşli ve su noktaları aralıklı olabilir; yaz ortasında öğleye koymayın. Bilet kombinasyonunun hangi alanları kapsadığını resmî Uffizi sistemi üzerinden okuyun.",
        "Piazzale Michelangelo gün batımında yoğunlaşır. Yürüyerek çıkacaksanız San Niccolò rampaları/merdivenleri, otobüsle çıkıp yürüyerek inmek daha kolaydır. Biraz daha yukarıdaki San Miniato al Monte'nin ibadet saatlerine saygı gösterin; mezarlık ve kilise yalnız manzara platformu değildir.",
        "Oltrarno'da 'zanaatkâr dükkânı' etiketi her ürünün elde ve yerelde yapıldığı anlamına gelmez. Atölyede üretim izini, malzemeyi ve menşeyi sorun; seri deri ürününü yalnız Floransa etiketiyle pahalıya almayın.",
      ],
    },
    {
      heading: "Floransa'da nerede kalınır?",
      id: "nerede-kalinir",
      body: [
        "**Duomo–Signoria** ilk gezi için en merkezi fakat kalabalık, pahalı ve gece gürültülü seçenektir. **Santa Maria Novella** erken tren ve tramvay için pratiktir; istasyon çevresinde sokak kalitesi bloktan bloğa değişir. **Santa Croce** restoran/gece hayatına yakın, meydan çevresinde sesli olabilir.",
        "**Oltrarno/Santo Spirito** akşamları daha mahalleli bir denge sunar; her gün Duomo tarafına köprü geçersiniz ama mesafe kısadır. **San Niccolò** manzara ve sakinlik, yokuş dezavantajı taşır. **Sant'Ambrogio** pazar ve yerel yemek için güçlü, ana istasyona biraz uzaktır.",
        "Asansörsüz tarihî binalarda 'ikinci kat' beklenenden fazla merdiven olabilir. Klima, bagaj bırakma, resepsiyon saati ve ZTL içindeki taksi bırakma noktasını sorun. Araba kiralıyorsanız merkez oteli yalnız park var yazdığı için seçmeyin; garajın ZTL plaka kaydını nasıl yaptığını yazılı doğrulayın.",
        "Belediye konaklama vergisi tesis sınıfı ve geceye göre rezervasyon toplamına eklenebilir. Nakit istenip istenmediğini ve hangi yaş/gece istisnasının uygulandığını tesisten öğrenin; eski sabit tutarlara güvenmeyin.",
      ],
    },
    {
      heading: "Floransa'da ne yenir? Bistecca, lampredotto ve pazarlar",
      id: "ne-yenir",
      body: [
        "**Bistecca alla fiorentina** kalın kesim, kemikli ve genellikle az pişmiş servis edilen paylaşmalık ettir. Menülerde kilo fiyatı bulunabilir; parçanın yaklaşık ağırlığını ve pişirme tercihine esneklik olup olmadığını siparişten önce sorun. Tek kişi için küçük porsiyon beklemek yerine başka Toskana ana yemeklerine yönelin.",
        "Ribollita, pappa al pomodoro, panzanella ve fasulyeli yemekler cucina povera geleneğinin; **lampredotto** ise dördüncü mide bölümünden yapılan sokak sandviçinin parçasıdır. Tripperia tezgâhında salsa verde ve acı sos seçilir, ekmeğin suyuna batırılmasını 'bagnato' olarak isteyebilirsiniz. Sakatat yemiyorsanız içerik sormadan yalnız yerel diye sipariş etmeyin.",
        "Schiacciata dükkânlarının sosyal medya kuyruğu kalite garantisi değildir. Sant'Ambrogio ve Mercato Centrale çevresinde peynir, şarküteri ve hazır yemeği fiyat/oturma düzeniyle karşılaştırın. Mercato Centrale'nin üst kat yemek salonu ile alt kat geleneksel pazar saatleri aynı olmayabilir.",
        "Cantucci ile vin santo tatlı kapanış; gelato için üst üste dağ gibi kabartılmış parlak renk yerine kapaklı metal hazne, mevsimlik tat ve kısa içerik listesi daha iyi işarettir. Coperto/servizio satırını menüden okuyun, meydan terasında oturma fiyatını ayakta kahveyle karıştırmayın.",
      ],
    },
    {
      heading: "ZTL, araç ve Toskana günü",
      id: "ztl-ve-arac",
      body: [
        "Floransa tarihî merkezi kamera denetimli ZTL'dir. Feel Florence resmî haritası girişleri ve bölgeleri gösterir; saatler sezon/özel düzenlemeyle değişebilir. Kiralık araçla tabelayı takip etmeden önce otel veya yetkili garajın plakanızı sisteme bildireceğini doğrulayın. Navigasyon 'en kısa yol' diye ceza kamerasından geçirebilir.",
        "Şehir içinde araç gereksizdir. Chianti veya Val d'Orcia için araç kiralayacaksanız merkezi terk ettiğiniz gün havalimanı/çevre ofisten almak, park ve ZTL riskini azaltır. İtalya dışında verilmiş ehliyete ek olarak uluslararası sürücü belgesi gereksinimini resmî İtalya bilgisinden kontrol edin.",
        "Siena ve Lucca tren/otobüsle bağımsız yapılabilir; Chianti köyleri ve bağlar toplu taşımada seyrek olabilir. Şarap tadımı yapacağınız gün sürmeyin. Tur seçerken yalnız 'üç kasaba' sayısına değil her durakta gerçek süreye bakın.",
        "Bölgesel tren kâğıt biletini binmeden doğrulatın; dijital bilet talimatı güncel Trenitalia sistemine göre değişir. Pisa'ya giderken Pisa Centrale ile Pisa San Rossore'nin Duomo alanına mesafesi farklıdır; dönüş istasyonunu karıştırmayın.",
      ],
    },
  ],

  places: [
    {
      name: "Trattoria Cammillo",
      area: "Oltrarno / San Frediano",
      known: "Klasik Toskana trattoriası",
      why:
        "Bistecca kadar kızartmalar, mevsim sebzeleri ve geleneksel ev yemekleriyle Floransa mutfağının genişliğini gösterir.",
      price: "Orta",
      tip: "Özellikle akşam rezervasyon yapın; bistecca ağırlığını ve fiyatını siparişten önce sorun.",
    },
    {
      name: "Trattoria Sostanza",
      area: "Santa Maria Novella",
      known: "Tereyağlı tavuk ve enginarlı omlet",
      why:
        "Küçük, ortak masalı tarihî salonda yalnız bistecca değil birkaç kuşaktır değişmeyen Floransa tabaklarını denemek için gidilir.",
      price: "Orta",
      tip: "Kapasitesi az ve servis düzeni belirgindir; açık günü/saati doğrulayıp rezervasyon yapın.",
    },
    {
      name: "Da Nerbone",
      area: "Mercato Centrale alt kat",
      known: "Lampredotto ve bollito sandviç",
      why:
        "Pazar ritmi içinde hızlı, ekonomik ve klasik sakatat sandviçini bagnato/sos tercihleriyle denemek için temel duraktır.",
      price: "Ekonomik",
      tip: "Pazar saatine bağlı erken kapanabilir; içerik sakatattır, sıra gelmeden seçiminizi belirleyin.",
    },
    {
      name: "Tripperia Pollini",
      area: "Sant'Ambrogio",
      known: "Sokak tezgâhında lampredotto",
      why:
        "Sant'Ambrogio pazar gününde yerel müşteri akışı içinde Floransa'nın en karakterli hızlı yemeğini denetimsiz tur paketinden uzak sunar.",
      price: "Ekonomik",
      tip: "Ayakta yenir ve servis gündüzdür; tatil/açık gününü sosyal kanalından kontrol edin.",
    },
    {
      name: "I'Brindellone",
      area: "San Frediano",
      known: "Büyük porsiyonlu Toskana klasikleri",
      why:
        "Oltrarno'da ribollita, makarna ve paylaşmalık etleri gösterişsiz bir mahalle trattoria atmosferinde birleştirir.",
      price: "Orta",
      tip: "Porsiyonları paylaşın; yoğun futbol/hafta sonu akşamlarında önceden rezervasyon yapın.",
    },
    {
      name: "Il Santo Bevitore",
      area: "Santo Spirito",
      known: "Mevsimsel çağdaş Toskana mutfağı",
      why:
        "Klasik malzemeleri daha modern tabaklarla görmek, aynı bölgede geleneksel trattoria öğününü tekrar etmemek için iyi karşıtlık sunar.",
      price: "Yüksek",
      tip: "Aynı isimli fırın/şarap barıyla adresi karıştırmayın; resmî kanaldan masa ayırın.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — Duomo ve Accademia",
      morning:
        "Duomo meydanına erken gidin; zamanlı kubbe tırmanışı veya Opera del Duomo Müzesi ile kompleksi okuyun.",
      afternoon:
        "Rezervasyonlu Accademia; ardından San Marco ve Santissima Annunziata çevresinde daha sakin yürüyüş.",
      evening:
        "Sant'Ambrogio veya Santa Croce'de aperitivo/yemek; ertesi Uffizi biletinizi kontrol edin.",
    },
    {
      title: "2. Gün — Uffizi ve Signoria",
      morning:
        "Uffizi'ye saatli resmî biletle girin; başyapıt listesi yerine seçili salonlarda yavaşlayın.",
      afternoon:
        "Piazza della Signoria, Palazzo Vecchio'dan ilginize göre bölüm ve Ponte Santa Trinita manzarası.",
      evening:
        "Ponte Vecchio üzerinden Oltrarno'ya geçip Santo Spirito veya San Frediano'da yemek.",
    },
    {
      title: "3. Gün — Pitti, Boboli ve San Miniato",
      morning:
        "Pitti Sarayı'nda tek koleksiyon odağı; hava serinse Boboli Bahçeleri.",
      afternoon:
        "Oltrarno atölyeleri ve San Niccolò; otobüsle veya yürüyerek Piazzale Michelangelo.",
      evening:
        "San Miniato al Monte'nin ziyaret/ibadet düzenine saygıyla gün batımı; merkezde hafif akşam yemeği.",
    },
    {
      title: "4. Gün — Santa Croce ve yaşayan pazar",
      morning:
        "Sant'Ambrogio Pazarı, Santa Croce kompleksi ve dar sokaklarda zanaat durakları.",
      afternoon:
        "İlginize göre Bargello, Medici Şapelleri veya Santa Maria Novella; yalnız birini seçin.",
      evening:
        "Arno boyunca son passeggiata; sonraki treninizin Firenze istasyonunu ve kâğıt bilet doğrulamasını kontrol edin.",
    },
  ],

  practicalHeading: "Floransa'da bilet ve ulaşım hatalarını önleyen notlar",
  practicalTips: [
    {
      title: "Duomo ücretsiz, kubbe ayrı rezervasyondur",
      body: "Katedral ana nefi ile kubbe/çan kulesi/müze geçişlerini karıştırmayın. Kubbe bileti isimli ve kesin saatlidir; asansör yoktur.",
    },
    {
      title: "Uffizi'nin resmî alan adını kullanın",
      body: "uffizi.it üzerinden tickets.uffizi.it kanalına ilerleyin. Reklam sonucu ve benzer adla satılan pahalı paketleri resmî bilet sanmayın.",
    },
    {
      title: "Accademia'ya valizle gitmeyin",
      body: "Güncel müze kuralında büyük eşya için vestiyer yoktur. Bagajı otel veya lisanslı depoya bırakıp zamanlı girişe gidin.",
    },
    {
      title: "FLR'de T2 doğrudan çözüm sunar",
      body: "Havalimanı–merkez tramvayında kâğıt bileti doğrulatın veya kişi başına ayrı temassız kart kullanın.",
    },
    {
      title: "Bistecca siparişinde ağırlığı sorun",
      body: "Fiyat çoğu zaman kilo üzerinden ve parça paylaşmalıktır. Kesim tartılmadan yaklaşık toplamı ve pişirme biçimini netleştirin.",
    },
    {
      title: "ZTL kaydını yazılı teyit edin",
      body: "Otel/garaj merkezde diye plakanız otomatik kaydolmaz. Kamera girişinden önce kimin, ne zaman bildirim yapacağını sorun.",
    },
  ],

  faqs: [
    {
      q: "Floransa için kaç gün gerekir?",
      a: "İlk gezi için 3 tam gün yeterli alt sınır, 4 gün daha dengelidir. Toskana günü eklemek istiyorsanız ayrıca bir gün ayırın.",
    },
    {
      q: "Uffizi ve Accademia aynı gün gezilir mi?",
      a: "Mümkündür ama önerilmez. İki yoğun koleksiyonu ayrı günlerde mahalle yürüyüşleriyle eşlemek sanat yorgunluğunu azaltır.",
    },
    {
      q: "Floransa Duomo'ya giriş ücretsiz mi?",
      a: "Katedral ana nefi genel olarak ücretsizdir; kubbe, çan kulesi, vaftizhane, Santa Reparata ve müze için geçiş/bilet gerekir.",
    },
    {
      q: "Floransa Havalimanı'ndan merkeze nasıl gidilir?",
      a: "T2 tramvayı FLR'yi SMN ve merkez yönüne bağlar. Güncel güzergâh/servisi kontrol edin; araç içi temassız ödemede her kişi ayrı kart kullanır.",
    },
    {
      q: "Floransa'da araba gerekir mi?",
      a: "Şehir içinde hayır. Tarihî merkez yürünebilir ve ZTL kameraları vardır. Kırsal Toskana için aracı merkezden ayrıldığınız gün alın.",
    },
    {
      q: "Floransa'da hangi semtte kalınır?",
      a: "Merkez için Duomo/Signoria, tren için SMN, akşam ve yerel atmosfer için Oltrarno, pazar/yemek için Sant'Ambrogio uygundur.",
    },
  ],

  relatedGuides: [
    {
      city: "Roma",
      anchor: "Floransa'dan Roma'ya: Rönesans'tan antik katmanlara",
      description: "SMN'den hızlı trenle Roma'ya inin; Kolezyum, merkez ve Vatikan için dört–beş gün ayırın.",
    },
    {
      city: "Venedik",
      anchor: "Floransa'dan Venedik'e: Santa Lucia'ya tren rotası",
      description: "Mestre ile ada istasyonunu karıştırmadan en az iki gece kalın; 2026 erişim QR'ını önceden kontrol edin.",
    },
    {
      city: "Milano",
      anchor: "Floransa'dan Milano'ya: sanat ve tasarım devamı",
      description: "Hızlı trenle Centrale'ye geçip Son Akşam Yemeği, Brera ve Duomo terasını ayrı zamanlara bölün.",
    },
    {
      city: "Napoli",
      anchor: "Floransa'dan Napoli'ye: kuzeyden Campania'ya",
      description: "Hızlı tren sonrası tarihî merkez, MANN ve pizza gününe Pompeii'yi ayrı bir tam gün olarak ekleyin.",
    },
    {
      city: "Amalfi Kıyısı",
      anchor: "Floransa'dan Amalfi Kıyısı'na: Salerno üzerinden deniz",
      description: "Hızlı trenle Salerno bağlantısını ve son feribotu birlikte planlayın; kıyıyı günübirlik fotoğraf turuna çevirmeyin.",
    },
  ],

  sources: [
    { name: "Uffizi Galleries — resmî biletler", url: "https://www.uffizi.it/en/tickets" },
    { name: "Opera di Santa Maria del Fiore — yardım ve geçişler", url: "https://tickets.duomo.firenze.it/en/support/help" },
    { name: "Galleria dell'Accademia — resmî biletler", url: "https://www.galleriaaccademiafirenze.it/en/tickets/" },
    { name: "Feel Florence — havalimanından varış", url: "https://www.feelflorence.it/en/editorial-staff/arriving-plane" },
    { name: "Feel Florence — ZTL haritası", url: "https://www.feelflorence.it/sites/default/files/2025-08/ZTL%20MAP.pdf" },
    { name: "Trenitalia — bölgesel bilet kuralları", url: "https://www.trenitalia.com/en/information/travelling-on-regional-trains.html" },
  ],

  volatileNote:
    "Uffizi, Accademia ve Duomo bilet kapsamı/saatleri; tramvay hizmeti, ZTL, kilise erişimleri, pazar ve restoran çalışma günleri değişebilir. Ziyaretten önce resmî kanalı doğrulayın.",
  reviewed: "2026-08-10",
};

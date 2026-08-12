import { CityGuide } from "./types";

export const sanFrancisco: CityGuide = {
  city: "San Francisco",
  countryCode: "US",
  seoTitle: "San Francisco Gezi Rehberi: Ulaşım, Semtler ve 4 Gün",
  seoDescription:
    "San Francisco'da gezilecek yerler, SFO-BART ulaşımı, Muni ve temassız ödeme, Alcatraz, semt seçimi, gerçek restoranlar, dört günlük rota ve bütçe ipuçları.",
  h1: "San Francisco Gezi Rehberi",
  lede:
    "San Francisco küçük görünen ama yokuş, mikroiklim ve körfezlerle katlanan bir şehir. İyi plan; her ikonu aynı güne doldurmak değil, birbirine komşu semtleri bir araya getirip BART ile Muni'nin farklı işlerini doğru kullanmaktır.",
  quickFacts: [
    { label: "Önerilen süre", value: "4–5 gün" },
    { label: "Havalimanı", value: "SFO · OAK alternatif" },
    { label: "Şehir içi", value: "Muni + BART + yürüyüş" },
    { label: "Araba", value: "Şehir içinde yük" },
    { label: "Kritik eşya", value: "İnce katman ve rüzgârlık" },
  ],
  sections: [
    {
      heading: "Şehri doğru ölçekle okumak: yedi mil kare değil, yedi iklim",
      id: "sehri-anlamak",
      body: [
        "San Francisco'nun merkez haritası kompakt görünür; fakat bir kilometrelik çizgi dik yokuş, kuvvetli rüzgâr veya aktarma yüzünden beklenenden uzun sürebilir. **Downtown/Union Square** ulaşım düğümü ve otel merkezi, **North Beach** yeme-içme ve gece, **Chinatown** gündelik kent hayatı, **Mission** duvar resimleri ve Latin kültürü, **Haight** karşı kültür tarihi, **Marina** ise körfez manzarasıdır.",
        "Kıyı aynı kıyı değildir. Embarcadero doğuda daha korunaklı ve BART/Muni'ye yakınken Golden Gate'in batısı sisli ve rüzgârlı olabilir. Twin Peaks açık görünürken Ocean Beach birkaç dakika sonra gri bir duvarın içinde kalabilir. Hava uygulamasındaki tek şehir sıcaklığına değil, gideceğiniz semte ve saatlik rüzgâra bakın.",
        "Market Street temel eksendir. BART, bölgesel ve hızlı omurgadır; Muni metro, otobüs, tarihi tramvay ve cable car şehir içi ağıdır. İki kurumun ücretleri ve biletleri aynı değildir. Haritada bir hat gördüğünüzde önce BART mı Muni mi olduğunu ayırmak, yanlış peron ve yanlış bilet sorununu azaltır.",
      ],
    },
    {
      heading: "Gezilecek yerleri liste değil, mahalle günü olarak kurmak",
      id: "gezilecek-yerler",
      body: [
        "Embarcadero boyunca Ferry Building, Exploratorium çevresi ve kuzeyde Pier 39 aynı kıyı koridorundadır; ancak Pier 39 ile Fisherman's Wharf'ın hediyelik eşya yoğunluğu şehrin tamamını temsil etmez. Deniz aslanlarını görüp Aquatic Park'a yürüyün, ardından North Beach veya Russian Hill'e çıkarak günü yerel bir semtle dengeleyin.",
        "Golden Gate Bridge'i görmek için tek seçenek köprünün üstü değildir. Crissy Field ve Presidio kıyısı yürüyüş için; Battery Spencer karşı yakadan klasik açı için uygundur. Karşı yakaya geçiş, dönüş ulaşımı ve hava ayrı plan ister. Bisikletle Sausalito'ya gitmek hoş olabilir ama feribot kapasitesi, rüzgâr ve dönüş saatini kontrol etmeden tek yön plan kurmayın.",
        "Golden Gate Park doğu-batı yönünde çok uzundur. de Young, California Academy of Sciences, Japanese Tea Garden, botanik bahçesi ve Ocean Beach'i aynı güne sıkıştırmak yorucudur. Bir büyük kurum seçin; park yürüyüşünü Inner Sunset veya Richmond yemeğiyle birleştirin. SFMOMA ise Downtown/SoMa gününe daha doğal oturur.",
      ],
    },
    {
      heading: "Alcatraz: doğru operatör, doğru iskele, doğru saat",
      id: "alcatraz",
      body: [
        "Alcatraz'a karadan bakmak ücretsizdir; adaya ayak basmak için National Park Service'in yetkili feribot sağlayıcısından zamanlı bilet gerekir. Sokakta veya arama reklamında 'Alcatraz tour' yazan her paket adaya iniş içermez. Bilet ayrıntısında landing, ferry ve hangi iskeleden kalkış yazdığını kontrol edin; resmî kalkış noktası Pier 33'tür.",
        "Gezi yalnız tekne süresi değildir. Güvenlik/sıraya giriş, gidiş, yokuşlu ada yolu, hücre bloğu sesli anlatımı ve dönüşle yarım gün ayırmak daha gerçekçidir. Adadaki servis ve erişilebilirlik koşullarını önceden okuyun. Rüzgâr karadakinden sert olabilir; güneşli merkez havasına güvenip ceketsiz çıkmayın.",
        "Biletler yoğun tarihlerde tükenebilir. İkinci el platformdaki yüksek fiyat, resmî kapasitenin göstergesi değildir. Değişiklik, iptal ve son feribot koşullarını doğrudan operatörden okuyun. Akşam turu farklı atmosfer sunar fakat karanlık dönüş, daha serin hava ve akşam programından vazgeçmek anlamına gelir.",
      ],
    },
    {
      heading: "SFO ve OAK'tan şehre gelmek",
      id: "havalimani-ulasim",
      body: [
        "**San Francisco International (SFO)**, uluslararası ziyaretçi için en doğal kapıdır. BART istasyonu International Terminal içindedir; diğer terminallerden AirTrain ile erişilir. Şehre giden doğru tren yönünü platform ekranından teyit edin. Yoğun saat, planlı bakım ve gece son seferleri değişebildiği için uçuş gününde BART planlayıcısını açın.",
        "BART artık turnikelerde uygun temassız banka kartı ve mobil cüzdanı kabul eder. Aynı yolculukta giriş ve çıkışı **aynı fiziksel kart veya aynı cihazla** yapın; telefondan girip saatle çıkmak iki ayrı ödeme aracı sayılabilir. İsterseniz Clipper kartı da kullanabilirsiniz. Yabancı kart reddedilirse kart bankasının seyahat/güvenlik ayarını kontrol edin.",
        "**Oakland (OAK)** bazı iç hatlarda mantıklı alternatiftir. Havalimanı bağlantısı sizi Coliseum BART istasyonuna taşır, oradan San Francisco yönüne geçersiniz. Haritadaki kısa mesafeye aldanmayın: aktarma, körfez geçişi ve gece frekansı eklenir. Uçuş fiyatı farkını şehirde kaybedeceğiniz zamanla birlikte değerlendirin.",
        "Taksi ve rideshare, üç-dört kişi veya büyük bagajda rekabetçi olabilir; pickup bölgesi terminale göre işaretlidir. BART'ı kalabalık saatte büyük valizle kullanırken geçişleri kapatmayın. Gece çok geç varışta son seferi varsaymak yerine resmî planlayıcı ile taksi tahminini daha uçağa binmeden karşılaştırın.",
      ],
    },
    {
      heading: "Muni, BART, cable car ve ödeme farkları",
      id: "toplu-tasima",
      body: [
        "Muni otobüs, metro, F tarihi tramvayı ve cable car'ı; BART ise havalimanı, Downtown, Mission ve East Bay gibi daha uzun koridorları taşır. Muni'nin otobüs/metro bileti ile cable car ücreti aynı değildir. BART'ta mesafeye göre ücret ve çıkış dokunuşu vardır; Muni'de binerken ödeme kanıtı gerekir.",
        "2026'da Muni araçlarında açık döngü temassız ödeme kullanılabilir. Aynı kart/cihazı kullanmak aktarma penceresinin doğru tanınması için önemlidir. SFMTA, MuniMobile içindeki tek yolculuk ve day pass ürünlerini 1 Ağustos 2026 itibarıyla kaldırdı; visitor passport ve cable car gibi bazı ürünler kalabilir. Eski blog ekranlarına göre uygulama aramayın.",
        "Yabancı banka kartı MuniMobile uygulamasında reddedilirse App Store/Google Play ülkesini değiştirmek ilk çözüm değildir. SFMTA, PayPal veya Apple/Google Pay gibi seçenekleri denemeyi öneriyor; ayrıca temassız kart veya fiziksel Clipper kullanılabilir. Uygulama kurmak, sıradan bir Muni yolculuğunun ön şartı değildir.",
        "Cable car ulaşım kadar tarihî deneyimdir. Powell başlangıcındaki uzun sıraya girmek zorunda değilsiniz; hat üzerindeki uygun duraklarda yer varsa binebilirsiniz. Dış basamakta duruş görevlilerin talimatına bağlıdır. F hattındaki tarihi tramvay cable car değildir; ikisini bilet ve güzergâh bakımından karıştırmayın.",
      ],
    },
    {
      heading: "Nerede kalınır? Ucuz oda ile iyi sokak aynı şey değil",
      id: "nerede-kalinir",
      body: [
        "**Union Square**, ilk ziyaret için BART/Muni, mağaza ve merkezi otel stoğu sağlar. Blok blok değişen sokak hissi nedeniyle yalnız otel yıldızına değil, girişin bulunduğu sokağa ve gece yürüyeceğiniz rotaya bakın. **SoMa**, kongre, SFMOMA ve stadyum etkinliği için pratik; geniş caddeler ve etkinlik dışı sessizlik herkese hitap etmez.",
        "**Fisherman's Wharf**, aileler, erken feribot ve düz kıyı yürüyüşü için kolaydır; yemeklerin turist yoğunluğu ve BART'a uzaklık karşılığında gelir. **North Beach** akşam yemeği ve karakter için güçlü, raylı sisteme yürüyüş ister. **Nob Hill** klasik otel havası ve cable car sunar fakat günlük yokuş bütçesi yaratır.",
        "**Mission** daha yerel yemek ve gece hayatı, BART erişimi ve güneşli mikroiklim sağlar; gürültü/sokak koşulu blok bazında kontrol edilmelidir. **Marina/Cow Hollow** Presidio ve körfeze yakın, havalimanı BART'ına uzak kalır. Richmond veya Sunset sakin ve yemek açısından zengindir; Downtown'a her gün uzun Muni yolculuğu ekler.",
        "Otel toplamında vergi, mandatory destination/amenity fee, park ve provizyonu okuyun. FTC kuralı zorunlu ücreti ilk gösterilen toplamda daha görünür kılsa da vergi ve isteğe bağlı kalemler sonradan eklenebilir. Oda fiyatını ekran görüntüsüyle değil, son ödeme sayfasındaki gecelik toplam ve iptal koşuluyla karşılaştırın.",
      ],
    },
    {
      heading: "Araba, park, köprü geçişi ve araçta eşya",
      id: "araba-ve-park",
      body: [
        "San Francisco merkez gezisinde araç çoğunlukla gereksizdir. Dik sokak, tek yön, pahalı garaj ve cam kırma riski, günlük kirayı avantajdan yüke çevirebilir. Napa, Sonoma veya kıyı yoluna çıkacaksanız aracı şehir günleri bittikten sonra almak çoğu rota için daha mantıklıdır.",
        "Şehir ve polis uyarısı nettir: kiralık araçta görünür veya bagajda **hiçbir değerli eşya bırakmayın**. 'Sadece beş dakika' ve battaniyeyle örtmek güvenli çözüm değildir; valizi otel bagajına bırakın. Havalimanından araçla çıkıp bagaj doluyken turistik noktaya uğramak en kolay önlenebilir hatalardandır.",
        "Golden Gate Bridge'de San Francisco yönündeki geçiş elektronik ücretlidir; gişe nakit almaz. Kiralık şirketin toll programını ve hizmet bedelini teslim almadan sorun. Kendi plakanız/uygun kiralık araç için resmî tek sefer ödeme seçeneğinin zaman penceresini okuyun; yanlış plaka girmek cezaya dönüşebilir.",
        "Sokak parkında renkli bordür, temizlik günü, izin bölgesi ve teker yönü kuralları vardır. Eğimli parkta tekerleği doğru yöne çevirme yerel bir ayrıntı değil, yaptırımı olan güvenlik kuralıdır. Park uygulamasında görünen süre tabeladaki fiziksel kısıtı geçersiz kılmaz.",
      ],
    },
    {
      heading: "San Francisco'da yemek: ikondan göçmen mahallelerine",
      id: "ne-yenir",
      body: [
        "Şehrin yemeğini yalnız sourdough ekmek kâsesinde clam chowder ile tanımlamayın. Körfez deniz ürünleri, Mission burrito, dim sum, bölgesel Çin mutfakları, Filipin, Japon, Burma ve Kaliforniya'nın mevsimsel ürün yaklaşımı aynı haritada bulunur. Chinatown ile Richmond'daki Çin restoranları da aynı menü mantığında değildir.",
        "Mission burrito büyük, folyoya sarılı ve taşınabilir bir öğündür; taqueria'da sıra hızlı ilerler, masaya servis beklemeyin. Sabah fırın kuyruğu ile akşam rezervasyon restoranı farklı zaman maliyetleri yaratır. Popüler bir yer için tüm günü bozmak yerine aynı semtte iki doğrulanmış yedek belirleyin.",
        "Masa servisinde vergi öncesi yüzde 15–20 bahşiş yaygındır. Faturada service charge, SF mandate veya employee benefit kalemi görürseniz bunun otomatik gratuity olup olmadığını sorun; isim benzerliği aynı anlama gelmez. Counter servis ekranındaki yüksek hazır yüzdeler öneridir, yasal mecburiyet değildir.",
        "Restoran saatleri ve servis biçimi hızlı değişir. Resmî siteyi aynı gün kontrol edin; yalnız harita kartına güvenmeyin. Özellikle Swan Oyster Depot gibi az koltuklu gündüz kurumlarında sıra, deneyimin gerçek maliyetidir. State Bird Provisions gibi rezervasyon odaklı yerde ise açılan takvimi takip etmek gerekir.",
      ],
    },
    {
      heading: "Sis, katman ve doğru mevsim beklentisi",
      id: "mevsim",
      body: [
        "San Francisco yazı Akdeniz yazı gibi değildir. Haziran–ağustos döneminde kıyı sisi ve rüzgâr özellikle sabah/akşam sert olabilir; birkaç mahalle ötede Mission güneşli kalabilir. İnce tişört, orta katman ve rüzgâr kesen dış katman, tek kalın monttan daha kullanışlıdır.",
        "Eylül–ekim çoğu zaman daha sıcak ve açık günler getirebilir; bu garanti değildir. Kış yağmur dönemidir, fakat şehir gezisi tamamen kapanmaz. Yağmurlu günü SFMOMA, Exploratorium, Ferry Building ve mahalle yemekleriyle; açık pencereyi köprü, Twin Peaks ve kıyı yürüyüşüyle değiştirilebilir tutun.",
        "Golden Gate Bridge'i ilk ve son kez tek bir saate bağlamayın. Sis görüşü kapatırsa Presidio gününü müze/mahalleyle sürdürüp daha sonra yeniden deneyin. Alcatraz gibi zamanlı etkinlik sabittir; manzara durakları esnek olmalıdır. Gün batımından sonra sıcaklık hızlı düşer.",
      ],
    },
    {
      heading: "Güvenlik, sokak gerçekliği ve saygılı ziyaret",
      id: "guvenlik",
      body: [
        "San Francisco'daki barınma, ruh sağlığı ve madde kullanımı krizi ziyaretçinin bazı merkez sokaklarında görebileceği bir gerçektir. İnsanları fotoğraf nesnesine dönüştürmeyin. Rahatsız olduğunuz durumda tartışmaya girmeden aydınlık ve aktif caddeye geçin; acil tehlikede 911, acil olmayan durumda yerel hattı kullanın.",
        "Telefon kapma ve araç hırsızlığına karşı temel önlem, çevre farkındalığı ve eşyayı araçta bırakmamaktır. Toplu taşımada çantayı kapıya yakın gevşek taşımayın. Gece rotasında yalnız en kısa çizgiye değil, açık işletmeler ve aktarma sayısına bakın. Mahalleleri tek bir sosyal medya videosuyla toptan 'güvenli/güvensiz' etiketlemeyin.",
        "Turistlerin sık yaptığı plan hataları Alcatraz'ı biletsiz bırakmak, cable car sırasını tüm sabaha yaymak, her yokuşu yürümek ve yazın ceketsiz gelmektir. Bütçe hataları ise şehir içinde araç/garaj ödemek ve zorunlu otel ücretini son ekranda fark etmektir. İyi rota bu sürtünmeleri baştan azaltır.",
      ],
    },
  ],
  places: [
    { name: "Swan Oyster Depot", area: "Polk Gulch", known: "Tezgâhta deniz ürünü ve istiridye", why: "Az koltuklu, gündüz çalışan kurum şehrin eski deniz ürünü kültürünü gösterir. Menüden çok ürün ve tezgâh ritmi için gidilir.", price: "Yüksek", tip: "Sıra ve günlük ürün değişir; açılış/saat bilgisini aynı gün resmî kanaldan kontrol edin." },
    { name: "Zuni Café", area: "Hayes Valley", known: "Kaliforniya mutfağı ve odun fırını tavuk", why: "Mevsimsel ürün ve gündelik görünen ama teknik açıdan güçlü servis, şehrin modern yemek kimliğinin önemli bir parçasıdır.", price: "Yüksek", tip: "Meşhur tavuk zaman ve porsiyon ister; rezervasyonda hazırlık beklentisini okuyun." },
    { name: "La Taqueria", area: "Mission", known: "Mission-style burrito ve taco", why: "Mahallenin hızlı servis geleneğini, pirinçsiz burrito yaklaşımıyla güçlü ve erişilebilir biçimde temsil eder.", price: "Ekonomik", tip: "Sıra hızlı hareket edebilir; ödeme yöntemi ve güncel saatleri resmî siteden doğrulayın." },
    { name: "Tartine Bakery", area: "Mission", known: "Hamur işi ve ekmek", why: "San Francisco'nun ekşi maya ve çağdaş fırın kültürünü mahalle ölçeğinde deneyimlemek için güvenilir duraktır.", price: "Orta", tip: "Guerrero konumuyla Manufactory'yi karıştırmayın; istediğiniz ürünün hangi şubede olduğunu kontrol edin." },
    { name: "State Bird Provisions", area: "Fillmore", known: "Arabadan seçilen küçük tabaklar", why: "Kaliforniya malzemelerini dim sum benzeri servis ritmiyle birleştiren, kopyası zor bir akşam deneyimidir.", price: "Yüksek", tip: "Rezervasyon takvimi çabuk dolabilir; yürüyerek giriş için uzun bekleme ihtimaline karşı semtte yedek belirleyin." },
    { name: "House of Nanking", area: "Chinatown", known: "Uzun ömürlü Çin-Amerikan mahalle kurumu", why: "Chinatown'un yaşayan restoran tarihini turistik cepheden daha doğrudan hissettirir; San Francisco Legacy Business sicilinde yer alır.", price: "Orta", tip: "Yoğun saatte sıra ve hızlı servis bekleyin; özel isteği sipariş başında açık söyleyin." },
  ],
  itinerary: [
    { title: "Embarcadero, Chinatown ve North Beach", morning: "Ferry Building ve Embarcadero yürüyüşü; pazar günü ise çiftçi pazarı saatini doğrulayın.", afternoon: "Chinatown sokakları ve tarih duraklarından North Beach'e yürüyüş; Pier 39'u kısa bir kıyı sapması olarak ekleyin.", evening: "North Beach yemeği, Coit Tower çevresi veya ışık durumuna göre Aquatic Park." },
    { title: "Alcatraz ve kuzey kıyısı", morning: "Pier 33'ten önceden alınmış resmî Alcatraz feribotu; erken varış ve katmanlı giyim.", afternoon: "Aquatic Park, Fort Mason ve Marina üzerinden Crissy Field/Presidio; enerjinize göre kısaltın.", evening: "Marina, Russian Hill veya Polk çevresinde yemek; cable car'ı ulaşım ve deneyim olarak tek yönde kullanın." },
    { title: "Golden Gate Park ve batı mahalleleri", morning: "Parkta de Young veya Academy of Sciences'tan birini derin gezme.", afternoon: "Bahçe ve yürüyüş; hava açıksa Ocean Beach, değilse Inner Sunset/Richmond dükkân ve yemek rotası.", evening: "Richmond'da bölgesel Asya mutfağı veya gün batımı uygunsa Lands End'in güvenli, işaretli bölümü." },
    { title: "Mission, Castro ve kent manzarası", morning: "Mission duvar resimleri için saygılı yürüyüş, ardından taqueria öğle yemeği.", afternoon: "Dolores Park ve Castro tarihi; ilgiye göre Haight veya SFMOMA ile yön seçin.", evening: "Hava açıksa gün batımına yakın Twin Peaks için güvenli ulaşım; ardından Mission/Hayes Valley akşam yemeği." },
  ],
  practicalHeading: "San Francisco'da geziyi belirgin biçimde kolaylaştıran bilgiler",
  practicalTips: [
    { title: "BART ve Muni aynı sistem değil", body: "BART bölgesel omurga, Muni şehir içi ağdır. Ücret, aktarma ve ödeme ürününü birbirinin yerine varsaymayın." },
    { title: "Aynı kart veya aynı cihaz", body: "Temassız giriş-çıkışta telefon, saat ve fiziksel kart farklı kimliklerdir. BART'tan hangi araçla girdiyseniz onunla çıkın." },
    { title: "MuniMobile 2026'da değişti", body: "Tek yolculuk ve day pass ürünleri 1 Ağustos 2026'da uygulamadan kaldırıldı. Eski ekran görüntüsünü aramak yerine temassız veya Clipper kullanın." },
    { title: "Alcatraz için Pier 33", body: "Adaya iniş içeren bileti yetkili operatörden alın. İsmi benzer körfez turunun yalnız adanın çevresinden geçmesi mümkündür." },
    { title: "Araçta sıfır eşya", body: "Bagaj dahil hiçbir görünür/değerli eşya bırakmayın. Kiralık araçla otele uğramadan turistik durak yapmayın." },
    { title: "Golden Gate nakitsiz", body: "San Francisco yönündeki geçiş elektronik ücretlidir. Kiralık şirket programını ve resmî tek sefer ödeme penceresini önceden öğrenin." },
    { title: "Yazın da rüzgârlık", body: "Mission güneşliyken köprü ve Ocean Beach sisli olabilir. Katmanı otelde bırakmayın." },
    { title: "Yokuşu haritada görün", body: "İki paralel sokak arasında ciddi eğim olabilir. Erişilebilir/az eğimli rota için harita yükselti ve Muni seçeneğini kontrol edin." },
  ],
  faqs: [
    { q: "San Francisco için kaç gün yeterli?", a: "Dört tam gün merkez semtler, Alcatraz, Presidio ve Golden Gate Park için dengelidir. Sausalito, Oakland veya müze derinliği eklenirse beşinci gün rahatlatır." },
    { q: "San Francisco'da araba gerekir mi?", a: "Şehir içinde hayır. Muni, BART ve yürüyüş daha pratiktir; araç park maliyeti ve eşya güvenliği riski yaratır. Bölge dışına çıkacağınız gün kiralayın." },
    { q: "SFO'dan merkeze en kolay yol nedir?", a: "BART, International Terminal'den Downtown ve Mission'a doğrudan gider. Son sefer, bakım ve otelinizin istasyona gerçek yürüyüşünü uçuş günü kontrol edin." },
    { q: "Alcatraz bileti nereden alınır?", a: "National Park Service'in gösterdiği yetkili feribot işletmesinden alın. Paketin adaya iniş içerdiğini ve Pier 33 kalkışını doğrulayın." },
    { q: "Clipper kart almak şart mı?", a: "Hayır; BART ve Muni'de uygun temassız banka kartı/cihaz kullanılabilir. Birden çok yolcu, pass veya bölgesel kullanımda Clipper hâlâ yararlı olabilir." },
    { q: "En iyi seyahat dönemi hangisi?", a: "Eylül–ekim çoğu ziyaretçi için daha açık ve ılıman olabilir; garanti değildir. Yaz sisi için katman, kış için yağmur alternatifi olan esnek plan gerekir." },
  ],
  relatedGuides: [
    { city: "Los Angeles", anchor: "Kaliforniya rotasını güneye uzatın", description: "Kompakt ve toplu taşımalı San Francisco'dan, koridorlar ve otomobil kararlarıyla şekillenen Los Angeles'a geçin." },
    { city: "Las Vegas", anchor: "Körfezden çöle geçin", description: "Şehir içi doğa ve mahalle ritminden, Strip lojistiği ile Red Rock planının öne çıktığı farklı bir batı deneyimine." },
  ],
  sources: [
    { name: "BART — SFO airport guide", url: "https://www.bart.gov/guide/airport/sfo" },
    { name: "BART — contactless payment", url: "https://www.bart.gov/news/articles/2025/news20250819" },
    { name: "SFMTA — Muni fares", url: "https://www.sfmta.com/getting-around/muni/fares" },
    { name: "SFMTA — MuniMobile", url: "https://www.sfmta.com/getting-around/muni/fares/munimobile" },
    { name: "NPS — Alcatraz fees and passes", url: "https://www.nps.gov/alca/planyourvisit/fees.htm" },
    { name: "Golden Gate — toll payment", url: "https://www.goldengate.org/bridge/tolls-payment/" },
    { name: "San Francisco — Park Smart", url: "https://www.sf.gov/information/park-smart" },
    { name: "Zuni Café", url: "https://www.zunicafe.com/" },
    { name: "La Taqueria", url: "https://lataqueriasf.com/" },
    { name: "Tartine", url: "https://tartinebakery.com/" },
    { name: "State Bird Provisions", url: "https://statebirdsf.com/" },
    { name: "SF Legacy Business — House of Nanking", url: "https://legacybusiness.org/business/house-of-nanking" },
  ],
  volatileNote: "BART ve Muni ücret/ürünleri, Alcatraz kapasitesi, sis, köprü ödeme koşulları ve restoran servis saatleri değişebilir; seyahate yakın resmî kanalları doğrulayın.",
  reviewed: "2026-08-09",
};

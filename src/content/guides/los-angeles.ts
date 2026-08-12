import { CityGuide } from "./types";

export const losAngeles: CityGuide = {
  city: "Los Angeles",
  countryCode: "US",
  seoTitle: "Los Angeles Gezi Rehberi: Arabalı ve Arabasız Gerçek Plan",
  seoDescription:
    "Los Angeles'ta semt seçimi, 2026 Metro ve LAX ulaşımı, araba-parking-toll gerçekleri, plajlar, restoranlar, coğrafi 4 günlük rota ve bütçe ipuçları.",
  h1: "Los Angeles Gezi Rehberi",
  lede:
    "Los Angeles tek bir merkez değil, birbirinden otoyollarla ayrılan onlarca şehir deneyimidir. İyi gezi; Hollywood, Downtown ve plajları bir günde kovalamak yerine aynı koridordaki mahalleleri gruplayıp aracı yalnız gerçekten avantaj sağladığı günlerde kullanır.",
  quickFacts: [
    { label: "Önerilen süre", value: "4–6 gün" },
    { label: "Havalimanı", value: "LAX; ayrıca BUR · LGB" },
    { label: "Toplu taşıma", value: "Metro + otobüs; 2026 temassız" },
    { label: "Araba", value: "Rotaya göre yararlı" },
    { label: "Temel kural", value: "Mesafe, süre değildir" },
  ],
  sections: [
    {
      heading: "Los Angeles'ın yerel mantığı: günü koridorlara bölün",
      id: "sehri-anlamak",
      body: [
        "Haritada Santa Monica ile Downtown arasında tek bir şehir görürsünüz; pratikte bu aks trafik saatine göre bir yolculuk gününün omurgasıdır. Sabah Griffith, öğlen Venice, akşam Downtown gibi üç köşeli planlar kâğıt üzerinde çekici, yolda yorucudur. Westside, Central LA/Hollywood, Downtown–Eastside ve South LA kümelerini ayrı günlerde ele alın.",
        "Los Angeles 'arabası olmayan gezilmez' kadar basit değildir. Metro raylı sistem Downtown, Koreatown, Hollywood, Santa Monica, Pasadena ve yakın çevreyi bağlar; otobüs ağı daha geniştir. Oteliniz ve ana ilgi noktalarınız bu hatlardaysa ilk iki günü arabasız geçirmek mümkündür. Malibu, dağ yürüyüşleri, çok sayıda uzak yemek durağı veya stüdyo bölgesi planlıyorsanız araç anlam kazanır.",
        "Konaklamayı ucuzlukla değil rota ağırlık merkeziyle seçin. Her gün batıdan doğuya gidip gelmek, düşük oda fiyatını yakıt, park ve zamanla geri alır. Aynı gezi içinde otel değiştirmek çoğu zaman gereksizdir; ama plaj ağırlıklı bir programla Downtown etkinliklerini tek üsse zorlamak da iyi sonuç vermez.",
      ],
    },
    {
      heading: "Gezilecek yerler: şehrin dört farklı yüzü",
      id: "gezilecek-yerler",
      body: [
        "**Griffith Observatory** şehir ve Hollywood Sign manzarasının en iyi kamusal duraklarından biridir. Bina, etkinlik ve park düzeni değişebilir; gün batımında araç kuyruğu uzar. Aşağıdaki toplu taşıma/servis bağlantısını veya park edip yürümeyi düşünün. Hollywood Boulevard ise kısa bir kültür tarihi durağıdır; tüm günü yıldız arayarak geçirmek Los Angeles'ın geri kalanını kaçırır.",
        "**Getty Center** koleksiyon kadar Richard Meier mimarisi, bahçesi ve şehir manzarası için gidilir. Giriş ücretsiz olsa da zamanlı rezervasyon gerekir ve otopark ücretlidir; çevre sokaklarında ziyaretçi parkı yoktur. Bunu 'ücretsiz müze' diye bütçeye sıfır yazmak, araçla gelenlerin sık yaptığı hatadır.",
        "**Downtown** içinde Grand Central Market, Bradbury Building dış/izin verilen alanları, Angels Flight, The Broad, Walt Disney Concert Hall ve Little Tokyo yürünebilir kümelenir. Her kurumun ücretsiz giriş ve rezervasyon kuralı farklıdır. Arts District akşam yemeğiyle birleştirilebilir; Skid Row'u turistik kestirme gibi kullanmadan harita rotasını ana yaya akslarında tutun.",
        "**Santa Monica ve Venice** aynı şey değildir. Santa Monica daha düzenli sahil merkezi ve toplu taşıma son durağı; Venice Boardwalk daha ham, kalabalık ve performans odaklıdır. İkisini bisiklet yolu veya yürüyüşle bağlamak, ayrı ayrı park aramaktan daha iyi çalışır. Denize girecekseniz cankurtaran uyarıları ve su koşullarını izleyin.",
      ],
      subsections: [
        {
          heading: "Stüdyo turu mu tema parkı mı?",
          body: [
            "Warner Bros. gibi stüdyo turları yapım süreçlerine odaklanır; Universal Studios ise tam günlük tema parkıdır. İsimleri benzer amaç taşımıyormuş gibi planlayın. Universal için resmî uygulama, güncel çalışma saatleri ve sıra sistemini seyahate yakın kontrol edin; CityWalk ile parkın bir günün çoğunu alacağını kabul edin.",
          ],
        },
      ],
    },
    {
      heading: "Nerede kalınır? İlgi alanına göre üs seçimi",
      id: "nerede-kalinir",
      body: [
        "**Santa Monica** yürünebilirlik, plaj ve ilk kez gelen için rahattır; Downtown ve Eastside'a uzaktır, oda ve park pahalı olabilir. **West Hollywood** restoran, gece hayatı ve merkezi konum dengesi sunar; raylı sisteme doğrudan erişim her noktada iyi değildir. **Hollywood** Metro B Line ve turistik yerlere yakın, sokak kalitesi bloktan bloğa değişken olabilir.",
        "**Downtown LA** müze, konser, spor ve raylı sistem bağlantıları için mantıklıdır. Plaj tatili bekleyenler için doğru üs değildir. **Koreatown** gece geç yemeği, daha merkezi fiyatlar ve D Line erişimi sağlar; parkı zor ve bazı otellerde gürültülü olabilir. **Beverly Hills/Westwood** sakin ve yüksek bütçeli; araba veya otobüs planı daha önemlidir.",
        "Otel seçerken günlük park ve vale ücretini oda fiyatının parçası sayın. 'Parking available' ücretsiz demek değildir. Resort/destination fee artık gösterilen zorunlu toplamın içinde görünmeli, fakat vergiler ve seçtiğiniz otopark gibi ekler ayrıca çıkabilir. Check-in provizyonunu ve araç giriş-çıkış hakkını yazılı koşullarda arayın.",
      ],
    },
    {
      heading: "2026 Metro: TAP zorunlu değil, aynı kart önemli",
      id: "toplu-tasima",
      body: [
        "Mayıs 2026 itibarıyla LA Metro, fiziksel temassız kredi/banka kartı ile Apple Pay/Google Pay'i doğrudan kabul ediyor. Düzenli tam ücretli ziyaretçi artık yalnız bu gezi için TAP kartı kurmak zorunda değil. Temassız ödeme iki saatlik Metro aktarmaları ve günlük/haftalık ücret tavanı sunuyor; avantajın çalışması için aynı fiziksel kartı veya aynı dijital cihazı kullanın.",
        "TAP hâlâ 25'i aşkın bölgesel kurumla çalışan kullanışlı bir karttır; Metro dışındaki otobüsleri yoğun kullanacaksanız kapsama göre mantıklı olabilir. Yeni Official LA Metro uygulaması 2026'da yol planlama ve servis bilgisi için yayımlandı. App Store ülkesini sırf uygulama için değiştirmeden önce metro.net web planlayıcı ve harita alternatifini deneyin; ücret ödemek için uygulama şart değildir.",
        "Raylı hatlar her turistik noktaya gitmez. İstasyondan sonraki son kilometreyi otobüs, yürüyüş veya kısa uygulama aracıyla tamamlayın. Gece dönüşünde servis sıklığını ve son bağlantıyı önceden kontrol edin. Telefonunuzun pilini harita ve bilet için tek dayanak yapıyorsanız powerbank taşıyın.",
      ],
    },
    {
      heading: "LAX'ten çıkış: terminal kaldırımında araç beklemeyin",
      id: "havalimani-ulasim",
      body: [
        "LAX'te standart Uber/Lyft ve taksi alımları, Terminal 1 yanındaki **LAX-it** alanında yapılıyor. Varış katındaki yeşil işaretli ücretsiz shuttle'a binin veya terminalinize göre yürüyün. Premium uygulama araçları ve bazı özel hizmetler terminalden alabilir; gidişte uygulama araçları doğrudan terminale bırakır. Eski içeriklerde 'people mover açıldı' iddiasına güvenmeyin: Ağustos 2026 araştırmasında havalimanının resmî sayfası sistemi hâlâ inşaat/gelecek bağlantı olarak anlatıyor ve LAX-it aktif.",
        "FlyAway otobüsü Union Station ve Van Nuys gibi noktalara doğrudan alternatif sunar; güncel durak ve ödeme düzenini LAX sayfasından doğrulayın. Metro bağlantısı kullanacaksanız valiz, aktarma ve gece saatini hesaba katın. Santa Monica oteli ile Downtown oteli için aynı 'en iyi' transfer yoktur.",
        "Burbank (BUR), Hollywood ve Valley tarafı için küçük ve kolay; Long Beach (LGB), güney ve kıyı rotası için uygun olabilir. Ancak Türkiye bağlantılı bilette ayrı rezervasyon yaptıysanız, bagajı alıp yeniden verme ve gecikmede korunmama riskini değerlendirin. 'Los Angeles' yazan en ucuz havalimanını otomatik seçmeyin.",
      ],
    },
    {
      heading: "Araba, park ve otoyollar: kiralamadan önce hesap",
      id: "araba-park",
      body: [
        "Araç kiralayacaksanız programı ikiye bölmek verimlidir: raylı sistemle yapılabilen Downtown/Hollywood günlerinde araç ve otel parkı ödemeyin; Westside, Malibu veya dağ günü öncesinde alın. Yoğun saati tek bir saat değil, sabah ve öğleden sonra geniş pencereler olarak düşünün. Carpool/HOV ve ExpressLane tabelalarını aynı şey sanmayın; ücretli şerit koşulları koridora göre değişir.",
        "Sokak tabelaları katmanlıdır: temizlik günü, saat sınırı, permit bölgesi, kırmızı/sarı/beyaz kaldırım birbirinden ayrı kuraldır. Yalnız parkmetreye para yatırmanız alanı her zaman yasal yapmaz. LADOT'un PARK SMARTER uygulaması birçok şehir metresinde, ParkMobile belirli bölgelerde çalışır; metre üzerindeki logo/zone numarasını esas alın. Text to Pay seçeneği de bazı metrelerde uygulama kurmadan ödeme sağlar.",
        "Kaliforniya'nın elektronik toll sistemleri koridora göre değişir. Los Angeles çevresindeki Metro ExpressLanes ile Orange County Toll Roads aynı kullanıcı deneyimi değildir. Kiralama şirketinin toll programını, günlük kullanım/idarî ücreti ve plakanın sizin adınıza nasıl kaydedildiğini gişeden çıkmadan sorun. Nakit gişe varsaymayın.",
        "Arabada valiz, pasaport veya alışveriş poşeti bırakmayın; bagajda görünmese bile gezi günü depolama çözümünü önceden kurun. Yakıt pompalarının bazıları yabancı kartta ABD ZIP kodu isteyebilir. Evrensel bir sahte ZIP denemek yerine kasaya gidip belirli tutar için ön ödeme yapın; kullanılmayan farkın iadesini görevliye sorun.",
      ],
    },
    {
      heading: "Los Angeles mutfağı: mahalleler menüden önce gelir",
      id: "ne-yenir",
      body: [
        "LA yemek sahnesini 'Hollywood restoranları' listesiyle anlayamazsınız. Koreatown'da Kore barbeküsü ve geç saat yemekleri, East LA/Boyle Heights'ta Meksika gelenekleri, Thai Town'da bölgesel Tay, Little Ethiopia'da paylaşmalı tabaklar, San Gabriel Valley'de Çin mutfakları kendi coğrafyasına sahiptir. Yemek hedefini o günün bölgesine koyun; bir taco için şehrin öbür ucuna trafik yaratmayın.",
        "Taco kamyonu ve sokak standında menü kısa, oturma sınırlı, ödeme düzeni değişken olabilir. Nakit yedek taşıyın ama kart/temassız simgesini kontrol edin. Etiket fiyatına vergi eklenebilir. Masa servisinde faturadaki service charge ile gratuity'nin aynı işlevi görüp görmediğini okuyun; otomatik ücret, her işletmede çalışana aynı şekilde dağıtılmayabilir, gerekirse sorun.",
        "Kahve ve brunch için uygulama/loyalty hesabı kurmak zorunlu değil. Yabancı App Store hesabıyla görünmeyen bir uygulama varsa ana Apple hesabının ülkesini değiştirmek yerine web siparişini, QR menüyü veya tezgahta ödemeyi kullanın. Şehrin en iyi yemeklerinin çoğu mobil sipariş 'hack'i gerektirmez.",
      ],
    },
    {
      heading: "Güvenlik, iklim ve sık yapılan hatalar",
      id: "guvenlik-mevsim",
      body: [
        "LA'de güvenlik blok ve saate göre değişir; sosyal medya genellemeleri yerine otelinizin giriş yolunu, gece ulaşımını ve etkinlik çıkışını planlayın. Telefonu araç koltuğunda, çantayı cam önünde bırakmamak; ıssız otoparkta uzun süre eşya düzenlememek; uygulama aracının plakasını doğrulamak somut önlemlerdir.",
        "Kıyı sabahları yazın bile serin ve bulutlu, iç kesimler aynı gün çok sıcak olabilir. Katman taşıyın ve güneş korumasını bulutlu sahilde de kullanın. Orman yangını dumanı ve yol kapanmaları mevsimsel olarak değişir; dağ/kanyon günü öncesinde hava kalitesi ve resmî park/itfaiye uyarılarını kontrol edin.",
        "En yaygın hata ucuz oteli uzak banliyöde seçmek, her güne iki saat trafik eklemek ve park maliyetini bütçeden silmektir. İkinci hata, transit hattı üzerindeki çok iyi bir plan varken bütün gezi için araç almaktır. Üçüncüsü, Hollywood Sign'a fiziksel olarak 'varılan' tek bir nokta sanıp yasak mahalle yollarına girmektir; resmî seyir/yürüyüş rotalarını kullanın.",
      ],
    },
  ],
  places: [
    { name: "Guelaguetza", area: "Koreatown", known: "Oaxaca mutfağı ve mole", why: "LA'nin Meksika yemek kültürünü tek tip taco fikrinden çıkarır. Mole çeşitleri, tlayuda ve paylaşmalı tabaklar için gidilir.", price: "Orta", tip: "Canlı müzik/etkinlik günleri ve rezervasyon düzenini resmî siteden kontrol edin." },
    { name: "Holbox", area: "Mercado La Paloma", known: "Meksika kıyı deniz ürünleri", why: "Aguachile, ceviche ve deniz ürünü taco üzerinden Yucatán ve Pasifik etkilerini rafine ama rahat bir pazar ortamında gösterir.", price: "Orta", tip: "Günlük ürün ve sıra değişebilir. Resmî site 2024–2025 Michelin yıldızı bilgisini yayımlıyor; güncel statüyü seyahat tarihinde yeniden kontrol edin." },
    { name: "Langer's Delicatessen", area: "Westlake", known: "No. 19 pastrami sandviçi", why: "Doğu yakası deli geleneğinin Los Angeles yorumunu, kalın kesilmiş pastrami ve tarihî salonla deneyimletir.", price: "Orta", tip: "Çalışma saatleri sınırlı olabilir; öğle planını resmî siteden kurun ve yakın Metro istasyonunu değerlendirin." },
    { name: "Philippe The Original", area: "Chinatown / Downtown", known: "French Dip sandviç", why: "1908'den beri çalışan, ortak masalı eski LA lokantası. French Dip'in şehir hikâyesini uygun tempolu bir Downtown öğününe dönüştürür.", price: "Ekonomik", tip: "Et ve ıslaklık/dip tercihini tezgahta net söyleyin; etkinlik gününde Union Station çevresi yoğunlaşır." },
    { name: "Grand Central Market", area: "Downtown", known: "Tarihî pazar ve çoklu tezgâh", why: "Grup içinde farklı bütçe ve istekleri tek öğünde çözer. Pazarı tek bir 'ünlü yumurtalı sandviç' kuyruğuna indirgemeden birkaç tezgâhı paylaşın.", price: "Ekonomik", tip: "Öğle yoğunluğundan önce gidin; her tezgâhın günü ve saati farklı olabilir." },
    { name: "République", area: "Mid-Wilshire", known: "Fırın, brunch ve akşam servisi", why: "Tarihî binada sabah pastane kuyruğu ile rezervasyonlu akşam yemeğinin iki farklı deneyimini sunar; özel bir öğün için güçlüdür.", price: "Yüksek", tip: "Brunch ve akşamın servis düzeni aynı değildir; doğru hizmet için resmî rezervasyon sayfasını kullanın." },
  ],
  itinerary: [
    { title: "Downtown ve Eastside", morning: "Union Station, Olvera Street ve Little Tokyo; ardından Broad/Disney Hall için rezervasyonlu ziyaret.", afternoon: "Grand Central Market, Bradbury Building çevresi ve Arts District. Açılış günlerine göre müzeyi öne alın.", evening: "Arts District veya Koreatown'da yemek; araç kullanıyorsanız alkol planıyla sürüşü ayırın." },
    { title: "Hollywood ve Griffith", morning: "Hollywood Boulevard'ı kısa tutun; sinema tarihi ilginize göre Academy Museum'a geçin.", afternoon: "Los Feliz veya Thai Town'da öğün, ardından Griffith Park'ta yürüyüş ya da shuttle bağlantısı.", evening: "Observatory'de gün batımı; dönüş kalabalığına ve son toplu taşıma bağlantısına pay bırakın." },
    { title: "Westside ve sahil", morning: "Getty Center için zamanlı rezervasyon; mimari, bahçe ve seçilmiş galeriler.", afternoon: "Santa Monica'ya inip sahil boyunca Venice yönünde yürüyüş/bisiklet.", evening: "Venice veya Santa Monica'da yemek; doğuya dönüşte trafik süresini kontrol edin." },
    { title: "İlgi alanı günü", morning: "Film meraklısıysanız önceden biletli stüdyo turu; tasarım istiyorsanız Mid-City galerileri.", afternoon: "Aynı bölgedeki yemek mahallesini seçin; şehir çapında ikinci büyük hedef eklemeyin.", evening: "West Hollywood'da yemek ve canlı etkinlik ya da Downtown'da konser/maç; bilet toplamını önceden görün." },
  ],
  practicalHeading: "Los Angeles'ta para ve zaman kazandıran dokuz ayrıntı",
  practicalTips: [
    { title: "LAX-it'i terminalde aramayın", body: "Standart Uber/Lyft ve taksi için yeşil işaretli ücretsiz shuttle veya Terminal 1 yanına yürüyüş gerekir. Uygulamayı valizi aldıktan sonra doğru alanda açın." },
    { title: "People mover açıldı varsayımı yapmayın", body: "Ağustos 2026 resmî LAX sayfası APM'yi hâlâ inşaat/gelecek bağlantı olarak gösteriyor. Hareket günü havalimanının kendi ulaşım sayfasına bakın." },
    { title: "Metroda artık banka kartı çalışıyor", body: "Mayıs 2026'dan beri temassız kart/telefonla doğrudan ödeme var. Ücret tavanı için aynı fiziksel veya dijital ödeme biçimini koruyun." },
    { title: "Park uygulaması metreye göre seçilir", body: "PARK SMARTER birçok şehir metresinde, ParkMobile belirli alanlarda geçer; logo ve zone kodu otoritedir. Bazı metrelerde Text to Pay uygulamasız alternatiftir." },
    { title: "Otel parkını gecelik fiyata ekleyin", body: "Oda fırsatı, günlük vale/self-parking ile pahalılaşabilir. Giriş-çıkış hakkı ve vergi dahil toplamı rezervasyon öncesi sorun." },
    { title: "Yakıt pompasında ZIP sorununu içeride çözün", body: "Yabancı kart reddedilirse uydurma ZIP denemeyin; kasada ön ödeme yapın. Kullanılmayan farkın karta dönüş yöntemini görevliye sorun." },
    { title: "Valizi araçta bırakmayın", body: "Check-out günü otel bagaj odası veya doğrulanmış depolama kullanın. Görünmeyen bagaj bile hırsızlık riskini sıfırlamaz." },
    { title: "Getty ücretsiz ama maliyetsiz değil", body: "Zamanlı giriş rezervasyonu ücretsizdir; park ücretlidir ve çevrede sokak parkı yoktur. Toplu taşıma/araç maliyetini planlayın." },
    { title: "Toll programını gişede sorun", body: "FasTrak ve farklı ücretli koridorlar tek bir nakit sistemi değildir. Kiralama şirketinin günlük idarî ücretini ve opt-in/opt-out kuralını yazılı alın." },
  ],
  faqs: [
    { q: "Los Angeles'ta arabasız gezilir mi?", a: "Evet, oteli Metro hattına yakın seçip Downtown–Hollywood–Santa Monica koridoruna odaklanırsanız. Malibu, dağlar ve dağınık restoran rotası için araç daha yararlıdır." },
    { q: "Los Angeles için kaç gün gerekir?", a: "Dört tam gün temel bölgeler için alt sınırdır; stüdyo/tema parkı veya Malibu eklenecekse 5–6 gün ayırın." },
    { q: "LAX'ten Uber nereden alınır?", a: "Standart uygulama araçları LAX-it alanından alır. Varış katındaki yeşil işaretli ücretsiz shuttle'ı kullanın veya terminalinize göre yürüyün; premium sınıfların kuralı farklı olabilir." },
    { q: "LA Metro'da TAP kart şart mı?", a: "2026 itibarıyla tam ücretli yolcular temassız banka kartı/telefonla doğrudan ödeyebilir. Çoklu bölgesel işletme kullanacaksanız TAP hâlâ yararlı olabilir." },
    { q: "Santa Monica mı Hollywood mı kalınır?", a: "Plaj ve yürüyüş için Santa Monica; stüdyo, gece hayatı ve daha merkezi kara rotası için Hollywood/West Hollywood. Günlük hedefleriniz kararı belirlemeli." },
    { q: "Los Angeles'ta park için hangi uygulama?", a: "Tek uygulama yok. LADOT metre üzerindeki PARK SMARTER, ParkMobile veya Text to Pay işaretini esas alın; uygulama ödemesi trafik levhasını geçersiz kılmaz." },
  ],
  relatedGuides: [
    { city: "San Francisco", anchor: "Kaliforniya'yı kuzeye taşıyın", description: "Araç bağımlılığından daha kompakt, raylı ulaşımı güçlü ve iklimi bambaşka ikinci Kaliforniya şehri." },
    { city: "Las Vegas", anchor: "Los Angeles'tan Las Vegas", description: "Karayoluyla mümkün ama hafta sonu trafiği ve çöl koşulları nedeniyle süreyi harita tahmininden geniş tutun." },
  ],
  sources: [
    { name: "LA Metro — how to pay", url: "https://www.metro.net/fares/how-to-pay/" },
    { name: "LA Metro — 2026 contactless launch", url: "https://www.metro.net/about/la-metro-debuts-new-ways-to-plan-pay-for-your-transit-trip/" },
    { name: "LAX — LAX-it", url: "https://www.flylax.com/lax-it" },
    { name: "LADOT — mobile parking", url: "https://ladotparking.org/parking-meters/la-express-park-and-parking-in-la/" },
    { name: "Getty Center visitor FAQ", url: "https://www.getty.edu/visit/center/faqs/" },
    { name: "Guelaguetza", url: "https://www.ilovemole.com/" },
    { name: "Holbox", url: "https://www.holboxla.com/" },
    { name: "Langer's", url: "https://www.langersdeli.com/" },
    { name: "Philippe The Original", url: "https://philippes.com/" },
    { name: "République", url: "https://republiquela.com/" },
  ],
  volatileNote: "LAX altyapısı, Metro ödeme düzeni, yangın/yol durumu, park ve işletme saatleri hızlı değişir; gezi gününde resmî ulaşım ve mekân sayfalarını kontrol edin.",
  reviewed: "2026-08-09",
};

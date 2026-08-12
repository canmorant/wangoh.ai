import { CityGuide } from "./types";

export const newYork: CityGuide = {
  city: "New York",
  countryCode: "US",
  seoTitle: "New York Gezi Rehberi: Ulaşım, Semtler, Yemek ve İpuçları",
  seoDescription:
    "New York'ta gezilecek yerler, doğru semt seçimi, 2026 OMNY ulaşımı, JFK-LGA-EWR farkı, gerçek restoranlar, bütçe, 4 günlük plan ve turist tuzakları.",
  h1: "New York Gezi Rehberi",
  lede:
    "New York'u iyi gezmenin sırrı daha fazla yer işaretlemek değil; aynı metro hattı üzerindeki mahalleleri aynı güne koymak, havaalanını konaklama adresine göre seçmek ve görünen fiyatla ödenecek toplamın aynı olmadığını baştan bilmektir.",
  quickFacts: [
    { label: "Önerilen süre", value: "İlk gezi için 5–7 gün" },
    { label: "Havalimanları", value: "JFK · LGA · EWR" },
    { label: "Şehir içi", value: "Metro + otobüs + yürüyüş" },
    { label: "Ödeme", value: "OMNY temassız ödeme" },
    { label: "Araba", value: "Kiralamayın" },
  ],
  sections: [
    {
      heading: "New York'u anlamanın yolu: semt ve hat düşünmek",
      id: "sehri-anlamak",
      body: [
        "Manhattan haritada küçük görünür; fakat bir müze, bir gözlem terası, Brooklyn'de akşam yemeği ve Broadway'i aynı güne koyduğunuzda aktarmalar geziyi parçalar. New York'u kuzey–güney doğrultusunda çalışan metro omurgaları ve birbirine yürünebilen mahalle kümeleriyle planlayın. Lower Manhattan ile Brooklyn Heights; Chelsea ile Greenwich Village; Upper East Side ile Central Park aynı güne mantıklı eşleşmelerdir.",
        "Times Square bir ulaşım düğümü ve geceleri görülmesi gereken bir sahne, fakat şehrin tamamı değildir. İlk konaklama için burada kalmak zorunlu değil. Metroya beş-on dakika içinde erişilen Flatiron, Chelsea, Upper West Side, Long Island City veya Downtown Brooklyn kimi gezgin için daha sakin ve daha iyi fiyatlı olabilir. Oda fiyatını karşılaştırırken tesis/destination fee, vergi ve kart provizyonunu ayrı ayrı okuyun.",
        "New York'un yerel mantığı yürümek ile metro arasında sürekli seçim yapmaktır. On iki blok için metroya inmek, perona yürümek ve treni beklemek bazen sokakta yürümekten uzun sürer. Haritanın yalnız süre tahminine değil, giriş yönüne ve servis değişikliklerine bakın; özellikle hafta sonu bakımında trenler hat atlayabilir veya farklı terminalde dönebilir.",
      ],
    },
    {
      heading: "Gezilecek yerler: ilk kez gelen için gerçek öncelikler",
      id: "gezilecek-yerler",
      body: [
        "Özgürlük Heykeli ve Ellis Island'a adaya inerek gidecekseniz National Park Service'in yetkilendirdiği tek feribot işletmesi Statue City Cruises'tır. Battery çevresindeki yaklaşan satıcılardan değil resmî kanaldan alın; kaide ve taç erişimi kapasiteye bağlı ayrı bilet ister. Sadece silüeti görmek istiyorsanız ücretsiz Staten Island Ferry daha ekonomik bir seyir sağlar, fakat Liberty Island'a yanaşmaz.",
        "Gözlem teraslarından birini seçmek çoğu gezi için yeterli. Empire State klasik ikon, Top of the Rock Empire State'i kadraja alır, One World Downtown'u, Edge batı yakasını gösterir. Gün batımı saatleri önce dolar; aynı gün iki terasa para vermek yerine ikinci yüksek manzarayı ücretsiz Brooklyn Heights Promenade, Gantry Plaza veya Roosevelt Island kıyısından alın.",
        "Müze gününü ilgiye göre kurun: Metropolitan Museum of Art geniş koleksiyonuyla yarım günden azına sığmaz; MoMA modern sanat için daha odaklıdır; American Museum of Natural History ailelerle güçlüdür. Ücretsiz gün ve saatler sık sık ikamet şartı, rezervasyon veya kapasite kuralı taşır. Eski blogdaki 'ücretsiz' notuna değil müzenin kendi bilet sayfasına güvenin.",
      ],
      subsections: [
        {
          heading: "Manhattan dışına çıkınca gezi derinleşir",
          body: [
            "DUMBO fotoğraf durağıdır; asıl yürüyüş Brooklyn Heights'ın kahverengi taş evleri ve Promenade boyunca yapılır. Williamsburg mağaza, kahve ve gece hayatına; Queens'teki Jackson Heights ise Güney Asya ve Latin Amerika mutfaklarına ayrılabilir. Bir ilçeyi yalnız tek meşhur kare için geçip dönmek yerine orada bir öğün planlayın.",
            "Roosevelt Island tramvayı ayrı bir turistik oyuncak değil, MTA ücret sistemine dahil toplu taşımadır. Aynı ödeme aracıyla transfer kurallarına uyarak kullanın; doğu yakası ve Queensboro Bridge manzarası için kısa, verimli bir sapmadır.",
          ],
        },
      ],
    },
    {
      heading: "Nerede kalınır? Ucuz oda değil, ucuz toplam yolculuk",
      id: "nerede-kalinir",
      body: [
        "**Midtown** ilk kez gelen, Broadway planlayan ve geç saatte otele dönmek isteyenler için pratiktir; karşılığında odalar küçük, sokaklar yoğun olabilir. Times Square'in tam göbeği yerine Bryant Park, NoMad veya Hell's Kitchen kenarı daha dengeli hissettirebilir.",
        "**Upper West Side** Central Park ve müzeler için sakin; aileler ve sabah yürüyüşü isteyenler için güçlüdür. **Chelsea/Flatiron** Downtown ile Midtown arasında yürünebilir bir üs ve restoran erişimi sunar. **Lower East Side/East Village** gece hayatı ve küçük mekânlar için iyi, uykusu hafif olanlar için gürültülü olabilir.",
        "**Long Island City** ve **Downtown Brooklyn**, doğru metro istasyonuna yakınsa Manhattan dışı olmasına rağmen hızlı seçeneklerdir. Burada kritik soru 'Manhattan'a kaç kilometre?' değil, otelden hangi hatta aktarmasız binebildiğinizdir. New Jersey'deki ucuz bir otel ise PATH veya otobüs sıklığı, gece dönüşü ve ayrı ücret sistemi nedeniyle beklediğiniz tasarrufu zamanla geri alabilir.",
        "Kahvaltının dahil olduğunu, odada buzdolabı bulunduğunu veya bagajın ücretsiz tutulacağını varsaymayın. Check-in yaşını, kimlik/kredi kartı şartını ve gecelik provizyon tutarını rezervasyon öncesinde sorun. Debit kart kullanırsanız bloke çözülene kadar seyahat bütçenizden gerçek para eksilir.",
      ],
    },
    {
      heading: "2026'da metro ve OMNY: eski MetroCard tavsiyelerini unutun",
      id: "metro-omny",
      body: [
        "1 Ocak 2026'dan beri MetroCard satın alınamıyor veya doldurulamıyor. Ziyaretçi için en kolay yöntem turnikedeki OMNY okuyucuya temassız Visa/Mastercard, Apple Pay/Google Pay ya da fiziksel OMNY kartı dokundurmak. Hesap açmanız ve uygulama indirmeniz gerekmiyor.",
        "Haftalık ücret tavanının çalışması için her binişte **aynı ödeme kimliğini** kullanın. Fiziksel kart ile o kartın Apple Pay içindeki sürümü sistemde farklı sayılabilir; sabah kart, akşam telefon kullanırsanız harcamalar birleşmez. Bir kartla sırayla birden fazla kişiyi geçirmek de her yolcunun tavanını doğru işletmez. Ailede herkes kendi kartını/cihazını kullansın.",
        "Metro 24 saat çalışır fakat tüm hatlar aynı sıklıkta değildir. MTA uygulaması yol planlama, canlı varış, asansör ve servis değişikliği için resmî kaynaktır. 'Uptown' kuzey, 'Downtown' güney yönünü anlatır; perona inmeden önce tabeladaki ilçeyi ve son durağı okuyun. Ekspres tren her istasyonda durmaz; yanlış ekspres bir anda mahallenizi geçebilir.",
      ],
    },
    {
      heading: "JFK, LaGuardia ve Newark: otelinize göre seçim",
      id: "havalimani-ulasim",
      body: [
        "**JFK**, uluslararası seçenekleri en geniş havalimanıdır. Jamaica üzerinden LIRR daha hızlı ve bavulla daha rahat; E/J/Z metro + AirTrain daha ucuz olabilir. AirTrain terminal turunu yapar ve şehir ulaşımından ayrı ücretlidir; Jamaica/Howard Beach kapısında temassız kartla ödenebilir. Uçağınızın terminalini havalimanı sitesinden kontrol edin.",
        "**LaGuardia (LGA)** Manhattan'a daha yakın ama tren istasyonu yoktur. Midtown tarafından metro veya LIRR ile Jackson Heights/Woodside'a, oradan ücretsiz Q70 LaGuardia Link'e geçmek mantıklıdır. Upper Manhattan için M60-SBS doğrudan seçenek olabilir. Trafik yüzünden süreye geniş pay bırakın.",
        "**Newark (EWR)** New Jersey'dedir. Uçuş fiyatı cazip olsa da Penn Station bağlantısının çalıştığı saat, AirTrain durumu ve otelin konumu toplam deneyimi belirler. Havalimanı altyapı çalışmaları değişebildiği için hareket gününde NJ Transit/Port Authority uyarılarını kontrol edin. Brooklyn veya Queens oteline gidecekseniz EWR'nin ucuz bileti, iki aktarma ve uzun taksiyle avantajını kaybedebilir.",
        "Taksi ve uygulama araçlarında köprü/tünel geçişi, yoğunluk fiyatı ve havalimanı ekleri olabilir. Resmî taksi kuyruğu dışındaki 'taxi?' tekliflerini kabul etmeyin. Terminalden çıkmadan önce adresi ve tahmini toplamı uygulamada karşılaştırın; gece geç saatte toplu taşıma hâlâ çalışsa da sefer seyrekliği ve bavul yükü kararınızı değiştirebilir.",
      ],
    },
    {
      heading: "New York yemek kültürü: tek bir mutfak değil",
      id: "ne-yenir",
      body: [
        "Bagel, pizza dilimi ve pastrami yalnız klişe değildir; hızlı, tezgâh odaklı şehir yaşamının ürünleridir. Bagel siparişinde krem peynir ve somon ayrı maliyet katmanlarıdır; dev bir deli sandviçi iki kişiye yetebilir. Pizza dükkânında tezgâhtaki dilimi seçip yeniden ısıtmak normaldir. Masaya oturmadan fiyatı ve kart minimumunu kontrol edin.",
        "Asıl güç göçmen mahallelerindedir: Jackson Heights'ta Nepal, Tibet, Kolombiya ve Hint; Flushing'de Çin'in bölgesel mutfakları; Brighton Beach'te Doğu Avrupa; Arthur Avenue çevresinde İtalyan-Amerikan esnafı bir aradadır. Bir 'ünlü restoran' sırasına iki saat vermek yerine bir mahallede üç küçük tat paylaşmak şehri daha iyi anlatır.",
        "Masa servisinde hesabı isteyene kadar gelmeyebilir; bu sizi kovmamak için yapılan bir nezakettir. Faturada subtotal, tax, service charge/automatic gratuity ve tip satırlarını ayırın. Otomatik bahşiş varsa ikinci kez tam yüzde eklemeyin. Counter-service tabletindeki yüzde seçenekleri öneridir; paket kahve veya self servis için zorunlu değildir.",
      ],
    },
    {
      heading: "Bütçe, alışveriş ve günlük ihtiyaçlar",
      id: "butce-alisveris",
      body: [
        "New York'ta menü veya raf etiketi çoğu zaman satış vergisi öncesidir. Aynı kural her ürüne aynı şekilde uygulanmaz; bu yüzden zihinden tek oranla hesap yapmaya çalışmak yerine kasada toplamın artacağını kabul edin. Yabancı turist için genel bir ABD satış vergisi iadesi yoktur.",
        "CVS ve Walgreens yalnız eczane değildir; su, atıştırmalık, kişisel bakım ve basit seyahat ürünleri de satar. Target günlük ihtiyaçta kullanışlıdır. Reçeteli ilaç için Türk reçetesinin otomatik geçerli olacağını varsaymayın; düzenli ilaçlarınızı orijinal ambalaj ve gerekli belgelerle götürme koşullarını önceden araştırın.",
        "Halka açık tuvalet bulmak Avrupa'daki kadar sezgisel değildir. Şehrin resmî tuvalet haritasını çevrimdışı favoriye alın; park, kütüphane, büyük müze ve ulaşım merkezi iyi dayanaklardır. Bir kafeye yalnız tuvalet için girip erişim kodu beklemek yerine gün rotasında güvenilir durakları baştan işaretlemek zaman kazandırır.",
        "Musluk suyu şehir şebekesinde içilebilir; restoranlarda ücretsiz tap water isteyebilirsiniz. Gün boyu küçük şişe almak yerine doldurulabilir şişe taşıyın. Güvenlik kontrolü olan müze ve gözlem teraslarında büyük çanta kuralını önceden okuyun.",
      ],
    },
    {
      heading: "Broadway, spor ve bilet alırken",
      id: "biletler-etkinlikler",
      body: [
        "Belirli bir Broadway oyunu ve koltuk istiyorsanız yapımın resmî sitesi veya Broadway'in doğruladığı satıcıdan önceden alın. Esnekseniz TKTS aynı gün/ertesi gün indirimleri sunabilir; fakat popüler oyun ve ideal saat garantisi yoktur. Times Square'deki kırmızı merdivenin altında sıra vardır, Lincoln Center gişesi bazı günler daha sakindir.",
        "Knicks/Rangers Madison Square Garden'da, Nets Barclays Center'da; Yankees ve Mets ise Manhattan dışında kendi stadyumlarındadır. Maç bileti alırken yalnız koltuk fiyatına değil satıcının gösterdiği toplam fiyata bakın. 2025'ten beri canlı etkinlik biletlerinde zorunlu ücretlerin önden gösterilen toplam fiyata dahil edilmesi gerekir; yine de resmi veya yetkili yeniden satış kanalını tercih edin.",
        "City pass ancak kapsadığı ücretli yerlere gerçekten gidecekseniz kazandırır. İki müze, bir gözlem terası ve uzun mahalle yürüyüşü planlayan biri için pass, programı aceleye çevirebilir. Önce gerçek günlük planı yazın, sonra ayrı bilet toplamıyla karşılaştırın.",
      ],
    },
    {
      heading: "Güvenlik: korku listesi değil, şehir alışkanlığı",
      id: "guvenlik",
      body: [
        "New York milyonlarca kişinin gündelik hayatını sürdürdüğü büyük bir kenttir. Kalabalık vagonda çantayı kapalı ve görüş alanında tutmak, boş vagona tek başına binmemek ve platform kenarından uzak durmak yeterli temel alışkanlıklardır. Bir vagon diğerlerinden belirgin biçimde boşsa yerel yolcuların neden girmediğini düşünün.",
        "Kulaklığı tam gürültü engellemede kullanmamak, kavşakta telefona dalmamak ve sokakta para/kimlik sergilememek pratik önlemlerdir. Acil durumda 911; metroda bilgi veya yardım için mavi Help Point ve istasyon görevlileri kullanılabilir. Bir mahallenin tamamını 'tehlikeli' diye etiketleyen içerik yerine güncel rota, saat ve çevre yoğunluğunu değerlendirin.",
      ],
    },
  ],
  places: [
    {
      name: "Katz's Delicatessen",
      area: "Lower East Side",
      known: "Elde kesilen pastrami",
      why: "Turistik ününe rağmen New York deli geleneğini canlı bir tezgahta gösterir. Pastrami on rye, hardal ve turşu üçlüsü yeterlidir; porsiyon paylaşmaya uygundur.",
      price: "Orta",
      tip: "Yoğun saatte sıra olur. Verilen sipariş fişini çıkışa kadar kaybetmeyin; güncel sistemi resmî siteden kontrol edin.",
    },
    {
      name: "Russ & Daughters",
      area: "Lower East Side",
      known: "Appetizing dükkânı, somon ve bagel",
      why: "Deli ile 'appetizing' dükkânı arasındaki New York ayrımını anlatır: tütsülenmiş balık, krem peynir, ringa ve unlu ürünler. Tezgâh dükkânı hızlı, café oturmalı deneyimdir.",
      price: "Orta",
      tip: "Katz's ile aynı öğüne yığmayın; ikisi de ağır ve porsiyonlar büyüktür.",
    },
    {
      name: "Los Tacos No. 1",
      area: "Chelsea Market / Times Square ve diğer şubeler",
      known: "Tijuana usulü taco",
      why: "Şehrin göçmen mutfağını pahalı bir oturma düzeni olmadan tadabileceğiniz, taze tortilla ve kısa menüye odaklanan güvenilir bir hızlı öğündür.",
      price: "Ekonomik",
      tip: "Şubeye göre kuyruk değişir; tezgâh öğünüdür, uzun bir akşam yemeği beklemeyin.",
    },
    {
      name: "Sylvia's",
      area: "Harlem",
      known: "Soul food ve Harlem kurumu",
      why: "Harlem'i yalnız Apollo önünde fotoğrafla geçmek yerine kızarmış tavuk, collard greens ve cornbread üzerinden bölgenin Afro-Amerikan yemek tarihine bağlar.",
      price: "Orta",
      tip: "Gospel brunch gibi etkinlikli saatler farklı yoğunluk yaratır; rezervasyon ve programı resmî sayfadan görün.",
    },
    {
      name: "Keens Steakhouse",
      area: "Herald Square",
      known: "Eski New York steakhouse atmosferi",
      why: "Pahalı bir et yemeğinden fazlası; tarihî salonları ve mutton chop geleneğiyle Midtown'un eski kulüp dünyasını taşır. Özel bir akşam için seçilir.",
      price: "Yüksek",
      tip: "Rezervasyon yapın ve porsiyon/yan yemeklerin ayrı fiyatlandığını hesaba katın.",
    },
    {
      name: "Xi'an Famous Foods",
      area: "Manhattan ve Queens'te çeşitli şubeler",
      known: "El çekmesi erişte ve baharatlı kuzu",
      why: "Flushing kökenli hızlı servis zinciri, New York'un Çin mutfağını yalnız Cantonese dim sum'a indirmeden kuzeybatı Çin tatlarıyla tanıtır.",
      price: "Ekonomik",
      tip: "Erişte bekledikçe dokusunu kaybeder; teslimat yerine yerinde yemek daha iyi sonuç verir.",
    },
  ],
  itinerary: [
    {
      title: "Lower Manhattan ve liman",
      morning: "Battery'den önceden aldığınız feribotla Liberty/Ellis veya ücretsiz Staten Island Ferry; dönüşte Wall Street ve 9/11 Memorial çevresi.",
      afternoon: "Brooklyn Bridge'i Manhattan'dan Brooklyn'e yürüyün, DUMBO'dan Brooklyn Heights Promenade'a devam edin.",
      evening: "Brooklyn Heights, Cobble Hill veya Downtown Brooklyn'de yemek; metro ile otele dönüş.",
    },
    {
      title: "Midtown'u acele etmeden okumak",
      morning: "Grand Central, New York Public Library ve Bryant Park; ardından seçtiğiniz tek gözlem terası.",
      afternoon: "MoMA veya Rockefeller Center çevresi. Fifth Avenue'yu alışveriş listesi değil mimari yürüyüş olarak görün.",
      evening: "Önceden biletli Broadway; gösteriden sonra Times Square ışıkları.",
    },
    {
      title: "Central Park ve müzeler",
      morning: "Upper West Side'dan Central Park'a girin; Bethesda Terrace ve The Ramble yönünde yürüyün.",
      afternoon: "Met veya Natural History'den yalnız birini seçin. Müze sonrası Madison Avenue yerine mahalle sokaklarına zaman bırakın.",
      evening: "Harlem'de soul food veya Upper West Side'da sakin akşam yemeği.",
    },
    {
      title: "Downtown mahalleleri",
      morning: "High Line'ı erken yürüyüp Chelsea Market'te kısa öğün; galeriler açıksa Chelsea sokakları.",
      afternoon: "Greenwich Village, Washington Square, SoHo ve Lower East Side'ı kesintisiz yürüyüşte birleştirin.",
      evening: "Lower East Side/East Village'da rezervasyonlu yemek; enerjiniz varsa canlı müzik veya comedy club.",
    },
  ],
  practicalHeading: "New York'ta turistlerin geç öğrendiği sekiz şey",
  practicalTips: [
    { title: "Aynı kart, aynı cihaz", body: "OMNY haftalık tavanı ödeme kimliğine göre sayar. Plastik kart ile telefondaki aynı kart farklı kimlik olabilir; yolculuk boyunca tek biçim kullanın." },
    { title: "MetroCard artık ziyaretçi çözümü değil", body: "2026'da yeni MetroCard satışı ve dolumu bitti. Eski rehberdeki makine tarifleri yerine temassız kart veya OMNY kullanın." },
    { title: "Ücretsiz LGA otobüsünü bilin", body: "Q70 LaGuardia Link ücretsizdir. Midtown için Jackson Heights veya Woodside bağlantısı çoğu zaman taksiden daha öngörülebilir olur." },
    { title: "Resmî tuvalet haritasını kaydedin", body: "NYC'nin park, kütüphane ve kamusal alan tuvaletlerini gösteren haritası rota ortasında rastgele kafe aramaktan daha güvenilirdir." },
    { title: "Downtown–Uptown tabelasını kapıda okuyun", body: "Bazı istasyon girişleri yalnız tek yöne hizmet eder. Yanlış girişte ücretsiz karşı perona geçiş olmayabilir; turnikeden önce yönü kontrol edin." },
    { title: "Otel provizyonuna limit bırakın", body: "Oda toplamından büyük geçici blok konabilir. Check-in kartınızın limiti, gezi boyunca yapacağınız harcamaları da karşılamalıdır." },
    { title: "Heykel feribotunda satıcıya değil NPS'ye güvenin", body: "Adalara inen tek yetkili feribot Statue City Cruises'tır. Sokak satıcısının 'official' ifadesi yetki kanıtı değildir." },
    { title: "App Store ülkesini değiştirmeyin", body: "MTA yol bilgisinin web sürümü ve temassız OMNY çalışırken ana Apple hesabının ülkesini değiştirmek gereksizdir; abonelik ve ödeme yöntemi sorunları yaratabilir." },
  ],
  faqs: [
    { q: "New York için kaç gün yeterli?", a: "İlk gezi için 5–7 gün dengelidir. Dört gün ana bölgeleri gösterir; Brooklyn ve Queens'e gerçek zaman ayırmak için en az beş gece daha rahattır." },
    { q: "New York'ta araba kiralamak gerekir mi?", a: "Hayır. Park, trafik, köprü/tünel ücretleri ve otel garajı aracı yük haline getirir. Şehir dışı yolculuk için aracı New York'tan ayrıldığınız gün alın." },
    { q: "Metro güvenli mi?", a: "Milyonlarca kişi günlük kullanır. Servis durumunu kontrol edin, eşyayı görüşte tutun, platform kenarından uzak durun ve gece çok boş vagon yerine içinde yolcu olan vagona binin." },
    { q: "OMNY için uygulama veya hesap gerekir mi?", a: "Hayır. Temassız banka kartı veya telefonla doğrudan dokunabilirsiniz. Haftalık ücret tavanı için her seferinde aynı kartı veya aynı cihazı kullanın." },
    { q: "JFK mi Newark mı daha iyi?", a: "Otel konumuna ve uçuşa bağlıdır. Midtown için ikisi de çalışabilir; Brooklyn/Queens için JFK, New Jersey veya batı Manhattan için EWR daha mantıklı olabilir. Yalnız bilet fiyatına bakmayın." },
    { q: "New York'ta bahşiş ne kadar?", a: "Masa servisinde vergi öncesi tutarın yüzde 15–20'si yaygın gelenektir. Faturada automatic gratuity/service charge varsa neyi karşıladığını okuyun; counter tabletindeki seçenek zorunlu değildir." },
    { q: "Times Square'de kalmak iyi fikir mi?", a: "İlk gezi ve Broadway için pratiktir ama şart değildir. Metroya yakın Chelsea, Flatiron, Upper West Side, Long Island City veya Downtown Brooklyn daha sakin/fiyat dengeli olabilir." },
  ],
  relatedGuides: [
    { city: "Chicago", anchor: "Arabasız ikinci şehir: Chicago", description: "Güçlü raylı ulaşım, mimari ve ayrı bir yemek kimliği; New York'un kopyası olmayan büyük şehir molası." },
    { city: "Miami", anchor: "Kış güneşi için Miami", description: "Kuzeydoğu kışından plaja ve Küba-Amerikan yemek kültürüne uçakla geçilen ayrı bir rota." },
  ],
  sources: [
    { name: "MTA — subway and bus fares", url: "https://www.mta.info/fares-tolls/subway-bus" },
    { name: "MTA — JFK Airport", url: "https://www.mta.info/guides/airports/jfk" },
    { name: "MTA — LaGuardia Airport", url: "https://www.mta.info/guides/airports/laguardia" },
    { name: "National Park Service — Statue of Liberty fees", url: "https://www.nps.gov/stli/planyourvisit/fees.htm" },
    { name: "NYC public restroom map background", url: "https://www.nyc.gov/assets/publicrealm/downloads/pdf/Realm-of-Possibility-CPRO-Report.pdf" },
    { name: "Katz's Delicatessen", url: "https://katzsdelicatessen.com/" },
    { name: "Russ & Daughters", url: "https://www.russanddaughters.com/" },
    { name: "Los Tacos No. 1", url: "https://www.lostacos1.com/" },
    { name: "Sylvia's", url: "https://sylviasrestaurant.com/" },
    { name: "Keens Steakhouse", url: "https://www.keens.com/" },
  ],
  volatileNote: "Ücretler, hafta sonu metro çalışmaları, havalimanı bağlantıları, bilet ve restoran düzeni değişebilir; hareket gününde bağlantılı resmî kanalları yeniden kontrol edin.",
  reviewed: "2026-08-09",
};

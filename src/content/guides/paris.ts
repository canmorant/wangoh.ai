import { CityGuide } from "./types";

/** Paris rehberi — Ağustos 2026 araştırması. */
export const paris: CityGuide = {
  city: "Paris",
  countryCode: "FR",

  seoTitle: "Paris Gezi Rehberi: Ulaşım, Biletler ve 5 Günlük Rota",
  seoDescription:
    "Paris gezi rehberi: havalimanı ulaşımı, Louvre ve Eyfel biletleri, kalınacak semtler, doğrulanmış yemek adresleri ve 2026 için 5 günlük gezi planı.",
  h1: "Paris Gezi Rehberi",
  lede:
    "Paris, ünlü yapıların arasında koşturularak değil Seine'in iki yakasını mahalle kümeleri hâlinde gezerek anlaşılır; doğru müze rezervasyonu ve doğru semt seçimi şehri pahalı bir kuyruklar dizisinden yaşayan bir yolculuğa dönüştürür.",

  quickFacts: [
    { label: "Önerilen süre", value: "4–5 tam gün" },
    { label: "Havalimanları", value: "CDG · ORY · BVA" },
    { label: "Şehir içi", value: "Metro + RER + yürüyüş" },
    { label: "Erken rezervasyon", value: "Louvre · Eyfel · Versailles" },
    { label: "Yerel ritim", value: "Mahalle fırını + bistro + pazar" },
  ],

  sections: [
    {
      heading: "Paris gezisi nasıl planlanır? Seine'in iki yakasını kümelere ayırın",
      id: "gezi-planlama",
      body: [
        "Paris'in merkezini tek bir uzun yürüyüş sanmak ilk planlama hatasıdır. Louvre–Tuileries–Opéra; Île de la Cité–Latin Mahallesi–Saint-Germain; Marais–Canal Saint-Martin; Eyfel–Invalides; Montmartre kümelerini ayrı yarım veya tam günlere bölün. Böylece her gün yalnız bir büyük saatli rezervasyon taşır, metro aktarmaları azalır ve mahallelerin akşam karakterine de zaman kalır.",
        "İlk ziyaret için dört tam gün alt sınır, beş gün daha dengelidir. Louvre ile Musée d'Orsay'ı aynı güne, Eyfel Kulesi ile Versailles'ı aynı yarım güne sıkıştırmayın. Yağmurlu günün tamamını müzeye çevirmek cazip görünür; herkes aynı şeyi düşündüğü için zamanlı bilet ve esnek açık hava alternatifi birlikte gerekir.",
        "Paris'i yalnız merkez anıtları olarak görmeyin. Rue des Martyrs, Canal Saint-Martin, Marché d'Aligre, Buttes-Chaumont veya Batignolles gibi mahalle duraklarından birini plana koymak kafe, pazar ve gündelik yaşamı görünür kılar. Beşinci günü Versailles'a ayıracaksanız saray, bahçeler ve Trianon alanı için gerçek bir tam gün kabul edin.",
      ],
    },
    {
      heading: "Charles de Gaulle, Orly ve Beauvais'den Paris merkezine ulaşım",
      id: "havalimani-ulasimi",
      body: [
        "Charles de Gaulle (CDG) için **RER B**, Gare du Nord, Châtelet–Les Halles ve Saint-Michel yönünde doğrudan raylı bağlantıdır. Terminalinizden istasyona yürüyüş ve ücretsiz CDGVAL gerekebilir; biletiniz havalimanı tarifesini kapsamalıdır. Bakım veya grev gününde güzergâh değişebileceğinden Île-de-France Mobilités ile Paris Aéroport duyurusunu kalkış sabahı kontrol edin. Takside yalnız resmî sırayı kullanın ve sabit tarifenin Paris'in hangi yakası için geçerli olduğunu sorun.",
        "Orly'den **Metro 14** merkez yönünde en sade seçenektir; havalimanı bileti normal merkez biletiyle aynı ürün değildir. Orlyval + RER B alternatifi otel konumuna veya hat kesintisine göre işe yarar. Gece varışında son bağlantı, valizle aktarma ve otelin metro çıkışına mesafesini toplam maliyete katın.",
        "Beauvais (BVA), adında Paris geçse de şehir dışındadır. Uçuş saatine göre işletilen otobüsün güncel Paris durağını ve dönüş kalkışını Beauvais Havalimanı'nın resmî kanalından kontrol edin; CDG ya da Orly biletiyle aynı ulaşım düzenini varsaymayın. Ucuz uçuş ile kaybedilen süre ve iki yönlü transferi birlikte karşılaştırın.",
      ],
    },
    {
      heading: "Paris metrosu ve RER: Navigo Easy, telefon ve 2026 banka kartı gerçeği",
      id: "toplu-tasima",
      body: [
        "2026 yazında temassız banka kartını Paris metro veya RER turnikesine dokundurmak genel bir ödeme yöntemi değildir. Açık ödeme bazı otobüslerde ve sınırlı noktalarda kademeli yayılır; aktarma hakkı ve fiyatı standart biletten farklı olabilir. Normal ziyaretçi için **Navigo Easy**, uyumlu telefon/cüzdan veya Île-de-France Mobilités uygulamasından yüklenen uygun bilet daha güvenli düzendir.",
        "Metro–tren–RER bileti ile otobüs–tramvay bileti farklı ürünlerdir; havalimanı erişimi de özel tarifedir. Her yolcu ayrı geçiş hakkı taşımalı, turnikeden çıktıktan sonra yanlış aktarmanın yeni bilet isteyebileceğini bilmelidir. RER'e merkezde binip banliyöye uzanıyorsanız Versailles, Disneyland veya havalimanı için bilet kapsamını özellikle doğrulayın.",
        "İstasyonda manyetik kâğıt bilet kullanıyorsanız telefon ve bozuk paradan ayrı tutun; çıkışta gerekebileceği için atmayın. Metro merdivenleri valizle yorucu, asansör erişimi istasyondan istasyona değişir. Gerçek zamanlı bakım ve grev bilgisi için Google Maps'in yanında Île-de-France Mobilités ya da Bonjour RATP kullanın.",
      ],
    },
    {
      heading: "Louvre, Notre-Dame ve büyük müzeler için doğru bilet stratejisi",
      id: "muzeler-biletler",
      body: [
        "Louvre biletini **ticket.louvre.fr** alanından veya müzenin yönlendirdiği resmî kanaldan alın. Müze salı günleri kapalıdır; 1 Temmuz–31 Ağustos 2026 döneminde tüm ziyaretçiler için zamanlı rezervasyon zorunludur. Giriş piramidinin tek seçenek olmadığını biletiniz ve güncel müze planından kontrol edin. Bir katta iki koleksiyon seçin; Mona Lisa kuyruğunu bütün ziyaret sanmayın ve çıkış sonrası yeniden giriş hakkını varsaymayın.",
        "Notre-Dame Katedrali'nin içi ücretsizdir. Resmî site aynı gün veya kısa süre önce ücretsiz erişim zamanı açabilir; rezervasyon isteğe bağlıdır ama beklemeyi azaltır. Ücretli 'hızlı giriş' satan üçüncü tarafı katedral bileti sanmayın. Kule ziyareti ayrı işletme ve rezervasyondur; ibadet programı ile güvenlik düzeni erişimi değiştirebilir.",
        "Musée d'Orsay empresyonizm için en az yarım gün ister; Orangerie daha küçük ve Monet'nin Nilüferler'i etrafında odaklıdır. Paris Museum Pass, dahil olan yerlere erişim sağlar fakat her yerde sıra atlatmaz ve saatli rezervasyon gereğini kaldırmaz; Eyfel Kulesi genel olarak ayrı biletlenir. Kartı gün sayısına değil, gerçekten kullanacağınız kurumların güncel toplamına göre hesaplayın.",
      ],
    },
    {
      heading: "Eyfel Kulesi, Seine ve Montmartre'ı acele etmeden görmek",
      id: "eyfel-seine-montmartre",
      body: [
        "Eyfel Kulesi'nin resmî bileti **ticket.toureiffel.paris** üzerinden satılır. Merdiven, ikinci kat asansörü ve zirve erişimi aynı ürün değildir. Zirve hava, teknik durum veya kalabalık nedeniyle kapanabilir; zirve yazdığı için garantili manzara varsaymayın. Büyük valiz için emanet yoktur, güvenlik kontrolüne hafif gidin ve biletinizdeki giriş ayağını kontrol edin.",
        "Trocadéro tek fotoğraf noktası değildir. Bir-Hakeim Köprüsü, Champ de Mars ve Seine kıyısından kuleyi farklı saatlerde görmek mümkündür. Akşam tekne turunda açık güverte istiyorsanız hava ve oturma düzenini, yemekli turda masa konumunu önceden okuyun; nehir turunu kısa şehir ulaşımı sanmayın.",
        "Montmartre için Anvers'ten yalnız Sacré-Cœur merdivenlerine çıkıp dönmek yerine Abbesses, Rue des Abbesses, Musée de Montmartre çevresi ve Lamarck tarafına yürüyün. Füniküler şehir ulaşım ağına dahildir fakat geçerli bilet gerekir. Place du Tertre'de portre için başlamadan toplam fiyatı netleştirin; bileklik ve dilekçe yaklaşımına nazik ama kararlı biçimde devam edin.",
      ],
    },
    {
      heading: "Paris'te nerede kalınır? Arrondissement değil, sokak ve metro seçin",
      id: "nerede-kalinir",
      body: [
        "1–4. arrondissement ilk ziyaret için merkezî ve yürünebilirdir; fiyat, küçük oda ve turist kalabalığı yüksektir. 5 ve 6 klasik Sol Yaka atmosferiyle güvenli bir ilk üs, 9 ise Opéra bağlantıları, restoranlar ve daha dengeli fiyat için güçlü seçenektir. 11. arrondissement yeme–içme ve akşam hayatını öne çıkarır; Louvre çevresine her gün kısa metro gerekir.",
        "10. arrondissement içinde Canal Saint-Martin ile Gare du Nord çevresi aynı deneyim değildir. 18'de Abbesses/Montmartre üstleri romantik ve yokuşlu; Barbès ile istasyon çevresi daha yoğun ve sokak bazında değişkendir. Bir semti tek etiketle 'iyi' veya 'kötü' saymak yerine son metrodan otele aydınlık yürüyüşü, oda katını ve gece yorumlarını inceleyin.",
        "14. arrondissement daha sakin, aile veya uzun konaklama için rahat olabilir. Otel adında 'Paris' yazması belediye sınırında olduğu anlamına gelmez; banliyöde uygun fiyatlı oda, her gece aktarma ve geç dönüş maliyeti yaratabilir. Haritada en yakın durağın hat numarasını, çalışmayan asansörü ve oda fiyatına eklenebilen taxe de séjour'u kontrol edin.",
      ],
    },
    {
      heading: "Paris'te ne yenir? Fırın, pazar ve bistro düzeni",
      id: "ne-yenir",
      body: [
        "Sabah iyi bir **boulangerie** ile başlayın: 'artisan boulanger' ibaresi ekmek üretiminin yerinde yapıldığına işaret eder. Kruvasan, pain au chocolat, jambon-beurre ve tartlar hızlı öğündür; vitrin önünde uzun sipariş düşünmek yerine sıranız gelmeden seçin. Mahalle pazarında peynir, şarküteri ve mevsim meyvesini piknik için alın ama parkın alkol/çöp kuralına uyun.",
        "Bistroda öğle **formule** veya menu du jour çoğu zaman akşam à la carte'tan daha iyi değer sunar. Soğan çorbasını tek Paris ölçütü sanmayın; oeuf mayonnaise, poireaux vinaigrette, steak-frites, confit, mevsim balığı ve günlük tatlılar daha geniş bir repertuvar verir. Galette karabuğdaylı tuzlu, crêpe çoğunlukla tatlıdır; Breton adresinde ikisini aynı şey saymayın.",
        "Menü fiyatı vergi ve servisi içerir; bahşiş zorunlu yüzde değildir. Yemek yanında ücretsiz musluk suyu sürahisi için **une carafe d'eau** isteyin. Garsonun hesabı masaya kendiliğinden getirmemesi kötü servis sayılmaz; 'l'addition, s'il vous plaît' deyin. Küçük restoranlar pazar–pazartesi kapanabilir ve akşam mutfağı belirli saat aralığında sipariş alabilir.",
      ],
    },
    {
      heading: "Paris'te turist tuzakları ve günübirlik Versailles kararı",
      id: "tuzaklar-ve-versailles",
      body: [
        "Metro, RER ve büyük anıt çevresinde telefon ile cüzdanı arka cepte taşımayın; kapı kapanırken kapkaç, imza/dilekçe oyunu, sözde bulunan yüzük ve Sacré-Cœur bilekliği bilinen senaryolardır. Biri üzerinize bir şey dökerse eşyalarınızı bırakmadan uzaklaşın. Restoranda fotoğraflı çok dilli menü tek başına kötü kalite kanıtı değildir; ancak fiyat, porsiyon ve ek ürün belirsizse sipariş vermeyin.",
        "Versailles, Paris programına iki saatlik saray ziyareti diye eklenmemelidir. RER C ile **Versailles Château–Rive Gauche** durağı seçeneklerden biridir; hat çalışmasını seyahat günü kontrol edin. Saray zamanlı girişi, bahçeler, Trianon ve dönüş yürüyüşüyle tam gün ayırın. Pazartesi saray kapalıdır; bahçe etkinliği veya fıskiye günü erişim/bilet kapsamını değiştirebilir.",
        "Şehir manzarası için her ücretli terasa çıkmak gerekmez. Galeries Lafayette çatısı, Parc de Belleville veya Montmartre açık alanları program ve hava uygunsa alternatif olabilir. Ücretsiz görünen çatının etkinlik, güvenlik veya özel kapanışla erişilemeyebileceğini kabul edin; asıl planınızı tek bir sosyal medya videosuna bağlamayın.",
      ],
    },
  ],

  places: [
    {
      name: "Le Comptoir du Relais",
      area: "Odéon",
      known: "Güneybatı Fransa etkili bistro mutfağı",
      why: "Saint-Germain'in turistik kalbinde güçlü ürün, klasik sos ve sık değişen tabaklarla gerçek bir bistro öğünü kurmak için gidilir.",
      price: "Orta",
      tip: "Rezervasyon ve servis düzeni güne göre değişebilir; güncel işletme bilgisini kontrol edin, sırayı öğle açılışından önce göze alın.",
    },
    {
      name: "Bistrot Paul Bert",
      area: "11. arrondissement",
      known: "Geleneksel Fransız bistrosu",
      why: "Steak-frites, mevsimsel ana yemek ve klasik tatlı üçlüsünü gösterişsiz, eski usul bistro ortamında deneyimletir.",
      price: "Orta",
      tip: "Küçük salon hızla dolar; güncel açık günü doğrulayıp doğrudan rezervasyon yapın.",
    },
    {
      name: "L'As du Fallafel",
      area: "Marais",
      known: "Doyurucu falafel sandviçi",
      why: "Rue des Rosiers'nin Yahudi mahallesi yemek kültürünü hızlı, ekonomik ve vejetaryen bir öğünle tanımak için pratik duraktır.",
      price: "Ekonomik",
      tip: "Kuyrukta menüyü seçin, yankesiciye karşı telefonunuzu açıkta tutmayın ve Şabat/açık gün düzenini kontrol edin.",
    },
    {
      name: "Bouillon Chartier Montparnasse",
      area: "Montparnasse",
      known: "Tarihî salonda uygun fiyatlı Fransız yemekleri",
      why: "Bouillon geleneğini, geniş salonu ve hızlı servisli klasik tabakları bütçeyi zorlamadan görmek için iyi bir başlangıçtır.",
      price: "Ekonomik",
      tip: "Masa paylaşımı ve hızlı servis deneyimin parçasıdır; şubeyi doğru seçin ve yoğun saatte sıra bekleyin.",
    },
    {
      name: "Breizh Café Le Marais",
      area: "Marais",
      known: "Breton galette ve crêpe",
      why: "Karabuğday galette, tuzlu tereyağı karameli ve cidre eşleşmesiyle Paris'teki Breton mutfağını derli toplu biçimde sunar.",
      price: "Orta",
      tip: "Birden fazla şube vardır; rezervasyonda adresi kontrol edin ve galette ile tatlı crêpe'i paylaşmayı düşünün.",
    },
    {
      name: "Marché des Enfants Rouges",
      area: "Haut-Marais",
      known: "Kapalı pazar ve farklı mutfak tezgâhları",
      why: "Tek restorana bağlanmadan pazar alışverişi, hızlı öğle ve Marais'nin gündelik ritmini aynı durakta görmek için uygundur.",
      price: "Ekonomik",
      tip: "Tezgâhların çalışma günü ve mutfak saati pazarın genel açılışından farklı olabilir; öğle yoğunluğundan önce gidin.",
    },
  ],

  itinerary: [
    { title: "1. Gün — Louvre, Tuileries ve Opéra", morning: "Zamanlı Louvre biletiyle seçtiğiniz iki koleksiyon; müzeyi tamamını bitirme hedefi koymayın.", afternoon: "Tuileries, Palais-Royal ve kapalı pasajlardan Opéra yönüne yürüyüş.", evening: "9. arrondissement veya Rue des Martyrs çevresinde bistro; erken uyku." },
    { title: "2. Gün — Adalar ve Sol Yaka", morning: "Île de la Cité, ücretsiz rezervasyon uygunsa Notre-Dame ve Sainte-Chapelle için ayrı bilet.", afternoon: "Latin Mahallesi, Panthéon çevresi, Luxembourg Bahçesi ve Saint-Germain.", evening: "Odéon'da yemek; Seine kıyısında kısa gün batımı yürüyüşü." },
    { title: "3. Gün — Marais ve doğu mahalleleri", morning: "Place des Vosges, Hôtel de Ville ve Marais sokakları; erken pazar öğünü.", afternoon: "Picasso veya Carnavalet'den birini seçin; Canal Saint-Martin'e geçin.", evening: "11. arrondissement'da rezervasyonlu bistro veya küçük tabaklar." },
    { title: "4. Gün — Eyfel, Invalides ve Seine", morning: "Resmî saatli Eyfel Kulesi bileti; hafif çanta ve doğru giriş ayağı.", afternoon: "Champ de Mars, Invalides ve Musée Rodin ya da Orsay'dan yalnız biri.", evening: "Hava uygunsa Seine tekne turu; sonrasında merkez yerine konaklama semtinizde yemek." },
    { title: "5. Gün — Montmartre veya Versailles", morning: "Şehirde kalıyorsanız Abbesses'ten Montmartre; Versailles seçtiyseniz zamanlı saray girişine erken hareket.", afternoon: "Montmartre'da kuzey yamaçları veya Versailles bahçeleri ile Trianon.", evening: "Paris'e dönüşte son mahalle yemeği; ertesi gün kullanacağınız tren garını doğrulayın." },
  ],

  practicalHeading: "Paris'te sıra, bilet ve ulaşım hatasını önleyen bilgiler",
  practicalTips: [
    { title: "Banka kartını metro bileti sanmayın", body: "2026 yazında açık ödeme tüm metro/RER turnikelerinde çalışmaz. Navigo Easy, telefon veya uygulamadan doğru ürünü yükleyin." },
    { title: "Louvre salı günü kapalıdır", body: "Yoğun yaz döneminde zamanlı rezervasyon zorunlu olabilir. Resmî bilet alanını kullanın ve seçtiğiniz koleksiyonların açık olduğunu kontrol edin." },
    { title: "Notre-Dame girişi ücretsizdir", body: "Kısa süre önce açılan ücretsiz zaman dilimi beklemeyi azaltabilir; üçüncü tarafın sattığı ücretli hızlı girişe kanmayın." },
    { title: "Eyfel bilet türünü okuyun", body: "Merdiven, ikinci kat ve zirve aynı erişim değildir. Zirve kapanabilir ve kulede büyük valiz emaneti yoktur." },
    { title: "RER biletinizi çıkışa kadar saklayın", body: "Merkez dışına giderken doğru hedef biletini alın; turnike çıkışında ya da kontrolde tekrar gerekir." },
    { title: "Ücretsiz suyu doğru isteyin", body: "Yemekte şişe su yerine 'une carafe d'eau' derseniz musluk suyu sürahisi istersiniz; bahşiş ise zorunlu yüzde değildir." },
  ],

  faqs: [
    { q: "Paris için kaç gün gerekir?", a: "İlk ziyaret için 4 tam gün alt sınır, 5 gün daha rahattır. Versailles'ı tam gün ekleyecekseniz Paris'in kendisi için en az dört gün bırakın." },
    { q: "Paris'te hangi semtte kalınır?", a: "İlk ziyaret için 5, 6 ve 9. arrondissement dengelidir; Marais merkezî, 11 yeme–içme odaklıdır. Kararı yalnız semt adına değil metro hattı ve gece sokak yorumuna göre verin." },
    { q: "Paris metrosunda banka kartı geçiyor mu?", a: "2026 yazında banka kartını metro/RER turnikesine doğrudan dokundurmak genel sistem değildir. Navigo Easy, uyumlu telefon veya resmî uygulamadan bilet kullanın." },
    { q: "Louvre bileti önceden alınmalı mı?", a: "Evet. Özellikle yazın zamanlı rezervasyon zorunlu olabilir. Louvre salı kapalıdır; bileti ticket.louvre.fr alanından alın." },
    { q: "Notre-Dame ücretli mi?", a: "Katedralin içi ücretsizdir. Resmî siteden isteğe bağlı ücretsiz zaman dilimi alınabilir; kule ziyareti ayrı işletme ve bilettir." },
    { q: "Paris Museum Pass almaya değer mi?", a: "Dahil kurumlardan yeterince fazlasını gerçekçi sürede gezecekseniz değerli olabilir. Saatli rezervasyonu kaldırmaz ve Eyfel Kulesi gibi her yeri kapsamaz." },
  ],

  relatedGuides: [
    { city: "Nice", anchor: "Paris'ten Nice'e: Côte d'Azur'a trenle geçiş", description: "Uzun TGV yolculuğunu doğru gün ve istasyonla planlayıp Riviera'da araçsız bir kıyı üssü kurun." },
    { city: "Lyon", anchor: "Paris'ten Lyon'a: gastronomi ve Roma mirası", description: "Kısa hızlı tren bağlantısıyla bouchon sofraları, traboule geçitleri ve Fourvière'i rotaya ekleyin." },
    { city: "Marsilya", anchor: "Paris'ten Marsilya'ya: Akdeniz limanı ve Calanques", description: "Vieux-Port'u doğa günleriyle dengeleyin; Calanques erişimini mevsim ve yangın riskine göre kurun." },
    { city: "Bordo", anchor: "Paris'ten Bordo'ya: şarap ve Garonne rotası", description: "Hızlı trenle Atlantik yönüne geçip şehir kültürünü rezervasyonlu bağ günüyle tamamlayın." },
    { city: "Strazburg", anchor: "Paris'ten Strazburg'a: Alsace'a hızlı tren", description: "Grande Île, Neustadt ve Colmar'ı Fransız–Alman tarihini görünür kılan kısa bir doğu rotasında birleştirin." },
  ],

  sources: [
    { name: "Île-de-France Mobilités — biletler ve 2026 tarifesi", url: "https://www.iledefrance-mobilites.fr/en/tickets-fares" },
    { name: "Paris Aéroport — toplu taşıma", url: "https://www.parisaeroport.fr/en/passengers/access" },
    { name: "Musée du Louvre — ziyaret ve bilet", url: "https://www.louvre.fr/en/visit/hours-admission/tickets-and-prices" },
    { name: "Tour Eiffel — resmî biletler", url: "https://www.toureiffel.paris/en/rates-opening-times" },
    { name: "Notre-Dame de Paris — ücretsiz rezervasyon", url: "https://www.notredamedeparis.fr/en/visit/reservation-free/" },
    { name: "Château de Versailles — ziyaret", url: "https://en.chateauversailles.fr/plan-your-visit" },
    { name: "Paris je t'aime — resmî turizm ofisi", url: "https://parisjetaime.com/eng/" },
  ],
  volatileNote: "Müze ve anıt rezervasyon koşulları, ulaşım tarifeleri, bakım/grev duyuruları ve konaklama vergisi değişebilir. Seyahat gününde resmî kanalları yeniden kontrol edin.",
  reviewed: "2026-08-10",
};

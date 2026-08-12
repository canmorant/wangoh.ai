import { CityGuide } from "./types";

/** Nice rehberi — Ağustos 2026 araştırması. */
export const nice: CityGuide = {
  city: "Nice",
  countryCode: "FR",

  seoTitle: "Nice Gezi Rehberi: Plajlar, Ulaşım ve 4 Günlük Rota",
  seoDescription:
    "Nice gezi rehberi: havalimanı tramvayı, kalınacak semtler, çakıllı plajlar, yerel yemekler, Monaco ve Antibes dahil 4 günlük rota ve güncel ipuçları.",
  h1: "Nice Gezi Rehberi",
  lede:
    "Nice, yalnız Promenade des Anglais'de yürünüp Monaco'ya geçilen bir sahil durağı değildir; Eski Şehir, Niçois mutfağı, yamaç müzeleri ve trenle bağlanan kıyı kasabaları onu Côte d'Azur'un en işlevsel üssü yapar.",

  quickFacts: [
    { label: "Önerilen süre", value: "3–4 tam gün" },
    { label: "Havalimanı", value: "NCE · tramvay 2/B" },
    { label: "Şehir içi", value: "Tramvay + yürüyüş" },
    { label: "Plaj", value: "Çakıl · deniz ayakkabısı iyi olur" },
    { label: "Günübirlik", value: "Villefranche · Antibes · Monaco" },
  ],

  sections: [
    {
      heading: "Nice gezisi nasıl planlanır? Şehir ile Riviera'yı dengeleyin",
      id: "gezi-planlama",
      body: [
        "Nice için iki gece yalnız ana meydanları görmeye yeter; şehri ve Côte d'Azur'u dengeli yaşamak için üç–dört tam gün ayırın. Bir günü Vieux Nice–Colline du Château, birini Promenade–Cimiez, birini de trenle Villefranche, Antibes veya Monaco'ya verin. Aynı gün üç kıyı kasabasına inip binmek, manzara görürken yer duygusunu kaybettirir.",
        "Yazın öğle sıcağını yokuş veya müzeye değil deniz, uzun yemek ya da gölgeli bahçeye ayırın. Castle Hill'e sabah çıkın; Vieux Nice sokaklarını pazar saatinde, Promenade'ı gün batımında görün. Yağmurda Chagall ve Matisse müzeleri iyi alternatiftir ancak kapanış günleri aynı değildir.",
        "Nice, araçsız Riviera için güçlü üsdür. TER trenleri sahil boyunca Cannes, Antibes, Monaco ve Menton yönüne gider; Villefranche ile Èze için tren ve otobüsün bıraktığı noktalar farklıdır. Èze-sur-Mer istasyonunu tepede yer alan Èze Village sanmayın; köye çıkan patika sıcak ve ciddi eğimlidir.",
      ],
    },
    {
      heading: "Nice Havalimanı'ndan merkeze tramvay ve tren bağlantısı",
      id: "havalimani-ulasimi",
      body: [
        "Nice Côte d'Azur Havalimanı'ndan **tramvay 2**, Jean Médecin üzerinden Port Lympia'ya; B hattı başka merkez bağlantılarına gider. Terminal 1–Terminal 2–Grand Arénas arasındaki havalimanı bölgesi ücretsizdir. Merkeze devam için havalimanına özgü gidiş–dönüş ürünü ile normal şehir biletinin güncel koşullarını Lignes d'Azur makinesi veya resmî sitesinden karşılaştırın; eski blogdaki fiyatı kullanmayın.",
        "Nice Saint-Augustin tren istasyonu Terminal 1'e yürüyüş ve ücretsiz tramvay bağlantısıyla yakındır. Doğrudan Cannes, Antibes, Monaco veya Menton tarafına gidiyorsanız önce şehir merkezine dönmeden TER kullanmak mantıklı olabilir. **Nice Saint-Augustin** ile ana istasyon **Nice-Ville** aynı yer değildir; otelinizin hangisine yakın olduğunu kontrol edin.",
        "Gece takside resmî sırayı kullanın, uygulama aracının buluşma noktasını terminal ekranından doğrulayın. Dönüşte tramvay kesintisi veya büyük etkinlik olabileceği için havalimanı sayfasını kontrol edin; yalnız haritadaki teorik süreyle uluslararası uçuşa yetişme planı kurmayın.",
      ],
    },
    {
      heading: "Nice'te toplu taşıma: La Carte, uygulama ve doğrulama kuralı",
      id: "toplu-tasima",
      body: [
        "Lignes d'Azur ağı tramvay ve otobüsü aynı sistemde bağlar. Yeniden kullanılabilir **La Carte** ya da uyumlu mobil çözüm üzerine bilet yükleyebilirsiniz; fiziksel kartın depozito/iade koşulunu satış noktasında sorun. Otobüste şoförden son dakika bileti her hatta veya kartla garanti değildir; resmî bilgiye göre acil bilet için nakit gerekebilir. Bileti makineden veya uygulamadan önceden hazırlayın.",
        "Her binişte, aktarma dâhil doğrulama yapın. Aktarma penceresi aynı güzergâhta geri dönüş hakkı vermeyebilir; sahile gidip aynı biletle geri dönmeyi varsaymayın. iPhone ve Android'de satın alma/yükleme işlevleri aynı olmayabilir; uygulamayı Türkiye'de indirip telefonunuzun NFC uyumluluğunu kontrol edin.",
        "Riviera günübirlikleri şehir içi karttan ayrıdır. TER biletini SNCF Connect veya istasyon makinesinden alın; trenler yazın kalabalık olabilir ve küçük istasyonlarda peron değişimi hızlı duyurulur. Monaco ayrı egemen devlettir fakat Fransa'dan TER ile kolay ulaşılır; dönüşte son sefer ve etkinlik kalabalığına pay bırakın.",
      ],
    },
    {
      heading: "Vieux Nice, Castle Hill ve pazarları doğru saatte gezin",
      id: "vieux-nice",
      body: [
        "Vieux Nice'in omurgası Cours Saleya, Place Rossetti ve dar sokaklardır. Cours Saleya'da pazar türü güne göre değişir; ürün pazarı, çiçek tezgâhları ve antika günü aynı program değildir. Sabah alışveriş ve socca için, akşam ise restoran kalabalığı için farklı karakter taşır. Pazar kapanırken alışveriş yapmak yerine erkenden gidin.",
        "Colline du Château'da kale kalıntısından çok şehir, liman ve Baie des Anges manzarası vardır. Merdiven, yokuş ve dönemsel çalışan asansör seçeneklerini güncel tabeladan kontrol edin; kapanış saati mevsime göre değişebilir. Su, şapka ve kaymayan ayakkabı taşıyın; gün batımını izlerken çıkış kapısının kapanışını kaçırmayın.",
        "Liman tarafına Rue Catherine Ségurane üzerinden inip Port Lympia'ya ulaşın. Renkli tekneler, antikacılar ve yemek adresleri Promenade'dan farklı bir Nice gösterir. Vieux Nice'de oda tutacaksanız geç saat bar, çöp toplama ve merdivensiz eski bina ihtimalini yorumlardan inceleyin.",
      ],
    },
    {
      heading: "Nice plajları: çakıl, özel lido ve güvenli yüzme",
      id: "plajlar",
      body: [
        "Baie des Anges plajları kum değil iri çakıldır. Deniz ayakkabısı giriş–çıkışı kolaylaştırır; ince havlu tek başına rahat şezlong olmaz. Kıyı hızla derinleşebilir ve dalga geri çıkışı zorlaştırabilir. Bayrak ile cankurtaran talimatını izleyin, kırmızı bayrakta denize girmeyin ve eşyayı gözetimsiz bırakmayın.",
        "Halk plajları ücretsizdir; özel **plage privée** işletmeleri şezlong, şemsiye, duş ve restoran hizmetini paket veya ayrı ücretle verir. Ön sıranın, havlunun ya da duşun dâhil olduğunu varsaymadan toplamı sorun. Temmuz–ağustosta ön rezervasyon gerekebilir; deniz tarafındaki fotoğraf ile size verilen sıra aynı olmayabilir.",
        "Daha korunaklı manzara için Villefranche-sur-Mer veya Cap-Ferrat koylarına gidilebilir, ancak küçük plajlar da yazın dolar. Sentier du Littoral kıyı patikaları sıcak, dalga ve bakım nedeniyle kapanabilir. Sandaletle zorlu bölüme girmeyin; resmî belediye duyurusunu ve dönüş otobüsünü kontrol edin.",
      ],
    },
    {
      heading: "Nice'te nerede kalınır? Carré d'Or'dan Libération'a",
      id: "nerede-kalinir",
      body: [
        "**Carré d'Or** ve Jean Médecin çevresi ilk ziyaret için tramvay, plaj ve istasyon arasında dengelidir; ana bulvar sesi ile daha sakin yan sokak arasında fark vardır. **Vieux Nice** atmosfer ve gece yemeği için güçlü, valiz, merdiven ve gece gürültüsü açısından zordur. **Port** çevresi restoranlar, tramvay ve doğu kıyı gezileri için canlı bir üsdür.",
        "**Libération**, pazar, daha yerel yeme–içme ve tramvayla merkez erişimi sunar; plaja yürüyüş daha uzundur. **Cimiez** sakin, yeşil ve aile için rahat; gece yemeklerinden sonra otobüs/taksi planı ister. Nice-Ville istasyon çevresi trenli günübirlikler için kullanışlı olsa da sokak ve blok seçimini güncel yorumlarla yapın.",
        "Deniz manzarası için Promenade odası seçerken yol trafiği, balkon yönü ve çift camı sorun. 'Sea view' yan açı olabilir; fotoğrafın oda kategorisine ait olduğunu doğrulayın. Belediye konaklama vergisi tesis sınıfına göre ayrıca tahsil edilebilir.",
      ],
    },
    {
      heading: "Nice'te ne yenir? Gerçek Niçois mutfağı",
      id: "ne-yenir",
      body: [
        "**Socca**, nohut unu ve zeytinyağıyla odun fırınında pişen ince, kenarı çıtır bir atıştırmalıktır; sıcak ve bol karabiberli yenir. **Pissaladière** soğan, zeytin ve ançüez; **pan bagnat** ise ton balığı, sebze, zeytinyağı ve ekmek dengesidir. Her ton balıklı sandviç pan bagnat, her sebze salatası salade niçoise değildir.",
        "Petits farcis, daube niçoise, stockfish ve tourte de blettes şehrin yalnız yaz salatasından ibaret olmadığını gösterir. Pazarda ürün görüp ardından yerel tabak yapan küçük restorana gitmek en anlamlı karşılaştırmadır. Şekerli pazı turtası kulağa tuhaf gelse de Niçois geleneğinin karakteristik tatlısıdır.",
        "Turistik sokakta 'menu niçois' yazması tek başına özgünlük kanıtı değildir. Cuisine Nissarde etiketi kullanan adreslerin güncel listesini turizm ofisinden kontrol edebilirsiniz. Servis fiyata dahildir; bahşiş isteğe bağlıdır. La Merenda gibi kimi küçük kurumların ödeme ve rezervasyon düzeni alışılmadık olabilir, gitmeden resmî bilgisini okuyun.",
      ],
    },
    {
      heading: "Nice'ten Monaco, Antibes ve Villefranche günübirlikleri",
      id: "gunubirlik",
      body: [
        "Monaco'da Monte-Carlo istasyonu tünel içindedir ve birden fazla çıkışı vardır; çıkış seçimi ciddi yokuş farkı yaratır. Eski Şehir–saray ile Casino çevresi aynı tepede değildir. Kumarhaneye girecekseniz kimlik ve kıyafet kuralını resmî siteden kontrol edin; ülke sınırı görünmez olsa da Monaco Fransa değildir.",
        "Antibes, surlar, Provençal pazar, Picasso Müzesi ve kumlu plajıyla tam güne yakın süreyi hak eder. Cannes ile aynı güne sıkıştırmak mümkündür ama müze ve pazar saatini kaybettirir. Villefranche ise kısa tren yolculuğu, eski sokaklar ve koy yüzmesi için daha hafif bir yarım gün olabilir.",
        "Èze Village için otobüs tepede bırakır; Èze-sur-Mer treni sahildedir. Nietzsche Patikası ikisini bağlar ama sıcak, eğim ve zemin nedeniyle sıradan şehir yürüyüşü değildir. Parfüm fabrikası turu, Monaco ve Èze'ı tek paketle yapmak istiyorsanız ulaşım kolaylığına karşı serbest zaman kaybını tartın.",
      ],
    },
  ],

  places: [
    { name: "Chez Pipo", area: "Liman / Riquier", known: "Socca ve tourte de blettes", why: "Socca'yı fırından sıcak, ortak masa ve hızlı servis geleneğinde denemek için şehrin en anlaşılır adreslerinden biridir.", price: "Ekonomik", tip: "Socca partiler hâlinde çıkar; güncel açık günü kontrol edin ve çok çeşit söylemeden sıcaklığı yakalayın." },
    { name: "La Merenda", area: "Vieux Nice", known: "Küçük salonda Niçois klasikleri", why: "Pissaladière, stockfish ve pazı turtası gibi yerel yemekleri eski usul, ürün odaklı bir mutfakta görmek için gidilir.", price: "Orta", tip: "Kapasite çok küçüktür; güncel rezervasyon kanalını ve ödeme yöntemini önceden doğrulayın." },
    { name: "Chez Acchiardo", area: "Vieux Nice", known: "Aile işletmesi, dolmalar ve daube", why: "Petits farcis ve daube gibi ev yemeği çizgisindeki Niçois tabaklarını sıcak, hareketli bir ortamda deneyimletir.", price: "Orta", tip: "Akşam için rezervasyon yapın; mevsimsel menüde yerel tabağı sorun." },
    { name: "Chez Davia", area: "Carré d'Or", known: "Rafine bölgesel mutfak", why: "Niçois tatlarını dikkatli ürün seçimi ve bistro tekniğiyle daha ölçülü, çağdaş bir tabakta görmek isteyenlere uygundur.", price: "Orta", tip: "Küçük salonda yer bulmak için rezervasyon yapın; güncel menü ve kapanış gününü kontrol edin." },
    { name: "Le Plongeoir", area: "Mont Boron kıyısı", known: "Kayalık üzerindeki deniz manzarası", why: "Yemeği kadar sıra dışı konum için seçilir; özel bir akşamda gün batımı ve deniz atmosferini birleştirir.", price: "Yüksek", tip: "Manzaralı masayı garanti sanmayın; rezervasyon, hava ve deniz kaynaklı düzeni önceden sorun." },
    { name: "Fenocchio", area: "Place Rossetti", known: "Dondurma ve yerel tatlar", why: "Zeytin, lavanta veya tourte de blettes esintili sıra dışı seçeneklerle klasik meyve sorbelerini aynı tezgahta karşılaştırmak eğlencelidir.", price: "Ekonomik", tip: "Birden fazla satış noktası olabilir; küçük porsiyonla iki tat deneyip meydan kalabalığında eşyaya dikkat edin." },
  ],

  itinerary: [
    { title: "1. Gün — Vieux Nice ve Castle Hill", morning: "Cours Saleya pazarını erken görün; socca veya pan bagnat molası verin.", afternoon: "Vieux Nice sokakları, katedral ve Colline du Château manzaraları.", evening: "Port Lympia'ya inip liman çevresinde rezervasyonlu yerel yemek." },
    { title: "2. Gün — Promenade ve Cimiez", morning: "Promenade des Anglais boyunca yürüyüş ve hava uygunsa halk plajında yüzme.", afternoon: "Cimiez'de Matisse Müzesi, arena ve manastır bahçesi; açık günleri doğrulayın.", evening: "Libération veya Carré d'Or'da akşam yemeği; gün batımında kıyıya dönüş." },
    { title: "3. Gün — Villefranche ve Cap-Ferrat", morning: "TER ile Villefranche, eski şehir ve koy; yazın erken yüzme.", afternoon: "Otobüsle Cap-Ferrat veya Villa Ephrussi; patika açıksa kısa kıyı yürüyüşü.", evening: "Nice'e dönüp dondurma ve Vieux Nice'de sakin bir akşam." },
    { title: "4. Gün — Antibes veya Monaco", morning: "Antibes'te pazar ve Picasso Müzesi ya da Monaco'da Eski Şehir ve saray çevresi.", afternoon: "Antibes surları/plajı veya Monaco'da liman ile Monte-Carlo; yokuşları hesaba katın.", evening: "Kalabalıktan önce TER ile Nice'e dönüş; son Niçois yemeği." },
  ],

  practicalHeading: "Nice'te plaj ve ulaşımı kolaylaştıran bilgiler",
  practicalTips: [
    { title: "Havalimanı tramvay ürününü kontrol edin", body: "Terminal içi ücretsiz bölge ile merkeze giden ücretli bölüm farklıdır. Makinedeki güncel havalimanı ve normal şehir bileti koşulunu karşılaştırın." },
    { title: "Bileti her binişte doğrulayın", body: "Aktarmada da kartı okutun; transfer penceresinin aynı hatta ücretsiz geri dönüş anlamına gelmediğini bilin." },
    { title: "Plaj için deniz ayakkabısı alın", body: "Nice kıyısı iri çakıllıdır ve su hızla derinleşebilir. Bayrağı izleyin, kırmızıda yüzmeyin." },
    { title: "Saint-Augustin ile Nice-Ville'i karıştırmayın", body: "Havalimanına yakın Saint-Augustin bölgesel istasyon, Nice-Ville ana merkez istasyonudur." },
    { title: "Èze durağını doğru seçin", body: "Èze-sur-Mer sahildedir; Èze Village tepededir. Aradaki patika sıcak ve zorlu olabilir." },
    { title: "Restoranın açık gününü doğrulayın", body: "Küçük Niçois restoranları haftada birkaç servis kapalı olabilir; rezervasyon ve ödeme biçimini resmî kanaldan kontrol edin." },
  ],

  faqs: [
    { q: "Nice için kaç gün gerekir?", a: "Şehir için 2–3 gün, bir veya iki Riviera günübirliğiyle 4 gün idealdir. Monaco, Antibes ve Villefranche'ın üçünü aynı güne sıkıştırmayın." },
    { q: "Nice Havalimanı'ndan merkeze nasıl gidilir?", a: "Tramvay 2 Port Lympia yönüne, B hattı diğer merkez bağlantılarına gider. Havalimanı bilet ürününü Lignes d'Azur'un güncel kanalından alın." },
    { q: "Nice plajları kumlu mu?", a: "Merkez kıyısı iri çakıllıdır. Deniz ayakkabısı ve kalın mat rahatlık sağlar; halk plajları ücretsiz, özel lidolar ücretlidir." },
    { q: "Nice'te araba gerekir mi?", a: "Merkez ve kıyı kasabaları için genellikle hayır. Tramvay, TER ve otobüs daha kolaydır; kırsal Provence rotasında araç ayrıca düşünülebilir." },
    { q: "Nice'ten Monaco'ya nasıl gidilir?", a: "Sahil boyunca çalışan TER en kolay seçenektir. Bileti önceden alın, Monte-Carlo istasyonunun doğru çıkışını ve dönüş seferini kontrol edin." },
    { q: "Nice'te hangi semtte kalınır?", a: "Carré d'Or ilk ziyaret için dengeli, Port canlı, Libération yerel, Cimiez sakindir. Vieux Nice atmosferli fakat merdiven ve gece sesi açısından dikkat ister." },
  ],

  relatedGuides: [
    { city: "Paris", anchor: "Nice'ten Paris'e: Riviera'dan müzeler başkentine", description: "Uzun TGV hattını doğru garla planlayıp kıyı temposundan beş günlük mahalle ve müze rotasına geçin." },
    { city: "Lyon", anchor: "Nice ile Lyon'u birleştirin: kıyıdan gastronomiye", description: "Akdeniz tatlarından bouchon mutfağına uzanan, trenle kurulabilen dengeli bir güneydoğu rotası." },
    { city: "Marsilya", anchor: "Nice'ten Marsilya'ya: iki farklı Akdeniz şehri", description: "Riviera zarafetiyle büyük liman enerjisini karşılaştırın; Calanques gününü hava koşuluna göre ayırın." },
    { city: "Bordo", anchor: "Nice'ten Bordo'ya: iki kıyı, iki şarap kültürü", description: "Uzak bağlantıyı aktarmalı tren veya uçuşla kurun; kısa programda ikisini aynı rotaya sıkıştırmayın." },
    { city: "Strazburg", anchor: "Nice'ten Strazburg'a: Akdeniz'den Alsace'a", description: "İklim ve mesafe farkını kabul edip ayrı uzun tren/uçuş ayağıyla yarım ahşap evler ve Alsace mutfağına geçin." },
  ],

  sources: [
    { name: "Aéroport Nice Côte d'Azur — toplu taşıma", url: "https://www.nice.aeroport.fr/en/directions/public-transport" },
    { name: "Aéroport Nice Côte d'Azur — tren", url: "https://www.nice.aeroport.fr/en/directions/train" },
    { name: "Lignes d'Azur — havalimanı ve biletler", url: "https://www.lignesdazur.com/en/airport" },
    { name: "Lignes d'Azur — doğrulama kuralları", url: "https://www.lignesdazur.com/en/faq-validation-ticket-inspections-and-fines" },
    { name: "TER Sud — Nice–Monaco", url: "https://www.ter.sncf.com/sud-provence-alpes-cote-d-azur/trajet-nice-monaco" },
    { name: "Explore Nice Côte d'Azur — resmî turizm", url: "https://www.explorenicecotedazur.com/en/" },
    { name: "Musées de Nice", url: "https://www.musees-nationaux-alpesmaritimes.fr/en" },
  ],
  volatileNote: "Havalimanı bilet ürünleri, tramvay/TER hizmeti, Castle Hill erişimi, plaj ve kıyı patikası güvenliği ile müze/restoran saatleri değişebilir. Resmî duyuruyu gezi gününde kontrol edin.",
  reviewed: "2026-08-10",
};

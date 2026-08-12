import { CityGuide } from "./types";

/** Napoli rehberi — Ağustos 2026 araştırması. */
export const napoli: CityGuide = {
  city: "Napoli",
  countryCode: "IT",

  seoTitle: "Napoli Gezi Rehberi: Ulaşım, Pizza ve 4 Günlük Rota",
  seoDescription:
    "Napoli gezi rehberi: havalimanı Alibus, metro ve füniküler, güvenli semt seçimi, pizza adresleri, Pompeii bileti ve gerçekçi 4 günlük rota.",
  h1: "Napoli Gezi Rehberi",
  lede:
    "Napoli kusursuz bir açık hava dekoru değil, gündelik hayatın antik sokaklar, yeraltı katmanları, körfez manzarası ve olağanüstü bir yemek kültürüyle üst üste aktığı yoğun bir kenttir; onu sevmek için ritmini düzeltmeye değil okumaya çalışmak gerekir.",

  quickFacts: [
    { label: "Önerilen süre", value: "3 tam gün · Pompeii ile 4" },
    { label: "Havalimanı", value: "NAP / Capodichino" },
    { label: "Şehir içi", value: "Yürüyüş + metro + füniküler" },
    { label: "Ana istasyon", value: "Napoli Centrale / Garibaldi" },
    { label: "Yerel tat", value: "Pizza + sfogliatella + espresso" },
  ],

  sections: [
    {
      heading: "Napoli'yi anlamak: şehir, Pompeii'ye açılan bekleme salonu değildir",
      id: "sehri-anlamak",
      body: [
        "Napoli'nin UNESCO tarihî merkezi decumani boyunca doğu–batı uzanır; Spaccanapoli tek bir resmî cadde değil bu doğrultuyu görünür kılan kentsel eksendir. Via dei Tribunali, San Gregorio Armeno, Duomo ve Piazza del Gesù çevresini bir günde yürümek mümkündür fakat kilise, avlu ve sokak hayatına zaman bırakınca aynı rota tam gün olur.",
        "İkinci katman Via Toledo–Quartieri Spagnoli–Plebiscito; üçüncüsü Chiaia–Lungomare; dördüncüsü Vomero–San Martino; beşincisi Rione Sanità'dır. Hepsini Pompeii dönüşü akşamlarına sıkıştırmayın. Napoli üç tam günü hak eder; Pompeii/Herculaneum veya ada günü eklenecekse dördüncü–beşinci gün gerekir.",
        "Şehrin gürültüsü, scooterları ve çamaşır ipleri 'otantiklik gösterisi' değildir. Dar sokakta duvara yakın yürüyün, kör köşede aracın sesini dinleyin ve kapı/tezgâh önünde fotoğraf için akışı kapatmayın. İnsanları balkon dekoru gibi izinsiz yakın çekmeyin.",
      ],
    },
    {
      heading: "Napoli Havalimanı'ndan merkeze: Alibus ve taksi",
      id: "havalimani-ulasimi",
      body: [
        "Capodichino (NAP) için demiryolu bağlantısı yoktur. Resmî **Alibus**, havalimanını Piazza Garibaldi/Napoli Centrale ile liman–Molo Beverello yönüne bağlar. Bilet havalimanı makineleri, çevrimiçi kanal veya otobüsten alınabilir; güncel durak ve tarifeyi GESAC/ANM sayfasından kontrol edin.",
        "Oteliniz tarihî merkezin doğusunda veya tren bağlantınız varsa Garibaldi; Municipio, Chiaia veya ada feribotuna geçecekseniz liman durağı daha mantıklı olabilir. Yoğun trafikte resmî sayfadaki yaklaşık süreyi kesin aktarma süresi saymayın; Capri/Ischia feribotu veya ayrı tren için geniş pay bırakın.",
        "Varış önünde resmî taksi sırası bulunur ve belirli güzergâhlar için önceden belirlenmiş tarifeler yayımlanır. Binmeden sabit tarifeyi talep edin, adresi gösterin ve bagaj/gece ekinin kapsama dâhil olup olmadığını tarife kartından okuyun. Terminal içinde müşteri arayan lisanssız kişiyi takip etmeyin.",
        "Havalimanının gece kapanış uygulaması ve sefer saatleri değişebilir. Çok erken uçuşta terminalde geceleme varsayımı yapmayın; otel, resmî taksi ve check-in açılışını önceden planlayın.",
      ],
    },
    {
      heading: "Napoli'de ulaşım: metro, füniküler ve Tap&Go sınırları",
      id: "sehir-ici-ulasim",
      body: [
        "ANM Linea 1, merkez–Vomero bağlantısının omurgası ve Toledo gibi 'art stations' duraklarıyla başlı başına tasarım deneyimidir. Linea 6, fünikülerler, otobüs ve tramvaylar farklı aksları tamamlar. Uygulama/hat haritasında ANM ile EAV işletmelerini ayırın; aynı şehirde her araç aynı bilet/temassız kapsamda olmayabilir.",
        "ANM'nin **Tap&Go** sistemi 2026 bilgisinde Linea 1, Linea 6, fünikülerler, Monte Echia asansörü ve Alibus'ta etkin okuyucularda kullanılabilir. Aynı kart/cihazı giriş ve gerekiyorsa çıkışta kullanın; bir kartı iki yolcu için art arda okutmayı varsaymayın. Otobüs veya EAV/Circumvesuviana'ya otomatik kapsandığını düşünmeyin.",
        "UnicoCampania/ANM GO üzerinden alınan dijital biletin QR etkinleştirme kuralını binmeden okuyun. Kâğıt bileti doğrulatın. Füniküler kapanışı/bakımı ve metro son saatleri değişebildiğinden Vomero akşam dönüşünü yalnız Google Maps'e bırakmayın.",
        "Taksi için resmî durak veya yerel uygulama/radio taxi kullanın; plaka ve taksimetreyi görün. Scooter kiralamak dar sokaklarda yerel sürüş deneyimi, motosiklet sınıfı ehliyet, uluslararası sürücü belgesi, kask ve sigorta gerektirir; şehir gezisi için zorunlu değildir.",
      ],
    },
    {
      heading: "Tarihî merkez: decumani, şapeller ve yeraltı",
      id: "tarihi-merkez",
      body: [
        "Piazza del Gesù'den Santa Chiara, Spaccanapoli, San Domenico Maggiore ve Sansevero Şapeli yönüne yürümek Napoli'nin Yunan–Roma sokak planını Barok cephelerle birleştirir. Cappella Sansevero sınırlı kapasite ve zamanlı biletle çalışabilir; Veiled Christ için resmî satış kanalını kullanın, içeride fotoğraf kuralını izleyin.",
        "San Gregorio Armeno'nun presepe atölyeleri yıl boyu açıktır, Noel öncesi aşırı yoğunlaşır. El yapımı parça ile seri ürünü sorun, dükkân girişini fotoğraf kalabalığıyla kapatmayın. Via dei Tribunali'deki pizza kuyruğunu bütün günü belirleyen tek hedefe çevirmeyin.",
        "Napoli Sotterranea, Galleria Borbonica, San Lorenzo Maggiore altı ve Napoli'nin katakompları aynı 'yeraltı turu' değildir; farklı tarih ve giriş noktaları vardır. Dar tünel/merdiven, nem ve klostrofobi koşullarını okuyup birini seçin. Reklam panosundaki 'official' kelimesi yerine işletmenin açık rota ve güvenlik bilgisini kontrol edin.",
        "Duomo'daki San Gennaro Şapeli yaşayan dinî kültürün merkezidir. Mucize/tören günlerinde kalabalık ve erişim değişir; kutsal eşyayı yalnız folklor gösterisi gibi ele almayın. Kiliselerde omuz/diz örtüsü ve sessizlik kuralını izleyin.",
      ],
    },
    {
      heading: "MANN, Capodimonte ve Sanità: arkeolojiyi bağlama oturtmak",
      id: "muzeler-ve-sanita",
      body: [
        "Museo Archeologico Nazionale di Napoli (MANN), Pompeii ve Herculaneum'dan gelen mozaik, heykel ve gündelik eşyaları bağlama oturtur. İdeal sıra, MANN'ı arkeoloji alanından önce ya da hemen sonra görmektir. Koleksiyon bölümleri/restorasyon nedeniyle kapanabildiğinden resmî harita ve açık salonları kontrol edin; en az iki–üç saat ayırın.",
        "Rione Sanità, Fontanelle, katakomplar, Palazzo dello Spagnolo ve canlı pazar sokaklarıyla bağımsız yarım gündür. Mahalle turizminin yerel sosyal projelerle ilişkisini gözetin; rehberli topluluk turları gelir ve tarih açısından daha anlamlı olabilir. Sanità'yı yalnız Maradona grafitisi ve yoksulluk görüntüsü için tüketmeyin.",
        "Museo e Real Bosco di Capodimonte tepededir; merkezden yürüme haritada kısa görünse de eğim ve trafik vardır. Koleksiyon, saray ve park için yarım gün ayırın; otobüs/taksi dönüşünü önceden planlayın. Geçici salon kapanışını kontrol edin.",
        "Catacombe di San Gennaro ve San Gaudioso farklı giriş/rota sunar; aynı bilet kapsamında dönemsel bağlantı olabilir. Güncel ziyaret saatini ve rehber dilini resmî siteden seçin. Rota basamaklı/nemli olabilir.",
      ],
    },
    {
      heading: "Toledo, Quartieri Spagnoli, Chiaia ve Vomero",
      id: "mahalleler",
      body: [
        "Via Toledo, Galleria Umberto I ve Piazza del Plebiscito ekseni kraliyet/19. yüzyıl kentini açar. Teatro di San Carlo turu ile temsil bileti farklıdır; prova nedeniyle salon görünümü değişebilir. Palazzo Reale'yi aynı güne eklerseniz iç mekân yoğunluğunu hesaba katın.",
        "Quartieri Spagnoli gündüz ve akşam canlıdır; Via Emanuele de Deo'daki Maradona duvarı çevresi çok sıkışabilir. Telefonu kalabalıkta açıkta tutmayın, scooter geçişini dinleyin ve konut kapısını kapatmayın. Ana fotoğraf noktasından birkaç sokak uzaklaşınca mahalle daha gündelik görünür.",
        "Chiaia, Santa Lucia ve Lungomare daha geniş, deniz odaklı yürüyüş sunar. Castel dell'Ovo erişimi uzun dönemli çalışma/duyurulara bağlı olabilir; uzaktan görünür diye açık olduğunu varsaymayın. Mergellina, feribot/metro bağlantısı ve gün batımı için merkezin devamıdır.",
        "Vomero'ya füniküler/metro ile çıkıp Castel Sant'Elmo ve Certosa di San Martino manzarasıyla şehrin coğrafyasını okuyun. Pedamentina merdivenlerinden inerken zemin ve gün ışığına dikkat edin; ağır valiz veya gece için uygun kestirme değildir.",
      ],
    },
    {
      heading: "Pompeii, Herculaneum ve adalar: Napoli'den günübirlik plan",
      id: "gunubirlik-rotalar",
      body: [
        "Pompeii tam gün ister. 2026'da resmî park, çevrimiçi satış için Vivaticket kanalını kullanıyor; biletler isimli ve günlük ziyaretçi sınırı vardır. Porta Marina, Piazza Anfiteatro ve Piazza Esedra resmî gişeleridir. Hangi girişe ve hangi tren istasyonuna gittiğinizi önceden seçin.",
        "Circumvesuviana/EAV ile Pompei Scavi–Villa dei Misteri, ana Porta Marina girişine yakındır; Trenitalia'nın Pompei istasyonu başka konumdadır. Campania Express dönemsel ve rezervasyonlu olabilir. Aynı isimli istasyonları karıştırmamak, bilet fiyatından daha büyük zaman kazandırır.",
        "Herculaneum daha kompakt, korunmuş yapı ayrıntıları güçlü ve yarım–tam gün arası gezilebilir; Pompeii'nin küçük kopyası değildir. İkisini yaz sıcağında tek güne sıkıştırmak yüzeyseldir. Vesuvius erişimi ise ayrı zamanlı bilet/transfer ve hava koşulu gerektirir.",
        "Capri, Ischia ve Procida feribotları farklı iskele/işletme ve hava koşullarına bağlıdır. Molo Beverello hızlı deniz otobüsleri, Porta di Massa bazı feribotlar için kullanılır; bilette iskeleyi tam okuyun. Aynı gün uçuşa deniz bağlantısı koymayın.",
      ],
    },
    {
      heading: "Napoli'de nerede kalınır ve güvenlik nasıl okunur?",
      id: "nerede-kalinir",
      body: [
        "**Centro Storico** ilk ziyaret ve gece yemekleri için en yoğun deneyimdir; avluya bakan oda ile cadde cephesi arasında büyük ses farkı vardır. **Toledo/Quartieri Spagnoli kenarı** merkezi ve metroya yakın; dar iç sokakta bagaj bırakma/taksi erişimini sorun. **Chiaia/Santa Lucia** daha sakin, deniz ve restoran için güçlü ama daha pahalıdır.",
        "**Vomero** sakin konut hissi, manzara ve metro/füniküler sunar; tarihî merkeze her gün inilir. **Mergellina** deniz ve bazı ada bağlantıları için iyi. **Garibaldi/Centrale** erken tren ve bütçede pratiktir; özellikle istasyonun doğu/kuzey bloklarında gece dönüş güzergâhını ve güncel yorumları kontrol edin.",
        "Napoli 'gidilmez şehir' değildir; fakat yoğun turistik merkez, metro, Circumvesuviana ve istasyon çevresinde yankesicilik önlemi gerekir. Telefonu scooter tarafındaki elinizde gevşek tutmayın, çantayı kapalı/öne alın, ATM'de yardım teklifini reddedin. Pasaport ve bütün kartları aynı cüzdanda taşımayın.",
        "Lisanssız bagaj depolama ve terminalde yaklaşan transfer tekliflerinden kaçının. Konaklamanın yasal kayıt, resepsiyon/anahtar teslimi ve konaklama vergisi ödeme biçimini yazılı alın. Acil durumda tek Avrupa numarası 112'dir.",
      ],
    },
    {
      heading: "Napoli'de ne yenir? Pizza tek bir kuyruk değildir",
      id: "ne-yenir",
      body: [
        "Napoli pizzası yumuşak, benekli ve katlanabilir merkezle gelir; çatal/bıçakla başlamak hata değildir. Marinara domates–sarımsak–kekik, Margherita domates–peynir–fesleğen dengesidir. Bir ünlü pizzacı için iki saat beklemek yerine farklı mahallede iyi fırın ve yerel sıra arayın. **Pizza a portafoglio** katlanmış küçük sokak porsiyonu, pizza fritta ise ayrı kızartma geleneğidir.",
        "Cuoppo di mare/terra, pasta e patate con provola, genovese (adı Cenova olsa da Napoli yemeği), ragù napoletano, frittatina di pasta ve sartù daha geniş mutfağı gösterir. Deniz ürünü lokantasında güncel kilo fiyatı ile coperto/servizioyu menüden okuyun.",
        "Sfogliatella riccia gevrek katmanlı, frolla daha yumuşak hamurludur; babà romlu şurupla gelir. Espressoyu barda ayakta hızlı içmek yerel ritimdir. **Caffè sospeso** bir başkası için önceden kahve bırakma geleneğidir; bunu sosyal medya performansına çevirmeden kasanın uygulamasını sorun.",
        "Pizzeria kuyruğunda size numara verilip verilmediğini ve içeride mi dışarıda mı beklendiğini sorun. Masaya oturmadan menü fiyatını görün; bazı popüler yerlerde rezervasyon yok, sıra sistemi vardır. Kart kabulü yaygınlaşsa da sokak tezgâhı ve küçük ödeme için nakit taşıyın.",
      ],
    },
  ],

  places: [
    {
      name: "L'Antica Pizzeria da Michele",
      area: "Forcella",
      known: "Marinara ve Margherita odaklı tarihî pizzeria",
      why:
        "Çok kısa klasik menü üzerinden Napoli pizzasının hamur, domates ve fırın dengesini en yalın biçimde karşılaştırmak için referanstır.",
      price: "Ekonomik",
      tip: "Via Cesare Sersale'deki özgün Napoli adresini seçin; numara/kuyruk sistemini sorun, yoğunlukta paket almayı değerlendirin.",
    },
    {
      name: "Starita a Materdei",
      area: "Materdei",
      known: "Klasik pizza ve montanara",
      why:
        "Kızartılıp fırınlanan montanara gibi tekniklerle merkez ana aksından uzak, köklü mahalle pizza geleneğini deneyimletir.",
      price: "Ekonomik",
      tip: "Via Materdei 27/28 adresini ve açık gününü doğrulayın; yoğun akşam için rezervasyon politikasını kontrol edin.",
    },
    {
      name: "Concettina ai Tre Santi",
      area: "Rione Sanità",
      known: "Çağdaş yorumlu Napoli pizzası",
      why:
        "Sanità'nın tarihini modern malzeme/menü yaklaşımıyla birleştirir; klasik Margherita sonrası Napoli pizza sahnesinin nereye gittiğini gösterir.",
      price: "Orta",
      tip: "Napoli Sanità adresini Capri şubesiyle karıştırmayın; tadım/alakart ve rezervasyon düzenini resmî sitesinden okuyun.",
    },
    {
      name: "50 Kalò",
      area: "Mergellina",
      known: "Hamur ve malzeme dengeli çağdaş pizzeria",
      why:
        "Deniz yürüyüşü gününde ferah, iyi fermente hamurlu pizza ile tarihî merkezdeki kuyruk deneyimine farklı bir karşılık sunar.",
      price: "Orta",
      tip: "Piazza Sannazaro çevresindeki Napoli adresini doğrulayın; ana yemek saatinde bekleme payı bırakın.",
    },
    {
      name: "Mimì alla Ferrovia",
      area: "Centrale / Vasto",
      known: "Klasik Napoli mutfağı ve deniz ürünleri",
      why:
        "Pizza dışında genovese, ragù, balık ve mevsimsel Campania tabaklarını eski okul servisinde denemek için güçlü alternatiftir.",
      price: "Orta",
      tip: "Tren öncesi acele öğüne koymayın; servis süresi ve açık günü doğrulayıp rezervasyon yapın.",
    },
    {
      name: "Sfogliatelle Attanasio",
      area: "Garibaldi",
      known: "Sıcak riccia ve frolla sfogliatella",
      why:
        "İstasyona yakın küçük dükkânda iki sfogliatella türünü yan yana denemek, şehre geliş/ayrılış için anlamlı kısa ritüeldir.",
      price: "Ekonomik",
      tip: "Sıcak hamur çok kırıntılıdır; valizle kapıyı kapatmayın ve çalışma saatini güncel kanaldan kontrol edin.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — Decumani ve tarihî merkez",
      morning:
        "Piazza del Gesù, Santa Chiara ve Spaccanapoli; zamanlı Sansevero biletiniz varsa saati merkeze yerleştirin.",
      afternoon:
        "San Domenico, San Gregorio Armeno, Duomo ve Via dei Tribunali; kuyruksuz uygun bir pizza molası.",
      evening:
        "Piazza Bellini çevresi ve sakin bir trattoria; dar sokakta scooter akışına dikkat edin.",
    },
    {
      title: "2. Gün — MANN, Sanità ve Vomero",
      morning:
        "MANN'da Pompeii koleksiyonlarına odaklı iki–üç saat; sonra Sanità'ya yürüyüş/metro.",
      afternoon:
        "Rehberli katakomb veya mahalle rotası; metro/fünikülerle Vomero ve San Martino manzarası.",
      evening:
        "Füniküler çalışma durumunu kontrol edip merkeze inin; pizza yerine genovese/ragù yemeği.",
    },
    {
      title: "3. Gün — Toledo, kraliyet kenti ve deniz",
      morning:
        "Toledo istasyonu, Quartieri Spagnoli ve Maradona çevresi; Galleria Umberto I ve Plebiscito.",
      afternoon:
        "Palazzo Reale veya San Carlo turundan birini seçin; Santa Lucia ve Lungomare'ye yürüyün.",
      evening:
        "Chiaia/Mergellina'da gün batımı ve rezervasyonlu akşam yemeği.",
    },
    {
      title: "4. Gün — Pompeii",
      morning:
        "İsimli resmî bilet ve doğru istasyon/girişle erken Pompeii; su, şapka ve rahat ayakkabı.",
      afternoon:
        "Arkeoloji alanını tek rota üzerinde sürdürün; Vesuvius'u aynı güne eklemeyin.",
      evening:
        "Napoli'ye dönüş, hafif cuoppo/sfogliatella; ertesi uçuş/feribot transferini doğrulayın.",
    },
  ],

  practicalHeading: "Napoli'de ulaşım, pizza ve günübirlik rota hatalarını önleyin",
  practicalTips: [
    {
      title: "Alibus'ta doğru durakta inin",
      body: "Garibaldi tren/merkez doğusu, Molo Beverello liman/Chiaia yönü için uygundur. Trafikte aktarmaya geniş pay bırakın.",
    },
    {
      title: "Tap&Go her hatta geçmez",
      body: "ANM Linea 1, Linea 6, fünikülerler, Monte Echia ve Alibus kapsamını açıklıyor; EAV/Circumvesuviana veya her otobüsü otomatik dâhil sanmayın.",
    },
    {
      title: "Pompei istasyonunun tam adını okuyun",
      body: "EAV Pompei Scavi–Villa dei Misteri ile Trenitalia Pompei farklı konumdadır. Bilet ve park girişini birlikte seçin.",
    },
    {
      title: "Feribot iskelesini karıştırmayın",
      body: "Molo Beverello ve Porta di Massa farklı hizmetler sunabilir. Biletteki iskele ve kalkış saatini aynı sabah kontrol edin.",
    },
    {
      title: "Pizza için bütün günü sırada geçirmeyin",
      body: "Numara/paket sistemini sorun; ünlü yer çok yoğunsa aynı mahallede doğrulanmış başka pizzeria seçin.",
    },
    {
      title: "Telefonu scooter tarafında taşımayın",
      body: "Dar sokak ve yoğun kalabalıkta telefonu iç tarafta, çantayı kapalı/önde tutun; fotoğraf için yol ortasında durmayın.",
    },
  ],

  faqs: [
    {
      q: "Napoli için kaç gün gerekir?",
      a: "Şehir için 3 tam gün, Pompeii veya başka bir arkeoloji/ada günüyle 4–5 gün planlayın.",
    },
    {
      q: "Napoli Havalimanı'ndan merkeze nasıl gidilir?",
      a: "Alibus, Capodichino'yu Piazza Garibaldi/Centrale ve liman–Molo Beverello yönüne bağlar. Trafik ve güncel durakları resmî kaynaktan kontrol edin.",
    },
    {
      q: "Napoli güvenli mi?",
      a: "Normal büyük şehir önlemleriyle gezilebilir. İstasyon, metro, Circumvesuviana ve kalabalık turistik sokaklarda yankesicilik; dar yollarda scooter trafiği için dikkat gerekir.",
    },
    {
      q: "Napoli'den Pompeii'ye hangi tren gider?",
      a: "EAV/Circumvesuviana ile Pompei Scavi–Villa dei Misteri ana girişe yakındır. Trenitalia'nın Pompei istasyonu farklı yerdedir; istasyon ve giriş adını eşleştirin.",
    },
    {
      q: "Napoli'de temassız kartla metroya binilir mi?",
      a: "ANM Tap&Go belirli metro, füniküler ve Alibus hatlarında çalışır. Aynı kart/cihazı kullanın; her işletme ve hat kapsamda değildir.",
    },
    {
      q: "Napoli'de hangi bölgede kalınır?",
      a: "İlk ziyaret için Centro Storico veya Toledo, sakin/deniz için Chiaia, manzara için Vomero, erken tren için dikkatli blok seçimiyle Garibaldi uygundur.",
    },
  ],

  relatedGuides: [
    {
      city: "Amalfi Kıyısı",
      anchor: "Napoli'den Amalfi Kıyısı'na: kıyı transferini doğru kurun",
      description: "Sorrento veya Salerno kapısını üsse göre seçin; son feribot, otobüs ve valiz adımlarını önceden yazın.",
    },
    {
      city: "Roma",
      anchor: "Napoli'den Roma'ya: hızlı trenle antik başkente",
      description: "Centrale'den Termini'ye geçip Kolezyum ile Vatikan'ı ayrı günlere bölerek en az dört gece kalın.",
    },
    {
      city: "Floransa",
      anchor: "Napoli'den Floransa'ya: Campania'dan Rönesans'a",
      description: "Hızlı trenle SMN'ye varın; Uffizi, Duomo ve Accademia biletlerini önceden ayırın.",
    },
    {
      city: "Milano",
      anchor: "Napoli'den Milano'ya: tren–uçuş kararını toplam süreyle verin",
      description: "Üç Milano havalimanının transferini hesaba katıp merkezden merkeze hızlı trenle karşılaştırın.",
    },
    {
      city: "Venedik",
      anchor: "Napoli'den Venedik'e: güneyden lagüne",
      description: "Uzun tren/uçuş sonrası Santa Lucia–Mestre farkını, vaporetto biletini ve 2026 erişim QR'ını çözün.",
    },
  ],

  sources: [
    { name: "Napoli Airport — Alibus ve ulaşım", url: "https://www.aeroportodinapoli.it/en/how-to-arrive" },
    { name: "ANM — biletler ve Tap&Go", url: "https://www2.anm.it/index.php?Itemid=320&id=1344&option=com_content&task=view" },
    { name: "ANM — Tap&Go hatları", url: "https://www2.anm.it/index.php?Itemid=521&id=3869&option=com_content&task=view" },
    { name: "Pompeii Archaeological Park — bilet ve saat", url: "https://pompeiisites.org/en/visiting-info/timetables-and-tickets/" },
    { name: "Museo Archeologico Nazionale di Napoli", url: "https://mann-napoli.it/en/" },
    { name: "Concettina ai Tre Santi — resmî site", url: "https://www.concettinaaitresanti.com/" },
    { name: "AVPN — Starita a Materdei", url: "https://www.pizzanapoletana.org/it/associati/153-starita_a_materdei" },
  ],

  volatileNote:
    "ANM/EAV hizmeti ve Tap&Go kapsamı; Alibus, feribotlar, Pompeii girişleri, müze/yeraltı turları, taksi tarifeleri ve restoran saatleri değişebilir. Seyahat gününde resmî kaynağı kontrol edin.",
  reviewed: "2026-08-10",
};

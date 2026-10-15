import { CityGuide } from "./types";

/** Phuket rehberi — Ağustos 2026 araştırması. */
export const phuket: CityGuide = {
  city: "Phuket",
  countryCode: "TH",

  seoTitle: "Phuket Gezi Rehberi: Hangi Plaj, Ulaşım ve 5 Günlük Rota",
  seoDescription:
    "Phuket'te Patong, Kata, Bang Tao ve Old Town farkları; HKT ulaşımı, Smart Bus, feribot iskeleleri, muson güvenliği, yerel yemekler ve 5 günlük rota.",
  h1: "Phuket Gezi Rehberi",
  lede:
    "Phuket bir plaj kasabası değil, kuzeyden güneye yolculuğu trafiğe göre saatler sürebilen büyük bir ada ilidir. Tatilin kalitesini en çok hangi oteli değil, hangi kıyıda ve hangi amaçla üs seçtiğiniz belirler.",

  quickFacts: [
    { label: "Önerilen süre", value: "4–5 tam gün" },
    { label: "Daha sakin deniz", value: "Genellikle kasım–nisan" },
    { label: "Havalimanı", value: "Phuket HKT · adanın kuzeyi" },
    { label: "Toplu taşıma", value: "Smart Bus + yerel otobüs; sınırlı" },
    { label: "Ana kural", value: "Kırmızı bayrakta denize girilmez" },
  ],

  sections: [
    {
      heading: "Phuket'i anlamak: ada büyük, kıyılar birbirinden farklı",
      id: "adayi-anlamak",
      body: [
        "Phuket'in havalimanı kuzeyde, Phuket Old Town güneydoğuda, popüler plajların çoğu batı kıyısındadır. Patong'dan Kata kısa görünür ama tepe, viraj ve trafik içerir; havalimanından Rawai'ye inmek adanın neredeyse tamamını geçmektir. Günlük planı 'Phuket'te' diye değil **kuzeybatı, orta batı, güney ve Old Town** olarak kurun.",
        "Aynı tatilde her gün başka plaja taksiyle gitmek özgürlük değil, ulaşım bütçesi ve zaman kaybıdır. Yüzme/gece hayatı/çocuklu tatil/yerel yemek/tekne turu önceliğinizden birini seçip üssü ona göre belirleyin. Old Town'da kalıp her gün plaja, Mai Khao'da kalıp her akşam Patong'a inmeyi planlamak iki yanlış uç örnektir.",
        "Phuket'in kıyı fotoğrafları hava ve gelgitten bağımsız değildir. Andaman Denizi mayıs–ekim döneminde daha dalgalı ve değişken olabilir. Bir plajın sabah yüzülebilir olması öğleden sonra akıntının güvenli kalacağı anlamına gelmez; cankurtaran bayrak ve duyurusu harita yorumundan daha günceldir.",
      ],
    },
    {
      heading: "Hangi bölgede kalınır? Phuket sahil seçme rehberi",
      id: "nerede-kalinir",
      body: [
        "**Patong**, en yoğun gece hayatı, alışveriş, tur satıcısı ve ulaşım seçeneğidir. Arabasız gezgin için pratik; sakin plaj tatili arayan için gürültülü ve ticari olabilir. Bangla Road yakınlığı isteyenle ailece uyumak isteyen aynı Patong otelini seçmemeli; sokak ve ses yorumlarını okuyun.",
        "**Kata**, yüzme mevsiminde plaj–restoran dengesi ve orta ölçekli tatil için güçlüdür. **Karon** daha uzun ve açık sahil hissi verir; otelin plaja 'karşı' olması bazen yoğun yolu geçmek demektir. İki bölge birbirine yakın ama yokuşlu ara bağlantılar yürüyüşü her noktada kolay kılmaz.",
        "**Bang Tao–Cherngtalay–Laguna**, uzun plaj, beach club, villa ve resort ekosistemi sunar. Kuzeydeki havalimanına Patong/Kata'dan daha yakındır; Old Town ve güney iskelelerine uzaktır. Araç/uygulama bütçesi yüksek, tesis içinde kalma oranı fazladır. Gece hayatı Patong değil daha dağınık restoran ve kulüp çizgisidir.",
        "**Kamala**, Patong'dan daha sakin, Bang Tao'dan daha kompakt bir orta yol olabilir. Sahilin farklı uçları aynı derecede yürünebilir değildir. **Surin**, plaj odaklı ve daha küçük; büyük alışveriş/gece seçenekleri sınırlıdır.",
        "**Rawai–Nai Harn**, adanın güneyinde daha yerleşik, uzun konaklamaya ve deniz ürünü/tekne günlerine uygun atmosfer verir. Rawai kıyısı klasik yüzme plajı değildir; Nai Harn yüzme için ayrı hedeftir. Chalong ve güney çıkışlı turlara erişim iyi, HKT transferi uzundur.",
        "**Phuket Old Town**, Sino-Portekiz cepheler, kahveler, pazar ve yerel mutfak için en karakterli merkezdir; kapıda plaj yoktur. İki gecelik yemek/kültür ayağı olarak çok iyi, yalnız deniz tatili için yanlış beklentidir. **Mai Khao–Nai Yang**, havaalanına yakın, uzun sakin sahil ve resort için; ana turistik güneyden uzaktır. Uçak fotoğrafı için güvenlik şeridini ihlal etmeyin.",
      ],
    },
    {
      heading: "Gezilecek yerler: plaj dışındaki Phuket",
      id: "gezilecek-yerler",
      body: [
        "Old Phuket Town'u pazar gününe denk getirirseniz Lard Yai/Sunday Walking Street, Thalang Road çevresinde genellikle geç öğleden geceye kurulur. Etkinlik saati ve yol kapanışını TAT/yerel resmî duyurudan kontrol edin. Pazar kalabalığından önce sabah cepheleri, Çin–Tayland tapınaklarını ve küçük müzeleri yürümek daha rahattır.",
        "Wat Chalong aktif bir kutsal alandır; plaj kıyafetiyle içeri girmeyin. Büyük Buda alanının erişim, güvenlik veya heyelan nedeniyle durumu değişebilir; eski seyahat yazısına dayanarak doğrudan yola çıkmayın, resmî yerel duyuruyu kontrol edin. Tepelik noktalarda manzara kadar yol ve park trafiği planı önemlidir.",
        "Karon Viewpoint, Promthep Cape ve güney manzara duraklarını tek araç rotasında birleştirebilirsiniz. Gün batımında Promthep çok yoğun olabilir; aynı ışığı daha az kalabalık bir güney sahilinde izlemek bazen daha iyi deneyimdir. Seyir noktasını bütün günü bölmek için değil, zaten o yöndeyken ekleyin.",
        "Phuket Mining Museum, Peranakan mirası ve Old Town yemekleri yağmurlu gün alternatifi oluşturur; bütün kötü hava gününü alışveriş merkezine teslim etmek gerekmez. İşletme ve müze günleri değişebildiği için yola çıkmadan doğrulayın.",
      ],
    },
    {
      heading: "HKT havalimanından plajlara ulaşım",
      id: "havalimani-ulasim",
      body: [
        "Phuket International Airport (HKT) adanın kuzeyindedir. Resmî/ruhsatlı taksi, önceden ayarlanmış otel transferi ve uygulama aracı kapıdan kapıya seçeneklerdir. Grab'ın HKT için resmî havalimanı yönlendirmesi vardır; uygulamada uçuş ve belirlenmiş alma noktasını izleyin. Geliş salonundaki rastgele aracı değil, banko/uygulama kaydını kullanın.",
        "**Phuket Smart Bus**, havalimanından batı kıyısı boyunca Bang Tao, Surin, Kamala, Patong, Karon ve Kata üzerinden Rawai yönüne gider. 2026'da temassız Tap & Go sistemi için resmî duyuru yapıldı. Bu, ucuz ve manzaralı ama sık duraklı bir omurgadır; ağır valiz, gece geliş veya ara sokaktaki otel için kapıdan kapıya çözüm değildir. Resmî uygulama/site üzerinden gerçek zaman ve son seferi kontrol edin.",
        "Airport Bus/yerel hatlar Old Town yönünde ayrı çalışabilir; Smart Bus'ın Old Town'a gittiğini varsaymayın. Terminal, durak ve ödeme yöntemi değişebildiğinden HKT ve operatörün güncel sayfasını kullanın. Dört kişilik grupta transfer ile otobüs toplamını, yalnız bilet fiyatıyla değil otobüsten otele son kilometreyle karşılaştırın.",
        "Dönüşte plaj–havalimanı süresine haritanın o anki tahmininden daha geniş pay verin. Yağmur, kaza ve Patong/Kata yokuşları trafiği aniden sıkıştırır. Uluslararası uçuş sabahı güneyden çıkıyorsanız son geceyi havaalanına taşımak şart değildir ama özel transferi önceden sabitlemek huzur sağlar.",
      ],
    },
    {
      heading: "Ada içinde ulaşım: Smart Bus, taksi, araç ve scooter",
      id: "ada-ici-ulasim",
      body: [
        "Phuket'te metro veya kapsamlı sık seferli belediye ağı yoktur. Smart Bus batı kıyısı omurgasında iyidir; Old Town ile plajlar arasındaki yerel mavi/sarı otobüs ve songthaew hatları daha yavaş, gündüz odaklı ve her plaj çiftini bağlamaz. Otelinize en yakın durağı operatör haritasında doğrulayın.",
        "Grab/Bolt fiyatı önceden gösterir fakat bölge ve saate göre araç arzı değişir. Havalimanı, iskele ve turistik taksi bölgelerinde yalnız uygulamanın gösterdiği resmî alma noktasına gidin. Sokak taksisinde toplam fiyatı, beklemeyi ve dönüşü binmeden yazılı netleştirin. Gün boyu güney turu yapacaksanız tek tek araç çağırmak yerine ruhsatlı şoförlü araç maliyetini karşılaştırın.",
        "Kiralık otomobil aile veya dağınık rota için işe yarayabilir; sol trafik, dar/virajlı yollar, motosiklet yoğunluğu, otel parkı ve alkollü gece dönüşü kararın parçasıdır. Scooter ucuz görünür ama kazalar Phuket tatilinin en ciddi risklerindendir. Motosiklet sınıfına uygun ehliyet ve uluslararası sürücü belgesi, gerçek kask ve poliçe kapsamı olmadan kullanmayın. Kiralama dükkânının belge sormaması yasal onay değildir.",
        "Aracı teslim alırken lastik, fren, far ve tüm gövdeyi tek videoda kaydedin; pasaport yerine depozito/kopya seçeneğini sorun. Plajdan ıslak ve kumlu çıkıp hemen sürmek, gün batımında virajlı yola girmek ve tropik sağanakta devam etmek gereksiz risktir.",
      ],
    },
    {
      heading: "Tekne turları ve feribotlar: iskele adını bilmeden bilet almayın",
      id: "tekne-ve-iskeleler",
      body: [
        "Phuket'ten Phi Phi, Phang Nga Körfezi/James Bond Island, Similan ve Racha yönlerine turlar satılır; bunlar aynı deniz günü değildir. Phi Phi açık deniz ve plaj/snorkel; Phang Nga korunaklı körfez, mağara/kano ve karst manzarası; Similan daha uzun ve sezonluk millî park yolculuğudur. İlginize göre **bir** ana tur seçin, her manşeti tek güne sıkıştıran paketten kaçının.",
        "**Rassada Pier** büyük feribotların Phi Phi/Krabi yönünde sık kullandığı ana iskeledir. **Chalong Pier** güneyde dalış ve ada turlarında; **Ao Po** kuzeydoğuda Phang Nga rotalarında görülebilir. Marina ve özel tekne çıkışları ayrıca değişir. Voucher üzerindeki tam iskele, buluşma saati, otel transferi ve dönüş noktasını okuyun; 'Phuket pier' yeterli bilgi değildir.",
        "Sürat teknesi daha hızlı ama sert denizde sarsıntılı; büyük feribot daha yavaş ve hava koşuluna göre yine iptal olabilir. Hamilelik, sırt/boyun rahatsızlığı, küçük çocuk veya hareket hastalığını operatöre dürüstçe bildirin. Can yeleği, yolcu kapasitesi, lisans ve sigorta açıklamasını sorun. En ucuz sokak acentesinin belirsiz tekne adı yerine doğrulanabilir operatör seçin.",
        "Ayrı biletli uluslararası uçuşla aynı gün uzak adadan dönmeyin. Hava nedeniyle gecikme/iptal, poliçede kaçırılan uçuşu karşılamayabilir. Millî park kapanışları ve koruma dönemleri her yıl değişir; Similan/Maya Bay gibi yerleri eski takvimle açık kabul etmeyin.",
      ],
    },
    {
      heading: "Deniz güvenliği ve mevsim: kırmızı bayrak dekor değildir",
      id: "mevsim-ve-guvenlik",
      body: [
        "Andaman kıyısında genellikle **kasım–nisan** daha sakin deniz ve düşük yağışla öne çıkar; **mayıs–ekim** güneybatı musonunda dalga, rip akıntısı ve tekne iptali artabilir. Bu dönem her gün yağmur demek değildir; güzel görünen günde bile kıyı akıntısı güçlü olabilir.",
        "Kırmızı bayrak varsa yüzmeyin. Kırmızı–sarı bayraklı cankurtaran koridoru gösteriliyorsa o alan içinde kalın. Rip akıntısında kıyıya karşı doğruca savaşmak yerine kıyıya paralel çıkış ve yardım işareti temel ilkedir; en doğrusu yasaklı alana girmemektir. Gece ve alkol sonrası denize girmeyin.",
        "2026'da Phuket batı kıyısında Portuguese man-of-war için resmî uyarılar yayımlandı. Mavi/mor görünümlü canlıya veya kopmuş dokunaca elle dokunmayın; sahil görevlisinin talimatını izleyin. Denizanası/temas ilk yardımını kulaktan dolma sirke veya tatlı su kuralına bağlamayın; tür ve resmî yerel protokol önemlidir.",
        "Hava tahminini yalnız yağmur yüzdesiyle değil TMD deniz uyarıları, rüzgâr ve operatör kararlarıyla okuyun. Tekne gününü tatilin ortasına koymak, iptal olursa kıyı günüyle değiştirme payı verir.",
      ],
    },
    {
      heading: "Phuket'te ne yenir? Peranakan, Güney Tayland ve deniz",
      id: "ne-yenir",
      body: [
        "Phuket mutfağı Tayland, Hokkien Çin, Malay ve Müslüman toplulukların ticaret tarihini taşır. **Moo hong** biberli–soyalı yavaş pişmiş domuz; **mee Hokkien** koyu soslu kalın erişte; **gaeng pu bai cha plu** yengeçli, betel yapraklı hindistan cevizi körisi; **o-aew** jölemsi serin tatlı; roti ve massaman Müslüman kahvaltı damarını gösterir.",
        "Güney Tayland körileri merkez mutfağından daha acı ve keskin olabilir. 'Medium spicy' kesin bir ölçü değildir; acı toleransınızı açık söyleyin ve pirinç/omlet/yumuşak moo hong ile denge kurun. Deniz ürününde kilo/adet fiyatını, pişirme ücretini ve balığın ağırlığını siparişten önce görün. Canlı tank tek başına kalite veya sürdürülebilirlik garantisi değildir.",
        "2026 Michelin Guide Phuket seçkisinde Bib Gourmand ve Selected işletmeler vardır; PRU bir yıldızını korurken birçok sevilen yer yıldızlı değildir. Rehberde statüyü yalnız güncel Michelin sayfasında doğruladığımız mekânlarda kullandık. Raya tarihî ve değerli bir adres olabilir ama 2026 Michelin statüsü doğrulanamadığı için ona eski etiketi yapıştırmadık.",
      ],
    },
    {
      heading: "Para, gece hayatı, pazar ve yaygın hatalar",
      id: "pratik-ve-hatalar",
      body: [
        "Phuket ülkenin daha pahalı turistik bölgelerindendir; özellikle ada içi ulaşım, beach club, taksi ve tekne turu Bangkok algısını bozar. Otel ücretine havaalanı transferi, plaj sandalyesi, çocuk kulübü veya zorunlu yemek dahil mi bakın. Kart büyük işletmelerde yaygın; pazar, yerel otobüs, küçük lokanta ve bazı iskele ödemelerinde nakit gerekir. PromptPay QR yabancı kartın çalışacağı anlamına gelmez.",
        "Patong gece hayatında menü fiyatı, servis ücreti, giriş/masa şartı ve açık hesap prosedürünü siparişten önce sorun. İçeceğinizi gözetimsiz bırakmayın. Tayland'da alkol yaşı 20'dir ve satış/tüketim bazı saat/yer/özel gün kısıtlarına tabidir; açık bar görmek her satışın yasal olduğu anlamına gelmez.",
        "Vape/e-sigara yasaktır; kenevir çiçeği 2025'ten beri Tayland'da tıbbi reçeteye bağlı kontrollü üründür. Dükkân görünürlüğünü serbestlik sanmayın. Plajda drone uçurmak da 'boş gökyüzü' meselesi değildir: havaalanı, millî park, kayıt ve sigorta kuralları olabilir; resmî izinleri çözmeden uçurmayın.",
        "En yaygın planlama hataları Old Town'u sahil sanmak, Smart Bus'ı kapıdan kapıya hızlı transfer kabul etmek, her gün farklı kıyıya gitmek ve dönüş uçuşu sabahında Phi Phi'den feribota güvenmektir. Phuket'te az yer seçmek daha çok tatil yapmaktır.",
      ],
    },
  ],

  places: [
    {
      name: "One Chun",
      area: "Phuket Old Town",
      known: "Phuket ev yemekleri · Michelin 2026 Bib Gourmand",
      why:
        "Moo hong, acılı–ekşili güney yemekleri ve aile tariflerini tarihî bina içinde paylaşmak, Phuket mutfağına en anlaşılır girişlerden birini verir.",
      price: "Orta",
      tip: "2026 Bib Gourmand statüsü doğrulandı; yoğun saatte sıra olabilir. İki kişiyseniz acı ve yumuşak yemekleri dengeleyin.",
    },
    {
      name: "Go Benz",
      area: "Phuket Old Town",
      known: "Biberli domuz suyu, çıtır domuz · Michelin 2026 Bib Gourmand",
      why:
        "Gece çalışan sade dükkânda pirinç eriştesi, sakatat ve çıtır domuzla Phuket'in Hokkien–Tayland damarını güçlü bir kâsede görürsünüz.",
      price: "Ekonomik",
      tip: "Bazı yemekler tükenebilir; sakatat istemiyorsanız belirtin. Güncel açık gün ve geç saat düzenini kontrol edin.",
    },
    {
      name: "Mor Mu Dong",
      area: "Chalong / Pa Lai",
      known: "Mangrovda deniz ürünü · Michelin 2026 Bib Gourmand",
      why:
        "Gelgitle değişen kanal kenarı kulübelerinde paylaşmalı Güney Tayland yemekleri, sahil resort restoranından farklı yerel coğrafya hissi verir.",
      price: "Orta",
      tip: "Merkezden uzaktır; gidiş–dönüş aracı planlayın. Deniz ürünü fiyatını ve porsiyon boyunu siparişten önce sorun.",
    },
    {
      name: "Roti Chaofa",
      area: "Talat Nuea",
      known: "Roti, massaman ve Müslüman kahvaltısı · Michelin Bib Gourmand",
      why:
        "Phuket yemek hikâyesinin yalnız deniz ürünü ve domuzdan ibaret olmadığını, gevrek roti ile baharatlı köri eşleşmesinde gösterir.",
      price: "Ekonomik",
      tip: "Sabah/öğle odaklıdır; geç saate bırakmayın. Tatlı ve tuzlu rotinin ikisini küçük siparişlerle deneyin.",
    },
    {
      name: "Chuan Chim",
      area: "Talat Yai",
      known: "Wok deniz ürünleri · Michelin 2026 Bib Gourmand",
      why:
        "Hızlı ateşte taze deniz ürünü ve sarımsak–biber dengesi için Old Town'daki köklü, ikinci kuşak seçenek. Büyük turistik menü yerine birkaç paylaşmalı tabak kurulur.",
      price: "Orta",
      tip: "Öğle ve akşam servis arası olabilir; güncel saati kontrol edin. Deniz ürününde günlük seçimi sorun.",
    },
    {
      name: "Raya",
      area: "Phuket Old Town",
      known: "Tarihî evde klasik Phuket yemekleri",
      why:
        "Moo hong ve yengeçli betel yaprağı körisi gibi ada klasiklerini karakterli eski evde deneyimlemek için uzun ömürlü bir adres.",
      price: "Yüksek",
      tip: "Resmî sitesinden rezervasyon ve açık gün kontrolü yapın; 2026 Michelin statüsü iddiasında bulunmuyoruz.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — Seçtiğiniz kıyıda yavaş başlangıç",
      morning:
        "Otel çevresi ve ana plajınızı yürüyerek tanıyın; cankurtaran bayraklarını, marketi ve gerçek Smart Bus durağını bulun.",
      afternoon:
        "Sıcağı havuz/gölge molasıyla geçirin. Yakın ikinci koy varsa günün tek kısa transferini yapın; adayı çaprazlamayın.",
      evening:
        "Kata/Karon'da sahil yemeği, Bang Tao'da mahalle–resort seçimi veya Patong'da kurallarını bildiğiniz gece planı.",
    },
    {
      title: "2. Gün — Old Town ve Phuket mutfağı",
      morning:
        "Old Town cepheleri, Çin–Tayland tapınakları ve yerel kahvaltı. Öğle öncesi sokaklar daha fotojenik ve serindir.",
      afternoon:
        "Müze/şophouse ziyareti ve paylaşmalı Phuket öğle yemeği. Pazar günüyse araç dönüşünü yol kapanışına göre ayarlayın.",
      evening:
        "Lard Yai Sunday Walking Street denk geliyorsa pazar; değilse Go Benz veya Old Town'da farklı bir mahalle yemeği.",
    },
    {
      title: "3. Gün — Tek bir deniz rotası",
      morning:
        "Hava uygunsa ilginize göre Phi Phi, Phang Nga veya Racha turundan birine çıkın. İskele ve pickup saatini bir gece önce teyit edin.",
      afternoon:
        "Aynı turda yüzme/kano/snorkel. Can yeleğini ve park kurallarını izleyin; mercana basmayın, balık beslemeyin.",
      evening:
        "Dönüş gecesini otelinize yakın tutun. Sürat teknesi sonrası uzun taksi ve gece kulübü planlamayın.",
    },
    {
      title: "4. Gün — Güney Phuket",
      morning:
        "Wat Chalong; resmî erişim açıksa güncel koşullarla Büyük Buda bölgesi. Kıyafet ve güneş koruması hazırlayın.",
      afternoon:
        "Rawai–Nai Harn hattı ve Chalong/Pa Lai'de yerel öğle yemeği. Rawai'yi yüzme plajı sanmayın.",
      evening:
        "Promthep kalabalığı yerine seçtiğiniz güney kıyısında gün batımı; şoförlü araçla güvenli dönüş.",
    },
    {
      title: "5. Gün — Hava payı ve kişisel ada",
      morning:
        "İptal olan tekne gününe pay bırakın; hava iyiyse kendi plajınızda yüzün. Kırmızı bayrakta havuz/spa seçin.",
      afternoon:
        "Yağmurluysa Old Town müzesi veya yemek atölyesi; açıksa manzara ve kısa mahalle rotası. Son gün uzak adaya gitmeyin.",
      evening:
        "Bavul ve HKT transferini netleştirin; uçuş saatine göre Smart Bus son seferi veya özel araç rezervasyonunu doğrulayın.",
    },
  ],

  practicalHeading: "Phuket tatilini gerçekten kolaylaştıran ayrıntılar",
  practicalTips: [
    {
      title: "Otel adından önce plajı seçin",
      body: "Patong, Kata, Bang Tao, Rawai ve Old Town birbirinin alternatifi değildir. Günlük ana amacınıza en yakın bölgeyi seçmek taksi ve trafik yükünü keser.",
    },
    {
      title: "Smart Bus hızlı ekspres değildir",
      body: "HKT–Rawai batı kıyısı omurgasında çok durur. Ucuzdur ama ağır valiz, geç gece ve ara sokak oteli için son kilometre gerekir.",
    },
    {
      title: "İskeleyi voucher'dan okuyun",
      body: "Rassada, Chalong, Ao Po ve marinalar farklı yönlerdedir. 'Phuket'ten kalkış' ifadesi transfer planı için yetersizdir.",
    },
    {
      title: "Kırmızı bayrak pazarlık konusu değildir",
      body: "Deniz sakin görünse de rip akıntısı olabilir. Cankurtaran uyarısında yüzmeyin ve alkollü/gece denize girmeyin.",
    },
    {
      title: "Tekne gününü son güne koymayın",
      body: "Muson, rüzgâr veya millî park kararı iptal yaratabilir. Tatilin ortasında planlamak değişim ve para iadesi için zaman bırakır.",
    },
    {
      title: "Scooter sigortasını satır satır okuyun",
      body: "Motosiklet yetkili ehliyet/IDP yoksa poliçe ödeme yapmayabilir. Kask ve deneyim olmadan ada yokuşlarını öğrenme alanı yapmayın.",
    },
    {
      title: "Rawai yüzme plajı değildir",
      body: "Rawai kıyısı tekne ve deniz ürünü odağındadır; yüzme için Nai Harn gibi ayrı plaja gitmeniz gerekir.",
    },
    {
      title: "Portuguese man-of-war'a dokunmayın",
      body: "Kıyıya vurmuş veya kopmuş dokunaç da yakabilir. 2026 resmî uyarıları batı kıyısında görüldüğünü doğruladı; görevli talimatını izleyin.",
    },
  ],

  faqs: [
    {
      q: "Phuket kaç günde gezilir?",
      a: "Bir plaj üssü, Old Town, bir tekne günü ve güney ada rotası için 5 gün rahattır. Dört günde yapılabilir; muson döneminde iptal payı azalır. İki–üç gün yalnız seçtiğiniz kıyı veya transfer durağı için uygundur.",
    },
    {
      q: "Phuket'te hangi bölgede kalmalıyım?",
      a: "Gece hayatı ve kolaylık için Patong; dengeli plaj için Kata/Karon; resort ve uzun plaj için Bang Tao; sakin güney/uzun konaklama için Rawai–Nai Harn; yemek ve kültür için Old Town. Havalimanı yakınlığı için Mai Khao/Nai Yang düşünülür.",
    },
    {
      q: "Phuket havalimanından Patong, Kata veya Rawai'ye nasıl gidilir?",
      a: "Resmî taksi/otel transferi/Grab kapıdan kapıya; Phuket Smart Bus batı kıyısı boyunca ekonomik seçenektir. Otobüs çok durur ve otelin kapısına girmeyebilir; güncel durak ile son seferi resmî operatörden kontrol edin.",
    },
    {
      q: "Phuket'te araç veya scooter şart mı?",
      a: "Tek bölgede kalıp bir–iki tur yapıyorsanız şart değil. Dağınık ada rotasında otomobil/şoför faydalı olabilir. Scooter yalnız motosiklet ehliyeti ve IDP, deneyim, kask ve sigorta kapsamı ile düşünülmeli.",
    },
    {
      q: "Phuket'e hangi ay gidilir?",
      a: "Kasım–nisan genellikle daha sakin deniz verir; mayıs–ekim musonunda dalga, rip akıntısı ve tekne iptali artabilir. Hava yıldan yıla değişir; TMD deniz uyarısı ve plaj bayrağı belirleyicidir.",
    },
    {
      q: "Phuket'ten Phi Phi'ye günübirlik mi konaklamalı mı?",
      a: "Sınırlı zamanda lisanslı tur kolaydır; kalabalık saatlerin dışında ada hissi için Phi Phi'de gecelemek farklı deneyimdir. Feribot/tekne iptal payı bırakın ve dönüşü uluslararası uçuşla aynı güne bağlamayın.",
    },
    {
      q: "Phuket Old Town plaja yakın mı?",
      a: "Hayır. Old Town adanın güneydoğu iç kesimindedir ve yürüyerek yüzme plajına gidilmez. Yemek/kültür üssü veya bir günlük rota olarak planlayın; plaj günleri için araç gerekir.",
    },
  ],

  relatedGuides: [
    {
      city: "Krabi",
      anchor: "Phuket'ten Krabi'ye: ikinci bir plaj değil, başka bir coğrafya",
      description:
        "Ao Nang, Railay ve Krabi Town üsleriyle karst manzarasına geçin; feribot ile kara transferini mevsime göre karşılaştırın.",
    },
    {
      city: "Bangkok",
      anchor: "Phuket'ten Bangkok'a: kıyıdan metropole",
      description:
        "HKT uçuşuyla başkente geçin; aynı Tayland bütçesini varsaymadan ulaşım ve mahalle kümeleriyle planlayın.",
    },
    {
      city: "Koh Samui",
      anchor: "Phuket mi Koh Samui mi? Mevsim ve ada düzeni karar versin",
      description:
        "Samui başka kıyıda ve farklı yağış takvimindedir; iki adayı yakın komşu sanmadan transfer zincirini okuyun.",
    },
  ],

  sources: [
    { name: "TAT — Phuket destinasyon ve plaj güvenliği", url: "https://www.tourismthailand.org/Destinations/Provinces/Phuket/350" },
    { name: "TAT — Phuket OneMap ve toplu taşıma", url: "https://www.tatnews.org/2025/07/phuket-onemap-a-convenient-guide-to-getting-around-by-public-bus/" },
    { name: "Thailand.go.th — Phuket Smart Bus Tap & Go", url: "https://thailand.go.th/issue-focus-detail/-phuket-smart-bus--tap--go--?hl=th" },
    { name: "Phuket Smart Bus — resmî operatör", url: "https://phuketsmartbus.com/th" },
    { name: "Phuket Airport — Smart Bus güzergâhı", url: "https://phuket.airportthai.co.th/service/way-to-airport/detail/97" },
    { name: "Grab — Phuket Airport", url: "https://www.grab.com/global/airport-rides/phuket-international-airport/" },
    { name: "TAT — Old Town ve Lard Yai rotası", url: "https://www.tourismthailand.org/Trip-Planner/Suggestion-Detail/recommended-route-for-one-day-3" },
    { name: "Thailand PRD — 2026 Portuguese man-of-war uyarısı", url: "https://thailand.prd.go.th/en/content/category/detail/id/52/iid/507889" },
    { name: "Michelin — One Chun", url: "https://guide.michelin.com/en/phuket-region/phuket/restaurant/one-chun" },
    { name: "Michelin — Go Benz", url: "https://guide.michelin.com/us/en/phuket-region/phuket/restaurant/go-benz" },
    { name: "Michelin — Mor Mu Dong", url: "https://guide.michelin.com/us/en/phuket-region/phuket/restaurant/mor-mu-dong" },
    { name: "Raya — resmî site", url: "https://www.rayarestaurant.net/" },
  ],

  volatileNote:
    "Deniz bayrakları, tekne ve millî park erişimi, Smart Bus saat/ödeme sistemi, iskeleler, tapınak/seyir alanı erişimi ve restoran statüleri değişebilir. Resmî günlük uyarıları izleyin.",
  reviewed: "2026-08-09",
};

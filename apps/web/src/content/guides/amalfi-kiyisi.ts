import { CityGuide } from "./types";

/** Amalfi Kıyısı rehberi — Ağustos 2026 araştırması. */
export const amalfiKiyisi: CityGuide = {
  city: "Amalfi Kıyısı",
  countryCode: "IT",

  seoTitle: "Amalfi Kıyısı Gezi Rehberi: Ulaşım, Üs ve 5 Günlük Rota",
  seoDescription:
    "Amalfi Kıyısı gezi rehberi: Positano, Amalfi, Ravello ve sahil köyleri; Napoli/Salerno transferi, feribot–otobüs seçimi, konaklama ve 5 günlük rota.",
  h1: "Amalfi Kıyısı Gezi Rehberi",
  lede:
    "Amalfi Kıyısı tek bir kasaba veya arabayla geçilecek manzara yolu değil; dik merdivenler, mevsimsel deniz hatları ve birbirinden farklı köyler arasında doğru üs seçimini gerektiren dikey bir coğrafyadır.",

  quickFacts: [
    { label: "Önerilen süre", value: "4–5 gece" },
    { label: "Ana kapılar", value: "Salerno · Napoli/Sorrento" },
    { label: "Şehir içi", value: "Feribot + otobüs + yürüyüş" },
    { label: "En rahat dönem", value: "Mayıs–Haziran · Eylül" },
    { label: "Temel karar", value: "Önce üs, sonra transfer" },
  ],

  sections: [
    {
      heading: "Amalfi Kıyısı neresi ve kaç gün gerekir?",
      id: "kiyi-planlama",
      body: [
        "UNESCO Amalfi Kıyısı, Positano'dan Vietri sul Mare yönüne uzanan, limon terasları ile dağların denize indiği geniş bir kültürel peyzajdır. Positano, Praiano, Amalfi, Atrani, Ravello, Minori, Maiori, Cetara ve Vietri aynı karakteri paylaşmaz. Tek gün otobüs camından üç isim görmek kıyıyı gezmek değildir.",
        "İlk yolculuk için dört–beş gece idealdir. Bir gün Positano/Praiano, bir gün Amalfi/Atrani, bir gün Ravello, bir gün tekne/plaj veya Sentiero degli Dei; son gün Minori–Maiori ya da Cetara–Vietri ekseni kurulabilir. Capri ayrı tam gün, Pompeii ise kıyının doğal kısa durağı değil bağımsız arkeoloji günüdür.",
        "Haritadaki 15 km yazın bir saatten uzun sürebilir. SS163 dar, virajlı ve trafik/kaza/çalışmadan etkilenir; feribot daha hızlı görünse de rüzgâr ve deniz durumu seferi iptal edebilir. Her gün için kara ve deniz B planı oluşturun; uluslararası uçuş gününe ada veya son feribot bağlantısı koymayın.",
      ],
    },
    {
      heading: "Hangi kasabada kalınır? Positano, Amalfi, Ravello ve diğer üsler",
      id: "nerede-kalinir",
      body: [
        "**Positano** ikonik manzara, restoran ve deniz bağlantısında güçlü; konaklama pahalı ve merdivenlidir. 'Merkeze 300 metre' yüzlerce basamak olabilir. Spiaggia Grande ile üst yol/Chiesa Nuova duraklarından hangisine yakın olduğunuzu ve bagaj taşıma hizmetini sorun.",
        "**Amalfi** feribot ve otobüs düğümü olduğu için araçsız ilk ziyarette en işlevsel üstür. Atrani'ye kısa yaya geçişi, Ravello otobüsü ve doğu kıyı bağlantısı kolaydır. Gün ortasında çok kalabalıklaşır fakat sabah/akşam daha yaşanır. **Atrani** daha küçük ve sakin; merdiven/tünel erişimini kontrol edin.",
        "**Ravello** yukarıda, bahçe ve manzara odaklı, romantik ve geceleri sakindir; deniz seviyesinde değildir. Her plaj/feribot günü için Amalfi'ye virajlı otobüs/taksi gerekir. **Praiano** gün batımı ve daha yavaş ritim sunar; merkez tek bir düz meydan değildir, plajlara basamak çoktur ve akşam araç/otobüs planı gerekir.",
        "**Minori** yemek ve daha sakin küçük merkez; **Maiori** kıyının daha geniş/düz sahil şeridi ve aile kolaylığı; **Cetara** balıkçılık/colatura; **Vietri sul Mare** seramik ve Salerno erişimi için öne çıkar. Bütçe ve lojistik için Salerno'da kalıp gündüz feribotla kıyıya gitmek mümkündür; fakat son seferden sonra kıyı akşamını yaşayamazsınız.",
      ],
    },
    {
      heading: "Napoli, Salerno ve havalimanlarından Amalfi Kıyısı'na ulaşım",
      id: "kiyi-ulasimi",
      body: [
        "Kıyının ana demiryolu istasyonu yoktur. Napoli Capodichino'dan Positano/Praiano için Sorrento yönü; Amalfi, Maiori, Cetara ve Vietri için **Salerno yönü** çoğu zaman daha doğrudur. Napoli Centrale'den Salerno'ya hızlı/bölgesel tren sonrası mevsimsel feribot veya otobüs kullanılabilir. Bagajla Garibaldi–liman aktarmasını hafife almayın.",
        "Salerno Costa d'Amalfi (QSR) uçuş ağı gelişmekte olan ayrı havalimanıdır; adı kıyıda olduğu izlenimi verse de son kara/deniz transferi gerekir. Uçuşunuza göre havalimanının resmî otobüs/taksi bağlantısını kontrol edin. Napoli (NAP) ile karıştırmayın.",
        "Sorrento, Positano'nun batı kapısıdır. Napoli'den Circumvesuviana/Campania Express veya feribotla ulaşıp SITA otobüsü/deniz hattına geçilir. Sorrento–Positano otobüsünde yaz sırası ve valiz alanı sorun olabilir; kısa aktarmalı son sefer yerine gecikme payı bırakın.",
        "Özel transfer kapıdan kapıya en kolay fakat pahalıdır. Fiyatın araç başı toplamını, bagajı, gece/bekleme ekini ve otelin yaya bölgesinde nerede bırakacağını yazılı alın. 'Positano transferi' otel kapısına erişim garantisi değildir; son basamaklarda hamal gerekebilir.",
      ],
    },
    {
      heading: "Feribot mu SITA otobüsü mü? Kıyı ulaşımının gerçekleri",
      id: "feribot-ve-otobus",
      body: [
        "Travelmar ve diğer işletmeler Salerno, Amalfi, Positano ve bazı kıyı durakları arasında deniz seferleri sunar. Hatlar mevsimsel, hava/deniz durumuna bağlı ve işletmeye göre farklıdır. Bilette liman, işletme ve bagaj koşulunu okuyun. Travelmar'ın güncel FAQ'sına göre Salerno–Positano biletiyle Amalfi'de inip sonraki tekneye devam edemezsiniz; iki ayrı etap bileti gerekir.",
        "Feribot manzaralı ve trafikten bağımsızdır ama her kasabaya gitmez: Ravello, Agerola ve iç/yüksek yerleşimler için otobüs/taksi gerekir. Yüksek dalga veya teknik iptal gününde otobüs kuyruğu büyür. Seferinizi aynı gün resmî operatörden kontrol edin ve son tekneyi uçuş bağlantısına bağlamayın.",
        "SITA otobüsleri yıl boyu omurgadır; bilet çoğunlukla binmeden önce tabacchi, yetkili gişe veya geçerli uygulamadan alınır. Şoförün her zaman bilet satacağını varsaymayın ve bileti gerekiyorsa doğrulatın. Hat numarası/yön, durak tarafı ve son seferi SITA Sud/UnicoCampania'dan güncel kontrol edin.",
        "Yoğun sezonda otobüs dolu geçebilir; kuyrukta olmak bir sonraki araca kesin binmek demek değildir. Amalfi ve Sorrento terminal başlangıçları ara duraktan daha avantajlıdır. Virajda ayakta yolculuk hareket tutmasını artırabilir; önceden uygun ilaç için sağlık profesyoneline danışın, ağır kahvaltıdan kaçının.",
        "Kiralık scooter kestirme çözüm değildir. Dar SS163, otobüsler, kör viraj, yaz trafiği ve sınırlı park deneyimli sürücüyü bile zorlar. Motosiklet sınıfı ehliyet/IDP ve sigorta olmadan kiralayıcının anahtar vermesi yasal/güvenli olduğunuz anlamına gelmez.",
      ],
    },
    {
      heading: "Positano ve Praiano: manzara, basamak ve plaj lojistiği",
      id: "positano-praiano",
      body: [
        "Positano'ya denizden yaklaşmak dikey yerleşimi en iyi gösterir. Spiaggia Grande ana merkez, Fornillo daha sakin yürüyüş bağlantılı plajdır; yazın şezlong ve restoran rezervasyonu gerekebilir. Ücretsiz plaj alanı ile özel lido girişini, soyunma/duş ve tekne iskelesini ayırın.",
        "Kasabayı aşağıdan yukarıya plansız yürümek öğle sıcağında yüzlerce basamak demektir. Otobüs durağınızı haritada işaretleyin; Chiesa Nuova/üst yol ve Sponda/merkez yönünü karıştırmayın. Bagajla toplu taşımadan otele son geçiş için tesisin önerisini alın.",
        "Praiano, Gavitella tarafında batı gün batımı ve Marina di Praia çevresinde küçük koy atmosferi sunar. Ancak iki taraf arasında ana yol, basamak ve yerel otobüs gerekir. 'Denize sıfır' tesisin oda–plaj arasında çok merdiveni olabilir.",
        "Fiordo di Furore fotoğrafta plaj gibi görünür; SS163 üzerindeki köprü ve merdiven erişimi güvenlik/çalışma nedeniyle değişebilir. Yol kenarında gelişigüzel inip virajda yürümeyin. Resmî belediye/ulaşım erişimini o gün kontrol edin.",
      ],
    },
    {
      heading: "Amalfi, Atrani ve Ravello: kıyının tarih merkezi",
      id: "amalfi-ravello",
      body: [
        "Amalfi eski deniz cumhuriyetidir; Duomo kompleksi, Chiostro del Paradiso ve Museo della Carta kentin deniz ticareti/kâğıt tarihini açar. Ana meydan tur otobüsleriyle dolar; erken başlayıp Valle delle Ferriere yönünde iç vadiye ilerlemek kalabalığı düşürür. Yürüyüş parkuru erişimini hava ve resmî duyurudan doğrulayın.",
        "Atrani, Amalfi'den tünel/yaya bağlantısıyla yaklaşık kısa bir yürüyüş mesafesindedir fakat yol/merdiven seçimi önemlidir. Küçük meydan ve plajda konut hayatına saygı gösterin; yalnız 'İtalya'nın en küçük kasabası' fotoğraf etiketi olarak tüketmeyin.",
        "Ravello'ya Amalfi'den otobüs/taksi ile çıkılır. Villa Rufolo ve Villa Cimbrone farklı bahçeler, biletler ve kapanış saatleri sunar; yalnız Terrazza dell'Infinito fotoğrafına yetişmek için ikisini yarım gezmeyin. Ravello Festival günleri trafik, bilet ve akşam dönüşünü değiştirir.",
        "Ravello'da gecelerseniz gün batımı sonrası sakinliği kazanır, deniz bağlantısını kaybedersiniz. Günübirlikseniz dönüş otobüsü kuyruğunu son ana bırakmayın; dolu araç durumunda taksi alternatifi pahalı olabilir.",
      ],
    },
    {
      heading: "Minori, Maiori, Cetara ve Vietri: kalabalığın doğusuna geçmek",
      id: "dogu-kiyisi",
      body: [
        "Minori, Roma villası, pastane geleneği ve Sentiero dei Limoni başlangıcıyla yemek/tarih durağıdır. Maiori daha uzun, görece düz plajı ve geniş merkez yapısıyla çocuklu aile veya basamak azaltmak isteyen için daha rahattır. İki kasaba limon patikasıyla bağlanır; sıcak, basamak ve ayakkabı gerektirir.",
        "Cetara ton balığı, hamsi ve **colatura di alici** geleneğiyle kıyının en belirgin yemek kimliklerinden birine sahiptir. Şişeyi hediyelik sos sanıp rastgele kullanmak yerine üretim, tuzluluk ve makarnada birkaç damlayla kullanımını yerel dükkândan öğrenin.",
        "Vietri sul Mare seramik üretimi ve Salerno'ya yakınlığıyla rotanın doğu kapısıdır. Her renkli tabak yerel elde üretim değildir; atölye, üretici damgası ve taşıma/paketlemeyi sorun. İstasyondan merkez/kıyı eğimini kontrol edin.",
        "Bu doğu hattını Positano'dan aynı güne gidip gelmek yerine Amalfi veya Salerno üssünden planlamak daha verimlidir. Deniz seferi olan gün Cetara–Vietri; iptal gününde kara otobüsü alternatifini kurun.",
      ],
    },
    {
      heading: "Sentiero degli Dei ve kıyıda yürüyüş",
      id: "yuruyus",
      body: [
        "Sentiero degli Dei'nin yaygın rotası Agerola/Bomerano'dan Nocelle yönüne yüksekten ilerler. Positano plajından başlayan düz sahil yolu değildir; başlangıca otobüs/transfer ve Nocelle'den Positano'ya çok sayıda basamak veya yerel otobüs gerekir. Ulaşımı parkur kadar ayrıntılı planlayın.",
        "Parkur açık gökyüzü, taşlık zemin ve kenar bölümleri içerir. Yaz öğleninde, terlikte veya yetersiz suyla yürümeyin. Yağmur, sis, yangın riski ya da bakım erişimi etkileyebilir; belediye/yerel parkur duyurusunu aynı gün kontrol edin. Yükseklik korkusu ve diz sorunu olan için kısa alternatif yürüyüş seçin.",
        "Valle delle Ferriere, limon patikaları ve Ravello–Atrani merdiven rotaları farklı zorlukta seçeneklerdir. Özel doğa rezervi bölümlerine rehber/izin gerekebilir. Çiftlik/limon turunda ürün tadımı kadar gerçek yürüyüş mesafesi ve dönüş ulaşımını sorun.",
        "Gün batımı yürüyüşünü son otobüsle bağlamak risklidir. Çevrimdışı harita, su, şapka, tutuşlu ayakkabı ve şarj taşıyın; uçurum kenarında drone uçurmayı yalnız boş alan olduğu için yasal sanmayın.",
      ],
    },
    {
      heading: "Amalfi Kıyısı'nda ne yenir? Limon, colatura ve deniz",
      id: "ne-yenir",
      body: [
        "Sfusato Amalfitano limonu yalnız limoncello değildir; delizia al limone, granita, salata ve deniz ürünlerinde kullanılır. Yol kenarındaki her sarı şişe yerel üretim değildir; üretici, alkol oranı, saklama ve uçuş bagaj kuralını okuyun.",
        "Scialatielli ai frutti di mare, totani e patate (Praiano), ndunderi (Minori), hamsi ve colatura (Cetara) kasaba özgüllüğünü taşır. Balık menüsünde günlük ürün/kilo fiyatı, servis ve copertoyu siparişten önce netleştirin. Manzara masası iyi mutfak garantisi değildir.",
        "Plaj restoranı veya yalnız tekneyle erişilen işletmede rezervasyon ulaşımı da kapsamayabilir. Gidiş/dönüş teknesi, son saat, hava iptali ve minimum harcamayı yazılı sorun. Ücretsiz servis teknesinin sizi başka limana bırakacağını varsaymayın.",
        "Minori'de ricotta e pera, delizia al limone ve pasticceria geleneği; Tramonti'de pizza/şarap; Agerola'da fior di latte/provolone kıyının yalnız deniz ürününden ibaret olmadığını gösterir. Bir günde her kasabanın tatlısını toplamak yerine rota ile eşleyin.",
      ],
    },
    {
      heading: "Araç, ZTL, park ve bütçe tuzakları",
      id: "arac-ve-butce",
      body: [
        "Kıyıda araç özgürlük kadar park ve trafik yüküdür. Belediyelerin ZTL, yaya alanı ve plaka denetimleri farklıdır; Amalfi 2026'da tarihî merkez ZTL izin sistemini yenilemiştir. Otel parkı 'yakında ücretli garaj' anlamına gelebilir. Plaka kaydı, günlük ücret, anahtar teslimi ve otele bagaj transferini yazılı sorun.",
        "SS163 için yoğun dönem trafik/plaka düzenlemeleri yıl ve tarihe göre değişebilir. Eski blogdaki tek/çift plaka takvimine güvenmeyin; ANAS, belediye ve yerel polis duyurusunu seyahat haftasında kontrol edin. Uluslararası sürücü belgesi gereksinimi ve kiralama sigortasını da resmî kaynaktan doğrulayın.",
        "Konaklamada oda manzarası, özel plaj erişimi, şezlong, vale/hamal ve belediye vergisi ayrı kalem olabilir. 'Beach access' ücretsiz lido seti demek değildir. Rezervasyon toplamında merdiven/transfer maliyetini oda fiyatıyla birlikte değerlendirin.",
        "Kart otel ve yüksek segment restoranda yaygın; otobüs bileti, küçük tekne, pazar ve bahşiş için nakit gerekir. ATM'nin kur dönüşüm teklifinde hesabın EUR olarak kesilmesini seçmek genellikle daha şeffaftır; makinenin sabit yabancı kart ücretini onaydan önce okuyun.",
      ],
    },
  ],

  places: [
    {
      name: "Trattoria da Gemma",
      area: "Amalfi",
      known: "1872'den beri Amalfi ve Campania mutfağı",
      why:
        "Duomo çevresinde scialatielli, yerel balık ve limonlu tatları tarihî bir şehir restoranında toplamak için güvenilir merkez seçeneğidir.",
      price: "Yüksek",
      tip: "Capri'deki aynı adlı işletmeyle karıştırmayın; trattoriadagemma.com adresindeki Amalfi konumundan rezervasyon yapın.",
    },
    {
      name: "La Tagliata",
      area: "Montepertuso / Positano üstü",
      known: "Çiftlik ürünleri, ızgara et ve manzara",
      why:
        "Kıyının yalnız balık olmadığını; dağ tarafındaki sebze, makarna ve et sofrasını Positano'nun yukarıdan görünümüyle gösterir.",
      price: "Orta",
      tip: "Via Tagliata 32B adresini, sabit/degüstasyon menüyü ve ulaşım servisinin gerçekten dâhil olup olmadığını doğrulayın.",
    },
    {
      name: "Al Convento – Casa Torrente",
      area: "Cetara",
      known: "Hamsi, ton balığı ve colatura",
      why:
        "Cetara'nın balıkçılık kimliğini colatura, ton balığı ve geleneksel deniz tarifleri üzerinden en kapsamlı anlatan masalardan biridir.",
      price: "Orta",
      tip: "Piazza San Francesco 16 adresini ve 2026 menü/isim düzenini resmî siteden kontrol edin; rezervasyon yapın.",
    },
    {
      name: "Sal De Riso Costa d'Amalfi",
      area: "Minori",
      known: "Delizia al limone ve ricotta e pera",
      why:
        "Minori'nin pastacılık kimliğini, kıyı limonu ve Campania malzemeleri üzerinden geniş bir tatlı seçkisiyle deneyimletir.",
      price: "Orta",
      tip: "Ristorante/bistrot ile pastane sipariş düzeni farklı olabilir; yoğun saatte paket ve masa kuyruğunu ayırın.",
    },
    {
      name: "Cumpà Cosimo",
      area: "Ravello",
      known: "Ev usulü makarna ve Ravello trattoriası",
      why:
        "Bahçe ziyaretleri arasında gösterişsiz, doyurucu Campania yemekleriyle Ravello'nun otel terası dışındaki yüzünü sunar.",
      price: "Orta",
      tip: "Açık gün ve masa için önceden arayın; son Amalfi otobüsüne yakın saate uzun öğün koymayın.",
    },
    {
      name: "Acqua Pazza",
      area: "Cetara",
      known: "Yerel balık ve Cetara makarnaları",
      why:
        "Colatura ve günlük deniz ürününü küçük balıkçı limanı bağlamında tatmak, Positano manzara restoranına anlamlı karşıtlık sunar.",
      price: "Yüksek",
      tip: "Günlük balık/kilo fiyatını sorun; feribot veya otobüs dönüşünden önce yeterli servis süresi bırakın.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — Amalfi ve Atrani",
      morning:
        "Amalfi Duomo ve kıyı tarihini erken görün; Museo della Carta'nın güncel erişimi uygunsa iç vadiye yürüyün.",
      afternoon:
        "Amalfi'de öğle ve doğru yaya bağlantısıyla Atrani; plaj veya küçük meydanda yavaşlama.",
      evening:
        "Günübirlik kalabalık çekilince Amalfi'de passeggiata ve rezervasyonlu yerel akşam yemeği.",
    },
    {
      title: "2. Gün — Positano ve Praiano",
      morning:
        "Erken feribotla Positano; merkez, Fornillo yürüyüşü ve üst duraklara çıkış planı.",
      afternoon:
        "Yerel otobüs/taksiyle Praiano; Marina di Praia veya Gavitella'dan yalnız birini seçin.",
      evening:
        "Praiano gün batımı; son otobüs/transferi yemek öncesinde kesinleştirin.",
    },
    {
      title: "3. Gün — Ravello",
      morning:
        "Amalfi'den erken otobüs; Villa Rufolo ve meydan çevresi.",
      afternoon:
        "Uzun öğle yemeği ve Villa Cimbrone; iki bahçeyi kapanışa koşmadan gezin.",
      evening:
        "Ravello'da kalıyorsanız sakin akşam; kalmıyorsanız dönüş kuyruğuna erken girin.",
    },
    {
      title: "4. Gün — Yürüyüş veya deniz",
      morning:
        "Hava ve kondisyon uygunsa Bomerano başlangıçlı Sentiero degli Dei; değilse küçük grup tekne günü.",
      afternoon:
        "Nocelle'den otobüs/basamak kararı veya tekne programında yüzme; son dönüşü uçuşa bağlamayın.",
      evening:
        "Üssünüzde hafif akşam; hava iptalinde ertesi güne esneklik bırakın.",
    },
    {
      title: "5. Gün — Minori, Maiori ve Cetara",
      morning:
        "Minori Roma villası ve pastane; hava serinse Limon Yolu'nun uygun bölümü.",
      afternoon:
        "Maiori sahili, ardından deniz/otobüsle Cetara ve colatura odaklı öğle/erken akşam.",
      evening:
        "Amalfi veya Salerno'ya son seferden önce dönün; ertesi transferin iskele/durak adını doğrulayın.",
    },
  ],

  practicalHeading: "Amalfi Kıyısı'nda tatili kurtaran lojistik ayrıntılar",
  practicalTips: [
    {
      title: "Üssü görsele göre değil ulaşıma göre seçin",
      body: "Positano manzaralı ama merdivenli/pahalı; Amalfi aktarma merkezi; Ravello denizden yukarıda; Maiori daha düzdür.",
    },
    {
      title: "Feribot bileti hop-on hop-off değildir",
      body: "Aynı hatta ara kasabada inip sonraki tekneye devam için ayrı etap gerekebilir. İşletme, liman ve bagaj koşulunu okuyun.",
    },
    {
      title: "SITA biletini binmeden alın",
      body: "Tabacchi/gişe veya geçerli uygulamadan biletinizi hazırlayın; şoförün satış yapacağını varsaymayın ve doğrulama kuralını izleyin.",
    },
    {
      title: "Otele kaç basamak olduğunu sorun",
      body: "Metre olarak yakınlık dikey kıyıda yanıltır. Liman/durak–resepsiyon arasında merdiven ve hamal ücretini önceden öğrenin.",
    },
    {
      title: "Son tekneyi uçuşa bağlamayın",
      body: "Rüzgâr veya deniz nedeniyle iptal olabilir. Uluslararası uçuş öncesi geceyi Napoli/Salerno gibi güvenli bağlantı noktasında düşünün.",
    },
    {
      title: "Plaj erişimi şezlong dâhil demek değildir",
      body: "Lido rezervasyonu, set fiyatı, minimum harcama, duş ve ulaşım teknesini ayrı ayrı sorun.",
    },
  ],

  faqs: [
    {
      q: "Amalfi Kıyısı için kaç gün gerekir?",
      a: "İlk gezi için 4–5 gece önerilir. Positano, Amalfi/Atrani, Ravello ve bir yürüyüş/deniz gününü ayrı planlayın.",
    },
    {
      q: "Amalfi Kıyısı'nda nerede kalınır?",
      a: "Araçsız lojistik için Amalfi, ikonik manzara için Positano, sakinlik için Praiano/Ravello, daha düz plaj ve bütçe dengesi için Maiori/Minori uygundur.",
    },
    {
      q: "Napoli'den Amalfi Kıyısı'na nasıl gidilir?",
      a: "Üsse göre Sorrento veya Salerno kapısını seçin. Amalfi/doğu kıyısı için Salerno treni + mevsimsel feribot/otobüs çoğu zaman daha doğrudur.",
    },
    {
      q: "Amalfi Kıyısı'nda araba kiralamak gerekir mi?",
      a: "Hayır. Feribot ve otobüsle gezilebilir. Araç esneklik verir ama SS163 trafiği, ZTL, sınırlı ve pahalı park ciddi dezavantajdır.",
    },
    {
      q: "Feribotlar yıl boyu çalışır mı?",
      a: "Birçok kıyı hattı mevsimseldir ve hava/deniz durumuna bağlıdır. Güncel operatör tarifesini kontrol edin ve kara B planı tutun.",
    },
    {
      q: "Sentiero degli Dei nereden başlar?",
      a: "Yaygın yüksek rota Agerola'nın Bomerano bölgesinden Nocelle yönüne gider. Başlangıç transferi ve Nocelle'den iniş/otobüs planı gerekir.",
    },
  ],

  relatedGuides: [
    {
      city: "Napoli",
      anchor: "Amalfi Kıyısı'ndan Napoli'ye: pizza ve arkeoloji ayağı",
      description: "Feribot/otobüs sonrası Napoli'de en az üç gün kalın; Pompeii'yi şehir günlerinin yerine koymayın.",
    },
    {
      city: "Roma",
      anchor: "Amalfi Kıyısı'ndan Roma'ya: Salerno veya Napoli aktarması",
      description: "Son kıyı transferini hızlı trenden geniş payla ayırın; Roma'da Kolezyum ve Vatikan'ı ayrı günlere bölün.",
    },
    {
      city: "Floransa",
      anchor: "Amalfi Kıyısı'ndan Floransa'ya: denizden Rönesans'a",
      description: "Salerno/Napoli hızlı treni sonrası SMN'ye geçin; Uffizi ve Duomo biletlerini kıyıdayken alın.",
    },
    {
      city: "Milano",
      anchor: "Amalfi Kıyısı'ndan Milano'ya: uzun tren veya uçuş",
      description: "Kıyıdan NAP/QSR transferini ve Milano'daki MXP–LIN–BGY farkını toplam süreyle karşılaştırın.",
    },
    {
      city: "Venedik",
      anchor: "Amalfi Kıyısı'ndan Venedik'e: iki su kentini bağlamak",
      description: "Uzun transferden sonra Santa Lucia'da bitirin; Venedik vaporetto ve 2026 QR düzenini önceden hazırlayın.",
    },
  ],

  sources: [
    { name: "Italia.it — Amalfi Kıyısı", url: "https://www.italia.it/en/campania/costiera-amalfitana" },
    { name: "Travelmar — resmî tarifeler", url: "https://www.travelmar.it/en/" },
    { name: "Travelmar — sık sorulan sorular", url: "https://italo.travelmar.it/en/faq" },
    { name: "Napoli Airport — kıyı otobüs bağlantıları", url: "https://www.aeroportodinapoli.it/en/by-bus" },
    { name: "Comune di Amalfi — 2026 ZTL sistemi", url: "https://comune.amalfi.sa.it/Novita/Comunicati/Transito-lungo-il-centro-storico-nuovi-contrassegni-dal-1-gennaio-2026" },
    { name: "Visit Cetara — restoranlar", url: "https://www.visitcetara.com/restaurants/" },
    { name: "Trattoria da Gemma — resmî site", url: "https://trattoriadagemma.com/" },
    { name: "La Tagliata — resmî site", url: "https://www.latagliata.com/" },
  ],

  volatileNote:
    "Feribot ve SITA tarifeleri, plaj/parkur erişimi, SS163 trafik düzeni, ZTL, müze/villa saatleri ve mevsimsel restoranlar değişebilir. Her bağlantıyı resmî operatör ve belediyeden seyahat gününde doğrulayın.",
  reviewed: "2026-08-10",
};

import { CityGuide } from "./types";

/** Roma rehberi — Ağustos 2026 araştırması. */
export const roma: CityGuide = {
  city: "Roma",
  countryCode: "IT",

  seoTitle: "Roma Gezi Rehberi: Ulaşım, Biletler ve 5 Günlük Rota",
  seoDescription:
    "Roma gezi rehberi: Fiumicino ulaşımı, Kolezyum ve Vatikan biletleri, kalınacak semtler, Roma yemekleri, gerçekçi 5 günlük rota ve pratik ipuçları.",
  h1: "Roma Gezi Rehberi",
  lede:
    "Roma, görülecek yerleri işaretleyerek değil tarih katmanlarını semt semt okuyarak gezilir; antik kent, papalık mirası ve yaşayan mahalleleri aynı güne sıkıştırmazsanız Ebedî Şehir yorucu bir dekor olmaktan çıkar.",

  quickFacts: [
    { label: "Önerilen süre", value: "4–5 tam gün" },
    { label: "Havalimanları", value: "FCO · CIA" },
    { label: "Şehir içi", value: "Yürüyüş + metro + otobüs/tramvay" },
    { label: "Rezervasyon", value: "Kolezyum · Vatikan Müzeleri · Borghese" },
    { label: "Yerel tat", value: "Dört Roma makarnası + supplì" },
  ],

  sections: [
    {
      heading: "Roma'yı planlamak: anıt listesi değil, coğrafi kümeler",
      id: "sehri-planlamak",
      body: [
        "Roma'nın tarihî merkezi haritada kompakt görünür; bazalt taşlar, sıcak, kalabalık ve müze girişleri mesafeyi büyütür. İlk yolculukta dört ana küme kurun: Kolezyum–Forum–Palatino; Pantheon–Navona–Trevi; Vatikan–Prati; Trastevere–Testaccio. Villa Borghese, Appia Antica veya çağdaş mahalleleri kalan zamana göre ayrı yarım gün yapın.",
        "Kolezyum ile Vatikan Müzeleri'ni aynı güne koymak teknik olarak mümkün, deneyim olarak zayıftır. Her ikisi de zamanlı giriş, güvenlik sırası ve uzun yürüyüş ister. Sabah bir büyük rezervasyon, öğleden sonra ona yakın açık alanlar kuralı hem gecikme riskini hem de 'her şeyi gördüm ama hiçbir şeyi anlamadım' hissini azaltır.",
        "Dört gün çekirdek için yeterli, beşinci gün Borghese Galerisi, Appia Antica veya Ostia Antica'ya alan açar. Roma'yı Floransa'ya geçmeden önce iki geceye sıkıştırmak istiyorsanız Vatikan ya da antik Roma'dan birini bilinçli seçin; ikisini yarım görmek daha iyi bir gezi değildir.",
      ],
    },
    {
      heading: "Fiumicino ve Ciampino'dan Roma merkezine ulaşım",
      id: "havalimani-ulasimi",
      body: [
        "Fiumicino (FCO) ana uluslararası kapıdır. **Leonardo Express** aktarmasız Roma Termini'ye gider; biletiniz Termini çevresiyse en basit seçenektir. **FL1 bölgesel treni Termini'ye gitmez**: Trastevere, Ostiense ve Tiburtina gibi istasyonlara uğrar. Oteliniz Trastevere, Testaccio veya metro B hattı yakınındaysa FL1 daha mantıklı olabilir. Hangi terminalden geldiğinizi ve güncel peronu Aeroporti di Roma ile Trenitalia'dan kontrol edin.",
        "Ciampino (CIA) daha küçük ve düşük maliyetli uçuşlarda sık görülür. Merkeze doğrudan raylı hat yoktur; Termini otobüsü, yerel otobüs + metro/tren veya resmî taksi seçeneklerini karşılaştırın. Geç saatte yalnız bilet fiyatına bakmayın: otobüsün bırakacağı Termini'den otele son bağlantı ve valizle yürüyüş de toplam maliyettir.",
        "Roma Belediyesi belirli havalimanı–Aurelian Surları içi taksi güzergâhları için sabit tarife yayımlar; yalnız resmî sıradaki beyaz taksiyi kullanın, varış salonunda yaklaşan kişilere gitmeyin. Oteliniz sabit tarife alanının dışındaysa taksimetre veya farklı tarife uygulanabilir. Yolculuk öncesi adresi gösterip kapsamı sorun ve kartla ödeme isteğinizi binmeden belirtin.",
        "Bölgesel trenin kâğıt biletini binmeden doğrulatın. Trenitalia'nın güncel Dijital Bölgesel Bileti tarifeli kalkışta otomatik doğrulanır; yine de bilet ekranındaki talimatı esas alın ve kimlik taşıyın. Leonardo Express bileti ile şehir içi metroya devam hakkını varsaymayın.",
      ],
    },
    {
      heading: "Roma'da ulaşım: Tap&Go, aktarma ve yürüyüş gerçeği",
      id: "sehir-ici-ulasim",
      body: [
        "ATAC'ın metro, otobüs, tramvay ve şehir içi ağında temassız **Tap&Go** kullanılabilir. Aynı kartı veya aynı telefonu yolculuk boyunca kullanın; fiziksel kartla girip telefon cüzdanıyla devam etmek sistemde iki araç sayılabilir. Metroda girişte, yüzey hatlarında binişte ve aktarmalarda tekrar dokundurun. Bir banka kartı aynı anda yalnız bir yolcunun bileti olur; yanınızdaki kişi kendi kartını ya da ayrı biletini kullanmalıdır.",
        "Kâğıt veya uygulama bileti alırsanız ilk kullanım ve aktarma doğrulama kuralını bilet tipine göre izleyin. Otobüse bilet almadan binip şoförden satın almayı beklemeyin. Kontrolde temassız kullandıysanız ödeme yaptığınız kartı/cihazı gösterirsiniz; banka ekstresindeki gecikmeli toplu provizyon tek başına yeni bir yolculuk değildir.",
        "Metro hızlıdır fakat tarihî merkezin her köşesine ulaşmaz. Trevi, Pantheon ve Navona günü yürüyüş ağırlıklıdır; otobüsler trafik ve gösterilerden etkilenebilir. Google Maps yararlı olsa da ATAC'ın resmî servis duyurusunu özellikle akşam, grev ve bakım günlerinde kontrol edin. Son metro saatini ezberlemek yerine seyahat gününde doğrulayın.",
        "Merkezde araç kiralamayın. Kamera denetimli **ZTL** saatleri bölgeye göre değişir; otel rezervasyonu otomatik giriş izni değildir. Garaj veya otel plakanızı yetkili sisteme kaydedeceğini açıkça doğrulamıyorsa tabelayı geçmeyin. Appia Antica için dahi toplu taşıma, bisiklet turu veya kısa taksi çoğu ziyaretçiye daha kolaydır.",
      ],
    },
    {
      heading: "Kolezyum, Forum ve Palatino: doğru biletle antik Roma",
      id: "antik-roma",
      body: [
        "Kolezyum için zamanlı rezervasyon zorunludur. Parco archeologico del Colosseo'nun resmî satış kanalı **ticketing.colosseo.it** üzerinden normal biletler çoğunlukla ziyaretten 30 gün önce açılır; biletler isimlidir ve girişte kimlik istenebilir. Benzer isimli reklam sitelerinin yüksek fiyatlı paketini resmî bilet sanmayın.",
        "Bilet türü önemlidir: standart arena manzarası, arena zemini, yeraltı alanı ve SUPER alanları aynı erişimi vermez. 'Full Experience' yazdığı için her bölümün dâhil olduğunu varsaymayın; satın alma ekranındaki alan listesini okuyun. İsim değişikliği ve giriş saati toleransı sınırlıdır, Roma'ya ineceğiniz sabaha rezervasyon koymayın.",
        "Forum ile Palatino tek bir fotoğraf molası değil geniş bir arkeolojik peyzajdır. Kolezyumdan sonra en az iki–üç saat, su ve güneş koruması ayırın. Forum girişleri ve tek yönlü geçişler bakım/güvenlik nedeniyle değişebilir; ilk gördüğünüz uzun kuyruğa girmeden biletinizdeki girişleri haritada açın.",
        "Capitoline Tepesi ve Campidoglio'yu antik günün sonuna eklemek coğrafi olarak doğrudur. Capitoline Müzeleri için enerji kalmadıysa Michelangelo'nun meydanı ve Forum manzaralı arka terasla yetinip müzeyi başka güne taşıyın.",
      ],
    },
    {
      heading: "Vatikan günü: resmî bilet, doğru sıra ve gerçekçi tempo",
      id: "vatikan",
      body: [
        "Vatikan Müzeleri'nin tek resmî çevrimiçi bilet alanı **tickets.museivaticani.va** alan adıdır. Kurum, benzer alan adları ve yetkisiz satıcılar için açıkça uyarır. Saatli bileti önceden alın; müze rotası Sistina Şapeli'ne uzanan büyük bir koleksiyondur, yalnız şapele gidip çıkılan kısa bir koridor değildir.",
        "Aziz Petrus Bazilikası ayrı giriş ve güvenlik sırasına sahiptir; Vatikan Müzeleri bileti bazilikaya kuyruksuz geçiş sağlamaz. Kubbe erişimi, ayinler ve özel kutlamalar gün içinde değişebilir. Müzeyi sabaha, bazilikayı çok erken başka sabaha koymak çoğu gezgin için tek güne sıkıştırmaktan daha sakindir.",
        "Omuz ve dizleri örten kıyafet hem müze hem ibadet alanı için güvenli seçimdir. Büyük çanta ve yasaklı eşya nedeniyle emanet sırasına düşmemek için hafif gidin. Prati'de öğle yemeğini müze kapısındaki fotoğraflı menü yerine birkaç sokak içeride planlayın.",
        "Papalık genel kabulü ve litürjik takvim, meydan erişimini ve bazilika saatlerini etkileyebilir. Çarşamba veya büyük dinî bayramı sıradan gün gibi planlamadan Vatikan'ın resmî takvimini kontrol edin.",
      ],
    },
    {
      heading: "Pantheon, Trevi ve tarihî merkez nasıl gezilir?",
      id: "tarihi-merkez",
      body: [
        "Pantheon artık biletli bir devlet müzesidir; resmî Musei Italiani kanalı ve yerindeki gişe seçeneklerini kullanın. İbadet ve özel etkinliklerde ziyaret düzeni değişebilir. Yağmurun oculustan içeri girmesi yapının çalışma mantığının parçasıdır; zemindeki drenaj çevresinde kayganlığa dikkat edin.",
        "Piazza Navona–Pantheon–Campo de' Fiori–Yahudi Gettosu aynı yürüyüşe doğal bağlanır. Trevi Çeşmesi ise en erken saat veya geç akşam daha okunaklıdır; gündüz kalabalığında telefon ve çanta kontrolünü gevşetmeyin. Basamakta yemek, çeşmeye girme veya anıta dokunma gibi davranışları sosyal medya görüntüsü diye normal sanmayın; yerel işaret ve görevli talimatını izleyin.",
        "Borghese Galerisi sınırlı kapasiteli zamanlı rezervasyonla çalışır; parkta olduğunuz için spontane girileceğini varsaymayın. Caravaggio ve Bernini odalarını acele etmeden görmek istiyorsanız bilet açılışını resmî kanaldan takip edin ve çanta kuralını okuyun.",
        "İspanyol Merdivenleri'ni konaklama merkeziniz yapmak ulaşım açısından cazip, fiyat ve kalabalık açısından ağır olabilir. Meydanların en iyi hâli, tur gruplarından önce yapılan bir sabah yürüyüşüdür; öğleden sonrayı müze veya Trastevere'nin iç sokaklarına bırakın.",
      ],
    },
    {
      heading: "Roma'da nerede kalınır? Semt seçimi geziyi değiştirir",
      id: "nerede-kalinir",
      body: [
        "**Centro Storico** ilk ziyarette yürüyüş avantajı verir; Pantheon ve Navona çevresi pahalı, gürültülü ve araç erişimi zordur. **Monti**, Kolezyum ile Termini arasında restoran ve metro erişimi sunar; sokak bazında gece sesi değişir. **Prati**, Vatikan'a yakın, daha düzenli ve metro A ile pratiktir; antik Roma tarafına her gün geçiş gerekir.",
        "**Trastevere** akşam atmosferi için güçlüdür fakat dar sokaklardaki oda bar/kalabalık sesi alabilir; tramvay ve otobüs bağlantısı vardır, metro yoktur. **Testaccio** Roma mutfağı, pazar ve yerel gece için iyi; turistik merkezden biraz uzaktır ama Piramide/Ostiense bağlantısı kullanışlıdır.",
        "**Termini** çevresi erken tren ve bütçe için işlevseldir, tek bir karakter taşımaz. Via Gioberti, Monti'ye yakın bloklar ve istasyonun farklı cepheleri arasında büyük fark vardır; yalnız 'Termini' etiketine değil gece dönüş güzergâhına ve güncel yorumlara bakın. Valizli son 500 metreyi Street View ile kontrol edin.",
        "Otel fiyatına belediye konaklama vergisi eklenebilir; tutar tesis türü, sınıf ve gece sayısına göre değişir. Rezervasyondaki vergi satırını ve tesiste hangi ödeme biçiminin kabul edildiğini önceden sorun. Eski blogdaki sabit tutarı bütçeye yazmayın.",
      ],
    },
    {
      heading: "Roma'da ne yenir? Dört makarna ve mahalle mutfağı",
      id: "ne-yenir",
      body: [
        "Roma'nın dört temel makarnası aynı yemeğin varyasyonu değildir: cacio e pepe peynir–karabiber emülsiyonu; gricia guanciale–pecorino; amatriciana bunlara domates; carbonara yumurta, pecorino ve guanciale dengesi üzerine kurulur. Krema geleneksel carbonaranın ölçütü değildir. Aynı öğünde dört tabak söylemek yerine semte göre farklı günlerde karşılaştırın.",
        "Supplì hızlı atıştırmalık; pizza al taglio çoğunlukla ağırlıkla kesilen gündüz yemeğidir. Mevsiminde carciofi alla romana veya alla giudia; Testaccio'da coda alla vaccinara, trippa ve quinto quarto mutfağı Roma'nın işçi sınıfı tarihini anlatır. Tuzlu pecorino ve guanciale yoğunluğu nedeniyle porsiyonları paylaşmak akıllıcadır.",
        "Menüde **coperto** masa/ekmek örtü bedeli olarak, **servizio** hizmet ücreti olarak ayrı görünebilir; ikisi bahşişle aynı şey değildir. Siparişten önce menünün altını okuyun. Hizmet ücreti yoksa iyi serviste küçük bir yuvarlama veya nakit bahşiş tercihtir, ABD tipi zorunlu yüzde beklemeyin.",
        "Barda espressoyu ayakta içmek ile masaya servis fiyatı farklı olabilir. Meydanın ön sırasındaki manzara bedeli sürpriz olmasın diye oturmadan menü isteyin. Ücretsiz akan 'nasoni' çeşmelerinde içilmez işareti yoksa su içilebilir; şişeyi doğrudan musluğa değdirmeden doldurun.",
      ],
    },
  ],

  places: [
    {
      name: "Armando al Pantheon",
      area: "Pantheon",
      known: "Klasik Roma mutfağı",
      why:
        "Turistik merkezin tam ortasında olmasına rağmen gricia, amatriciana ve sakatat geleneğini aile trattoria çizgisinde görmek için güçlü bir referans.",
      price: "Orta",
      tip: "Kapasite küçüktür; yalnız resmî rezervasyon kanalını kullanın ve açık günü kontrol edin.",
    },
    {
      name: "Roscioli Salumeria con Cucina",
      area: "Campo de' Fiori",
      known: "Peynir/şarküteri ve Roma makarnaları",
      why:
        "İyi ürün seçiminin carbonara ve amatriciana üzerindeki etkisini, zengin peynir ve şarap seçkisiyle birlikte deneyimletir.",
      price: "Yüksek",
      tip: "Roscioli Forno ayrı işletme deneyimidir; rezervasyonun hangi adrese ait olduğunu kontrol edin.",
    },
    {
      name: "Cesare al Casaletto",
      area: "Monteverde",
      known: "Mahalle trattoriası ve kızartmalar",
      why:
        "Merkezin dışında, supplì ve gnocchi fritti ile başlayan geniş Roma sofrasını mahalle ritminde denemek için gidilir.",
      price: "Orta",
      tip: "Tramvay/otobüs dönüşünü önceden planlayın; özellikle akşam rezervasyon yapın.",
    },
    {
      name: "Flavio al Velavevodetto",
      area: "Testaccio",
      known: "Testaccio geleneği ve Roma makarnaları",
      why:
        "Monte Testaccio'nun tarihî çevresinde cacio e pepe, carbonara ve coda alla vaccinara ile semtin mutfak kimliğini bir araya getirir.",
      price: "Orta",
      tip: "İç/dış masa beklentisini rezervasyonda belirtin; porsiyonlar yoğun olduğu için başlangıçları paylaşın.",
    },
    {
      name: "Pizzarium Bonci",
      area: "Cipro",
      known: "Ağırlıkla satılan pizza al taglio",
      why:
        "Uzun mayalanmış hamur ve sık değişen malzemelerle Roma'nın dilim değil ağırlık üzerinden çalışan tepsi pizza kültürünü gösterir.",
      price: "Ekonomik",
      tip: "İstediğiniz genişliği gösterin; çalışan kesip tartmadan önce miktarı netleştirin. Yoğun saatte ayakta yenir.",
    },
    {
      name: "Trapizzino Testaccio",
      area: "Testaccio",
      known: "Roma yemekleriyle doldurulan üçgen pizza cebi",
      why:
        "Pollo alla cacciatora, köfte veya dil gibi klasik tencere yemeklerini hızlı ve taşınabilir biçimde tatmak için kullanışlıdır.",
      price: "Ekonomik",
      tip: "Şubeyi ve güncel çalışma saatini kontrol edin; Testaccio pazar/akşam rotasına bağlayın.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — Antik Roma",
      morning:
        "Saatli Kolezyum girişiniz; bilet kapsamına göre arena/yeraltı. Kimliğiniz ve resmî biletiniz hazır olsun.",
      afternoon:
        "Forum ve Palatino'ya geniş zaman ayırın; güneş molasından sonra Campidoglio ve Capitoline manzarası.",
      evening:
        "Monti'de aperitivo ve erken yemek; ilk gün Trevi'ye koşmak yerine enerjiyi koruyun.",
    },
    {
      title: "2. Gün — Pantheon ve meydanlar",
      morning:
        "Trevi ve İspanyol Merdivenleri'ni erken görün; ardından resmî biletli Pantheon.",
      afternoon:
        "Piazza Navona, Campo de' Fiori, Yahudi Gettosu ve Tiber kıyısı yürüyüşü.",
      evening:
        "Trastevere'nin ana aksından ara sokaklara geçin; rezervasyonlu akşam yemeği veya Testaccio.",
    },
    {
      title: "3. Gün — Vatikan ve Prati",
      morning:
        "Vatikan Müzeleri için saatli resmî bilet; koleksiyona en az üç saat ayırın.",
      afternoon:
        "Prati'de öğle molası; enerji ve resmî erişim uygunsa Aziz Petrus Bazilikası ve meydan.",
      evening:
        "Castel Sant'Angelo çevresi ve Ponte Sant'Angelo'dan gün batımı; tarihî merkeze yürüyüş.",
    },
    {
      title: "4. Gün — Borghese, Testaccio ve yaşayan Roma",
      morning:
        "Rezervasyonlu Galleria Borghese; sonra Villa Borghese parkında sakin yürüyüş.",
      afternoon:
        "Testaccio Pazarı, Piramide ve isteğe göre Centrale Montemartini veya Aventino.",
      evening:
        "Testaccio'da klasik Roma yemeği; dönüş için metro/otobüs saatini kontrol edin.",
    },
    {
      title: "5. Gün — Appia Antica veya Ostia Antica",
      morning:
        "Hava uygunsa Appia Antica ve katakomplardan seçili duraklar; erişim günlerini önceden doğrulayın.",
      afternoon:
        "Alternatif olarak ayrı ulaşım planıyla Ostia Antica. İki açık hava arkeoloji alanını aynı güne koymayın.",
      evening:
        "Merkeze dönüp eksik kalan mahallede son passeggiata; ertesi gün tren peronunu kontrol edin.",
    },
  ],

  practicalHeading: "Roma'da sırada ve ulaşımda vakit kaybettirmeyen bilgiler",
  practicalTips: [
    {
      title: "Kolezyum bileti isimlidir",
      body: "Resmî siteden alın, kimlik taşıyın ve bilet kapsamını okuyun. 30 günlük satış penceresi ile isim değişikliği kuralı güncel sayfadan kontrol edilmelidir.",
    },
    {
      title: "Vatikan'ın alan adını doğrulayın",
      body: "Müzelerin resmî bileti tickets.museivaticani.va üzerindedir. Reklam sonucu veya benzer alan adındaki pahalı aracıyı resmî site sanmayın.",
    },
    {
      title: "FCO'da Termini tek seçenek değildir",
      body: "Oteliniz Trastevere, Ostiense veya Tiburtina yönündeyse FL1'i değerlendirin; FL1'in Termini'ye gitmediğini unutmayın.",
    },
    {
      title: "Her yolcu ayrı temassız kart kullanır",
      body: "ATAC Tap&Go'da aynı kart/telefon yalnız bir kişiye çalışır. Fiziksel kart ile onun telefon cüzdanı sürümünü karıştırmayın.",
    },
    {
      title: "ZTL'ye otel var diye girmeyin",
      body: "Plaka kaydını otel veya garajla açıkça teyit etmeden kamera tabelasını geçmeyin; kurallar saat ve bölgeye göre değişir.",
    },
    {
      title: "Coperto ve servizioyu okuyun",
      body: "Masa/ekmek bedeli ile hizmet ücreti bahşiş değildir ama faturada ikisi de bulunabilir. Ek bahşiş bırakmadan önce satırları kontrol edin.",
    },
  ],

  faqs: [
    {
      q: "Roma için kaç gün gerekir?",
      a: "İlk ziyaret için 4 tam gün alt sınır, 5 gün daha dengelidir. Kolezyum, tarihî merkez, Vatikan ve bir mahalle/müze gününü ayrı planlayın.",
    },
    {
      q: "Roma'da araba kiralamak gerekir mi?",
      a: "Merkez gezi için hayır. Trafik, park ve kamera denetimli ZTL nedeniyle araç yük olur; Toskana veya kırsal ayağa çıkacağınız gün şehir dışında teslim almak daha mantıklıdır.",
    },
    {
      q: "Kolezyum biletini nereden almalıyım?",
      a: "Parco archeologico del Colosseo'nun yönlendirdiği ticketing.colosseo.it resmî kanaldır. Bilet isimli ve zamanlıdır; kimlik taşıyın.",
    },
    {
      q: "Vatikan Müzeleri ve Aziz Petrus aynı bilet mi?",
      a: "Hayır. Müze bileti bazilika güvenlik sırasını ortadan kaldırmaz. İki ziyareti aynı gün yapacaksanız uzun bir gün olacağını hesaba katın.",
    },
    {
      q: "Roma'da temassız kartla toplu taşıma kullanılabilir mi?",
      a: "ATAC Tap&Go destekli metro ve yüzey hatlarında evet. Aynı kart/cihazı kullanın ve her yolcu için ayrı ödeme aracı bulundurun.",
    },
    {
      q: "Roma'da hangi semtte kalınır?",
      a: "İlk gezi ve yürüyüş için Centro Storico/Monti, Vatikan ve düzenli bağlantı için Prati, akşam hayatı için Trastevere, yerel yemek odağı için Testaccio uygundur.",
    },
  ],

  relatedGuides: [
    {
      city: "Floransa",
      anchor: "Roma'dan Floransa'ya: hızlı trenle Rönesans ayağı",
      description: "Termini'den Santa Maria Novella'ya geçip Uffizi, Duomo ve Oltrarno için en az üç gece ayırın.",
    },
    {
      city: "Napoli",
      anchor: "Roma'dan Napoli'ye: güneye lezzet ve arkeoloji rotası",
      description: "Hızlı trenle Napoli merkezine inin; tarihî merkez, pizza ve Pompeii için bağımsız günler kurun.",
    },
    {
      city: "Amalfi Kıyısı",
      anchor: "Roma'dan Amalfi Kıyısı'na: doğru üs ve transfer planı",
      description: "Napoli/Sorrento veya Salerno üzerinden ilerleyin; feribot ile otobüsün mevsim ve bagaj farkını okuyun.",
    },
    {
      city: "Venedik",
      anchor: "Roma'dan Venedik'e: lagünde araçsız final",
      description: "Santa Lucia istasyonunu Mestre ile karıştırmadan, en az iki gecelik kanallar ve adalar planı kurun.",
    },
    {
      city: "Milano",
      anchor: "Roma'dan Milano'ya: tasarım, sanat ve kuzey bağlantısı",
      description: "Hızlı trenle Centrale'ye geçin; Son Akşam Yemeği biletini tren saatinden çok önce güvenceye alın.",
    },
  ],

  sources: [
    { name: "Roma Mobilità — toplu taşıma ve ZTL", url: "https://romamobilita.it/en" },
    { name: "ATAC — Tap&Go", url: "https://www.atac.roma.it/en/tickets-and-passes/tap-go" },
    { name: "Aeroporti di Roma — Fiumicino trenleri", url: "https://m.adr.it/en/web/aeroporti-di-roma-en/pax-fco-train" },
    { name: "Parco archeologico del Colosseo — biletler", url: "https://colosseo.it/en/visit/orari-e-biglietti/" },
    { name: "Musei Vaticani — resmî site", url: "https://www.museivaticani.va/content/museivaticani/en.html" },
    { name: "Direzione Musei nazionali Roma — Pantheon", url: "https://direzionemuseiroma.cultura.gov.it/pantheon/" },
    { name: "Turismo Roma — Testaccio", url: "https://www.turismoroma.it/en/node/1501" },
    { name: "Trenitalia — bölgesel bilet kuralları", url: "https://www.trenitalia.com/en/information/travelling-on-regional-trains.html" },
  ],

  volatileNote:
    "Kolezyum, Vatikan, Pantheon ve Borghese girişleri; havalimanı trenleri; ATAC hizmeti, ZTL saatleri ve konaklama vergisi değişebilir. Seyahat gününde ilgili resmî kanalı kontrol edin.",
  reviewed: "2026-08-10",
};

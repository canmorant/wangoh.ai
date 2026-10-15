import { CityGuide } from "./types";

/**
 * Sapporo rehberi — Ağustos 2026 doğrulaması.
 * Ulaşım JR Hokkaido ve Sapporo Belediyesi; mevsim, müze ve yeme-içme bilgisi
 * Sapporo Tourist Association ile işletmelerin resmî kanallarından kontrol edildi.
 */
export const sapporo: CityGuide = {
  city: "Sapporo",
  countryCode: "JP",

  seoTitle: "Sapporo Gezi Rehberi: Kış, Yemek, Ulaşım ve 3 Günlük Plan",
  seoDescription:
    "Sapporo gezi rehberi: kış hazırlığı, 2027 Kar Festivali, havalimanı treni, bira müzesi, gerçek restoranlar, semt seçimi, Otaru–Jozankei ve 3 günlük rota.",
  h1: "Sapporo Gezi Rehberi",
  lede:
    "Sapporo, Japonya'nın tarihî şehirlerinden farklı bir ölçekte kurulmuş genç ve ferah bir kuzey başkenti. Geniş caddeleri, yeraltı geçitleri, kışla barışık gündelik hayatı ve Hokkaido ürünlerine dayanan mutfağıyla Tokyo–Kyoto rotasının tekrarı değil, bambaşka bir Japonya bölümüdür.",

  quickFacts: [
    { label: "Önerilen süre", value: "3 gün · günübirliklerle 5 gün" },
    { label: "En iyi dönem", value: "Şubat kışı · Haziran–Eylül doğası" },
    { label: "Havalimanı", value: "New Chitose (CTS)" },
    { label: "Merkeze ulaşım", value: "JR Rapid Airport · en hızlı 33 dk" },
    { label: "Şehir içi", value: "Metro + tramvay + yürüyüş" },
  ],

  sections: [
    {
      heading: "Sapporo kime göre, kaç gün gerekir?",
      id: "sehri-anlamak",
      body: [
        "Sapporo'nun merkezindeki başlıca duraklar iki tam günde görülebilir: Odori Parkı, saat kulesi ve eski hükümet binası bir eksende; Nijo Pazarı, Tanukikoji ve Susukino diğer eksendedir. Üçüncü gün Maruyama–Hokkaido Jingu veya Moiwa Dağı gibi merkez dışı bir bölge eklediğinizde şehir dengeli bir seyahate dönüşür.",
        "Sapporo'yu asıl değerli kılan Hokkaido'ya açılan kapı olmasıdır. Otaru trenle kolay bir sahil günü; Jozankei onsen ve vadi doğası için; kış sporları ise çevredeki kayak alanları için ayrı zaman ister. Bu gezilerden ikisini yapacaksanız toplam beş gün ayırın. Hokkaido'nun mesafelerini Honshu şehirleri gibi düşünmeyin: haritada yakın görünen yerler arasında kar, otobüs sıklığı ve aktarma süreleri belirleyicidir.",
        "Sapporo ilk Japonya seyahatinde Tokyo–Kyoto–Osaka zincirine trenle eklenen küçük bir sapak değildir. Kısa programda uçuşla ayrı bir kuzey ayağı olarak planlayın. Kış festivaline geliyorsanız şehri yalnızca etkinlik alanı saymayın; müze, pazar ve mahalle saatlerini gündüz, ışık ve kar heykellerini akşam için eşleştirin.",
      ],
    },
    {
      heading: "Gezilecek yerler: merkezde yürüyerek Sapporo",
      id: "gezilecek-yerler",
      body: [
        "Sapporo 19. yüzyılın sonlarında ızgara planla geliştiği için yön bulmak kolaydır. Adreslerde kuzey–güney ve doğu–batı blokları görürsünüz. Şehrin omurgası, doğudaki TV Kulesi'nden batıya uzanan **Odori Parkı**dır; park aynı zamanda merkezî iş bölgesi ile Susukino tarafını ayırır.",
      ],
      subsections: [
        {
          heading: "Odori, saat kulesi ve kırmızı tuğlalı hükümet binası",
          body: [
            "Odori Parkı tek parça bir bahçeden çok, caddelerle bölünen uzun bir kamusal koridordur. Yaz etkinlikleri, sonbahar yemek festivali ve kışın kar heykelleri aynı ekseni farklı biçimlerde kullanır. TV Kulesi manzara seçeneğidir; tek seyir noktası hakkınızı daha geniş gece manzarası için Moiwa'ya ayıracaksanız çıkmanız şart değildir.",
            "Sapporo Saat Kulesi dışarıdan küçük görünür ve hızlı ziyaret edilir. Yakındaki eski Hokkaido Hükümet Binası'nın kırmızı tuğla cephesi ve çevresi, kentin erken modernleşme hikâyesini tamamlar. Restorasyon veya sergi düzeni değişebileceği için iç mekân erişimini güncel kaynaktan kontrol edin.",
          ],
        },
        {
          heading: "Nijo Pazarı, Tanukikoji ve Susukino",
          body: [
            "Nijo Pazarı merkezin kompakt deniz ürünü pazarıdır. Sabah, tezgâhlar ve küçük lokantalar daha canlıyken gidin; her dükkânın saati farklıdır. Kaisen-don seçerken yalnızca malzeme yüksekliğine değil, gerçekten sevdiğiniz balık kombinasyonuna bakın. Uni ve yengeç mevsimsel ürünlerdir; her mevsimde aynı kaliteyi varsaymayın.",
            "Kapalı **Tanukikoji** pasajı kötü havada alışveriş ve yemek için güvenli omurgadır. Akşam güneye indiğinizde **Susukino** neonları başlar. Bölge yalnızca gece kulüplerinden ibaret değildir; ramen, jingisukan, küçük bar ve geç saat yemek seçenekleri burada yoğunlaşır. Dar bir işletmede uzun sohbet yerine sipariş verip yeri sıradaki müşteriye bırakmak doğal akıştır.",
          ],
        },
      ],
    },
    {
      heading: "Maruyama, Hokkaido Jingu ve Moiwa Dağı",
      id: "merkez-disi",
      body: [
        "Merkezden metro ile ulaşılan **Maruyama Parkı**, şehir ızgarasından orman dokusuna en kolay geçiştir. Park içinden Hokkaido Jingu'ya yürüyün; geniş yaklaşım yolu özellikle kar altında etkileyicidir. İbadet alanında yolu kapatmadan ilerleyin, ana ritüelleri gözlemleyip fotoğraf kısıtlamalarına uyun.",
        "**Moiwa Dağı** gün batımı ve gece ızgarasını görmek için güçlü seçimdir. Tramvay ve bağlantı servisi/teleferik kombinasyonu zaman alır; görüş kapalıysa sırf rezervasyona sadık kalmak için çıkmayın. Teleferik bakım veya sert hava nedeniyle durabilir. Akşam dönüşünde son bağlantıyı önceden kontrol edin.",
        "Mimari ve geniş açık alan arıyorsanız Isamu Noguchi tasarımı **Moerenuma Parkı** yarım gün ister; merkez yürüyüşüne sıkıştırılmamalıdır. Kışın tesis ve ulaşım düzeni yazdan farklı olabilir. Sapporo Beer Museum ise kırmızı tuğlalı endüstri mirası üzerinden kentin bira tarihini anlatır. 1 Temmuz 2026'dan beri eski 'tamamen ücretsiz müze' bilgileri geçerli değildir: serbest gezi yetişkin için 1.000 ¥, iki tadım içeren rehberli tur 2.000 ¥ olarak duyuruldu. Ön satış ve güncel koşulları resmî siteden kontrol edin.",
      ],
    },
    {
      heading: "Kışın Sapporo: romantik görüntünün pratik tarafı",
      id: "kis-rehberi",
      body: [
        "Kalıcı kar genellikle aralık sonundan mart içine kadar şehir hayatının parçasıdır; ilk kar daha erken görülebilir. Kaldırımlar sürekli temizlense de gündüz eriyen yüzey gece buzlanır. Düz tabanlı şehir ayakkabısı yerine derin dişli, suya dayanıklı bot kullanın. İstasyon ve marketlerde satılan takılıp çıkarılabilir kaydırmaz tabanlar yardımcıdır ama yürüyüş hızını düşürmek hâlâ en önemli önlemdir.",
        "Tek kalın monttan çok katman işe yarar. Dışarıdaki soğuk ile metro, yeraltı çarşısı ve restoranların sıcaklığı arasında sık geçiş yaparsınız. Eldiven telefon kullanmaya uygun, çanta ellerinizi serbest bırakacak biçimde olmalı. Kar yağarken bavul çekmek zorlaşır; istasyona yakın konaklama ve bagaj gönderme hizmeti kışın lüks değil pratik çözümdür.",
        "Sapporo Kar Festivali her yıl Odori, Susukino ve Tsudome alanlarına yayılır; tarih ve alan programı her edisyonda resmî siteden doğrulanmalıdır. Bir sonraki ilan edilmiş festival 4–11 Şubat 2027'dir. Bu hafta oteller ve uçuşlar hızla dolar. Odori'deki büyük heykelleri gündüz ayrıntı, akşam ışık için iki kez görmek mantıklıdır; Tsudome aile etkinlikleri için ayrı ulaşım ve yarım gün ister.",
        "Yoğun kar ulaşımı geciktirebilir. Havalimanına dönüşte normalden daha geniş pay bırakın ve JR Hokkaido çalışma durumunu kontrol edin. Yeraltı yaya ağı Sapporo Station–Odori–Susukino ekseninin önemli bölümünü hava görmeden geçmenizi sağlar; yönünüzü kaybetmemek için hangi çıkıştan yüzeye çıkacağınızı önceden belirleyin.",
      ],
    },
    {
      heading: "Yaz, sonbahar ve omuz mevsimleri",
      id: "ne-zaman",
      body: [
        "Haziran–ağustos, Honshu'nun bunaltıcı yazından kaçmak isteyenler için caziptir; yine de Sapporo tamamen serin garanti vermez ve sıcak dalgaları olabilir. Uzun gün ışığı Moerenuma, Maruyama ve çevre gezilerine alan açar. Haziran genellikle ana Japonya yağmur mevsiminin etkisini daha az hisseder, fakat hava değişkenliğine hazırlıklı olun.",
        "Eylül ve ekim, ürün mevsimi ile sonbahar rengini birleştirir. Şehir merkezinden yüksek ve iç bölgelere gidildikçe renk takvimi değişir; tek bir tarih tüm Hokkaido için geçerli değildir. İlkbahar ise Honshu'dan geç gelir. Kiraz çiçeğini Tokyo takvimine göre planlamayın; yıllık tahmini kontrol edin.",
        "Kasım ile aralık ortası arası geçiş dönemi, ne tam sonbahar ne garantili kar sunduğu için ilk kez gelenlere daha zayıf olabilir. Buna karşılık kalabalık azdır. Seyahat amacınız mutfak ve şehir hayatıysa bu dönem de işler; kar fotoğrafı önceliğinizse daha güvenilir kış haftalarını seçin.",
      ],
    },
    {
      heading: "Ne yenir? Hokkaido ürünlerinden Sapporo tabaklarına",
      id: "ne-yenir",
      body: [
        "Sapporo mutfağını tek bir miso ramen kâsesine indirmek haksızlık olur. **Soup curry**, akışkan ve baharatlı et suyunda iri sebzeler ile etin ayrı dokularını koruduğu yerel yemektir. Acı seviyesi, pirinç miktarı ve ek malzemeler genellikle ayrı seçilir; ilk denemede temel tabağı aşırı malzemeyle kapatmayın.",
        "**Miso ramen** yoğun, sıcak ve çoğu zaman yağ tabakasıyla ısıyı koruyan bir kış yemeğidir. Mısır ve tereyağı turistik menülerde sık görünür ama her köklü dükkânın varsayılan kâsesi değildir. Önce işletmenin imza misosunu sade sipariş edin. Ramen Yokocho atmosfer için eğlencelidir; şehrin en iyi tek cevabı olduğunu varsaymayın.",
        "**Jingisukan**, kubbeli ızgarada kuzu veya koyunun sebzelerle pişirilmesidir. Marine et ve sosla sonradan tatlandırılan et farklı stillerdir; mekânın tarifine uyun. Giysilere koku sinmesi doğaldır, kabanı verilen poşete koyun. Hokkaido deniz ürünü için dönme sushi, pazar kâsesi veya izakaya seçenekleri vardır. Tarak, somon yumurtası, yengeç ve deniz kestanesinde mevsim ile menşei kaliteyi belirler; 'Hokkaido'dayım, her ürün yereldir' diye varsaymayın.",
        "Süt ürünleri, yumuşak dondurma, kavun, mısır ve patates gibi daha sade ürünler de kuzey tarımının gücünü gösterir. Günde dört ünlü öğün sıkıştırmak yerine bir ağır akşamın yanına pazar kahvaltısı ve hafif öğle koyun.",
      ],
    },
    {
      heading: "New Chitose Havalimanı ve şehir içi ulaşım",
      id: "ulasim",
      body: [
        "New Chitose Havalimanı'ndan Sapporo Station'a en hızlı JR Rapid Airport seferi yaklaşık 33 dakika sürer; gündüz yoğun saatlerde düzenli sefer vardır. Bazı vagonlar rezerve, diğerleri rezervasyonsuzdur. Kış veya yoğun tatilde oturmak istiyorsanız rezerve koltuğu düşünün. Trenlerin bir bölümü Otaru yönüne devam eder, ancak doğru vagon ve varış tabelasını kontrol edin.",
        "IC kartlar JR yolculuğunda ve Sapporo metrosu, tramvayı ile birçok otobüste kullanılabilir. Şehrin yerel SAPICA kartı vardır; kısa Japonya yolculuğunda elinizdeki Suica, PASMO veya ICOCA'yı kullanmak genellikle daha basittir. Günlük bilet ancak o gün gerçekten birkaç metro yolculuğu yapacaksanız anlamlıdır; kompakt merkezde çoğu rota yürüyerek tamamlanır.",
        "Metro üç hattan oluşur ve yön bulması Tokyo'dan kolaydır. Tramvay merkez çevresinde halka benzeri rota izler; Moiwa bağlantısı ve yerel mahalleler için işe yarar. Kışın yer üstünde daha yavaş ilerleyebileceğini kabul edin. Taksi kısa mesafede kullanışlıdır fakat festival çıkışı ve fırtınada talep yükselir.",
      ],
    },
    {
      heading: "Nerede kalınır?",
      id: "nerede-kalinir",
      body: [
        "**Sapporo Station çevresi**, havalimanı treni ve şehir dışı geziler için en işlevsel seçimdir. Kışın yeraltı bağlantıları büyük avantaj sağlar; karşılığında akşam Susukino'dan dönüş gerekir. **Odori**, istasyon ile gece bölgesi arasında en dengeli konumdur ve festivalde alanın merkezindedir.",
        "**Susukino**, yemek ve gece hayatını kapıda isteyenlere uygundur. Gürültü ve yoğun yaya trafiğini kabul etmek gerekir. **Nakajima Park** çevresi daha sakin, metroya yakın ve çoğu zaman merkez çekirdeğine göre daha ferah konaklama sunar. Kış rezervasyonunda yalnızca harita mesafesine değil, en yakın metro çıkışında asansör olup olmadığına ve otelin kaldırım erişimine bakın.",
      ],
    },
    {
      heading: "Sapporo'dan günübirlik rotalar",
      id: "gunubirlik",
      body: [
        "**Otaru**, kanal çevresi, taş depolar ve deniz ürünü için en kolay ilk seçimdir. JR ile doğrudan gidilir; bazı Rapid Airport trenleri Sapporo üzerinden Otaru'ya devam eder. Kanal tek başına tam gün doldurmaz: eski banka yapıları, Sakaimachi ve liman tarafını ekleyin. Kışta gün ışığı erken bittiği için dönüş saatini değil, yürüyüş başlangıcını erkene alın.",
        "**Jozankei**, onsen ve vadi manzarası için otobüsle ulaşılır. Günübirlik banyo kabul eden tesislerin saat ve havlu politikası farklıdır; tesisi seçmeden yola çıkmayın. Sonbaharda çok yoğun olabilir. **Shiroi Koibito Park** veya yakın kayak alanları ise ilgiye göre yarım/tam gün seçenekleridir; sırf popüler diye şehir planına eklemek gerekmez.",
        "Furano ve Biei haritada cazip görünse de Sapporo'dan kısa günübirlik programda ulaşım günü yiyebilir. Özellikle kışta bağımsız rota kurmadan önce seferleri ve hava riskini değerlendirin; bu bölgeler çoğu zaman ayrı konaklamayı hak eder.",
      ],
    },
    {
      heading: "Bütçe ve sık yapılan hatalar",
      id: "butce-ipuclari",
      body: [
        "Sapporo'da bütçeyi dönem belirler. Kar Festivali ve büyük etkinlik haftalarında konaklama, normal kış günlerinden belirgin biçimde pahalı ve kısıtlı olabilir. Uçuş ve oteli iptal koşullu olarak erken almak, sonradan tek tek restoran kuyruklarını optimize etmekten daha değerlidir.",
        "**Hata: karı yalnızca fotoğraf unsuru sanmak.** Bot, ekstra transfer payı ve erken gün batımı programın parçasıdır. **Hata: her ünlü yemeği aynı güne koymak.** Miso ramen, soup curry ve jingisukan art arda ağır gelir. **Hata: bira müzesini eski bilgiyle ücretsiz sanmak.** Temmuz 2026 sonrası bilet/tur modelini kontrol edin. **Hata: Otaru ve Jozankei'yi aynı güne sıkıştırmak.** Farklı yönlerdeki bu iki gezi ayrı gün ister.",
        "Restoran kuyrukları için yedek adres belirleyin. Popüler bir şube önünde uzun beklemek yerine aynı türde ikinci güvenilir mekâna geçmek Sapporo'da çoğu zaman daha iyi kullanım sağlar. Çalışma saatleri hava ve malzeme tükenmesiyle değişebilir.",
      ],
    },
  ],

  places: [
    {
      name: "Soup Curry GARAKU",
      area: "Odori–Tanukikoji",
      known: "Kemik suyu, otlar ve Japon dashi katmanlı soup curry",
      why:
        "Sapporo'nun imza yemeğini ilk kez denemek için anlaşılır bir referans noktası. Sebzeler diri, et suyu baharatlı ama yalnızca acılığa yaslanmıyor; acı seviyesi ve pirinci kendinize göre seçebilirsiniz.",
      price: "Orta",
      tip: "Sıra oluşur ve günlük et suyu tükenebilir. Açılışa yakın gidin veya yedek soup curry adresi belirleyin.",
    },
    {
      name: "Sumire Honten",
      area: "Nakanoshima",
      known: "Klasik Sapporo usulü miso ramen",
      why:
        "Merkezdeki turistik ramen koridorundan çıkıp yoğun miso suyu, kıvrımlı erişte ve sıcaklığı koruyan yağ katmanıyla klasik stili anlamak için gidilir.",
      price: "Ekonomik",
      tip: "Merkezden ulaşım gerektirir ve sıra olabilir. Şube durumunu işletmenin resmî mağaza listesinden kontrol edin.",
    },
    {
      name: "Nemuro Hanamaru",
      area: "Sapporo Station / şehir içi şubeler",
      known: "Hokkaido deniz ürünü ve dönme sushi",
      why:
        "Gösterişli tek bir kâse yerine tabağı tabak seçmek, Hokkaido balıklarını karşılaştırmayı kolaylaştırır. Günün ürünlerini sorun; yalnızca tanıdık somon ve ton balığında kalmayın.",
      price: "Orta",
      tip: "Sapporo Station şubesi çok yoğun olabilir. Aynı markanın güncel diğer şubelerini ve sıra sistemini kontrol edin.",
    },
    {
      name: "Tsukisappu Jingisukan Club",
      area: "Hitsujigaoka çevresi",
      known: "1953'ten beri kömür ateşinde mutton jingisukan",
      why:
        "Şehir merkezindeki dar, dumanlı tezgâhlardan farklı olarak daha açık bir ortamda geleneksel mutton ve sebze düzenini gösterir. Etin sosla ve birayla nasıl eşleştiğini anlamak için iyi bir klasik.",
      price: "Orta",
      tip: "Merkez dışında olduğu için ulaşımı ve son sipariş saatini önceden planlayın.",
    },
    {
      name: "Donburi Chaya",
      area: "Nijo Pazarı",
      known: "Mevsimlik deniz ürünlü pirinç kâseleri",
      why:
        "Pazar içinde oturarak kaisen-don yemek isteyenler için menüsü anlaşılır bir uzman adres. Üçlü küçük kombinasyonlar, sevdiğiniz ürünleri gereksiz dev bir kâse almadan seçmeye yardım eder.",
      price: "Orta",
      tip: "Pazar dükkânlarının saatleri değişir; sabah veya erken öğlen gidin ve mevsim ürününü sorun.",
    },
    {
      name: "Sapporo Beer Garden",
      area: "Naebo",
      known: "Tarihî tuğla komplekste jingisukan ve bira",
      why:
        "Müze ziyaretiyle aynı bölgede, grup veya ilk kez jingisukan deneyenler için kolay bir akşam kurgusu sunar. Atmosferi, küçük uzman lokantadan daha önemli bir tercih nedenidir.",
      price: "Orta",
      tip: "Müze ve restoran ayrı saat/rezervasyon düzenine sahiptir; ikisini tek rezervasyon sanmayın.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — Şehrin ızgarası ve mutfağı",
      morning:
        "Nijo Pazarı'nda erken kahvaltı yapın; Soseigawa üzerinden TV Kulesi ve Odori Parkı'na yürüyün.",
      afternoon:
        "Saat Kulesi, eski hükümet binası ve Sapporo Station çevresini gezin. Hava kötüyse yeraltı yaya ağını keşfedin.",
      evening:
        "Tanukikoji'den Susukino'ya inin; soup curry veya miso ramen seçin, ikisini aynı akşama sıkıştırmayın.",
    },
    {
      title: "2. Gün — Kuzey tarihi ve gece manzarası",
      morning:
        "Maruyama Parkı içinden Hokkaido Jingu'ya yürüyün. Kışın kısa ve güvenli parkur seçin.",
      afternoon:
        "Sapporo Beer Museum'un güncel biletli ziyaretini yapın; sergi ilginizi çekmiyorsa Moerenuma Parkı'nı yarım güne dönüştürün.",
      evening:
        "Görüş açıksa Moiwa Dağı'na çıkın. Kapalı havada Susukino'da jingisukan ve küçük bir bar daha iyi plandır.",
    },
    {
      title: "3. Gün — Otaru veya Jozankei",
      morning:
        "Deniz ve mimari için erken JR treniyle Otaru'ya; onsen için önceden seçtiğiniz Jozankei tesisine gidin.",
      afternoon:
        "Otaru'da kanalın ötesine, eski banka ve depo yapılarına yürüyün. Jozankei'de banyo sonrası vadi patikasını hava uygunsa ekleyin.",
      evening:
        "Sapporo'ya dönün; son akşamı dönme sushi veya sade bir izakaya ile kapatın.",
    },
  ],

  practicalHeading: "Sapporo'ya gitmeden bilinmesi gerekenler",
  practicalTips: [
    {
      title: "Kar Festivali 4–11 Şubat 2027",
      body:
        "Duyurulan 77. festival Odori, Susukino ve Tsudome alanlarına yayılıyor. Konaklamayı erken alın; Tsudome'u merkez yürüyüşünün devamı değil, ayrı ulaşım isteyen yarım gün olarak planlayın.",
    },
    {
      title: "Bira müzesi artık ücretsiz değil",
      body:
        "1 Temmuz 2026'dan itibaren serbest gezi yetişkin 1.000 ¥, iki tadımlı rehberli tur 2.000 ¥ olarak ilan edildi. Müze bileti ile Beer Garden restoran rezervasyonu ayrı işlemlerdir.",
    },
    {
      title: "En hızlı havalimanı treni 33 dakika",
      body:
        "JR Special Rapid Airport en hızlı 33, normal Rapid en hızlı 37 dakika olarak ilan edilir. Tüm seferleri 33 dakika sanmayın; tren türünü ve rezerve koltuk vagonunu kontrol edin.",
    },
    {
      title: "Kışta uçuş gününe geniş pay bırakın",
      body:
        "Yoğun kar tren ve otobüsleri aksatabilir. Havalimanına normal şehir transferinden daha erken çıkın; sabah JR Hokkaido çalışma durumuna bakın.",
    },
    {
      title: "Yeraltı ağı üç bölgeyi bağlar",
      body:
        "Sapporo Station–Odori–Susukino ekseninin büyük bölümünü dışarı çıkmadan yürüyebilirsiniz. Otel seçerken yalnızca mesafeyi değil, en yakın asansörlü çıkışı da kontrol edin.",
    },
    {
      title: "Buzda ekipmandan önce tempo önemlidir",
      body:
        "Su geçirmez, derin dişli bot ve gerekirse kaydırmaz taban kullanın; kısa adımlarla yürüyün, ellerinizi serbest tutun. Dışarısı ile çok sıcak iç mekânlar arasında katmanlı giyim iş görür.",
    },
  ],

  faqs: [
    {
      q: "Sapporo kaç günde gezilir?",
      a: "Merkez ve bir dış mahalle için 3 gün yeterlidir. Otaru, Jozankei veya kayak günü ekleyecekseniz 4–5 gün ayırın. Kar Festivali'nde alanlar ve kalabalık nedeniyle normalden daha yavaş hareket edilir.",
    },
    {
      q: "New Chitose Havalimanı'ndan Sapporo'ya nasıl gidilir?",
      a: "JR Rapid Airport en pratik seçenektir; en hızlı sefer yaklaşık 33 dakikada Sapporo Station'a ulaşır. Rezerve ve rezervasyonsuz vagonlar vardır, IC kart kullanılabilir. Kış gecikmeleri için dönüşte ek pay bırakın.",
    },
    {
      q: "Sapporo Kar Festivali ne zaman?",
      a: "Festival genellikle şubat başında yapılır; tarih ve alanlar her yıl resmî sitede ilan edilir. Bir sonraki duyurulan edisyon 4–11 Şubat 2027'dir. Bu dönem için uçuş ve oteli erken ayırtın.",
    },
    {
      q: "Kışın Sapporo için özel ayakkabı gerekir mi?",
      a: "Evet. Suya dayanıklı, derin dişli bot ve gerekirse takılıp çıkarılan kaydırmaz taban kullanın. Buzda kısa adımlarla yürüyün; ellerinizi ceplerde tutmayın ve transferlere normalden fazla süre bırakın.",
    },
    {
      q: "Sapporo'da Suica veya diğer IC kartlar geçer mi?",
      a: "Suica, PASMO ve ICOCA gibi başlıca IC kartlar metro, tramvay, birçok otobüs ve JR havalimanı treninde kullanılabilir. Kısa ziyaret için ayrıca SAPICA almak çoğu zaman gerekmez.",
    },
    {
      q: "Otaru Sapporo'dan günübirlik gezilir mi?",
      a: "Evet. Direkt JR trenleri sayesinde en kolay günübirlik rotadır. Kanalın yanında Sakaimachi, eski banka binaları ve liman tarafını ekleyin; kışın erken kararma ve sefer durumunu hesaba katın.",
    },
  ],

  relatedGuides: [
    {
      city: "Tokyo",
      anchor: "Sapporo'dan Tokyo'ya: kuzeyden metropole",
      description:
        "Uçuşla kolay bağlantı; Tokyo'nun semtlerini acele etmeden görmek için dört ila beş gün ayırın.",
    },
    {
      city: "Osaka",
      anchor: "İki yemek şehrini karşılaştırın: Osaka",
      description:
        "Sapporo ürün ve iklimle, Osaka sokak ve esnaf kültürüyle konuşur; aynı seyahatte iki farklı mutfak ritmi sunar.",
    },
  ],

  sources: [
    { name: "JR Hokkaido airport access", url: "https://www.jrhokkaido.co.jp/global/english/travel/airport.html" },
    { name: "Sapporo City fares and IC cards", url: "https://www.city.sapporo.jp/st/english/fareandticket.html" },
    { name: "Sapporo seasons", url: "https://www.sapporo.travel/en/info/about/season/" },
    { name: "Sapporo winter guide", url: "https://www.sapporo.travel/en/spot/feature/winter/" },
    { name: "Sapporo Beer Museum", url: "https://www.sapporobeer.pro/english/brewery/s_museum/" },
    { name: "Sapporo Beer Museum July 2026 reopening", url: "https://www.sapporobreweries.com/newsroom/release/detail/20260527000010.html" },
    { name: "Sapporo Snow Festival", url: "https://www.snowfes.com/" },
    { name: "Official Sapporo soup curry guide", url: "https://www.sapporo.travel/en/gourmet/feature/soupcarry/" },
    { name: "Soup Curry GARAKU", url: "https://s-garaku.com/" },
    { name: "Sumire", url: "https://sumireya.com/" },
    { name: "Nemuro Hanamaru stores", url: "https://www.sushi-hanamaru.com/store/" },
    { name: "Tsukisappu Jingisukan Club", url: "https://www.sapporo.travel/en/gourmet/shop/tsukisappu-jingisukan-club/" },
    { name: "Donburi Chaya", url: "https://donburi.jp/en/menu/meibutsu/" },
    { name: "Sapporo Beer Garden", url: "https://sapporo-bier-garten.jp/" },
  ],

  volatileNote:
    "Kar ve rüzgâr ulaşımı etkileyebilir; festival tarihleri, teleferik çalışması, müze bilet modeli ve restoran saatleri değişebilir. Resmî kanalları seyahat gününde kontrol edin.",
  reviewed: "2026-08-09",
};

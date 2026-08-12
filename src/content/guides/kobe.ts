import { CityGuide } from "./types";

/** Kobe rehberi — Ağustos 2026 resmî kaynak araştırması. */
export const kobe: CityGuide = {
  city: "Kobe",
  countryCode: "JP",
  seoTitle: "Kobe Gezi Rehberi: Kobe Eti, Arima ve 3 Günlük Rota",
  seoDescription: "Kobe gezi rehberi: Sannomiya ulaşımı, Kobe eti, Kitano, liman, Nada sake, Arima Onsen, kalınacak yerler, 3 günlük rota ve pratik seyahat bilgileri.",
  h1: "Kobe Gezi Rehberi",
  lede: "Rokko Dağları ile Seto İç Denizi arasında ince bir şeride kurulan Kobe; limanla gelen yabancı kültürleri, Nada'nın sake ustalığını, Arima'nın kaplıcalarını ve adı en çok yanlış kullanılan sığır etini tek rotada birleştirir.",
  quickFacts: [
    { label: "Önerilen süre", value: "2–3 tam gün" },
    { label: "Şehir merkezi", value: "Sannomiya" },
    { label: "Shinkansen", value: "Shin-Kobe Station" },
    { label: "Havalimanı", value: "Kobe UKB · Port Liner" },
    { label: "Yarım gün", value: "Arima Onsen · Nada sake" },
  ],
  sections: [
    { heading: "Kobe gezisi nasıl planlanır? Denizden dağa kısa koridor", id: "gezi-planlama", body: [
      "Kobe merkezi kuzey–güney yönünde yürünebilir ama katmanlıdır: Shin-Kobe/Nunobiki; Kitano; Sannomiya; Former Foreign Settlement–Motomachi–Nankinmachi ve Meriken Park–Harborland. İlk gün bu ekseni yokuş aşağı kurun. İkinci günü Nada sake bölgesine, üçüncüyü Arima Onsen veya Rokko'ya ayırın.",
      "Osaka'dan günübirlik Kobe yapılabilir; ancak yalnız Harborland ve et yemeği şehri eksik bırakır. Bir gece, liman ışıkları ile sabah Nunobiki yürüyüşünü birleştirir. Arima'da ryokan/onsen deneyimi istiyorsanız bunu şehir otelinden ayrı gece olarak düşünün.",
      "Kobe 1995 Büyük Hanshin-Awaji Depremi'nin izlerini ve yeniden inşasını taşır. Disaster Reduction and Human Renovation Institution veya Meriken Park'taki korunmuş bölüm, şehir silüetini tarihsel bağlama oturtur; anıtları fotoğraf fonuna indirgemeyin." ] },
    { heading: "Kobe'ye ulaşım: Sannomiya, Shin-Kobe ve havalimanı farkı", id: "ulasim", body: [
      "**Sannomiya**, JR, Hankyu, Hanshin, metro ve Port Liner'ın birleştiği gerçek şehir merkezidir. **Shin-Kobe**, Shinkansen istasyonudur; Sannomiya'ya metro ile kısa bağlantı sunar ama aynı yer değildir. Biletiniz Kobe yazsa da hangi istasyona indiğinizi kontrol edin.",
      "Osaka–Kobe arasında JR, Hankyu ve Hanshin farklı Osaka terminallerinden gelir. En hızlı etiketi yerine konaklama noktanıza en az aktarmalı hattı seçin. Kyoto'dan JR Special Rapid pratik olabilir; hızlı tren kullanırsanız Shin-Kobe'den ayrıca merkeze inersiniz.",
      "Kobe Airport'tan Port Liner, Sannomiya'ya yaklaşık 18 dakikalık raylı bağlantı sunar. Uluslararası/iç hat terminali, yürüyüş ve son seferi resmî havalimanı sayfasından doğrulayın. Kansai Havalimanı için otobüs/deniz bağlantıları olsa da hava, bagaj ve terminal süresini toplam karşılaştırmaya katın." ] },
    { heading: "Kitano, Nunobiki ve liman yürüyüşü", id: "kitano-liman", body: [
      "Shin-Kobe arkasındaki Nunobiki Falls'a kısa ama basamaklı patika çıkar; şehir ayakkabısıyla yağmur sonrası kaygan olabilir. Nunobiki Ropeway yaklaşık on dakikada Herb Gardens üst istasyonuna ulaşır; teleferik ve bahçe saatleri/hava kapanışı ayrıdır. Yürüyüşü yukarı teleferik–aşağı patika ya da tersi planlayın.",
      "Kitano Ijinkan, limanın açılmasıyla gelen yabancı toplulukların konut alanıdır. Ücretli evlerin tümüne girmek yerine mimari ilginize göre iki yapı seçin. Yokuşlar belirgindir; Sannomiya'dan City Loop otobüsü yürüyüşü azaltabilir ama yoğun günde daha yavaş olabilir.",
      "Motomachi'den Nankinmachi'ye, Former Foreign Settlement üzerinden Meriken Park ve Harborland'a yürüyün. Kobe Port Tower ve müzelerin güncel bilet/saatlerini kontrol edin. Akşam ferris wheel ve liman ışıkları güzel; son treni beklerken Sannomiya'ya dönüş mesafesini unutmayın." ] },
    { heading: "Kobe eti nasıl doğrulanır? Wagyu ile aynı şey değil", id: "kobe-eti", body: [
      "Kobe beef, her Japon wagyu eti değildir. Hyogo'da yetiştirilen Tajima soyundan sığırların üretim ve kalite ölçütlerini karşılayan et için korunan bir işarettir. Restoranın **Kobe Beef Marketing & Distribution Promotion Association** kayıtlı üye/tesis listesinde olup olmadığını resmî siteden kontrol edin.",
      "Yetkili işletmede bronz heykel/plaket ve bireysel et sertifikası görülebilir; logoya benzeyen çıkartma tek başına yeterli değildir. Şef veya servis görevlisinden sertifikayı sormak ayıp değildir. 'Kobe-style', yalnız 'A5 wagyu' ya da yabancı ülkedeki ucuz Kobe burger aynı doğrulamayı sağlamaz.",
      "Tadım için dev porsiyon gerekmez. Sirloin daha yağlı ve yoğun, fillet daha narin olabilir; gramaj, kesim, pişirme ve yan ürünleri fiyat karşılaştırmasında birlikte okuyun. Öğle seti erişilebilir olabilir, ancak güncel menü ile servis ücretini rezervasyon öncesi doğrulayın." ] },
    { heading: "Nada sake bölgesi ve Arima Onsen", id: "nada-arima", body: [
      "Nada Gogo, beş sake üretim bölgesinden oluşur; Hakutsuru ve Kiku-Masamune gibi müze/tesisler Hanshin hattı çevresinde dağınıktır. Hepsini toplamak yerine iki üretici seçin. Özel fabrika turu rezervasyon isteyebilir; güçlü parfüm kullanmayın ve üretim alanı fotoğraf kuralına uyun.",
      "Tadım yapacaksanız otomobil, bisiklet veya scooter kullanmayın. Küçük servisleri paylaşın, su için ve ürün satın alırken uçuş bagaj/alkol limitini kontrol edin. Sake müzesi ziyareti ücretsiz olabilir ama her tadım/atölye dâhil değildir.",
      "Arima Onsen, Kinsen adı verilen demirli altın renkli ve Ginsen adı verilen daha berrak kaynaklarıyla bilinir. Günübirlik hamam, ayak banyosu ve ryokan aynı erişimi sunmaz. Dövme, havlu, mayo ve özel banyo koşullarını tesisten önce sorun; onsen suyunda havlu kullanmayın." ] },
    { heading: "Kobe'de nerede kalınır?", id: "nerede-kalinir", body: [
      "**Sannomiya**, tren, yemek ve akşam için açık ara en dengeli ilk üs. **Motomachi**, Nankinmachi ve limana yürüyüşle daha sakin; havaalanı Port Liner'a kısa geçiş gerekir. **Harborland**, manzara ve aile için iyi ama gece restoran seçeneği merkezden erken sakinleşebilir.",
      "**Shin-Kobe**, erken Shinkansen ve Nunobiki için pratik; gündelik akşam hayatı Sannomiya'dadır. **Arima Onsen** merkez oteli değil, kaplıca gecesidir. Ryokan fiyatına akşam/ kahvaltı, özel banyo ve vergi dâhil mi kontrol edin.",
      "Kobe kompakt olduğu için oda seçimini yalnız deniz manzarasına bağlamayın. İstasyon çıkışı, yokuş, son check-in ve valiz saklama; iki günlük gezide pencereden daha fazla zaman kazandırır." ] },
    { heading: "Kobe'de ne yenir? Etin ötesindeki liman mutfağı", id: "ne-yenir", body: [
      "Kobe eti gezi bütçesinde tek büyük öğün olabilir. Geri kalanında miso-dare gyoza, sobameshi, Akashiyaki'ye yakın yumurtalı hamur yemekleri, Nankinmachi atıştırmalıkları ve köklü fırınlar şehrin liman karakterini gösterir.",
      "Miso-dare gyozada soya, sirke ve acı yağ yerine tatlı-tuzlu miso sosu kullanılır. Sobameshi yakisoba eriştesi ile pirincin sacda birlikte kıyılmasıdır; Nagata çevresiyle ilişkilidir. Chinatown'da tek dev porsiyon yerine sıcak ürünü dükkân önünde, yürüyüşü engellemeden tüketin.",
      "Nada sake tadımını akşam Kobe eti yemeğiyle aşırı alkol programına çevirmeyin. Japonya'da bahşiş beklenmez; teppanyaki restoranında rezervasyon saati ve kokuyu taşıyan kıyafet önemlidir. Alerji/kısıtları rezervasyonda yazılı iletin." ] },
  ],
  places: [
    { name: "Mouriya Honten", area: "Sannomiya", known: "Teppanyaki Kobe beef", why: "Kayıtlı işletmede kesim ve pişirme farkını şef tezgâhında izlemek için.", price: "Yüksek", tip: "Resmî birlik kaydını ve güncel menüyü rezervasyon öncesi yeniden doğrulayın." },
    { name: "Wakkoqu Shin-Kobe", area: "Shin-Kobe", known: "Kobe beef teppanyaki", why: "Shinkansen veya Nunobiki gününe bağlanan, açıklamalı ve odaklı et deneyimi için.", price: "Yüksek", tip: "Kesim, gramaj ve öğle/akşam menüsü aynı değildir; rezervasyon yapın." },
    { name: "Steakland Kobe-kan", area: "Sannomiya", known: "Daha erişilebilir teppanyaki setleri", why: "Bütçeyi kontrol ederek tezgâh deneyimi arayanlar için.", price: "Orta", tip: "Siparişin gerçekten sertifikalı Kobe beef olduğunu menüde teyit edin." },
    { name: "Gyoza Daigaku", area: "Nankinmachi", known: "Miso-dare gyoza", why: "Kobe'ye özgü sos alışkanlığını sade, hızlı bir tabakta denemek için.", price: "Ekonomik", tip: "Küçük dükkânda sıra ve nakit ihtiyacı olabilir; dinlenme gününü kontrol edin." },
    { name: "Hakutsuru Sake Brewery Museum", area: "Nada", known: "Sake üretim tarihi ve tadım", why: "Nada'nın su, pirinç ve iklim avantajını görsel süreçle anlamak için.", price: "Ekonomik", tip: "Tadım sonrası araç/bisiklet kullanmayın; özel turu önceden ayırın." },
    { name: "Nankinmachi tezgâhları", area: "Motomachi", known: "Buharda çörek, Çin-Kore-Japon atıştırmalıkları", why: "Kobe'nin açık limanla gelişen çok kültürlü yemek hafızasını tatmak için.", price: "Ekonomik", tip: "Yürürken yemeyin; dükkânın gösterdiği noktada bitirin ve çöpü teslim edin." },
  ],
  itinerary: [
    { title: "1. Gün — Nunobiki'den limana", morning: "Shin-Kobe'den Nunobiki Falls veya Ropeway–Herb Gardens; hava kontrolü.", afternoon: "Kitano'da seçilmiş iki ijinkan, Sannomiya ve Former Foreign Settlement.", evening: "Meriken Park–Harborland gün batımı ve Motomachi/Sannomiya'da yemek." },
    { title: "2. Gün — Nada ve deprem hafızası", morning: "Hanshin hattıyla Nada'da iki sake müzesi; küçük tadımlar ve bol su.", afternoon: "Disaster Reduction and Human Renovation Institution veya Hyogo Museum of Art.", evening: "Rezervasyonlu Kobe beef ya da miso-dare gyoza ve merkez barları." },
    { title: "3. Gün — Arima Onsen ve Rokko", morning: "Toplu taşımayla Arima; güncel hamam erişimi ve kasaba yürüyüşü.", afternoon: "Hava açıksa Rokko bağlantısı/manzara, değilse uzun onsen ve kafe.", evening: "Sannomiya'ya dönüş veya öğün dâhil ryokan gecesi." },
  ],
  practicalHeading: "Kobe'de ismi benzer şeyleri doğru ayırın",
  practicalTips: [
    { title: "Sannomiya ile Shin-Kobe'yi karıştırmayın", body: "Shinkansen Shin-Kobe'ye, şehir hatlarının çoğu Sannomiya'ya gelir; arada metro bağlantısı vardır." },
    { title: "Kobe beef kaydını kontrol edin", body: "Her wagyu Kobe değildir. Restoranı resmî birliğin designated registration store listesinde arayın." },
    { title: "Sake tadımına trenle gidin", body: "Nada tesisleri Hanshin hattına yakındır; tadım sonrası araç veya bisiklet kullanmayın." },
    { title: "Onsen kuralını tesise sorun", body: "Dövme, havlu, mayo, çocuk ve özel banyo düzeni her tesiste aynı değildir." },
    { title: "Yokuşu yukarıdan aşağı kurun", body: "Nunobiki–Kitano–Sannomiya–liman sırası diz ve zamanı korur; rahat taban giyin." },
    { title: "City Loop'u trafikle değerlendirin", body: "Turistik otobüs yokuşu azaltır ama hafta sonunda yürümekten yavaş olabilir; güncel varışı kontrol edin." },
  ],
  faqs: [
    { q: "Kobe için kaç gün gerekir?", a: "Merkez ve liman için 1 gün yapılabilir; Nada ve Arima Onsen'le birlikte Kobe'yi anlamak için 2–3 gün idealdir." },
    { q: "Osaka'dan Kobe günübirlik gezilir mi?", a: "Evet. JR, Hankyu veya Hanshin ile kolaydır. Hattı Osaka'daki kalkış ve Kobe'deki hedef istasyonunuza göre seçin." },
    { q: "Gerçek Kobe eti nasıl anlaşılır?", a: "Restoranı Kobe Beef Marketing & Distribution Promotion Association'ın kayıtlı işletme listesinde doğrulayın; sertifika/plaketi sorun. Her A5 wagyu Kobe değildir." },
    { q: "Kobe'de nerede kalınır?", a: "İlk ziyaret için Sannomiya en dengeli, Motomachi limana yürünebilir, Shin-Kobe erken hızlı tren için pratiktir. Arima ayrı kaplıca gecesidir." },
    { q: "Kobe Havalimanı'ndan merkeze nasıl gidilir?", a: "Port Liner, havalimanını Sannomiya'ya yaklaşık 18 dakikada bağlar. Terminal ve son seferi resmî sayfadan kontrol edin." },
    { q: "Arima Onsen Kobe'den günübirlik olur mu?", a: "Evet. Ulaşım ve hamam saatleriyle yarım/tam gün planlanabilir; ryokan akşam yemeği ve sakin sabah için bir gece daha zengindir." },
  ],
  relatedGuides: [
    { city: "Osaka", anchor: "Kobe'den Osaka'ya: kısa trenle büyük mutfak", description: "Sannomiya'dan uygun hattı seçip Namba, Umeda ve Shinsekai'yi semt günleriyle keşfedin." },
    { city: "Kyoto", anchor: "Kobe'den Kyoto'ya: limandan tapınaklara", description: "Direkt trenle geçip Kyoto'yu günübirliğe sıkıştırmadan en az üç tam gün ayırın." },
    { city: "Nara", anchor: "Kobe'den Nara'ya: Kansai'nin eski başkenti", description: "Hanshin–Kintetsu bağlantısıyla Todai-ji, park ve Naramachi'yi tek yürüyüşte birleştirin." },
    { city: "Hiroshima", anchor: "Kobe'den Hiroshima'ya: Seto İç Denizi yönü", description: "Shin-Kobe'den hızlı trenle Barış Parkı ve Miyajima'ya iki günlük rota kurun." },
    { city: "Okinawa", anchor: "Kobe'den Okinawa'ya: limandan Ryukyu adalarına", description: "Uçuş sonrası Naha ile ana adayı ayırıp araç ve deniz güvenliğini merkeze alın." },
  ],
  sources: [
    { name: "Feel Kobe — resmî turizm rehberi", url: "https://www.feel-kobe.jp/en/" },
    { name: "Feel Kobe — 2026 seyahat rehberi", url: "https://www.feel-kobe.jp/lsc/asset/brochures/travelguide_en.pdf" },
    { name: "Kobe Airport — Port Liner", url: "https://www.kairport.co.jp/en/access/portliner" },
    { name: "Feel Kobe — Shin-Kobe", url: "https://www.feel-kobe.jp/en/stories/Shin-Kobe" },
    { name: "Feel Kobe — Nunobiki Ropeway", url: "https://www.feel-kobe.jp/en/attractions/detail_1013.html" },
    { name: "Feel Kobe — Nada sake", url: "https://www.feel-kobe.jp/en/stories/japanesesake" },
    { name: "Feel Kobe — Arima Onsen", url: "https://www.feel-kobe.jp/en/attractions/detail_1067.html" },
    { name: "Kobe Beef resmî birliği", url: "https://www.kobe-niku.jp/" },
    { name: "Kobe Beef — kayıtlı işletmeler", url: "https://www.kobe-niku.jp/contents/merchant/about.html" },
    { name: "Mouriya", url: "https://www.mouriya.co.jp/en/" },
    { name: "Wakkoqu", url: "https://www.wakkoqu.com/menu/en" },
    { name: "Steakland Kobe", url: "https://steakland-kobe.jp/en/pages/1" },
  ],
  volatileNote: "Kobe beef işletme kaydı, restoran menüsü, teleferik, sake turları, onsen erişimi ve havalimanı seferleri değişebilir. Resmî kaynakları rezervasyon günü doğrulayın.",
  reviewed: "2026-08-10",
};

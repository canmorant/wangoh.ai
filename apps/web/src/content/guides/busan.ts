import { CityGuide } from "./types";

/** Busan rehberi — Ağustos 2026 resmî kaynak araştırması. */
export const busan: CityGuide = {
  city: "Busan",
  countryCode: "KR",
  seoTitle: "Busan Gezi Rehberi: Plajlar, Ulaşım ve 4 Günlük Rota",
  seoDescription:
    "Busan gezi rehberi: Haeundae, Gwangalli, Gamcheon, Jagalchi, havalimanı ulaşımı, kalınacak bölgeler, yemekler, 4 günlük plan ve güncel ipuçları.",
  h1: "Busan Gezi Rehberi",
  lede:
    "Busan tek bir sahil şeridi değil; doğuda tapınaklar ve Haeundae, merkezde Gwangalli ile Seomyeon, batıda pazarlar ve eski liman hayatından oluşan geniş bir deniz kentidir.",
  quickFacts: [
    { label: "Önerilen süre", value: "3–4 tam gün" },
    { label: "Havalimanı", value: "Gimhae PUS" },
    { label: "Ana tren garı", value: "Busan Station" },
    { label: "Şehir içi", value: "Metro + otobüs + yürüyüş" },
    { label: "Erken plan", value: "Sky Capsule · sahil sezonu" },
  ],
  sections: [
    {
      heading: "Busan gezisi nasıl planlanır? Doğu ile batıyı aynı güne sıkıştırmayın",
      id: "gezi-planlama",
      body: [
        "Busan haritada kompakt görünür ama Haeundae'den Gamcheon'a geçiş bir şehir değiştiriyormuş hissi verebilir. Doğu kıyısını Haeundae–Cheongsapo–Haedong Yonggungsa; merkez kıyıyı Gwangalli–Centum; batıyı Nampo–Jagalchi–Gukje–Gamcheon olarak kümelendirin. İlk ziyaret için üç tam gün, Taejongdae veya spa eklemek için dört gün ayırın.",
        "Mavi Hat Parkı'ndaki Beach Train ile Sky Capsule aynı deneyim değildir. Kapsül sınırlı kapasite ve yön/seansla satılır; deniz manzaralı popüler saatler için resmî kanaldan erken rezervasyon yapın. Rüzgâr ve işletme durumu planı değiştirebilir.",
        "Plajı yalnız yaz yüzmesi olarak görmeyin. Haeundae yürüyüş ve doğu bağlantıları, Gwangalli köprü manzarası ve akşam, Songjeong sörf atmosferi için farklıdır. Denize yalnız belirlenmiş yüzme alanında, cankurtaran ve sezon kurallarına uyarak girin.",
      ],
    },
    {
      heading: "Gimhae Havalimanı ve KTX ile Busan'a ulaşım",
      id: "ulasim",
      body: [
        "Gimhae Havalimanı'ndan **Busan–Gimhae Light Rail** ile Sasang'a gidip Metro 2'ye, Daejeo'da Metro 3'e aktarma yapılır. Seomyeon ve Haeundae için Sasang aktarması genellikle nettir; merdiven, valiz ve son sefer saatini hesaba katın. Otobüs güzergâhları değişebildiği için resmî havalimanı sayfasını kontrol edin.",
        "Seul'den KTX, Busan Station'a gelir. Bu istasyon Nampo'ya yakın, Haeundae'ye ise metro/otobüsle belirgin mesafededir. Oteli 'Busan' adını görerek değil, gezinizin doğu–batı ağırlığına göre seçin. Gyeongju KTX Station ile Busan arasında da hızlı tren vardır fakat iki uçtaki şehir içi aktarmayı toplam süreye ekleyin.",
        "T-money metro ve otobüslerde kullanılır; inerken otobüste yeniden okutun. Naver Map, durak yönünü ve gerçek zamanlı varışı okumada değerlidir. Yamaçlı mahallelerde haritanın kısa gösterdiği yürüyüş merdivenli olabilir.",
      ],
    },
    {
      heading: "Haeundae, Gwangalli ve sahil hattını doğru gezin",
      id: "sahil-hatti",
      body: [
        "Haeundae sabah sahil yürüyüşü, Dongbaekseom ve pazarla başlatılabilir. Blue Line Park için Mipo, Cheongsapo ve Songjeong duraklarının hangisinden bineceğinizi bilet yönüyle eşleştirin; kapsül bileti aynı gün her yönde esneklik sağlamayabilir.",
        "Haedong Yonggungsa deniz kıyısındaki konumuyla benzersizdir ama metro kapısında değildir. Haeundae'den otobüs/taksi bağlantısını ve merdivenleri hesaba katın; ibadet alanında fotoğraf sırası oluşturup yolu kapatmayın. Gün doğumu güzel olsa da resmî erişim saatini varsaymayın.",
        "Gwangalli'yi gündüz Haeundae kopyası sanmayın; asıl gücü Gwangan Köprüsü ışıkları, sahil restoranları ve akşam yürüyüşüdür. Dron gösterileri ve özel etkinlikler hava/güvenlik nedeniyle değişebilir; yalnız bunun için program kurmayın.",
      ],
    },
    {
      heading: "Nampo, Jagalchi ve Gamcheon'da eski liman Busan'ı",
      id: "eski-liman",
      body: [
        "Jagalchi Market'in balık satış katı ile üst kattaki restoranlar farklı fiyat ve sipariş düzenine sahip olabilir. Ürünü seçmeden önce hazırlama, masa ve pişirme ücretini sorun. Gukje Market ile BIFF Square'i yürüyerek bağlayın; ssiat hotteok gibi atıştırmalığı ana öğüne çevirmeyin.",
        "Gamcheon Culture Village hâlâ bir yerleşim bölgesidir. Sessiz olun, çatıya/merdivene özel mülk gibi davranın, dron uçurmayın ve çöp bırakmayın. Toseong veya Goejeong'dan köy otobüsüyle çıkmak dik tırmanışı azaltır; dönüşte yürüyüşü Nampo tarafına bağlayabilirsiniz.",
        "Taejongdae veya Huinnyeoul Culture Village batı gününe eklenebilir ama ikisini de aceleyle sıkıştırmak manzarayı araç beklemeye çevirir. Hava kapalıysa pazarlar, modern tarih müzeleri veya spa daha iyi yedektir.",
      ],
    },
    {
      heading: "Busan'da nerede kalınır? Ulaşım süresini manzarayla dengeleyin",
      id: "nerede-kalinir",
      body: [
        "**Seomyeon**, metro hatlarının kesişimi ve doğu–batı arasında en dengeli üs; denizi pencereden görmezsiniz. **Haeundae**, plaj ve doğu kıyısı için kolay, Nampo/Gamcheon için uzaktır. **Gwangalli**, akşam atmosferi ve köprü manzarası verir; bazı oteller istasyondan sahile uzun yürüyüştedir.",
        "**Nampo**, Jagalchi, pazarlar ve Busan Station'a yakınlık için güçlü; doğu plajlarına günlük uzun yol getirir. **Busan Station** çevresi erken KTX için işlevsel ama her turist için en karakterli üs değildir. Son gece tren saati veya uçuş yerine göre konaklamayı bölmek, her gün valiz taşımaktan daha iyi olabilir.",
        "Deniz manzaralı oda ilanında yapının yönünü, katı ve önündeki inşaatı yorumlardan kontrol edin. Yaz, festival ve hafta sonunda sahile yakın odalar hızla dolar; iptal koşulu esnek rezervasyon daha güvenlidir.",
      ],
    },
    {
      heading: "Busan'da ne yenir? Dwaeji gukbap'tan çiğ balığa",
      id: "ne-yenir",
      body: [
        "Dwaeji gukbap domuz eti ve pirinç çorbasıdır; 새우젓 (fermente karides), frenk soğanı ve baharatı azar azar ekleyin. Milmyeon, buğday ağırlıklı soğuk eriştesiyle yazın ferah; eomuk balık keki hızlı atıştırmalıktır. BIFF Square'de ssiat hotteok tatlı bir finaldir.",
        "Hoe yani çiğ balık siparişinde porsiyon, yan tabak ve servis biçimini açıklatın. Jagalchi'de alt kattan ürün seçip üstte pişirtme modeli her işletmede aynı değildir. Kabuklu deniz ürünü alerjisini Korece yazılı kartla bildirin.",
        "Pufferfish çorbası için lisanslı ve köklü işletme seçin; ev yapımı veya belirsiz kaynaktan denemeyin. Busan'da ödeme kartla yaygın olsa da pazar tezgâhları ve T-money yüklemesi için küçük miktar nakit taşıyın; bahşiş beklenmez.",
      ],
    },
  ],
  places: [
    { name: "Jagalchi Market", area: "Nampo", known: "Balık ve deniz ürünleri", why: "Liman kentinin ürün çeşitliliğini görmek ve sipariş düzenini anlayarak taze deniz ürünü denemek için.", price: "Orta", tip: "Ürün, pişirme ve masa ücretini satın almadan önce ayrı ayrı sorun." },
    { name: "Bonjeon Dwaeji Gukbap", area: "Busan Station", known: "Dwaeji gukbap", why: "Tren günü için kolay konumda, Busan'ın en temel kâse yemeklerinden birini denemek için.", price: "Ekonomik", tip: "Öğle kuyruğu olabilir; çorbayı önce sade tadın." },
    { name: "Geumsubokguk", area: "Haeundae", known: "Pufferfish çorbası", why: "Pufferfish'i profesyonel hazırlayan köklü bir ortamda, temiz ve hafif bir sabah öğünü için.", price: "Orta", tip: "Şube ve menü saatini resmî siteden doğrulayın." },
    { name: "Samjin Eomuk", area: "Yeongdo / Busan Station", known: "Eomuk çeşitleri", why: "Balık kekinin yalnız şişte soslu atıştırmalık olmadığını görmek için.", price: "Ekonomik", tip: "Sıcak servis ile paket ürünün tüketim düzenini karıştırmayın." },
    { name: "Halmae Gaya Milmyeon", area: "Nampo", known: "Milmyeon", why: "Sıcak günde hafif, hızlı ve Busan'a özgü bir erişte molası.", price: "Ekonomik", tip: "Acı sosu karıştırmadan önce et suyunu tadın." },
    { name: "BIFF Square tezgâhları", area: "Nampo", known: "Ssiat hotteok", why: "Tohum dolgulu sıcak tatlıyı eski sinema bölgesinin hareketi içinde denemek için.", price: "Ekonomik", tip: "Kuyruk tek başına kalite garantisi değildir; sıcak yağ ve yaya trafiğine dikkat edin." },
  ],
  itinerary: [
    { title: "1. Gün — Haeundae ve doğu kıyısı", morning: "Haedong Yonggungsa'ya erken gidip merdivenli tapınak alanını sakin gezin.", afternoon: "Mipo–Cheongsapo arasında rezervasyonunuza göre Beach Train veya Sky Capsule.", evening: "Haeundae Market ve Dongbaekseom sahil yürüyüşü." },
    { title: "2. Gün — Gwangalli ve Centum", morning: "Spa Land ya da Busan Museum of Art gibi tek kapalı durak.", afternoon: "Suyeong veya Millak çevresi, sahil kafeleri ve dinlenme.", evening: "Gwangalli'de köprü manzarası ve deniz ürünü yemeği." },
    { title: "3. Gün — Gamcheon, Jagalchi ve Nampo", morning: "Toseong üzerinden Gamcheon; yaşayan mahalle kurallarına uyan kısa rota.", afternoon: "Jagalchi, Gukje Market ve BIFF Square.", evening: "Yongdusan Park veya liman ışıkları; Nampo'da milmyeon." },
    { title: "4. Gün — Taejongdae veya yerel mahalleler", morning: "Hava açıksa Taejongdae; sisliyse müze veya kaplıca alternatifi.", afternoon: "Huinnyeoul ya da Yeongdo'da tek odaklı yürüyüş.", evening: "Seomyeon'da dwaeji gukbap ve son alışveriş." },
  ],
  practicalHeading: "Busan'da yanlış bölge ve bilet seçimini önleyen notlar",
  practicalTips: [
    { title: "Sky Capsule yönünü okuyun", body: "Mipo ve Cheongsapo başlangıçları aynı değildir; saat, yön ve kişi sayısı seçiminizi ödeme öncesi kontrol edin." },
    { title: "Gamcheon'da sessiz olun", body: "Burası dekor değil evlerin bulunduğu mahalledir. Dron, özel çatı ve kapı önü fotoğrafından kaçının." },
    { title: "Jagalchi'de toplamı sorun", body: "Balık bedeli, hazırlama ve masa ücreti ayrı olabilir. Siparişten önce nihai düzeni netleştirin." },
    { title: "Doğu ile batıya ayrı gün verin", body: "Haeundae–Gamcheon geçişi uzundur. Bir güne iki kıyı ucunu koymak metroda vakit kaybettirir." },
    { title: "Yüzme sezonunu doğrulayın", body: "Plajın açık olması cankurtaranlı yüzme alanının açık olduğu anlamına gelmez; bayrak ve görevli uyarısına uyun." },
    { title: "Havalimanında Light Rail işaretini izleyin", body: "Sasang veya Daejeo'da metroya aktarma gerekir; son bağlantı ve asansör için pay bırakın." },
  ],
  faqs: [
    { q: "Busan için kaç gün gerekir?", a: "Doğu kıyısı, Gwangalli ve eski liman için 3 tam gün; Taejongdae, spa veya daha sakin bir gün için 4 gün idealdir." },
    { q: "Busan'da nerede kalınır?", a: "İlk ziyaret ve denge için Seomyeon, plaj için Haeundae, akşam manzarası için Gwangalli, pazarlar için Nampo uygundur." },
    { q: "Seul'den Busan'a nasıl gidilir?", a: "KTX, merkezden merkeze en pratik bağlantıdır ve Busan Station'a gelir. Haeundae'ye ayrıca metro veya otobüs yolculuğu gerekir." },
    { q: "Gimhae Havalimanı'ndan Haeundae'ye nasıl gidilir?", a: "Light Rail ile Sasang'a, oradan Metro 2'ye geçilebilir. Valiz ve gece varışında güncel limuzin otobüsü veya resmî taksiyle karşılaştırın." },
    { q: "Visit Busan Pass almaya değer mi?", a: "Dahil ücretli noktaları gerçekçi sürede gezecekseniz değerli olabilir. Fiziksel kartın ulaşım bakiyesi ile turistik haklarını aynı şey sanmayın; güncel listeyi hesaplayın." },
    { q: "Busan'da denize ne zaman girilir?", a: "Resmî yüzme sezonu ve cankurtaran düzeni plaja ve yıla göre değişir. Sadece belirlenmiş alanda, o günkü deniz uyarısına uyarak yüzün." },
  ],
  relatedGuides: [
    { city: "Gyeongju", anchor: "Busan'dan Gyeongju'ya: Silla başkentine kısa geçiş", description: "KTX veya şehirlerarası otobüsle tümülüsler, Bulguksa ve gece aydınlatmalarını üç güne yayın." },
    { city: "Seul", anchor: "Busan'dan Seul'e: KTX ile başkente", description: "Saraylar, yaratıcı mahalleler ve Han Nehri için en az dört tam gün ayırın." },
    { city: "Jeju Adası", anchor: "Busan'dan Jeju'ya: uçuşla ada rotası", description: "Kıyı kentinden volkanik adaya geçip Hallasan, doğu ve güney kıyısını ayrı günlerde gezin." },
    { city: "Sokcho", anchor: "Busan'dan Sokcho'ya: iki kıyı şehrini karşılaştırın", description: "Uzun kara transferini ayrı seyahat ayağı sayıp Seoraksan için hava yedeği bırakın." },
    { city: "Incheon", anchor: "Busan'dan Incheon'a: liman tarihinin başka yüzü", description: "Eski liman, Chinatown ve Songdo'yu havalimanı transferinden ayrı bir şehir olarak keşfedin." },
  ],
  sources: [
    { name: "Visit Busan — resmî şehir rehberi", url: "https://visitbusan.net/en/index.do" },
    { name: "Visit Busan Pass", url: "https://www.visitbusan.net/en/index.do?menuCd=DOM_000000303012007000" },
    { name: "Gimhae Airport — Light Rail", url: "https://www.airport.co.kr/gimhaeeng/cms/frCon/index.do?CONTENTS_NO=3&MENU_ID=110" },
    { name: "Gimhae Airport — otobüs erişimi", url: "https://www.airport.co.kr/gimhaeeng/cms/frCon/index.do?CONTENTS_NO=1&MENU_ID=110" },
    { name: "Visit Busan — Gamcheon Culture Village", url: "https://www.visitbusan.net/index.do?lang_cd=en&menuCd=DOM_000000301001001000&uc_seq=365" },
    { name: "Korea transportation guide", url: "https://english.visitkorea.or.kr/public/contents/travel/KoreaTransportationGuide_enu.pdf" },
    { name: "Busan Metropolitan City — Taste of Busan", url: "https://www.busan.go.kr/PageDownload.do?savename=TasteofBusanGuideMap2024_EN.pdf" },
  ],
  volatileNote: "Sky Capsule biletleri, plaj yüzme sezonu, dron gösterileri, havalimanı otobüsleri ve restoran saatleri değişebilir. Resmî kaynakları seyahat gününde doğrulayın.",
  reviewed: "2026-08-10",
};

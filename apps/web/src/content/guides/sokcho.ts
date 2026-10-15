import { CityGuide } from "./types";

/** Sokcho rehberi — Ağustos 2026 resmî kaynak araştırması. */
export const sokcho: CityGuide = {
  city: "Sokcho",
  countryCode: "KR",
  seoTitle: "Sokcho Gezi Rehberi: Seoraksan, Ulaşım ve 3 Günlük Rota",
  seoDescription: "Sokcho gezi rehberi: Seul'den otobüs, Seoraksan parkurları ve teleferik, kalınacak bölgeler, deniz ürünleri, 3 günlük rota ve güncel bilgiler.",
  h1: "Sokcho Gezi Rehberi",
  lede: "Sokcho, Seoraksan'ın granit zirveleri ile Doğu Denizi arasına sıkışmış; sabah dağ yürüyüşü, öğleden sonra pazar ve akşam sahil sunan küçük ama koşullara duyarlı bir şehir.",
  quickFacts: [
    { label: "Önerilen süre", value: "2–3 tam gün" },
    { label: "Seul bağlantısı", value: "Şehirlerarası ekspres otobüs" },
    { label: "Seoraksan", value: "7 / 7-1 otobüsü + güncel BIS" },
    { label: "Teleferik", value: "Aynı gün gişe · hava koşullu" },
    { label: "Yoğun sezon", value: "Ekim yaprak dönemi" },
  ],
  sections: [
    { heading: "Sokcho gezisi nasıl planlanır? Dağ gününü koruyun", id: "gezi-planlama", body: [
      "Sokcho için bir tam Seoraksan günü, bir pazar–Abai Village–sahil günü ayırın; üçüncü gün Yeongnangho, müze veya hava yedeğidir. Seul'den sabah gelip aynı gün uzun zirve parkuru yapmak yerine gece önceden kalın.",
      "Dağ hava tahmini kıyı merkezinden farklı olabilir. Yağmur, kuvvetli rüzgâr, yangın riski veya mevsimsel koruma patikaları kapatır. KNPS duyurusunu önceki akşam ve sabah kontrol edin; kapalı bariyeri geçmeyin.",
      "Sonbahar yaprak zirvesinde şehir içi yol, park girişi ve otobüsler olağanüstü kalabalıklaşır. Hafta içi gidin, ilk otobüsü hedefleyin ve tek bir manzara noktası yerine süreye uygun parkur seçin." ] },
    { heading: "Seul'den Sokcho'ya ulaşım ve şehir içi otobüsler", id: "ulasim", body: [
      "Sokcho'ya çalışan yolcu treni yoktur; Seul'de servise göre Dong Seoul Bus Terminal veya Express Bus Terminal kalkışlı otobüs kullanılır. Bileti alırken kalkış terminalini ve Sokcho'daki varış terminalini kontrol edin; iki şehirde de terminal adları birbirinin yerine geçmez.",
      "Seoraksan'ın Sokcho girişine 7 ve 7-1 hatları hizmet verir; güzergâh, sıklık ve yoğunluk değişir. Sokcho BIS üzerinden güncel varışı görün ve dönüşte son aracı beklemeyin. Sonbaharda taksi de trafikten etkilenir.",
      "Sokcho merkezi yürünebilir bölümler sunsa da plaj, Yeongnangho ve Seoraksan farklı yönlerdedir. T-money otobüste işe yarar; inerken okutun. Bisiklet göl/sahil için güzel, dağ ulaşımının yerine geçmez." ] },
    { heading: "Seoraksan parkurları ve teleferik gerçeği", id: "seoraksan", body: [
      "İlk kez gelenler için Biryong Falls, Biseondae veya Heundeulbawi süre ve zorluk bakımından daha gerçekçi rotalardır. Ulsanbawi dik merdivenli, uzun ve hava açıkken anlamlıdır; Daecheongbong ise ciddi tam gün/dağ planıdır. Harita süresini fotoğraf, mola ve iniş payı olmadan kullanmayın.",
      "Seorak Cable Car önceden online rezervasyon kabul etmez; bilet aynı gün sahadaki gişeden, hava ve işletme durumuna göre satılır. Teleferik sizi Ulsanbawi veya ana zirveye çıkarmaz. Kuyruk uzunsa günün tamamını beklemek yerine vadi parkuruna geçin.",
      "Park girişi ücretsiz olabilir ama tapınak yapıları, teleferik, otopark veya hizmetlerin ayrı ücreti olabilir. 2026'da bazı kamp alanları/tesislerde yenileme kapanışları bulunur; konaklama veya kampı varsaymadan KNPS duyurusunu okuyun." ] },
    { heading: "Abai Village, pazar ve Doğu Denizi kıyısı", id: "sehir-sahil", body: [
      "Abai Village, Kore Savaşı sırasında kuzeyden gelen yerinden edilmiş toplulukların tarihini taşır. Gaetbae elle çekilen küçük feribot geçişi bir eğlence dekorundan fazlasıdır; tarih levhalarını okuyun ve yoğunlukta geçişi engellemeyin.",
      "Sokcho Tourist & Fishery Market'te dakgangjeong, deniz ürünü ve kurutulmuş balık tezgâhları vardır. Ünlü tek kutu kuyruğu yerine ürünleri paylaşın; sıcak tavuğun kapağını hemen kapatmanın dokuyu yumuşatacağını bilin.",
      "Sokcho Beach yüzme sezonu dışında da yürüyüş için açık olabilir; bu güvenli yüzme anlamına gelmez. Yeongnangho daha sakin göl rotası sunar. Dalgakıran ve kayalarda fırtınalı denizde fotoğraf için yaklaşmayın." ] },
    { heading: "Sokcho'da nerede kalınır?", id: "nerede-kalinir", body: [
      "**Express Bus Terminal ve Sokcho Beach**, Seul bağlantısı, sahil ve akşam için pratik. **Jungang Market/merkez**, yemek ve Abai Village için iyi; Seoraksan otobüs durağını kontrol edin. **Seorak-dong**, ilk patikaya yakın ama akşam restoran ve şehir seçenekleri sınırlı olabilir.",
      "Sonbaharda dağ girişindeki oda fiyatı ve minimum konaklama değişir. Parka yakın olmanın trafik avantajı kadar yemek/market dezavantajını da tartın. Erken otobüs için şehirde kalıyorsanız durağın doğru yönünü bir gün önce görün.",
      "Deniz manzaralı otelde balkon ve cepheyi, spa/pool için mevsimsel işletmeyi doğrulayın. Seul'e dönüş biletinizi yaprak sezonunda son dakikaya bırakmayın." ] },
    { heading: "Sokcho'da ne yenir? Abai sundae, kalamar ve soğuk erişte", id: "ne-yenir", body: [
      "Ojingeo sundae, kalamar gövdesinin erişte/sebze dolguyla hazırlanması; Abai sundae ise büyük bağırsak ve daha yoğun dolguyla kuzey kökenli yorumdur. Karışık tabak, ikisini kıyaslamak için iyi başlangıçtır.",
      "Mulhoe buzlu, acı-ekşi sos içinde çiğ deniz ürünüdür; hangi balığın kullanıldığını ve alerjiyi sorun. Hamheung naengmyeon, yerinden edilmiş topluluklarla şehre gelen çiğ balıklı/acılı erişte geleneğini sürdürür. Acı sosu tamamen karıştırmadan tadın.",
      "Dakgangjeong seyahat atıştırmalığıdır ama büyük kutu ağırdır. Seoraksan çevresinde sundubu ve makguksu yürüyüş sonrası daha dengeli öğündür. Bahşiş beklenmez; pazar için nakit taşıyın." ] },
  ],
  places: [
    { name: "Sokcho Tourist & Fishery Market", area: "Jungang-dong", known: "Dakgangjeong, balık ve pazar yemekleri", why: "Şehrin deniz ve sokak mutfağını tek yürüyüşte karşılaştırmak için.", price: "Ekonomik", tip: "Tek kuyrukta vakit kaybetmeyin; porsiyonları paylaşın." },
    { name: "Danchon Sikdang", area: "Abai Village", known: "Abai sundae ve ojingeo sundae", why: "İki dolma geleneğini tarihî mahallesinde yan yana tatmak için.", price: "Orta", tip: "Porsiyon ve mola saatini kontrol edin." },
    { name: "Cheongchosu Mulhoe", area: "Cheongchoho", known: "Mulhoe", why: "Deniz manzarasıyla soğuk, acı-ekşi deniz ürünü kasesi denemek için.", price: "Orta", tip: "Çiğ ürün ve kabuklu alerjinizi önceden bildirin." },
    { name: "Hamheung Naengmyeonok", area: "Merkez", known: "Hamheung usulü naengmyeon", why: "Kuzeyden taşınan erişte geleneğini Sokcho bağlamında anlamak için.", price: "Ekonomik", tip: "Acı sosu yavaş ekleyin; çalışma gününü doğrulayın." },
    { name: "Bongpo Meoguri Jip", area: "Cheongchoho", known: "Mulhoe ve deniz ürünleri", why: "Geniş deniz ürünü seçkisinde grupça paylaşmalı öğün için.", price: "Orta", tip: "Şube ve bekleme sistemini kontrol edin." },
    { name: "Mansuk Dakgangjeong", area: "Jungang Market", known: "Dakgangjeong", why: "Sokcho'nun seyahatlik kızarmış tavuk klasiğini küçük porsiyonla denemek için.", price: "Ekonomik", tip: "Kutuyu uzun süre sıcakken kapalı tutmayın; şubeyi doğrulayın." },
  ],
  itinerary: [
    { title: "1. Gün — Pazar ve Abai Village", morning: "Seul'den otobüs, bagaj bırakma ve hafif göl yürüyüşü.", afternoon: "Abai Village, gaetbae ve yerinden edilme tarihini anlatan duraklar.", evening: "Jungang Market'te küçük porsiyonlar, Sokcho Beach gün batımı." },
    { title: "2. Gün — Seoraksan", morning: "İlk uygun otobüs; KNPS duyurusuna göre Biseondae, Biryong veya Ulsanbawi seçimi.", afternoon: "Aynı parkurun güvenli inişi; teleferik yalnız sıra/hava uygunsa.", evening: "Sundubu veya makguksu, sıcak duş ve erken dinlenme." },
    { title: "3. Gün — Yeongnangho ve kıyı", morning: "Yeongnangho yürüyüşü/bisiklet; hava kötü ise müze.", afternoon: "Deniz feneri çevresi ya da sakin kafe, dönüş otobüsüne geniş pay.", evening: "Terminale erken geçiş; Seul'deki doğru varış terminalini kaydedin." },
  ],
  practicalHeading: "Sokcho'da dağ gününü kurtaran bilgiler",
  practicalTips: [
    { title: "Teleferiği ana plan yapmayın", body: "Ön rezervasyon yoktur ve rüzgârda durabilir. Alternatif vadi parkurunu önceden seçin." },
    { title: "Seul terminal adını okuyun", body: "Dong Seoul ile Express Bus Terminal farklıdır; biletteki kalkış ve dönüş terminalini eşleştirin." },
    { title: "7/7-1'i aynı gün doğrulayın", body: "Seoraksan otobüsünün sıklığı ve trafik süresi değişir; BIS'ten gerçek zamanlı bakın." },
    { title: "Kapalı patikaya girmeyin", body: "Yangın, yağmur veya koruma kapanışı güvenlik kararıdır; bariyer dışı fotoğraf için risk almayın." },
    { title: "Sonbaharda ilk otobüsü hedefleyin", body: "Yaprak döneminde yol ve gişe yoğunluğu saatler kaybettirebilir." },
    { title: "Çiğ deniz ürününü bilinçli seçin", body: "Alerji, hamilelik veya bağışıklık riski varsa pişmiş alternatif isteyin." },
  ],
  faqs: [
    { q: "Sokcho için kaç gün gerekir?", a: "Bir Seoraksan ve bir şehir/sahil günü için 2 tam gün; hava yedeği ve Yeongnangho için 3 gün idealdir." },
    { q: "Seul'den Sokcho'ya nasıl gidilir?", a: "Servise göre Dong Seoul veya Express Bus Terminal'dan şehirlerarası otobüs kullanılır. Kalkış terminalini bilette kontrol edin." },
    { q: "Sokcho'dan Seoraksan'a nasıl gidilir?", a: "7 veya 7-1 şehir otobüsü yaygın bağlantıdır; güncel durak, gerçek zaman ve son dönüşü Sokcho BIS'ten doğrulayın." },
    { q: "Seoraksan teleferiği önceden alınır mı?", a: "Hayır; bilet aynı gün gişede ve hava/işletme durumuna göre satılır. Teleferik Ulsanbawi'ye çıkmaz." },
    { q: "Sokcho'da nerede kalınır?", a: "Otobüs ve sahil için Express Terminal çevresi, yemek için merkez/pazar, ilk yürüyüş için Seorak-dong uygundur." },
    { q: "Seoraksan'a giriş ücretli mi?", a: "Millî park ana girişi ücretsiz olabilir; teleferik, tapınak tesisi, otopark veya başka hizmetler ayrı ücretlidir. Güncel durumu kontrol edin." },
  ],
  relatedGuides: [
    { city: "Seul", anchor: "Sokcho'dan Seul'e: dağdan metropole", description: "Otobüs terminalini doğru seçip saraylar ve mahalleler için beş günlük başkent rotası kurun." },
    { city: "Incheon", anchor: "Sokcho'dan Incheon'a: uçuş öncesi doğru aktarma", description: "Seul üzerinden havalimanı ile şehir merkezinin farkını hesaba katın; dar bağlantı planlamayın." },
    { city: "Busan", anchor: "Sokcho'dan Busan'a: Doğu kıyısından güneye", description: "Uzun transferi ayrı gün sayıp Haeundae ile Nampo'yu farklı günlere bölün." },
    { city: "Gyeongju", anchor: "Sokcho'dan Gyeongju'ya: dağdan Silla mirasına", description: "Kara ulaşımını hafife almadan tümülüsler, müze ve Bulguksa için üç gün bırakın." },
    { city: "Jeju Adası", anchor: "Sokcho'dan Jeju'ya: iki büyük doğa ayağı", description: "Uçuş bağlantısı sonrası Hallasan gününe dinlenme ve hava yedeği ekleyin." },
  ],
  sources: [
    { name: "Sokcho resmî turizm portalı", url: "https://www.sokcho.go.kr/ct/tour" },
    { name: "Sokcho ulaşım rehberi", url: "https://www.sokcho.go.kr/ct/tour/tour_guide/traffic" },
    { name: "Sokcho Bus Information System", url: "https://bis.sokcho.go.kr/schedule" },
    { name: "Sokcho — önerilen Seoraksan rotaları", url: "https://www.sokcho.go.kr/ct/tour/recommend" },
    { name: "Korea National Park Service — duyurular", url: "https://res.knps.or.kr/foreigner/community/board/noticeen/boardList.do" },
    { name: "Seorak Cable Car", url: "https://www.sorakcablecar.co.kr" },
    { name: "Sokcho yemek rehberi", url: "https://sokcho.go.kr/ct/tour/pleasure/food" },
    { name: "Sokcho walking map", url: "https://sokcho.go.kr/ct/page/sokchotour/download/Walking_Tour_Map_English.pdf" },
  ],
  volatileNote: "Dağ kapanışları, teleferik çalışması, otobüs ve kamp alanı düzeni hava/yangın/yenilemeye göre değişebilir. KNPS ile Sokcho BIS'i aynı gün kontrol edin.",
  reviewed: "2026-08-10",
};

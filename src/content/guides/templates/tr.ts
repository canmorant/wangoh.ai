import type { GuideTemplates } from "./types";

/** Fabrikaların özgün Türkçe kalıpları — birebir, değiştirmeyin (bkz. types.ts). */
export const tr: GuideTemplates = {
  expanded: {
    seoTitle: (city, focus) => `${city} Gezi Rehberi: ${focus}`,
    metaLead: (city, lede) => `${city} gezi rehberi: ${lede}`,
    h1: (city) => `${city} Gezi Rehberi`,
    characterHeading: (city) => `${city} nasıl bir yer? Rotayı doğru kurmak`,
    sightsHeading: (city) => `${city}'ta gezilecek yerler`,
    sightsIntro: (city) =>
      `Listeyi haritadaki yakınlığa göre kümelendirmek, ${city}'ta aynı yolu tekrar yürümeyi ve günün iyi ışığını transferde harcamayı önler. Biletli büyük durakları sabitleyin; meydan, park, pazar ve kıyı yürüyüşlerini aralara yerleştirin.`,
    foodHeading: (city) => `${city} yeme içme rehberi`,
    footballHeading: (city) => `${city}'ta futbol ve maç günü`,
    practicalHeading: (city) => `${city}'ta bilmeden gitmemeniz gerekenler`,
  },
  shared: {
    bold: (name, detail) => `**${name}:** ${detail}`,
    bookingOrder: (sight) =>
      `${sight}, şehirler arası bağlantı ve konaklamayı önce; esnek mahalle öğünlerini sonra sabitleyin.`,
    dailyPace: (city) =>
      `Aynı güne üç uzak bölge koymayın. ${city}'ta bir ana deneyim, bir mahalle ve uzun bir öğün daha sürdürülebilir bir ritim verir.`,
    faqDays: (city) => `${city} için kaç gün gerekir?`,
    faqStay: (city) => `${city}'ta nerede kalınır?`,
    faqWhen: (city) => `${city}'a ne zaman gidilir?`,
    faqCombine: (city) => `${city} hangi rota ile birleştirilir?`,
    relatedAnchor: (city) => `${city} gezi rehberi`,
    relatedDescription: (city) => `${city} sonrasında farklı bir şehir ritmi ve yeni bir rota katmanı ekler.`,
    day1Morning: (sight) =>
      `${sight} için erken başlayın; giriş veya ulaşım belirsizliğini günün başında çözün.`,
    day2Morning: (sight) => `${sight} çevresindeki ana rotayı kalabalık büyümeden tamamlayın.`,
    day3Morning: (sight) => `${sight} için hava, bilet veya transfer durumunu bir gece önce doğrulayın.`,
  },
  regional: {
    character: (city, area1, area2, s1, s2, s3) =>
      `${city}'ı iyi okumak için ${area1} ile ${area2} arasında yalnız simgeleri değil, gündelik hayatı da izleyin. ${s1}, ${s2} ve ${s3} aynı güne sıkıştırılmak zorunda değildir; bir ana deneyim, bir mahalle ve uzun bir öğün daha güçlü bir ritim verir.`,
    stay: (area1, area2) =>
      `İlk ziyarette ${area1} çevresi ana gezi hattına yakınlık sağlar; daha yerel akşam ve çoğu zaman daha sakin konaklama için ${area2} iyi bir alternatiftir. Yalnız haritadaki kilometreye değil, sabah çıkışına ve son toplu taşıma saatine bakın.`,
    evening: (area2, sight) =>
      `${area2} çevresinde akşam yemeği ve kısa bir yürüyüş planlayın. Gece hayatını ertesi sabahın ${sight} rezervasyonunu bozmayacak ölçüde tutun; geç dönüşte lisanslı taksi veya resmî uygulama kullanın.`,
    souvenirs: (food) =>
      `${food} ve yerel üretim ürünleri iyi hediyedir. Koruma altındaki doğal ürünleri, belgesiz antikaları veya bagaj ve gümrük kuralı belirsiz gıdaları satın almayın.`,
    season: (best) =>
      `${best} çoğu ziyaretçi için en dengeli pencere olsa da hava ortalaması günlük tahmin değildir. Şehir, kıyı veya dağ gününü son 48 saatte resmî hava ve işletme duyurusuyla yeniden sıralayın.`,
    budget: (sight) =>
      `Önce konaklama, şehirler arası bağlantı ve ${sight} gibi ana deneyimi fiyatlandırın. Ardından yerel ulaşım, öğün, bagaj ve son kilometre transferine pay ayırın; yalnız uçak ve otel toplamını gezi bütçesi sanmayın.`,
    day1Title: (sight) => `1. Gün — ${sight} ve ilk mahalle`,
    day1Afternoon: (area) => `${area} çevresini yürüyün ve plansız bir kahve molası bırakın.`,
    day1Evening: (food) => `${food} odağında sakin bir akşam yemeğiyle günü kapatın.`,
    day2Title: (sight) => `2. Gün — ${sight} ve yerel ritim`,
    day2Afternoon: (area) => `${area} tarafında küçük sokak, pazar ve gündelik yaşamı programa ekleyin.`,
    day2Evening: (food) => `${food} için içerik, porsiyon ve rezervasyonu önceden konuşun.`,
    day3Title: (sight) => `3. Gün — ${sight} ve çevre`,
    day3Afternoon: (dayTrip) => `${dayTrip} planını enerji ve son dönüşe göre uygulayın.`,
    faqDaysAnswer: (days) =>
      `${days} dengeli bir ilk ziyaret sağlar. Mahalle, yemek ve olası hava/ulaşım gecikmesi için boşluk bırakırsanız gezi daha anlamlı olur.`,
    faqStayAnswer: (area1, area2) =>
      `${area1} ilk ziyaret için pratik; ${area2} daha yerel bir alternatiftir. Sabah ve gece bağlantısını oda fiyatıyla birlikte değerlendirin.`,
    faqWhenAnswer: (best) =>
      `${best} genel olarak en dengeli dönemdir; yine de son hava, festival ve kapasite durumunu resmî kaynaktan kontrol edin.`,
    faqCarQuestion: (city) => `${city}'ta araç gerekir mi?`,
    faqCarAnswer: (local) =>
      `${local} Kiralamadan önce otopark, ehliyet, sigorta, yakıt ve gece dönüşünü birlikte değerlendirin.`,
    faqCombineAnswer: (cities) =>
      `${cities} doğal devam seçenekleridir. Harita mesafesi yerine kapıdan kapıya süreyi kullanın.`,
  },
  world: {
    shopping: (city) =>
      `${city}'ta alışverişi tek bir turistik çarşıya sıkıştırmayın. Yerel üretim, tasarım veya gıda hediyesi alırken etiket, sabit fiyat ve bagaj kuralını kontrol edin; koruma altındaki doğal ürünleri ve belgesiz antikaları satın almayın.`,
    season: (best) =>
      `Takvimde ${best} öne çıksa da okul tatili, ulusal bayram, festival ve hafta sonu yoğunluğu deneyimi değiştirebilir. Hava ortalamasını son dakika tahmini sanmayın; açık hava gününe kapalı mekân veya yavaş mahalle yürüyüşü alternatifi ekleyin.`,
    budget: (sight) =>
      `Konaklama, şehirler arası bağlantı ve ${sight} gibi ana deneyimleri önce fiyatlandırın. Küçük ödemeler, bagaj, rezervasyon komisyonu ve son kilometre transferi için ayrı pay bırakın; yalnız uçak ve otel toplamını seyahat bütçesi sanmayın.`,
    day1Title: (sight) => `1. Gün — ${sight} ve şehirle tanışma`,
    day1Afternoon: (area) => `${area} çevresini yürüyerek okuyun ve plansız bir kahve molası bırakın.`,
    day1Evening: (taste) => `Akşamı ${taste.toLocaleLowerCase("tr")} odağında sakin bir yemekle tamamlayın.`,
    day2Title: (sight) => `2. Gün — ${sight} ve mahalleler`,
    day2Afternoon: (area) =>
      `${area} tarafında küçük sokak, pazar ve yerel gündelik hayatı programa ekleyin.`,
    day3Title: (sight) => `3. Gün — ${sight} ve esnek kapanış`,
    faqDaysAnswer: (days) =>
      `${days} dengeli bir ilk ziyaret sağlar. Ana gezi noktalarını işaretlemek yerine mahalle, yemek ve olası hava/ulaşım gecikmesi için boşluk bırakırsanız şehir daha anlamlı açılır.`,
    faqWhenAnswer: (best, season) => `${best} genel olarak en dengeli dönemdir. ${season}`,
    faqCarQuestion: (city) => `${city}'ta araç kiralamak gerekir mi?`,
    faqCarAnswer: (local) =>
      `${local} Araç kararı vermeden otopark, ehliyet, sigorta ve gece dönüşünü birlikte değerlendirin.`,
    faqCombineAnswer: (cities) =>
      `${cities} bu rehberdeki doğal devam seçenekleridir. Yalnız haritadaki mesafeye değil, gerçek kapıdan kapıya ulaşım süresine bakın.`,
  },
};

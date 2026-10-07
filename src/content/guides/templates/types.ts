/**
 * Rehber fabrikalarının içine değişken yerleştiren cümle kalıpları.
 *
 * Sabit cümleler (değişkensiz) buraya girmez; onlar çeviri belleğinden
 * (content/i18n) çevriliyor. Burada yalnızca şehir adı, semt, gezi noktası
 * gibi değerlerin cümle içine yerleştiği kalıplar var — çünkü her dilin söz
 * dizimi ve çekim ekleri farklı.
 *
 * Tüm argümanlar zaten hedef dilde gelir (yerelleştirilmiş şehir adı,
 * çevrilmiş semt adı…). tr paketi fabrikaların Türkçe kalıplarıdır; şehir
 * adına gelen çekim ekleri src/lib/turkish.ts ile ünlü uyumuna göre getirilir,
 * kalıpların geri kalanı eskisiyle aynıdır.
 */
export interface GuideTemplates {
  expanded: {
    seoTitle(city: string, focus: string): string;
    metaLead(city: string, lede: string): string;
    h1(city: string): string;
    characterHeading(city: string): string;
    sightsHeading(city: string): string;
    sightsIntro(city: string): string;
    foodHeading(city: string): string;
    footballHeading(city: string): string;
    practicalHeading(city: string): string;
    /**
     * İsteğe bağlı: sabit bölüm başlıklarının o dilin arama alışkanlığına
     * göre kurulmuş hâlleri ("Where to stay in Lisbon", "Best time to visit
     * Lisbon"). Verilmeyen dilde başlık, Türkçe başlığın çeviri belleğindeki
     * karşılığıdır.
     */
    /**
     * true: rehberin giriş/vize metinleri bu dilde uyruktan bağımsız yazıldı;
     * Türk pasaportuna özel kaynak bağlantıları ("audience: tr") gösterilmez.
     */
    internationalAudience?: boolean;
    /**
     * true: ülke düzeyindeki bilgiler (giriş, para, dil, telefon, bütçe
     * çerçevesi) şehir sayfalarında tekrar edilmez, ülke sayfasındaki "pratik
     * bilgiler" bölümünde bir kez verilir; şehir sayfası oraya bağlanır.
     * Şehre özgü bilgi taşımayan kalıp cümleler (genel ipuçları, alışveriş
     * notu, ilgili rehber açıklaması) da bu dilde üretilmez.
     */
    compact?: boolean;
    sectionHeadings?: {
      neighborhoods(city: string): string;
      stay(city: string): string;
      transport(city: string): string;
      nightlife(city: string): string;
      dayTrips(city: string): string;
      when(city: string): string;
      budget(city: string): string;
      apps(city: string): string;
      safety(city: string): string;
    };
  };
  /** regionalFactory ve worldExpansionFactory'nin ortak kalıpları. */
  shared: {
    bold(name: string, detail: string): string;
    bookingOrder(sight: string): string;
    dailyPace(city: string): string;
    faqDays(city: string): string;
    faqStay(city: string): string;
    faqWhen(city: string): string;
    /** İsteğe bağlı: ulaşım metni gerçek cümleyse SSS'ye "X'e nasıl gidilir?" eklenir. */
    faqHowToGet?(city: string): string;
    faqCombine(city: string): string;
    relatedAnchor(city: string): string;
    relatedDescription(city: string): string;
    day1Morning(sight: string): string;
    day2Morning(sight: string): string;
    day3Morning(sight: string): string;
  };
  regional: {
    character(city: string, area1: string, area2: string, s1: string, s2: string, s3: string): string;
    stay(area1: string, area2: string): string;
    evening(area2: string, sight: string): string;
    souvenirs(food: string): string;
    season(best: string): string;
    budget(sight: string): string;
    day1Title(sight: string): string;
    day1Afternoon(area: string): string;
    day1Evening(food: string): string;
    day2Title(sight: string): string;
    day2Afternoon(area: string): string;
    day2Evening(food: string): string;
    day3Title(sight: string): string;
    day3Afternoon(dayTrip: string): string;
    faqDaysAnswer(days: string): string;
    faqStayAnswer(area1: string, area2: string): string;
    faqWhenAnswer(best: string): string;
    faqCarQuestion(city: string): string;
    faqCarAnswer(local: string): string;
    faqCombineAnswer(cities: string): string;
  };
  world: {
    shopping(city: string): string;
    season(best: string): string;
    budget(sight: string): string;
    day1Title(sight: string): string;
    day1Afternoon(area: string): string;
    /** Lezzet metninin ilk cümlesi, özgün büyük/küçük harfiyle. */
    day1Evening(taste: string): string;
    day2Title(sight: string): string;
    day2Afternoon(area: string): string;
    day3Title(sight: string): string;
    faqDaysAnswer(days: string): string;
    faqWhenAnswer(best: string, season: string): string;
    faqCarQuestion(city: string): string;
    faqCarAnswer(local: string): string;
    faqCombineAnswer(cities: string): string;
  };
}

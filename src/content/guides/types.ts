/**
 * Şehir rehberi içerik şeması.
 *
 * Rehberler bileşen değil VERİ olarak tutuluyor: yeni bir şehir eklemek tek bir
 * dosya yazmak demek, sayfa/SEO/şema altyapısı otomatik devralıyor.
 *
 * DOĞRULUK KURALI
 * ---------------
 * Bu dosyalarda uydurma bilgi yok. Sık değişen her şey (fiyat, çalışma saati,
 * bir mekânın açık olup olmadığı) ya `volatile` notuyla işaretlenir ya da hiç
 * yazılmaz. Kalıcı bilgiler — semtler, ulaşım hatları, mutfak, mevsimler,
 * görgü kuralları — rehberin omurgasını oluşturur.
 */

export interface GuideSection {
  /** H2 başlığı. */
  heading: string;
  /** URL fragmentı ve içindekiler için. */
  id: string;
  /** Paragraflar. */
  body: string[];
  /** İsteğe bağlı H3 alt bölümleri. */
  subsections?: { heading: string; body: string[] }[];
}

export interface PlaceCard {
  name: string;
  /** Semt / bölge. */
  area: string;
  /** Ne ile bilinir. */
  known: string;
  /** Neden gidilir — editoryal ses. */
  why: string;
  /** "₺" benzeri kaba kategori; kesin fiyat asla yazılmaz. */
  price?: "Ekonomik" | "Orta" | "Yüksek";
  /** Rezervasyon / sıra beklentisi gibi pratik not. */
  tip?: string;
}

export interface ItineraryDay {
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface RelatedGuide {
  /** destinations.ts içindeki şehir adıyla birebir eşleşir. */
  city: string;
  /** Kart başlığı; doğal ve bağlama özgü bağlantı metni. */
  anchor: string;
  /** Bu şehrin rotaya neden ekleneceğini anlatır. */
  description: string;
}

export interface EditorialSource {
  name: string;
  url: string;
}

export interface PracticalTip {
  title: string;
  body: string;
}

export interface CityGuide {
  /** destinations.ts içindeki şehir adıyla birebir eşleşir. */
  city: string;
  /** destinations.ts içindeki ülke kodu. */
  countryCode: string;

  /** <title> — 60 karakter civarı, şehre özgü arama niyetini hedefler. */
  seoTitle: string;
  /** meta description — 150-160 karakter. */
  seoDescription: string;
  /** Sayfadaki tek H1. */
  h1: string;
  /** Hero altındaki giriş cümlesi. */
  lede: string;

  /** Hızlı bilgi şeridi. */
  quickFacts: { label: string; value: string }[];

  /** Ana içerik bölümleri. */
  sections: GuideSection[];

  /** Restoran / yeme-içme kartları. */
  places: PlaceCard[];

  /** Gün gün gezi planı. */
  itinerary: ItineraryDay[];

  /** Şehre özgü, doğrulanmış küçük ama değerli bilgiler. */
  practicalHeading?: string;
  practicalTips?: PracticalTip[];

  /** Sık sorulan sorular — FAQPage şeması buradan üretilir. */
  faqs: Faq[];

  /** Yayında olan kardeş rehberlere bağlamsal geçişler. */
  relatedGuides?: RelatedGuide[];

  /** Editoryal doğrulama izi; sayfada kaynakça olarak gösterilmez. */
  sources?: EditorialSource[];

  /** Doğrulanması gereken, zamanla değişebilecek bilgiler. */
  volatileNote?: string;

  /** Son gözden geçirme tarihi (ISO). */
  reviewed: string;
}

import { CityGuide } from "./types";

export const longyearbyen: CityGuide = {
  city: "Longyearbyen",
  countryCode: "SJ",
  seoTitle: "Longyearbyen Gezi Rehberi: Dünyanın En Kuzeyindeki Kasaba",
  seoDescription:
    "78. enlemdeki Longyearbyen gezi rehberi: Kuzey ışıkları, buz mağaraları, Svalbard Küresel Tohum Deposu, bütçe ve pratik ipuçları.",
  h1: "Longyearbyen Gezi Rehberi",
  lede:
    "Dünyanın en kuzeydeki sivil yerleşimi Longyearbyen; boyalı ahşap evleri, uçsuz bucaksız karlı vadileri ve kutup gecesinin altında ışıldayan gökyüzüyle sıradışı bir arktik vaha.",

  quickFacts: [
    { label: "Enlem", value: "78.2232° K" },
    { label: "Nüfus", value: "~2,400" },
    { label: "Para Birimi", value: "Norveç Kronu (NOK)" },
    { label: "Havalimanı", value: "Svalbard Havalimanı (LYR)" },
    { label: "Kutupsal Gece", value: "26 Ekim – 15 Şubat" },
  ],

  sections: [
    {
      heading: "Longyearbyen neresidir ve buraya nasıl gidilir?",
      id: "nedir-ve-ulasim",
      body: [
        "Longyearbyen, Norveç'e bağlı Svalbard takımadasının idari merkezi ve ana giriş kapısıdır. Tromsø veya Oslo üzerinden SAS ve Norwegian uçuşlarıyla Svalbard Havalimanı'na (LYR) kolayca ulaşılır.",
        "Kasabada pasaport kontrolü yapılır (Svalbard Schengen bölgesinde değildir). Vize muafiyeti olmakla birlikte Norveç aktarması nedeniyle geçerli Schengen vizesi gereklidir.",
      ],
    },
    {
      heading: "Kutupsal Gece ve Gece Yarısı Güneşi",
      id: "iklim-ve-isik",
      body: [
        "Kasım ortasından şubat ortasına kadar Longyearbyen'de 24 saat zifiri karanlık (Kutup Gecesi) yaşanır. Bu dönemde gündüz bile gökyüzünde Kuzey Işıkları (Aurora Borealis) izlenebilir.",
        "Nisan ortasından ağustos sonuna kadar ise güneş 24 saat batmaz (Gece Yarısı Güneşi). Doğa yürüyüşleri, fiyort turları ve buz tırmanışları için ideal dönem bahar ve yaz aylarıdır.",
      ],
    },
  ],

  places: [
    {
      name: "Svalbard Müzesi",
      area: "Kasaba Merkezi",
      known: "Kutup Tarihi ve Doğası",
      why: "Takımadaların fauna, madencilik ve keşif tarihini anlatan ödüllü müze.",
      price: "Orta",
    },
    {
      name: "Svalbard Küresel Tohum Deposu",
      area: "Platåberget Dış Bölge",
      known: "Kıyamet Deposu",
      why: "Dünya bitki çeşitliliğini koruyan küresel tohum kasası (Dışarıdan görülür).",
      price: "Ekonomik",
      tip: "İçerisi ziyarete kapalıdır, turlar dış fotoğraf molası verir.",
    },
  ],

  itinerary: [
    {
      title: "1. Gün — Kasaba ve Müze",
      morning: "Oslo/Tromsø uçuşuyla varış, otele yerleşme ve ana caddede yürüyüş.",
      afternoon: "Svalbard Müzesi gezisi ve kutup ekipmanı hazırlığı.",
      evening: "Yerel restoranda arktik akşam yemeği ve Aurora avı.",
    },
  ],

  practicalTips: [
    {
      title: "Ayakkabı Çıkarma Geleneği",
      body: "Oteller, restoranlar ve müzelere girerken ayakkabı çıkarmak eski madencilikten kalan yerel bir gelenektir.",
    },
  ],

  faqs: [
    {
      q: "Svalbard'a gitmek için vize gerekli mi?",
      a: "Svalbard vizesiz bir bölgedir ancak uçuşlar Norveç aktarmalı olduğu için geçerli bir Schengen vizesi gereklidir.",
    },
  ],

  reviewed: "2026-08-13",
};

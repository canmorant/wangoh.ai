import { CityGuide } from "./types";

export const nyAlesund: CityGuide = {
  city: "Ny-Ålesund",
  countryCode: "SJ",
  seoTitle: "Ny-Ålesund Gezi Rehberi: Dünyanın En Kuzeyindeki Araştırma Kasabası",
  seoDescription:
    "79. Kuzey enleminde yer alan Ny-Ålesund gezi rehberi: Ulaşım, kutup bilim istasyonları, Amundsen hava gemisi direği, pratik kurallar ve bütçe.",
  h1: "Ny-Ålesund Gezi Rehberi",
  lede:
    "Yetmiş dokuzuncu enlemde, kutup dairesinin derinliklerinde yer alan Ny-Ålesund; eski bir kömür madeni kasabasından dünyanın en önemli kutup araştırmaları merkezine dönüşmüş efsanevi bir yerleşim.",

  quickFacts: [
    { label: "Enlem", value: "78.9250° K" },
    { label: "Nüfus", value: "Yazın ~120 / Kışın ~35" },
    { label: "Para Birimi", value: "Norveç Kronu (NOK)" },
    { label: "Telsiz / Wi-Fi", value: "Radyo sessizlik bölgesi (Wi-Fi & BT yasak)" },
    { label: "Ulaşım", value: "Longyearbyen'den uçuş veya tekne" },
  ],

  sections: [
    {
      heading: "Ny-Ålesund nedir ve buraya nasıl gidilir?",
      id: "nedir-ve-ulasim",
      body: [
        "Ny-Ålesund, Svalbard takımadalarının Kongsfjorden kıyısında yer alan ve sürekli yaşanılan dünyanın en kuzeydeki yerleşimidir. Kings Bay AS şirketi tarafından yönetilen kasaba, 10 ülkeden uluslararası kutup araştırma istasyonlarına ev sahipliği yapar.",
        "Kasabaya ulaşım iki şekilde mümkündür: Longyearbyen'den kalkıp Ny-Ålesund Havalimanı'na (Hamnerabben) inen özel charter uçuşlar veya yaz aylarında fiyort boyunca düzenlenen bilimsel/turistik tekne seferleri. Bireysel serbest seyahat kısıtlıdır; ziyaretçilerin yerel yönetmeliklere ve koruma kurallarına harfiyen uyması gerekir.",
      ],
    },
    {
      heading: "Radyo Sessizliği ve Kutup Kuralları",
      id: "radyo-sessizligi-kurallar",
      body: [
        "Ny-Ålesund'da 20 kilometre yarıçapında strictly enjekte edilen 'Radio Silent Zone' kuralı geçerlidir. Duyarlı atmosferik ve astrofiziksel ölçümlerin bozulmaması için Wi-Fi, Bluetooth ve telsiz sinyalleri kesinlikle yasaktır. Cep telefonları uçak modunda tutulmalıdır.",
        "Kasaba sınırları dışına çıkarken kutup ayısı riski sebebiyle silahlı rehber eskortu zorunludur. Belirlenen patikaların dışına çıkmak, yerel kuş kuluçka alanlarını rahatsız etmek ve tarihi kalıntılara dokunmak yasayla engellenmiştir.",
      ],
      subsections: [
        {
          heading: "Kutup Ayısı Güvenliği",
          body: [
            "Ny-Ålesund ve çevresinde insandan çok kutup ayısı yaşar. Kasaba içinde güvenli yürüyüş alanları işaretlenmiştir; bu hatların ötesine silahsız geçiş kesinlikle yapılmaz.",
          ],
        },
        {
          heading: "Postane ve Müze",
          body: [
            "Ny-Ålesund'da dünyanın en kuzeydeki postanelesi bulunur. Buradan damgalı kartpostal göndermek ve Kings Bay Müzesi'ni ziyaret etmek kasabanın en popüler etkinliğidir.",
          ],
        },
      ],
    },
    {
      heading: "Tarih ve Amundsen'in Hava Gemisi Direği",
      id: "tarih-ve-amundsen",
      body: [
        "1926 yılında Roald Amundsen, Umberto Nobile ve Lincoln Ellsworth, 'Norge' adlı zeplinle Kuzey Kutbu'nu geçtikleri tarihi uçuşa Ny-Ålesund'dan başladılar. Kasabada hâlâ ayakta duran çelik zeplin bağlama direği (Airship Mast), kutup havacılık tarihinin en değerli anıtlarından biridir.",
        "Eski kömür madenciliği döneminden kalan ahşap binalar özenle korunmuş ve günümüzde uluslararası araştırmacıların konaklama ve laboratuvar alanlarına dönüştürülmüştür.",
      ],
    },
  ],

  places: [
    {
      name: "Amundsen Zeplin Direği",
      area: "Kasaba Merkezi",
      known: "1926 Kuzey Kutbu Uçuşu",
      why: "Roald Amundsen'in Norge zeplinini bağladığı orijinal çelik direk.",
      price: "Ekonomik",
      tip: "Tarihi anıt koruma altındadır, tırmanmak veya dokunmak yasaktır.",
    },
    {
      name: "Dünyanın En Kuzey Postanesi",
      area: "Kings Bay Limanı",
      known: "Kutup Posta Damgası",
      why: "Ny-Ålesund özel damgalı kartpostallar göndermek için benzersiz bir durak.",
      price: "Ekonomik",
      tip: "Yazın tur gemisi geldiğinde açıktır, Nakit veya Kredi Kartı geçerlidir.",
    },
    {
      name: "Kings Bay Müzesi",
      area: "Merkez Sokak",
      known: "Maden ve Keşif Tarihi",
      why: "Ny-Ålesund'un maden kasabasından bilim merkezine dönüşümünü anlatan sergiler.",
      price: "Ekonomik",
    },
  ],

  itinerary: [
    {
      title: "Ny-Ålesund Keşif Günü",
      morning: "Longyearbyen'den uçuş veya tekneyle varış, karşılama ve radyo sessizliği bilgilendirmesi.",
      afternoon: "Amundsen Zeplin Direği, Kings Bay Müzesi ve tarihi ahşap madenci evlerinin ziyareti.",
      evening: "Dünyanın en kuzeydeki postaneden kartpostal gönderimi ve fiyort manzarasında dönüş.",
    },
  ],

  practicalTips: [
    {
      title: "Wi-Fi & Bluetooth Kapalı",
      body: "Kasabaya girmeden önce telefonunuzun Wi-Fi ve Bluetooth özelliklerini kapatın veya uçak moduna alın.",
    },
    {
      title: "Kıyafet Katmanları",
      body: "79. enlemde rüzgar soğutma etkisi yüksektir. Rüzgar geçirmez katman ve termal içlik şarttır.",
    },
  ],

  faqs: [
    {
      q: "Ny-Ålesund nerede ve kimler yaşıyor?",
      a: "Ny-Ålesund, Norveç'e bağlı Svalbard takımadasının kuzeybatısında yer alır. Nüfusu çoğunlukla bilim insanları ve tesisi işleten Kings Bay şirket personellerinden oluşur.",
    },
    {
      q: "Ny-Ålesund'da internet veya cep telefonu çekiyor mu?",
      a: "Hayır. Hassas bilimsel ölçümler nedeniyle Wi-Fi, Bluetooth ve hücresel yayınlar yasaktır. İletişim kablolu hatlar üzerinden sağlanır.",
    },
    {
      q: "Ny-Ålesund'a turist olarak gidilebilir mi?",
      a: "Evet, Longyearbyen kalkışlı günübirlik tur tekneleri veya organize charter seferleriyle kasaba rehber eşliğinde gezilebilir.",
    },
  ],

  reviewed: "2026-08-13",
};

/**
 * Uçuş animasyonunun kalkış noktası olabilecek şehirler.
 *
 * Kalkış, ziyaretçinin bağlandığı yaklaşık konumdan (bkz. app/api/konum)
 * geliyor; bu liste iki iş görüyor:
 *   - konum alınamadığında ziyaretçinin kendisinin seçtiği şehirler,
 *   - tespit edilen şehrin adını sitenin dilinde göstermek ("Munich" →
 *     "Münih"). `match`, barındırma sağlayıcısının İngilizce/ASCII yazdığı
 *     adların sadeleştirilmiş hâli.
 *
 * Koordinatlar şehir merkezleri; yalnız haritadaki çizgi için kullanılıyor.
 * Adlar Türkçe kaynak metin: diğer dillerde destinasyon sözlüğünden çevrilir
 * (content/i18n/sources.ts bunları da topluyor).
 */
export interface OriginCity {
  id: string;
  name: string;
  lat: number;
  lng: number;
  match?: string[];
}

export const DEFAULT_ORIGIN_ID = "istanbul";

export const TURKEY_ORIGINS: OriginCity[] = [
  { id: "istanbul", name: "İstanbul", lat: 41.0082, lng: 28.9784 },
  { id: "ankara", name: "Ankara", lat: 39.9334, lng: 32.8597 },
  { id: "izmir", name: "İzmir", lat: 38.4237, lng: 27.1428 },
  { id: "antalya", name: "Antalya", lat: 36.8969, lng: 30.7133 },
  { id: "bursa", name: "Bursa", lat: 40.1885, lng: 29.061 },
  { id: "adana", name: "Adana", lat: 37.0, lng: 35.3213 },
  { id: "konya", name: "Konya", lat: 37.8746, lng: 32.4932 },
  { id: "gaziantep", name: "Gaziantep", lat: 37.0662, lng: 37.3833 },
  { id: "kayseri", name: "Kayseri", lat: 38.7312, lng: 35.4787 },
  { id: "mersin", name: "Mersin", lat: 36.8121, lng: 34.6415 },
  { id: "eskisehir", name: "Eskişehir", lat: 39.7767, lng: 30.5206 },
  { id: "kocaeli", name: "Kocaeli", lat: 40.7654, lng: 29.9408, match: ["izmit"] },
  { id: "sakarya", name: "Sakarya", lat: 40.7569, lng: 30.3781, match: ["adapazari"] },
  { id: "tekirdag", name: "Tekirdağ", lat: 40.9781, lng: 27.5117 },
  { id: "edirne", name: "Edirne", lat: 41.6818, lng: 26.5623 },
  { id: "canakkale", name: "Çanakkale", lat: 40.1553, lng: 26.4142 },
  { id: "balikesir", name: "Balıkesir", lat: 39.6484, lng: 27.8826 },
  { id: "manisa", name: "Manisa", lat: 38.6191, lng: 27.4289 },
  { id: "aydin", name: "Aydın", lat: 37.856, lng: 27.8416 },
  { id: "denizli", name: "Denizli", lat: 37.7765, lng: 29.0864 },
  { id: "mugla", name: "Muğla", lat: 37.2153, lng: 28.3636 },
  { id: "samsun", name: "Samsun", lat: 41.2867, lng: 36.33 },
  { id: "trabzon", name: "Trabzon", lat: 41.0027, lng: 39.7168 },
  { id: "rize", name: "Rize", lat: 41.0201, lng: 40.5234 },
  { id: "sivas", name: "Sivas", lat: 39.7477, lng: 37.0179 },
  { id: "malatya", name: "Malatya", lat: 38.3552, lng: 38.3095 },
  { id: "elazig", name: "Elazığ", lat: 38.681, lng: 39.2264 },
  { id: "erzurum", name: "Erzurum", lat: 39.9043, lng: 41.2679 },
  { id: "kars", name: "Kars", lat: 40.6013, lng: 43.0975 },
  { id: "van", name: "Van", lat: 38.5012, lng: 43.373 },
  { id: "diyarbakir", name: "Diyarbakır", lat: 37.9144, lng: 40.2306 },
  { id: "sanliurfa", name: "Şanlıurfa", lat: 37.1591, lng: 38.7969, match: ["urfa"] },
  { id: "mardin", name: "Mardin", lat: 37.3212, lng: 40.7245 },
  { id: "batman", name: "Batman", lat: 37.8812, lng: 41.1351 },
  { id: "kahramanmaras", name: "Kahramanmaraş", lat: 37.5858, lng: 36.9371 },
  { id: "hatay", name: "Hatay", lat: 36.2021, lng: 36.16, match: ["antakya"] },
];

export const WORLD_ORIGINS: OriginCity[] = [
  { id: "london", name: "Londra", lat: 51.5074, lng: -0.1278, match: ["london"] },
  { id: "paris", name: "Paris", lat: 48.8566, lng: 2.3522 },
  { id: "berlin", name: "Berlin", lat: 52.52, lng: 13.405 },
  { id: "munich", name: "Münih", lat: 48.1351, lng: 11.582, match: ["munich", "munchen"] },
  { id: "frankfurt", name: "Frankfurt", lat: 50.1109, lng: 8.6821, match: ["frankfurt am main"] },
  { id: "cologne", name: "Köln", lat: 50.9375, lng: 6.9603, match: ["cologne"] },
  { id: "hamburg", name: "Hamburg", lat: 53.5511, lng: 9.9937 },
  { id: "dusseldorf", name: "Düsseldorf", lat: 51.2277, lng: 6.7735 },
  { id: "stuttgart", name: "Stuttgart", lat: 48.7758, lng: 9.1829 },
  { id: "amsterdam", name: "Amsterdam", lat: 52.3676, lng: 4.9041 },
  { id: "brussels", name: "Brüksel", lat: 50.8503, lng: 4.3517, match: ["brussels", "bruxelles", "brussel"] },
  { id: "vienna", name: "Viyana", lat: 48.2082, lng: 16.3738, match: ["vienna", "wien"] },
  { id: "zurich", name: "Zürih", lat: 47.3769, lng: 8.5417, match: ["zurich"] },
  { id: "rome", name: "Roma", lat: 41.9028, lng: 12.4964, match: ["rome"] },
  { id: "milan", name: "Milano", lat: 45.4642, lng: 9.19, match: ["milan"] },
  { id: "madrid", name: "Madrid", lat: 40.4168, lng: -3.7038 },
  { id: "barcelona", name: "Barselona", lat: 41.3874, lng: 2.1686, match: ["barcelona"] },
  { id: "lisbon", name: "Lizbon", lat: 38.7223, lng: -9.1393, match: ["lisbon", "lisboa"] },
  { id: "athens", name: "Atina", lat: 37.9838, lng: 23.7275, match: ["athens"] },
  { id: "stockholm", name: "Stockholm", lat: 59.3293, lng: 18.0686 },
  { id: "copenhagen", name: "Kopenhag", lat: 55.6761, lng: 12.5683, match: ["copenhagen", "kobenhavn"] },
  { id: "oslo", name: "Oslo", lat: 59.9139, lng: 10.7522 },
  { id: "helsinki", name: "Helsinki", lat: 60.1699, lng: 24.9384 },
  { id: "warsaw", name: "Varşova", lat: 52.2297, lng: 21.0122, match: ["warsaw", "warszawa"] },
  { id: "prague", name: "Prag", lat: 50.0755, lng: 14.4378, match: ["prague", "praha"] },
  { id: "budapest", name: "Budapeşte", lat: 47.4979, lng: 19.0402, match: ["budapest"] },
  { id: "bucharest", name: "Bükreş", lat: 44.4268, lng: 26.1025, match: ["bucharest", "bucuresti"] },
  { id: "sofia", name: "Sofya", lat: 42.6977, lng: 23.3219, match: ["sofia"] },
  { id: "belgrade", name: "Belgrad", lat: 44.7866, lng: 20.4489, match: ["belgrade", "beograd"] },
  { id: "sarajevo", name: "Saraybosna", lat: 43.8563, lng: 18.4131, match: ["sarajevo"] },
  { id: "skopje", name: "Üsküp", lat: 41.9981, lng: 21.4254, match: ["skopje"] },
  { id: "nicosia", name: "Lefkoşa", lat: 35.1856, lng: 33.3823, match: ["nicosia", "lefkosa"] },
  { id: "moscow", name: "Moskova", lat: 55.7558, lng: 37.6173, match: ["moscow", "moskva"] },
  { id: "kyiv", name: "Kiev", lat: 50.4501, lng: 30.5234, match: ["kyiv", "kiev"] },
  { id: "baku", name: "Bakü", lat: 40.4093, lng: 49.8671, match: ["baku"] },
  { id: "tbilisi", name: "Tiflis", lat: 41.7151, lng: 44.8271, match: ["tbilisi"] },
  { id: "tashkent", name: "Taşkent", lat: 41.2995, lng: 69.2401, match: ["tashkent"] },
  { id: "almaty", name: "Almatı", lat: 43.222, lng: 76.8512, match: ["almaty"] },
  { id: "tehran", name: "Tahran", lat: 35.6892, lng: 51.389, match: ["tehran"] },
  { id: "dubai", name: "Dubai", lat: 25.2048, lng: 55.2708 },
  { id: "doha", name: "Doha", lat: 25.2854, lng: 51.531 },
  { id: "riyadh", name: "Riyad", lat: 24.7136, lng: 46.6753, match: ["riyadh"] },
  { id: "jeddah", name: "Cidde", lat: 21.4858, lng: 39.1925, match: ["jeddah", "jiddah"] },
  { id: "cairo", name: "Kahire", lat: 30.0444, lng: 31.2357, match: ["cairo"] },
  { id: "tunis", name: "Tunus", lat: 36.8065, lng: 10.1815, match: ["tunis"] },
  { id: "casablanca", name: "Kazablanka", lat: 33.5731, lng: -7.5898, match: ["casablanca"] },
  { id: "new-york", name: "New York", lat: 40.7128, lng: -74.006 },
  { id: "chicago", name: "Chicago", lat: 41.8781, lng: -87.6298 },
  { id: "los-angeles", name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { id: "toronto", name: "Toronto", lat: 43.6532, lng: -79.3832 },
  { id: "sao-paulo", name: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { id: "buenos-aires", name: "Buenos Aires", lat: -34.6037, lng: -58.3816 },
  { id: "johannesburg", name: "Johannesburg", lat: -26.2041, lng: 28.0473 },
  { id: "delhi", name: "Delhi", lat: 28.6139, lng: 77.209, match: ["new delhi"] },
  { id: "bangkok", name: "Bangkok", lat: 13.7563, lng: 100.5018 },
  { id: "singapore", name: "Singapur", lat: 1.3521, lng: 103.8198, match: ["singapore"] },
  { id: "beijing", name: "Pekin", lat: 39.9042, lng: 116.4074, match: ["beijing"] },
  { id: "shanghai", name: "Şanghay", lat: 31.2304, lng: 121.4737, match: ["shanghai"] },
  { id: "seoul", name: "Seul", lat: 37.5665, lng: 126.978, match: ["seoul"] },
  { id: "tokyo", name: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { id: "sydney", name: "Sidney", lat: -33.8688, lng: 151.2093, match: ["sydney"] },
];

export const ORIGIN_CITIES: OriginCity[] = [...TURKEY_ORIGINS, ...WORLD_ORIGINS];

export const originById = (id: string | null | undefined) =>
  ORIGIN_CITIES.find((city) => city.id === id) ?? null;

/** "Münchén" → "munchen": aksan, büyük harf ve noktalama farkı yok sayılır. */
export const simplifyPlace = (value: string) =>
  value
    .toLocaleLowerCase("en")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Tespit edilen şehir adının listedeki karşılığı (yoksa null). */
export function originByPlaceName(value: string): OriginCity | null {
  const target = simplifyPlace(value);
  if (!target) return null;
  return (
    ORIGIN_CITIES.find(
      (city) => simplifyPlace(city.name) === target || city.id === target || city.match?.includes(target)
    ) ?? null
  );
}

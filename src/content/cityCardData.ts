import { allCountries, hasGuide } from "@/content/guides";
import { countryHubFor } from "@/content/countryHubs";

/**
 * Ana sayfadaki şehir görünümünün (CityCards) ihtiyaç duyduğu veri — ve
 * yalnızca o.
 *
 * CityCards eskiden @/content/guides ve @/content/countryHubs'ı doğrudan
 * import ediyordu. İstemci bileşeni olduğu için bu, 331 rehberin tamamını
 * ~1.8 MB'lık bir JS parçası olarak tarayıcıya gönderiyordu; ülke kartına
 * basan herkes bunu indiriyordu. Oysa bileşenin kullandığı şey ülke başına
 * iki kısa metin ve "bu şehrin rehberi var mı" bilgisiydi.
 *
 * Bu modül SUNUCUDA çalışır (ana sayfa server component'i) ve o küçük veriyi
 * prop olarak geçirir. İstemci tarafında yalnızca tipi import edilmeli:
 *   import type { CityCardData } from "@/content/cityCardData";
 * Değer import edilirse büyük modüller yeniden istemciye sızar.
 */

export interface CityCardHub {
  intro: string;
  heading?: string;
}

export interface CityCardData {
  /** Ülke kodu → şehir ızgarasının giriş metni ve başlığı. */
  hubs: Record<string, CityCardHub>;
  /**
   * Rehberi henüz yazılmamış şehirler, "KOD:Şehir" biçiminde. Tersini (rehberi
   * olanları) değil bunu taşıyoruz: bugün tüm şehirlerin rehberi var, liste
   * boş ve ana sayfaya sıfır bayt ekliyor.
   */
  missingGuides: string[];
}

// Bilerek dışa açık değil: istemci bu modülden değer import etmemeli.
// CityCards aynı "KOD:Şehir" biçimini kendi içinde kuruyor.
const cityKey = (countryCode: string, cityName: string) =>
  `${countryCode}:${cityName}`;

export function buildCityCardData(): CityCardData {
  const hubs: Record<string, CityCardHub> = {};
  const missingGuides: string[] = [];

  for (const country of allCountries) {
    const hub = countryHubFor(country.code);
    if (hub) {
      hubs[country.code] = hub.citiesHeading
        ? { intro: hub.cityGridIntro, heading: hub.citiesHeading }
        : { intro: hub.cityGridIntro };
    }
    for (const city of country.cities) {
      if (!hasGuide(country.code, city.name)) {
        missingGuides.push(cityKey(country.code, city.name));
      }
    }
  }

  return { hubs, missingGuides };
}

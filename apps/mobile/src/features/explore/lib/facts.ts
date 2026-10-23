/**
 * Ülke "hızlı bilgi" kutuları. Yalnız API'nin verdiği alanlar gösterilir; boş/yok olan kutu hiç çıkmaz.
 * Arayüz etiketleri Türkçe sabittir, değerler API'den gelir (kaynak biçimiyle, çevrilmeden).
 */

export interface Fact {
  label: string;
  value: string;
}

/** Ülke ayrıntısından hızlı bilgilerin ihtiyaç duyduğu alanlar (tip bağımlılığı olmasın diye yerel). */
export interface CountryFactsSource {
  officialName: string | null;
  name: string;
  capital: string[];
  subregion: string | null;
  landlocked: boolean;
  travel: {
    capital: string | null;
    gateway: string | null;
    iata: string | null;
    flightTime: string | null;
    bestSeason: string | null;
    budgetLabel: string | null;
  } | null;
}

const clean = (value: string | null | undefined): string | null => {
  const text = value?.trim();
  return text ? text : null;
};

/** Başkent(ler); birden çoksa virgülle. Yoksa `null`. */
export function joinCapitals(capital: readonly string[] | null | undefined): string | null {
  const parts = (capital ?? []).map((item) => item.trim()).filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

/**
 * İstanbul kalkışlı uçuş süresi. Değer süre biçimindeyse ("11sa 30dk", "14sa+") etiket kalkış noktasını
 * söyler; "Başlangıç noktası" gibi süre olmayan bir metinse (Türkiye) etiket yalın kalır.
 */
export function flightFact(flightTime: string | null | undefined): Fact | null {
  const value = clean(flightTime);
  if (!value) return null;
  return /^\d/.test(value) ? { label: "İstanbul’dan uçuş", value } : { label: "Uçuş süresi", value };
}

/** "Giriş noktası": varış şehri ve ana havalimanı IATA kodu ("Tokyo · HND"). */
export function gatewayFact(gateway: string | null | undefined, iata: string | null | undefined): Fact | null {
  const city = clean(gateway);
  const code = clean(iata);
  if (!city && !code) return null;
  return { label: "Giriş noktası", value: [city, code].filter(Boolean).join(" · ") };
}

/**
 * Hızlı bilgi kutuları. Seyahat rehberi olan ülkede başkent, giriş noktası, uçuş, en iyi dönem ve bütçe;
 * olmayanda temel dünya verisi (başkent, resmî ad, kıta, alt bölge).
 */
export function buildCountryFacts(country: CountryFactsSource, continentName: string | null): Fact[] {
  const facts: Fact[] = [];
  const add = (label: string, value: string | null | undefined) => {
    const text = clean(value);
    if (text) facts.push({ label, value: text });
  };
  const addFact = (fact: Fact | null) => {
    if (fact) facts.push(fact);
  };

  const travel = country.travel;
  if (travel) {
    add("Başkent", clean(travel.capital) ?? joinCapitals(country.capital));
    addFact(gatewayFact(travel.gateway, travel.iata));
    addFact(flightFact(travel.flightTime));
    add("En iyi dönem", travel.bestSeason);
    add("Bütçe", travel.budgetLabel);
    return facts;
  }

  add("Başkent", joinCapitals(country.capital));
  const official = clean(country.officialName);
  if (official && official !== country.name) add("Resmî ad", official);
  add("Kıta", continentName);
  add("Alt bölge", country.subregion);
  if (country.landlocked) add("Denize kıyısı", "Yok");
  return facts;
}

/** Ülke başlığının altındaki konum satırı: "Asya · Doğu Asya". */
export function countrySubtitle(continentName: string | null, subregion: string | null): string | undefined {
  const parts = [clean(continentName), clean(subregion)].filter((part): part is string => part !== null);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

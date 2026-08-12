/**
 * Kıta ve alt bölge adlarının Türkçe karşılıkları.
 *
 * Veri kümesi (`world-countries`) bu alanları yalnızca İngilizce tutuyor;
 * ülke adlarının aksine paket içinde çevirileri yok. Bu yüzden eşleme burada
 * elle tanımlandı ve tek bir yerde toplandı — hem çark hem bayrak oyunu aynı
 * sözlüğü kullanıyor.
 */

export const CONTINENT_TR: Record<string, string> = {
  Africa: "Afrika",
  Americas: "Amerika",
  Asia: "Asya",
  Europe: "Avrupa",
  Oceania: "Okyanusya",
  Antarctic: "Antarktika",
};

export const SUBREGION_TR: Record<string, string> = {
  "Australia and New Zealand": "Avustralya ve Yeni Zelanda",
  Caribbean: "Karayipler",
  "Central America": "Orta Amerika",
  "Central Asia": "Orta Asya",
  "Central Europe": "Orta Avrupa",
  "Eastern Africa": "Doğu Afrika",
  "Eastern Asia": "Doğu Asya",
  "Eastern Europe": "Doğu Avrupa",
  Melanesia: "Melanezya",
  Micronesia: "Mikronezya",
  "Middle Africa": "Orta Afrika",
  "North America": "Kuzey Amerika",
  "Northern Africa": "Kuzey Afrika",
  "Northern Europe": "Kuzey Avrupa",
  Polynesia: "Polinezya",
  "South America": "Güney Amerika",
  "South-Eastern Asia": "Güneydoğu Asya",
  "Southeast Europe": "Güneydoğu Avrupa",
  "Southern Africa": "Güney Afrika",
  "Southern Asia": "Güney Asya",
  "Southern Europe": "Güney Avrupa",
  "Western Africa": "Batı Afrika",
  "Western Asia": "Batı Asya",
  "Western Europe": "Batı Avrupa",
};

export const continentTr = (v: string) => CONTINENT_TR[v] ?? v;
export const subregionTr = (v: string) => SUBREGION_TR[v] ?? v;

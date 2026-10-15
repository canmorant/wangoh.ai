import addedSeo from "@/content/addedSeo.json";

/**
 * İspanyolca ülke sayfalarının <title> ve meta description'ı.
 *
 * İspanyolca aramadaki ülke niyetine göre ayrı yazıldı ("qué ver en Japón",
 * "viajar a Japón"); halk arasında yaygın adlar resmî adın yanında doğal
 * biçimde geçiyor (Holanda / Países Bajos, República Checa / Chequia).
 * Kurallar scripts/seo-copy.test.ts'te: başlık ≤ 60, açıklama 120–160.
 */
export const ES_HUB_SEO: Record<string, readonly [title: string, description: string]> = {
  ...Object.fromEntries(Object.entries(addedSeo.hubs.es).map(([key, [title, description]]) => [key, [title, description] as const])),
  JP: [
    "Qué ver en Japón: ciudades, rutas y consejos para viajar",
    "Tokio, Kioto, Osaka, Hiroshima, Nara y más: guías completas de ocho destinos de Japón, con transporte, ideas de ruta y consejos para tu primer viaje.",
  ],
  US: [
    "Viajar a Estados Unidos: qué ver, ciudades y consejos",
    "Nueva York, Los Ángeles, Miami, Chicago, San Francisco y Las Vegas: impuestos, propinas, transporte, hoteles y rutas para planificar tu viaje.",
  ],
  IT: [
    "Qué ver en Italia: ciudades, trenes y rutas por el país",
    "Roma, Venecia, Florencia, Milán, Nápoles y la Costa Amalfitana: entradas, trenes, zonas ZTL, comida y rutas para recorrer Italia sin errores.",
  ],
  FR: [
    "Qué ver en Francia: París, otras ciudades y rutas en tren",
    "París, Niza, Lyon, Marsella, Burdeos y Estrasburgo: transporte, entradas, comida, dónde alojarse y rutas en tren para organizar tu viaje a Francia.",
  ],
  TH: [
    "Viajar a Tailandia: Bangkok, islas y rutas recomendadas",
    "Bangkok, Chiang Mai, Phuket, Krabi, Koh Samui y Ayutthaya: temporadas, transporte, pagos, normas y rutas para planificar tu viaje a Tailandia.",
  ],
  KR: [
    "Qué ver en Corea del Sur: Seúl, Busan, Jeju y rutas",
    "Seúl, Busan, Jeju, Gyeongju, Incheon y Sokcho: transporte, requisitos de entrada, comida, alojamiento y rutas para tu viaje a Corea del Sur.",
  ],
  ES: [
    "Qué ver en España: ciudades, islas y rutas de viaje",
    "Barcelona, Madrid, Andalucía, la costa vasca, Mallorca, Ibiza y Canarias: 16 guías detalladas con qué ver, dónde alojarse y cómo moverse por España.",
  ],
  TR: [
    "Qué ver en Turquía: Estambul, Capadocia, costa y rutas",
    "Estambul, Capadocia, Antalya, el Egeo, el mar Negro y Mesopotamia: 19 guías de ciudades y regiones para decidir qué ver en Turquía y cómo moverte.",
  ],
  GB: [
    "Viajar al Reino Unido: Inglaterra, Escocia y qué ver",
    "Londres, Edimburgo, Mánchester, Liverpool, Bath, York, las Highlands, los Cotswolds y el Distrito de los Lagos: 16 guías para tu viaje al Reino Unido.",
  ],
  ID: [
    "Viajar a Indonesia: Bali, Java, Komodo y rutas por islas",
    "Bali, Java, Lombok, Komodo, Sumatra, Célebes y Raja Ampat: 18 rutas detalladas con visados, transporte entre islas y presupuesto para Indonesia.",
  ],
  CN: [
    "Viajar a China: visados, trenes y qué ver en 16 ciudades",
    "Pekín, Shanghái, Xi'an, Chengdu, Yunnan, Zhangjiajie y más: visados, trenes, pagos móviles y rutas por 16 ciudades para preparar tu viaje a China.",
  ],
  NL: [
    "Qué ver en Holanda (Países Bajos): Ámsterdam y más",
    "Ámsterdam, Róterdam, Utrecht y 11 destinos más: trenes, OVpay, bicicleta, museos y temporada de tulipanes para recorrer los Países Bajos con buen ritmo.",
  ],
  AT: [
    "Qué ver en Austria: Viena, Salzburgo y rutas alpinas",
    "Viena, Salzburgo, Innsbruck, Graz, Hallstatt, el Wachau, Linz y Zell am See: trenes, requisitos de entrada y rutas alpinas para tu viaje a Austria.",
  ],
  PT: [
    "Qué ver en Portugal: Lisboa, Oporto, Algarve e islas",
    "Lisboa, Oporto, Sintra, el Algarve, Madeira, las Azores, Coímbra y Évora: trenes, rutas por la costa y las islas y consejos para viajar a Portugal.",
  ],
  DE: [
    "Qué ver en Alemania: Berlín, Múnich y rutas en tren",
    "Berlín, Múnich, Hamburgo, Colonia, Fráncfort, Dresde, Núremberg y la Selva Negra: trenes, museos, requisitos de entrada y rutas por Alemania.",
  ],
  MX: [
    "Qué ver en México: ciudades, playas y rutas mayas",
    "Ciudad de México, Oaxaca, Cancún, Tulum, Mérida, Guadalajara, San Miguel de Allende y Chiapas: rutas, requisitos de entrada y consejos para viajar.",
  ],
  BR: [
    "Viajar a Brasil: Río, Iguazú, la Amazonia y más",
    "Río de Janeiro, São Paulo, Salvador, Iguazú, Florianópolis, Recife y Olinda, la Amazonia y Lençóis: visados y rutas para planificar tu viaje a Brasil.",
  ],
  AR: [
    "Qué ver en Argentina: Buenos Aires, Patagonia y rutas",
    "Buenos Aires, Mendoza, Bariloche, El Calafate, Ushuaia, Salta y Jujuy, Iguazú y El Chaltén: rutas, distancias y consejos para recorrer Argentina.",
  ],
  CA: [
    "Viajar a Canadá: ciudades, Rocosas y rutas por el país",
    "Toronto, Vancouver, Montreal, Quebec, Banff, Jasper, el Niágara y el Yukón: visado, trenes, parques nacionales y rutas para tu viaje a Canadá.",
  ],
  CH: [
    "Qué ver en Suiza: ciudades, trenes panorámicos y Alpes",
    "Zúrich, Lucerna, Berna, Ginebra, Lausana, Interlaken, Zermatt y St. Moritz: trenes, pases, requisitos de entrada y rutas alpinas por Suiza.",
  ],
  BE: [
    "Qué ver en Bélgica: Bruselas, Brujas, Gante y Amberes",
    "Bruselas, Brujas, Gante, Amberes, Lovaina, Lieja, Dinant y las Ardenas: trenes, museos, requisitos de entrada y una ruta cultural por Bélgica.",
  ],
  HU: [
    "Qué ver en Hungría: Budapest, balnearios y lago Balaton",
    "Budapest, Szentendre, Eger, Pécs, Szeged, Debrecen, el lago Balaton y Sopron: trenes, balnearios termales y rutas para tu viaje a Hungría.",
  ],
  CZ: [
    "Qué ver en Chequia (República Checa): Praga y más",
    "Praga, Český Krumlov, Brno, Karlovy Vary, Kutná Hora, Olomouc, Pilsen y la Suiza Bohemia: qué ver, transporte y rutas por la República Checa.",
  ],
  PL: [
    "Qué ver en Polonia: Cracovia, Varsovia, Gdansk y Tatras",
    "Varsovia, Cracovia, Gdansk, Breslavia, Poznan, Zakopane, Torun y Lublin: trenes, requisitos de entrada y rutas por los Tatras y el Báltico.",
  ],
  RU: [
    "Viajar a Rusia: visados, Moscú, San Petersburgo y rutas",
    "Moscú, San Petersburgo, Kazán, Sochi, Kaliningrado, Múrmansk, el lago Baikal y Vladivostok: visado electrónico, seguridad y rutas por Rusia.",
  ],
  RS: [
    "Qué ver en Serbia: Belgrado, el Danubio y montañas",
    "Belgrado, Novi Sad, Niš, Subotica, Zlatibor, Tara, Kopaonik y las Puertas de Hierro: transporte, presupuesto y rutas para viajar por Serbia.",
  ],
  ME: [
    "Qué ver en Montenegro: Kotor, la costa y el Durmitor",
    "Kotor, Budva, Podgorica, Cetinje, Perast, Herceg Novi, el Durmitor y Ulcinj: requisitos de entrada, transporte y rutas por la costa y la montaña.",
  ],
  BA: [
    "Qué ver en Bosnia y Herzegovina: Sarajevo, Mostar y más",
    "Sarajevo, Mostar, Blagaj, Travnik, Jajce, Banja Luka, Trebinje y el río Una: transporte, historia y rutas de naturaleza por Bosnia y Herzegovina.",
  ],
  AL: [
    "Qué ver en Albania: Riviera, Alpes y ciudades históricas",
    "Tirana, Berat, Gjirokastër, Shkodër, Krujë, Theth, Sarandë y Himarë: transporte, requisitos de entrada y rutas por la Riviera albanesa y los Alpes.",
  ],
  GR: [
    "Qué ver en Grecia: Atenas, islas y yacimientos antiguos",
    "Atenas, Salónica, Santorini, Míkonos, Creta, Rodas, Corfú y Meteora: ferris, requisitos de entrada y rutas para combinar islas y yacimientos.",
  ],
  HR: [
    "Qué ver en Croacia: Dubrovnik, islas y parques nacionales",
    "Zagreb, Dubrovnik, Split, Zadar, Hvar, Istria, Plitvice y Šibenik: ferris, entradas a los parques nacionales y rutas para recorrer Croacia.",
  ],
  SI: [
    "Qué ver en Eslovenia: Liubliana, Bled y rutas alpinas",
    "Liubliana, Bled, Bohinj, Piran, Postojna y Predjama, el Soča, Maribor y Kranjska Gora: rutas por los Alpes, el Karst y la costa de Eslovenia.",
  ],
  NO: [
    "Viajar a Noruega: fiordos, auroras boreales y rutas",
    "Oslo, Bergen, Tromsø, las Lofoten, el Geirangerfjord, Flåm, Trondheim y Stavanger: transporte, fiordos, auroras y rutas para viajar por Noruega.",
  ],
  SE: [
    "Qué ver en Suecia: Estocolmo, archipiélagos y Laponia",
    "Estocolmo, Gotemburgo, Malmö, Upsala, Gotland, Kiruna, Abisko y Dalarna: trenes, archipiélagos, Laponia y rutas para tu viaje a Suecia.",
  ],
  DK: [
    "Qué ver en Dinamarca: Copenhague, islas y vikingos",
    "Copenhague, Aarhus, Odense, Aalborg, Ribe, Skagen, Bornholm y Roskilde: trenes, islas, historia vikinga y rutas para recorrer Dinamarca.",
  ],
  FI: [
    "Qué ver en Finlandia: Helsinki, lagos y Laponia",
    "Helsinki, Rovaniemi, Turku, Tampere, Porvoo, la región de los lagos, Inari–Saariselkä y Åland: rutas, tren nocturno y Laponia en Finlandia.",
  ],
  SJ: [
    "Viajar a Svalbard: Longyearbyen y el Ártico noruego",
    "Longyearbyen, Ny-Ålesund, Pyramiden y Barentsburg a 78° norte: transporte local, clima, presupuesto y normas para viajar a Svalbard.",
  ],
};

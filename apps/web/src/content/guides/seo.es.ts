import addedSeo from "@/content/addedSeo.json";

/**
 * İspanyolca rehberlerin <title> ve meta description'ı.
 *
 * Çeviri değil: İspanyolca aramadaki niyete göre ayrı yazıldı. İspanya'da
 * ve Latin Amerika'da en güçlü kalıp "qué ver en …"; büyük şehirlerde gün
 * planı ("Roma en 5 días"), ABD ve Latin Amerika'da yaygın "qué hacer en …"
 * ve "dónde hospedarse" ilgili şehirlerde doğal biçimde kullanıldı. Halk
 * arasındaki ad farklıysa (Trebisonda/Trabzon, Breslavia/Wrocław) ikisi de
 * geçiyor. Her satır yalnız o rehberde gerçekten anlatılan konuları vaat eder.
 *
 * Kurallar (scripts/seo-copy.test.ts): her İspanyolca rehberin satırı var,
 * başlık ≤ 60 karakter ve şehrin adını içerir, açıklama 120–160 karakter,
 * "…" yok, başlık ve açıklamalar tekil.
 */
export const ES_GUIDE_SEO: Record<string, readonly [title: string, description: string]> = {
  ...Object.fromEntries(Object.entries(addedSeo.guides.es).map(([key, [title, description]]) => [key, [title, description] as const])),
  /* ------------------------------ Japonya ------------------------------ */
  "JP:Tokyo": [
    "Qué ver en Tokio: barrios, dónde alojarse y qué comer",
    "Qué ver en Tokio barrio a barrio, de Asakusa a Shibuya y Shimokitazawa, dónde alojarse, sitios reales para comer, transporte e itinerario de 3 días.",
  ],
  "JP:Osaka": [
    "Qué ver en Osaka: comida callejera, castillo y alojamiento",
    "Dotonbori, Kuromon y Shinsekai para comer, el castillo de Osaka, Umeda o Namba para dormir, cómo llegar desde KIX, si merece la pena USJ y plan de 3 días.",
  ],
  "JP:Kyoto": [
    "Qué ver en Kioto en 3 días: templos, Gion y consejos",
    "Fushimi Inari, Kinkaku-ji y Arashiyama a la hora adecuada, las normas de Gion, el mercado de Nishiki, dónde comer, dónde alojarse y un plan de 3 días.",
  ],
  "JP:Hiroshima": [
    "Qué ver en Hiroshima: Parque de la Paz, Miyajima y comida",
    "Cómo visitar el Parque Conmemorativo de la Paz y el torii flotante de Miyajima según las mareas, dónde probar okonomiyaki, el tranvía y un plan de 2 días.",
  ],
  "JP:Nara": [
    "Qué ver en Nara: ciervos, templos y plan de 1 o 2 días",
    "Todai-ji, Kasuga Taisha y las normas con los ciervos del parque, Kintetsu o JR desde Kioto y Osaka, Naramachi, dónde comer y dormir y una ruta de 2 días.",
  ],
  "JP:Sapporo": [
    "Qué ver en Sapporo: Festival de la Nieve, comida y 3 días",
    "Sapporo en invierno y todo el año: el Festival de la Nieve, sopa de curry y ramen, en qué barrio alojarse, excursiones a Otaru y Jozankei y ruta de 3 días.",
  ],
  "JP:Kobe": [
    "Qué ver en Kobe: ternera de Kobe, Arima Onsen y 3 días",
    "Cómo reconocer la auténtica ternera de Kobe, las casas de Kitano, el puerto, el sake de Nada y Arima Onsen, dónde alojarse en Sannomiya y plan de 3 días.",
  ],
  "JP:Okinawa": [
    "Guía de Okinawa: Naha, playas y ruta de 6 días",
    "Naha y el castillo de Shuri, el acuario Churaumi, alquilar coche y conducir por la izquierda, playas seguras, las islas Kerama y dónde alojarse en Okinawa.",
  ],

  /* -------------------------------- ABD -------------------------------- */
  "US:New York": [
    "Qué hacer en Nueva York: barrios, dónde alojarse y comida",
    "Qué hacer en Nueva York más allá de Manhattan, el barrio adecuado para alojarte, JFK, LGA o EWR, el metro y OMNY, dónde comer de verdad y un plan de 4 días.",
  ],
  "US:Los Angeles": [
    "Qué hacer en Los Ángeles: dónde alojarse y cómo moverse",
    "Los Ángeles con o sin coche: en qué barrio hospedarse, Metro y traslados desde LAX, playas, estudios o parques temáticos, dónde comer y una ruta de 4 días.",
  ],
  "US:Miami": [
    "Qué hacer en Miami: Miami Beach, dónde hospedarse y comida",
    "Miami y Miami Beach no son lo mismo: dónde hospedarse más allá de South Beach, MIA o FLL, aparcar y SunPass, comida cubana, huracanes y plan de 4 días.",
  ],
  "US:Chicago": [
    "Qué ver en Chicago: arquitectura, comida y plan de 4 días",
    "Qué ver en Chicago, del crucero de arquitectura por el río al lago y los museos, trenes desde O'Hare y Midway, dónde alojarse y comida más allá del deep-dish.",
  ],
  "US:San Francisco": [
    "Qué ver en San Francisco: Alcatraz, barrios y 4 días",
    "Qué ver en San Francisco barrio a barrio, cómo reservar bien Alcatraz, el BART desde SFO, Muni y cable cars, dónde alojarse y un itinerario de 4 días.",
  ],
  "US:Las Vegas": [
    "Qué hacer en Las Vegas: el Strip, hoteles y plan de 4 días",
    "El Strip frente a Downtown y Fremont Street, cómo elegir hotel, resort fees, el aeropuerto Harry Reid, restaurantes fuera del Strip, Red Rock y plan de 4 días.",
  ],

  /* ------------------------------- İtalya ------------------------------- */
  "IT:Roma": [
    "Qué ver en Roma en 5 días: entradas, barrios y consejos",
    "Entradas al Coliseo y al Vaticano sin errores, el Panteón y la Fontana di Trevi, cómo llegar desde Fiumicino, en qué barrio alojarse y comida romana.",
  ],
  "IT:Venedik": [
    "Qué ver en Venecia en 3 días: vaporetto, tasa y barrios",
    "Quién paga la tasa de acceso de 2026, cómo usar el vaporetto, en qué sestiere alojarse, San Marcos sin multitudes, Murano, Burano y los bacari venecianos.",
  ],
  "IT:Floransa": [
    "Qué ver en Florencia: Uffizi, Duomo e itinerario de 4 días",
    "Reserva bien los Uffizi, la Accademia y la cúpula del Duomo y descubre el Oltrarno y el Pitti, con dónde alojarse, cocina toscana y un plan de 4 días.",
  ],
  "IT:Milano": [
    "Qué ver en Milán: La Última Cena, Duomo y plan de 3 días",
    "Cómo reservar La Última Cena, las terrazas del Duomo, Brera y los Navigli, Malpensa, Linate o Bérgamo, dónde alojarse, el aperitivo y una ruta de 3 días.",
  ],
  "IT:Amalfi Kıyısı": [
    "Costa Amalfitana: dónde alojarse, transporte y 5 días",
    "Positano, Amalfi o Ravello como base, cómo llegar desde Nápoles o Salerno, ferri o autobús SITA, los pueblos tranquilos del este y una ruta de 5 días.",
  ],
  "IT:Napoli": [
    "Qué ver en Nápoles: pizza, Pompeya e itinerario de 4 días",
    "Nápoles sin prisas: el centro histórico y su subsuelo, el MANN, dónde alojarse con seguridad, pizzerías clásicas, Pompeya y Herculano y plan de 4 días.",
  ],

  /* ------------------------------- Fransa ------------------------------- */
  "FR:Paris": [
    "Qué ver en París en 5 días: entradas y dónde alojarse",
    "Entradas al Louvre y la Torre Eiffel, Montmartre y el Sena, cómo llegar desde CDG y Orly, el metro, dónde alojarse, bistrós y panaderías y un plan de 5 días.",
  ],
  "FR:Nice": [
    "Qué ver en Niza: casco antiguo, playas y excursiones",
    "El Vieux Nice y la colina del Castillo, playas de guijarros, el tranvía del aeropuerto, en qué barrio dormir, cocina nizarda y excursiones a Mónaco y Antibes.",
  ],
  "FR:Lyon": [
    "Qué ver en Lyon en 3 días: Vieux Lyon, bouchons y más",
    "Los traboules del Vieux Lyon, Fourvière y la Presqu'île, cómo elegir un bouchon auténtico, cómo llegar desde el aeropuerto, dónde alojarse y ruta de 3 días.",
  ],
  "FR:Marsilya": [
    "Qué ver en Marsella: Calanques, Vieux-Port y 4 días",
    "El Vieux-Port, Le Panier y el Mucem, la reserva de las Calanques en 2026, Notre-Dame de la Garde, una zona segura para alojarse, la bouillabaisse y 4 días.",
  ],
  "FR:Bordo": [
    "Qué ver en Burdeos: vino, casco histórico y 4 días",
    "El Miroir d'eau y el centro histórico, la Cité du Vin, días de viñedos en Saint-Émilion y Médoc, el tranvía del aeropuerto, dónde alojarse y los canelés.",
  ],
  "FR:Strazburg": [
    "Qué ver en Estrasburgo: Petite France y mercados navideños",
    "La catedral y la Petite France, la Neustadt, la logística de los mercados de Navidad, cocina alsaciana, el tren del aeropuerto y una ruta de 3 días con Colmar.",
  ],

  /* ------------------------------- Tayland ------------------------------- */
  "TH:Bangkok": [
    "Qué ver en Bangkok: templos, dónde alojarse y comida",
    "El Gran Palacio, Wat Pho y Wat Arun, Chinatown de noche, Chatuchak, BTS, MRT o barcos por el río, en qué zona alojarse, comida callejera y plan de 4 días.",
  ],
  "TH:Chiang Mai": [
    "Qué ver en Chiang Mai: templos, mercados y 4 días",
    "Los templos de la ciudad antigua, Wat Umong y Doi Suthep, qué mercado visitar cada día, Old City o Nimman para dormir, khao soi y la temporada de humo.",
  ],
  "TH:Phuket": [
    "Phuket: mejores playas, dónde alojarse y ruta de 5 días",
    "Patong, Kata, Bang Tao o el casco antiguo como base, traslados desde HKT, el Smart Bus, excursiones en barco y embarcaderos, seguridad en el mar y 5 días.",
  ],
  "TH:Krabi": [
    "Krabi: ¿Ao Nang o Railay?, excursiones en barco y 4 días",
    "Ao Nang, Railay, Krabi Town o Klong Muang como base, traslados desde KBV, barcos de cola larga, qué excursión a las islas elegir, cocina del sur y 4 días.",
  ],
  "TH:Koh Samui": [
    "Koh Samui: playas, ferri y qué ver en 5 días",
    "¿Chaweng, Bophut, Lamai o Mae Nam? Dónde alojarse en Koh Samui, avión o ferri desde Donsak, cómo moverse, excursiones a Ang Thong y un plan de 5 días.",
  ],
  "TH:Ayutthaya": [
    "Qué ver en Ayutthaya: templos, tren desde Bangkok y más",
    "Cómo ir de Bangkok a Ayutthaya en tren, los templos de la isla histórica, Wat Chaiwatthanaram, bici o tuk-tuk, excursión de un día o con noche y dónde comer.",
  ],

  /* ----------------------------- Güney Kore ----------------------------- */
  "KR:Seul": [
    "Qué ver en Seúl: barrios, comida y ruta de 5 días",
    "Los palacios y Bukchon en el orden correcto, el AREX desde Incheon, la T-money y el metro, en qué barrio alojarse, mercados y barbacoa coreana, y 5 días.",
  ],
  "KR:Busan": [
    "Qué ver en Busan: playas, mercados y ruta de 4 días",
    "Las playas de Haeundae y Gwangalli, la aldea cultural de Gamcheon y el mercado de Jagalchi, cómo llegar por Gimhae o en KTX, dónde alojarse y 4 días.",
  ],
  "KR:Jeju Adası": [
    "Isla de Jeju: Hallasan, alquiler de coche y 5 días",
    "La subida al Hallasan con reserva, alquiler de coche y permiso de conducir, Udo y la costa este, una base o dos, cerdo negro y mariscos y ruta de 5 días.",
  ],
  "KR:Gyeongju": [
    "Qué ver en Gyeongju: Bulguksa, tumbas de Silla y 3 días",
    "Las tumbas de Daereungwon y Cheomseongdae, Bulguksa y Seokguram bien planificados, cómo llegar en KTX, dónde alojarse, cocina de Silla y un plan de 3 días.",
  ],
  "KR:Incheon": [
    "Qué ver en Incheon: Chinatown, Songdo y tour de tránsito",
    "Más que un aeropuerto: los tours de tránsito gratuitos, Chinatown y el Open Port, Wolmido, Songdo y Ganghwa, dónde alojarse, jjajangmyeon y 3 días.",
  ],
  "KR:Sokcho": [
    "Qué ver en Sokcho: Seoraksan, mariscos y 3 días",
    "Autobuses de Seúl a Sokcho, los senderos del Seoraksan y el teleférico, la Abai Village y el mercado, la costa del mar del Este, dónde alojarse y 3 días.",
  ],

  /* ------------------------------- İspanya ------------------------------- */
  "ES:Barcelona": [
    "Qué ver en Barcelona en 5 días: Gaudí, barrios y playa",
    "Entradas a la Sagrada Família y el Park Güell, el Gòtic, El Born y Gràcia, Montjuïc y el mar, dónde alojarse, bares de tapas y un itinerario de 5 días.",
  ],
  "ES:Madrid": [
    "Qué ver en Madrid en 4 días: museos, tapas y barrios",
    "El Prado y el Paseo del Arte, el Retiro, el Madrid de los Austrias y el Palacio Real, tapas de mercado, dónde alojarse, fútbol y un plan de 4 días.",
  ],
  "ES:Sevilla": [
    "Qué ver en Sevilla: Alcázar, Triana y flamenco",
    "El Real Alcázar y Santa Cruz, la Catedral y la Giralda, la Plaza de España, Triana y un flamenco auténtico, además de dónde alojarse, tapas y 3 días.",
  ],
  "ES:Valencia": [
    "Qué ver en Valencia: paella, Ciudad de las Artes y 4 días",
    "El Mercat Central y El Carmen, el Turia en bici, la Ciudad de las Artes y las Ciencias, el Cabanyal y la Albufera para una paella de verdad, y dónde dormir.",
  ],
  "ES:Málaga": [
    "Qué ver en Málaga: Alcazaba, Picasso y playas",
    "La Alcazaba, el Teatro Romano y Gibralfaro, el Museo Picasso, el Muelle Uno, la Malagueta y los espetos de Pedregalejo, excursiones por la Costa del Sol.",
  ],
  "ES:Granada": [
    "Qué ver en Granada: entradas a la Alhambra y el Albaicín",
    "Entrada con hora a los Palacios Nazaríes de la Alhambra, el Albaicín y el Darro, el Sacromonte de noche, bares de tapas, dónde alojarse y 3 días.",
  ],
  "ES:Bilbao": [
    "Qué ver en Bilbao: Guggenheim, pintxos y Casco Viejo",
    "El Guggenheim y la ría, el Casco Viejo y el mercado de La Ribera, una ruta de pintxos, el funicular de Artxanda, escapadas a la costa y un plan de 3 días.",
  ],
  "ES:Córdoba": [
    "Qué ver en Córdoba: Mezquita, patios y plan de 2 días",
    "La Mezquita-Catedral, la Judería, la sinagoga y el Alcázar, el Puente Romano, los patios del Palacio de Viana, dónde alojarse y dos días sin prisas.",
  ],
  "ES:Alicante": [
    "Qué ver en Alicante: castillo, playas y Costa Blanca",
    "El castillo de Santa Bárbara, el barrio de Santa Cruz, la Explanada y el Postiguet, una excursión a Tabarca, arroces, dónde alojarse y una escapada de 2 días.",
  ],
  "ES:San Sebastián": [
    "Qué ver en San Sebastián: pintxos, La Concha y 3 días",
    "La Concha y el monte Igueldo, cómo pedir pintxos en la Parte Vieja, Gros y Urgull, cocina vasca más allá de la lista Michelin, dónde alojarse y 3 días.",
  ],
  "ES:Toledo": [
    "Qué ver en Toledo en uno o dos días: catedral y El Greco",
    "El legado cristiano, judío y musulmán de Toledo, la Catedral y Zocodover, El Greco, el Cristo de la Luz, el Mirador del Valle y si conviene dormir allí.",
  ],
  "ES:Salamanca": [
    "Qué ver en Salamanca: universidad, Plaza Mayor y 2 días",
    "La universidad y las Escuelas Mayores, las catedrales Vieja y Nueva, la Plaza Mayor, la Casa de las Conchas y el Puente Romano, tapas y un plan de 2 días.",
  ],
  "ES:Palma de Mallorca": [
    "Qué ver en Palma de Mallorca: casco antiguo, calas y Sóller",
    "La Seu y el casco antiguo, el castillo de Bellver y Santa Catalina, mercados y playa urbana, el tren a Sóller, Deià y Valldemossa, y dónde alojarse.",
  ],
  "ES:Ibiza": [
    "Qué ver en Ibiza: Dalt Vila, mejores calas y vida nocturna",
    "Ibiza más allá de los clubs: Dalt Vila, patrimonio de la UNESCO, cómo elegir cala, el norte tranquilo, dónde alojarse según tu viaje y una ruta de 5 días.",
  ],
  "ES:Tenerife": [
    "Qué ver en Tenerife: Teide, Anaga y dónde alojarse",
    "Permisos del Parque Nacional del Teide, La Laguna y los senderos de Anaga, el clima del norte frente al sur, dónde alojarse, guachinches y ruta de 5 días.",
  ],
  "ES:Gran Canaria": [
    "Qué ver en Gran Canaria: Las Palmas, dunas y cumbres",
    "Vegueta y Las Canteras en Las Palmas, las dunas de Maspalomas, las carreteras de montaña de Tejeda y Artenara, los pueblos del norte y dónde alojarse.",
  ],

  /* ------------------------------- Türkiye ------------------------------- */
  "TR:İstanbul": [
    "Qué ver en Estambul en 5 días: barrios, ferris y bazares",
    "Sultanahmet bien planificado, Gálata y Beyoğlu, los ferris del Bósforo y la orilla asiática, bazares, dónde alojarse, dónde comer de verdad y plan de 5 días.",
  ],
  "TR:Antalya": [
    "Qué ver en Antalya: Kaleiçi, playas y ciudades antiguas",
    "Kaleiçi y el puerto antiguo, la playa de Konyaaltı y el museo, las cascadas, Perge, Aspendos y Termessos, ciudad o resort para dormir y un plan de 4 días.",
  ],
  "TR:İzmir": [
    "Qué ver en Esmirna: Kemeraltı, el Kordon y Éfeso",
    "El bazar de Kemeraltı y el Ágora, atardeceres en el Kordon, Alsancak y Karşıyaka, una excursión a Éfeso, cocina del Egeo, dónde alojarse y 4 días en Esmirna.",
  ],
  "TR:Muğla": [
    "Muğla: Akyaka, Datça y el golfo de Gökova",
    "Muğla más allá de Bodrum y Fethiye: Akyaka y el río Azmak, las casas de Ula, la costa de Gökova, Datça y la antigua Cnido, dónde alojarse y una ruta de 5 días.",
  ],
  "TR:Bodrum": [
    "Qué ver en Bodrum: castillo, calas y la península",
    "El castillo de Bodrum y su museo de arqueología subacuática, la antigua Halicarnaso, las puestas de sol de Gümüşlük, calas, dónde alojarse y vida nocturna.",
  ],
  "TR:Fethiye": [
    "Qué ver en Fethiye: Ölüdeniz, Camino de Licia y barcos",
    "Ölüdeniz y Babadağ, el pueblo abandonado de Kayaköy, tramos del Camino de Licia, el mercado de pescado, excursiones en barco por las calas y 5 días.",
  ],
  "TR:Marmaris": [
    "Qué ver en Marmaris: calas, İçmeler y Bozburun",
    "El casco antiguo y el puerto deportivo, el paseo a İçmeler, Turunç y las calas entre pinos, la tranquila península de Bozburun–Selimiye y dónde alojarse.",
  ],
  "TR:Kapadokya": [
    "Qué ver en Capadocia: globos, valles y plan de 4 días",
    "El Museo al Aire Libre de Göreme, rutas por los valles, Uçhisar, ciudades subterráneas y Avanos, cómo reservar el globo, dónde alojarse e itinerario de 4 días.",
  ],
  "TR:Ankara": [
    "Qué ver en Ankara: Anıtkabir, museos y plan de 3 días",
    "Anıtkabir, el Museo de las Civilizaciones de Anatolia y el castillo, la ruta republicana de Ulus, dónde alojarse, restaurantes y un plan de 3 días.",
  ],
  "TR:Bursa": [
    "Qué ver en Bursa: herencia otomana, Uludağ e İskender",
    "La Gran Mezquita y los hanes, la Mezquita Verde y Muradiye, el pueblo de Cumalıkızık, Uludağ, el İskender kebab original, dónde alojarse y una ruta de 3 días.",
  ],
  "TR:Çanakkale": [
    "Qué ver en Çanakkale: Troya, Galípoli y Bozcaada",
    "Cómo organizar Troya y su museo, los campos de batalla y memoriales de Galípoli, el paseo marítimo de Çanakkale, un día en Bozcaada y una ruta de 4 días.",
  ],
  "TR:Trabzon": [
    "Qué ver en Trebisonda (Trabzon): Sumela y Uzungöl",
    "El monasterio de Sumela y Maçka, Uzungöl y las yaylas de montaña, el centro de Trabzon, cocina del mar Negro, cómo moverse y un itinerario de 4 días.",
  ],
  "TR:Mardin": [
    "Qué ver en Mardin: casco antiguo, monasterios y Midyat",
    "El casco antiguo de piedra en terrazas, Deyrulzafaran y el legado siríaco, la antigua Dara, Midyat, el bazar, dónde alojarse y 4 días en Mesopotamia.",
  ],
  "TR:Gaziantep": [
    "Qué ver en Gaziantep: mosaicos de Zeugma y gastronomía",
    "El Museo del Mosaico de Zeugma, el castillo, el bazar de los caldereros y los hanes, baklava y kebab en su contexto, el museo Emine Göğüş y un plan de 3 días.",
  ],
  "TR:Şanlıurfa": [
    "Qué ver en Şanlıurfa: Göbeklitepe y Balıklıgöl",
    "Göbeklitepe y los yacimientos de Taş Tepeler, el museo arqueológico y los mosaicos de Haleplibahçe, Balıklıgöl, el bazar, cocina de Urfa y 3 días.",
  ],
  "TR:Eskişehir": [
    "Qué ver en Eskişehir: Odunpazarı y plan de fin de semana",
    "Un fin de semana a pie: las casas otomanas de Odunpazarı y el museo OMM, el río Porsuk, el parque Sazova, çibörek y balaban kebab, y dónde alojarse.",
  ],
  "TR:Konya": [
    "Qué ver en Konya: Museo de Mevlana, selyúcidas y 3 días",
    "El Museo de Mevlana y su plaza, los monumentos selyúcidas, el pueblo de Sille y Çatalhöyük, etliekmek y tirit, dónde alojarse y un itinerario de 3 días.",
  ],
  "TR:Kaş": [
    "Qué ver en Kaş: Kekova en barco, buceo y playas",
    "El centro de Kaş y la antigua Antiphellos, un día en barco por Kekova y Simena, buceo, las playas de Kaputaş y Patara, dónde alojarse y 4 días tranquilos.",
  ],
  "TR:Alanya": [
    "Qué ver en Alanya: castillo, playa de Cleopatra y Dim Çayı",
    "El castillo y el teleférico, la playa de Cleopatra y Damlataş, el puerto, el río Dim y el cañón de Sapadere, dónde alojarse y un itinerario de 4 días.",
  ],

  /* --------------------------- Birleşik Krallık --------------------------- */
  "GB:Londra": [
    "Qué ver en Londres en 5 días: barrios, museos y alojamiento",
    "Westminster y el South Bank, museos gratuitos, teatro en el West End, la Torre y el East End, Greenwich, en qué zona alojarse y cómo moverse por Londres.",
  ],
  "GB:Edinburgh": [
    "Qué ver en Edimburgo: castillo, Royal Mile y 4 días",
    "El castillo y la Royal Mile, Arthur's Seat y Holyrood, el New Town, Dean Village y Stockbridge, Leith, dónde alojarse y un itinerario de 4 días.",
  ],
  "GB:Manchester": [
    "Qué ver en Mánchester: fútbol, música y museos",
    "Qué hacer en Mánchester: museos de ciencia e industria, el Northern Quarter y Ancoats, días de partido, Salford Quays, dónde comer y dónde alojarse.",
  ],
  "GB:Liverpool": [
    "Qué ver en Liverpool: los Beatles, el puerto y el fútbol",
    "El frente marítimo y sus museos, una ruta de los Beatles más allá de la foto del Cavern, el Georgian Quarter y el Baltic Triangle, Anfield y 3 días.",
  ],
  "GB:Oxford": [
    "Qué ver en Oxford: colleges, la Bodleian y paseos en punt",
    "Cómo visitar de verdad los colleges, la Bodleian y la Radcliffe Camera, Christ Church, el Ashmolean y el Pitt Rivers, el punting, los pubs y 1 o 2 días.",
  ],
  "GB:Cambridge": [
    "Qué ver en Cambridge: colleges, punting y The Backs",
    "La capilla del King's College, The Backs y St John's, paseos en punt por el Cam, el Museo Fitzwilliam, dónde comer y si ir en el día o quedarse a dormir.",
  ],
  "GB:Bath": [
    "Qué ver en Bath: termas romanas, Royal Crescent y spa",
    "Las termas romanas y la abadía, el Royal Crescent y el Circus, el spa termal, el sendero Skyline, los bollos de Sally Lunn's y un itinerario de 2 días por Bath.",
  ],
  "GB:York": [
    "Qué ver en York: catedral, murallas y The Shambles",
    "Las vidrieras del York Minster, el paseo por las murallas, la Clifford's Tower, The Shambles, el Jorvik y los museos, un té en Bettys y un plan de 3 días.",
  ],
  "GB:Glasgow": [
    "Qué ver en Glasgow: West End, museos y música en directo",
    "El Kelvingrove y el West End, el diseño de Mackintosh en el centro, la Burrell Collection y el Southside, el Clyde y la música en directo, y 3 días.",
  ],
  "GB:Belfast": [
    "Qué ver en Belfast: Titanic Quarter y Calzada del Gigante",
    "Titanic Belfast y su barrio, los pubs del Cathedral Quarter, los murales y la línea de paz con respeto, excursiones a la Calzada del Gigante y 3 días.",
  ],
  "GB:Brighton": [
    "Qué ver en Brighton: Royal Pavilion, The Lanes y la playa",
    "El Royal Pavilion y The Lanes, el muelle, la torre i360 y la playa de guijarros, Kemptown y Hove, tiendas independientes, buena comida y una escapada de 2 días.",
  ],
  "GB:Bristol": [
    "Qué ver en Bristol: Clifton, el puerto y el arte urbano",
    "El Harbourside y el M Shed, el SS Great Britain de Brunel, el puente colgante de Clifton, el arte urbano de Stokes Croft, dónde comer y 3 días en Bristol.",
  ],
  "GB:Cardiff": [
    "Qué ver en Cardiff: castillo, la bahía y la cultura galesa",
    "El castillo y las galerías victorianas, el National Museum, Cardiff Bay, rugby en el Principality Stadium, cocina galesa, dónde alojarse y 3 días.",
  ],
  "GB:İskoçya Highlands": [
    "Tierras Altas de Escocia: Glencoe, Skye y el lago Ness",
    "Glencoe y Fort William, el lago Ness e Inverness, la isla de Skye y los Cairngorms, conducir o moverse en transporte, dónde alojarse y una ruta de 5 días.",
  ],
  "GB:Cotswolds": [
    "Cotswolds: los pueblos más bonitos y rutas a pie",
    "Los pueblos del norte y del sur de los Cotswolds, el Cotswold Way, cómo moverse sin coche, pubs de campo, dónde alojarse y un itinerario de 4 días.",
  ],
  "GB:Lake District": [
    "Distrito de los Lagos: Windermere, Keswick y caminatas",
    "Windermere, Bowness y Ambleside, Keswick y el Derwentwater, la ruta literaria de Coniston, caminatas por las colinas con seguridad, dónde alojarse y 5 días.",
  ],

  /* ------------------------------ Endonezya ------------------------------ */
  "ID:Jakarta": [
    "Qué ver en Yakarta: Kota Tua, museos y plan de 3 días",
    "Kota Tua y la plaza Fatahillah, el Monas y el Museo Nacional, el MACAN y el sur de Yakarta, cómo esquivar el tráfico, dónde alojarse, comida y 3 días.",
  ],
  "ID:Yogyakarta": [
    "Qué ver en Yogyakarta: Borobudur, Prambanan y el Kraton",
    "Visitas con hora a Borobudur y Prambanan, Ratu Boko, el Kraton, Taman Sari y Kotagede, talleres de batik, dónde alojarse y un itinerario de 3 días.",
  ],
  "ID:Ubud": [
    "Qué ver en Ubud: templos, arrozales y dónde alojarse",
    "Danzas en el Palacio de Ubud, el paseo de Campuhan y los arrozales, Tirta Empul y los pueblos cercanos, normas en los templos, el tráfico y 3 días.",
  ],
  "ID:Canggu": [
    "Qué ver en Canggu: surf, cafés y dónde alojarse en Bali",
    "Batu Bolong y Echo Beach, Pererenan y Seseh más tranquilos, surf para todos los niveles, los cafés, Tanah Lot al atardecer y cómo elegir base en Canggu.",
  ],
  "ID:Uluwatu": [
    "Qué ver en Uluwatu: templo, danza kecak y playas de surf",
    "El templo de Uluwatu y el espectáculo kecak, Padang Padang y Bingin, las playas de Melasti y Nyang Nyang, cómo moverse por el Bukit y dónde alojarse.",
  ],
  "ID:Nusa Penida": [
    "Qué ver en Nusa Penida: Kelingking, mantas y logística",
    "Kelingking, Broken Beach y Angel's Billabong, Diamond Beach y Atuh, snorkel con mantas, el barco desde Sanur, las carreteras de la isla y dónde alojarse.",
  ],
  "ID:Lombok": [
    "Qué ver en Lombok: Rinjani, playas de Kuta y pueblos sasak",
    "Kuta Lombok y las calas del sur, el trekking al Rinjani desde Senaru, pueblos sasak y cascadas, la conexión con las Gili y cómo dividir Lombok por zonas.",
  ],
  "ID:Gili Adaları": [
    "Islas Gili: ¿Trawangan, Meno o Air? Snorkel y ferris",
    "Gili Trawangan, Meno y Air comparadas, barcos rápidos desde Bali y Lombok, una ruta de snorkel por las tres islas, cursos de buceo y la vida sin coches.",
  ],
  "ID:Labuan Bajo": [
    "Labuan Bajo: excursiones en barco a Komodo y Padar",
    "Barco de un día o crucero de varios días por el Parque Nacional de Komodo, la isla de Padar, dragones en Komodo o Rinca, mantas, playas rosas y dónde dormir.",
  ],
  "ID:Bromo Dağı": [
    "Monte Bromo: miradores del amanecer, cráter y cómo llegar",
    "Cómo llegar al monte Bromo desde Surabaya o Malang, dormir en Cemoro Lawang, Penanjakan y otros miradores, el Mar de Arena, el cráter y la seguridad.",
  ],
  "ID:Banyuwangi": [
    "Banyuwangi: cráter del Ijen y naturaleza de Java Oriental",
    "El cráter del Ijen con seguridad, el bosque de De Djawatan y la cultura osing, los parques de Alas Purwo o Baluran, el ferry a Bali y dónde alojarse.",
  ],
  "ID:Bandung": [
    "Qué ver en Bandung: art déco, volcanes y comida sundanesa",
    "Las calles art déco de Braga y Asia Afrika, Tangkuban Perahu y Lembang, Kawah Putih y Ciwidey, cocina sundanesa y el tren rápido Whoosh desde Yakarta.",
  ],
  "ID:Surabaya": [
    "Qué ver en Surabaya: historia, barrios y base para Bromo",
    "Tugu Pahlawan y el Museo del 10 de Noviembre, Ampel y el barrio árabe, Kya-Kya y el antiguo puerto, cocina de Java Oriental y Surabaya como base para Bromo.",
  ],
  "ID:Toba Gölü": [
    "Lago Toba: Samosir, cultura batak y cómo llegar",
    "El ferri de Parapat a Tuk Tuk, Tuk Tuk y Tomok, los pueblos batak de Ambarita y Simanindo, el interior de Samosir, los miradores de Tele y la ruta desde Medan.",
  ],
  "ID:Bukittinggi": [
    "Qué ver en Bukittinggi: cultura minangkabau y cañones",
    "El Jam Gadang y el Pasar Atas, el cañón de Sianok y Lobang Jepang, Pagaruyung y los pueblos minangkabau, cocina de Padang y las tierras altas de Sumatra.",
  ],
  "ID:Raja Ampat": [
    "Raja Ampat: buceo, alojamiento local y cómo llegar",
    "El ferri de Sorong a Waisai, las tasas ambientales, homestay o crucero de buceo, los miradores de Piaynemo o Wayag, el estrecho de Dampier y aves del paraíso.",
  ],
  "ID:Makassar": [
    "Qué ver en Makassar: Fort Rotterdam, marisco e islas",
    "Fort Rotterdam y el museo La Galigo, el puerto de pinisi de Paotere, los atardeceres de Losari y las islas cercanas, el marisco y la ruta a Tana Toraja.",
  ],
  "ID:Tana Toraja": [
    "Tana Toraja: aldeas, ceremonias y rutas de trekking",
    "Ke'te Kesu y Londa, Bori Kalimbuang y los pueblos del norte, Batutumonga y Lolai, cómo asistir a ceremonias con respeto, guías locales y Rantepao como base.",
  ],

  /* -------------------------------- Çin -------------------------------- */
  "CN:Pekin": [
    "Qué ver en Pekín: Ciudad Prohibida, Gran Muralla y hutongs",
    "Reservar la Ciudad Prohibida con pasaporte, las vistas de Jingshan, el Templo del Cielo y los hutongs, la Muralla en Mutianyu o Jinshanling y dónde alojarse.",
  ],
  "CN:Şanghay": [
    "Qué ver en Shanghái: el Bund, barrios y comida",
    "El Bund y el skyline de Pudong, la Concesión Francesa y los lilong, el Museo de Shanghái y el West Bund, el metro, los pueblos de agua y dónde alojarse.",
  ],
  "CN:Xi'an": [
    "Qué ver en Xi'an: Guerreros de Terracota y murallas",
    "Cómo visitar los Guerreros de Terracota, las murallas y la Torre de la Campana, la Gran Mezquita y la comida del barrio musulmán, trenes y un plan de 3 días.",
  ],
  "CN:Chengdu": [
    "Qué ver en Chengdu: pandas, casas de té y comida de Sichuan",
    "La base de pandas a la hora adecuada, las casas de té del People's Park, Kuanzhai, el monasterio de Wenshu, Taikoo Li, comida de Sichuan y dónde alojarse.",
  ],
  "CN:Chongqing": [
    "Qué ver en Chongqing: Hongya Cave, hotpot y el Yangtsé",
    "Hongya Cave y Jiefangbei, el tren que atraviesa un edificio en Liziba, Eling y Testbed 2, el teleférico del Yangtsé a Nan'an, el hotpot y cómo moverse.",
  ],
  "CN:Hangzhou": [
    "Qué ver en Hangzhou: Lago del Oeste, Lingyin y té Longjing",
    "El Lago del Oeste en medias jornadas, el templo Lingyin y Feilai Feng, los pueblos de té de Longjing y Meijiawu, el Gran Canal y dónde alojarse.",
  ],
  "CN:Suzhou": [
    "Qué ver en Suzhou: jardines clásicos, canales y museo",
    "El Jardín del Administrador Humilde y el Museo de Suzhou, los canales de Pingjiang Road, el Jardín de la Permanencia o la Colina del Tigre y pueblos de agua.",
  ],
  "CN:Nanjing": [
    "Qué ver en Nankín: murallas Ming y Montaña Púrpura",
    "La Montaña Púrpura y el Mausoleo de Sun Yat-sen, las murallas Ming y el lago Xuanwu, el Memorial de la Masacre de Nanjing y el pasado republicano de Nankín.",
  ],
  "CN:Guilin ve Yangshuo": [
    "Guilin y Yangshuo: crucero por el río Li y paisaje kárstico",
    "El crucero por el río Li de Guilin a Yangshuo, el río Yulong en balsa o en bici, rutas por el campo, las terrazas de arroz de Longji y dónde alojarse.",
  ],
  "CN:Zhangjiajie": [
    "Qué ver en Zhangjiajie: Wulingyuan, Tianmen y entradas",
    "Yuanjiajie y la montaña Tianzi, el arroyo del Látigo Dorado, la montaña Tianmen, cómo funcionan entradas y autobuses del parque, la niebla y dónde dormir.",
  ],
  "CN:Guangzhou": [
    "Qué ver en Cantón (Guangzhou): dim sum, ciudad vieja y más",
    "Dim sum por la mañana, la Academia del Clan Chen y Liwan, la isla de Shamian y Qingping, la Canton Tower y Zhujiang New Town, el metro y un plan de 3 días.",
  ],
  "CN:Shenzhen": [
    "Qué ver en Shenzhen: diseño, museos y costa",
    "Shenzhen más allá de la frontera con Hong Kong: museos de arte contemporáneo y de planificación, OCT-LOFT y Nanshan, la costa de Dapeng y cómo moverse.",
  ],
  "CN:Kunming": [
    "Kunming: Bosque de Piedra, comida de Yunnan y trenes",
    "El Green Lake y el templo Yuantong, el Bosque de Piedra, las Western Hills y el lago Dianchi, la cocina de Yunnan y el tren hacia Dali y Lijiang.",
  ],
  "CN:Dali": [
    "Qué ver en Dali: ciudad antigua, lago Erhai y pueblos bai",
    "La ciudad antigua de Dali y las Tres Pagodas, los pueblos bai de Xizhou y Zhoucheng, el lago Erhai sin prisas, caminatas por el Cangshan y dónde alojarse.",
  ],
  "CN:Lijiang": [
    "Lijiang: casco antiguo y Montaña Nevada del Dragón de Jade",
    "La ciudad antigua de Dayan y el Estanque del Dragón Negro, la cultura naxi de Baisha y Shuhe, la Montaña Nevada del Dragón de Jade, la altitud y dónde dormir.",
  ],
  "CN:Harbin": [
    "Harbin: Festival de Hielo, Snow Expo y consejos de invierno",
    "Ice and Snow World, la Sun Island Snow Expo, Central Street y la catedral de Santa Sofía, cómo vestirse para el frío extremo, el legado ruso y 3 días.",
  ],

  /* ------------------------------- Hollanda ------------------------------- */
  "NL:Amsterdam": [
    "Qué ver en Ámsterdam: museos, canales y dónde alojarse",
    "Entradas al Rijksmuseum y al Museo Van Gogh, los canales y el Jordaan, Noord y los Docklands, normas para ir en bici, dónde alojarse y un plan de 3 días.",
  ],
  "NL:Rotterdam": [
    "Qué ver en Róterdam: arquitectura, Markthal y el puerto",
    "Un paseo arquitectónico de Centraal a la Markthal y las casas cubo, Kop van Zuid y Katendrecht, la visita al puerto, el Depot Boijmans y un plan de 3 días.",
  ],
  "NL:Lahey": [
    "Qué ver en La Haya: Mauritshuis, Palacio de la Paz y playa",
    "El Mauritshuis y el Hofvijver, el Palacio de la Paz y la zona internacional, la playa de Scheveningen y el Kunstmuseum, y dónde alojarse en La Haya.",
  ],
  "NL:Utrecht": [
    "Qué ver en Utrecht: Torre del Dom, canales y museos",
    "Subir a la Torre del Dom, los muelles a dos niveles del Oudegracht, el Museum Quarter, la Casa Rietveld Schröder y Utrecht como base de tren para excursiones.",
  ],
  "NL:Haarlem": [
    "Qué ver en Haarlem: Frans Hals, hofjes y excursiones",
    "El Grote Markt y la Grote Kerk, el Museo Frans Hals, los patios hofjes escondidos, el molino De Adriaan, la playa de Zandvoort y Haarlem como base tranquila.",
  ],
  "NL:Leiden": [
    "Qué ver en Leiden: museos, canales y universidad",
    "El Rijksmuseum van Oudheden, el Hortus Botanicus, la universidad, el Boerhaave o De Lakenhal, los canales y cómo planear Leiden en el día o con noche.",
  ],
  "NL:Delft": [
    "Qué ver en Delft: Vermeer, cerámica azul y canales",
    "El Markt, la Nieuwe Kerk y la Oude Kerk, el Vermeer Centrum, una visita a Royal Delft, paseos por los canales y cómo encajar Delft en un día desde La Haya.",
  ],
  "NL:Maastricht": [
    "Qué ver en Maastricht: casco antiguo, cuevas y comida",
    "El Vrijthof y la Basílica de San Servacio, el Onze Lieve Vrouweplein y Stokstraat, las cuevas y el fuerte de Sint Pietersberg, cocina borgoñona y 3 días.",
  ],
  "NL:Groningen": [
    "Qué ver en Groninga (Groningen): Forum, museo y ambiente",
    "La azotea del Forum y el Grote Markt, el Groninger Museum, el Hoge der A y el Noorderplantsoen, el centro compacto en bici y dónde alojarse en Groninga.",
  ],
  "NL:Eindhoven": [
    "Qué ver en Eindhoven: diseño holandés y Strijp-S",
    "Strijp-S y su escena de diseño, el Van Abbemuseum, el Museo Philips y una ruta de arte con luz, cómo llegar desde el aeropuerto y un plan de 1 o 2 días.",
  ],
  "NL:Giethoorn": [
    "Giethoorn: canales, barcas y cómo evitar las multitudes",
    "El paseo por el Dorpsgracht, una barca eléctrica silenciosa, el Parque Nacional Weerribben-Wieden, cómo esquivar los autobuses turísticos y quedarse a dormir.",
  ],
  "NL:Zaanse Schans": [
    "Zaanse Schans: molinos y plan de media jornada",
    "Los molinos en funcionamiento, el Zaans Museum y Verkade, las casas de madera y la artesanía, entradas y multitudes, y media jornada desde Ámsterdam.",
  ],
  "NL:Keukenhof ve Lisse": [
    "Keukenhof: temporada de tulipanes, entradas y campos",
    "Los jardines de Keukenhof en su corta temporada de primavera, entradas con hora y transporte, los campos de bulbos de Lisse en bici y un día completo.",
  ],
  "NL:Texel": [
    "Qué ver en Texel: ferri, bici y dunas",
    "El ferri desde Den Helder, rutas en bici por las dunas, De Slufter, las focas de Ecomare, el faro del norte, las temporadas de aves y dónde alojarse en Texel.",
  ],

  /* ------------------------------ Avusturya ------------------------------ */
  "AT:Viyana": [
    "Qué ver en Viena en 3 días: palacios, museos y cafés",
    "El Palacio de Schönbrunn, el Hofburg y el Barrio de los Museos, el Belvedere y la Karlskirche, música clásica, cafés vieneses y dónde alojarse en Viena.",
  ],
  "AT:Salzburg": [
    "Qué ver en Salzburgo: casco antiguo, Mozart y fortaleza",
    "La fortaleza de Hohensalzburg, la Getreidegasse y la ruta de Mozart, los jardines de Mirabell y el Mönchsberg, excursiones a lagos y montañas y 3 días.",
  ],
  "AT:Innsbruck": [
    "Qué ver en Innsbruck: Nordkette, casco antiguo y Alpes",
    "El teleférico de la Nordkette, el casco antiguo y el Tejadillo de Oro, el trampolín de Bergisel, el invierno y la montaña, dónde alojarse y 3 días.",
  ],
  "AT:Graz": [
    "Qué ver en Graz: Schlossberg, Kunsthaus y gastronomía",
    "El Schlossberg y la Torre del Reloj, la Kunsthaus y la Murinsel, el Palacio de Eggenberg, el casco antiguo de la UNESCO, cocina estiria y un plan de 3 días.",
  ],
  "AT:Hallstatt": [
    "Qué ver en Hallstatt: mina de sal, Skywalk y Dachstein",
    "El pueblo antiguo de Hallstatt, la mina de sal Salzwelten y el Skywalk, el Dachstein Krippenstein, cómo esquivar las multitudes y la mejor hora para ir.",
  ],
  "AT:Wachau Vadisi": [
    "Valle de Wachau: Melk, Dürnstein y vino del Danubio",
    "La Abadía de Melk, Dürnstein y Krems, el Danubio en bici o en barco, terrazas de viñedos, la temporada del albaricoque y dónde alojarse en el valle de Wachau.",
  ],
  "AT:Linz": [
    "Qué ver en Linz: Ars Electronica y el Danubio",
    "El Ars Electronica Center, el Lentos y la orilla del Danubio, el tranvía al Pöstlingberg, la transformación industrial de Linz y un plan de 1 o 2 días.",
  ],
  "AT:Zell am See": [
    "Qué ver en Zell am See: lago, Schmittenhöhe y Kaprun",
    "Bañarse en el Zeller See, el teleférico del Schmittenhöhe, el glaciar del Kitzsteinhorn y Kaprun, actividades en cada estación y dónde alojarse en Zell am See.",
  ],

  /* ------------------------------- Portekiz ------------------------------- */
  "PT:Lizbon": [
    "Qué ver en Lisboa en 3 días: tranvías, miradores y barrios",
    "La Alfama y el castillo de São Jorge, Belém, la Baixa, el Chiado y los miradouros, los tranvías, el fado, dónde alojarse y consejos para ir a Sintra.",
  ],
  "PT:Porto": [
    "Qué ver en Oporto (Porto): Ribeira, bodegas y azulejos",
    "La Ribeira y el puente Don Luis I, los azulejos de São Bento, la Sé y los Clérigos, las bodegas de vino de Oporto en Gaia, el Duero y un plan de 3 días.",
  ],
  "PT:Sintra": [
    "Qué ver en Sintra: Palacio da Pena, Regaleira y entradas",
    "El Palacio da Pena, el Castillo de los Moros y la Quinta da Regaleira en el orden correcto, entradas con hora, cómo llegar desde Lisboa y la costa atlántica.",
  ],
  "PT:Algarve": [
    "Qué ver en el Algarve: mejores playas, pueblos y alojamiento",
    "Lagos y la Ponta da Piedade, Faro y la Ria Formosa, Tavira y la costa oriental, playas entre acantilados, moverse sin coche y dónde alojarse en el Algarve.",
  ],
  "PT:Madeira": [
    "Qué ver en Madeira: levadas, Funchal y picos",
    "Funchal, el Pico do Arieiro y las rutas de montaña, las mejores levadas, la costa norte, cómo moverse por la isla, el tiempo según la estación y dónde dormir.",
  ],
  "PT:Azor Adaları": [
    "Qué ver en las Azores: Sete Cidades, Furnas y qué islas",
    "Las lagunas de Sete Cidades, Furnas y sus termas, el triángulo Pico–Faial, avistamiento de ballenas, vuelos y ferris entre islas y cuántos días dedicarles.",
  ],
  "PT:Coimbra": [
    "Qué ver en Coímbra: universidad, biblioteca y fado",
    "La Universidad de Coímbra y su biblioteca, la Sé Velha y la Alta, Santa Clara al otro lado del Mondego, el fado de Coímbra y un plan desde Lisboa u Oporto.",
  ],
  "PT:Évora": [
    "Qué ver en Évora: templo romano, Capilla de los Huesos y más",
    "El Templo Romano y la Sé, la Capela dos Ossos, el Crómlech de los Almendres, la cocina alentejana, en el día o con noche, y un plan de 2 o 3 días por Évora.",
  ],

  /* ------------------------------- Almanya ------------------------------- */
  "DE:Berlin": [
    "Qué ver en Berlín: historia, museos y barrios en 3 días",
    "El Reichstag y el barrio del gobierno, la Isla de los Museos y el Humboldt Forum, los memoriales del Muro, la cultura de barrio, dónde alojarse y 3 días.",
  ],
  "DE:Münih": [
    "Qué ver en Múnich: casco antiguo, museos y cerveza",
    "La Marienplatz y la Residenz, los museos del Kunstareal, el palacio y el parque de Nymphenburg, jardines de cerveza, mercados, dónde alojarse y 3 días.",
  ],
  "DE:Hamburg": [
    "Qué ver en Hamburgo: Speicherstadt, Elbphilharmonie y puerto",
    "La Speicherstadt y el Kontorhaus, la plaza de la Elbphilharmonie, el puerto y Landungsbrücken, los ferris, los barrios y un plan de 3 días por Hamburgo.",
  ],
  "DE:Köln": [
    "Qué ver en Colonia: catedral, museos y el Rin",
    "La catedral de Colonia y la subida a su torre, el Museo Ludwig y el legado romano, el Rin y el Rheinauhafen, las cervecerías de Kölsch, dónde dormir y 3 días.",
  ],
  "DE:Frankfurt": [
    "Qué ver en Fráncfort: Museumsufer, casco antiguo y skyline",
    "La orilla de los museos, el Römerberg y la Neue Altstadt reconstruida, la Main Tower y el Westend, el Apfelwein y 3 días más allá del aeropuerto.",
  ],
  "DE:Dresden": [
    "Qué ver en Dresde: Zwinger, Frauenkirche y el Elba",
    "El Zwinger y los Maestros Antiguos, la Frauenkirche y el Neumarkt, el Elba y la Neustadt, los tesoros artísticos de Sajonia, dónde alojarse y un plan de 3 días.",
  ],
  "DE:Nürnberg": [
    "Qué ver en Núremberg: castillo, casco antiguo e historia",
    "El castillo imperial y el casco medieval, el Centro de Documentación y los lugares de la era nazi, el Germanisches Nationalmuseum y el mercado de Navidad.",
  ],
  "DE:Kara Orman": [
    "Selva Negra: Friburgo, Titisee y rutas de senderismo",
    "Friburgo y el Schauinsland, el Titisee y el Feldberg, Triberg y la ruta de los relojes de cuco, senderos por el bosque, balnearios, trenes y dónde alojarse.",
  ],

  /* ------------------------------- Meksika ------------------------------- */
  "MX:Mexico City": [
    "Qué hacer en Ciudad de México: museos, barrios y comida",
    "El Centro Histórico y el Templo Mayor, Chapultepec y el Museo de Antropología, Coyoacán y la UNAM, en qué colonia hospedarse, comida y consejos por la altitud.",
  ],
  "MX:Oaxaca": [
    "Qué ver en Oaxaca: Monte Albán, mercados y mole",
    "Santo Domingo, Monte Albán, la ruta artesanal de Tlacolula y Teotitlán, los mercados y el mole oaxaqueño, el mezcal, dónde hospedarse y un plan de 3 días.",
  ],
  "MX:Cancún": [
    "Qué hacer en Cancún: playas, Isla Mujeres y excursiones",
    "Las playas de la Zona Hotelera, el ferri a Isla Mujeres, el MUSA y el arrecife, hospedarse en el centro o en la Zona Hotelera, el sargazo y excursiones mayas.",
  ],
  "MX:Tulum": [
    "Qué hacer en Tulum: ruinas, cenotes y Sian Ka'an",
    "La zona arqueológica de Tulum junto al mar, los mejores cenotes, la reserva de Sian Ka'an, hospedarse en la playa o en el pueblo, cómo moverse y 3 días.",
  ],
  "MX:Mérida": [
    "Qué ver en Mérida: centro, Uxmal y cocina yucateca",
    "La Plaza Grande y sus museos, el Paseo de Montejo, un día en Uxmal, cenotes y haciendas, la cocina yucateca, cómo llevar el calor y un plan de 3 días.",
  ],
  "MX:Guadalajara": [
    "Qué hacer en Guadalajara: Cabañas, Tlaquepaque y comida",
    "El Hospicio Cabañas y los frescos de Orozco, el Centro Histórico, la artesanía de Tlaquepaque, la comida jalisciense y el mariachi y el tequila sin clichés.",
  ],
  "MX:San Miguel de Allende": [
    "Qué ver en San Miguel de Allende: centro histórico y arte",
    "La Parroquia y el Jardín, el Instituto Allende y las galerías, el jardín botánico El Charco del Ingenio, hoteles con patio y un plan de 3 días por San Miguel.",
  ],
  "MX:Chiapas": [
    "Qué ver en Chiapas: San Cristóbal, Palenque y el Sumidero",
    "San Cristóbal de las Casas, el Cañón del Sumidero, las ruinas de Palenque en la selva, cómo visitar las comunidades mayas con respeto y las largas distancias.",
  ],

  /* ------------------------------- Brezilya ------------------------------- */
  "BR:Rio de Janeiro": [
    "Qué hacer en Río de Janeiro: playas, miradores y alojamiento",
    "El Cristo Redentor en el Corcovado, el Pan de Azúcar, Copacabana e Ipanema, el Centro y Santa Teresa, seguridad, dónde hospedarse y un plan de 3 días.",
  ],
  "BR:São Paulo": [
    "Qué hacer en São Paulo: museos, comida y barrios",
    "La Avenida Paulista y el MASP, el Centro Histórico, el parque Ibirapuera, la comida de inmigrantes de Liberdade a Bixiga, cómo moverse y dónde hospedarse.",
  ],
  "BR:Salvador": [
    "Qué ver en Salvador de Bahía: Pelourinho, playas y comida",
    "El centro histórico del Pelourinho, Barra y su faro, Bonfim y Ribeira, la música y la fe afrobrasileñas, la cocina bahiana, la seguridad y un plan de 3 días.",
  ],
  "BR:Foz do Iguaçu": [
    "Foz de Iguazú: las cataratas del lado brasileño y más",
    "El Parque Nacional do Iguaçu del lado brasileño, cómo cruzar al lado argentino, el Parque das Aves, la triple frontera, dónde alojarse y un plan de 3 días.",
  ],
  "BR:Florianópolis": [
    "Qué hacer en Florianópolis: playas, Lagoa y dónde alojarse",
    "La Lagoa da Conceição, la Ilha do Campeche, el legado azoriano y las ostras de Ribeirão da Ilha, cómo elegir playa, senderos y cómo moverse por la isla.",
  ],
  "BR:Recife ve Olinda": [
    "Recife y Olinda: centros históricos, frevo y costa",
    "Recife Antigo, la Olinda colonial en su colina, el Instituto Ricardo Brennand, el frevo y el carnaval, la costa de Pernambuco, la seguridad y un plan de 3 días.",
  ],
  "BR:Manaus ve Amazon": [
    "Manaos y la Amazonia: lodges, ríos y Teatro Amazonas",
    "El Teatro Amazonas, el Encuentro de las Aguas, cómo elegir un lodge responsable, excursiones por el río, comunidades locales y cuándo ir a la Amazonia.",
  ],
  "BR:Lençóis Maranhenses": [
    "Lençóis Maranhenses: dunas y temporada de lagunas",
    "Cuándo se llenan las lagunas de lluvia, los circuitos desde Barreirinhas, Atins y Santo Amaro más tranquilos, excursiones en 4x4, cómo llegar desde São Luís.",
  ],

  /* ------------------------------- Arjantin ------------------------------- */
  "AR:Buenos Aires": [
    "Qué hacer en Buenos Aires: barrios, tango y comida",
    "La Plaza de Mayo y el Microcentro, Recoleta y el MALBA, San Telmo y La Boca, tango, parrillas, cómo pagar en pesos, dónde alojarse y un plan de 3 días.",
  ],
  "AR:Mendoza": [
    "Qué hacer en Mendoza: bodegas, los Andes y parques",
    "Catas de vino en Maipú y Luján de Cuyo, el Parque General San Martín, la ruta de Alta Montaña hacia el Aconcagua, dónde alojarse y un plan de 3 días.",
  ],
  "AR:Bariloche": [
    "Qué hacer en Bariloche: Circuito Chico, lagos y trekking",
    "Los miradores del Circuito Chico, los cerros Campanario y Catedral, navegaciones por el Nahuel Huapi, trekking, chocolaterías, dónde alojarse y 3 días.",
  ],
  "AR:El Calafate": [
    "El Calafate: glaciar Perito Moreno y navegaciones",
    "Las pasarelas del glaciar Perito Moreno, navegaciones entre glaciares, la Laguna Nimez, los traslados, el viento patagónico y un plan de 3 días.",
  ],
  "AR:Ushuaia": [
    "Qué hacer en Ushuaia: Canal Beagle y Tierra del Fuego",
    "Navegaciones por el Canal Beagle, el Parque Nacional Tierra del Fuego, la caminata al Glaciar Martial, la ciudad del fin del mundo, dónde alojarse y 3 días.",
  ],
  "AR:Salta ve Jujuy": [
    "Salta y Jujuy: Quebrada de Humahuaca y Salinas Grandes",
    "El centro de Salta, la Quebrada de Humahuaca, las Salinas Grandes y el Hornocal, recorrer el noroeste en coche o autobús, la altura y cuántos días hacen falta.",
  ],
  "AR:Puerto Iguazú": [
    "Puerto Iguazú: cataratas del lado argentino y más",
    "Los circuitos argentinos del Parque Nacional Iguazú, cómo cruzar al lado brasileño, Güirá Oga, dónde alojarse en Puerto Iguazú y un plan de 3 días.",
  ],
  "AR:El Chaltén": [
    "El Chaltén: trekking al Fitz Roy y Laguna Torre",
    "Trekking a la Laguna de los Tres bajo el Fitz Roy, Laguna Torre y la Loma del Pliegue Tumbado, el viento patagónico, el viaje desde El Calafate y dónde dormir.",
  ],

  /* -------------------------------- Kanada -------------------------------- */
  "CA:Toronto": [
    "Qué hacer en Toronto: barrios, islas y museos",
    "Harbourfront y las Toronto Islands, el ROM y la AGO, Kensington Market, Chinatown y Queen West, el TTC, dónde alojarse y un plan de 3 días por Toronto.",
  ],
  "CA:Vancouver": [
    "Qué hacer en Vancouver: Stanley Park, Granville y montañas",
    "Stanley Park y el seawall, Granville Island, las montañas del North Shore, en qué barrio alojarse, cómo moverse en SkyTrain y un plan de 3 días por Vancouver.",
  ],
  "CA:Montreal": [
    "Qué hacer en Montreal: Viejo Montreal, Mont-Royal y comida",
    "El Vieux-Montréal, el Mont-Royal, el mercado Jean-Talon y Mile End, festivales, bagels y cocina francocanadiense, el metro, dónde alojarse y 3 días.",
  ],
  "CA:Québec City": [
    "Ciudad de Quebec: casco antiguo, murallas e invierno",
    "La ciudad alta y las murallas, Petit-Champlain, el Musée de la civilisation, la temporada del carnaval de invierno, el legado francés, dónde alojarse y 3 días.",
  ],
  "CA:Banff": [
    "Qué ver en Banff: Lake Louise, Moraine Lake y senderos",
    "Acceso en lanzadera a Lake Louise y Moraine Lake, la Banff Gondola y el Bow Valley, senderos, fauna con seguridad, pases del parque, dónde alojarse y 3 días.",
  ],
  "CA:Jasper": [
    "Qué ver en Jasper: Maligne Lake, Icefield y cielos oscuros",
    "Maligne Lake, Athabasca Falls, el Columbia Icefield por la Icefields Parkway, observar estrellas en cielo oscuro, fauna con seguridad y dónde alojarse.",
  ],
  "CA:Niagara Şelaleleri": [
    "Cataratas del Niágara: Horseshoe Falls y el Parkway",
    "Table Rock y las Horseshoe Falls, la Niagara Parks Power Station, la Niagara Parkway y los viñedos de Niagara-on-the-Lake, dónde alojarse y un plan de 3 días.",
  ],
  "CA:Yukon": [
    "Yukón: Whitehorse, Kluane y Dawson City",
    "Whitehorse y el río Yukón, el Parque Nacional Kluane, la historia del Klondike en Dawson City, la temporada de auroras, las grandes distancias y la seguridad.",
  ],

  /* ------------------------------- İsviçre ------------------------------- */
  "CH:Zürih": [
    "Qué ver en Zúrich: casco antiguo, lago y Uetliberg",
    "El Altstadt y el Grossmünster, la Kunsthaus, barcos y baños en el lago de Zúrich, el mirador del Uetliberg, pases de transporte suizos y dónde alojarse.",
  ],
  "CH:Luzern": [
    "Qué ver en Lucerna: Puente de la Capilla, lago y Pilatus",
    "El Kapellbrücke y la ciudad vieja, el Museo Suizo del Transporte, barcos por el lago, el Pilatus o el Rigi, pases suizos, dónde alojarse y un plan de 3 días.",
  ],
  "CH:Bern": [
    "Qué ver en Berna: casco antiguo, Zytglogge y el Aar",
    "La ciudad vieja de la UNESCO y el Zytglogge, el Bundeshaus, el Rosengarten, la orilla del Aar, soportales y mercados, y 2 o 3 días en la capital suiza.",
  ],
  "CH:Cenevre": [
    "Qué ver en Ginebra: lago, casco antiguo, ONU y CERN",
    "El Jet d'Eau y la orilla del lago, la ciudad vieja y la catedral de Saint-Pierre, el Palais des Nations y el CERN, transporte público, dónde alojarse y 3 días.",
  ],
  "CH:Lozan": [
    "Qué ver en Lausana: casco antiguo, Museo Olímpico y Lavaux",
    "La catedral de Lausana y la Cité, el Museo Olímpico y Ouchy, la Collection de l'Art Brut, paseos por los viñedos de Lavaux, dónde alojarse y un plan de 3 días.",
  ],
  "CH:Interlaken": [
    "Qué ver en Interlaken: Jungfrau, Lauterbrunnen y lagos",
    "Harder Kulm, el valle de Lauterbrunnen, el Jungfraujoch o Grindelwald-First, barcos por los lagos, el tiempo en la montaña, pases y dónde alojarse.",
  ],
  "CH:Zermatt": [
    "Qué ver en Zermatt: vistas al Cervino, Gornergrat y rutas",
    "El tren del Gornergrat, el Matterhorn Glacier Paradise, el paseo de los Cinco Lagos, el pueblo sin coches, el tiempo en la montaña y dónde alojarse.",
  ],
  "CH:St. Moritz": [
    "Qué ver en St. Moritz: lagos de Engadina y línea del Bernina",
    "El lago de St. Moritz y el centro, Muottas Muragl o Corviglia, la línea del Bernina hacia Italia, deportes de invierno y rutas de verano en la Engadina.",
  ],

  /* ------------------------------- Belçika ------------------------------- */
  "BE:Brüksel": [
    "Qué ver en Bruselas: Grand-Place, museos y Atomium",
    "La Grand-Place y el centro histórico, el Museo Magritte y el Mont des Arts, el Barrio Europeo y el Atomium, el art nouveau, la comida y un plan de 3 días.",
  ],
  "BE:Brugge": [
    "Qué ver en Brujas: canales, Belfort y primitivos flamencos",
    "El Markt y el Belfort, el Groeningemuseum y el Sint-Janshospitaal, los canales y el Begijnhof, cómo esquivar las excursiones de un día y dónde alojarse.",
  ],
  "BE:Gent": [
    "Qué ver en Gante: Gravensteen, Cordero Místico y canales",
    "El castillo de Gravensteen, la catedral de San Bavón y el Cordero Místico, Graslei y Korenlei, las tres torres, la vida estudiantil, dónde dormir y 3 días.",
  ],
  "BE:Anvers": [
    "Qué ver en Amberes: Rubens, moda y el puerto",
    "La estación Antwerpen-Centraal y el Meir, la catedral de Nuestra Señora y Rubens, el MAS y el Eilandje, la moda y los diamantes, dónde alojarse y 3 días.",
  ],
  "BE:Leuven": [
    "Qué ver en Lovaina: ayuntamiento, universidad y cerveza",
    "El Grote Markt y el ayuntamiento gótico, la torre de la Biblioteca Universitaria, M Leuven y el Groot Begijnhof, la cultura cervecera y un plan de 1 o 2 días.",
  ],
  "BE:Liège": [
    "Qué ver en Lieja: Guillemins, Montagne de Bueren y el Mosa",
    "La estación de Liège-Guillemins, la escalinata de la Montagne de Bueren, La Boverie y la orilla del Mosa, los gofres de Lieja, dónde alojarse y 2 o 3 días.",
  ],
  "BE:Dinant": [
    "Qué ver en Dinant: ciudadela, valle del Mosa y saxofón",
    "La ciudadela de Dinant, Notre-Dame y el puente Charles de Gaulle, la Maison Leffe o la casa de Adolphe Sax, el valle del Mosa y un plan de 1 o 2 días.",
  ],
  "BE:Ardenler": [
    "Qué ver en las Ardenas: Durbuy, Bouillon y senderismo",
    "Durbuy y el valle del Ourthe, el castillo de Bouillon, los páramos de Hautes Fagnes, rutas por el bosque, moverse sin coche y dónde alojarse en las Ardenas.",
  ],

  /* ------------------------------ Macaristan ------------------------------ */
  "HU:Budapeşte": [
    "Qué ver en Budapest: balnearios, castillo y el Danubio",
    "El Parlamento y la orilla del Danubio, el Castillo de Buda y el Bastión de los Pescadores, qué balneario termal elegir, la vida nocturna y un plan de 3 días.",
  ],
  "HU:Szentendre": [
    "Qué ver en Szentendre: casco antiguo, arte y Skanzen",
    "La Fő tér y las calles antiguas, las iglesias serbias, el Ferenczy y los pequeños museos, el museo al aire libre Skanzen y una excursión desde Budapest.",
  ],
  "HU:Eger": [
    "Qué ver en Eger: castillo, minarete y valle del vino",
    "El castillo de Eger, el minarete otomano y el baño turco, las bodegas de Szépasszony-völgy, los baños termales, dónde alojarse y un plan de 2 o 3 días.",
  ],
  "HU:Pécs": [
    "Qué ver en Pécs: tumbas romanas, mezquita y Zsolnay",
    "La Cella Septichora paleocristiana, la Széchenyi tér y la mezquita de Gazi Kasim Pachá, el Barrio Cultural Zsolnay, sus calles mediterráneas y 3 días.",
  ],
  "HU:Szeged": [
    "Qué ver en Szeged: Iglesia Votiva, sinagoga y pimentón",
    "La Dóm tér y la Iglesia Votiva, la Nueva Sinagoga, el art nouveau del Palacio Reök, la orilla del Tisza, el pimentón y la sopa de pescado, y 2 o 3 días.",
  ],
  "HU:Debrecen": [
    "Qué ver en Debrecen: Gran Iglesia Reformada y Hortobágy",
    "La Gran Iglesia Reformada, el Museo Déri, el parque Nagyerdő y el Aquaticum, un día en el Parque Nacional de Hortobágy, dónde alojarse y un plan de 3 días.",
  ],
  "HU:Balaton Gölü": [
    "Lago Balaton: Tihany, Badacsony y mejores playas",
    "La península de Tihany, las colinas volcánicas y el vino de Badacsony, Keszthely y el Palacio Festetics, orilla norte o sur, baños, trenes y dónde alojarse.",
  ],
  "HU:Sopron": [
    "Qué ver en Sopron: Torre del Fuego, casco antiguo y vino",
    "La Tűztorony y la Fő tér, la Sinagoga Antigua y los patios históricos, las colinas de Lővérek y el mirador Károly, el vino local y la región de Fertő.",
  ],

  /* -------------------------------- Çekya -------------------------------- */
  "CZ:Prag": [
    "Qué ver en Praga en 3 días: castillo, barrios y alojamiento",
    "El Castillo de Praga y San Vito, la Ciudad Vieja y el Barrio Judío, el Puente de Carlos y Malá Strana a horas tranquilas, cervecerías y dónde alojarse.",
  ],
  "CZ:Český Krumlov": [
    "Qué ver en Český Krumlov: castillo, casco antiguo y Moldava",
    "El castillo de Český Krumlov, Latrán y la ciudad vieja de la UNESCO, navegar o hacer rafting por el Moldava, cómo esquivar los grupos y un plan de 2 o 3 días.",
  ],
  "CZ:Brno": [
    "Qué ver en Brno: Villa Tugendhat, Špilberk y subsuelo",
    "Cómo reservar la Villa Tugendhat, el castillo de Špilberk, Zelný trh y el Brno subterráneo, bares de vino moravo, arquitectura funcionalista y 3 días en Brno.",
  ],
  "CZ:Karlovy Vary": [
    "Qué ver en Karlovy Vary: columnatas, balnearios y paseos",
    "Las columnatas del Molino y del Mercado, los manantiales termales, la torre mirador de Diana, el Museo del Cristal Moser, paseos por el bosque y 2 o 3 días.",
  ],
  "CZ:Kutná Hora": [
    "Qué ver en Kutná Hora: Santa Bárbara y el Osario de Sedlec",
    "La catedral de Santa Bárbara, el Osario de Sedlec, la Corte Italiana y la historia de la plata, cómo llegar en tren y si ir en el día o dormir allí.",
  ],
  "CZ:Olomouc": [
    "Qué ver en Olomouc: Columna de la Trinidad y casco antiguo",
    "La Columna de la Santísima Trinidad de la UNESCO, el reloj astronómico y el ayuntamiento, el Museo Arzobispal, cocina y quesos de Moravia y 2 o 3 días.",
  ],
  "CZ:Plzeň": [
    "Qué ver en Pilsen: Pilsner Urquell y casco antiguo",
    "La visita a la cervecería Pilsner Urquell, la Gran Sinagoga, el subsuelo histórico, la plaza mayor, la cultura cervecera checa y un plan de 2 o 3 días.",
  ],
  "CZ:Bohemya İsviçresi": [
    "Suiza Bohemia: Pravčická brána, gargantas y senderismo",
    "La caminata a Pravčická brána, las barcas por la garganta de Edmund, los miradores de Jetřichovice, las normas del parque, el viaje desde Praga y dónde dormir.",
  ],

  /* ------------------------------- Polonya ------------------------------- */
  "PL:Varşova": [
    "Qué ver en Varsovia: Ciudad Vieja, museos y barrios",
    "La Ciudad Vieja reconstruida y la Vía Real, el POLIN y el Museo del Alzamiento, los palacios de Łazienki y Wilanów, Praga, dónde alojarse y un plan de 3 días.",
  ],
  "PL:Kraków": [
    "Qué ver en Cracovia: Wawel, Kazimierz y visita a Auschwitz",
    "El Castillo de Wawel y la catedral, el Rynek y su museo subterráneo, Kazimierz y Podgórze, cómo visitar Auschwitz-Birkenau con respeto y un plan de 3 días.",
  ],
  "PL:Gdańsk": [
    "Qué ver en Gdansk: casco antiguo, Solidaridad y museo",
    "Długi Targ y el muelle del Motława, el Centro Europeo de la Solidaridad, el Museo de la Segunda Guerra Mundial, Sopot y la costa báltica, y un plan de 3 días.",
  ],
  "PL:Wrocław": [
    "Qué ver en Breslavia (Wrocław): Rynek, islas y enanos",
    "El Rynek y el ayuntamiento gótico, Ostrów Tumski al encender las farolas, el Pabellón del Centenario, puentes e islas, los enanos de la ciudad y 3 días.",
  ],
  "PL:Poznań": [
    "Qué ver en Poznan: plaza del Mercado Viejo y Enigma",
    "El Stary Rynek y las cabras del ayuntamiento a mediodía, Ostrów Tumski y Brama Poznania, el Centro de Cifrado Enigma, los cruasanes rogal y 2 o 3 días.",
  ],
  "PL:Zakopane": [
    "Qué ver en Zakopane: Morskie Oko, Tatras y cultura local",
    "La caminata a Morskie Oko, el teleférico del Kasprowy Wierch, las casas de madera del estilo Zakopane, la seguridad en la montaña, la cocina local y 3 días.",
  ],
  "PL:Toruń": [
    "Qué ver en Toruń: casco gótico y museo del pan de jengibre",
    "La ciudad vieja gótica de la UNESCO, la Casa de Copérnico y el Planetario, el Museo del Piernik, la orilla del Vístula de noche y un plan de 2 o 3 días.",
  ],
  "PL:Lublin": [
    "Qué ver en Lublin: castillo, casco antiguo y Majdanek",
    "El castillo de Lublin y la Capilla de la Santísima Trinidad, la Brama Grodzka y la ciudad vieja, el legado judío, el memorial de Majdanek y un plan de 3 días.",
  ],

  /* -------------------------------- Rusya -------------------------------- */
  "RU:Moskova": [
    "Qué ver en Moscú: Kremlin, museos y estaciones de metro",
    "El Kremlin y la Plaza Roja, las Galerías Tretiakov, VDNKh y el Museo de la Cosmonáutica, las estaciones de metro, pagos y visado, y un plan de 3 días en Moscú.",
  ],
  "RU:St. Petersburg": [
    "Qué ver en San Petersburgo: Hermitage, Peterhof y canales",
    "El Hermitage y el Palacio de Invierno, las fuentes de Peterhof, San Isaac y la Iglesia de la Sangre Derramada, barcos por los canales y las noches blancas.",
  ],
  "RU:Kazan": [
    "Qué ver en Kazán: Kremlin, cultura tártara y el Volga",
    "El Kremlin de Kazán y la mezquita Qol Şärif, Staro-Tatarskaya Sloboda, la orilla del Kremlin, dulces tártaros como el chak-chak, dónde alojarse y 3 días.",
  ],
  "RU:Soçi": [
    "Qué ver en Sochi: paseo marítimo, Krasnaya Polyana y parques",
    "El Arboreto y la costa del centro, las montañas de Krasnaya Polyana, el Parque Olímpico y Sirius, las playas del mar Negro, cómo moverse y un plan de 3 días.",
  ],
  "RU:Kaliningrad": [
    "Qué ver en Kaliningrado: isla de Kant, ámbar e istmo",
    "La catedral de Königsberg y la isla de Kant, el Museo del Ámbar, las dunas y bosques del istmo de Curlandia, la costa báltica, la entrada y 3 días.",
  ],
  "RU:Murmansk": [
    "Múrmansk: auroras boreales y costa del Ártico",
    "El monumento de Aliosha, el rompehielos nuclear Lenin, excursiones para ver auroras y la tundra, Teriberka en la costa de Kola, la noche polar y el frío.",
  ],
  "RU:Baykal Gölü": [
    "Lago Baikal: Irkutsk, isla de Oljón y el Circumbaikal",
    "Irkutsk y Listvyanka, la isla de Oljón, el Ferrocarril Circumbaikal, la temporada del hielo, la logística de las largas distancias y cuántos días hacen falta.",
  ],
  "RU:Vladivostok": [
    "Qué ver en Vladivostok: Puente Dorado, isla Russky y marisco",
    "El Puente Dorado y las colinas del centro, la isla Russky, el Museo de la Fortaleza, el marisco del Pacífico, dónde alojarse y un plan de 3 días en Vladivostok.",
  ],

  /* ------------------------------ Sırbistan ------------------------------ */
  "RS:Belgrad": [
    "Qué ver en Belgrado: Kalemegdan, barrios y noche",
    "Kalemegdan y la fortaleza, el Templo de San Sava y Vračar, el Museo de Yugoslavia y Novi Beograd, los clubs junto al río, las kafanas y un plan de 3 días.",
  ],
  "RS:Novi Sad": [
    "Qué ver en Novi Sad: Petrovaradin, casco antiguo y Danubio",
    "La fortaleza de Petrovaradin, Trg Slobode y Zmaj Jovina, la orilla del Danubio y la playa de Štrand, monasterios y vino de Fruška Gora, y 2 o 3 días.",
  ],
  "RS:Niş": [
    "Qué ver en Niš: fortaleza, Torre de las Calaveras y Mediana",
    "La fortaleza de Niš, el yacimiento romano de Mediana, la Torre de las Calaveras y el campo de la Cruz Roja, la parrilla del sur de Serbia y 2 o 3 días.",
  ],
  "RS:Subotica": [
    "Qué ver en Subotica: art nouveau y lago Palić",
    "El ayuntamiento art nouveau, la sinagoga restaurada, el lago Palić, la cultura húngaro-serbia de Voivodina, la cocina local y un plan de 2 o 3 días en Subotica.",
  ],
  "RS:Zlatibor": [
    "Qué ver en Zlatibor: Gold Gondola, cuevas y pueblos",
    "La Gold Gondola hasta Tornik, la cueva de Stopića, el museo al aire libre de Sirogojno, rutas de montaña, el tren Šargan Eight cercano y dónde alojarse.",
  ],
  "RS:Tara Milli Parkı": [
    "Parque Nacional de Tara: miradores y el río Drina",
    "El mirador de Banjska Stena sobre el Drina, el lago Zaovine, Perućac y el río, senderos por el bosque, la fauna, cómo llegar sin coche y dónde alojarse.",
  ],
  "RS:Kopaonik": [
    "Qué ver en Kopaonik: esquí, senderos de verano y cumbres",
    "La zona de esquí de Kopaonik, el Pančićev vrh, la meseta de Nebeske Stolice, rutas por el parque nacional, forfaits y alquiler, verano o invierno y alojamiento.",
  ],
  "RS:Demir Kapı": [
    "Puertas de Hierro: Golubac, Lepenski Vir y Đerdap",
    "La fortaleza de Golubac, el yacimiento prehistórico de Lepenski Vir, los cañones de Đerdap en el Danubio, el legado romano, excursiones en barco y la ruta.",
  ],

  /* ------------------------------- Karadağ ------------------------------- */
  "ME:Kotor": [
    "Qué ver en Kotor: casco antiguo, murallas y la bahía",
    "La ciudad vieja de Kotor, la subida por las murallas a San Giovanni, Perast y la bahía en barco, cómo evitar los cruceros, dónde alojarse y un plan de 3 días.",
  ],
  "ME:Budva": [
    "Qué ver en Budva: casco antiguo, playas y Sveti Stefan",
    "El Stari Grad de Budva, la playa de Mogren y el sendero costero, las vistas de Sveti Stefan, la vida nocturna, calas cercanas y dónde alojarse.",
  ],
  "ME:Podgorica": [
    "Qué ver en Podgorica: la capital y excursiones",
    "Stara Varoš y el Ribnica, el puente del Milenio, el Centro de Arte Contemporáneo, excursiones al lago Skadar y al monasterio de Ostrog, y un plan de 2 o 3 días.",
  ],
  "ME:Cetinje": [
    "Qué ver en Cetinje: antigua capital, museos y Lovćen",
    "El Museo del Rey Nikola, el Monasterio de Cetinje, las antiguas legaciones diplomáticas, el Lovćen y el Mausoleo de Njegoš, en el día o 2 o 3 días.",
  ],
  "ME:Perast": [
    "Qué ver en Perast: Nuestra Señora de las Rocas y la bahía",
    "El barco a Nuestra Señora de las Rocas, el campanario de San Nicolás, el Museo de Perast, los palacios barrocos de la bahía de Kotor y pasar la noche allí.",
  ],
  "ME:Herceg Novi": [
    "Qué ver en Herceg Novi: fortalezas, casco antiguo y bahía",
    "Forte Mare y Kanli Kula, el Stari Grad escalonado y la Torre del Reloj, el Monasterio de Savina, el paseo marítimo, playas, barcos y dónde alojarse.",
  ],
  "ME:Durmitor": [
    "Durmitor: Lago Negro, Bobotov Kuk y el cañón del Tara",
    "El Crno Jezero junto a Žabljak, la subida segura al Bobotov Kuk, rafting en el cañón del Tara, el puente Đurđevića Tara, el tiempo en la montaña y alojamiento.",
  ],
  "ME:Ulcinj": [
    "Qué ver en Ulcinj: casco antiguo, Velika Plaža y salinas",
    "La ciudad vieja de Ulcinj sobre el mar, la larga playa de Velika Plaža, aves en las salinas, Ada Bojana, la cocina albano-montenegrina y dónde alojarse.",
  ],

  /* ------------------------------- Bosna-Hersek ------------------------------- */
  "BA:Saraybosna": [
    "Qué ver en Sarajevo: Baščaršija, historia y Trebević",
    "El viejo bazar de Baščaršija, el Puente Latino y los museos, el Museo del Túnel, el Trebević y su teleférico, los ćevapi y el café bosnio, y un plan de 3 días.",
  ],
  "BA:Mostar": [
    "Qué ver en Mostar: Stari Most, casco antiguo y excursiones",
    "El Stari Most y la ciudad vieja, las vistas desde la mezquita de Koski Mehmed Pacha, las capas históricas de Mostar, los saltadores del puente y Blagaj.",
  ],
  "BA:Blagaj": [
    "Qué ver en Blagaj: la tekija derviche y el río Buna",
    "La tekija de Blagaj junto al manantial Vrelo Bune, la subida a la fortaleza Stjepan Grad, restaurantes de trucha junto al río y cómo visitarlo desde Mostar.",
  ],
  "BA:Travnik": [
    "Qué ver en Travnik: fortaleza, Mezquita Pintada y Andrić",
    "La fortaleza de Travnik, la Šarena Džamija, la casa natal de Ivo Andrić, la historia de la ciudad de los visires, el queso de Travnik y un plan de 2 o 3 días.",
  ],
  "BA:Jajce": [
    "Qué ver en Jajce: cascada, fortaleza y Museo AVNOJ",
    "La cascada de Jajce en pleno centro, la fortaleza y las catacumbas, el Museo AVNOJ, los molinos y lagos del Pliva y un itinerario de 2 o 3 días en Jajce.",
  ],
  "BA:Banja Luka": [
    "Qué ver en Banja Luka: Kastel, Ferhadija y el Vrbas",
    "La fortaleza de Kastel, la catedral de Cristo Salvador y la mezquita Ferhadija reconstruida, la orilla del Vrbas, el rafting y la naturaleza de la Krajina.",
  ],
  "BA:Trebinje": [
    "Qué ver en Trebinje: casco antiguo, monasterios y vino",
    "La ciudad vieja y la plaza de los plátanos, Hercegovačka Gračanica, el Monasterio de Tvrdoš y su bodega, la cocina local y un plan de 2 o 3 días en Trebinje.",
  ],
  "BA:Una Milli Parkı": [
    "Parque Nacional del Una: cascadas y rafting",
    "La cascada de Štrbački Buk, los saltos de Martin Brod, rafting en el río Una, Bihać como base, las entradas del parque, cómo moverse y dónde alojarse.",
  ],

  /* ------------------------------- Arnavutluk ------------------------------- */
  "AL:Tiran": [
    "Qué ver en Tirana: Plaza Skanderbeg, Bunk'Art y Dajti",
    "La Plaza Skanderbeg, Bunk'Art y la Casa de las Hojas, la Pirámide de Tirana, el teleférico del Dajti, los cafés de Blloku, dónde alojarse y un plan de 3 días.",
  ],
  "AL:Berat": [
    "Qué ver en Berat: fortaleza, Museo Onufri y barrios",
    "La fortaleza de Berat y su barrio habitado, el Museo Onufri, las casas otomanas de Mangalem y Gorica, el valle del Osum, dónde alojarse y 2 días.",
  ],
  "AL:Gjirokastër": [
    "Qué ver en Gjirokastra: fortaleza, casas de piedra y túnel",
    "La fortaleza de Gjirokastër, las casas históricas Skenduli y Zekate, el túnel de la Guerra Fría, el bazar antiguo, el Ojo Azul cercano y un plan de 2 o 3 días.",
  ],
  "AL:Shkodër": [
    "Qué ver en Shkodra: Rozafa, el lago y puerta a los Alpes",
    "La fortaleza de Rozafa, el Museo de Fotografía Marubi, el lago de Shkodër, la ciudad en bici, cómo llegar a Theth y el ferri de Koman, y un plan de 3 días.",
  ],
  "AL:Krujë": [
    "Qué ver en Krujë: fortaleza, Skanderbeg y bazar antiguo",
    "La fortaleza de Krujë y el Museo de Skanderbeg, el Museo Etnográfico, la artesanía del bazar antiguo y cómo ir en una excursión desde Tirana.",
  ],
  "AL:Theth": [
    "Theth: Alpes albaneses, Ojo Azul y ruta a Valbona",
    "La iglesia de Theth y la torre kulla, la cascada y el cañón de Grunas, el Ojo Azul, la travesía a Valbona, la carretera, casas de huéspedes y seguridad.",
  ],
  "AL:Sarandë": [
    "Qué ver en Saranda: Butrinto, Ksamil y la costa jónica",
    "El Parque Nacional de Butrinto, el paseo de Sarandë y el castillo de Lëkurësi, las playas de Ksamil, el Ojo Azul, el ferri a Corfú y dónde alojarse.",
  ],
  "AL:Himarë": [
    "Qué ver en Himara: pueblo viejo, Porto Palermo y Gjipe",
    "El viejo Himarë sobre la costa, el castillo de Porto Palermo, la bajada a la playa del cañón de Gjipe, calas jónicas, la carretera de Llogara y dónde alojarse.",
  ],

  /* ------------------------------- Yunanistan ------------------------------- */
  "GR:Atina": [
    "Qué ver en Atenas: Acrópolis, barrios y plan de 3 días",
    "Entradas y horarios de la Acrópolis, el Museo de la Acrópolis, el Ágora Antigua y la Romana, el Museo Arqueológico Nacional, Plaka y Koukaki, y 3 días.",
  ],
  "GR:Selanik": [
    "Qué ver en Tesalónica: Torre Blanca, Ano Poli y comida",
    "La Torre Blanca y el paseo marítimo, la Rotonda y las iglesias bizantinas, las murallas y vistas de Ano Poli, el legado otomano y la cocina del norte.",
  ],
  "GR:Santorini": [
    "Qué ver en Santorini: Oia, Fira, la caldera y alojamiento",
    "La caminata de Fira a Oia, Akrotiri, un barco por la caldera, las multitudes del atardecer, playas y vino, dónde alojarse fuera de la caldera y 3 días.",
  ],
  "GR:Mikonos": [
    "Qué ver en Míkonos: Chora, molinos, Delos y playas",
    "Las callejuelas de Chora y los molinos, la Pequeña Venecia, el barco a la antigua Delos, el tranquilo Ano Mera, cómo elegir playa, la noche y dónde alojarse.",
  ],
  "GR:Girit": [
    "Qué ver en Creta: Cnosos, Chania y la garganta de Samaria",
    "Cnosos y el Museo de Heraklion, el puerto viejo de Chania, la garganta de Samaria, pueblos de montaña, el este o el oeste de Creta, el coche y cuántos días.",
  ],
  "GR:Rodos": [
    "Qué ver en Rodas: ciudad vieja, Lindos y playas",
    "La ciudad medieval y el Palacio del Gran Maestre, la acrópolis de Lindos, la antigua Kamiros, playas en ambas costas, el coche de alquiler y dónde alojarse.",
  ],
  "GR:Korfu": [
    "Qué ver en Corfú: ciudad vieja, Paleokastritsa y playas",
    "Las callejuelas venecianas de la ciudad vieja, las calas de Paleokastritsa, el Achilleion, los pueblos de montaña, las calas, el coche y dónde alojarse.",
  ],
  "GR:Meteora": [
    "Qué ver en Meteora: monasterios, senderos y Kalambaka",
    "El Gran Meteoro y Varlaam, Roussanou y Agios Stefanos, días de apertura y normas de vestimenta, los senderos de Kastraki, el atardecer y dónde alojarse.",
  ],

  /* ------------------------------- Hırvatistan ------------------------------- */
  "HR:Zagreb": [
    "Qué ver en Zagreb: Ciudad Alta, museos y mercados",
    "Gornji Grad y la iglesia de San Marcos, los museos de la Ciudad Baja, el mercado de Dolac y el cementerio de Mirogoj, los cafés, dónde alojarse y 3 días.",
  ],
  "HR:Dubrovnik": [
    "Qué ver en Dubrovnik: murallas, casco antiguo y monte Srđ",
    "Recorrer las murallas temprano, el Stradun y las instituciones de Ragusa, el teleférico al monte Srđ, cómo esquivar los cruceros, playas, alojamiento y 3 días.",
  ],
  "HR:Split": [
    "Qué ver en Split: Palacio de Diocleciano, Marjan e islas",
    "El Palacio de Diocleciano, la colina de Marjan, el museo arqueológico y la Galería Meštrović, ferris a Hvar y Brač, dónde alojarse y un plan de 3 días.",
  ],
  "HR:Zadar": [
    "Qué ver en Zadar: Órgano Marino, Foro Romano y atardeceres",
    "El Foro Romano y San Donato, el Órgano Marino y el Saludo al Sol al atardecer, las murallas y el mercado, excursiones a islas y parques nacionales, y 3 días.",
  ],
  "HR:Hvar": [
    "Qué ver en Hvar: ciudad de Hvar, Stari Grad e islas Pakleni",
    "La fortaleza y la ciudad de Hvar, la llanura de Stari Grad de la UNESCO, pueblos de lavanda, las islas Pakleni en barco, los puertos de ferry y dónde dormir.",
  ],
  "HR:Istria": [
    "Qué ver en Istria: Rovinj, Pula y pueblos en las colinas",
    "El casco antiguo de Rovinj, la Arena de Pula, Motovun y Grožnjan, trufas y aceite de oliva, baños en la costa, el coche de alquiler y cómo organizar la ruta.",
  ],
  "HR:Plitvice Gölleri": [
    "Lagos de Plitvice: entradas, rutas y mejor época",
    "Cómo reservar la entrada a Plitvice, las rutas por los Lagos Inferiores y Superiores, los miradores, las entradas 1 y 2, las multitudes y dónde alojarse.",
  ],
  "HR:Šibenik": [
    "Qué ver en Šibenik: catedral, fortalezas y Krka",
    "La Catedral de Santiago, las fortalezas de San Miguel y Barone, el Canal de San Antonio, excursiones a Krka y a las islas, y un plan de 3 días.",
  ],

  /* ------------------------------- Slovenya ------------------------------- */
  "SI:Ljubljana": [
    "Qué ver en Liubliana: castillo, Plečnik y el río",
    "El castillo de Liubliana, la ruta de la arquitectura de Plečnik, el parque Tivoli y los museos, la orilla del río, el mercado central y una excursión a Bled.",
  ],
  "SI:Bled Gölü": [
    "Lago Bled: isla, castillo y miradores",
    "La pletna a la isla de Bled, el castillo, los miradores de Ojstrica y Osojnica, el paseo alrededor del lago, la garganta de Vintgar y dónde alojarse en Bled.",
  ],
  "SI:Bohinj": [
    "Qué ver en Bohinj: lago, cascada Savica y Vogel",
    "El lago de Bohinj, la cascada Savica, el teleférico del Vogel, rutas por el Parque Nacional del Triglav, baños, cómo llegar desde Bled y dónde alojarse.",
  ],
  "SI:Piran": [
    "Qué ver en Piran: Plaza Tartini, murallas y salinas",
    "La Plaza Tartini, la iglesia de San Jorge y las murallas, las salinas de Sečovlje, la corta costa eslovena, dónde aparcar y un plan de 2 o 3 días en Piran.",
  ],
  "SI:Postojna ve Predjama": [
    "Cueva de Postojna y castillo de Predjama: entradas y visita",
    "El tren de la cueva de Postojna, el castillo de Predjama en la roca, el Vivarium, las entradas combinadas, cómo llegar y el tiempo necesario.",
  ],
  "SI:Soča Vadisi": [
    "Valle del Soča: rafting, Kozjak e historia de la Gran Guerra",
    "Rafting en el Soča, el Museo de Kobarid y el camino histórico, la cascada de Kozjak, las gargantas de Tolmin, Bovec como base, deportes al aire libre y 3 días.",
  ],
  "SI:Maribor": [
    "Qué ver en Maribor: Lent, la Vid Antigua y Pohorje",
    "El Lent y la vid más antigua del mundo, Glavni trg y los museos, las rutas y el teleférico de Pohorje, las rutas del vino, dónde alojarse y un plan de 3 días.",
  ],
  "SI:Kranjska Gora": [
    "Qué ver en Kranjska Gora: puerto de Vršič, lagos y rutas",
    "El lago Jasna y Zelenci, la carretera del puerto de Vršič, los valles de Planica y Tamar, esquí en invierno, senderismo en los Alpes Julianos y alojamiento.",
  ],

  /* -------------------------------- Norveç -------------------------------- */
  "NO:Oslo": [
    "Qué ver en Oslo: Ópera, MUNCH, museos y el fiordo",
    "Bjørvika, la Ópera y el MUNCH, los museos de Bygdøy, el parque Vigeland y el Museo Nacional, ferris por el fiordo, el presupuesto y un plan de 3 días.",
  ],
  "NO:Bergen": [
    "Qué ver en Bergen: Bryggen, Fløyen y excursiones a fiordos",
    "El muelle hanseático de Bryggen, el funicular Fløibanen al monte Fløyen, KODE y Bergenhus, planes para días de lluvia, cruceros por los fiordos y 3 días.",
  ],
  "NO:Tromsø": [
    "Qué ver en Tromsø: auroras boreales, Fjellheisen y fiordos",
    "Cómo ver la aurora boreal, el teleférico Fjellheisen, la Catedral del Ártico, el Polarmuseet, el sol de medianoche, excursiones y dónde alojarse en Tromsø.",
  ],
  "NO:Lofoten": [
    "Islas Lofoten: Reine, Henningsvær y qué ver",
    "Reine, Hamnøy y Å, Henningsvær, el Museo Vikingo Lofotr, las playas árticas, conducir por la E10, las cabañas rorbu y cuántos días dedicar a las Lofoten.",
  ],
  "NO:Geirangerfjord": [
    "Fiordo de Geiranger: barcos, miradores y caminatas",
    "Barcos y ferris por el fiordo, los miradores de Ørnesvingen y Flydalsjuvet, granjas y cascadas, la apertura de carreteras, los cruceros y alojamiento.",
  ],
  "NO:Flåm": [
    "Qué ver en Flåm: tren de Flåm, Nærøyfjord y Stegastein",
    "El tren de Flåm, un crucero por el Nærøyfjord, el mirador de Stegastein y Aurland, las multitudes de los cruceros, dónde alojarse y un plan de 3 días.",
  ],
  "NO:Trondheim": [
    "Qué ver en Trondheim: Nidaros, Bakklandet e historia",
    "La catedral de Nidaros y el Palacio Arzobispal, Bakklandet y el Gamle Bybro, los museos de Ringve o Sverresborg, la cocina local y un plan de 3 días.",
  ],
  "NO:Stavanger": [
    "Qué ver en Stavanger: Preikestolen y el Lysefjord",
    "La caminata segura a Preikestolen, barcos por el Lysefjord, Gamle Stavanger y el Museo de la Conserva, el Museo del Petróleo, dónde alojarse y 3 días.",
  ],

  /* -------------------------------- İsveç -------------------------------- */
  "SE:Stockholm": [
    "Qué ver en Estocolmo: Gamla Stan, Vasa y el archipiélago",
    "Gamla Stan y el Palacio Real, el Museo Vasa y Djurgården, el Stadshuset y Fotografiska, barcos al archipiélago, la fika, dónde alojarse y un plan de 3 días.",
  ],
  "SE:Göteborg": [
    "Qué ver en Gotemburgo: Haga, museos y archipiélago",
    "El Museo de Arte y Götaplatsen, Maritiman y el puerto, Haga, Masthugget y Majorna, el archipiélago sur sin coches, el marisco y un plan de 3 días en Gotemburgo.",
  ],
  "SE:Malmö": [
    "Qué ver en Malmö: Turning Torso, casco antiguo y Øresund",
    "Malmöhus y los museos, Västra Hamnen y el Turning Torso, Stortorget, Lilla Torg y San Pedro, cómo cruzar a Copenhague y un plan de 3 días en Malmö.",
  ],
  "SE:Uppsala": [
    "Qué ver en Upsala (Uppsala): catedral, universidad y túmulos",
    "La catedral, el Gustavianum y la biblioteca Carolina Rediviva, los túmulos reales de Gamla Uppsala, la vida estudiantil y una excursión desde Estocolmo.",
  ],
  "SE:Gotland": [
    "Qué ver en Gotland: Visby, Fårö y los rauk",
    "Las murallas medievales de Visby y su ciudad vieja, el Gotlands Museum, Fårö y los farallones rauk, la bici, los ferris, el verano y dónde alojarse en Gotland.",
  ],
  "SE:Kiruna": [
    "Qué ver en Kiruna: auroras, la mina y cultura sami",
    "El nuevo centro y la iglesia de Kiruna, la visita a la mina de LKAB, la cultura sami, las auroras boreales, el Icehotel y Abisko cerca, y dónde alojarse.",
  ],
  "SE:Abisko": [
    "Qué ver en Abisko: auroras boreales, cañón y Kungsleden",
    "El Parque Nacional de Abisko y su cañón, el inicio del sendero Kungsleden, la Aurora Sky Station, el cielo ártico, invierno y verano, y alojamiento.",
  ],
  "SE:Dalarna": [
    "Dalarna: lago Siljan, la mina de Falun y tradiciones",
    "La Gran Montaña de Cobre de Falun, los pueblos del lago Siljan, Carl Larsson-gården en Sundborn, las tradiciones rurales y una ruta en coche por Dalarna.",
  ],

  /* ------------------------------- Danimarka ------------------------------- */
  "DK:Kopenhag": [
    "Qué ver en Copenhague: Nyhavn, palacios, diseño y comida",
    "Christiansborg y Slotsholmen, Rosenborg y el SMK, Nyhavn y la arquitectura del puerto, la ciudad en bici, dónde alojarse y un plan de 3 días en Copenhague.",
  ],
  "DK:Aarhus": [
    "Qué ver en Aarhus: ARoS, Den Gamle By y Moesgaard",
    "El museo de arte ARoS, el museo al aire libre Den Gamle By, el Moesgaard Museum, el Barrio Latino y el nuevo puerto, y un itinerario de 3 días por Aarhus.",
  ],
  "DK:Odense": [
    "Qué ver en Odense: Hans Christian Andersen y casco antiguo",
    "La H.C. Andersen Hus, Møntergården y las calles antiguas, Brandts y el puerto, la ciudad en bici, excursiones por Fionia como Egeskov y un plan de 2 o 3 días.",
  ],
  "DK:Aalborg": [
    "Qué ver en Aalborg: frente marítimo, Kunsten y vikingos",
    "El Utzon Center y la orilla del Limfjord, el museo Kunsten, el cementerio vikingo de Lindholm Høje, la noche de Jomfru Ane Gade y un plan de 2 o 3 días.",
  ],
  "DK:Ribe": [
    "Qué ver en Ribe: catedral, historia vikinga y mar de Wadden",
    "La catedral de Ribe, el museo vikingo y el VikingeCenter, el paseo con el sereno, el Wadden Sea Centre y un plan de 2 o 3 días en Ribe.",
  ],
  "DK:Skagen": [
    "Qué ver en Skagen: Grenen, pintores y Råbjerg Mile",
    "Grenen, donde se juntan dos mares, el Skagens Museum y la Anchers Hus, la iglesia enterrada en la arena y la duna de Råbjerg Mile, playas, bici y 2 o 3 días.",
  ],
  "DK:Bornholm": [
    "Qué ver en Bornholm: Hammershus, iglesias redondas y costa",
    "Las ruinas del castillo de Hammershus, Østerlars y las iglesias redondas, Gudhjem y Svaneke, los ahumaderos, la costa en bici y ferris desde Copenhague.",
  ],
  "DK:Roskilde": [
    "Qué ver en Roskilde: barcos vikingos y catedral real",
    "El Museo de Barcos Vikingos y sus paseos en barco, las tumbas reales de la catedral, el fiordo, el festival y cómo llegar desde Copenhague.",
  ],

  /* ------------------------------- Finlandiya ------------------------------- */
  "FI:Helsinki": [
    "Qué ver en Helsinki: Suomenlinna, diseño y saunas",
    "El ferri a Suomenlinna, la Plaza del Senado, la biblioteca Oodi, Kiasma y Temppeliaukio, las saunas públicas, el distrito del diseño y un plan de 3 días.",
  ],
  "FI:Rovaniemi": [
    "Qué ver en Rovaniemi: Círculo Polar, Arktikum y auroras",
    "El Arktikum, el Círculo Polar Ártico y la aldea de Papá Noel, Ounasvaara y Korundi, auroras boreales, huskies y renos, el invierno de Laponia y alojamiento.",
  ],
  "FI:Turku": [
    "Qué ver en Turku: castillo, catedral y archipiélago",
    "El castillo de Turku, la catedral y Aboa Vetus, el Forum Marinum y la orilla del Aura, la Ruta del Archipiélago, el Moomin World cercano y un plan de 3 días.",
  ],
  "FI:Tampere": [
    "Qué ver en Tampere: saunas, lagos y patrimonio industrial",
    "Vapriikki, Finlayson y los rápidos de Tammerkoski, la torre de Pyynikki y Pispala, las saunas públicas junto a los lagos, dónde alojarse y un plan de 3 días.",
  ],
  "FI:Porvoo": [
    "Qué ver en Porvoo: casco antiguo y almacenes rojos",
    "Vanha Porvoo y los almacenes rojos del río, la catedral de Porvoo, el Porvoo Museum y Taidetehdas, la tarta de Runeberg y una excursión desde Helsinki.",
  ],
  "FI:Finlandiya Göller Bölgesi": [
    "Región de los Lagos de Finlandia: Saimaa y Savonlinna",
    "El castillo de Olavinlinna en Savonlinna, la cresta de Punkaharju, la naturaleza y las focas del Saimaa, saunas junto al lago y cuántos días hacen falta.",
  ],
  "FI:Inari ve Saariselkä": [
    "Inari y Saariselkä: cultura sami y auroras boreales",
    "El museo sami Siida, el Parque Nacional Urho Kekkonen, el lago Inari y Kaunispää, las auroras boreales, rutas en invierno y verano, cómo llegar y alojamiento.",
  ],
  "FI:Åland Adaları": [
    "Islas Åland: Mariehamn, castillos y rutas en bici",
    "El Museo Marítimo de Åland y el Pommern, Kastelholm y Jan Karlsgården, la fortaleza de Bomarsund, la bici y los ferris entre islas, y dónde alojarse en Åland.",
  ],

  /* -------------------------------- Svalbard -------------------------------- */
  "SJ:Longyearbyen": [
    "Longyearbyen: cómo viajar a la ciudad más al norte",
    "Cómo llegar a Longyearbyen, la noche polar y el sol de medianoche, el Svalbard Museum, la Bóveda Global de Semillas y la costumbre de quitarse los zapatos.",
  ],
  "SJ:Ny-Ålesund": [
    "Ny-Ålesund: el pueblo de investigación del Ártico",
    "Qué es Ny-Ålesund y cómo visitarlo en barco, el silencio radioeléctrico y las normas polares, el mástil del dirigible de Amundsen y la oficina de correos.",
  ],
};

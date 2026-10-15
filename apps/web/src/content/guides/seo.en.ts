import addedSeo from "@/content/addedSeo.json";

/**
 * İngilizce rehberlerin <title> ve meta description'ı.
 *
 * Türkçe başlıkların çevirisi değil: İngilizce aramadaki niyete göre ayrı
 * yazıldı ("things to do in", "where to stay", "itinerary", şehrin kendi
 * öne çıkan yerleri). Her satır yalnızca o rehberde gerçekten anlatılan
 * konuları vaat eder.
 *
 * Kurallar (scripts/seo-copy.test.ts denetler):
 *   - her İngilizce rehberin satırı var; anahtar "ÜLKE:Şehir" (Türkçe şehir adı),
 *   - başlık en çok 60 karakter, şehrin İngilizce adıyla başlar,
 *   - açıklama 120–160 karakter, "…" ile kesilmez,
 *   - başlıklar ve açıklamalar birbirinden farklı.
 */
export const EN_GUIDE_SEO: Record<string, readonly [title: string, description: string]> = {
  ...Object.fromEntries(Object.entries(addedSeo.guides.en).map(([key, [title, description]]) => [key, [title, description] as const])),
  /* ------------------------------ Japonya ------------------------------ */
  "JP:Tokyo": [
    "Tokyo Travel Guide: Things to Do, Where to Stay & Food",
    "Things to do in Tokyo by neighbourhood, from Asakusa to Shibuya and Shimokitazawa, plus where to stay, real places to eat, transport and a 3-day itinerary.",
  ],
  "JP:Osaka": [
    "Osaka Travel Guide: Street Food, Sights & Where to Stay",
    "Dotonbori, Kuromon and Shinsekai street food, Osaka Castle, Umeda vs Namba for your hotel, getting in from KIX, whether USJ is worth it and a 3-day plan.",
  ],
  "JP:Kyoto": [
    "Kyoto Travel Guide: Temples, Gion & 3-Day Itinerary",
    "Fushimi Inari, Kinkaku-ji and Arashiyama at the right hour, Gion etiquette, Nishiki Market, where to eat, which area to stay in and a 3-day Kyoto plan.",
  ],
  "JP:Hiroshima": [
    "Hiroshima Travel Guide: Peace Park, Miyajima & Food",
    "How to visit the Peace Memorial Park and Miyajima's floating torii, timing the tides, okonomiyaki spots, getting around by tram and a 2-day Hiroshima plan.",
  ],
  "JP:Nara": [
    "Nara Travel Guide: Deer Park, Temples & 2-Day Plan",
    "Todai-ji, Kasuga Taisha and Nara Park's deer etiquette, Kintetsu vs JR from Kyoto or Osaka, Naramachi, where to eat and stay, and a detailed 2-day route.",
  ],
  "JP:Sapporo": [
    "Sapporo Travel Guide: Snow Festival, Food & 3-Day Plan",
    "Sapporo in winter and beyond: the Snow Festival, soup curry and ramen, choosing a neighbourhood, Otaru and Jozankei day trips, and a realistic 3-day route.",
  ],
  "JP:Kobe": [
    "Kobe Travel Guide: Kobe Beef, Arima Onsen & 3 Days",
    "How to spot genuine Kobe beef, Kitano's old houses, the harbour, Nada sake breweries and Arima Onsen, plus where to stay in Sannomiya and a 3-day plan.",
  ],
  "JP:Okinawa": [
    "Okinawa Travel Guide: Naha, Beaches & 6-Day Itinerary",
    "Naha and Shuri Castle, Churaumi Aquarium, car hire and driving on the left, safe beaches, the Kerama Islands, where to stay and a 6-day Okinawa route.",
  ],

  /* ----------------------------- ABD ----------------------------- */
  "US:New York": [
    "New York Travel Guide: Things to Do, Where to Stay & Food",
    "Things to do in New York beyond Manhattan, the right neighbourhood to stay in, JFK vs LGA vs EWR, the subway and OMNY, real places to eat and a 4-day plan.",
  ],
  "US:Los Angeles": [
    "Los Angeles Travel Guide: Where to Stay & Getting Around",
    "Plan Los Angeles with or without a car: which neighbourhood to stay in, Metro and LAX transfers, beaches, studio tours vs theme parks, food and a 4-day route.",
  ],
  "US:Miami": [
    "Miami Travel Guide: Miami Beach, Where to Stay & Food",
    "Miami vs Miami Beach explained, where to stay beyond South Beach, MIA and FLL transfers, parking and SunPass, Cuban food, hurricane season and a 4-day plan.",
  ],
  "US:Chicago": [
    "Chicago Travel Guide: Architecture, Food & 4-Day Plan",
    "Things to do in Chicago, from the architecture river cruise to the lakefront and museums, trains from O'Hare and Midway, where to stay and food past deep-dish.",
  ],
  "US:San Francisco": [
    "San Francisco Travel Guide: Things to Do & Where to Stay",
    "Things to do in San Francisco by neighbourhood, booking Alcatraz the right way, BART from SFO, Muni and cable cars, where to stay and a 4-day itinerary.",
  ],
  "US:Las Vegas": [
    "Las Vegas Travel Guide: The Strip, Hotels & 4-Day Plan",
    "The Strip vs Downtown and Fremont Street, choosing a hotel, resort fees, getting from Harry Reid Airport, restaurants off the Strip, Red Rock and a 4-day plan.",
  ],

  /* ----------------------------- İtalya ----------------------------- */
  "IT:Roma": [
    "Rome Travel Guide: Things to Do, Where to Stay & 5 Days",
    "Colosseum and Vatican tickets done right, the Pantheon and Trevi, getting in from Fiumicino, which neighbourhood to stay in, Roman food and a 5-day itinerary.",
  ],
  "IT:Venedik": [
    "Venice Travel Guide: Vaporetto, Access Fee & 3-Day Plan",
    "Who pays Venice's 2026 access fee, how to use the vaporetto, which sestiere to stay in, San Marco without the crowds, Murano and Burano, bacari and 3 days.",
  ],
  "IT:Floransa": [
    "Florence Travel Guide: Uffizi, Duomo & 4-Day Itinerary",
    "Book the Uffizi, the Accademia and the Duomo climb the right way, then explore the Oltrarno and the Pitti, with where to stay, Tuscan food and a 4-day plan.",
  ],
  "IT:Milano": [
    "Milan Travel Guide: Last Supper, Duomo & 3-Day Plan",
    "Booking The Last Supper, the Duomo terraces, Brera and the Navigli, Malpensa vs Linate vs Bergamo transfers, where to stay, aperitivo and a 3-day Milan route.",
  ],
  "IT:Amalfi Kıyısı": [
    "Amalfi Coast Travel Guide: Where to Stay & Getting Around",
    "Positano, Amalfi or Ravello as a base, getting there from Naples or Salerno, ferry vs SITA bus, quieter towns to the east and a 5-day Amalfi Coast itinerary.",
  ],
  "IT:Napoli": [
    "Naples Travel Guide: Pizza, Pompeii & 4-Day Itinerary",
    "Naples on its own terms: the historic centre and underground, the MANN, where to stay safely, classic pizzerias, Pompeii and Herculaneum, and a 4-day plan.",
  ],

  /* ----------------------------- Fransa ----------------------------- */
  "FR:Paris": [
    "Paris Travel Guide: Things to Do, Where to Stay & 5 Days",
    "Louvre and Eiffel Tower tickets, Montmartre and the Seine, getting in from CDG and Orly, the metro, where to stay, bistros and bakeries, and a 5-day Paris plan.",
  ],
  "FR:Nice": [
    "Nice Travel Guide: Beaches, Old Town & Riviera Day Trips",
    "Vieux Nice and Castle Hill, pebble beaches, the airport tram, which neighbourhood to stay in, Niçois food and a 4-day route with Monaco and Antibes day trips.",
  ],
  "FR:Lyon": [
    "Lyon Travel Guide: Bouchons, Old Lyon & 3-Day Itinerary",
    "Vieux Lyon's traboules, Fourvière and the Presqu'île, how to choose a real bouchon, getting in from the airport, where to stay and a 3-day Lyon itinerary.",
  ],
  "FR:Marsilya": [
    "Marseille Travel Guide: Calanques, Old Port & 4 Days",
    "The Vieux-Port, Le Panier and Mucem, booking the Calanques in 2026, Notre-Dame de la Garde, choosing a safe area to stay, bouillabaisse and a 4-day route.",
  ],
  "FR:Bordo": [
    "Bordeaux Travel Guide: Wine, Old Town & 4-Day Itinerary",
    "The Miroir d'eau and historic centre, the Cité du Vin, Saint-Émilion and Médoc vineyard days, the airport tram, where to stay, canelés and a 4-day plan.",
  ],
  "FR:Strazburg": [
    "Strasbourg Travel Guide: Petite France & Christmas Markets",
    "The cathedral and Petite France, the Neustadt, Christmas market logistics, Alsatian food, the airport train, where to stay and a 3-day route with Colmar.",
  ],

  /* ----------------------------- Tayland ----------------------------- */
  "TH:Bangkok": [
    "Bangkok Travel Guide: Things to Do, Where to Stay & Food",
    "The Grand Palace, Wat Pho and Wat Arun, Chinatown at night, Chatuchak, BTS vs MRT vs river boats, which area to stay in, street food and a 4-day itinerary.",
  ],
  "TH:Chiang Mai": [
    "Chiang Mai Travel Guide: Temples, Markets & 4 Days",
    "Old City temples, Wat Umong and Doi Suthep, which market on which day, Old City vs Nimman for hotels, khao soi, the smoky season and a 4-day itinerary.",
  ],
  "TH:Phuket": [
    "Phuket Travel Guide: Best Beaches, Where to Stay & 5 Days",
    "Patong, Kata, Bang Tao or Old Town: choosing a Phuket base, HKT transfers, the Smart Bus, boat trips and ferry piers, monsoon sea safety and a 5-day plan.",
  ],
  "TH:Krabi": [
    "Krabi Travel Guide: Ao Nang vs Railay, Boats & 4 Days",
    "Ao Nang, Railay, Krabi Town or Klong Muang as a base, KBV transfers, longtail boats and piers, which island-hopping tour to pick, southern food and 4 days.",
  ],
  "TH:Koh Samui": [
    "Koh Samui Travel Guide: Beaches, Ferries & 5-Day Plan",
    "Chaweng, Bophut, Lamai or Mae Nam? Where to stay on Koh Samui, flights vs the Donsak ferry, getting around, Ang Thong day trips and a 5-day island plan.",
  ],
  "TH:Ayutthaya": [
    "Ayutthaya Travel Guide: Temples, Trains & 2-Day Plan",
    "Getting from Bangkok to Ayutthaya by train, the historic island's main temples, Wat Chaiwatthanaram, bike vs tuk-tuk, day trip or overnight, and riverside food.",
  ],

  /* --------------------------- Güney Kore --------------------------- */
  "KR:Seul": [
    "Seoul Travel Guide: Neighbourhoods, Food & 5-Day Plan",
    "Palaces and Bukchon in the right order, AREX from Incheon, T-money and the metro, which neighbourhood to stay in, markets and Korean BBQ, and a 5-day plan.",
  ],
  "KR:Busan": [
    "Busan Travel Guide: Beaches, Markets & 4-Day Itinerary",
    "Haeundae and Gwangalli beaches, Gamcheon Culture Village and Jagalchi Market, getting in via Gimhae or KTX, where to stay, dwaeji gukbap and a 4-day route.",
  ],
  "KR:Jeju Adası": [
    "Jeju Island Travel Guide: Hallasan, Car Hire & 5 Days",
    "Climbing Hallasan with a reservation, car hire and driving permits, Udo and the east coast, one base or two, black pork and seafood, and a 5-day Jeju route.",
  ],
  "KR:Gyeongju": [
    "Gyeongju Travel Guide: Bulguksa, Silla Tombs & 3 Days",
    "Daereungwon tombs and Cheomseongdae, Bulguksa and Seokguram done right, getting there by KTX, where to stay, Silla-era food and a 3-day Gyeongju itinerary.",
  ],
  "KR:Incheon": [
    "Incheon Travel Guide: Chinatown, Songdo & Transit Tours",
    "More than an airport: Incheon's free transit tours, Chinatown and the Open Port, Wolmido, Songdo and Ganghwa, where to stay, jjajangmyeon and a 3-day plan.",
  ],
  "KR:Sokcho": [
    "Sokcho Travel Guide: Seoraksan Hikes, Seafood & 3 Days",
    "Buses from Seoul to Sokcho, Seoraksan trails and the cable car, Abai Village and the fish market, East Sea beaches, where to stay and a 3-day Sokcho route.",
  ],

  /* ----------------------------- İspanya ----------------------------- */
  "ES:Barcelona": [
    "Barcelona Travel Guide: Gaudí, Neighbourhoods & 5 Days",
    "Sagrada Família and Park Güell tickets, the Gothic Quarter, El Born and Gràcia, Montjuïc and the beach, where to stay, tapas bars and a 5-day itinerary.",
  ],
  "ES:Madrid": [
    "Madrid Travel Guide: Museums, Tapas & 4-Day Itinerary",
    "The Prado and the Paseo del Arte, the Retiro, Habsburg squares and the Royal Palace, market tapas, where to stay, football and a 4-day Madrid itinerary.",
  ],
  "ES:Sevilla": [
    "Seville Travel Guide: Alcázar, Triana & Flamenco",
    "The Real Alcázar and Santa Cruz, the Cathedral and Giralda, Plaza de España, Triana and an authentic flamenco night, plus where to stay, tapas and 3 days.",
  ],
  "ES:Valencia": [
    "Valencia Travel Guide: Paella, City of Arts & 4 Days",
    "The Mercat Central and El Carmen, cycling the Turia gardens, the City of Arts and Sciences, Cabanyal and the Albufera for real paella, and where to stay.",
  ],
  "ES:Málaga": [
    "Málaga Travel Guide: Alcazaba, Picasso & Beaches",
    "The Alcazaba, Roman Theatre and Gibralfaro, the Picasso Museum, Muelle Uno, Malagueta and Pedregalejo's sardines, Costa del Sol day trips and a 3-day plan.",
  ],
  "ES:Granada": [
    "Granada Travel Guide: Alhambra Tickets, Albaicín & 3 Days",
    "Timed entry to the Alhambra's Nasrid Palaces, the Albaicín and the Darro, Sacromonte at night, tapas bars, where to stay and a 3-day Granada itinerary.",
  ],
  "ES:Bilbao": [
    "Bilbao Travel Guide: Guggenheim, Pintxos & Old Town",
    "The Guggenheim and the Nervión riverside, the Casco Viejo and La Ribera market, a pintxos crawl, Artxanda's funicular, coastal day trips and a 3-day plan.",
  ],
  "ES:Córdoba": [
    "Córdoba Travel Guide: Mezquita, Patios & 2-Day Plan",
    "Visiting the Mezquita-Catedral, the Judería, the synagogue and the Alcázar, the Roman Bridge, the patios of Palacio de Viana, where to stay and 2 relaxed days.",
  ],
  "ES:Alicante": [
    "Alicante Travel Guide: Castle, Beaches & Costa Blanca",
    "Santa Bárbara Castle, the Barrio de Santa Cruz, the Explanada and Postiguet beach, a Tabarca island trip, rice dishes, where to stay and a 2-day city break.",
  ],
  "ES:San Sebastián": [
    "San Sebastián Travel Guide: Pintxos, La Concha & 3 Days",
    "La Concha and Monte Igueldo, how to order pintxos in the Parte Vieja, Gros and Mount Urgull, Basque food beyond the Michelin list, where to stay and 3 days.",
  ],
  "ES:Toledo": [
    "Toledo Travel Guide: Cathedral, El Greco & 2-Day Plan",
    "Toledo's Christian, Jewish and Islamic heritage, the Cathedral and Zocodover, El Greco, Cristo de la Luz, the Mirador del Valle view, and day trip vs overnight.",
  ],
  "ES:Salamanca": [
    "Salamanca Travel Guide: University, Plaza Mayor & 2 Days",
    "The University and the Escuelas Mayores, the Old and New Cathedrals, the Plaza Mayor, Casa de las Conchas and the Roman Bridge, tapas and a 2-day plan.",
  ],
  "ES:Palma de Mallorca": [
    "Palma de Mallorca Travel Guide: Old Town, Coves & Sóller",
    "La Seu cathedral and the old centre, Bellver Castle and Santa Catalina, markets, the city beach, the train to Sóller, Deià and Valldemossa, and where to stay.",
  ],
  "ES:Ibiza": [
    "Ibiza Travel Guide: Dalt Vila, Best Coves & Nightlife",
    "Ibiza beyond the clubs: UNESCO-listed Dalt Vila, choosing a cove, the quieter north, where to stay for your style of trip, nightlife tickets and a 5-day route.",
  ],
  "ES:Tenerife": [
    "Tenerife Travel Guide: Teide, Anaga & Where to Stay",
    "Teide National Park permits, La Laguna and the Anaga trails, north vs south coast weather, where to stay, guachinche food and a 5-day Tenerife itinerary.",
  ],
  "ES:Gran Canaria": [
    "Gran Canaria Travel Guide: Las Palmas, Dunes & Mountains",
    "Vegueta and Las Canteras in Las Palmas, the Maspalomas dunes, the mountain roads of Tejeda and Artenara, northern towns, where to stay and a 5-day route.",
  ],

  /* ----------------------------- Türkiye ----------------------------- */
  "TR:İstanbul": [
    "Istanbul Travel Guide: Things to Do, Where to Stay & 5 Days",
    "Sultanahmet done right, Galata and Beyoğlu, Bosphorus ferries and the Asian side, bazaars, where to stay, real places to eat and a 5-day Istanbul itinerary.",
  ],
  "TR:Antalya": [
    "Antalya Travel Guide: Kaleiçi, Beaches & Ancient Sites",
    "Kaleiçi and the old harbour, Konyaaltı beach and the Antalya Museum, the waterfalls, Perge, Aspendos and Termessos, city vs resort stays and a 4-day plan.",
  ],
  "TR:İzmir": [
    "Izmir Travel Guide: Kemeraltı, the Kordon & Ephesus",
    "Kemeraltı's bazaar and the Agora, Kordon sunsets, Alsancak and Karşıyaka, a day trip to Ephesus, Aegean food, where to stay and a 4-day Izmir itinerary.",
  ],
  "TR:Muğla": [
    "Muğla Travel Guide: Akyaka, Datça & the Gökova Gulf",
    "Muğla beyond Bodrum and Fethiye: Akyaka and the Azmak river, Ula's old houses, the Gökova coast, Datça and ancient Knidos, where to stay and a 5-day route.",
  ],
  "TR:Bodrum": [
    "Bodrum Travel Guide: Castle, Best Coves & the Peninsula",
    "Bodrum Castle and its underwater archaeology museum, ancient Halicarnassus, Gümüşlük sunsets, peninsula coves, where to stay, meyhanes and summer nightlife.",
  ],
  "TR:Fethiye": [
    "Fethiye Travel Guide: Ölüdeniz, Lycian Way & Boat Trips",
    "Ölüdeniz and Babadağ, the abandoned village of Kayaköy, Lycian Way walks, the fish market, boat trips to the coves, where to stay and a 5-day itinerary.",
  ],
  "TR:Marmaris": [
    "Marmaris Travel Guide: Coves, İçmeler & Bozburun",
    "Marmaris old town and marina, walking to İçmeler, Turunç and the pine-backed coves, the quieter Bozburun–Selimiye peninsula, boat days and where to stay.",
  ],
  "TR:Kapadokya": [
    "Cappadocia Travel Guide: Balloons, Valleys & 4 Days",
    "Göreme Open-Air Museum, hiking the valleys, Uçhisar, underground cities and Avanos, booking a hot-air balloon, choosing a base and a 4-day Cappadocia itinerary.",
  ],
  "TR:Ankara": [
    "Ankara Travel Guide: Anıtkabir, Museums & 3-Day Plan",
    "Anıtkabir, the Museum of Anatolian Civilisations and the citadel, the Ulus Republic route, where to stay, Ankara's restaurants and a 3-day capital itinerary.",
  ],
  "TR:Bursa": [
    "Bursa Travel Guide: Ottoman Heritage, Uludağ & Kebab",
    "The Grand Mosque and the hans, the Green Mosque and Muradiye, Cumalıkızık village, Uludağ, the original İskender kebab, where to stay and a 3-day Bursa route.",
  ],
  "TR:Çanakkale": [
    "Çanakkale Travel Guide: Troy, Gallipoli & Bozcaada",
    "Planning Troy and the Troy Museum, the Gallipoli battlefields and memorials, central Çanakkale's waterfront, a Bozcaada island day and a 4-day route.",
  ],
  "TR:Trabzon": [
    "Trabzon Travel Guide: Sumela, Uzungöl & Highlands",
    "Sumela Monastery and Maçka, Uzungöl and the highland pastures beyond it, central Trabzon, Black Sea food, getting around and a 4-day Trabzon itinerary.",
  ],
  "TR:Mardin": [
    "Mardin Travel Guide: Old Town, Monasteries & Midyat",
    "Mardin's terraced stone old town, Deyrulzafaran and Syriac heritage, ancient Dara, Midyat, the bazaar, where to stay and a 4-day Mesopotamia itinerary.",
  ],
  "TR:Gaziantep": [
    "Gaziantep Travel Guide: Zeugma Mosaics & Food Route",
    "The Zeugma Mosaic Museum, the citadel, the coppersmiths' bazaar and old hans, baklava and kebab in context, Emine Göğüş Culinary Museum and a 3-day plan.",
  ],
  "TR:Şanlıurfa": [
    "Şanlıurfa Travel Guide: Göbeklitepe & Balıklıgöl",
    "Göbeklitepe and the Taş Tepeler sites, the archaeology museum and Haleplibahçe mosaics, Balıklıgöl, the bazaar and hans, Urfa food and a 3-day itinerary.",
  ],
  "TR:Eskişehir": [
    "Eskişehir Travel Guide: Odunpazarı & Weekend Plan",
    "A walkable weekend in Eskişehir: Odunpazarı's Ottoman houses and the OMM museum, the Porsuk riverside, Sazova Park, çibörek, balaban kebab and where to stay.",
  ],
  "TR:Konya": [
    "Konya Travel Guide: Mevlana Museum, Seljuks & 3 Days",
    "The Mevlana Museum and square, Konya's Seljuk monuments, Sille village and Çatalhöyük, etliekmek and tirit, where to stay and a 3-day Konya itinerary.",
  ],
  "TR:Kaş": [
    "Kaş Travel Guide: Kekova Boat Trips, Diving & Beaches",
    "Central Kaş and ancient Antiphellos, a Kekova and Simena boat day, diving, Kaputaş and Patara beaches, where to stay and a relaxed 4-day Kaş itinerary.",
  ],
  "TR:Alanya": [
    "Alanya Travel Guide: Castle, Cleopatra Beach & Dim River",
    "Alanya Castle and the cable car, Cleopatra Beach and Damlataş, the harbour, the Dim River and Sapadere Canyon, where to stay and a 4-day Alanya itinerary.",
  ],

  /* ------------------------- Birleşik Krallık ------------------------- */
  "GB:Londra": [
    "London Travel Guide: Things to Do, Where to Stay & 5 Days",
    "Westminster and the South Bank, free museums, West End theatre, the Tower and the East End, Greenwich, which area to stay in, getting around and a 5-day plan.",
  ],
  "GB:Edinburgh": [
    "Edinburgh Travel Guide: Castle, Royal Mile & 4-Day Plan",
    "Edinburgh Castle and the Royal Mile, Arthur's Seat and Holyrood, the New Town, Dean Village and Stockbridge, Leith, where to stay and a 4-day itinerary.",
  ],
  "GB:Manchester": [
    "Manchester Travel Guide: Football, Music & Things to Do",
    "Things to do in Manchester: science and industry museums, the Northern Quarter and Ancoats, football match days, Salford Quays, food and where to stay.",
  ],
  "GB:Liverpool": [
    "Liverpool Travel Guide: Beatles, Waterfront & Football",
    "The Mersey waterfront and its museums, a Beatles route beyond the Cavern photo, the Georgian Quarter and Baltic Triangle, Anfield and a 3-day Liverpool plan.",
  ],
  "GB:Oxford": [
    "Oxford Travel Guide: Colleges, Bodleian & Punting",
    "Visiting Oxford's colleges for real, the Bodleian and the Radcliffe Camera, Christ Church, the Ashmolean and Pitt Rivers, punting, pubs and a 1–2 day plan.",
  ],
  "GB:Cambridge": [
    "Cambridge Travel Guide: Colleges, Punting & the Backs",
    "King's College Chapel, the Backs and St John's, punting on the River Cam, the Fitzwilliam Museum, where to eat, day trip or overnight, and a 2-day plan.",
  ],
  "GB:Bath": [
    "Bath Travel Guide: Roman Baths, Royal Crescent & Spa",
    "The Roman Baths and Bath Abbey, the Royal Crescent and the Circus, the thermal spa, the Skyline walk, Sally Lunn's, day trips and a 2-day Bath itinerary.",
  ],
  "GB:York": [
    "York Travel Guide: The Minster, City Walls & Shambles",
    "York Minster's stained glass, walking the city walls, Clifford's Tower, the Shambles, Jorvik and the museums, tea at Bettys and a 3-day York itinerary.",
  ],
  "GB:Glasgow": [
    "Glasgow Travel Guide: West End, Museums & Music",
    "Kelvingrove and the West End, Mackintosh design in the centre, the Burrell Collection and the Southside, the Clyde, Glasgow's live music scene and 3 days.",
  ],
  "GB:Belfast": [
    "Belfast Travel Guide: Titanic Quarter & Causeway Trips",
    "Titanic Belfast and its quarter, the Cathedral Quarter's pubs, visiting the murals and peace line respectfully, Giant's Causeway trips and a 3-day plan.",
  ],
  "GB:Brighton": [
    "Brighton Travel Guide: Royal Pavilion, Lanes & Seafront",
    "The Royal Pavilion and the Lanes, the pier, the i360 and the pebble beach, Kemptown and Hove, independent shops, great food and a 2-day Brighton break.",
  ],
  "GB:Bristol": [
    "Bristol Travel Guide: Clifton, Harbourside & Street Art",
    "Harbourside and M Shed, Brunel's SS Great Britain, Clifton Suspension Bridge, Stokes Croft street art, food, where to stay and a 3-day Bristol itinerary.",
  ],
  "GB:Cardiff": [
    "Cardiff Travel Guide: Castle, Cardiff Bay & Welsh Culture",
    "Cardiff Castle and the Victorian arcades, the National Museum, Cardiff Bay, rugby at the Principality Stadium, Welsh food, where to stay and a 3-day plan.",
  ],
  "GB:İskoçya Highlands": [
    "Scottish Highlands Travel Guide: Glencoe, Skye & Loch Ness",
    "Glencoe and Fort William, Loch Ness and Inverness, the Isle of Skye and the Cairngorms, driving and transport, where to stay and a 5-day Highlands route.",
  ],
  "GB:Cotswolds": [
    "Cotswolds Travel Guide: Best Villages & Walking Routes",
    "The northern and southern Cotswold villages, the Cotswold Way, getting around without a car, country pubs, where to stay and a 4-day Cotswolds itinerary.",
  ],
  "GB:Lake District": [
    "Lake District Travel Guide: Windermere, Keswick & Walks",
    "Windermere, Bowness and Ambleside, Keswick and Derwentwater, Coniston's literary trail, fell walks done safely, where to stay and a 5-day itinerary.",
  ],

  /* ---------------------------- Endonezya ---------------------------- */
  "ID:Jakarta": [
    "Jakarta Travel Guide: Kota Tua, Museums & 3-Day Plan",
    "Kota Tua and Fatahillah Square, Monas and the National Museum, MACAN and South Jakarta, beating the traffic, where to stay, food and a 3-day itinerary.",
  ],
  "ID:Yogyakarta": [
    "Yogyakarta Travel Guide: Borobudur, Prambanan & Kraton",
    "Timed visits to Borobudur and Prambanan, Ratu Boko, the Kraton, Taman Sari and Kotagede, batik workshops, where to stay and a 3-day Yogyakarta itinerary.",
  ],
  "ID:Ubud": [
    "Ubud Travel Guide: Temples, Rice Terraces & Where to Stay",
    "Ubud Palace dance evenings, Campuhan and rice-field walks, Tirta Empul and nearby villages, temple etiquette, traffic tips, where to stay and a 3-day plan.",
  ],

  "ID:Canggu": [
    "Canggu Travel Guide: Surf, Cafés & Where to Stay in Bali",
    "Batu Bolong and Echo Beach, quieter Pererenan and Seseh, surfing for every level, café culture, Tanah Lot at sunset and choosing the right Canggu base.",
  ],
  "ID:Uluwatu": [
    "Uluwatu Travel Guide: Temple, Kecak Dance & Surf Beaches",
    "Uluwatu Temple and the Kecak performance, Padang Padang and Bingin, Melasti and Nyang Nyang beaches, getting around the Bukit and where to stay in Uluwatu.",
  ],
  "ID:Nusa Penida": [
    "Nusa Penida Travel Guide: Kelingking, Mantas & Logistics",
    "Kelingking, Broken Beach and Angel's Billabong, Diamond Beach and Atuh, manta snorkelling, the boat from Sanur, the island's tough roads and where to stay.",
  ],
  "ID:Lombok": [
    "Lombok Travel Guide: Rinjani, Kuta Beaches & Sasak Villages",
    "Kuta Lombok and the southern coves, trekking Rinjani from Senaru, Sasak villages and waterfalls, the Gili connection and how to split Lombok by region.",
  ],
  "ID:Gili Adaları": [
    "Gili Islands Travel Guide: Trawangan, Meno or Air?",
    "Gili Trawangan, Meno and Air compared, fast boats from Bali and Lombok, a three-island snorkelling route, diving courses, sunsets and car-free island life.",
  ],
  "ID:Labuan Bajo": [
    "Labuan Bajo Travel Guide: Komodo Boat Trips & Padar",
    "Choosing a day or liveaboard boat into Komodo National Park, Padar Island, Komodo dragons on Komodo or Rinca, manta points, pink beaches and where to stay.",
  ],
  "ID:Bromo Dağı": [
    "Mount Bromo Travel Guide: Sunrise Viewpoints & Crater",
    "Getting to Mount Bromo from Surabaya or Malang, staying in Cemoro Lawang, Penanjakan and quieter sunrise points, the Sea of Sand, the crater and volcano safety.",
  ],
  "ID:Banyuwangi": [
    "Banyuwangi Travel Guide: Ijen Crater & East Java Nature",
    "Ijen Crater done safely, De Djawatan forest and Osing culture, Alas Purwo or Baluran national parks, the ferry to Bali and where to stay in Banyuwangi.",
  ],
  "ID:Bandung": [
    "Bandung Travel Guide: Art Deco, Volcanoes & Food",
    "Braga and Asia Afrika's art deco streets, Tangkuban Perahu and Lembang, Kawah Putih and Ciwidey, Sundanese food and the Whoosh fast train from Jakarta.",
  ],
  "ID:Surabaya": [
    "Surabaya Travel Guide: Heroes' History & Old Quarters",
    "Tugu Pahlawan and the 10 November Museum, Ampel and the Arab Quarter, Kya-Kya and the old port, East Javanese food and Surabaya as a base for Bromo and Ijen.",
  ],
  "ID:Toba Gölü": [
    "Lake Toba Travel Guide: Samosir, Batak Culture & Ferries",
    "The Parapat–Tuk Tuk ferry, Tuk Tuk and Tomok, Ambarita and Simanindo's Batak villages, inner Samosir and Tele viewpoints, and the road from Medan.",
  ],
  "ID:Bukittinggi": [
    "Bukittinggi Travel Guide: Minangkabau Culture & Canyons",
    "Jam Gadang and Pasar Atas, the Sianok Canyon and Lobang Jepang, Pagaruyung Palace and Minangkabau villages, Padang food and the cool West Sumatra highlands.",
  ],
  "ID:Raja Ampat": [
    "Raja Ampat Travel Guide: Diving, Homestays & Getting There",
    "The Sorong–Waisai ferry, environmental fees, homestay vs liveaboard, Piaynemo or Wayag viewpoints, diving the Dampier Strait and birds of paradise trips.",
  ],
  "ID:Makassar": [
    "Makassar Travel Guide: Fort Rotterdam, Seafood & Islands",
    "Fort Rotterdam and La Galigo Museum, Paotere's pinisi harbour, Losari sunsets and nearby islands, Makassar's seafood and the road north to Tana Toraja.",
  ],
  "ID:Tana Toraja": [
    "Tana Toraja Travel Guide: Villages, Ceremonies & Treks",
    "Ke'te Kesu and Londa, Bori Kalimbuang and the northern villages, Batutumonga and Lolai, visiting ceremonies respectfully, local guides and Rantepao as a base.",
  ],

  /* ------------------------------- Çin ------------------------------- */
  "CN:Pekin": [
    "Beijing Travel Guide: Forbidden City, Great Wall & Hutongs",
    "Booking the Forbidden City with your passport, Jingshan views, the Temple of Heaven and hutongs, Mutianyu or Jinshanling Great Wall, and where to stay.",
  ],
  "CN:Şanghay": [
    "Shanghai Travel Guide: The Bund, Neighbourhoods & Food",
    "The Bund and the Pudong skyline, the French Concession and lilong lanes, the Shanghai Museum and West Bund, the metro, water towns and where to stay.",
  ],
  "CN:Xi'an": [
    "Xi'an Travel Guide: Terracotta Army, City Walls & Food",
    "Visiting the Terracotta Army, the city walls and the Bell Tower, the Great Mosque and Muslim Quarter food, airport and high-speed rail links and 3 days.",
  ],
  "CN:Chengdu": [
    "Chengdu Travel Guide: Pandas, Teahouses & Sichuan Food",
    "Panda bases at the right time of day, People's Park teahouses and Kuanzhai Alley, Wenshu Monastery and Taikoo Li, Sichuan food and where to stay in Chengdu.",
  ],
  "CN:Chongqing": [
    "Chongqing Travel Guide: Hongya Cave, Hotpot & the Yangtze",
    "Hongya Cave and Jiefangbei, Liziba's train-through-a-building, Eling and Testbed 2, the Yangtze cable car to Nan'an, hotpot culture and getting around.",
  ],
  "CN:Hangzhou": [
    "Hangzhou Travel Guide: West Lake, Lingyin & Longjing Tea",
    "West Lake's shores in half-day loops, Lingyin Temple and Feilai Feng, the Longjing and Meijiawu tea villages, Grand Canal heritage and where to stay.",
  ],
  "CN:Suzhou": [
    "Suzhou Travel Guide: Classical Gardens, Canals & Museum",
    "The Humble Administrator's Garden and Suzhou Museum, Pingjiang Road's canals, the Lingering Garden or Tiger Hill, water towns and a 3-day Suzhou plan.",
  ],
  "CN:Nanjing": [
    "Nanjing Travel Guide: Ming Walls, Purple Mountain & History",
    "Purple Mountain and the Sun Yat-sen Mausoleum, the Ming city walls and Xuanwu Lake, the Nanjing Massacre Memorial Hall and Nanjing's Republican-era past.",
  ],
  "CN:Guilin ve Yangshuo": [
    "Guilin & Yangshuo Travel Guide: Li River & Karst Scenery",
    "The Li River cruise from Guilin to Yangshuo, the Yulong River by bamboo raft or bike, countryside cycling, the Longji Rice Terraces and where to base yourself.",
  ],
  "CN:Zhangjiajie": [
    "Zhangjiajie Travel Guide: Wulingyuan, Tianmen & Tickets",
    "Yuanjiajie and Tianzi Mountain, Golden Whip Stream, Tianmen Mountain, how Wulingyuan's park tickets and shuttle buses work, fog and where to stay.",
  ],
  "CN:Guangzhou": [
    "Guangzhou Travel Guide: Dim Sum, Old Canton & Skyline",
    "Morning dim sum, the Chen Clan Academy and Liwan, Shamian Island and Qingping, Canton Tower and Zhujiang New Town, the metro and a 3-day Guangzhou plan.",
  ],
  "CN:Shenzhen": [
    "Shenzhen Travel Guide: Design, Museums & Coastline",
    "Shenzhen beyond the Hong Kong border: the contemporary art and planning museums, OCT-LOFT and Nanshan, the Dapeng coast and how to get around the city.",
  ],
  "CN:Kunming": [
    "Kunming Travel Guide: Stone Forest, Yunnan Food & Trains",
    "Green Lake and Yuantong Temple, the Stone Forest, the Western Hills and Dianchi Lake, Yunnan food, and Kunming as the gateway to Dali and Lijiang by train.",
  ],
  "CN:Dali": [
    "Dali Travel Guide: Old Town, Erhai Lake & Bai Villages",
    "Dali Old Town and the Three Pagodas, the Bai villages of Xizhou and Zhoucheng, Erhai Lake beyond rushed tours, Cangshan walks and where to stay.",
  ],
  "CN:Lijiang": [
    "Lijiang Travel Guide: Old Town & Jade Dragon Snow Mountain",
    "Dayan Old Town and Black Dragon Pool, Naxi culture in Baisha and Shuhe, Jade Dragon Snow Mountain, coping with altitude and choosing where to stay.",
  ],
  "CN:Harbin": [
    "Harbin Travel Guide: Ice Festival, Snow Expo & Winter Tips",
    "Harbin Ice and Snow World, the Sun Island Snow Expo, Central Street and St Sophia Cathedral, dressing for extreme cold, Russian heritage and a 3-day plan.",
  ],

  /* ----------------------------- Hollanda ----------------------------- */
  "NL:Amsterdam": [
    "Amsterdam Travel Guide: Museums, Canals & Where to Stay",
    "Rijksmuseum and Van Gogh Museum tickets, the canal rings and the Jordaan, Noord and the Eastern Docklands, cycling etiquette, where to stay and 3 days.",
  ],
  "NL:Rotterdam": [
    "Rotterdam Travel Guide: Architecture, Markthal & Port",
    "An architecture walk from Centraal to the Markthal and Cube Houses, Kop van Zuid and Katendrecht, a harbour tour, Depot Boijmans and a 3-day Rotterdam plan.",
  ],
  "NL:Lahey": [
    "The Hague Travel Guide: Mauritshuis, Peace Palace & Beach",
    "The Mauritshuis and the Hofvijver, the Peace Palace and the international zone, Scheveningen beach and the Kunstmuseum, plus where to stay in The Hague.",
  ],
  "NL:Utrecht": [
    "Utrecht Travel Guide: Dom Tower, Canals & Museums",
    "Climbing the Dom Tower, the two-level Oudegracht wharves, the Museum Quarter, the Rietveld Schröder House and Utrecht as a rail hub for day trips.",
  ],
  "NL:Haarlem": [
    "Haarlem Travel Guide: Frans Hals, Hofjes & Day Trips",
    "The Grote Markt and Grote Kerk, the Frans Hals Museum, hidden hofje courtyards, De Adriaan windmill, Zandvoort beach and Haarlem as a calm Amsterdam base.",
  ],
  "NL:Leiden": [
    "Leiden Travel Guide: Museums, Canals & University",
    "The Rijksmuseum van Oudheden, the Hortus Botanicus, the university, Boerhaave or De Lakenhal, canal walks and how to plan a Leiden day trip or overnight.",
  ],
  "NL:Delft": [
    "Delft Travel Guide: Vermeer, Delft Blue & Canals",
    "The Markt, the Nieuwe Kerk and Oude Kerk, the Vermeer Centrum, a Royal Delft factory visit, canal walks and how to fit Delft into a day from The Hague.",
  ],
  "NL:Maastricht": [
    "Maastricht Travel Guide: Old Town, Caves & Food",
    "The Vrijthof and Basilica of Saint Servatius, Onze Lieve Vrouweplein and Stokstraat, the Sint Pietersberg caves and fort, Burgundian food and a 3-day plan.",
  ],
  "NL:Groningen": [
    "Groningen Travel Guide: Forum, Museum & Student City",
    "The Forum's rooftop and the Grote Markt, the Groninger Museum, Hoge der A and Noorderplantsoen, cycling the compact centre and where to stay in Groningen.",
  ],
  "NL:Eindhoven": [
    "Eindhoven Travel Guide: Dutch Design & Strijp-S",
    "Strijp-S and its design scene, the Van Abbemuseum, the Philips Museum and a light-art walk, getting in from the airport and a 1–2 day Eindhoven plan.",
  ],
  "NL:Giethoorn": [
    "Giethoorn Travel Guide: Canals, Boats & Avoiding Crowds",
    "Walking the Dorpsgracht, hiring a quiet electric boat, Weerribben-Wieden National Park, timing your visit around tour coaches and staying the night.",
  ],
  "NL:Zaanse Schans": [
    "Zaanse Schans Travel Guide: Windmills & Half-Day Plan",
    "The working windmills, the Zaans Museum and Verkade, wooden houses and crafts, tickets and crowds, and how to plan Zaanse Schans as a half day from Amsterdam.",
  ],
  "NL:Keukenhof ve Lisse": [
    "Keukenhof Travel Guide: Tulip Season, Tickets & Bulb Fields",
    "The Keukenhof gardens in their short spring season, timed tickets and transport, cycling the Lisse bulb fields, Kasteel Keukenhof and planning a full day.",
  ],
  "NL:Texel": [
    "Texel Travel Guide: Ferry, Cycling & Dunes",
    "The Den Helder ferry, cycling the dunes, De Slufter, Ecomare's seals, the lighthouse in the north, bird-protection seasons and where to stay on Texel.",
  ],

  /* ----------------------------- Avusturya ----------------------------- */
  "AT:Viyana": [
    "Vienna Travel Guide: Palaces, Museums & Coffee Houses",
    "Schönbrunn Palace, the Hofburg and the MuseumsQuartier, the Belvedere and Karlskirche, classical music, coffee houses, where to stay and a 3-day Vienna plan.",
  ],
  "AT:Salzburg": [
    "Salzburg Travel Guide: Old Town, Mozart & Fortress",
    "Hohensalzburg Fortress, Getreidegasse and a Mozart route, Mirabell Gardens and the Mönchsberg, lake and mountain day trips, and a 3-day Salzburg plan.",
  ],
  "AT:Innsbruck": [
    "Innsbruck Travel Guide: Nordkette, Old Town & Alps",
    "The Nordkette cable car, the Altstadt and the Golden Roof, the Bergisel ski jump, winter sports and mountain days, where to stay and a 3-day Innsbruck plan.",
  ],
  "AT:Graz": [
    "Graz Travel Guide: Schlossberg, Kunsthaus & Food",
    "The Schlossberg and Clock Tower, the Kunsthaus and Murinsel, Eggenberg Palace, the UNESCO old town, Styrian food, where to stay and a 3-day Graz itinerary.",
  ],
  "AT:Hallstatt": [
    "Hallstatt Travel Guide: Salt Mine, Skywalk & Dachstein",
    "The old village of Hallstatt, the Salzwelten salt mine and Skywalk, Dachstein Krippenstein, beating the day-trip crowds and the best time to visit.",
  ],
  "AT:Wachau Vadisi": [
    "Wachau Valley Travel Guide: Melk, Dürnstein & Wine",
    "Melk Abbey, Dürnstein and Krems, cycling or cruising the Danube, vineyard terraces, apricot season and where to stay in the Wachau Valley.",
  ],
  "AT:Linz": [
    "Linz Travel Guide: Ars Electronica & the Danube",
    "The Ars Electronica Center, the Lentos and the Danube riverside, the Pöstlingberg tram, Linz's industrial transformation and a 1–2 day city plan.",
  ],
  "AT:Zell am See": [
    "Zell am See Travel Guide: Lake, Schmittenhöhe & Kaprun",
    "Swimming in the Zeller See, the Schmittenhöhe cable car, the Kitzsteinhorn glacier and Kaprun, four-season activities and where to stay in Zell am See.",
  ],

  /* ----------------------------- Portekiz ----------------------------- */
  "PT:Lizbon": [
    "Lisbon Travel Guide: Trams, Miradouros & Neighbourhoods",
    "Alfama and São Jorge Castle, Belém, Baixa, Chiado and the miradouros, riding the trams, fado, where to stay and a 3-day Lisbon itinerary with Sintra tips.",
  ],
  "PT:Porto": [
    "Porto Travel Guide: Ribeira, Port Cellars & Azulejos",
    "Ribeira and the Dom Luís I Bridge, São Bento's azulejos, the Sé and Clérigos, port wine cellars in Vila Nova de Gaia, Douro trips and a 3-day Porto plan.",
  ],
  "PT:Sintra": [
    "Sintra Travel Guide: Pena Palace, Regaleira & Tickets",
    "Pena Palace, the Moorish Castle and Quinta da Regaleira in the right order, timed tickets, getting there from Lisbon, the Atlantic coast and 1–2 day plans.",
  ],
  "PT:Algarve": [
    "Algarve Travel Guide: Best Beaches, Towns & Where to Stay",
    "Lagos and Ponta da Piedade, Faro and the Ria Formosa, Tavira and the eastern coast, cliff beaches, getting around without a car and where to stay.",
  ],
  "PT:Madeira": [
    "Madeira Travel Guide: Levada Walks, Funchal & Peaks",
    "Funchal, Pico do Arieiro and the mountain routes, the best levada walks, the north coast, getting around the island, weather by season and where to stay.",
  ],
  "PT:Azor Adaları": [
    "Azores Travel Guide: Sete Cidades, Furnas & Island Hopping",
    "Sete Cidades crater lakes, Furnas and its hot springs, the Pico–Faial triangle, whale watching, inter-island flights and ferries and how many days you need.",
  ],
  "PT:Coimbra": [
    "Coimbra Travel Guide: University, Library & Fado",
    "The University of Coimbra and its library, the Sé Velha and the Alta, Santa Clara across the Mondego, Coimbra fado and a 1–2 day plan from Lisbon or Porto.",
  ],
  "PT:Évora": [
    "Évora Travel Guide: Roman Temple, Bones Chapel & Food",
    "The Roman Temple and the Sé, the Capela dos Ossos, the Almendres Cromlech, Alentejo food, day trip or overnight, and a 2–3 day Évora plan.",
  ],

  /* ----------------------------- Almanya ----------------------------- */
  "DE:Berlin": [
    "Berlin Travel Guide: Things to Do, History & Neighbourhoods",
    "The Reichstag and government quarter, Museum Island and the Humboldt Forum, Berlin Wall memorials, neighbourhood culture, where to stay and a 3-day plan.",
  ],
  "DE:Münih": [
    "Munich Travel Guide: Old Town, Museums & Beer Gardens",
    "Marienplatz and the Residenz, the Kunstareal museums, Nymphenburg Palace and park, beer gardens and markets, where to stay and a 3-day Munich itinerary.",
  ],
  "DE:Hamburg": [
    "Hamburg Travel Guide: Speicherstadt, Elbphilharmonie & Port",
    "The Speicherstadt and Kontorhaus district, Elbphilharmonie's plaza, the harbour and Landungsbrücken, ferry rides, neighbourhoods and a 3-day Hamburg plan.",
  ],
  "DE:Köln": [
    "Cologne Travel Guide: Cathedral, Museums & the Rhine",
    "Cologne Cathedral and its tower climb, Museum Ludwig and Roman heritage, the Rhine and Rheinauhafen, Kölsch beer halls, where to stay and a 3-day plan.",
  ],
  "DE:Frankfurt": [
    "Frankfurt Travel Guide: Museumsufer, Old Town & Skyline",
    "The Museumsufer embankment, Römerberg and the rebuilt Neue Altstadt, the Main Tower and Westend, apple-wine taverns and a 3-day plan beyond the airport.",
  ],
  "DE:Dresden": [
    "Dresden Travel Guide: Zwinger, Frauenkirche & the Elbe",
    "The Zwinger and the Old Masters, the Frauenkirche and Neumarkt, the Elbe and the Neustadt, Saxon art treasures, where to stay and a 3-day Dresden plan.",
  ],
  "DE:Nürnberg": [
    "Nuremberg Travel Guide: Castle, Old Town & History",
    "The Kaiserburg and the medieval old town, the Documentation Centre and Nazi-era sites, the Germanisches Nationalmuseum, Christmas market tips and 3 days.",
  ],
  "DE:Kara Orman": [
    "Black Forest Travel Guide: Freiburg, Titisee & Hikes",
    "Freiburg and Schauinsland, Titisee and Feldberg, Triberg and the cuckoo-clock route, forest hikes, spa towns, getting around by train and where to stay.",
  ],

  /* ----------------------------- Meksika ----------------------------- */
  "MX:Mexico City": [
    "Mexico City Travel Guide: Museums, Neighbourhoods & Food",
    "The Centro Histórico and Templo Mayor, Chapultepec and the Anthropology Museum, Coyoacán and UNAM, which neighbourhood to stay in, food and altitude tips.",
  ],
  "MX:Oaxaca": [
    "Oaxaca Travel Guide: Monte Albán, Markets & Mole",
    "Santo Domingo, Monte Albán, the Tlacolula and Teotitlán craft route, Oaxacan markets and mole, mezcal, where to stay and a 3-day Oaxaca itinerary.",
  ],
  "MX:Cancún": [
    "Cancún Travel Guide: Beaches, Isla Mujeres & Day Trips",
    "Hotel Zone beaches, the ferry to Isla Mujeres, MUSA and the reef, downtown vs Hotel Zone stays, sargassum season and Maya-site day trips from Cancún.",
  ],
  "MX:Tulum": [
    "Tulum Travel Guide: Ruins, Cenotes & Sian Ka'an",
    "Tulum's seaside Maya ruins, the best cenotes, the Sian Ka'an biosphere reserve, beach vs town stays, getting around and a realistic 3-day Tulum plan.",
  ],
  "MX:Mérida": [
    "Mérida Travel Guide: Old Town, Uxmal & Yucatán Food",
    "Plaza Grande and its museums, Paseo de Montejo, a day at Uxmal, cenotes and haciendas, Yucatecan food, coping with the heat and a 3-day Mérida itinerary.",
  ],
  "MX:Guadalajara": [
    "Guadalajara Travel Guide: Cabañas, Tlaquepaque & Food",
    "Hospicio Cabañas and its murals, the Centro Histórico, Tlaquepaque's crafts, Jalisco food, mariachi and tequila beyond the clichés, and a 3-day plan.",
  ],
  "MX:San Miguel de Allende": [
    "San Miguel de Allende Travel Guide: Old Town & Art",
    "The Parroquia and the Jardín, Instituto Allende and the galleries, El Charco del Ingenio botanical garden, courtyard hotels and a 3-day San Miguel plan.",
  ],
  "MX:Chiapas": [
    "Chiapas Travel Guide: San Cristóbal, Palenque & Sumidero",
    "San Cristóbal de las Casas, the Sumidero Canyon, Palenque's ruins in the rainforest, visiting Maya communities respectfully and long road travel times.",
  ],

  /* ----------------------------- Brezilya ----------------------------- */
  "BR:Rio de Janeiro": [
    "Rio de Janeiro Travel Guide: Beaches, Views & Where to Stay",
    "Christ the Redeemer on Corcovado, Sugarloaf Mountain, Copacabana and Ipanema, Centro and Santa Teresa, staying safe, where to stay and a 3-day Rio plan.",
  ],
  "BR:São Paulo": [
    "São Paulo Travel Guide: Museums, Food & Neighbourhoods",
    "Avenida Paulista and MASP, the Centro Histórico, Ibirapuera Park, immigrant food from Liberdade to Bixiga, getting around and where to stay in São Paulo.",
  ],
  "BR:Salvador": [
    "Salvador Travel Guide: Pelourinho, Beaches & Bahian Food",
    "Pelourinho's historic centre, Barra and its lighthouse, Bonfim and Ribeira, Afro-Brazilian music and faith, Bahian food, staying safe and a 3-day plan.",
  ],
  "BR:Foz do Iguaçu": [
    "Foz do Iguaçu Travel Guide: Iguaçu Falls, Both Sides",
    "Iguaçu National Park on the Brazilian side, crossing to the Argentine falls, Parque das Aves, the triple border, where to stay and a 3-day Foz do Iguaçu plan.",
  ],
  "BR:Florianópolis": [
    "Florianópolis Travel Guide: Beaches, Lagoa & Where to Stay",
    "Lagoa da Conceição, Ilha do Campeche, Ribeirão da Ilha's Azorean heritage and oysters, choosing a beach base, hiking trails and getting around the island.",
  ],
  "BR:Recife ve Olinda": [
    "Recife & Olinda Travel Guide: Old Towns, Frevo & Coast",
    "Recife Antigo, colonial Olinda on its hill, the Instituto Ricardo Brennand, frevo and carnival culture, the Pernambuco coast, staying safe and a 3-day plan.",
  ],
  "BR:Manaus ve Amazon": [
    "Manaus & Amazon Travel Guide: Lodges, Rivers & Teatro",
    "Teatro Amazonas, the Meeting of the Waters, choosing a responsible rainforest lodge, river trips, visiting local communities and when to go to the Amazon.",
  ],
  "BR:Lençóis Maranhenses": [
    "Lençóis Maranhenses Travel Guide: Dunes & Lagoon Season",
    "When the rain lagoons fill, Barreirinhas lagoon circuits, quieter Atins and Santo Amaro, 4x4 tours, getting there from São Luís and where to stay.",
  ],

  /* ----------------------------- Arjantin ----------------------------- */
  "AR:Buenos Aires": [
    "Buenos Aires Travel Guide: Neighbourhoods, Tango & Food",
    "Plaza de Mayo and the Microcentro, Recoleta and MALBA, San Telmo and La Boca, tango, parrillas, paying in pesos, where to stay and a 3-day Buenos Aires plan.",
  ],
  "AR:Mendoza": [
    "Mendoza Travel Guide: Wineries, the Andes & City Parks",
    "Wine tasting in Maipú and Luján de Cuyo, Parque General San Martín, the Alta Montaña route towards Aconcagua, where to stay and a 3-day Mendoza plan.",
  ],
  "AR:Bariloche": [
    "Bariloche Travel Guide: Circuito Chico, Lakes & Hikes",
    "Circuito Chico viewpoints, Cerro Campanario and Catedral, Nahuel Huapi boat trips, hiking, chocolate shops, where to stay and a 3-day Bariloche plan.",
  ],
  "AR:El Calafate": [
    "El Calafate Travel Guide: Perito Moreno Glacier & Boats",
    "The Perito Moreno Glacier walkways, glacier boat trips, Laguna Nimez, getting from the airport, Patagonian weather, where to stay and a 3-day El Calafate plan.",
  ],
  "AR:Ushuaia": [
    "Ushuaia Travel Guide: Beagle Channel & Tierra del Fuego",
    "Beagle Channel boat trips, Tierra del Fuego National Park, the Martial Glacier hike, the end-of-the-world town, where to stay and a 3-day Ushuaia itinerary.",
  ],
  "AR:Salta ve Jujuy": [
    "Salta & Jujuy Travel Guide: Quebrada & Salt Flats",
    "Salta's historic centre, the Quebrada de Humahuaca, Salinas Grandes and the Hornocal, driving the Andean north-west, altitude and how many days you need.",
  ],
  "AR:Puerto Iguazú": [
    "Puerto Iguazú Travel Guide: Iguazú Falls Argentine Side",
    "The Argentine circuits of Iguazú National Park, crossing to the Brazilian side, Güirá Oga, where to stay and a 3-day Iguazú plan.",
  ],
  "AR:El Chaltén": [
    "El Chaltén Travel Guide: Fitz Roy Hikes & Laguna Torre",
    "Hiking to Laguna de los Tres under Fitz Roy, Laguna Torre and Loma del Pliegue Tumbado, Patagonian weather, getting there from El Calafate and where to stay.",
  ],

  /* ------------------------------ Kanada ------------------------------ */
  "CA:Toronto": [
    "Toronto Travel Guide: Neighbourhoods, Islands & Museums",
    "Harbourfront and the Toronto Islands, the ROM and the AGO, Kensington Market, Chinatown and Queen West, the TTC, where to stay and a 3-day Toronto plan.",
  ],
  "CA:Vancouver": [
    "Vancouver Travel Guide: Stanley Park, Granville & Mountains",
    "Stanley Park and the seawall, Granville Island, the North Shore mountains, neighbourhoods to stay in, getting around on SkyTrain and a 3-day Vancouver plan.",
  ],
  "CA:Montreal": [
    "Montreal Travel Guide: Old Montreal, Mont-Royal & Food",
    "Vieux-Montréal, Mont-Royal, Jean-Talon Market and Mile End, festivals, bagels and French-Canadian food, the metro, where to stay and a 3-day Montreal plan.",
  ],
  "CA:Québec City": [
    "Quebec City Travel Guide: Old Town, Walls & Winter",
    "The Upper Town and city walls, Petit-Champlain, the Musée de la civilisation, winter carnival season, French heritage, where to stay and a 3-day plan.",
  ],
  "CA:Banff": [
    "Banff Travel Guide: Lake Louise, Moraine Lake & Hikes",
    "Lake Louise and Moraine Lake shuttle access, the Banff Gondola and the Bow Valley, hikes, wildlife safety, park passes, where to stay and a 3-day Banff plan.",
  ],
  "CA:Jasper": [
    "Jasper Travel Guide: Maligne Lake, Icefield & Dark Skies",
    "Maligne Lake, Athabasca Falls, the Columbia Icefield on the Icefields Parkway, dark-sky stargazing, wildlife safety, where to stay and a 3-day Jasper plan.",
  ],
  "CA:Niagara Şelaleleri": [
    "Niagara Falls Travel Guide: Horseshoe Falls & Parkway",
    "Table Rock and the Horseshoe Falls, the Niagara Parks Power Station, the Niagara Parkway and Niagara-on-the-Lake wineries, where to stay and a 3-day plan.",
  ],
  "CA:Yukon": [
    "Yukon Travel Guide: Whitehorse, Kluane & Dawson City",
    "Whitehorse and the Yukon River, Kluane National Park, Klondike history in Dawson City, northern lights season, long travel distances and wilderness safety.",
  ],

  /* ----------------------------- İsviçre ----------------------------- */
  "CH:Zürih": [
    "Zurich Travel Guide: Old Town, Lake & Uetliberg",
    "The Altstadt and Grossmünster, the Kunsthaus, Lake Zurich boats and swimming, the Uetliberg viewpoint, Swiss travel passes, where to stay and a 3-day plan.",
  ],
  "CH:Luzern": [
    "Lucerne Travel Guide: Chapel Bridge, Lake & Pilatus",
    "The Kapellbrücke and the Old Town, the Swiss Museum of Transport, lake boats, Mount Pilatus or Rigi, Swiss travel passes, where to stay and a 3-day plan.",
  ],
  "CH:Bern": [
    "Bern Travel Guide: Old Town, Zytglogge & the Aare",
    "Bern's UNESCO Old Town and the Zytglogge, the Bundeshaus, the Rosengarten, swimming in the Aare, arcades and markets, and a 2–3 day Swiss capital plan.",
  ],
  "CH:Cenevre": [
    "Geneva Travel Guide: Lake, Old Town, UN & CERN",
    "The Jet d'Eau and lakeshore, the Old Town and Saint-Pierre Cathedral, the Palais des Nations and CERN, public transport, where to stay and a 3-day plan.",
  ],
  "CH:Lozan": [
    "Lausanne Travel Guide: Old Town, Olympic Museum & Lavaux",
    "Lausanne Cathedral and the Cité, the Olympic Museum and Ouchy, the Collection de l'Art Brut, Lavaux vineyard walks, where to stay and a 3-day plan.",
  ],
  "CH:Interlaken": [
    "Interlaken Travel Guide: Jungfrau, Lauterbrunnen & Lakes",
    "Harder Kulm, the Lauterbrunnen Valley, Jungfraujoch or Grindelwald-First, lake cruises, mountain weather and passes, where to stay and a 3-day Interlaken plan.",
  ],
  "CH:Zermatt": [
    "Zermatt Travel Guide: Matterhorn Views, Gornergrat & Hikes",
    "The Gornergrat railway, Matterhorn Glacier Paradise, the Five Lakes walk, the car-free village, mountain weather, where to stay and a 3-day Zermatt plan.",
  ],
  "CH:St. Moritz": [
    "St. Moritz Travel Guide: Engadine Lakes & Bernina Line",
    "Lake St. Moritz and the centre, Muottas Muragl or Corviglia, the Bernina line towards Italy, winter sports and summer hikes in the Engadine, and where to stay.",
  ],

  /* ----------------------------- Belçika ----------------------------- */
  "BE:Brüksel": [
    "Brussels Travel Guide: Grand-Place, Museums & Atomium",
    "The Grand-Place and historic centre, the Magritte Museum and Mont des Arts, the European Quarter and Atomium, Art Nouveau, food and a 3-day Brussels plan.",
  ],
  "BE:Brugge": [
    "Bruges Travel Guide: Canals, Belfry & Flemish Masters",
    "The Markt and the Belfry, the Groeningemuseum and Sint-Janshospitaal, the canals and the Begijnhof, beating day-trip crowds, where to stay and 2–3 days.",
  ],
  "BE:Gent": [
    "Ghent Travel Guide: Gravensteen, Mystic Lamb & Canals",
    "The Gravensteen, St Bavo's Cathedral and the Ghent Altarpiece, Graslei and Korenlei, the three towers, student nightlife, where to stay and a 3-day plan.",
  ],
  "BE:Anvers": [
    "Antwerp Travel Guide: Rubens, Fashion & the Port",
    "Antwerpen-Centraal and the Meir, the Cathedral of Our Lady and Rubens, the MAS and Eilandje, fashion and diamond districts, where to stay and a 3-day plan.",
  ],
  "BE:Leuven": [
    "Leuven Travel Guide: Town Hall, University & Beer",
    "The Grote Markt and Gothic Stadhuis, the University Library tower, M Leuven and the Groot Begijnhof, Belgian beer culture and a 1–2 day Leuven plan.",
  ],
  "BE:Liège": [
    "Liège Travel Guide: Guillemins, Bueren Stairs & Meuse",
    "Liège-Guillemins station, climbing the Montagne de Bueren, La Boverie and the Meuse riverside, Liège waffles, where to stay and a 2–3 day plan.",
  ],
  "BE:Dinant": [
    "Dinant Travel Guide: Citadel, Meuse Valley & Sax",
    "Dinant Citadel, Notre-Dame de Dinant and the Charles de Gaulle Bridge, Maison Leffe or the saxophone house, the Meuse valley and a 1–2 day Dinant plan.",
  ],
  "BE:Ardenler": [
    "Ardennes Travel Guide: Durbuy, Bouillon & Hiking",
    "Durbuy and the Ourthe Valley, Bouillon Castle, the Hautes Fagnes moors, forest hikes, getting around without a car and where to stay.",
  ],

  /* ----------------------------- Macaristan ----------------------------- */
  "HU:Budapeşte": [
    "Budapest Travel Guide: Thermal Baths, Castle & Danube",
    "Parliament and the Danube embankment, Buda Castle and Fisherman's Bastion, which thermal bath to choose, nightlife, where to stay and a 3-day Budapest plan.",
  ],
  "HU:Szentendre": [
    "Szentendre Travel Guide: Old Town, Art & Skanzen",
    "Fő tér and the old streets, Serbian churches, the Ferenczy and small museums, the Skanzen open-air museum, the Danube riverside and a day trip from Budapest.",
  ],
  "HU:Eger": [
    "Eger Travel Guide: Castle, Minaret & Wine Valley",
    "Eger Castle, the Ottoman minaret and Turkish Bath, the wine cellars of Szépasszony-völgy, thermal baths, where to stay and a 2–3 day plan.",
  ],
  "HU:Pécs": [
    "Pécs Travel Guide: Roman Tombs, Mosque & Zsolnay",
    "The early Christian Cella Septichora, Széchenyi tér and the Mosque of Pasha Qasim, the Zsolnay Cultural Quarter, Mediterranean-style streets and a 3-day plan.",
  ],
  "HU:Szeged": [
    "Szeged Travel Guide: Votive Church, Synagogue & Paprika",
    "Dóm tér and the Votive Church, the New Synagogue, Reök Palace's Art Nouveau, the Tisza riverside, paprika and fish soup, and a 2–3 day Szeged plan.",
  ],
  "HU:Debrecen": [
    "Debrecen Travel Guide: Reformed Church & Hortobágy",
    "The Great Reformed Church, the Déri Museum, Nagyerdő park and the Aquaticum spa, a day in Hortobágy National Park, where to stay and a 3-day Debrecen plan.",
  ],
  "HU:Balaton Gölü": [
    "Lake Balaton Travel Guide: Tihany, Badacsony & Beaches",
    "The Tihany Peninsula, Badacsony's volcanic wine hills, Keszthely and the Festetics Palace, north vs south shore, swimming, trains and where to stay.",
  ],
  "HU:Sopron": [
    "Sopron Travel Guide: Fire Tower, Old Town & Wine",
    "The Tűztorony and Fő tér, the Old Synagogue and historic courtyards, Lővérek hills and Károly lookout, local wine, the Fertő region and a 2–3 day plan.",
  ],

  /* ----------------------------- Çekya ----------------------------- */
  "CZ:Prag": [
    "Prague Travel Guide: Things to Do, Where to Stay & 3 Days",
    "Prague Castle and St Vitus, the Old Town and Jewish Quarter, Charles Bridge and Malá Strana at quiet hours, beer halls, where to stay and a 3-day itinerary.",
  ],
  "CZ:Český Krumlov": [
    "Český Krumlov Travel Guide: Castle, Old Town & Vltava",
    "Český Krumlov Castle, Latrán and the UNESCO old town, rafting on the Vltava, avoiding the tour-bus peak, overnight stays and a 2–3 day plan.",
  ],
  "CZ:Brno": [
    "Brno Travel Guide: Villa Tugendhat, Špilberk & Underground",
    "Booking Villa Tugendhat, Špilberk Castle, Zelný trh and the Brno Underground, Moravian wine bars, functionalist architecture and a 3-day Brno itinerary.",
  ],
  "CZ:Karlovy Vary": [
    "Karlovy Vary Travel Guide: Colonnades, Spas & Walks",
    "The Mill and Market Colonnades, tasting the spa springs, Diana lookout tower, the Moser Glass Museum, forest walks, where to stay and a 2–3 day plan.",
  ],
  "CZ:Kutná Hora": [
    "Kutná Hora Travel Guide: St Barbara's & Bone Church",
    "St Barbara's Cathedral, the Sedlec Ossuary, the Italian Court and silver-mining history, getting there by train from Prague and a day trip or overnight plan.",
  ],
  "CZ:Olomouc": [
    "Olomouc Travel Guide: Holy Trinity Column & Old Town",
    "The UNESCO Holy Trinity Column, the astronomical clock and town hall, the Archdiocesan Museum, Moravian food and cheese, student life and a 2–3 day plan.",
  ],
  "CZ:Plzeň": [
    "Plzeň Travel Guide: Pilsner Urquell Brewery & Old Town",
    "The Pilsner Urquell Brewery tour, the Great Synagogue, the historical underground, the main square, Czech beer culture and a 2–3 day Plzeň itinerary.",
  ],
  "CZ:Bohemya İsviçresi": [
    "Bohemian Switzerland Travel Guide: Arch, Gorges & Hikes",
    "Hiking to Pravčická brána, boat rides through Edmund's Gorge, Jetřichovice viewpoints, park rules, getting there from Prague and where to stay.",
  ],

  /* ----------------------------- Polonya ----------------------------- */
  "PL:Varşova": [
    "Warsaw Travel Guide: Old Town, Museums & Neighbourhoods",
    "The rebuilt Old Town and the Royal Route, POLIN and the Warsaw Rising Museum, Łazienki and Wilanów palaces, Praga, where to stay and a 3-day Warsaw plan.",
  ],
  "PL:Kraków": [
    "Kraków Travel Guide: Wawel, Kazimierz & Auschwitz Visits",
    "Wawel Castle and Cathedral, the Rynek and its underground museum, Kazimierz and Podgórze, visiting Auschwitz-Birkenau respectfully, and a 3-day plan.",
  ],
  "PL:Gdańsk": [
    "Gdańsk Travel Guide: Old Town, Solidarity & WWII Museum",
    "Długi Targ and the Motława waterfront, the European Solidarity Centre, the Museum of the Second World War, Sopot and the Baltic coast, and a 3-day plan.",
  ],
  "PL:Wrocław": [
    "Wrocław Travel Guide: Market Square, Islands & Dwarfs",
    "The Rynek and Gothic town hall, Ostrów Tumski at lamp-lighting time, the Centennial Hall, bridges and islands, hunting the dwarfs, and a 3-day Wrocław plan.",
  ],
  "PL:Poznań": [
    "Poznań Travel Guide: Old Market Square & Enigma",
    "Stary Rynek and the town-hall goats at noon, Ostrów Tumski and Brama Poznania, the Enigma Cipher Centre, rogal pastries and a 2–3 day Poznań itinerary.",
  ],
  "PL:Zakopane": [
    "Zakopane Travel Guide: Morskie Oko, Tatra Hikes & Culture",
    "Hiking to Morskie Oko, the Kasprowy Wierch cable car, the Zakopane Style wooden houses, mountain safety, local food, where to stay and a 3-day plan.",
  ],
  "PL:Toruń": [
    "Toruń Travel Guide: Gothic Old Town & Gingerbread",
    "Toruń's UNESCO Gothic old town, Copernicus House and the Planetarium, the Gingerbread Museum, the Vistula waterfront at night and a 2–3 day plan.",
  ],
  "PL:Lublin": [
    "Lublin Travel Guide: Castle, Old Town & Majdanek",
    "Lublin Castle and the Chapel of the Holy Trinity, Brama Grodzka and the old town, Jewish heritage, visiting the Majdanek memorial and a 3-day Lublin plan.",
  ],

  /* ------------------------------ Rusya ------------------------------ */
  "RU:Moskova": [
    "Moscow Travel Guide: Kremlin, Museums & Metro",
    "The Kremlin and Red Square, the Tretyakov Galleries, VDNKh and the Museum of Cosmonautics, metro stations, payments and visas, and a 3-day Moscow plan.",
  ],
  "RU:St. Petersburg": [
    "St Petersburg Travel Guide: Hermitage, Peterhof & Canals",
    "The Hermitage and Winter Palace, Peterhof's fountains, St Isaac's and the Church on Spilled Blood, canal boats, white nights and a 3-day St Petersburg plan.",
  ],
  "RU:Kazan": [
    "Kazan Travel Guide: Kremlin, Tatar Culture & Volga",
    "The Kazan Kremlin and Qolşärif Mosque, Staro-Tatarskaya Sloboda, the Kremlin embankment, Tatar food like chak-chak, where to stay and a 3-day Kazan plan.",
  ],
  "RU:Soçi": [
    "Sochi Travel Guide: Seafront, Krasnaya Polyana & Parks",
    "The Arboretum and central seafront, Krasnaya Polyana's mountains, Olympic Park and Sirius, Black Sea beaches, getting around and a 3-day Sochi plan.",
  ],
  "RU:Kaliningrad": [
    "Kaliningrad Travel Guide: Kant Island, Amber & Curonian Spit",
    "Königsberg Cathedral and Kant Island, the Amber Museum, the Curonian Spit's dunes and forests, Baltic coast towns, entry rules and a 3-day Kaliningrad plan.",
  ],
  "RU:Murmansk": [
    "Murmansk Travel Guide: Northern Lights & Arctic Coast",
    "The Alyosha Monument, the nuclear icebreaker Lenin, northern lights and tundra trips, Teriberka on the Kola coast, polar night, dressing for cold and 3 days.",
  ],
  "RU:Baykal Gölü": [
    "Lake Baikal Travel Guide: Irkutsk, Olkhon & Railway",
    "Irkutsk and Listvyanka, Olkhon Island, the Circum-Baikal Railway, the ice season, long-distance logistics and how many days Lake Baikal needs.",
  ],
  "RU:Vladivostok": [
    "Vladivostok Travel Guide: Golden Bridge, Russky & Seafood",
    "The Golden Bridge and the central hills, Russky Island, the Vladivostok Fortress Museum, Pacific seafood, where to stay and a 3-day plan.",
  ],

  /* ----------------------------- Sırbistan ----------------------------- */
  "RS:Belgrad": [
    "Belgrade Travel Guide: Kalemegdan, Neighbourhoods & Nights",
    "Kalemegdan and Belgrade Fortress, the Church of Saint Sava and Vračar, the Museum of Yugoslavia and New Belgrade, river clubs, kafanas and a 3-day plan.",
  ],
  "RS:Novi Sad": [
    "Novi Sad Travel Guide: Petrovaradin, Old Town & Danube",
    "Petrovaradin Fortress, Trg Slobode and Zmaj Jovina, the Danube riverside and Štrand beach, Fruška Gora monasteries and wine, and a 2–3 day Novi Sad plan.",
  ],
  "RS:Niş": [
    "Niš Travel Guide: Fortress, Skull Tower & Mediana",
    "Niš Fortress, the Roman site of Mediana, the Skull Tower and Red Cross Camp memorials, south Serbian grilled food, where to stay and a 2–3 day Niš plan.",
  ],
  "RS:Subotica": [
    "Subotica Travel Guide: Art Nouveau & Lake Palić",
    "The Art Nouveau City Hall, the restored Subotica Synagogue, Lake Palić, Hungarian–Serbian Vojvodina culture, local food and a 2–3 day Subotica plan.",
  ],
  "RS:Zlatibor": [
    "Zlatibor Travel Guide: Gold Gondola, Caves & Villages",
    "The Gold Gondola to Tornik, Stopića Cave, the Sirogojno open-air museum, upland hiking trails, the Šargan Eight railway nearby and where to stay.",
  ],
  "RS:Tara Milli Parkı": [
    "Tara National Park Travel Guide: Viewpoints & Drina",
    "Banjska Stena viewpoint over the Drina, Lake Zaovine, Perućac and the river, forest trails, wildlife, getting there without a car and where to stay in Tara.",
  ],
  "RS:Kopaonik": [
    "Kopaonik Travel Guide: Skiing, Summer Trails & Peaks",
    "Kopaonik's ski area, Pančićev vrh, the Nebeske Stolice plateau, national park hikes, ski passes and rentals, summer vs winter and where to stay.",
  ],
  "RS:Demir Kapı": [
    "Iron Gates Travel Guide: Golubac, Lepenski Vir & Đerdap",
    "Golubac Fortress, the prehistoric site of Lepenski Vir, the Đerdap gorges on the Danube, Roman heritage, boat trips and getting along the route.",
  ],

  /* ----------------------------- Karadağ ----------------------------- */
  "ME:Kotor": [
    "Kotor Travel Guide: Old Town, Fortress Walk & the Bay",
    "Kotor Old Town, the San Giovanni fortress walls hike, Perast and the Bay of Kotor by boat, cruise-ship crowd timing, where to stay and a 3-day Kotor plan.",
  ],
  "ME:Budva": [
    "Budva Travel Guide: Old Town, Beaches & Sveti Stefan",
    "Budva's Stari Grad, Mogren beach and the coastal path, Sveti Stefan viewpoints, beach clubs and nightlife, quieter bays nearby and where to stay in Budva.",
  ],
  "ME:Podgorica": [
    "Podgorica Travel Guide: Capital Sights & Day Trips",
    "Stara Varoš and the Ribnica, the Millennium Bridge, the Contemporary Art Centre, Lake Skadar and Ostrog Monastery day trips, and a 2–3 day Podgorica plan.",
  ],
  "ME:Cetinje": [
    "Cetinje Travel Guide: Royal Capital, Museums & Lovćen",
    "The King Nikola Museum, Cetinje Monastery, the old embassies of the royal capital, Lovćen and the Njegoš Mausoleum, and a day trip or 2–3 day Cetinje plan.",
  ],
  "ME:Perast": [
    "Perast Travel Guide: Our Lady of the Rocks & Bay Views",
    "A boat to Our Lady of the Rocks, St Nicholas Bell Tower, the Perast Museum, Baroque palaces along the Bay of Kotor, avoiding crowds and staying overnight.",
  ],
  "ME:Herceg Novi": [
    "Herceg Novi Travel Guide: Fortresses, Old Town & Bay",
    "Forte Mare and Kanli Kula, the stepped Stari Grad and Clock Tower, Savina Monastery, the seafront promenade, beaches, boat trips and where to stay.",
  ],
  "ME:Durmitor": [
    "Durmitor Travel Guide: Black Lake, Bobotov Kuk & Tara",
    "Crno Jezero near Žabljak, climbing Bobotov Kuk safely, rafting the Tara Canyon, the Đurđevića Tara Bridge, mountain weather and where to stay in Durmitor.",
  ],
  "ME:Ulcinj": [
    "Ulcinj Travel Guide: Old Town, Velika Plaža & Salina",
    "Ulcinj Old Town above the sea, the long sands of Velika Plaža, birdwatching at Ulcinj Salina, Ada Bojana, Albanian-Montenegrin food and where to stay.",
  ],

  /* -------------------------- Bosna-Hersek -------------------------- */
  "BA:Saraybosna": [
    "Sarajevo Travel Guide: Baščaršija, History & Trebević",
    "Baščaršija's old bazaar, the Latin Bridge and the museums, the Tunnel Museum, Trebević and the cable car, ćevapi and coffee culture, and a 3-day Sarajevo plan.",
  ],
  "BA:Mostar": [
    "Mostar Travel Guide: Stari Most, Old Town & Day Trips",
    "Stari Most and the old town, the Koski Mehmed Pasha Mosque view, Mostar's layered history, divers on the bridge, a Blagaj day trip and a 3-day Mostar plan.",
  ],
  "BA:Blagaj": [
    "Blagaj Travel Guide: Dervish Tekke & Buna Spring",
    "The Blagaj Tekke at the Vrelo Bune spring, the Stjepan Grad fortress hike, riverside trout restaurants, visiting from Mostar and a 1–2 day Blagaj plan.",
  ],
  "BA:Travnik": [
    "Travnik Travel Guide: Fortress, Coloured Mosque & Andrić",
    "Travnik Fortress, the Šarena Džamija, the Ivo Andrić birth house, the viziers' town history, Lašva spring cafés, Travnik cheese and a 2–3 day plan.",
  ],
  "BA:Jajce": [
    "Jajce Travel Guide: Waterfall, Fortress & AVNOJ",
    "The Jajce Waterfall in the town centre, the fortress and catacombs, the AVNOJ Museum, the Pliva watermills and lakes, and a 2–3 day Jajce itinerary.",
  ],
  "BA:Banja Luka": [
    "Banja Luka Travel Guide: Kastel, Ferhadija & Vrbas",
    "Kastel Fortress, the Cathedral of Christ the Saviour and the rebuilt Ferhadija Mosque, the Vrbas riverside, rafting and Krajina nature, and a 3-day plan.",
  ],
  "BA:Trebinje": [
    "Trebinje Travel Guide: Old Town, Monasteries & Wine",
    "Trebinje's old town and Platani square, Hercegovačka Gračanica, Tvrdoš Monastery and its wine cellar, local food and a 2–3 day Trebinje plan.",
  ],
  "BA:Una Milli Parkı": [
    "Una National Park Travel Guide: Waterfalls & Rafting",
    "Štrbački Buk waterfall, Martin Brod's cascades, rafting the Una river, Bihać as a base, park tickets, getting around and where to stay near the park.",
  ],

  /* ---------------------------- Arnavutluk ---------------------------- */
  "AL:Tiran": [
    "Tirana Travel Guide: Skanderbeg Square, Bunk'Art & Dajti",
    "Skanderbeg Square, Bunk'Art and the House of Leaves, the Pyramid of Tirana, the Dajti cable car, Blloku cafés, where to stay and a 3-day Tirana plan.",
  ],
  "AL:Berat": [
    "Berat Travel Guide: Castle, Onufri Museum & Old Quarters",
    "Berat Castle and its living quarter, the Onufri Museum, Mangalem and Gorica's Ottoman houses, the Osum Valley, staying in a guesthouse and 2–3 days.",
  ],
  "AL:Gjirokastër": [
    "Gjirokastër Travel Guide: Castle, Stone Houses & Tunnel",
    "Gjirokastër Castle, the historic Skenduli and Zekate houses, the Cold War Tunnel, the old bazaar, the Blue Eye nearby and a 2–3 day Gjirokastër plan.",
  ],
  "AL:Shkodër": [
    "Shkodër Travel Guide: Rozafa Castle, Lake & Alps Gateway",
    "Rozafa Castle, the Marubi Museum of Photography, Lake Shkodër, cycling the city, getting to Theth and the Koman ferry, and a 3-day Shkodër plan.",
  ],
  "AL:Krujë": [
    "Krujë Travel Guide: Castle, Skanderbeg & Old Bazaar",
    "Krujë Castle and the Skanderbeg Museum, the Ethnographic Museum, the Old Bazaar's crafts, a day trip from Tirana or the airport, and a 1–2 day Krujë plan.",
  ],
  "AL:Theth": [
    "Theth Travel Guide: Albanian Alps, Blue Eye & Valbona Hike",
    "Theth Church and the kulla tower, Grunas Waterfall and canyon, the Blue Eye, the Valbona pass hike, road access, guesthouses and mountain safety.",
  ],
  "AL:Sarandë": [
    "Sarandë Travel Guide: Butrint, Ksamil & the Ionian Coast",
    "Butrint National Park, the Sarandë seafront and Lëkurësi Castle, Ksamil's beaches, the Blue Eye, the ferry to Corfu and where to stay in Sarandë.",
  ],
  "AL:Himarë": [
    "Himarë Travel Guide: Old Town, Porto Palermo & Gjipe",
    "Old Himarë above the coast, Porto Palermo castle, the hike down to Gjipe Canyon beach, Ionian coves, driving the Llogara road and where to stay.",
  ],

  /* ---------------------------- Yunanistan ---------------------------- */
  "GR:Atina": [
    "Athens Travel Guide: Acropolis, Neighbourhoods & 3 Days",
    "Acropolis tickets and timing, the Acropolis Museum, the Ancient and Roman Agora, the National Archaeological Museum, Plaka and Koukaki, and a 3-day plan.",
  ],
  "GR:Selanik": [
    "Thessaloniki Travel Guide: White Tower, Ano Poli & Food",
    "The White Tower and seafront, the Rotunda and Byzantine churches, Ano Poli's walls and views, Ottoman heritage, northern Greek food and a 3-day plan.",
  ],
  "GR:Santorini": [
    "Santorini Travel Guide: Oia, Fira, Caldera & Where to Stay",
    "Walking from Fira to Oia, Akrotiri, a caldera boat trip, sunset crowds, beaches and wine, where to stay beyond the caldera and a 3-day Santorini plan.",
  ],
  "GR:Mikonos": [
    "Mykonos Travel Guide: Chora, Windmills, Delos & Beaches",
    "Chora's lanes and the windmills, Little Venice, a boat to ancient Delos, quieter Ano Mera, choosing a beach, nightlife and where to stay on Mykonos.",
  ],
  "GR:Girit": [
    "Crete Travel Guide: Knossos, Chania & Samaria Gorge",
    "Knossos and the Heraklion Museum, Chania's old harbour, hiking the Samaria Gorge, mountain villages, east vs west Crete, car hire and how many days you need.",
  ],
  "GR:Rodos": [
    "Rhodes Travel Guide: Old Town, Lindos & Beaches",
    "The medieval Old Town and the Palace of the Grand Master, Lindos acropolis, ancient Kamiros, beaches on both coasts, car hire and where to stay in Rhodes.",
  ],
  "GR:Korfu": [
    "Corfu Travel Guide: Old Town, Paleokastritsa & Beaches",
    "Corfu Old Town's Venetian lanes, Paleokastritsa's coves, the Achilleion Palace, mountain villages, beaches by coast, car hire and where to stay on Corfu.",
  ],
  "GR:Meteora": [
    "Meteora Travel Guide: Monasteries, Hikes & Kalambaka",
    "Great Meteoron and Varlaam, Roussanou and Agios Stefanos, monastery opening days and dress codes, Kastraki hiking trails, sunset views and where to stay.",
  ],

  /* ---------------------------- Hırvatistan ---------------------------- */
  "HR:Zagreb": [
    "Zagreb Travel Guide: Upper Town, Museums & Markets",
    "Gornji Grad and St Mark's Church, the Lower Town museums, Dolac market and Mirogoj cemetery, café culture, where to stay and a 3-day Zagreb itinerary.",
  ],
  "HR:Dubrovnik": [
    "Dubrovnik Travel Guide: City Walls, Old Town & Mount Srđ",
    "Walking the city walls early, the Stradun and Ragusa's institutions, the cable car up Mount Srđ, cruise-crowd timing, beaches, where to stay and 3 days.",
  ],
  "HR:Split": [
    "Split Travel Guide: Diocletian's Palace, Marjan & Islands",
    "Diocletian's Palace, Marjan Hill, the archaeology museum and Meštrović Gallery, ferries to Hvar and Brač, where to stay and a 3-day Split itinerary.",
  ],
  "HR:Zadar": [
    "Zadar Travel Guide: Sea Organ, Roman Forum & Sunsets",
    "The Roman Forum and St Donatus, the Sea Organ and Greeting to the Sun at sunset, the city walls and market, island and national park trips, and 3 days.",
  ],
  "HR:Hvar": [
    "Hvar Travel Guide: Hvar Town, Stari Grad & Pakleni Islands",
    "Hvar Fortress and town, the UNESCO Stari Grad Plain, lavender villages, the Pakleni Islands by boat, ferries from Split, nightlife and where to stay.",
  ],
  "HR:Istria": [
    "Istria Travel Guide: Rovinj, Pula & Hilltop Towns",
    "Rovinj's old town, the Pula Arena, Motovun and Grožnjan, truffles and olive oil, coastal swimming spots, car hire and how to plan an Istria road trip.",
  ],
  "HR:Plitvice Gölleri": [
    "Plitvice Lakes Travel Guide: Tickets, Routes & Best Time",
    "Booking Plitvice tickets, Lower and Upper Lakes walking routes, the best viewpoints, entrances 1 and 2, avoiding crowds, seasons and where to stay nearby.",
  ],
  "HR:Šibenik": [
    "Šibenik Travel Guide: Cathedral, Fortresses & Krka",
    "The Cathedral of St James, St Michael's and Barone fortresses, St Anthony's Channel, day trips to Krka National Park and the islands, and a 3-day plan.",
  ],

  /* ----------------------------- Slovenya ----------------------------- */
  "SI:Ljubljana": [
    "Ljubljana Travel Guide: Castle, Plečnik & Riverside",
    "Ljubljana Castle, the Plečnik architecture route, Tivoli Park and the museums, the riverside, the central market, day trips to Bled and a 3-day plan.",
  ],
  "SI:Bled Gölü": [
    "Lake Bled Travel Guide: Island, Castle & Viewpoints",
    "A pletna boat to Bled Island, Bled Castle, the Ojstrica and Osojnica viewpoints, the lake walk, Vintgar Gorge and where to stay at Lake Bled.",
  ],
  "SI:Bohinj": [
    "Bohinj Travel Guide: Lake Bohinj, Savica Falls & Vogel",
    "Lake Bohinj, the Savica Waterfall, the Vogel cable car, Triglav National Park hikes, swimming, getting there from Bled and where to stay.",
  ],
  "SI:Piran": [
    "Piran Travel Guide: Tartini Square, Walls & Salt Pans",
    "Tartini Square, St George's Church and the town walls, the Sečovlje Salt Pans, the short Slovenian coast, parking and a 2–3 day Piran plan.",
  ],
  "SI:Postojna ve Predjama": [
    "Postojna Cave & Predjama Castle Travel Guide: Tickets",
    "The Postojna Cave train and tour, Predjama Castle in its cliff, the Vivarium, combined tickets, getting there from Ljubljana and how long you need.",
  ],
  "SI:Soča Vadisi": [
    "Soča Valley Travel Guide: Rafting, Kozjak & WWI History",
    "Rafting the Soča, the Kobarid Museum and historical trail, Kozjak waterfall, Tolmin gorges, Bovec as a base, outdoor sports and a 3-day Soča Valley plan.",
  ],
  "SI:Maribor": [
    "Maribor Travel Guide: Lent, Old Vine & Pohorje",
    "Lent and the world's oldest vine, Glavni trg and the museums, Pohorje hikes and cable car, Štajerska wine routes, where to stay and a 3-day Maribor plan.",
  ],
  "SI:Kranjska Gora": [
    "Kranjska Gora Travel Guide: Vršič Pass, Lakes & Hikes",
    "Lake Jasna and Zelenci, driving the Vršič Pass, Planica and Tamar valley walks, winter skiing, summer hiking in the Julian Alps and where to stay.",
  ],

  /* ----------------------------- Norveç ----------------------------- */
  "NO:Oslo": [
    "Oslo Travel Guide: Opera, MUNCH, Museums & Fjord",
    "Bjørvika, the Opera and MUNCH, the Bygdøy museums, Vigeland Park and the National Museum, fjord ferries, costs and a 3-day Oslo itinerary.",
  ],
  "NO:Bergen": [
    "Bergen Travel Guide: Bryggen, Fløyen & Fjord Trips",
    "Bryggen's Hanseatic wharf, the Fløibanen up Mount Fløyen, KODE and Bergenhus, rain-proof planning, fjord cruises and a 3-day Bergen plan.",
  ],
  "NO:Tromsø": [
    "Tromsø Travel Guide: Northern Lights, Fjellheisen & Fjords",
    "Chasing the northern lights, the Fjellheisen cable car, the Arctic Cathedral, the Polar Museum, the midnight sun, tours and where to stay in Tromsø.",
  ],
  "NO:Lofoten": [
    "Lofoten Travel Guide: Reine, Henningsvær & Hikes",
    "Reine, Hamnøy and Å, Henningsvær, the Lofotr Viking Museum, Arctic beaches, driving the E10, rorbu cabins and how many days Lofoten needs.",
  ],
  "NO:Geirangerfjord": [
    "Geirangerfjord Travel Guide: Fjord Boats, Viewpoints & Hikes",
    "Fjord boats and ferries, the Ørnesvingen and Flydalsjuvet viewpoints, fjord farms and waterfall hikes, road openings, cruise-day crowds and where to stay.",
  ],
  "NO:Flåm": [
    "Flåm Travel Guide: Flåm Railway, Nærøyfjord & Stegastein",
    "Riding the Flåm Railway, a Nærøyfjord cruise, the Stegastein viewpoint and Aurland, cruise-ship crowds, where to stay and a 3-day plan.",
  ],
  "NO:Trondheim": [
    "Trondheim Travel Guide: Nidaros, Bakklandet & History",
    "Nidaros Cathedral and the Archbishop's Palace, Bakklandet and Gamle Bybro, Ringve or Sverresborg museums, local food and a 3-day Trondheim plan.",
  ],
  "NO:Stavanger": [
    "Stavanger Travel Guide: Preikestolen, Old Town & Lysefjord",
    "Hiking Preikestolen safely, Lysefjord boat trips, Gamle Stavanger and the Canning Museum, the Norwegian Petroleum Museum, where to stay and a 3-day plan.",
  ],

  /* ------------------------------ İsveç ------------------------------ */
  "SE:Stockholm": [
    "Stockholm Travel Guide: Gamla Stan, Vasa & Archipelago",
    "Gamla Stan and the Royal Palace, the Vasa Museum and Djurgården, Stadshuset and Fotografiska, archipelago boats, fika, where to stay and a 3-day plan.",
  ],
  "SE:Göteborg": [
    "Gothenburg Travel Guide: Haga, Museums & Archipelago",
    "The Museum of Art and Götaplatsen, Maritiman and the harbour, Haga, Masthugget and Majorna, the car-free southern archipelago, seafood and 3 days.",
  ],
  "SE:Malmö": [
    "Malmö Travel Guide: Turning Torso, Old Town & Øresund",
    "Malmöhus and the museums, Västra Hamnen and the Turning Torso, Stortorget, Lilla Torg and St Petri, crossing to Copenhagen and a 3-day Malmö plan.",
  ],
  "SE:Uppsala": [
    "Uppsala Travel Guide: Cathedral, University & Old Uppsala",
    "Uppsala Cathedral, the Gustavianum and Carolina Rediviva library, the royal mounds of Gamla Uppsala, student life, day trip from Stockholm and 2–3 days.",
  ],
  "SE:Gotland": [
    "Gotland Travel Guide: Visby, Fårö & Sea Stacks",
    "Visby's medieval walls and old town, the Gotlands Museum, Fårö and the rauk sea stacks, cycling, ferries and summer crowds, and where to stay on Gotland.",
  ],
  "SE:Kiruna": [
    "Kiruna Travel Guide: Northern Lights, Mine & Sámi Culture",
    "Kiruna's new centre and church, the LKAB mine visit, Sámi culture, northern lights, the Icehotel and Abisko nearby, polar winters and where to stay.",
  ],
  "SE:Abisko": [
    "Abisko Travel Guide: Northern Lights, Canyon & Kungsleden",
    "Abisko National Park and its canyon, the start of the Kungsleden trail, the Aurora Sky Station, clear-sky odds, winter and summer trips, and where to stay.",
  ],
  "SE:Dalarna": [
    "Dalarna Travel Guide: Lake Siljan, Falun Mine & Traditions",
    "Falun's Great Copper Mountain, Lake Siljan's villages, Carl Larsson-gården in Sundborn, rural traditions and a road trip through Dalarna.",
  ],

  /* ----------------------------- Danimarka ----------------------------- */
  "DK:Kopenhag": [
    "Copenhagen Travel Guide: Nyhavn, Palaces, Design & Food",
    "Christiansborg and Slotsholmen, Rosenborg and the SMK, Nyhavn and harbour architecture, cycling the city, where to stay and a 3-day Copenhagen plan.",
  ],
  "DK:Aarhus": [
    "Aarhus Travel Guide: ARoS, Den Gamle By & Moesgaard",
    "ARoS art museum, the Den Gamle By open-air museum, the Moesgaard Museum, the Latin Quarter and the new harbour, and a 3-day Aarhus itinerary.",
  ],
  "DK:Odense": [
    "Odense Travel Guide: Hans Christian Andersen & Old Town",
    "The H.C. Andersen Hus, Møntergården and the old streets, Brandts and the harbour, cycling, Funen day trips such as Egeskov, and a 2–3 day Odense plan.",
  ],
  "DK:Aalborg": [
    "Aalborg Travel Guide: Waterfront, Kunsten & Viking Sites",
    "The Utzon Center and Limfjord waterfront, the Kunsten museum, the Viking burial ground at Lindholm Høje, Jomfru Ane Gade nights and a 2–3 day plan.",
  ],
  "DK:Ribe": [
    "Ribe Travel Guide: Cathedral, Viking History & Wadden Sea",
    "Ribe Cathedral, the Ribe Viking museum and VikingeCenter, the night watchman's walk, the Wadden Sea Centre and a 2–3 day Ribe plan.",
  ],
  "DK:Skagen": [
    "Skagen Travel Guide: Grenen, Painters & Råbjerg Mile",
    "Grenen where two seas meet, Skagens Museum and Anchers Hus, the Buried Church and Råbjerg Mile dune, beaches, cycling and a 2–3 day Skagen plan.",
  ],
  "DK:Bornholm": [
    "Bornholm Travel Guide: Hammershus, Round Churches & Coast",
    "Hammershus castle ruins, Østerlars and the round churches, Gudhjem and Svaneke, smokehouses, cycling the coast, ferries from Copenhagen and where to stay.",
  ],
  "DK:Roskilde": [
    "Roskilde Travel Guide: Viking Ships & Royal Cathedral",
    "The Viking Ship Museum and boat trips, Roskilde Cathedral's royal tombs, the fjord, the festival, getting there from Copenhagen and a 1–3 day plan.",
  ],

  /* ---------------------------- Finlandiya ---------------------------- */
  "FI:Helsinki": [
    "Helsinki Travel Guide: Suomenlinna, Design & Saunas",
    "The ferry to Suomenlinna, Senate Square, Oodi library, Kiasma and Temppeliaukio, public saunas, the design district, where to stay and a 3-day plan.",
  ],
  "FI:Rovaniemi": [
    "Rovaniemi Travel Guide: Arctic Circle, Arktikum & Aurora",
    "The Arktikum, the Arctic Circle and Santa Claus Village, Ounasvaara and Korundi, northern lights, husky and reindeer tours, Lapland winters and where to stay.",
  ],
  "FI:Turku": [
    "Turku Travel Guide: Castle, Cathedral & Archipelago",
    "Turku Castle, the cathedral and Aboa Vetus, Forum Marinum and the Aura riverside, the Archipelago Trail, Moomin World nearby and a 3-day Turku plan.",
  ],
  "FI:Tampere": [
    "Tampere Travel Guide: Saunas, Lakes & Industrial Heritage",
    "Vapriikki, Finlayson and the Tammerkoski rapids, Pyynikki tower and Pispala, public saunas on the lakes, where to stay and a 3-day Tampere plan.",
  ],
  "FI:Porvoo": [
    "Porvoo Travel Guide: Old Town, Red Warehouses & Day Trip",
    "Vanha Porvoo and the red riverside warehouses, Porvoo Cathedral, the Porvoo Museum and Taidetehdas, Runeberg cake and a day trip or overnight from Helsinki.",
  ],
  "FI:Finlandiya Göller Bölgesi": [
    "Finnish Lakeland Travel Guide: Saimaa & Savonlinna",
    "Olavinlinna castle in Savonlinna, the Punkaharju ridge, Saimaa lake nature and seals, lakeside saunas, getting around and how many days you need.",
  ],
  "FI:Inari ve Saariselkä": [
    "Inari & Saariselkä Travel Guide: Sámi Culture & Aurora",
    "The Siida Sámi museum, Urho Kekkonen National Park, Lake Inari and Kaunispää, northern lights, winter and summer hikes, getting there and where to stay.",
  ],
  "FI:Åland Adaları": [
    "Åland Islands Travel Guide: Mariehamn, Castles & Cycling",
    "The Åland Maritime Museum and the Pommern, Kastelholm and Jan Karlsgården, Bomarsund fortress, cycling and ferries between islands, and where to stay.",
  ],

  /* ----------------------------- Svalbard ----------------------------- */
  "SJ:Longyearbyen": [
    "Longyearbyen Travel Guide: Svalbard's Northernmost Town",
    "How to get to Longyearbyen, polar night and the midnight sun, the Svalbard Museum, the Global Seed Vault, local customs like removing your shoes, and tours.",
  ],
  "SJ:Ny-Ålesund": [
    "Ny-Ålesund Travel Guide: Svalbard's Arctic Research Town",
    "What Ny-Ålesund is and how to visit by boat, radio silence and polar rules, Amundsen's airship mast, the northernmost post office and Kings Bay Museum.",
  ],
};

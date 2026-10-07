import type { GuideTemplates } from "./types";

/* Kural için en.ts başlığına bakın: yer adları artikel/edat gerektiren
 * konuma girmez ("la Costa Amalfitana", "el Algarve" sorunları olmasın).
 *
 * İstisna: rehberin kendi şehri/bölgesi. İspanyolca aramalar "qué ver en
 * Lisboa", "dónde alojarse en el Algarve", "excursiones desde Oporto"
 * kalıbında yapıldığı için başlıklar ve SSS bu kalıpla kuruluyor. Artikel
 * isteyen adlar aşağıdaki listede; "de el" → "del", "a el" → "al" kuralı ve
 * cins isimlerin cümle içinde küçük harfi ("el lago Toba") burada çözülüyor. */
const WITH_ARTICLE: Record<string, readonly [article: "el" | "la" | "los" | "las", inline: string]> = {
  "Tierras Altas de Escocia": ["las", "Tierras Altas de Escocia"],
  Cotswolds: ["los", "Cotswolds"],
  "Distrito de los Lagos": ["el", "Distrito de los Lagos"],
  "Islas Gili": ["las", "islas Gili"],
  "Monte Bromo": ["el", "monte Bromo"],
  "Lago Toba": ["el", "lago Toba"],
  "Valle de Wachau": ["el", "valle de Wachau"],
  Algarve: ["el", "Algarve"],
  Azores: ["las", "Azores"],
  "Selva Negra": ["la", "Selva Negra"],
  "Cataratas del Niágara": ["las", "cataratas del Niágara"],
  Yukón: ["el", "Yukón"],
  Ardenas: ["las", "Ardenas"],
  "Lago Balaton": ["el", "lago Balaton"],
  "Suiza Bohemia": ["la", "Suiza Bohemia"],
  "Lago Baikal": ["el", "lago Baikal"],
  "Parque Nacional de Tara": ["el", "Parque Nacional de Tara"],
  "Puertas de Hierro": ["las", "Puertas de Hierro"],
  "Parque Nacional del Una": ["el", "Parque Nacional del Una"],
  "Lagos de Plitvice": ["los", "lagos de Plitvice"],
  "Lago Bled": ["el", "lago Bled"],
  "Valle del Soča": ["el", "valle del Soča"],
  "Fiordo de Geiranger": ["el", "fiordo de Geiranger"],
  "Región de los Lagos de Finlandia": ["la", "región de los lagos de Finlandia"],
  "Islas Åland": ["las", "islas Åland"],
};
/** Ad öbeği: "el Algarve", "Lisboa". */
const np = (city: string) => (WITH_ARTICLE[city] ? `${WITH_ARTICLE[city][0]} ${WITH_ARTICLE[city][1]}` : city);
/** "de" + ad: "del Algarve", "de las Azores", "de Lisboa". */
const de = (city: string) => (WITH_ARTICLE[city]?.[0] === "el" ? `del ${WITH_ARTICLE[city][1]}` : `de ${np(city)}`);
/** "a" + ad: "al Algarve", "a las Azores", "a Lisboa". */
const a = (city: string) => (WITH_ARTICLE[city]?.[0] === "el" ? `al ${WITH_ARTICLE[city][1]}` : `a ${np(city)}`);

export const es: GuideTemplates = {
  expanded: {
    seoTitle: (city, focus) => `${city}: guía de viaje — ${focus}`,
    metaLead: (city, lede) => `${city}, guía de viaje: ${lede}`,
    h1: (city) => `Guía de viaje ${de(city)}`,
    characterHeading: (city) => `Cómo organizar un viaje ${a(city)}`,
    sightsHeading: (city) => `Qué ver en ${np(city)}`,
    sightsIntro: () =>
      "Agrupar la lista según lo que queda cerca en el mapa evita repetir caminos y gastar la mejor luz del día en traslados. Fija primero las grandes paradas con entrada y reparte entre ellas plazas, parques, mercados y paseos junto al agua.",
    foodHeading: (city) => `Qué comer en ${np(city)}`,
    footballHeading: () => "Fútbol y día de partido",
    practicalHeading: (city) => `Consejos para viajar ${a(city)}`,
    internationalAudience: true,
    compact: true,
    sectionHeadings: {
      neighborhoods: () => "Barrios y zonas: qué encontrarás en cada una",
      stay: (city) => `Dónde alojarse en ${np(city)}`,
      transport: (city) => `Cómo llegar y moverse por ${np(city)}`,
      nightlife: () => "Cafés, vida nocturna y compras",
      dayTrips: (city) => `Excursiones desde ${np(city)}`,
      when: (city) => `Mejor época para viajar ${a(city)}`,
      budget: () => "Cómo calcular el presupuesto del viaje",
      apps: () => "SIM, internet y aplicaciones útiles",
      safety: () => "Seguridad y errores frecuentes",
    },
  },
  shared: {
    bold: (name, detail) => `**${name}:** ${detail}`,
    bookingOrder: (sight) =>
      `Reserva primero: ${sight}, las conexiones entre ciudades y el alojamiento; deja para después las comidas flexibles en los barrios.`,
    dailyPace: () =>
      "No metas tres zonas alejadas en el mismo día. Una experiencia principal, un barrio y una comida larga dan aquí un ritmo más llevadero.",
    faqDays: (city) => `¿Cuántos días hacen falta para ver ${np(city)}?`,
    faqStay: (city) => `¿Dónde alojarse en ${np(city)}?`,
    faqWhen: (city) => `¿Cuál es la mejor época para viajar ${a(city)}?`,
    faqHowToGet: (city) => `¿Cómo llegar ${a(city)}?`,
    faqCombine: (city) => `¿Qué destinos combinan bien con ${np(city)}?`,
    relatedAnchor: (city) => `Guía de viaje ${de(city)}`,
    relatedDescription: () => "Suma a la ruta un ritmo urbano distinto y una nueva capa de viaje.",
    day1Morning: (sight) =>
      `${sight}: empieza temprano y resuelve cualquier duda de acceso o transporte al principio del día.`,
    day2Morning: (sight) => `${sight}: completa la ruta principal antes de que crezcan las multitudes.`,
    day3Morning: (sight) => `${sight}: confirma la noche anterior el tiempo, las entradas o el traslado.`,
  },
  regional: {
    character: (_city, area1, area2, s1, s2, s3) =>
      `Aquí la clave es fijarse, entre ${area1} y ${area2}, no solo en los monumentos sino también en la vida cotidiana. ${s1}, ${s2} y ${s3} no tienen por qué apretarse en el mismo día; una experiencia principal, un barrio y una comida larga dan un ritmo más sólido.`,
    stay: (area1, area2) =>
      `En una primera visita, alojarte en la zona de ${area1} te deja cerca de la ruta principal; para noches más locales y, a menudo, un alojamiento más tranquilo, ${area2} es una buena alternativa. No mires solo la distancia en el mapa: fíjate también en la salida por la mañana y en el último transporte público.`,
    evening: (area2, sight) =>
      `Planea una cena y un paseo corto por ${area2}. Mantén la vida nocturna a un nivel que no estropee la visita de la mañana siguiente (${sight}); para volver tarde usa un taxi con licencia o una app oficial.`,
    souvenirs: () =>
      "Los productos locales y la artesanía son buenos regalos. No compres productos naturales protegidos, antigüedades sin documentación ni alimentos con normas de equipaje y aduana poco claras.",
    season: (best) =>
      `Para la mayoría de los viajeros, la ventana más equilibrada es ${best}, pero el tiempo medio no es un pronóstico diario. Reordena los días de ciudad, costa o montaña en las últimas 48 horas según los avisos oficiales de meteorología y de los operadores.`,
    budget: (sight) =>
      `Calcula primero el alojamiento, las conexiones entre ciudades y una experiencia principal como ${sight}. Después reserva dinero para transporte local, comidas, equipaje y el traslado de la última milla; no confundas la suma de vuelo y hotel con el presupuesto del viaje.`,
    day1Title: (sight) => `Día 1 — ${sight} y un primer barrio`,
    day1Afternoon: (area) => `Pasea por ${area} y deja hueco para un café improvisado.`,
    day1Evening: (food) => `Cierra el día con una cena tranquila; protagonista: ${food}.`,
    day2Title: (sight) => `Día 2 — ${sight} y el ritmo local`,
    day2Afternoon: (area) => `Añade al programa las callejuelas, los mercados y la vida cotidiana de ${area}.`,
    day2Evening: (food) => `${food}: pregunta antes por ingredientes, raciones y reserva.`,
    day3Title: (sight) => `Día 3 — ${sight} y alrededores`,
    day3Afternoon: (dayTrip) => `${dayTrip}: encájalo según tu energía y la última conexión de vuelta.`,
    faqDaysAnswer: (days) =>
      `Con ${days} tienes una primera visita equilibrada. Si dejas margen para barrios, comida y posibles retrasos por el tiempo o el transporte, el viaje gana sentido.`,
    faqStayAnswer: (area1, area2) =>
      `${area1} es práctico para una primera visita; ${area2} es una alternativa más local. Valora las conexiones de la mañana y de la noche junto con el precio de la habitación.`,
    faqWhenAnswer: (best) =>
      `El periodo más equilibrado suele ser ${best}; aun así, consulta en fuentes oficiales el tiempo, los festivales y el aforo más recientes.`,
    faqCarQuestion: (city) => `¿Hace falta coche en ${np(city)}?`,
    faqCarAnswer: (local) =>
      `Cómo moverse: ${local}. Antes de alquilar, valora juntos el aparcamiento, el carné, el seguro, el combustible y la vuelta de noche.`,
    faqCombineAnswer: (cities) =>
      `Las continuaciones naturales son ${cities}. Usa el tiempo de puerta a puerta en lugar de la distancia en el mapa.`,
  },
  world: {
    shopping: () =>
      "No reduzcas las compras a un único bazar turístico. Al comprar productos locales, diseño o regalos gastronómicos, revisa la etiqueta, el precio fijo y las normas de equipaje; no compres productos naturales protegidos ni antigüedades sin documentación.",
    season: (best) =>
      `Aunque en el calendario destaque ${best}, las vacaciones escolares, las fiestas nacionales, los festivales y las aglomeraciones de fin de semana pueden cambiar la experiencia. No tomes el tiempo medio por un pronóstico de última hora; añade a cada día al aire libre una alternativa bajo techo o un paseo tranquilo por el barrio.`,
    budget: (sight) =>
      `Calcula primero el alojamiento, las conexiones entre ciudades y las experiencias principales como ${sight}. Aparta una cantidad para pequeños pagos, equipaje, comisiones de reserva y el traslado de la última milla; no confundas la suma de vuelo y hotel con el presupuesto del viaje.`,
    day1Title: (sight) => `Día 1 — ${sight} y primer contacto con la ciudad`,
    day1Afternoon: (area) => `Recorre ${area} a pie y deja hueco para un café improvisado.`,
    day1Evening: () => "Termina la noche con una comida tranquila de cocina local.",
    day2Title: (sight) => `Día 2 — ${sight} y los barrios`,
    day2Afternoon: (area) => `Añade al programa las callejuelas, los mercados y la vida cotidiana local de ${area}.`,
    day3Title: (sight) => `Día 3 — ${sight} y un cierre flexible`,
    faqDaysAnswer: (days) =>
      `Con ${days} tienes una primera visita equilibrada. En lugar de ir tachando los puntos principales, deja margen para barrios, comida y posibles retrasos por el tiempo o el transporte, y el lugar se abrirá de verdad.`,
    faqWhenAnswer: (best, season) => `El periodo más equilibrado suele ser ${best}. ${season}`,
    faqCarQuestion: (city) => `¿Conviene alquilar coche en ${np(city)}?`,
    faqCarAnswer: (local) =>
      `Cómo moverse: ${local}. Antes de decidir sobre el coche, valora juntos el aparcamiento, el carné, el seguro y la vuelta de noche.`,
    faqCombineAnswer: (cities) =>
      `En esta guía, las continuaciones naturales son ${cities}. No mires solo la distancia en el mapa, sino el tiempo real de puerta a puerta.`,
  },
};

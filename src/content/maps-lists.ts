/**
 * Rehberlerin "Google Maps listesi" bölümü.
 *
 * Yeni şehir eklemek (ayrıntılı adımlar: docs/google-maps-listeleri.md):
 *   1. Rehberde adı geçen 10 durağı seç.
 *   2. Durak adlarını 6 dilin messages/*.json → Guide.mapsPlaces altına ekle
 *      (id'ler tr.json'dan tiplenir; eksik id derlemeyi durdurur).
 *   3. Wangoh Google hesabında listeyi kur, "bağlantıya sahip olanlar
 *      görüntüleyebilir" olarak paylaş, maps.app.goo.gl bağlantısını al.
 *   4. Aşağıdaki MAPS_LISTS'e "ÜLKE:Şehir" anahtarıyla ekle (Türkçe şehir adı,
 *      rehberdeki `city` alanıyla birebir).
 */
type MapsStopId = keyof typeof import("../../messages/tr.json")["Guide"]["mapsPlaces"];

export interface GuideMapsList {
  /** Google Maps'teki listenin salt görüntüleme paylaşım bağlantısı. */
  url?: string;
  note?: "mapsParisNote" | "mapsNiceNote" | "mapsMarseilleNote";
  stops: { id: MapsStopId; query: string }[];
}

/** Paris rehberinde adı geçen yerlerden ilk ziyaret için seçilen 10 durak. */
export const parisMapsList: GuideMapsList = {
  // Wangoh Google Maps hesabındaki 10 duraklık listenin görüntüleme bağlantısı.
  url: "https://maps.app.goo.gl/ey46Ddvyh655PZC47",
  note: "mapsParisNote",
  stops: [
    { id: "eiffel", query: "Tour Eiffel, Paris, France" },
    { id: "louvre", query: "Musée du Louvre, Paris, France" },
    { id: "notreDame", query: "Cathédrale Notre-Dame de Paris, Paris, France" },
    { id: "sainteChapelle", query: "Sainte-Chapelle, Paris, France" },
    { id: "orsay", query: "Musée d'Orsay, Paris, France" },
    { id: "orangerie", query: "Musée de l'Orangerie, Paris, France" },
    { id: "tuileries", query: "Jardin des Tuileries, Paris, France" },
    { id: "luxembourg", query: "Jardin du Luxembourg, Paris, France" },
    { id: "sacreCoeur", query: "Basilique du Sacré-Cœur de Montmartre, Paris, France" },
    { id: "versailles", query: "Château de Versailles, Versailles, France" },
  ],
};

/**
 * Şehir rehberlerinin listeleri. Anahtar: "ÜLKE:Şehir" (Türkçe şehir adı).
 * Her listede o rehberde adı geçen yerlerden seçilen 10 durak var.
 */
const MAPS_LISTS: Record<string, GuideMapsList> = {
  /* ------------------------------ Fransa ------------------------------ */
  "FR:Paris": parisMapsList,
  "FR:Nice": {
    url: "https://maps.app.goo.gl/aJeYi4Dc1Qn4XMVaA",
    note: "mapsNiceNote",
    stops: [
      { id: "promenadeAnglais", query: "Promenade des Anglais, Nice, France" },
      { id: "castleHill", query: "Colline du Château, Nice, France" },
      { id: "coursSaleya", query: "Marché aux fleurs Cours Saleya, Nice, France" },
      { id: "placeRossetti", query: "Place Rossetti, Nice, France" },
      { id: "portLympia", query: "Port de Nice Lympia, Nice, France" },
      { id: "matisse", query: "Musée Matisse, Nice, France" },
      { id: "chagall", query: "Musée national Marc Chagall, Nice, France" },
      { id: "cimiezArena", query: "Arènes de Cimiez, Nice, France" },
      { id: "cimiezGarden", query: "Jardin du Monastère de Cimiez, Nice, France" },
      { id: "villaEphrussi", query: "Villa Ephrussi de Rothschild, Saint-Jean-Cap-Ferrat, France" },
    ],
  },
  "FR:Lyon": {
    url: "https://maps.app.goo.gl/GaNQup4G8cLANKKN6",
    stops: [
      { id: "fourviere", query: "Basilique Notre-Dame de Fourvière, Lyon, France" },
      { id: "lyonCathedral", query: "Cathédrale Saint-Jean-Baptiste, Lyon, France" },
      { id: "romanTheatre", query: "Théâtre Gallo Romain, Lyon, France" },
      { id: "canuts", query: "La Maison des Canuts, Lyon, France" },
      { id: "bellecour", query: "Place Bellecour, Lyon, France" },
      { id: "terreaux", query: "Place des Terreaux, Lyon, France" },
      { id: "lyonFineArts", query: "Musée des Beaux-Arts, Lyon, France" },
      { id: "hallesBocuse", query: "Les Halles de Lyon Paul Bocuse, Lyon, France" },
      { id: "teteOr", query: "Parc de la Tête d’Or, Lyon, France" },
      { id: "confluences", query: "Musée des Confluences, Lyon, France" },
    ],
  },
  "FR:Marsilya": {
    url: "https://maps.app.goo.gl/xHH6tXuoFQifdcwU8",
    note: "mapsMarseilleNote",
    stops: [
      { id: "vieuxPort", query: "Vieux-Port de Marseille, France" },
      { id: "panier", query: "Le Panier, Marseille, France" },
      { id: "vieilleCharite", query: "Centre de la Vieille Charité, Marseille, France" },
      { id: "mucem", query: "Mucem, Marseille, France" },
      { id: "fortSaintJean", query: "Fort Saint-Jean, Marseille, France" },
      { id: "garde", query: "Notre-Dame de la Garde, Marseille, France" },
      { id: "vallonAuffes", query: "Port du Vallon des Auffes, Marseille, France" },
      { id: "coursJulien", query: "Cours Julien, Marseille, France" },
      { id: "chateauIf", query: "Château d’If, Marseille, France" },
      { id: "sugiton", query: "Calanque de Sugiton, France" },
    ],
  },
  "FR:Bordo": {
    url: "https://maps.app.goo.gl/V3868SHXZBgEJhqo9",
    stops: [
      { id: "bourse", query: "Place de la Bourse, Bordeaux, France" },
      { id: "miroir", query: "Miroir d’eau, Bordeaux, France" },
      { id: "cailhau", query: "Porte Cailhau, Bordeaux, France" },
      { id: "grandTheatre", query: "Grand Théâtre de Bordeaux, France" },
      { id: "peyBerland", query: "Tour Pey Berland, Bordeaux, France" },
      { id: "jardinPublic", query: "Jardin Public, Bordeaux, France" },
      { id: "citeVin", query: "Cité du Vin, Bordeaux, France" },
      { id: "bassins", query: "Bassins des Lumières, Bordeaux, France" },
      { id: "capucins", query: "Marché des Capucins, Bordeaux, France" },
      { id: "darwin", query: "Darwin Eco-système, Bordeaux, France" },
    ],
  },
  "FR:Strazburg": {
    url: "https://maps.app.goo.gl/SWg9FjH9viWsip65A",
    stops: [
      { id: "strasbourgCathedral", query: "Cathédrale Notre-Dame de Strasbourg, France" },
      { id: "petiteFrance", query: "La Petite France, Strasbourg, France" },
      { id: "pontsCouverts", query: "Ponts Couverts, Strasbourg, France" },
      { id: "vauban", query: "Barrage Vauban, Strasbourg, France" },
      { id: "kammerzell", query: "Maison Kammerzell, Strasbourg, France" },
      { id: "gutenberg", query: "Place Gutenberg, Strasbourg, France" },
      { id: "republique", query: "Place de la République, Strasbourg, France" },
      { id: "palaisRhin", query: "Palais du Rhin, Strasbourg, France" },
      { id: "europeanParliament", query: "Parlement Européen, Strasbourg, France" },
      { id: "orangeriePark", query: "Parc de l’Orangerie, Strasbourg, France" },
    ],
  },
};

export function mapsListFor(countryCode: string, city: string): GuideMapsList | null {
  return MAPS_LISTS[`${countryCode}:${city}`] ?? null;
}

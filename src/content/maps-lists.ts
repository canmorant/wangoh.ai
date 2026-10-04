type MapsStopId = keyof typeof import("../../messages/tr.json")["Guide"]["mapsPlaces"];

export interface GuideMapsList {
  /** Google Maps'teki listenin salt görüntüleme paylaşım bağlantısı. */
  url?: string;
  stops: { id: MapsStopId; query: string }[];
}

/** Paris rehberinde adı geçen yerlerden ilk ziyaret için seçilen 10 durak. */
export const parisMapsList: GuideMapsList = {
  // Wangoh Google Maps hesabındaki 10 duraklık listenin görüntüleme bağlantısı.
  url: "https://maps.app.goo.gl/ey46Ddvyh655PZC47",
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

export function mapsListFor(countryCode: string, city: string): GuideMapsList | null {
  return countryCode === "FR" && city === "Paris" ? parisMapsList : null;
}

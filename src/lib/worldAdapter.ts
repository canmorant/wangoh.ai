import { Country as RouteCountry, countries as routes } from "@/data/destinations";
import { Country } from "@/data/countries";

/** The curated route for an ISO2 code, if this site actually flies there. */
export function featuredFor(iso2: string): RouteCountry | null {
  return routes.find((c) => c.code === iso2) ?? null;
}

/**
 * Adapts any canonical country into the `RouteCountry` shape the flight
 * animation and city view expect.
 *
 * A curated destination is returned verbatim. Everything else gets an honest
 * stub with real name, flag and coordinates, and an empty `cities` list that
 * the city view renders as a proper empty state.
 */
export function toCountryRoute(c: Country): RouteCountry {
  const featured = featuredFor(c.iso2);
  if (featured) return featured;

  return {
    name: c.name,
    code: c.iso2,
    flag: c.flag,
    description: `${c.name} henüz tarifeli bir Wangoh rotasında değil — bu uçuş doğrudan haritadan çizildi.`,
    image: "",
    coordinates: { lat: c.latlng?.[0] ?? 0, lng: c.latlng?.[1] ?? 0 },
    cities: [],
    iata: "—",
    gateway: c.capital[0] ?? c.name,
    capital: c.capital.join(" · ") || "—",
    flightTime: "—",
    accent: "#8a97ad",
    bestSeason: "—",
    budget: "Orta",
    signature: "Şimdilik haritada yok.",
  };
}

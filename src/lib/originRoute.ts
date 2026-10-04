import type { Country } from "@/data/destinations";
import type { FlightOrigin } from "@/hooks/useFlightOrigin";

/**
 * Ziyaretçinin kalkış noktasından bir ülkeye giden rotanın kartlarda
 * gösterilecek bilgisi.
 *
 * Elimizdeki uçuş süreleri yalnız İstanbul kalkışlı (destinations.ts →
 * flightTime). Başka bir şehirden uçuş süresi uydurulmuyor; onun yerine
 * kalkış noktası ile ülkenin haritadaki varış noktası arasındaki kuş uçuşu
 * mesafe gösteriliyor (uçak animasyonunun çizdiği hat).
 */
export type OriginRoute =
  | { kind: "flightTime"; value: string }
  | { kind: "distance"; km: number }
  | { kind: "unknown" };

/** İki nokta arasındaki büyük daire mesafesi (km). */
export function greatCircleKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad;
  const dLng = (bLng - aLng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function originRoute(country: Country, origin: FlightOrigin | null): OriginRoute {
  if (!origin) return { kind: "unknown" };
  if (origin.id === "istanbul") return { kind: "flightTime", value: country.flightTime };
  const km = greatCircleKm(origin.lat, origin.lng, country.coordinates.lat, country.coordinates.lng);
  // Şehir merkezi ve ülkenin varış noktası yaklaşık; 10 km'ye yuvarlanıyor.
  return { kind: "distance", km: Math.max(10, Math.round(km / 10) * 10) };
}

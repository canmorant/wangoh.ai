/** Dünya yarıçapı (km). Haversine için tek değer; testler de bunu kullanıyor. */
export const EARTH_RADIUS_KM = 6371;

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * İki nokta arasındaki büyük daire (kuş uçuşu) mesafesi, km.
 * Enlem/boylam derece cinsinden.
 */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  // min(1, …): kayan nokta hatası antipodlarda asin'e 1'in hemen üstünü verebilir.
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

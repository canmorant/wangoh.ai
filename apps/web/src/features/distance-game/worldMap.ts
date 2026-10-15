import { geoBounds, geoContains, geoGraticule, geoOrthographic, geoPath, type GeoProjection } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { Feature, FeatureCollection, MultiLineString } from "geojson";
// Sitenin zaten bağımlı olduğu world-atlas paketi; ikinci bir kopya yok. Yalnız bu modül
// (ve onu içe aktaran RevealMap, dinamik olarak) cevap ekranı açılınca yüklenir; ana sayfaya ve
// oyunun ilk paketine girmez. Çevrimdışı: veri JS paketinin içinde, ağ isteği yok.
import atlas from "world-atlas/countries-110m.json";
import { MAP_HEIGHT, MAP_WIDTH } from "./mapDimensions";
import { cameraEnds, midpoint, tiltDegrees, type LngLat } from "./mapGeometry";

type Atlas = Topology<{ countries: GeometryCollection; land: GeometryCollection }>;
const topology = atlas as unknown as Atlas;

export { MAP_HEIGHT, MAP_WIDTH };
/** fitExtent kenar boşlukları: etiketlere yer kalsın. */
const PAD_X = 58;
const PAD_Y = 52;

interface World {
  land: FeatureCollection;
  countries: FeatureCollection;
  borders: MultiLineString;
}

let cached: World | undefined;

export function world(): World {
  if (!cached) {
    cached = {
      land: feature(topology, topology.objects.land) as FeatureCollection,
      countries: feature(topology, topology.objects.countries) as FeatureCollection,
      borders: mesh(topology, topology.objects.countries, (a, b) => a !== b),
    };
  }
  return cached;
}

export interface MapCamera {
  projection: GeoProjection;
  /** Yayın A→B bakışından kameranın kaydığı yön (+1 kuzey, -1 güney); testler için. */
  tiltSign: 1 | -1;
}

/**
 * A ve B'yi kadraja alan kamera (orthographic küre): merkez büyük daire orta noktası,
 * yayın kavisli görünmesi için biraz kaydırılmış; ölçek ve kaydırma fitExtent ile
 * iki uca (ve nefes payına) göre ayarlanır.
 */
export function makeCamera(a: LngLat, b: LngLat, distanceKm: number): MapCamera {
  const mid = midpoint(a, b);
  const tilt = tiltDegrees(distanceKm);
  const ends = cameraEnds(a, b, distanceKm, tilt);
  const build = (sign: 1 | -1) => {
    const lat = Math.max(-85, Math.min(85, mid[1] + sign * tilt));
    const projection = geoOrthographic().rotate([-mid[0], -lat, 0]).clipAngle(90).precision(0.6);
    projection.fitExtent(
      [
        [PAD_X, PAD_Y],
        [MAP_WIDTH - PAD_X, MAP_HEIGHT - PAD_Y],
      ],
      { type: "MultiPoint", coordinates: ends },
    );
    return projection;
  };
  // İki yönden yayı daha yukarı bombeli (ekranda ortası kirişin üstünde) olan seçilir.
  const bow = (projection: GeoProjection) => {
    const pa = projection(a);
    const pb = projection(b);
    const pm = projection(mid);
    if (!pa || !pb || !pm) return -Infinity;
    return (pa[1] + pb[1]) / 2 - pm[1];
  };
  const north = build(1);
  const south = build(-1);
  const useNorth = bow(north) >= bow(south);
  return { projection: useNorth ? north : south, tiltSign: useNorth ? 1 : -1 };
}

export interface MapPaths {
  sphere: string;
  graticule: string;
  land: string;
  borders: string;
  /** A ve B'nin ülkeleri (bulunabilirse) için dolgu yolları. */
  highlightA: string | null;
  highlightB: string | null;
}

/* ------------------- ülke sınır kutuları (nokta–ülke araması için) ------------------- */

type Bounds = [[number, number], [number, number]];
let countryBounds: Bounds[] | undefined;

const inBounds = ([[w, s], [e, n]]: Bounds, [x, y]: LngLat) =>
  y >= s - 0.01 && y <= n + 0.01 && (w <= e ? x >= w - 0.01 && x <= e + 0.01 : x >= w - 0.01 || x <= e + 0.01);

/**
 * Noktayı içeren ülke. Önce kaba sınır kutusu (bir kez hesaplanır), sonra yalnız aday
 * ülkelerde asıl çokgen denetimi: 177 ülkenin hepsinde çokgen taramak ana iş parçacığında
 * ~8 ms tutuyordu.
 */
function countryAt(point: LngLat): Feature | undefined {
  const { countries } = world();
  countryBounds ??= countries.features.map((f) => geoBounds(f));
  for (let i = 0; i < countries.features.length; i++) {
    if (inBounds(countryBounds[i], point) && geoContains(countries.features[i], point)) return countries.features[i];
  }
  return undefined;
}

/* ------------------------- kademeli çizim ve önbellek ------------------------- */

export interface Prepared {
  camera: MapCamera;
  paths: MapPaths;
}

interface Slot {
  camera: MapCamera;
  paths: Partial<MapPaths>;
}

/** Her adım ana iş parçacığını kısa tutar; sırayla ve kendi kendine bağımsız. */
const STEPS: ((slot: Slot, a: LngLat, b: LngLat) => void)[] = [
  (slot) => {
    const path = geoPath(slot.camera.projection);
    slot.paths.sphere = path({ type: "Sphere" }) ?? "";
    // Seyrek çizgi ağı (20°): görsel yön duygusu için yeter, 10°'nin yarı maliyeti.
    slot.paths.graticule = path(geoGraticule().step([20, 20])()) ?? "";
  },
  (slot) => {
    slot.paths.land = geoPath(slot.camera.projection)(world().land) ?? "";
  },
  (slot) => {
    slot.paths.borders = geoPath(slot.camera.projection)(world().borders) ?? "";
  },
  (slot, a, b) => {
    const path = geoPath(slot.camera.projection);
    const fa = countryAt(a);
    const fb = countryAt(b);
    slot.paths.highlightA = fa ? path(fa) : null;
    slot.paths.highlightB = fb && fb !== fa ? path(fb) : null;
  },
];
const STEP_KEYS: (keyof MapPaths)[] = ["graticule", "land", "borders", "highlightB"];

const slots = new Map<string, Slot>();
const keyFor = (a: LngLat, b: LngLat) => `${a[0]},${a[1]}|${b[0]},${b[1]}`;

function slotFor(a: LngLat, b: LngLat, distanceKm: number): Slot {
  const key = keyFor(a, b);
  let slot = slots.get(key);
  if (!slot) {
    slot = { camera: makeCamera(a, b, distanceKm), paths: {} };
    slots.set(key, slot);
    // Bir oyunda en çok 10 tur: eskileri at, bellek şişmesin.
    if (slots.size > 12) slots.delete(slots.keys().next().value as string);
  }
  return slot;
}

const done = (slot: Slot, i: number) => STEP_KEYS[i] in slot.paths;

/**
 * Bir turun haritasını (kamera ve tüm yol dizeleri) hazırlar ve önbelleğe alır.
 * Tamamlanmamış adımları eşzamanlı bitirir; RevealMap bunu çağırır. Önceden
 * `prepareIdle` ile hazırlandıysa anında döner.
 */
export function prepare(a: LngLat, b: LngLat, distanceKm: number): Prepared {
  const slot = slotFor(a, b, distanceKm);
  STEPS.forEach((step, i) => {
    if (!done(slot, i)) step(slot, a, b);
  });
  return { camera: slot.camera, paths: slot.paths as MapPaths };
}

/**
 * Aynısı, ama adımlar arasında ana iş parçacığına nefes verir (`pause`): oyuncu
 * tahmin ederken kaydırıcı takılmasın. Pahalı iş budur (tüm kıyılar); her adım Node'da
 * ~3–11 ms, 4× yavaş cihazda 12–45 ms.
 */
export async function prepareIdle(
  a: LngLat,
  b: LngLat,
  distanceKm: number,
  pause: () => Promise<void> = () => new Promise((r) => setTimeout(r, 0)),
): Promise<void> {
  const slot = slotFor(a, b, distanceKm);
  for (let i = 0; i < STEPS.length; i++) {
    if (!done(slot, i)) STEPS[i](slot, a, b);
    await pause();
  }
}

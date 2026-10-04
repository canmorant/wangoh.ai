"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { ORIGIN_CITIES, originById, originByPlaceName, type OriginCity } from "@/data/origins";

/**
 * Uçuş animasyonunun kalkış noktası.
 *
 * Sıra:
 *   1. Ziyaretçi daha önce bir şehir seçtiyse o (localStorage, bu cihazda).
 *   2. Yoksa bağlandığı yaklaşık konum (/api/konum; oturum boyunca
 *      sessionStorage'da tutulur, her uçuşta yeniden sorulmaz).
 *   3. O da alınamazsa durum "unknown": animasyon kalkış şehrini sorar.
 *
 * Sitenin dili kalkışı etkilemiyor: Almanca okuyan biri İstanbul'da da
 * olabilir, Türkçe okuyan biri Berlin'de de.
 */

export interface FlightOrigin {
  /** Görünen ad (Türkçe kaynak metin); bilinmiyorsa null → "Bulunduğun yer". */
  name: string | null;
  lat: number;
  lng: number;
  /** Listedeki karşılığı varsa: seçicide hazır seçili gelir. */
  id: string | null;
}

export type OriginStatus = "pending" | "detected" | "chosen" | "unknown";

const CHOICE_KEY = "wangoh.origin";
const DETECTED_KEY = "wangoh.origin.detected";
const TIMEOUT_MS = 2500;
/** Koordinatı listedeki bir şehre bu kadar yakınsa adını kullan. */
const NEAR_KM = 60;

function read(storage: "local" | "session", key: string): string | null {
  try {
    return (storage === "local" ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function write(storage: "local" | "session", key: string, value: string) {
  try {
    (storage === "local" ? window.localStorage : window.sessionStorage).setItem(key, value);
  } catch {
    // Gizli pencere, engellenmiş depolama: yalnız bu oturumda geçerli olur.
  }
}

const fromCity = (city: OriginCity): FlightOrigin => ({
  name: city.name,
  lat: city.lat,
  lng: city.lng,
  id: city.id,
});

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad;
  const dLng = (bLng - aLng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function nearestCity(lat: number, lng: number): OriginCity | null {
  let best: OriginCity | null = null;
  let bestKm = NEAR_KM;
  for (const city of ORIGIN_CITIES) {
    const km = distanceKm(lat, lng, city.lat, city.lng);
    if (km < bestKm) {
      best = city;
      bestKm = km;
    }
  }
  return best;
}

function toOrigin(data: unknown): FlightOrigin | null {
  if (!data || typeof data !== "object") return null;
  const { city, lat, lng } = data as { city?: unknown; lat?: unknown; lng?: unknown };
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  const name = typeof city === "string" && city.trim() ? city.trim() : null;
  const known = (name ? originByPlaceName(name) : null) ?? nearestCity(lat, lng);
  return { name: known?.name ?? name, lat, lng, id: known?.id ?? null };
}

function cachedDetection(): FlightOrigin | null | undefined {
  const cached = read("session", DETECTED_KEY);
  if (cached === null) return undefined;
  try {
    return toOrigin(JSON.parse(cached));
  } catch {
    return undefined;
  }
}

let detection: Promise<FlightOrigin | null> | null = null;

/** Konumu bir kez sorar; aynı sayfadaki sonraki çağrılar aynı sonucu bekler. */
export function detectOrigin(): Promise<FlightOrigin | null> {
  if (detection) return detection;
  const cached = cachedDetection();
  if (cached !== undefined) return (detection = Promise.resolve(cached));

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  detection = fetch("/api/konum", { cache: "no-store", signal: controller.signal })
    .then((res) => (res.ok ? res.json() : null))
    .then((data: unknown) => {
      const origin = toOrigin(data);
      write("session", DETECTED_KEY, JSON.stringify(origin ?? {}));
      return origin;
    })
    .catch(() => null)
    .finally(() => window.clearTimeout(timer));
  return detection;
}

function initialState(): OriginState {
  const chosen = originById(read("local", CHOICE_KEY));
  if (chosen) return { origin: fromCity(chosen), status: "chosen" };
  const cached = cachedDetection();
  if (cached) return { origin: cached, status: "detected" };
  if (cached === null) return { origin: null, status: "unknown" };
  return { origin: null, status: "pending" };
}

/*
 * Ortak durum: uçuş animasyonu, biniş kartları ve varış kartı aynı kalkışı
 * gösterir; animasyonda şehir değiştirilince kartlar da hemen güncellenir.
 * Sunucuda (ve hidrasyonda) "pending": konum yalnız tarayıcıda bilinir, bu
 * yüzden sunucu HTML'i ile ilk istemci boyaması aynı kalır.
 */
interface OriginState {
  origin: FlightOrigin | null;
  status: OriginStatus;
}

const SERVER_STATE: OriginState = { origin: null, status: "pending" };
let current: OriginState | null = null;
const listeners = new Set<() => void>();

const snapshot = () => (current ??= initialState());

function update(next: OriginState) {
  current = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useFlightOrigin() {
  const state = useSyncExternalStore(subscribe, snapshot, () => SERVER_STATE);

  useEffect(() => {
    if (state.status !== "pending") return;
    detectOrigin().then((origin) => {
      // Bu arada şehir elle seçildiyse tespit sonucu onu ezmesin.
      if (snapshot().status !== "pending") return;
      update(origin ? { origin, status: "detected" } : { origin: null, status: "unknown" });
    });
  }, [state.status]);

  /** Ziyaretçinin seçtiği şehir; bu cihazda sonraki uçuşlar için hatırlanır. */
  const choose = useCallback((id: string) => {
    const city = originById(id);
    if (!city) return;
    write("local", CHOICE_KEY, city.id);
    update({ origin: fromCity(city), status: "chosen" });
  }, []);

  return { ...state, choose };
}

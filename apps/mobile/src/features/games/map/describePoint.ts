/**
 * Bir konumu metinle anlatır: ekran okuyucu kullanıcıları ve haritanın dışındaki metin alanları için.
 * Derece değerleri tam sayıya yuvarlanır (≈ 111 km); haritadaki dokunma hassasiyeti bundan daha inceydi,
 * ama konumu duyurmak için bu ayrıntı yeter. Yön harfleri Türkçe: K kuzey, G güney, D doğu, B batı.
 */
import { clampLatLng } from "./projection";

interface Parts {
  /** Yuvarlanmış mutlak enlem/boylam derecesi. */
  latDeg: number;
  lngDeg: number;
  /** "K" | "G" | "" (ekvatorda yön yok). */
  latDir: "K" | "G" | "";
  /** "D" | "B" | "" (başlangıç meridyeninde yön yok). */
  lngDir: "D" | "B" | "";
  hemisphere: "Kuzey yarımküre" | "Güney yarımküre" | "Ekvator";
}

function parts(lat: number, lng: number): Parts {
  const p = clampLatLng({ lat, lng });
  const latDeg = Math.round(Math.abs(p.lat));
  const lngDeg = Math.round(Math.abs(p.lng));
  const latDir = latDeg === 0 ? "" : p.lat < 0 ? "G" : "K";
  const lngDir = lngDeg === 0 ? "" : p.lng < 0 ? "B" : "D";
  const hemisphere = latDeg === 0 ? "Ekvator" : p.lat < 0 ? "Güney yarımküre" : "Kuzey yarımküre";
  return { latDeg, lngDeg, latDir, lngDir, hemisphere };
}

/**
 * Kısa biçim: `describePoint(35.7, 139.7)` → "Kuzey yarımküre, 36° K 140° D".
 * Ekvatorda "Ekvator, 0° 29° D", başlangıç meridyeninde "…, 51° K 0°". Geçersiz sayılar 0 sayılır.
 */
export function describePoint(lat: number, lng: number): string {
  const { latDeg, lngDeg, latDir, lngDir, hemisphere } = parts(lat, lng);
  const la = latDir ? `${latDeg}° ${latDir}` : `${latDeg}°`;
  const lo = lngDir ? `${lngDeg}° ${lngDir}` : `${lngDeg}°`;
  return `${hemisphere}, ${la} ${lo}`;
}

/**
 * Ekran okuyucuya uygun uzun biçim (harf kısaltması yok): `describePointSpoken(41, 29)` →
 * "Kuzey yarımküre, 41 derece kuzey, 29 derece doğu".
 */
export function describePointSpoken(lat: number, lng: number): string {
  const { latDeg, lngDeg, latDir, lngDir, hemisphere } = parts(lat, lng);
  const la = latDir ? `${latDeg} derece ${latDir === "K" ? "kuzey" : "güney"}` : "0 derece";
  const lo = lngDir ? `${lngDeg} derece ${lngDir === "D" ? "doğu" : "batı"}` : "0 derece";
  return `${hemisphere}, ${la}, ${lo}`;
}

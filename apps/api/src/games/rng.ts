import { getRandomValues } from "node:crypto";

/** [0, 1) aralığında sayı üreten kaynak. Motor rastgeleliği buradan alır; testte deterministik olanı verilir. */
export type Rng = () => number;

/** Üretim rastgeleliği: `crypto` tabanlı, 53 bit. Oyun sırları (hedef ve seçenek sırası) tahmin edilemez olmalı. */
export const cryptoRng: Rng = () => {
  const words = getRandomValues(new Uint32Array(2));
  return ((words[0]! >>> 5) * 67_108_864 + (words[1]! >>> 6)) / 9_007_199_254_740_992;
};

/** Testler için küçük, tohumlanabilir üreteç (mulberry32). Üretimde KULLANILMAZ. */
export function seededRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/** Fisher–Yates; girdiyi değiştirmez. */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** Yerine koymadan `count` öğe (kısmi Fisher–Yates). `count` öğe sayısını aşarsa hepsi, karışık döner. */
export function sample<T>(items: readonly T[], count: number, rng: Rng): T[] {
  const out = [...items];
  const take = Math.min(count, out.length);
  for (let i = 0; i < take; i++) {
    const j = i + Math.floor(rng() * (out.length - i));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out.slice(0, take);
}

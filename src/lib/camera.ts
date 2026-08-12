/**
 * Uçak penceresi kamera modeli.
 *
 * Sahnenin tamamı tek bir skaler ilerlemeden (`p`, 0 → 1) türetilir. Buradaki
 * fonksiyonların hepsi saftır: DOM'a dokunmazlar, bu yüzden Node içinde
 * doğrulanabilirler (`npx tsx scripts/camera.test.ts`).
 *
 * Hikâye — kamera ileri gider, pencere yerinde durur:
 *   1. Central Park en baştan görünür, ama ağır bulanık. Çerçeve normal boyda.
 *   2. Kaydırma başlar, kamera ilerler, çerçeve büyümeye başlar.
 *   3. Kamera yaklaşır, çerçeve büyür, park berraklaşır.
 *   4. Kamera camdan geçer; çerçeve devasadır ve kenarlardan taşar.
 *   5. Pencere tamamen gitmiştir, park tüm ekranı berrak biçimde doldurur.
 */

export const CAMERA = {
  /** Kamera harekete geçmeden önceki kısa duruş. */
  hold: 0.02,
  /** Çerçevenin görüntü alanını tamamen terk ettiği nokta. */
  pushEnd: 0.92,
  /** Çıkışın tartışmasız olması için temizlenme noktasının biraz ötesi. */
  clearMargin: 1.15,
  /** Uzaktaki dünyanın toplam büyümesi. Çerçevenin yanında çok küçüktür —
   *  derinlik hissini yaratan şey tam olarak bu orandır. */
  worldMax: 1.32,
} as const;

export interface Dims {
  w: number;
  h: number;
  cx: number;
  cy: number;
  glassW: number;
  glassH: number;
  bez: number;
  lip: number;
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Hermite smoothstep — bu dosyada hiçbir yerde doğrusal hareket yok. */
export const smooth = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

/** Yumuşak 0→1→0 darbesi; camdan geçme anındaki ışık parlamasında kullanılır. */
export const pulse = (x: number, a: number, b: number, c: number) =>
  x < b ? smooth(a, b, x) : 1 - smooth(b, c, x);

/**
 * Cam açıklığının tüm görüntü alanını kapladığı en küçük kamera ölçeği —
 * yani kabinin kadrajı tamamen terk ettiği kesin nokta.
 *
 * Sabit bir sayı yerine türetiliyor, çünkü değer görüntü alanının en-boy
 * oranına bağlı. Yuvarlatılmış dikdörtgenin köşe testine karşı ikili arama.
 */
export function scaleToClear(d: Dims): number {
  const a0 = d.glassW / 2;
  const b0 = d.glassH / 2;
  const r0 = d.glassW * 0.42;
  const X = d.w / 2;
  const Y = d.h / 2;

  const covers = (s: number) => {
    const a = a0 * s;
    const b = b0 * s;
    const r = r0 * s;
    if (X <= a - r && Y <= b) return true;
    if (Y <= b - r && X <= a) return true;
    const dx = X - (a - r);
    const dy = Y - (b - r);
    if (dx <= 0 || dy <= 0) return X <= a && Y <= b;
    return dx * dx + dy * dy <= r * r;
  };

  let lo = 1;
  let hi = 60;
  for (let i = 0; i < 48; i++) {
    const m = (lo + hi) / 2;
    if (covers(m)) hi = m;
    else lo = m;
  }
  return hi;
}

/**
 * Gerçek perspektif ileri hareketi (dolly).
 *
 * Sabit hızla bir düzleme yaklaşan bir kamerada görünen boyut `1/(d0 - vt)`
 * ile büyür: başta yavaş, eşiğe yaklaşırken patlayıcı. Camdan "içeri girme"
 * hissini veren şey bu hızlanmadır.
 *
 * Önceki sürüm `maxScale^(q^0.85)` kullanıyordu; bu eğri öne yüklüydü, yani
 * pencere daha ilk kaydırmada hızla şişip sonra sürünüyordu. Sonuç "pencereye
 * doğru uçuyorum" değil, "pencere büyüyor" gibi okunuyordu.
 *
 * q=0 → 1 (pencere normal boyda), q=1 → maxScale (kadrajı terk etmiş).
 */
export function dollyScale(q: number, maxScale: number): number {
  const t = clamp01(q);
  // Kameranın kat edeceği toplam mesafe, başlangıç mesafesinin oranı olarak.
  const travel = 1 - 1 / maxScale;
  return 1 / (1 - t * travel);
}

/**
 * Camın ötesindeki dünya. Aynı perspektif yasası, ama çok daha uzaktaki bir
 * düzlem için — bu yüzden çok daha az büyür.
 */
export function worldScale(q: number, max = CAMERA.worldMax): number {
  return dollyScale(q, max);
}

/**
 * Odak yığını. En bulanık katman en üstte durur; onu söndürmek altındaki
 * daha keskin katmanı açığa çıkarır. İki opaklık sürekli bir netleşme verir.
 *
 * `far` = ağır bulanık katman, `mid` = orta bulanık katman.
 * q=0'da park GÖRÜNÜR ama ağır bulanıktır; q=1'de tamamen keskindir.
 */
export function focus(q: number): { far: number; mid: number } {
  return {
    far: 1 - smooth(0, 0.55, q),
    mid: 1 - smooth(0.36, 0.96, q),
  };
}

/** Kamera ilerlemesi: ham kaydırmadan, duruş payı düşülmüş `q`. */
export const progress = (p: number) =>
  clamp01((p - CAMERA.hold) / (CAMERA.pushEnd - CAMERA.hold));

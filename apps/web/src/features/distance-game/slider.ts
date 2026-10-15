import { MAX_GUESS_KM, MIN_GUESS_KM } from "./scoring";

/* ------------------------------------------------------------------ *
 *  Logaritmik kaydırıcı: konum (0–1000 tam sayı) ↔ kilometre.
 *
 *  Doğrusal bir kaydırıcıda 10 km ile 100 km arası birkaç piksele sığar;
 *  logaritmik ölçekte her büyüklük mertebesi (10→100→1000→10000) aynı yeri
 *  kaplar, yani yakın mesafelerde de ince ayar yapılabilir.
 *
 *    km = MIN · (MAX / MIN) ^ (konum / STEPS)
 * ------------------------------------------------------------------ */

export const SLIDER_STEPS = 1000;
/** Her tur kaydırıcı buradan (≈ 450 km) başlar. */
export const START_POSITION = SLIDER_STEPS / 2;

const RATIO = MAX_GUESS_KM / MIN_GUESS_KM;

/**
 * Tahmini okunur bir değere yuvarlar: 3 anlamlı basamak, ama 1 km'den ince
 * değil (5573 → 5570, 447,2 → 447, 12,4 → 12, 15 380 → 15 400).
 */
export function roundKm(km: number): number {
  if (km <= 0) return 0;
  const unit = Math.max(1, 10 ** (Math.floor(Math.log10(km)) - 2));
  return Math.round(km / unit) * unit;
}

const clampPosition = (position: number) => Math.min(SLIDER_STEPS, Math.max(0, position));

/** Konum → tahmin (km), ekranda görünen yuvarlanmış değer. */
export function kmFromPosition(position: number): number {
  const exact = MIN_GUESS_KM * RATIO ** (clampPosition(position) / SLIDER_STEPS);
  return Math.min(MAX_GUESS_KM, Math.max(MIN_GUESS_KM, roundKm(exact)));
}

/** Km → konum (ondalıklı olabilir; kaydırıcı dışı işaretler için). */
export function positionFromKm(km: number): number {
  const clamped = Math.min(MAX_GUESS_KM, Math.max(MIN_GUESS_KM, km));
  return (Math.log(clamped / MIN_GUESS_KM) / Math.log(RATIO)) * SLIDER_STEPS;
}

/**
 * Ok tuşu / +− düğmesi için bir sonraki konum: gösterilen değeri GERÇEKTEN
 * değiştiren en yakın konum. Düşük değerlerde yuvarlama yüzünden komşu
 * konumlar aynı kilometreye düşebiliyor; tuşa basılınca bir şey olmasın istemiyoruz.
 */
export function stepPosition(position: number, direction: 1 | -1): number {
  const start = kmFromPosition(position);
  let next = clampPosition(position);
  for (;;) {
    const candidate = next + direction;
    // Uca vardık, değer değişmedi: yerinde kal.
    if (candidate < 0 || candidate > SLIDER_STEPS) return next;
    next = candidate;
    if (kmFromPosition(next) !== start) return next;
  }
}

/** Ölçek üzerindeki sabit işaretler (km). */
export const SLIDER_TICKS = [10, 100, 1000, 10000] as const;

import type { DestinationDietaryGuide } from "./types";
import { HALAL_REVIEW, type HalalReviewEntry } from "./halalReview.data";

export type { HalalReviewEntry } from "./halalReview.data";

/** Kanıtı olmayan ya da zayıf kaynaklı kayıtlarda gösterilen ortak uyarı (çeviri belleğinde mevcut). */
const COMMON_HALAL_NOTE =
  "Bağımsız güncel bir sertifika kaydı bulunmadığı için işletmeden et tedarikini, ortak mutfağı ve alkol politikasını yeniden teyit edin.";

const keyOf = (countryCode: string, city: string, name: string) => `${countryCode}|${city}|${name}`;

/**
 * Helal kayıtlarının web kanıtıyla denetiminin sonucu (halalReview.data.ts, 2026-11-03):
 *  - remove: işletme bulunamadı, helal olduğuna dair hiçbir kaynak yok ya da başka şehirde; kayıt gösterilmez.
 *  - downgrade: yalnız dizin/yorum kaynağı var; "restoran doğruladı"/"sertifikalı" iddiası düşürülür, ortak uyarı gösterilir.
 * Listede olup katalogda bulunmayan kayıt hata sayılır (yazım hatasını sessizce yutmamak için).
 */
export function applyHalalReview(
  guides: DestinationDietaryGuide[],
  review: readonly HalalReviewEntry[] = HALAL_REVIEW
): DestinationDietaryGuide[] {
  const actions = new Map(review.map((entry) => [keyOf(entry.countryCode, entry.city, entry.name), entry.action]));
  if (actions.size !== review.length) throw new Error("halalReview: yinelenen kayıt var");
  const matched = new Set<string>();

  const result = guides.map((guide) => {
    let changed = false;
    const halal = [];
    for (const restaurant of guide.halal) {
      const key = keyOf(guide.countryCode, guide.city, restaurant.name);
      const action = actions.get(key);
      if (!action) {
        halal.push(restaurant);
        continue;
      }
      matched.add(key);
      changed = true;
      if (action === "downgrade") {
        halal.push({
          ...restaurant,
          verification: { ...restaurant.verification, status: "verification-recommended" as const, note: COMMON_HALAL_NOTE },
        });
      }
    }
    return changed ? { ...guide, halal } : guide;
  });

  const missing = [...actions.keys()].filter((key) => !matched.has(key));
  if (missing.length) throw new Error(`halalReview: katalogda bulunamayan kayıt(lar): ${missing.join("; ")}`);
  return result;
}

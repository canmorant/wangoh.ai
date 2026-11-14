import { dietaryGuideFor } from "@/content/dietary";
import { HALAL_REVIEW } from "@/content/dietary/halalReview.data";
import { guideFor } from "@/content/guides";

/** Helal denetiminin siteye uygulandığı gün: kartı kaldırılan ya da etiketi düşürülen şehirlerin beslenme bölümü o gün değişti. */
const HALAL_REVIEW_APPLIED = "2026-11-03";
/** Helal kartı kalmayan şehirlerde beslenme bölümünün başlığı, giriş metni ve araştırma notu bu tarihte düzeltildi. */
const DIETARY_COPY_FIXED = "2026-11-13";

const reviewedCities = new Set(HALAL_REVIEW.map((entry) => `${entry.countryCode}:${entry.city}`));

/**
 * Şehir sayfasının görünen içeriğinin en son değiştiği gün (ISO, YYYY-AA-GG): rehberin editoryal kontrol tarihi ile
 * beslenme bölümündeki son değişikliğin büyüğü. Sitemap `lastmod`, Article `dateModified` ve sayfadaki
 * "son güncelleme" aynı değeri kullanır; içerik değiştiği hâlde tarih eski kalmasın diye tek yerde hesaplanır.
 */
export function cityLastModified(countryCode: string, city: string): string | undefined {
  const reviewed = guideFor(countryCode, city)?.reviewed;
  if (!reviewed) return undefined;
  const dietary = dietaryGuideFor(countryCode, city);
  const dietaryChanged =
    dietary && dietary.halal.length === 0 && dietary.vegan.length > 0
      ? DIETARY_COPY_FIXED
      : reviewedCities.has(`${countryCode}:${city}`)
        ? HALAL_REVIEW_APPLIED
        : undefined;
  return dietaryChanged && dietaryChanged > reviewed ? dietaryChanged : reviewed;
}

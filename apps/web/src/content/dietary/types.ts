export type DietaryCategory = "vegan" | "halal";

export type VeganServiceLevel = "fully-vegan" | "vegan-focused" | "vegan-options";

export type HalalVerificationStatus =
  | "certified-halal"
  | "restaurant-confirmed"
  | "halal-options"
  | "muslim-friendly"
  | "verification-recommended";

export type VerificationSourceType =
  | "certifier"
  | "official-tourism"
  | "restaurant"
  | "specialist-directory"
  | "vegan-directory";

export interface DietaryVerification {
  status: VeganServiceLevel | HalalVerificationStatus;
  sourceName: string;
  sourceUrl: string;
  sourceType: VerificationSourceType;
  /** Etiketin sınırları: alkol, ortak mutfak veya yeniden teyit ihtiyacı. */
  note: string;
}

export interface DietaryRestaurant {
  name: string;
  category: DietaryCategory;
  cuisine: string;
  area: string;
  description: string;
  why: string;
  price?: "Ekonomik" | "Orta" | "Yüksek";
  address?: string;
  officialUrl?: string;
  verification: DietaryVerification;
  /** Değişken restoran verisinin en son editoryal kontrolü (ISO). */
  lastVerified: string;
}

export interface DestinationDietaryGuide {
  countryCode: string;
  city: string;
  vegan: DietaryRestaurant[];
  halal: DietaryRestaurant[];
  /** Güçlü kanıt bulunamadığında boş kart üretmek yerine açık araştırma notu. */
  researchNote?: string;
}

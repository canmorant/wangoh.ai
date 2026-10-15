/** Wangoh'un herkese açık Google AdSense yayıncı kimliği. */
const DEFAULT_ADSENSE_CLIENT = "ca-pub-6471475848945529";

/** Gelecekte hesap değişirse Vercel ortam değişkeni varsayılanı geçersiz kılar. */
const candidate =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID?.trim() || DEFAULT_ADSENSE_CLIENT;

export const ADSENSE_CLIENT = /^ca-pub-\d+$/.test(candidate) ? candidate : null;
export const ADSENSE_PUBLISHER = ADSENSE_CLIENT?.replace(/^ca-/, "") ?? null;

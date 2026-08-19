/**
 * AdSense kimliği yalnızca Vercel ortam değişkeninden gelir. Kimlik yoksa veya
 * hatalıysa tarayıcıya Google reklam isteği gönderilmez.
 */
const candidate = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID?.trim() ?? "";

export const ADSENSE_CLIENT = /^ca-pub-\d+$/.test(candidate) ? candidate : null;
export const ADSENSE_PUBLISHER = ADSENSE_CLIENT?.replace(/^ca-/, "") ?? null;


/** Kanonik URL'ler ve paylaşım meta verisi için tek kaynak. */
export const SITE = {
  name: "Wangoh",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://wangoh.com",
  locale: "tr_TR",
  email: "info@wangoh.com",
  /**
   * Kamuya açık politika metinlerinde kullanılan işletmeci tanımı. Bir şirket
   * kurulduğunda veya marka bir ticari unvana bağlandığında tek yerden
   * güncellenebilir.
   */
  operator: "Wangoh internet sitesinin sahibi ve işletmecisi",
} as const;

export const absolute = (path: string) =>
  `${SITE.url.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

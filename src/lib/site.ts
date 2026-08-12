/** Kanonik URL'ler ve paylaşım meta verisi için tek kaynak. */
export const SITE = {
  name: "Wangoh",
  /** Yayına alırken gerçek alan adıyla değiştirin. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://wangoh.com",
  locale: "tr_TR",
} as const;

export const absolute = (path: string) =>
  `${SITE.url.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

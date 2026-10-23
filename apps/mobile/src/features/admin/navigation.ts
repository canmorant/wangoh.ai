import type { Href } from "expo-router";

/*
 * Tipli rotalar dosyası (`.expo/types/router.d.ts`) `expo` çalışınca yeniden üretilir; yeni eklenen rotalara giden
 * adresler burada tek yerde `Href`e dönüştürülür, tür denetimi üretilmiş dosyanın güncelliğine bağlı kalmaz.
 */

export type AdminSection = "users" | "posts" | "scores";

export const ADMIN_SECTIONS: readonly AdminSection[] = ["users", "posts", "scores"];

export function isAdminSection(value: unknown): value is AdminSection {
  return typeof value === "string" && (ADMIN_SECTIONS as readonly string[]).includes(value);
}

/** Yönetim girişi, isteğe bağlı bölüm ve (skorlar için) kullanıcı süzgeciyle. */
export function adminHref(section?: AdminSection, userId?: string): Href {
  const params: Record<string, string> = {};
  if (section) params.section = section;
  if (userId) params.userId = userId;
  return { pathname: "/admin", params } as Href;
}

export function adminUserHref(id: string): Href {
  return `/admin/users/${encodeURIComponent(id)}` as Href;
}

export function adminPostHref(slug: string): Href {
  return `/admin/post/${encodeURIComponent(slug)}` as Href;
}

export const ADMIN_NEW_POST_HREF = "/admin/new-post" as Href;

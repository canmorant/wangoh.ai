import { router, type Href } from "expo-router";

/**
 * Profil alt rotaları. `Href`e dönüştürülür: tipli rotalar (`.expo/types`, git'te yok) yalnız geliştirme
 * sunucusu çalışınca yenilenir; yeni rota eklenip tipler eskiyse de tip denetimi geçsin.
 */
export const EDIT_NAME_HREF = "/profile/edit-name" as Href;
export const CHANGE_PASSWORD_HREF = "/profile/change-password" as Href;
export const DELETE_ACCOUNT_HREF = "/profile/delete-account" as Href;

/** Profil alt ekranından geri: önceki ekran, geçmiş yoksa (web'de doğrudan açıldı) Profil kökü. */
export function goBackToProfile(): void {
  if (router.canGoBack()) router.back();
  else router.replace("/profile");
}

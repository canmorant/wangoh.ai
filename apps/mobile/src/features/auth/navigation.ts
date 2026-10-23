import { router, type Href } from "expo-router";

/**
 * Giriş/kayıt başarılı olunca modalı kapatıp kullanıcıyı döndürür.
 *  - Modal bir ekranın üstündeyse kapatılır; `returnTo` (AuthGate'in verdiği yol) varsa oraya dönülür.
 *  - Geçmiş yoksa (web'de doğrudan /login açıldı) `returnTo` ya da Profil açılır.
 */
export function leaveAuthFlow(returnTo: string | null): void {
  if (router.canDismiss()) {
    if (returnTo) router.dismissTo(returnTo as Href);
    else router.dismiss();
    return;
  }
  router.replace((returnTo ?? "/profile") as Href);
}

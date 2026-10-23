/** Kullanıcı yönetimi için saf kurallar ve Türkçe hata mesajları. */
import { getErrorMessage } from "../../api/errors";

export type UserAction = "role" | "disable" | "enable" | "delete";

export type UserRole = "user" | "admin";

export function roleLabel(role: UserRole | string): string {
  return role === "admin" ? "Yönetici" : "Kullanıcı";
}

/** Hedef kullanıcı, oturumdaki yöneticinin kendisi mi? */
export function isSelf(targetId: string, me: { id: string } | null | undefined): boolean {
  return me != null && me.id === targetId;
}

export const SELF_ACTION_MESSAGE =
  "Kendi hesabını burada değiştiremezsin: rolünü düşüremez, devre dışı bırakamaz ya da silemezsin. Hesap işlemleri için Profil sekmesini kullan.";

export const LAST_ADMIN_MESSAGE =
  "Bu, sistemdeki son aktif yönetici hesabı. Önce başka bir kullanıcıyı yönetici yap; ardından bu hesabın rolünü değiştirebilir, devre dışı bırakabilir ya da silebilirsin.";

const ACTION_FAILED: Record<UserAction, string> = {
  role: "Rol değiştirilemedi.",
  disable: "Hesap devre dışı bırakılamadı.",
  enable: "Hesap etkinleştirilemedi.",
  delete: "Kullanıcı silinemedi.",
};

/** Yönetici işlemi başarısız olunca gösterilecek anlaşılır Türkçe mesaj. */
export function describeUserActionError(error: unknown, action: UserAction): string {
  const status = (error as { status?: unknown } | null)?.status;
  const code = (error as { code?: unknown } | null)?.code;
  if (code === "LAST_ADMIN") return LAST_ADMIN_MESSAGE;
  if (status === 404) return "Kullanıcı bulunamadı; başka bir yönetici silmiş olabilir.";
  if (status === 403) return "Bu işlem için yönetici yetkin yok.";
  if (status === 401) return "Oturumun sona ermiş. Yeniden giriş yapıp tekrar dene.";
  return getErrorMessage(error, ACTION_FAILED[action]);
}

/** Silme onay penceresinin metni. Geri alınamaz uyarısı bilerek açıktır. */
export function deleteUserWarning(displayName: string): string {
  return `${displayName} kullanıcısı kalıcı olarak silinecek. Hesabıyla birlikte oyun oturumları ve puanları da silinir. Bu işlem geri alınamaz.`;
}

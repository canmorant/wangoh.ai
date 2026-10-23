/**
 * Oturum durumunun saf mantığı (React ve ağ yok, Node altında test edilir; bkz. authState.test.ts).
 *
 * Kural: `signedIn` durumunda `user` her zaman doludur; `restoring` ve `signedOut` durumlarında null.
 */
import type { AuthStatus, AuthUser } from "./AuthContext";

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
}

export type AuthAction =
  /** Giriş, kayıt ya da kayıtlı oturumun geri yüklenmesi (önbellekten ya da sunucudan doğrulanmış). */
  | { type: "signedIn"; user: AuthUser }
  /** Profil güncellemesi: yalnız aynı kullanıcı için ve oturum açıkken uygulanır. */
  | { type: "userUpdated"; user: AuthUser }
  | { type: "signedOut" };

export const initialAuthState: AuthState = { status: "restoring", user: null };

export function isSameUser(a: AuthUser | null, b: AuthUser | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.id === b.id && a.email === b.email && a.displayName === b.displayName && a.role === b.role;
}

/**
 * Durum değişmediyse AYNI nesneyi döndürür; böylece gereksiz yeniden çizim olmaz (ör. arka planda
 * doğrulama aynı kullanıcıyı yeniden bildirdiğinde).
 */
export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "signedIn":
      if (state.status === "signedIn" && isSameUser(state.user, action.user)) return state;
      return { status: "signedIn", user: action.user };
    case "userUpdated":
      if (state.status !== "signedIn" || !state.user || state.user.id !== action.user.id) return state;
      if (isSameUser(state.user, action.user)) return state;
      return { status: "signedIn", user: action.user };
    case "signedOut":
      if (state.status === "signedOut") return state;
      return { status: "signedOut", user: null };
  }
}

/** API kullanıcısından (UserDto) oturum kullanıcısı; bilinmeyen rol en düşük yetkiye (`user`) iner. */
export function toAuthUser(dto: { id: string; email: string; displayName: string; role: string }): AuthUser {
  return { id: dto.id, email: dto.email, displayName: dto.displayName, role: dto.role === "admin" ? "admin" : "user" };
}

/**
 * Çıkışta (ya da oturum reddinde) sorgu önbelleği yalnız ÖNCEKİ durum oturumluysa boşaltılır: kullanıcıya
 * ait veri (istatistik, skorlar) sonraki hesaba sızmasın.
 *
 * `restoring` ya da zaten `signedOut` iken boşaltmak HATADIR: açılışta belirteç yoksa oturumsuz duruma geçilir
 * ve bu sırada Keşfet/Blog gibi herkese açık ekranların ilk istekleri sürmektedir; `queryClient.clear()` bu
 * sorguları iptal eder (net::ERR_ABORTED), ekran iskelette kalır.
 */
export function shouldClearQueryCache(previous: AuthStatus): boolean {
  return previous === "signedIn";
}

export function isAdminUser(user: AuthUser | null): boolean {
  return user?.role === "admin";
}

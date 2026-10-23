/**
 * Oturum arayüzü (sabit sözleşme). Ekranlar yalnız `useAuth()` ile bu arayüzü kullanır; gerçek
 * uygulama `AuthProvider.tsx` içindedir ve `app/_layout.tsx` içinde QueryClientProvider'ın altına
 * takılır.
 */
import { createContext, useContext } from "react";

export type AuthStatus = "restoring" | "signedOut" | "signedIn";

export type AuthRole = "user" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: AuthRole;
}

/** `POST /v1/auth/register` gövdesi (belge bölüm 5). */
export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthContextValue {
  /** `restoring`: kayıtlı belirteç okunuyor; bu sürede açılış ekranı açık kalır. `signedIn` iken `user` her zaman doludur. */
  status: AuthStatus;
  user: AuthUser | null;
  isAdmin: boolean;
  /** Hata `ApiError` olarak fırlar (`describeAuthError` ile Türkçe mesaja çevrilir). Başarıda oturum açık ve önbellek tazedir. */
  signIn(email: string, password: string): Promise<void>;
  register(input: RegisterInput): Promise<void>;
  /** Yerel oturum hemen kapanır; sunucudaki yenileme belirtecini iptal etme en iyi çabayla yapılır. */
  signOut(): Promise<void>;
  /** Profil güncellemesinden dönen kullanıcıyı oturuma işler (ör. görünen ad değişti). Oturum yoksa ya da kimlik farklıysa yok sayılır. */
  updateUser(user: AuthUser): void;
  /** Sunucudaki güncel kullanıcıyı çeker (`GET /v1/auth/me`) ve oturuma işler. Başarısızlıkta fırlatır; oturumu düşürmez. */
  refreshUser(): Promise<void>;
}

const NOT_READY_MESSAGE = "Oturum servisi hazır değil: ekran AuthProvider dışında kullanıldı.";

/** Provider dışında (ör. yalıtılmış bir ekran testi) güvenli varsayılan: oturum yok, eylemler reddedilir. */
const fallbackValue: AuthContextValue = {
  status: "signedOut",
  user: null,
  isAdmin: false,
  signIn: () => Promise.reject(new Error(NOT_READY_MESSAGE)),
  register: () => Promise.reject(new Error(NOT_READY_MESSAGE)),
  signOut: () => Promise.resolve(),
  updateUser: () => undefined,
  refreshUser: () => Promise.reject(new Error(NOT_READY_MESSAGE)),
};

export const AuthContext = createContext<AuthContextValue>(fallbackValue);

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

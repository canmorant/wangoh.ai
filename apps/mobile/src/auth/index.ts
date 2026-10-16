/**
 * Oturum arayüzü (sabit sözleşme). Ekranlar yalnız `useAuth()` ile bu arayüzü kullanır.
 *
 * YAPILACAK: Gerçek `AuthProvider` sonraki görevde yazılacak (belirteç geri yükleme, giriş, kayıt,
 * çıkış, `useAuthMe` ile kullanıcı, `setupApi` bağlantısı). Provider, aşağıdaki `AuthContext`'e
 * `AuthContextValue` sağlamalı ve `app/_layout.tsx` içindeki işaretli yere eklenmelidir.
 * O zamana kadar bağlam, ekranların derlenip çalışması için "oturum yok" değeri döndürür.
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
  /** `restoring`: kayıtlı belirteç okunuyor/doğrulanıyor; bu sürede açılış ekranı açık kalır. */
  status: AuthStatus;
  user: AuthUser | null;
  isAdmin: boolean;
  signIn(email: string, password: string): Promise<void>;
  register(input: RegisterInput): Promise<void>;
  signOut(): Promise<void>;
}

const PLACEHOLDER_MESSAGE = "Oturum servisi henüz hazır değil (AuthProvider yapılacak).";

/** YAPILACAK: AuthProvider yazılınca bu değer kullanılmaz. */
const placeholderValue: AuthContextValue = {
  status: "signedOut",
  user: null,
  isAdmin: false,
  signIn: () => Promise.reject(new Error(PLACEHOLDER_MESSAGE)),
  register: () => Promise.reject(new Error(PLACEHOLDER_MESSAGE)),
  signOut: () => Promise.resolve(),
};

export const AuthContext = createContext<AuthContextValue>(placeholderValue);

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

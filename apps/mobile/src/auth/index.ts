/**
 * Oturum arayüzü. Ekranlar yalnız `useAuth()` (ve giriş isteyen ekranlar `AuthGate`) kullanır.
 * Sağlayıcı `app/_layout.tsx` içinde QueryClientProvider'ın altına takılır.
 */
export {
  AuthContext,
  useAuth,
  type AuthContextValue,
  type AuthRole,
  type AuthStatus,
  type AuthUser,
  type RegisterInput,
} from "./AuthContext";
export { AuthGate, type AuthGateProps } from "./AuthGate";
export { AuthProvider, type AuthProviderProps } from "./AuthProvider";

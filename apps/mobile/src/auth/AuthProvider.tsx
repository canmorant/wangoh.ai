/**
 * Oturum sağlayıcısı. QueryClientProvider'ın İÇİNDE durur (kancalar ve önbellek temizliği için) ve
 * API istemcisinin kurulumunu da üstlenir: belirteç deposu + oturum kapatma işleyicisi burada bağlanır.
 *
 * Açılış (restoreSession.ts) ve hata davranışı:
 *   - Kayıtlı belirteç + yerel kullanıcı kopyası varsa ağ beklenmez, oturum hemen açılır; `GET /v1/auth/me`
 *     arka planda doğrular. Çevrimdışı açılışta oturum DÜŞMEZ, uygulama öne her dönüşünde doğrulama tekrarlanır.
 *   - Sunucu belirteci reddederse (yenileme belirteci geçersiz, hesap silinmiş/devre dışı) `onAuthFailure`
 *     ya da 401/403 ile yerel çıkış yapılır: belirteçler silinir, sorgu önbelleği boşaltılır.
 *   - `status === "restoring"` hiçbir koşulda sonsuz sürmez: ağ doğrulaması 8 sn, tüm geri yükleme 12 sn ile sınırlıdır.
 */
import { useQueryClient } from "@tanstack/react-query";
import { authMe, useAuthLogin, useAuthLogout, useAuthRegister, type AuthResponseDto } from "@wangoh/api-client";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AppState } from "react-native";

import { setupApi } from "@/api/setup";

import { AuthContext, type AuthContextValue, type AuthUser, type RegisterInput } from "./AuthContext";
import {
  authReducer,
  initialAuthState,
  isAdminUser,
  isSameUser,
  shouldClearQueryCache,
  toAuthUser,
  type AuthAction,
  type AuthState,
} from "./authState";
import { normalizeDisplayName, normalizeEmail } from "./authValidation";
import { restoreSession } from "./restoreSession";
import { tokenStorage } from "./tokenStorage";
import { userCache } from "./userCache";

/** `GET /v1/auth/me` doğrulamasının en uzun bekleme süresi. */
export const VERIFY_TIMEOUT_MS = 8_000;
/** Geri yükleme (depo okuma dahil) bu süreyi aşarsa oturumsuz gösterilir; açılış ekranı takılmaz. */
export const RESTORE_WATCHDOG_MS = 12_000;
/** Çıkışta sunucu çağrısını beklemenin üst sınırı; yerel çıkış zaten yapılmıştır. */
export const LOGOUT_TIMEOUT_MS = 4_000;

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>(initialAuthState);
  // Geri çağırmalar (api-client, AppState) her zaman en son durumu görsün diye senkron tutulan kopya.
  const stateRef = useRef<AuthState>(initialAuthState);
  // Oturum her değiştiğinde (giriş, çıkış, ret) artar; geç kalan eski sonuçlar bununla elenir.
  const epochRef = useRef(0);
  // Son doğrulama ağ/sunucu sorunuyla yapılamadı: öne dönünce tekrar denenecek.
  const needsVerifyRef = useRef(false);
  const restoringRef = useRef(false);

  const loginMutation = useAuthLogin();
  const registerMutation = useAuthRegister();
  const logoutMutation = useAuthLogout();

  const dispatch = useCallback((action: AuthAction) => {
    const next = authReducer(stateRef.current, action);
    if (next === stateRef.current) return;
    stateRef.current = next;
    setState(next);
  }, []);

  /**
   * Yerel çıkış: durum, belirteçler ve kullanıcı kopyası. Tekrar çağrılması zararsızdır (ör. api-client'ın
   * `onAuthFailure`'ı birden çok istekten gelebilir). Sorgu önbelleği YALNIZ önceki durum oturumluysa boşaltılır
   * (`shouldClearQueryCache`): açılışta belirteç yoksa `restoring -> signedOut` geçişinde boşaltmak, herkese açık
   * ekranların sürmekte olan ilk isteklerini iptal ederdi.
   */
  const clearLocalSession = useCallback(async () => {
    epochRef.current += 1;
    needsVerifyRef.current = false;
    const clearQueries = shouldClearQueryCache(stateRef.current.status);
    dispatch({ type: "signedOut" });
    await Promise.all([tokenStorage.clear(), userCache.clear()]);
    if (clearQueries) queryClient.clear();
  }, [dispatch, queryClient]);

  // API istemcisi, ilk çizimde (çocukların ilk isteğinden önce) bir kez kurulur. Yeniden çağırmak güvenlidir.
  useState(() => {
    setupApi({
      getTokens: () => tokenStorage.read(),
      saveTokens: async (tokens) => {
        await tokenStorage.write(tokens);
      },
      onAuthFailure: () => {
        void clearLocalSession();
      },
    });
    return true;
  });

  const applySession = useCallback(
    async (response: AuthResponseDto) => {
      const user = toAuthUser(response.user);
      const previous = stateRef.current.user;
      epochRef.current += 1;
      needsVerifyRef.current = false;
      await tokenStorage.write({ accessToken: response.accessToken, refreshToken: response.refreshToken });
      await userCache.write(user);
      // Başka bir hesaba geçildiyse önceki kullanıcıya ait veri kalmasın.
      if (previous && previous.id !== user.id) queryClient.clear();
      dispatch({ type: "signedIn", user });
      // Oturum bilgisine göre değişen sorgular (ör. liderlikte "ben") tazelenir.
      void queryClient.invalidateQueries();
    },
    [dispatch, queryClient],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const response = await loginMutation.mutateAsync({ data: { email: normalizeEmail(email), password } });
      await applySession(response);
    },
    [applySession, loginMutation.mutateAsync],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const response = await registerMutation.mutateAsync({
        data: {
          email: normalizeEmail(input.email),
          password: input.password,
          displayName: normalizeDisplayName(input.displayName),
        },
      });
      await applySession(response);
    },
    [applySession, registerMutation.mutateAsync],
  );

  const signOut = useCallback(async () => {
    const tokens = await tokenStorage.read();
    // Sunucu çağrısı yerel temizlikten ÖNCE başlatılır (queryClient.clear() mutasyon önbelleğini de boşaltır);
    // başarısızlığı yutulur: ağ yoksa bile kullanıcı çıkış yapabilmeli, belirteç zaten yerelde silinir.
    const remote = tokens
      ? logoutMutation.mutateAsync({ data: { refreshToken: tokens.refreshToken } }).then(
          () => undefined,
          () => undefined,
        )
      : Promise.resolve();
    await clearLocalSession();
    await Promise.race([remote, new Promise<void>((resolve) => setTimeout(resolve, LOGOUT_TIMEOUT_MS))]);
  }, [clearLocalSession, logoutMutation.mutateAsync]);

  const updateUser = useCallback(
    (user: AuthUser) => {
      dispatch({ type: "userUpdated", user });
      if (isSameUser(stateRef.current.user, user)) void userCache.write(user);
    },
    [dispatch],
  );

  const refreshUser = useCallback(async () => {
    const epoch = epochRef.current;
    const user = toAuthUser(await authMe());
    if (epochRef.current !== epoch) return;
    updateUser(user);
  }, [updateUser]);

  const runRestore = useCallback(async () => {
    if (restoringRef.current) return;
    restoringRef.current = true;
    const epoch = epochRef.current;
    try {
      const outcome = await restoreSession({
        readTokens: () => tokenStorage.read(),
        readCachedUser: () => userCache.read(),
        fetchMe: async () => toAuthUser(await authMe()),
        saveUser: (user) => userCache.write(user),
        clearSession: clearLocalSession,
        emit: dispatch,
        isStale: () => epochRef.current !== epoch,
        verifyTimeoutMs: VERIFY_TIMEOUT_MS,
      });
      // "stale": oturum arada değişti (giriş/çıkış/ret); bayrağı o yol zaten ayarladı.
      if (outcome !== "stale") needsVerifyRef.current = outcome === "unverified";
    } finally {
      restoringRef.current = false;
    }
  }, [clearLocalSession, dispatch]);

  useEffect(() => {
    void runRestore();
    // Depo ya da ağ takılsa da açılış ekranı sonsuza dek açık kalmasın. Epoch artırılmaz: geç gelen
    // doğrulama yine de oturumu açabilir.
    const watchdog = setTimeout(() => {
      if (stateRef.current.status !== "restoring") return;
      needsVerifyRef.current = true;
      dispatch({ type: "signedOut" });
    }, RESTORE_WATCHDOG_MS);
    return () => clearTimeout(watchdog);
  }, [dispatch, runRestore]);

  // Doğrulanamayan oturum (çevrimdışı açılış) uygulama öne her dönüşünde yeniden denenir.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (next) => {
      if (next === "active" && needsVerifyRef.current) void runRestore();
    });
    return () => subscription.remove();
  }, [runRestore]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status: state.status,
      user: state.user,
      isAdmin: isAdminUser(state.user),
      signIn,
      register,
      signOut,
      updateUser,
      refreshUser,
    }),
    [state, signIn, register, signOut, updateUser, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

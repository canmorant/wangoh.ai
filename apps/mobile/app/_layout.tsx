import { QueryClientProvider } from "@tanstack/react-query";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, ThemeProvider, type ErrorBoundaryProps } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createQueryClient, setupQueryFocusManager } from "@/api/setup";
import { AuthProvider, useAuth } from "@/auth";
import { ErrorState, Screen, navigationTheme, stackScreenOptions } from "@/ui";

// Açılış ekranı, yazı tipleri ve oturum geri yüklemesi bitene kadar açık kalır (SplashGate).
SplashScreen.preventAutoHideAsync().catch(() => undefined);

// API istemcisi AuthProvider içinde kurulur (belirteç deposu ve oturum kapatma işleyicisi orada bağlanır).
setupQueryFocusManager();

/** Açılış ekranı, yazı tipi ya da oturum geri yüklemesi ne olursa olsun bu süreden sonra kapanır. */
const SPLASH_TIMEOUT_MS = 10_000;

/** Beklenmeyen çizim hataları için yedek ekran. Ayrıntı yalnız geliştirmede gösterilir. */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <Screen>
      <ErrorState
        title="Uygulamada bir hata oluştu"
        message={__DEV__ ? error.message : "Beklenmeyen bir sorun çıktı. Lütfen tekrar dene."}
        onRetry={() => {
          void retry();
        }}
      />
    </Screen>
  );
}

/**
 * Hazır olunca açılış ekranını kapatır: simge yazı tipi yüklendi ve oturum geri yüklemesi bitti.
 * Takılma güvenliği: bunlardan biri yanıt vermezse de `SPLASH_TIMEOUT_MS` sonra kapanır.
 */
function SplashGate({ fontsReady }: { fontsReady: boolean }) {
  const { status } = useAuth();
  const [timedOut, setTimedOut] = useState(false);
  const ready = timedOut || (fontsReady && status !== "restoring");

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), SPLASH_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  return null;
}

export default function RootLayout() {
  // Sağlayıcı yeniden çizimlerde aynı istemciyi korumak için durumda tutulur.
  const [queryClient] = useState(createQueryClient);
  // Sekme simgeleri ilk çizimde boş görünmesin diye önceden yüklenir; hata olsa da uygulama açılır.
  const [fontsLoaded, fontError] = useFonts(Ionicons.font);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider value={navigationTheme}>
            <StatusBar style="light" />
            <SplashGate fontsReady={fontsLoaded || fontError !== null} />
            <Stack screenOptions={stackScreenOptions}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" options={{ presentation: "modal" }} />
              <Stack.Screen name="ui-kit" />
            </Stack>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

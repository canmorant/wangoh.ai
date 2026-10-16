import { QueryClientProvider } from "@tanstack/react-query";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, ThemeProvider, type ErrorBoundaryProps } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createQueryClient, setupApi, setupQueryFocusManager } from "@/api/setup";
import { useAuth } from "@/auth";
import { tokenStorage } from "@/auth/tokenStorage";
import { ErrorState, Screen, navigationTheme, stackScreenOptions } from "@/ui";

// Açılış ekranı, yazı tipleri ve oturum geri yüklemesi bitene kadar açık kalır (SplashGate).
SplashScreen.preventAutoHideAsync().catch(() => undefined);

// API istemcisi uygulama açılışında bir kez kurulur (belge bölüm 10). Keşfet ve Blog herkese açık
// olduğundan bu kurulum oturumdan bağımsız çalışır.
// YAPILACAK(AuthProvider): oturum durumunu da güncelleyen onAuthFailure ile bu çağrı AuthProvider'a taşınacak.
setupApi({
  getTokens: () => tokenStorage.read(),
  saveTokens: async (tokens) => {
    await tokenStorage.write(tokens);
  },
  onAuthFailure: () => {
    void tokenStorage.clear();
  },
});
setupQueryFocusManager();

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

/** Hazır olunca açılış ekranını kapatır: simge yazı tipi yüklendi ve oturum geri yüklemesi bitti. */
function SplashGate({ fontsReady }: { fontsReady: boolean }) {
  const { status } = useAuth();
  const ready = fontsReady && status !== "restoring";

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
        {/* YAPILACAK(AuthProvider): <AuthProvider> burada, QueryClientProvider'ın içinde sarmalayacak. */}
        <ThemeProvider value={navigationTheme}>
          <StatusBar style="light" />
          <SplashGate fontsReady={fontsLoaded || fontError !== null} />
          <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" options={{ presentation: "modal" }} />
            <Stack.Screen name="ui-kit" />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

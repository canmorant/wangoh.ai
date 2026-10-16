import { DarkTheme, type Theme } from "expo-router";
import type { NativeStackNavigationOptions } from "expo-router";

import { colors } from "@/theme";

/** Gezinti zemini lacivert; geçişlerde ve ilk açılışta beyaz/siyah parlama olmasın. */
export const navigationTheme: Theme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: colors.gold,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.danger,
  },
};

/**
 * Her yığının ortak ayarı. Yerel başlık çubuğu kapalı: ekranlar `<Header />` ile kendi başlığını
 * çizer (iOS, Android ve web önizlemede aynı görünüm). Geri kaydırma hareketi ve Android geri
 * tuşu yine yığın tarafından yönetilir.
 */
export const stackScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
};

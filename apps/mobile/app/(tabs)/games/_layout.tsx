import { Stack } from "expo-router";

import { stackScreenOptions } from "@/ui";

/**
 * Oyunlar sekmesinin yığını: merkez, oyun, sonuç ve liderlik (src/features/games).
 * Oyun ekranında kenar kaydırmayla geri gitmek kapalıdır: çıkış, onay penceresi olan geri düğmesi
 * ve Android geri tuşu (beforeRemove) üzerinden yapılır.
 */
export default function GamesLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="play/[gameType]" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

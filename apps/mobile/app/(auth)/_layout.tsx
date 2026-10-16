import { Stack } from "expo-router";

import { stackScreenOptions } from "@/ui";

/** Giriş ve kayıt, kök yığında modal olarak açılır (app/_layout.tsx). Özellik: src/features/auth. */
export default function AuthLayout() {
  return <Stack screenOptions={stackScreenOptions} />;
}

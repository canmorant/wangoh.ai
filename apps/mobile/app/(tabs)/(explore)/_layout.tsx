import { Stack } from "expo-router";

import { stackScreenOptions } from "@/ui";

/**
 * Bu sekmenin kendi yığını: kıta, ülke, şehir ve arama ekranları (src/features/explore).
 * Derin bağlantıyla açılan ekranda geri gidecek yer yoksa her ekran kendi üstüne (şehir -> ülke -> Keşfet)
 * `replace` eder; `unstable_settings` kullanılmaz çünkü tüm adres parametrelerini alt rotaya sızdırıp
 * adres çubuğunu (`/?code=JP&slug=tokyo`) kirletir.
 */
export default function ExploreLayout() {
  return <Stack screenOptions={stackScreenOptions} />;
}

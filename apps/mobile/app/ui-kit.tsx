import { Redirect } from "expo-router";

import { config } from "@/config";
import { UiKitScreen } from "@/features/dev";

/** Bileşen galerisi: geliştirmede açık, yayında yalnız EXPO_PUBLIC_UI_KIT=1 ile (bkz. src/config.ts). */
export default function UiKitRoute() {
  return config.showUiKit ? <UiKitScreen /> : <Redirect href="/" />;
}

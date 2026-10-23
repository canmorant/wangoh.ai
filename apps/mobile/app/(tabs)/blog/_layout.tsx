import { Stack } from "expo-router";

import { stackScreenOptions } from "@/ui";

/** Derin bağlantıyla (ör. `/blog/japonya-gezi-rehberi`) açılan ekranın altında blog listesi bulunur. */
export const unstable_settings = { initialRouteName: "index" };

/** Bu sekmenin kendi yığını: liste ve yazı ayrıntısı (src/features/blog). */
export default function BlogLayout() {
  return <Stack screenOptions={stackScreenOptions} />;
}

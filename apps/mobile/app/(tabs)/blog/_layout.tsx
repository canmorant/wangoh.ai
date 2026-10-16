import { Stack } from "expo-router";

import { stackScreenOptions } from "@/ui";

/** Bu sekmenin kendi yığını: ayrıntı ekranları buraya eklenir (src/features/blog). */
export default function BlogLayout() {
  return <Stack screenOptions={stackScreenOptions} />;
}

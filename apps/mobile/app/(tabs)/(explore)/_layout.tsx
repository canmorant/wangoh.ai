import { Stack } from "expo-router";

import { stackScreenOptions } from "@/ui";

/** Bu sekmenin kendi yığını: ayrıntı ekranları buraya eklenir (src/features/explore). */
export default function ExploreLayout() {
  return <Stack screenOptions={stackScreenOptions} />;
}

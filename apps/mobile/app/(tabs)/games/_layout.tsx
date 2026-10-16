import { Stack } from "expo-router";

import { stackScreenOptions } from "@/ui";

/** Bu sekmenin kendi yığını: ayrıntı ekranları buraya eklenir (src/features/games). */
export default function GamesLayout() {
  return <Stack screenOptions={stackScreenOptions} />;
}

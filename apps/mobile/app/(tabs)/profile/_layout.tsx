import { Stack } from "expo-router";

import { stackScreenOptions } from "@/ui";

/** Bu sekmenin kendi yığını: ayrıntı ekranları buraya eklenir (src/features/profile). */
export default function ProfileLayout() {
  return <Stack screenOptions={stackScreenOptions} />;
}

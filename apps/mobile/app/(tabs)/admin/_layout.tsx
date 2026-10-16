import { Stack } from "expo-router";

import { stackScreenOptions } from "@/ui";

/** Bu sekmenin kendi yığını: ayrıntı ekranları buraya eklenir (src/features/admin). */
export default function AdminLayout() {
  return <Stack screenOptions={stackScreenOptions} />;
}

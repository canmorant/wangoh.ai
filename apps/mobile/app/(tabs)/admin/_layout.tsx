import { Stack } from "expo-router";

import { stackScreenOptions } from "@/ui";

/** Derin bağlantıyla (ör. `/admin/users/<id>`) açılan ekranın altında yönetim girişi bulunur. */
export const unstable_settings = { initialRouteName: "index" };

/** Bu sekmenin kendi yığını: yönetim girişi, kullanıcı ayrıntısı, yazı formları (src/features/admin). */
export default function AdminLayout() {
  return <Stack screenOptions={stackScreenOptions} />;
}

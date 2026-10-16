import { useRouter } from "expo-router";

import { EmptyState, Screen } from "@/ui";

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <Screen>
      <EmptyState
        icon="map-outline"
        title="Sayfa bulunamadı"
        message="Aradığın sayfa taşınmış ya da hiç var olmamış olabilir."
        actionLabel="Keşfet'e dön"
        onAction={() => router.replace("/")}
      />
    </Screen>
  );
}

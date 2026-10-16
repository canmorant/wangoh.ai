import { useRouter } from "expo-router";

import { useAuth } from "@/auth";
import { EmptyState, Header, Screen } from "@/ui";

/** YER TUTUCU: Oyun listesi ve oyunlar sonraki görevde yazılacak. Oyunlar giriş ister (belge bölüm 8, 10). */
export function GamesScreen() {
  const router = useRouter();
  const { status } = useAuth();
  const signedIn = status === "signedIn";

  return (
    <Screen header={<Header title="Oyunlar" subtitle="Bayrak, başkent ve harita oyunları" />}>
      <EmptyState
        icon="game-controller-outline"
        title={signedIn ? "Oyunlar yakında burada" : "Oyunlar için giriş yap"}
        message={
          signedIn
            ? "Bayrak, başkent ve harita oyunları bu ekranda olacak."
            : "Puanların hesabına bağlı tutulur. Oynamak için önce giriş yapmalısın."
        }
        actionLabel={signedIn ? undefined : "Giriş yap"}
        onAction={signedIn ? undefined : () => router.push("/login")}
      />
    </Screen>
  );
}

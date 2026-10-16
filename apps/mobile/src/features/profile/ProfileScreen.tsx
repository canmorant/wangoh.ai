import { useRouter } from "expo-router";

import { useAuth } from "@/auth";
import { EmptyState, Header, Screen } from "@/ui";

/** YER TUTUCU: Profil (hesap, istatistik, hesabı silme) sonraki görevde yazılacak. */
export function ProfileScreen() {
  const router = useRouter();
  const { status, user } = useAuth();
  const signedIn = status === "signedIn" && user !== null;

  return (
    <Screen header={<Header title="Profil" subtitle={signedIn ? user.displayName : undefined} />}>
      <EmptyState
        icon="person-circle-outline"
        title={signedIn ? "Profil yakında burada" : "Henüz giriş yapmadın"}
        message={
          signedIn
            ? "Hesap bilgilerin ve oyun istatistiklerin bu ekranda olacak."
            : "Giriş yapınca hesabını ve oyun istatistiklerini burada görürsün."
        }
        actionLabel={signedIn ? undefined : "Giriş yap"}
        onAction={signedIn ? undefined : () => router.push("/login")}
      />
    </Screen>
  );
}

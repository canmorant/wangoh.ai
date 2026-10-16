import { useRouter } from "expo-router";

import { EmptyState, Header, Screen } from "@/ui";

/** YER TUTUCU: Giriş formu sonraki görevde yazılacak (useAuth().signIn). */
export function LoginScreen() {
  const router = useRouter();
  return (
    <Screen
      edges={["top", "bottom", "left", "right"]}
      keyboardAvoiding
      header={<Header title="Giriş yap" back />}
    >
      <EmptyState
        icon="log-in-outline"
        title="Giriş yakında burada"
        message="E-posta ve parolanla oturum açacaksın."
        actionLabel="Hesap oluştur"
        onAction={() => router.push("/register")}
      />
    </Screen>
  );
}

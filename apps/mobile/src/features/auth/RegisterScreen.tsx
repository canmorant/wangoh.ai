import { EmptyState, Header, Screen } from "@/ui";

/** YER TUTUCU: Kayıt formu sonraki görevde yazılacak (useAuth().register). */
export function RegisterScreen() {
  return (
    <Screen
      edges={["top", "bottom", "left", "right"]}
      keyboardAvoiding
      header={<Header title="Hesap oluştur" back />}
    >
      <EmptyState
        icon="person-add-outline"
        title="Kayıt yakında burada"
        message="E-posta, parola ve görünen adınla hesap oluşturacaksın."
      />
    </Screen>
  );
}

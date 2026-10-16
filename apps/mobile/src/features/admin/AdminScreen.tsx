import { useAuth } from "@/auth";
import { EmptyState, Header, Screen } from "@/ui";

/**
 * YER TUTUCU: Yönetim (kullanıcılar, blog yazıları) sonraki görevde yazılacak.
 * Sekme yalnız yöneticiye görünür (app/(tabs)/_layout.tsx); yetki denetimi asıl olarak API'dedir.
 */
export function AdminScreen() {
  const { isAdmin } = useAuth();

  return (
    <Screen header={<Header title="Yönetim" subtitle="Kullanıcılar ve blog yazıları" />}>
      <EmptyState
        icon={isAdmin ? "shield-checkmark-outline" : "lock-closed-outline"}
        title={isAdmin ? "Yönetim yakında burada" : "Bu alan yöneticilere açık"}
        message={
          isAdmin
            ? "Kullanıcıları ve blog yazılarını bu ekrandan yöneteceksin."
            : "Bu ekranı görmek için yönetici hesabıyla giriş yapmalısın."
        }
      />
    </Screen>
  );
}

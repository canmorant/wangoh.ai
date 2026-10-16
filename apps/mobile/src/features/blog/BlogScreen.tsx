import { EmptyState, Header, Screen } from "@/ui";

/** YER TUTUCU: Blog listesi sonraki görevde yazılacak. */
export function BlogScreen() {
  return (
    <Screen header={<Header title="Blog" subtitle="Gezi yazıları ve rota fikirleri" />}>
      <EmptyState
        icon="newspaper-outline"
        title="Blog yakında burada"
        message="Gezi yazıları ve rota fikirleri bu ekranda listelenecek."
      />
    </Screen>
  );
}

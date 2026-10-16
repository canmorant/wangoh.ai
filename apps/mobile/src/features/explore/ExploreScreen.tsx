import { EmptyState, Header, Screen } from "@/ui";

/** YER TUTUCU: Keşfet (kıtalar → ülkeler → şehir rehberi) sonraki görevde yazılacak. */
export function ExploreScreen() {
  return (
    <Screen header={<Header title="Keşfet" subtitle="Kıtalar, ülkeler ve şehir rehberleri" />}>
      <EmptyState
        icon="compass-outline"
        title="Keşfet yakında burada"
        message="Kıtaları, ülkeleri ve şehir rehberlerini bu ekranda gezeceksin."
      />
    </Screen>
  );
}

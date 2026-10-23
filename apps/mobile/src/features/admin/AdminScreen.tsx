import { router, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";

import { screenPadding, spacing } from "@/theme";
import { Header, Screen } from "@/ui";

import { AdminGuard } from "./components/AdminGuard";
import { SegmentedControl } from "./components/SegmentedControl";
import { isAdminSection, type AdminSection } from "./navigation";
import { PostsSection } from "./posts/PostsSection";
import { ScoresSection } from "./scores/ScoresSection";
import { UsersSection } from "./users/UsersSection";

const SECTION_OPTIONS = [
  { value: "users" as const, label: "Kullanıcılar" },
  { value: "posts" as const, label: "Yazılar" },
  { value: "scores" as const, label: "Skorlar" },
];

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Yönetim girişi (yalnız yönetici): Kullanıcılar, Yazılar, Skorlar. Seçili bölüm adreste tutulur
 * (`/admin?section=scores&userId=…`), böylece kullanıcı ayrıntısından skorlara süzgeçle gidilebilir.
 */
export function AdminScreen() {
  const params = useLocalSearchParams<{ section?: string | string[]; userId?: string | string[] }>();
  const requested = first(params.section);
  const section: AdminSection = isAdminSection(requested) ? requested : "users";
  const userId = first(params.userId) || undefined;

  const select = useCallback((next: AdminSection) => {
    router.setParams({ section: next, userId: undefined });
  }, []);
  const clearUser = useCallback(() => router.setParams({ userId: undefined }), []);

  return (
    <Screen scroll={false} padded={false} header={<Header title="Yönetim" subtitle="Kullanıcılar, blog yazıları ve skorlar" />}>
      <AdminGuard>
        <View style={styles.fill}>
          <View style={styles.tabs}>
            <SegmentedControl options={SECTION_OPTIONS} value={section} onChange={select} accessibilityLabel="Yönetim bölümleri" />
          </View>
          {section === "users" ? <UsersSection /> : null}
          {section === "posts" ? <PostsSection /> : null}
          {section === "scores" ? <ScoresSection userId={userId} onClearUser={clearUser} /> : null}
        </View>
      </AdminGuard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  tabs: { paddingHorizontal: screenPadding, paddingBottom: spacing.md },
});

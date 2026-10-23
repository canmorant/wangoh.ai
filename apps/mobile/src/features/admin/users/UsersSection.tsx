import { getUsersListQueryKey, usersList, type UserDto, type UsersListParams } from "@wangoh/api-client";
import { router } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useAuth } from "@/auth";
import { screenPadding, spacing } from "@/theme";
import { Badge, Card, Text } from "@/ui";

import { FilterChips } from "../../blog/components/FilterChips";
import { SearchField } from "../../blog/components/SearchField";
import { useDebouncedValue } from "../../blog/useDebouncedValue";
import { usePagedQuery } from "../../blog/usePagedQuery";
import { PagedList } from "../components/PagedList";
import { adminUserHref } from "../navigation";
import { roleLabel } from "../userRules";

const PAGE_SIZE = 20;

type RoleFilter = "user" | "admin";
const ROLE_OPTIONS = [
  { value: "user" as const, label: "Kullanıcı" },
  { value: "admin" as const, label: "Yönetici" },
];

interface UserRowProps {
  user: UserDto;
  isMe: boolean;
}

const UserRow = memo(function UserRow({ user, isMe }: UserRowProps) {
  const label = [user.displayName, user.email, roleLabel(user.role), user.disabled ? "devre dışı" : null, isMe ? "sen" : null].filter(Boolean).join(", ");
  return (
    <Card onPress={() => router.push(adminUserHref(user.id))} accessibilityLabel={label} accessibilityHint="Kullanıcı ayrıntısını açar" testID={`user-row-${user.email}`}>
      <View style={styles.row}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {user.displayName}
        </Text>
        <Text variant="small" color="textSecondary" numberOfLines={1}>
          {user.email}
        </Text>
        <View style={styles.badges}>
          <Badge label={roleLabel(user.role)} tone={user.role === "admin" ? "gold" : "neutral"} />
          {user.disabled ? <Badge label="Devre dışı" tone="danger" /> : null}
          {isMe ? <Badge label="Sen" tone="success" /> : null}
        </View>
      </View>
    </Card>
  );
});

/** Kullanıcılar: arama (ad/e-posta), rol süzgeci, sayfalı liste. Satıra dokunmak ayrıntıyı açar. */
export function UsersSection() {
  const { user: me } = useAuth();
  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search.trim(), 400);
  const [role, setRole] = useState<RoleFilter | null>(null);

  const params = useMemo<UsersListParams>(() => ({ pageSize: PAGE_SIZE, ...(q ? { q } : {}), ...(role ? { role } : {}) }), [q, role]);
  const feed = usePagedQuery<UserDto>({
    queryKey: getUsersListQueryKey(params),
    fetchPage: (page, signal) => usersList({ ...params, page }, { signal }),
    keepPrevious: true,
    staleTime: 0,
  });

  const renderItem = useCallback((user: UserDto) => <UserRow user={user} isMe={me?.id === user.id} />, [me?.id]);
  const clear = useCallback(() => {
    setSearch("");
    setRole(null);
  }, []);

  return (
    <View style={styles.fill}>
      <View style={styles.filters}>
        <SearchField value={search} onChangeText={setSearch} placeholder="Ad ya da e-posta ara" accessibilityLabel="Kullanıcılarda ara" testID="admin-users-search" />
        <FilterChips options={ROLE_OPTIONS} value={role} onChange={setRole} accessibilityLabel="Role göre süz" />
      </View>
      <PagedList
        feed={feed}
        renderItem={renderItem}
        filtered={q !== "" || role !== null}
        onClearFilters={clear}
        emptyIcon="people-outline"
        emptyTitle="Henüz kullanıcı yok"
        emptyMessage="Kayıt olan kullanıcılar burada listelenir."
        errorTitle="Kullanıcılar yüklenemedi"
        skeletonLabel="Kullanıcılar yükleniyor"
        noun="kullanıcı"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  filters: { gap: spacing.sm, paddingHorizontal: screenPadding, paddingBottom: spacing.sm },
  row: { gap: spacing.xs },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginTop: spacing.xs },
});

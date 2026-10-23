import { useQueryClient } from "@tanstack/react-query";
import { useUsersGet, useUsersRemove, useUsersUpdate, getUsersGetQueryKey } from "@wangoh/api-client";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { getErrorStatus } from "@/api/errors";
import { useAuth } from "@/auth";
import { spacing } from "@/theme";
import { Badge, Button, Card, Divider, EmptyState, ErrorState, Header, LoadingView, Screen, Text } from "@/ui";

import { formatDateTr } from "../../blog/format";
import { AdminGuard } from "../components/AdminGuard";
import { Banner } from "../components/Banner";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { invalidateUsers } from "../invalidate";
import { adminHref } from "../navigation";
import { SELF_ACTION_MESSAGE, deleteUserWarning, describeUserActionError, isSelf, roleLabel, type UserAction, type UserRole } from "../userRules";

type Pending = { action: "role"; role: UserRole } | { action: "disable" } | { action: "enable" } | { action: "delete" };

function goBack() {
  if (router.canGoBack()) router.back();
  else router.dismissTo(adminHref("users"));
}

/** Kullanıcı ayrıntısı: rol değiştir, devre dışı bırak / etkinleştir, sil (hepsi onaylı). */
export function UserDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = (Array.isArray(params.id) ? params.id[0] : params.id) ?? "";
  const header = <Header title="Kullanıcı" back={goBack} />;

  return (
    <Screen header={header} padded>
      <AdminGuard>
        <UserDetail id={id} />
      </AdminGuard>
    </Screen>
  );
}

function UserDetail({ id }: { id: string }) {
  const { user: me } = useAuth();
  const queryClient = useQueryClient();
  const query = useUsersGet(id, { query: { enabled: id !== "", staleTime: 0 } });
  const update = useUsersUpdate();
  const remove = useUsersRemove();

  const [pending, setPending] = useState<Pending | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (id === "" || (query.isError && getErrorStatus(query.error) === 404)) {
    return (
      <EmptyState
        icon="person-outline"
        title="Kullanıcı bulunamadı"
        message="Bu kullanıcı silinmiş olabilir."
        actionLabel="Kullanıcılara dön"
        onAction={() => router.dismissTo(adminHref("users"))}
      />
    );
  }
  if (query.isPending) return <LoadingView message="Kullanıcı yükleniyor…" />;
  if (query.isError) return <ErrorState error={query.error} title="Kullanıcı yüklenemedi" onRetry={() => void query.refetch()} retrying={query.isFetching} />;

  const target = query.data;
  const self = isSelf(target.id, me);
  const busy = update.isPending || remove.isPending;
  const isAdminTarget = target.role === "admin";

  async function confirm() {
    if (!pending) return;
    const action: UserAction = pending.action;
    setError(null);
    setNotice(null);
    try {
      if (pending.action === "delete") {
        await remove.mutateAsync({ id: target.id });
        queryClient.removeQueries({ queryKey: getUsersGetQueryKey(target.id) });
        await invalidateUsers(queryClient);
        setPending(null);
        goBack();
        return;
      }
      const data =
        pending.action === "role" ? { role: pending.role } : { disabled: pending.action === "disable" };
      await update.mutateAsync({ id: target.id, data });
      await invalidateUsers(queryClient, target.id);
      setNotice(
        pending.action === "role"
          ? `Rol güncellendi: ${roleLabel(pending.role)}.`
          : pending.action === "disable"
            ? "Hesap devre dışı bırakıldı. Kullanıcı giriş yapamaz, açık oturumları kapandı."
            : "Hesap yeniden etkinleştirildi.",
      );
    } catch (caught) {
      setError(describeUserActionError(caught, action));
    } finally {
      setPending(null);
    }
  }

  const dialog = pending ? dialogCopy(pending, target.displayName) : null;

  return (
    <View style={styles.column}>
      <Card>
        <View style={styles.info}>
          <Text variant="heading" accessibilityRole="header">
            {target.displayName}
          </Text>
          <Text variant="body" color="textSecondary" selectable>
            {target.email}
          </Text>
          <View style={styles.badges}>
            <Badge label={roleLabel(target.role)} tone={isAdminTarget ? "gold" : "neutral"} />
            {target.disabled ? <Badge label="Devre dışı" tone="danger" /> : <Badge label="Aktif" tone="success" />}
            {self ? <Badge label="Sen" tone="success" /> : null}
          </View>
          <Divider />
          <Text variant="small" color="textMuted">
            Kayıt tarihi: {formatDateTr(target.createdAt)}
          </Text>
        </View>
      </Card>

      {notice ? <Banner tone="success" message={notice} testID="user-notice" /> : null}
      {error ? <Banner tone="error" message={error} testID="user-error" /> : null}
      {self ? <Banner tone="info" message={SELF_ACTION_MESSAGE} testID="user-self-note" /> : null}

      <View style={styles.actions}>
        <Text variant="label" color="textSecondary">
          İŞLEMLER
        </Text>
        <Button
          title={isAdminTarget ? "Yönetici yetkisini kaldır" : "Yönetici yap"}
          variant="secondary"
          disabled={self || busy}
          onPress={() => setPending({ action: "role", role: isAdminTarget ? "user" : "admin" })}
          fullWidth
        />
        <Button
          title={target.disabled ? "Hesabı etkinleştir" : "Hesabı devre dışı bırak"}
          variant="secondary"
          disabled={self || busy}
          onPress={() => setPending({ action: target.disabled ? "enable" : "disable" })}
          fullWidth
        />
        <Button
          title="Skorlarını gör"
          variant="ghost"
          onPress={() => router.dismissTo(adminHref("scores", target.id))}
          fullWidth
        />
        <Divider />
        <Button title="Kullanıcıyı sil" variant="danger" disabled={self || busy} onPress={() => setPending({ action: "delete" })} fullWidth />
      </View>

      <ConfirmDialog
        visible={dialog !== null}
        title={dialog?.title ?? ""}
        message={dialog?.message ?? ""}
        confirmLabel={dialog?.confirm ?? ""}
        destructive={dialog?.destructive}
        loading={busy}
        onConfirm={() => void confirm()}
        onCancel={() => setPending(null)}
      />
    </View>
  );
}

function dialogCopy(pending: Pending, name: string): { title: string; message: string; confirm: string; destructive: boolean } {
  switch (pending.action) {
    case "role":
      return pending.role === "admin"
        ? {
            title: "Yönetici yapılsın mı?",
            message: `${name} tüm kullanıcıları, blog yazılarını ve skorları yönetebilecek.`,
            confirm: "Yönetici yap",
            destructive: false,
          }
        : {
            title: "Yönetici yetkisi kaldırılsın mı?",
            message: `${name} artık yönetim ekranlarına erişemeyecek.`,
            confirm: "Yetkiyi kaldır",
            destructive: true,
          };
    case "disable":
      return {
        title: "Hesap devre dışı bırakılsın mı?",
        message: `${name} giriş yapamaz ve açık oturumları hemen kapanır. Puanları liderlikte görünmez; hesap yeniden etkinleştirilince geri döner.`,
        confirm: "Devre dışı bırak",
        destructive: true,
      };
    case "enable":
      return { title: "Hesap etkinleştirilsin mi?", message: `${name} yeniden giriş yapabilecek.`, confirm: "Etkinleştir", destructive: false };
    case "delete":
      return { title: "Kullanıcı silinsin mi?", message: deleteUserWarning(name), confirm: "Kalıcı olarak sil", destructive: true };
  }
}

const styles = StyleSheet.create({
  column: { gap: spacing.lg, paddingBottom: spacing.xl, width: "100%", maxWidth: 720, alignSelf: "center" },
  info: { gap: spacing.xs },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginTop: spacing.sm },
  actions: { gap: spacing.md },
});

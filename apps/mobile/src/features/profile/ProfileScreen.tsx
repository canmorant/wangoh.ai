import { getUsersMeScoresQueryKey, getUsersMeStatsQueryKey } from "@wangoh/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useAuth } from "@/auth";
import { AUTH_NOTICES, FormBanner, parseAuthNotice } from "@/features/auth";
import { spacing } from "@/theme";
import { Card, Divider, Header, LoadingView, Screen, SectionHeader } from "@/ui";

import { CHANGE_PASSWORD_HREF, DELETE_ACCOUNT_HREF, EDIT_NAME_HREF } from "./navigation";
import { AboutSection } from "./components/AboutSection";
import { AccountCard } from "./components/AccountCard";
import { ActionRow } from "./components/ActionRow";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { ScoresSection } from "./components/ScoresSection";
import { SignedOutProfile } from "./components/SignedOutProfile";
import { StatsSection } from "./components/StatsSection";

/** Ekran genişliği büyükse (web, tablet) içerik okunaklı genişlikte kalır. */
const CONTENT_MAX_WIDTH = 560;

export function ProfileScreen() {
  const { status, user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ notice?: string | string[] }>();
  const notice = parseAuthNotice(params.notice);

  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const signedIn = status === "signedIn" && user !== null;

  // Sekmeler açık kalır: oyun oynayıp dönünce puanlar bayat olmasın. Yeni bir yükleme sürerken (ilk açılış)
  // devam eden istek iptal edilmez, çift istek olmaz.
  useFocusEffect(
    useCallback(() => {
      if (!signedIn) return;
      void queryClient.invalidateQueries({ queryKey: getUsersMeStatsQueryKey() }, { cancelRefetch: false });
      void queryClient.invalidateQueries({ queryKey: getUsersMeScoresQueryKey() }, { cancelRefetch: false });
    }, [queryClient, signedIn]),
  );

  const refresh = useCallback(
    () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: getUsersMeStatsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getUsersMeScoresQueryKey() }),
      ]),
    [queryClient],
  );

  const dismissNotice = () => router.setParams({ notice: undefined });

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
      setConfirmSignOut(false);
    }
  };

  if (status === "restoring") {
    return (
      <Screen header={<Header title="Profil" />}>
        <LoadingView message="Oturum kontrol ediliyor…" />
      </Screen>
    );
  }

  const noticeBanner = notice ? (
    <View>
      <FormBanner
        tone={AUTH_NOTICES[notice].tone}
        title={AUTH_NOTICES[notice].title}
        message={AUTH_NOTICES[notice].message}
        onDismiss={dismissNotice}
        testID="profile-notice"
      />
    </View>
  ) : null;

  if (!signedIn) {
    return (
      <Screen header={<Header title="Profil" />} testID="profile-screen">
        <View style={styles.content}>
          {noticeBanner}
          <SignedOutProfile />
          <AboutSection />
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      header={<Header title="Profil" subtitle={user.displayName} />}
      onRefresh={refresh}
      testID="profile-screen"
      contentContainerStyle={styles.scroll}
    >
      <View style={styles.content}>
        {noticeBanner}
        <AccountCard user={user} onEditName={() => router.push(EDIT_NAME_HREF)} />
        <StatsSection />
        <ScoresSection />

        <View>
          <SectionHeader title="Hesap" />
          <Card padded={false}>
            <ActionRow label="Parolayı değiştir" icon="key-outline" onPress={() => router.push(CHANGE_PASSWORD_HREF)} testID="profile-change-password" />
            <Divider />
            <ActionRow label="Çıkış yap" icon="log-out-outline" onPress={() => setConfirmSignOut(true)} testID="profile-sign-out" />
            <Divider />
            <ActionRow
              label="Hesabı sil"
              icon="trash-outline"
              tone="danger"
              onPress={() => router.push(DELETE_ACCOUNT_HREF)}
              accessibilityHint="Hesabını kalıcı olarak siler, geri alınamaz"
              testID="profile-delete-account"
            />
          </Card>
        </View>

        <AboutSection />
      </View>

      <ConfirmDialog
        visible={confirmSignOut}
        title="Çıkış yapılsın mı?"
        message="Bu cihazdaki oturumun kapanır. İstediğin zaman yeniden giriş yapabilirsin."
        confirmLabel="Çıkış yap"
        loading={signingOut}
        onConfirm={() => void handleSignOut()}
        onCancel={() => setConfirmSignOut(false)}
        testID="profile-sign-out-dialog"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { alignItems: "center" },
  content: { width: "100%", maxWidth: CONTENT_MAX_WIDTH, gap: spacing.md },
});

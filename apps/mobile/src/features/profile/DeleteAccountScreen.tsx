import { useUsersDeleteMe } from "@wangoh/api-client";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { AuthGate, useAuth } from "@/auth";
import { describeAuthError } from "@/auth/authErrors";
import { hasErrors, validateDeleteAccountForm } from "@/auth/authValidation";
import { FormBanner, FormScreen, useSubmitGuard } from "@/features/auth";
import { spacing } from "@/theme";
import { Button, Input, Text } from "@/ui";

import { ConfirmDialog } from "./components/ConfirmDialog";
import { goBackToProfile } from "./navigation";

function DeleteAccountForm() {
  const { signOut } = useAuth();
  const deleteMe = useUsersDeleteMe();
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const { submitting, run } = useSubmitGuard();

  // 1. adım: parola dolu mu? Doluysa son uyarı penceresi açılır.
  const askConfirmation = () => {
    setFormError(null);
    const errors = validateDeleteAccountForm({ password });
    setFieldError(errors.password ?? null);
    if (!hasErrors(errors)) setConfirming(true);
  };

  // 2. adım: silme isteği. Yanlış parola 403 döner (oturum düşmez); sorun varsa pencere kapanır, hata formda görünür.
  const deleteAccount = () =>
    run(async () => {
      try {
        await deleteMe.mutateAsync({ data: { password } });
      } catch (error) {
        const info = describeAuthError(error, "deleteAccount");
        setConfirming(false);
        setFieldError(info.fieldErrors.password ?? null);
        setFormError(info.fieldErrors.password ? null : info.message);
        return;
      }
      // Hesap gitti; sunucu belirteçleri zaten iptal etti. Yerel oturumu kapat ve Profil'e bilgiyle dön.
      setConfirming(false);
      await signOut();
      router.dismissAll();
      router.replace({ pathname: "/profile", params: { notice: "account-deleted" } });
    });

  return (
    <FormScreen
      title="Hesabı sil"
      intro="Hesabını silmek kalıcıdır ve geri alınamaz."
      onBack={goBackToProfile}
      testID="delete-account-screen"
    >
      <View style={styles.warning} accessible accessibilityRole="alert">
        <Text variant="bodyStrong" color="danger">
          Silinecekler
        </Text>
        <Text variant="small">• Hesabın ve giriş bilgilerin</Text>
        <Text variant="small">• Oyun oturumların ve skorların</Text>
        <Text variant="small">• Liderlik tablosundaki yerin</Text>
      </View>

      <Input
        label="Parolan"
        hint="Silmeyi onaylamak için mevcut parolanı gir."
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          if (fieldError) setFieldError(null);
        }}
        error={fieldError}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={askConfirmation}
        editable={!submitting}
        testID="delete-account-password"
      />
      {formError ? <FormBanner message={formError} testID="delete-account-error" /> : null}
      <Button title="Hesabımı sil" variant="danger" onPress={askConfirmation} fullWidth testID="delete-account-submit" />
      <Button title="Vazgeç" variant="secondary" onPress={goBackToProfile} fullWidth testID="delete-account-cancel" />

      <ConfirmDialog
        visible={confirming}
        title="Hesap kalıcı olarak silinsin mi?"
        message="Hesabın, oyun verilerin ve skorların silinir. Bu işlem geri alınamaz."
        confirmLabel="Evet, hesabı sil"
        tone="danger"
        loading={submitting}
        onConfirm={() => void deleteAccount()}
        onCancel={() => setConfirming(false)}
        testID="delete-account-dialog"
      />
    </FormScreen>
  );
}

export function DeleteAccountScreen() {
  return (
    <AuthGate title="Giriş yapman gerekiyor" message="Hesabını silmek için hesabınla giriş yap.">
      <DeleteAccountForm />
    </AuthGate>
  );
}

const styles = StyleSheet.create({
  warning: { gap: spacing.xs },
});

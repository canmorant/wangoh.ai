import { useUsersChangePassword } from "@wangoh/api-client";
import { router } from "expo-router";
import { useRef, useState } from "react";
import type { TextInput } from "react-native";

import { AuthGate, useAuth } from "@/auth";
import { describeAuthError } from "@/auth/authErrors";
import { hasErrors, validateChangePasswordForm } from "@/auth/authValidation";
import { FormBanner, FormScreen, useSubmitGuard } from "@/features/auth";
import { Button, Input } from "@/ui";

import { goBackToProfile } from "./navigation";

type Fields = { currentPassword?: string; newPassword?: string; confirmPassword?: string };

function ChangePasswordForm() {
  const { signOut } = useAuth();
  const changePassword = useUsersChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Fields>({});
  const [formError, setFormError] = useState<string | null>(null);
  const newRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const { submitting, run } = useSubmitGuard();

  const clearField = (field: keyof Fields) => {
    if (fieldErrors[field]) setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = () =>
    run(async () => {
      setFormError(null);
      const errors = validateChangePasswordForm({ currentPassword, newPassword, confirmPassword });
      setFieldErrors(errors);
      if (hasErrors(errors)) return;

      try {
        await changePassword.mutateAsync({ data: { currentPassword, newPassword } });
      } catch (error) {
        // Yanlış mevcut parola 403 döner (401 değil): oturum DÜŞMEZ, alanın altında gösterilir.
        const info = describeAuthError(error, "changePassword");
        setFieldErrors(info.fieldErrors);
        setFormError(Object.keys(info.fieldErrors).length > 0 && info.kind !== "validation" ? null : info.message);
        return;
      }

      // Sunucu parola değişince bu cihaz dahil TÜM oturumları kapattı: yerel oturumu da kapat, girişe yönlendir.
      // Önce profil yığını başa alınır; yoksa girişten dönünce bu form yeniden açılırdı.
      await signOut();
      router.dismissAll();
      router.push({ pathname: "/login", params: { notice: "password-changed", returnTo: "/profile" } });
    });

  return (
    <FormScreen
      title="Parolayı değiştir"
      intro="Parolanı değiştirdiğinde güvenlik için tüm cihazlardaki oturumların kapatılır; yeni parolanla yeniden giriş yaparsın."
      onBack={goBackToProfile}
      testID="change-password-screen"
    >
      <Input
        label="Mevcut parola"
        value={currentPassword}
        onChangeText={(value) => {
          setCurrentPassword(value);
          clearField("currentPassword");
        }}
        error={fieldErrors.currentPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => newRef.current?.focus()}
        editable={!submitting}
        testID="change-password-current"
      />
      <Input
        ref={newRef}
        label="Yeni parola"
        hint="En az 8 karakter."
        value={newPassword}
        onChangeText={(value) => {
          setNewPassword(value);
          clearField("newPassword");
        }}
        error={fieldErrors.newPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => confirmRef.current?.focus()}
        editable={!submitting}
        testID="change-password-new"
      />
      <Input
        ref={confirmRef}
        label="Yeni parola (tekrar)"
        value={confirmPassword}
        onChangeText={(value) => {
          setConfirmPassword(value);
          clearField("confirmPassword");
        }}
        error={fieldErrors.confirmPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={() => void submit()}
        editable={!submitting}
        testID="change-password-confirm"
      />
      {formError ? <FormBanner message={formError} testID="change-password-error" /> : null}
      <Button title="Parolayı değiştir" onPress={() => void submit()} loading={submitting} fullWidth testID="change-password-submit" />
    </FormScreen>
  );
}

export function ChangePasswordScreen() {
  return (
    <AuthGate title="Giriş yapman gerekiyor" message="Parolanı değiştirmek için hesabınla giriş yap.">
      <ChangePasswordForm />
    </AuthGate>
  );
}

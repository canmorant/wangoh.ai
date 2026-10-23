import { useQueryClient } from "@tanstack/react-query";
import { getAuthMeQueryKey, useUsersUpdateMe } from "@wangoh/api-client";
import { router } from "expo-router";
import { useState } from "react";

import { AuthGate, useAuth } from "@/auth";
import { describeAuthError } from "@/auth/authErrors";
import { toAuthUser } from "@/auth/authState";
import { normalizeDisplayName, validateDisplayName } from "@/auth/authValidation";
import { FormBanner, FormScreen, useSubmitGuard } from "@/features/auth";
import { Button, Input } from "@/ui";

import { goBackToProfile } from "./navigation";

function EditNameForm() {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const updateMe = useUsersUpdateMe();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { submitting, run } = useSubmitGuard();

  const submit = () =>
    run(async () => {
      setFormError(null);
      const invalid = validateDisplayName(displayName);
      setFieldError(invalid);
      if (invalid) return;

      const next = normalizeDisplayName(displayName);
      if (next === user?.displayName) {
        goBackToProfile(); // değişiklik yok: istek göndermeye gerek yok
        return;
      }
      try {
        const updated = await updateMe.mutateAsync({ data: { displayName: next } });
        updateUser(toAuthUser(updated));
        void queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() });
        // `navigate`/`push` yığına İKİNCİ bir Profil ekranı eklerdi; `dismissTo` mevcut Profil'e döner (yoksa yerine geçer).
        router.dismissTo({ pathname: "/profile", params: { notice: "name-saved" } });
      } catch (error) {
        const info = describeAuthError(error, "updateProfile");
        setFieldError(info.fieldErrors.displayName ?? null);
        setFormError(info.fieldErrors.displayName ? null : info.message);
      }
    });

  return (
    <FormScreen title="Görünen adı düzenle" intro="Liderlik tablosunda ve profilinde bu ad görünür." onBack={goBackToProfile} testID="edit-name-screen">
      <Input
        label="Görünen ad"
        value={displayName}
        onChangeText={(value) => {
          setDisplayName(value);
          if (fieldError) setFieldError(null);
        }}
        error={fieldError}
        autoCapitalize="words"
        autoComplete="nickname"
        textContentType="nickname"
        returnKeyType="done"
        onSubmitEditing={() => void submit()}
        editable={!submitting}
        autoFocus
        testID="edit-name-input"
      />
      {formError ? <FormBanner message={formError} testID="edit-name-error" /> : null}
      <Button title="Kaydet" onPress={() => void submit()} loading={submitting} fullWidth testID="edit-name-submit" />
    </FormScreen>
  );
}

export function EditNameScreen() {
  return (
    <AuthGate title="Giriş yapman gerekiyor" message="Görünen adını değiştirmek için hesabınla giriş yap.">
      <EditNameForm />
    </AuthGate>
  );
}

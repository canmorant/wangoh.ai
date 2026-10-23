import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, type TextInput } from "react-native";

import { useAuth } from "@/auth";
import { describeAuthError } from "@/auth/authErrors";
import { PASSWORD_MIN_LENGTH, hasErrors, validateRegisterForm } from "@/auth/authValidation";
import { safeReturnTo } from "@/auth/returnTo";
import { spacing } from "@/theme";
import { Button, Input, Text } from "@/ui";

import { FormBanner } from "./components/FormBanner";
import { FormScreen } from "./components/FormScreen";
import { LegalNote } from "./components/LegalNote";
import { leaveAuthFlow } from "./navigation";
import { useSubmitGuard } from "./useSubmitGuard";

const MODAL_EDGES = ["top", "bottom", "left", "right"] as const;

type Fields = { displayName?: string; email?: string; password?: string };

export function RegisterScreen() {
  const { register, status } = useAuth();
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const returnTo = safeReturnTo(params.returnTo);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Fields>({});
  const [formError, setFormError] = useState<string | null>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const { submitting, run } = useSubmitGuard();

  useEffect(() => {
    if (status === "signedIn") leaveAuthFlow(returnTo);
  }, [status, returnTo]);

  const clearField = (field: keyof Fields) => {
    if (fieldErrors[field]) setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = () =>
    run(async () => {
      const errors = validateRegisterForm({ displayName, email, password });
      setFieldErrors(errors);
      setFormError(null);
      if (hasErrors(errors)) return;
      try {
        await register({ displayName, email, password });
      } catch (error) {
        const info = describeAuthError(error, "register");
        setFieldErrors(info.fieldErrors);
        // Hata bir alana bağlandıysa mesaj alanın altındadır; ayrıca üstte tekrarlanmaz.
        setFormError(Object.keys(info.fieldErrors).length > 0 && info.kind !== "validation" ? null : info.message);
      }
    });

  const goToLogin = () => router.replace({ pathname: "/login", params: returnTo ? { returnTo } : {} });

  return (
    <FormScreen
      title="Hesap oluştur"
      intro="Ücretsiz hesapla oyun puanların kaydedilir ve liderlik tablosunda yer alırsın."
      edges={MODAL_EDGES}
      testID="register-screen"
    >
      <Input
        label="Görünen ad"
        hint="Liderlik tablosunda bu ad görünür."
        value={displayName}
        onChangeText={(value) => {
          setDisplayName(value);
          clearField("displayName");
        }}
        error={fieldErrors.displayName}
        autoCapitalize="words"
        autoComplete="nickname"
        textContentType="nickname"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => emailRef.current?.focus()}
        editable={!submitting}
        testID="register-name"
      />
      <Input
        ref={emailRef}
        label="E-posta"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          clearField("email");
        }}
        error={fieldErrors.email}
        placeholder="ornek@eposta.com"
        keyboardType="email-address"
        inputMode="email"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
        editable={!submitting}
        testID="register-email"
      />
      <Input
        ref={passwordRef}
        label="Parola"
        hint={`En az ${PASSWORD_MIN_LENGTH} karakter.`}
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          clearField("password");
        }}
        error={fieldErrors.password}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={() => void submit()}
        editable={!submitting}
        testID="register-password"
      />

      {formError ? <FormBanner message={formError} testID="register-error" /> : null}

      <Button title="Hesap oluştur" onPress={() => void submit()} loading={submitting} fullWidth testID="register-submit" />

      <LegalNote />

      <View style={styles.switchRow}>
        <Text variant="small" color="textSecondary">
          Zaten hesabın var mı?
        </Text>
        <Button title="Giriş yap" variant="ghost" size="sm" onPress={goToLogin} disabled={submitting} testID="register-to-login" />
      </View>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs, flexWrap: "wrap" },
});

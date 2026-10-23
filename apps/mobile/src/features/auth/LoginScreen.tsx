import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, type TextInput } from "react-native";

import { useAuth } from "@/auth";
import { describeAuthError } from "@/auth/authErrors";
import { hasErrors, validateLoginForm } from "@/auth/authValidation";
import { safeReturnTo } from "@/auth/returnTo";
import { spacing } from "@/theme";
import { Button, Input, Text } from "@/ui";

import { FormBanner } from "./components/FormBanner";
import { FormScreen } from "./components/FormScreen";
import { leaveAuthFlow } from "./navigation";
import { AUTH_NOTICES, parseAuthNotice } from "./notices";
import { useSubmitGuard } from "./useSubmitGuard";

const MODAL_EDGES = ["top", "bottom", "left", "right"] as const;

type Params = { returnTo?: string | string[]; notice?: string | string[] };

export function LoginScreen() {
  const { signIn, status } = useAuth();
  const params = useLocalSearchParams<Params>();
  const returnTo = safeReturnTo(params.returnTo);
  const notice = parseAuthNotice(params.notice);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const passwordRef = useRef<TextInput>(null);
  const { submitting, run } = useSubmitGuard();

  // Oturum açılınca (bu ekrandan ya da zaten açıkken) ekrandan çıkılır; tek yol, çift gezinme olmaz.
  useEffect(() => {
    if (status === "signedIn") leaveAuthFlow(returnTo);
  }, [status, returnTo]);

  const submit = () =>
    run(async () => {
      const errors = validateLoginForm({ email, password });
      setFieldErrors(errors);
      setFormError(null);
      if (hasErrors(errors)) return;
      try {
        await signIn(email, password);
      } catch (error) {
        const info = describeAuthError(error, "login");
        setFieldErrors(info.fieldErrors);
        setFormError(info.message);
      }
    });

  const goToRegister = () => router.replace({ pathname: "/register", params: returnTo ? { returnTo } : {} });

  return (
    <FormScreen
      title="Giriş yap"
      intro="Hesabınla giriş yap; puanların ve istatistiklerin hesabına bağlı tutulur."
      edges={MODAL_EDGES}
      testID="login-screen"
    >
      {notice ? (
        <FormBanner tone={AUTH_NOTICES[notice].tone} title={AUTH_NOTICES[notice].title} message={AUTH_NOTICES[notice].message} testID="login-notice" />
      ) : null}

      <Input
        label="E-posta"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          if (fieldErrors.email) setFieldErrors((current) => ({ ...current, email: undefined }));
        }}
        error={fieldErrors.email}
        placeholder="ornek@eposta.com"
        keyboardType="email-address"
        inputMode="email"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="username"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
        editable={!submitting}
        testID="login-email"
      />
      <Input
        ref={passwordRef}
        label="Parola"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          if (fieldErrors.password) setFieldErrors((current) => ({ ...current, password: undefined }));
        }}
        error={fieldErrors.password}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={() => void submit()}
        editable={!submitting}
        testID="login-password"
      />

      {formError ? <FormBanner message={formError} testID="login-error" /> : null}

      <Button title="Giriş yap" onPress={() => void submit()} loading={submitting} fullWidth testID="login-submit" />

      <View style={styles.switchRow}>
        <Text variant="small" color="textSecondary">
          Hesabın yok mu?
        </Text>
        <Button title="Hesap oluştur" variant="ghost" size="sm" onPress={goToRegister} disabled={submitting} testID="login-to-register" />
      </View>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs, flexWrap: "wrap" },
});

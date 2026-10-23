import { router, usePathname } from "expo-router";
import type { ReactNode } from "react";

import { EmptyState, LoadingView } from "@/ui";

import { useAuth } from "./AuthContext";

export interface AuthGateProps {
  children: ReactNode;
  title?: string;
  message?: string;
}

/**
 * Giriş isteyen ekranları sarmalar. Oturum geri yüklenirken yükleniyor, oturum yoksa giriş çağrısı
 * gösterir; giriş sonrası kullanıcı bulunduğu ekrana döner (`returnTo`, giriş ekranı destekler).
 */
export function AuthGate({
  children,
  title = "Giriş yapman gerekiyor",
  message = "Bu bölümü kullanmak için hesabınla giriş yap ya da ücretsiz hesap oluştur.",
}: AuthGateProps) {
  const { status } = useAuth();
  const pathname = usePathname();

  if (status === "restoring") return <LoadingView />;
  if (status === "signedIn") return <>{children}</>;

  return (
    <EmptyState
      icon="lock-closed-outline"
      title={title}
      message={message}
      actionLabel="Giriş yap"
      onAction={() => router.push({ pathname: "/login", params: { returnTo: pathname } })}
    />
  );
}

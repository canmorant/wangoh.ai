import type { ReactNode } from "react";

import { AuthGate, useAuth } from "@/auth";
import { EmptyState } from "@/ui";

/**
 * Yönetim ekranlarının kapısı: oturum yoksa giriş çağrısı (AuthGate), oturum var ama yönetici değilse
 * "yetkin yok". Sekme yalnız yöneticiye görünür ama adrese (`/admin`) herkes gidebilir; asıl yetki API'dedir.
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  return (
    <AuthGate title="Yönetim için giriş yap" message="Bu bölüm yalnızca yönetici hesaplarına açıktır. Yönetici hesabınla giriş yap.">
      <RequireAdmin>{children}</RequireAdmin>
    </AuthGate>
  );
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  if (isAdmin) return <>{children}</>;
  return (
    <EmptyState
      icon="lock-closed-outline"
      title="Bu alan için yetkin yok"
      message="Yönetim ekranları yalnızca yönetici hesaplarına açıktır. Yönetici olduğunu düşünüyorsan, yönetici hesabıyla yeniden giriş yap."
    />
  );
}

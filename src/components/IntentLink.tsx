"use client";

import { useState, type ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

/**
 * Hedefi, bağlantı ekrana girer girmez değil, kullanıcı ona yönelince (imleç,
 * dokunma, klavye odağı) önden yükleyen bağlantı.
 *
 * Ana sayfa ve oyun sayfaları animasyon ve harita kodu yüzünden ağır. Üst
 * menü, kırıntı ve alt bilgi her sayfada göründüğü için varsayılan davranış
 * bu kodu her rehber sayfasında arka planda indiriyordu (mobilde ~130 KB).
 */
export default function IntentLink({
  onPointerEnter,
  onFocus,
  ...props
}: ComponentProps<typeof Link>) {
  const [intent, setIntent] = useState(false);
  return (
    <Link
      {...props}
      prefetch={intent ? null : false}
      onPointerEnter={(event) => {
        setIntent(true);
        onPointerEnter?.(event);
      }}
      onFocus={(event) => {
        setIntent(true);
        onFocus?.(event);
      }}
    />
  );
}

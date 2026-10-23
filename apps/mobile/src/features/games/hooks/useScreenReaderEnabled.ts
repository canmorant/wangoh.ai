import { useEffect, useState } from "react";
import { AccessibilityInfo, Platform } from "react-native";

/**
 * Ekran okuyucu açıksa otomatik ilerleme kapatılır: kullanıcı geri bildirimi okuyup "Devam" der.
 * React Native Web ekran okuyucuyu algılayamaz ve her zaman "açık" döner; web önizlemede
 * (geliştirme amaçlı) bu yüzden yok sayılır, yoksa otomatik ilerleme hiç çalışmazdı.
 */
export function useScreenReaderEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (Platform.OS === "web") return;
    let active = true;
    AccessibilityInfo.isScreenReaderEnabled()
      .then((value) => active && setEnabled(value))
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener("screenReaderChanged", setEnabled);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return enabled;
}

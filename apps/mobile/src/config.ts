/**
 * Çalışma zamanı yapılandırması. Yalnız `EXPO_PUBLIC_` önekli değişkenler pakete girer ve derleme
 * anında satır içine yazılır, bu yüzden `process.env.EXPO_PUBLIC_X` açıkça yazılmalıdır.
 */

/** React Native genel değişkeni; Node altında (testler) tanımsız olabilir, bu yüzden burada yerel olarak bildirilir. */
declare const __DEV__: boolean | undefined;

/**
 * API adresi varsayılanı. Geliştirmede aygıta göre değişir:
 * - iOS simülatörü ve web önizleme: `http://localhost:3001`
 * - Android emülatörü: `localhost` emülatörün kendisidir, bilgisayar için `http://10.0.2.2:3001`
 * - Gerçek aygıt: bilgisayarın yerel ağ adresi (ör. `http://192.168.1.20:3001`)
 * - Yayın sürümü: `https://` olmalı (iOS App Transport Security düz HTTP'yi engeller)
 */
export const DEFAULT_API_URL = "http://localhost:3001";

/** Boş değeri varsayılana çevirir, sondaki "/" işaretlerini atar (api-client sözleşmesi: sonda "/" yok). */
export function resolveApiUrl(raw: string | undefined | null): string {
  const value = raw?.trim();
  return (value ? value : DEFAULT_API_URL).replace(/\/+$/, "");
}

export const config = {
  apiUrl: resolveApiUrl(process.env.EXPO_PUBLIC_API_URL),
  /** Bileşen galerisi (/ui-kit): geliştirmede açık, yayında yalnız bilerek açılırsa. */
  showUiKit: (typeof __DEV__ !== "undefined" && __DEV__ === true) || process.env.EXPO_PUBLIC_UI_KIT === "1",
} as const;

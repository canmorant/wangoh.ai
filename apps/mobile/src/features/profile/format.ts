/**
 * Profil ekranının biçimlendirme yardımcıları (saf mantık, Node altında test edilir; bkz. format.test.ts).
 *
 * `Intl` kullanılmaz: Hermes'te ICU desteği platforma göre değişir; aynı çıktı her yerde (iOS, Android,
 * web) ve testlerde aynı kalsın diye Türkçe ay adları ve ayraçlar elle yazılır.
 */

/** Oyun türü etiketleri web sitesindeki oyun adlarıyla aynıdır (apps/web/messages/tr.json: Nav.guessFlag, Nav.mapGame). */
export const GAME_TYPE_LABELS: Record<string, string> = {
  "flag-quiz": "Bayrağı Bil",
  "capital-quiz": "Başkenti Bil",
  "map-guess": "Haritada Bul",
};

/** Bilinmeyen (ileride eklenen) tür ham adıyla gösterilir; boş kalmaz. */
export function gameTypeLabel(gameType: string): string {
  return GAME_TYPE_LABELS[gameType] ?? gameType;
}

export function roleLabel(role: string): string {
  return role === "admin" ? "Yönetici" : "Üye";
}

/** Tam sayıyı Türkçe binlik ayraçla yazar: 1850 -> "1.850". */
export function formatInteger(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  return sign + String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Ortalama puan: en çok bir ondalık, Türkçe virgülle ("812,5"); yoksa "—". */
export function formatAverage(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  const [whole = "0", decimal = "0"] = Math.abs(value).toFixed(1).split(".");
  const sign = value < 0 ? "-" : "";
  const head = formatInteger(Number(whole));
  return decimal === "0" ? `${sign}${head}` : `${sign}${head},${decimal}`;
}

/** En iyi/son puan gibi boş olabilen sayı. */
export function formatScore(value: number | null | undefined): string {
  return value === null || value === undefined ? "—" : formatInteger(value);
}

/** Oyun süresi: "42 sn", "2 dk 5 sn", "1 sa 2 dk". Negatif/geçersiz süre "—". */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds} sn`;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (totalMinutes < 60) return seconds === 0 ? `${totalMinutes} dk` : `${totalMinutes} dk ${seconds} sn`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours} sa` : `${hours} sa ${minutes} dk`;
}

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"] as const;

function parseDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "5 Mart 2026" (cihazın saat diliminde); geçersiz tarih "—". */
export function formatDate(iso: string | null | undefined): string {
  const date = parseDate(iso);
  return date ? `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}` : "—";
}

/** "5 Mart 2026, 14:07". */
export function formatDateTime(iso: string | null | undefined): string {
  const date = parseDate(iso);
  if (!date) return "—";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${formatDate(iso)}, ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Son oynama: tarih, hiç oynanmadıysa açık bir ifade. */
export function formatLastPlayed(iso: string | null | undefined): string {
  return parseDate(iso) ? formatDate(iso) : "Hiç oynanmadı";
}

export function formatCorrect(correctCount: number, roundsTotal: number): string {
  return `${correctCount}/${roundsTotal} doğru`;
}

/** Avatar harfi: adın ilk harfi, Türkçe büyük harf kuralıyla (i -> İ, ı -> I). */
export function initialOf(name: string): string {
  const first = Array.from(name.trim())[0];
  if (!first) return "?";
  if (first === "i") return "İ";
  if (first === "ı") return "I";
  return first.toUpperCase();
}

/** Sayfalı listede gösterilen kayıt sayısı toplamdan azsa "daha fazla" gösterilir. */
export function hasMoreItems(visiblePages: number, pageSize: number, total: number): boolean {
  return visiblePages * pageSize < total;
}

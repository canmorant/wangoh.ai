/**
 * `YYYY-AA-GG` biçiminde, takvimde var olan bir gün mü? Düzenli ifade tek başına `2026-13-45` ya da `0000-00-00`
 * gibi değerleri geçirirdi; istemcide `new Date(...)` bunlardan `Invalid Date` üretir.
 */
export function isCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  // `Date.UTC` 0–99 yıllarını 1900'lere çevirir; `setUTCFullYear` yılı olduğu gibi alır. Taşan gün/ay bir sonrakine
  // kayar (31 Nisan → 1 Mayıs), bu yüzden geri okunan değerin girdiyle aynı olması gerekir.
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

import { Transform } from "class-transformer";

/**
 * Sorgu dizgisindeki "true"/"false"/"1"/"0" değerlerini mantıksal değere çevirir. Tanınmayan
 * değer olduğu gibi bırakılır; `@IsBoolean()` bunu reddeder.
 */
export function ToBoolean(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === "boolean") return value;
    if (typeof value !== "string") return value;
    const v = value.trim().toLowerCase();
    if (v === "true" || v === "1") return true;
    if (v === "false" || v === "0") return false;
    return value;
  });
}

/** Dizgiyi kırpar; dizgi değilse dokunmaz. */
export function Trim(): PropertyDecorator {
  return Transform(({ value }) => (typeof value === "string" ? value.trim() : value));
}

/** Dizgiyi kırpar ve küçük harfe çevirir (e-posta gibi). */
export function TrimLowercase(): PropertyDecorator {
  return Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value));
}

/** Virgülle ayrılmış sorgu değerini (`a,b`) ya da tekrarlı parametreyi diziye çevirir. */
export function ToStringArray(): PropertyDecorator {
  return Transform(({ value }) => {
    const parts = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : value;
    return Array.isArray(parts) ? parts.map((p) => (typeof p === "string" ? p.trim() : p)).filter((p) => p !== "") : parts;
  });
}

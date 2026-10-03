import { STRUCTURAL_KEYS } from "./core";

/** Ülke hub'ı: rota fikirlerindeki `cities` şehir anahtarıdır, çevrilmez. */
export const HUB_KEYS: ReadonlySet<string> = new Set([...STRUCTURAL_KEYS, "cities"]);

/** Beslenme önerileri: restoran adı ve adresi özel isimdir, çevrilmez. */
export const DIETARY_KEYS: ReadonlySet<string> = new Set([...STRUCTURAL_KEYS, "name", "address"]);

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { DEFAULT_SCRYPT_PARAMS, type ScryptParams } from "../config/env.js";

/**
 * Parola özeti: scrypt (node:crypto), rastgele 16 bayt tuz, `timingSafeEqual`.
 * Saklama biçimi: `scrypt$N$r$p$<tuz b64url>$<özet b64url>`; parametreler özetin içinde olduğundan
 * ileride maliyet artırılsa bile eski özetler doğrulanabilir.
 */
const SALT_BYTES = 16;
const KEY_BYTES = 64;
/** Bozuk/kötü niyetli kayıtlar sınırsız bellek/CPU harcatmasın diye kabul edilen aralıklar. */
const MAX_N = 2 ** 20;
const MAX_R = 32;
const MAX_P = 16;

function derive(password: string, salt: Buffer, params: ScryptParams, keyLength: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      // NFKC: aynı parolanın farklı Unicode biçimleri (iOS/Android klavyeleri) aynı özeti versin.
      password.normalize("NFKC"),
      salt,
      keyLength,
      // maxmem: Node varsayılanı (32 MiB) N=2^15, r=8 için sınırda kalır; bellek payı açıkça verilir.
      { N: params.N, r: params.r, p: params.p, maxmem: 256 * params.N * params.r },
      (err, key) => (err ? reject(err) : resolve(key)),
    );
  });
}

function isValidParams(p: ScryptParams): boolean {
  return (
    Number.isInteger(p.N) && p.N >= 16 && p.N <= MAX_N && (p.N & (p.N - 1)) === 0 &&
    Number.isInteger(p.r) && p.r >= 1 && p.r <= MAX_R &&
    Number.isInteger(p.p) && p.p >= 1 && p.p <= MAX_P
  );
}

export async function hashPassword(password: string, params: ScryptParams = DEFAULT_SCRYPT_PARAMS): Promise<string> {
  if (!isValidParams(params)) throw new Error("Geçersiz scrypt parametreleri.");
  const salt = randomBytes(SALT_BYTES);
  const key = await derive(password, salt, params, KEY_BYTES);
  return ["scrypt", params.N, params.r, params.p, salt.toString("base64url"), key.toString("base64url")].join("$");
}

interface ParsedHash {
  params: ScryptParams;
  salt: Buffer;
  key: Buffer;
}

export function parsePasswordHash(stored: string): ParsedHash | null {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return null;
  const [N, r, p] = [Number(parts[1]), Number(parts[2]), Number(parts[3])];
  const params = { N, r, p };
  if (!isValidParams(params)) return null;
  const salt = Buffer.from(parts[4]!, "base64url");
  const key = Buffer.from(parts[5]!, "base64url");
  if (salt.length < 8 || key.length < 16 || key.length > 128) return null;
  return { params, salt, key };
}

/** Parolayı sabit zamanlı karşılaştırmayla doğrular. Biçimi bozuk özet `false` döner (hata fırlatmaz). */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parsed = parsePasswordHash(stored);
  if (!parsed) return false;
  const candidate = await derive(password, parsed.salt, parsed.params, parsed.key.length);
  return timingSafeEqual(candidate, parsed.key);
}

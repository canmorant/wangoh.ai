/**
 * Orval özel mutator'u ve istemci yapılandırması (belge: docs/backend-mobil-mimarisi.md, bölüm 9).
 *
 * Üretilen kancalar buradaki `apiFetch`'i çağırır. 2xx yanıtta doğrudan gövde verisi
 * döner, diğer durumlarda `ApiError` fırlatılır. Web ve mobil aynı kodu kullanır: belirteç
 * saklama ve oturum kapatma uygulamaya aittir, `configureApiClient` ile enjekte edilir.
 */

export interface ApiClientConfig {
  /** Sonda "/" yok, istek yolları /v1 ile başlar. */
  baseUrl: string;
  getAccessToken: () => string | null | Promise<string | null>;
  getRefreshToken: () => string | null | Promise<string | null>;
  onTokensRefreshed: (t: { accessToken: string; refreshToken: string }) => void | Promise<void>;
  /** Yenileme başarısız: oturum kapatılmalı. */
  onAuthFailure: () => void;
  fetch?: typeof fetch;
}

export class ApiError extends Error {
  /** HTTP durum kodu; sunucuya hiç ulaşılamadıysa 0. */
  status: number;
  /** Makine okur kod (AUTH_INVALID_CREDENTIALS, VALIDATION_FAILED, NETWORK_ERROR ...). */
  code?: string;
  details?: unknown;

  constructor(status: number, message: string, options: { code?: string; details?: unknown; cause?: unknown } = {}) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    // Babel/Hermes sınıf dönüşümlerinde `extends Error` alt sınıfı instanceof'u kaybetmesin.
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "ApiError";
    this.status = status;
    this.code = options.code;
    this.details = options.details;
  }
}

// Orval, mutator dosyasından bu iki adı bulursa üretilen kancalarda hata ve gövde tipi
// olarak kullanır: `useQuery` hatası `unknown` yerine `ApiError` olur.
export type ErrorType<_ErrorData = unknown> = ApiError;
export type BodyType<BodyData> = BodyData;

let activeConfig: ApiClientConfig | null = null;
let refreshInFlight: Promise<RefreshOutcome> | null = null;

export function configureApiClient(config: ApiClientConfig): void {
  activeConfig = config;
  refreshInFlight = null;
}

// Kimlik uçları 401'de yenileme tetiklemez (yanlış parola da 401 döner) ve Bearer almaz.
const IDENTITY_PATHS = new Set(["/v1/auth/login", "/v1/auth/register", "/v1/auth/refresh", "/v1/auth/logout"]);

const NETWORK_ERROR_MESSAGE = "Sunucuya ulaşılamadı. İnternet bağlantını kontrol edip tekrar dene.";

export async function apiFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
  const config = requireConfig();
  const path = normalizePath(url);
  const identity = IDENTITY_PATHS.has(pathnameOf(path));

  const sentToken = identity ? null : await config.getAccessToken();
  let response = await send(config, path, init, sentToken);

  if (response.status === 401 && !identity) {
    // Hata gövdesini yenileme sonucuna göre atmak için şimdiden okuyoruz.
    const unauthorized = await toApiError(response);
    const recovery = await recoverSession(config, sentToken, init.signal);
    if (recovery.kind === "unavailable") throw recovery.error;
    if (recovery.kind === "rejected") throw unauthorized;
    // Tek yeniden deneme: bir daha 401 gelirse yenileme döngüsüne girmeden hata olarak döner.
    response = await send(config, path, init, recovery.accessToken);
  }

  if (!response.ok) throw await toApiError(response);
  return parseSuccess<T>(response);
}

function requireConfig(): ApiClientConfig {
  if (!activeConfig) {
    throw new Error("API istemcisi yapılandırılmadı: önce configureApiClient() çağır.");
  }
  return activeConfig;
}

function normalizePath(url: string): string {
  return url.startsWith("/") ? url : `/${url}`;
}

function pathnameOf(path: string): string {
  const end = path.search(/[?#]/);
  const pathname = end === -1 ? path : path.slice(0, end);
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function joinUrl(config: ApiClientConfig, path: string): string {
  return `${config.baseUrl.replace(/\/+$/, "")}${path}`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function isAbortError(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { name?: unknown }).name === "AbortError";
}

function createAbortError(signal?: AbortSignal | null): unknown {
  if (signal?.reason !== undefined) return signal.reason;
  const error = new Error("İstek iptal edildi.");
  error.name = "AbortError";
  return error;
}

/** Tek bir HTTP denemesi. Ağ hatasını ApiError'a çevirir, iptali olduğu gibi geçirir. */
async function send(
  config: ApiClientConfig,
  path: string,
  init: RequestInit,
  accessToken: string | null,
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (accessToken && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${accessToken}`);

  // Orval gövdeyi zaten JSON.stringify eder; elle çağrılırsa düz nesne de kabul edilir.
  // Akış (ReadableStream) gövdeler yeniden denemede tekrar okunamaz, API'de kullanılmaz.
  let body = init.body as unknown;
  if (isPlainObject(body) || Array.isArray(body)) body = JSON.stringify(body);
  if (typeof body === "string" && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  return rawFetch(config, joinUrl(config, path), { ...init, headers, body: body as BodyInit | null | undefined });
}

async function rawFetch(config: ApiClientConfig, url: string, init: RequestInit): Promise<Response> {
  // Yerel değişkene al: `config.fetch(...)` olarak çağrılırsa tarayıcıda "Illegal invocation" verir.
  const fetchImpl = config.fetch ?? fetch;
  try {
    return await fetchImpl(url, init);
  } catch (error) {
    if (isAbortError(error) || init.signal?.aborted) throw error;
    throw networkError(error);
  }
}

function networkError(cause: unknown): ApiError {
  return new ApiError(0, NETWORK_ERROR_MESSAGE, { code: "NETWORK_ERROR", cause });
}

async function readText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw networkError(error);
  }
}

async function parseSuccess<T>(response: Response): Promise<T> {
  if (response.status === 204 || response.status === 205) return undefined as T;
  const text = await readText(response);
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    // JSON bildiren ama bozuk yanıt sözleşme ihlalidir; düz metin yanıt olduğu gibi verilir.
    if (/json/i.test(response.headers.get("Content-Type") ?? "")) {
      throw new ApiError(response.status, "Sunucudan beklenmeyen bir yanıt geldi.", { code: "INVALID_RESPONSE" });
    }
    return text as T;
  }
}

const DEFAULT_MESSAGES: Record<number, string> = {
  400: "İstek geçersiz.",
  401: "Bu işlem için oturum açman gerekiyor.",
  403: "Bu işlem için yetkin yok.",
  404: "Aradığın kayıt bulunamadı.",
  409: "İstek mevcut durumla çakışıyor.",
  429: "Çok fazla istek gönderdin. Biraz bekleyip tekrar dene.",
};

function defaultMessage(status: number): string {
  if (DEFAULT_MESSAGES[status]) return DEFAULT_MESSAGES[status];
  if (status >= 500) return "Sunucu şu an yanıt veremiyor. Biraz sonra tekrar dene.";
  return `İstek başarısız oldu (HTTP ${status}).`;
}

/** Hata gövdesi `{ statusCode, code, message, details? }`; gövde bozuksa ya da boşsa durum koduna göre mesaj verir. */
async function toApiError(response: Response): Promise<ApiError> {
  const text = await readText(response);
  let payload: unknown;
  try {
    payload = text ? JSON.parse(text) : undefined;
  } catch {
    payload = undefined;
  }
  const body = isPlainObject(payload) ? payload : {};
  // Sözleşmede message string; Nest'in varsayılan doğrulama hatası dizi döner, yine de gösterilebilsin.
  const rawMessage = Array.isArray(body.message)
    ? body.message.filter((part): part is string => typeof part === "string").join(" ")
    : body.message;
  const message = typeof rawMessage === "string" && rawMessage.trim() ? rawMessage : defaultMessage(response.status);
  return new ApiError(response.status, message, {
    code: typeof body.code === "string" ? body.code : undefined,
    details: body.details,
  });
}

type RefreshOutcome =
  | { kind: "ok"; accessToken: string }
  /** Sunucu yenileme belirtecini reddetti (ya da hiç yok): oturum bitti, onAuthFailure çağrıldı. */
  | { kind: "rejected" }
  /** Ağ/sunucu geçici olarak yanıt vermedi: oturum geçerli olabilir, kapatılmaz. */
  | { kind: "unavailable"; error: ApiError };

type Recovery = { kind: "retry"; accessToken: string | null } | Exclude<RefreshOutcome, { kind: "ok" }>;

async function recoverSession(
  config: ApiClientConfig,
  sentToken: string | null,
  signal: AbortSignal | null | undefined,
): Promise<Recovery> {
  // Eşzamanlı bir istek belirteci zaten yenilediyse (bu istek eski belirteçle gitmişti),
  // ikinci bir yenileme açmadan güncel belirteçle yeniden dene. Döndürülen yenileme
  // belirteci tek kullanımlıktır; gereksiz yenileme aile iptaline yaklaştırır.
  const latest = await config.getAccessToken();
  if (latest && latest !== sentToken) return { kind: "retry", accessToken: latest };

  const outcome = await raceAbort(refreshOnce(config), signal);
  return outcome.kind === "ok" ? { kind: "retry", accessToken: outcome.accessToken } : outcome;
}

/** Tek uçuşlu yenileme: eşzamanlı 401'ler aynı isteği paylaşır. İptal paylaşılan isteği durdurmaz. */
function refreshOnce(config: ApiClientConfig): Promise<RefreshOutcome> {
  if (!refreshInFlight) {
    const flight: Promise<RefreshOutcome> = refreshTokens(config).finally(() => {
      if (refreshInFlight === flight) refreshInFlight = null;
    });
    refreshInFlight = flight;
  }
  return refreshInFlight;
}

async function refreshTokens(config: ApiClientConfig): Promise<RefreshOutcome> {
  const refreshToken = await config.getRefreshToken();
  if (!refreshToken) {
    config.onAuthFailure();
    return { kind: "rejected" };
  }

  let response: Response;
  try {
    response = await rawFetch(config, joinUrl(config, "/v1/auth/refresh"), {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch (error) {
    return { kind: "unavailable", error: error instanceof ApiError ? error : networkError(error) };
  }

  if (!response.ok) {
    const error = await toApiError(response).catch((cause: unknown) => networkError(cause));
    // 5xx, hız sınırı ve zaman aşımı geçicidir; diğer 4xx'ler belirtecin geçersiz olduğunu söyler.
    if (response.status >= 500 || response.status === 429 || response.status === 408) {
      return { kind: "unavailable", error };
    }
    config.onAuthFailure();
    return { kind: "rejected" };
  }

  let pair: unknown;
  try {
    pair = JSON.parse(await readText(response));
  } catch (error) {
    return { kind: "unavailable", error: error instanceof ApiError ? error : badRefreshResponse() };
  }
  if (!isPlainObject(pair) || typeof pair.accessToken !== "string" || typeof pair.refreshToken !== "string") {
    return { kind: "unavailable", error: badRefreshResponse() };
  }
  await config.onTokensRefreshed({ accessToken: pair.accessToken, refreshToken: pair.refreshToken });
  return { kind: "ok", accessToken: pair.accessToken };
}

function badRefreshResponse(): ApiError {
  return new ApiError(502, "Oturum yenileme yanıtı anlaşılamadı.", { code: "INVALID_RESPONSE" });
}

function raceAbort<T>(promise: Promise<T>, signal: AbortSignal | null | undefined): Promise<T> {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(createAbortError(signal));
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(createAbortError(signal));
    signal.addEventListener("abort", onAbort, { once: true });
    promise
      .then(resolve, reject)
      .finally(() => signal.removeEventListener("abort", onAbort));
  });
}

/**
 * Belirteç depolamanın platformdan bağımsız çekirdeği. React Native içe aktarmadığı için
 * Node altında doğrudan test edilir (bkz. tokenStorage.test.ts). Platform bağlantısı: tokenStorage.ts.
 */

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** expo-secure-store ve Web Storage'ın ortak, asenkron alt kümesi. */
export interface KeyValueStore {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export interface TokenStorage {
  /** Kayıtlı belirteçler; yok, bozuk ya da okunamıyorsa null. Hiçbir zaman fırlatmaz. */
  read(): Promise<AuthTokens | null>;
  /** Bellekte hemen güncellenir; kalıcı yazma başarılıysa true. Depo çalışmıyorsa oturum yalnız bellekte yaşar. */
  write(tokens: AuthTokens): Promise<boolean>;
  /** Çıkış: bellekten hemen silinir; kalıcı silme başarılıysa true. */
  clear(): Promise<boolean>;
}

/** SecureStore anahtarları yalnız harf, rakam, ".", "-" ve "_" içerebilir. */
export const TOKEN_STORAGE_KEY = "wangoh.auth.tokens";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export function isAuthTokens(value: unknown): value is AuthTokens {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return isNonEmptyString(record.accessToken) && isNonEmptyString(record.refreshToken);
}

/** Depodaki ham metni belirteçlere çevirir; bozuk ya da eksik veri null döner. */
export function parseTokens(raw: string | null): AuthTokens | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isAuthTokens(parsed) ? { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken } : null;
  } catch {
    return null;
  }
}

/** Bellek tabanlı depo: platform deposu yokken (ve testlerde) kullanılır. */
export function createMemoryStore(): KeyValueStore {
  const data = new Map<string, string>();
  return {
    getItem: async (key) => data.get(key) ?? null,
    setItem: async (key, value) => {
      data.set(key, value);
    },
    removeItem: async (key) => {
      data.delete(key);
    },
  };
}

/**
 * `store` null ya da hatalıysa (anahtar zinciri kilitli, localStorage kapalı, özel pencere) oturum
 * bellekte yaşamaya devam eder; uygulama çökmez, yalnız yeniden açılışta oturum kaybolur.
 *
 * Kalıcı yazmalar çağrı sırasıyla sıraya girer: hızlı `write` sonrası `clear` çağrılırsa eski
 * yazma, silmenin üstüne binip çıkıştan sonra belirteci geri getirmez. Bellek ise anında güncellenir.
 */
export function createTokenStorage(store: KeyValueStore | null, key: string = TOKEN_STORAGE_KEY): TokenStorage {
  let memory: AuthTokens | null = null;
  // Kalıcı depodan en az bir kez başarıyla okundu ya da bu oturumda yazıldı/silindi.
  let settled = false;
  let queue: Promise<unknown> = Promise.resolve();

  function enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = queue.then(task, task);
    queue = run.catch(() => undefined);
    return run;
  }

  return {
    read() {
      if (settled) return Promise.resolve(memory);
      return enqueue(async () => {
        if (settled) return memory;
        if (!store) {
          settled = true;
          return memory;
        }
        try {
          const raw = await store.getItem(key);
          memory = parseTokens(raw);
          settled = true;
          if (raw && !memory) await store.removeItem(key).catch(() => undefined); // bozuk kaydı temizle
        } catch {
          // Geçici okuma hatası: kalıcı kayıt silinmiş sayılmasın, sonraki okuma yeniden dener.
        }
        return memory;
      });
    },

    write(tokens) {
      if (!isAuthTokens(tokens)) {
        return Promise.reject(new TypeError("Geçersiz belirteç: accessToken ve refreshToken boş olmayan metin olmalı."));
      }
      memory = { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
      settled = true;
      const snapshot = JSON.stringify(memory);
      return enqueue(async () => {
        if (!store) return false;
        try {
          await store.setItem(key, snapshot);
          return true;
        } catch {
          return false;
        }
      });
    },

    clear() {
      memory = null;
      settled = true;
      return enqueue(async () => {
        if (!store) return false;
        try {
          await store.removeItem(key);
          return true;
        } catch {
          return false;
        }
      });
    },
  };
}

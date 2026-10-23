/**
 * Devam eden oyun oturumunun kimliğini yerelde tutar: uygulama kapanıp açılınca ya da sayfa yenilenince
 * oturum kaybolmasın (geri yükleme `GET /v1/games/sessions/:id` ile yapılır; doğrulanamazsa kayıt silinir).
 *
 * Yalnız oturum KİMLİĞİ saklanır (gizli veri yok: cevaplar sunucudadır). Kayıt kullanıcı kimliğine bağlıdır,
 * böylece aynı aygıtta hesap değişince başkasının oturumu denenmez. Depo hata verirse bellekte yaşar.
 * Saf modül: depo enjekte edilir (`KeyValueStore`), platform bağlantısı `storage.ts`tedir.
 */

import type { PlayableGameType } from "./gameTypes";

/** expo-secure-store ve Web Storage'ın ortak, asenkron alt kümesi. */
export interface KeyValueStore {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/** SecureStore anahtarları yalnız harf, rakam, ".", "-" ve "_" içerebilir. */
export const SESSION_STORE_KEY = "wangoh.games.activeSessions";

/** kullanıcı kimliği -> oyun türü -> oturum kimliği */
type Snapshot = Record<string, Partial<Record<PlayableGameType, string>>>;

export interface ActiveSessionStore {
  get(userId: string, gameType: PlayableGameType): Promise<string | null>;
  set(userId: string, gameType: PlayableGameType, sessionId: string): Promise<void>;
  clear(userId: string, gameType: PlayableGameType): Promise<void>;
  /** Yalnız kayıtlı kimlik `sessionId` ise siler (başka bir oturumun kaydına dokunmaz). */
  clearIfMatches(userId: string, gameType: PlayableGameType, sessionId: string): Promise<void>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const GAME_TYPES: readonly PlayableGameType[] = ["flag-quiz", "capital-quiz", "map-guess"];

/** Depodaki ham metni güvenle çözer; bozuk veri boş kayıt sayılır. */
export function parseSnapshot(raw: string | null): Snapshot {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return {};
    const result: Snapshot = {};
    for (const [userId, perUser] of Object.entries(parsed)) {
      if (!isRecord(perUser)) continue;
      const entry: Partial<Record<PlayableGameType, string>> = {};
      for (const gameType of GAME_TYPES) {
        const id = perUser[gameType];
        if (typeof id === "string" && id.length > 0) entry[gameType] = id;
      }
      if (Object.keys(entry).length > 0) result[userId] = entry;
    }
    return result;
  } catch {
    return {};
  }
}

export function createActiveSessionStore(backend: KeyValueStore | null): ActiveSessionStore {
  let memory: Snapshot | null = null;
  // Okuma-değiştirme-yazma yarışı olmasın: işlemler sırayla çalışır.
  let queue: Promise<unknown> = Promise.resolve();

  async function load(): Promise<Snapshot> {
    if (memory) return memory;
    let raw: string | null = null;
    if (backend) {
      try {
        raw = await backend.getItem(SESSION_STORE_KEY);
      } catch {
        raw = null;
      }
    }
    memory = parseSnapshot(raw);
    return memory;
  }

  async function persist(snapshot: Snapshot): Promise<void> {
    memory = snapshot;
    if (!backend) return;
    try {
      if (Object.keys(snapshot).length === 0) await backend.removeItem(SESSION_STORE_KEY);
      else await backend.setItem(SESSION_STORE_KEY, JSON.stringify(snapshot));
    } catch {
      // Kalıcı yazma başarısız: oturum bu süreçte bellekten yine bulunur.
    }
  }

  function serial<T>(task: () => Promise<T>): Promise<T> {
    const run = queue.then(task, task);
    queue = run.catch(() => undefined);
    return run;
  }

  function without(snapshot: Snapshot, userId: string, gameType: PlayableGameType): Snapshot {
    const perUser = { ...snapshot[userId] };
    delete perUser[gameType];
    const next = { ...snapshot };
    if (Object.keys(perUser).length === 0) delete next[userId];
    else next[userId] = perUser;
    return next;
  }

  return {
    get: (userId, gameType) =>
      serial(async () => {
        const snapshot = await load();
        return snapshot[userId]?.[gameType] ?? null;
      }),
    set: (userId, gameType, sessionId) =>
      serial(async () => {
        const snapshot = await load();
        await persist({ ...snapshot, [userId]: { ...snapshot[userId], [gameType]: sessionId } });
      }),
    clear: (userId, gameType) =>
      serial(async () => {
        const snapshot = await load();
        if (snapshot[userId]?.[gameType] === undefined) return;
        await persist(without(snapshot, userId, gameType));
      }),
    clearIfMatches: (userId, gameType, sessionId) =>
      serial(async () => {
        const snapshot = await load();
        if (snapshot[userId]?.[gameType] !== sessionId) return;
        await persist(without(snapshot, userId, gameType));
      }),
  };
}

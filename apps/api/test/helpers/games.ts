import { eq } from "drizzle-orm";
import type { GameType } from "../../src/db/schema/enums.js";
import { continents, countries, gameSessions, scores } from "../../src/db/schema/index.js";
import type { StoredRound } from "../../src/games/games.types.js";
import { GameClock, GameRandom } from "../../src/games/games.runtime.js";
import { bearer } from "./users.js";
import type { TestApp } from "./create-test-app.js";

/** Test için uydurma (açıkça yapay) ülke tohumu: gerçek ülke verisi kullanılmaz, başka modülün tohumuna bağlanılmaz. */
export interface FixtureCountry {
  code: string;
  continent: string;
  capital?: string[];
  withCoordinates?: boolean;
  name?: string;
}

const CONTINENT_SLUGS = ["africa", "americas", "asia", "europe", "oceania"];

/** `n` ülke üretir: kıtalara dağıtılmış, hepsinin başkenti ve koordinatı var. */
export function fixtureCountries(n: number): FixtureCountry[] {
  return Array.from({ length: n }, (_, i) => ({
    code: `${String.fromCharCode(65 + Math.floor(i / 26))}${String.fromCharCode(65 + (i % 26))}`,
    continent: CONTINENT_SLUGS[i % CONTINENT_SLUGS.length]!,
  }));
}

/** Kıtaları ve ülkeleri veritabanına yazar. Varsayılan: 30 ülke (kıta başına 6). */
export async function seedGameCountries(t: Pick<TestApp, "db">, list: FixtureCountry[] = fixtureCountries(30)): Promise<FixtureCountry[]> {
  await t.db
    .insert(continents)
    .values(CONTINENT_SLUGS.map((slug, position) => ({ slug, position, translations: { tr: { name: slug } } })))
    .onConflictDoNothing();
  await t.db.insert(countries).values(
    list.map((c, i) => ({
      code: c.code,
      iso3: `${c.code}${String.fromCharCode(88 + (i % 3))}`,
      continentSlug: c.continent,
      flag: `flag-${c.code}`,
      // Kesirli değerler: sızıntı testleri hedef koordinatı sayı olarak ararken küçük tam sayılarla çakışmaz.
      latitude: c.withCoordinates === false ? null : ((i * 7) % 150) - 75 + 0.137,
      longitude: c.withCoordinates === false ? null : ((i * 13) % 340) - 170 + 0.271,
      capital: c.capital ?? [`Başkent ${c.code}`],
      translations: { tr: { name: c.name ?? `Ülke ${c.code}` }, en: { name: c.name ?? `Country ${c.code}` } },
    })),
  );
  return list;
}

export interface RoundBody {
  index: number;
  question: { flag: string | null; flagUrl: string | null; countryName: string | null };
  options: Array<{ id: string; label: string }> | null;
  timeLimitMs: number;
  startedAt: string;
  deadlineAt: string;
}

export interface StartBody {
  sessionId: string;
  gameType: GameType;
  roundsTotal: number;
  expiresAt: string;
  round: RoundBody;
}

export async function startGame(t: TestApp, token: string, type: GameType, query = ""): Promise<StartBody> {
  const res = await t.http.post(`/v1/games/${type}/sessions${query}`).set(bearer(token));
  if (res.status !== 201) throw new Error(`startGame beklenmedik yanıt ${res.status}: ${JSON.stringify(res.body)}`);
  return res.body as StartBody;
}

/** Sunucu sırrını doğrudan veritabanından okur (yalnız testlerde; istemciye asla gitmez). */
export async function secretRounds(t: Pick<TestApp, "db">, sessionId: string): Promise<StoredRound[]> {
  const [row] = await t.db.select({ rounds: gameSessions.rounds }).from(gameSessions).where(eq(gameSessions.id, sessionId));
  return row!.rounds as StoredRound[];
}

export type Answer = string | { lat: number; lng: number };

/** Turun doğru cevabı (testte sırdan okunur). */
export function correctAnswerOf(round: StoredRound, type: GameType): Answer {
  return type === "map-guess" ? { lat: round.latitude!, lng: round.longitude! } : round.code;
}

/** Turda yanlış bir seçenek (çoktan seçmeli) ya da hedefe çok uzak bir nokta (harita). */
export function wrongAnswerOf(round: StoredRound, type: GameType): Answer {
  if (type !== "map-guess") return round.options.find((o) => o.code !== round.code)!.code;
  return { lat: round.latitude! > 0 ? -round.latitude! : 70, lng: round.longitude! > 0 ? round.longitude! - 170 : round.longitude! + 170 };
}

export function submit(t: TestApp, token: string, sessionId: string, roundIndex: number, answer: unknown, query = "") {
  return t.http.post(`/v1/games/sessions/${sessionId}/answers${query}`).set(bearer(token)).send({ roundIndex, answer });
}

export function finish(t: TestApp, token: string, sessionId: string) {
  return t.http.post(`/v1/games/sessions/${sessionId}/finish`).set(bearer(token));
}

export interface PlayOptions {
  /** Tur doğru mu cevaplansın? Varsayılan: hepsi doğru. */
  correct?: (index: number) => boolean;
  /** Her cevap için sunucu saatini bu kadar ilerletmek yerine sabit tutmak isteyenler için (varsayılan: hiçbir şey). */
  query?: string;
}

/** Oturumu baştan sona oynar (cevaplar sırdan okunur) ve bitirir. */
export async function playThrough(t: TestApp, token: string, type: GameType, opts: PlayOptions = {}) {
  const start = await startGame(t, token, type, opts.query);
  const rounds = await secretRounds(t, start.sessionId);
  const answers = [];
  for (let i = 0; i < rounds.length; i++) {
    const good = opts.correct ? opts.correct(i) : true;
    const body = good ? correctAnswerOf(rounds[i]!, type) : wrongAnswerOf(rounds[i]!, type);
    const res = await submit(t, token, start.sessionId, i, body, opts.query);
    if (res.status !== 200) throw new Error(`cevap ${i} beklenmedik yanıt ${res.status}: ${JSON.stringify(res.body)}`);
    answers.push(res.body);
  }
  const done = await finish(t, token, start.sessionId);
  if (done.status !== 200) throw new Error(`finish beklenmedik yanıt ${done.status}: ${JSON.stringify(done.body)}`);
  return { start, answers, finish: done.body, sessionId: start.sessionId };
}

/** Veritabanına doğrudan bitmiş oturum + puan satırı yazar (liderlik/istatistik testleri için; gerçek oyun akışı başka testlerde). */
export async function insertScore(
  t: Pick<TestApp, "db">,
  input: { userId: string; gameType: GameType; score: number; createdAt?: Date; correctCount?: number; roundsTotal?: number; durationMs?: number },
): Promise<string> {
  const createdAt = input.createdAt ?? new Date();
  const [session] = await t.db
    .insert(gameSessions)
    .values({
      userId: input.userId,
      gameType: input.gameType,
      status: "finished",
      rounds: [],
      currentRound: input.roundsTotal ?? 10,
      score: input.score,
      correctCount: input.correctCount ?? 0,
      startedAt: createdAt,
      finishedAt: createdAt,
      expiresAt: new Date(createdAt.getTime() + 30 * 60 * 1000),
    })
    .returning({ id: gameSessions.id });
  const [row] = await t.db
    .insert(scores)
    .values({
      userId: input.userId,
      gameType: input.gameType,
      sessionId: session!.id,
      score: input.score,
      correctCount: input.correctCount ?? 0,
      roundsTotal: input.roundsTotal ?? 10,
      durationMs: input.durationMs ?? 60_000,
      createdAt,
    })
    .returning({ id: scores.id });
  return row!.id;
}

export function gameClock(t: Pick<TestApp, "app">): GameClock {
  return t.app.get(GameClock, { strict: false });
}

export function gameRandom(t: Pick<TestApp, "app">): GameRandom {
  return t.app.get(GameRandom, { strict: false });
}

/** Yanıt gövdesinde (herhangi bir derinlikte) bu anahtarlardan biri geçiyor mu? */
export function keysIn(value: unknown, found: Set<string> = new Set()): Set<string> {
  if (Array.isArray(value)) value.forEach((v) => keysIn(v, found));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      found.add(k);
      keysIn(v, found);
    }
  }
  return found;
}

/** Yanıt gövdesindeki (her derinlikte) sayı değerleri; metin içindeki rakamlarla (tarih damgaları) karışmaz. */
export function numbersIn(value: unknown, found: number[] = []): number[] {
  if (typeof value === "number") found.push(value);
  else if (Array.isArray(value)) value.forEach((v) => numbersIn(v, found));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => numbersIn(v, found));
  return found;
}

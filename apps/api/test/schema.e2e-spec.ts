import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  blogPosts,
  cities,
  cityGuides,
  continents,
  countries,
  countryTravel,
  gameSessions,
  refreshTokens,
  scores,
} from "../src/db/schema/index.js";
import { bearer, createTestApp, registerUser, type TestApp } from "./helpers/index.js";

/** Şemanın gerçek davranışı: FK davranışları, benzersizlikler, enum'lar. Alan görevleri buna güvenir. */
describe("veritabanı şeması", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp();
    await t.db.insert(continents).values({ slug: "europe", position: 3, translations: { tr: { name: "Avrupa" }, en: { name: "Europe" } } });
    await t.db.insert(countries).values({
      code: "FR",
      iso3: "FRA",
      continentSlug: "europe",
      flag: "🇫🇷",
      latitude: 46.2,
      longitude: 2.2,
      borders: ["BEL", "DEU"],
      aliases: ["France"],
      capital: ["Paris"],
      translations: { tr: { name: "Fransa" } },
      hasTravel: true,
    });
  });
  afterAll(() => t.close());

  const newSession = async (userId: string) => {
    const [session] = await t.db
      .insert(gameSessions)
      .values({ userId, gameType: "flag-quiz", rounds: [{ target: "FR" }], expiresAt: new Date(Date.now() + 30 * 60_000) })
      .returning();
    return session!;
  };

  it("kullanıcı silinince yenileme belirteçleri, oyun oturumları ve puanlar gider; blog yazısı kalır, yazar null olur", async () => {
    const u = await registerUser(t.http);
    const session = await newSession(u.user.id);
    await t.db.insert(scores).values({ userId: u.user.id, gameType: "flag-quiz", sessionId: session.id, score: 900, correctCount: 8, roundsTotal: 10, durationMs: 41_000 });
    const [post] = await t.db
      .insert(blogPosts)
      .values({ slug: `yazi-${randomUUID().slice(0, 8)}`, authorId: u.user.id, countryCode: "FR", translations: { tr: { title: "Başlık", excerpt: "Özet", body: [] } } })
      .returning();

    await t.http.delete("/v1/users/me").set(bearer(u.accessToken)).send({ password: u.password }).expect(204);

    expect(await t.db.select().from(refreshTokens).where(eq(refreshTokens.userId, u.user.id))).toHaveLength(0);
    expect(await t.db.select().from(gameSessions).where(eq(gameSessions.userId, u.user.id))).toHaveLength(0);
    expect(await t.db.select().from(scores).where(eq(scores.userId, u.user.id))).toHaveLength(0);
    const [kept] = await t.db.select().from(blogPosts).where(eq(blogPosts.id, post!.id));
    expect(kept).toBeDefined();
    expect(kept!.authorId).toBeNull();
    expect(kept!.status).toBe("draft");
    expect(kept!.tags).toEqual([]);
  });

  it("scores.session_id benzersiz: bir oturum tek puan satırı yazar (finish idempotensi için)", async () => {
    const u = await registerUser(t.http);
    const session = await newSession(u.user.id);
    const row = { userId: u.user.id, gameType: "flag-quiz" as const, sessionId: session.id, score: 10, correctCount: 1, roundsTotal: 10, durationMs: 1000 };
    await t.db.insert(scores).values(row);
    await expect(t.db.insert(scores).values(row)).rejects.toBeTruthy();
  });

  it("enum'lar geçersiz değeri reddeder; varsayılanlar doğru", async () => {
    const u = await registerUser(t.http);
    await expect(
      t.db.insert(gameSessions).values({ userId: u.user.id, gameType: "yok-oyun" as never, expiresAt: new Date() }),
    ).rejects.toBeTruthy();
    const session = await newSession(u.user.id);
    expect(session).toMatchObject({ status: "active", currentRound: 0, score: 0, correctCount: 0, finishedAt: null, roundStartedAt: null });
  });

  it("ülke silinince seyahat bilgisi, şehirler ve rehberler gider; blog country_code null olur; şehir slug'ı ülke içinde benzersiz", async () => {
    await t.db.insert(countries).values({ code: "BE", iso3: "BEL", continentSlug: "europe", translations: { tr: { name: "Belçika" } } });
    await t.db.insert(countryTravel).values({ countryCode: "BE", budget: "Orta", iata: "BRU", translations: { tr: { description: "Açıklama" } }, completeLangs: ["tr"] });
    const [city] = await t.db.insert(cities).values({ countryCode: "BE", slug: "brugge", translations: { tr: { name: "Brugge" } } }).returning();
    await t.db.insert(cityGuides).values({ cityId: city!.id, translations: { tr: { intro: "x" } }, completeLangs: ["tr"] });
    await expect(t.db.insert(cities).values({ countryCode: "BE", slug: "brugge", translations: { tr: { name: "Başka" } } })).rejects.toBeTruthy();
    const [post] = await t.db.insert(blogPosts).values({ slug: `be-${randomUUID().slice(0, 8)}`, countryCode: "BE", translations: { tr: { title: "T" } } }).returning();

    await t.db.delete(countries).where(eq(countries.code, "BE"));

    expect(await t.db.select().from(countryTravel).where(eq(countryTravel.countryCode, "BE"))).toHaveLength(0);
    expect(await t.db.select().from(cities).where(eq(cities.countryCode, "BE"))).toHaveLength(0);
    expect(await t.db.select().from(cityGuides).where(eq(cityGuides.cityId, city!.id))).toHaveLength(0);
    expect((await t.db.select().from(blogPosts).where(eq(blogPosts.id, post!.id)))[0]!.countryCode).toBeNull();
  });

  it("ülke var olmayan kıtaya bağlanamaz; iso3 benzersiz; jsonb ve dizi sütunları gidiş-dönüş yapar", async () => {
    await expect(t.db.insert(countries).values({ code: "XX", iso3: "XXX", continentSlug: "atlantis", translations: { tr: { name: "X" } } })).rejects.toBeTruthy();
    await expect(t.db.insert(countries).values({ code: "FZ", iso3: "FRA", continentSlug: "europe", translations: { tr: { name: "Kopya" } } })).rejects.toBeTruthy();
    const [fr] = await t.db.select().from(countries).where(eq(countries.code, "FR"));
    expect(fr).toMatchObject({ borders: ["BEL", "DEU"], capital: ["Paris"], translations: { tr: { name: "Fransa" } }, landlocked: false, hasTravel: true });
    const [europe] = await t.db.select().from(continents).where(eq(continents.slug, "europe"));
    expect(europe!.translations.en?.name).toBe("Europe");
  });

  it("blog slug benzersiz", async () => {
    const slug = `tek-${randomUUID().slice(0, 8)}`;
    await t.db.insert(blogPosts).values({ slug, translations: { tr: { title: "A" } } });
    await expect(t.db.insert(blogPosts).values({ slug, translations: { tr: { title: "B" } } })).rejects.toBeTruthy();
  });
});

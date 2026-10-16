import { sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDatabase, type DatabaseHandle, parseInt8, rowsOf } from "../src/db/client.js";
import { provisionPostgres, TEST_DATABASE_URL } from "./helpers/index.js";

// count(*), sum(...)::bigint, rank() over (...) ve ::bigint dönüşümleri PostgreSQL'de int8 üretir.
// node-postgres bunları varsayılan olarak DİZGİ ("1") döner, PGlite ise sayı (1): testler PGlite'ta
// geçip üretimde sayaç/sıra alanları dizgiye dönerdi. İki sürücü de aynı JS tipini vermelidir.
const RAW = sql`
  select count(*) as c, 7::bigint as b, sum(x)::bigint as s, rank() over (order by x) as rk,
         array[1, 2]::bigint[] as arr, 9007199254740993::bigint as big, 1.5::numeric as n
  from (values (3), (4)) as t(x) group by x order by x limit 1`;
const EXPECTED = { c: 1, b: 7, s: 3, rk: 1, arr: [1, 2], big: 9007199254740993n, n: "1.5" };

describe("parseInt8", () => {
  it("güvenli aralıkta number, dışında BigInt döner (PGlite ile aynı kural)", () => {
    expect(parseInt8("0")).toBe(0);
    expect(parseInt8("42")).toBe(42);
    expect(parseInt8("-7")).toBe(-7);
    expect(parseInt8("9007199254740991")).toBe(9007199254740991);
    expect(parseInt8("9007199254740992")).toBe(9007199254740992n);
    expect(parseInt8("-9007199254740993")).toBe(-9007199254740993n);
    expect(parseInt8("9223372036854775807")).toBe(9223372036854775807n);
  });
});

function suite(name: string, open: () => Promise<{ handle: DatabaseHandle; drop?: () => Promise<void> }>): void {
  describe(name, () => {
    let handle: DatabaseHandle;
    let drop: (() => Promise<void>) | undefined;
    beforeAll(async () => {
      ({ handle, drop } = await open());
    });
    afterAll(async () => {
      await handle.close();
      await drop?.();
    });

    it("ham db.execute: int8 sonuçları number (güvenli aralık dışı BigInt), numeric dizgi", async () => {
      const row = rowsOf<Record<string, unknown>>(await handle.db.execute(RAW))[0];
      expect(row).toEqual(EXPECTED);
      expect(typeof row?.c).toBe("number");
    });

    it("sorgu oluşturucu: sql`count(*)` de number", async () => {
      const [row] = await handle.db.select({ c: sql<number>`count(*)`, r: sql<number>`7::bigint` }).from(sql`(select 1) t`);
      expect(row).toEqual({ c: 1, r: 7 });
      expect(typeof row?.c).toBe("number");
    });
  });
}

suite("PGlite", async () => ({ handle: await createDatabase({ databaseUrl: undefined, pgliteDir: "memory://" }) }));

describe.skipIf(!TEST_DATABASE_URL)("gerçek PostgreSQL (node-postgres)", () => {
  suite("node-postgres", async () => {
    const db = await provisionPostgres(TEST_DATABASE_URL!);
    return { handle: await createDatabase({ databaseUrl: db.url, pgliteDir: "memory://" }), drop: db.drop };
  });
});

import { plainToInstance } from "class-transformer";
import { IsString, validate } from "class-validator";
import { describe, expect, it } from "vitest";
import { findJsonProblem, MAX_JSON_DEPTH, MAX_JSON_OBJECT_KEYS } from "./request-guards.js";
import { IsOptionalNotNull, NoNullBytes } from "./validators.js";
import { ListUsersQueryDto } from "../users/dto/user-requests.dto.js";

const nestedArray = (levels: number): unknown => {
  let value: unknown = [];
  for (let i = 1; i < levels; i++) value = [value];
  return value;
};

describe("findJsonProblem", () => {
  it("sıradan gövdeler ve ilkel değerler sorunsuz", () => {
    expect(findJsonProblem(undefined)).toBeUndefined();
    expect(findJsonProblem(null)).toBeUndefined();
    expect(findJsonProblem({ email: "a@b.co", n: 1, ok: true, nothing: null, list: ["a", { b: "ç" }], emoji: "😀" })).toBeUndefined();
    expect(findJsonProblem(JSON.parse('{"__proto__":{"role":"admin"},"constructor":{"x":1}}'))).toBeUndefined();
  });

  it("derinlik sınırı: MAX_JSON_DEPTH kapsayıcı seviyesi geçer, bir fazlası reddedilir", () => {
    expect(findJsonProblem({ x: nestedArray(MAX_JSON_DEPTH - 1) })).toBeUndefined(); // x kökün altında, toplam MAX seviye
    expect(findJsonProblem({ x: nestedArray(MAX_JSON_DEPTH) })).toEqual({ field: "x", code: "maxDepth", message: "İç içe yapı çok derin." });
    expect(findJsonProblem(nestedArray(MAX_JSON_DEPTH))).toBeUndefined();
    expect(findJsonProblem(nestedArray(MAX_JSON_DEPTH + 1))).toMatchObject({ field: "0", code: "maxDepth" });
  });

  it("yığını taşıracak kadar derin gövdede kendisi çökmez (özyineleme sınırlı)", () => {
    expect(findJsonProblem({ x: nestedArray(200_000) })).toMatchObject({ field: "x", code: "maxDepth" });
    let obj: Record<string, unknown> = {};
    const root = obj;
    for (let i = 0; i < 100_000; i++) {
      const child: Record<string, unknown> = {};
      obj.a = child;
      obj = child;
    }
    expect(findJsonProblem(root)).toMatchObject({ field: "a", code: "maxDepth" });
  });

  it("anahtar sayısı sınırı yalnız nesne başına; diziler sınırlanmaz", () => {
    const keys = (n: number) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`k${i}`, 1]));
    expect(findJsonProblem(keys(MAX_JSON_OBJECT_KEYS))).toBeUndefined();
    expect(findJsonProblem(keys(MAX_JSON_OBJECT_KEYS + 1))).toEqual({ field: "", code: "maxKeys", message: "Çok fazla alan gönderildi." });
    expect(findJsonProblem({ inner: keys(MAX_JSON_OBJECT_KEYS + 1) })).toMatchObject({ field: "inner", code: "maxKeys" });
    expect(findJsonProblem({ list: Array.from({ length: 5_000 }, (_, i) => i) })).toBeUndefined();
  });

  it("eşleşmemiş vekil karakter değerde, dizide ve anahtarda bulunur; yol bildirilir", () => {
    const expected = { code: "isWellFormed", message: "Geçersiz Unicode karakter içeriyor." };
    expect(findJsonProblem({ email: "a\ud800b@example.com" })).toEqual({ field: "email", ...expected });
    expect(findJsonProblem({ email: "\udc00" })).toEqual({ field: "email", ...expected });
    expect(findJsonProblem({ email: "\udc00\ud800" })).toEqual({ field: "email", ...expected }); // ters sıra çift değildir
    expect(findJsonProblem({ list: ["ok", "x\ud83d"] })).toEqual({ field: "list.1", ...expected });
    expect(findJsonProblem({ a: { "b\ud800": 1 } })).toEqual({ field: "a", ...expected }); // anahtarın kendisi yankılanmaz
    expect(findJsonProblem(["\ud800"])).toEqual({ field: "0", ...expected });
  });

  it("geçerli vekil çifti (emoji, nadir karakterler) sorun sayılmaz", () => {
    expect(findJsonProblem({ name: "Mutlu 😀", tag: "𝒳", key: 1, "😀": 2 })).toBeUndefined();
  });

  it("yanıtta yankılanan alan yolu kırpılır", () => {
    const longKey = "k".repeat(5_000);
    const found = findJsonProblem({ [longKey]: "\ud800" });
    expect(found?.code).toBe("isWellFormed");
    expect(found?.field.length).toBeLessThanOrEqual(200);
  });
});

describe("doğrulama dekoratörleri", () => {
  class Probe {
    @IsOptionalNotNull()
    @IsString()
    name?: string;

    @NoNullBytes()
    @IsString()
    text?: string;
  }
  const check = async (plain: object) => (await validate(plainToInstance(Probe, plain))).flatMap((e) => Object.keys(e.constraints ?? {}).map((c) => `${e.property}:${c}`));

  it("IsOptionalNotNull: alan yoksa geçer, null reddedilir (IsOptional'ın aksine)", async () => {
    expect(await check({ text: "x" })).toEqual([]);
    expect(await check({ text: "x", name: "Ad" })).toEqual([]);
    expect(await check({ text: "x", name: null })).toEqual(["name:isString"]);
    expect(await check({ text: "x", name: 5 })).toEqual(["name:isString"]);
  });

  it("NoNullBytes: NUL içeren metin reddedilir, öbürü geçer", async () => {
    expect(await check({ text: "a\u0000b" })).toContain("text:noNullBytes");
    expect(await check({ text: "\u0000" })).toContain("text:noNullBytes");
    expect(await check({ text: "a\\u0000b ve ␀" })).toEqual([]);
  });

  it("kullanıcı listesi q parametresi NUL içeremez (DTO düzeyi; URL denetimi ayrıca vardır)", async () => {
    const errors = await validate(plainToInstance(ListUsersQueryDto, { q: "a\u0000b" }));
    expect(errors.flatMap((e) => Object.keys(e.constraints ?? {}))).toEqual(["noNullBytes"]);
    expect(await validate(plainToInstance(ListUsersQueryDto, { q: "normal" }))).toHaveLength(0);
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch, configureApiClient, type ApiClientConfig } from "./mutator";

type FetchHandler = (url: string, init: RequestInit) => Response | Promise<Response>;

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

function deferred<T = void>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

const UNAUTHORIZED = { statusCode: 401, code: "AUTH_TOKEN_INVALID", message: "Oturum geçersiz." };
const NEW_PAIR = { accessToken: "a2", refreshToken: "r2", expiresIn: 900 };

/** Sahte fetch ve bellekte belirteç deposu ile istemciyi yapılandırır. */
function setup(handler: FetchHandler, tokens: { access: string | null; refresh: string | null } = { access: "a1", refresh: "r1" }) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => handler(String(input), init ?? {}));
  const onTokensRefreshed = vi.fn((pair: { accessToken: string; refreshToken: string }) => {
    tokens.access = pair.accessToken;
    tokens.refresh = pair.refreshToken;
  });
  const onAuthFailure = vi.fn(() => {
    tokens.access = null;
    tokens.refresh = null;
  });
  const config: ApiClientConfig = {
    baseUrl: "http://api.test",
    getAccessToken: () => tokens.access,
    getRefreshToken: () => tokens.refresh,
    onTokensRefreshed,
    onAuthFailure,
    fetch: fetchMock as unknown as typeof fetch,
  };
  configureApiClient(config);
  const calls = () =>
    fetchMock.mock.calls.map(([input, init]) => ({
      url: String(input),
      method: init?.method ?? "GET",
      headers: new Headers(init?.headers),
      body: init?.body,
      signal: init?.signal,
    }));
  const refreshCalls = () => calls().filter((call) => call.url.endsWith("/v1/auth/refresh"));
  return { config, fetchMock, onTokensRefreshed, onAuthFailure, tokens, calls, refreshCalls };
}

const isRefresh = (url: string) => url.endsWith("/v1/auth/refresh");
const bearer = (init: RequestInit) => new Headers(init.headers).get("Authorization");

/** a2 ile gelen istek geçer, diğerleri 401 alır; yenileme uç noktası yeni çifti verir. */
const expiringSession: FetchHandler = (url, init) => {
  if (isRefresh(url)) return json(200, NEW_PAIR);
  return bearer(init) === "Bearer a2" ? json(200, { ok: true }) : json(401, UNAUTHORIZED);
};

describe("apiFetch: yapılandırma", () => {
  it("configureApiClient çağrılmadıysa anlaşılır bir hata fırlatır", async () => {
    // Modül durumu testler arasında kalır; yeni bir modül örneği yapılandırılmamış başlar.
    vi.resetModules();
    const fresh = await import("./mutator");
    await expect(fresh.apiFetch("/v1/x")).rejects.toThrow(/configureApiClient/);
  });

  it("özel fetch'i `this` olmadan çağırır (tarayıcıdaki Illegal invocation hatasını önler)", async () => {
    let seenThis: unknown = "unset";
    const config: ApiClientConfig = {
      baseUrl: "http://api.test",
      getAccessToken: () => null,
      getRefreshToken: () => null,
      onTokensRefreshed: () => {},
      onAuthFailure: () => {},
      fetch: function (this: unknown) {
        seenThis = this;
        return Promise.resolve(json(200, { ok: true }));
      } as unknown as typeof fetch,
    };
    configureApiClient(config);
    await apiFetch("/v1/x");
    expect(seenThis).toBeUndefined();
  });
});

describe("apiFetch: başarılı yanıtlar", () => {
  it("2xx'te JSON gövdeyi doğrudan döndürür ve baseUrl ile yolu birleştirir", async () => {
    const { calls, config } = setup(() => json(200, { items: [1, 2], total: 2 }));
    configureApiClient({ ...config, baseUrl: "http://api.test/" });
    const result = await apiFetch<{ items: number[]; total: number }>("/v1/countries?lang=tr");
    expect(result).toEqual({ items: [1, 2], total: 2 });
    expect(calls()[0].url).toBe("http://api.test/v1/countries?lang=tr");
    expect(calls()[0].method).toBe("GET");
    expect(calls()[0].headers.get("Accept")).toBe("application/json");
  });

  it("201 yanıtını da gövde olarak döndürür", async () => {
    setup(() => json(201, { id: "x" }));
    await expect(apiFetch("/v1/things", { method: "POST", body: "{}" })).resolves.toEqual({ id: "x" });
  });

  it("204'te gövdesiz yanıtı undefined olarak döndürür", async () => {
    setup(() => new Response(null, { status: 204 }));
    await expect(apiFetch<void>("/v1/auth/logout", { method: "POST", body: "{}" })).resolves.toBeUndefined();
  });

  it("boş gövdeli 200 yanıtı undefined olur", async () => {
    setup(() => new Response("", { status: 200 }));
    await expect(apiFetch("/v1/x")).resolves.toBeUndefined();
  });

  it("JSON olmayan başarılı yanıtı düz metin olarak verir", async () => {
    setup(() => new Response("pong", { status: 200, headers: { "Content-Type": "text/plain" } }));
    await expect(apiFetch("/v1/ping")).resolves.toBe("pong");
  });

  it("bozuk JSON bildiren başarılı yanıt INVALID_RESPONSE hatasıdır", async () => {
    setup(() => new Response("{bozuk", { status: 200, headers: { "Content-Type": "application/json" } }));
    await expect(apiFetch("/v1/x")).rejects.toMatchObject({ code: "INVALID_RESPONSE", status: 200 });
  });
});

describe("apiFetch: istek gövdesi ve başlıkları", () => {
  it("dize gövdeye Content-Type: application/json ekler", async () => {
    const { calls } = setup(() => json(200, {}));
    await apiFetch("/v1/x", { method: "POST", body: JSON.stringify({ a: 1 }) });
    expect(calls()[0].headers.get("Content-Type")).toBe("application/json");
    expect(calls()[0].body).toBe('{"a":1}');
  });

  it("düz nesne gövdeyi JSON'a çevirir", async () => {
    const { calls } = setup(() => json(200, {}));
    await apiFetch("/v1/x", { method: "POST", body: { a: 1 } as unknown as BodyInit });
    expect(calls()[0].body).toBe('{"a":1}');
    expect(calls()[0].headers.get("Content-Type")).toBe("application/json");
  });

  it("çağıranın verdiği Content-Type ve Authorization başlıklarını ezmez", async () => {
    const { calls } = setup(() => json(200, {}));
    await apiFetch("/v1/x", {
      method: "POST",
      body: "a=1",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Bearer özel" },
    });
    expect(calls()[0].headers.get("Content-Type")).toBe("application/x-www-form-urlencoded");
    expect(calls()[0].headers.get("Authorization")).toBe("Bearer özel");
  });
});

describe("apiFetch: Authorization", () => {
  it("erişim belirteci varsa Bearer ekler", async () => {
    const { calls } = setup(() => json(200, {}));
    await apiFetch("/v1/auth/me");
    expect(calls()[0].headers.get("Authorization")).toBe("Bearer a1");
  });

  it("belirteç yoksa Authorization eklemez", async () => {
    const { calls } = setup(() => json(200, {}), { access: null, refresh: null });
    await apiFetch("/v1/countries");
    expect(calls()[0].headers.has("Authorization")).toBe(false);
  });

  it("asenkron belirteç okuyucusunu bekler", async () => {
    const { calls, config } = setup(() => json(200, {}));
    configureApiClient({ ...config, getAccessToken: async () => "asenkron" });
    await apiFetch("/v1/auth/me");
    expect(calls()[0].headers.get("Authorization")).toBe("Bearer asenkron");
  });

  it.each(["/v1/auth/login", "/v1/auth/register", "/v1/auth/refresh", "/v1/auth/logout"])(
    "%s kimlik ucuna Bearer eklemez",
    async (path) => {
      const { calls } = setup(() => json(200, {}));
      await apiFetch(path, { method: "POST", body: "{}" });
      expect(calls()[0].headers.has("Authorization")).toBe(false);
    },
  );
});

describe("apiFetch: hata eşleme", () => {
  it("{ statusCode, code, message, details } gövdesini ApiError alanlarına eşler", async () => {
    setup(() =>
      json(422, {
        statusCode: 422,
        code: "VALIDATION_FAILED",
        message: "E-posta geçerli değil.",
        details: [{ field: "email", message: "geçersiz" }],
      }),
    );
    const error = await apiFetch("/v1/users", { method: "POST", body: "{}" }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchObject({
      name: "ApiError",
      status: 422,
      code: "VALIDATION_FAILED",
      message: "E-posta geçerli değil.",
      details: [{ field: "email", message: "geçersiz" }],
    });
  });

  it("message dizi ise birleştirir", async () => {
    setup(() => json(400, { statusCode: 400, message: ["Ad boş olamaz.", "Parola kısa."] }));
    await expect(apiFetch("/v1/x")).rejects.toMatchObject({ status: 400, message: "Ad boş olamaz. Parola kısa." });
  });

  it("gövde yoksa ya da JSON değilse durum koduna göre Türkçe mesaj verir", async () => {
    setup(() => new Response("<html>Bad Gateway</html>", { status: 502 }));
    const error = (await apiFetch("/v1/x").catch((e: unknown) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(502);
    expect(error.code).toBeUndefined();
    expect(error.message).toMatch(/Sunucu şu an yanıt veremiyor/);

    setup(() => new Response(null, { status: 404 }));
    await expect(apiFetch("/v1/x")).rejects.toMatchObject({ status: 404, message: "Aradığın kayıt bulunamadı." });
  });

  it("kimlik uçlarındaki hata gövdesini (yanlış parola) olduğu gibi iletir", async () => {
    setup(() => json(401, { statusCode: 401, code: "AUTH_INVALID_CREDENTIALS", message: "E-posta ya da parola hatalı." }));
    await expect(apiFetch("/v1/auth/login", { method: "POST", body: "{}" })).rejects.toMatchObject({
      status: 401,
      code: "AUTH_INVALID_CREDENTIALS",
      message: "E-posta ya da parola hatalı.",
    });
  });
});

describe("apiFetch: 401 ve belirteç yenileme", () => {
  it("401 alınca bir kez yeniler, yeni belirteçle yeniden dener ve sonucu döndürür", async () => {
    const { calls, onTokensRefreshed, onAuthFailure } = setup(expiringSession);
    await expect(apiFetch("/v1/auth/me")).resolves.toEqual({ ok: true });

    const all = calls();
    expect(all.map((c) => [c.method, c.url.replace("http://api.test", "")])).toEqual([
      ["GET", "/v1/auth/me"],
      ["POST", "/v1/auth/refresh"],
      ["GET", "/v1/auth/me"],
    ]);
    expect(all[0].headers.get("Authorization")).toBe("Bearer a1");
    expect(JSON.parse(String(all[1].body))).toEqual({ refreshToken: "r1" });
    expect(all[1].headers.get("Content-Type")).toBe("application/json");
    expect(all[1].headers.has("Authorization")).toBe(false);
    expect(all[2].headers.get("Authorization")).toBe("Bearer a2");
    expect(onTokensRefreshed).toHaveBeenCalledTimes(1);
    expect(onTokensRefreshed).toHaveBeenCalledWith({ accessToken: "a2", refreshToken: "r2" });
    expect(onAuthFailure).not.toHaveBeenCalled();
  });

  it("yeniden denemede gövdeyi ve yöntemi korur", async () => {
    const { calls } = setup(expiringSession);
    await apiFetch("/v1/users/me/password", { method: "POST", body: JSON.stringify({ newPassword: "x" }) });
    const [first, , retry] = calls();
    expect(retry.method).toBe("POST");
    expect(retry.body).toBe(first.body);
  });

  it("eşzamanlı 401'lerde tek yenileme isteği açar", async () => {
    const gate = deferred();
    const { calls, refreshCalls, onTokensRefreshed } = setup(async (url, init) => {
      if (isRefresh(url)) {
        await gate.promise;
        return json(200, NEW_PAIR);
      }
      return bearer(init) === "Bearer a2" ? json(200, { path: url }) : json(401, UNAUTHORIZED);
    });

    const requests = [apiFetch<{ path: string }>("/v1/a"), apiFetch<{ path: string }>("/v1/b"), apiFetch<{ path: string }>("/v1/c")];
    await vi.waitFor(() => expect(calls().filter((c) => !c.url.endsWith("/v1/auth/refresh"))).toHaveLength(3));
    await vi.waitFor(() => expect(refreshCalls()).toHaveLength(1));
    // 401'lerin hepsi işlenip yenilemeye katılsın.
    await new Promise((resolve) => setTimeout(resolve, 10));
    gate.resolve();

    const results = await Promise.all(requests);
    expect(results.map((r) => r.path)).toEqual(["http://api.test/v1/a", "http://api.test/v1/b", "http://api.test/v1/c"]);
    expect(refreshCalls()).toHaveLength(1);
    expect(onTokensRefreshed).toHaveBeenCalledTimes(1);
    // 3 ilk deneme + 1 yenileme + 3 yeniden deneme
    expect(calls()).toHaveLength(7);
  });

  it("yenileme bittikten sonra eski belirteçle gelen geç 401 yeni yenileme açmaz", async () => {
    const lateResponse = deferred<Response>();
    let protectedCalls = 0;
    const { refreshCalls, tokens } = setup(async (url, init) => {
      if (isRefresh(url)) return json(200, NEW_PAIR);
      if (bearer(init) === "Bearer a2") return json(200, { ok: true });
      protectedCalls += 1;
      // İlk istek hemen 401 alır, ikincisinin 401'i yenileme bittikten sonra gelir.
      return protectedCalls === 1 ? json(401, UNAUTHORIZED) : lateResponse.promise;
    });

    const first = apiFetch("/v1/first");
    const second = apiFetch("/v1/second");
    await expect(first).resolves.toEqual({ ok: true });
    expect(tokens.access).toBe("a2");
    lateResponse.resolve(json(401, UNAUTHORIZED));
    await expect(second).resolves.toEqual({ ok: true });
    expect(refreshCalls()).toHaveLength(1);
  });

  it("yenileme reddedilirse (401) onAuthFailure çağrılır ve özgün 401 hatası fırlar", async () => {
    const { calls, onAuthFailure, onTokensRefreshed, refreshCalls } = setup((url) =>
      isRefresh(url) ? json(401, { statusCode: 401, code: "AUTH_TOKEN_INVALID", message: "Yenileme belirteci geçersiz." }) : json(401, UNAUTHORIZED),
    );
    await expect(apiFetch("/v1/auth/me")).rejects.toMatchObject({
      status: 401,
      code: "AUTH_TOKEN_INVALID",
      message: "Oturum geçersiz.",
    });
    expect(onAuthFailure).toHaveBeenCalledTimes(1);
    expect(onTokensRefreshed).not.toHaveBeenCalled();
    expect(refreshCalls()).toHaveLength(1);
    // yeniden deneme yapılmadı: ilk istek + yenileme
    expect(calls()).toHaveLength(2);
  });

  it("eşzamanlı istekler yenileme reddedilince onAuthFailure'ı yalnız bir kez tetikler", async () => {
    const gate = deferred();
    const { onAuthFailure, refreshCalls } = setup(async (url) => {
      if (isRefresh(url)) {
        await gate.promise;
        return json(401, UNAUTHORIZED);
      }
      return json(401, UNAUTHORIZED);
    });
    const requests = [apiFetch("/v1/a"), apiFetch("/v1/b")].map((p) => p.catch((e: unknown) => e));
    await vi.waitFor(() => expect(refreshCalls()).toHaveLength(1));
    await new Promise((resolve) => setTimeout(resolve, 10));
    gate.resolve();
    const errors = await Promise.all(requests);
    expect(errors.every((e) => e instanceof ApiError && e.status === 401)).toBe(true);
    expect(onAuthFailure).toHaveBeenCalledTimes(1);
    expect(refreshCalls()).toHaveLength(1);
  });

  it("yenileme belirteci yoksa istek göndermeden onAuthFailure çağırır", async () => {
    const { onAuthFailure, refreshCalls } = setup(() => json(401, UNAUTHORIZED), { access: "a1", refresh: null });
    await expect(apiFetch("/v1/auth/me")).rejects.toMatchObject({ status: 401 });
    expect(onAuthFailure).toHaveBeenCalledTimes(1);
    expect(refreshCalls()).toHaveLength(0);
  });

  it("yenilenen belirteçle de 401 gelirse döngüye girmez", async () => {
    const { calls, refreshCalls, onAuthFailure } = setup((url) => (isRefresh(url) ? json(200, NEW_PAIR) : json(401, UNAUTHORIZED)));
    await expect(apiFetch("/v1/auth/me")).rejects.toMatchObject({ status: 401, code: "AUTH_TOKEN_INVALID" });
    expect(refreshCalls()).toHaveLength(1);
    expect(calls()).toHaveLength(3);
    expect(onAuthFailure).not.toHaveBeenCalled();
  });

  it("bozuk yenileme yanıtında oturumu kapatmaz, hata fırlatır", async () => {
    const { onAuthFailure, onTokensRefreshed } = setup((url) => (isRefresh(url) ? json(200, { accessToken: "a2" }) : json(401, UNAUTHORIZED)));
    await expect(apiFetch("/v1/auth/me")).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
    expect(onAuthFailure).not.toHaveBeenCalled();
    expect(onTokensRefreshed).not.toHaveBeenCalled();
  });

  it("yenileme sunucu hatası (503) verirse oturumu kapatmaz, hatayı iletir", async () => {
    const { onAuthFailure } = setup((url) =>
      isRefresh(url) ? json(503, { statusCode: 503, code: "UNAVAILABLE", message: "Servis kapalı." }) : json(401, UNAUTHORIZED),
    );
    await expect(apiFetch("/v1/auth/me")).rejects.toMatchObject({ status: 503, code: "UNAVAILABLE" });
    expect(onAuthFailure).not.toHaveBeenCalled();
  });

  it("yenileme sırasında ağ kopsa oturumu kapatmaz, NETWORK_ERROR fırlatır", async () => {
    const { onAuthFailure } = setup((url) => {
      if (isRefresh(url)) throw new TypeError("fetch failed");
      return json(401, UNAUTHORIZED);
    });
    await expect(apiFetch("/v1/auth/me")).rejects.toMatchObject({ status: 0, code: "NETWORK_ERROR" });
    expect(onAuthFailure).not.toHaveBeenCalled();
  });

  it("yenileme geçici hata verdikten sonra bir sonraki 401 yeniden yenilemeyi dener", async () => {
    let refreshAttempts = 0;
    const { onAuthFailure, refreshCalls } = setup((url, init) => {
      if (isRefresh(url)) {
        refreshAttempts += 1;
        return refreshAttempts === 1 ? json(503, { statusCode: 503, message: "Servis kapalı." }) : json(200, NEW_PAIR);
      }
      return bearer(init) === "Bearer a2" ? json(200, { ok: true }) : json(401, UNAUTHORIZED);
    });
    await expect(apiFetch("/v1/auth/me")).rejects.toMatchObject({ status: 503 });
    await expect(apiFetch("/v1/auth/me")).resolves.toEqual({ ok: true });
    expect(refreshCalls()).toHaveLength(2);
    expect(onAuthFailure).not.toHaveBeenCalled();
  });
});

describe("apiFetch: kimlik uçları 401'de yenileme denemez", () => {
  it.each(["/v1/auth/login", "/v1/auth/register", "/v1/auth/refresh", "/v1/auth/logout"])("%s", async (path) => {
    const { calls, onAuthFailure, onTokensRefreshed } = setup(() =>
      json(401, { statusCode: 401, code: "AUTH_INVALID_CREDENTIALS", message: "E-posta ya da parola hatalı." }),
    );
    await expect(apiFetch(path, { method: "POST", body: "{}" })).rejects.toMatchObject({
      status: 401,
      code: "AUTH_INVALID_CREDENTIALS",
    });
    expect(calls()).toHaveLength(1);
    expect(onAuthFailure).not.toHaveBeenCalled();
    expect(onTokensRefreshed).not.toHaveBeenCalled();
  });

  it("sorgu dizesi olan kimlik ucu da kimlik ucu sayılır", async () => {
    const { calls } = setup(() => json(401, UNAUTHORIZED));
    await expect(apiFetch("/v1/auth/login?x=1", { method: "POST", body: "{}" })).rejects.toMatchObject({ status: 401 });
    expect(calls()).toHaveLength(1);
  });
});

describe("apiFetch: ağ hatası ve iptal", () => {
  it("fetch reddedilirse status 0 ve NETWORK_ERROR kodlu ApiError fırlatır", async () => {
    const cause = new TypeError("Network request failed");
    setup(() => {
      throw cause;
    });
    const error = (await apiFetch("/v1/countries").catch((e: unknown) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(0);
    expect(error.code).toBe("NETWORK_ERROR");
    expect(error.message).toMatch(/Sunucuya ulaşılamadı/);
    expect(error.cause).toBe(cause);
  });

  it("AbortSignal'i fetch'e iletir; iptal ApiError'a çevrilmeden AbortError olarak yükselir", async () => {
    const controller = new AbortController();
    const { calls } = setup(
      (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener("abort", () => reject(init.signal?.reason));
        }),
    );
    const request = apiFetch("/v1/countries", { signal: controller.signal });
    await vi.waitFor(() => expect(calls()).toHaveLength(1));
    expect(calls()[0].signal).toBe(controller.signal);
    controller.abort();
    const error = (await request.catch((e: unknown) => e)) as Error;
    expect(error).not.toBeInstanceOf(ApiError);
    expect(error.name).toBe("AbortError");
  });

  it("ortak yenilemeyi bekleyen isteğin iptali yenilemeyi durdurmaz, diğer isteği etkilemez", async () => {
    const gate = deferred();
    const controller = new AbortController();
    const { refreshCalls, onTokensRefreshed } = setup(async (url, init) => {
      if (isRefresh(url)) {
        await gate.promise;
        return json(200, NEW_PAIR);
      }
      return bearer(init) === "Bearer a2" ? json(200, { ok: true }) : json(401, UNAUTHORIZED);
    });
    const aborted = apiFetch("/v1/a", { signal: controller.signal }).catch((e: unknown) => e);
    const surviving = apiFetch("/v1/b");
    await vi.waitFor(() => expect(refreshCalls()).toHaveLength(1));
    await new Promise((resolve) => setTimeout(resolve, 10));
    controller.abort();
    const abortError = (await aborted) as Error;
    expect(abortError.name).toBe("AbortError");
    gate.resolve();
    await expect(surviving).resolves.toEqual({ ok: true });
    expect(refreshCalls()).toHaveLength(1);
    expect(onTokensRefreshed).toHaveBeenCalledTimes(1);
  });
});

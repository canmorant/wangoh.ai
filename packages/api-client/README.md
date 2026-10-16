# @wangoh/api-client

Wangoh API'sinin (`apps/api`) ortak istemcisi. `apps/api/openapi.json` sözleşmesinden
[Orval](https://orval.dev) ile üretilen **TanStack Query v5** kancalarını ve bunların altındaki
`fetch` mutator'unu içerir. Web ve mobil aynı paketi kullanır. Mimari sözleşme:
[`docs/backend-mobil-mimarisi.md`](../../docs/backend-mobil-mimarisi.md), bölüm 9.

Paket derlenmeden **TypeScript kaynağı olarak** tüketilir (`exports["."] = "./src/index.ts"`):
Next.js `transpilePackages` ile, Metro doğrudan okuyarak.

## Dosyalar

| Yol | Ne |
| --- | --- |
| `src/mutator.ts` | `configureApiClient`, `ApiError`, `apiFetch`: belirteç, 401 yenileme, hata eşleme |
| `src/generated/` | Orval çıktısı (**commit'lenir**, elle düzenlenmez) |
| `src/index.ts` | mutator + üretilen kancalar + model tipleri |
| `orval.config.ts` | Orval 8 yapılandırması |
| `src/mutator.test.ts` | mutator birim testleri (sahte fetch) |

## İstemciyi üretmek

API sözleşmesi değiştiğinde (denetleyici, DTO, `operationId`):

```bash
# kökten: önce OpenAPI'yi dışa aktarır (apps/api/openapi.json), sonra istemciyi üretir
pnpm generate:api

# yalnız istemci (openapi.json zaten güncelse)
pnpm --filter @wangoh/api-client generate
```

- Girdi `../../apps/api/openapi.json`, çıktı `src/generated` (`tags-split`: her Swagger etiketi için bir dosya,
  modeller `src/generated/models` altında). Çıktı klasörü her üretimde temizlenir.
- `src/generated` ve `apps/api/openapi.json` birlikte commit'lenir; API değişince ikisi de güncellenmelidir.
- Üretilen fonksiyon ve kanca adları `operationId`'den gelir (`authLogin` → `authLogin()` ve `useAuthLogin()`,
  `contentListCountries` → `useContentListCountries()`). Bu yüzden API tarafında `operationId`'leri değiştirmek
  istemcinin genel yüzünü değiştirir.
- Yapılandırmanın dayandığı kararlar (`orval.config.ts` içinde yorumlu): `client: "react-query"`,
  `httpClient: "fetch"`, özel mutator `src/mutator.ts` → `apiFetch`, `override.fetch.includeHttpResponseReturnType: false`
  (kancalar `{ data, status, headers }` zarfı değil **doğrudan gövde tipini** döndürür), `override.query.version: 5`.
  `query.useQuery`/`query.useMutation` bayraklarını **verme**: ikisi de bütün uçları kendi türüne zorlar
  (GET'ler mutasyona, POST'lar sorguya dönüşür).
- Üretim hattını gerçek belge olmadan denemek için `WANGOH_OPENAPI_INPUT=/mutlak/yol/openapi.json pnpm --filter @wangoh/api-client generate`.
  Bu yalnız denemedir: çıktıyı commit'lemeden önce gerçek belgeyle yeniden üret.

## Kullanım

```tsx
import { useAuthLogin, useContentListCountries, type ApiError } from "@wangoh/api-client";

function Ulkeler() {
  // `lang` her sorguya açıkça geçirilir; sorgu anahtarını Orval üretir (elle anahtar yazma).
  const { data, isPending, error } = useContentListCountries({ lang: "tr", continent: "europe" });
  if (isPending) return <p>Yükleniyor…</p>;
  if (error) return <p>{error.message}</p>; // error: ApiError, message Türkçe ve gösterilebilir
  return <ul>{data.items.map((ulke) => <li key={ulke.code}>{ulke.name}</li>)}</ul>;
}

function GirisFormu() {
  const giris = useAuthLogin(); // POST → mutasyon; değişken biçimi { data: gövde }
  const gonder = (email: string, password: string) =>
    giris.mutate(
      { data: { email, password } },
      {
        onSuccess: (oturum) => {/* oturum.accessToken, oturum.refreshToken, oturum.user */},
        onError: (hata: ApiError) => {/* hata.code === "AUTH_INVALID_CREDENTIALS" ... */},
      },
    );
  // ...
}
```

Kanca dışında düz fonksiyonlar da dışa aktarılır (`authLogin(...)`, `contentListCountries(...)`), sorgu
anahtarı üreticileri `get<Ad>QueryKey` biçimindedir (önbellek geçersiz kılmak için:
`queryClient.invalidateQueries({ queryKey: getContentListCountriesQueryKey({ lang: "tr" }) })`).

### Hatalar

2xx dışındaki her yanıtta mutator `ApiError` fırlatır (kancalarda `error` tipi de budur):

| Alan | Anlam |
| --- | --- |
| `status` | HTTP durum kodu; sunucuya hiç ulaşılamadıysa `0` |
| `code` | makine okur kod: `AUTH_INVALID_CREDENTIALS`, `VALIDATION_FAILED`, `NOT_FOUND`, `RATE_LIMITED` ... ağ hatasında `NETWORK_ERROR` |
| `message` | gösterilebilir Türkçe mesaj (API gövdesindeki `message`; gövde yoksa durum koduna göre varsayılan) |
| `details` | API'nin `details` alanı (doğrulama ayrıntıları vb.) |

Sorgu iptali (`AbortSignal`) `ApiError`'a çevrilmeden `AbortError` olarak yükselir; react-query bunu hata saymaz.

## `configureApiClient`

Uygulama açılışında **bir kez** ve ilk istekten önce çağrılır:

```ts
export interface ApiClientConfig {
  baseUrl: string;                                           // sonda "/" yok, yollar /v1 ile başlar
  getAccessToken: () => string | null | Promise<string | null>;
  getRefreshToken: () => string | null | Promise<string | null>;
  onTokensRefreshed: (t: { accessToken: string; refreshToken: string }) => void | Promise<void>;
  onAuthFailure: () => void;                                 // yenileme başarısız → oturumu kapat
  fetch?: typeof fetch;
}
```

Belirteç saklama ve oturum kapatma uygulamanın işidir; paket yalnız bu geri çağırmaları kullanır.

### 401 ve belirteç yenileme

- Her istek `Authorization: Bearer <accessToken>` ile gider (belirteç yoksa başlık eklenmez). Kimlik uçları
  (`/v1/auth/login`, `register`, `refresh`, `logout`) Bearer almaz.
- Kimlik uçları dışında **401** gelirse: `POST /v1/auth/refresh` ile **tek uçuşlu** yenileme yapılır (eşzamanlı
  401'ler aynı isteği paylaşır), `onTokensRefreshed` çağrılır ve istek **bir kez** yeniden denenir. Yenilenen belirteçle
  de 401 gelirse hata olarak döner, döngüye girilmez.
- Yenileme belirteci sunucuca reddedilirse (ya da hiç yoksa) `onAuthFailure()` çağrılır ve istek özgün 401
  `ApiError`'ıyla biter.
- Yenileme **geçici** nedenle başarısız olursa (ağ kopması, 5xx, 429, 408, anlaşılmayan yanıt) oturum kapatılmaz:
  istek o hatayla (`NETWORK_ERROR` ya da sunucu hatası) biter ve sonraki 401 yenilemeyi yeniden dener.
  Zayıf bağlantıda kullanıcıyı çıkış yaptırmamak için sözleşmedeki "başarısızsa `onAuthFailure`" kuralının bu
  inceltilmiş hâli uygulanır.
- Yenileme belirteci döner (rotation). Bu yüzden bir istek zaten yenilenmiş belirteçle yeniden denenebiliyorsa
  (`getAccessToken()` isteğin gittiği belirteçten farklıysa) ikinci bir yenileme açılmaz.

## Web kurulumu (`apps/web`)

Kablolama hazır, henüz hiçbir sayfaya bağlı değil: `next.config.ts` → `transpilePackages: ["@wangoh/api-client"]`,
[`src/lib/api/ApiProvider.tsx`](../../apps/web/src/lib/api/ApiProvider.tsx) (QueryClient + `configureApiClient`,
belirteçler yalnız bellekte), `NEXT_PUBLIC_API_URL` (`.env.example`; boşsa geliştirmede `http://localhost:3001`).

```tsx
// bir sayfanın ya da düzenin istemci tarafı sarmalayıcısı
import { ApiProvider } from "@/lib/api/ApiProvider";

export default function Sayfa() {
  return <ApiProvider><Ulkeler /></ApiProvider>;
}
```

Giriş yapılınca `setApiTokens({ accessToken, refreshToken })`, çıkışta `setApiTokens(null)` çağrılır.

## Mobil kurulumu (`apps/mobile`)

```ts
// uygulama açılışında bir kez (ör. app/_layout.tsx'in import ettiği src/api/setup.ts)
import * as SecureStore from "expo-secure-store";
import { configureApiClient } from "@wangoh/api-client";

configureApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001", // Android emülatörü: http://10.0.2.2:3001
  getAccessToken: () => SecureStore.getItemAsync("accessToken"),
  getRefreshToken: () => SecureStore.getItemAsync("refreshToken"),
  onTokensRefreshed: async ({ accessToken, refreshToken }) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
  },
  onAuthFailure: () => {
    // belirteçleri sil, önbelleği temizle, giriş ekranına dön
  },
});
```

`QueryClientProvider`'ı uygulama köküne koy. Metro'nun `packages/api-client` kaynağını okuyabilmesi için Expo'nun
monorepo desteği yeterlidir (SDK 52+ otomatik).

**Tek kopya kuralı:** `react` ve `@tanstack/react-query` uygulamada **tek kopya** olmalıdır; paketin kendi
`node_modules`'ündeki kopya mobil uygulamanınkinden farklı çözülürse `QueryClientProvider` ile kancalar farklı
modül örneklerini görür ("No QueryClient set") ya da React ikiye bölünür ("Invalid hook call"). Web'de pnpm aynı
sürüm ve aynı React eşleşmesini tek dizine çözdüğü için sorun yoktur (paketin devDependency `react` sürümü web ile
aynı tutulur). Mobil `react` sürümünü Expo SDK belirler (web'den farklı olabilir); bu durumda `apps/mobile/metro.config.js`
içinde bu iki paket (ve `react-native`) mobil uygulamanın kopyasına yönlendirilmelidir (`resolver.resolveRequest` ile
`originModulePath`'i `apps/mobile` altına alarak). Mobil çalışırken `useQuery` hatası görürsen ilk bakılacak yer burasıdır.

## Testler

```bash
pnpm --filter @wangoh/api-client test        # vitest (sahte fetch, ağ yok)
pnpm --filter @wangoh/api-client typecheck   # tsc --noEmit (üretilen kod dahil)
```

Mutator testleri: başarılı JSON, 204, hata gövdesi eşleme, Bearer ekleme, 401 → tek yenileme → yeniden deneme,
eşzamanlı 401'lerde tek yenileme, yenileme başarısızsa `onAuthFailure`, kimlik uçlarında yenileme denememe,
ağ hatası ve iptal.

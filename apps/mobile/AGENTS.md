This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `app/` (project root, per `docs/backend-mobil-mimarisi.md` section 2) — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) in `src/`. **Do not create `src/app/`**: Expo Router prefers it over `app/` and would silently hide every existing route.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Wangoh mobil yapısı (Türkçe; sözleşme: `docs/backend-mobil-mimarisi.md`)

- **Rotalar** `app/`, **kod** `src/`. Her özellik kendi rota klasöründe ve `src/features/<ad>` altında çalışır, başkasının klasörüne dokunmaz:
  `app/(tabs)/(explore)` (Keşfet, URL `/`), `app/(tabs)/blog`, `app/(tabs)/games`, `app/(tabs)/profile`, `app/(tabs)/admin` (yalnız yöneticide görünür), `app/(auth)` (giriş/kayıt, modal).
  Her sekme klasörünün kendi `_layout.tsx` yığını (Stack) vardır: ayrıntı ekranı eklemek için aynı klasöre dosya ekle (ör. `app/(tabs)/blog/[slug].tsx`). Rota dosyaları ince tutulur, ekran `src/features/<ad>` içindedir.
- **Arayüz** `@/ui` (Screen, Text, Button, Card, Input, Badge, Chip, Header, SectionHeader, LoadingView, Skeleton, EmptyState, ErrorState, RemoteImage, ListRow, Divider, Icon), **tema** `@/theme` (renk, aralık, yarıçap, tipografi belirteçleri; ham renk yazma). Bileşen galerisi: geliştirmede `/ui-kit`.
  Yerel başlık çubukları kapalı: her ekran kendi başlığını `<Header />` ile çizer, güvenli alanı `<Screen />` karşılar (kenar varsayılanı `top/left/right`; sekmesiz modal ekranda `edges` ile alt kenar da eklenir).
- **API** yalnız `@wangoh/api-client` kancalarıyla; `lang` açıkça verilir, sorgu anahtarı elle yazılmaz. Hata gösterimi `ErrorState` (+ `getErrorMessage`), yeniden deneme politikası `src/api/retryPolicy.ts` (yalnız ağ/5xx).
- **Oturum** `useAuth()` (`@/auth`). `AuthProvider` henüz yok (placeholder bağlam); yazılınca `app/_layout.tsx` içindeki işaretli yere eklenir ve `setupApi` çağrısı oraya taşınır. Belirteçler `@/auth/tokenStorage` (SecureStore, web'de localStorage, olmazsa bellek).
- **Metro**: `metro.config.js` zorunludur. api-client'ın react 19.2.4'ü ile mobilin 19.2.3'ü pnpm'de iki `@tanstack/react-query` kopyası üretir; yapılandırma tekil paketleri mobilin kopyasına yönlendirir. Dosyayı silersen api-client kancaları `No QueryClient set` hatası verir.
- **Komutlar** (`apps/mobile` içinde): `pnpm typecheck`, `pnpm test` (saf birim testler, `tsx --test`), `pnpm gen:assets` (ikonlar; `scripts/gen-assets.mjs`).
  Bu ortamda `api.expo.dev` ve `reactnative.directory` engelli: bağımlılık için `EXPO_OFFLINE=1 npx expo install ...`, derleme için `EXPO_OFFLINE=1 CI=1 npx expo export --platform web`. `EXPO_PUBLIC_*` değeri değişince `--clear` ver (Metro önbelleği değişkeni izlemez). `expo-doctor` iki ağ denetiminde (config şeması, React Native Directory) bu yüzden başarısız görünür.

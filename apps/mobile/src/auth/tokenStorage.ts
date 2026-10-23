import { platformStore } from "./platformStore";
import { createTokenStorage } from "./tokenStorageCore";

export * from "./tokenStorageCore";

/** Uygulamanın tek belirteç deposu (iOS Keychain / Android Keystore, web'de localStorage, olmazsa bellek). */
export const tokenStorage = createTokenStorage(platformStore);

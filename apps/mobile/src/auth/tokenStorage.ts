import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { createTokenStorage, type KeyValueStore } from "./tokenStorageCore";

export * from "./tokenStorageCore";

/** iOS Keychain / Android Keystore. */
function createSecureStore(): KeyValueStore {
  return {
    getItem: (key) => SecureStore.getItemAsync(key),
    setItem: (key, value) => SecureStore.setItemAsync(key, value),
    removeItem: (key) => SecureStore.deleteItemAsync(key),
  };
}

/** Web önizleme yedeği. localStorage kapalıysa (gizli pencere, iframe) null: oturum bellekte yaşar. */
function createWebStore(): KeyValueStore | null {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return null;
    const probe = "__wangoh_probe__";
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return {
      getItem: async (key) => storage.getItem(key),
      setItem: async (key, value) => storage.setItem(key, value),
      removeItem: async (key) => storage.removeItem(key),
    };
  } catch {
    return null;
  }
}

/** Uygulamanın tek belirteç deposu. */
export const tokenStorage = createTokenStorage(Platform.OS === "web" ? createWebStore() : createSecureStore());

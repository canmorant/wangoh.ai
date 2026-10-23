import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { createActiveSessionStore, type KeyValueStore } from "./model/sessionStore";

/** iOS Keychain / Android Keystore (oturum kimliği küçük bir metindir, SecureStore sınırına sığar). */
function createSecureStore(): KeyValueStore {
  return {
    getItem: (key) => SecureStore.getItemAsync(key),
    setItem: (key, value) => SecureStore.setItemAsync(key, value),
    removeItem: (key) => SecureStore.deleteItemAsync(key),
  };
}

/** Web önizleme yedeği. localStorage kapalıysa (gizli pencere, iframe) null: kayıt bellekte yaşar. */
function createWebStore(): KeyValueStore | null {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return null;
    const probe = "__wangoh_games_probe__";
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

/** Uygulamanın tek devam eden oturum deposu. */
export const activeSessionStore = createActiveSessionStore(Platform.OS === "web" ? createWebStore() : createSecureStore());

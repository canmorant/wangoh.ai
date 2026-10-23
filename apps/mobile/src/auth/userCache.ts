import { platformStore } from "./platformStore";
import { createUserCache } from "./userCacheCore";

export * from "./userCacheCore";

/** Son bilinen kullanıcının yerel kopyası; belirteçlerle aynı kalıcı depoda durur. */
export const userCache = createUserCache(platformStore);

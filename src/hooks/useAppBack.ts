"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { appFilePath } from "@/i18n/paths";
import { IS_APP_BUILD, type AppLocale } from "@/i18n/routing";
import { goBackOrHome, isHomeRoot, LOCATION_CHANGE, patchHistoryEvents } from "@/lib/appHistory";

/**
 * Uygulamada geri düğmesinin göstereceği durum ve geri eylemi. Web'de her zaman
 * `canBack: false` (tarayıcının kendi geri düğmesi var).
 */
export function useAppBack(): { canBack: boolean; back: () => void } {
  const locale = useLocale() as AppLocale;
  const [atRoot, setAtRoot] = useState(true);

  useEffect(() => {
    if (!IS_APP_BUILD) return;
    patchHistoryEvents();
    const update = () => setAtRoot(isHomeRoot(window.location));
    update();
    window.addEventListener("popstate", update);
    window.addEventListener(LOCATION_CHANGE, update);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener(LOCATION_CHANGE, update);
    };
  }, []);

  const back = useCallback(() => {
    goBackOrHome(appFilePath(getPathname({ href: "/", locale })));
  }, [locale]);

  return { canBack: IS_APP_BUILD && !atRoot, back };
}

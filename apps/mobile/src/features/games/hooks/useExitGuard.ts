import { useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { gamesRoutes } from "../routes";

export interface ExitGuard {
  /** Çıkış onayı penceresi açık mı? */
  dialogVisible: boolean;
  /** Başlıktaki geri düğmesi: yığında geri gider, yoksa merkeze; oyun sürüyorsa önce onay sorulur. */
  requestExit(): void;
  /** "Çık": oyun terk edilir (yerel kayıt silinir) ve bekleyen gezinti sürdürülür. */
  confirmLeave(): Promise<void>;
  /** "Oyuna dön". */
  cancelLeave(): void;
  /** Programatik gezinti öncesi (ör. sonuç ekranına geçiş) onayı atla. */
  allowLeave(): void;
}

/**
 * Oyun sürerken ekrandan ayrılmayı engeller ve onay ister. Android geri tuşu, iOS kenar kaydırması,
 * başlık geri düğmesi ve tarayıcı geri tuşu aynı yoldan (`beforeRemove`) geçer.
 */
export function useExitGuard(active: boolean, onLeave: () => Promise<void> | void): ExitGuard {
  const navigation = useNavigation();
  const router = useRouter();
  const [dialogVisible, setDialogVisible] = useState(false);
  const pendingAction = useRef<Parameters<typeof navigation.dispatch>[0] | null>(null);
  const allowed = useRef(false);

  const latest = useRef({ active, onLeave });
  latest.current = { active, onLeave };

  useEffect(() => {
    return navigation.addListener("beforeRemove", (event) => {
      if (!latest.current.active || allowed.current) return;
      event.preventDefault();
      pendingAction.current = event.data.action;
      setDialogVisible(true);
    });
  }, [navigation]);

  const requestExit = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.dismissTo(gamesRoutes.hub);
  }, [router]);

  const confirmLeave = useCallback(async () => {
    setDialogVisible(false);
    allowed.current = true;
    await latest.current.onLeave();
    const action = pendingAction.current;
    pendingAction.current = null;
    if (action) navigation.dispatch(action);
    else router.dismissTo(gamesRoutes.hub);
  }, [navigation, router]);

  const cancelLeave = useCallback(() => {
    pendingAction.current = null;
    setDialogVisible(false);
  }, []);

  const allowLeave = useCallback(() => {
    allowed.current = true;
  }, []);

  return { dialogVisible, requestExit, confirmLeave, cancelLeave, allowLeave };
}

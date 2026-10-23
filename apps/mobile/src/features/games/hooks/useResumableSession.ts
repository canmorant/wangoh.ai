import { useFocusEffect } from "expo-router";
import { useGamesGetSession } from "@wangoh/api-client";
import { useCallback, useEffect, useRef, useState } from "react";

import { isSessionGone } from "../model/gameErrors";
import { GAME_LANG, type PlayableGameType } from "../model/gameTypes";
import { activeSessionStore } from "../storage";

export type ResumableStatus = "loading" | "none" | "resumable" | "unverified";

export interface ResumableSession {
  status: ResumableStatus;
  sessionId: string | null;
  /** 1 tabanlı tur numarası ve toplam tur; yalnız `resumable` iken dolu. */
  roundNumber: number | null;
  roundsTotal: number | null;
  /** Yerel kaydı silip (oturum terk edilir) "yok" durumuna geç. */
  discard(): Promise<void>;
  reload(): void;
  /** Çek-yenile: yerel kaydı ve sunucu durumunu yeniden oku. */
  refresh(): Promise<void>;
}

/**
 * Bir oyun türünde devam eden oturum var mı? Yerel kayıtlı kimlik `GET /v1/games/sessions/:id` ile
 * doğrulanır; etkin değilse (bitti, süresi doldu, bulunamadı) kayıt temizlenir. Ağ hatasında kayıt
 * korunur ("doğrulanamadı"): bağlantı gelince yeniden denenir.
 */
export function useResumableSession(userId: string | null, gameType: PlayableGameType): ResumableSession {
  // undefined: yerel kayıt henüz okunmadı; null: kayıt yok.
  const [storedId, setStoredId] = useState<string | null | undefined>(undefined);

  const reload = useCallback(() => {
    if (!userId) {
      setStoredId(null);
      return;
    }
    void activeSessionStore.get(userId, gameType).then(setStoredId);
  }, [userId, gameType]);

  const query = useGamesGetSession(
    storedId ?? "",
    { lang: GAME_LANG },
    {
      query: {
        enabled: Boolean(storedId),
        // Oturum durumu hızla değişir; hub her açılışta sunucuya sorar.
        staleTime: 0,
        refetchOnMount: "always",
        retry: false,
      },
    },
  );
  const { data, error, refetch } = query;

  const latest = useRef({ storedId, refetch });
  latest.current = { storedId, refetch };

  // Ekran odağa her gelişinde (oyundan dönüş dahil) hem yerel kaydı hem sunucu durumunu tazele.
  useFocusEffect(
    useCallback(() => {
      reload();
      if (latest.current.storedId) void latest.current.refetch();
    }, [reload]),
  );

  const gone = Boolean(storedId) && ((data !== undefined && data.status !== "active") || (error !== null && isSessionGone(error)));

  // Doğrulanamayan (artık etkin olmayan) kayıt: yerel depodan sil.
  useEffect(() => {
    if (!gone || !storedId || !userId) return;
    void activeSessionStore.clearIfMatches(userId, gameType, storedId).then(() => setStoredId(null));
  }, [gone, storedId, userId, gameType]);

  const refresh = useCallback(async () => {
    if (!userId) return;
    const id = await activeSessionStore.get(userId, gameType);
    setStoredId(id);
    // Kimlik değiştiyse sorgu yeni kimlikle kendiliğinden çalışır; aynıysa elle tazele.
    if (id && id === latest.current.storedId) await latest.current.refetch();
  }, [userId, gameType]);

  const discard = useCallback(async () => {
    if (!userId) return;
    await activeSessionStore.clear(userId, gameType);
    setStoredId(null);
  }, [userId, gameType]);

  const active = data && data.status === "active" ? data : null;
  let status: ResumableStatus;
  if (storedId === undefined) status = "loading";
  else if (storedId === null || gone) status = "none";
  else if (active) status = "resumable";
  else if (error) status = "unverified";
  else status = "loading";

  return {
    status,
    sessionId: storedId ?? null,
    // Tüm turlar cevaplanmış ama bitirilmemiş oturumda round null: "devam" sonucu bitirir.
    roundNumber: status === "resumable" && active ? (active.round ? active.round.index + 1 : active.roundsTotal) : null,
    roundsTotal: status === "resumable" && active ? active.roundsTotal : null,
    discard,
    reload,
    refresh,
  };
}

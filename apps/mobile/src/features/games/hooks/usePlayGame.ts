import { useQueryClient } from "@tanstack/react-query";
import {
  getGamesGetSessionQueryOptions,
  useGamesFinishSession,
  useGamesStartSession,
  useGamesSubmitAnswer,
  type GameSessionDto,
} from "@wangoh/api-client";
import { useCallback, useEffect, useReducer, useRef } from "react";

import { answerFailureAction, finishFailureAction, restoreFailureAction } from "../model/gameErrors";
import { GAME_LANG, type PlayableGameType } from "../model/gameTypes";
import { monotonicNow } from "../model/monotonic";
import { initialPlayState, liveOf, playReducer, type PlayEvent, type PlayState, type Point } from "../model/playMachine";
import { resultCache } from "../model/resultCache";
import { activeSessionStore } from "../storage";
import { dropSessionQueries, invalidateAfterGame } from "./invalidate";

const SYNC_NOTICE = "Önceki cevabın sunucuya ulaşmıştı; oyun kaldığın yerden devam ediyor.";

export interface PlayGame {
  state: PlayState;
  /** Çoktan seçmeli: seçeneğe dokunmak cevabı gönderir. */
  choose(optionId: string): void;
  /** Harita: işaret koy/değiştir (henüz gönderilmez). */
  select(point: Point): void;
  /** Harita: işaretli noktayı gönder. */
  confirm(): void;
  /** Gönderim hatası sonrası aynı cevabı yeniden gönder (409 gelirse sunucuyla eşitlenir). */
  retrySubmit(): void;
  /** Geri sayım bitti: işaretli nokta varsa onu, yoksa "cevap yok" (null) gönder; süre kararını sunucu verir. */
  timeUp(): void;
  next(): void;
  /** Başarısız yükleme/bitirme sonrası yeniden dene. */
  retry(): void;
  /** Oturum bittikten sonra yeni oyun başlat. */
  startNew(): void;
  /** Onaylı çıkış: yerel oturum kaydı silinir (oyun terk edilir). */
  leave(): Promise<void>;
}

/**
 * Bir oyun türünün ekran akışını yürütür: durum makinesi (`playMachine`) + ağ çağrıları + yerel kayıt.
 * Puanı/süreyi sunucu hesaplar; burada yalnız sunucu yanıtları olaya çevrilir.
 */
export function usePlayGame(gameType: PlayableGameType, userId: string): PlayGame {
  const queryClient = useQueryClient();
  const { mutateAsync: startSession } = useGamesStartSession();
  const { mutateAsync: submitAnswer } = useGamesSubmitAnswer();
  const { mutateAsync: finishSession } = useGamesFinishSession();

  const [state, dispatch] = useReducer(playReducer, initialPlayState);
  const stateRef = useRef<PlayState>(state);
  stateRef.current = state;

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const emit = useCallback((event: PlayEvent) => {
    if (mounted.current) dispatch(event);
  }, []);

  /** Çift dokunma ve eşzamanlı gönderim kilidi (durum güncellenmeden gelen ikinci olay için). */
  const submitLock = useRef(false);

  const fetchSnapshot = useCallback(
    (sessionId: string): Promise<GameSessionDto> =>
      // Geri yükleme her zaman taze olmalı (önbellekteki eski tur gösterilmesin).
      queryClient.fetchQuery(getGamesGetSessionQueryOptions(sessionId, { lang: GAME_LANG }, { query: { staleTime: 0, gcTime: 0 } })),
    [queryClient],
  );

  // 1) Açılış: yerelde kayıtlı oturum varsa geri yükle (uygulama kapanıp açılınca kaybolmasın), yoksa yeni oyun.
  useEffect(() => {
    let cancelled = false;
    void activeSessionStore.get(userId, gameType).then((stored) => {
      if (cancelled) return;
      dispatch(stored ? { type: "RESTORE", sessionId: stored } : { type: "START" });
    });
    return () => {
      cancelled = true;
    };
  }, [gameType, userId]);

  // 2) Başlatma
  useEffect(() => {
    if (state.phase !== "starting") return;
    void (async () => {
      try {
        const response = await startSession({ gameType, params: { lang: GAME_LANG } });
        // Saat, yanıtın alındığı anda sabitlenir (depolama beklemesi turun süresinden yemesin).
        const receivedAt = monotonicNow();
        await activeSessionStore.set(userId, gameType, response.sessionId);
        emit({ type: "STARTED", response, now: receivedAt });
      } catch (error) {
        emit({ type: "LOAD_FAILED", action: "start", error });
      }
    })();
  }, [state.phase, gameType, userId, startSession, emit]);

  // 3) Geri yükleme
  const restoringId = state.phase === "restoring" ? state.sessionId : null;
  useEffect(() => {
    if (!restoringId) return;
    void (async () => {
      try {
        const snapshot = await fetchSnapshot(restoringId);
        emit({ type: "RESTORED", snapshot, now: monotonicNow() });
      } catch (error) {
        const action = restoreFailureAction(error);
        if (action.type === "end") {
          // Doğrulanamayan oturum: yerel kaydı temizle.
          await activeSessionStore.clearIfMatches(userId, gameType, restoringId);
          emit({ type: "SESSION_ENDED", reason: action.reason });
        } else {
          emit({ type: "LOAD_FAILED", action: "restore", error });
        }
      }
    })();
  }, [restoringId, userId, gameType, fetchSnapshot, emit]);

  // 4) Bitirme (idempotent): sonucu önbelleğe koy, puanla değişen sorguları tazele.
  const finishing = state.phase === "finishing" ? state.session : null;
  useEffect(() => {
    if (!finishing) return;
    void (async () => {
      try {
        const result = await finishSession({ id: finishing.sessionId });
        resultCache.put(result);
        await activeSessionStore.clearIfMatches(userId, gameType, finishing.sessionId);
        dropSessionQueries(queryClient, finishing.sessionId);
        void invalidateAfterGame(queryClient);
        emit({ type: "FINISHED" });
      } catch (error) {
        const action = finishFailureAction(error);
        if (action.type === "resync") {
          try {
            const snapshot = await fetchSnapshot(finishing.sessionId);
            // Hâlâ "tüm turlar cevaplandı" diyorsa eşitleme bir şey değiştirmez; hatayı göster.
            if (snapshot.round === null && snapshot.status === "active") emit({ type: "FINISH_FAILED", error });
            else emit({ type: "RESTORED", snapshot, now: monotonicNow(), notice: SYNC_NOTICE });
          } catch (syncError) {
            emit({ type: "FINISH_FAILED", error: syncError });
          }
        } else if (action.type === "end") {
          await activeSessionStore.clearIfMatches(userId, gameType, finishing.sessionId);
          emit({ type: "SESSION_ENDED", reason: action.reason });
        } else {
          emit({ type: "FINISH_FAILED", error });
        }
      }
    })();
  }, [finishing, userId, gameType, finishSession, fetchSnapshot, queryClient, emit]);

  // 5) Oturum bitince (süre doldu, etkin değil...) yerel kaydı sil.
  const endedSessionId = state.phase === "ended" ? state.sessionId : null;
  const isEnded = state.phase === "ended";
  useEffect(() => {
    if (!isEnded) return;
    if (endedSessionId) {
      void activeSessionStore.clearIfMatches(userId, gameType, endedSessionId);
      dropSessionQueries(queryClient, endedSessionId);
    } else {
      void activeSessionStore.clear(userId, gameType);
    }
  }, [isEnded, endedSessionId, userId, gameType, queryClient]);

  const submit = useCallback(
    async (answer: string | Point | null) => {
      const current = stateRef.current;
      if (current.phase !== "question" || submitLock.current) return;
      submitLock.current = true;
      const { session, current: clock } = current;
      emit({ type: "SUBMIT", answer });
      try {
        const response = await submitAnswer({
          id: session.sessionId,
          data: { roundIndex: clock.round.index, answer },
          params: { lang: GAME_LANG },
        });
        emit({ type: "ANSWERED", response, now: monotonicNow() });
      } catch (error) {
        const action = answerFailureAction(error);
        if (action.type === "resync") {
          // Cevap idempotent değildir: 409, turun sunucuda zaten işlendiği anlamına gelir. Durumu yeniden çek.
          try {
            const snapshot = await fetchSnapshot(session.sessionId);
            emit({ type: "RESTORED", snapshot, now: monotonicNow(), notice: SYNC_NOTICE });
          } catch (syncError) {
            emit({ type: "SUBMIT_FAILED", error: syncError });
          }
        } else if (action.type === "end") {
          await activeSessionStore.clearIfMatches(userId, gameType, session.sessionId);
          emit({ type: "SESSION_ENDED", reason: action.reason });
        } else {
          emit({ type: "SUBMIT_FAILED", error });
        }
      } finally {
        submitLock.current = false;
      }
    },
    [submitAnswer, fetchSnapshot, userId, gameType, emit],
  );

  const choose = useCallback((optionId: string) => void submit(optionId), [submit]);

  const select = useCallback((point: Point) => {
    if (stateRef.current.phase === "question") dispatch({ type: "SELECT", answer: point });
  }, []);

  const confirm = useCallback(() => {
    const current = stateRef.current;
    if (current.phase === "question" && current.selection && typeof current.selection !== "string") void submit(current.selection);
  }, [submit]);

  const retrySubmit = useCallback(() => {
    const current = stateRef.current;
    if (current.phase === "question" && current.selection !== null) void submit(current.selection);
  }, [submit]);

  const timeUp = useCallback(() => {
    const current = stateRef.current;
    // Önceki gönderim hatası varsa otomatik gönderme: kullanıcı "Tekrar dene" der, sunucu süreye karar verir.
    if (current.phase !== "question" || current.error !== null) return;
    void submit(current.selection);
  }, [submit]);

  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const retry = useCallback(() => dispatch({ type: "RETRY" }), []);
  const startNew = useCallback(() => dispatch({ type: "START" }), []);

  const leave = useCallback(async () => {
    const live = liveOf(stateRef.current);
    if (live) await activeSessionStore.clearIfMatches(userId, gameType, live.session.sessionId);
    else await activeSessionStore.clear(userId, gameType);
  }, [userId, gameType]);

  return { state, choose, select, confirm, retrySubmit, timeUp, next, retry, startNew, leave };
}

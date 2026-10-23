import { useQueryClient } from "@tanstack/react-query";
import { useGamesFinishSession, useGamesGetSession, type FinishResponseDto } from "@wangoh/api-client";
import { useCallback, useEffect, useRef, useState } from "react";

import { outcomesFromSession } from "../model/feedbackCopy";
import { finishFailureAction, restoreFailureAction, type EndReason } from "../model/gameErrors";
import { GAME_LANG, type PlayableGameType } from "../model/gameTypes";
import type { RoundOutcome } from "../model/playMachine";
import { resultCache } from "../model/resultCache";
import { resultPlan } from "../model/viewModel";
import { invalidateAfterGame } from "./invalidate";

export type ResultView =
  | { kind: "loading" }
  | { kind: "error"; error: unknown; retry(): void }
  | { kind: "unfinished"; gameType: PlayableGameType }
  | { kind: "ended"; reason: EndReason }
  | { kind: "ready"; result: FinishResponseDto; outcomes: RoundOutcome[] | null };

/**
 * Sonuç ekranının verisi. Oyun ekranından gelindiyse sonuç önbellekten gösterilir; sayfa yenilendiyse
 * oturum sunucudan okunur ve bitirme çağrısı (idempotent: aynı puan, aynı sonuç) yeniden yapılır.
 * Oyun henüz bitmediyse ya da oturum sona erdiyse ona göre ekran döner.
 */
export function useGameResult(sessionId: string): ResultView {
  const queryClient = useQueryClient();
  const session = useGamesGetSession(sessionId, { lang: GAME_LANG }, { query: { staleTime: 0, retry: false } });
  const { mutateAsync: finishSession } = useGamesFinishSession();

  const [result, setResult] = useState<FinishResponseDto | undefined>(() => resultCache.get(sessionId));
  const [failure, setFailure] = useState<unknown>(null);
  const [endReason, setEndReason] = useState<EndReason | null>(null);
  const [attempt, setAttempt] = useState(0);
  const inFlight = useRef(false);

  const { data, refetch } = session;
  const plan = data ? resultPlan(data) : null;
  const planType = plan?.type ?? null;

  useEffect(() => {
    if (result || inFlight.current || planType !== "finish") return;
    inFlight.current = true;
    void (async () => {
      try {
        const finished = await finishSession({ id: sessionId });
        resultCache.put(finished);
        void invalidateAfterGame(queryClient);
        setResult(finished);
      } catch (error) {
        const action = finishFailureAction(error);
        if (action.type === "end") setEndReason(action.reason);
        else if (action.type === "resync") {
          // Sunucu "bitmedi" diyor: oturumu yeniden oku. Hâlâ "bitti" görünüyorsa tutarsızlığı hata olarak göster.
          const refreshed = await refetch();
          const again = refreshed.data ? resultPlan(refreshed.data) : null;
          if (again === null || again.type === "finish") setFailure(error);
        } else setFailure(error);
      } finally {
        inFlight.current = false;
      }
    })();
  }, [result, planType, sessionId, finishSession, queryClient, refetch, attempt]);

  const retry = useCallback(() => {
    setFailure(null);
    setAttempt((value) => value + 1);
    void refetch();
  }, [refetch]);

  if (result) return { kind: "ready", result, outcomes: data ? outcomesFromSession(data) : null };
  if (endReason) return { kind: "ended", reason: endReason };
  if (failure !== null) return { kind: "error", error: failure, retry };
  if (session.isError) {
    const action = restoreFailureAction(session.error);
    return action.type === "end" ? { kind: "ended", reason: action.reason } : { kind: "error", error: session.error, retry };
  }
  if (plan?.type === "unfinished" && data) return { kind: "unfinished", gameType: data.gameType };
  if (plan?.type === "ended") return { kind: "ended", reason: plan.reason };
  return { kind: "loading" };
}

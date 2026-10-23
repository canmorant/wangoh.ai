import { useEffect, useRef, useState } from "react";

import { progressAt, type RoundProgress, type RoundTiming } from "../model/countdown";
import { monotonicNow } from "../model/monotonic";

/**
 * Turun anlık durumu (başlamasına kalan, bitişe kalan). 100 ms'de bir yenilenir; yalnız bunu kullanan bileşen yeniden çizilir.
 * Saat yerel monotonik zamandır (aygıt saatinden bağımsız). Bitiş geçince `onExpire` BİR kez çağrılır
 * (yeni `timing` sayacı yeniler); süre kararını sunucu verir.
 */
export function useRoundProgress(timing: RoundTiming, timeLimitMs: number, onExpire?: () => void): RoundProgress {
  const [now, setNow] = useState(() => monotonicNow());
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;
  const firedFor = useRef<RoundTiming | null>(null);

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;
    const tick = () => {
      const current = monotonicNow();
      setNow(current);
      if (progressAt(timing, timeLimitMs, current).expired) {
        if (id !== undefined) clearInterval(id);
        if (firedFor.current !== timing) {
          firedFor.current = timing;
          expireRef.current?.();
        }
      }
    };
    tick();
    id = setInterval(tick, 100);
    return () => {
      if (id !== undefined) clearInterval(id);
    };
  }, [timing, timeLimitMs]);

  return progressAt(timing, timeLimitMs, now);
}

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Form gönderimini tek uçuşa indirir: iki hızlı dokunuş (ya da klavyede "git" + düğme) tek istek
 * üretir. `submitting` düğmenin yükleniyor durumunu sürer; ekran kapanmışsa durum güncellenmez.
 */
export function useSubmitGuard() {
  const [submitting, setSubmitting] = useState(false);
  const locked = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(async (task: () => Promise<void>) => {
    if (locked.current) return;
    locked.current = true;
    setSubmitting(true);
    try {
      await task();
    } finally {
      locked.current = false;
      if (mounted.current) setSubmitting(false);
    }
  }, []);

  return { submitting, run };
}

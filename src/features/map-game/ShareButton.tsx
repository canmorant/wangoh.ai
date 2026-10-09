"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { localDateFromKey, type DateKey, type GameMode } from "../distance-game/daily";
import { shareOrCopy, shareText, shareUrl } from "../distance-game/share";
import { secondaryButton } from "../distance-game/ui";
import { MAX_GAME_SCORE } from "./scoring";

/** Oyunun iç (Türkçe) yolu; paylaşım adresi dile göre yerelleşir. */
export const GAME_PATH = "/haritada-bul";

/** "Sonucunu paylaş": 8 turun emoji şeridi + toplam puan + sitenin adresi (Kaç kilometre? ile aynı biçim). */
export default function ShareButton({
  scores,
  total,
  mode,
  dateKey,
  streak,
  primary = false,
}: {
  scores: readonly number[];
  total: number;
  mode: GameMode;
  dateKey: DateKey | null;
  streak: number;
  primary?: boolean;
}) {
  const t = useTranslations("MapGame");
  const format = useFormatter();
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const build = () => {
    const date = dateKey
      ? format.dateTime(localDateFromKey(dateKey), { day: "numeric", month: "long", year: "numeric" })
      : "";
    const header =
      mode === "daily"
        ? streak >= 2
          ? t("shareHeaderDailyStreak", { date, count: streak })
          : t("shareHeaderDaily", { date })
        : t("shareHeaderFree");
    return shareText({
      header,
      scores,
      scoreLine: `${format.number(total)} / ${format.number(MAX_GAME_SCORE)}`,
      url: shareUrl(locale, GAME_PATH),
    });
  };

  const onClick = async () => {
    const result = await shareOrCopy(build(), t("title"));
    window.clearTimeout(timer.current);
    if (result === "copied" || result === "failed") {
      setStatus(result);
      timer.current = window.setTimeout(() => setStatus("idle"), 2600);
    } else {
      setStatus("idle");
    }
  };

  const base = primary
    ? "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-white px-9 py-3.5 text-[12px] font-semibold tracking-[0.2em] text-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
    : secondaryButton;

  return (
    <span className="inline-flex flex-wrap items-center gap-3">
      <button type="button" onClick={onClick} className={base}>
        {status === "copied" ? <Check className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
        {t("share")}
      </button>
      <span role="status" aria-live="polite" className="min-w-0 text-[12px] text-[var(--gold)]">
        {status === "copied" ? t("copied") : status === "failed" ? t("copyFailed") : ""}
      </span>
    </span>
  );
}

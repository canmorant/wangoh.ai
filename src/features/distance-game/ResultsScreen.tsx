"use client";

import { Flame } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localDateFromKey } from "./daily";
import ShareButton from "./ShareButton";
import { useNames, type Names } from "./PlayScreen";
import type { useDistanceGame } from "./useDistanceGame";
import { Num, ScoreStrip, SoundToggle, primaryButton, secondaryButton, tintFor } from "./ui";

type G = ReturnType<typeof useDistanceGame>;

/** Sonuç: toplam puan, paylaşılabilir şerit, Günün Turu durumu ve tur özeti. */
export function Results({ g, countryNames, guideNames }: { g: G } & Pick<Names, "countryNames" | "guideNames">) {
  const t = useTranslations("DistanceGame");
  const format = useFormatter();
  const names = useNames({ countryNames, guideNames });
  const outcome = g.outcome;
  const scores = g.results.map((r) => r.score);
  const daily = g.mode === "daily";
  const dateLabel = g.dateKey
    ? format.dateTime(localDateFromKey(g.dateKey), { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <section className="dg-rise flex flex-1 flex-col py-2">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 text-[11px] leading-snug tracking-[0.28em] text-white/65 uppercase">
          {daily ? t("dailyTitle", { date: dateLabel }) : t("gameOver")}
        </p>
        <SoundToggle on={g.sound} onToggle={g.setSound} label={t("soundLabel")} />
      </div>
      <h1 className="mt-4">
        <span className="block text-[10px] tracking-[0.24em] text-white/60 uppercase">{t("totalScore")}</span>
        <span className="font-display mt-1 block text-[clamp(3.6rem,17vw,5.5rem)] leading-none text-white tabular-nums">
          <Num value={g.total} />
          <span className="ml-3 text-[0.3em] tracking-[0.12em] text-white/60">
            {t("outOf", { max: format.number(g.maxTotal) })}
          </span>
        </span>
      </h1>

      <div className="mt-5 max-w-md">
        <ScoreStrip
          scores={scores}
          label={t("stripLabel", { scores: scores.map((s) => format.number(s)).join(", ") })}
        />
      </div>

      <div aria-live="polite" className="mt-4 space-y-1.5 text-[13px] tracking-[0.04em]">
        {outcome?.counted && outcome.newBest && <p className="text-[#3fae9a]">{t("newBest")}</p>}
        {outcome && !daily && !outcome.newBest && outcome.stats.played > 0 && (
          <p className="text-white/70">{t("bestSoFar", { score: format.number(outcome.stats.best) })}</p>
        )}
        {daily && outcome?.official && (
          <p className="text-white/80">{t("dailyOfficial", { score: format.number(g.total) })}</p>
        )}
        {daily && outcome && !outcome.official && outcome.officialTotal !== null && (
          <p className="text-white/70">{t("dailyReplayNote", { score: format.number(outcome.officialTotal) })}</p>
        )}
        {daily && outcome && outcome.streak > 0 && (
          <p className="flex items-center gap-1.5 text-[var(--gold)]">
            <Flame className="size-3.5" aria-hidden />
            {t("streakLabel", { count: outcome.streak })}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ShareButton
          scores={scores}
          total={g.total}
          mode={g.mode}
          dateKey={g.dateKey}
          streak={outcome?.streak ?? 0}
          primary
        />
      </div>

      <h2 className="mt-9 text-[10px] tracking-[0.26em] text-white/60 uppercase">{t("recap")}</h2>
      <ol className="mt-2 border-t border-white/[0.1]">
        {g.results.map((r) => (
          <li key={r.round.a.id} className="flex items-center justify-between gap-4 border-b border-white/[0.1] py-3">
            <div className="min-w-0">
              <p className="truncate text-[13.5px] text-white/90">
                {names.city(r.round.a)} – {names.city(r.round.b)}
              </p>
              <p className="mt-0.5 text-[11.5px] text-white/60 tabular-nums">
                {t("recapDetail", { actual: format.number(r.round.km), guess: format.number(r.guess) })}
              </p>
            </div>
            <span
              className="font-display shrink-0 text-[1.5rem] leading-none tabular-nums"
              style={{ color: tintFor(r.score) }}
            >
              <Num value={r.score} />
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-9 flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={() => g.start("free")} className={daily ? secondaryButton : primaryButton}>
          {daily ? t("playFree") : t("playAgain")}
        </button>
        {daily && (
          <button type="button" onClick={() => g.start("daily")} className={secondaryButton}>
            {t("replayDaily")}
          </button>
        )}
        <button type="button" onClick={g.home} className={secondaryButton}>
          {t("backToModes")}
        </button>
        <Link href="/haritada-bul" prefetch={false} className={secondaryButton}>
          {t("otherGame")}
        </Link>
        <Link href="/gezi-rehberleri" prefetch={false} className={secondaryButton}>
          {t("exploreGuides")}
        </Link>
      </div>
    </section>
  );
}

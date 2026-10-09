"use client";

import { Flame } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { localDateFromKey } from "./daily";
import { ROUNDS_PER_GAME } from "./scoring";
import ShareButton from "./ShareButton";
import type { useDistanceGame } from "./useDistanceGame";
import { Num, ScoreStrip, SoundToggle, Stat, primaryButton, secondaryButton } from "./ui";

type G = ReturnType<typeof useDistanceGame>;

/** Giriş: iki mod (Günün Turu, Serbest), bugünkü sonuç, seri ve istatistikler. */
export function Intro({ g }: { g: G }) {
  const t = useTranslations("DistanceGame");
  const format = useFormatter();
  const done = g.todayResult;
  const dateLabel = g.today
    ? format.dateTime(localDateFromKey(g.today), { day: "numeric", month: "long", year: "numeric" })
    : " ";

  return (
    <section className="dg-rise flex flex-1 flex-col justify-center py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="flex min-w-0 items-center gap-3 text-[11px] leading-snug tracking-[0.28em] text-white/65 uppercase">
          <span className="inline-block h-px w-6 shrink-0 bg-white/30" />
          <span>{t("eyebrow", { rounds: ROUNDS_PER_GAME })}</span>
        </p>
        <SoundToggle on={g.sound} onToggle={g.setSound} label={t("soundLabel")} />
      </div>
      <h1 className="font-display mt-4 text-[clamp(2.6rem,10vw,3.8rem)] leading-[1.02] text-white">{t("title")}</h1>
      <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-white/70">
        {t("intro", { rounds: ROUNDS_PER_GAME })}
      </p>

      <div className="mt-6 grid gap-3">
        {/* ---------------- Günün Turu ---------------- */}
        <div
          className="dg-rise rounded-[20px] border border-[var(--gold)]/40 bg-[linear-gradient(160deg,rgba(200,164,94,0.12),rgba(200,164,94,0.03))] p-5"
          style={{ ["--dg-delay" as string]: "60ms" }}
        >
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.26em] text-[var(--gold)] uppercase">{dateLabel}</p>
              <h2 className="font-display mt-1.5 text-[1.9rem] leading-none text-white">{t("modeDaily")}</h2>
            </div>
            {g.streak > 0 && (
              <p className="flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--gold)]/40 bg-black/20 px-3 py-1.5 text-[11.5px] text-[var(--gold)]">
                <Flame className="size-3.5" aria-hidden />
                {t("streakLabel", { count: g.streak })}
              </p>
            )}
          </div>
          <p className="mt-2.5 text-[13px] leading-relaxed text-white/70">
            {t("modeDailyHint", { rounds: ROUNDS_PER_GAME })}
          </p>

          {done ? (
            <div className="mt-4">
              <p className="text-[9.5px] tracking-[0.24em] text-white/60 uppercase">{t("dailyDoneLabel")}</p>
              <p className="font-display mt-1 text-[2.4rem] leading-none text-white tabular-nums">
                <Num value={done.total} />
                <span className="ml-2 text-[0.4em] text-white/60">/ {format.number(g.maxTotal)}</span>
              </p>
              <div className="mt-3">
                <ScoreStrip
                  scores={done.scores}
                  label={t("stripLabel", { scores: done.scores.map((s) => format.number(s)).join(", ") })}
                  size="sm"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <ShareButton scores={done.scores} total={done.total} mode="daily" dateKey={g.today} streak={g.streak} />
                <button type="button" onClick={() => g.start("daily")} className={secondaryButton}>
                  {t("replayDaily")}
                </button>
              </div>
              <p className="mt-3 text-[12px] leading-snug text-white/60">{t("replayDailyNote")}</p>
            </div>
          ) : (
            <button type="button" onClick={() => g.start("daily")} className={`${primaryButton} mt-5 w-full sm:w-auto`}>
              {t("playDaily")}
            </button>
          )}
        </div>

        {/* ---------------- Serbest ---------------- */}
        <div
          className="dg-rise rounded-[20px] border border-white/[0.12] bg-white/[0.03] p-5"
          style={{ ["--dg-delay" as string]: "130ms" }}
        >
          <h2 className="font-display text-[1.9rem] leading-none text-white">{t("modeFree")}</h2>
          <p className="mt-2.5 text-[13px] leading-relaxed text-white/70">
            {t("modeFreeHint", { rounds: ROUNDS_PER_GAME })}
          </p>
          <button
            type="button"
            onClick={() => g.start("free")}
            className={`${done ? primaryButton : secondaryButton} mt-5 w-full sm:w-auto`}
          >
            {t("playFree")}
          </button>
        </div>
      </div>

      {g.loaded && g.stats.played > 0 && (
        <div className="mt-7 flex flex-wrap items-end gap-x-8 gap-y-4">
          <Stat label={t("gamesPlayed")} value={<Num value={g.stats.played} />} />
          {g.average !== null && <Stat label={t("average")} value={<Num value={g.average} />} />}
          <Stat label={t("bestResult")} value={<Num value={g.stats.best} />} />
          {g.stats.bestStreak > 1 && <Stat label={t("bestStreak")} value={<Num value={g.stats.bestStreak} />} />}
        </div>
      )}

      <ul className="mt-7 max-w-md space-y-3 text-[13px] leading-relaxed text-white/65">
        {(["howScale", "howScore", "offline"] as const).map((key) => (
          <li key={key} className="flex gap-3">
            <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-[var(--gold)]/70" />
            <span>{t(key)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

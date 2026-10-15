import { useTranslations } from "next-intl";
import { ArrowUpRight, Bookmark, MapPin } from "lucide-react";
import type { GuideMapsList as MapsList } from "@/content/maps-lists";

export default function GuideMapsList({ list, city }: { list: MapsList; city: string }) {
  const t = useTranslations("Guide");
  const buttonClass = "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-center text-[14px] font-semibold text-[#0a0e18] transition-colors hover:bg-[#eed6a3] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)] sm:w-auto";

  return (
    <section
      id="google-maps-listesi"
      aria-labelledby="google-maps-heading"
      className="mt-12 scroll-mt-28 rounded-2xl border border-[var(--gold)]/25 bg-[var(--gold)]/[0.035] p-5 sm:mt-16 sm:p-8"
    >
      <p className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">
        <MapPin size={15} aria-hidden="true" />
        {t("mapsEyebrow", { count: list.stops.length })}
      </p>
      <h2 id="google-maps-heading" className="font-display mt-3 text-[clamp(1.6rem,3.2vw,2.2rem)] leading-tight text-white">
        {t("mapsHeading", { city })}
      </h2>
      <p className="mt-4 text-[14px] leading-relaxed text-white/65">
        {t("mapsIntro", { count: list.stops.length })}
      </p>
      {list.note && (
        <p className="mt-2 text-[13px] leading-relaxed text-white/55">{t(list.note)}</p>
      )}

      <ol className="mt-6 grid gap-2 sm:grid-cols-2">
        {list.stops.map((stop, index) => (
          <li key={stop.id}>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.query)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("mapsPlaceLink", { place: t(`mapsPlaces.${stop.id}`) })}
              className="group flex min-h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0a0e18]/40 px-4 py-3 text-[13px] text-white/80 transition-colors hover:border-[var(--gold)]/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
            >
              <span aria-hidden="true" className="font-display text-[16px] text-[var(--gold)]/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">{t(`mapsPlaces.${stop.id}`)}</span>
              <ArrowUpRight size={15} aria-hidden="true" className="shrink-0 text-white/40 group-hover:text-[var(--gold)]" />
            </a>
          </li>
        ))}
      </ol>

      <div className="mt-7 border-t border-white/[0.08] pt-6">
        {list.url ? (
          <a href={list.url} className={buttonClass} aria-describedby="maps-list-help">
            <Bookmark size={17} aria-hidden="true" className="shrink-0" />
            {t("mapsButton", { city })}
            <ArrowUpRight size={17} aria-hidden="true" className="shrink-0" />
          </a>
        ) : (
          <button type="button" disabled className={`${buttonClass} cursor-not-allowed opacity-45`} aria-describedby="maps-list-help">
            <Bookmark size={17} aria-hidden="true" className="shrink-0" />
            {t("mapsButton", { city })}
          </button>
        )}
        <p id="maps-list-help" className="mt-3 text-[12.5px] leading-relaxed text-white/50">
          {list.url ? t("mapsSaveHelp") : t("mapsPending")}
        </p>
      </div>
    </section>
  );
}

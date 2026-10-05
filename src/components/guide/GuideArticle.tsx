import type { ReactNode } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { countryName } from "@/lib/countryNames";
import { placeName } from "@/content/localized";
import type { CityGuide } from "@/content/guides/types";
import type { Country, City } from "@/data/destinations";
import { cityHref, countryHref, hasGuide } from "@/content/guides";
import type { DestinationDietaryGuide } from "@/content/dietary";
import DietaryPicks from "./DietaryPicks";
import { mapsListFor } from "@/content/maps-lists";
import GuideMapsList from "./GuideMapsList";
import { GUIDE_TEMPLATES } from "@/content/guides/templates";
import type { AppLocale } from "@/i18n/routing";

/**
 * Şehir rehberinin editoryal gövdesi.
 *
 * Sitenin mevcut görsel diliyle aynı: koyu zemin, display serif başlıklar,
 * ince altın vurgu, geniş boşluk. Amaç bir "metin duvarı" değil, okunabilir
 * bir seyahat dergisi sayfası.
 */
export default function GuideArticle({
  guide,
  country,
  city,
  dietary,
}: {
  guide: CityGuide;
  country: Country;
  city: City;
  dietary: DestinationDietaryGuide;
}) {
  const siblings = country.cities.filter((c) => c.name !== city.name);
  const t = useTranslations("Guide");
  const format = useFormatter();
  const locale = useLocale();
  // Görünen adlar dile göre; `name` alanları anahtar olarak Türkçe kalır.
  const countryLabel = countryName(country.code, locale, country.name);
  const place = (name: string) => placeName(name, locale);
  // Bazı rehberlerde mekân kartları restoran değil, öne çıkan gezi durakları.
  const sights = guide.placesKind === "sights";
  const placesHeading = sights ? t("highlights") : t("whereToEat");
  const mapsList = mapsListFor(guide.countryCode, guide.city);
  // Fiyat sınıfı veride Türkçe anahtar; görünen etiketi dile göre.
  const priceLabel = { Ekonomik: t("priceBudget"), Orta: t("priceMid"), Yüksek: t("priceHigh") };

  const toc = (
    <ul className="mt-4 space-y-2.5">
      {guide.sections.map((s) => (
        <TocItem key={s.id} href={`#${s.id}`}>
          {s.heading}
        </TocItem>
      ))}
      {guide.places.length > 0 && (
        <TocItem href="#nerede-yenir">{sights ? placesHeading : t("tocWhereToEat")}</TocItem>
      )}
      <TocItem href="#vegan-helal-restoranlar">{t(dietary.vegan.length || dietary.halal.length ? "tocDietary" : "tocDietaryNotes")}</TocItem>
      {guide.itinerary.length > 0 && <TocItem href="#gezi-plani">{t("itinerary")}</TocItem>}
      {guide.practicalTips && guide.practicalTips.length > 0 && (
        <TocItem href="#bilmeden-gitme">{t("beforeYouGo")}</TocItem>
      )}
      {guide.relatedGuides && guide.relatedGuides.length > 0 && (
        <TocItem href="#rotayi-surdur">{t("tocContinue")}</TocItem>
      )}
      {guide.faqs.length > 0 && <TocItem href="#sss">{t("faq")}</TocItem>}
      {guide.sources && guide.sources.length > 0 && (
        <TocItem href="#kaynaklar">{t("tocSources")}</TocItem>
      )}
      {mapsList && <TocItem href="#google-maps-listesi">{t("mapsToc")}</TocItem>}
    </ul>
  );

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-24 sm:px-8 sm:pb-32">
      {/* ---------------- hızlı bilgi ---------------- */}
      <section
        aria-label={t("quickFacts")}
        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-3 lg:grid-cols-5"
      >
        {guide.quickFacts.map((f) => (
          <div key={f.label} className="min-w-0 bg-[#0a0e18] px-4 py-5 sm:px-5">
            <p className="text-[9.5px] tracking-[0.24em] text-white/35 uppercase">{f.label}</p>
            <p className="mt-1.5 break-words text-[13px] leading-snug text-white/90 sm:text-[13.5px]">{f.value}</p>
          </div>
        ))}
      </section>

      <div className="mt-12 grid gap-10 sm:mt-16 sm:gap-14 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        {/* ---------------- makale ---------------- */}
        <article className="min-w-0">
          {/* Mobilde yan sütun makalenin altına düşüyor; içindekiler orada
              işe yaramaz. Bu yüzden dar ekranda makalenin başında, açılır
              bir liste olarak duruyor. */}
          <details className="group mb-10 rounded-2xl border border-white/[0.08] bg-white/[0.025] lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[10px] tracking-[0.26em] text-white/55 uppercase marker:hidden">
              {t("toc")}
              <span aria-hidden className="text-[15px] tracking-normal text-white/35 transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <nav aria-label={t("toc")} className="px-5 pb-5">
              {toc}
            </nav>
          </details>
          {/* İçerik Türkiye'den yola çıkan okur için yazıldı: giriş/vize ve hat
              notları Türk pasaportu ve Türkiye hattına göre. Diğer dillerde
              bunu açıkça söylüyoruz; bilgiyi başka pasaportlara uyarlamak
              doğrulanmamış bilgi üretmek olurdu. Giriş metinleri uyruktan
              bağımsız yeniden yazılmış dillerde (şablon internationalAudience)
              not gereksiz. */}
          {locale !== "tr" && !GUIDE_TEMPLATES[locale as AppLocale].expanded.internationalAudience && (
            <p className="mb-10 rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-4 text-[13px] leading-relaxed text-white/55">
              {t("audienceNote")}
            </p>
          )}
          {guide.sections.map((s) => (
            <section key={s.id} id={s.id} className="mb-12 scroll-mt-24 sm:mb-16 sm:scroll-mt-28">
              <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.2rem)] leading-tight text-white">
                {s.heading}
              </h2>
              <div className="mt-5 space-y-4">
                {s.body.map((p, i) => (
                  <Paragraph key={i} text={p} />
                ))}
              </div>

              {s.subsections?.map((sub) => (
                <div key={sub.heading} className="mt-9">
                  <h3 className="text-[1.05rem] font-semibold tracking-[0.01em] text-white/90">
                    {sub.heading}
                  </h3>
                  <div className="mt-3 space-y-4">
                    {sub.body.map((p, i) => (
                      <Paragraph key={i} text={p} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}

          {/* Ülke düzeyindeki pratik bilgiler bu dilde ülke sayfasında; her
              şehirde aynı paragrafları tekrarlamak yerine oraya bağlanıyoruz. */}
          {guide.countryInfoOnHub && (
            <aside className="mb-16 rounded-2xl border border-[var(--gold)]/15 bg-[var(--gold)]/[0.035] p-6 sm:p-7">
              <p className="text-[1rem] font-semibold text-white/90">{t("countryInfo.title", { country: countryLabel })}</p>
              <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-white/55">{t("countryInfo.body")}</p>
              <Link
                href={`${countryHref(country)}#pratik-bilgiler`}
                className="mt-4 inline-block text-[11px] tracking-[0.18em] text-[var(--gold)]/85 uppercase transition-colors duration-300 hover:text-[var(--gold)]"
              >
                {t("countryInfo.link", { country: countryLabel })} →
              </Link>
            </aside>
          )}

          {/* ---------------- yeme-içme kartları ---------------- */}
          {guide.places.length > 0 && (
            <section id="nerede-yenir" className="mb-16 scroll-mt-28">
              <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.2rem)] leading-tight text-white">
                {placesHeading}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/55">
                {sights ? t("highlightsIntro") : t("whereToEatIntro")}
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {guide.places.map((p) => (
                  <div
                    key={p.name}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition-colors duration-500 hover:border-white/[0.16] sm:p-6"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-[1.25rem] leading-none text-white">
                        {p.name}
                      </h3>
                      {p.price && (
                        <span className="shrink-0 rounded-full border border-[var(--gold)]/25 px-2.5 py-1 text-[9.5px] tracking-[0.16em] text-[var(--gold)]/80 uppercase">
                          {priceLabel[p.price]}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-[11px] tracking-[0.16em] text-white/35 uppercase">
                      {p.area} · {p.known}
                    </p>
                    <p className="mt-3 text-[14px] leading-relaxed text-white/65">{p.why}</p>
                    {p.tip && (
                      <p className="mt-3 border-l-2 border-[var(--gold)]/40 pl-3 text-[13px] leading-relaxed text-white/45">
                        {p.tip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <DietaryPicks dietary={dietary} city={place(city.name)} country={countryLabel} />

          {/* ---------------- gezi planı ---------------- */}
          {guide.itinerary.length > 0 && (
            <section id="gezi-plani" className="mb-16 scroll-mt-28">
              <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.2rem)] leading-tight text-white">
                {t("itinerary")}
              </h2>
              <ol className="mt-7 space-y-4">
                {guide.itinerary.map((d, i) => (
                  <li
                    key={d.title}
                    className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6 sm:pl-14"
                  >
                    <span className="font-display absolute top-5 left-5 text-[1.1rem] text-[var(--gold)]/70 tabular-nums sm:top-6 sm:left-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="pl-9 text-[1.05rem] font-semibold text-white/90 sm:pl-0">{d.title}</h3>
                    <dl className="mt-4 space-y-3">
                      <Slot label={t("morning")} value={d.morning} />
                      <Slot label={t("afternoon")} value={d.afternoon} />
                      <Slot label={t("evening")} value={d.evening} />
                    </dl>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {guide.practicalTips && guide.practicalTips.length > 0 && (
            <section id="bilmeden-gitme" className="mb-16 scroll-mt-28">
              <p className="text-[9.5px] tracking-[0.26em] text-[var(--gold)]/70 uppercase">
                {t("beforeYouGo")}
              </p>
              <h2 className="font-display mt-3 text-[clamp(1.6rem,3.2vw,2.2rem)] leading-tight text-white">
                {guide.practicalHeading ?? t("practicalFallback", { city: place(city.name) })}
              </h2>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {guide.practicalTips.map((tip) => (
                  <div
                    key={tip.title}
                    className="rounded-2xl border border-[var(--gold)]/15 bg-[var(--gold)]/[0.035] p-6"
                  >
                    <h3 className="text-[1rem] font-semibold text-white/90">{tip.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">{tip.body}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {guide.relatedGuides && guide.relatedGuides.length > 0 && (
            <section id="rotayi-surdur" className="mb-16 scroll-mt-28">
              <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.2rem)] leading-tight text-white">
                {t("continueRoute", { country: countryLabel })}
              </h2>
              <p className="mt-4 max-w-[64ch] text-[15px] leading-relaxed text-white/55">
                {t("continueRouteIntro")}
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {guide.relatedGuides.map((related) => {
                  const relatedCity = country.cities.find((c) => c.name === related.city);
                  if (!relatedCity || !hasGuide(country.code, relatedCity.name)) return null;

                  return (
                    <Link
                      key={related.city}
                      href={cityHref(country, relatedCity)}
                      className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.18]"
                    >
                      <h3 className="font-display text-[1.2rem] text-white transition-colors group-hover:text-[var(--gold)]">
                        {related.anchor}
                      </h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-white/50">
                        {related.description}
                      </p>
                      <span className="mt-4 inline-block text-[10.5px] tracking-[0.18em] text-[var(--gold)]/80 uppercase">
                        {t("readGuide")}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ---------------- SSS ---------------- */}
          {guide.faqs.length > 0 && (
            <section id="sss" className="mb-16 scroll-mt-28">
              <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.2rem)] leading-tight text-white">
                {t("faq")}
              </h2>
              <div className="mt-7 divide-y divide-white/[0.07] border-y border-white/[0.07]">
                {guide.faqs.map((f) => (
                  <details key={f.q} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] text-white/85 marker:hidden">
                      {f.q}
                      <span className="shrink-0 text-white/30 transition-transform duration-400 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-[62ch] text-[14.5px] leading-relaxed text-white/55">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {guide.volatileNote && (
            <p className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-[13px] leading-relaxed text-white/45">
              <strong className="font-semibold text-white/70">{t("note")}</strong>{" "}
              {guide.volatileNote} {t("lastUpdated")}{" "}
              <time dateTime={guide.reviewed}>
                {format.dateTime(new Date(guide.reviewed), {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              .
            </p>
          )}

          {guide.sources && guide.sources.length > 0 && (
            <section id="kaynaklar" className="mt-10 scroll-mt-28">
              <h2 className="font-display text-[clamp(1.45rem,3vw,1.9rem)] leading-tight text-white">
                {t("sources")}
              </h2>
              <p className="mt-3 max-w-[64ch] text-[13.5px] leading-relaxed text-white/45">
                {t("sourcesIntro")}
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {guide.sources.map((source) => (
                  <li key={`${source.name}-${source.url}`}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-[13px] leading-snug text-white/60 transition-colors hover:border-white/[0.18] hover:text-white"
                    >
                      {source.name} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {mapsList && <GuideMapsList list={mapsList} city={place(city.name)} />}
        </article>

        {/* ---------------- içindekiler ---------------- */}
        <aside className="lg:sticky lg:top-28">
          <nav
            aria-label={t("toc")}
            className="hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 lg:block"
          >
            <p className="text-[9.5px] tracking-[0.26em] text-white/35 uppercase">{t("toc")}</p>
            {toc}
          </nav>

          {/* iç bağlantılar — aynı ülkedeki diğer şehirler */}
          {siblings.length > 0 && (
            <nav
              aria-label={t("otherCities", { country: countryLabel })}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 lg:mt-4"
            >
              <p className="text-[9.5px] tracking-[0.26em] text-white/35 uppercase">
                {t("countryRoutes", { country: countryLabel })}
              </p>
              <ul className="mt-4 space-y-2.5">
                {siblings.map((c) => (
                  <li key={c.name}>
                    <Link
                      href={cityHref(country, c)}
                      className="flex items-baseline justify-between gap-2 text-[13px] text-white/50 transition-colors duration-300 hover:text-white"
                    >
                      {place(c.name)}
                      {!hasGuide(country.code, c.name) && (
                        <span className="shrink-0 text-[9px] tracking-[0.14em] text-white/20 uppercase">
                          {t("inProgress")}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={countryHref(country)}
                className="mt-5 inline-block text-[11px] tracking-[0.18em] text-[var(--gold)]/80 uppercase transition-colors duration-300 hover:text-[var(--gold)]"
              >
                {t("countryGuide", { country: countryLabel })}
              </Link>
            </nav>
          )}
        </aside>
      </div>
    </div>
  );
}

function TocItem({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <a
        href={href}
        className="text-[13px] leading-snug text-white/50 transition-colors duration-300 hover:text-white"
      >
        {children}
      </a>
    </li>
  );
}

/** **kalın** işaretlemesini güvenle işler — dışarıdan HTML enjekte edilmez. */
function Paragraph({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="max-w-[68ch] text-[15.5px] leading-[1.75] text-white/65">
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-white/90">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

function Slot({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
      <dt className="text-[10px] tracking-[0.18em] text-white/30 uppercase sm:w-28 sm:shrink-0">
        {label}
      </dt>
      <dd className="text-[14px] leading-relaxed text-white/65">{value}</dd>
    </div>
  );
}

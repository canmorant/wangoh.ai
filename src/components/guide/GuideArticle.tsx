import Link from "next/link";
import { CityGuide } from "@/content/guides/types";
import { Country, City } from "@/data/destinations";
import { cityHref, countryHref, hasGuide } from "@/content/guides";

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
}: {
  guide: CityGuide;
  country: Country;
  city: City;
}) {
  const siblings = country.cities.filter((c) => c.name !== city.name);

  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-32 sm:px-8">
      {/* ---------------- hızlı bilgi ---------------- */}
      <section
        aria-label="Hızlı bilgiler"
        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-3 lg:grid-cols-5"
      >
        {guide.quickFacts.map((f) => (
          <div key={f.label} className="bg-[#0a0e18] px-5 py-5">
            <p className="text-[9.5px] tracking-[0.24em] text-white/35 uppercase">{f.label}</p>
            <p className="mt-1.5 text-[13.5px] leading-snug text-white/90">{f.value}</p>
          </div>
        ))}
      </section>

      <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        {/* ---------------- makale ---------------- */}
        <article className="min-w-0">
          {guide.sections.map((s) => (
            <section key={s.id} id={s.id} className="mb-16 scroll-mt-28">
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

          {/* ---------------- yeme-içme kartları ---------------- */}
          {guide.places.length > 0 && (
            <section id="nerede-yenir" className="mb-16 scroll-mt-28">
              <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.2rem)] leading-tight text-white">
                Nerede yenir? Seçilmiş adresler
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/55">
                Aşağıdakiler tek tek gezilecek adresler değil, şehrin yeme kültürünü
                en iyi anlatan duraklar. Çalışma saatleri ve fiyatlar değişebildiği
                için yola çıkmadan önce doğrulayın.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {guide.places.map((p) => (
                  <div
                    key={p.name}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-colors duration-500 hover:border-white/[0.16]"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-[1.25rem] leading-none text-white">
                        {p.name}
                      </h3>
                      {p.price && (
                        <span className="shrink-0 rounded-full border border-[var(--gold)]/25 px-2.5 py-1 text-[9.5px] tracking-[0.16em] text-[var(--gold)]/80 uppercase">
                          {p.price}
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

          {/* ---------------- gezi planı ---------------- */}
          {guide.itinerary.length > 0 && (
            <section id="gezi-plani" className="mb-16 scroll-mt-28">
              <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.2rem)] leading-tight text-white">
                Gün gün gezi planı
              </h2>
              <ol className="mt-7 space-y-4">
                {guide.itinerary.map((d, i) => (
                  <li
                    key={d.title}
                    className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 pl-14"
                  >
                    <span className="font-display absolute top-6 left-6 text-[1.1rem] text-[var(--gold)]/70 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[1.05rem] font-semibold text-white/90">{d.title}</h3>
                    <dl className="mt-4 space-y-3">
                      <Slot label="Sabah" value={d.morning} />
                      <Slot label="Öğleden sonra" value={d.afternoon} />
                      <Slot label="Akşam" value={d.evening} />
                    </dl>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {guide.practicalTips && guide.practicalTips.length > 0 && (
            <section id="bilmeden-gitme" className="mb-16 scroll-mt-28">
              <p className="text-[9.5px] tracking-[0.26em] text-[var(--gold)]/70 uppercase">
                Bilmeden gitme
              </p>
              <h2 className="font-display mt-3 text-[clamp(1.6rem,3.2vw,2.2rem)] leading-tight text-white">
                {guide.practicalHeading ?? `${city.name}'ta işinizi kolaylaştıracak bilgiler`}
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
                {country.name} rotasını sürdürün
              </h2>
              <p className="mt-4 max-w-[64ch] text-[15px] leading-relaxed text-white/55">
                Bu şehir tek başına güçlü bir rota; zamanı olanlar için aşağıdaki
                duraklar aynı ülke yolculuğuna farklı bir bölge ve şehir deneyimi ekler.
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
                        Rehberi oku →
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
                Sık sorulan sorular
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
              <strong className="font-semibold text-white/70">Not:</strong>{" "}
              {guide.volatileNote} Son güncelleme:{" "}
              <time dateTime={guide.reviewed}>
                {new Date(guide.reviewed).toLocaleDateString("tr-TR", {
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
                Resmî kaynaklar ve son kontrol
              </h2>
              <p className="mt-3 max-w-[64ch] text-[13.5px] leading-relaxed text-white/45">
                Değişebilen vize, ulaşım, giriş ve ziyaret bilgilerini yolculuktan önce bu kurumsal kaynaklardan yeniden doğrulayın.
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
        </article>

        {/* ---------------- içindekiler ---------------- */}
        <aside className="lg:sticky lg:top-28">
          <nav aria-label="İçindekiler" className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
            <p className="text-[9.5px] tracking-[0.26em] text-white/35 uppercase">İçindekiler</p>
            <ul className="mt-4 space-y-2.5">
              {guide.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-[13px] leading-snug text-white/50 transition-colors duration-300 hover:text-white"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
              <li>
                {guide.places.length > 0 && (
                  <a href="#nerede-yenir" className="text-[13px] text-white/50 transition-colors duration-300 hover:text-white">
                    Nerede yenir?
                  </a>
                )}
              </li>
              <li>
                {guide.itinerary.length > 0 && (
                  <a href="#gezi-plani" className="text-[13px] text-white/50 transition-colors duration-300 hover:text-white">
                    Gün gün gezi planı
                  </a>
                )}
              </li>
              {guide.practicalTips && guide.practicalTips.length > 0 && (
                <li>
                  <a href="#bilmeden-gitme" className="text-[13px] text-white/50 transition-colors duration-300 hover:text-white">
                    Bilmeden gitme
                  </a>
                </li>
              )}
              {guide.relatedGuides && guide.relatedGuides.length > 0 && (
                <li>
                  <a href="#rotayi-surdur" className="text-[13px] text-white/50 transition-colors duration-300 hover:text-white">
                    Rotayı sürdür
                  </a>
                </li>
              )}
              <li>
                <a href="#sss" className="text-[13px] text-white/50 transition-colors duration-300 hover:text-white">
                  Sık sorulan sorular
                </a>
              </li>
              {guide.sources && guide.sources.length > 0 && (
                <li>
                  <a href="#kaynaklar" className="text-[13px] text-white/50 transition-colors duration-300 hover:text-white">
                    Resmî kaynaklar
                  </a>
                </li>
              )}
            </ul>
          </nav>

          {/* iç bağlantılar — aynı ülkedeki diğer şehirler */}
          {siblings.length > 0 && (
            <nav
              aria-label={`${country.name} içindeki diğer şehirler`}
              className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"
            >
              <p className="text-[9.5px] tracking-[0.26em] text-white/35 uppercase">
                {country.name} rotaları
              </p>
              <ul className="mt-4 space-y-2.5">
                {siblings.map((c) => (
                  <li key={c.name}>
                    <Link
                      href={cityHref(country, c)}
                      className="flex items-baseline justify-between gap-2 text-[13px] text-white/50 transition-colors duration-300 hover:text-white"
                    >
                      {c.name}
                      {!hasGuide(country.code, c.name) && (
                        <span className="shrink-0 text-[9px] tracking-[0.14em] text-white/20 uppercase">
                          hazırlanıyor
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
                {country.name} rehberi →
              </Link>
            </nav>
          )}
        </aside>
      </div>
    </div>
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
    <div className="flex gap-4">
      <dt className="w-28 shrink-0 text-[10px] tracking-[0.18em] text-white/30 uppercase">
        {label}
      </dt>
      <dd className="text-[14px] leading-relaxed text-white/65">{value}</dd>
    </div>
  );
}

import type { DestinationDietaryGuide, DietaryRestaurant } from "@/content/dietary";
import { googleMapsSearchUrl } from "@/content/dietary";

const statusLabels: Record<DietaryRestaurant["verification"]["status"], string> = {
  "fully-vegan": "Tamamen vegan",
  "vegan-focused": "Vegan odaklı",
  "vegan-options": "Vegan seçenekli",
  "certified-halal": "Sertifikalı helal",
  "restaurant-confirmed": "İşletme beyanlı",
  "halal-options": "Helal seçenekli",
  "muslim-friendly": "Müslüman dostu",
  "verification-recommended": "Yeniden doğrulama önerilir",
};

function PickCard({
  pick,
  city,
  country,
}: {
  pick: DietaryRestaurant;
  city: string;
  country: string;
}) {
  const isVegan = pick.category === "vegan";

  return (
    <article
      data-dietary-card="true"
      data-dietary-category={pick.category}
      data-restaurant-name={pick.name}
      className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.025] p-6 sm:p-7"
    >
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 h-px ${
          isVegan ? "bg-emerald-300/45" : "bg-[var(--gold)]/55"
        }`}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className={`text-[9.5px] font-semibold tracking-[0.22em] uppercase ${
            isVegan ? "text-emerald-300/80" : "text-[var(--gold)]/85"
          }`}
        >
          {isVegan ? "Vegan Pick" : "Halal Pick"}
        </p>
        <span className="rounded-full border border-white/[0.12] px-2.5 py-1 text-[9px] tracking-[0.12em] text-white/55 uppercase">
          {statusLabels[pick.verification.status]}
        </span>
      </div>

      <h3 className="font-display mt-5 text-[1.35rem] leading-tight text-white">{pick.name}</h3>
      <p className="mt-1.5 text-[10.5px] tracking-[0.15em] text-white/35 uppercase">
        {pick.area} · {pick.cuisine}
      </p>
      <p className="mt-4 text-[14px] leading-relaxed text-white/65">{pick.description}</p>
      <p className="mt-3 text-[13.5px] leading-relaxed text-white/50">
        <strong className="font-semibold text-white/75">Neden seçtik:</strong> {pick.why}
      </p>

      <div className="mt-5 rounded-xl border border-white/[0.07] bg-black/10 p-4">
        <p className="text-[9px] tracking-[0.17em] text-white/35 uppercase">Doğrulama notu</p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-white/50">
          {pick.verification.note}
        </p>
        <a
          href={pick.verification.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-[10.5px] leading-snug text-white/55 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
        >
          Kaynak: {pick.verification.sourceName} ↗
        </a>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={googleMapsSearchUrl(pick.name, city, country)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/15 px-4 py-2 text-[10px] tracking-[0.15em] text-white/70 uppercase transition-colors hover:border-white/35 hover:text-white"
        >
          Google Maps ↗
        </a>
        {pick.officialUrl && (
          <a
            href={pick.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/10 px-4 py-2 text-[10px] tracking-[0.15em] text-white/50 uppercase transition-colors hover:text-white"
          >
            Resmî site ↗
          </a>
        )}
        <time className="ml-auto text-[10px] tracking-[0.08em] text-white/25" dateTime={pick.lastVerified}>
          Son kontrol: {new Date(pick.lastVerified).toLocaleDateString("tr-TR")}
        </time>
      </div>
    </article>
  );
}

export default function DietaryPicks({
  dietary,
  city,
  country,
}: {
  dietary: DestinationDietaryGuide;
  city: string;
  country: string;
}) {
  return (
    <section id="vegan-helal-restoranlar" className="mb-16 scroll-mt-28">
      <p className="text-[9.5px] tracking-[0.26em] text-[var(--gold)]/70 uppercase">
        Beslenme tercihleri
      </p>
      <h2 className="font-display mt-3 text-[clamp(1.6rem,3.2vw,2.2rem)] leading-tight text-white">
        {city} vegan ve helal restoran önerileri
      </h2>
      <p className="mt-4 max-w-[68ch] text-[15px] leading-relaxed text-white/55">
        {city} için bir bitki bazlı ve bir Müslüman gezgin odaklı adres seçtik. Helal
        etiketleri aynı anlama gelmez: sertifika, işletme beyanı ve yalnızca bazı helal
        seçenekler kartlarda ayrı ayrı gösterilir.
      </p>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {dietary.vegan.map((pick) => (
          <PickCard key={`vegan-${pick.name}`} pick={pick} city={city} country={country} />
        ))}
        {dietary.halal.map((pick) => (
          <PickCard key={`halal-${pick.name}`} pick={pick} city={city} country={country} />
        ))}
      </div>

      {dietary.researchNote && (
        <p className="mt-4 rounded-xl border border-amber-300/15 bg-amber-200/[0.035] p-4 text-[12.5px] leading-relaxed text-amber-100/60">
          <strong className="font-semibold text-amber-100/80">Araştırma notu:</strong>{" "}
          {dietary.researchNote}
        </p>
      )}

      <p className="mt-4 text-[11.5px] leading-relaxed text-white/30">
        Restoran menüleri, tedarikçiler ve sertifikalar değişebilir. Özellikle sıkı helal
        hassasiyetinde güncel sertifikayı, alkolü, sos içeriklerini ve ortak mutfak riskini
        doğrudan işletmeden doğrulayın.
      </p>
    </section>
  );
}

import { Link } from "@/i18n/navigation";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

/** Hakkımızda sayfasının İngilizce metni. */
export default function AboutEn() {
  return (
    <LegalPage
      lang="en"
      eyebrow="Independent travel publication"
      title="About us"
      summary="Wangoh was founded to describe a city without reducing it to a list of things to see. Our aim is to bring together the practical information you need before a trip, the spirit of a neighbourhood and the story behind its food in a single guide."
      showUpdated={false}
    >
      <LegalSection title="Why Wangoh?">
        <p>
          It&rsquo;s easy to get lost among hundreds of browser tabs when planning a trip. Wangoh
          brings routes, transport, neighbourhoods to stay in, local food and suggestions for
          different dietary preferences together into a clear whole. Our content is there to help
          you make travel decisions; we don&rsquo;t provide bookings, sell tours or act as a travel
          agency.
        </p>
      </LegalSection>

      <LegalSection title="What we publish">
        <ul>
          <li>Comprehensive travel guides by country and city,</li>
          <li>Day-by-day route ideas and neighbourhood-focused planning notes,</li>
          <li>Practical information on transport, budget, seasons and travel pace,</li>
          <li>Clearly categorised suggestions for vegan, halal and other dietary needs,</li>
          <li>Quizzes and discovery tools that make travel more fun.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Our editorial principles">
        <p>
          We put usefulness to the reader first. We aim to present content in a clear, original
          and usable way, and to give information that may change, such as prices, opening hours,
          visas and transport, with dates and context wherever possible. On topics that require
          official sources, we give priority to the current statements of the relevant
          institutions.
        </p>
        <p>
          Restaurants, businesses and attractions may close, move or change their services over
          time. For important plans and special dietary requirements, we therefore recommend
          confirming directly with the business or the relevant official body before your visit.
        </p>
      </LegalSection>

      <LegalSection title="Independence, advertising and partnerships">
        <p>
          Wangoh may be funded by advertising. Ads selected by ad-serving systems don&rsquo;t
          represent our editorial view. If paid partnerships or sponsored content are published,
          they will be clearly labelled so that readers can easily recognise them. A commercial
          relationship is no guarantee of a positive review.
        </p>
        <LegalCallout>
          If you notice a factual error, outdated information or a problem with a source, you can
          write to us with the topic and a link to the page.
        </LegalCallout>
      </LegalSection>

      <LegalSection title="Contact us">
        <p>
          For correction requests, editorial suggestions, partnerships and general questions,
          you can use <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. To learn how personal
          data is processed, please read the{" "}
          <Link href="/gizlilik-politikasi">Privacy Policy and KVKK Notice</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

import { Link } from "@/i18n/navigation";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

/** Kullanım koşullarının İngilizce metni. */
export default function TermsEn() {
  return (
    <LegalPage
      lang="en"
      eyebrow="Terms of site use"
      title="Terms of Use"
      summary="By using wangoh.com, you accept that you have read the terms below. These terms don't limit the rights you have under mandatory law."
    >
      <LegalCallout>
        Wangoh is not a travel agency, booking platform or official authority. The content on the
        site is intended for general information and travel inspiration.
      </LegalCallout>

      <LegalSection title="1. Scope of the service">
        <p>
          Wangoh offers editorial content and discovery tools about destinations, routes,
          transport, neighbourhoods to stay in, food and drink, and travel experiences. No flight,
          hotel, tour, restaurant, visa or insurance bookings are made through Wangoh, and no
          payments are taken.
        </p>
      </LegalSection>

      <LegalSection title="2. Accuracy of information and personal responsibility">
        <p>
          Reasonable care is taken to make the content accurate and useful; however, prices,
          opening hours, transport timetables, entry requirements, visa rules, health/safety
          conditions and business information can change quickly. No guarantee is given of
          completeness, uninterrupted availability or fitness for a particular purpose.
        </p>
        <p>
          Before making a travel decision, buying anything or relying on information for special
          dietary/accessibility needs, it is the user&rsquo;s responsibility to verify the information
          with the relevant airline, business, consulate, public authority or other primary source.
          For emergency, health, legal or safety advice, consult an authorised professional.
        </p>
      </LegalSection>

      <LegalSection title="3. External sites and services">
        <p>
          The site may contain links to maps, official institutions, restaurants, image sources or
          other third-party sites. These links are provided for convenience; they don&rsquo;t mean we
          endorse the content, security, prices or privacy practices of the party concerned. Your
          relationship with a third party is subject to its own terms.
        </p>
      </LegalSection>

      <LegalSection title="4. Intellectual property and permitted use">
        <p>
          Rights in the texts, original layout, brand elements, software and compilations prepared
          by Wangoh belong to Wangoh or the relevant rights holders. Short quotations may be made for
          non-commercial personal use, citing the source and including a link. Prior written
          permission is required to copy the content in full, scrape it automatically in bulk,
          republish it, sell it or turn it into another service&rsquo;s database.
        </p>
        <p>
          Third-party images and marks are subject to their own licences and terms of use. Notices
          concerning rights ownership can be sent to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>{" "}
          with the relevant page link and information explaining the right.
        </p>
      </LegalSection>

      <LegalSection title="5. Acceptable use">
        <p>When using the site, don&rsquo;t:</p>
        <ul>
          <li>Try to harm the site, its servers or other users,</li>
          <li>Circumvent security measures, gain unauthorised access or send malicious code,</li>
          <li>Misleadingly claim to be acting on behalf of Wangoh,</li>
          <li>Infringe copyright, trademark, privacy or other third-party rights,</li>
          <li>Use the site for unlawful activities.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Advertising and commercial content">
        <p>
          The site may show ads through third-party systems such as Google AdSense. Ads may be
          determined by advertisers&rsquo; bidding and targeting systems and aren&rsquo;t Wangoh&rsquo;s
          editorial recommendation. Sponsored content and paid partnerships are clearly labelled
          when published.
        </p>
        <p>
          The <Link href="/gizlilik-politikasi">Privacy Policy</Link> and the{" "}
          <Link href="/cerez-politikasi">Cookie Policy</Link> apply to the use of data by
          advertising technologies.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitation of liability">
        <p>
          Subject to mandatory legal rules, Wangoh can&rsquo;t be held liable for indirect damage
          arising from changes in third-party services, decisions users make without verification,
          the actions of linked sites, device/connection problems or interruptions beyond its
          control. This provision doesn&rsquo;t remove liabilities that can&rsquo;t be limited by law.
        </p>
      </LegalSection>

      <LegalSection title="8. Privacy">
        <p>
          The processing of personal data is subject to the{" "}
          <Link href="/gizlilik-politikasi">Privacy Policy and KVKK Notice</Link>. When emailing us,
          don&rsquo;t share unnecessary special categories of data, passwords or payment details.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes, access and governing law">
        <p>
          The site content and these terms may be updated in line with changes to the service or
          legislation. The current text is published on this page. The service may be temporarily
          suspended for site maintenance, security or force majeure. These terms are governed by
          the law of the Republic of Türkiye; applicable consumer and personal data rights are
          reserved.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          You can send questions about these terms to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

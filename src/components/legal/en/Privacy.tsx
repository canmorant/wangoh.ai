import { Link } from "@/i18n/navigation";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

/** Gizlilik politikası ve KVKK aydınlatma metninin İngilizce metni. */
export default function PrivacyEn() {
  return (
    <LegalPage
      lang="en"
      eyebrow="Protection of personal data"
      title="Privacy Policy and KVKK Notice"
      summary="This notice explains when, for what purposes and on what legal grounds data belonging to visitors of wangoh.com and people who contact us is processed."
    >
      <LegalCallout>
        <strong>Data controller:</strong> {SITE.operatorEn} (&ldquo;Wangoh&rdquo;)
        <br />
        <strong>Contact:</strong>{" "}
        <a href={`mailto:${SITE.email}`} className="text-[var(--gold)]/90">
          {SITE.email}
        </a>
      </LegalCallout>

      <LegalSection title="1. Scope">
        <p>
          This notice covers personal data processing that may take place when you visit the site,
          use external links on the site or contact Wangoh by email. Wangoh doesn&rsquo;t operate a
          membership system, user accounts, online payments or a contact form.
        </p>
      </LegalSection>

      <LegalSection title="2. Categories of data processed">
        <ul>
          <li>
            <strong>Contact data:</strong> when you email us, your email address, your name or
            signature, the content of your message and any files you knowingly attach.
          </li>
          <li>
            <strong>Transaction security and technical records:</strong> IP address, request time,
            requested page, browser/device information, error and security signals that hosting
            and security providers may process in server/CDN logs.
          </li>
          <li>
            <strong>Anonymous usage statistics:</strong> aggregate information such as pages
            visited, referring source, approximate country, device, operating system and browser
            type may be measured with Vercel Web Analytics. This measurement doesn&rsquo;t use cookies
            and doesn&rsquo;t create a user profile that directly identifies you in reports.
          </li>
          <li>
            <strong>Google Analytics data (only with your consent):</strong> if you give analytics
            consent, Google Analytics processes pages viewed, on-site interactions, approximate
            location, and device and browser information together with cookie identifiers. If you
            don&rsquo;t, Google Analytics isn&rsquo;t loaded.
          </li>
          <li>
            <strong>Consent record:</strong> your cookie choice and the date you made it are kept only
            in your browser&rsquo;s localStorage and aren&rsquo;t sent to Wangoh&rsquo;s servers.
          </li>
          <li>
            <strong>On-device game data:</strong> your score, level, streak and learned flags in the
            flag game are kept only in your browser&rsquo;s localStorage. This record isn&rsquo;t sent
            to Wangoh&rsquo;s servers.
          </li>
          <li>
            <strong>Approximate location (flight animation):</strong> for the departure point of
            the flight animation on the home page, the approximate city and coordinates that our
            hosting provider Vercel derives from your IP address are sent to your browser. Wangoh
            doesn&rsquo;t store this information or link it to a user profile; it is kept only for
            that session in your browser&rsquo;s sessionStorage. If you choose the departure city
            yourself, your choice is stored in localStorage.
          </li>
          <li>
            <strong>Advertising and consent data:</strong> through Google AdSense, cookies/similar
            identifiers, consent signals and ad interactions may be processed by Google, depending on
            your consent choice and the rules in your region.
          </li>
        </ul>
        <p>
          Wangoh doesn&rsquo;t ask you for special categories of personal data. We ask that you
          don&rsquo;t send such information by email.
        </p>
      </LegalSection>

      <LegalSection title="3. Purposes of processing">
        <ul>
          <li>Responding to contact requests and reviewing editorial corrections,</li>
          <li>Delivering the site securely, quickly and accessibly; fixing errors,</li>
          <li>
            Understanding, through aggregate statistics, which guides people find useful (with
            Google Analytics, only with your consent),
          </li>
          <li>Preventing misuse, unauthorised access and security incidents,</li>
          <li>Fulfilling legal obligations and establishing, exercising or protecting rights,</li>
          <li>Serving ads and managing consent records where there is an explicit choice/consent.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Collection methods and legal grounds">
        <p>
          Data may be collected electronically: directly from you by email, automatically through
          technical requests sent to the site, via on-device storage, through Google Analytics if
          you consent, or through Google&rsquo;s advertising/consent technologies.
        </p>
        <p>
          Depending on their nature, processing activities rely on the conditions in Article 5 of
          Turkey&rsquo;s Law No. 6698 on the Protection of Personal Data (KVKK):{" "}
          <strong>legal obligation</strong>,{" "}
          <strong>establishing, exercising or protecting a right</strong> and, provided your
          fundamental rights aren&rsquo;t harmed, <strong>legitimate interest</strong>. Where the law
          or the rules of the relevant region require explicit consent, advertising and
          non-essential storage activities are carried out only on the basis of your separate,
          informed choice. The use of cookies for Google Analytics and personalised advertising
          relies on your <strong>explicit consent</strong>, which you can withdraw at any time via
          the &ldquo;Cookie settings&rdquo; link at the bottom of the page.
        </p>
      </LegalSection>

      <LegalSection title="5. Groups of recipients to whom data may be transferred">
        <p>Data may be shared with the following groups only to the extent necessary for the relevant purpose:</p>
        <ul>
          <li>Hosting, CDN, security and technical infrastructure providers (such as Vercel),</li>
          <li>Email hosting and communication service providers,</li>
          <li>
            Content/CDN providers whose resources are requested from the browser only when needed
            (for example Unsplash, Wikimedia or jsDelivr),
          </li>
          <li>Google (Google Analytics), when you give analytics consent,</li>
          <li>
            Google (AdSense) and the relevant ad technology providers, depending on your consent
            choice,
          </li>
          <li>Legally authorised public authorities, judicial bodies and legal advisers.</li>
        </ul>
        <p>
          Some technical service providers may be located abroad or may process data on
          infrastructure abroad. Any such transfer is limited within the framework of the transfer
          mechanisms and safeguards provided for by applicable law.
        </p>
      </LegalSection>

      <LegalSection title="6. Retention periods">
        <p>
          Contact records are kept for as long as necessary to resolve the request and follow up
          any disputes; technical logs are kept for the limited period required by security, error
          fixing and provider settings. When the legal obligation ends and there is no longer a
          purpose for processing, the data is deleted, destroyed or anonymised.
        </p>
        <p>
          The flag game record stays on your device until you clear your browser data. Your cookie
          choice is kept for 6 months. Google Analytics cookies stay in your browser for up to 2
          years and are deleted if you withdraw analytics consent. Retention
          periods for advertising technologies may vary depending on your consent choice and the
          relevant provider&rsquo;s policy.
        </p>
      </LegalSection>

      <LegalSection title="7. Data security">
        <p>
          The site is served over HTTPS; administrative and technical access limits, security
          headers and up-to-date software components are used. Nevertheless, please remember that
          no method of transmission over the internet can provide absolute security. If you notice
          anything suspicious, you can let us know.
        </p>
      </LegalSection>

      <LegalSection title="8. Your rights under the KVKK">
        <p>Under Article 11 of Law No. 6698, where the conditions are met, you have the right to:</p>
        <ul>
          <li>Learn whether your personal data is being processed,</li>
          <li>Request information about it if it has been processed,</li>
          <li>Learn the purpose of processing and whether it is used in line with that purpose,</li>
          <li>Know the third parties in Turkey or abroad to whom it has been transferred,</li>
          <li>Ask for incomplete or inaccurately processed data to be corrected,</li>
          <li>Ask for it to be deleted or destroyed under the conditions set out in the law,</li>
          <li>Ask for corrections/deletions to be notified to those to whom the data was transferred,</li>
          <li>Object to an outcome against you resulting from automated analysis,</li>
          <li>Claim compensation if you suffer damage due to unlawful processing.</li>
        </ul>
        <p>
          You can send your request to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Reasonable
          additional information may be requested to verify that the request is yours and to give
          an accurate answer. Requests are assessed within the procedures and time limits of
          applicable law.
        </p>
      </LegalSection>

      <LegalSection title="9. Children's privacy">
        <p>
          The site isn&rsquo;t a service aimed specifically at children and doesn&rsquo;t intend to
          knowingly collect personal data from children. If you believe a child&rsquo;s data has been
          shared without permission, you can contact us so that deletion can be considered.
        </p>
      </LegalSection>

      <LegalSection title="10. External links and policy changes">
        <p>
          Wangoh may link to third-party sites. Wangoh isn&rsquo;t responsible for the privacy
          practices of those sites; we recommend reviewing their policies before opening a link.
          This notice may be updated when services or legislation change; the current version is
          published on this page.
        </p>
        <p>
          For more detailed information on device storage and advertising technologies, please see
          the <Link href="/cerez-politikasi">Cookie Policy</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

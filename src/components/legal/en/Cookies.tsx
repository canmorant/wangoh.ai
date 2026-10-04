import { Link } from "@/i18n/navigation";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";

/** Çerez politikasının İngilizce metni. */
export default function CookiesEn() {
  return (
    <LegalPage
      lang="en"
      eyebrow="Browser storage and preferences"
      title="Cookie Policy"
      summary="This policy explains the cookies and cookie-like browser storage technologies used on wangoh.com, together with their purpose, duration and your control options."
    >
      <LegalCallout>
        Wangoh&rsquo;s anonymous visitor measurement doesn&rsquo;t use cookies. Flag game progress and
        the departure city for the flight animation are kept only in your browser&rsquo;s storage on
        your device. When Google AdSense is enabled, advertising/consent technologies may come into
        play under the conditions described in this policy.
      </LegalCallout>

      <LegalSection title="1. What are cookies and similar technologies?">
        <p>
          A cookie is a small piece of data that a website saves in your browser. Similar
          technologies such as localStorage can also store preference or feature information on
          your device. These technologies can be used for different purposes, such as essential
          functions, user preferences, performance measurement or advertising.
        </p>
      </LegalSection>

      <LegalSection title="2. What Wangoh currently stores on your device">
        <div className="legal-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Technology / type</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>wangoh.flaggame.v2</td>
                <td>First-party localStorage / functional</td>
                <td>Remembering your score, level, streak and learned flags in the flag game</td>
                <td>Until browser data is cleared</td>
              </tr>
              <tr>
                <td>wangoh.origin</td>
                <td>First-party localStorage / functional</td>
                <td>
                  Remembering the departure city you chose for the flight animation. Created only
                  when you select the city manually.
                </td>
                <td>Until browser data is cleared</td>
              </tr>
              <tr>
                <td>wangoh.origin.detected</td>
                <td>First-party sessionStorage / functional</td>
                <td>
                  Keeping the approximate city and coordinates detected from your connection so
                  they aren&rsquo;t requested again in the same session
                </td>
                <td>Until the tab or browser is closed</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          These records aren&rsquo;t sent to Wangoh&rsquo;s servers and aren&rsquo;t used to track you
          across other websites. They are on-device preferences linked to your use of the relevant
          feature.
        </p>
      </LegalSection>

      <LegalSection title="3. Anonymous visitor measurement">
        <p>
          Vercel Web Analytics measures pages viewed, referring sources, approximate country,
          device, operating system and browser type as aggregate statistics. This feature
          doesn&rsquo;t use third-party cookies, doesn&rsquo;t track you across websites and doesn&rsquo;t
          give Wangoh a profile that directly identifies a visitor.
        </p>
      </LegalSection>

      <LegalSection title="4. Hosting and security logs">
        <p>
          Hosting/CDN providers such as Vercel may process technical logs such as IP address,
          request time, requested URL and browser information to keep the site secure and running.
          These logs aren&rsquo;t cookies placed in your browser by Wangoh; for details, see the{" "}
          <Link href="/gizlilik-politikasi">Privacy Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection title="5. When Google AdSense is enabled">
        <p>
          When Wangoh starts showing ads, Google and authorised ad technology providers may use
          cookies or similar identifiers to serve ads, limit frequency, prevent fraud, measure ad
          performance and apply your consent choices. Google may change the names and lifetimes of
          the identifiers used over time.
        </p>
        <ul>
          <li>
            In the regions and situations where it is required, non-essential advertising storage
            isn&rsquo;t enabled without your consent choice.
          </li>
          <li>
            For visitors from the European Economic Area, the United Kingdom and Switzerland, a
            consent management platform (CMP) certified by Google is used.
          </li>
          <li>
            Depending on your choice, personalised, non-personalised or limited ads may be shown.
          </li>
        </ul>
        <p>
          You can learn how Google uses advertising data on its{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites?hl=en"
            target="_blank"
            rel="noreferrer"
          >
            how Google uses information from sites or apps that use its services
          </a>{" "}
          page.
        </p>
      </LegalSection>

      <LegalSection title="6. Legal basis and managing preferences">
        <p>
          Technologies that are strictly necessary to deliver the site securely or to run a
          feature you have explicitly requested may rely on legal grounds other than explicit
          consent under applicable law. For non-essential functional, analytics or advertising
          technologies, a preference mechanism is provided in regions where explicit consent is
          required.
        </p>
        <p>
          When AdSense is enabled, you can refine your choice in the &ldquo;manage options&rdquo; area
          of the consent window and change it later via the site&rsquo;s &ldquo;privacy/cookie
          preferences&rdquo; link. Withdrawing consent doesn&rsquo;t affect the lawfulness of
          processing carried out before the withdrawal.
        </p>
      </LegalSection>

      <LegalSection title="7. Deleting and blocking in your browser">
        <p>
          You can view, block or delete cookies and site data in your browser settings. To remove
          your flag game progress, you can delete the `wangoh.com` site data/localStorage record. If
          you block all storage, some preference features may not work as expected.
        </p>
        <ul>
          <li>
            <a href="https://support.google.com/chrome/answer/95647?hl=en" target="_blank" rel="noreferrer">
              Google Chrome cookie settings
            </a>
          </li>
          <li>
            <a href="https://support.apple.com/en-gb/105082" target="_blank" rel="noreferrer">
              Safari cookies and website data
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox"
              target="_blank"
              rel="noreferrer"
            >
              Clearing cookies in Firefox
            </a>
          </li>
          <li>
            <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer">
              Google ad personalisation settings
            </a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Changes and contact">
        <p>
          When a new analytics, advertising or preference technology is added, this table and the
          consent mechanism are updated. For questions, you can reach us at{" "}
          <a href="mailto:info@wangoh.com">info@wangoh.com</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

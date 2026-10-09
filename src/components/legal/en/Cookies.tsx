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
        We use analytics and advertising cookies only with your permission. Google Analytics isn&rsquo;t
        loaded at all unless you allow analytics, and advertising cookies also depend on your
        consent. We ask
        for your choice on your first visit, and you can change it at any time via the &ldquo;Cookie
        settings&rdquo; link at the bottom of the page.
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
                <td>wangoh.consent</td>
                <td>First-party localStorage / necessary</td>
                <td>Remembering your cookie and consent choice and when you made it</td>
                <td>6 months; then you&rsquo;re asked again</td>
              </tr>
              <tr>
                <td>wangoh.flaggame.v2</td>
                <td>First-party localStorage / functional</td>
                <td>Remembering your score, level, streak and learned flags in the flag game</td>
                <td>Until browser data is cleared</td>
              </tr>
              <tr>
                <td>wangoh.distancegame.v2</td>
                <td>First-party localStorage / functional</td>
                <td>
                  Remembering your best result, games played, average, Daily Tour results, daily streak
                  and sound-effects choice in the &ldquo;How many kilometres?&rdquo; game
                </td>
                <td>Until browser data is cleared</td>
              </tr>
              <tr>
                <td>wangoh.origin</td>
                <td>First-party localStorage / functional</td>
                <td>
                  Remembering the departure city you chose for the flight animation and route
                  cards. Created only when you select the city manually.
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
              <tr>
                <td>wangoh-shell-v1, wangoh-pages-v1, wangoh-assets-v1</td>
                <td>First-party service worker cache (Cache Storage) / functional</td>
                <td>
                  Storing the pages and images you visit on your device so they can also open
                  without an internet connection
                </td>
                <td>Until browser data is cleared or the cache version is renewed</td>
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

      <LegalSection title="3. Visitor measurement">
        <p>
          Vercel Web Analytics measures pages viewed, referring sources, approximate country,
          device, operating system and browser type as aggregate statistics. This feature
          doesn&rsquo;t use cookies, doesn&rsquo;t track you across websites and doesn&rsquo;t give Wangoh a
          profile that directly identifies a visitor.
        </p>
        <p>
          Google Analytics 4 is loaded only when you give &ldquo;Analytics&rdquo; consent. It uses the
          first-party cookies below to measure pages viewed, on-site interactions, approximate
          location, and device and browser information. If you withdraw consent, Google Analytics
          stops sending data immediately, these cookies are deleted and it isn&rsquo;t loaded on
          your later visits.
        </p>
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
                <td>_ga</td>
                <td>Google Analytics cookie / analytics</td>
                <td>Distinguishing visitors from one another</td>
                <td>Up to 2 years</td>
              </tr>
              <tr>
                <td>_ga_QJSHGD467K</td>
                <td>Google Analytics cookie / analytics</td>
                <td>Maintaining session state</td>
                <td>Up to 2 years</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="4. Hosting and security logs">
        <p>
          Hosting/CDN providers such as Vercel may process technical logs such as IP address,
          request time, requested URL and browser information to keep the site secure and running.
          These logs aren&rsquo;t cookies placed in your browser by Wangoh; for details, see the{" "}
          <Link href="/gizlilik-politikasi">Privacy Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection title="5. Google AdSense advertising">
        <p>
          Wangoh&rsquo;s pages include the Google AdSense ad script. Google and authorised ad technology providers may use
          cookies or similar identifiers to serve ads, limit frequency, prevent fraud, measure ad
          performance and apply your consent choices. Google may change the names and lifetimes of
          the identifiers used over time.
        </p>
        <ul>
          <li>
            Unless you give advertising consent, Google is told (via Consent Mode) that ad storage
            is denied; non-personalised or limited ads may be shown without advertising cookies.
          </li>
          <li>If you give advertising consent, ads may be personalised to your interests.</li>
          <li>
            Visitors in the European Economic Area, the United Kingdom and Switzerland are also
            shown a consent message for advertising through Google&rsquo;s certified consent
            management platform (Google Privacy &amp; messaging).
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
          consent under applicable law. Analytics and advertising cookies are used only with your
          explicit consent; without advertising consent, ads are served in a limited way without
          advertising cookies.
        </p>
        <p>
          You can give your choice in the consent window shown on your first visit, choose by
          category with &ldquo;Manage preferences&rdquo;, and change it at any time via the
          &ldquo;Cookie settings&rdquo; link at the bottom of the page. Your choice is stored on your
          device for 6 months, after which you&rsquo;re asked again. Withdrawing consent doesn&rsquo;t
          affect the lawfulness of processing carried out before the withdrawal.
        </p>
      </LegalSection>

      <LegalSection title="7. Deleting and blocking in your browser">
        <p>
          You can view, block or delete cookies and site data in your browser settings. To remove
          your flag game progress, you can delete the wangoh.com site data; this also removes your
          departure city choice, your consent record and the offline page cache. If you block all
          storage, some preference features may not work as expected.
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
            <a href="https://myadcenter.google.com/?hl=en" target="_blank" rel="noreferrer">
              Google My Ad Center (ad personalisation settings)
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

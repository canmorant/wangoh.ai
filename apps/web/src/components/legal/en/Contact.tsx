import { Link } from "@/i18n/navigation";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

/** İletişim sayfasının İngilizce metni. */
export default function ContactEn() {
  return (
    <LegalPage
      lang="en"
      eyebrow="Write to us"
      title="Contact"
      summary="Have you spotted information in a guide that needs correcting, or would you like to suggest a new route? If you send your message with the right context, we can review it more quickly."
      showUpdated={false}
    >
      <LegalCallout>
        <p className="text-[10px] tracking-[0.24em] text-[var(--gold)]/75 uppercase">
          General enquiries
        </p>
        <a
          href={`mailto:${SITE.email}`}
          className="font-display mt-2 inline-block break-all text-[clamp(1.55rem,6vw,2.4rem)] text-white transition-colors hover:text-[var(--gold)]"
        >
          {SITE.email}
        </a>
      </LegalCallout>

      <LegalSection title="What can you write to us about?">
        <ul>
          <li>
            <strong>Content corrections:</strong> with the page link, the incorrect section and,
            if possible, a source that verifies it.
          </li>
          <li>
            <strong>Route and content suggestions:</strong> stating the city, the topic and how
            it would help readers.
          </li>
          <li>
            <strong>Partnerships and press:</strong> with brand/organisation details, scope and a
            contact person.
          </li>
          <li>
            <strong>Privacy and KVKK requests:</strong> stating the scope of the request and the
            relevant contact details.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Before you send a message">
        <p>
          Wangoh is not a travel agency or booking platform. It doesn&rsquo;t make bookings for
          flights, hotels, restaurants or visa applications, and it doesn&rsquo;t ask for payment or
          identity documents in connection with them. Don&rsquo;t send unnecessary special categories
          of personal data, passwords, payment card details or identity documents by email.
        </p>
        <p>
          To review your message, your name, email address, message content and any attachments
          you send may be processed. For details, please read the{" "}
          <Link href="/gizlilik-politikasi">Privacy Policy and KVKK Notice</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Editorial corrections">
        <p>
          We take reports seriously; however, we can&rsquo;t guarantee that every suggestion will be
          published or answered within a specific time. For safety, visa, health and official
          transport information, the current statement of the relevant public authority takes
          precedence.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

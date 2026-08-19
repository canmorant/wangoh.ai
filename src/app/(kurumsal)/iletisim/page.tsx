import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/guide/JsonLd";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";
import { SITE, absolute } from "@/lib/site";

const title = "İletişim | Wangoh";
const description =
  "Wangoh'a içerik düzeltmeleri, öneriler, iş birlikleri ve gizlilik talepleri için ulaşın.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absolute("/iletisim") },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title,
    description,
    url: absolute("/iletisim"),
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Wangoh İletişim",
          url: absolute("/iletisim"),
          description,
          mainEntity: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url,
            email: SITE.email,
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: SITE.email,
              availableLanguage: ["Turkish"],
            },
          },
        }}
      />
      <LegalPage
        eyebrow="Bize yazın"
        title="İletişim"
        summary="Bir rehberde düzeltilmesi gereken bilgi mi gördünüz, yeni bir rota mı önermek istiyorsunuz? Mesajınızı doğru bağlamla birlikte ilettiğinizde daha hızlı değerlendirebiliriz."
        showUpdated={false}
      >
        <LegalCallout>
          <p className="text-[10px] tracking-[0.24em] text-[var(--gold)]/75 uppercase">
            Genel iletişim
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="font-display mt-2 inline-block break-all text-[clamp(1.55rem,6vw,2.4rem)] text-white transition-colors hover:text-[var(--gold)]"
          >
            {SITE.email}
          </a>
        </LegalCallout>

        <LegalSection title="Hangi konularda yazabilirsiniz?">
          <ul>
            <li>
              <strong>İçerik düzeltmesi:</strong> Sayfa bağlantısı, hatalı bölüm ve mümkünse
              doğrulayıcı kaynakla birlikte.
            </li>
            <li>
              <strong>Rota ve içerik önerisi:</strong> Şehir, konu ve okuyucuya sağlayacağı
              faydayı belirterek.
            </li>
            <li>
              <strong>İş birliği ve basın:</strong> Marka/kurum bilgisi, kapsam ve iletişim
              kişisiyle birlikte.
            </li>
            <li>
              <strong>Gizlilik ve KVKK talepleri:</strong> Talebin kapsamını ve ilgili iletişim
              bilgisini belirterek.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="Mesaj göndermeden önce">
          <p>
            Wangoh bir seyahat acentesi veya rezervasyon platformu değildir. Uçuş, otel,
            restoran ya da vize başvurusu adına rezervasyon yapmaz; bu işlemlerle ilgili ödeme
            veya kimlik belgesi talep etmez. E-posta ile gereksiz özel nitelikli kişisel veri,
            parola, ödeme kartı bilgisi veya kimlik belgesi göndermeyin.
          </p>
          <p>
            Mesajınızın değerlendirilmesi için adınız, e-posta adresiniz, mesaj içeriğiniz ve
            gönderdiğiniz ekler işlenebilir. Ayrıntılar için{" "}
            <Link href="/gizlilik-politikasi">Gizlilik Politikası ve KVKK Aydınlatma Metni</Link>
            &rsquo;ni okuyabilirsiniz.
          </p>
        </LegalSection>

        <LegalSection title="Editoryal düzeltmeler">
          <p>
            Bildirimleri önemseriz; ancak her önerinin yayımlanacağı veya belirli bir sürede
            yanıtlanacağı garanti edilmez. Güvenlik, vize, sağlık ve resmî ulaşım bilgileri için
            ilgili kamu kurumunun güncel açıklaması esas alınır.
          </p>
        </LegalSection>
      </LegalPage>
    </>
  );
}


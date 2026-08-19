import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/guide/JsonLd";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";
import { SITE, absolute } from "@/lib/site";

const title = "Hakkımızda | Wangoh";
const description =
  "Wangoh'un seyahat yayıncılığı yaklaşımı, editoryal ilkeleri, içerik üretim yöntemi ve iletişim bilgileri.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absolute("/hakkimizda") },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title,
    description,
    url: absolute("/hakkimizda"),
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Wangoh Hakkında",
          url: absolute("/hakkimizda"),
          description,
          isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
          mainEntity: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url,
            email: SITE.email,
          },
        }}
      />
      <LegalPage
        eyebrow="Bağımsız seyahat yayını"
        title="Hakkımızda"
        summary="Wangoh, bir şehri yalnızca gezilecek yerler listesine indirmeden anlatmak için kuruldu. Amacımız; yolculuğa çıkmadan önce ihtiyaç duyulan pratik bilgiyi, mahallenin ruhunu ve sofranın hikâyesini aynı rehberde buluşturmak."
        showUpdated={false}
      >
        <LegalSection title="Neden Wangoh?">
          <p>
            Seyahat planlarken yüzlerce sekme arasında kaybolmak kolaydır. Wangoh; rotayı,
            ulaşımı, konaklama bölgelerini, yerel lezzetleri ve farklı beslenme tercihlerine
            uygun önerileri anlaşılır bir bütün hâline getirir. İçeriklerimiz seyahat kararına
            yardımcı olmak içindir; rezervasyon, tur satışı veya seyahat acenteliği hizmeti
            vermeyiz.
          </p>
        </LegalSection>

        <LegalSection title="Ne yayımlıyoruz?">
          <ul>
            <li>Ülke ve şehir bazında kapsamlı gezi rehberleri,</li>
            <li>Gün gün rota fikirleri ve semt odaklı planlama notları,</li>
            <li>Ulaşım, bütçe, mevsim ve seyahat temposuna ilişkin pratik bilgiler,</li>
            <li>Vegan, helal ve farklı beslenme ihtiyaçlarına yönelik açıkça sınıflandırılmış öneriler,</li>
            <li>Seyahati eğlenceli hâle getiren testler ve keşif araçları.</li>
          </ul>
        </LegalSection>

        <LegalSection title="Editoryal ilkelerimiz">
          <p>
            Okura faydayı ilk sıraya koyarız. İçeriği açık, özgün ve kullanılabilir biçimde
            sunmayı; değişebilecek fiyat, çalışma saati, vize ve ulaşım bilgilerini mümkün
            olduğunca tarih ve bağlamıyla aktarmayı hedefleriz. Resmî kaynak gerektiren
            konularda ilgili kurumların güncel açıklamalarına öncelik veririz.
          </p>
          <p>
            Restoranlar, işletmeler ve turistik noktalar zaman içinde kapanabilir, taşınabilir
            veya hizmet kapsamını değiştirebilir. Bu nedenle önemli planlar ve özel beslenme
            gereksinimleri için ziyaret öncesinde işletmeyle ya da ilgili resmî kurumla doğrudan
            teyit öneririz.
          </p>
        </LegalSection>

        <LegalSection title="Bağımsızlık, reklam ve iş birlikleri">
          <p>
            Wangoh reklamlarla finanse edilebilir. Reklam gösterim sistemlerinin belirlediği
            ilanlar editoryal görüşümüz anlamına gelmez. Ücretli iş birlikleri veya sponsorlu
            içerikler yayımlanırsa bunlar okurun kolayca fark edebileceği şekilde açıkça
            işaretlenir. Ticari ilişki, olumlu değerlendirme garantisi vermez.
          </p>
          <LegalCallout>
            İçerikte maddi hata, güncelliğini yitirmiş bilgi veya kaynak sorunu fark ederseniz
            konu başlığı ve sayfa bağlantısıyla birlikte bize yazabilirsiniz.
          </LegalCallout>
        </LegalSection>

        <LegalSection title="Bize ulaşın">
          <p>
            Düzeltme talepleri, editoryal öneriler, iş birlikleri ve genel sorular için{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> adresini kullanabilirsiniz.
            Kişisel verilerin nasıl işlendiğini öğrenmek için{" "}
            <Link href="/gizlilik-politikasi">Gizlilik Politikası ve KVKK Aydınlatma Metni</Link>
            &rsquo;ni inceleyebilirsiniz.
          </p>
        </LegalSection>
      </LegalPage>
    </>
  );
}


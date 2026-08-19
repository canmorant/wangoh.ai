import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";
import { SITE, absolute } from "@/lib/site";

const title = "Kullanım Koşulları | Wangoh";
const description =
  "Wangoh seyahat içerikleri, haricî bağlantılar, fikrî haklar, reklamlar ve site kullanımına ilişkin koşullar.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absolute("/kullanim-kosullari") },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Site kullanım esasları"
      title="Kullanım Koşulları"
      summary="wangoh.com'u kullanarak aşağıdaki esasları okuduğunuzu kabul etmiş olursunuz. Emredici mevzuattan doğan haklarınız bu koşullarla sınırlandırılmaz."
    >
      <LegalCallout>
        Wangoh bir seyahat acentesi, rezervasyon platformu veya resmî makam değildir. Sitedeki
        içerikler genel bilgilendirme ve seyahat ilhamı amacı taşır.
      </LegalCallout>

      <LegalSection title="1. Hizmetin kapsamı">
        <p>
          Wangoh; destinasyon, rota, ulaşım, konaklama bölgesi, yeme-içme ve seyahat deneyimi
          hakkında editoryal içerik ve keşif araçları sunar. Wangoh üzerinden uçuş, otel, tur,
          restoran, vize veya sigorta rezervasyonu yapılmaz ve ödeme alınmaz.
        </p>
      </LegalSection>

      <LegalSection title="2. Bilgilerin güncelliği ve kişisel sorumluluk">
        <p>
          İçeriklerin doğru ve yararlı olması için makul özen gösterilir; ancak fiyatlar,
          çalışma saatleri, ulaşım tarifeleri, giriş koşulları, vize kuralları, sağlık/güvenlik
          koşulları ve işletme bilgileri hızla değişebilir. Eksiksizlik, kesintisizlik veya
          belirli bir amaca uygunluk garantisi verilmez.
        </p>
        <p>
          Seyahat kararı vermeden, satın alma yapmadan veya özel beslenme/erişilebilirlik
          ihtiyacına güvenmeden önce bilgiyi ilgili havayolu, işletme, konsolosluk, kamu kurumu
          veya başka birincil kaynaktan doğrulamak kullanıcının sorumluluğundadır. Acil durum,
          sağlık, hukuk veya güvenlik tavsiyesi için yetkili uzmana başvurulmalıdır.
        </p>
      </LegalSection>

      <LegalSection title="3. Haricî siteler ve hizmetler">
        <p>
          Sitede harita, resmî kurum, restoran, görsel kaynağı veya başka üçüncü taraf sitelere
          bağlantılar bulunabilir. Bu bağlantılar kolaylık sağlamak içindir; ilgili tarafın
          içeriğini, güvenliğini, fiyatını veya gizlilik uygulamasını onayladığımız anlamına
          gelmez. Üçüncü tarafla kurduğunuz ilişki kendi koşullarına tabidir.
        </p>
      </LegalSection>

      <LegalSection title="4. Fikrî mülkiyet ve izin verilen kullanım">
        <p>
          Wangoh tarafından hazırlanan metinler, özgün düzen, marka unsurları, yazılım ve
          derlemeler üzerindeki haklar Wangoh’a veya ilgili hak sahiplerine aittir. Kaynağı ve
          bağlantıyı belirterek, ticari olmayan kişisel kullanım için kısa alıntı yapılabilir.
          İçeriğin tamamının kopyalanması, otomatik olarak toplu çekilmesi, yeniden yayımlanması,
          satılması veya başka bir hizmetin veritabanına dönüştürülmesi için önceden yazılı izin
          gerekir.
        </p>
        <p>
          Üçüncü taraf görseller ve işaretler kendi lisans ve kullanım koşullarına tabidir.
          Hak sahipliğiyle ilgili bildirimler <a href={`mailto:${SITE.email}`}>{SITE.email}</a>{" "}
          adresine, ilgili sayfa bağlantısı ve hakkı açıklayan bilgiyle gönderilebilir.
        </p>
      </LegalSection>

      <LegalSection title="5. Kabul edilebilir kullanım">
        <p>Siteyi kullanırken aşağıdaki davranışlarda bulunmayın:</p>
        <ul>
          <li>Siteye, sunuculara veya diğer kullanıcılara zarar vermeye çalışma,</li>
          <li>Güvenlik önlemlerini aşma, yetkisiz erişim veya zararlı kod gönderme,</li>
          <li>Yanıltıcı biçimde Wangoh adına hareket ettiğinizi ileri sürme,</li>
          <li>Telif, marka, gizlilik veya diğer üçüncü taraf haklarını ihlal etme,</li>
          <li>Siteyi hukuka aykırı faaliyet amacıyla kullanma.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Reklamlar ve ticari içerikler">
        <p>
          Site, Google AdSense gibi üçüncü taraf sistemler üzerinden reklam gösterebilir.
          Reklamlar, reklamverenin teklif ve hedefleme sistemleri tarafından belirlenebilir;
          Wangoh’un editoryal önerisi sayılmaz. Sponsorlu içerikler ve ücretli iş birlikleri,
          yayımlandığında açıkça işaretlenir.
        </p>
        <p>
          Reklam teknolojilerinin veri kullanımı için <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>{" "}
          ve <Link href="/cerez-politikasi">Çerez Politikası</Link> geçerlidir.
        </p>
      </LegalSection>

      <LegalSection title="7. Sorumluluğun sınırı">
        <p>
          Emredici hukuk kuralları saklı kalmak üzere Wangoh; üçüncü taraf hizmetlerdeki
          değişiklikler, kullanıcının doğrulama yapmadan verdiği kararlar, bağlantılı sitelerin
          eylemleri, cihaz/bağlantı sorunları veya kontrolü dışındaki kesintiler nedeniyle
          oluşan dolaylı zararlardan sorumlu tutulamaz. Bu hüküm, hukuken sınırlandırılamayan
          sorumlulukları ortadan kaldırmaz.
        </p>
      </LegalSection>

      <LegalSection title="8. Gizlilik">
        <p>
          Kişisel verilerin işlenmesi <Link href="/gizlilik-politikasi">Gizlilik Politikası ve KVKK Aydınlatma Metni</Link>
          &rsquo;ne tabidir. Bize e-posta gönderirken gereksiz özel nitelikli veri, parola veya
          ödeme bilgisi paylaşmayın.
        </p>
      </LegalSection>

      <LegalSection title="9. Değişiklik, erişim ve uygulanacak hukuk">
        <p>
          Site içeriği ve bu koşullar, hizmet veya mevzuat değişiklikleri doğrultusunda
          güncellenebilir. Güncel metin bu sayfada yayımlanır. Site bakımı, güvenlik veya mücbir
          sebeplerle hizmet geçici olarak durdurulabilir. Bu koşullar Türkiye Cumhuriyeti
          hukukuna tabidir; uygulanabilir tüketici ve kişisel veri hakları saklıdır.
        </p>
      </LegalSection>

      <LegalSection title="10. İletişim">
        <p>
          Koşullarla ilgili sorularınızı <a href={`mailto:${SITE.email}`}>{SITE.email}</a>{" "}
          adresine gönderebilirsiniz.
        </p>
      </LegalSection>
    </LegalPage>
  );
}


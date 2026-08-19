import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";
import { absolute } from "@/lib/site";

const title = "Çerez Politikası | Wangoh";
const description =
  "Wangoh'ta kullanılan çerezler, localStorage kaydı, olası AdSense reklam teknolojileri ve tercih yönetimi.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absolute("/cerez-politikasi") },
  robots: { index: true, follow: true },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      eyebrow="Tarayıcı depolaması ve tercihler"
      title="Çerez Politikası"
      summary="Bu politika, wangoh.com üzerinde kullanılan çerezleri ve çerez benzeri tarayıcı depolama teknolojilerini; amaç, süre ve kontrol seçenekleriyle birlikte açıklar."
    >
      <LegalCallout>
        Şu anda Wangoh kendi analiz veya pazarlama çerezini yerleştirmez. Bayrak oyunu
        ilerlemesi yalnızca cihazınızdaki localStorage alanında tutulur. Google AdSense
        etkinleştirildiğinde reklam/izin teknolojileri bu metinde açıklanan koşullarla devreye
        girebilir.
      </LegalCallout>

      <LegalSection title="1. Çerez ve benzer teknoloji nedir?">
        <p>
          Çerez, bir internet sitesinin tarayıcıya kaydettiği küçük veri parçasıdır. localStorage
          gibi benzer teknolojiler de tercih veya özellik bilgisini cihazda saklayabilir. Bu
          teknolojiler zorunlu işlevler, kullanıcı tercihleri, performans ölçümü veya reklam gibi
          farklı amaçlarla kullanılabilir.
        </p>
      </LegalSection>

      <LegalSection title="2. Wangoh'un mevcut cihaz içi kaydı">
        <div className="legal-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ad</th>
                <th>Teknoloji / tür</th>
                <th>Amaç</th>
                <th>Süre</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>wangoh.flaggame.v2</td>
                <td>Birinci taraf localStorage / işlevsel</td>
                <td>Bayrak oyunundaki puan, seviye, seri ve öğrenilen bayrakları hatırlamak</td>
                <td>Tarayıcı verisi silinene kadar</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Bu kayıt Wangoh sunucusuna gönderilmez ve farklı sitelerde izleme amacıyla
          kullanılmaz. Oyun özelliğini kullanmanızla bağlantılı, cihaz içi bir tercihtir.
        </p>
      </LegalSection>

      <LegalSection title="3. Barındırma ve güvenlik günlükleri">
        <p>
          Vercel gibi barındırma/CDN sağlayıcıları, sitenin güvenliği ve çalışması için IP
          adresi, istek zamanı, istenen URL ve tarayıcı bilgisi gibi teknik günlükleri
          işleyebilir. Bu günlükler tarayıcınıza Wangoh tarafından yerleştirilen bir çerez
          değildir; ayrıntılar için <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
          &rsquo;na bakabilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="4. Google AdSense etkinleştirildiğinde">
        <p>
          Wangoh reklam yayınlamaya başladığında Google ve yetkili reklam teknolojisi
          sağlayıcıları; reklam sunmak, sıklığı sınırlamak, dolandırıcılığı önlemek, reklam
          performansını ölçmek ve izin tercihlerinizi uygulamak için çerez veya benzer
          tanımlayıcılar kullanabilir. Kullanılan tanımlayıcıların adı ve ömrü Google tarafından
          zaman içinde değiştirilebilir.
        </p>
        <ul>
          <li>
            Gerekli bölge ve durumlarda zorunlu olmayan reklam depolaması, izin tercihi
            alınmadan etkinleştirilmez.
          </li>
          <li>
            Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre ziyaretçileri için Google
            tarafından sertifikalandırılmış bir izin yönetim platformu (CMP) kullanılır.
          </li>
          <li>
            Tercihinize göre kişiselleştirilmiş, kişiselleştirilmemiş veya sınırlı reklamlar
            gösterilebilir.
          </li>
        </ul>
        <p>
          Google’ın reklam verilerini nasıl kullandığı hakkında{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites?hl=tr"
            target="_blank"
            rel="noreferrer"
          >
            Google iş ortağı sitelerinde veri kullanımı
          </a>{" "}
          sayfasından bilgi alabilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="5. Hukuki dayanak ve tercih yönetimi">
        <p>
          Siteyi güvenli biçimde sunmak veya açıkça talep ettiğiniz bir özelliği çalıştırmak
          için kesinlikle gerekli teknolojiler, uygulanabilir mevzuattaki açık rıza dışındaki
          hukuki şartlara dayanabilir. İşlevsel, analitik veya reklam amaçlı zorunlu olmayan
          teknolojiler için açık rıza gereken bölgelerde tercih mekanizması sunulur.
        </p>
        <p>
          AdSense etkinleştirildiğinde izin penceresindeki “seçenekleri yönet” alanından
          tercihinizi ayrıntılandırabilir ve daha sonra sitenin “gizlilik/çerez tercihleri”
          bağlantısı üzerinden değiştirebilirsiniz. İzni geri çekmek, geri çekmeden önceki
          işlemenin hukuka uygunluğunu etkilemez.
        </p>
      </LegalSection>

      <LegalSection title="6. Tarayıcıdan silme ve engelleme">
        <p>
          Tarayıcı ayarlarından çerezleri ve site verilerini görüntüleyebilir, engelleyebilir
          veya silebilirsiniz. Bayrak oyunu ilerlemesini kaldırmak için `wangoh.com` site
          verilerini/localStorage kaydını silebilirsiniz. Tüm depolamayı engellemeniz hâlinde
          bazı tercih özellikleri beklediğiniz gibi çalışmayabilir.
        </p>
        <ul>
          <li>
            <a href="https://support.google.com/chrome/answer/95647?hl=tr" target="_blank" rel="noreferrer">
              Google Chrome çerez ayarları
            </a>
          </li>
          <li>
            <a href="https://support.apple.com/tr-tr/105082" target="_blank" rel="noreferrer">
              Safari çerez ve site verileri
            </a>
          </li>
          <li>
            <a href="https://support.mozilla.org/tr/kb/cerezleri-silme" target="_blank" rel="noreferrer">
              Firefox çerezleri silme
            </a>
          </li>
          <li>
            <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer">
              Google reklam kişiselleştirme ayarları
            </a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Değişiklikler ve iletişim">
        <p>
          Yeni bir analiz, reklam veya tercih teknolojisi eklendiğinde bu tablo ve izin
          mekanizması güncellenir. Sorularınız için <a href="mailto:info@wangoh.com">info@wangoh.com</a>{" "}
          adresinden bize ulaşabilirsiniz.
        </p>
      </LegalSection>
    </LegalPage>
  );
}


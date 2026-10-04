import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/i18n/server";
import { contentSeo } from "@/i18n/seo";
import { legalPageLocales, legalTextLocale } from "@/components/legal/locales";
import CookiesEn from "@/components/legal/en/Cookies";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Corporate.cookies" });
  const title = t("title");
  const description = t("description");
  // Metin Türkçe ve İngilizce; diğer dillerde canonical Türkçe sürüm, noindex.
  const seo = contentSeo("/cerez-politikasi", locale, legalPageLocales());
  return {
    title,
    description,
    alternates: seo.alternates,
    robots: seo.robots ?? { index: true, follow: true },
  };
}

export default async function CookiePolicyPage({ params }: Props) {
  const locale = await resolveLocale(params);
  if (legalTextLocale(locale) === "en") return <CookiesEn />;
  return (
    <LegalPage
      eyebrow="Tarayıcı depolaması ve tercihler"
      title="Çerez Politikası"
      summary="Bu politika, wangoh.com üzerinde kullanılan çerezleri ve çerez benzeri tarayıcı depolama teknolojilerini; amaç, süre ve kontrol seçenekleriyle birlikte açıklar."
    >
      <LegalCallout>
        Analitik ve reklam çerezlerini yalnızca izninizle kullanırız. Google Analytics, analitik
        izni vermediğiniz sürece hiç yüklenmez; reklam çerezleri de izninize bağlıdır. Tercihinizi ilk
        ziyaretinizde sorarız ve sayfanın altındaki &ldquo;Çerez tercihleri&rdquo; bağlantısından
        istediğiniz zaman değiştirebilirsiniz.
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
                <td>wangoh.consent</td>
                <td>Birinci taraf localStorage / zorunlu</td>
                <td>Çerez ve izin tercihinizi ve tercih tarihini hatırlamak</td>
                <td>6 ay; sonra tercih yeniden sorulur</td>
              </tr>
              <tr>
                <td>wangoh.flaggame.v2</td>
                <td>Birinci taraf localStorage / işlevsel</td>
                <td>Bayrak oyunundaki puan, seviye, seri ve öğrenilen bayrakları hatırlamak</td>
                <td>Tarayıcı verisi silinene kadar</td>
              </tr>
              <tr>
                <td>wangoh.origin</td>
                <td>Birinci taraf localStorage / işlevsel</td>
                <td>
                  Uçuş animasyonu ve rota kartları için kendi seçtiğiniz kalkış şehrini hatırlamak.
                  Yalnızca şehri elle seçtiğinizde oluşur.
                </td>
                <td>Tarayıcı verisi silinene kadar</td>
              </tr>
              <tr>
                <td>wangoh.origin.detected</td>
                <td>Birinci taraf sessionStorage / işlevsel</td>
                <td>
                  Bağlantınızdan tespit edilen yaklaşık şehir ve koordinatı, aynı oturumda yeniden
                  sormamak için tutmak
                </td>
                <td>Sekme veya tarayıcı kapanana kadar</td>
              </tr>
              <tr>
                <td>wangoh-shell-v1, wangoh-pages-v1, wangoh-assets-v1</td>
                <td>Birinci taraf service worker önbelleği (Cache Storage) / işlevsel</td>
                <td>
                  Ziyaret ettiğiniz sayfaları ve görselleri, internet bağlantısı yokken de
                  açılabilmeleri için cihazınızda saklamak
                </td>
                <td>Tarayıcı verisi silinene veya önbellek sürümü yenilenene kadar</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Bu kayıtlar Wangoh sunucusuna gönderilmez ve farklı sitelerde izleme amacıyla
          kullanılmaz. İlgili özelliği kullanmanızla bağlantılı, cihaz içi tercihlerdir.
        </p>
      </LegalSection>

      <LegalSection title="3. Ziyaretçi ölçümü">
        <p>
          Vercel Web Analytics; görüntülenen sayfaları, yönlendiren kaynağı, yaklaşık ülkeyi,
          cihazı, işletim sistemini ve tarayıcı türünü toplu istatistikler hâlinde ölçer. Bu
          özellik çerez kullanmaz, farklı sitelerde izleme yapmaz ve Wangoh&rsquo;a ziyaretçiyi
          doğrudan tanımlayan bir profil sunmaz.
        </p>
        <p>
          Google Analytics 4 yalnızca &ldquo;Analitik&rdquo; iznini verdiğinizde yüklenir.
          Görüntülenen sayfaları, site içi etkileşimleri, yaklaşık konumu, cihaz ve tarayıcı
          bilgisini ölçmek için aşağıdaki birinci taraf çerezleri kullanır. İzni geri aldığınızda
          Google Analytics veri göndermeyi hemen durdurur, bu çerezler silinir ve sonraki
          ziyaretlerinizde yüklenmez.
        </p>
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
                <td>_ga</td>
                <td>Google Analytics çerezi / analitik</td>
                <td>Ziyaretçileri birbirinden ayırt etmek</td>
                <td>2 yıla kadar</td>
              </tr>
              <tr>
                <td>_ga_QJSHGD467K</td>
                <td>Google Analytics çerezi / analitik</td>
                <td>Oturum durumunu sürdürmek</td>
                <td>2 yıla kadar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="4. Barındırma ve güvenlik günlükleri">
        <p>
          Vercel gibi barındırma/CDN sağlayıcıları, sitenin güvenliği ve çalışması için IP
          adresi, istek zamanı, istenen URL ve tarayıcı bilgisi gibi teknik günlükleri
          işleyebilir. Bu günlükler tarayıcınıza Wangoh tarafından yerleştirilen bir çerez
          değildir; ayrıntılar için <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
          &rsquo;na bakabilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="5. Google AdSense reklamları">
        <p>
          Wangoh sayfalarında Google AdSense reklam betiği bulunur. Google ve yetkili reklam
          teknolojisi sağlayıcıları; reklam sunmak, sıklığı sınırlamak, dolandırıcılığı önlemek, reklam
          performansını ölçmek ve izin tercihlerinizi uygulamak için çerez veya benzer
          tanımlayıcılar kullanabilir. Kullanılan tanımlayıcıların adı ve ömrü Google tarafından
          zaman içinde değiştirilebilir.
        </p>
        <ul>
          <li>
            Reklam iznini vermediğiniz sürece Google&rsquo;a (Consent Mode ile) reklam depolamasının
            reddedildiği bildirilir; reklam çerezleri kullanılmadan kişiselleştirilmemiş veya
            sınırlı reklamlar gösterilebilir.
          </li>
          <li>Reklam iznini verirseniz reklamlar ilgi alanlarınıza göre kişiselleştirilebilir.</li>
          <li>
            Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre&rsquo;deki ziyaretçilere reklamlar
            için ayrıca Google&rsquo;ın sertifikalı izin yönetim platformu (Google Gizlilik ve
            Mesajlaşma) üzerinden bir izin mesajı gösterilir.
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

      <LegalSection title="6. Hukuki dayanak ve tercih yönetimi">
        <p>
          Siteyi güvenli biçimde sunmak veya açıkça talep ettiğiniz bir özelliği çalıştırmak
          için kesinlikle gerekli teknolojiler, uygulanabilir mevzuattaki açık rıza dışındaki
          hukuki şartlara dayanabilir. Analitik ve reklam amaçlı çerezler yalnızca açık
          rızanızla kullanılır; reklam izni yoksa reklamlar reklam çerezleri olmadan, sınırlı
          biçimde sunulur.
        </p>
        <p>
          Tercihinizi ilk ziyarette açılan izin penceresinden verebilir, &ldquo;Tercihleri
          yönet&rdquo; ile kategori bazında seçebilir ve sayfanın altındaki &ldquo;Çerez
          tercihleri&rdquo; bağlantısıyla istediğiniz zaman değiştirebilirsiniz. Tercihiniz
          cihazınızda 6 ay saklanır, ardından yeniden sorulur. İzni geri çekmek, geri çekmeden
          önceki işlemenin hukuka uygunluğunu etkilemez.
        </p>
      </LegalSection>

      <LegalSection title="7. Tarayıcıdan silme ve engelleme">
        <p>
          Tarayıcı ayarlarından çerezleri ve site verilerini görüntüleyebilir, engelleyebilir
          veya silebilirsiniz. wangoh.com site verilerini sildiğinizde bayrak oyunu ilerlemesi,
          kalkış şehri tercihi, izin kaydı ve çevrimdışı sayfa önbelleği de kaldırılır. Tüm
          depolamayı engellemeniz hâlinde bazı tercih özellikleri beklediğiniz gibi
          çalışmayabilir.
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
            <a href="https://myadcenter.google.com/?hl=tr" target="_blank" rel="noreferrer">
              Google Reklam Merkezim (reklam kişiselleştirme ayarları)
            </a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Değişiklikler ve iletişim">
        <p>
          Yeni bir analiz, reklam veya tercih teknolojisi eklendiğinde bu tablo ve izin
          mekanizması güncellenir. Sorularınız için <a href="mailto:info@wangoh.com">info@wangoh.com</a>{" "}
          adresinden bize ulaşabilirsiniz.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

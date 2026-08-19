import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";
import { SITE, absolute } from "@/lib/site";

const title = "Gizlilik Politikası ve KVKK Aydınlatma Metni | Wangoh";
const description =
  "Wangoh'un kişisel veri işleme faaliyetleri, hukuki sebepleri, veri aktarımı, saklama süreleri ve KVKK kapsamındaki haklarınız.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absolute("/gizlilik-politikasi") },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Kişisel verilerin korunması"
      title="Gizlilik Politikası ve KVKK Aydınlatma Metni"
      summary="Bu metin, wangoh.com ziyaretçilerine ve bizimle iletişime geçen kişilere ait verilerin hangi durumlarda, hangi amaçlarla ve hangi hukuki sebeplerle işlendiğini açıklar."
    >
      <LegalCallout>
        <strong>Veri sorumlusu:</strong> {SITE.operator} (“Wangoh”)
        <br />
        <strong>İletişim:</strong>{" "}
        <a href={`mailto:${SITE.email}`} className="text-[var(--gold)]/90">
          {SITE.email}
        </a>
      </LegalCallout>

      <LegalSection title="1. Kapsam">
        <p>
          Bu aydınlatma metni; siteyi ziyaret etmeniz, sitedeki haricî bağlantıları kullanmanız
          veya e-posta üzerinden Wangoh ile iletişim kurmanız sırasında gerçekleşebilecek
          kişisel veri işleme faaliyetlerini kapsar. Wangoh üyelik sistemi, kullanıcı hesabı,
          çevrim içi ödeme veya iletişim formu işletmez.
        </p>
      </LegalSection>

      <LegalSection title="2. İşlenen veri kategorileri">
        <ul>
          <li>
            <strong>İletişim verileri:</strong> Bize e-posta gönderdiğinizde e-posta adresiniz,
            adınız veya imzanız, mesaj içeriği ve bilerek eklediğiniz dosyalar.
          </li>
          <li>
            <strong>İşlem güvenliği ve teknik kayıtlar:</strong> Barındırma ve güvenlik
            sağlayıcılarının sunucu/CDN günlüklerinde işleyebileceği IP adresi, istek zamanı,
            istenen sayfa, tarayıcı/cihaz bilgisi, hata ve güvenlik sinyalleri.
          </li>
          <li>
            <strong>Cihaz içi oyun verisi:</strong> Bayrak oyunundaki puan, seviye, seri ve
            öğrenilen bayrak bilgileri yalnızca tarayıcınızdaki localStorage alanında tutulur.
            Bu kayıt Wangoh sunucularına gönderilmez.
          </li>
          <li>
            <strong>Reklam ve izin verileri:</strong> Google AdSense etkinleştirildiğinde,
            tercihinize ve bulunduğunuz bölgedeki kurallara bağlı olarak çerez/benzer
            tanımlayıcılar, izin sinyalleri ve reklam etkileşimleri Google tarafından işlenebilir.
          </li>
        </ul>
        <p>
          Wangoh sizden özel nitelikli kişisel veri talep etmez. Böyle bir bilgiyi e-posta ile
          göndermemenizi rica ederiz.
        </p>
      </LegalSection>

      <LegalSection title="3. İşleme amaçları">
        <ul>
          <li>İletişim taleplerini yanıtlamak ve editoryal düzeltmeleri değerlendirmek,</li>
          <li>Siteyi güvenli, hızlı ve erişilebilir biçimde sunmak; hataları gidermek,</li>
          <li>Kötüye kullanım, yetkisiz erişim ve güvenlik olaylarını önlemek,</li>
          <li>Hukuki yükümlülükleri yerine getirmek ve hakları tesis, kullanma veya korumak,</li>
          <li>Açık tercih/izin bulunması hâlinde reklam sunmak ve izin kayıtlarını yönetmek.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Toplama yöntemleri ve hukuki sebepler">
        <p>
          Veriler; e-posta yoluyla doğrudan sizden, siteye gönderilen teknik istekler üzerinden
          otomatik olarak, cihaz içi depolama aracılığıyla veya AdSense etkin olduğunda Google
          reklam/izin teknolojileri vasıtasıyla elektronik ortamda toplanabilir.
        </p>
        <p>
          İşleme faaliyetleri, niteliğine göre 6698 sayılı Kişisel Verilerin Korunması
          Kanunu’nun 5. maddesindeki <strong>hukuki yükümlülük</strong>,{" "}
          <strong>bir hakkın tesisi, kullanılması veya korunması</strong> ve temel haklarınıza
          zarar vermemek kaydıyla <strong>meşru menfaat</strong> şartlarına dayanır. Kanun veya
          ilgili bölge kuralları açık rıza gerektiriyorsa, reklam ve zorunlu olmayan depolama
          faaliyetleri yalnızca ayrı ve bilgilendirilmiş tercihiniz üzerine yürütülür.
        </p>
      </LegalSection>

      <LegalSection title="5. Verilerin aktarılabileceği alıcı grupları">
        <p>Veriler, yalnızca ilgili amaç için gerekli olduğu ölçüde şu gruplarla paylaşılabilir:</p>
        <ul>
          <li>Barındırma, CDN, güvenlik ve teknik altyapı hizmeti sağlayıcıları (Vercel gibi),</li>
          <li>E-posta barındırma ve iletişim hizmeti sağlayıcıları,</li>
          <li>
            Kaynak yalnızca gerektiğinde tarayıcıdan çağrılan içerik/CDN sağlayıcıları
            (örneğin Unsplash, Wikimedia veya jsDelivr),
          </li>
          <li>
            AdSense etkinleştirildiğinde ve gerekli izin sağlandığında Google ile ilgili reklam
            teknolojisi sağlayıcıları,
          </li>
          <li>Kanunen yetkili kamu kurumları, yargı mercileri ve hukuk danışmanları.</li>
        </ul>
        <p>
          Bazı teknik hizmet sağlayıcıları yurt dışında bulunabilir veya veriyi yurt dışındaki
          altyapıda işleyebilir. Böyle bir aktarım, uygulanabilir mevzuatın öngördüğü aktarım
          mekanizmaları ve gerekli güvenceler çerçevesinde sınırlandırılır.
        </p>
      </LegalSection>

      <LegalSection title="6. Saklama süreleri">
        <p>
          İletişim kayıtları, talebin sonuçlandırılması ve olası uyuşmazlıkların takibi için
          gerekli süre boyunca; teknik günlükler ise güvenlik, hata giderme ve sağlayıcı
          ayarlarının gerektirdiği sınırlı süre boyunca tutulur. Yasal zorunluluk sona erdiğinde
          ve işleme amacı kalmadığında veriler silinir, yok edilir veya anonim hâle getirilir.
        </p>
        <p>
          Bayrak oyunu kaydı, siz tarayıcı verilerini silene kadar cihazınızda kalır. Reklam
          teknolojilerinin saklama süreleri, izin tercihinize ve ilgili sağlayıcının politikasına
          göre değişebilir.
        </p>
      </LegalSection>

      <LegalSection title="7. Veri güvenliği">
        <p>
          Site HTTPS üzerinden sunulur; idari ve teknik erişim sınırları, güvenlik başlıkları ve
          güncel yazılım bileşenleri kullanılır. Bununla birlikte internet üzerinden hiçbir
          aktarım yönteminin mutlak güvenlik sağlayamayacağını hatırlatırız. Şüpheli bir durum
          fark ederseniz bize bildirebilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="8. KVKK kapsamındaki haklarınız">
        <p>6698 sayılı Kanun’un 11. maddesi uyarınca, şartları oluştuğunda:</p>
        <ul>
          <li>Kişisel verinizin işlenip işlenmediğini öğrenme,</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
          <li>İşleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
          <li>Eksik veya yanlış işlenen verinin düzeltilmesini isteme,</li>
          <li>Kanundaki şartlarla silinmesini veya yok edilmesini isteme,</li>
          <li>Düzeltme/silme işlemlerinin verinin aktarıldığı kişilere bildirilmesini isteme,</li>
          <li>Otomatik analiz sonucu aleyhinize bir sonuca itiraz etme,</li>
          <li>Kanuna aykırı işleme nedeniyle zarara uğrarsanız giderim talep etme</li>
        </ul>
        <p>
          haklarına sahipsiniz. Talebinizi <a href={`mailto:${SITE.email}`}>{SITE.email}</a>{" "}
          adresine iletebilirsiniz. Başvurunun size ait olduğunu doğrulamak ve doğru yanıt
          verebilmek için makul ek bilgi istenebilir. Başvurular, uygulanabilir mevzuattaki usul
          ve süreler içinde değerlendirilir.
        </p>
      </LegalSection>

      <LegalSection title="9. Çocukların gizliliği">
        <p>
          Site özellikle çocuklara yönelik bir hizmet değildir ve çocuklardan bilerek kişisel
          veri toplamayı amaçlamaz. Bir çocuğa ait verinin izinsiz paylaşıldığını düşünüyorsanız
          silme değerlendirmesi için bize ulaşabilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="10. Haricî bağlantılar ve politika değişiklikleri">
        <p>
          Wangoh, üçüncü taraf sitelere bağlantı verebilir. Bu sitelerin kendi gizlilik
          uygulamalarından Wangoh sorumlu değildir; bağlantıyı açmadan önce ilgili politikaları
          incelemenizi öneririz. Bu metin, hizmetler veya mevzuat değiştiğinde güncellenebilir;
          güncel sürüm bu sayfada yayımlanır.
        </p>
        <p>
          Cihaz depolaması ve reklam teknolojileri hakkında daha ayrıntılı bilgi için{" "}
          <Link href="/cerez-politikasi">Çerez Politikası</Link>&rsquo;nı inceleyin.
        </p>
      </LegalSection>
    </LegalPage>
  );
}


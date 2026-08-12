/**
 * Yapısal veri. Sadece sayfada gerçekten görünen içeriği tanımlar —
 * arama motoru yönergeleri, şemanın sayfadaki içerikle birebir örtüşmesini
 * şart koşuyor.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // İçerik kendi verimizden geliyor; kullanıcı girdisi yok.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

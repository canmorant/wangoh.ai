import { creditFor } from "@/data/imageCredits";

/**
 * Sayfada kullanılan görsellerin atıfları.
 *
 * Wikimedia Commons görsellerinin büyük çoğunluğu CC BY veya CC BY-SA
 * lisanslı ve bu lisanslar yazar adı ile lisans bağlantısının gösterilmesini
 * zorunlu kılıyor. Atfı her görselin üstüne bindirmek tasarımı bozardı;
 * sayfa sonunda toplu ve okunabilir bir blok hem lisansı karşılıyor hem
 * görsellerin önüne geçmiyor.
 *
 * CC0 ve kamu malı görseller atıf istemiyor, o yüzden listelenmiyorlar.
 */
export default function ImageCredits({ images }: { images: string[] }) {
  const credits = Array.from(new Set(images))
    .map(creditFor)
    .filter((c): c is NonNullable<typeof c> => !!c && c.attributionRequired);

  if (credits.length === 0) return null;

  return (
    <section aria-labelledby="gorsel-atiflari" className="mt-20 border-t border-white/[0.08] pt-8">
      <h2
        id="gorsel-atiflari"
        className="text-[9.5px] tracking-[0.24em] text-white/35 uppercase"
      >
        Görsel atıfları
      </h2>
      <ul className="mt-4 space-y-1.5">
        {credits.map((c) => (
          <li key={c.file} className="text-[11.5px] leading-relaxed text-white/35">
            {c.artist ? `${c.artist} · ` : ""}
            <a
              href={c.sourceUrl}
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="underline decoration-white/20 underline-offset-2 transition-colors hover:text-white/60"
            >
              kaynak
            </a>
            {c.licenseName && (
              <>
                {" · "}
                {c.licenseUrl ? (
                  <a
                    href={c.licenseUrl}
                    rel="noopener noreferrer nofollow license"
                    target="_blank"
                    className="underline decoration-white/20 underline-offset-2 transition-colors hover:text-white/60"
                  >
                    {c.licenseName}
                  </a>
                ) : (
                  c.licenseName
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

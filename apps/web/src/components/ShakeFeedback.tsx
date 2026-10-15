"use client";

import { useScrollShake } from "@/hooks/useScrollShake";

/**
 * Gizli rotanın "salla" hareketi ve onu tanıdığını gösteren kenar parıltısı.
 *
 * Ayrı bileşen, çünkü `charge` her yön değişiminde ve sönerken ~220 ms'de bir
 * değişiyor. Eskiden HomeExperience içindeydi ve her değişim bütün ana sayfayı
 * (kahraman sahnesi, biniş kartları, rehber listesi) yeniden çizdiriyordu;
 * telefonda aşağı-yukarı kaydırırken takılmanın bir sebebi buydu. Artık
 * yalnız bu küçük bileşen güncelleniyor.
 *
 * Parıltının gölgesi sabit; değişen tek şey opaklık. Böylece büyük bulanık
 * gölge bir kez çizilip ekran kartında söndürülüyor, her adımda yeniden
 * hesaplanmıyor. Görünmezken visibility:hidden — tam ekran saydam bir katman
 * her karede birleştirilmesin.
 */
export default function ShakeFeedback({
  enabled,
  onShake,
}: {
  enabled: boolean;
  onShake: () => void;
}) {
  const charge = useScrollShake(onShake, { enabled });
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] transition-[opacity,visibility] duration-200"
      style={{
        opacity: charge,
        visibility: charge > 0 ? "visible" : "hidden",
        boxShadow: "inset 0 0 140px 32px rgba(120,190,255,0.16)",
      }}
    />
  );
}

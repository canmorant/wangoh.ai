"use client";

import { useEffect, useRef } from "react";
import { useFormatter, useTranslations } from "next-intl";
import {
  CAMERA,
  clamp01,
  dollyScale,
  focus,
  progress,
  pulse,
  scaleToClear,
  smooth,
  worldScale,
} from "@/lib/camera";
import { HERO_PLATE, HERO_PLATE_SOFT } from "@/lib/heroPlate";

/**
 * Telefon ve tabletlerin "pencereden içeri gir" sahnesi.
 *
 * Masaüstündeki CinematicHero ile aynı hikâye ve aynı kamera matematiği
 * (@/lib/camera), ama kaydırma sırasında tarayıcıya hiçbir şeyi yeniden
 * çizdirmeyecek biçimde kurulu. Her karede yalnız transform (büyütme) ve
 * opacity değişiyor; ikisini de ekran kartı hazır katmanlar üzerinde yapıyor:
 *
 *   - Pencere çerçevesi maskeli bir SVG değil, cam açıklığının çevresine
 *     box-shadow halkalarıyla çizilmiş tek bir kutu (.hero-window). SVG'nin
 *     transform özniteliğini değiştirmek iPhone'da her karede tam ekran
 *     yeniden çizim demekti; asıl takılma buydu.
 *   - Odak geçişi CSS filter: blur() ile değil, önceden bulanıklaştırılmış
 *     küçük bir kopyanın söndürülmesiyle (HERO_PLATE_SOFT).
 *   - Bulut, gren, karışım modları ve perde yok.
 *
 * Sunucuda da çiziliyor (yer tutucu yok): ilk kare fotoğraf + pencere olarak
 * HTML'de geliyor, JS yalnızca kaydırma dinleyicisini bağlıyor. Masaüstünde
 * CinematicHero yüklenene kadar da bu sahne görünüyor.
 */
export default function WindowHero() {
  const t = useTranslations("Hero");
  const format = useFormatter();
  const stageRef = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const softRef = useRef<HTMLImageElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const cabinRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const arriveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const view = viewRef.current;
    if (!stage || !view) return;

    // Çerçevenin kadrajı tamamen terk ettiği ölçek; en-boy oranına bağlı.
    // .hero-window'daki --gw formülüyle aynı: min(332px, 60vw, 44svh).
    let maxScale = 3;
    let viewH = 0;
    const measure = () => {
      const w = Math.max(320, view.clientWidth);
      const h = Math.max(480, view.clientHeight);
      viewH = h;
      const glassW = Math.min(332, w * 0.6, h * 0.44);
      maxScale =
        scaleToClear({
          w,
          h,
          cx: w / 2,
          cy: h / 2,
          glassW,
          glassH: glassW / 0.74,
          bez: glassW * 0.155,
          lip: glassW * 0.052,
        }) * CAMERA.clearMargin;
    };

    const render = (p: number) => {
      const q = progress(p);
      const cabin = cabinRef.current;
      if (cabin) {
        cabin.style.transform = `translate3d(-50%,-50%,0) scale(${dollyScale(q, maxScale)})`;
      }
      if (worldRef.current) {
        worldRef.current.style.transform = `translate3d(0,0,0) scale(${worldScale(q)})`;
      }
      if (softRef.current) softRef.current.style.opacity = String(focus(q).far);
      if (hazeRef.current) {
        hazeRef.current.style.opacity = String(0.05 + 0.55 * (1 - smooth(0.02, 0.86, q)));
      }
      if (bloomRef.current) bloomRef.current.style.opacity = String(0.3 * pulse(q, 0.55, 0.8, 0.99));
      if (glassRef.current) glassRef.current.style.opacity = String(1 - smooth(0.55, 0.85, q));

      const introOut = smooth(0.01, 0.13, p);
      if (introRef.current) {
        introRef.current.style.opacity = String(1 - introOut);
        introRef.current.style.transform = `translate3d(0,${-34 * introOut}px,0)`;
      }
      const arrive = smooth(0.87, 0.98, p);
      if (arriveRef.current) {
        arriveRef.current.style.opacity = String(arrive);
        arriveRef.current.style.transform = `translate3d(0,${30 * (1 - arrive)}px,0)`;
      }
    };

    // Yapışkan kutunun sabit kaldığı mesafe üzerinden 0 → 1. Kutu 100svh;
    // window.innerHeight telefonda adres çubuğuyla oynadığı için kullanılmıyor.
    const readProgress = () => {
      const rect = stage.getBoundingClientRect();
      const travel = rect.height - viewH;
      return travel <= 0 ? 0 : clamp01(-rect.top / travel);
    };

    let frame = 0;
    let last = -1;
    const update = () => {
      frame = 0;
      const p = readProgress();
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      render(p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      last = -1;
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={stageRef}
      className="relative h-[265svh] bg-[#0b0d12] sm:h-[310vh]"
      aria-label={t("regionLabel")}
    >
      <div ref={viewRef} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* ---------- camın ötesi ---------- */}
        <div ref={worldRef} className="hero-layer absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- önceden
              optimize edilmiş AVIF; next/image burada yalnızca sarmalayıcı ekler */}
          <img
            src={HERO_PLATE}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[center_62%]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- satır içi küçük veri */}
          <img
            ref={softRef}
            src={HERO_PLATE_SOFT}
            alt=""
            className="hero-fade absolute inset-0 h-full w-full object-cover object-[center_62%]"
          />
          {/* ufukta soğuk hava perspektifi, alt ve üstte kontrast */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,22,0.42)_0%,rgba(150,178,205,0.06)_26%,transparent_52%,rgba(6,9,16,0.72)_100%)]" />
          <div
            ref={hazeRef}
            className="hero-fade absolute inset-0 bg-[linear-gradient(180deg,rgba(214,228,242,0.34)_0%,rgba(216,229,242,0.18)_34%,rgba(238,231,219,0.11)_68%,rgba(240,230,214,0.06)_100%)]"
            style={{ opacity: 0.6 }}
          />
        </div>

        {/* camdan geçerken kısa bir ışık */}
        <div
          ref={bloomRef}
          className="hero-fade absolute inset-0 bg-[radial-gradient(ellipse_62%_52%_at_50%_50%,rgba(255,246,232,0.95)_0%,rgba(255,236,210,0.4)_38%,transparent_72%)]"
          style={{ opacity: 0 }}
        />

        {/* ---------- kabin: duvar, çerçeve ve cam tek kutuda ---------- */}
        <div
          ref={cabinRef}
          aria-hidden
          className="hero-window hero-layer absolute left-1/2 top-1/2"
          style={{ transform: "translate3d(-50%,-50%,0) scale(1)" }}
        >
          <div ref={glassRef} className="hero-glass hero-fade absolute inset-0" />
        </div>

        <div className="pointer-events-none absolute inset-0 hero-vignette" />

        {/* ---------- açılış başlığı ---------- */}
        <div
          ref={introRef}
          className="hero-fade absolute bottom-0 left-0 z-10 max-w-[min(560px,88vw)] px-5 pb-[calc(2rem_+_env(safe-area-inset-bottom))] sm:px-10 sm:pb-16"
        >
          <p className="font-display text-[clamp(2.2rem,11vw,4.9rem)] leading-[0.94] text-white">
            <span className="block italic font-light text-white/95">{t("titleLine1")}</span>
            <span className="block">{t("titleLine2")}</span>
            <span className="block">{t("titleLine3")}</span>
          </p>
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/55 sm:mt-6 sm:text-[14px]">
            {t("subtitle")}
          </p>
        </div>

        {/* ---------- varış ---------- */}
        <div
          ref={arriveRef}
          className="hero-fade pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-[calc(2.5rem_+_env(safe-area-inset-bottom))] text-center sm:px-6 sm:pb-20"
          style={{ opacity: 0 }}
        >
          <p className="text-[11px] tracking-[0.42em] text-white/55 uppercase">{t("landing")}</p>
          <p className="font-display mt-3 text-[clamp(2.8rem,8vw,6rem)] leading-[0.95] text-white">
            <span className="italic font-light">Central</span> Park
          </p>
          <p className="mt-3 text-[13px] tracking-[0.16em] text-white/50 uppercase">
            New York &middot; {format.number(40.7829, { maximumFractionDigits: 4 })}&deg; {t("north")}
          </p>
        </div>
      </div>
    </section>
  );
}

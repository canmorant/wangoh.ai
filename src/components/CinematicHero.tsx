"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WindowShade, { SHADE_CONFIG } from "./WindowShade";
import {
  CAMERA,
  clamp01,
  type Dims,
  dollyScale,
  focus,
  progress,
  pulse,
  scaleToClear,
  smooth,
  worldScale,
} from "@/lib/camera";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ------------------------------------------------------------------ *
 *  Motion model
 *
 *  The whole sequence is driven by one scalar `p` (0 → 1). Everything
 *  else is a pure function of it, so the scene can never desync.
 *
 *  The maths lives in `@/lib/camera` so it can be verified in Node
 *  against the five storyboard stages — `npx tsx scripts/camera.test.ts`.
 *
 *  `p` is smoothed by ScrollTrigger's scrub, which is itself fed by
 *  Lenis — two stages of inertia. That is what makes it feel like a
 *  camera on a dolly instead of a value bound to a scrollbar.
 * ------------------------------------------------------------------ */

/**
 * The destination plate. A genuine Central Park aerial — the park's green mass,
 * the reservoir and Manhattan wrapping around it, with real atmospheric haze
 * toward the horizon. Requested at 3200px because by the end of the sequence it
 * fills the whole viewport and any softness would read as a low-quality asset.
 */
const PLATE =
  "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=3200&q=88&auto=format&fit=crop";

function measure(): Dims {
  // Floor the viewport: a hidden iframe, a display:none ancestor, or certain
  // mobile chrome transitions can report 0 here, which would otherwise produce
  // a zero-size viewBox and a scene with no geometry that never recovers.
  const w = Math.max(320, typeof window !== "undefined" ? window.innerWidth : 390);
  const h = Math.max(480, typeof window !== "undefined" ? window.innerHeight : 844);
  // The window reads as a portrait rounded-rect, sized to leave generous air
  // around it on every viewport. Never wider than 62vw, never taller than 62vh.
  const glassW = Math.min(332, w * 0.6, h * 0.44);
  const glassH = glassW / 0.74;
  return {
    w,
    h,
    cx: w / 2,
    cy: h / 2,
    glassW,
    glassH,
    bez: glassW * 0.155,
    lip: glassW * 0.052,
  };
}

/** Centred rounded-rect grown outward from the glass opening by `pad`. */
function ring(d: Dims, pad: number) {
  const w = d.glassW + pad * 2;
  const h = d.glassH + pad * 2;
  return {
    x: d.cx - w / 2,
    y: d.cy - h / 2,
    width: w,
    height: h,
    rx: w * 0.42,
    ry: w * 0.42,
  };
}

export default function CinematicHero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // world (behind the glass)
  const worldRef = useRef<HTMLDivElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const cityMidRef = useRef<HTMLDivElement>(null);
  const cloudNearRef = useRef<HTMLDivElement>(null);
  const cloudMidRef = useRef<HTMLDivElement>(null);
  const cloudFarRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);

  // cabin (the SVG camera rig)
  const camRef = useRef<SVGGElement>(null);
  const glassFxRef = useRef<SVGGElement>(null);
  const shadeGroupRef = useRef<SVGGElement>(null);
  const cabinRef = useRef<SVGGElement>(null);

  // parallax wrappers
  const worldTiltRef = useRef<HTMLDivElement>(null);
  const cabinTiltRef = useRef<HTMLDivElement>(null);

  // ui
  const introRef = useRef<HTMLDivElement>(null);
  const arriveRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  const [dims, setDims] = useState<Dims | null>(() => {
    if (typeof window !== "undefined") return measure();
    return null;
  });

  // Live camera scale, read by the shade so pointer travel maps 1:1 to shade
  // travel no matter how far the dolly has pushed in.
  const camScale = useRef(1);
  // Outside-light dimming driven by the shade, applied to the world layer.
  const shadeRef = useRef<HTMLDivElement>(null);
  const cabinLightRef = useRef<HTMLDivElement>(null);

  // Scroll and shade both want a say in the glass reflections. Rather than
  // letting them overwrite each other, each keeps its own factor and the two
  // are multiplied — the systems stay independent and compose.
  const shadeVal = useRef(0);
  const glassFromScroll = useRef(1);

  const applyGlass = useCallback(() => {
    if (glassFxRef.current) {
      glassFxRef.current.style.opacity = String(
        glassFromScroll.current * (1 - shadeVal.current * 0.75)
      );
    }
  }, []);

  const onShade = useCallback(
    (v: number) => {
      // Clamped: the panel may overshoot its limits slightly while dragging.
      const t = Math.max(0, Math.min(1, v));
      shadeVal.current = t;
      if (shadeRef.current) {
        shadeRef.current.style.opacity = String(t * SHADE_CONFIG.maxBlackout);
      }
      if (cabinLightRef.current) {
        cabinLightRef.current.style.opacity = String(1 - t * 0.85);
      }
      applyGlass();
    },
    [applyGlass]
  );

  useLayoutEffect(() => {
    // Measured synchronously, before the browser paints. Deferring this to a
    // rAF meant the window did not exist on the first frame — a visible pop on
    // load, and nothing at all wherever rAF is throttled.
    const remeasure = () => {
      const next = measure();
      // Only re-render when the viewport genuinely changed size; ResizeObserver
      // is chatty and identical dims would loop.
      setDims((prev) => (prev && prev.w === next.w && prev.h === next.h ? prev : next));
      ScrollTrigger.refresh();
    };

    remeasure();

    // A ResizeObserver rather than the resize event alone. `measure()` floors
    // the viewport at 320x480 to survive being called before layout exists, but
    // that floor would then be frozen in forever, because a viewport that
    // reports 0 and then becomes real never fires a window resize event. The
    // observer catches that first real measurement — and needs no rAF to do it.
    const ro = new ResizeObserver(remeasure);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", remeasure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  /* ---------------- scroll-driven camera ---------------- */
  useEffect(() => {
    if (!dims) return;

    const ctx = gsap.context(() => {
      // How far the dolly must travel for this particular viewport.
      const maxScale = scaleToClear(dims) * CAMERA.clearMargin;

      /**
       * The window frame's scale — the one thing this whole sequence exists to
       * do — is written straight onto the SVG transform attribute.
       *
       * This is the matrix for "scale by s about the viewport centre", so the
       * bezel, the opening and the world stay perfectly concentric while the
       * frame grows outward past the screen edges. Writing it directly means
       * the frame's size is a plain function of scroll position with no
       * animation library between the two.
       */
      const camEl = camRef.current;
      const setCam = (s: number) => {
        camEl?.setAttribute(
          "transform",
          `matrix(${s},0,0,${s},${dims.cx * (1 - s)},${dims.cy * (1 - s)})`
        );
      };
      const setCabinOp = gsap.quickSetter(cabinRef.current, "opacity");
      const setShadeOp = gsap.quickSetter(shadeGroupRef.current, "opacity");
      const setWorld = gsap.quickSetter(worldRef.current, "scale");
      // Focus stack: the blurriest layer sits on top, so fading it out reveals
      // the sharper one beneath. Two opacities give a continuous pull-to-focus.
      const setCityFarOp = gsap.quickSetter(cityRef.current, "opacity");
      const setCityMidOp = gsap.quickSetter(cityMidRef.current, "opacity");
      const setHazeOp = gsap.quickSetter(hazeRef.current, "opacity");
      const setBloomOp = gsap.quickSetter(bloomRef.current, "opacity");

      const clouds = [
        { set: gsap.quickSetter(cloudFarRef.current, "scale"), op: gsap.quickSetter(cloudFarRef.current, "opacity"), rush: 1.4, out: 0.62 },
        { set: gsap.quickSetter(cloudMidRef.current, "scale"), op: gsap.quickSetter(cloudMidRef.current, "opacity"), rush: 2.3, out: 0.5 },
        { set: gsap.quickSetter(cloudNearRef.current, "scale"), op: gsap.quickSetter(cloudNearRef.current, "opacity"), rush: 3.6, out: 0.38 },
      ];

      const setIntroOp = gsap.quickSetter(introRef.current, "opacity");
      const setIntroY = gsap.quickSetter(introRef.current, "y", "px");
      const setCueOp = gsap.quickSetter(cueRef.current, "opacity");
      const setArriveOp = gsap.quickSetter(arriveRef.current, "opacity");
      const setArriveY = gsap.quickSetter(arriveRef.current, "y", "px");

      const render = (p: number) => {
        const q = progress(p);

        // ---- CAMERA ----------------------------------------------------
        // Pure forward dolly. The window is the frame and it stays put; only
        // the camera's distance to it changes.
        //
        // A previous version also translated the rig downward, which is what
        // made the whole window appear to slide down the page instead of the
        // viewer moving toward it. Depth alone carries the motion now.
        //
        // The curve is the perspective law 1/(d0 - vt): gentle at first, then
        // accelerating hard as the glass approaches. Its predecessor was
        // front-loaded, so the frame ballooned on the first flick of scroll and
        // then crawled — which reads as the window inflating, not as flying
        // into it. See scripts/camera.test.ts.
        const cam = dollyScale(q, maxScale);
        setCam(cam);
        camScale.current = cam;

        // The far world magnifies far more slowly than the near frame — same
        // law, much greater distance. That ratio between the two is the entire
        // sensation of depth.
        setWorld(worldScale(q));

        // ---- CLARITY ---------------------------------------------------
        // Central Park is on screen from p=0; only its focus changes. The two
        // ranges overlap so there is never a step between them.
        const f = focus(q);
        setCityFarOp(f.far);
        setCityMidOp(f.mid);

        // Atmosphere thins as the camera descends, but never fully clears —
        // a little haze at altitude is what keeps it believable.
        setHazeOp(0.05 + 0.55 * (1 - smooth(0.02, 0.86, q)));

        // Wisps drift past the lens and clear early in the descent.
        clouds.forEach((c) => {
          c.set(1 + c.rush * Math.pow(q, 1.5));
          c.op(1 - smooth(0.02, c.out, q));
        });

        // A breath of light at the threshold — softens the seam so the moment
        // of passing through the glass never announces itself as a cut.
        setBloomOp(0.30 * pulse(q, 0.55, 0.8, 0.99));

        // ---- CABIN -----------------------------------------------------
        // NO opacity fade on the cabin. The frame leaves the composition by
        // growing past the viewport edges, which is the whole illusion — fading
        // it would read as the window dissolving rather than being passed
        // through. It stays fully opaque right up to the moment it is outside.
        setCabinOp(1);

        // The shade is the one exception. It scales out of view on its own when
        // open, but a viewer who has pulled it fully shut would otherwise ride
        // an opaque panel all the way to the end, so it releases late.
        const shadeOut = 1 - smooth(0.74, 0.95, q);
        setShadeOp(shadeOut);
        if (shadeGroupRef.current) {
          shadeGroupRef.current.style.pointerEvents = shadeOut < 0.05 ? "none" : "";
        }
        glassFromScroll.current = 1 - smooth(0.55, 0.85, q);
        applyGlass();

        const introOut = smooth(0.01, 0.13, p);
        setIntroOp(1 - introOut);
        setIntroY(-34 * introOut);
        setCueOp(1 - smooth(0.005, 0.07, p));

        const arrive = smooth(0.87, 0.98, p);
        setArriveOp(arrive);
        setArriveY(30 * (1 - arrive));
      };

      /**
       * Scroll progress, read straight off the stage's own position.
       *
       * `p` is 0 while the stage's top is at the top of the viewport and 1
       * once its bottom reaches the bottom — the same range the old
       * ScrollTrigger used, but computed from geometry we can read at any
       * instant instead of from an animation that has to be ticked.
       */
      const readProgress = () => {
        const el = stageRef.current;
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        return travel <= 0 ? 0 : clamp01(-rect.top / travel);
      };

      /**
       * The camera is driven by the scroll position itself, synchronously in
       * the scroll event.
       *
       * It used to hang off a scrubbed ScrollTrigger tween, which meant the
       * chain Lenis → gsap.ticker → ScrollTrigger → scrub → render had to be
       * running for the window to grow at all. Every link in that chain needs
       * requestAnimationFrame, so anything that throttles rAF froze the frame
       * at whatever size it happened to be — the window simply stopped
       * responding to the scrollbar.
       *
       * Reading the position directly makes scroll the single source of truth:
       * more scroll is always a bigger window, with no ticker in between.
       * Lenis still interpolates the scroll position it writes, so the motion
       * keeps its inertia where Lenis is running, and stays correct where it
       * is not.
       */
      const onScroll = () => render(readProgress());

      render(readProgress());

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }, stageRef);

    return () => ctx.revert();
  }, [applyGlass, dims]);

  /* ---------------- entrance ---------------- */
  useEffect(() => {
    if (!dims) return;
    // fromTo throughout: `from` records whatever value is live at call time as
    // its destination, so a double-invoked effect can freeze the scene at a
    // half-played value. Explicit endpoints make the entrance idempotent.
    //
    // The entrance deliberately does NOT touch the camera. It used to settle it
    // from 1.12 to 1 over 2.4s, which fought the scroll for ownership of the
    // window's scale: scrolling during those first seconds moved nothing,
    // because the tween overwrote the scroll-driven value on every tick.
    // Scroll owns the camera outright now.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        viewportRef.current,
        { opacity: 1 },
        { opacity: 1, duration: 1.5, ease: "power2.out" },
        0
      )
        .fromTo(
          ".hero-line",
          { yPercent: 115 },
          { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.09 },
          0.35
        )
        .fromTo(
          [".hero-sub", ".hero-cue"],
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", stagger: 0.1 },
          0.95
        );

      // The entrance is an enhancement, never a precondition for seeing the
      // hero. Browsers throttle rAF in background tabs, which freezes the
      // timeline wherever it happened to be — and since it starts from
      // opacity 0, a page opened in a background tab would otherwise be
      // stranded on a near-black screen. Whenever the document is not visible
      // there is no animation worth playing, so jump to the rested state.
      const settle = () => {
        if (document.visibilityState !== "visible") tl.progress(1);
      };
      settle();
      document.addEventListener("visibilitychange", settle);
      return () => document.removeEventListener("visibilitychange", settle);
    }, stageRef);
    return () => ctx.revert();
  }, [dims]);

  /* ---------------- pointer parallax ---------------- */
  useEffect(() => {
    if (!dims) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Near plane travels further than far plane — the same parallax law the
    // scroll uses, just driven by the pointer.
    const cabinX = gsap.quickTo(cabinTiltRef.current, "x", { duration: 1.1, ease: "power3.out" });
    const cabinY = gsap.quickTo(cabinTiltRef.current, "y", { duration: 1.1, ease: "power3.out" });
    const worldX = gsap.quickTo(worldTiltRef.current, "x", { duration: 1.4, ease: "power3.out" });
    const worldY = gsap.quickTo(worldTiltRef.current, "y", { duration: 1.4, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      cabinX(-nx * 26);
      cabinY(-ny * 18);
      worldX(nx * 10);
      worldY(ny * 7);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [dims]);

  const outer = dims && ring(dims, dims.bez);
  const mid = dims && ring(dims, dims.bez * 0.62);
  const lip = dims && ring(dims, dims.lip);
  const glass = dims && ring(dims, 0);

  // Halved from 620vh. The camera curve was reshaped to match — see `render`.
  return (
    <div ref={stageRef} className="relative h-[310vh]">
      <div ref={viewportRef} className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#0b0d12]">
        {/* ============ WORLD — everything beyond the glass ============ */}
        <div ref={worldTiltRef} className="absolute inset-0">
          <div ref={worldRef} className="absolute inset-0 will-change-transform">
            {/* ------------------------------------------------------------ *
             *  Central Park is present from the very first frame — never faded
             *  in at a threshold. What changes is CLARITY.
             *
             *  Sharpening is done by cross-fading three copies of the same
             *  plate with STATIC blur radii rather than animating a filter.
             *  An animated `filter: blur()` on a full-screen image forces a
             *  re-rasterise every frame; static blurs are rasterised once and
             *  only their opacity animates, which the compositor does for free.
             *
             *  Stacking order is blurriest on top, so as each layer fades out
             *  the sharper one beneath is revealed. The result reads as one
             *  continuous pull into focus.
             * ------------------------------------------------------------ */}

            {/* sharp base — always fully opaque underneath */}
            <div
              className="absolute -inset-[3%]"
              style={{
                backgroundImage: `url('${PLATE}')`,
                backgroundSize: "cover",
                backgroundPosition: "center 62%",
              }}
            />
            {/* medium focus */}
            <div
              ref={cityMidRef}
              className="absolute -inset-[8%]"
              style={{
                backgroundImage: `url('${PLATE}')`,
                backgroundSize: "cover",
                backgroundPosition: "center 62%",
                filter: "blur(5px)",
              }}
            />
            {/* far / heavily defocused — what you see before scrolling.
                The negative inset keeps the blur's soft edge off-screen. */}
            <div
              ref={cityRef}
              className="absolute -inset-[10%]"
              style={{
                backgroundImage: `url('${PLATE}')`,
                backgroundSize: "cover",
                backgroundPosition: "center 62%",
                filter: "blur(15px) saturate(0.94)",
              }}
            />

            {/* ---- cinematic grade, constant across the sequence ---- */}
            {/* aerial depth: cool, dense haze toward the horizon */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg,rgba(150,178,205,0.18) 0%,rgba(150,178,205,0.06) 26%,transparent 52%)",
              }}
            />
            {/* split tone — warm highlights, cool shadows */}
            <div
              className="pointer-events-none absolute inset-0 mix-blend-soft-light"
              style={{
                background:
                  "linear-gradient(175deg,#ffd9a8 0%,rgba(255,217,168,0.15) 38%,rgba(90,120,160,0.35) 100%)",
              }}
            />
            {/* contrast anchors: sink the top for type, weight the base */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg,rgba(8,12,22,0.42) 0%,transparent 28%,transparent 58%,rgba(6,9,16,0.72) 100%)",
              }}
            />

            {/* ---- atmosphere that thins as the camera descends ---- */}
            <div
              ref={hazeRef}
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg,rgba(214,228,242,0.34) 0%,rgba(216,229,242,0.18) 34%,rgba(238,231,219,0.11) 68%,rgba(240,230,214,0.06) 100%)",
              }}
            />

            {/* Thin wisps drifting between the camera and the park. They clear
                early, which is what sells the descent. */}
            <div ref={cloudFarRef} className="absolute inset-0 will-change-transform">
              <CloudDeck seed={11} count={6} blur={14} opacity={0.20} band={[2, 34]} width={[280, 520]} />
            </div>
            <div ref={cloudMidRef} className="absolute inset-0 will-change-transform">
              <CloudDeck seed={29} count={4} blur={22} opacity={0.24} band={[62, 86]} width={[420, 760]} />
            </div>
            <div ref={cloudNearRef} className="absolute inset-0 will-change-transform">
              <CloudDeck seed={47} count={3} blur={34} opacity={0.28} band={[82, 108]} width={[620, 1040]} />
            </div>
          </div>

          {/* Shade dimming — sits over the world, under the cabin, so pulling
              the shade down actually darkens what is outside. */}
          <div
            ref={shadeRef}
            className="pointer-events-none absolute inset-0 bg-[#05070c]"
            style={{ opacity: 0 }}
          />

          {/* threshold bloom */}
          <div
            ref={bloomRef}
            className="absolute inset-0 opacity-0"
            style={{
              background:
                "radial-gradient(ellipse 62% 52% at 50% 50%,rgba(255,246,232,0.95) 0%,rgba(255,236,210,0.4) 38%,transparent 72%)",
            }}
          />
        </div>

        {/* ============ CABIN — wall, bezel and glass, as one camera rig ============ */}
        <div ref={cabinTiltRef} className="absolute inset-0">
          {dims && outer && mid && lip && glass && (
            <svg
              className="absolute inset-0 h-full w-full will-change-transform"
              viewBox={`0 0 ${dims.w} ${dims.h}`}
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                {/* cabin sidewall — matte, unlit, so the opening carries all the value */}
                <linearGradient id="wall" x1="0" y1="0" x2="0.35" y2="1">
                  <stop offset="0" stopColor="#2b2d33" />
                  <stop offset="0.45" stopColor="#1c1e24" />
                  <stop offset="1" stopColor="#101217" />
                </linearGradient>

                {/* moulded plastic surround, lit from above */}
                <linearGradient id="bezelOuter" x1="0" y1="0" x2="0.15" y2="1">
                  <stop offset="0" stopColor="#fbfbf9" />
                  <stop offset="0.22" stopColor="#e4e4e1" />
                  <stop offset="0.55" stopColor="#c9c9c6" />
                  <stop offset="0.82" stopColor="#bcbcb9" />
                  <stop offset="1" stopColor="#dedddb" />
                </linearGradient>
                <linearGradient id="bezelMid" x1="0" y1="0" x2="0.1" y2="1">
                  <stop offset="0" stopColor="#f6f6f4" />
                  <stop offset="0.4" stopColor="#dcdcd9" />
                  <stop offset="1" stopColor="#c4c4c1" />
                </linearGradient>
                <linearGradient id="bezelLip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="0.35" stopColor="#eaeae7" />
                  <stop offset="1" stopColor="#cfcfcc" />
                </linearGradient>

                {/* contact shadow where the surround meets the wall */}
                <radialGradient id="ao" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0.58" stopColor="#000" stopOpacity="0.55" />
                  <stop offset="0.78" stopColor="#000" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#000" stopOpacity="0" />
                </radialGradient>

                {/* specular sweep across the acrylic */}
                <linearGradient id="spec" x1="0.05" y1="0" x2="0.85" y2="1">
                  <stop offset="0.12" stopColor="#fff" stopOpacity="0" />
                  <stop offset="0.3" stopColor="#fff" stopOpacity="0.16" />
                  <stop offset="0.42" stopColor="#fff" stopOpacity="0.05" />
                  <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="innerShade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0a0f18" stopOpacity="0.5" />
                  <stop offset="0.3" stopColor="#0a0f18" stopOpacity="0.1" />
                  <stop offset="1" stopColor="#0a0f18" stopOpacity="0" />
                </linearGradient>

                {/* the opening: white shows the cabin, black lets the world through */}
                <mask id="opening">
                  <rect x={-dims.w} y={-dims.h} width={dims.w * 3} height={dims.h * 3} fill="#fff" />
                  <rect {...glass} fill="#000" />
                </mask>

                <clipPath id="glassClip">
                  <rect {...glass} />
                </clipPath>
              </defs>

              <g ref={camRef}>
                {/* --- wall + surround, punched through at the glass --- */}
                <g ref={cabinRef} mask="url(#opening)">
                  <rect x={-dims.w} y={-dims.h} width={dims.w * 3} height={dims.h * 3} fill="url(#wall)" />

                  {/* ambient occlusion pooling around the moulding */}
                  <rect
                    x={outer.x - dims.bez * 2.6}
                    y={outer.y - dims.bez * 2.6}
                    width={outer.width + dims.bez * 5.2}
                    height={outer.height + dims.bez * 5.2}
                    rx={(outer.width + dims.bez * 5.2) * 0.42}
                    fill="url(#ao)"
                  />

                  <rect {...outer} fill="url(#bezelOuter)" />
                  {/* crisp top highlight along the moulding's upper edge */}
                  <rect
                    {...outer}
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity="0.5"
                    strokeWidth={Math.max(1, dims.glassW * 0.005)}
                  />
                  <rect {...mid} fill="url(#bezelMid)" />
                  <rect {...lip} fill="url(#bezelLip)" />
                  {/* Cam kenarındaki gri hat kaldırıldı: açıklığın çevresini
                      saran ince bir çizgi olarak görünüyordu ve perdenin her
                      konumunda ekranda kalıyordu. Kabartma hissi zaten
                      bezelLip degradesinden geliyor. */}

                  {/* Perde yuvası çizgisi kaldırıldı: bezelin üst kısmında ince
                      gri yatay bir hat olarak görünüyordu ve perdenin her
                      konumunda ekranda kalıyordu. */}
                </g>

                {/* --- the shade, in the same user space so it scales with the rig --- */}
                <g ref={shadeGroupRef}>
                <WindowShade
                  x={glass.x}
                  y={glass.y}
                  width={glass.width}
                  height={glass.height}
                  radius={glass.rx}
                  scale={camScale}
                  onChange={onShade}
                />
                </g>

                {/* --- what the acrylic itself does to the light --- */}
                {/* Salt dekoratif: cam yansımaları perdenin ÜSTÜNE çizildiği
                    için işaretçi olaylarını yakalıyor ve tutamağı tıklanamaz
                    hâle getiriyordu. */}
                <g ref={glassFxRef} clipPath="url(#glassClip)" style={{ pointerEvents: "none" }}>
                  <rect {...glass} fill="#8fbcd8" fillOpacity="0.07" />
                  <rect {...glass} fill="url(#innerShade)" />
                  <rect {...glass} fill="url(#spec)" />
                </g>
              </g>
            </svg>
          )}
        </div>

        {/* Daylight spilling from the window into the cabin. Fades as the shade
            comes down, which is what actually sells the shade as a light source. */}
        <div
          ref={cabinLightRef}
          className="pointer-events-none absolute inset-0 z-[15] mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse 46% 52% at 50% 50%, rgba(180,214,240,0.16) 0%, transparent 68%)",
          }}
        />

        {/* ============ FILM ============ */}
        <div className="pointer-events-none absolute inset-0 z-30 hero-vignette" />
        <div className="pointer-events-none absolute inset-0 z-30 hero-grain" />

        {/* ============ UI ============ */}
        {/* No chrome here — FloatingNav owns the top of every page. */}

        {/* opening title — bottom-left, out of the window's way */}
        <div
          ref={introRef}
          className="absolute bottom-0 left-0 z-40 max-w-[min(560px,86vw)] px-6 pb-14 sm:px-10 sm:pb-16"
        >
          <h1 className="font-display text-[clamp(2.6rem,6.4vw,4.9rem)] leading-[0.94] text-white">
            <span className="block overflow-hidden">
              <span className="hero-line block italic font-light text-white/95">Hiç</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block">gitmediğin</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block">bir yere var</span>
            </span>
          </h1>
          <p className="hero-sub mt-6 max-w-sm text-[14px] leading-relaxed text-white/45">
            Dünyanın en güzel şehirlerine açılan bir cam kenarı. Unutulmaz rotalar,
            büyüleyici duraklar ve kesintisiz tek bir manzara.
          </p>
        </div>

        {/* scroll cue */}
        <div
          ref={cueRef}
          className="hero-cue absolute bottom-14 right-6 z-40 hidden items-center gap-4 sm:right-10 sm:flex"
        >
          <span className="text-[11px] tracking-[0.3em] text-white/40 uppercase">Kaydır</span>
          <span className="relative block h-14 w-px overflow-hidden bg-white/15">
            <span className="hero-trace absolute inset-x-0 top-0 block h-5 bg-gradient-to-b from-transparent to-white/70" />
          </span>
        </div>

        {/* arrival */}
        <div
          ref={arriveRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-6 pb-16 text-center opacity-0 sm:pb-20"
        >
          <p className="text-[11px] tracking-[0.42em] text-white/55 uppercase">Şimdi iniyoruz</p>
          <h2 className="font-display mt-3 text-[clamp(2.8rem,8vw,6rem)] leading-[0.95] text-white">
            <span className="italic font-light">Central</span> Park
          </h2>
          <p className="mt-3 text-[13px] tracking-[0.16em] text-white/50 uppercase">
            New York &middot; 40,7829&deg; K
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Cloud deck — deterministic so server and client agree, and so the
 *  composition stays put between reloads instead of reshuffling.
 * ------------------------------------------------------------------ */
function CloudDeck({
  seed,
  count,
  blur,
  opacity,
  band,
  width,
}: {
  seed: number;
  count: number;
  blur: number;
  opacity: number;
  band: [number, number];
  width: [number, number];
}) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  return (
    <div className="absolute inset-0">
      {Array.from({ length: count }).map((_, i) => {
        const w = width[0] + rand() * (width[1] - width[0]);
        const left = -14 + ((i + rand() * 0.7) / count) * 128;
        const top = band[0] + rand() * (band[1] - band[0]);
        // Each cloud is a cluster of offset puffs rather than one ellipse —
        // a single radial gradient reads as fog, a cluster reads as cumulus.
        const puffs = 3 + Math.floor(rand() * 2);
        const puffData = Array.from({ length: puffs }).map(() => ({
          px: rand(),
          py: rand(),
          ps: 0.5 + rand() * 0.55,
        }));

        return (
          <div
            key={i}
            className="hero-drift absolute"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: w,
              height: w * 0.34,
              opacity,
              filter: `blur(${blur}px)`,
              animationDuration: `${26 + rand() * 22}s`,
              animationDelay: `${-rand() * 20}s`,
            }}
          >
            {puffData.map((p, j) => {
              const pw = w * p.ps;
              return (
                <span
                  key={j}
                  className="absolute block rounded-[50%]"
                  style={{
                    left: `${p.px * 62}%`,
                    top: `${18 + p.py * 46}%`,
                    width: pw,
                    height: pw * (0.52 + p.py * 0.2),
                    // lit from above-left, matching the sun on the horizon
                    background:
                      "radial-gradient(ellipse at 38% 26%,rgba(255,255,253,0.98) 0%,rgba(255,250,242,0.8) 34%,rgba(255,238,222,0.34) 62%,rgba(255,232,214,0) 100%)",
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

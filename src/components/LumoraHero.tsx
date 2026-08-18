"use client";

import { useState, useCallback, useRef } from "react";
import { Menu, X } from "lucide-react";

const VIDEOS = [
  {
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4",
    label: "Golden Hour",
  },
  {
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4",
    label: "Still Water",
  },
  {
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4",
    label: "Deep Woods",
  },
  {
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4",
    label: "Quiet Dawn",
  },
];

const NAV_LINKS = ["How It Works", "Features", "Pricing", "Community"];

const STATS = [
  "60+ Deep Sessions",
  "12,000+ Creators",
  "4.8 User Satisfaction",
  "Intentional-First Design",
];

export default function LumoraHero() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDark = activeVideo === 2;

  const handleVideoSwitch = useCallback(
    (index: number) => {
      if (index === activeVideo || isTransitioning) return;
      setActiveVideo(index);
      setIsTransitioning(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsTransitioning(false), 1000);
    },
    [activeVideo, isTransitioning]
  );

  const contentColor = isDark ? "#182C41" : "white";

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-black">
      {/* Video Layer */}
      {VIDEOS.map((v, i) => (
        <video
          key={i}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: activeVideo === i ? 1 : 0 }}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={v.url} type="video/mp4" />
        </video>
      ))}

      {/* PNG Overlay (z-1) */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{ animation: "train-bob 3s ease-in-out infinite" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote Figma export is not in the app image allowlist */}
        <img
          src="https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ transform: "scale(1.03)" }}
        />
      </div>

      {/* Content Layer (z-2) */}
      <div className="relative z-[2] flex flex-col h-full px-5 sm:px-8 md:px-12 py-5 sm:py-6">
        {/* Navigation */}
        <nav className="flex items-center justify-between">
          <span className="text-white text-xl sm:text-2xl italic" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Lumora
          </span>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center liquid-glass rounded-full px-1.5 py-1.5 gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/90 text-sm px-4 py-2 hover:text-white transition-colors"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {link}
              </a>
            ))}
            <button
              className="bg-white text-black text-sm font-medium px-5 py-2 rounded-full hover:bg-white/90 transition-colors"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden liquid-glass rounded-full w-10 h-10 flex items-center justify-center relative"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu
              className="absolute text-white transition-all duration-300"
              style={{
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? "rotate(90deg) scale(0.75)" : "rotate(0deg) scale(1)",
              }}
              size={20}
            />
            <X
              className="absolute text-white transition-all duration-300"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.75)",
              }}
              size={20}
            />
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-8">
            <button
              className="absolute top-5 right-5 liquid-glass rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => setMenuOpen(false)}
            >
              <X className="text-white" size={20} />
            </button>
            {NAV_LINKS.map((link, i) => (
              <a
                key={link}
                href="#"
                className="text-white text-3xl"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  animation: `slide-up 500ms cubic-bezier(0.4,0,0.2,1) ${100 + i * 50}ms both`,
                }}
              >
                {link}
              </a>
            ))}
            <button
              className="bg-white text-black text-lg font-medium px-8 py-3 rounded-full mt-4"
              style={{
                fontFamily: "system-ui, sans-serif",
                animation: "scale-in 500ms cubic-bezier(0.4,0,0.2,1) 300ms both",
              }}
            >
              Get Started
            </button>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Hero Content */}
        <div className="flex flex-col items-center text-center gap-4 sm:gap-6 mb-4 sm:mb-12">
          {/* Badge */}
          <div
            className="liquid-glass rounded-full px-5 py-2 text-xs sm:text-sm transition-colors duration-700"
            style={{ color: contentColor, fontFamily: "system-ui, sans-serif" }}
          >
            Over 10,000 minds already finding their clarity
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] max-w-4xl transition-colors duration-700"
            style={{ color: contentColor, fontFamily: "'Instrument Serif', serif" }}
          >
            Clarity in an Endlessly
            <br />
            Noisy Universe
          </h1>

          {/* Subtext */}
          <p
            className="max-w-xl text-sm sm:text-base leading-relaxed transition-colors duration-700"
            style={{ color: contentColor, opacity: 0.8, fontFamily: "system-ui, sans-serif" }}
          >
            Rise above the chaos of pings, infinite scrolling, and relentless demands. Discover how to protect your presence and create with intention.
          </p>

          {/* Email Input */}
          <div className="liquid-glass rounded-full flex items-center p-1.5 w-full max-w-[320px] sm:max-w-sm">
            <input
              type="email"
              placeholder="Your Best Email"
              className="bg-transparent outline-none px-4 py-2 text-sm flex-1 min-w-0 transition-colors duration-700"
              style={{ color: contentColor, fontFamily: "system-ui, sans-serif" }}
            />
            <button
              className="bg-white text-black text-sm font-medium px-4 sm:px-5 py-2 rounded-full whitespace-nowrap hover:bg-white/90 transition-colors"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Get Early Access
            </button>
          </div>

          {/* Video Switcher */}
          <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
            {VIDEOS.map((v, i) => (
              <button
                key={i}
                onClick={() => handleVideoSwitch(i)}
                className="text-xs sm:text-sm pb-1 border-b-2 transition-all duration-300"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  color: activeVideo === i ? contentColor : contentColor,
                  opacity: activeVideo === i ? 1 : 0.5,
                  borderColor: activeVideo === i ? contentColor : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (activeVideo !== i) e.currentTarget.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  if (activeVideo !== i) e.currentTarget.style.opacity = "0.5";
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap pb-4" style={{ fontFamily: "system-ui, sans-serif" }}>
          {STATS.map((stat, i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-5">
              <span className="text-white/70 text-xs sm:text-sm">{stat}</span>
              {i < STATS.length - 1 && (
                <span className="text-white/30 hidden sm:inline">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

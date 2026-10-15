"use client";

import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { SPRING } from "@/lib/motion";

/**
 * Pulls its child gently toward the cursor while hovered, then springs home.
 * The label moves further than the container so the two separate slightly —
 * that parallax is what makes it feel like a physical object rather than a
 * translated div.
 */
export default function Magnetic({
  children,
  strength = 0.32,
  radius = 1.6,
  className,
}: {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    // Falls off with distance so the pull eases in rather than snapping.
    const dist = Math.hypot(dx, dy);
    const max = (Math.max(r.width, r.height) / 2) * radius;
    const falloff = Math.max(0, 1 - dist / max);
    x.set(dx * strength * falloff);
    y.set(dy * strength * falloff);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy, display: "inline-flex" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

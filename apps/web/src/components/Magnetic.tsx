"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { SPRING } from "@/lib/motion";

/** Position, velocity and target of the pull, plus the running frame. */
interface Pull {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  frame: number;
  last: number;
}

const REST = 0.01;
const SUBSTEPS = 4;

/**
 * Damped spring toward (tx, ty), written straight to the element's transform.
 * Lives outside React: the menu sits on every page, and this keeps an
 * animation library out of the first load.
 */
function follow(el: HTMLElement, pull: Pull) {
  if (pull.frame) return;
  const tick = (now: number) => {
    const h = Math.min(0.032, (now - pull.last) / 1000) / SUBSTEPS;
    pull.last = now;
    for (let i = 0; i < SUBSTEPS; i++) {
      pull.vx += ((-SPRING.stiffness * (pull.x - pull.tx) - SPRING.damping * pull.vx) / SPRING.mass) * h;
      pull.vy += ((-SPRING.stiffness * (pull.y - pull.ty) - SPRING.damping * pull.vy) / SPRING.mass) * h;
      pull.x += pull.vx * h;
      pull.y += pull.vy * h;
    }
    const settled =
      Math.abs(pull.x - pull.tx) < REST &&
      Math.abs(pull.y - pull.ty) < REST &&
      Math.abs(pull.vx) < REST &&
      Math.abs(pull.vy) < REST;
    if (settled) {
      pull.x = pull.tx;
      pull.y = pull.ty;
      pull.vx = 0;
      pull.vy = 0;
    }
    el.style.transform = pull.x === 0 && pull.y === 0 ? "" : `translate(${pull.x}px, ${pull.y}px)`;
    pull.frame = settled ? 0 : requestAnimationFrame(tick);
  };
  pull.last = performance.now();
  pull.frame = requestAnimationFrame(tick);
}

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
  const pull = useRef<Pull>({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, frame: 0, last: 0 });

  useEffect(() => {
    const state = pull.current;
    return () => {
      if (state.frame) cancelAnimationFrame(state.frame);
      state.frame = 0;
    };
  }, []);

  const aim = (tx: number, ty: number) => {
    const el = ref.current;
    if (!el) return;
    pull.current.tx = tx;
    pull.current.ty = ty;
    follow(el, pull.current);
  };

  const onMove = (e: PointerEvent) => {
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
    aim(dx * strength * falloff, dy * strength * falloff);
  };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => aim(0, 0)}
      style={{ display: "inline-flex" }}
      className={className}
    >
      {children}
    </span>
  );
}

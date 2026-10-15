"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeDeg, rotationForIndex, selectedIndex, shortestDeltaDeg } from "./wheelMath";

export const PHYSICS = {
  /** Spin animation length, ms. */
  spinDuration: 4200,
  /** Whole turns added before landing, so the travel reads as a real spin. */
  minTurns: 4,
  maxTurns: 7,
  /** Drag-release deceleration per frame. */
  friction: 0.978,
  /** Below this (deg/frame) a coasting wheel is done. */
  stopVelocity: 0.05,
  /** Release under this (deg/frame) snaps instead of coasting. */
  flickThreshold: 1.2,
  maxDragVelocity: 34,
  /** Snap easing per frame, and the distance at which it is finished. */
  snapLerp: 0.18,
  snapEpsilon: 0.02,
};

/** Quintic ease-out: fast commit, long graceful settle. */
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

type Phase = "idle" | "spinning" | "coasting" | "snapping";

/**
 * Wheel motion, isolated from React rendering.
 *
 * Two rules make the "stuck on one country" class of bug impossible:
 *
 * 1. Nothing here depends on prop identity. The previous version reset
 *    `rotation` and cancelled the animation frame inside an effect keyed on
 *    `onClose`, which is an inline arrow in the parent — so every parent
 *    re-render aborted an in-flight spin and randomised the angle.
 *
 * 2. A button spin picks the TARGET COUNTRY first, then animates to the exact
 *    angle that puts it under the pointer. The animation and the result are the
 *    same number, so they cannot disagree. Dragging still uses real momentum
 *    and resolves from wherever it actually stops.
 */
export function useWheelPhysics(count: number, onSettle?: (index: number) => void) {
  const rotation = useRef(0);
  const velocity = useRef(0);
  const phase = useRef<Phase>("idle");
  const raf = useRef(0);
  const stepRef = useRef<FrameRequestCallback>(() => {});

  // Spin animation state
  const spinFrom = useRef(0);
  const spinDelta = useRef(0);
  const spinStart = useRef(0);
  const spinTargetIndex = useRef(0);

  const snapTarget = useRef(0);
  const drag = useRef<{ last: number; lastT: number; moved: boolean } | null>(null);

  // Callbacks held in refs so the loop never needs re-creating. Assigned in an
  // effect rather than during render.
  const settleRef = useRef(onSettle);
  useEffect(() => {
    settleRef.current = onSettle;
  }, [onSettle]);
  const drawRef = useRef<() => void>(() => {});

  const [live, setLive] = useState(0);
  const [busy, setBusy] = useState(false);
  /** True once the wheel has come to rest after a real interaction. */
  const [settled, setSettled] = useState(false);
  const liveRef = useRef(0);

  /** Commit the live index to React only when it actually changes. */
  const syncLive = useCallback(() => {
    const i = selectedIndex(rotation.current, count);
    if (i !== liveRef.current) {
      liveRef.current = i;
      setLive(i);
    }
  }, [count]);

  const step = useCallback(() => {
    const p = phase.current;

    if (p === "spinning") {
      const t = Math.min(1, (performance.now() - spinStart.current) / PHYSICS.spinDuration);
      rotation.current = normalizeDeg(spinFrom.current + spinDelta.current * easeOutQuint(t));
      syncLive();
      drawRef.current();

      if (t >= 1) {
        // Land on the exact angle for the chosen country. No drift, no snap
        // needed — the target was the destination all along.
        rotation.current = rotationForIndex(spinTargetIndex.current, count);
        liveRef.current = spinTargetIndex.current;
        setLive(spinTargetIndex.current);
        drawRef.current();
        phase.current = "idle";
        velocity.current = 0;
        setBusy(false);
        setSettled(true);
        settleRef.current?.(spinTargetIndex.current);
        raf.current = 0;
        return;
      }
      raf.current = requestAnimationFrame(stepRef.current);
      return;
    }

    if (p === "coasting") {
      rotation.current = normalizeDeg(rotation.current + velocity.current);
      velocity.current *= PHYSICS.friction;
      syncLive();
      drawRef.current();

      if (Math.abs(velocity.current) < PHYSICS.stopVelocity) {
        snapTarget.current = rotationForIndex(selectedIndex(rotation.current, count), count);
        phase.current = "snapping";
      }
      raf.current = requestAnimationFrame(stepRef.current);
      return;
    }

    if (p === "snapping") {
      const d = shortestDeltaDeg(rotation.current, snapTarget.current);
      if (Math.abs(d) < PHYSICS.snapEpsilon) {
        rotation.current = snapTarget.current;
        const idx = selectedIndex(rotation.current, count);
        liveRef.current = idx;
        setLive(idx);
        drawRef.current();
        phase.current = "idle";
        velocity.current = 0;
        setBusy(false);
        setSettled(true);
        settleRef.current?.(idx);
        raf.current = 0;
        return;
      }
      rotation.current = normalizeDeg(rotation.current + d * PHYSICS.snapLerp);
      syncLive();
      drawRef.current();
      raf.current = requestAnimationFrame(stepRef.current);
      return;
    }

    raf.current = 0;
  }, [count, syncLive]);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const start = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(stepRef.current);
  }, []);

  /** Spin to a specific country. Exposed so tests and the Daily mode can aim. */
  const spinTo = useCallback(
    (index: number) => {
      if (phase.current !== "idle") return;
      const target = rotationForIndex(index, count);
      const turns =
        PHYSICS.minTurns + Math.floor(Math.random() * (PHYSICS.maxTurns - PHYSICS.minTurns + 1));
      // Always travel forwards so the ease reads as one continuous motion.
      const delta = normalizeDeg(target - rotation.current) + turns * 360;

      spinFrom.current = rotation.current;
      spinDelta.current = delta;
      spinStart.current = performance.now();
      spinTargetIndex.current = index;
      phase.current = "spinning";
      setSettled(false);
      setBusy(true);
      start();
    },
    [count, start]
  );

  /** Uniformly random country, then land on it exactly. */
  const spin = useCallback(() => {
    if (phase.current !== "idle") return;
    spinTo(Math.floor(Math.random() * count));
  }, [count, spinTo]);

  /* ------------------------------ drag ------------------------------ */
  const dragStart = useCallback((angleDeg: number) => {
    if (phase.current === "spinning") return; // do not fight a running spin
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    }
    phase.current = "idle";
    velocity.current = 0;
    setSettled(false);
    setBusy(true);
    drag.current = { last: angleDeg, lastT: performance.now(), moved: false };
  }, []);

  const dragMove = useCallback(
    (angleDeg: number) => {
      const d = drag.current;
      if (!d) return;
      let delta = angleDeg - d.last;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      const now = performance.now();
      const dt = Math.max(1, now - d.lastT);
      rotation.current = normalizeDeg(rotation.current + delta);
      velocity.current = delta * (16.7 / dt);
      d.last = angleDeg;
      d.lastT = now;
      if (Math.abs(delta) > 0.25) d.moved = true;
      syncLive();
      drawRef.current();
    },
    [syncLive]
  );

  const dragEnd = useCallback(() => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (!d.moved) {
      setBusy(false);
      return;
    }
    if (Math.abs(velocity.current) > PHYSICS.flickThreshold) {
      velocity.current = Math.max(
        -PHYSICS.maxDragVelocity,
        Math.min(PHYSICS.maxDragVelocity, velocity.current)
      );
      phase.current = "coasting";
    } else {
      snapTarget.current = rotationForIndex(selectedIndex(rotation.current, count), count);
      phase.current = "snapping";
    }
    start();
  }, [count, start]);

  /** Randomise the resting angle without animating. Used when the modal opens. */
  const reset = useCallback(() => {
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    }
    phase.current = "idle";
    velocity.current = 0;
    drag.current = null;
    rotation.current = rotationForIndex(Math.floor(Math.random() * count), count);
    liveRef.current = selectedIndex(rotation.current, count);
    setLive(liveRef.current);
    setBusy(false);
    setSettled(false);
  }, [count]);

  // Only tears down on unmount — never on a prop-identity change.
  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    },
    []
  );

  return {
    rotation,
    live,
    busy,
    settled,
    spin,
    spinTo,
    dragStart,
    dragMove,
    dragEnd,
    reset,
    setDraw: (fn: () => void) => {
      drawRef.current = fn;
    },
    isIdle: () => phase.current === "idle",
  };
}

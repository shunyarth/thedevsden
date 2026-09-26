"use client";

import { useEffect } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const SIZE = 380; // px
const CLICKABLE = "a, button, [role='button'], summary, label, input, select, textarea";

// A soft gold light that trails the mouse and grows a little over anything clickable.
// Desktop mouse only (hidden by CSS on touch screens), off for reduced motion.
// Moves with transforms driven by springs, so React never re-renders while it follows.
export function CursorGlow() {
  const reducedMotion = useReducedMotion();
  const x = useSpring(useMotionValue(-SIZE), { stiffness: 180, damping: 26, mass: 0.6 });
  const y = useSpring(useMotionValue(-SIZE), { stiffness: 180, damping: 26, mass: 0.6 });
  const scale = useSpring(1, { stiffness: 200, damping: 20 });
  const opacity = useSpring(0, { stiffness: 120, damping: 24 });

  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let hovering = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (opacity.get() === 0) {
        // Appear where the mouse is instead of flying in from the corner.
        x.jump(e.clientX - SIZE / 2);
        y.jump(e.clientY - SIZE / 2);
      }
      x.set(e.clientX - SIZE / 2);
      y.set(e.clientY - SIZE / 2);
      opacity.set(1);
      const over = !!(e.target as Element | null)?.closest?.(CLICKABLE);
      if (over !== hovering) {
        hovering = over;
        scale.set(over ? 1.45 : 1);
      }
    };
    const onLeave = () => opacity.set(0);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion, x, y, scale, opacity]);

  return (
    <m.div
      aria-hidden
      className="cursor-glow pointer-events-none fixed top-0 left-0 z-40 rounded-full bg-[radial-gradient(closest-side,rgba(251,191,36,0.11),rgba(245,158,11,0.04)_50%,transparent)]"
      style={{ x, y, scale, opacity, width: SIZE, height: SIZE }}
    />
  );
}

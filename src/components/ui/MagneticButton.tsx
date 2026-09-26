"use client";

import { useRef } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: React.ReactNode;
  className?: string;
  /** How far the button follows the cursor, as a share of the cursor's distance from its centre. */
  strength?: number;
  /** Maximum pull in px. */
  max?: number;
};

// Wraps a button/link: it leans towards the mouse on hover and presses down on click.
// Mouse only (no pull on touch screens), and still for reduced-motion visitors.
export function MagneticButton({ children, className, strength = 0.3, max = 10 }: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const spring = { stiffness: 220, damping: 16, mass: 0.5 };
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  const onMove = (e: React.PointerEvent) => {
    if (reducedMotion || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const clamp = (v: number) => Math.max(-max, Math.min(max, v * strength));
    x.set(clamp(e.clientX - (rect.left + rect.width / 2)));
    y.set(clamp(e.clientY - (rect.top + rect.height / 2)));
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      style={{ x, y }}
      className={cn("inline-flex", className)}
    >
      {children}
    </m.span>
  );
}

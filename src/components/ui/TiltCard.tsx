"use client";

import { useRef } from "react";
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
};

const GLARE = 420; // px size of the light reflection

// Card that tilts in 3D toward the mouse, with a soft gold reflection that follows the cursor.
// Everything moves with transforms/opacity, and only while a mouse is over the card
// (so it costs nothing off screen and does nothing on touch screens).
export function TiltCard({ children, className, max = 6 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 110, damping: 18, mass: 0.9 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glareX = useMotionValue(0);
  const glareY = useMotionValue(0);

  const onMove = (e: React.PointerEvent) => {
    if (reducedMotion || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    px.set(x / rect.width);
    py.set(y / rect.height);
    glareX.set(x - GLARE / 2);
    glareY.set(y - GLARE / 2);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <m.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={cn("group/tilt relative", className)}
    >
      {children}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <m.div
          className="absolute top-0 left-0 rounded-full bg-[radial-gradient(closest-side,rgba(253,230,138,0.13),rgba(245,158,11,0.06)_55%,transparent)] opacity-0 transition-opacity duration-700 group-hover/tilt:opacity-100"
          style={{ x: glareX, y: glareY, width: GLARE, height: GLARE }}
        />
      </div>
    </m.div>
  );
}

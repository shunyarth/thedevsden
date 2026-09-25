"use client";

import { useRef } from "react";
import { m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  max?: number;
};

// Card that tilts in 3D toward the mouse, with a soft glare that follows the cursor.
export function TiltCard({ children, className, max = 6 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 110, damping: 18, mass: 0.9 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(253,230,138,0.12), rgba(245,158,11,0.06) 35%, transparent 65%)`;

  const onMove = (e: React.PointerEvent) => {
    if (reducedMotion || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
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
      className={`group/tilt relative ${className ?? ""}`}
    >
      {children}
      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-700 group-hover/tilt:opacity-100"
        style={{ background: glare }}
      />
    </m.div>
  );
}

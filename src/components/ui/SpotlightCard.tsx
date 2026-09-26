"use client";

import { useRef } from "react";
import { m, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
};

const SIZE = 360; // px size of the light

// Card whose gold border lights up around the mouse, with a faint glow inside.
// The light is a blob moved with transforms; the border ring is a static mask,
// so the browser never repaints while it moves. Mouse only.
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (reducedMotion || e.pointerType !== "mouse" || !el) return;
    const rect = el.getBoundingClientRect();
    x.set(e.clientX - rect.left - SIZE / 2);
    y.set(e.clientY - rect.top - SIZE / 2);
    el.setAttribute("data-spot", "");
  };
  const onLeave = () => ref.current?.removeAttribute("data-spot");

  const light = (tone: string) => (
    <m.div className={cn("absolute top-0 left-0 rounded-full", tone)} style={{ x, y, width: SIZE, height: SIZE }} />
  );

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={cn("group/spot relative", className)}>
      {children}
      {/* Faint glow inside the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-0 transition-opacity duration-500 group-data-[spot]/spot:opacity-100"
      >
        {light("bg-[radial-gradient(closest-side,rgba(251,191,36,0.08),transparent)]")}
      </div>
      {/* Border ring that lights up near the cursor */}
      <div
        aria-hidden
        className="spotlight-ring pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-0 transition-opacity duration-500 group-data-[spot]/spot:opacity-100"
      >
        {light("bg-[radial-gradient(closest-side,rgb(253,230,138),rgba(251,191,36,0.6)_45%,transparent)]")}
      </div>
    </div>
  );
}

"use client";

import { LazyMotion, MotionConfig, useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

// Buttery smooth scrolling + gentle default animation timing for the whole site.
// Both switch off for visitors who have "reduce motion" turned on.
// LazyMotion loads the animation engine in a separate, deferred file.
const loadFeatures = () => import("./motionFeatures").then((mod) => mod.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
        {reducedMotion ? (
          children
        ) : (
          <ReactLenis root options={{ lerp: 0.085, smoothWheel: true, anchors: { offset: -80 } }}>
            {children}
          </ReactLenis>
        )}
      </MotionConfig>
    </LazyMotion>
  );
}

"use client";

import { useEffect } from "react";
import { LazyMotion, MotionConfig, useReducedMotion } from "framer-motion";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

// LazyMotion loads the animation engine in a separate, deferred file.
const loadFeatures = () => import("./motionFeatures").then((mod) => mod.default);

// Runs the smooth-scroll loop only while the page is actually scrolling.
// A loop that never stops forces the browser to redo page styles on every frame,
// even when nothing moves — that was the main source of background lag.
function OnDemandScrollLoop() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    let frame = 0;
    let lastActive = 0;

    const tick = (time: number) => {
      lenis.raf(time);
      if (lenis.isScrolling) lastActive = time;
      frame = time - lastActive < 300 ? requestAnimationFrame(tick) : 0;
    };

    const wake = () => {
      if (frame) return;
      // Claim the frame before calling Lenis: lenis.raf() can emit "scroll", which calls wake() again.
      frame = requestAnimationFrame(tick);
      // Sync Lenis' clock first so the first frame after a pause doesn't jump.
      const now = performance.now();
      lastActive = now;
      lenis.raf(now);
    };

    const events = ["wheel", "touchstart", "touchmove", "keydown", "pointerdown", "click"] as const;
    events.forEach((e) => window.addEventListener(e, wake, { capture: true, passive: true }));
    const offScroll = lenis.on("scroll", wake);
    wake();

    return () => {
      events.forEach((e) => window.removeEventListener(e, wake, { capture: true }));
      offScroll();
      cancelAnimationFrame(frame);
    };
  }, [lenis]);

  return null;
}

// Smooth scrolling + gentle default animation timing for the whole site.
// Both switch off for visitors who have "reduce motion" turned on.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
        {reducedMotion ? (
          children
        ) : (
          <ReactLenis root options={{ lerp: 0.085, smoothWheel: true, anchors: { offset: -80 }, autoRaf: false }}>
            <OnDemandScrollLoop />
            {children}
          </ReactLenis>
        )}
      </MotionConfig>
    </LazyMotion>
  );
}

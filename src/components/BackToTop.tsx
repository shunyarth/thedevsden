"use client";

import { useRef } from "react";

// "Back to top" link: the arrow launches like a rocket on click. The smooth scroll itself
// comes from Lenis' anchor handling (and is an instant jump for reduced-motion visitors).
export function BackToTop() {
  const ref = useRef<HTMLAnchorElement>(null);

  const launch = () => {
    const el = ref.current;
    if (!el) return;
    el.removeAttribute("data-launch");
    // Force a reflow so clicking again restarts the animation.
    void el.offsetWidth;
    el.setAttribute("data-launch", "");
  };

  return (
    <a
      ref={ref}
      href="#top"
      onClick={launch}
      onAnimationEnd={() => ref.current?.removeAttribute("data-launch")}
      className="back-to-top transition-colors hover:text-ink"
    >
      Back to top <span className="rocket" aria-hidden>↑</span>
    </a>
  );
}

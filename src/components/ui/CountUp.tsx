"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

type CountUpProps = {
  /** Text like "23+" or "100%": the leading number counts up, the rest stays as is. */
  value: string;
  /** Seconds to wait after the number comes into view. */
  delay?: number;
  duration?: number;
};

// Counts a number up from 0 the first time it scrolls into view.
// The real value is in the HTML (for SEO and no-JS), and counting writes straight
// to the text, so React never re-renders while it runs.
export function CountUp({ value, delay = 0, duration = 1.6 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = /^(\d+)(.*)$/.exec(value);
    if (!el || !match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = Number(match[1]);
    const suffix = match[2];
    let stop: (() => void) | undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      el.textContent = `0${suffix}`;
      const controls = animate(0, target, {
        delay,
        duration,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => (el.textContent = `${Math.round(v)}${suffix}`),
      });
      stop = () => controls.stop();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      stop?.();
      el.textContent = value;
    };
  }, [value, delay, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { m, useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";
import styles from "./background-paths.module.css";

const PATHS_PER_SIDE = 15;
const MAX_SHIFT = 24; // px the lines drift towards the cursor
const MAX_TILT = 3; // degrees
const BOOST_RATE = 1.8; // sheen speed while a contact button is hovered
const LAYER_BLEED = 0.06; // .layer extends 6% past each edge so drifting never shows a gap
const VIEWBOX = "0 0 696 316";

// Fixed timings instead of Math.random(), so server and client markup match.
const BANDS = [
  { duration: 9, delay: 0 },
  { duration: 13, delay: -6 },
];

type Path = { id: number; d: string; width: number; opacity: number };

function buildPaths(position: number): Path[] {
  return Array.from({ length: PATHS_PER_SIDE }, (_, i) => {
    const x = i * 12 * position;
    const y = i * 14;
    return {
      id: i,
      d: `M-${380 - x} -${189 + y}C-${380 - x} -${189 + y} -${312 - x} ${216 - y} ${152 - x} ${343 - y}C${616 - x} ${470 - y} ${684 - x} ${875 - y} ${684 - x} ${875 - y}`,
      width: 0.5 + i * 0.07,
      opacity: 0.25 + i * 0.05,
    };
  });
}

const PATHS = [...buildPaths(1), ...buildPaths(-1)];
// Phones get every other line.
const isMobileHidden = (p: Path) => p.id % 2 === 1;

// The same lines as an image, used as the mask the sheen shines through.
function maskUrl(paths: Path[]) {
  const body = paths
    .map((p) => `<path d="${p.d}" stroke="#000" stroke-width="${p.width}" stroke-opacity="${p.opacity}"/>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" preserveAspectRatio="xMidYMid slice" fill="none">${body}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const MASK_VARS = {
  "--mask": maskUrl(PATHS),
  "--mask-mobile": maskUrl(PATHS.filter((p) => !isMobileHidden(p))),
} as React.CSSProperties;

/**
 * Gold flowing lines that sit behind the content of their parent element.
 * The parent must be `position: relative` (and ideally `isolate`).
 * Mark elements with `data-paths-boost` to make the lines speed up and brighten while hovered.
 */
export function BackgroundPaths() {
  const rootRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Drift/tilt targets are springed, so the lines float instead of snapping.
  const springCfg = { stiffness: 60, damping: 18, mass: 0.8 };
  const shiftX = useMotionValue(0);
  const shiftY = useMotionValue(0);
  const x = useSpring(shiftX, springCfg);
  const y = useSpring(shiftY, springCfg);
  const rotateX = useSpring(0, springCfg);
  const rotateY = useSpring(0, springCfg);

  // Cursor glow follows closely and fades in/out with the pointer.
  const glowCfg = { stiffness: 300, damping: 30 };
  const glowX = useSpring(0, glowCfg);
  const glowY = useSpring(0, glowCfg);
  const lightX = useSpring(0, glowCfg);
  const lightY = useSpring(0, glowCfg);
  const glowOpacity = useSpring(0, { stiffness: 120, damping: 20 });

  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start end", "end start"] });

  useEffect(() => {
    const root = rootRef.current;
    const host = root?.parentElement;
    if (!root || !host || reducedMotion) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let offScroll: (() => void) | undefined;

    const setBoost = (on: boolean) => {
      if (root.hasAttribute("data-boost") === on) return;
      root.toggleAttribute("data-boost", on);
      root.getAnimations({ subtree: true }).forEach((a) => {
        if (a instanceof CSSAnimation && a.animationName.includes("sweep")) a.playbackRate = on ? BOOST_RATE : 1;
      });
    };

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      // -1..1 from the centre of the card.
      const nx = (px / rect.width) * 2 - 1;
      const ny = (py / rect.height) * 2 - 1;
      shiftX.set(nx * MAX_SHIFT);
      shiftY.set(ny * MAX_SHIFT);
      rotateY.set(nx * MAX_TILT);
      rotateX.set(-ny * MAX_TILT);
      glowX.set(px);
      glowY.set(py);
      // The line light lives inside the bleeding layer, so offset it by the bleed.
      lightX.set(px + rect.width * LAYER_BLEED);
      lightY.set(py + rect.height * LAYER_BLEED);
      glowOpacity.set(1);
    };

    const onLeave = () => {
      shiftX.set(0);
      shiftY.set(0);
      rotateX.set(0);
      rotateY.set(0);
      glowOpacity.set(0);
      setBoost(false);
    };

    const onOver = (e: PointerEvent) => {
      if ((e.target as Element).closest("[data-paths-boost]")) setBoost(true);
    };
    const onOut = (e: PointerEvent) => {
      const from = (e.target as Element).closest("[data-paths-boost]");
      const to = (e.relatedTarget as Element | null)?.closest("[data-paths-boost]");
      if (from && from !== to) setBoost(false);
    };

    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, input, textarea, select, label")) return;
      const layer = rippleRef.current;
      if (!layer) return;
      const rect = host.getBoundingClientRect();
      const ring = document.createElement("span");
      ring.className = styles.ripple;
      ring.style.left = `${e.clientX - rect.left}px`;
      ring.style.top = `${e.clientY - rect.top}px`;
      ring.addEventListener("animationend", () => ring.remove(), { once: true });
      layer.appendChild(ring);
    };

    const listen = () => {
      if (finePointer) {
        host.addEventListener("pointermove", onMove, { passive: true });
        host.addEventListener("pointerleave", onLeave);
        host.addEventListener("pointerover", onOver);
        host.addEventListener("pointerout", onOut);
      } else {
        // Touch screens: drift gently with the scroll position instead of a cursor.
        offScroll = scrollYProgress.on("change", (p) => {
          const t = p * 2 - 1;
          shiftY.set(t * -MAX_SHIFT);
          shiftX.set(t * MAX_SHIFT * 0.5);
          rotateX.set(t * MAX_TILT * 0.6);
        });
      }
      host.addEventListener("click", onClick);
    };

    const unlisten = () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerover", onOver);
      host.removeEventListener("pointerout", onOut);
      host.removeEventListener("click", onClick);
      offScroll?.();
      offScroll = undefined;
    };

    // Only animate and listen while the card is on screen.
    root.setAttribute("data-paused", "");
    let active = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === active) return;
      active = entry.isIntersecting;
      root.toggleAttribute("data-paused", !active);
      if (active) listen();
      else {
        unlisten();
        onLeave();
      }
    });
    observer.observe(host);

    return () => {
      observer.disconnect();
      unlisten();
    };
  }, [reducedMotion, scrollYProgress, shiftX, shiftY, rotateX, rotateY, glowX, glowY, lightX, lightY, glowOpacity]);

  return (
    <div ref={rootRef} className={styles.root} style={MASK_VARS} aria-hidden>
      {!reducedMotion && <m.div className={styles.glow} style={{ x: glowX, y: glowY, opacity: glowOpacity }} />}
      <m.div
        className={styles.layer}
        style={reducedMotion ? undefined : { x, y, rotateX, rotateY, transformPerspective: 900 }}
      >
        <svg className={styles.lines} viewBox={VIEWBOX} fill="none" preserveAspectRatio="xMidYMid slice">
          {PATHS.map((p, i) => (
            <path
              key={i}
              d={p.d}
              stroke="currentColor"
              strokeWidth={p.width}
              strokeOpacity={p.opacity}
              className={isMobileHidden(p) ? styles.mobileHidden : undefined}
            />
          ))}
        </svg>
        {!reducedMotion && (
          <div className={styles.sheen}>
            {BANDS.map((b, i) => (
              <div
                key={i}
                className={styles.band}
                style={{ "--duration": `${b.duration}s`, "--delay": `${b.delay}s` } as React.CSSProperties}
              />
            ))}
            <m.div className={styles.cursorLight} style={{ x: lightX, y: lightY, opacity: glowOpacity }} />
          </div>
        )}
      </m.div>
      <div ref={rippleRef} className="absolute inset-0" />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

type BlackHoleProps = {
  /** false when the hero is scrolled off screen — pauses every animation */
  active: boolean;
};

// Stars that spiral into the black hole. `mobile: false` ones are skipped on small screens.
const stars = [
  { angle: 10, dur: 9, delay: 0, size: 3, mobile: true },
  { angle: 80, dur: 11, delay: 2.5, size: 2, mobile: false },
  { angle: 150, dur: 10, delay: 5, size: 3, mobile: true },
  { angle: 215, dur: 12, delay: 1.2, size: 2, mobile: false },
  { angle: 275, dur: 9.5, delay: 6.5, size: 2.5, mobile: true },
  { angle: 330, dur: 11.5, delay: 3.8, size: 2, mobile: false },
  { angle: 120, dur: 13, delay: 8, size: 1.5, mobile: false },
];

// Static background specks (x%, y%, size px) — no animation cost.
const specks = [
  [8, 18, 1.5], [18, 72, 1], [30, 10, 1], [44, 88, 1.5], [62, 6, 1], [76, 80, 1],
  [88, 24, 1.5], [93, 58, 1], [12, 46, 1], [70, 38, 1], [52, 64, 1], [24, 30, 1],
] as const;

export function BlackHole({ active }: BlackHoleProps) {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spring = { stiffness: 60, damping: 20, mass: 0.8 };
  const x = useSpring(pointerX, spring);
  const y = useSpring(pointerY, spring);

  // Light 3D tilt + parallax (all transforms)
  const rotateX = useTransform(y, [-1, 1], [6, -6]);
  const rotateY = useTransform(x, [-1, 1], [-8, 8]);
  const diskX = useTransform(x, [-1, 1], [-6, 6]);
  const diskY = useTransform(y, [-1, 1], [-4, 4]);
  const starsX = useTransform(x, [-1, 1], [10, -10]);
  const starsY = useTransform(y, [-1, 1], [8, -8]);

  // Mouse tracking: desktop only, throttled to one update per animation frame,
  // and only while the hero is visible.
  const frame = useRef(0);
  useEffect(() => {
    if (reducedMotion || !active || !window.matchMedia("(pointer: fine)").matches) return;
    let lastX = 0;
    let lastY = 0;
    const onMove = (e: PointerEvent) => {
      lastX = (e.clientX / window.innerWidth) * 2 - 1;
      lastY = (e.clientY / window.innerHeight) * 2 - 1;
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        pointerX.set(lastX);
        pointerY.set(lastY);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [active, reducedMotion, pointerX, pointerY]);

  return (
    <div
      className="bh relative mx-auto aspect-square w-full max-w-[min(100%,320px)] [perspective:900px] sm:max-w-[400px] lg:max-w-[500px]"
      data-paused={!active || undefined}
      aria-hidden
    >
      <m.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateX, rotateY }}>
        {/* Static background specks */}
        {specks.map(([sx, sy, size], i) => (
          <span
            key={i}
            className="absolute rounded-full bg-gold-soft/70"
            style={{ left: `${sx}%`, top: `${sy}%`, width: size, height: size }}
          />
        ))}

        {/* Soft outer halo */}
        <div className="bh-halo absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.35)_0%,rgba(217,119,6,0.14)_38%,transparent_68%)]" />

        {/* Accretion disk — back half (behind the hole) */}
        <m.div className="absolute inset-[6%]" style={{ x: diskX, y: diskY }}>
          <div className="absolute inset-0 [transform:scaleY(0.34)_rotate(-8deg)]">
            <div className="bh-disk absolute inset-0 rounded-full" />
          </div>
        </m.div>

        {/* Lensed light arching over the top of the hole */}
        <div className="bh-lens absolute inset-[27%] rounded-full" />

        {/* Photon ring: the thin glowing edge */}
        <div className="bh-ring absolute inset-[31.5%] rounded-full" />

        {/* Event horizon */}
        <div className="absolute inset-[33%] rounded-full bg-black shadow-[inset_0_0_30px_rgba(0,0,0,1),0_0_0_1px_rgba(0,0,0,0.9)]" />

        {/* Accretion disk — front half (passes in front of the hole) */}
        <m.div className="absolute inset-[6%]" style={{ x: diskX, y: diskY }}>
          <div className="absolute inset-0 [clip-path:inset(50%_0_0_0)] [transform:scaleY(0.34)_rotate(-8deg)]">
            <div className="bh-disk absolute inset-0 rounded-full" />
          </div>
        </m.div>

        {/* Stars being pulled in */}
        <m.div className="absolute inset-0" style={{ x: starsX, y: starsY }}>
          {stars.map((s, i) => (
            <div
              key={i}
              className={`bh-orbit absolute inset-0 ${s.mobile ? "" : "hidden sm:block"}`}
              style={
                {
                  "--start": `${s.angle}deg`,
                  "--dur": `${s.dur}s`,
                  "--delay": `-${s.delay}s`,
                } as React.CSSProperties
              }
            >
              <span
                className="bh-star absolute top-1/2 left-1/2 rounded-full bg-gold-soft shadow-[0_0_6px_2px_rgba(253,230,138,0.7)]"
                style={{ width: s.size, height: s.size, marginTop: -s.size / 2, marginLeft: -s.size / 2 }}
              />
            </div>
          ))}
        </m.div>
      </m.div>
    </div>
  );
}

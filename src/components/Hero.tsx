"use client";

import { useEffect, useRef, useState } from "react";
import { m, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { site, skillGroups } from "@/data/site";
import { BlackHole } from "./BlackHole";
import { whatsappUrl } from "./socials";
import { CountUp } from "./ui/CountUp";
import { LiquidButton } from "./ui/liquid-glass-button";
import { MagneticButton } from "./ui/MagneticButton";

const ease = [0.16, 1, 0.3, 1] as const;

// One intro sequence, played in order: logo (navbar) → badge → greeting → name → title → buttons → stats.
const intro = { badge: 0.1, greeting: 0.2, name: 0.35, title: 0.85, buttons: 1.2, stats: 1.35 };
const titleWords = (text: string) => text.split(" ");

const skillCount = skillGroups.reduce((n, g) => n + g.skills.length, 0);

const stats = [
  { value: `${site.yearsExperience}+`, label: "Years experience" },
  { value: `${skillCount}+`, label: "Technologies" },
  { value: "100%", label: "Mobile responsive" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  const { scrollY: rawScrollY } = useScroll();
  // Smooth out the scroll value so parallax glides instead of jumping.
  const scrollY = useSpring(rawScrollY, { stiffness: 80, damping: 22, mass: 0.6 });
  const glowY = useTransform(scrollY, [0, 600], [0, 140]);
  const sceneY = useTransform(scrollY, [0, 700], [0, 120]);
  const sceneScale = useTransform(scrollY, [0, 700], [1, 0.85]);
  const sceneOpacity = useTransform(scrollY, [0, 600], [1, 0.2]);

  // Pause the black hole animation when the hero is scrolled out of view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16 lg:pt-24"
    >
      {/* Background: grid + moving aurora glow */}
      <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
      <m.div style={{ y: glowY }} className="absolute inset-0 -z-10 will-change-transform" aria-hidden>
        <div className="glow-drift-a absolute top-[-15%] left-[20%] h-[560px] w-[560px] bg-[radial-gradient(closest-side,rgb(245_158_11/0.31),transparent)]" />
        <div className="glow-drift-b absolute right-[-10%] bottom-[5%] h-[420px] w-[420px] bg-[radial-gradient(closest-side,rgb(217_119_6/0.19),transparent)]" />
      </m.div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-4 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
        {/* Black hole — above the text on phones, on the right on large screens */}
        <m.div
          style={{ y: sceneY, scale: sceneScale, opacity: sceneOpacity }}
          className="relative flex w-full items-center justify-center py-2 will-change-[transform,opacity] lg:order-2 lg:py-8"
        >
          <m.div
            className="w-full"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.2, ease }}
          >
            <BlackHole active={inView} />
          </m.div>
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.3, ease }}
            className="pointer-events-none absolute right-0 bottom-6 hidden items-center gap-2 rounded-xl border border-line bg-surface-2 px-4 py-2.5 text-sm shadow-xl lg:flex"
          >
            <MapPin className="h-4 w-4 text-gold" aria-hidden />
            Based in {site.location}
          </m.div>
        </m.div>

        <div className="relative text-center lg:order-1 lg:text-left">
          <p
            style={{ animationDelay: `${intro.badge}s` }}
            className="hero-in mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-muted"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            Available for new projects
          </p>

          <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl md:text-7xl">
            <span className="hero-in block text-muted" style={{ animationDelay: `${intro.greeting}s` }}>
              Hi, I&apos;m
            </span>{" "}
            <span className="inline-block pb-2 [perspective:600px]">
              {site.name.split("").map((char, i) => (
                <m.span
                  key={i}
                  className="hero-letter text-gradient inline-block"
                  style={{ animationDelay: `${intro.name + i * 0.07}s` }}
                  whileHover={{ y: -8, rotateY: 18, transition: { type: "spring", stiffness: 220, damping: 14 } }}
                >
                  {char}
                </m.span>
              ))}
            </span>{" "}
            <span className="mt-4 block text-xl font-medium tracking-normal text-gold sm:text-2xl">
              {titleWords(`${site.title} in ${site.city}`).map((word, i, words) => (
                <span key={i}>
                  <span className="hero-word inline-block" style={{ animationDelay: `${intro.title + i * 0.06}s` }}>
                    {word}
                  </span>
                  {i < words.length - 1 && " "}
                </span>
              ))}
            </span>
          </h1>

          <p
            className="hero-rise mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted lg:mx-0"
          >
            {site.tagline}
          </p>

          <div
            style={{ animationDelay: `${intro.buttons}s` }}
            className="hero-in mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <MagneticButton className="w-full sm:w-auto">
              <LiquidButton asChild size="xl" className="w-full sm:w-auto">
                <a href="#projects">
                  View my work
                  <ArrowRight className="transition-transform duration-300 group-hover/liquid:translate-x-1" aria-hidden />
                </a>
              </LiquidButton>
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto">
              <LiquidButton asChild size="xl" className="w-full sm:w-auto">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="text-emerald-400" aria-hidden />
                  Chat on WhatsApp
                </a>
              </LiquidButton>
            </MagneticButton>
          </div>

          <dl
            style={{ animationDelay: `${intro.stats}s` }}
            className="hero-in mt-12 grid grid-cols-3 gap-4 border-t border-line pt-8"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="text-xs text-muted sm:text-sm">{s.label}</dt>
                <dd className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                  <CountUp value={s.value} delay={intro.stats} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

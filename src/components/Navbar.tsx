"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useScroll, useSpring, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { site } from "@/data/site";
import { LiquidButton } from "./ui/liquid-glass-button";
import { MagneticButton } from "./ui/MagneticButton";

const UNDERLINE_BASE = 100; // px — the underline is scaled from this width, so it only ever moves by transform

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

// Section links (#about…) point at the home page; on other pages they need a "/" in front.
// Every page has a contact section, so "#contact" always stays on the current page.
const resolveHref = (href: string, onHome: boolean) =>
  href.startsWith("#") && !onHome && href !== "#contact" ? `/${href}` : href;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const pathname = usePathname();
  const onHome = pathname === "/";
  const isActive = (href: string) =>
    href.startsWith("/") ? pathname.startsWith(href) : onHome && active === href;
  const lenis = useLenis();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // Gold underline that slides to the active link.
  const listRef = useRef<HTMLUListElement>(null);
  const lineSpring = { stiffness: 380, damping: 34 };
  const lineX = useSpring(0, lineSpring);
  const lineW = useSpring(0, lineSpring);
  const lineOpacity = useSpring(0, { stiffness: 200, damping: 30 });
  const lineScale = useTransform(lineW, (w) => w / UNDERLINE_BASE);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      // The last section is short, so mark it active once the page bottom is reached.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) setActive("#contact");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => {
      observer.disconnect();
      setActive("");
    };
  }, [pathname]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const place = () => {
      const link = list.querySelector<HTMLElement>("a[data-active]");
      if (!link) return lineOpacity.set(0);
      const x = link.offsetLeft + 12;
      const w = link.offsetWidth - 24;
      // First appearance: start in place instead of sliding in from the left edge.
      if (lineOpacity.get() < 0.05) {
        lineX.jump(x);
        lineW.jump(w);
      } else {
        lineX.set(x);
        lineW.set(w);
      }
      lineOpacity.set(1);
    };
    place();
    // Re-measure when fonts load or the window resizes.
    const resize = new ResizeObserver(place);
    resize.observe(list);
    return () => resize.disconnect();
  }, [active, pathname, lineX, lineW, lineOpacity]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <m.div
        className="absolute inset-x-0 top-0 h-0.5 origin-left will-change-transform bg-gradient-to-r from-accent to-gold"
        style={{ scaleX: progress }}
        aria-hidden
      />
      <nav
        className={`mx-3 mt-3 flex max-w-6xl origin-top items-center justify-between rounded-2xl border px-4 py-3 transition-[transform,background-color,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:mx-auto sm:px-6 ${
          scrolled || open
            ? "-translate-y-1 scale-[0.97] border-line bg-bg/70 shadow-lg shadow-black/30 backdrop-blur-md"
            : "border-transparent"
        }`}
        aria-label="Main"
      >
        <Link
          href={onHome ? "#top" : "/"}
          className={`font-display text-lg font-semibold tracking-tight ${onHome ? "hero-in" : ""}`}
          onClick={() => setOpen(false)}
          aria-label={`${site.brand} — home`}
        >
          {site.brand}
          <span className="text-accent-soft">.</span>
        </Link>

        <ul ref={listRef} className="relative hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={resolveHref(link.href, onHome)}
                data-active={isActive(link.href) || undefined}
                aria-current={isActive(link.href) ? (link.href.startsWith("/") ? "page" : "true") : undefined}
                className={`relative rounded-lg px-3 py-2 text-sm transition-colors duration-300 ${
                  isActive(link.href) ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <m.li
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-0.5 origin-left bg-gradient-to-r from-gold to-gold-soft"
            style={{ x: lineX, scaleX: lineScale, opacity: lineOpacity, width: UNDERLINE_BASE }}
          />
        </ul>

        <MagneticButton className="hidden md:inline-flex" max={6}>
          <LiquidButton asChild size="default">
            <a href="#contact">Hire me</a>
          </LiquidButton>
        </MagneticButton>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-xl text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            className="mx-3 mt-2 rounded-2xl border border-line bg-bg p-3 md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="flex flex-col">
              {links.map((link, i) => (
                <m.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={resolveHref(link.href, onHome)}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base text-ink transition-colors hover:bg-surface-2"
                  >
                    {link.label}
                  </a>
                </m.li>
              ))}
            </ul>
            <LiquidButton asChild size="xl" className="mt-2 flex w-full">
              <a href="#contact" onClick={() => setOpen(false)}>
                Hire me
              </a>
            </LiquidButton>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

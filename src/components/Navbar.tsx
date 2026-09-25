"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { site } from "@/data/site";

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
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-accent to-gold"
        style={{ scaleX: progress }}
        aria-hidden
      />
      <nav
        className={`mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 ${
          scrolled || open
            ? "mx-3 border border-line bg-bg/75 shadow-lg shadow-black/30 backdrop-blur-xl sm:mx-auto"
            : "border border-transparent"
        }`}
        aria-label="Main"
      >
        <Link
          href={onHome ? "#top" : "/"}
          className="font-display text-lg font-semibold tracking-tight"
          onClick={() => setOpen(false)}
          aria-label={`${site.brand} — home`}
        >
          {site.brand}
          <span className="text-accent-soft">.</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={resolveHref(link.href, onHome)}
                className={`relative rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive(link.href) ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-0 -z-10 rounded-lg bg-surface-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive(link.href) ? "scale-100 opacity-100" : "scale-90 opacity-0"
                  }`}
                />
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-xl btn-primary px-4 py-2 text-sm font-semibold md:inline-flex"
        >
          Hire me
        </a>

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
            className="mx-3 mt-2 rounded-2xl border border-line bg-bg/95 p-3 backdrop-blur-xl md:hidden"
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
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-xl btn-primary px-4 py-3 text-center font-semibold"
            >
              Hire me
            </a>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

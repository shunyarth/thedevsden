import Link from "next/link";
import { AppWindow, ArrowRight, Check, Globe, ShoppingCart } from "lucide-react";
import { services } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { SpotlightCard } from "./ui/SpotlightCard";

const icons = { globe: Globe, app: AppWindow, cart: ShoppingCart };

export function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Services"
          title="Website, web app & e-commerce development"
          description="From your first website to a full online business — built to look great and work flawlessly."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, i) => {
            const Icon = icons[service.icon];
            return (
              <div
                key={service.title}
                data-reveal
                style={{ "--reveal-delay": `${i * 0.15}s`, "--reveal-y": "48px" } as React.CSSProperties}
              >
                <SpotlightCard className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface/60 p-7 transition-colors duration-500 hover:bg-surface">
                <div
                  className="absolute -top-16 -right-16 h-40 w-40 bg-[radial-gradient(closest-side,rgb(245_158_11/0.13),transparent)]"
                  aria-hidden
                />
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-soft via-gold to-accent-strong text-bg shadow-lg shadow-accent/30">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="font-display text-2xl font-semibold">{service.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{service.description}</p>
                <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm text-ink">
                      <Check className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={service.href}
                  className="group/link mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-gold transition-colors hover:text-gold-soft"
                >
                  Learn more about {service.title.toLowerCase()}
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" aria-hidden />
                </Link>
                </SpotlightCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

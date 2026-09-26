import { Gauge, HeartHandshake, Smartphone, Sparkles } from "lucide-react";
import { site } from "@/data/site";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "./ui/TiltCard";

const values = [
  { Icon: Smartphone, title: "Mobile-first", text: "Looks great on every phone, tablet and laptop." },
  { Icon: Gauge, title: "Fast & optimised", text: "Quick loading pages that keep visitors engaged." },
  { Icon: Sparkles, title: "Modern design", text: "Clean, premium interfaces that build trust." },
  { Icon: HeartHandshake, title: "Easy to work with", text: "Clear communication from start to launch." },
];

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="About me" title="A web developer in Ahmedabad building websites people love" />

        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal className="space-y-5 text-lg leading-relaxed text-muted">
            {site.about.map((p, i) => (
              <p key={i} className={i === 0 ? "text-ink" : undefined}>
                {p}
              </p>
            ))}
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08} className="h-full">
                <TiltCard max={8} className="glow-border h-full rounded-2xl border border-line bg-surface/60 p-5 transition-colors hover:bg-surface">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent-soft">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

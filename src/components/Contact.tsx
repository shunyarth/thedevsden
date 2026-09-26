import { Mail, MessageCircle } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { BackgroundPaths } from "./ui/background-paths";
import { gmailComposeUrl, socialLinks, whatsappUrl } from "./socials";
import { LiquidButton } from "./ui/liquid-glass-button";
import { MagneticButton } from "./ui/MagneticButton";

export function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-line bg-surface/70 px-6 py-16 text-center sm:px-12 md:py-24">
            <div className="grid-bg absolute inset-0 -z-10 opacity-60" aria-hidden />
            <BackgroundPaths />
            <div
              className="absolute -top-24 left-1/2 -z-10 h-72 w-[36rem] max-w-full -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(245_158_11/0.31),transparent)]"
              aria-hidden
            />
            <div
              className="absolute -bottom-32 left-1/2 -z-10 h-64 w-[28rem] max-w-full -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(217_119_6/0.13),transparent)]"
              aria-hidden
            />

            <p className="mb-4 text-xs font-medium tracking-[0.18em] text-gold uppercase">Contact</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              Let&apos;s build something <span className="text-gradient">great together</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted">
              Have a project in mind or just want to say hi? Send me a message — I&apos;ll get back to you quickly.
            </p>

            <div className="mx-auto mt-10 flex max-w-md flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row md:mt-12">
              <MagneticButton className="w-full sm:w-auto">
                <LiquidButton asChild size="xxl" className="w-full sm:w-auto">
                  <a href={whatsappUrl} data-paths-boost target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-5 text-emerald-400" aria-hidden />
                    Chat on WhatsApp
                  </a>
                </LiquidButton>
              </MagneticButton>
              <MagneticButton className="w-full sm:w-auto">
                <LiquidButton asChild size="xxl" className="w-full sm:w-auto">
                  <a href={gmailComposeUrl} data-paths-boost target="_blank" rel="noopener noreferrer">
                    <Mail className="size-5" aria-hidden />
                    Send an email
                  </a>
                </LiquidButton>
              </MagneticButton>
            </div>

            {socialLinks.length > 0 && (
              <ul className="mt-10 flex flex-wrap justify-center gap-3" aria-label="Social links">
                {socialLinks.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-bg/60 text-muted transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-ink"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, ChevronDown, Mail, MessageCircle } from "lucide-react";
import { servicePages, type ServicePage } from "@/data/servicePages";
import { site } from "@/data/site";
import { ogImages, serviceJsonLd, twitterImages } from "@/lib/seo";
import { Contact } from "./Contact";
import { JsonLd } from "./JsonLd";
import { Reveal } from "./Reveal";
import { gmailComposeUrl, whatsappUrl } from "./socials";

export function serviceMetadata(page: ServicePage): Metadata {
  const path = `/${page.slug}`;
  return {
    title: { absolute: page.seoTitle },
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title: page.seoTitle, description: page.description, images: ogImages },
    twitter: { card: "summary_large_image", title: page.seoTitle, description: page.description, images: twitterImages },
  };
}

export function ServicePageView({ page }: { page: ServicePage }) {
  const others = servicePages.filter((p) => p.slug !== page.slug);

  return (
    <main>
      <JsonLd data={serviceJsonLd(page)} />

      {/* Page header */}
      <section id="top" className="relative isolate overflow-hidden pt-32 pb-16 sm:pt-40 md:pb-20">
        <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
        <div
          className="absolute top-[-20%] left-1/2 -z-10 h-[480px] w-[640px] max-w-full -translate-x-1/2 rounded-full bg-accent/20 blur-[130px]"
          aria-hidden
        />
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
            <ol className="inline-flex items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-gold">
                {page.name}
              </li>
            </ol>
          </nav>
          <h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
            {page.h1}
          </h1>
          <div className="mx-auto mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-pretty text-muted">
            {page.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-7 py-4 font-semibold text-white shadow-lg shadow-emerald-600/25 transition duration-500 hover:bg-emerald-500 sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Discuss your project on WhatsApp
            </a>
            <a
              href={gmailComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl btn-primary px-7 py-4 font-semibold sm:w-auto"
            >
              <Mail className="h-5 w-5" aria-hidden />
              Send an email
            </a>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-3xl space-y-14 px-4 pb-8 sm:px-6">
        {page.sections.map((section) => (
          <Reveal key={section.heading}>
            <section>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{section.heading}</h2>
              {section.paragraphs?.map((p, i) => (
                <p key={i} className="mt-4 text-lg leading-relaxed text-muted">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-5 space-y-3">
                  {section.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-base leading-relaxed text-ink">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-gold" aria-hidden />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </Reveal>
        ))}
      </div>

      {/* FAQs */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6" aria-labelledby="faq-heading">
        <Reveal>
          <h2 id="faq-heading" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface/60">
            {page.faqs.map((faq) => (
              <details key={faq.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-medium transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base sm:text-lg">{faq.q}</h3>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-gold transition-transform duration-300 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="px-6 pb-6 leading-relaxed text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Other services */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6" aria-labelledby="more-services">
        <h2 id="more-services" className="font-display text-xl font-semibold">
          Other services by {site.brand}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {others.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="glow-border group flex items-center justify-between rounded-2xl border border-line bg-surface/60 p-5 transition-colors duration-500 hover:bg-surface"
            >
              <span className="font-medium">{p.name}</span>
              <ArrowRight className="h-4 w-4 text-gold transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      <Contact />
    </main>
  );
}

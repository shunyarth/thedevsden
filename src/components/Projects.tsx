"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "./TiltCard";

export function Projects() {
  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Projects"
          title="Websites & web apps I've built"
          description="A few projects I've designed and built — from business websites to full web apps."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <m.article
              key={project.title}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1.1, delay: (i % 2) * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={"featured" in project && project.featured ? "md:col-span-2" : undefined}
            >
              <TiltCard
                max={"featured" in project && project.featured ? 4 : 7}
                className={`group glow-border flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface/60 transition-colors duration-500 hover:bg-surface ${
                  "featured" in project && project.featured ? "md:flex-row" : ""
                }`}
              >
              <div
                className={`relative aspect-[16/10] overflow-hidden bg-surface-2 ${
                  "featured" in project && project.featured ? "md:aspect-auto md:w-[58%]" : ""
                }`}
              >
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  unoptimized={project.image.endsWith(".svg")}
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />
                {"featured" in project && project.featured && (
                  <span className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-gold to-gold-soft px-3 py-1 text-xs font-semibold text-bg shadow-lg">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="font-display text-xl font-semibold sm:text-2xl">{project.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{project.description}</p>

                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
                  {project.tags.map((tag) => (
                    <li key={tag} className="rounded-md bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent-soft">
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl btn-primary px-5 py-3 text-sm font-semibold"
                    >
                      View live site
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm text-muted">
                      Live link coming soon
                    </span>
                  )}
                </div>
              </div>
              </TiltCard>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}

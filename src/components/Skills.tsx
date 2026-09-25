"use client";

import { m } from "framer-motion";
import { skillGroups } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div
        className="absolute inset-x-0 top-1/3 -z-10 mx-auto h-72 max-w-3xl rounded-full bg-accent/10 blur-[120px]"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Skills"
          title="Web development skills & tools"
          description="The technologies I use to design, build and launch complete websites and web apps."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, gi) => (
            <m.div
              key={group.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1, delay: (gi % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`glow-border rounded-2xl border border-line bg-surface/60 p-6 backdrop-blur ${
                gi === skillGroups.length - 1 && skillGroups.length % 3 === 1 ? "lg:col-start-2" : ""
              }`}
            >
              <h3 className="mb-4 text-xs font-semibold tracking-[0.16em] text-accent-soft uppercase">
                {group.title}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill, si) => (
                  <m.li
                    key={skill}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.25 + si * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, transition: { type: "spring", stiffness: 260, damping: 22 } }}
                    className="rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-sm whitespace-nowrap text-ink transition-colors duration-500 hover:border-gold/50 hover:text-gold-soft"
                  >
                    {skill}
                  </m.li>
                ))}
              </ul>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

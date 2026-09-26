import { skillGroups } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div
        className="absolute inset-x-0 top-1/3 -z-10 mx-auto h-72 max-w-3xl bg-[radial-gradient(closest-side,rgb(245_158_11/0.13),transparent)]"
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
            <div
              key={group.title}
              data-reveal
              style={{ "--reveal-delay": `${(gi % 3) * 0.12}s`, "--reveal-y": "36px" } as React.CSSProperties}
              className={`glow-border rounded-2xl border border-line bg-surface/60 p-6 ${
                gi === skillGroups.length - 1 && skillGroups.length % 3 === 1 ? "lg:col-start-2" : ""
              }`}
            >
              <h3 className="mb-4 text-xs font-semibold tracking-[0.16em] text-accent-soft uppercase">
                {group.title}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill, si) => (
                  <li
                    key={skill}
                    style={{ "--i": si } as React.CSSProperties}
                    className="chip rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-sm whitespace-nowrap text-ink hover:border-gold/50 hover:text-gold-soft"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

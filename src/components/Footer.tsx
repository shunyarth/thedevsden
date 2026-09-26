import Link from "next/link";
import { site } from "@/data/site";
import { servicePages } from "@/data/servicePages";
import { gmailComposeUrl, socialLinks, whatsappUrl } from "./socials";
import { BackToTop } from "./BackToTop";
import { CopyButton } from "./ui/CopyButton";

export function Footer() {
  return (
    <footer className="border-t border-line pt-14 pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-display text-lg font-semibold tracking-tight">
              {site.brand}
              <span className="text-accent-soft">.</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {site.name} — {site.title.toLowerCase()} in {site.city}, {site.country}. Websites, web apps and online
              stores for businesses across India.
            </p>
          </div>

          <nav aria-label="Services">
            <h2 className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">Services</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {servicePages.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="text-muted transition-colors hover:text-ink">
                    {p.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/blog" className="text-muted transition-colors hover:text-ink">
                  Blog
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">Get in touch</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5">
                <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-ink">
                  {site.contact.email}
                </a>
                <CopyButton text={site.contact.email} label="Copy email address" />
              </li>
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-ink">
                  WhatsApp: {site.contact.whatsappDisplay}
                </a>
              </li>
              <li className="text-muted">
                {site.city}, {site.region}, {site.country}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-sm text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.brand} · {site.name}. Designed &amp; built with care.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition-colors hover:text-ink"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}

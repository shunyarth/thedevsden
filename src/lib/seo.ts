import { site } from "@/data/site";
import { servicePages, type ServicePage } from "@/data/servicePages";

export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();

// Pages that set their own openGraph/twitter text must list the preview image again,
// otherwise Next.js replaces the site-wide one.
const previewAlt = `${site.brand} — ${site.name}, ${site.title} in ${site.city}, India`;
export const ogImages = [{ url: "/opengraph-image", width: 1200, height: 630, alt: previewAlt }];
export const twitterImages = [{ url: "/twitter-image", width: 1200, height: 630, alt: previewAlt }];

export const PERSON_ID = absoluteUrl("/#person");
export const BUSINESS_ID = absoluteUrl("/#business");
export const WEBSITE_ID = absoluteUrl("/#website");

export const defaultKeywords = [
  "web developer in Ahmedabad",
  "website developer in Ahmedabad",
  "website developer India",
  "freelance web developer",
  "Shopify developer",
  "WordPress developer",
  "WooCommerce developer",
  "web app developer for small business",
  "Next.js developer",
  "React developer",
  "ecommerce website development",
  "devsden",
  "Keyur web developer",
];

const address = {
  "@type": "PostalAddress",
  addressLocality: site.city,
  addressRegion: site.region,
  addressCountry: "IN",
};

// Site-wide structured data: who you are (Person), your business (ProfessionalService) and the website.
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: site.name,
        jobTitle: site.title,
        description: site.tagline,
        url: site.url,
        email: `mailto:${site.contact.email}`,
        telephone: site.contact.phone,
        address,
        worksFor: { "@id": BUSINESS_ID },
        knowsAbout: [
          "Web development",
          "Website design",
          "Web application development",
          "E-commerce development",
          "Shopify",
          "WordPress",
          "WooCommerce",
          "React",
          "Next.js",
          "Node.js",
          "SEO",
        ],
        sameAs: Object.values(site.socials).filter(Boolean),
      },
      {
        "@type": "ProfessionalService",
        "@id": BUSINESS_ID,
        name: site.brand,
        alternateName: `${site.brand} — ${site.name}, ${site.title}`,
        description: `${site.brand} is the web development studio of ${site.name}, a ${site.title.toLowerCase()} in ${site.city} building websites, web apps and e-commerce stores for businesses across India.`,
        url: site.url,
        image: absoluteUrl("/opengraph-image"),
        logo: absoluteUrl("/icon.svg"),
        email: site.contact.email,
        telephone: site.contact.phone,
        address,
        founder: { "@id": PERSON_ID },
        areaServed: [
          { "@type": "City", name: site.city },
          { "@type": "Country", name: site.country },
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: site.contact.email,
          telephone: site.contact.phone,
          availableLanguage: ["English", "Hindi", "Gujarati"],
          areaServed: "IN",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Web development services",
          itemListElement: servicePages.map((p) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: p.name, url: absoluteUrl(`/${p.slug}`) },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: site.url,
        name: site.brand,
        publisher: { "@id": BUSINESS_ID },
        inLanguage: "en-IN",
      },
    ],
  };
}

export function serviceJsonLd(page: ServicePage) {
  const url = absoluteUrl(`/${page.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.name,
        serviceType: page.name,
        description: page.description,
        url,
        provider: { "@id": BUSINESS_ID },
        areaServed: [
          { "@type": "City", name: site.city },
          { "@type": "Country", name: site.country },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: page.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: page.name, path: `/${page.slug}` },
      ]),
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

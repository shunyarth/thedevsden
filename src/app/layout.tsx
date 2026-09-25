import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { site } from "@/data/site";
import { defaultKeywords, siteJsonLd } from "@/lib/seo";
import { MotionProvider } from "@/components/MotionProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const defaultTitle = `${site.name} — ${site.title} in ${site.city}, India | ${site.brand}`;
const defaultDescription = `Freelance web developer in ${site.city}. ${site.name} (${site.brand}) builds fast, SEO-ready websites, web apps and Shopify & WordPress stores across India.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: defaultTitle,
    template: `%s | ${site.brand}`,
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  applicationName: site.brand,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.brand,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.brand,
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "technology",
  // Google Search Console ownership check
  verification: {
    google: "nV28dXM6eHhsegmWuGjDidqbP-fIxNKewthslbW86Ds",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0806",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
      <body className="min-h-screen overflow-x-hidden">
        <JsonLd data={siteJsonLd()} />
        <MotionProvider>
          <Navbar />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}

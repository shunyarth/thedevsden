import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate, getAllPosts } from "@/lib/blog";
import { site } from "@/data/site";
import { Contact } from "@/components/Contact";
import { ogImages, twitterImages } from "@/lib/seo";

const posts = getAllPosts();

const title = "Blog — Web Development Tips for Businesses";
const description = `Practical guides on websites, Shopify, WordPress, web apps and SEO for small businesses in ${site.city} and across India, by ${site.name} (${site.brand}).`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", url: "/blog", title, description, images: ogImages },
  twitter: { card: "summary_large_image", title, description, images: twitterImages },
};

export default function BlogPage() {
  return (
    <main>
      <section id="top" className="relative isolate overflow-hidden pt-32 pb-12 sm:pt-40">
        <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-3 text-xs font-medium tracking-[0.18em] text-gold uppercase">Blog</p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Web development tips for growing businesses
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-pretty text-muted">
            Simple, practical articles about websites, online stores, web apps and getting found on Google.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-8 sm:px-6" aria-label="Articles">
        {posts.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface/60 p-8 text-center text-muted">
            The first articles are on their way — check back soon.
          </p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="glow-border group block rounded-2xl border border-line bg-surface/60 p-6 transition-colors duration-500 hover:bg-surface"
                >
                  <p className="text-sm text-muted">
                    <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
                  </p>
                  <h2 className="mt-2 font-display text-xl font-semibold sm:text-2xl">{post.title}</h2>
                  {post.description && <p className="mt-2 leading-relaxed text-muted">{post.description}</p>}
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                    Read article
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Contact />
    </main>
  );
}

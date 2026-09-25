import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";
import { site } from "@/data/site";
import { BUSINESS_ID, PERSON_ID, absoluteUrl, breadcrumbJsonLd, ogImages, twitterImages } from "@/lib/seo";
import { Contact } from "@/components/Contact";
import { JsonLd } from "@/components/JsonLd";

// Only the articles in /content/blog exist; any other address shows the 404 page.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [site.name],
      tags: post.tags,
      images: ogImages,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: twitterImages },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const url = absoluteUrl(`/blog/${post.slug}`);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${url}#article`,
              headline: post.title,
              description: post.description,
              datePublished: post.date,
              dateModified: post.updated ?? post.date,
              url,
              mainEntityOfPage: url,
              image: absoluteUrl("/opengraph-image"),
              keywords: post.tags.join(", "),
              author: { "@id": PERSON_ID },
              publisher: { "@id": BUSINESS_ID },
              inLanguage: "en-IN",
            },
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ],
        }}
      />
      <article id="top" className="mx-auto max-w-3xl px-4 pt-32 pb-8 sm:px-6 sm:pt-40">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/blog" className="transition-colors hover:text-ink">
                Blog
              </Link>
            </li>
          </ol>
        </nav>
        <h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-muted">
          By {site.name} · <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
        </p>
        <div className="article-body mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      <Contact />
    </main>
  );
}

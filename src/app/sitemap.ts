import type { MetadataRoute } from "next";
import { servicePages } from "@/data/servicePages";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getAllPosts();

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...servicePages.map((p) => ({
      url: absoluteUrl(`/${p.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    // The blog is listed once it has at least one published article.
    ...(posts.length
      ? [
          { url: absoluteUrl("/blog"), lastModified: new Date(posts[0].date), changeFrequency: "weekly" as const, priority: 0.7 },
          ...posts.map((post) => ({
            url: absoluteUrl(`/blog/${post.slug}`),
            lastModified: new Date(post.updated ?? post.date),
            changeFrequency: "yearly" as const,
            priority: 0.6,
          })),
        ]
      : []),
  ];
}

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

// Blog articles live in /content/blog as Markdown (.md) files.
// Files starting with "_" (like _template.md) are ignored.
const BLOG_DIR = join(process.cwd(), "content", "blog");

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  readingMinutes: number;
  html: string;
};

// Reads the small settings block at the top of each file:
// ---
// title: My article
// ---
function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {} as Record<string, string>, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    data[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  return { data, body: match[2] };
}

function readPost(file: string): (BlogPost & { draft: boolean }) | null {
  const { data, body } = parseFrontmatter(readFileSync(join(BLOG_DIR, file), "utf8"));
  if (!data.title || !data.date) return null;
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title,
    description: data.description ?? "",
    date: data.date,
    updated: data.updated || undefined,
    tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    readingMinutes: Math.max(1, Math.round(words / 200)),
    html: marked.parse(body, { async: false }),
    draft: data.draft === "true",
  };
}

export function getAllPosts(): BlogPost[] {
  let files: string[] = [];
  try {
    files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  } catch {
    return [];
  }
  return files
    .map(readPost)
    .filter((p): p is BlogPost & { draft: boolean } => p !== null && !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) {
  return getAllPosts().find((p) => p.slug === slug);
}

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

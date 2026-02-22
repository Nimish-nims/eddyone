import path from "path";
import crypto from "crypto";

// ── Types ──────────────────────────────────────────────

export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  coverImage: string;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  content: string;
  tags: string[];
  coverImage: string;
  status: BlogStatus;
}

// ── Constants ──────────────────────────────────────────

export const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");

// ── Helpers ────────────────────────────────────────────

export function generateId(): string {
  return crypto.randomUUID();
}

export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  const suffix = crypto.randomBytes(3).toString("hex").slice(0, 4);
  return `${base}-${suffix}`;
}

export function generateExcerpt(
  content: string,
  maxLength: number = 160
): string {
  // Strip HTML tags to get plain text
  const plain = content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

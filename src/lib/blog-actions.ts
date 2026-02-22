"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import {
  BlogPost,
  BlogFormData,
  BLOGS_DIR,
  generateId,
  generateSlug,
  generateExcerpt,
} from "./blog";

// ── Internal Helpers ───────────────────────────────────

async function ensureBlogsDir() {
  await fs.mkdir(BLOGS_DIR, { recursive: true });
}

// ── Read Operations ────────────────────────────────────

export async function getAllBlogs(): Promise<BlogPost[]> {
  await ensureBlogsDir();

  const files = await fs.readdir(BLOGS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  const blogs = await Promise.all(
    jsonFiles.map(async (file) => {
      const content = await fs.readFile(path.join(BLOGS_DIR, file), "utf-8");
      return JSON.parse(content) as BlogPost;
    })
  );

  return blogs.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  const all = await getAllBlogs();
  return all.filter((blog) => blog.status === "published");
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  await ensureBlogsDir();

  try {
    const filePath = path.join(BLOGS_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as BlogPost;
  } catch {
    return null;
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getAllBlogs();
  return all.find((blog) => blog.slug === slug) ?? null;
}

// ── Write Operations ───────────────────────────────────

export async function createBlog(data: BlogFormData): Promise<BlogPost> {
  await ensureBlogsDir();

  const now = new Date().toISOString();
  const blog: BlogPost = {
    id: generateId(),
    slug: generateSlug(data.title),
    title: data.title,
    content: data.content,
    excerpt: generateExcerpt(data.content),
    tags: data.tags,
    coverImage: data.coverImage,
    status: data.status,
    createdAt: now,
    updatedAt: now,
  };

  const filePath = path.join(BLOGS_DIR, `${blog.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(blog, null, 2), "utf-8");

  revalidatePath("/blogs");
  revalidatePath("/admin/blogs");

  return blog;
}

export async function updateBlog(
  id: string,
  data: BlogFormData
): Promise<BlogPost> {
  const existing = await getBlogById(id);
  if (!existing) {
    throw new Error(`Blog with id "${id}" not found`);
  }

  const titleChanged = existing.title !== data.title;

  const updated: BlogPost = {
    ...existing,
    title: data.title,
    content: data.content,
    excerpt: generateExcerpt(data.content),
    tags: data.tags,
    coverImage: data.coverImage,
    status: data.status,
    slug: titleChanged ? generateSlug(data.title) : existing.slug,
    updatedAt: new Date().toISOString(),
  };

  const filePath = path.join(BLOGS_DIR, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");

  revalidatePath("/blogs");
  revalidatePath(`/blogs/${existing.slug}`);
  revalidatePath(`/blogs/${updated.slug}`);
  revalidatePath("/admin/blogs");

  return updated;
}

export async function deleteBlog(id: string): Promise<void> {
  await ensureBlogsDir();

  const filePath = path.join(BLOGS_DIR, `${id}.json`);
  await fs.unlink(filePath);

  revalidatePath("/blogs");
  revalidatePath("/admin/blogs");
}

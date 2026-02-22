"use server";

import { revalidatePath } from "next/cache";
import {
  BlogPost,
  BlogFormData,
  generateId,
  generateSlug,
  generateExcerpt,
} from "./blog";
import {
  storageListBlogs,
  storageGetBlog,
  storagePutBlog,
  storageDeleteBlog,
} from "./blog-storage";

// ── Read Operations ────────────────────────────────────

export async function getAllBlogs(): Promise<BlogPost[]> {
  return storageListBlogs();
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  const all = await getAllBlogs();
  return all.filter((blog) => blog.status === "published");
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  return storageGetBlog(id);
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getAllBlogs();
  return all.find((blog) => blog.slug === slug) ?? null;
}

// ── Write Operations ────────────────────────────────────

export async function createBlog(data: BlogFormData): Promise<BlogPost> {
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

  await storagePutBlog(blog);

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

  await storagePutBlog(updated);

  revalidatePath("/blogs");
  revalidatePath(`/blogs/${existing.slug}`);
  revalidatePath(`/blogs/${updated.slug}`);
  revalidatePath("/admin/blogs");

  return updated;
}

export async function deleteBlog(id: string): Promise<void> {
  await storageDeleteBlog(id);

  revalidatePath("/blogs");
  revalidatePath("/admin/blogs");
}

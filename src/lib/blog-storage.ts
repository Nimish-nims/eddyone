/**
 * Blog storage backed by Supabase.
 *
 * Table: blogs (see SQL in plan file or README)
 * Columns use snake_case; BlogPost interface uses camelCase.
 */

import { supabase } from "./supabase";
import type { BlogPost } from "./blog";

// ── Row ↔ BlogPost mapping ────────────────────────────

interface BlogRow {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  cover_image: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function rowToPost(row: BlogRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    tags: row.tags ?? [],
    coverImage: row.cover_image,
    status: row.status as BlogPost["status"],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function postToRow(blog: BlogPost): BlogRow {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    content: blog.content,
    excerpt: blog.excerpt,
    tags: blog.tags,
    cover_image: blog.coverImage,
    status: blog.status,
    created_at: blog.createdAt,
    updated_at: blog.updatedAt,
  };
}

// ── Public API (same shape as before) ──────────────────

export async function storageListBlogs(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase storageListBlogs error:", error.message);
    return [];
  }

  return (data as BlogRow[]).map(rowToPost);
}

export async function storageGetBlog(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return rowToPost(data as BlogRow);
}

export async function storagePutBlog(blog: BlogPost): Promise<void> {
  const row = postToRow(blog);

  const { error } = await supabase.from("blogs").upsert(row, {
    onConflict: "id",
  });

  if (error) {
    console.error("Supabase storagePutBlog error:", error.message);
    throw new Error(`Failed to save blog: ${error.message}`);
  }
}

export async function storageDeleteBlog(id: string): Promise<void> {
  const { error } = await supabase.from("blogs").delete().eq("id", id);

  if (error) {
    console.error("Supabase storageDeleteBlog error:", error.message);
  }
}

/**
 * Blog storage: uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set (e.g. on Vercel),
 * otherwise uses the local filesystem (content/blogs) for development.
 */

import fs from "fs/promises";
import path from "path";
import { list, get, put, del } from "@vercel/blob";
import type { BlogPost } from "./blog";

const BLOB_PREFIX = "blogs";
const FS_BLOGS_DIR = path.join(process.cwd(), "content", "blogs");

function useBlobStorage(): boolean {
  return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}

async function ensureBlogsDir(): Promise<void> {
  if (useBlobStorage()) return;
  await fs.mkdir(FS_BLOGS_DIR, { recursive: true });
}

function blobPathname(id: string): string {
  return `${BLOB_PREFIX}/${id}.json`;
}

/** Read stream into string (for Vercel Blob get) */
async function streamToText(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  const buffer = Buffer.concat(chunks);
  return buffer.toString("utf-8");
}

// ── Public API (same shape for both backends) ───────────────────────────────

export async function storageListBlogs(): Promise<BlogPost[]> {
  if (useBlobStorage()) {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}/` });
    const blogs = await Promise.all(
      blobs.map(async (b) => {
        const result = await get(b.pathname, { access: "private" });
        if (!result || result.statusCode !== 200 || !result.stream) return null;
        const text = await streamToText(result.stream);
        return JSON.parse(text) as BlogPost;
      })
    );
    const valid = blogs.filter((b): b is BlogPost => b !== null);
    return valid.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  await ensureBlogsDir();
  const files = await fs.readdir(FS_BLOGS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));
  const blogs = await Promise.all(
    jsonFiles.map(async (file) => {
      const content = await fs.readFile(path.join(FS_BLOGS_DIR, file), "utf-8");
      return JSON.parse(content) as BlogPost;
    })
  );
  return blogs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function storageGetBlog(id: string): Promise<BlogPost | null> {
  if (useBlobStorage()) {
    try {
      const result = await get(blobPathname(id), { access: "private" });
      if (!result || result.statusCode !== 200 || !result.stream) return null;
      const text = await streamToText(result.stream);
      return JSON.parse(text) as BlogPost;
    } catch {
      return null;
    }
  }

  await ensureBlogsDir();
  try {
    const filePath = path.join(FS_BLOGS_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as BlogPost;
  } catch {
    return null;
  }
}

export async function storagePutBlog(blog: BlogPost): Promise<void> {
  const body = JSON.stringify(blog, null, 2);

  if (useBlobStorage()) {
    await put(blobPathname(blog.id), body, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  try {
    await ensureBlogsDir();
    const filePath = path.join(FS_BLOGS_DIR, `${blog.id}.json`);
    await fs.writeFile(filePath, body, "utf-8");
  } catch {
    throw new Error(
      "Blog storage is not available. On Vercel: go to Storage → Create Database → Blob, then add BLOB_READ_WRITE_TOKEN to Environment Variables and redeploy."
    );
  }
}

export async function storageDeleteBlog(id: string): Promise<void> {
  if (useBlobStorage()) {
    await del(blobPathname(id));
    return;
  }

  try {
    await ensureBlogsDir();
    const filePath = path.join(FS_BLOGS_DIR, `${id}.json`);
    await fs.unlink(filePath);
  } catch {
    // Ignore if file missing
  }
}

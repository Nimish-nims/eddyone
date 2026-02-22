"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BlogEditorForm } from "@/components/blog/blog-editor-form";
import type { BlogPost } from "@/lib/blog";

interface EditBlogPageClientProps {
  blog: BlogPost;
}

export function EditBlogPageClient({ blog }: EditBlogPageClientProps) {
  return (
    <div className="mx-auto max-w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/blogs">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Edit Blog Post
          </h1>
          <p className="text-sm text-muted-foreground">
            Editing &ldquo;{blog.title}&rdquo;
          </p>
        </div>
      </div>

      {/* Editor */}
      <BlogEditorForm initialData={blog} />
    </div>
  );
}

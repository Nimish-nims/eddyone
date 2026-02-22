import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BlogEditorForm } from "@/components/blog/blog-editor-form";
import { getBlogById } from "@/lib/blog-actions";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Blog",
};

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

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

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BlogEditorForm } from "@/components/blog/blog-editor-form";

export const metadata = {
  title: "Create New Blog",
};

export default function NewBlogPage() {
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
            Create New Blog Post
          </h1>
          <p className="text-sm text-muted-foreground">
            Write your content using the rich text editor.
          </p>
        </div>
      </div>

      {/* Editor */}
      <BlogEditorForm />
    </div>
  );
}

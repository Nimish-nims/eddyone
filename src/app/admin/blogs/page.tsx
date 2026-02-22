import Link from "next/link";
import { PlusCircle, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminBlogTableRow } from "@/components/blog/admin-blog-table-row";
import { getAllBlogs } from "@/lib/blog-actions";

export const metadata = {
  title: "All Blogs",
};

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogs();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Blogs</h1>
          <p className="text-sm text-muted-foreground">
            {blogs.length} post{blogs.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/blogs/new">
            <PlusCircle className="h-4 w-4" />
            New Blog
          </Link>
        </Button>
      </div>

      {/* Blog List */}
      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-medium">No blog posts yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Create your first blog post to get started.
          </p>
          <Button asChild className="gap-2">
            <Link href="/admin/blogs/new">
              <PlusCircle className="h-4 w-4" />
              Create First Post
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog) => (
            <AdminBlogTableRow key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

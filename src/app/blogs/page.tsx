import { FileText } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { getPublishedBlogs } from "@/lib/blog-actions";

export const metadata = {
  title: "Blog",
  description: "Read our latest blog posts",
};

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Theme toggle */}
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>

      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Insights, tutorials, and updates
        </p>
      </div>

      {/* Blog Grid */}
      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-medium">No posts yet</h3>
          <p className="text-sm text-muted-foreground">
            Check back soon for new content.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlogContentRenderer } from "@/components/blog/blog-content-renderer";
import { ThemeToggle } from "@/components/theme-toggle";
import { getBlogBySlug } from "@/lib/blog-actions";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return { title: "Not Found" };
  }

  return {
    title: blog.title,
    description: blog.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || blog.status !== "published") {
    notFound();
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto max-w-5xl px-6 py-16">
      {/* Top bar */}
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
        <ThemeToggle />
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="mb-8 overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="aspect-video w-full object-cover"
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {blog.title}
      </h1>

      {/* Meta */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {formattedDate}
        </span>

        {blog.tags.length > 0 && (
          <>
            <span>·</span>
            <div className="flex flex-wrap gap-1.5">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </>
        )}
      </div>

      <Separator className="my-8" />

      {/* Content */}
      <BlogContentRenderer content={blog.content} />

      <Separator className="my-8" />

      {/* Footer */}
      <Button variant="link" className="gap-2 px-0" asChild>
        <Link href="/blogs">
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Link>
      </Button>
    </article>
  );
}

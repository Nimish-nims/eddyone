import Link from "next/link";
import { Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  blog: BlogPost;
}

export function BlogCard({ blog }: BlogCardProps) {
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blogs/${blog.slug}`} className="group">
      <Card className="overflow-hidden transition-shadow hover:shadow-md h-full">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">
            {blog.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {blog.excerpt}
          </p>
        </CardContent>

        {blog.tags.length > 0 && (
          <CardFooter className="gap-1.5 flex-wrap">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}

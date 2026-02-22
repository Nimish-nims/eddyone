"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteBlogDialog } from "@/components/blog/delete-blog-dialog";
import type { BlogPost } from "@/lib/blog";

interface AdminBlogTableRowProps {
  blog: BlogPost;
}

export function AdminBlogTableRow({ blog }: AdminBlogTableRowProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <Card className="py-4">
        <CardContent className="flex items-center justify-between gap-4 px-6 py-0">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium truncate">{blog.title}</h3>
              <Badge
                variant={blog.status === "published" ? "default" : "secondary"}
                className="text-xs"
              >
                {blog.status}
              </Badge>
            </div>

            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
              {blog.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                      {tag}
                    </Badge>
                  ))}
                  {blog.tags.length > 3 && (
                    <span className="text-xs">+{blog.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/blogs/${blog.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              {blog.status === "published" && (
                <DropdownMenuItem asChild>
                  <Link href={`/blogs/${blog.slug}`} target="_blank">
                    View Public Post
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <DeleteBlogDialog
        blogId={blog.id}
        blogTitle={blog.title}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}

import { notFound } from "next/navigation";

import { getBlogById } from "@/lib/blog-actions";
import { EditBlogPageClient } from "./edit-blog-client";

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

  return <EditBlogPageClient blog={blog} />;
}

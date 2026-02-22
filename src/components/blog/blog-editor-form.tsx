"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Save, Send, Loader2, ImageIcon, PenLine, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagInput } from "@/components/blog/tag-input";

import type { BlogPost, BlogFormData, BlogStatus } from "@/lib/blog";
import { createBlog, updateBlog } from "@/lib/blog-actions";

// Dynamically import Eddyter to avoid SSR issues (Lexical needs browser APIs)
const EddyterEditor = dynamic(
  () => import("@/components/blog/eddyter-wrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[500px] items-center justify-center rounded-lg border bg-muted/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading editor...
        </div>
      </div>
    ),
  }
);

interface BlogEditorFormProps {
  initialData?: BlogPost;
}

export function BlogEditorForm({ initialData }: BlogEditorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [status, setStatus] = useState<BlogStatus>(
    initialData?.status ?? "draft"
  );

  const isEditing = !!initialData;

  const handleContentChange = useCallback((html: string) => {
    setContent(html);
  }, []);

  function handleSubmit(overrideStatus?: BlogStatus) {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim() || content === "<p><br></p>") {
      setError("Content is required");
      return;
    }

    setError(null);

    const formData: BlogFormData = {
      title: title.trim(),
      content,
      tags,
      coverImage: coverImage.trim(),
      status: overrideStatus ?? status,
    };

    startTransition(async () => {
      try {
        if (isEditing) {
          await updateBlog(initialData.id, formData);
        } else {
          await createBlog(formData);
        }
        router.push("/admin/blogs");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Title — always visible */}
      <div>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog post title..."
          className="h-14 border-none bg-transparent px-0 text-2xl font-bold shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0"
        />
        <Separator />
      </div>

      {/* Tabs: Editor | Settings */}
      <Tabs defaultValue="editor" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="editor" className="gap-2">
              <PenLine className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Post Settings
            </TabsTrigger>
          </TabsList>

          {/* Action buttons — always visible */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isPending}
              onClick={() => handleSubmit("draft")}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Draft
            </Button>

            <Button
              size="sm"
              className="gap-2"
              disabled={isPending}
              onClick={() => handleSubmit("published")}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isEditing ? "Update & Publish" : "Publish"}
            </Button>
          </div>
        </div>

        {error && (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        )}

        {/* ── Editor Tab ── */}
        <TabsContent value="editor" className="mt-4">
          <div className="overflow-hidden rounded-lg">
            <EddyterEditor
              initialContent={initialData?.content}
              onChange={handleContentChange}
            />
          </div>
        </TabsContent>

        {/* ── Settings Tab ── */}
        <TabsContent value="settings" className="mt-4">
          <div className="mx-auto max-w-2xl space-y-8 rounded-lg border bg-card p-6">
            {/* Status */}
            <div className="grid gap-2 sm:grid-cols-[200px_1fr] sm:items-center">
              <Label className="font-medium">Status</Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as BlogStatus)}
              >
                <SelectTrigger className="w-full sm:max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Cover Image */}
            <div className="grid gap-2 sm:grid-cols-[200px_1fr] sm:items-start">
              <Label className="flex items-center gap-2 pt-2 font-medium">
                <ImageIcon className="h-4 w-4" />
                Cover Image URL
              </Label>
              <div className="space-y-3">
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {coverImage && (
                  <div className="overflow-hidden rounded-md border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="aspect-video w-full max-w-md object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div className="grid gap-2 sm:grid-cols-[200px_1fr] sm:items-start">
              <Label className="pt-2 font-medium">Tags</Label>
              <TagInput tags={tags} onChange={setTags} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

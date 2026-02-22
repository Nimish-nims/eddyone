import Link from "next/link";
import {
  FileText,
  PenLine,
  Eye,
  Shield,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

const routes = [
  {
    section: "Public",
    items: [
      {
        path: "/blogs",
        label: "Blog Listing",
        description: "Browse all published blog posts",
        icon: FileText,
        badge: null,
      },
      {
        path: "/blogs/[slug]",
        label: "Blog Post",
        description: "Read an individual published blog post",
        icon: Eye,
        badge: "dynamic",
      },
    ],
  },
  {
    section: "Admin",
    items: [
      {
        path: "/admin/blogs",
        label: "All Blogs",
        description: "Dashboard to manage all blog posts (drafts & published)",
        icon: Shield,
        badge: null,
      },
      {
        path: "/admin/blogs/new",
        label: "New Blog",
        description: "Create a new blog post with Eddyter rich text editor",
        icon: PlusCircle,
        badge: null,
      },
      {
        path: "/admin/blogs/[id]/edit",
        label: "Edit Blog",
        description: "Edit an existing blog post",
        icon: PenLine,
        badge: "dynamic",
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Blog App</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            All available routes in this application
          </p>
        </div>
        <ThemeToggle />
      </div>

      <Separator className="my-8" />

      {/* Route Sections */}
      <div className="space-y-10">
        {routes.map((section) => (
          <div key={section.section}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {section.section} Routes
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {section.items.map((route) => {
                const isLinkable = !route.path.includes("[");

                const cardContent = (
                  <Card
                    className={
                      isLinkable
                        ? "transition-shadow hover:shadow-md cursor-pointer group"
                        : "opacity-80"
                    }
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                            <route.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {route.label}
                            </CardTitle>
                            <code className="text-xs text-muted-foreground">
                              {route.path}
                            </code>
                          </div>
                        </div>
                        {route.badge && (
                          <Badge variant="outline" className="text-xs">
                            {route.badge}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{route.description}</CardDescription>
                      {isLinkable && (
                        <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          Open
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );

                return isLinkable ? (
                  <Link key={route.path} href={route.path}>
                    {cardContent}
                  </Link>
                ) : (
                  <div key={route.path}>{cardContent}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-8" />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/admin/blogs/new" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Blog
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/blogs" className="gap-2">
            <Eye className="h-4 w-4" />
            View Public Blog
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/blogs" className="gap-2">
            <Shield className="h-4 w-4" />
            Admin Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

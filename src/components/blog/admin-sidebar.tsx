"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, PlusCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "All Blogs",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    label: "New Blog",
    href: "/admin/blogs/new",
    icon: PlusCircle,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="px-6 py-5">
        <h2 className="text-lg font-bold tracking-tight">Blog Admin</h2>
        <p className="text-xs text-muted-foreground">Manage your content</p>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/admin/blogs" &&
              pathname.startsWith("/admin/blogs") &&
              pathname !== "/admin/blogs/new");

          return (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3",
                isActive && "bg-accent text-accent-foreground"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="px-3 py-4 space-y-1">
        <Button variant="ghost" className="w-full justify-start gap-3" asChild>
          <Link href="/blogs" target="_blank">
            <Eye className="h-4 w-4" />
            View Public Blog
          </Link>
        </Button>
        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

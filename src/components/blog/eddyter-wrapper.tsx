"use client";

import { useState, useEffect } from "react";
import {
  ConfigurableEditorWithAuth,
  EditorProvider,
  defaultEditorConfig,
} from "eddyter";
import "eddyter/style.css";

interface EddyterWrapperProps {
  initialContent?: string;
  onChange: (html: string) => void;
}

const currentUser = {
  id: "admin-1",
  name: "Admin",
  email: "admin@blog.com",
};

export default function EddyterWrapper({
  initialContent,
  onChange,
}: EddyterWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const apiKey = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_EDITOR_API_KEY ?? "") : "";

  // Never render Eddyter on server or before hydration (avoids SSR / production render errors)
  if (!mounted || typeof window === "undefined") {
    return (
      <div className="flex min-h-[500px] items-center justify-center rounded-lg border bg-muted/30">
        <div className="text-sm text-muted-foreground">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] w-full max-w-full overflow-hidden rounded-lg border">
      <EditorProvider
        defaultFontFamilies={defaultEditorConfig.defaultFontFamilies}
        currentUser={currentUser}
      >
        <ConfigurableEditorWithAuth
          apiKey={apiKey}
          initialContent={initialContent || "<p>Start writing your blog post...</p>"}
          onChange={onChange}
          onAuthSuccess={() => console.log("Eddyter editor ready")}
          onAuthError={(error) =>
            console.warn("Eddyter auth error:", error)
          }
        />
      </EditorProvider>
    </div>
  );
}

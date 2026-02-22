"use client";

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
  const apiKey = process.env.NEXT_PUBLIC_EDITOR_API_KEY ?? "";

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

"use client";

import { useState, useCallback, type MouseEvent } from "react";
import { ImageLightbox } from "@/components/blog/image-lightbox";

interface BlogContentRendererProps {
  content: string;
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (target.tagName === "IMG") {
      const img = target as HTMLImageElement;
      e.preventDefault();
      setLightbox({
        src: img.src,
        alt: img.alt || "Blog image",
      });
    }
  }, []);

  return (
    <>
      <div
        className="blog-prose"
        dangerouslySetInnerHTML={{ __html: content }}
        onClick={handleClick}
      />

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export function TagInput({ tags, onChange, maxTags = 10 }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  function addTag(value: string) {
    const tag = value.trim().toLowerCase();
    if (!tag) return;
    if (tags.includes(tag)) return;
    if (tags.length >= maxTags) return;

    onChange([...tags, tag]);
    setInputValue("");
  }

  function removeTag(tagToRemove: string) {
    onChange(tags.filter((t) => t !== tagToRemove));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }

    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div className="space-y-2">
      {/* Tags display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input */}
      {tags.length < maxTags && (
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a tag and press Enter..."
          className="h-8 text-sm"
        />
      )}

      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add. {tags.length}/{maxTags} tags.
      </p>
    </div>
  );
}

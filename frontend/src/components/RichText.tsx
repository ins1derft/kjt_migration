import React from "react";
import { cn } from "@/lib/utils";

type RichTextProps = {
  html?: string | null;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Renders trusted HTML from admin WYSIWYG fields.
 * Do not pass untrusted user content here.
 */
export const RichText: React.FC<RichTextProps> = ({ html, className, style }) => {
  if (!html) return null;

  return (
    <div
      className={cn(
        "prose prose-base font-sans prose-headings:font-heading prose-strong:font-semibold prose-img:rounded-xl prose-a:text-brand-start prose-a:underline prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-brand-start max-w-none",
        className
      )}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichText;

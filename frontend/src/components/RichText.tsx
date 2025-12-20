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
        "prose prose-base font-sans prose-headings:font-heading prose-strong:font-semibold prose-img:rounded-xl prose-a:text-brand-start prose-a:underline max-w-none",
        "prose-ol:my-[12px] prose-ol:pl-[30px] prose-ol:list-decimal",
        "prose-ul:my-[12px] prose-ul:pl-[30px] prose-ul:list-disc",
        "prose-li:my-0 prose-li:marker:text-brand-start",
        "prose-table:my-[16px] prose-table:w-full prose-table:border-collapse",
        "prose-thead:border-b prose-thead:border-table-border",
        "prose-th:border prose-th:border-table-border prose-th:bg-table-header prose-th:px-[12px] prose-th:py-[10px] prose-th:text-left prose-th:font-semibold prose-th:text-brand-dark",
        "prose-td:border prose-td:border-table-border prose-td:px-[12px] prose-td:py-[10px] prose-td:text-brand-dark/70",
        className
      )}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichText;

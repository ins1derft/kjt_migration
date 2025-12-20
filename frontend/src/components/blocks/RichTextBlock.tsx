import React from "react";
import RichText from "../RichText";
import { cn } from "@/lib/utils";
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from "@/lib/blocks/padding";

export type RichTextBlockProps = {
  text?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const RichTextBlock: React.FC<RichTextBlockProps> = ({
  text,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  if (!text?.trim()) {
    return null;
  }

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
      (padding && typeof padding === "object" && ("top" in padding || "bottom" in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "pt-[30px] pb-[120px]");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-white");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn("w-full", sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto w-full px-5 sm:px-6 lg:px-10 2xl:max-w-[1320px] 2xl:px-0">
        <div className="text-left">
          <RichText
            html={text}
            className={cn(
              "font-heading text-[16px] leading-[1.4] text-brand-dark/70 md:text-[18px] lg:text-[20px]",
              "prose-p:mt-0 prose-p:mb-[12px] prose-p:font-heading",
              "prose-p:text-[16px] md:prose-p:text-[18px] lg:prose-p:text-[20px]",
              "prose-p:leading-[1.4] prose-p:text-brand-dark/70",
              "prose-h2:font-heading prose-h2:font-bold prose-h2:leading-none prose-h2:text-brand-dark",
              "prose-h2:text-[32px] md:prose-h2:text-[38px] lg:prose-h2:text-[44px]",
              "prose-h2:mt-[36px] md:prose-h2:mt-[44px] lg:prose-h2:mt-[52px]",
              "prose-h2:mb-[12px] prose-h2:max-w-[1100px]",
              "prose-h3:font-heading prose-h3:font-semibold prose-h3:leading-none prose-h3:text-brand-dark",
              "prose-h3:text-[24px] md:prose-h3:text-[28px]",
              "prose-h3:mt-[28px] md:prose-h3:mt-[32px] prose-h3:mb-[10px]",
              "prose-ol:leading-[1.8]",
              "prose-ul:leading-[1.6]",
              "prose-a:text-brand-dark/70 prose-a:underline prose-a:decoration-[1px] prose-a:underline-offset-4",
              "prose-strong:font-semibold prose-strong:text-brand-dark"
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default RichTextBlock;

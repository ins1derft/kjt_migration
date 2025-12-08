import React from "react";
import { cn } from "@/lib/utils";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

export type PageHeaderProps = {
  title?: string;
  padding?: SectionPadding | null;
  className?: string;
  titleClassName?: string;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  padding,
  className,
  titleClassName,
  backgroundClass,
  backgroundColor,
}) => {
  if (!title) return null;

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "pt-[160px] pb-16 md:pb-20");

  const titleClass = cn(
    "font-heading font-bold text-[48px] md:text-[84px] leading-[1.1] tracking-tight pb-2",
    titleClassName
      ? titleClassName
      : "text-transparent bg-clip-text bg-brand-gradient"
  );

  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-brand-gray");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn("w-full", sectionBackground, paddingClass, className)} style={sectionStyle}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-10 text-left">
        <h1 className={titleClass}>
          {title}
        </h1>
      </div>
    </section>
  );
};

export default PageHeader;

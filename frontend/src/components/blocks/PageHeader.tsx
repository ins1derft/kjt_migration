import React from "react";
import { cn } from "@/lib/utils";
import { resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

export type PageHeaderProps = {
  title?: string;
  padding?: SectionPadding | null;
  className?: string;
  titleClassName?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, padding, className, titleClassName }) => {
  if (!title) return null;

  const paddingClass = resolveSectionPadding(padding, "pt-[160px] pb-16 md:pb-20");

  const titleClass = cn(
    "font-heading font-bold text-[48px] md:text-[84px] leading-[1.1] tracking-tight pb-2",
    titleClassName
      ? titleClassName
      : "text-transparent bg-clip-text bg-brand-gradient animate-gradient"
  );

  return (
    <section className={cn("bg-brand-gray w-full", paddingClass, className)}>
      <div className="container mx-auto px-4 text-left">
        <h1 className={titleClass}>
          {title}
        </h1>
      </div>
    </section>
  );
};

export default PageHeader;

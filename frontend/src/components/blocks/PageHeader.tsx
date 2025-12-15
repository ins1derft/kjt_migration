import React from "react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";
import type { BreadcrumbItem } from "@/lib/blocks/types";

export type PageHeaderProps = {
  title?: string;
  breadcrumbs?: BreadcrumbItem[] | null;
  padding?: SectionPadding | null;
  className?: string;
  containerClassName?: string;
  titleClassName?: string;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
  /**
   * Controls what is rendered in the header: a text title (default) or a centered image.
   */
  variant?: "title" | "centered_image" | null;
  /**
   * Optional media used when variant=centered_image.
   */
  image?: string | null;
  imageAlt?: string | null;
  imageClassName?: string;
  /**
   * Tweak default title styling when using the text variant.
   */
  titleVariant?: "gradient" | "plain" | null;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  padding,
  className,
  containerClassName,
  titleClassName,
  backgroundClass,
  backgroundColor,
  variant = "title",
  image,
  imageAlt,
  imageClassName,
  titleVariant = "gradient",
}) => {
  const resolvedImage = resolveMediaUrl(image);
  const hasCenteredImage = variant === "centered_image" && Boolean(resolvedImage);

  if (!title && !hasCenteredImage) return null;
  const crumbs = (breadcrumbs ?? []).filter((c) => c?.label?.trim());

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "pt-[140px] pb-[50px]");

  const titleClass = cn(
    "font-heading font-bold text-[48px] md:text-[84px] leading-none",
    titleVariant === "plain" && "text-brand-dark",
    titleVariant === "plain" && titleClassName,
    titleVariant !== "plain" && titleClassName,
    titleVariant !== "plain" && "text-transparent bg-clip-text bg-brand-gradient"
  );

  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-brand-gray");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const visibleCrumbs = crumbs.filter((crumb, idx) => {
    const isLast = idx === crumbs.length - 1;
    const href = crumb.href?.trim() || null;
    if (isLast && !href) return false;
    return true;
  });

  return (
    <section className={cn("w-full", sectionBackground, paddingClass, className)} style={sectionStyle}>
      <div
        className={cn(
          "container mx-auto w-full px-5 sm:px-6 lg:px-10 2xl:max-w-[1320px] 2xl:px-0",
          hasCenteredImage ? "text-center" : "text-left",
          containerClassName,
        )}
      >
        {hasCenteredImage ? (
          <>
            {title ? <h1 className="sr-only">{title}</h1> : null}
            <div className="flex w-full justify-center">
              <img
                src={resolvedImage!}
                alt={imageAlt || title || ""}
                className={cn("h-auto max-h-[180px] w-auto", imageClassName)}
                loading="lazy"
              />
            </div>
          </>
        ) : (
          <h1 className={titleClass}>
            {title}
          </h1>
        )}
        {visibleCrumbs.length ? (
          <nav aria-label="Breadcrumb" className="mt-[30px]">
            <ol className={cn(
              "flex flex-wrap items-center gap-x-[34px] gap-y-2 font-heading text-[16px] leading-[normal] text-brand-sky",
              hasCenteredImage && "justify-center"
            )}>
              {visibleCrumbs.map((crumb, idx) => {
                const href = crumb.href?.trim() || null;

                return (
                  <li key={`${crumb.label}-${idx}`}>
                    {href ? (
                      <a
                        href={href}
                        className="transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-[4px]"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}
      </div>
    </section>
  );
};

export default PageHeader;

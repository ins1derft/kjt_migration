import React from "react";
import Image from "next/image";
import { cn, resolveMediaUrl } from "@/lib/utils";
import RichText from "../RichText";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string | null; // URL to uploaded file (storage), same contract as hero_values
  photo?: string | null; // Optional photo that replaces icon and renders full-width
}

export interface FeatureGridProps {
  items: FeatureItem[];
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3 | 4;
  padding?: SectionPadding | null;
  variant?: 'plain' | 'colored';
  decoration?: string | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ 
    items, 
    title, 
    description,
    columns, 
    padding,
    variant = 'plain',
    decoration,
    backgroundClass,
    backgroundColor,
}) => {

  const isColored = variant === 'colored';

  const maxColumns = columns ?? (isColored ? 4 : 3);
  const resolvedColumns = Math.max(1, Math.min(maxColumns, items.length || maxColumns));

  const gridClass = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 2xl:grid-cols-3',
    4: 'md:grid-cols-2 2xl:grid-cols-4',
  }[resolvedColumns];

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const defaultPadding = isColored
    ? "pt-[78px] pb-[79px] md:pt-[147px] md:pb-[40px] 2xl:pb-[192px]"
    : "py-16";

  const extraSpacing = hasCustomPadding
    ? ""
    : isColored
      ? ""
      : "pt-[148px] md:pt-[110px] pb-[225px] md:pb-[130px]";

  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : defaultPadding);
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-white");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const headingSpacing = isColored ? "mb-[30px] md:mb-[64px]" : "mb-[60px] md:mb-[64px]";
  const gridGap = isColored
    ? "gap-y-[15px] md:gap-y-[21px] md:gap-x-[21px] 2xl:gap-x-[19px] 2xl:gap-y-[21px]"
    : "gap-y-12 md:gap-y-12 lg:gap-y-14 2xl:gap-y-16 gap-x-10 md:gap-x-16 lg:gap-x-24";
  const containerClass = isColored
    ? "mx-auto w-full max-w-[1320px] px-[20px] md:px-[32px] lg:px-[50px] 2xl:px-0"
    : "container mx-auto w-full px-5 sm:px-6 lg:px-10 2xl:max-w-[1320px]";

  const renderIcon = (icon: string | undefined | null, className: string, alt?: string) => {
    const imageSrc = icon?.startsWith('/icons/') ? icon : resolveMediaUrl(icon);
    if (!imageSrc) return null;
    return (
      <Image
        src={imageSrc}
        alt={alt ?? ""}
        width={70}
        height={70}
        className={cn(className, "object-contain")}
        unoptimized
      />
    );
  };

  const renderPhoto = (photo: string | undefined | null, alt?: string) => {
    const imageSrc = resolveMediaUrl(photo);
    if (!imageSrc) return null;

    return (
      <div
        className={cn(
          "w-full overflow-hidden rounded-[12px] md:rounded-[14px] bg-gray-100",
          isColored ? "mb-[20px] md:mb-[26px]" : "mb-5 md:mb-6"
        )}
      >
        <div className="relative w-full h-[190px] md:h-[220px] 2xl:h-[260px]">
          <Image
            src={imageSrc}
            alt={alt ?? ""}
            fill
            className="object-cover"
            sizes="(min-width:1536px) 600px, (min-width:1024px) 45vw, (min-width:768px) 50vw, 100vw"
            unoptimized
            priority={false}
          />
        </div>
      </div>
    );
  };

  return (
    <section
      className={cn(
        paddingClass,
        sectionBackground,
        "relative overflow-hidden",
        extraSpacing
      )}
      style={sectionStyle}
    >
      {(() => {
        const decorationSrc = resolveMediaUrl(decoration);
        if (!isColored || !decorationSrc) return null;

        return (
        <Image
          src={decorationSrc}
          alt=""
          width={2222}
          height={1167}
          className="pointer-events-none absolute z-0 left-1/2 -translate-x-1/2 -top-10 w-[140%] h-auto max-w-none md:w-[180%] lg:w-[200%] 2xl:w-[160%]"
          unoptimized
        />
        );
      })()}

      <div className={cn(containerClass, "relative z-10") }>
        {title && (
          <h2 className={cn(
            "font-heading font-bold text-brand-dark text-center leading-none",
            "text-[38px] md:text-[64px]",
            isColored ? "max-w-[728px] md:max-w-[991px] w-full mx-auto" : "",
            headingSpacing
          )}>
            {title}
          </h2>
        )}

        {description && (
          <RichText
            html={description}
            className="font-sans text-lg md:text-[20px] text-gray-600 max-w-5xl mx-auto text-center leading-relaxed mb-12 prose-p:my-0 prose-headings:font-heading prose-headings:text-brand-dark prose-headings:mb-3 prose-ul:text-left prose-ol:text-left prose-ul:pl-6 prose-ol:pl-6"
          />
        )}

        <div className={cn(
          "grid grid-cols-1",
          gridClass,
          gridGap
        )}>
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "group flex flex-col items-start text-left",
                isColored && "bg-brand-gray rounded-[20px] min-h-[280px] md:min-h-[340px] 2xl:min-h-[466px] px-[20px] pt-[22px] pb-[36px] md:px-[30px] md:pb-[36px]"
              )}
            >
              {(() => {
                const photoElement = renderPhoto(item.photo, item.title);
                if (photoElement) return photoElement;

                const iconElement = renderIcon(
                  item.icon,
                  isColored
                    ? "w-[70px] h-[70px]"
                    : "w-[46px] h-[46px] md:w-[52px] md:h-[52px] 2xl:w-[60px] 2xl:h-[60px]",
                  item.title
                );

                if (!iconElement) return null;

                return isColored ? (
                  <div className="mb-[20px] md:mb-[41px] shrink-0">
                    {iconElement}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "shrink-0 transition-transform duration-300 group-hover:scale-110 mb-4",
                      "text-brand-orange"
                    )}
                  >
                    {iconElement}
                  </div>
                );
              })()}

              <div>
                <h3 className={cn(
                  "font-heading font-bold text-brand-dark text-[24px] leading-[29px]",
                  isColored ? "mb-[19px]" : "mb-[14px]"
                )}>
                  {item.title}
                </h3>
                <RichText
                  html={item.description}
                  className={cn(
                    "font-sans text-brand-dark/70 text-[16px] leading-[21px] md:text-[20px] md:leading-[26px] prose-p:my-0 prose-strong:font-semibold prose-ul:my-0 prose-ol:my-0 prose-ul:pl-4 prose-ol:pl-4",
                    isColored ? "max-w-[275px]" : "max-w-[335px] lg:max-w-[371px]"
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;

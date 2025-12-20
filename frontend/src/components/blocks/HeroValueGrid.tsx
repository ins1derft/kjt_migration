import React from "react";
import Image from "next/image";
import RichText from "../RichText";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";
import type { FeatureItem } from "./FeatureGrid";
import ClickSpark from "@/components/bits/ClickSpark";

export type HeroValueGridProps = {
  title?: string;
  subtitle?: string;
  text?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items?: FeatureItem[];
  columns?: 2 | 3 | 4;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const HeroValueGrid: React.FC<HeroValueGridProps> = ({
  title,
  subtitle,
  text,
  ctaLabel = "Live Demo",
  ctaHref = "mailto:info@kidsjumptech.com?subject=Live%20Demo",
  items = [],
  columns = 4,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const heading = subtitle ?? title ?? "";
  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(
    padding,
    hasCustomPadding ? "" : "pt-[76px] pb-[180px]",
  );
  const containerClass = "container mx-auto w-full max-w-[1189px] 2xl:max-w-[1320px] px-5 md:px-8 2xl:px-0";
  const hasHeading = Boolean(heading);
  const hasText = Boolean(text);

  const gridClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 xl:grid-cols-3",
    4: "md:grid-cols-2 xl:grid-cols-4",
  }[columns];

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

  return (
    <section
      className={cn(paddingClass, resolveSectionBackground(backgroundClass, "bg-brand-gray"), "text-brand-dark")}
      style={resolveSectionBackgroundStyle(backgroundColor)}
    >
      <div className={containerClass}>
        {heading && (
          <h2 className="font-heading font-bold text-[38px] leading-[1.05] md:text-[64px] md:leading-[1.05] max-w-[992px] mx-auto text-center mb-[15px]">
            {heading}
          </h2>
        )}

        {text && (
          <RichText
            html={text}
            className="font-sans text-[16px] md:text-[20px] leading-[1.4] text-brand-dark/70 max-w-[321px] md:max-w-[577px] mx-auto text-center mb-[39px]"
          />
        )}

        {ctaLabel && ctaHref && (
          <div className="flex justify-center">
            <ClickSpark sparkColor="#FFE4F0" sparkRadius={14} sparkCount={9} duration={220} easing="linear" className="inline-block">
              <a
                href={ctaHref}
                className="inline-flex h-[53px] w-[158px] items-center justify-center rounded-full bg-brand-gradient text-white font-heading font-bold text-[16px] leading-none transition-transform duration-150 animate-gradient-hover hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
              >
                {ctaLabel}
              </a>
            </ClickSpark>
          </div>
        )}

        {items.length > 0 && (
          <div
            className={cn(
              "grid grid-cols-1 gap-y-14 md:gap-y-20 md:grid-cols-2 md:gap-x-24 xl:grid-cols-4 xl:gap-x-12 xl:gap-y-0",
              hasHeading || hasText ? "mt-[40px] md:mt-[67px]" : "mt-0",
              gridClass,
            )}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="flex w-full max-w-[321px] md:max-w-[450px] xl:max-w-[294px] flex-col items-start md:items-center xl:items-start text-left md:text-center xl:text-left mx-auto group"
              >
                <div
                  className="shrink-0 text-brand-sky w-[70px] h-[70px] mb-[15px] transition-transform duration-300 group-hover:scale-110"
                >
                  {renderIcon(item.icon, "w-[70px] h-[70px]", item.title)}
                </div>

                <div className="w-full">
                  <h3 className="font-heading font-bold text-[24px] leading-[1.1] text-brand-dark mb-[11px]">
                    {item.title}
                  </h3>
                  <RichText
                    html={item.description}
                    className="font-sans leading-[1.4] text-brand-dark/70 text-[16px] md:text-[20px]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroValueGrid;

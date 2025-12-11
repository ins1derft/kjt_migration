
'use client';

import React from "react";
import RichText from "../RichText";
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from "@/lib/blocks/padding";

export interface CTASectionProps {
  title?: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImage?: string;
  textColor?: string | null;
  textColorClass?: string | null; // backwards compatibility
  backgroundColor?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null; // backwards compatibility
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  ctaLabel,
  ctaHref,
  backgroundImage,
  textColor,
  textColorClass,
  backgroundColor,
  padding,
  backgroundClass,
}) => {
  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(
    padding,
    hasCustomPadding ? "" : "py-[90px] lg:py-[106px] 2xl:py-[150px]"
  );
  const hasImage = Boolean(backgroundImage);
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-brand-dark");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const textColorValue = textColor?.trim();
  const textColorClassResolved = textColorClass ?? (hasImage ? "text-white" : "text-brand-dark");
  const backgroundUrl = backgroundImage ? resolveMediaUrl(backgroundImage) ?? "" : "";

  const sectionClass = cn(
    paddingClass,
    "relative overflow-hidden min-h-[518px] lg:min-h-[492px]",
    sectionBackground
  );

  return (
    <section className={sectionClass} style={sectionStyle}>
      {/* Parallax-style background (same pattern as Stats) */}
      {hasImage && (
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-fixed bg-cover bg-center"
            style={{
              backgroundImage: `url("${backgroundUrl}")`,
            }}
          />
          <div className="absolute inset-0 bg-[rgba(26,26,26,0.5)]" />
        </div>
      )}

      <div className="relative z-20 w-full px-5 md:px-6 lg:px-12 mx-auto max-w-[360px] md:max-w-[711px] lg:max-w-[1091px] 2xl:max-w-[1320px]">
        <div className="flex flex-col xl:flex-row xl:items-start">
          {/* Text Content */}
          <div className="max-w-[320px] md:max-w-[711px] xl:max-w-[729px] text-left space-y-3 md:space-y-2">
            {title && (
              <h2
                className={cn(
                  "font-heading font-bold text-[38px] leading-none md:text-[64px] md:leading-none tracking-[0px]",
                  textColorClassResolved
                )}
                style={textColorValue ? { color: textColorValue } : undefined}
              >
                {title}
              </h2>
            )}
            {description && (
              <RichText
                html={description}
                className={cn(
                  "font-sans text-[16px] leading-[22.4px] md:text-[20px] md:leading-[28px] font-normal text-brand-dark/80",
                  textColorClassResolved
                )}
                style={textColorValue ? { color: textColorValue } : undefined}
              />
            )}
          </div>

          {/* CTA Button */}
          <div className="mt-10 md:mt-9 xl:mt-[139px] xl:ml-auto">
            <a
              href={ctaHref}
              className="inline-flex h-[53px] min-w-[158px] px-7 md:px-8 items-center justify-center whitespace-nowrap rounded-full bg-white text-brand-dark font-heading font-bold text-[16px] leading-[20px] transition-colors duration-200 hover:bg-brand-sky hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

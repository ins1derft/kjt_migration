'use client';

import React from "react";
import { Star } from "lucide-react";
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from "@/lib/blocks/padding";
import { cn } from "@/lib/utils";
import RichText from "../RichText";

export interface RatingSummaryProps {
  title?: string | null;
  rating?: number | string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  footerText?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

const GoogleGlyph = ({ className = "h-[46px] w-[46px]" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const clampRating = (value?: number | string | null) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return 5;
  return Math.max(0, Math.min(5, num));
};

const formatRating = (value?: number | string | null) => clampRating(value).toFixed(1);

const StarRow = ({ value }: { value: number | string | null }) => {
  const count = clampRating(value);
  return (
    <div className="flex items-center gap-[6px] text-ui-star">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Star
          key={idx}
          size={24}
          strokeWidth={0}
          fill={idx < count ? "currentColor" : "rgba(217,217,217,0.5)"}
          className="shrink-0"
        />
      ))}
    </div>
  );
};

const RatingSummary: React.FC<RatingSummaryProps> = ({
  title,
  rating = 5,
  ctaLabel = "View all reviews",
  ctaHref = "#",
  footerText,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-white");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const paddingClass = resolveSectionPadding(
    padding,
    "pt-[96px] pb-[96px] md:pt-[120px] md:pb-[120px] 2xl:pt-[150px] 2xl:pb-[150px]"
  );

  const hasTitle = Boolean(title?.trim());
  const hasFooter = Boolean(footerText?.trim());
  const displayRating = formatRating(rating);

  return (
    <section className={cn("overflow-hidden", sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto flex flex-col items-center px-5 sm:px-6 text-center">
        {hasTitle ? (
          <h2 className="max-w-[974px] font-heading font-bold text-brand-dark text-[32px] leading-[1.08] md:text-[42px] lg:text-[48px] xl:text-[56px] 2xl:text-[64px]">
            {title}
          </h2>
        ) : null}

        <div className={cn("flex flex-col items-center", hasTitle ? "mt-[56px] md:mt-[64px] 2xl:mt-[72px]" : "mt-0")}>
          <span className="bg-brand-gradient bg-clip-text font-heading font-extrabold text-transparent text-[48px] leading-none md:text-[60px] lg:text-[72px] 2xl:text-[84px]">
            {displayRating}
          </span>

          <div className="mt-1 flex items-center gap-[12px] md:gap-[14px]">
            <GoogleGlyph className="h-[34px] w-[34px] md:h-[38px] md:w-[38px] lg:h-[42px] lg:w-[42px] 2xl:h-[46px] 2xl:w-[46px]" />
            <StarRow value={rating} />
          </div>

          <div className="mt-[28px] md:mt-[32px] lg:mt-[36px] 2xl:mt-[39px]">
            <a
              href={ctaHref ?? "#"}
              className="inline-flex h-[53px] min-w-[179px] items-center justify-center rounded-[100px] bg-gradient-cta px-[26px] font-heading text-[16px] font-bold leading-[20px] text-white shadow-cta transition-transform transition-colors duration-150 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {ctaLabel}
            </a>
          </div>
        </div>

        {hasFooter ? (
          <RichText
            html={footerText ?? ""}
            className="mt-[56px] md:mt-[64px] lg:mt-[68px] 2xl:mt-[72px] max-w-[1051px] font-heading text-brand-dark/70 text-[14px] leading-[1.45] sm:text-[16px] sm:leading-[1.45] md:text-[18px] md:leading-[26px] 2xl:text-[20px] 2xl:leading-[28px] prose-p:my-0 prose-p:leading-inherit prose-p:text-inherit prose-strong:font-extrabold prose-strong:text-brand-dark"
          />
        ) : null}
      </div>
    </section>
  );
};

export default RatingSummary;

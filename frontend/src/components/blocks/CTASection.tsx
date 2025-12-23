
'use client';

import React, { useMemo, useState } from "react";
import RichText from "../RichText";
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from "@/lib/blocks/padding";
import ClickSpark from "@/components/bits/ClickSpark";
import QuoteModal from "./QuoteModal";
import type { FormConfig } from "@/lib/api";

export interface CTASectionProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaHrefLabel?: string | null;
  formCode?: string | null;
  formTitle?: string | null;
  formConfig?: FormConfig | null;
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
  ctaHrefLabel,
  formCode,
  formTitle,
  formConfig,
  backgroundImage,
  textColor,
  textColorClass,
  backgroundColor,
  padding,
  backgroundClass,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(
    padding,
    hasCustomPadding ? "" : "py-[90px] lg:py-[106px] 2xl:py-[150px]"
  );
  const hasImage = Boolean(backgroundImage);
  const defaultBackgroundClass = hasImage ? "bg-brand-dark" : "bg-brand-orange";
  const sectionBackground = resolveSectionBackground(backgroundClass, defaultBackgroundClass);
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const textColorValue = textColor?.trim();
  const isBrandOrangeBackground =
    sectionBackground.includes("bg-brand-orange") ||
    backgroundColor?.trim().toLowerCase() === "#ff5722";
  const prefersWhiteText =
    Boolean(textColorClass?.includes("text-white")) ||
    hasImage ||
    isBrandOrangeBackground;
  const textColorClassResolved =
    textColorClass ?? (prefersWhiteText ? "text-white" : "text-brand-dark");
  const backgroundUrl = backgroundImage ? resolveMediaUrl(backgroundImage) ?? "" : "";

  const sectionClass = cn(
    paddingClass,
    "relative overflow-hidden min-h-[518px] lg:min-h-[492px]",
    sectionBackground
  );

  const effectiveFormCode = formCode ?? formConfig?.code ?? null;
  const hasForm = Boolean(effectiveFormCode);

  const buttonLabel = useMemo(() => {
    if (hasForm) return ctaLabel ?? "Consultation";
    return ctaHrefLabel?.trim() || ctaLabel || "Contact us";
  }, [ctaHrefLabel, ctaLabel, hasForm]);

  const button = hasForm ? (
    <ClickSpark
      sparkColor="#FFE4F0"
      sparkRadius={14}
      sparkCount={9}
      duration={220}
      easing="linear"
      className="inline-block"
    >
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex h-[71px] min-w-[249px] px-10 items-center justify-center whitespace-nowrap rounded-full bg-white text-brand-dark font-heading font-bold text-[20px] leading-none transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      >
        {buttonLabel}
      </button>
    </ClickSpark>
  ) : (
    <a
      href={ctaHref ?? "#"}
      className="inline-flex h-[71px] min-w-[249px] px-10 items-center justify-center whitespace-nowrap rounded-full bg-white text-brand-dark font-heading font-bold text-[20px] leading-none transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
    >
      {buttonLabel}
    </a>
  );

  return (
    <>
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

        <div className="relative z-20 mx-auto w-full max-w-[1320px] px-5 md:px-6 xl:px-0">
          <div className="flex flex-col items-center text-center xl:flex-row xl:items-center xl:justify-between xl:text-left gap-10 xl:gap-12">
            {/* Text Content */}
            <div className="w-full max-w-[729px] space-y-3 md:space-y-2">
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
                    "font-sans text-[16px] leading-[22.4px] md:text-[20px] md:leading-[28px] font-normal",
                    prefersWhiteText ? "text-white/80" : "text-brand-dark/80",
                    textColorClassResolved,
                  )}
                  style={textColorValue ? { color: textColorValue } : undefined}
                />
              )}
            </div>

            {/* CTA Button */}
            <div className="flex shrink-0 justify-center xl:justify-end">
              {button}
            </div>
          </div>
        </div>
      </section>

      {hasForm && (
        <QuoteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formCode={effectiveFormCode ?? undefined}
          formTitle={formTitle ?? undefined}
          formConfig={formConfig ?? null}
          title={formTitle ?? title}
          topic={title}
        />
      )}
    </>
  );
};

export default CTASection;

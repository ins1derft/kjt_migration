'use client';

import Image from "next/image";
import { useState } from "react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from "@/lib/blocks/padding";
import ClickSpark from "@/components/bits/ClickSpark";
import QuoteModal from "@/components/blocks/QuoteModal";
import RichText from "../RichText";
import type { FormConfig } from "@/lib/api";

export interface GradientFormBannerProps {
  title: string;
  description?: string | null;
  ctaLabel?: string | null;
  formCode?: string | null;
  formTitle?: string | null;
  formConfig?: FormConfig | null;
  icon?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
  template?: "classic" | "wide";
}

const headingClasses = [
  "font-heading font-bold text-brand-dark tracking-[0px]",
  "text-[38px] leading-[45.6px]",
  "lg:text-[44px] lg:leading-[52.8px]",
  "max-w-[992px]",
].join(" ");

const descriptionClasses = [
  "font-sans font-normal text-brand-dark/80",
  "text-[16px] leading-[22.4px]",
  "md:text-[18px] md:leading-[25.2px]",
  "max-w-[720px]",
].join(" ");

const buttonClasses = [
  "inline-flex h-[53px] min-w-[188px] items-center justify-center px-7",
  "rounded-[100px] bg-white text-brand-dark font-heading font-bold",
  "text-[18px] leading-[22px]",
  "shadow-[0px_10px_25px_rgba(0,0,0,0.08)]",
  "transition-transform transition-shadow duration-150 hover:scale-[1.02] hover:shadow-[0px_12px_28px_rgba(0,0,0,0.12)]",
  "focus-visible:outline-none",
  "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70",
].join(" ");

export default function GradientFormBanner({
  title,
  description,
  ctaLabel = "Consultation",
  formCode,
  formTitle,
  formConfig,
  icon,
  padding,
  backgroundClass,
  backgroundColor,
  template = "classic",
}: GradientFormBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const paddingClass = resolveSectionPadding(padding, "");
  const iconSrc = resolveMediaUrl(icon);
  const sectionBackground = resolveSectionBackground(backgroundClass, "");
  const variant: GradientFormBannerProps["template"] = template === "wide" ? "wide" : "classic";
  const sectionStyle: React.CSSProperties = {
    background:
      variant === "wide"
        ? "linear-gradient(100deg, #FFB68D 0%, #E2BCD5 42%, #A2B4FF 100%)"
        : "linear-gradient(90deg, #FFAD81 0%, #A2B4FF 100%)",
    ...resolveSectionBackgroundStyle(backgroundColor),
  };

  const effectiveFormCode = formCode ?? formConfig?.code ?? null;
  const hasForm = Boolean(effectiveFormCode);

  const button = (
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
        className={buttonClasses}
        disabled={!hasForm}
      >
        {ctaLabel}
      </button>
    </ClickSpark>
  );

  if (variant === "wide") {
    return (
      <>
        <section
          className={cn(
            "relative overflow-hidden",
            sectionBackground,
            paddingClass,
          )}
          style={sectionStyle}
        >
          <div className="container mx-auto flex w-full flex-col gap-8 px-5 py-14 md:flex-row md:items-stretch md:justify-between md:gap-10 lg:gap-14 lg:py-20 2xl:py-24">
            <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 w-full max-w-[740px]">
              {iconSrc && (
                <div className="flex h-[82px] w-[82px] items-center justify-center overflow-hidden rounded-[24px] bg-white/40 backdrop-blur-[2px] md:h-[98px] md:w-[98px]">
                  <Image
                    src={iconSrc}
                    alt=""
                    width={112}
                    height={112}
                    className="h-[70px] w-[70px] object-contain md:h-[80px] md:w-[80px]"
                    priority
                  />
                </div>
              )}

              <div className="flex flex-col gap-4 md:gap-[18px]">
                <h2 className={headingClasses}>{title}</h2>
                {description && (
                  <RichText html={description} className={cn(descriptionClasses, "max-w-[760px]")} />
                )}
              </div>
            </div>

            <div className="mt-4 flex w-full md:mt-0 md:w-auto md:self-stretch">
              <div className="flex h-full w-full flex-col justify-end items-start md:w-auto md:items-end">
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
            title={formTitle ?? undefined}
            topic={title}
          />
        )}
      </>
    );
  }

  return (
    <>
      <section
        className={cn(
          "relative overflow-hidden",
          sectionBackground,
          paddingClass,
        )}
        style={sectionStyle}
      >
        <div className="container mx-auto flex w-full flex-col items-start gap-[27px] px-5 py-16 lg:flex-row lg:gap-[26px] lg:py-20 2xl:py-24">
          {iconSrc && (
            <div className="flex h-[93.751px] w-[83.336px] flex-shrink-0 lg:h-[212px] lg:w-[212px]">
              <Image
                src={iconSrc}
                alt=""
                width={212}
                height={212}
                className="h-full w-full object-contain"
                priority
              />
            </div>
          )}

          <div className="flex flex-col gap-[22px] lg:mt-[14px] md:gap-[20px]">
            <div className="flex flex-col gap-[12px]">
              <h2 className={headingClasses}>{title}</h2>
              {description && (
                <RichText html={description} className={descriptionClasses} />
              )}
            </div>

            <div>
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
          title={formTitle ?? undefined}
          topic={title}
        />
      )}
    </>
  );
}

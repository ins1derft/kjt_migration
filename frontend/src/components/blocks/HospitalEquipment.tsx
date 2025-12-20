import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";
import ClickSpark from "@/components/bits/ClickSpark";
import RichText from "../RichText";

type Feature = {
  title: string;
  description?: string | null;
  icon?: string | null;
};

export type HospitalEquipmentProps = {
  title?: string | null;
  description?: string | null;
  features?: Feature[] | null;
  ctaTitle?: string | null;
  ctaGradient?: string | null;
  ctaDescription?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  ctaBackground?: string | null;
  footerTitle?: string | null;
  footerDescription?: string | null;
  footerIcon?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const CUT_PX = 40;

const FeatureItem: React.FC<Feature & { desktop?: boolean }> = ({ title, description, icon }) => {
  const iconSrc = icon?.startsWith("/icons/") ? icon : resolveMediaUrl(icon);

  return (
    <div className="flex flex-col items-center text-center w-full max-w-[320px] lg:max-w-[250px] 2xl:max-w-[303px] mx-auto">
      <div className="flex items-center justify-center w-[103px] h-[103px] rounded-full bg-white shadow-[0_8px_28px_rgba(0,0,0,0.04)]">
        {iconSrc ? (
          <Image
            src={iconSrc}
            alt={title ?? ""}
            width={65}
            height={65}
            className="h-[65px] w-[65px] object-contain"
            loading="lazy"
            unoptimized
          />
        ) : null}
      </div>
      <h3 className="mt-[16px] font-heading font-extrabold text-[16px] leading-[1.4] text-[#1a1a1a]">{title}</h3>
      {description ? (
        <RichText
          html={description}
          className="mt-[10px] text-[16px] leading-[1.4] text-[rgba(26,26,26,0.7)] prose-p:my-0 prose-p:text-[16px] prose-p:leading-[1.4] prose-p:text-[rgba(26,26,26,0.7)] prose-headings:text-center prose-p:text-center prose-ul:my-2 prose-ol:my-2"
        />
      ) : null}
    </div>
  );
};

const HospitalEquipment: React.FC<HospitalEquipmentProps> = ({
  title,
  features = [],
  ctaTitle,
  ctaGradient,
  ctaDescription,
  ctaLabel,
  ctaHref,
  ctaBackground,
  description,
  footerTitle,
  footerDescription,
  footerIcon,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const paddingClass = resolveSectionPadding(padding, "pt-[64px] pb-[64px]");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-[#f4f5fa]");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const ctaBackgroundSrc = resolveMediaUrl(ctaBackground);
  const footerIconSrc = resolveMediaUrl(footerIcon);
  const hasFooterTitle = Boolean(footerTitle?.trim());
  const normalizedCtaGradient = ctaGradient?.replace(/\u00a0/g, " ");
  const normalizedFeatures = (features ?? []).filter(
    (feature) =>
      Boolean(feature?.title?.trim()) ||
      Boolean(feature?.description?.trim()) ||
      Boolean(feature?.icon?.trim?.() ?? feature?.icon),
  );
  const hasTitle = Boolean(title?.trim());
  const hasDescription = Boolean(description?.trim());
  const hasIntroText = hasTitle || hasDescription;
  const hasTopContent = hasTitle || hasDescription || normalizedFeatures.length > 0;
  const hasCtaContent = Boolean(
    ctaTitle?.trim() ||
      normalizedCtaGradient?.trim() ||
      ctaDescription?.trim() ||
      ctaLabel?.trim() ||
      ctaHref?.trim() ||
      ctaBackground?.trim(),
  );

  return (
    <section className={cn(sectionBackground, paddingClass)} style={sectionStyle}>
      {/* Top gradient block with features */}
      {hasTopContent ? (
        <div className="relative isolate overflow-hidden">
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,#FAE2FF_0%,#ACD3FF_100%)]"
            style={{
              clipPath: `polygon(
                0 0,
                50% ${CUT_PX}px,
                100% 0,
                100% calc(100% - ${CUT_PX}px),
                50% 100%,
                0 calc(100% - ${CUT_PX}px)
              )`,
            }}
            aria-hidden
          />

          <div
            className={cn(
              "relative mx-auto w-full max-w-[320px] sm:max-w-[520px] md:max-w-[720px] lg:max-w-[1086px] 2xl:max-w-[1250px] px-5 sm:px-6 lg:px-8",
              hasIntroText
                ? "pt-[128px] lg:pt-[142px] 2xl:pt-[186px] pb-[128px] md:pb-[117px]"
                : "pt-[128px] md:pt-[117px] pb-[128px] md:pb-[117px]",
            )}
          >
            {hasTitle ? (
              <h2 className="text-center font-heading font-bold text-[38px] leading-[1.05] text-[#1a1a1a] lg:text-[64px] lg:leading-[1.05]">
                {title}
              </h2>
            ) : null}

            {hasDescription ? (
              <RichText
                html={description}
                className="mt-[18px] text-center text-[18px] leading-[1.5] text-[rgba(26,26,26,0.78)] lg:text-[20px] lg:leading-[1.5] prose-p:my-0 prose-p:text-[18px] lg:prose-p:text-[20px] prose-p:leading-[1.5] prose-p:text-[rgba(26,26,26,0.78)] prose-ul:my-2 prose-ol:my-2 prose-headings:text-center"
              />
            ) : null}

            {normalizedFeatures.length ? (
              <div
                className={cn(
                  "grid grid-cols-1 gap-y-[44px] lg:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] lg:gap-x-[29px] lg:gap-y-[36px] 2xl:gap-x-[36px]",
                  hasIntroText ? "mt-[44px] lg:mt-[48px]" : "mt-0",
                )}
              >
                {normalizedFeatures.map((feature, index) => (
                  <FeatureItem key={`${feature.title ?? index}-${index}`} {...feature} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* CTA block */}
      {hasCtaContent ? (
        <div
          className="relative overflow-hidden border-0"
          style={{
            clipPath: `polygon(
              0 0,
              50% ${CUT_PX}px,
              100% 0,
              100% 100%,
              0 100%
            )`,
          }}
        >
          {ctaBackgroundSrc ? (
              <div className="absolute inset-0 z-0">
                <div
                  className="absolute inset-0 bg-fixed bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${ctaBackgroundSrc}")`,
                  }}
                />
                <div className="absolute inset-0 bg-[rgba(26,26,26,0.7)]" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-[#0f0f0f]" aria-hidden />
            )}

          <div className="relative z-10 mx-auto flex flex-col items-center text-center w-full max-w-[320px] sm:max-w-[560px] md:max-w-[720px] lg:max-w-[900px] 2xl:max-w-[970px] px-5 sm:px-6 lg:px-10 pt-[80px] md:pt-[171px] pb-[63px] md:pb-[122px]">
            <p className="font-heading font-bold text-[38px] leading-[1.1] text-white lg:text-[64px] lg:leading-[1.1]">
              {ctaTitle}
            </p>
            {normalizedCtaGradient ? (
              <p className="mt-[17px] bg-brand-gradient bg-clip-text font-heading font-bold text-[38px] leading-[1.1] text-transparent lg:text-[64px] lg:leading-[1.1] break-words">
                {normalizedCtaGradient}
              </p>
            ) : null}

            {ctaDescription ? (
              <RichText
                html={ctaDescription}
                className="mt-6 text-[16px] leading-[1.5] text-white/80 lg:text-[18px] lg:leading-[1.55] prose-p:my-0 prose-p:text-[16px] lg:prose-p:text-[18px] prose-p:leading-[1.5] lg:prose-p:leading-[1.55] prose-p:text-white/80 prose-a:text-white"
              />
            ) : null}

            {ctaLabel && ctaHref ? (
              <ClickSpark
                sparkColor="#0f0f0f"
                sparkRadius={16}
                sparkCount={9}
                duration={220}
                easing="linear"
                blendMode="normal"
                className="inline-block"
              >
                <Link
                  href={ctaHref}
                  prefetch={false}
                  className="mt-[72px] inline-flex h-[53px] items-center justify-center rounded-[100px] bg-white px-9 text-center font-heading text-[16px] font-bold leading-[normal] text-[#2f2f2f] shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-transform duration-150 hover:shadow-[0_10px_28px_rgba(0,0,0,0.16)] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  {ctaLabel}
                </Link>
              </ClickSpark>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Footer block */}
      {hasFooterTitle ? (
        <div className="mx-auto w-full max-w-[320px] sm:max-w-[520px] md:max-w-[720px] lg:max-w-[952px] px-5 sm:px-6 lg:px-10 pt-[64px] lg:pt-[72px] pb-[72px]">
          <div className="flex items-center justify-center gap-3 text-center">
            {footerIconSrc ? (
              <Image
                src={footerIconSrc}
                alt={footerTitle ?? ""}
                width={36}
                height={36}
                className="h-[36px] w-[36px] object-contain"
                loading="lazy"
                unoptimized
              />
            ) : null}
            <span className="font-heading font-extrabold text-[24px] leading-[1.4] text-[#1a1a1a]">
              {footerTitle}
            </span>
          </div>
          {footerDescription ? (
            <RichText
              html={footerDescription}
              className="mt-4 text-center text-[16px] leading-[1.4] text-[rgba(26,26,26,0.7)] prose-p:my-0 prose-p:text-[16px] prose-p:leading-[1.4] prose-p:text-[rgba(26,26,26,0.7)] prose-p:text-center prose-ul:my-2 prose-ol:my-2"
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default HospitalEquipment;

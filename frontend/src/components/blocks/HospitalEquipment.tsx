import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";
import ClickSpark from "@/components/bits/ClickSpark";
import GradientText from "@/components/bits/GradientText";

type Feature = {
  title: string;
  description?: string | null;
  icon?: string | null;
};

export type HospitalEquipmentProps = {
  title?: string | null;
  features?: Feature[] | null;
  ctaTitle?: string | null;
  ctaGradient?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  ctaBackground?: string | null;
  footerTitle?: string | null;
  footerDescription?: string | null;
  footerIcon?: string | null;
  padding?: SectionPadding | null;
};

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
        <p className="mt-[10px] text-[16px] leading-[1.4] text-[rgba(26,26,26,0.7)]">{description}</p>
      ) : null}
    </div>
  );
};

const HospitalEquipment: React.FC<HospitalEquipmentProps> = ({
  title,
  features = [],
  ctaTitle,
  ctaGradient,
  ctaLabel,
  ctaHref,
  ctaBackground,
  footerTitle,
  footerDescription,
  footerIcon,
  padding,
}) => {
  const paddingClass = resolveSectionPadding(padding, "");
  const ctaBackgroundSrc = resolveMediaUrl(ctaBackground);
  const footerIconSrc = resolveMediaUrl(footerIcon);

  return (
    <section className={cn("bg-[#f4f5fa]", paddingClass)}>
      {/* Top gradient block with features */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#FAE2FF_0%,#ACD3FF_100%)]" aria-hidden />
        {/* Bottom white chevron */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-px left-0 w-full bg-[#f4f5fa]"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", height: "120px" }}
        />

        <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[520px] md:max-w-[720px] lg:max-w-[1086px] 2xl:max-w-[1320px] px-5 sm:px-6 lg:px-8 pt-[128px] lg:pt-[142px] 2xl:pt-[186px] pb-[162px] lg:pb-[168px] 2xl:pb-[168px]">
          <h2 className="text-center font-heading font-bold text-[38px] leading-[1.05] text-transparent lg:text-[64px] lg:leading-[1.05]">
            <GradientText className="!rounded-none !p-0 !shadow-none">
              {title}
            </GradientText>
          </h2>

          <div className="mt-[44px] grid grid-cols-1 gap-y-[44px] lg:mt-[48px] lg:grid-cols-4 lg:gap-y-0 lg:gap-x-[29px] 2xl:gap-x-[36px]">
            {(features ?? []).map((feature, index) => (
              <FeatureItem key={`${feature.title ?? index}-${index}`} {...feature} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA block */}
      <div className="relative overflow-hidden">
        {/* Top white chevron separating from gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[78px] left-0 w-full bg-white md:-top-[120px]"
          style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)", height: "78px" }}
        />
        {ctaBackgroundSrc ? (
          <>
            <Image
              src={ctaBackgroundSrc}
              alt=""
              fill
              priority={false}
              className="absolute inset-0 h-full w-full object-cover"
              sizes="100vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-[rgba(26,26,26,0.7)]" aria-hidden />
          </>
        ) : (
          <div className="absolute inset-0 bg-[#0f0f0f]" aria-hidden />
        )}

        <div className="relative mx-auto flex flex-col items-center text-center w-full max-w-[320px] sm:max-w-[560px] md:max-w-[720px] lg:max-w-[900px] 2xl:max-w-[970px] px-5 sm:px-6 lg:px-10 pt-[130px] md:pt-[170px] 2xl:pt-[182px] pb-[130px] lg:pb-[150px] 2xl:pb-[160px]">
          <p className="font-heading font-bold text-[38px] leading-[1.1] text-white lg:text-[64px] lg:leading-[1.1]">
            {ctaTitle}
          </p>
          {ctaGradient ? (
            <div className="mt-[17px] font-heading font-bold text-[38px] leading-[1.1] lg:text-[64px] lg:leading-[1.1]">
              <GradientText className="!rounded-none !p-0 !shadow-none !leading-[1.1]">
                {ctaGradient}
              </GradientText>
            </div>
          ) : null}

          {ctaLabel && ctaHref ? (
            <ClickSpark sparkColor="#ffffff" sparkRadius={16} sparkCount={9} duration={220} easing="linear" className="inline-block">
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

      {/* Footer block */}
      <div className="bg-[#f4f5fa]">
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
            <p className="mt-4 text-center text-[16px] leading-[1.4] text-[rgba(26,26,26,0.7)]">{footerDescription}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default HospitalEquipment;

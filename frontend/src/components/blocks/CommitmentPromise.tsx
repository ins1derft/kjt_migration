import React from "react";
import Image from "next/image";
import RichText from "@/components/RichText";
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from "@/lib/blocks/padding";

export type CommitmentPromiseProps = {
  image?: string | null;
  imageAlt?: string | null;
  slogan?: string | null;
  title?: string | null;
  description?: string | null;
  buttonLabel?: string | null;
  buttonHref?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const CommitmentPromise: React.FC<CommitmentPromiseProps> = ({
  image,
  imageAlt,
  slogan,
  title,
  description,
  buttonLabel,
  buttonHref,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const imageUrl = resolveMediaUrl(image ?? null);
  const hasSlogan = Boolean(slogan?.trim());
  const hasTitle = Boolean(title?.trim());
  const hasDescription = Boolean(description?.trim());
  const hasButton = Boolean(buttonLabel?.trim() && buttonHref?.trim());

  const hasContent = Boolean(imageUrl || hasSlogan || hasTitle || hasDescription || hasButton);

  if (!hasContent) {
    return null;
  }

  const paddingClass = resolveSectionPadding(padding, "py-12 2xl:py-0");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-white");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn(sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-10 2xl:px-0">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10 2xl:gap-[59px]">
          {imageUrl ? (
            <div className="w-full overflow-hidden lg:flex-[0_0_50%] 2xl:flex-[0_0_654px] 2xl:max-w-[654px]">
              <div className="relative w-full aspect-[654/941]">
                <Image
                  src={imageUrl}
                  alt={imageAlt ?? ""}
                  fill
                  sizes="(min-width: 1536px) 654px, (min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            </div>
          ) : null}

          <div className="flex w-full flex-col items-start 2xl:flex-[0_0_607px] 2xl:max-w-[607px] 2xl:pt-[60px] 2xl:pb-[48px]">
            <div className="w-full 2xl:max-w-[605px]">
              {hasSlogan ? (
                <p className="font-heading text-[16px] uppercase leading-[1.4] text-brand-dark md:text-[18px] 2xl:text-[22px]">
                  {slogan}
                </p>
              ) : null}

              {hasTitle ? (
                <h2
                  className={cn(
                    hasSlogan ? "mt-[33px]" : null,
                    "whitespace-pre-line bg-brand-gradient bg-clip-text font-heading text-[32px] font-bold leading-none text-transparent md:text-[48px] 2xl:text-[64px]"
                  )}
                >
                  {title}
                </h2>
              ) : null}

              {hasDescription ? (
                <RichText
                  html={description}
                  className={cn(
                    hasTitle ? "mt-[26px]" : null,
                    "font-heading text-[16px] leading-[1.4] text-brand-dark/70 md:text-[18px] lg:text-[20px]",
                    "prose-p:my-0 prose-p:font-heading prose-p:text-inherit prose-strong:font-semibold"
                  )}
                />
              ) : null}
            </div>

            {hasButton ? (
              <a
                href={buttonHref ?? "#"}
                className="mt-[58px] inline-flex h-[53px] w-[232px] items-center justify-center rounded-[100px] bg-gradient-cta font-heading text-[16px] font-bold leading-none text-white transition-transform duration-150 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
              >
                {buttonLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommitmentPromise;

import React from "react";
import Image from "next/image";
import RichText from "../RichText";
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from "@/lib/blocks/padding";

type MediaInput = string | { src?: string | null; alt?: string | null } | null;

export type GuideIntroProps = {
  text?: string | null;
  image?: MediaInput;
  imageAlt?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const normalizeMedia = (media: MediaInput) => {
  if (!media) return { src: null, alt: "" };
  if (typeof media === "string") return { src: resolveMediaUrl(media), alt: "" };
  return { src: resolveMediaUrl(media.src ?? null), alt: media.alt ?? "" };
};

const GuideIntro: React.FC<GuideIntroProps> = ({
  text,
  image,
  imageAlt,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const { src: imageSrc, alt: fallbackAlt } = normalizeMedia(image ?? null);
  const resolvedAlt = imageAlt ?? fallbackAlt;
  const hasText = Boolean(text?.trim());
  const hasImage = Boolean(imageSrc);

  if (!hasText && !hasImage) {
    return null;
  }

  const paddingClass = resolveSectionPadding(
    padding,
    "pt-[60px] pb-[75px]"
  );
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-white");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn(sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto w-full px-5 sm:px-6 lg:px-10 2xl:max-w-[1320px] 2xl:px-0">
        <div
          className={cn(
            "flex w-full flex-col gap-[32px] lg:gap-[80px]",
            hasImage ? "lg:flex-row lg:items-start" : "lg:flex-col"
          )}
        >
          {hasImage ? (
            <div className="flex w-full justify-center lg:justify-start lg:max-w-[315px]">
              <div className="relative w-full max-w-[315px] overflow-hidden rounded-[10px] bg-[#dfe3ec]">
                <div className="relative aspect-[315/337] w-full">
                  <Image
                    src={imageSrc ?? ""}
                    alt={resolvedAlt || ""}
                    fill
                    sizes="(max-width: 768px) 80vw, 315px"
                    className="object-cover"
                    priority={false}
                    unoptimized
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className={cn("flex w-full flex-col text-left", hasImage ? "lg:max-w-[927px]" : "lg:max-w-none")}>
            {hasText ? (
              <RichText
                html={text}
                className={cn(
                  "font-heading text-[16px] leading-[1.4] text-brand-dark/70 md:text-[18px] lg:text-[20px]",
                  "prose-p:my-0 prose-p:font-heading prose-p:text-[16px] md:prose-p:text-[18px] lg:prose-p:text-[20px]",
                  "prose-p:leading-[1.4] prose-p:text-brand-dark/70",
                  "prose-h2:font-heading prose-h2:font-bold prose-h2:leading-none prose-h2:text-brand-dark",
                  "prose-h2:text-[32px] md:prose-h2:text-[38px] lg:prose-h2:text-[44px]",
                  "prose-h2:mt-[40px] md:prose-h2:mt-[48px] lg:prose-h2:mt-[56px]",
                  "prose-h2:mb-[12px] md:prose-h2:mb-[12px]",
                  "prose-h2:max-w-[992px]"
                )}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuideIntro;

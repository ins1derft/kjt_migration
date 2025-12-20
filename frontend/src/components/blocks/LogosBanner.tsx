/* eslint-disable @next/next/no-img-element */
import React from "react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from "@/lib/blocks/padding";

export type LogosBannerProps = {
  image?: string | null;
  alt?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const LogosBanner: React.FC<LogosBannerProps> = ({
  image,
  alt,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const imageUrl = resolveMediaUrl(image);

  if (!imageUrl) {
    return null;
  }

  const paddingClass = resolveSectionPadding(
    padding,
    "py-[80px] sm:py-[96px] lg:py-[120px] 2xl:py-[138px]"
  );
  const sectionBackground = resolveSectionBackground(
    backgroundClass,
    "bg-logos-gradient"
  );
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        "min-h-[520px] md:min-h-[620px] 2xl:min-h-[780px]",
        sectionBackground,
        paddingClass
      )}
      style={sectionStyle}
    >
      <div className="container mx-auto flex w-full max-w-[1920px] items-center justify-center px-5 sm:px-6 lg:px-10 2xl:px-0">
        <img
          src={imageUrl}
          alt={alt ?? ""}
          className="h-auto w-full max-w-[1377px] object-contain"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default LogosBanner;

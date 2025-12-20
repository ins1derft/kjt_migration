import React from "react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from "@/lib/blocks/padding";

export type LargeBannersProps = {
  title?: string | null;
  backgroundImage?: string | null;
  arrowHref?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const LargeBanners: React.FC<LargeBannersProps> = ({
  title,
  backgroundImage,
  arrowHref,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const hasTitle = Boolean(title?.trim());
  const hasArrow = Boolean(arrowHref?.trim());
  const hasBackground = Boolean(backgroundImage?.trim());

  if (!hasTitle && !hasArrow && !hasBackground) {
    return null;
  }

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
      (padding && typeof padding === "object" && ("top" in padding || "bottom" in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "py-0");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-brand-dark");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const backgroundUrl = backgroundImage ? resolveMediaUrl(backgroundImage) : null;

  return (
    <section
      className={cn("relative overflow-hidden", sectionBackground, paddingClass, "min-h-[802px]")}
      style={sectionStyle}
    >
      {backgroundUrl ? (
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-fixed bg-cover bg-center"
            style={{ backgroundImage: `url("${backgroundUrl}")` }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ) : null}

      <div
        className={cn(
          "container relative z-10 mx-auto flex min-h-[802px] w-full flex-col items-center justify-center",
          "px-5 sm:px-6 lg:px-10 2xl:px-0 text-center",
          hasArrow ? "gap-[82px]" : ""
        )}
      >
        {hasTitle ? (
          <h2 className="mx-auto w-full max-w-[976px] font-heading font-bold leading-none text-white text-[38px] sm:text-[48px] lg:text-[64px] 2xl:text-[84px]">
            {title}
          </h2>
        ) : null}

        {hasArrow ? (
          <a
            href={arrowHref ?? "#"}
            aria-label="Go to section"
            className="inline-flex h-[21.648px] w-[44px] items-center justify-center"
          >
            <img
              src="/icons/large-banners/arrow-down.svg"
              alt=""
              className="h-[21.648px] w-[44px]"
              loading="lazy"
            />
          </a>
        ) : null}
      </div>
    </section>
  );
};

export default LargeBanners;

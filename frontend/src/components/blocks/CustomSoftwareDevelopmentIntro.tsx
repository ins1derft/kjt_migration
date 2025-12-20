import React from "react";
import Image from "next/image";
import { cn, resolveMediaUrl } from "@/lib/utils";
import RichText from "../RichText";
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from "@/lib/blocks/padding";

export type CustomSoftwareDevelopmentIntroItem = {
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  iconAlt?: string | null;
};

export type CustomSoftwareDevelopmentIntroProps = {
  title?: string | null;
  description?: string | null;
  gridTitle?: string | null;
  items?: CustomSoftwareDevelopmentIntroItem[] | null;
  decorationLeft?: string | null;
  decorationRight?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const CustomSoftwareDevelopmentIntro: React.FC<CustomSoftwareDevelopmentIntroProps> = ({
  title,
  description,
  gridTitle,
  items,
  decorationLeft,
  decorationRight,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const safeItems = Array.isArray(items)
    ? items.filter((item) => item && (item.title?.trim() || item.description?.trim() || item.icon))
    : [];

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
      (padding && typeof padding === "object" && ("top" in padding || "bottom" in padding))
  );
  const paddingClass = resolveSectionPadding(
    padding,
    hasCustomPadding ? "" : "pt-[88px] pb-[120px] md:pt-[123px] md:pb-[99px] 2xl:pb-[125px]"
  );

  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-brand-gray");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const shouldRenderDecorations = safeItems.length === 6 && Boolean(decorationLeft || decorationRight);
  const decorationLeftSrc = resolveMediaUrl(decorationLeft);
  const decorationRightSrc = resolveMediaUrl(decorationRight);

  if (!title && !description && !gridTitle && safeItems.length === 0) {
    return null;
  }

  return (
    <section className={cn("relative overflow-hidden", paddingClass, sectionBackground)} style={sectionStyle}>
      <Image
        src="/images/custom-software-development/waves.png"
        alt=""
        width={2560}
        height={1021}
        className={cn(
          "pointer-events-none absolute left-1/2 -translate-x-1/2 select-none",
          "top-40 ml-12 h-[601px] w-[1506px] max-w-none",
          "md:top-[59px] md:ml-0 md:h-[1021px] md:w-[2560px]"
        )}
        unoptimized
      />

      <div className="container mx-auto w-full max-w-none px-5 md:px-0">
        <div className="relative z-10 mx-auto flex w-full flex-col items-center text-center">
          {title ? (
            <h2 className="mx-auto w-full max-w-[992px] font-heading font-bold leading-none text-[38px] text-transparent bg-clip-text bg-brand-gradient md:text-[84px]">
              {title}
            </h2>
          ) : null}

          {description ? (
            <RichText
              html={description}
              className="mt-[23px] w-full max-w-[320px] font-heading font-normal text-[16px] leading-[1.4] text-brand-dark/70 md:mt-[30px] md:max-w-[1091px] md:text-[22px] 2xl:max-w-[1200px] prose-p:my-0 prose-p:font-heading prose-p:text-[16px] prose-p:leading-[1.4] md:prose-p:text-[22px] md:prose-p:leading-[1.4] text-center"
            />
          ) : null}

          {gridTitle ? (
            <h3 className="mt-[42px] w-full max-w-[320px] font-heading font-bold leading-none text-brand-dark text-[22px] md:mt-[100px] md:max-w-[461px] md:text-[34px]">
              {gridTitle}
            </h3>
          ) : null}

          {safeItems.length ? (
            <>
              <div
                className={cn(
                  "mt-[42px] grid w-full grid-cols-1 justify-items-center gap-y-[60px]",
                  "md:mt-[27px] md:max-w-[1064px] md:grid-cols-2 md:gap-x-[72px] md:gap-y-0",
                  "2xl:max-w-[1128px] 2xl:gap-x-[20px]"
                )}
              >
                {safeItems.slice(0, 6).map((item, index) => {
                  const iconSrc = resolveMediaUrl(item.icon);

                  return (
                    <div key={`${item.title ?? "item"}-${index}`} className="flex w-full flex-col items-center text-center">
                      {iconSrc ? (
                        <div className="relative h-[47px] w-[63px] shrink-0">
                          <Image
                            src={iconSrc}
                            alt={item.iconAlt ?? ""}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      ) : null}

                      {item.title ? (
                        <h4 className="mt-[25px] w-full max-w-[320px] font-heading font-bold leading-none text-brand-dark text-[24px]">
                          {item.title}
                        </h4>
                      ) : null}

                      {item.description ? (
                        <RichText
                          html={item.description}
                          className="mt-[10px] w-full max-w-[320px] font-heading font-normal text-brand-dark/70 text-[16px] leading-[21px] md:mt-[11px] md:max-w-[496px] md:text-[20px] md:leading-[26px] 2xl:max-w-[554px] prose-p:my-0 prose-p:font-heading prose-p:text-[16px] prose-p:leading-[21px] md:prose-p:text-[20px] md:prose-p:leading-[26px] text-center"
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {shouldRenderDecorations ? (
                <div className="pointer-events-none absolute inset-x-0 top-[640px] z-0 hidden lg:block">
                  <div className="relative mx-auto w-full max-w-[1320px]">
                    {decorationLeftSrc ? (
                      <div className="absolute -left-[40px] top-[280px] h-[278px] w-[237px] 2xl:-left-[70px] 2xl:top-[270px] 2xl:h-[337px] 2xl:w-[288px]">
                        <Image
                          src={decorationLeftSrc}
                          alt=""
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : null}

                    {decorationRightSrc ? (
                      <div className="absolute -right-[40px] top-[0px] h-[278px] w-[237px] 2xl:-right-[70px] 2xl:top-[0px] 2xl:h-[337px] 2xl:w-[287px]">
                        <Image
                          src={decorationRightSrc}
                          alt=""
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default CustomSoftwareDevelopmentIntro;

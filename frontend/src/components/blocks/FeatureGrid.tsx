import React from "react";
import Image from "next/image";
import { cn, resolveMediaUrl } from "@/lib/utils";
import RichText from "../RichText";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string | null; // URL to uploaded file (storage), same contract as hero_values
  photo?: string | null; // Optional photo that replaces icon and renders full-width
}

export interface FeatureGridProps {
  items: FeatureItem[];
  title?: string;
  description?: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  columns?: 1 | 2 | 3 | 4;
  padding?: SectionPadding | null;
  variant?: 'plain' | 'colored' | 'colored-photo' | 'advantages' | 'live-demo';
  decoration?: string | null;
  decorationLeft?: string | null;
  decorationRight?: string | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ 
    items, 
    title, 
    description,
    ctaLabel,
    ctaHref,
    columns, 
    padding,
  variant = 'plain',
  decoration,
  decorationLeft,
  decorationRight,
  backgroundClass,
  backgroundColor,
}) => {

  const isAdvantages = variant === "advantages";
  const isColored = variant === 'colored' || variant === 'colored-photo';
  const isColoredPhoto = variant === 'colored-photo';
  const isLiveDemo = variant === 'live-demo';

  const maxColumns = columns ?? (isColored ? 4 : 3);
  const resolvedColumns = Math.max(1, Math.min(maxColumns, items.length || maxColumns));

  const gridClass = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 2xl:grid-cols-3',
    4: 'md:grid-cols-2 2xl:grid-cols-4',
  }[resolvedColumns];

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const defaultPadding = isAdvantages
    ? "pt-[113px] pb-[194px]"
    : isLiveDemo
      ? "pt-[75px] pb-[75px]"
    : isColored
      ? "pt-[78px] pb-[79px]"
      : "py-16";

  const extraSpacing = hasCustomPadding
    ? ""
    : (isColored || isAdvantages || isLiveDemo)
      ? ""
      : "pt-[148px] md:pt-[110px] pb-[225px] md:pb-[130px]";

  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : defaultPadding);
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-white");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const headingSpacing = isColored ? "mb-[30px] md:mb-[64px]" : "mb-[60px] md:mb-[64px]";
  const gridGap = isColored
    ? "gap-y-[15px] md:gap-y-[21px] md:gap-x-[21px] 2xl:gap-x-[19px] 2xl:gap-y-[21px]"
    : "gap-y-12 md:gap-y-12 lg:gap-y-14 2xl:gap-y-16 gap-x-10 md:gap-x-16 lg:gap-x-24";
  const containerClass = isLiveDemo
    ? "container mx-auto w-full px-5 md:px-6 lg:px-[50px] 2xl:px-0"
    : isAdvantages
    ? "mx-auto w-full max-w-[1320px] px-5 md:px-6 lg:px-[50px] 2xl:px-0"
    : isColored
    ? "mx-auto w-full max-w-[1320px] px-[20px] md:px-[32px] lg:px-[50px] 2xl:px-0"
    : "container mx-auto w-full px-5 sm:px-6 lg:px-10 2xl:max-w-[1320px]";

  const renderIcon = (icon: string | undefined | null, className: string, alt?: string) => {
    const imageSrc = icon?.startsWith('/icons/') ? icon : resolveMediaUrl(icon);
    if (!imageSrc) return null;
    return (
      <Image
        src={imageSrc}
        alt={alt ?? ""}
        width={70}
        height={70}
        className={cn(className, "object-contain")}
        unoptimized
      />
    );
  };

  const renderPhoto = (photo: string | undefined | null, alt?: string) => {
    const imageSrc = resolveMediaUrl(photo);
    if (!imageSrc) return null;

    return (
      <div
        className={cn(
          "w-full overflow-hidden rounded-[12px] md:rounded-[14px] bg-gray-100",
          isColored ? "mb-[20px] md:mb-[26px]" : "mb-5 md:mb-6"
        )}
      >
        <div className="relative w-full h-[190px] md:h-[220px] 2xl:h-[260px]">
          <Image
            src={imageSrc}
            alt={alt ?? ""}
            fill
            className="object-cover"
            sizes="(min-width:1536px) 600px, (min-width:1024px) 45vw, (min-width:768px) 50vw, 100vw"
            unoptimized
            priority={false}
          />
        </div>
      </div>
    );
  };

  const renderFullBleedPhoto = (photo: string | undefined | null, alt?: string) => {
    const imageSrc = resolveMediaUrl(photo);
    if (!imageSrc) return null;

    return (
      <div className="relative w-full bg-gray-100">
        <div className="relative w-full h-[184px] md:h-[210px] 2xl:h-[230px]">
          <Image
            src={imageSrc}
            alt={alt ?? ""}
            fill
            className="object-cover"
            sizes="(min-width:1536px) 360px, (min-width:1024px) 28vw, (min-width:768px) 45vw, 100vw"
            unoptimized
            priority={false}
          />
        </div>
      </div>
    );
  };

  if (isLiveDemo) {
    const safeItems = Array.isArray(items)
      ? items.filter((item) => item && (item.title?.trim() || item.description?.trim()))
      : [];
    const hasHeading = Boolean(title?.trim()) || Boolean(description?.trim());
    const showCta = Boolean(ctaLabel?.trim());

    if (!hasHeading && safeItems.length === 0 && !showCta) {
      return null;
    }

    return (
      <section className={cn(paddingClass, sectionBackground)} style={sectionStyle}>
        <div className={containerClass}>
          {hasHeading ? (
            <div className="flex w-full flex-col text-left">
              {title ? (
                <h2 className="w-full max-w-[974px] font-heading font-bold leading-none text-[32px] text-brand-dark md:text-[38px] 2xl:text-[44px]">
                  {title}
                </h2>
              ) : null}

              {description ? (
                <RichText
                  html={description}
                  className={cn(
                    "mt-[16px] max-w-[974px] font-heading text-[16px] font-normal leading-[1.4] text-brand-dark/70",
                    "prose-p:my-0 prose-p:font-heading prose-p:text-[16px] prose-p:leading-[1.4]"
                  )}
                />
              ) : null}
            </div>
          ) : null}

          {safeItems.length ? (
            <div className="mt-[40px] grid grid-cols-1 gap-[10px] md:mt-[60px] md:grid-cols-2 md:gap-[16px] 2xl:mt-[87px] 2xl:grid-cols-[427px_426px_427px] 2xl:gap-[20px]">
              {safeItems.map((item, index) => {
                const formattedIndex = String(index + 1).padStart(2, "0");

                return (
                  <div
                    key={`${item.title ?? "item"}-${index}`}
                    className={cn(
                      "flex w-full min-h-[215px] flex-col items-start rounded-[10px] bg-white",
                      "shadow-[0px_2px_20.6px_rgba(0,0,0,0.1)]",
                      "pl-[30px] pr-[28px] pt-[33px]",
                      "2xl:h-[215px]"
                    )}
                  >
                    <span className="font-heading text-[22px] font-bold leading-[1.2] text-brand-dark">
                      {formattedIndex}
                    </span>

                    {item.title ? (
                      <h3 className="mt-[13px] font-heading text-[18px] font-extrabold leading-[1.4] text-brand-dark/70">
                        {item.title}
                      </h3>
                    ) : null}

                    {item.description ? (
                      <RichText
                        html={item.description}
                        className={cn(
                          "mt-[10px] font-heading text-[16px] font-normal leading-[1.4] text-brand-dark/70",
                          "prose-p:my-0 prose-p:font-heading prose-p:text-[16px] prose-p:leading-[1.4]"
                        )}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}

          {showCta ? (
            <div className="mt-[32px] md:mt-[40px] 2xl:mt-[50px]">
              <a
                href={ctaHref ?? "#"}
                className="inline-flex h-[57px] w-[207px] items-center justify-center rounded-full bg-gradient-cta font-heading text-[16px] font-bold leading-[normal] text-white"
              >
                {ctaLabel}
              </a>
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  if (isAdvantages) {
    const safeItems = items.slice(0, 6);
    const decorationSrc = resolveMediaUrl(decoration);
    const decorationLeftSrc = resolveMediaUrl(decorationLeft);
    const decorationRightSrc = resolveMediaUrl(decorationRight);

    const getAdvantagesRadiusClass = (index: number) => {
      switch (index) {
        case 0:
        case 5:
          return "rounded-[165px] 2xl:rounded-[200px]";
        case 1:
          return "rounded-[16.5px] rounded-tr-[165px] 2xl:rounded-[20px] 2xl:rounded-tr-[200px]";
        case 2:
        case 4:
          return "rounded-[16.5px] rounded-bl-[165px] rounded-br-[165px] 2xl:rounded-[20px] 2xl:rounded-bl-[200px] 2xl:rounded-br-[200px]";
        case 3:
          return "rounded-[16.5px] rounded-tl-[165px] rounded-tr-[165px] 2xl:rounded-[20px] 2xl:rounded-tl-[200px] 2xl:rounded-tr-[200px]";
        default:
          return "rounded-[16.5px] 2xl:rounded-[20px]";
      }
    };

    const renderAdvantagesCard = (item: FeatureItem, index: number) => {
      const iconSrc = resolveMediaUrl(item.icon);

      return (
        <div
          key={`${item.title}-${index}`}
          className={cn(
            "flex flex-col items-center text-center bg-brand-gray",
            "h-[320px] lg:h-[307px] 2xl:h-[372px]",
            "pt-[85px] 2xl:pt-[103px]",
            getAdvantagesRadiusClass(index)
          )}
        >
          {iconSrc && (
            <Image
              src={iconSrc}
              alt=""
              width={56}
              height={56}
              className="h-[46.2px] w-[46.2px] 2xl:h-[56px] 2xl:w-[56px] object-contain"
              unoptimized
            />
          )}

          <h3 className="mt-[22px] 2xl:mt-[27px] font-heading font-bold leading-[1.2] text-brand-dark text-[28.05px] 2xl:text-[34px]">
            {item.title}
          </h3>

          {item.description && (
            <div
              className="font-heading font-normal leading-[1.4] text-brand-dark/70 text-[13.2px] 2xl:text-[16px] [&_p]:m-0 [&_strong]:font-bold"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          )}
        </div>
      );
    };

    const topRow = safeItems.slice(0, 3);
    const bottomRow = safeItems.slice(3, 6);

    return (
      <section
        className={cn(
          paddingClass,
          sectionBackground,
          "relative overflow-hidden"
        )}
        style={sectionStyle}
      >
        {/* Background decoration (single SVG from admin, same field as colored variant) */}
        {decorationSrc ? (
          <Image
            src={decorationSrc}
            alt=""
            width={2222}
            height={1167}
            className="pointer-events-none absolute z-0 left-1/2 -translate-x-1/2 -top-10 w-[140%] h-auto max-w-none md:w-[180%] lg:w-[200%] 2xl:w-[160%]"
            unoptimized
          />
        ) : null}

        <div className={cn(containerClass, "relative z-10")}>
          {title && (
            <h2 className="mx-auto w-full text-center font-heading font-bold leading-none text-brand-dark text-[36px] lg:text-[64px]">
              {title}
            </h2>
          )}

          <div className="mt-[47px] lg:mt-[64px] 2xl:mt-[59px]">
            {/* Mobile: stacked list */}
            <div className="grid grid-cols-1 gap-y-[10px] lg:hidden">
              {safeItems.map(renderAdvantagesCard)}
            </div>

            {/* Tablet/Desktop: two rows + decorative illustrations */}
            <div className="hidden lg:block">
              <div className="flex w-full justify-between">
                <div className="grid grid-cols-[260px_261px_261px] gap-x-[15px] 2xl:grid-cols-[314px_316px_316px] 2xl:gap-x-[20px]">
                  {topRow.map(renderAdvantagesCard)}
                </div>

                <div className="relative mt-[29px] h-[278px] w-[237px] 2xl:mt-[35px] 2xl:h-[337px] 2xl:w-[287px]">
                  {decorationRightSrc ? (
                    <Image
                      src={decorationRightSrc}
                      alt=""
                      fill
                      className="pointer-events-none select-none object-contain"
                      unoptimized
                    />
                  ) : null}
                </div>
              </div>

              <div className="mt-[16px] 2xl:mt-[20px] flex w-full justify-between">
                <div className="relative mt-[24px] h-[278px] w-[237px] 2xl:mt-[29px] 2xl:h-[337px] 2xl:w-[288px]">
                  {decorationLeftSrc ? (
                    <Image
                      src={decorationLeftSrc}
                      alt=""
                      fill
                      className="pointer-events-none select-none object-contain"
                      unoptimized
                    />
                  ) : null}
                </div>

                <div className="grid grid-cols-[261px_261px_260px] gap-x-[15px] 2xl:grid-cols-[316px_316px_314px] 2xl:gap-x-[20px]">
                  {bottomRow.map(renderAdvantagesCard)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        paddingClass,
        sectionBackground,
        "relative overflow-hidden",
        extraSpacing
      )}
      style={sectionStyle}
    >
      {(() => {
        const decorationSrc = resolveMediaUrl(decoration);
        if (!isColored || !decorationSrc) return null;

        return (
        <Image
          src={decorationSrc}
          alt=""
          width={2222}
          height={1167}
          className="pointer-events-none absolute z-0 left-1/2 -translate-x-1/2 -top-10 w-[140%] h-auto max-w-none md:w-[180%] lg:w-[200%] 2xl:w-[160%]"
          unoptimized
        />
        );
      })()}

      <div className={cn(containerClass, "relative z-10") }>
        {title && (
          <h2 className={cn(
            "font-heading font-bold text-brand-dark text-center leading-none",
            "text-[38px] md:text-[64px]",
            isColored ? "w-full mx-auto" : "",
            headingSpacing
          )}>
            {title}
          </h2>
        )}

        {description && (
          <RichText
            html={description}
            className="font-sans text-lg md:text-[20px] text-gray-600 mx-auto text-center leading-relaxed mb-12 prose-p:my-0 prose-headings:font-heading prose-headings:text-brand-dark prose-headings:mb-3 prose-ul:text-left prose-ol:text-left prose-ul:pl-6 prose-ol:pl-6"
          />
        )}

        <div className={cn(
          "grid grid-cols-1",
          gridClass,
          gridGap
        )}>
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "group flex flex-col text-left",
                isColored && "bg-brand-gray rounded-[20px] min-h-[280px] md:min-h-[340px] 2xl:min-h-[466px]",
                isColored && !isColoredPhoto && "px-[20px] pt-[22px] pb-[36px] md:px-[30px] md:pb-[36px]",
                isColoredPhoto && "overflow-hidden"
              )}
            >
              {isColoredPhoto ? (
                <>
                  {renderFullBleedPhoto(item.photo, item.title)}
                  <div className="flex flex-col flex-1 w-full px-[20px] pt-[22px] pb-[32px] md:px-[26px] md:pt-[26px] md:pb-[34px] 2xl:px-[30px]">
                    {(() => {
                      const iconElement = renderIcon(item.icon, "w-[60px] h-[60px]", item.title);
                      if (!item.photo && iconElement) {
                        return <div className="mb-[18px] shrink-0">{iconElement}</div>;
                      }
                      return null;
                    })()}
                    <h3 className="font-heading font-bold text-brand-dark text-[24px] leading-[29px] mb-[16px]">
                      {item.title}
                    </h3>
                    <RichText
                      html={item.description}
                      className="font-sans text-brand-dark/70 text-[16px] leading-[21px] md:text-[20px] md:leading-[26px] prose-p:my-0 prose-strong:font-semibold prose-ul:my-0 prose-ol:my-0 prose-ul:pl-4 prose-ol:pl-4"
                    />
                  </div>
                </>
              ) : (
                <>
                  {(() => {
                    const photoElement = renderPhoto(item.photo, item.title);
                    if (photoElement) return photoElement;

                    const iconElement = renderIcon(
                      item.icon,
                      isColored
                        ? "w-[70px] h-[70px]"
                        : "w-[46px] h-[46px] md:w-[52px] md:h-[52px] 2xl:w-[60px] 2xl:h-[60px]",
                      item.title
                    );

                    if (!iconElement) return null;

                    return isColored ? (
                      <div className="mb-[20px] md:mb-[41px] shrink-0">
                        {iconElement}
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "shrink-0 mb-4",
                          "text-brand-orange"
                        )}
                      >
                        {iconElement}
                      </div>
                    );
                  })()}

                  <div>
                    <h3 className={cn(
                      "font-heading font-bold text-brand-dark text-[24px] leading-[29px]",
                      isColored ? "mb-[19px]" : "mb-[14px]"
                    )}>
                      {item.title}
                    </h3>
                    <RichText
                      html={item.description}
                      className={cn(
                        "font-sans text-brand-dark/70 text-[16px] leading-[21px] md:text-[20px] md:leading-[26px] prose-p:my-0 prose-strong:font-semibold prose-ul:my-0 prose-ol:my-0 prose-ul:pl-4 prose-ol:pl-4"
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;

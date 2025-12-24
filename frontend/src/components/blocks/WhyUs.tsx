import React from "react";
import Image from "next/image";
import RichText from "../RichText";
import { cn } from "@/lib/utils";
import { resolveSectionPadding, resolveSectionBackground, resolveSectionBackgroundStyle, type SectionPadding } from "@/lib/blocks/padding";

const valueCards = [
  {
    value: "2",
    label: "Year Warranty",
    mobileOrderClass: "order-1",
    desktopOrderClass: "md:order-1",
  },
  {
    value: "No",
    label: "Subscriptions",
    mobileOrderClass: "order-4",
    desktopOrderClass: "md:order-2",
  },
  {
    value: "24/7",
    label: "Tech Support",
    mobileOrderClass: "order-3",
    desktopOrderClass: "md:order-3",
  },
];

const iconCards = [
  {
    src: "/images/why-us/icon-subtract2.svg",
    alt: "Game controller icon",
    label: "Free new game releases",
    imgClassName: "h-[52px] w-[81px] md:h-[58px] md:w-[89px]",
    mobileOrderClass: "order-2",
    desktopOrderClass: "md:order-4",
  },
  {
    src: "/images/why-us/icon-group109.svg",
    alt: "Laptop icon",
    label: "Free software updates",
    imgClassName: "h-[60px] w-[90px] md:h-[67px] md:w-[90px]",
    mobileOrderClass: "order-5",
    desktopOrderClass: "md:order-5",
  },
  {
    src: "/images/why-us/icon-subtract1.svg",
    alt: "Team with gear icon",
    label: "Growing software team",
    imgClassName: "h-[52px] w-[80px] md:h-[59px] md:w-[89px]",
    mobileOrderClass: "order-6",
    desktopOrderClass: "md:order-6",
  },
];
export interface WhyUsProps {
  title?: string;
  description?: string;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

const WhyUs: React.FC<WhyUsProps> = ({ title, description, padding, backgroundClass, backgroundColor }) => {
  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "pt-[176px] pb-[144px]");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-brand-gray");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn(paddingClass, sectionBackground)} style={sectionStyle}> 
      <div className="mx-auto w-full max-w-[360px] md:max-w-[720px] lg:max-w-[1090px] xl:max-w-[1320px] px-5 sm:px-6 lg:px-10">
        {title && (
          <h2 className="mx-auto w-full max-w-[992px] font-heading font-bold text-4xl md:text-[64px] leading-none text-center text-brand-dark mb-12 md:mb-14">
            {title}
          </h2>
        )}
        {description && (
          <RichText
            html={description}
            className="font-sans text-base md:text-[20px] text-brand-dark text-center max-w-3xl md:max-w-[992px] mx-auto mb-10"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px] md:gap-5">
          {valueCards.map((card) => (
            <div
              key={card.label}
              className={cn(
                "rounded-[9px] md:rounded-[10px] bg-white shadow-[0_1.8px_18.6px_rgba(0,0,0,0.10)] md:shadow-[0_2px_20.6px_rgba(0,0,0,0.10)] h-[192px] md:h-[213px] px-8 md:px-9 py-8 md:py-9 flex flex-col items-center justify-center text-center gap-3 md:gap-4",
                card.mobileOrderClass,
                card.desktopOrderClass,
              )}
            >
              <span className="font-heading font-bold text-[52px] md:text-[56px] leading-[1] text-transparent bg-clip-text bg-brand-gradient">
                {card.value}
              </span>
              <span className="font-heading font-bold text-[22px] md:text-[28px] leading-[1.2] text-brand-dark">
                {card.label}
              </span>
            </div>
          ))}

          {iconCards.map((card) => (
            <div
              key={card.label}
              className={cn(
                "rounded-[9px] md:rounded-[10px] bg-white shadow-[0_1.8px_18.6px_rgba(0,0,0,0.10)] md:shadow-[0_2px_20.6px_rgba(0,0,0,0.10)] h-[192px] md:h-[213px] px-8 md:px-9 py-8 md:py-9 flex flex-col items-center justify-center text-center gap-4 md:gap-5",
                card.mobileOrderClass,
                card.desktopOrderClass,
              )}
            >
              <div className="relative">
                <Image
                  src={card.src}
                  alt={card.alt}
                  width={120}
                  height={80}
                  className={cn("select-none object-contain", card.imgClassName)}
                  unoptimized
                />
              </div>
              <span className="font-heading font-bold text-[22px] md:text-[28px] leading-[1.2] text-brand-dark">
                {card.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;

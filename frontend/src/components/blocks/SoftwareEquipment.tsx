import React from "react";
import Image from "next/image";
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from "@/lib/blocks/padding";
import RichText from "../RichText";

export type SoftwareCategory = {
  title: string;
  icon?: string | null;
};

export type SoftwareEquipmentProps = {
  title?: string | null;
  description?: string | null;
  label?: {
    text: string;
    backgroundColor?: string | null;
    textColor?: string | null;
  } | null;
  items?: SoftwareCategory[];
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const SoftwareEquipment: React.FC<SoftwareEquipmentProps> = ({
  title,
  description,
  label,
  items = [],
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
      (padding &&
        typeof padding === "object" &&
        ("top" in padding || "bottom" in padding)),
  );

  const paddingClass = resolveSectionPadding(
    padding,
    hasCustomPadding
      ? ""
      : "pt-[96px] pb-[96px] md:pt-[120px] md:pb-[110px] xl:pt-[150px] xl:pb-[133px]",
  );

  const sectionBackground = resolveSectionBackground(
    backgroundClass,
    "bg-white",
  );
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const resolvedItems = Array.isArray(items) ? items : [];

  const labelBg = label?.backgroundColor || "#1A1A1A";
  const labelTextColor = label?.textColor || "#FFFFFF";

  return (
    <section
      className={cn(paddingClass, sectionBackground)}
      style={sectionStyle}
    >
      <div className="container mx-auto w-full px-5 md:px-8 2xl:px-0">
        {title ? (
          <h2 className="mx-auto max-w-[974px] text-center font-heading font-bold text-brand-dark text-[32px] leading-none md:text-[48px] xl:text-[64px] mb-[20px]">
            {title}
          </h2>
        ) : null}

        {description ? (
          <RichText
            html={description}
            className="mx-auto max-w-[934px] text-center font-sans text-[16px] md:text-[18px] xl:text-[20px] leading-[1.4] text-brand-dark/70 mb-[40px] prose-p:my-0"
          />
        ) : null}

        {label?.text ? (
          <div className="flex justify-center mb-[40px]">
            <span
              className="inline-flex items-center justify-center rounded-[100px] font-heading font-bold text-[14px] md:text-[15px] xl:text-[16px] leading-none h-[48px] md:h-[50px] xl:h-[53px] min-w-[180px] md:min-w-[190px] xl:min-w-[217px] px-[22px] md:px-[26px] xl:px-[28px]"
              style={{ backgroundColor: labelBg, color: labelTextColor }}
            >
              {label.text}
            </span>
          </div>
        ) : null}

        {resolvedItems.length > 0 && (
          <div className="max-w-[974px] w-full mx-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 justify-items-center gap-x-[24px] gap-y-[24px] md:gap-x-[28px] md:gap-y-[28px] xl:gap-x-[32px] xl:gap-y-0">
            {resolvedItems.map((item, index) => {
              const iconSrc = item.icon ? resolveMediaUrl(item.icon) : null;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  {iconSrc ? (
                    <div className="flex items-center justify-center w-[120px] h-[120px]">
                      <Image
                        src={iconSrc}
                        alt={item.title ?? ""}
                        width={120}
                        height={120}
                        className="h-[120px] w-[120px] object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-[120px] h-[120px] rounded-full bg-brand-gray" />
                  )}
                  <p className="mt-[15px] font-heading font-bold text-brand-dark text-[16px] md:text-[18px] xl:text-[20px] leading-none">
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SoftwareEquipment;

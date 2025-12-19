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
import type { SiteSettings } from "@/lib/api";

export type FeatureGridIntroItem = {
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  iconAlt?: string | null;
};

export type FeatureGridIntroProps = {
  title?: string | null;
  description?: string | null;
  items?: FeatureGridIntroItem[] | null;
  gridTitle?: string | null;
  secondaryDescription?: string | null;
  secondaryItems?: FeatureGridIntroItem[] | null;
  footerText?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
  siteSettings?: SiteSettings | null;
};

const FeatureGridIntro: React.FC<FeatureGridIntroProps> = ({
  title,
  description,
  items,
  gridTitle,
  secondaryDescription,
  secondaryItems,
  footerText,
  padding,
  backgroundClass,
  backgroundColor,
  siteSettings,
}) => {
  const stats = Array.isArray(items)
    ? items.filter((item) => item && (item.title?.trim() || item.description?.trim() || item.icon))
    : [];
  const rawContacts = Array.isArray(secondaryItems) ? secondaryItems : [];
  const contactMainPhone = siteSettings?.contact_phone_main?.trim() || null;
  const contactMainLabel = siteSettings?.contact_phone_main_label?.trim() || null;
  const contactWhatsappPhone = siteSettings?.contact_phone_whatsapp?.trim() || null;
  const contactWhatsappLabel = siteSettings?.contact_phone_whatsapp_label?.trim() || null;

  const contacts = [
    {
      key: "main",
      phone: contactMainPhone,
      label: contactMainLabel,
      icon: rawContacts[0]?.icon ?? null,
      iconAlt: rawContacts[0]?.iconAlt ?? null,
    },
    {
      key: "whatsapp",
      phone: contactWhatsappPhone,
      label: contactWhatsappLabel,
      icon: rawContacts[1]?.icon ?? null,
      iconAlt: rawContacts[1]?.iconAlt ?? null,
    },
  ].filter((item) => item.phone || item.label);

  const hasHeader = Boolean(title?.trim()) || Boolean(description?.trim());
  const hasSupport = Boolean(gridTitle?.trim()) || Boolean(secondaryDescription?.trim()) || contacts.length > 0;
  const hasFooterText = Boolean(footerText?.trim());

  if (!hasHeader && stats.length === 0 && !hasSupport && !hasFooterText) {
    return null;
  }

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
      (padding && typeof padding === "object" && ("top" in padding || "bottom" in padding))
  );
  const paddingClass = resolveSectionPadding(
    padding,
    hasCustomPadding
      ? ""
      : "pt-[122px] pb-[158px] lg:pt-[139px] lg:pb-[111px] 2xl:pb-[139px]"
  );

  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-brand-gray");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const getStatIconClass = (index: number) => {
    if (index === 1) {
      return "h-[56px] w-[56px] 2xl:h-[62px] 2xl:w-[62px]";
    }
    if (index === 2) {
      return "h-[56px] w-[58px] 2xl:h-[70px] 2xl:w-[70px]";
    }
    return "h-[70px] w-[70px]";
  };

  const getStatIconOffset = (index: number) => {
    if (index === 1) {
      return "mt-[8px] 2xl:mt-[5px]";
    }
    if (index === 2) {
      return "mt-[9px] 2xl:mt-0";
    }
    return "mt-0";
  };

  const getContactTextWidth = (index: number) =>
    index === 0 ? "w-[240px] 2xl:w-[290px]" : "w-[214px] 2xl:w-[290px]";

  return (
    <section className={cn("relative", paddingClass, sectionBackground)} style={sectionStyle}>
      <div className="container mx-auto w-full max-w-[1320px] px-5 lg:px-[50px] 2xl:px-0">
        {hasHeader ? (
          <div className="flex w-full flex-col items-center text-center">
            {title ? (
              <h2 className="w-full font-heading font-bold leading-none text-[38px] text-transparent bg-clip-text bg-brand-gradient lg:w-[1016px] lg:text-[84px]">
                {title}
              </h2>
            ) : null}

            {description ? (
              <RichText
                html={description}
                className={cn(
                  "mt-[23px] w-full font-heading font-normal text-[16px] leading-[1.4] text-brand-dark/70",
                  "lg:mt-[28px] lg:w-[1089px] lg:text-[22px]",
                  "2xl:w-[1200px]",
                  "prose-p:my-0 prose-p:font-heading prose-p:text-[16px] prose-p:leading-[1.4] lg:prose-p:text-[22px]"
                )}
              />
            ) : null}
          </div>
        ) : null}

        {stats.length ? (
          <div className="mt-[44px] grid grid-cols-1 gap-[10px] lg:mt-[48px] lg:grid-cols-3 lg:gap-[16px] 2xl:gap-[20px]">
            {stats.map((item, index) => {
              const iconSrc = resolveMediaUrl(item.icon);

              return (
                <div
                  key={`${item.title ?? "stat"}-${index}`}
                  className={cn(
                    "mx-auto flex h-[215px] w-[318px] flex-col items-start rounded-[10px] bg-white",
                    "shadow-[0px_2px_20.6px_rgba(0,0,0,0.1)]",
                    "px-[25px] pt-[28px] 2xl:px-[30px]",
                    "lg:w-full"
                  )}
                >
                  {iconSrc ? (
                    <div className={cn("relative", getStatIconClass(index), getStatIconOffset(index))}>
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
                    <h3 className="mt-[10px] font-heading text-[18px] font-extrabold leading-[1.4] text-brand-dark">
                      {item.title}
                    </h3>
                  ) : null}

                  {item.description ? (
                    <p className="mt-[10px] font-heading text-[16px] font-normal leading-[1.4] text-brand-dark/70">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {hasSupport ? (
          <div className="mt-[82px] flex w-full flex-col lg:mt-[150px] lg:flex-row lg:items-start lg:justify-between">
            <div className="w-full lg:w-[499px] 2xl:w-[568px]">
              {gridTitle ? (
                <h3 className="font-heading text-[38px] font-bold leading-none text-brand-dark lg:text-[64px]">
                  {gridTitle}
                </h3>
              ) : null}

              {secondaryDescription ? (
                <RichText
                  html={secondaryDescription}
                  className={cn(
                    "mt-[15px] font-heading text-[16px] font-normal leading-[1.4] text-brand-dark/70",
                    "lg:mt-[31px] lg:text-[20px]",
                    "prose-p:my-0 prose-p:font-heading prose-p:text-[16px] prose-p:leading-[1.4] lg:prose-p:text-[20px]"
                  )}
                />
              ) : null}
            </div>

            {contacts.length ? (
              <div className="mt-[40px] flex flex-col gap-[10px] lg:mt-0 lg:flex-row lg:gap-[16px] 2xl:gap-[20px]">
                {contacts.map((item, index) => {
                  const iconSrc = resolveMediaUrl(item.icon);
                  const hasContactText = Boolean(item.phone || item.label);

                  return (
                    <div
                      key={`${item.key ?? "contact"}-${index}`}
                      className={cn(
                        "w-full rounded-[10px] bg-white shadow-[0px_2px_20.6px_rgba(0,0,0,0.1)]",
                        "pl-[22px] pr-[22px] pt-[26px] 2xl:pl-[27px] 2xl:pr-[27px]",
                        "lg:h-[236px] lg:w-[265px]",
                        "2xl:w-[320px]",
                        index === 0 ? "h-[135px]" : "h-[162px]"
                      )}
                    >
                      {iconSrc ? (
                        <div className="relative ml-[1px] h-[24px] w-[24px] 2xl:ml-[-4px]">
                          <Image
                            src={iconSrc}
                            alt={item.iconAlt ?? ""}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      ) : null}

                      {hasContactText ? (
                        <div
                          className={cn(
                            "mt-[14px] font-heading text-[16px] font-normal leading-[1.4] text-brand-dark",
                            "lg:text-[20px]",
                            getContactTextWidth(index)
                          )}
                        >
                          {item.phone ? (
                            <span className="block text-brand-sky">{item.phone}</span>
                          ) : null}
                          {item.label ? <span className="block">{item.label}</span> : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}

        {hasFooterText ? (
          <RichText
            html={footerText}
            className={cn(
              "mt-[40px] w-full font-heading text-[16px] font-normal leading-[1.4] text-brand-dark/70",
              "lg:mt-[39px] lg:w-[1088px] lg:text-[20px]",
              "2xl:w-[1315px]",
              "prose-p:my-0 prose-p:font-heading prose-p:text-[16px] prose-p:leading-[1.4] lg:prose-p:text-[20px]"
            )}
          />
        ) : null}
      </div>
    </section>
  );
};

export default FeatureGridIntro;

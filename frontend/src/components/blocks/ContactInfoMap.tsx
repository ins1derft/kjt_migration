import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/api";
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from "@/lib/blocks/padding";

const ICON_MAIL = "/images/contact-info/mail.svg";
const ICON_PHONE = "/images/contact-info/phone.svg";
const ICON_MAP = "/images/contact-info/map.svg";
const ICON_SUPPORT = "/images/contact-info/support.svg";

type ContactRowProps = {
  icon: string;
  iconClassName?: string;
  textClassName?: string;
  className?: string;
  children: React.ReactNode;
};

const ContactRow: React.FC<ContactRowProps> = ({
  icon,
  iconClassName,
  textClassName,
  className,
  children,
}) => (
  <div className={cn("grid grid-cols-[24px_minmax(0,1fr)] items-start gap-x-[22px]", className)}>
    <Image
      src={icon}
      alt=""
      width={24}
      height={24}
      className={cn("h-[24px] w-[24px]", iconClassName)}
    />
    <div
      className={cn(
        "font-heading text-[16px] leading-[1.4] text-brand-dark lg:text-[20px]",
        textClassName
      )}
    >
      {children}
    </div>
  </div>
);

export type ContactInfoMapProps = {
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
  mapEmbedUrl?: string | null;
  siteSettings?: SiteSettings | null;
};

const ContactInfoMap: React.FC<ContactInfoMapProps> = ({
  padding,
  backgroundClass,
  backgroundColor,
  mapEmbedUrl,
  siteSettings,
}) => {
  const contactEmail = siteSettings?.contact_email?.trim() || null;
  const contactHours = siteSettings?.contact_hours?.trim() || null;

  const contactPhoneMain = siteSettings?.contact_phone_main?.trim() || null;
  const contactPhoneMainLabel = siteSettings?.contact_phone_main_label?.trim() || null;
  const contactPhoneWhatsapp = siteSettings?.contact_phone_whatsapp?.trim() || null;
  const contactPhoneWhatsappLabel = siteSettings?.contact_phone_whatsapp_label?.trim() || null;

  const contactAddressLine1 = siteSettings?.contact_address_line1?.trim() || null;
  const contactAddressLine2 = siteSettings?.contact_address_line2?.trim() || null;
  const addressLines = [contactAddressLine1, contactAddressLine2].filter(Boolean);

  const supportPhone = siteSettings?.support_phone?.trim() || null;
  const supportPhoneLabel = siteSettings?.support_phone_label?.trim() || null;
  const supportEmail = siteSettings?.support_email?.trim() || null;

  const normalizePhoneHref = (raw?: string | null) => {
    if (!raw) return null;
    const cleaned = raw.replace(/[^\d+]/g, "");
    if (!cleaned) return null;
    return `tel:${cleaned}`;
  };

  const contactPhoneMainHref = normalizePhoneHref(contactPhoneMain);
  const contactPhoneWhatsappHref = normalizePhoneHref(contactPhoneWhatsapp);
  const supportPhoneHref = normalizePhoneHref(supportPhone);

  const hasEmail = Boolean(contactEmail);
  const hasPhones = Boolean(contactHours || contactPhoneMain || contactPhoneWhatsapp);
  const hasAddress = addressLines.length > 0;
  const hasSupport = Boolean(supportPhone || supportEmail);

  const mapSrc = mapEmbedUrl?.trim()
    ? mapEmbedUrl.trim()
    : null;

  if (!hasEmail && !hasPhones && !hasAddress && !hasSupport && !mapSrc) {
    return null;
  }

  const paddingClass = resolveSectionPadding(
    padding,
    "pt-[119px] pb-[67px]"
  );
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-white");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn(paddingClass, sectionBackground)} style={sectionStyle}>
      <div className="container mx-auto w-full px-5 md:px-6 lg:max-w-[1189px] 2xl:max-w-[1320px] 2xl:px-0">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex w-full flex-col lg:max-w-[442px]">
              {hasEmail ? (
                <ContactRow
                  icon={ICON_MAIL}
                  iconClassName="mt-[1px] lg:mt-[5px]"
                  textClassName="max-w-[290px]"
                >
                  <span className="block text-brand-sky">Email</span>
                  {contactEmail ? (
                    <a href={`mailto:${contactEmail}`} className="block text-brand-dark">
                      {contactEmail}
                    </a>
                  ) : null}
                </ContactRow>
              ) : null}

              {hasPhones ? (
                <ContactRow
                  icon={ICON_PHONE}
                  iconClassName="mt-[2px]"
                  textClassName="max-w-[290px]"
                  className={hasEmail ? "mt-[29px] lg:mt-[35px]" : undefined}
                >
                  {contactHours ? <span className="block">{contactHours}</span> : null}
                  {contactPhoneMain && contactPhoneMainHref ? (
                    <a href={contactPhoneMainHref} className="block text-brand-sky">
                      {contactPhoneMain}
                    </a>
                  ) : null}
                  {contactPhoneMainLabel ? <span className="block">{contactPhoneMainLabel}</span> : null}
                  {contactPhoneWhatsapp && contactPhoneWhatsappHref ? (
                    <a href={contactPhoneWhatsappHref} className="block text-brand-sky">
                      {contactPhoneWhatsapp}
                    </a>
                  ) : null}
                  {contactPhoneWhatsappLabel ? (
                    <span className="block">{contactPhoneWhatsappLabel}</span>
                  ) : null}
                </ContactRow>
              ) : null}

              {hasAddress ? (
                <ContactRow
                  icon={ICON_MAP}
                  iconClassName="mt-[2px]"
                  textClassName="max-w-[290px]"
                  className={(hasEmail || hasPhones) ? "mt-[43px] lg:mt-[63px]" : undefined}
                >
                  <span className="block">Office and Showroom</span>
                  {addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </ContactRow>
              ) : null}

              {hasSupport ? (
                <ContactRow
                  icon={ICON_SUPPORT}
                  iconClassName="mt-[2px]"
                  textClassName="max-w-[274px] lg:max-w-[442px]"
                  className={(hasEmail || hasPhones || hasAddress) ? "mt-[24px] lg:mt-[35px]" : undefined}
                >
                  <span className="block">Technical Support</span>
                  {supportPhone && supportPhoneHref ? (
                    <span className="block">
                      <a href={supportPhoneHref} className="text-brand-sky">
                        {supportPhone}
                      </a>
                      {supportPhoneLabel ? (
                        <>
                          <span className="hidden lg:inline"> {supportPhoneLabel}</span>
                          <span className="block lg:hidden">{supportPhoneLabel}</span>
                        </>
                      ) : null}
                    </span>
                  ) : null}
                  {supportEmail ? (
                    <a href={`mailto:${supportEmail}`} className="block text-brand-sky">
                      {supportEmail}
                    </a>
                  ) : null}
                </ContactRow>
              ) : null}
          </div>

          {mapSrc ? (
            <div className="mt-[35px] w-full overflow-hidden rounded-[15px] bg-[#f4f5fa] lg:mt-0 lg:h-[526px] lg:w-[615px] lg:shrink-0 2xl:w-[849px]">
              <iframe
                src={mapSrc}
                className="h-[274px] w-full border-0 lg:h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ContactInfoMap;

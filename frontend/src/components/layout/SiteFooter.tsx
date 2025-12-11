'use client';

import Link from "next/link";
import { Icon as IconifyIcon } from "@iconify/react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/api";
import type { Menu, MenuItem } from "@/lib/menus";
import { cn } from "@/lib/utils";

type MenuLink = {
  label: string;
  href?: string | null;
  targetBlank?: boolean;
  icon?: string | null;
  color?: string | null;
};

function mapMenuItemToLink(item: MenuItem): MenuLink {
  return {
    label: item.label,
    href: item.url ?? null,
    icon: item.icon,
    targetBlank: item.opens_in_new_tab,
    color: null,
  };
}

function footerColumns(menu?: Menu | null): { label: string; links: MenuLink[] }[] {
  if (!menu || !menu.items) return [];

  return (menu.items ?? [])
    // everything except explicit socials forms columns
    .filter((item) => (item.slot ?? "primary") !== "social")
    .map((item) => {
      const children = item.children ?? [];
      if (children.length > 0) {
        return {
          label: item.label,
          links: children.map(mapMenuItemToLink),
        };
      }

      return {
        label: item.label,
        links: [mapMenuItemToLink(item)],
      };
    });
}

const renderSocialIcon = (icon?: string | null, className = "w-[19px] h-[19px]", color?: string | null) => {
  const raw = (icon ?? "").trim();

  if (!raw) {
    return <IconifyIcon icon="mdi:earth" className={className} color={color ?? undefined} />;
  }

  return <IconifyIcon icon={raw} className={className} color={color ?? undefined} />;
};

const isInternal = (href?: string | null) => typeof href === "string" && href.startsWith("/");

function SmartLink({ link, className }: { link: MenuLink; className?: string }) {
  const href = link.href?.trim();

  if (!href) {
    return <span className={cn(className, "cursor-default select-none")}>{link.label}</span>;
  }

  const props = link.targetBlank
    ? {
        target: "_blank" as const,
        rel: "noreferrer",
      }
    : {};

  if (isInternal(href)) {
    return (
      <Link href={href} className={className} {...props}>
        {link.label}
      </Link>
    );
  }

  return (
    <a href={href} className={className} {...props}>
      {link.label}
    </a>
  );
}

export default function SiteFooter({ menu, settings }: { menu?: Menu | null; settings?: SiteSettings | null }) {
  const settingsSocial = (settings?.social_links ?? []).map<MenuLink>((link) => ({
    label: link.label,
    href: link.href ?? null,
    icon: link.icon ?? null,
    targetBlank: link.targetBlank ?? true,
    color: link.footerColor ?? link.color ?? null,
  }));

  const socials = settingsSocial;
  const columns = footerColumns(menu);
  const containerClass = "mx-auto w-full max-w-[1189px] 2xl:max-w-[1320px] px-5 md:px-6 2xl:px-0";

  const normalizePhoneHref = (raw?: string | null) => {
    if (!raw) return null;
    const cleaned = raw.replace(/[^\d+]/g, "");
    if (!cleaned) return null;
    return `tel:${cleaned}`;
  };

  const contactAddressLine1 = settings?.contact_address_line1?.trim() || null;
  const contactAddressLine2 = settings?.contact_address_line2?.trim() || null;
  const hasAddress = !!(contactAddressLine1 || contactAddressLine2);

  const contactPhoneMain = settings?.contact_phone_main?.trim() || null;
  const contactPhoneMainHref = normalizePhoneHref(settings?.contact_phone_main);
  const contactPhoneMainLabel = settings?.contact_phone_main_label?.trim() || null;

  const contactPhoneWhatsapp = settings?.contact_phone_whatsapp?.trim() || null;
  const contactPhoneWhatsappHref = normalizePhoneHref(settings?.contact_phone_whatsapp);
  const contactPhoneWhatsappLabel = settings?.contact_phone_whatsapp_label?.trim() || null;

  const contactEmail = settings?.contact_email?.trim() || null;
  const contactHours = settings?.contact_hours?.trim() || null;

  const supportPhone = settings?.support_phone?.trim() || null;
  const supportPhoneHref = normalizePhoneHref(settings?.support_phone);
  const supportPhoneLabel = settings?.support_phone_label?.trim() || null;
  const supportEmail = settings?.support_email?.trim() || null;
  const hasSupportBlock = !!(supportPhoneHref || supportEmail);

  return (
    <footer className="bg-footer-bg text-white font-sans">
      <div
        className={cn(
          containerClass,
          "pt-[64px] pb-[112px]",
          "lg:pt-[74px] lg:pb-[120px]",
          "2xl:pt-[176px] 2xl:pb-[140px]",
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 lg:gap-x-10 xl:gap-x-12 gap-y-16">
          <div className="col-span-1">
            <h3 className="font-heading font-bold text-[24px] leading-[1.4] text-white mb-6">About Us</h3>
            <p className="text-[16px] lg:text-[20px] text-white/70 leading-[1.4]">
              Kids Jump Tech is the manufacturer of the latest interactive equipment, providing state-of-the-art experiences via multimedia technology. Based out
              of the USA, Kids Jump Tech has completed more than 3,000 projects all around the world. When kids are happy, they jump! Our product range includes
              developments for all ages that are constantly being improved and updated. If you would like to learn more about our products, you can request a
              video tour by selecting Live Demo.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="font-heading font-bold text-[24px] leading-[1.4] text-white mb-6">Contact Us</h3>
            <div className="flex flex-col text-[16px] lg:text-[20px] text-white/70 leading-[1.4] space-y-[18px]">
              {hasAddress && (
                <div className="flex gap-3 items-start">
                  <MapPin size={24} className="shrink-0 text-white mt-[2px]" strokeWidth={2} />
                  <span>
                    {contactAddressLine1 && <span className="block">{contactAddressLine1}</span>}
                    {contactAddressLine2 && <span className="block">{contactAddressLine2}</span>}
                  </span>
                </div>
              )}

              {contactPhoneMain && contactPhoneMainHref && (
                <div className="flex gap-3 items-start">
                  <Phone size={24} className="shrink-0 text-white mt-[2px]" strokeWidth={2} />
                  <div className="flex flex-col">
                    <a href={contactPhoneMainHref} className="hover:text-brand-sky transition-colors text-white">
                      {contactPhoneMain}
                    </a>
                    {contactPhoneMainLabel && (
                      <span className="text-[14px] lg:text-[16px] opacity-70 block">{contactPhoneMainLabel}</span>
                    )}
                  </div>
                </div>
              )}

              {contactPhoneWhatsapp && contactPhoneWhatsappHref && (
                <div className="flex gap-3 items-start">
                  <Phone size={24} className="shrink-0 text-white mt-[2px]" strokeWidth={2} />
                  <div className="flex flex-col">
                    <a href={contactPhoneWhatsappHref} className="hover:text-brand-sky transition-colors text-white">
                      {contactPhoneWhatsapp}
                    </a>
                    {contactPhoneWhatsappLabel && (
                      <span className="text-[14px] lg:text-[16px] opacity-70 block">
                        {contactPhoneWhatsappLabel}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {contactEmail && (
                <div className="flex gap-3 items-start">
                  <Mail size={24} className="shrink-0 text-white mt-[2px]" strokeWidth={2} />
                  <a href={`mailto:${contactEmail}`} className="hover:text-brand-sky transition-colors text-white">
                    {contactEmail}
                  </a>
                </div>
              )}

              {contactHours && (
                <div className="flex gap-3 items-start">
                  <Clock size={24} className="shrink-0 text-white mt-[2px]" strokeWidth={2} />
                  <span>{contactHours}</span>
                </div>
              )}

              {hasSupportBlock && <span className="mt-1 text-white/70">Technical Support</span>}

              {supportPhone && supportPhoneHref && (
                <div className="flex gap-3 items-start">
                  <Phone size={24} className="shrink-0 text-white mt-[2px]" strokeWidth={2} />
                  <div className="flex flex-col">
                    <a href={supportPhoneHref} className="hover:text-brand-sky transition-colors text-white">
                      {supportPhone}
                    </a>
                    {supportPhoneLabel && (
                      <span className="text-[14px] lg:text-[16px] opacity-70 block">{supportPhoneLabel}</span>
                    )}
                  </div>
                </div>
              )}

              {supportEmail && (
                <div className="flex gap-3 items-start">
                  <Mail size={24} className="shrink-0 text-white mt-[2px]" strokeWidth={2} />
                  <a href={`mailto:${supportEmail}`} className="hover:text-brand-sky transition-colors text-white">
                    {supportEmail}
                  </a>
                </div>
              )}
            </div>
          </div>

          {columns.map((col, index) => (
            <div
              key={col.label}
              className={cn(
                "col-span-1",
                index === columns.length - 1 ? "lg:row-start-2 lg:col-start-1 xl:row-auto xl:col-auto" : "",
              )}
            >
              <h3 className="font-heading font-bold text-[24px] leading-[1.4] text-white mb-6">{col.label}</h3>
              <ul className="text-[16px] lg:text-[20px] text-white/70 leading-[1.8] space-y-[4px]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <SmartLink link={link} className="hover:text-brand-sky transition-colors" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-footer-bar border-t border-footer-bar">
        <div className={cn(containerClass, "flex flex-col items-center gap-6 lg:gap-7 pt-[38px] pb-[36px] lg:pt-[42px] lg:pb-[44px]")}>
          {socials.length > 0 && (
            <div className="flex justify-center items-center gap-5 text-[19px]">
              {socials.map((link) => {
                const href = link.href?.trim();
                if (!href) {
                  return (
                    <span key={link.label} className="text-white/70 cursor-default select-none" aria-label={link.label}>
                      {renderSocialIcon(link.icon, "w-[19px] h-[19px]", link.color)}
                    </span>
                  );
                }

                return (
                  <a
                    key={link.label}
                    href={href}
                    aria-label={link.label}
                    className="text-white hover:opacity-80 transition-opacity"
                    {...(link.targetBlank ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    {renderSocialIcon(link.icon, "w-[19px] h-[19px]", link.color)}
                  </a>
                );
              })}
            </div>
          )}

          <div className="text-[14px] lg:text-[16px] text-white text-center leading-[1.8]">
            Copyright © 2025 KIDSjumpTECH All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
}

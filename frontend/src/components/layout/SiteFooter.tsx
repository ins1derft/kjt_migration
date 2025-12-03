'use client';

import Link from "next/link";
import { Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import type { Menu, MenuItem } from "@/lib/menus";
import { cn } from "@/lib/utils";

type MenuLink = {
  label: string;
  href: string;
  targetBlank?: boolean;
  icon?: string | null;
};

function mapMenuItemToLink(item: MenuItem): MenuLink {
  return {
    label: item.label,
    href: item.url,
    icon: item.icon,
    targetBlank: item.opens_in_new_tab,
  };
}

function socialLinks(menu?: Menu | null): MenuLink[] {
  if (!menu || !menu.items) return [];
  const socials = (menu.items ?? []).filter((item) => (item.slot ?? "primary") === "social");
  return socials.length ? socials.map(mapMenuItemToLink) : [];
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

const renderSocialIcon = (icon?: string | null, className = "w-[19px] h-[19px]") => {
  const code = (icon ?? "").toLowerCase().trim();
  if (code === "ig" || code.startsWith("insta")) return <Instagram className={className} strokeWidth={2.2} />;
  if (code === "in" || code.startsWith("link")) return <Linkedin className={className} fill="currentColor" strokeWidth={0} />;
  if (code === "yt" || code.startsWith("you")) return <Youtube className={className} fill="currentColor" strokeWidth={0} />;
  return <Facebook className={className} strokeWidth={2.2} />;
};

const isInternal = (href: string) => href.startsWith("/");

function SmartLink({ link, className }: { link: MenuLink; className?: string }) {
  const href = link.href || "/";
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

export default function SiteFooter({ menu }: { menu?: Menu | null }) {
  const socials = socialLinks(menu);
  const columns = footerColumns(menu);
  const containerClass = "mx-auto w-full max-w-[1189px] 2xl:max-w-[1320px] px-5 md:px-6 2xl:px-0";

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
              <div className="flex gap-3 items-start">
                <MapPin size={24} className="shrink-0 text-white mt-[2px]" strokeWidth={2} />
                <span>
                  <span className="block">150 NW 176th st., unit E,</span>
                  <span className="block">Miami, FL, 33169</span>
                </span>
              </div>

              <div className="flex gap-3 items-start">
                <Phone size={24} className="shrink-0 text-white mt-[2px]" strokeWidth={2} />
                <div className="flex flex-col">
                  <a href="tel:8779010110" className="hover:text-brand-sky transition-colors text-white">
                    (877) 901-0110
                  </a>
                  <span className="text-[14px] lg:text-[16px] opacity-70 block">(Toll free number)</span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Phone size={24} className="shrink-0 text-white mt-[2px]" strokeWidth={2} />
                <div className="flex flex-col">
                  <a href="tel:15613828555" className="hover:text-brand-sky transition-colors text-white">
                    +1 (561) 382-8555
                  </a>
                  <span className="text-[14px] lg:text-[16px] opacity-70 block">(WhatsApp number for outside of US inquiries)</span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Mail size={24} className="shrink-0 text-white mt-[2px]" strokeWidth={2} />
                <a href="mailto:info@kidsjumptech.com" className="hover:text-brand-sky transition-colors text-white">
                  info@kidsjumptech.com
                </a>
              </div>

              <div className="flex gap-3 items-start">
                <Clock size={24} className="shrink-0 text-white mt-[2px]" strokeWidth={2} />
                <span>Mon – Sat: 8 AM – 7 PM</span>
              </div>

              <span className="mt-1 text-white/70">Technical Support</span>

              <div className="flex gap-3 items-start">
                <Phone size={24} className="shrink-0 text-white mt-[2px]" strokeWidth={2} />
                <div className="flex flex-col">
                  <a href="tel:17869685878" className="hover:text-brand-sky transition-colors text-white">
                    +1 (786) 968-5878
                  </a>
                  <span className="text-[14px] lg:text-[16px] opacity-70 block">(WhatsApp)</span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Mail size={24} className="shrink-0 text-white mt-[2px]" strokeWidth={2} />
                <a href="mailto:support@kidsjumptech.com" className="hover:text-brand-sky transition-colors text-white">
                  support@kidsjumptech.com
                </a>
              </div>
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
              <ul className="text-[16px] lg:text-[20px] text-white/70 leading-[1.8] space-y-[12px]">
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
              {socials.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="text-white hover:opacity-80 transition-opacity"
                  {...(link.targetBlank ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {renderSocialIcon(link.icon)}
                </a>
              ))}
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

'use client';

import Link from "next/link";
import { Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import type { Menu, MenuItem } from "@/lib/menus";

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

const renderSocialIcon = (icon?: string | null, className = "w-5 h-5") => {
  const code = (icon ?? "").toLowerCase().trim();
  if (code === "ig" || code.startsWith("insta")) return <Instagram className={className} strokeWidth={2.3} />;
  if (code === "in" || code.startsWith("link")) return <Linkedin className={className} fill="currentColor" strokeWidth={0} />;
  if (code === "yt" || code.startsWith("you")) return <Youtube className={className} strokeWidth={2.3} />;
  return <Facebook className={className} strokeWidth={2.3} />;
};

const socialBgClass = (icon?: string | null) => {
  const code = (icon ?? "").toLowerCase().trim();
  if (code === "ig" || code.startsWith("insta")) return "bg-social-instagram";
  if (code === "in" || code.startsWith("link")) return "bg-social-linkedin";
  if (code === "yt" || code.startsWith("you")) return "bg-social-youtube";
  return "bg-social-facebook";
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

  return (
    <footer className="bg-footer-bg text-white font-sans">
      <div className="mx-auto w-full max-w-6xl px-4 pt-20 pb-12">
        <div className="grid grid-cols-1 gap-12 lg:gap-20 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1">
            <h3 className="font-heading font-bold text-[24px] leading-[1.3] text-white mb-8">About Us</h3>
            <p className="text-[16px] text-white/70 leading-[1.6]">
              Kids Jump Tech is the manufacturer of the latest interactive equipment, providing state-of-the-art experiences via multimedia technology. Based out
              of the USA, Kids Jump Tech has completed more than 3,000 projects all around the world. When kids are happy, they jump!
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="font-heading font-bold text-[24px] leading-[1.3] text-white mb-8">Contact Us</h3>
            <div className="flex flex-col gap-6 text-[16px] text-white/70">
              <div className="flex gap-4 items-start">
                <MapPin size={20} className="shrink-0 text-brand-sky mt-1" strokeWidth={1.5} />
                <span>150 NW 176th st., unit E,<br />Miami, FL, 33169</span>
              </div>
              <div className="flex gap-4 items-start">
                <Phone size={20} className="shrink-0 text-brand-sky mt-1" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <a href="tel:8779010110" className="hover:text-brand-sky transition-colors text-white font-semibold">
                    (877) 901-0110
                  </a>
                  <span className="text-[14px] opacity-70">(Toll free number)</span>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Phone size={20} className="shrink-0 text-brand-sky mt-1" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <a href="tel:15613828555" className="hover:text-brand-sky transition-colors text-white font-semibold">
                    +1 (561) 382-8555
                  </a>
                  <span className="text-[14px] opacity-70">(WhatsApp number for outside of US inquiries)</span>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Mail size={20} className="shrink-0 text-brand-sky mt-1" strokeWidth={1.5} />
                <a href="mailto:info@kidsjumptech.com" className="hover:text-brand-sky transition-colors">
                  info@kidsjumptech.com
                </a>
              </div>
              <div className="flex gap-4 items-start">
                <Clock size={20} className="shrink-0 text-brand-sky mt-1" strokeWidth={1.5} />
                <span>Mon – Sat: 8 AM – 7 PM</span>
              </div>

              <div className="mt-2 pt-6 border-t border-white/10">
                <h4 className="font-heading font-bold text-[18px] text-white mb-4">Technical Support</h4>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-start">
                    <Phone size={20} className="shrink-0 text-brand-sky mt-1" strokeWidth={1.5} />
                    <div className="flex flex-col">
                      <a href="tel:17869685878" className="hover:text-brand-sky transition-colors text-white font-semibold">
                        +1 (786) 968-5878
                      </a>
                      <span className="text-[14px] opacity-70">(WhatsApp)</span>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <Mail size={20} className="shrink-0 text-brand-sky mt-1" strokeWidth={1.5} />
                    <a href="mailto:support@kidsjumptech.com" className="hover:text-brand-sky transition-colors text-white">
                      support@kidsjumptech.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.label} className="col-span-1">
              <h3 className="font-heading font-bold text-[24px] leading-[1.3] text-white mb-8">{col.label}</h3>
              <ul className="text-[16px] text-white/70 space-y-4 mb-10">
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

      <div className="bg-footer-bar py-10 border-t border-footer-bar">
        <div className="mx-auto w-full max-w-6xl px-4 text-center">
          {socials.length > 0 && (
            <div className="flex justify-center gap-4 mb-8">
              {socials.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg ${socialBgClass(link.icon)}`}
                  {...(link.targetBlank ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {renderSocialIcon(link.icon, "w-5 h-5")}
                </a>
              ))}
            </div>
          )}

          <div className="text-[14px] text-white">
            Copyright © 2025 KIDSjumpTECH. All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
}

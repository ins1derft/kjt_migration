'use client';

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Facebook, Instagram, Linkedin, Menu as MenuIcon, MessageCircle, Phone, X, Youtube } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import type { Menu, MenuItem } from "@/lib/menus";

type MenuLink = {
  label: string;
  href: string;
  icon?: string | null;
  targetBlank?: boolean;
  children?: MenuLink[];
};

function mapMenuItemToLink(item: MenuItem): MenuLink {
  return {
    label: item.label,
    href: item.url,
    icon: item.icon,
    targetBlank: item.opens_in_new_tab,
    children: (item.children ?? []).map(mapMenuItemToLink),
  };
}

function linksBySlot(menu: Menu | null | undefined, slot: string): MenuLink[] {
  if (!menu || !menu.items) return [];
  return (menu.items ?? [])
    .filter((item) => (item.slot ?? "primary") === slot)
    .map(mapMenuItemToLink);
}

function navLinks(menu: Menu | null | undefined): MenuLink[] {
  return linksBySlot(menu, "primary");
}

function linkTarget(link: MenuLink) {
  return link.targetBlank
    ? {
        target: "_blank" as const,
        rel: "noreferrer",
      }
    : {};
}

const renderSocialIcon = (code?: string | null, className = "w-5 h-5") => {
  const icon = (code ?? "").toLowerCase().trim();
  if (icon === "ig" || icon.startsWith("insta")) return <Instagram className={className} strokeWidth={2.3} />;
  if (icon === "in" || icon.startsWith("link")) return <Linkedin className={className} fill="currentColor" strokeWidth={0} />;
  if (icon === "yt" || icon.startsWith("you")) return <Youtube className={className} fill="currentColor" strokeWidth={0} />;
  return <Facebook className={className} strokeWidth={2.3} />;
};
const getIcon = (name: string, className: string) => {
  const iconKey = name as keyof typeof Icons;
  const IconComponent = (Icons[iconKey] || Icons.Star) as React.ElementType;
  return <IconComponent className={className} strokeWidth={1.5} />;
};

const chunkLinks = (links: MenuLink[], size = 7): MenuLink[][] => {
  const chunks: MenuLink[][] = [];
  for (let i = 0; i < links.length; i += size) {
    chunks.push(links.slice(i, i + size));
  }
  return chunks;
};

export default function SiteHeader({ menu }: { menu?: Menu | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const containerClass = "mx-auto w-full max-w-[1189px] 2xl:max-w-[1320px] px-5 md:px-6 2xl:px-0";
  const [openMobileSections, setOpenMobileSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayTopPrimary = linksBySlot(menu, "top_primary");
  const displayTopSupport = linksBySlot(menu, "top_secondary");
  const displaySocial = linksBySlot(menu, "social");
  const primaryNavLinks = navLinks(menu);
  const leftCount = Math.floor(primaryNavLinks.length / 2);
  const leftNavLinks = primaryNavLinks.slice(0, leftCount);
  const rightNavLinks = primaryNavLinks.slice(leftCount);

  const topPrimary = displayTopPrimary;
  const topSupport = displayTopSupport;
  const social = displaySocial;
  const mobileSocialLeft = social.slice(0, Math.ceil(social.length / 2));
  const mobileSocialRight = social.slice(Math.ceil(social.length / 2));

  const megaRoot = primaryNavLinks.find(
    (link) => link.label.toLowerCase().includes("products") && (link.children?.length ?? 0) > 0,
  );

  const toLinks = (node?: MenuLink) => {
    if (!node) return [];
    if (node.children && node.children.length > 0) return node.children;
    return [node];
  };

  const handleMouseEnter = (menuKey: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menuKey);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => setActiveMenu(null), 200);
  };

  const renderMegaMenu = () => (
    <div
      className={cn(
        "absolute top-[60px] left-0 w-full bg-white border-t border-gray-100 shadow-xl z-10 transition-all duration-300 origin-top overflow-hidden",
        activeMenu === "products" ? "opacity-100 visible translate-y-0 max-h-[600px]" : "opacity-0 invisible -translate-y-2 max-h-0",
      )}
      onMouseEnter={() => handleMouseEnter("products")}
      onMouseLeave={handleMouseLeave}
    >
      {megaRoot && (
        <div className={cn("w-full", containerClass, "py-10")}>
          <div className="flex flex-col lg:flex-row gap-12">
            {megaRoot.children?.map((column, idx) => {
              const links = toLinks(column);
              const chunks = chunkLinks(links, 7);
              const cols = Math.max(1, chunks.length);
              return (
                <div
                  key={`${column.label}-${idx}`}
                  className={cn(
                    "flex-1 flex flex-col gap-4",
                    idx === 0 ? "lg:basis-1/2 border-r border-gray-100 pr-8" : "",
                    idx === 1 ? "lg:basis-1/4 border-r border-gray-100 pr-8 px-4" : "",
                    idx === 2 ? "lg:basis-1/4 pl-4" : "",
                  )}
                >
                  <h3 className="font-heading font-bold text-lg text-brand-dark mb-2">{column.label}</h3>
                  <div
                    className="grid gap-x-8 gap-y-3"
                    style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
                  >
                    {chunks.map((group, gIdx) => (
                      <div key={`${column.label}-chunk-${gIdx}`} className="flex flex-col gap-3">
                        {group.map((item, linkIdx) => (
                          <Link key={`${item.label}-${linkIdx}`} href={item.href || "#"} className="flex items-center gap-3 group">
                            <div className="text-brand-gold group-hover:scale-110 transition-transform">
                              {getIcon(item.icon || "Star", "w-5 h-5")}
                            </div>
                            <span className="text-sm font-semibold text-gray-600 group-hover:text-brand-sky transition-colors">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderNavLink = (link: MenuLink) => {
    const hasChildren = (link.children?.length ?? 0) > 0;

    const isMegaTrigger = link.label.toLowerCase() === "products & experiences";

    const linkProps = isMegaTrigger
      ? {
          onMouseEnter: () => handleMouseEnter("products"),
          onMouseLeave: handleMouseLeave,
        }
      : {};

    if (!hasChildren) {
      return (
        <Link
          key={link.label}
          href={link.href || "/"}
          className="rounded-none px-0 py-[2px] leading-none hover:text-brand-sky transition-colors"
          {...linkProps}
          {...linkTarget(link)}
        >
          {link.label}
        </Link>
      );
    }

    return (
      <div key={link.label} className="relative group h-full flex items-center">
        <Link
          href={link.href || "/"}
          className="flex items-center gap-1 rounded-none px-0 py-[2px] leading-none hover:text-brand-sky transition-colors"
          {...linkProps}
          {...linkTarget(link)}
        >
          {link.label}
          <ChevronDown size={13} strokeWidth={3} className="mt-[2px]" />
        </Link>
      </div>
    );
  };

  const toggleMobileSection = (label: string) =>
    setOpenMobileSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));

  return (
    <header
      className={cn(
        "relative w-full fixed top-0 left-0 z-50 transition-all duration-300 font-sans bg-white",
        isScrolled ? "shadow-md" : "",
      )}
    >
      <div className="relative">
        {(topPrimary.length > 0 || topSupport.length > 0 || social.length > 0) && (
          <div className="w-full bg-brand-sky text-white h-10 relative z-20">
            <div className={cn("h-full grid grid-cols-[1fr_140px_1fr] items-center", containerClass)}>
              <div
                className={cn(
                  "hidden md:flex items-center gap-[40px] font-heading font-bold text-[15px] leading-none tracking-[0.01em] justify-self-start",
                  topPrimary.length === 0 ? "hidden" : "",
                )}
              >
                {topPrimary.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href || "/"}
                    className="hover:opacity-80 transition-opacity"
                    {...linkTarget(link)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="hidden md:block" />

              <div className="hidden md:flex items-center justify-end gap-[40px]">
                <div
                  className={cn(
                    "flex items-center gap-[52px] font-heading font-bold text-[15px] leading-none tracking-[0.01em]",
                    topSupport.length === 0 ? "hidden" : "",
                  )}
                >
                  {topSupport.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href || "/"}
                      className="hover:opacity-80 transition-opacity"
                      {...linkTarget(link)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div
                  className={cn(
                    "flex items-center gap-[22px]",
                    social.length === 0 ? "hidden" : "",
                  )}
                >
                  {social.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href || "/"}
                      aria-label={link.label}
                      className="hover:opacity-80 transition-opacity"
                      {...linkTarget(link)}
                    >
                      {renderSocialIcon(link.icon, "w-[19px] h-[19px]")}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex md:hidden col-span-3 w-full items-center justify-between">
                <div className="flex items-center gap-[15px]">
                  {mobileSocialLeft.map((link) => (
                    <Link
                      key={`mobile-left-${link.label}`}
                      href={link.href || "/"}
                      aria-label={link.label}
                      className="hover:opacity-80 transition-opacity"
                      {...linkTarget(link)}
                    >
                      {renderSocialIcon(link.icon, "w-[19px] h-[19px]")}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center gap-[15px]">
                  {mobileSocialRight.map((link) => (
                    <Link
                      key={`mobile-right-${link.label}`}
                      href={link.href || "/"}
                      aria-label={link.label}
                      className="hover:opacity-80 transition-opacity"
                      {...linkTarget(link)}
                    >
                      {renderSocialIcon(link.icon, "w-[19px] h-[19px]")}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white h-[60px] relative z-10 shadow-sm lg:shadow-none">
          <div className={cn("h-full grid grid-cols-[1fr_140px_1fr] items-center", containerClass)}>
            <nav className="hidden min-[1000px]:flex items-center gap-[130px] font-heading font-normal text-[16px] text-brand-dark leading-none">
              {leftNavLinks.map(renderNavLink)}
            </nav>

            <div className="hidden min-[1000px]:block" />

            <div className="hidden min-[1000px]:flex items-center justify-end gap-7">
              <nav className="flex items-center gap-[110px] font-heading font-normal text-[16px] text-brand-dark leading-none">
                {rightNavLinks.map(renderNavLink)}
              </nav>
              <div className="flex items-center gap-5 pl-1">
                <a href="tel:+18779010110" className="text-[#3a3a3a] hover:text-brand-sky transition-colors">
                  <Phone size={23} strokeWidth={2.3} />
                </a>
                <a
                  href="https://wa.me/15613828555"
                  className="text-[#3a3a3a] hover:text-brand-sky transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={23} strokeWidth={2.3} />
                </a>
                <a
                  href="mailto:info@kidsjumptech.com?subject=Live%20Demo"
                  className="bg-brand-gradient text-white font-heading font-bold text-[16px] leading-none h-[41px] w-[122px] rounded-full flex items-center justify-center hover:shadow-lg transition-all ml-2"
                >
                  Live demo
                </a>
              </div>
            </div>

            <div className="min-[1000px]:hidden col-span-3 flex items-center justify-between h-full">
              <a
                href="mailto:info@kidsjumptech.com?subject=Live%20Demo"
                className="bg-brand-gradient text-white font-heading font-bold text-[12px] leading-none h-[29px] w-[86px] rounded-full flex items-center justify-center hover:shadow-md transition-all"
              >
                Live demo
              </a>

              <div className="flex items-center gap-3">
                <a href="tel:+18779010110" className="text-[#4a4a4a] hover:text-brand-sky p-1">
                  <Phone size={20} strokeWidth={2.3} />
                </a>
                <a
                  href="https://wa.me/15613828555"
                  className="text-[#4a4a4a] hover:text-brand-sky p-1"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={20} strokeWidth={2.3} />
                </a>
                <button
                  className="p-1 text-brand-sky"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle navigation"
                >
                  {isMenuOpen ? <X size={28} strokeWidth={2.5} className="text-[#6f6f6f]" /> : <MenuIcon size={28} strokeWidth={3} />}
                </button>
              </div>
            </div>
          </div>

          {renderMegaMenu()}
        </div>

        <Link
          href="/"
          className="absolute left-1/2 top-[7px] z-30 -translate-x-1/2 block"
          aria-label="KIDS Jump TECH"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.ibb.co/hxdLwtc1/Frame-5.png" alt="KIDS Jump TECH" className="w-[115px] h-[104px] object-contain" />
        </Link>
      </div>

      {isMenuOpen && (
        <div className="min-[1000px]:hidden absolute top-[100px] left-0 w-full bg-white h-[calc(100vh-100px)] overflow-y-auto px-5 md:px-6 pt-16 pb-10 shadow-xl border-t border-gray-100 z-40">
          <nav className="flex flex-col text-brand-dark">
            {primaryNavLinks.map((link) => {
              const childItems =
                (link.children?.length ?? 0) > 0
                  ? link.children ?? []
                  : link.label.toLowerCase().includes("products") && megaRoot
                    ? megaRoot.children?.flatMap((column) => toLinks(column)) ?? []
                    : [];
              const hasChildren = childItems.length > 0;
              const isExpanded = openMobileSections[link.label] ?? false;

              return (
                <div key={link.label} className="border-b border-[#d9d9d9]">
                  <Link
                    href={link.href || "/"}
                    className="flex items-center justify-between py-3.5"
                    {...linkTarget(link)}
                    onClick={(e) => {
                      if (hasChildren) {
                        e.preventDefault();
                        toggleMobileSection(link.label);
                      } else {
                        setIsMenuOpen(false);
                      }
                    }}
                    aria-expanded={hasChildren ? isExpanded : undefined}
                  >
                    <span className="font-heading font-normal text-[16px] leading-tight">{link.label}</span>
                    <ChevronDown
                      size={12}
                      strokeWidth={3}
                      className={cn(
                        "transition-transform",
                        hasChildren && isExpanded ? "rotate-180" : "",
                        !hasChildren ? "opacity-60" : "",
                      )}
                    />
                  </Link>

                  {hasChildren && isExpanded && (
                    <div className="pl-1 pb-3 flex flex-col gap-2 text-[15px] text-gray-600">
                      {childItems.map((child, idx) => (
                        <Link
                          key={`${child.label}-${idx}`}
                          href={child.href || "#"}
                          {...linkTarget(child)}
                          className="py-1.5 flex items-center justify-between"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

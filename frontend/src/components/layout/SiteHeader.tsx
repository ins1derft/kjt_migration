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
        <div className="mx-auto w-full max-w-6xl px-4 xl:px-12 py-10">
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
          className="rounded-md px-2 py-1 hover:text-brand-sky transition-colors"
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
          className="flex items-center gap-1 rounded-md px-2 py-1 hover:text-brand-sky transition-colors"
          {...linkProps}
          {...linkTarget(link)}
        >
          {link.label}
          <ChevronDown size={14} strokeWidth={3} className="mt-[2px]" />
        </Link>
      </div>
    );
  };

  return (
    <header className={cn("w-full fixed top-0 z-50 transition-all duration-300 font-sans", isScrolled ? "shadow-md" : "")}>
      {(topPrimary.length > 0 || topSupport.length > 0 || social.length > 0) && (
        <div className="w-full bg-brand-sky text-white h-[44px] relative z-20">
          <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-end px-4 xl:px-12 relative">
            <div className={cn("hidden lg:block absolute left-0 w-full top-0 h-full pointer-events-none", topPrimary.length === 0 && topSupport.length === 0 ? "hidden" : "")}>
              <div className="h-full flex justify-center items-center">
                <div className="flex items-center pointer-events-auto font-bold font-heading text-[14px] tracking-wide">
                  <div className="flex items-center gap-10 justify-end w-[350px]">
                    {topPrimary.map((link) => (
                      <Link key={link.label} href={link.href || "/"} className="hover:opacity-80 transition-opacity" {...linkTarget(link)}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="w-[150px] shrink-0" />
                  <div className="flex items-center gap-10 justify-start w-[350px]">
                    {topSupport.map((link) => (
                      <Link key={link.label} href={link.href || "/"} className="hover:opacity-80 transition-opacity" {...linkTarget(link)}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {social.length > 0 && (
              <div className="flex gap-6 items-center text-white relative z-20 pointer-events-auto">
                {social.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href || "/"}
                    aria-label={link.label}
                    className="hover:opacity-80 transition-opacity"
                    {...linkTarget(link)}
                  >
                    {renderSocialIcon(link.icon)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white h-[60px] relative shadow-sm lg:shadow-none z-50">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 xl:px-12">
          <nav className="hidden lg:flex items-center gap-8 font-heading font-bold text-[16px] text-brand-dark h-full relative">
            {leftNavLinks.map(renderNavLink)}
          </nav>

          <Link href="/" className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.ibb.co/hxdLwtc1/Frame-5.png" alt="KIDS Jump TECH" className="w-[103px] h-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-8 h-full">
            <nav className="flex items-center gap-8 font-heading font-bold text-[16px] text-brand-dark h-full relative">
              {rightNavLinks.map(renderNavLink)}
            </nav>
            <div className="flex items-center gap-5 pl-2">
              <a href="tel:+18779010110" className="text-brand-dark hover:text-brand-sky transition-colors">
                <Phone size={24} strokeWidth={2.5} />
              </a>
              <a href="https://wa.me/15613828555" className="text-brand-dark hover:text-brand-sky transition-colors" target="_blank" rel="noreferrer">
                <MessageCircle size={24} strokeWidth={2.5} />
              </a>
              <a
                href="mailto:info@kidsjumptech.com?subject=Live%20Demo"
                className="bg-brand-gradient animate-gradient text-white font-heading font-bold text-[15px] tracking-wide py-[10px] px-6 rounded-full hover:shadow-lg hover:opacity-90 transition-all ml-2"
              >
                Live Demo
              </a>
            </div>
          </div>

          <div className="lg:hidden flex items-center w-full h-full relative z-40 justify-between pointer-events-none">
            <a
              href="mailto:info@kidsjumptech.com?subject=Live%20Demo"
              className="bg-brand-gradient animate-gradient text-white font-heading font-bold text-[10px] tracking-wide py-2 px-3 rounded-full hover:shadow-lg hover:opacity-90 transition-all whitespace-nowrap pointer-events-auto"
            >
              Live Demo
            </a>

            <div className="flex items-center gap-3 pointer-events-auto">
              <a href="tel:+18779010110" className="text-brand-dark hover:text-brand-sky p-1">
                <Phone size={20} strokeWidth={2.5} />
              </a>
              <a href="https://wa.me/15613828555" className="text-brand-dark hover:text-brand-sky p-1" target="_blank" rel="noreferrer">
                <MessageCircle size={20} strokeWidth={2.5} />
              </a>
              <button
                className="text-brand-dark p-1 hover:text-brand-sky transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation"
              >
                {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>
        </div>

        {renderMegaMenu()}
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-[104px] left-0 w-full bg-white h-[calc(100vh-104px)] overflow-y-auto p-6 shadow-xl border-t border-gray-100 z-40">
          <nav className="flex flex-col gap-6 font-heading font-bold text-xl text-brand-dark">
            {primaryNavLinks.map((link) => (
              <div key={link.label} className="flex flex-col gap-3">
                <Link
                  href={link.href || "/"}
                  className="flex items-center justify-between"
                  {...linkTarget(link)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                  {(link.children?.length ?? 0) > 0 && <ChevronDown size={16} />}
                </Link>

                {(link.children?.length ?? 0) > 0 && link.label.toLowerCase().includes("products") && megaRoot ? (
                  <div className="pl-4 flex flex-col gap-4 text-base font-normal text-gray-600">
                    {megaRoot.children?.map((column, idx) => {
                      const chunks = chunkLinks(toLinks(column), 7);
                      return (
                        <div key={`${column.label}-${idx}`} className="flex flex-col gap-2">
                          <div className="font-bold text-gray-400 text-sm uppercase">{column.label}</div>
                          {chunks.map((group, gIdx) => (
                            <div key={`${column.label}-group-${gIdx}`} className="flex flex-col gap-1">
                              {group.map((item, i) => (
                                <Link
                                  key={`${item.label}-${i}`}
                                  href={item.href || "#"}
                                  {...linkTarget(item)}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="flex items-center justify-between"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ) : (link.children?.length ?? 0) > 0 ? (
                  <div className="pl-4 flex flex-col gap-2 text-base font-normal text-gray-600">
                    {link.children?.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href || "#"}
                        {...linkTarget(child)}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            <hr className="border-gray-100 my-2" />

            <div className="mt-4 flex flex-wrap gap-4 text-sm font-normal text-gray-500">
              {[...topPrimary, ...topSupport].map((link) => (
                <Link
                  key={`mobile-${link.label}`}
                  href={link.href || "/"}
                  {...linkTarget(link)}
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-brand-sky transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

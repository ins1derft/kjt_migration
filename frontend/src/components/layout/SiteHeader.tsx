'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import { ChevronDown, Menu as MenuIcon, MessageCircle, Phone, X } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/api";
import type { Menu, MenuItem } from "@/lib/menus";

type MenuLink = {
  label: string;
  href?: string | null;
  icon?: string | null;
  targetBlank?: boolean;
  color?: string | null;
  children?: MenuLink[];
};

function mapMenuItemToLink(item: MenuItem): MenuLink {
  return {
    label: item.label,
    href: item.url ?? null,
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
  if (!link.href) {
    return {};
  }

  return link.targetBlank
    ? {
        target: "_blank" as const,
        rel: "noreferrer",
      }
    : {};
}

const normalizePathname = (value: string) => {
  const withoutQuery = value.split('?')[0] ?? '';
  const withoutHash = withoutQuery.split('#')[0] ?? '';
  const normalized = withoutHash.trim();
  if (!normalized) return '/';
  const withLeadingSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
  if (withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/')) return withLeadingSlash.slice(0, -1);
  return withLeadingSlash;
};

const resolvePathnameFromHref = (href?: string | null) => {
  const raw = href?.trim();
  if (!raw) return null;
  if (raw.startsWith('#')) return null;
  if (raw.startsWith('//')) return null;
  if (raw.startsWith('mailto:') || raw.startsWith('tel:')) return null;

  if (raw.startsWith('/')) return normalizePathname(raw);

  if (raw.startsWith('http://') || raw.startsWith('https://')) return null;

  return normalizePathname(raw);
};

const isHrefActive = (pathname: string, href?: string | null) => {
  const current = normalizePathname(pathname);
  const target = resolvePathnameFromHref(href);
  if (!target) return false;
  if (current === target) return true;
  if (target !== '/' && current.startsWith(`${target}/`)) return true;
  return false;
};

const isMenuLinkActive = (pathname: string, link: MenuLink): boolean => {
  if (isHrefActive(pathname, link.href)) return true;
  return (link.children ?? []).some((child) => isMenuLinkActive(pathname, child));
};

type MenuLinkElementProps = {
  link: MenuLink;
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  ariaLabel?: string;
  ariaExpanded?: boolean;
};

function MenuLinkElement({ link, className, children, onClick, onMouseEnter, onMouseLeave, ariaLabel, ariaExpanded }: MenuLinkElementProps) {
  const href = link.href?.trim();
  const content = children ?? link.label;

  if (!href) {
    return (
      <span
        className={cn(className, "cursor-default select-none")}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={ariaLabel}
        aria-expanded={ariaExpanded}
        aria-disabled
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      {...linkTarget(link)}
    >
      {content}
    </Link>
  );
}

const renderSocialIcon = (code?: string | null, className = "w-5 h-5", color?: string | null) => {
  const raw = (code ?? "").trim();

  if (!raw) {
    return <IconifyIcon icon="mdi:earth" className={className} color={color ?? undefined} />;
  }

  return <IconifyIcon icon={raw} className={className} color={color ?? undefined} />;
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

export default function SiteHeader({ menu, settings }: { menu?: Menu | null; settings?: SiteSettings | null }) {
  const pathname = usePathname();
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

  const settingsSocial = (settings?.social_links ?? []).map<MenuLink>((link) => ({
    label: link.label,
    href: link.href ?? null,
    icon: link.icon ?? null,
    targetBlank: link.targetBlank ?? true,
    color: link.headerColor ?? link.color ?? null,
    children: [],
  }));
  const displaySocial = settingsSocial;
  const primaryNavLinks = navLinks(menu);
  const leftCount = Math.min(3, primaryNavLinks.length);
  const leftNavLinks = primaryNavLinks.slice(0, leftCount);
  const rightNavLinks = primaryNavLinks.slice(leftCount);

  const topPrimary = displayTopPrimary;
  const topSupport = displayTopSupport;
  const social = displaySocial;
  const mobileSocialLeft = social.slice(0, Math.ceil(social.length / 2));
  const mobileSocialRight = social.slice(Math.ceil(social.length / 2));

  const megaCandidates = primaryNavLinks.filter((link) => (link.children?.length ?? 0) > 0);
  const defaultMega = megaCandidates[0] || null;
  const currentMegaRoot =
    megaCandidates.find((link) => link.label === activeMenu) || (activeMenu ? null : defaultMega);
  const megaKey = currentMegaRoot?.label ?? null;

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

  const normalizePhoneHref = (raw?: string | null) => {
    if (!raw) return null;
    const cleaned = raw.replace(/[^\d+]/g, "");
    if (!cleaned) return null;
    return `tel:${cleaned}`;
  };

  const headerPhoneHref = normalizePhoneHref(settings?.header_phone);
  const headerWhatsappHref = settings?.header_whatsapp || null;
  const liveDemoHref = "/live-demo/";
  const logoUrl = settings?.logo_url || null;

  const renderMegaMenu = () => (
    <div
      className={cn(
        "absolute top-[60px] left-0 w-full bg-white border-t border-gray-100 shadow-xl z-10 transition-all duration-300 origin-top overflow-hidden",
        currentMegaRoot && activeMenu
          ? "opacity-100 visible translate-y-0 max-h-[600px]"
          : "opacity-0 invisible -translate-y-2 max-h-0",
      )}
      onMouseEnter={() => handleMouseEnter(megaKey || "")}
      onMouseLeave={handleMouseLeave}
    >
      {currentMegaRoot && (
        <div className={cn("w-full", containerClass, "py-10")}>
          <div className="flex flex-col lg:flex-row gap-12">
            {currentMegaRoot.children?.map((column, idx) => {
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
                        {group.map((item, linkIdx) => {
                          const isActive = isMenuLinkActive(pathname, item);
                          return (
                            <MenuLinkElement
                              key={`${item.label}-${linkIdx}`}
                              link={item}
                              className="flex items-center gap-3 group"
                            >
                              <div className="text-brand-gold group-hover:scale-110 transition-transform">
                                {getIcon(item.icon || "Star", "w-5 h-5")}
                              </div>
                              <span
                                className={cn(
                                  "text-sm font-normal transition-colors",
                                  isActive
                                    ? "text-brand-sky underline decoration-2 underline-offset-4"
                                    : "text-[#4a4a4a] group-hover:text-brand-sky",
                                )}
                              >
                                {item.label}
                              </span>
                            </MenuLinkElement>
                          );
                        })}
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

    const isMegaTrigger = hasChildren;
    const isActive = isMenuLinkActive(pathname, link);

    const linkProps = isMegaTrigger
      ? {
          onMouseEnter: () => handleMouseEnter(link.label),
          onMouseLeave: handleMouseLeave,
        }
      : {};

    if (!hasChildren) {
      return (
        <MenuLinkElement
          key={link.label}
          link={link}
          className={cn(
            "rounded-none px-0 py-[2px] leading-none hover:text-brand-sky transition-colors",
            isActive ? "text-brand-sky underline decoration-2 underline-offset-8" : "",
          )}
          {...linkProps}
        >
          {link.label}
        </MenuLinkElement>
      );
    }

    return (
      <div key={link.label} className="relative group h-full flex items-center">
        <MenuLinkElement
          link={link}
          className={cn(
            "flex items-center gap-1 rounded-none px-0 py-[2px] leading-none hover:text-brand-sky transition-colors",
            isActive ? "text-brand-sky underline decoration-2 underline-offset-8" : "",
          )}
          {...linkProps}
        >
          {link.label}
          <ChevronDown size={13} strokeWidth={3} className="mt-[2px]" />
        </MenuLinkElement>
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
                  <MenuLinkElement
                    key={link.label}
                    link={link}
                    className={cn(
                      "hover:opacity-80 transition-opacity",
                      isHrefActive(pathname, link.href) ? "underline decoration-2 underline-offset-4" : "",
                    )}
                  >
                    {link.label}
                  </MenuLinkElement>
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
                    <MenuLinkElement
                      key={link.label}
                      link={link}
                      className={cn(
                        "hover:opacity-80 transition-opacity",
                        isHrefActive(pathname, link.href) ? "underline decoration-2 underline-offset-4" : "",
                      )}
                    >
                      {link.label}
                    </MenuLinkElement>
                  ))}
                </div>

                <div
                  className={cn(
                    "flex items-center gap-[22px]",
                    social.length === 0 ? "hidden" : "",
                  )}
                >
                  {social.map((link) => (
                    <MenuLinkElement
                      key={link.label}
                      link={link}
                      ariaLabel={link.label}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {renderSocialIcon(link.icon, "w-[19px] h-[19px]", link.color)}
                    </MenuLinkElement>
                  ))}
                </div>
              </div>

              <div className="flex md:hidden col-span-3 w-full items-center justify-between">
                <div className="flex items-center gap-[15px]">
                  {mobileSocialLeft.map((link) => (
                    <MenuLinkElement
                      key={`mobile-left-${link.label}`}
                      link={link}
                      ariaLabel={link.label}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {renderSocialIcon(link.icon, "w-[19px] h-[19px]", link.color)}
                    </MenuLinkElement>
                  ))}
                </div>

                <div className="flex items-center gap-[15px]">
                  {mobileSocialRight.map((link) => (
                    <MenuLinkElement
                      key={`mobile-right-${link.label}`}
                      link={link}
                      ariaLabel={link.label}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {renderSocialIcon(link.icon, "w-[19px] h-[19px]", link.color)}
                    </MenuLinkElement>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white h-[60px] relative z-10 shadow-sm lg:shadow-none">
          <div className={cn("h-full grid grid-cols-[1fr_auto_1fr] items-center", containerClass)}>
            <nav className="hidden min-[1000px]:flex items-center gap-[48px] xl:gap-[80px] 2xl:gap-[120px] font-heading font-normal text-[16px] text-brand-dark leading-none">
              {leftNavLinks.map(renderNavLink)}
            </nav>

            <div className="hidden min-[1000px]:block" />

            <div className="hidden min-[1000px]:flex items-center justify-end gap-5">
              <nav className="flex items-center gap-[50px] xl:gap-[80px] 2xl:gap-[95px] font-heading font-normal text-[16px] text-brand-dark leading-none">
                {rightNavLinks.map(renderNavLink)}
              </nav>
              <div className="flex items-center gap-3 pl-1">
                {headerPhoneHref && (
                  <a href={headerPhoneHref} className="text-[#3a3a3a] hover:text-brand-sky transition-colors">
                    <Phone size={23} strokeWidth={2.3} />
                  </a>
                )}
                {headerWhatsappHref && (
                  <a
                    href={headerWhatsappHref}
                    className="text-[#3a3a3a] hover:text-brand-sky transition-colors"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={23} strokeWidth={2.3} />
                  </a>
                )}
                {liveDemoHref && (
                  <a
                    href={liveDemoHref}
                    className="bg-brand-gradient text-white font-heading font-semibold text-[15px] leading-none h-[41px] w-[110px] rounded-full flex items-center justify-center animate-gradient-hover hover:shadow-lg transition-all ml-2"
                  >
                    Live demo
                  </a>
                )}
              </div>
            </div>

            <div className="min-[1000px]:hidden col-span-3 flex items-center justify-between h-full px-[6px]">
              {liveDemoHref && (
                <a
                  href={liveDemoHref}
                  className="bg-brand-gradient text-white font-heading font-semibold text-[12px] leading-none h-[29px] w-[86px] rounded-full flex items-center justify-center animate-gradient-hover hover:shadow-md transition-all"
                >
                  Live demo
                </a>
              )}

              <div className="flex items-center gap-[4px] pr-0">
                {headerPhoneHref && (
                  <a href={headerPhoneHref} className="text-[#4a4a4a] hover:text-brand-sky p-1">
                    <Phone size={20} strokeWidth={2.3} />
                  </a>
                )}
                {headerWhatsappHref && (
                  <a
                    href={headerWhatsappHref}
                    className="text-[#4a4a4a] hover:text-brand-sky p-1"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={20} strokeWidth={2.3} />
                  </a>
                )}
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

        {logoUrl && (
          <Link
            href="/"
            className="absolute left-1/2 top-[7px] z-30 -translate-x-1/2 block"
            aria-label="KIDS Jump TECH"
          >
            <Image
              src={logoUrl}
              alt="KIDS Jump TECH"
              width={115}
              height={100}
              sizes="115px"
              className="w-[115px] h-[100px] object-contain max-[999px]:w-[108px] max-[999px]:h-[94px]"
              unoptimized
            />
          </Link>
        )}
      </div>

      {isMenuOpen && (
        <div className="min-[1000px]:hidden absolute top-[100px] left-0 w-full bg-white h-[calc(100vh-100px)] overflow-y-auto px-5 md:px-6 pt-16 pb-10 shadow-xl border-t border-gray-100 z-40">
          <nav className="flex flex-col text-brand-dark">
            {primaryNavLinks.map((link) => {
              const childItems = link.children ?? [];
              const hasChildren = childItems.length > 0;
              const isExpanded = openMobileSections[link.label] ?? false;
              const isActive = isMenuLinkActive(pathname, link);

              return (
                <div key={link.label} className="border-b border-[#d9d9d9]">
                  <MenuLinkElement
                    link={link}
                    className="flex items-center justify-between py-3.5"
                    onClick={(e) => {
                      if (hasChildren) {
                        e.preventDefault();
                        toggleMobileSection(link.label);
                      } else if (link.href) {
                        setIsMenuOpen(false);
                      }
                    }}
                    ariaExpanded={hasChildren ? isExpanded : undefined}
                  >
                    <span
                      className={cn(
                        "font-heading font-normal text-[16px] leading-tight",
                        isActive ? "text-brand-sky underline decoration-2 underline-offset-4" : "",
                      )}
                    >
                      {link.label}
                    </span>
                    {hasChildren && (
                      <ChevronDown
                        size={12}
                        strokeWidth={3}
                        className={cn("transition-transform", isExpanded ? "rotate-180" : "")}
                      />
                    )}
                  </MenuLinkElement>

                  {hasChildren && isExpanded && (
                    <div className="pl-1 pb-3 flex flex-col gap-3 text-[15px] text-gray-600">
                      {childItems.map((child, idx) => {
                        const grand = child.children ?? [];
                        if (grand.length > 0) {
                          return (
                            <div key={`${child.label}-${idx}`} className="flex flex-col gap-2">
                              <div className="font-heading font-semibold text-[15px] text-[#1a1a1a]">{child.label}</div>
                              <div className="flex flex-col pl-2 gap-1">
                                {grand.map((leaf, leafIdx) => {
                                  const isLeafActive = isMenuLinkActive(pathname, leaf);
                                  return (
                                    <MenuLinkElement
                                      key={`${leaf.label}-${leafIdx}`}
                                      link={leaf}
                                      className={cn(
                                        "py-1 flex items-center justify-between",
                                        isLeafActive ? "text-brand-sky underline decoration-2 underline-offset-4" : "",
                                      )}
                                      onClick={() => leaf.href && setIsMenuOpen(false)}
                                    >
                                      {leaf.label}
                                    </MenuLinkElement>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }

                        const isChildActive = isMenuLinkActive(pathname, child);
                        return (
                          <MenuLinkElement
                            key={`${child.label}-${idx}`}
                            link={child}
                            className={cn(
                              "py-1.5 flex items-center justify-between",
                              isChildActive ? "text-brand-sky underline decoration-2 underline-offset-4" : "",
                            )}
                            onClick={() => child.href && setIsMenuOpen(false)}
                          >
                            {child.label}
                          </MenuLinkElement>
                        );
                      })}
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

'use client';

import React, { useMemo } from 'react';
import { slugifyAnchor } from '@/lib/blocks/anchors';

export type ProductNavItem = {
  label?: string | null;
  anchor?: string | null;
};

export interface ProductNavProps {
  items?: ProductNavItem[] | null;
}

const OFFSET = 180; // header + nav height buffer

const normalizeAnchor = (anchor?: string | null, fallbackLabel?: string | null) => {
  const cleaned = anchor?.replace(/^#/, '').trim() ?? '';
  const fromAnchor = slugifyAnchor(cleaned);
  if (fromAnchor) return fromAnchor;
  return slugifyAnchor(fallbackLabel ?? '') ?? '';
};

const ProductNav: React.FC<ProductNavProps> = ({ items }) => {
  const navItems = useMemo(
    () =>
      (items ?? [])
        .map((item) => ({ label: item?.label?.trim(), anchor: normalizeAnchor(item?.anchor, item?.label) }))
        .filter((item): item is { label: string; anchor: string } => Boolean(item.label && item.anchor)),
    [items]
  );

  if (!navItems.length) {
    return null;
  }

  const scrollToSection = (anchor: string) => {
    const target = document.getElementById(anchor);
    if (!target) return;

    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = target.getBoundingClientRect().top;
    const targetPosition = elementRect - bodyRect - OFFSET;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  };

  return (
    <div className="sticky top-[104px] z-40 bg-white backdrop-blur-sm border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6">
        {/*
          Mobile scroll helpers:
          - -mx-4 px-4 give edge-to-edge scroll on small screens
          - gap-6 keeps buttons comfortably spaced on touch devices
          - justify-start ensures the list begins on the left for mobile
        */}
        <div className="flex items-center gap-6 md:gap-12 overflow-x-auto py-6 w-auto -mx-4 px-4 md:mx-0 md:px-0 justify-start lg:justify-center">
          {navItems.map((item, index) => (
            <button
              key={`${item.anchor}-${index}`}
              type="button"
              onClick={() => scrollToSection(item.anchor)}
              className="group relative font-heading font-bold text-[16px] whitespace-nowrap text-[#1A1A1A] hover:text-brand-sky transition-colors shrink-0 select-none"
            >
              {item.label}
              <span className="absolute -bottom-6 left-0 w-0 h-[3px] bg-brand-sky transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductNav;

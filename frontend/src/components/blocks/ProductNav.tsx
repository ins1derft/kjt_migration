'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { slugifyAnchor } from '@/lib/blocks/anchors';

export type ProductNavItem = {
  label?: string | null;
  anchor?: string | null;
};

export type ProductNavVariant = 'classic' | 'orange';

export interface ProductNavProps {
  items?: ProductNavItem[] | null;
  variant?: ProductNavVariant | null;
}

const OFFSET = 180; // header + nav height buffer

const normalizeAnchor = (anchor?: string | null, fallbackLabel?: string | null) => {
  const cleaned = anchor?.replace(/^#/, '').trim() ?? '';
  const fromAnchor = slugifyAnchor(cleaned);
  if (fromAnchor) return fromAnchor;
  return slugifyAnchor(fallbackLabel ?? '') ?? '';
};

const ProductNav: React.FC<ProductNavProps> = ({ items, variant }) => {
  const navItems = useMemo(
    () =>
      (items ?? [])
        .map((item) => ({ label: item?.label?.trim(), anchor: normalizeAnchor(item?.anchor, item?.label) }))
        .filter((item): item is { label: string; anchor: string } => Boolean(item.label && item.anchor)),
    [items]
  );

  const resolvedVariant: ProductNavVariant = variant === 'orange' ? 'orange' : 'classic';
  const isOrange = resolvedVariant === 'orange';

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
    <div
      className={cn(
        'sticky top-[104px] z-40 transition-all duration-300',
        isOrange ? 'bg-brand-orange' : 'bg-white backdrop-blur-sm border-b border-gray-100 shadow-sm'
      )}
    >
      <div className="container mx-auto px-5 sm:px-6 lg:px-10">
        {/*
          Mobile scroll helpers:
          - -mx-5 px-5 give edge-to-edge scroll on small screens
          - gap keeps buttons comfortably spaced on touch devices
          - justify-start keeps the list anchored left when scrolling horizontally
        */}
        <div
          className={cn(
            'flex items-center overflow-x-auto w-auto -mx-5 px-5 md:mx-0 md:px-0 custom-scrollbar',
            isOrange
              ? 'gap-8 md:gap-10 lg:gap-12 h-[80px] justify-start md:justify-center'
              : 'gap-6 md:gap-12 py-6 justify-start lg:justify-center'
          )}
        >
          {navItems.map((item, index) => (
            <button
              key={`${item.anchor}-${index}`}
              type="button"
              onClick={() => scrollToSection(item.anchor)}
              className={cn(
                'group relative font-heading font-bold text-[16px] whitespace-nowrap transition-colors shrink-0 select-none',
                isOrange ? 'text-white hover:text-white/80' : 'text-[#1A1A1A] hover:text-brand-sky'
              )}
            >
              {item.label}
              {!isOrange && (
                <span className="absolute -bottom-6 left-0 w-0 h-[3px] bg-brand-sky transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductNav;

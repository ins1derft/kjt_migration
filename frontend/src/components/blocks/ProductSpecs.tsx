'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { cn, resolveMediaUrl } from '@/lib/utils';
import RichText from '../RichText';
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from '@/lib/blocks/padding';

export interface ProductSpecTab {
  key: string;
  label: string;
  image?: string | null;
  title?: string | null;
  description?: string | null;
}

export interface ProductSpecsProps {
  tabs: ProductSpecTab[];
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

const ProductSpecs: React.FC<ProductSpecsProps> = ({ tabs, padding, backgroundClass, backgroundColor }) => {
  const hasTabs = tabs && tabs.length > 0;
  const [activeKey, setActiveKey] = useState<string | null>(hasTabs ? tabs[0].key : null);

  const resolvedActiveKey = useMemo(() => {
    if (!tabs?.length) return null;
    if (activeKey && tabs.some((tab) => tab.key === activeKey)) return activeKey;
    return tabs[0]?.key ?? null;
  }, [tabs, activeKey]);

  const activeTab = useMemo(() => {
    if (!resolvedActiveKey) return null;
    return tabs.find((tab) => tab.key === resolvedActiveKey) ?? tabs[0] ?? null;
  }, [resolvedActiveKey, tabs]);

  if (!activeTab) {
    return null;
  }

  const activeTabClass = 'bg-white text-brand-dark shadow-[0px_1px_10px_rgba(0,0,0,0.05)]';
  const inactiveTabClass = 'bg-transparent text-table-text hover:text-brand-dark';

  const hasCustomPadding = Boolean(
    (typeof padding === 'string' && padding.trim()) ||
    (padding && typeof padding === 'object' && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "pb-24");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-brand-gray");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn("relative", sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="container relative mx-auto px-5 sm:px-6 lg:px-10">
        {/* Overlapping Tabs - Centered and pushed up by half height (32.5px) */}
        <div className="absolute left-1/2 z-20 flex -translate-x-1/2 -top-[32.5px] items-center justify-center">
          <div className="flex rounded-full bg-brand-gray p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveKey(tab.key)}
                className={cn(
                  'h-[65px] px-10 rounded-full font-heading font-extrabold text-[20px] transition-all duration-200',
                  resolvedActiveKey === tab.key ? activeTabClass : inactiveTabClass
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="pt-24 lg:pt-32">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-[84px]">
            {/* Left Column: Image / Diagram */}
            <div className="flex justify-center lg:justify-end animate-in fade-in duration-500">
              <div className="relative w-full max-w-[654px] aspect-video">
                {resolveMediaUrl(activeTab.image) ? (
                  <Image
                    src={resolveMediaUrl(activeTab.image) ?? ''}
                    alt={`${activeTab.label} diagram`}
                    width={654}
                    height={368}
                    className="object-contain mix-blend-multiply"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    style={{ width: '100%', height: 'auto', maxWidth: '654px' }}
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="aspect-video w-full rounded-2xl bg-white/60" />
                )}
              </div>
            </div>

            {/* Right Column: Text */}
            <div className="max-w-[538px] animate-in slide-in-from-right-4 duration-500">
              {activeTab.title && (
                <h3 className="mb-6 font-heading text-[24px] font-bold leading-[1.2] text-brand-dark md:text-[30px]">
                  {activeTab.title}
                </h3>
              )}
              {activeTab.description && (
                <RichText
                  html={activeTab.description}
                  className="font-sans text-[18px] font-normal leading-[1.4] text-brand-dark/70 md:text-[20px]"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSpecs;

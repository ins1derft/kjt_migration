'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import QuoteModal from './QuoteModal';
import { cn, resolveMediaUrl } from '@/lib/utils';
import type { ProductSummary, ProductVariant } from '@/lib/blocks/types';
import type { FormConfig } from '@/lib/api';
import RichText from '../RichText';
import { resolveSectionPadding, type SectionPadding } from '@/lib/blocks/padding';
import ClickSpark from '@/components/bits/ClickSpark';
import GradientText from '@/components/bits/GradientText';

export interface CompareModelsProps {
  title?: string;
  description?: string;
  product?: ProductSummary | null;
  variants?: ProductVariant[] | null;
  formConfig?: FormConfig | null;
  padding?: SectionPadding | null;
}

type SpecValue = unknown;

const formatLabel = (key: string) =>
  key
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const renderSpecValue = (value: SpecValue) => {
  if (value === null || value === undefined || value === '') return <span className="text-gray-400">—</span>;

  if (typeof value === 'boolean') {
    const yes = value === true;
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full px-3 py-1 text-[13px] font-semibold',
          yes ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
        )}
      >
        {yes ? 'Yes' : 'No'}
      </span>
    );
  }

  if (typeof value === 'number') {
    return <span className="font-heading text-[16px] text-brand-dark">{value}</span>;
  }

  if (Array.isArray(value)) {
    return (
      <ul className="list-disc list-inside text-left text-[14px] text-gray-700 space-y-1">
        {value.map((item, idx) => (
          <li key={idx}>{String(item)}</li>
        ))}
      </ul>
    );
  }

  if (typeof value === 'object') {
    return (
      <pre className="whitespace-pre-wrap break-words rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-700">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  // string or fallback
  return <span className="font-sans text-[15px] text-brand-dark leading-snug">{String(value)}</span>;
};

const CompareModels: React.FC<CompareModelsProps> = ({ title, description, product, variants, formConfig, padding }) => {
  const data = (variants ?? []).filter(Boolean);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const specKeys = useMemo(() => {
    // Collect unique spec keys excluding fields that are rendered elsewhere (price/image/name/label)
    const excluded = new Set(['price', 'name', 'label', 'image']);
    const keys = new Set<string>();

    data.forEach((variant) => {
      const specs = (variant.specs ?? {}) as Record<string, SpecValue>;
      Object.keys(specs).forEach((k) => {
        const value = specs[k];
        if (value === undefined) return; // avoid hydration mismatches: undefined is stripped from JSON payloads
        if (excluded.has(k)) return;
        keys.add(k);
      });
    });

    return Array.from(keys).sort((a, b) => a.localeCompare(b));
  }, [data]);

  const hasPrice = useMemo(() => data.some((v) => v.price !== null && v.price !== undefined && v.price !== ''), [data]);
  const ctaLabel = product?.default_cta_label ?? 'Get a Quote';
  const formatPrice = (value: ProductVariant['price']) => {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'number') return `$${value}`;
    return value.startsWith('$') ? value : `$${value}`;
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftShadow(scrollLeft > 0);
      setShowRightShadow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const gridTemplate = useMemo(() => {
    const specCols = specKeys.map(() => '170px').join(' ');
    // image | tech params | specs... | CTA (price lives inside CTA cell)
    return `200px 180px ${specCols} 210px`;
  }, [specKeys]);

  if (!data.length) {
    return null;
  }

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "py-20");

  return (
    <>
      <section className={cn(paddingClass, "bg-white")}> 
        <div className="container mx-auto px-5 sm:px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight mb-4 text-transparent">
              <GradientText className="!rounded-none !p-0 !shadow-none">
                {title ?? 'Compare Models'}
              </GradientText>
            </h2>
            {description && (
              <RichText
                html={description}
                className="font-sans text-lg md:text-[20px] text-gray-600/70 max-w-3xl mx-auto leading-relaxed"
              />
            )}
          </div>

          <div className="relative group/table">
            {/* Left shadow */}
            <div
              className={cn(
                'pointer-events-none absolute left-0 top-0 z-10 h-[calc(100%-12px)] w-12 rounded-l-[20px] bg-gradient-to-r from-black/10 to-transparent transition-opacity duration-300',
                showLeftShadow ? 'opacity-100' : 'opacity-0'
              )}
            />
            {/* Right shadow */}
            <div
              className={cn(
                'pointer-events-none absolute right-0 top-0 z-10 h-[calc(100%-12px)] w-12 rounded-r-[20px] bg-gradient-to-l from-black/10 to-transparent transition-opacity duration-300',
                showRightShadow ? 'opacity-100' : 'opacity-0'
              )}
            />

            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="custom-scrollbar overflow-x-auto rounded-[20px] border border-gray-100 bg-white shadow-sm"
            >
              <div className="min-w-max">
                {/* Header */}
                <div
                  className="grid border-b border-table-border bg-table-header"
                  style={{ gridTemplateColumns: gridTemplate }}
                >
                  <div className="p-6" />
                  <div className="flex items-center justify-center p-6 text-center font-heading text-[16px] font-bold text-table-text">
                    Tech Parameters
                  </div>
                  {specKeys.map((key) => (
                    <div
                      key={key}
                      className="flex items-center justify-center p-6 text-center font-heading text-[16px] font-bold text-table-text leading-[1.2]"
                    >
                      {formatLabel(key)}
                    </div>
                  ))}
                  <div className="flex items-center justify-center p-6 text-center font-heading text-[16px] font-bold text-table-text"></div>
                </div>

                {/* Rows */}
                <div className="flex flex-col bg-white">
                  {data.map((variant, idx) => {
                    const specs = (variant.specs ?? {}) as Record<string, SpecValue>;
                    return (
                      <div
                        key={variant.id ?? idx}
                        className={cn(
                          'grid border-b border-table-border last:border-0',
                          idx % 2 === 0 ? 'bg-table-row' : 'bg-table-header'
                        )}
                        style={{ gridTemplateColumns: gridTemplate }}
                      >
                        <div className="p-6 flex items-center justify-center">
                          {resolveMediaUrl(variant.image) ? (
                            <Image
                              src={resolveMediaUrl(variant.image) ?? ''}
                              alt={variant.name ?? 'Variant image'}
                              width={140}
                              height={90}
                              className="object-contain"
                              style={{ width: '140px', height: '90px' }}
                              unoptimized
                            />
                          ) : (
                            <div className="h-[90px] w-[140px] rounded-md bg-white/60" />
                          )}
                        </div>

                        <div className="p-6 flex flex-col items-center justify-center text-center">
                          <span className="font-heading font-bold text-[16px] text-brand-dark mb-1 leading-tight">
                            {variant.name}
                          </span>
                          {variant.label && (
                            <span className="font-sans text-[13px] text-gray-500 leading-tight">{variant.label}</span>
                          )}
                        </div>

                        {specKeys.map((key) => (
                          <div key={key} className="flex items-center justify-center p-6 text-center">
                            {renderSpecValue(specs[key])}
                          </div>
                        ))}

                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          {hasPrice && (
                            <div className="font-heading font-bold text-[16px] text-brand-dark mb-2">
                              Price: {formatPrice(variant.price)}
                            </div>
                          )}
                          <ClickSpark sparkColor="#FFE4F0" sparkRadius={16} sparkCount={10} duration={220} easing="linear" className="inline-block w-full md:w-auto">
                            <button
                              type="button"
                              onClick={() => setSelectedVariant(variant)}
                              className="w-full rounded-[129px] bg-gradient-cta px-4 py-3 text-[15px] font-heading font-bold text-white shadow-lg transition-transform duration-150 hover:shadow-cta hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 md:w-auto"
                            >
                              {ctaLabel}
                            </button>
                          </ClickSpark>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteModal
        isOpen={!!selectedVariant}
        onClose={() => setSelectedVariant(null)}
        product={
          selectedVariant
            ? {
                id: selectedVariant.id ?? undefined,
                name: selectedVariant.name ?? '',
                image: selectedVariant.image ?? undefined,
                price: formatPrice(selectedVariant.price),
              }
            : null
        }
        formCode={product?.form?.code ?? null}
        formTitle={product?.form?.title ?? undefined}
        formConfig={formConfig ?? null}
        topic={selectedVariant?.name ?? product?.form?.title ?? product?.name ?? null}
      />
    </>
  );
};

export default CompareModels;

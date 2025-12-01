'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import QuoteModal from './QuoteModal';
import { cn } from '@/lib/utils';
import type { ProductSummary, ProductVariant } from '@/lib/blocks/types';
import type { FormConfig } from '@/lib/api';

export interface CompareModelsProps {
  title?: string;
  description?: string;
  product?: ProductSummary | null;
  variants?: ProductVariant[] | null;
  formConfig?: FormConfig | null;
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

const CompareModels: React.FC<CompareModelsProps> = ({ title, description, product, variants, formConfig }) => {
  const data = (variants ?? []).filter(Boolean);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const specKeys = useMemo(() => {
    const keys: string[] = [];
    data.forEach((variant) => {
      const specs = (variant.specs ?? {}) as Record<string, SpecValue>;
      Object.keys(specs).forEach((k) => {
        if (!keys.includes(k)) keys.push(k);
      });
    });
    return keys;
  }, [data]);

  const hasPrice = useMemo(() => data.some((v) => v.price !== null && v.price !== undefined && v.price !== ''), [data]);
  const ctaLabel = product?.default_cta_label ?? 'Get a Quote';

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

  if (!data.length) {
    return null;
  }

  const gridTemplate = `240px repeat(${specKeys.length}, minmax(170px, 1fr)) ${hasPrice ? '140px ' : ''}160px`;

  return (
    <>
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight mb-4">
              <span className="text-transparent bg-clip-text bg-brand-gradient animate-gradient">
                {title ?? 'Compare Models'}
              </span>
            </h2>
            {description && (
              <p className="font-sans text-lg md:text-[20px] text-gray-600/70 max-w-3xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <div className="relative">
            {/* Left shadow */}
            <div
              className={cn(
                'pointer-events-none absolute left-0 top-0 z-10 h-[calc(100%-12px)] w-10 rounded-l-[16px] bg-gradient-to-r from-black/10 to-transparent transition-opacity duration-300',
                showLeftShadow ? 'opacity-100' : 'opacity-0'
              )}
            />
            {/* Right shadow */}
            <div
              className={cn(
                'pointer-events-none absolute right-0 top-0 z-10 h-[calc(100%-12px)] w-10 rounded-r-[16px] bg-gradient-to-l from-black/10 to-transparent transition-opacity duration-300',
                showRightShadow ? 'opacity-100' : 'opacity-0'
              )}
            />

            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="custom-scrollbar overflow-x-auto rounded-[20px] border border-gray-100 bg-white pb-4 shadow-sm"
            >
              <div className="min-w-max">
                {/* Header */}
                <div
                  className="grid items-stretch border-b border-table-border bg-table-header"
                  style={{ gridTemplateColumns: gridTemplate }}
                >
                  <div className="p-6 font-heading text-[16px] font-bold text-table-text">Tech Parameters</div>
                  {specKeys.map((key) => (
                    <div
                      key={key}
                      className="flex items-center justify-center p-6 text-center font-heading text-[16px] font-bold text-table-text leading-[1.2]"
                    >
                      {formatLabel(key)}
                    </div>
                  ))}
                  {hasPrice && (
                    <div className="flex items-center justify-center p-6 text-center font-heading text-[16px] font-bold text-table-text">
                      Price
                    </div>
                  )}
                  <div className="flex items-center justify-center p-6 text-center font-heading text-[16px] font-bold text-table-text">
                    Action
                  </div>
                </div>

                {/* Rows */}
                <div className="flex flex-col bg-white">
                  {data.map((variant, idx) => {
                    const specs = (variant.specs ?? {}) as Record<string, SpecValue>;
                    return (
                      <div
                        key={variant.id ?? idx}
                        className={cn(
                          'grid items-start border-b border-table-border last:border-0',
                          idx % 2 === 0 ? 'bg-table-row' : 'bg-table-header'
                        )}
                        style={{ gridTemplateColumns: gridTemplate }}
                      >
                        <div className="p-6">
                          <div className="font-heading text-[16px] font-bold text-brand-dark">{variant.name}</div>
                          {variant.label && (
                            <div className="font-sans text-[13px] text-gray-500 leading-tight mt-1">{variant.label}</div>
                          )}
                        </div>

                        {specKeys.map((key) => (
                          <div key={key} className="flex items-center justify-center p-6 text-center">
                            {renderSpecValue(specs[key])}
                          </div>
                        ))}

                        {hasPrice && (
                          <div className="flex items-center justify-center p-6 text-center font-heading text-[16px] text-brand-dark">
                            {variant.price ?? '—'}
                          </div>
                        )}

                        <div className="flex items-center justify-center p-6">
                          <button
                            type="button"
                            onClick={() => setSelectedVariant(variant)}
                            className="w-full rounded-[129px] bg-gradient-cta px-4 py-3 text-[15px] font-heading font-bold text-white shadow-lg transition-all hover:-translate-y-[1px] hover:shadow-cta active:translate-y-0 md:w-auto"
                          >
                            {ctaLabel}
                          </button>
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
                name: selectedVariant.name ?? '',
                price: selectedVariant.price,
              }
            : null
        }
        formCode={product?.form?.code ?? null}
        formTitle={product?.form?.title ?? undefined}
        formConfig={formConfig ?? null}
      />
    </>
  );
};

export default CompareModels;

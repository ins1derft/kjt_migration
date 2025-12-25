'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, FileText, Search, Sun, X } from 'lucide-react';
import QuoteModal from './QuoteModal';
import { cn, resolveMediaUrl } from '@/lib/utils';
import type { ProductSummary, ProductVariant } from '@/lib/blocks/types';
import type { FormConfig } from '@/lib/api';
import RichText from '../RichText';
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from '@/lib/blocks/padding';
import ClickSpark from '@/components/bits/ClickSpark';

export interface CompareModelsProps {
  title?: string;
  description?: string;
  attributeCodes?: string[] | null;
  product?: ProductSummary | null;
  variants?: ProductVariant[] | null;
  formConfig?: FormConfig | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

type SpecValue = unknown;

const formatLabel = (key: string) =>
  key
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const isEmptyValue = (value: unknown) => value === null || value === undefined || value === '';

const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const parseLooseNumber = (input: string): number | null => {
  const raw = input.trim();
  if (!raw) return null;

  const matches = raw.match(/-?[\d.,]+/g);
  if (!matches?.length) return null;

  const numeric = matches.join('');
  if (!numeric) return null;

  const toNumber = (value: string) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  };

  const hasDot = numeric.includes('.');
  const hasComma = numeric.includes(',');

  if (hasDot && hasComma) {
    const lastDot = numeric.lastIndexOf('.');
    const lastComma = numeric.lastIndexOf(',');

    if (lastComma > lastDot) {
      // 1.234,56 -> thousands are dots, comma is decimal separator
      return toNumber(numeric.replace(/\./g, '').replace(',', '.'));
    }

    // 1,234.56 -> thousands are commas, dot is decimal separator
    return toNumber(numeric.replace(/,/g, ''));
  }

  if (hasDot) {
    // 2.000 -> thousands separator
    if (/^-?\d{1,3}(\.\d{3})+$/.test(numeric)) {
      return toNumber(numeric.replace(/\./g, ''));
    }
    return toNumber(numeric);
  }

  if (hasComma) {
    // 2,000 -> thousands separator
    if (/^-?\d{1,3}(,\d{3})+$/.test(numeric)) {
      return toNumber(numeric.replace(/,/g, ''));
    }
    // 2,5 -> decimal separator
    return toNumber(numeric.replace(',', '.'));
  }

  return toNumber(numeric);
};

const formatCurrency = (value: ProductVariant['price']) => {
  if (isEmptyValue(value)) return '—';

  if (typeof value === 'number' && Number.isFinite(value)) {
    return currencyFormat.format(Math.round(value));
  }

  const raw = String(value).trim();

  const num = parseLooseNumber(raw);
  if (num === null) {
    const safe = raw.startsWith('$') ? raw : `$${raw}`;
    return safe;
  }

  return currencyFormat.format(Math.round(num));
};

const normalizeSpecText = (value: unknown, label?: string) => {
  if (isEmptyValue(value)) return '—';

  if (typeof value === 'number' && Number.isFinite(value)) {
    const base = numberFormat.format(value);
    const rawLabel = typeof label === 'string' ? label : '';
    if (!rawLabel.includes(',')) return base;

    const unit = rawLabel.split(',').pop()?.trim() ?? '';
    if (!unit || unit === rawLabel) return base;
    if (!/^[A-Za-z%]{1,6}$/.test(unit)) return base;
    return `${base} ${unit}`;
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    const items = normalizeListValue(value);
    return items.length ? items.join(', ') : '—';
  }

  if (typeof value === 'object') {
    const items = normalizeListValue(value);
    return items.length ? items.join('\n') : '—';
  }

  const text = String(value).trim();
  if (!text) return '—';

  // Split "min ..., max ..." into two lines for better readability (content-based, not key-based).
  const parts = text.split(/,\s*(?=max\.|Max\.)/);
  if (parts.length > 1) {
    return parts.map((part) => part.trim()).filter(Boolean).join('\n');
  }

  return text;
};

const normalizeListValue = (value: unknown) => {
  const items: string[] = [];
  const seen = new Set<string>();
  const normalizeItem = (value: string) =>
    value
      .replace(/^[\s•+✓✔✅\-–—]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const pushUnique = (value: string) => {
    if (!value) return;
    if (seen.has(value)) return;
    seen.add(value);
    items.push(value);
  };

  if (Array.isArray(value)) {
    for (const item of value) {
      if (isEmptyValue(item)) continue;
      const text = normalizeItem(
        item && typeof item === 'object'
          ? (() => {
              try {
                return JSON.stringify(item);
              } catch {
                return String(item);
              }
            })()
          : String(item),
      );
      pushUnique(text);
    }
  } else if (typeof value === 'string') {
    const parts = value
      .split(/\r?\n|,\s*/g)
      .map((part) => normalizeItem(part))
      .filter(Boolean);
    parts.forEach(pushUnique);
  } else if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    Object.entries(obj).forEach(([key, val]) => {
      const cleanedKey = normalizeItem(key);
      if (!cleanedKey) return;
      if (isEmptyValue(val)) return;

      let rendered: string;
      if (Array.isArray(val)) {
        const list = normalizeListValue(val);
        rendered = list.length ? list.join(', ') : '—';
      } else if (val && typeof val === 'object') {
        try {
          rendered = JSON.stringify(val);
        } catch {
          rendered = String(val);
        }
      } else {
        rendered = String(val);
      }

      const text = normalizeItem(`${cleanedKey}: ${rendered}`);
      pushUnique(text);
    });
  }

  return items;
};

const resolveColumnHeader = (key: string, specLabels: Record<string, string>) => {
  return specLabels[key] ?? formatLabel(key);
};

const renderHeaderLabel = (label: string) => {
  if (label === 'Tech Parameters') {
    return (
      <span className="leading-[1.2]">
        Tech
        <br />
        Parameters
      </span>
    );
  }

  return <span className="leading-[1.2]">{label}</span>;
};

const resolveLightMode = (label?: string | null) => {
  const normalized = typeof label === 'string' ? label.toLowerCase() : '';
  if (normalized.includes('high-light')) return 'high';
  if (normalized.includes('medium-light')) return 'medium';
  return null;
};

const CompareModels: React.FC<CompareModelsProps> = ({
  title,
  description,
  attributeCodes,
  product,
  variants,
  formConfig,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const data = useMemo(() => (variants ?? []).filter(Boolean), [variants]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [zoomVariant, setZoomVariant] = useState<ProductVariant | null>(null);
  const [mobileAccessoriesOpen, setMobileAccessoriesOpen] = useState<Record<string, boolean>>({});
  const [quoteTopic, setQuoteTopic] = useState<string | null>(null);

  const specLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    data.forEach((variant) => {
      const variantLabels = variant.spec_labels ?? {};
      Object.entries(variantLabels).forEach(([key, value]) => {
        if (labels[key]) return;
        if (!value) return;
        labels[key] = String(value);
      });
    });
    return labels;
  }, [data]);

  const hasPrice = useMemo(
    () => data.some((variant) => !isEmptyValue(variant.price)),
    [data],
  );

  const normalizedCtaLabel = useMemo(() => {
    const raw = product?.default_cta_label ?? 'Get Quote';
    const cleaned = raw.replace(/\bGet\s+a\b/i, 'Get').replace(/\s+/g, ' ').trim();
    if (!cleaned) return 'Get Quote';
    if (/^get\s+quote$/i.test(cleaned)) return 'Get Quote';
    return cleaned;
  }, [product?.default_cta_label]);

  const orderedSpecKeys = useMemo(() => {
    const excluded = new Set(['price', 'name', 'label', 'image']);
    const keys: string[] = [];

    data.forEach((variant) => {
      const specs = (variant.specs ?? {}) as Record<string, SpecValue>;
      for (const key of Object.keys(specs)) {
        if (excluded.has(key)) continue;
        if (keys.includes(key)) continue;
        keys.push(key);
      }
    });

    return keys;
  }, [data]);

  const configuredSpecKeys = useMemo(() => {
    const raw =
      Array.isArray(attributeCodes)
        ? attributeCodes
        : product?.compare_models_attribute_codes;
    if (!Array.isArray(raw)) return [];
    return raw
      .map((code) => String(code).trim())
      .filter(Boolean);
  }, [attributeCodes, product?.compare_models_attribute_codes]);

  const mainSpecKeys = useMemo(() => {
    const result: string[] = [];
    const add = (key: string) => {
      if (!key) return;
      if (result.includes(key)) return;
      result.push(key);
    };

    configuredSpecKeys.forEach(add);

    for (const key of orderedSpecKeys) {
      if (result.length >= 3) break;
      if (key === 'accessories' || key === 'warranty') continue;
      add(key);
    }

    return result.slice(0, 3);
  }, [configuredSpecKeys, orderedSpecKeys]);

  const tableGridTemplate = useMemo(() => {
    // image | tech params | 3 specs | accessories | price
    // Use fr-based columns to avoid horizontal scroll on 1000–1920 widths.
    // Table is shown from `lg` and up, so we can keep comfortable minimums without forcing overflow.
    return '132px minmax(0, 1.35fr) minmax(0, 0.95fr) minmax(0, 0.95fr) minmax(0, 1.15fr) minmax(0, 1.45fr) minmax(0, 1.1fr)';
  }, []);

  const openQuote = (variant: ProductVariant, topicOverride?: string) => {
    setQuoteTopic(topicOverride ?? null);
    setSelectedVariant(variant);
  };

  useEffect(() => {
    if (!zoomVariant) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomVariant(null);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [zoomVariant]);

  useEffect(() => {
    if (!zoomVariant) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = selectedVariant ? 'hidden' : '';
    };
  }, [selectedVariant, zoomVariant]);

  if (!data.length) {
    return null;
  }

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "py-20");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-white");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const hasTitle = Boolean(title?.trim());
  const hasDescription = Boolean(description?.trim());
  const hasHeader = hasTitle || hasDescription;

  return (
    <>
      <section className={cn(paddingClass, sectionBackground)} style={sectionStyle}> 
        <div className="container mx-auto px-5 sm:px-6 lg:px-10 2xl:max-w-[1320px]">
          {hasHeader && (
            <div className="text-center mb-16">
              {hasTitle && (
                <h2 className="mx-auto w-full max-w-[992px] font-heading font-bold text-[40px] md:text-[64px] leading-tight mb-4">
                  <span className="text-transparent bg-clip-text bg-brand-gradient">
                    {title ?? 'Compare Models'}
                  </span>
                </h2>
              )}
              {hasDescription && (
                <RichText
                  html={description}
                  className="font-sans text-lg md:text-[20px] text-gray-600/70 max-w-[992px] mx-auto leading-relaxed"
                />
              )}
            </div>
          )}

          {/* Desktop / Tablet table */}
          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-[20px] border border-table-border bg-brand-gray shadow-sm">
              <div className="grid bg-table-header border-b border-table-border" style={{ gridTemplateColumns: tableGridTemplate }}>
                <div className="px-4 py-6" />
                <div className="flex items-center justify-center px-4 py-6 text-center font-heading text-[13px] font-bold text-table-text md:text-[16px]">
                  {renderHeaderLabel('Tech Parameters')}
                </div>
                {mainSpecKeys.map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-center px-3 py-6 text-center font-heading text-[13px] font-bold text-table-text md:text-[16px]"
                  >
                    {renderHeaderLabel(resolveColumnHeader(key, specLabels))}
                  </div>
                ))}
                <div className="flex items-center justify-center px-4 py-6 text-center font-heading text-[13px] font-bold text-table-text md:text-[16px]">
                  Accessories
                </div>
                <div className="flex items-center justify-center px-4 py-6 text-center font-heading text-[13px] font-bold text-table-text md:text-[16px]">
                  Price
                </div>
              </div>

              <div className="flex flex-col">
                {data.map((variant, idx) => {
                  const specs = (variant.specs ?? {}) as Record<string, SpecValue>;
                  const accessories = normalizeListValue(specs.accessories);
                  const isHighlighted = Boolean(variant.is_highlighted);
                  const imageSrc = resolveMediaUrl(variant.image) ?? '/images/placeholders/no-image.jpg';
                  const techLabel = variant.label ? `(${variant.label})` : null;

                  return (
                    <div
                      key={variant.id ?? idx}
                      className={cn(
                        'grid border-b border-table-border last:border-b-0',
                        idx % 2 === 0 ? 'bg-table-row' : 'bg-table-header',
                        isHighlighted ? 'ring-inset ring-[5px] ring-brand-orange' : null,
                      )}
                      style={{ gridTemplateColumns: tableGridTemplate }}
                    >
                      <div className="flex min-w-0 items-center justify-center px-2 py-6">
                        <button
                          type="button"
                          onClick={() => setZoomVariant(variant)}
                          className="group relative flex h-[86px] w-[110px] items-center justify-center rounded-[12px] bg-white/60 p-2 transition hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/30"
                          aria-label={`Zoom image: ${variant.name ?? 'product'}`}
                        >
                          <Image
                            src={imageSrc}
                            alt={variant.name ?? 'Variant image'}
                            width={160}
                            height={110}
                            className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.08]"
                            unoptimized
                          />
                          <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1 ring-black/5">
                            <Search className="h-4 w-4 text-brand-dark/70" />
                          </span>
                        </button>
                      </div>

                      <div className="flex min-w-0 flex-col items-center justify-center px-4 py-6 text-center">
                        <div className="font-heading text-[14px] font-bold leading-[1.2] text-brand-dark md:text-[16px]">
                          {variant.name}
                        </div>
                        {techLabel ? (
                          <div className="mt-1 font-heading text-[15px] font-medium leading-[1.35] text-[#555555]">
                            {techLabel}
                          </div>
                        ) : null}
                      </div>

                      {mainSpecKeys.map((key) => {
                        const label = resolveColumnHeader(key, specLabels);
                        const value = specs[key];
                        const display = normalizeSpecText(value, label);

                        return (
                          <div
                            key={key}
                            className="flex min-w-0 items-center justify-center px-3 py-6 text-center font-heading text-[14px] leading-[1.4] text-brand-dark/70 md:text-[16px]"
                          >
                            <span className="whitespace-pre-line">{display}</span>
                          </div>
                        );
                      })}

                      <div className="flex min-w-0 items-center justify-center px-4 py-6 text-left font-heading text-[14px] leading-[1.4] text-brand-dark/70 md:text-[16px]">
                        {accessories.length ? (
                          <ul className="list-disc space-y-1 pl-5">
                            {accessories.map((item) => (
                              <li key={item} className="break-words">
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-brand-dark/40">—</span>
                        )}
                      </div>

                      <div className="flex flex-col items-center justify-center px-4 py-6 text-center">
                        {hasPrice ? (
                          <div className="font-heading text-[22px] font-extrabold leading-none text-brand-dark md:text-[26px]">
                            {formatCurrency(variant.price)}
                          </div>
                        ) : null}

                        <ClickSpark
                          sparkColor="#FFE4F0"
                          sparkRadius={16}
                          sparkCount={10}
                          duration={220}
                          easing="linear"
                          className="mt-4 inline-block w-full md:w-auto"
                        >
                          <button
                            type="button"
                            onClick={() => openQuote(variant)}
                            className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-[129px] bg-gradient-cta px-4 py-2.5 text-[14px] font-heading font-bold text-white shadow-lg transition-transform duration-150 hover:shadow-cta hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 md:w-auto"
                          >
                            <FileText className="h-4 w-4" aria-hidden />
                            {normalizedCtaLabel}
                          </button>
                        </ClickSpark>

                        <button
                          type="button"
                          onClick={() => openQuote(variant, `Financing Available — ${variant.name ?? ''}`.trim())}
                          className="mt-2 font-heading text-[14px] font-medium text-brand-sky underline underline-offset-2 transition hover:text-brand-sky/80"
                        >
                          Financing Available
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden">
            <div className="flex flex-col gap-6">
              {data.map((variant, idx) => {
                const specs = (variant.specs ?? {}) as Record<string, SpecValue>;
                const accessories = normalizeListValue(specs.accessories);
                const imageSrc = resolveMediaUrl(variant.image) ?? '/images/placeholders/no-image.jpg';
                const lightMode = resolveLightMode(variant.label);
                const key = String(variant.id ?? idx);
                const isOpen = mobileAccessoriesOpen[key] ?? false;

                const keyParams = mainSpecKeys.map((specKey) => {
                  const label = resolveColumnHeader(specKey, specLabels);
                  const raw = specs[specKey];
                  const value = normalizeSpecText(raw, label);
                  const icon = <CheckCircle2 className="h-4 w-4 text-brand-dark/60" aria-hidden />;

                  return { label, value, icon };
                });

                return (
                  <div key={key} className="rounded-[20px] bg-brand-gray p-5 shadow-sm ring-1 ring-black/5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-heading text-[18px] font-bold leading-[1.2] text-brand-dark">
                          {variant.name}
                        </h3>
                        {variant.label ? (
                          <p className="mt-1 font-heading text-[15px] font-medium leading-[1.35] text-[#555555]">
                            {variant.label}
                          </p>
                        ) : null}
                      </div>

                      {lightMode ? (
                        <div
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-full bg-white/70 ring-1 ring-black/5',
                            lightMode === 'high' ? 'text-brand-orange' : 'text-brand-orange/60',
                          )}
                          title={variant.label ?? undefined}
                        >
                          <Sun className="h-5 w-5" aria-hidden />
                        </div>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={() => setZoomVariant(variant)}
                      className="group relative mt-5 flex w-full items-center justify-center rounded-[16px] bg-white/60 px-4 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/30"
                      aria-label={`Zoom image: ${variant.name ?? 'product'}`}
                    >
                      <Image
                        src={imageSrc}
                        alt={variant.name ?? 'Variant image'}
                        width={520}
                        height={360}
                        className="max-h-[220px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.06]"
                        unoptimized
                      />
                      <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1 ring-black/5">
                        <Search className="h-5 w-5 text-brand-dark/70" />
                      </span>
                    </button>

                    <div className="mt-5 space-y-2">
                      {keyParams.map((param) => (
                        <div key={param.label} className="flex items-start gap-3 text-[15px] leading-[1.4] text-brand-dark/70">
                          <div className="mt-0.5 shrink-0">{param.icon}</div>
                          <p className="min-w-0 break-words">
                            <span className="font-semibold text-brand-dark">{param.label}:</span> {param.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={() => setMobileAccessoriesOpen((prev) => ({ ...prev, [key]: !isOpen }))}
                        className="flex w-full items-center justify-between rounded-[12px] bg-white/60 px-4 py-3 text-left font-heading text-[15px] font-bold text-brand-dark ring-1 ring-black/5"
                      >
                        <span>Show Accessories &amp; Warranty</span>
                        <span className={cn('text-brand-dark/60 transition-transform', isOpen ? 'rotate-180' : 'rotate-0')}>
                          ▾
                        </span>
                      </button>

                      {isOpen ? (
                        <div className="mt-3 rounded-[12px] bg-white/60 px-4 py-4 ring-1 ring-black/5">
                          {accessories.length ? (
                            <ul className="list-disc space-y-1 pl-5 text-[15px] leading-[1.4] text-brand-dark/70">
                              {accessories.map((item) => (
                                <li key={item} className="break-words">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[15px] text-brand-dark/50">No details</p>
                          )}
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-6 text-center">
                      {hasPrice ? (
                        <div className="font-heading text-[28px] font-extrabold leading-none text-brand-dark">
                          {formatCurrency(variant.price)}
                        </div>
                      ) : null}

                      <ClickSpark
                        sparkColor="#FFE4F0"
                        sparkRadius={16}
                        sparkCount={10}
                        duration={220}
                        easing="linear"
                        className="mt-4 inline-block w-full"
                      >
                        <button
                          type="button"
                          onClick={() => openQuote(variant)}
                          className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-[129px] bg-gradient-cta px-5 py-3 text-[16px] font-heading font-bold text-white shadow-lg transition-transform duration-150 hover:shadow-cta hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
                        >
                          <FileText className="h-4 w-4" aria-hidden />
                          {normalizedCtaLabel}
                        </button>
                      </ClickSpark>

                      <button
                        type="button"
                        onClick={() => openQuote(variant, `Financing Available — ${variant.name ?? ''}`.trim())}
                        className="mt-3 font-heading text-[15px] font-medium text-brand-sky underline underline-offset-2 transition hover:text-brand-sky/80"
                      >
                        Financing Available
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {zoomVariant ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200">
          <button
            aria-label="Close image"
            onClick={() => setZoomVariant(null)}
            className="absolute right-6 top-6 z-10 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <X size={32} />
          </button>

          <button
            aria-label="Close image"
            onClick={() => setZoomVariant(null)}
            className="absolute inset-0"
          />

          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="relative aspect-[16/10] w-full bg-brand-gray">
              <Image
                src={resolveMediaUrl(zoomVariant.image) ?? '/images/placeholders/no-image.jpg'}
                alt={zoomVariant.name ?? 'Product image'}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 96vw, 1024px"
                unoptimized
              />
            </div>
          </div>
        </div>
      ) : null}

      <QuoteModal
        isOpen={!!selectedVariant}
        onClose={() => {
          setSelectedVariant(null);
          setQuoteTopic(null);
        }}
        product={
          selectedVariant
            ? {
                id: selectedVariant.id ?? undefined,
                name: selectedVariant.name ?? '',
                image: selectedVariant.image ?? undefined,
                price: formatCurrency(selectedVariant.price),
              }
            : null
        }
        formCode={product?.form?.code ?? null}
        formTitle={product?.form?.title ?? undefined}
        formConfig={formConfig ?? null}
        topic={quoteTopic ?? selectedVariant?.name ?? product?.form?.title ?? product?.name ?? null}
      />
    </>
  );
};

export default CompareModels;

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
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

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

const CompareModelsIconZoomIn = ({ className, title, ...props }: IconProps) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('shrink-0', className)}
    aria-hidden={title ? undefined : true}
    {...props}
  >
    {title ? <title>{title}</title> : null}
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M6.5.25c-1.937 0-3.516.546-4.61 1.64S.25 4.563.25 6.5s.546 3.516 1.64 4.61s2.673 1.64 4.61 1.64c1.492 0 2.771-.324 3.78-.973l1.684 1.683a1 1 0 1 0 1.414-1.414l-1.666-1.666c.692-1.024 1.038-2.339 1.038-3.88c0-1.937-.546-3.516-1.64-4.61S8.437.25 6.5.25m.625 4.016a.625.625 0 0 0-1.25 0v1.609h-1.61a.625.625 0 1 0 0 1.25h1.61v1.61a.625.625 0 1 0 1.25 0v-1.61h1.61a.625.625 0 0 0 0-1.25h-1.61z"
      clipRule="evenodd"
    />
  </svg>
);

const CompareModelsIconGame = ({ className, title, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('shrink-0', className)}
    aria-hidden={title ? undefined : true}
    {...props}
  >
    {title ? <title>{title}</title> : null}
    <path
      fill="currentColor"
      d="M17 4c1.106 0 1.955.843 2.584 1.75l.213.321l.195.32q.093.157.178.308c.787 1.407 1.472 3.244 1.925 5.059c.45 1.801.699 3.682.54 5.161C22.475 18.404 21.71 20 20 20c-1.534 0-2.743-.82-3.725-1.621l-1.11-.931C14.242 16.692 13.232 16 12 16s-2.243.692-3.164 1.448l-1.11.93C6.742 19.18 5.533 20 4 20c-1.711 0-2.476-1.596-2.635-3.081c-.158-1.48.09-3.36.54-5.161c.453-1.815 1.138-3.652 1.925-5.059l.178-.309l.195-.319l.213-.321C5.045 4.843 5.894 4 7 4c.51 0 1.017.124 1.515.27l.593.182q.147.045.292.086c.865.248 1.75.462 2.6.462s1.735-.214 2.6-.462l.885-.267C15.983 4.124 16.49 4 17 4M8.5 8a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5m7 0a1 1 0 0 0-1 1v.5H14a1 1 0 1 0 0 2h.5v.5a1 1 0 1 0 2 0v-.5h.5a1 1 0 1 0 0-2h-.5V9a1 1 0 0 0-1-1m-7 2a.5.5 0 1 1 0 1a.5.5 0 0 1 0-1"
    />
  </svg>
);

const CompareModelsIconLight = ({ className, title, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('shrink-0', className)}
    aria-hidden={title ? undefined : true}
    {...props}
  >
    {title ? <title>{title}</title> : null}
    <path
      fill="currentColor"
      d="M12 19a1 1 0 0 1 .993.883L13 20v1a1 1 0 0 1-1.993.117L11 21v-1a1 1 0 0 1 1-1m-4.95-2.05a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0m11.314 0l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 1.414-1.414M12.617 2a2 2 0 0 1 1.985 1.752l.38 3.04a6 6 0 1 1-5.964 0l.38-3.04A2 2 0 0 1 11.383 2zM4 11a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2zm17 0a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2zm-1.929-6.07a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0m-12.728 0l.707.707A1 1 0 0 1 5.636 7.05l-.707-.707A1 1 0 0 1 6.343 4.93M12.617 4h-1.234l-.25 2h1.734z"
    />
  </svg>
);

const CompareModelsIconRuler = ({ className, title, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('shrink-0', className)}
    aria-hidden={title ? undefined : true}
    {...props}
  >
    {title ? <title>{title}</title> : null}
    <path
      fill="currentColor"
      d="M19 3a2 2 0 0 1 1.995 1.85L21 5v5a2 2 0 0 1-1.85 1.995L19 12h-7v7a2 2 0 0 1-1.85 1.995L10 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3zM6 15H5l-.117.007a1 1 0 0 0 0 1.986L5 17h1l.117-.007a1 1 0 0 0 0-1.986zm0-4H5a1 1 0 0 0-.117 1.993L5 13h1a1 1 0 0 0 .117-1.993zm0-4H5a1 1 0 0 0-.117 1.993L5 9h1a1 1 0 0 0 .117-1.993zm2-3a1 1 0 0 0-.993.883L7 5v1a1 1 0 0 0 1.993.117L9 6V5a1 1 0 0 0-1-1m4 0a1 1 0 0 0-.993.883L11 5v1l.007.117a1 1 0 0 0 1.986 0L13 6V5l-.007-.117A1 1 0 0 0 12 4m4 0a1 1 0 0 0-.993.883L15 5v1a1 1 0 0 0 1.993.117L17 6V5a1 1 0 0 0-1-1"
    />
  </svg>
);

const CompareModelsIconClose = ({ className, title, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('shrink-0', className)}
    aria-hidden={title ? undefined : true}
    {...props}
  >
    {title ? <title>{title}</title> : null}
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CompareModelsIconCaret = ({ className, title, ...props }: IconProps) => (
  <svg
    viewBox="0 0 11 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('shrink-0', className)}
    aria-hidden={title ? undefined : true}
    {...props}
  >
    {title ? <title>{title}</title> : null}
    <path fill="currentColor" d="M0 0h11L5.5 6z" />
  </svg>
);

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

const normalizeWarrantyLine = (raw: string) => {
  const text = raw.replace(/\s+/g, ' ').trim();
  if (!text) return null;

  const match = text.match(/^warranty\b\s*(?:[:\-–—]\s*)?(.*)$/i);
  const suffix = match?.[1]?.trim();
  if (!suffix) return 'Warranty';
  return `Warranty - ${suffix}`;
};

const splitAccessories = (items: string[], warrantyFallback: unknown) => {
  const warrantyIndex = items.findIndex((item) => /^warranty\b/i.test(item));
  const warrantyFromList = warrantyIndex >= 0 ? normalizeWarrantyLine(items[warrantyIndex] ?? '') : null;
  const listItems = warrantyIndex >= 0 ? items.filter((_, idx) => idx !== warrantyIndex) : items;

  if (warrantyFromList) {
    return { warrantyLine: warrantyFromList, items: listItems };
  }

  if (!isEmptyValue(warrantyFallback)) {
    const raw =
      typeof warrantyFallback === 'number' && Number.isFinite(warrantyFallback)
        ? `${Math.round(warrantyFallback)}`
        : String(warrantyFallback).trim();
    const cleaned = raw ? normalizeWarrantyLine(`Warranty: ${raw}`) : null;
    if (cleaned) {
      return { warrantyLine: cleaned, items: listItems };
    }
  }

  return { warrantyLine: null, items: listItems };
};

const splitIntoTwoColumns = (items: string[]) => {
  const half = Math.ceil(items.length / 2);
  return [items.slice(0, half), items.slice(half)];
};

const resolveMobileSpecIcon = (specKey: string, label: string, value: string) => {
  const key = specKey.toLowerCase();
  const labelText = label.toLowerCase();
  const valueText = value.toLowerCase();

  if (key.includes('software') || key.includes('games') || labelText.includes('software') || valueText.includes('game')) {
    return <CompareModelsIconGame className="h-6 w-6 text-brand-orange" />;
  }

  if (key.includes('laser') || key.includes('projector') || labelText.includes('laser') || valueText.includes('lm')) {
    return <CompareModelsIconLight className="h-6 w-6 text-brand-orange" />;
  }

  if (key.includes('size') || key.includes('projection') || labelText.includes('size') || /['"]|ft\b/.test(valueText)) {
    return <CompareModelsIconRuler className="h-6 w-6 -scale-y-100 text-brand-orange" />;
  }

  return <CompareModelsIconGame className="h-6 w-6 text-brand-orange" />;
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
  const [mobileIndex, setMobileIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

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
    const cleaned = raw
      .replace(/\bGet\s+a\b/i, 'Get')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleaned) return 'Get Quote';
    if (/^get\s+quote$/i.test(cleaned)) return 'Get Quote';
    return cleaned;
  }, [product?.default_cta_label]);

  const ctaLabelWithIcon = useMemo(() => {
    const base = normalizedCtaLabel || 'Get Quote';
    if (base.includes('📄')) return base;
    return `📄 ${base}`;
  }, [normalizedCtaLabel]);

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
    if (!Array.isArray(attributeCodes)) return [];
    return attributeCodes
      .map((code) => String(code).trim())
      .filter(Boolean);
  }, [attributeCodes]);

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

  const currentMobileIndex = Math.min(mobileIndex, Math.max(data.length - 1, 0));

  const tableGridTemplate = useMemo(() => {
    // image | tech params | 3 specs | accessories | price
    // Use fr-based columns to avoid horizontal scroll on 1000–1920 widths.
    // Table is shown from `lg` and up, so we can keep comfortable minimums without forcing overflow.
    return '154px minmax(0, 1.3fr) minmax(0, 0.9fr) minmax(0, 0.9fr) minmax(0, 1.1fr) minmax(0, 1.5fr) minmax(0, 1.2fr)';
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
        <div className="container mx-auto w-full px-5 sm:px-6 lg:max-w-[1189px] lg:px-[50px] 2xl:max-w-[1320px] 2xl:px-0">
          {hasHeader && (
            <div className="text-center mb-10 md:mb-16">
              {hasTitle && (
                <h2 className="mx-auto w-full max-w-[992px] font-heading font-bold text-[38px] md:text-[64px] leading-none mb-4">
                  <span className="text-transparent bg-clip-text bg-brand-gradient">
                    {title ?? 'Compare Models'}
                  </span>
                </h2>
              )}
              {hasDescription && (
                <RichText
                  html={description}
                  className="font-heading text-[16px] md:text-[20px] text-brand-dark/70 max-w-[711px] mx-auto leading-[1.4]"
                />
              )}
            </div>
          )}

          {/* Desktop / Tablet table */}
          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-[16.5px] 2xl:rounded-[20px] border border-table-border bg-brand-gray shadow-sm">
              <div className="grid bg-table-header border-b border-table-border" style={{ gridTemplateColumns: tableGridTemplate }}>
                <div className="px-4 py-5 2xl:py-6" />
                <div className="flex items-center justify-center px-4 py-5 2xl:py-6 text-center font-heading text-[13px] font-bold text-table-text 2xl:text-[16px]">
                  {renderHeaderLabel('Tech Parameters')}
                </div>
                {mainSpecKeys.map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-center px-3 py-5 2xl:py-6 text-center font-heading text-[13px] font-bold text-table-text 2xl:text-[16px]"
                  >
                    {renderHeaderLabel(resolveColumnHeader(key, specLabels))}
                  </div>
                ))}
                <div className="flex items-center justify-center px-4 py-5 2xl:py-6 text-center font-heading text-[13px] font-bold text-table-text 2xl:text-[16px]">
                  Accessories
                </div>
                <div className="flex items-center justify-center px-4 py-5 2xl:py-6 text-center font-heading text-[13px] font-bold text-table-text 2xl:text-[16px]">
                  Price
                </div>
              </div>

              <div className="flex flex-col">
	                {data.map((variant, idx) => {
	                  const specs = (variant.specs ?? {}) as Record<string, SpecValue>;
	                  const accessoriesRaw = normalizeListValue(specs.accessories);
	                  const { warrantyLine, items: accessories } = splitAccessories(accessoriesRaw, specs.warranty);
	                  const isHighlighted = Boolean(variant.is_highlighted);
	                  const imageSrc = resolveMediaUrl(variant.image) ?? '/images/placeholders/no-image.jpg';
	                  const techLabel = variant.label ? `(${variant.label})` : null;

                  return (
                    <div
                      key={variant.id ?? idx}
                      className={cn(
                        'grid border-b border-table-border last:border-b-0',
                        idx % 2 === 0 ? 'bg-brand-gray' : 'bg-table-row',
                        isHighlighted ? 'ring-inset ring-[5px] ring-brand-orange' : null,
                      )}
                      style={{ gridTemplateColumns: tableGridTemplate }}
                    >
                      <div className="flex min-w-0 items-center justify-center py-5 2xl:py-6">
                        <button
                          type="button"
                          onClick={() => setZoomVariant(variant)}
                          className="group relative flex h-[90px] w-[126px] items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/30 2xl:h-[110px] 2xl:w-[154px]"
                          aria-label={`Zoom image: ${variant.name ?? 'product'}`}
                        >
                        <Image
                          src={imageSrc}
                          alt={variant.name ?? 'Variant image'}
                          width={308}
                          height={220}
                          className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                          unoptimized
                        />
                        <span className="absolute right-2 top-2 text-table-text">
                          <CompareModelsIconZoomIn className="h-6 w-6 2xl:h-7 2xl:w-7" />
                        </span>
                      </button>
                    </div>

                      <div className="flex min-w-0 flex-col items-center justify-center px-4 py-5 2xl:py-6 text-center">
                        <div className="font-heading text-[13px] font-bold leading-[1.2] text-brand-dark 2xl:text-[16px]">
                          {variant.name}
                        </div>
                        {techLabel ? (
                          <div className="mt-1 font-heading text-[13px] font-normal leading-[1.4] text-[#555555] 2xl:text-[16px]">
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
                            className="flex min-w-0 items-center justify-center px-3 py-5 2xl:py-6 text-center font-heading text-[13px] leading-[1.4] text-brand-dark/70 2xl:text-[16px]"
                          >
                            <span className="whitespace-pre-line">{display}</span>
                          </div>
                        );
                      })}

                      <div className="flex min-w-0 items-center justify-center px-4 py-5 2xl:py-6 text-left font-heading text-[13px] leading-[1.4] text-brand-dark/70 2xl:text-[16px]">
                        <div className="w-full">
                          {warrantyLine ? (
                            <div className="mb-2 font-heading text-[13px] leading-[1.4] text-brand-dark/70 2xl:text-[16px]">
                              {warrantyLine}
                            </div>
	                          ) : null}

	                          {accessories.length ? (
	                            <ul className="list-disc space-y-1 pl-5">
	                              {accessories.map((item) => (
	                                <li key={item} className="break-words">
	                                  {item}
	                                </li>
	                              ))}
	                            </ul>
	                          ) : warrantyLine ? null : (
	                            <span className="text-brand-dark/40">—</span>
	                          )}
	                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center px-4 py-5 2xl:py-6 text-center">
                        {hasPrice ? (
                          <div className="font-heading text-[20px] font-light leading-[1.2] text-brand-dark 2xl:text-[24px]">
                            {formatCurrency(variant.price)}
                          </div>
                        ) : null}

                        <ClickSpark
                          sparkColor="#FFE4F0"
                          sparkRadius={16}
                          sparkCount={10}
                          duration={220}
                          easing="linear"
                          className="mt-3 inline-block 2xl:mt-4"
                        >
                          <button
                            type="button"
                            onClick={() => openQuote(variant)}
                            className="inline-flex h-[47px] w-[155px] items-center justify-center gap-2 whitespace-nowrap rounded-[129px] bg-gradient-cta text-[15px] font-heading font-bold text-white shadow-cta transition-transform duration-150 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 2xl:h-[57px] 2xl:w-[188px] 2xl:text-[18px]"
                          >
                            {ctaLabelWithIcon}
                          </button>
                        </ClickSpark>

                        <button
                          type="button"
                          onClick={() => openQuote(variant, `Financing Available — ${variant.name ?? ''}`.trim())}
                          className="mt-2 font-heading text-[13px] font-normal text-brand-sky underline underline-offset-2 transition hover:text-brand-sky/80 2xl:text-[16px]"
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
            {data.length ? (
              <div
                className="select-none"
                onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
                onTouchEnd={(event) => {
                  if (touchStartX === null) return;
                  const endX = event.changedTouches[0]?.clientX ?? touchStartX;
                  const delta = touchStartX - endX;
                  setTouchStartX(null);

                  if (Math.abs(delta) < 40) return;
                  setMobileIndex((idx) => {
                    if (delta > 0) return Math.min(idx + 1, data.length - 1);
                    return Math.max(idx - 1, 0);
                  });
                }}
              >
                {(() => {
                  const variant = data[currentMobileIndex]!;
                  const specs = (variant.specs ?? {}) as Record<string, SpecValue>;
                  const accessoriesRaw = normalizeListValue(specs.accessories);
                  const { warrantyLine, items: accessories } = splitAccessories(accessoriesRaw, specs.warranty);
                  const [accessoriesLeft, accessoriesRight] = splitIntoTwoColumns(accessories);
                  const imageSrc = resolveMediaUrl(variant.image) ?? '/images/placeholders/no-image.jpg';
                  const key = String(variant.id ?? currentMobileIndex);
                  const isOpen = mobileAccessoriesOpen[key] ?? false;

                  const keyParams = mainSpecKeys.map((specKey) => {
                    const label = resolveColumnHeader(specKey, specLabels);
                    const raw = specs[specKey];
                    const value = normalizeSpecText(raw, label);
                    return {
                      key: specKey,
                      label,
                      value,
                      icon: resolveMobileSpecIcon(specKey, label, value),
                    };
                  });

                  return (
                    <div className="rounded-[5px] bg-brand-gray p-5">
                      <h3 className="font-heading text-[24px] font-extrabold leading-[1.2] text-brand-dark">
                        {variant.name}
                      </h3>
                      {variant.label ? (
                        <p className="font-heading text-[14px] leading-[1.4] text-brand-dark/70">
                          {variant.label}
                        </p>
                      ) : null}

                        <button
                          type="button"
                          onClick={() => setZoomVariant(variant)}
                          className="group relative mt-5 flex h-[204px] w-full items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/30"
                          aria-label={`Zoom image: ${variant.name ?? 'product'}`}
                        >
                        <Image
                          src={imageSrc}
                          alt={variant.name ?? 'Variant image'}
                          width={640}
                          height={408}
                          className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                          unoptimized
                        />
                        <span className="absolute right-3 top-3 text-table-text">
                          <CompareModelsIconZoomIn className="h-6 w-6" />
                        </span>
                      </button>

                      <div className="mt-5 -mx-5 border-y border-table-border">
                        <div className="divide-y divide-table-border">
                          {keyParams.map((param) => (
                            <div key={param.key} className="flex items-start gap-3 px-5 py-3">
                              <div className="mt-0.5 shrink-0">{param.icon}</div>
                              <p className="min-w-0 whitespace-pre-line font-heading text-[13px] leading-[1.4] text-brand-dark/70">
                                {param.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setMobileAccessoriesOpen((prev) => ({ ...prev, [key]: !isOpen }))}
                          className={cn(
                            'flex h-10 w-full items-center justify-between rounded-[10px] border px-4 text-left font-heading text-[15px] font-bold transition',
                            isOpen
                              ? 'border-brand-orange bg-brand-orange text-white'
                              : 'border-brand-orange bg-transparent text-brand-orange',
                          )}
                        >
                          <span className="whitespace-nowrap">Show Accessories &amp; Warranty</span>
                          <CompareModelsIconCaret
                            className={cn('h-[11px] w-[11px] transition-transform', isOpen ? 'rotate-180' : 'rotate-0')}
                          />
                        </button>

                        {isOpen ? (
                          <div className="mt-3 font-heading text-[13px] leading-[1.4] text-brand-dark/70">
                            {warrantyLine ? (
                              <div className="mb-2">{warrantyLine}</div>
                            ) : null}

                            {accessories.length ? (
                              <div className={cn('grid gap-x-8', accessoriesRight.length ? 'grid-cols-2' : 'grid-cols-1')}>
                                <ul className="list-disc space-y-1 pl-5">
                                  {accessoriesLeft.map((item) => (
                                    <li key={item} className="break-words">
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                                {accessoriesRight.length ? (
                                  <ul className="list-disc space-y-1 pl-5">
                                    {accessoriesRight.map((item) => (
                                      <li key={item} className="break-words">
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                              </div>
                            ) : warrantyLine ? null : (
                              <p className="text-brand-dark/50">No details</p>
                            )}
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-5">
                        {hasPrice ? (
                          <div className="font-heading text-[24px] font-bold leading-[1.2] text-brand-dark">
                            {formatCurrency(variant.price)}
                          </div>
                        ) : null}

                        <ClickSpark
                          sparkColor="#FFE4F0"
                          sparkRadius={16}
                          sparkCount={10}
                          duration={220}
                          easing="linear"
                          className="mt-4 block w-full"
                        >
                          <button
                            type="button"
                            onClick={() => openQuote(variant)}
                            className="inline-flex h-[57px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-[129px] bg-gradient-cta text-[18px] font-heading font-bold text-white shadow-cta transition-transform duration-150 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
                          >
                            {ctaLabelWithIcon}
                          </button>
                        </ClickSpark>

                        <button
                          type="button"
                          onClick={() => openQuote(variant, `Financing Available — ${variant.name ?? ''}`.trim())}
                          className="mt-3 w-full text-center font-heading text-[13px] font-normal text-brand-sky underline underline-offset-2 transition hover:text-brand-sky/80"
                        >
                          Financing Available
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {data.length > 1 ? (
                  <div className="mt-5 flex items-center justify-center gap-2">
                    {data.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        aria-label={`Go to slide ${idx + 1}`}
                        onClick={() => setMobileIndex(idx)}
                        className={cn(
                          'h-2.5 w-2.5 rounded-full transition',
                          idx === currentMobileIndex ? 'bg-brand-dark' : 'bg-ui-dot',
                        )}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
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
            <CompareModelsIconClose className="h-8 w-8" />
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

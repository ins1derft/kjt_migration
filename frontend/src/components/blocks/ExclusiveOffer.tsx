'use client';

import React, { useMemo, useState } from 'react';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';
import { cn } from '@/lib/utils';
import RichText from '../RichText';
import QuoteModal from './QuoteModal';
import type { FormConfig } from '@/lib/api';

export type ExclusiveOfferItem = {
  title?: string | null;
  text?: string | null;
  ctaLabel?: string | null;
  formCode?: string | null;
  formTitle?: string | null;
};

export type ExclusiveOfferProps = {
  title?: string | null;
  description?: string | null;
  items?: ExclusiveOfferItem[] | null;
  defaultFormCode?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
  formsByCode?: Record<string, FormConfig | null>;
};

type NormalizedItem = {
  title: string;
  text: string;
  ctaLabel: string;
  formCode: string | null;
  formTitle: string | null;
};

const normalizeItems = (items: ExclusiveOfferProps['items']): NormalizedItem[] => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      title: typeof item?.title === 'string' ? item.title.trim() : '',
      text: typeof item?.text === 'string' ? item.text.trim() : '',
      ctaLabel: typeof item?.ctaLabel === 'string' ? item.ctaLabel.trim() : '',
      formCode: typeof item?.formCode === 'string' ? item.formCode.trim() : null,
      formTitle: typeof item?.formTitle === 'string' ? item.formTitle.trim() : null,
    }))
    .filter((item) => item.title.length > 0 || item.text.length > 0)
    .map((item) => ({
      ...item,
      ctaLabel: item.ctaLabel || 'Consultation',
    }));
};

const headingClasses = [
  'font-heading font-bold text-brand-dark tracking-[-0.01em]',
  'text-[32px] leading-[1]',
  'md:text-[48px] md:leading-[1]',
  '2xl:text-[64px] 2xl:leading-[1]',
  'max-w-[320px] md:max-w-[974px]',
].join(' ');

const descriptionClasses = [
  'font-heading text-brand-dark/70',
  'text-[16px] leading-[1.4]',
  'md:text-[20px]',
  'max-w-[320px] md:max-w-[894px]',
  'prose-p:my-0 prose-p:font-heading prose-p:text-[16px] prose-p:leading-[1.4] prose-p:text-brand-dark/70 md:prose-p:text-[20px]',
  'prose-strong:font-extrabold prose-strong:text-brand-dark',
].join(' ');

const cardTitleClasses = [
  'font-heading font-extrabold text-brand-dark',
  'text-[20px] leading-[1.4]',
  'md:text-[22px]',
].join(' ');

const cardTextClasses = [
  'font-heading text-brand-dark/70',
  'text-[18px] leading-[1.4]',
  'md:text-[20px]',
  'prose-p:my-0 prose-p:font-heading prose-p:text-[18px] prose-p:leading-[1.4] prose-p:text-brand-dark/70 md:prose-p:text-[20px]',
  'prose-strong:font-extrabold prose-strong:text-brand-dark',
].join(' ');

const buttonClasses = [
  'inline-flex h-[53px] w-[158px] items-center justify-center',
  'rounded-[100px] bg-brand-sky text-white',
  'font-heading text-[16px] font-bold leading-[20px]',
  'transition-transform transition-colors duration-150',
  'hover:bg-[#009fd6] hover:scale-[1.02]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-gray',
].join(' ');

const ExclusiveOffer: React.FC<ExclusiveOfferProps> = ({
  title,
  description,
  items,
  defaultFormCode,
  padding,
  backgroundClass,
  backgroundColor,
  formsByCode,
}) => {
  const normalizedItems = useMemo(() => normalizeItems(items), [items]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!title && !description && normalizedItems.length === 0) {
    return null;
  }

  const sectionBackground = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const paddingClass = resolveSectionPadding(
    padding,
    'pt-[92px] pb-[120px] md:pt-[140px] md:pb-[150px] 2xl:pt-[184px] 2xl:pb-[170px]'
  );
  const hasIntro = Boolean(title?.trim() || description?.trim());

  return (
    <section className={cn('overflow-hidden', sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-10 2xl:px-0">
        {title ? <h2 className={headingClasses}>{title}</h2> : null}

        {description ? (
          <RichText
            html={description}
            className={cn(descriptionClasses, title ? 'mt-[12px] md:mt-[15px]' : 'mt-0')}
          />
        ) : null}

        {normalizedItems.length > 0 ? (
          <div
            className={cn(
              'grid grid-cols-1 gap-y-[24px] md:grid-cols-2 md:gap-x-[20px] md:gap-y-[20px]',
              hasIntro ? 'mt-[54px] md:mt-[92px] 2xl:mt-[102px]' : 'mt-0'
            )}
          >
            {normalizedItems.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                className="flex h-full min-h-[232px] flex-col rounded-[10px] bg-brand-gray px-[22px] pb-[24px] pt-[24px] md:min-h-[262px] md:px-[30px] md:pb-[28px] md:pt-[27px]"
              >
                {item.title ? <p className={cardTitleClasses}>{item.title}</p> : null}

                {item.text ? (
                  <RichText html={item.text} className={cn(cardTextClasses, 'mt-[16px] md:mt-[19px]')} />
                ) : null}

                {item.ctaLabel ? (
                  <div className="mt-[32px] md:mt-[46px]">
                    <button
                      type="button"
                      className={buttonClasses}
                      onClick={() => setActiveIndex(idx)}
                      disabled={!item.formCode && !defaultFormCode}
                    >
                      {item.ctaLabel}
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {activeIndex !== null ? (
        <QuoteModal
          isOpen
          onClose={() => setActiveIndex(null)}
          formCode={normalizedItems[activeIndex]?.formCode ?? defaultFormCode ?? undefined}
          formTitle={normalizedItems[activeIndex]?.formTitle ?? undefined}
          formConfig={
            normalizedItems[activeIndex]?.formCode
              ? formsByCode?.[normalizedItems[activeIndex].formCode ?? ''] ?? null
              : defaultFormCode
                ? formsByCode?.[defaultFormCode] ?? null
                : null
          }
          title={
            normalizedItems[activeIndex]?.formTitle ||
            normalizedItems[activeIndex]?.title ||
            title ||
            'Consultation'
          }
          submitLabel={normalizedItems[activeIndex]?.ctaLabel}
        />
      ) : null}
    </section>
  );
};

export default ExclusiveOffer;

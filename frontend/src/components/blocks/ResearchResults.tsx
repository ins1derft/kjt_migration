'use client';

import Image from 'next/image';
import React, { useMemo } from 'react';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';
import { cn, resolveMediaUrl } from '@/lib/utils';
import RichText from '../RichText';

export type ResearchResultsItem = {
  title?: string | null;
  text?: string | null;
};

export type ResearchResultsProps = {
  title?: string | null;
  description?: string | null;
  items?: ResearchResultsItem[] | null;
  decoration?: string | null;
  decorationMobile?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const DEFAULT_DECORATION = '/images/research-results/decor-desktop.svg';
const DEFAULT_DECORATION_MOBILE = '/images/research-results/decor-mobile.svg';

const normalizeItems = (items: ResearchResultsProps['items']): Required<ResearchResultsItem>[] => {
  const raw = Array.isArray(items) ? items : [];

  return raw
    .map((item) => ({
      title: typeof item?.title === 'string' ? item.title.trim() : '',
      text: typeof item?.text === 'string' ? item.text.trim() : '',
    }))
    .filter((item) => item.title.length > 0);
};

const ResearchResults: React.FC<ResearchResultsProps> = ({
  title,
  description,
  items,
  decoration,
  decorationMobile,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const normalizedItems = useMemo(() => normalizeItems(items), [items]);

  if (!title && !description && normalizedItems.length === 0) return null;

  const paddingClass = resolveSectionPadding(
    padding,
    'pt-[82px] pb-[140px] md:pt-[169px] md:pb-[150px] 2xl:pt-[183px] 2xl:pb-[173px]'
  );
  const sectionBackground = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const hasIntro = Boolean(title?.trim() || description?.trim());

  const decorationSrc = resolveMediaUrl(decoration ?? DEFAULT_DECORATION);
  const decorationMobileSrc = resolveMediaUrl(decorationMobile ?? decoration ?? DEFAULT_DECORATION_MOBILE);

  return (
    <section className={cn('overflow-hidden', sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-10 2xl:px-0">
        {title ? (
          <h2 className="mx-auto max-w-[992px] text-center font-heading text-[38px] font-bold leading-[1] tracking-[-0.01em] text-brand-dark md:text-[64px]">
            {title}
          </h2>
        ) : null}

        {description ? (
          <RichText
            html={description}
            className={cn(
              'mx-auto max-w-[320px] text-center font-heading text-[16px] leading-[1.4] text-brand-dark/70 md:max-w-[992px] md:text-[20px] prose-p:my-0 prose-p:font-heading prose-p:text-brand-dark/70 prose-p:leading-[1.4]',
              title ? 'mt-[51px] md:mt-[15px]' : 'mt-0'
            )}
          />
        ) : null}

        {normalizedItems.length > 0 ? (
          <div className={cn('relative', hasIntro ? 'mt-[114px] md:mt-[78px]' : 'mt-0')}>
            <div className="grid grid-cols-1 gap-y-[10px] md:grid-cols-3 md:gap-x-[20px] md:gap-y-[20px]">
              {normalizedItems.map((item, idx) => (
                <div
                  key={`${item.title}-${idx}`}
                  className="min-h-[160px] rounded-[10px] bg-white px-[16px] pb-[20px] pt-[19px] shadow-[0_2px_20.6px_rgba(0,0,0,0.1)] md:min-h-[213px] md:px-[30px] md:pb-[24px] md:pt-[24px]"
                >
                  <p className="font-heading text-[24px] font-extrabold leading-[1.2] text-[#67A0FF]">{item.title}</p>
                  {item.text ? (
                    <p className="mt-[16px] font-heading text-[16px] leading-[1.4] text-brand-dark/70 md:text-[20px]">
                      {item.text}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            {decorationSrc ? (
              <div className="pointer-events-none absolute bottom-0 right-0 hidden md:block">
	                <Image
	                  src={decorationSrc}
	                  alt=""
	                  width={387}
	                  height={261}
	                  className="h-auto w-[319px] object-contain lg:w-[387px]"
	                  priority
	                  unoptimized
	                />
              </div>
            ) : null}
          </div>
        ) : null}

        {decorationMobileSrc ? (
          <div className="mt-[30px] flex justify-center md:hidden">
            <Image
              src={decorationMobileSrc}
              alt=""
              width={319}
              height={231}
              className="h-[231px] w-[319px] object-contain"
              priority
              unoptimized
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ResearchResults;

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import RichText from '../RichText';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';

export type CustomSoftwareCard = {
  text: string;
};

export type CustomSoftwareProps = {
  title?: string | null;
  description?: string | null;
  gridTitle?: string | null;
  items?: CustomSoftwareCard[] | null;
  footerText?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const CustomSoftware: React.FC<CustomSoftwareProps> = ({
  title,
  description,
  gridTitle,
  items,
  footerText,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const sectionPadding = resolveSectionPadding(
    padding,
    'pt-[100px] pb-[120px] md:pt-[120px] md:pb-[140px] xl:pt-[146px] xl:pb-[166px]'
  );
  const sectionBg = resolveSectionBackground(backgroundClass, 'bg-white');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const cards = Array.isArray(items) ? items.filter((item) => item && item.text?.trim()) : [];
  const hasFooterText = Boolean(footerText?.trim());

  if (!title && !description && !gridTitle && cards.length === 0 && !hasFooterText) {
    return null;
  }

  return (
    <section className={cn('relative', sectionPadding, sectionBg)} style={sectionStyle}>
      <div className="container mx-auto px-5 md:px-6 lg:px-8 2xl:px-0">
        <div className="mx-auto text-center max-w-[974px]">
          {title ? (
            <h2 className="font-heading font-bold text-brand-dark text-[32px] leading-none md:text-[48px] lg:text-[64px]">
              {title}
            </h2>
          ) : null}

          {description ? (
            <RichText
              html={description}
              className="mt-5 md:mt-[20px] font-sans text-brand-dark/70 text-[16px] leading-[22.4px] md:text-[18px] md:leading-[25.2px] lg:text-[20px] lg:leading-[28px]"
            />
          ) : null}
        </div>

        {gridTitle ? (
          <p className="mt-[56px] md:mt-[64px] lg:mt-[70px] text-center font-heading font-bold text-brand-dark text-[18px] leading-none md:text-[20px] lg:text-[24px]">
            {gridTitle}
          </p>
        ) : null}

        <div className="mt-[24px] lg:mt-[30px] grid grid-cols-1 gap-[16px] md:grid-cols-2 lg:grid-cols-3 xl:gap-[20px]">
          {cards.map((item, index) => (
            <div
              key={`${item.text}-${index}`}
              className="h-full min-h-[120px] md:min-h-[130px] xl:min-h-[139px] rounded-[8px] md:rounded-[9px] xl:rounded-[10px] bg-white shadow-[0px_1.65px_16.995px_rgba(0,0,0,0.1)] xl:shadow-[0px_2px_20.6px_rgba(0,0,0,0.1)]"
            >
              <p className="px-[20px] py-[22px] md:px-[24px] md:py-[24px] xl:px-[29px] xl:py-[32px] font-heading font-normal text-brand-dark/70 text-[16px] leading-[22.4px] md:text-[17px] md:leading-[23.8px] lg:text-[18px] lg:leading-[25.2px]">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {hasFooterText ? (
          <RichText
            html={footerText ?? ''}
            className="mt-[40px] md:mt-[48px] lg:mt-[56px] text-center font-heading text-brand-dark/70 text-[16px] leading-[22.4px] md:text-[18px] md:leading-[25.2px] lg:text-[20px] lg:leading-[28px]"
          />
        ) : null}
      </div>
    </section>
  );
};

export default CustomSoftware;

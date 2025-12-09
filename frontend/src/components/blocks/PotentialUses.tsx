'use client';

import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { cn, resolveMediaUrl } from '@/lib/utils';
import RichText from '../RichText';
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from '@/lib/blocks/padding';

export type PotentialUseCard = {
  image?: string | null;
  title?: string | null;
  description?: string | null;
};

export type PotentialUseTab = {
  key: string;
  label: string;
  description?: string | null;
  cards?: PotentialUseCard[] | null;
};

export type PotentialUsesProps = {
  title?: string | null;
  tabs?: PotentialUseTab[] | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const PotentialUses: React.FC<PotentialUsesProps> = ({ title, tabs, padding, backgroundClass, backgroundColor }) => {
  const tabsSafe = tabs ?? [];
  const hasTabs = tabsSafe.length > 0;
  const [activeKey, setActiveKey] = useState<string | null>(hasTabs ? tabsSafe[0].key : null);

  const resolvedActiveKey = useMemo(() => {
    if (!hasTabs) return null;
    if (activeKey && tabsSafe.some((tab) => tab.key === activeKey)) return activeKey;
    return tabsSafe[0]?.key ?? null;
  }, [activeKey, hasTabs, tabsSafe]);

  const activeTab = useMemo(() => {
    if (!resolvedActiveKey) return null;
    return tabsSafe.find((tab) => tab.key === resolvedActiveKey) ?? tabsSafe[0] ?? null;
  }, [resolvedActiveKey, tabsSafe]);

  if (!activeTab) {
    return null;
  }

  const paddingClass = resolveSectionPadding(padding, 'pt-0 pb-[96px]');
  const sectionBackground = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const activeTabClass = 'bg-white text-table-text shadow-[0px_1px_10px_rgba(0,0,0,0.05)]';
  const inactiveTabClass = 'bg-transparent text-table-text hover:text-brand-dark';

  const cards = activeTab.cards ?? [];
  const tabDescription = activeTab.description ?? null;

  const resolveImage = (src?: string | null) => {
    if (!src) return null;
    if (src.startsWith('/images/')) return src;
    return resolveMediaUrl(src);
  };

  return (
    <section className={cn('overflow-hidden', sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="bg-white w-full px-5 sm:px-6 lg:px-10 pt-[80px] pb-[104px]">
        {title ? (
          <h2 className="mx-auto max-w-[784px] text-center font-heading text-[38px] font-bold leading-[1.05] text-brand-dark md:text-[64px]">
            {title}
          </h2>
        ) : null}
      </div>
      <div className="container mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-10">
        <div className="relative -mt-[44px] flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-x-[8px] gap-y-[11px] rounded-[100px] bg-brand-gray px-[10px] py-[6px] md:px-[14px] md:py-[9px] xl:px-[22px] xl:py-[11px] max-w-full">
            {tabsSafe.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveKey(tab.key)}
                className={cn(
                  'h-[37px] rounded-[100px] px-[17px] font-heading font-extrabold text-[11px] leading-[normal] transition-colors duration-200 md:h-[65px] md:px-[28px] md:text-[20px]',
                  'whitespace-nowrap',
                  resolvedActiveKey === tab.key ? activeTabClass : inactiveTabClass
                )}
                aria-pressed={resolvedActiveKey === tab.key}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-[37px] md:mt-[50px]">
          {tabDescription ? (
            <RichText
              html={tabDescription}
              className="mx-auto mb-[28px] max-w-[920px] text-center font-sans text-[16px] leading-[1.5] text-brand-dark/80 md:text-[18px]"
            />
          ) : null}

          <div className="grid w-full grid-cols-1 items-start gap-y-[36px] md:grid-cols-2 md:gap-x-[51px] md:gap-y-[44px] xl:gap-x-[36px] mx-auto md:max-w-[1089px] xl:max-w-[1174px]">
            {cards.map((card, idx) => {
              const imageSrc = resolveImage(card.image);
              return (
                <article
                  key={`${card.title ?? card.image ?? idx}-${idx}`}
                  className="w-full"
                >
                  <div className="relative w-full overflow-hidden rounded-[10px] bg-white aspect-[2/1] md:aspect-[2/1] xl:aspect-[2.19/1]">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={card.title ?? 'Use case image'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 569px"
                        className="object-cover"
                        priority={idx === 0}
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full bg-white" />
                    )}
                  </div>

                  {card.title ? (
                    <h3 className="mt-[13px] font-heading text-[16px] font-extrabold leading-[1.2] text-[#4571ff] md:mt-[25px] md:text-[24px]">
                      {card.title}
                    </h3>
                  ) : null}

                  {card.description ? (
                    <RichText
                      html={card.description}
                      className="mt-[8px] font-sans text-[16px] font-normal leading-[1.4] text-brand-dark/70 md:mt-[12px] md:text-[20px]"
                    />
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PotentialUses;

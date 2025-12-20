import React from 'react';
import { cn } from '@/lib/utils';
import { getSensoryRoomBundles } from '@/lib/api';
import type { SectionPadding } from '@/lib/blocks/padding';
import { resolveSectionBackgroundStyle, resolveSectionPadding } from '@/lib/blocks/padding';
import SensoryRoomBundlesListClient from '@/components/blocks/SensoryRoomBundlesListClient';

export type SensoryRoomBundlesProps = {
  title?: string | null;
  description?: string | null;
  padding?: SectionPadding | null;
  backgroundColor?: string | null;
};

export default async function SensoryRoomBundles({
  title,
  description,
  padding,
  backgroundColor,
}: SensoryRoomBundlesProps) {
  const bundles = await getSensoryRoomBundles({ limit: 100, init: { cache: 'no-store' } });

  if (!title && !description && bundles.length === 0) return null;

  const paddingClass = resolveSectionPadding(
    padding,
    'pt-[82px] pb-[51px] lg:pt-[105px] lg:pb-[105px]'
  );

  return (
    <section className={cn('bg-brand-gray', paddingClass)} style={resolveSectionBackgroundStyle(backgroundColor)}>
      <div className="container mx-auto w-full px-5 lg:max-w-[1189px] lg:px-[50px] 2xl:max-w-[1320px] 2xl:px-0">
        {title ? (
          <h2 className="mx-auto max-w-[992px] font-heading text-[38px] font-bold leading-none text-brand-dark text-center 2xl:text-[64px]">
            {title}
          </h2>
        ) : null}

        {description ? (
          <p className="mx-auto mt-[16px] max-w-[934px] font-heading text-[16px] leading-[1.4] text-brand-dark/70 text-center whitespace-pre-wrap lg:mt-[20px] 2xl:text-[20px]">
            {description}
          </p>
        ) : null}

        <div className="mt-[14px] lg:mt-[71px]">
          <SensoryRoomBundlesListClient bundles={bundles} />
        </div>
      </div>
    </section>
  );
}

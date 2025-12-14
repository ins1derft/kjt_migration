import React from 'react';
import Image from 'next/image';
import { cn, resolveMediaUrl } from '@/lib/utils';
import RichText from '../RichText';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';

export type IconTitleTextProps = {
  icon?: string | null;
  iconAlt?: string | null;
  title?: string | null;
  description?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
  className?: string;
};

const IconTitleText: React.FC<IconTitleTextProps> = ({
  icon,
  iconAlt,
  title,
  description,
  padding,
  backgroundClass,
  backgroundColor,
  className,
}) => {
  const iconSrc = resolveMediaUrl(icon);

  const hasCustomPadding = Boolean(
    (typeof padding === 'string' && padding.trim()) ||
      (padding && typeof padding === 'object' && ('top' in padding || 'bottom' in padding))
  );
  const sectionPadding = resolveSectionPadding(
    padding,
    hasCustomPadding ? '' : 'pt-[70px] pb-[70px]'
  );
  const sectionBg = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  if (!title && !description && !iconSrc) return null;

  return (
    <section className={cn(sectionPadding, sectionBg, className)} style={sectionStyle}>
      <div className="container mx-auto w-full px-5 md:px-6 2xl:px-0">
        <div className="mx-auto w-full max-w-[952px] text-center">
          <div className="flex items-center justify-center gap-[9px]">
            {iconSrc ? (
              <div className="relative h-[36.227px] w-[36px] shrink-0">
                <Image src={iconSrc} alt={iconAlt ?? ''} fill className="object-contain" unoptimized />
              </div>
            ) : null}

            {title ? (
              <h3 className="font-heading text-[24px] font-extrabold leading-[1.4] text-brand-dark">
                {title}
              </h3>
            ) : null}
          </div>

          {description ? (
            <RichText
              html={description}
              className="mt-[16px] font-heading text-[16px] font-normal leading-[1.4] text-brand-dark/70 whitespace-pre-wrap prose-p:my-0 prose-p:font-heading prose-p:text-[16px] prose-p:leading-[1.4]"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default IconTitleText;

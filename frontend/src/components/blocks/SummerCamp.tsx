'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { CalendarDays, MapPin, Play, X } from 'lucide-react';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';
import { cn, resolveMediaUrl } from '@/lib/utils';
import RichText from '../RichText';

export type SummerCampFeature = {
  icon?: string | { src: string; alt?: string | null } | null;
  label?: string | null;
  value?: string | null;
};

export type SummerCampProps = {
  title?: string | null;
  description?: string | null;
  features?: SummerCampFeature[] | null;
  videoId?: string | null;
  learnMoreHref?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

type NormalizedFeature = {
  icon?: { src: string; alt?: string | null } | null;
  label: string;
  value: string;
};

const stripHtml = (value?: string | null) => (value ? value.replace(/<[^>]+>/g, '').trim() : '');

const normalizeIcon = (icon?: string | { src: string; alt?: string | null } | null) => {
  if (!icon) return undefined;
  if (typeof icon === 'string') return { src: icon, alt: null };
  if (typeof icon === 'object' && icon.src) return { src: icon.src, alt: icon.alt ?? null };
  return undefined;
};

const normalizeFeatures = (features?: SummerCampFeature[] | null): NormalizedFeature[] =>
  Array.isArray(features)
    ? features
        .map((item) => ({
          label: stripHtml(item?.label),
          value: stripHtml(item?.value),
          icon: normalizeIcon(item?.icon),
        }))
        .filter((item) => item.label || item.value)
    : [];

const resolveVideoEmbed = (videoId?: string | null) =>
  videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1` : null;

const headingClasses = [
  'font-heading font-bold text-brand-dark tracking-[-0.01em]',
  'text-[32px] leading-[1]',
  'md:text-[48px]',
  '2xl:text-[64px]',
].join(' ');

const descriptionClasses = [
  'font-heading text-brand-dark/70',
  'text-[16px] leading-[1.4] md:text-[20px]',
  'max-w-[320px] md:max-w-[720px] 2xl:max-w-[833px]',
  'prose-p:my-0 prose-p:font-heading prose-p:text-[16px] prose-p:leading-[1.4] prose-p:text-brand-dark/70 md:prose-p:text-[20px]',
  'prose-strong:font-extrabold prose-strong:text-brand-dark',
].join(' ');

const FeatureRow: React.FC<{ feature: NormalizedFeature }> = ({ feature }) => {
  const iconSrc = feature.icon?.src ? resolveMediaUrl(feature.icon.src) : null;
  const lower = feature.label.toLowerCase();
  const fallback =
    lower.includes('date') || lower.includes('august') || lower.includes('june') ? (
      <CalendarDays className="h-[24px] w-[24px] text-brand-sky" />
    ) : (
      <MapPin className="h-[24px] w-[24px] text-brand-sky" />
    );

  return (
    <div className="flex items-start gap-[12px]">
      <div className="flex h-[24px] w-[24px] items-center justify-center">
        {iconSrc ? (
          <Image
            src={iconSrc}
            alt={feature.icon?.alt ?? ''}
            width={24}
            height={24}
            className="h-[24px] w-[24px] object-contain"
            unoptimized
          />
        ) : (
          fallback
        )}
      </div>
      <p className="font-heading text-[16px] leading-[1.4] text-brand-dark md:text-[20px]">
        <span className="font-normal">
          {feature.label}
          {feature.value ? ': ' : ''}
        </span>
        <span className="font-extrabold">{feature.value}</span>
      </p>
    </div>
  );
};

const SummerCamp: React.FC<SummerCampProps> = ({
  title,
  description,
  features,
  videoId,
  learnMoreHref,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const normalizedFeatures = useMemo(() => normalizeFeatures(features), [features]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  if (!title && !description && normalizedFeatures.length === 0 && !videoId && !videoCover) {
    return null;
  }

  const sectionBackground = resolveSectionBackground(backgroundClass, 'bg-white');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const paddingClass = resolveSectionPadding(
    padding,
    'pt-[96px] pb-[120px] md:pt-[120px] md:pb-[140px] 2xl:pt-[150px] 2xl:pb-[150px]',
  );

  const videoEmbedUrl = resolveVideoEmbed(videoId);
  const posterSrc = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  const learnLabel = 'Learn More';

  return (
    <section className={cn('overflow-hidden', sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-10 2xl:px-0">
        <div className="mx-auto w-full max-w-[1320px]">
          {title ? <h2 className={headingClasses}>{title}</h2> : null}

          {normalizedFeatures.length > 0 ? (
            <div className="mt-[40px] md:mt-[41px] 2xl:mt-[41px] flex flex-col gap-[10px]">
              {normalizedFeatures.map((feature) => (
                <FeatureRow key={`${feature.label}-${feature.value}`} feature={feature} />
              ))}
            </div>
          ) : null}

          {description ? (
            <RichText
              html={description}
              className={cn(descriptionClasses, normalizedFeatures.length > 0 ? 'mt-[26px]' : 'mt-[22px]')}
            />
          ) : null}

          {videoEmbedUrl && (
            <div className="relative mt-[78px] md:mt-[78px] 2xl:mt-[78px]">
              <div className="relative w-full overflow-hidden rounded-[12px] md:rounded-[14px] 2xl:rounded-[17px] bg-brand-gray">
                <div className="aspect-[2.18] w-full min-h-[240px] md:min-h-[360px] 2xl:min-h-[604px]">
                  {posterSrc ? (
                    <Image
                      src={posterSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1536px) 90vw, 1320px"
                      priority
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full bg-brand-gray" />
                  )}
                </div>

                <div className="pointer-events-none absolute inset-0">
                  <div className="pointer-events-auto absolute left-1/2 bottom-[22px] flex w-full -translate-x-1/2 flex-col items-center gap-3 px-6 md:left-[44px] md:bottom-[42px] md:w-auto md:translate-x-0 md:flex-row md:items-center md:gap-6 md:px-0">
                    {learnMoreHref ? (
                      <a
                        href={learnMoreHref}
                        className="order-1 text-center font-heading font-bold text-[16px] leading-[1.1] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 md:order-2"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {learnLabel}
                      </a>
                    ) : null}
                    <button
                      type="button"
                      aria-label="Play"
                      onClick={() => setIsModalOpen(true)}
                      className="order-2 inline-flex h-[50px] min-w-[149px] items-center justify-between rounded-full bg-white px-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:order-1"
                    >
                      <span className="font-heading text-[16px] font-extrabold leading-none text-brand-dark">Play</span>
                      <span className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-brand-dark text-white">
                        <Play size={14} fill="white" className="ml-[1px]" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && videoEmbedUrl ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <button
            aria-label="Close video"
            onClick={() => setIsModalOpen(false)}
            className="absolute right-6 top-6 z-10 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <X size={32} />
          </button>

          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl">
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={videoEmbedUrl}
                title={title ?? 'Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default SummerCamp;

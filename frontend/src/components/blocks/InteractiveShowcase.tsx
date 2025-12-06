'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import QuoteModal from './QuoteModal';
import { cn, resolveMediaUrl } from '@/lib/utils';
import { resolveSectionPadding, type SectionPadding } from '@/lib/blocks/padding';
import type { FormConfig } from '@/lib/api';

export type ShowcaseFeature = {
  icon?: string | null;
  label: string;
};

export type ShowcaseItem = {
  title: string;
  description: string;
  hashtag?: string | null;
  features?: ShowcaseFeature[];
  ctaLabel?: string;
  ctaHref?: string | null;
  formCode?: string | null;
  gallery?: { src: string; alt?: string | null }[];
  videoId?: string | null;
  videoPoster?: string | null;
  videoAlt?: string | null;
};

export type InteractiveShowcaseProps = {
  items: ShowcaseItem[];
  padding?: SectionPadding | null;
  defaultFormCode?: string | null;
  formConfig?: FormConfig | null;
};

const normalizeMedia = (src?: string | null) => {
  if (!src) return null;
  if (src.startsWith('/')) return src;
  return resolveMediaUrl(src);
};

const FeatureCard = ({ feature }: { feature: ShowcaseFeature }) => {
  const iconSrc = normalizeMedia(feature.icon);

  return (
    <div className="flex h-[100px] w-full flex-col justify-center rounded-[10px] bg-brand-gray px-4 py-3 shadow-[0_2px_20.6px_rgba(0,0,0,0.02)] lg:h-[100px] xl:h-[121px]">
      {iconSrc && (
        <div className="mb-3 h-[33px] w-[33px]">
          <img src={iconSrc} alt="" className="h-full w-full object-contain" loading="lazy" />
        </div>
      )}
      <p className="text-[14.5px] font-normal leading-[1.2] text-brand-dark lg:text-[18px]">{feature.label}</p>
    </div>
  );
};

const InteractiveShowcase: React.FC<InteractiveShowcaseProps> = ({
  items,
  padding,
  defaultFormCode,
  formConfig,
}) => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [activeGallery, setActiveGallery] = useState<{ item: number; index: number } | null>(null);
  const [quoteState, setQuoteState] = useState<{ item: ShowcaseItem; formCode: string } | null>(null);

  useEffect(() => {
    const shouldLock = activeVideo !== null || activeGallery !== null;
    if (shouldLock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeVideo, activeGallery]);

  if (!items || items.length === 0) return null;

  const paddingClass = resolveSectionPadding(padding, 'pt-[72px] pb-[88px] md:pt-[84px] md:pb-[92px] lg:pt-[96px] lg:pb-[108px]');
  const containerClass = 'mx-auto w-full max-w-[360px] sm:max-w-[640px] lg:max-w-[1088px] 2xl:max-w-[1320px] px-5 sm:px-6 lg:px-4 2xl:px-0';

  const handleCta = (item: ShowcaseItem) => {
    const formCode = item.formCode ?? defaultFormCode ?? null;

    if (formCode) {
      setQuoteState({ item, formCode });
      return;
    }

    if (item.ctaHref) {
      window.location.assign(item.ctaHref);
    }
  };

  const renderDivider = (idx: number) => {
    if (idx === items.length - 1) return null;
    return <div className="hidden h-px w-full bg-[#e6e6ec] lg:block" />;
  };

  const renderMedia = (item: ShowcaseItem, idx: number) => {
    const poster = normalizeMedia(item.videoPoster ?? item.gallery?.[0]?.src ?? '/images/interactive-header/hero-desktop.jpg');
    const baseHeight = idx === 0 ? 'lg:h-[399px] 2xl:h-[484px]' : 'lg:h-[418px] 2xl:h-[507px]';

    return (
      <div
        className={cn(
          'relative h-[238px] w-full overflow-hidden rounded-[10px] bg-black/5 sm:h-[280px]',
          baseHeight,
        )}
      >
        {poster && (
          <img
            src={poster}
            alt={item.videoAlt ?? item.title}
            className="size-full object-cover"
            loading="lazy"
          />
        )}

        {item.videoId && (
          <button
            type="button"
            aria-label={`Play ${item.title}`}
            className="absolute inset-0 flex items-center justify-center"
            onClick={() => setActiveVideo(idx)}
          >
            <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full border border-white/30 bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:scale-105">
              <Play className="h-7 w-7" />
            </span>
          </button>
        )}
      </div>
    );
  };

  const renderItem = (item: ShowcaseItem, idx: number) => {
    const isReversed = idx % 2 === 1;
    const cardHeightLg = idx === 0 ? 'lg:min-h-[399px]' : 'lg:min-h-[418px]';
    const cardHeight2xl = idx === 0 ? '2xl:min-h-[484px]' : '2xl:min-h-[507px]';

    return (
      <div
        key={`${item.title}-${idx}`}
        className={cn(
          'grid items-start gap-6 sm:gap-7 lg:grid-cols-2 lg:gap-6 2xl:gap-8',
          isReversed && 'lg:[&>div:first-child]:order-2 lg:[&>div:last-child]:order-1',
        )}
      >
        <div
          className={cn(
            'flex flex-col rounded-[10px] bg-white px-5 py-6 shadow-[0_2px_20.6px_rgba(0,0,0,0.05)] sm:px-6 sm:py-7 lg:px-7 lg:py-8 2xl:px-8 2xl:py-9',
            cardHeightLg,
            cardHeight2xl,
          )}
        >
          <h3 className="font-heading text-[24px] font-bold leading-[1.1] text-brand-sky sm:text-[28px] lg:text-[34px]">
            {item.title}
          </h3>

          <p className="mt-3 text-[14px] font-normal leading-[1.6] text-brand-dark/70 sm:text-[15px] lg:text-[16px]">
            {item.description}
          </p>

          {item.hashtag && (
            <p className="mt-4 bg-brand-gradient bg-clip-text text-[13px] font-normal leading-none text-transparent lg:text-[16px]">
              {item.hashtag}
            </p>
          )}

          {item.features && item.features.length > 0 && (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              {item.features.map((feature, featureIdx) => (
                <FeatureCard feature={feature} key={`${feature.label}-${featureIdx}`} />
              ))}
            </div>
          )}

          <div className="mt-auto flex items-center gap-3 pt-6 lg:gap-4">
            <button
              type="button"
              onClick={() => handleCta(item)}
              className="inline-flex h-[41px] min-w-[230px] items-center justify-center rounded-full bg-gradient-cta px-6 text-[13px] font-heading font-bold text-white shadow-cta transition hover:-translate-y-[1px] hover:shadow-lg active:translate-y-0 lg:min-w-[250px] xl:min-w-[260px] 2xl:min-w-[281px] lg:text-[16px]"
            >
              {item.ctaLabel ?? 'Order now'}
            </button>

            {item.gallery && item.gallery.length > 0 && (
              <button
                type="button"
                aria-label="Open gallery"
                onClick={() => setActiveGallery({ item: idx, index: 0 })}
                className="flex h-[41px] w-[41px] items-center justify-center rounded-full bg-brand-dark text-white transition hover:scale-105"
              >
                <img
                  src={normalizeMedia('/icons/interactive-header/photo_library.svg') ?? undefined}
                  alt="Gallery"
                  className="h-[18px] w-[18px]"
                  loading="lazy"
                />
              </button>
            )}
          </div>
        </div>

        {renderMedia(item, idx)}
      </div>
    );
  };

  const renderVideoModal = () => {
    if (activeVideo === null) return null;
    const target = items[activeVideo];
    if (!target?.videoId) return null;

    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <button
          aria-label="Close video"
          onClick={() => setActiveVideo(null)}
          className="absolute right-6 top-6 z-10 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <X size={36} />
        </button>

        <div className="absolute inset-0" onClick={() => setActiveVideo(null)} />

        <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl">
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube-nocookie.com/embed/${target.videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1`}
              title={target.videoAlt ?? target.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderGalleryModal = () => {
    if (!activeGallery) return null;
    const gallery = items[activeGallery.item]?.gallery ?? [];
    if (gallery.length === 0) return null;

    const current = gallery[activeGallery.index];
    const resolvedSrc = normalizeMedia(current?.src);

    const go = (dir: number) => {
      const total = gallery.length;
      const nextIndex = (activeGallery.index + dir + total) % total;
      setActiveGallery({ item: activeGallery.item, index: nextIndex });
    };

    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <button
          aria-label="Close gallery"
          onClick={() => setActiveGallery(null)}
          className="absolute right-6 top-6 z-20 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <X size={32} />
        </button>

        <div className="absolute inset-0" onClick={() => setActiveGallery(null)} />

        <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-black/30 shadow-2xl">
          <div className="relative aspect-video w-full bg-black">
            {resolvedSrc && (
              <img src={resolvedSrc} alt={current?.alt ?? ''} className="size-full object-contain" />
            )}

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => go(-1)}
                  className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-dark shadow-lg transition hover:scale-105"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => go(1)}
                  className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-dark shadow-lg transition hover:scale-105"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={cn('bg-brand-gray', paddingClass)}>
      <div className={cn(containerClass, 'space-y-12 lg:space-y-[80px] 2xl:space-y-[100px]')}>
        {items.map((item, idx) => (
          <React.Fragment key={`${item.title}-${idx}`}>
            {renderItem(item, idx)}
            {renderDivider(idx)}
          </React.Fragment>
        ))}
      </div>

      {renderVideoModal()}
      {renderGalleryModal()}

      {quoteState && (
        <QuoteModal
          isOpen={Boolean(quoteState)}
          onClose={() => setQuoteState(null)}
          title={quoteState.item.ctaLabel ?? 'Get a Quote'}
          submitLabel="Submit"
          formCode={quoteState.formCode}
          formTitle={quoteState.item.ctaLabel ?? undefined}
          formConfig={formConfig ?? null}
        />
      )}
    </section>
  );
};

export default InteractiveShowcase;

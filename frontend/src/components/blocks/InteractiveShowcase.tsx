'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import QuoteModal from './QuoteModal';
import { cn, resolveMediaUrl } from '@/lib/utils';
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from '@/lib/blocks/padding';
import type { FormConfig } from '@/lib/api';
import RichText from '../RichText';
import ClickSpark from '@/components/bits/ClickSpark';

export type ShowcaseFeature = {
  icons?: (string | { src?: string | null } | null)[];
  label: string;
};

export type ShowcaseItem = {
  title: string;
  description: string;
  formDescription?: string | null;
  productPageSlug?: string | null;
  hashtag?: string | null;
  features?: ShowcaseFeature[];
  ctaLabel?: string;
  formCode?: string | null;
  formTopic?: string | null;
  gallery?: { src: string; alt?: string | null }[];
  videoId?: string | null;
};

export type InteractiveShowcaseProps = {
  title?: string | null;
  items: ShowcaseItem[];
  padding?: SectionPadding | null;
  defaultFormCode?: string | null;
  formConfig?: FormConfig | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const normalizeMedia = (src?: string | null) => {
  if (!src) return null;
  if (src.startsWith('/')) return src;
  return resolveMediaUrl(src);
};

const resolveFeatureIcons = (feature: ShowcaseFeature): string[] => {
  const iconsRaw = Array.isArray(feature.icons) ? feature.icons : feature.icons ? [feature.icons] : [];
  const normalized = iconsRaw
    .map((value) => {
      if (typeof value === 'string') return normalizeMedia(value);
      if (value && typeof value === 'object' && 'src' in value) {
        const srcValue = (value as { src?: string | null }).src;
        return normalizeMedia(srcValue ?? null);
      }
      return null;
    })
    .filter((src): src is string => Boolean(src));

  return Array.from(new Set(normalized));
};

const FeatureCard = ({ feature }: { feature: ShowcaseFeature }) => {
  const icons = resolveFeatureIcons(feature);

  return (
    <div className="flex w-full flex-col gap-[6px] rounded-[10px] bg-brand-gray px-[18px] py-[14px] shadow-[0_2px_20.6px_rgba(0,0,0,0.02)] min-h-[100px] sm:min-h-[104px] lg:min-h-[121px] sm:px-[20px] sm:py-[16px] lg:px-[20px] lg:py-[16px]">
      {icons.length > 0 && (
        <div className="mb-[8px] flex min-h-[33px] flex-wrap items-center gap-2 sm:mb-[10px] sm:gap-[10px]">
          {icons.map((iconSrc, idx) => (
            <div key={`${feature.label}-icon-${idx}`} className="relative h-[40px] w-[40px] shrink-0">
              <Image src={iconSrc} alt="" fill className="object-contain" unoptimized />
            </div>
          ))}
        </div>
      )}
      <p className="text-[14px] font-normal leading-[1.25] text-brand-dark sm:text-[15px] lg:text-[18px]">
        {feature.label}
      </p>
    </div>
  );
};

const InteractiveShowcase: React.FC<InteractiveShowcaseProps> = ({
  title,
  items,
  padding,
  defaultFormCode,
  formConfig,
  backgroundClass,
  backgroundColor,
}) => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [activeGallery, setActiveGallery] = useState<{ item: number; index: number } | null>(null);
  const [quoteState, setQuoteState] = useState<{ item: ShowcaseItem; formCode: string; topic?: string | null } | null>(null);

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

  const hasCustomPadding = Boolean(
    (typeof padding === 'string' && padding.trim()) ||
      (padding && typeof padding === 'object' && ('top' in padding || 'bottom' in padding))
  );
  const defaultPadding = 'pt-[72px] pb-[88px] md:pt-[84px] md:pb-[92px] lg:pt-[96px] lg:pb-[108px]';
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? '' : defaultPadding);
  const containerClass = 'container mx-auto w-full px-5 md:px-6 2xl:px-0';
  const sectionBackground = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const resolveVideoPoster = (item: ShowcaseItem) => {
    if (item.videoId) {
      return `https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg`;
    }
    return normalizeMedia(item.gallery?.[0]?.src ?? null);
  };

  const handleCta = (item: ShowcaseItem) => {
    const formCode = item.formCode ?? defaultFormCode ?? null;
    if (!formCode) return;
    const topic = item.formTopic ?? item.title;
    setQuoteState({ item, formCode, topic });
  };

  const renderDivider = (idx: number) => {
    if (idx === items.length - 1) return null;
    return <div className="h-px w-full bg-[#e6e6ec]" />;
  };

const renderMedia = (item: ShowcaseItem, idx: number) => {
  const poster = resolveVideoPoster(item);

  return (
    <div className="relative w-full overflow-hidden rounded-[10px] bg-black/5 aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-full">
        {poster && (
          <Image src={poster} alt={item.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" unoptimized />
        )}

        {item.videoId && (
          <button
            type="button"
            aria-label={`Play ${item.title}`}
              className="absolute inset-0 flex items-center justify-center"
              onClick={() => setActiveVideo(idx)}
            >
            <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:scale-105">
              <Play className="h-7 w-7" />
            </span>
          </button>
        )}
      </div>
    );
  };

  const renderItem = (item: ShowcaseItem, idx: number) => {
    const isReversed = idx % 2 === 1;
    const ctaLabel = (item.ctaLabel ?? 'Order now').trim();
    const hasFormCta = Boolean(item.formCode ?? defaultFormCode);
    const productHref = item.productPageSlug ? `/${item.productPageSlug}` : null;
    const showCta = Boolean(ctaLabel) && (hasFormCta || Boolean(productHref));

    return (
      <div
        key={`${item.title}-${idx}`}
        className={cn(
          'grid items-stretch gap-6 sm:gap-[17px] sm:min-h-[418px] lg:grid-cols-2 lg:gap-[20px] lg:min-h-[507px]',
          isReversed && 'lg:[&>div:first-child]:order-2 lg:[&>div:last-child]:order-1',
        )}
      >
        <div
          className="flex h-full flex-col rounded-[10px] bg-white px-[18px] py-[22px] shadow-[0_2px_20.6px_rgba(0,0,0,0.05)] sm:px-[24px] sm:py-[26px] lg:px-[30px] lg:pt-[40px] lg:pb-[27px]"
        >
          <h3 className="font-heading text-[22px] font-bold leading-[1.1] text-brand-sky sm:text-[28px] lg:text-[34px]">
            {item.productPageSlug ? (
              <Link
                href={`/${item.productPageSlug}`}
                className="underline-offset-2 hover:underline"
                prefetch={false}
              >
                {item.title}
              </Link>
            ) : (
              item.title
            )}
          </h3>

          {item.description && (
            <RichText
              html={item.description}
              className="mt-[16px] text-[14px] font-normal leading-[1.6] text-brand-dark/70 sm:text-[15px] lg:text-[16px] lg:mt-[15px]"
            />
          )}

          {item.hashtag && (
            <p className="mt-[22px] bg-brand-gradient bg-clip-text text-[13px] font-normal leading-none text-transparent sm:mt-[8px] sm:text-[14px] lg:mt-[6px] lg:text-[16px]">
              {item.hashtag}
            </p>
          )}

          {item.features && item.features.length > 0 && (
            <div className="mt-[34px] grid grid-cols-1 gap-[6px] sm:mt-[25px] sm:grid-cols-2 sm:gap-[10px] lg:mt-[30px] lg:grid-cols-3 lg:gap-[10px]">
              {item.features.map((feature, featureIdx) => (
                <FeatureCard feature={feature} key={`${feature.label}-${featureIdx}`} />
              ))}
            </div>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-[10px] pt-[24px] sm:flex-nowrap sm:pt-[12px] sm:gap-[10px] lg:pt-[14px] lg:gap-[10px]">
            {showCta && hasFormCta ? (
              <ClickSpark sparkColor="#FFE4F0" sparkRadius={16} sparkCount={9} duration={220} easing="linear" className="inline-block">
                <button
                  type="button"
                  onClick={() => handleCta(item)}
                  className="inline-flex h-[34px] max-w-full items-center justify-center rounded-full bg-gradient-cta px-[18px] text-[13px] font-heading font-bold text-white shadow-cta transition-transform duration-150 hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 sm:h-[34px] lg:h-[41px] lg:text-[16px]"
                >
                  {ctaLabel}
                </button>
              </ClickSpark>
            ) : showCta && productHref ? (
              <ClickSpark sparkColor="#FFE4F0" sparkRadius={16} sparkCount={9} duration={220} easing="linear" className="inline-block">
                <Link
                  href={productHref}
                  prefetch={false}
                  className="inline-flex h-[34px] max-w-full items-center justify-center rounded-full bg-gradient-cta px-[18px] text-[13px] font-heading font-bold text-white shadow-cta transition-transform duration-150 hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 sm:h-[34px] lg:h-[41px] lg:text-[16px]"
                >
                  {ctaLabel}
                </Link>
              </ClickSpark>
            ) : null}

            {item.gallery && item.gallery.length > 0 && (
              <button
                type="button"
                aria-label="Open gallery"
                onClick={() => setActiveGallery({ item: idx, index: 0 })}
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-brand-dark text-white transition hover:scale-105 sm:h-[34px] sm:w-[34px] lg:h-[41px] lg:w-[41px]"
              >
                <Image
                  src={normalizeMedia('/icons/interactive-header/photo_library.svg') ?? '/icons/interactive-header/photo_library.svg'}
                  alt="Gallery"
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px]"
                  unoptimized
                />
              </button>
            )}
          </div>
        </div>

        <div className="h-full">
          {renderMedia(item, idx)}
        </div>
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
              title={target.title}
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
              <Image src={resolvedSrc} alt={current?.alt ?? ''} fill className="object-contain" sizes="100vw" unoptimized />
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
    <section className={cn(sectionBackground, paddingClass)} style={sectionStyle}>
      <div
        className={cn(
          containerClass,
          'space-y-[18px] sm:space-y-[22px] lg:space-y-[26px] 2xl:space-y-[28px]'
        )}
      >
        {title ? (
          <h2 className="mx-auto max-w-[960px] text-center font-heading text-[38px] font-bold leading-[1.05] text-brand-dark sm:text-[44px] lg:text-[54px]">
            {title}
          </h2>
        ) : null}

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
          title={quoteState.item.title}
          submitLabel="Submit"
          formCode={quoteState.formCode}
          formTitle={quoteState.item.title}
          formConfig={formConfig ?? null}
          topic={quoteState.topic ?? quoteState.item.title}
          description={quoteState.item.formDescription ?? null}
        />
      )}
    </section>
  );
};

export default InteractiveShowcase;

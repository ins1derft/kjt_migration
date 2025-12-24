'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import QuoteModal from './QuoteModal';
import RichText from '../RichText';
import { cn, resolveMediaUrl } from '@/lib/utils';
import { withYouTubeOrigin } from '@/lib/youtube';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';

export type InteractiveEquipmentTab = {
  label: string;
  icon?: string | null;
  content?: string | null;
};

export type InteractiveEquipmentCta = {
  label: string;
  formCode?: string | null;
  formTitle?: string | null;
};

export type InteractiveEquipmentReview = {
  name: string;
  meta?: string | null;
  text?: string | null;
  videoId?: string | null;
};

export type InteractiveEquipmentItem = {
  title: string;
  description?: string | null;
  body?: string | null;
  tabs?: InteractiveEquipmentTab[] | null;
  videoId?: string | null;
  videoCaption?: string | null;
  primaryCta?: InteractiveEquipmentCta | null;
  primaryCtaLabel?: string | null;
  primaryCtaFormCode?: string | null;
  primaryCtaFormTitle?: string | null;
  secondaryCta?: InteractiveEquipmentCta | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaFormCode?: string | null;
  secondaryCtaFormTitle?: string | null;
  specialistsTitle?: string | null;
  specialistsLeft?: ({ text?: string | null } | string | null)[] | null;
  specialistsRight?: ({ text?: string | null } | string | null)[] | null;
  reviewsTitle?: string | null;
  reviews?: InteractiveEquipmentReview[] | null;
};

export type InteractiveEquipmentProps = {
  title?: string | null;
  description?: string | null;
  items: InteractiveEquipmentItem[];
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const normalizeList = (value: InteractiveEquipmentItem['specialistsLeft']): string[] => {
  const raw = Array.isArray(value) ? value : [];
  const normalized = raw
    .map((entry) => {
      if (typeof entry === 'string') return entry.trim();
      if (entry && typeof entry === 'object' && 'text' in entry) return String(entry.text ?? '').trim();
      return '';
    })
    .filter((entry) => entry.length > 0);

  return normalized;
};

const normalizeTabs = (tabs: InteractiveEquipmentItem['tabs']): InteractiveEquipmentTab[] => {
  const raw = Array.isArray(tabs) ? tabs : [];
  return raw
    .map((tab) => ({
      label: typeof tab?.label === 'string' ? tab.label : '',
      icon: typeof tab?.icon === 'string' ? tab.icon : null,
      content: typeof tab?.content === 'string' ? tab.content : null,
    }))
    .filter((tab) => tab.label.trim().length > 0);
};

const normalizeCta = (cta: unknown): InteractiveEquipmentCta | null => {
  if (!cta || typeof cta !== 'object') return null;
  const candidate = cta as { label?: unknown; formCode?: unknown; formTitle?: unknown };
  const label = typeof candidate.label === 'string' ? candidate.label : '';
  const formCode = typeof candidate.formCode === 'string' ? candidate.formCode : null;
  const formTitle = typeof candidate.formTitle === 'string' ? candidate.formTitle : null;

  if (!label.trim()) return null;
  return { label, formCode, formTitle };
};

const resolveYouTubePoster = (videoId?: string | null) => {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const InteractiveEquipment: React.FC<InteractiveEquipmentProps> = ({
  title,
  description,
  items,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const normalizedItems = useMemo(() => {
    const raw = Array.isArray(items) ? items : [];
    return raw
      .map((item) => ({
        title: typeof item?.title === 'string' ? item.title : '',
        description: typeof item?.description === 'string' ? item.description : null,
        body: typeof item?.body === 'string' ? item.body : null,
        tabs: normalizeTabs(item?.tabs ?? null),
        videoId: typeof item?.videoId === 'string' ? item.videoId : null,
        videoCaption: typeof item?.videoCaption === 'string' ? item.videoCaption : null,
        primaryCta:
          normalizeCta(item?.primaryCta ?? null) ??
          normalizeCta({
            label: item?.primaryCtaLabel,
            formCode: item?.primaryCtaFormCode,
            formTitle: item?.primaryCtaFormTitle,
          }),
        secondaryCta:
          normalizeCta(item?.secondaryCta ?? null) ??
          normalizeCta({
            label: item?.secondaryCtaLabel,
            formCode: item?.secondaryCtaFormCode,
            formTitle: item?.secondaryCtaFormTitle,
          }),
        specialistsTitle: typeof item?.specialistsTitle === 'string' ? item.specialistsTitle : null,
        specialistsLeft: normalizeList(item?.specialistsLeft ?? null),
        specialistsRight: normalizeList(item?.specialistsRight ?? null),
        reviewsTitle: typeof item?.reviewsTitle === 'string' ? item.reviewsTitle : null,
        reviews: (Array.isArray(item?.reviews) ? item.reviews : [])
          .map((review) => ({
            name: typeof review?.name === 'string' ? review.name : '',
            meta: typeof review?.meta === 'string' ? review.meta : null,
            text: typeof review?.text === 'string' ? review.text : null,
            videoId: typeof review?.videoId === 'string' ? review.videoId : null,
          }))
          .filter((review) => review.name.trim().length > 0),
      }))
      .filter((item) => item.title.trim().length > 0);
  }, [items]);

  const [tabState, setTabState] = useState<Record<number, number>>({});
  const [reviewState, setReviewState] = useState<Record<number, number>>({});
  const [reviewTrackHeights, setReviewTrackHeights] = useState<Record<number, number>>({});
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [quoteState, setQuoteState] = useState<{ formCode: string; formTitle?: string | null; topic?: string | null } | null>(null);
  const reviewTrackRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const shouldLock = Boolean(activeVideoId) || Boolean(quoteState);
    document.body.style.overflow = shouldLock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeVideoId, quoteState]);

  const scheduleReviewTrackHeightUpdate = (itemIdx: number, slideIdx: number) => {
    requestAnimationFrame(() => {
      const track = reviewTrackRefs.current[itemIdx];
      if (!track) return;

      const slide = track.children.item(slideIdx) as HTMLElement | null;
      const inner = slide?.firstElementChild as HTMLElement | null;
      if (!inner) return;

      const nextHeight = Math.ceil(inner.getBoundingClientRect().height);
      if (!Number.isFinite(nextHeight) || nextHeight <= 0) return;

      setReviewTrackHeights((prev) => (prev[itemIdx] === nextHeight ? prev : { ...prev, [itemIdx]: nextHeight }));
    });
  };

  useEffect(() => {
    normalizedItems.forEach((item, itemIdx) => {
      if (item.reviews.length === 0) return;
      const activeIdx = Math.min(reviewState[itemIdx] ?? 0, Math.max(0, item.reviews.length - 1));
      scheduleReviewTrackHeightUpdate(itemIdx, activeIdx);
    });
  }, [normalizedItems, reviewState]);

  if (normalizedItems.length === 0) return null;

  const hasCustomPadding = Boolean(
    (typeof padding === 'string' && padding.trim()) ||
      (padding && typeof padding === 'object' && ('top' in padding || 'bottom' in padding))
  );
  const defaultPadding = 'pt-[96px] pb-[108px]';
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? '' : defaultPadding);
  const sectionBackground = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const openForm = (cta: InteractiveEquipmentCta | null, topic: string) => {
    if (!cta?.formCode) return;
    setQuoteState({ formCode: cta.formCode, formTitle: cta.formTitle ?? null, topic });
  };

  const scrollToReview = (itemIdx: number, targetIdx: number, total: number) => {
    const clampedIdx = Math.max(0, Math.min(total - 1, targetIdx));
    const track = reviewTrackRefs.current[itemIdx];

    if (track) {
      const slideWidth = track.clientWidth || 1;
      track.scrollTo({ left: clampedIdx * slideWidth, behavior: 'smooth' });
    }

    scheduleReviewTrackHeightUpdate(itemIdx, clampedIdx);
    setReviewState((prev) => ({ ...prev, [itemIdx]: clampedIdx }));
  };

  const handleReviewScroll = (itemIdx: number, total: number) => (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const slideWidth = target.clientWidth || 1;
    const nextIdx = Math.min(total - 1, Math.round(target.scrollLeft / slideWidth));

    scheduleReviewTrackHeightUpdate(itemIdx, nextIdx);
    setReviewState((prev) => (prev[itemIdx] === nextIdx ? prev : { ...prev, [itemIdx]: nextIdx }));
  };

  const renderVideoModal = () => {
    if (!activeVideoId) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close video"
          onClick={() => setActiveVideoId(null)}
          className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-10"
        >
          <X size={40} />
        </button>

        {/* Click backdrop to close */}
        <div className="absolute inset-0 z-0" onClick={() => setActiveVideoId(null)} />

        {/* Video Container */}
        <div className="w-full max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black relative z-10">
          <iframe
            className="w-full h-full"
            src={withYouTubeOrigin(
              `https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`,
            )}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    );
  };

  return (
    <section className={cn(paddingClass, sectionBackground)} style={sectionStyle}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-10 2xl:max-w-[1320px] 2xl:px-0">
        {(title || description) && (
          <div className="mx-auto max-w-[992px] text-center">
            {title && (
              <h2 className="mx-auto w-full max-w-[992px] font-heading font-bold text-[38px] md:text-[64px] leading-none text-brand-dark mb-[45px]">
                {title}
              </h2>
            )}
            {description && (
              <RichText
                html={description}
                className="font-heading text-[16px] leading-[1.6] text-brand-dark/70 prose-p:my-0 prose-p:font-heading prose-p:text-brand-dark/70 prose-p:leading-[1.6]"
              />
            )}
          </div>
        )}

        <div className="divide-y divide-table-border">
          {normalizedItems.map((item, itemIdx) => {
            const tabs = item.tabs;
            const activeTab = Math.min(tabState[itemIdx] ?? 0, Math.max(0, tabs.length - 1));
            const activeReview = Math.min(reviewState[itemIdx] ?? 0, Math.max(0, item.reviews.length - 1));

            const specialistsLeft = item.specialistsLeft;
            const specialistsRight = item.specialistsRight;

            const primaryCta = item.primaryCta;
            const secondaryCta = item.secondaryCta;

            const videoPoster = resolveYouTubePoster(item.videoId);
          return (
              <div
                key={`${item.title}-${itemIdx}`}
                className={cn('py-[56px]', itemIdx === 0 && 'pt-0', itemIdx === normalizedItems.length - 1 && 'pb-0')}
              >
                <div className="flex flex-col gap-[20px] md:flex-row">
                  {/* Left card */}
                  <div className="flex-1 rounded-[16px] bg-white shadow-[0_2px_20.6px_rgba(0,0,0,0.05)] px-[24px] py-[32px] md:flex-[0_1_526px] md:px-[32px] md:py-[56px]">
                    <h3 className="font-heading font-bold text-[28px] lg:text-[34px] leading-[normal] text-brand-sky">
                      {item.title}
                    </h3>

                    {item.description && (
                      <RichText
                        html={item.description}
                        className="mt-[15px] font-heading text-[16px] leading-[1.6] text-brand-dark/70 max-w-[590px] prose-p:my-0 prose-p:font-heading prose-p:text-brand-dark/70 prose-p:leading-[1.6]"
                      />
                    )}

                    {item.body && (
                      <RichText
                        html={item.body}
                        className="mt-[20px] font-heading text-[16px] leading-[1.4] text-brand-dark/70 max-w-[590px] prose-p:my-0 prose-p:font-heading prose-p:text-brand-dark/70 prose-p:leading-[1.4] prose-strong:font-extrabold prose-strong:text-brand-dark"
                      />
                    )}

                    {/* Tabs */}
                    {tabs.length > 0 && (
                      <div className="mt-[44px] rounded-[10px] bg-brand-gray px-[20px] pt-[16px] pb-[20px] -mx-[12px] sm:-mx-[20px] lg:-mx-[20px]">
                        <div className="flex flex-wrap gap-[12px] sm:gap-[20px]">
                          {tabs.map((tab, tabIdx) => {
                            const isActive = tabIdx === activeTab;
                            const iconSrc = resolveMediaUrl(tab.icon ?? null);

                            return (
                              <button
                                key={`${tab.label}-${tabIdx}`}
                                type="button"
                                onClick={() => setTabState((prev) => ({ ...prev, [itemIdx]: tabIdx }))}
                                className={cn(
                                  'flex h-[41px] items-center justify-center gap-[12px] rounded-full px-[18px] text-[16px] font-heading font-extrabold leading-[normal] whitespace-nowrap text-table-text shadow-[0_1px_10px_rgba(0,0,0,0.05)] transition sm:px-[22px]',
                                  isActive ? 'bg-white' : 'border border-table-text bg-transparent hover:bg-white/70'
                                )}
                              >
                                <span className="px-[4px] sm:px-[6px]">{tab.label}</span>
                                {iconSrc && <Image src={iconSrc} alt="" width={16} height={16} className="h-4 w-4 object-contain" unoptimized />}
                              </button>
                            );
                          })}
                        </div>

                        {tabs[activeTab]?.content && (
                          <RichText
                            html={tabs[activeTab]?.content ?? null}
                            className="mt-[25px] font-heading text-[16px] leading-[1.4] text-brand-dark/70 max-w-[590px] prose-p:my-0 prose-p:font-heading prose-p:text-brand-dark/70 prose-p:leading-[1.4] prose-strong:font-extrabold prose-strong:text-brand-dark"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right column */}
                  <div className="flex min-w-0 flex-col gap-[32px] md:flex-[0_1_590px]">
                    {(item.videoId || item.videoCaption || primaryCta?.formCode || secondaryCta?.formCode) && (
                      <div className="flex flex-col gap-[16px]">
                        {item.videoId && (
                          <div className="relative w-full overflow-hidden rounded-[16px] bg-black/5 aspect-[5/3]">
                            {videoPoster && (
                              <Image
                                src={videoPoster}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="(min-width:1536px) 590px, (min-width:768px) 590px, 100vw"
                                unoptimized
                              />
                            )}

                            <button
                              type="button"
                              aria-label={`Play ${item.title}`}
                              onClick={() => setActiveVideoId(item.videoId ?? null)}
                              className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            >
                              <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:scale-105">
                                <Play className="h-7 w-7" />
                              </span>
                            </button>
                          </div>
                        )}

                        {item.videoCaption && (
                          <RichText
                            html={item.videoCaption}
                            className="font-heading text-[16px] leading-[1.4] text-brand-dark/70 prose-p:my-0 prose-p:font-heading prose-p:text-brand-dark/70 prose-p:leading-[1.4] prose-strong:font-extrabold prose-strong:text-brand-dark"
                          />
                        )}

                        {(primaryCta?.formCode || secondaryCta?.formCode) && (
                          <div className="flex flex-wrap gap-[16px]">
                            {primaryCta?.formCode && (
                              <button
                                type="button"
                                onClick={() => openForm(primaryCta, item.title)}
                                className="inline-flex flex-1 items-center justify-center gap-[16px] rounded-[24px] bg-brand-sky px-[32px] py-[8px] font-heading text-[16px] font-extrabold leading-[normal] text-white shadow-[0_1px_10px_rgba(0,0,0,0.05)] transition hover:shadow-md hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
                              >
                                <span>{primaryCta.label}</span>
                              </button>
                            )}
                            {secondaryCta?.formCode && (
                              <button
                                type="button"
                                onClick={() => openForm(secondaryCta, item.title)}
                                className="inline-flex flex-1 items-center justify-center gap-[16px] rounded-[24px] border border-brand-sky bg-white px-[32px] py-[8px] font-heading text-[16px] font-extrabold leading-[normal] text-brand-sky shadow-[0_1px_10px_rgba(0,0,0,0.05)] transition hover:shadow-md hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
                              >
                                <span>{secondaryCta.label}</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {(item.specialistsTitle || specialistsLeft.length > 0 || specialistsRight.length > 0) && (
                      <div className="rounded-[16px] bg-white shadow-[0_2px_20.6px_rgba(0,0,0,0.05)] px-[24px] py-[32px] md:p-[32px]">
                        {item.specialistsTitle && (
                          <p className="font-heading font-extrabold text-[20px] leading-[normal] text-brand-dark">
                            {item.specialistsTitle}
                          </p>
                        )}

                        <div className="mt-[16px] flex flex-wrap justify-between gap-[8px]">
                          {specialistsLeft.length > 0 && (
                            <ul className="basis-full sm:basis-[calc(50%-4px)] font-heading text-[16px] leading-[1.6] text-brand-dark/70">
                              {specialistsLeft.map((entry, idx) => (
                                <li
                                  key={`left-${idx}`}
                                  className="relative pl-[16px] before:absolute before:left-[0] before:top-[11px] before:h-[4px] before:w-[4px] before:rounded-full before:bg-brand-sky"
                                >
                                  {entry}
                                </li>
                              ))}
                            </ul>
                          )}
                          {specialistsRight.length > 0 && (
                            <ul className="basis-full sm:basis-[calc(50%-4px)] font-heading text-[16px] leading-[1.6] text-brand-dark/70">
                              {specialistsRight.map((entry, idx) => (
                                <li
                                  key={`right-${idx}`}
                                  className="relative pl-[16px] before:absolute before:left-[0] before:top-[11px] before:h-[4px] before:w-[4px] before:rounded-full before:bg-brand-sky"
                                >
                                  {entry}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}

                    {(item.reviewsTitle || item.reviews.length > 0) && (
                      <div className="rounded-[16px] bg-white shadow-[0_2px_20.6px_rgba(0,0,0,0.05)] px-[24px] py-[32px] md:p-[32px] flex flex-col gap-[32px] min-w-0">
                        {item.reviewsTitle && (
                          <p className="font-heading font-extrabold text-[20px] leading-[normal] text-brand-dark">
                            {item.reviewsTitle}
                          </p>
                        )}

                        {item.reviews.length > 0 && (
                          <div className="relative min-w-0">
                            <div
                              ref={(node) => {
                                reviewTrackRefs.current[itemIdx] = node;
                              }}
                              onScroll={handleReviewScroll(itemIdx, item.reviews.length)}
                              className="flex w-full min-w-0 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scroll transition-[height] duration-300"
                              style={reviewTrackHeights[itemIdx] ? { height: reviewTrackHeights[itemIdx] } : undefined}
                            >
                                  {item.reviews.map((review, idx) => {
                                    const poster = resolveYouTubePoster(review.videoId);
                                    return (
                                      <div key={`${review.name}-${idx}`} className="w-full flex-shrink-0 snap-start px-[2px]">
                                        <div className="flex flex-col gap-[16px] lg:flex-row lg:items-start lg:gap-[16px]">
                                          <div className="w-full lg:max-w-[267px] lg:pb-[32px]">
                                            <p className="font-heading font-extrabold text-[18px] leading-[normal] text-brand-dark">
                                              {review.name}
                                            </p>
                                            {review.meta && (
                                              <p className="mt-[4px] font-heading text-[14px] leading-[normal] text-brand-dark/70">
                                                {review.meta}
                                              </p>
                                            )}
                                            {review.text && (
                                              <RichText
                                                html={review.text}
                                                className="mt-[8px] flex-1 font-heading text-[14px] leading-[normal] text-brand-dark/70 prose-p:my-0 prose-p:font-heading prose-p:text-brand-dark/70 prose-p:leading-[normal]"
                                              />
                                            )}
                                          </div>

                                          <div className="relative mx-auto h-[347px] w-full max-w-[240px] overflow-hidden rounded-[16px] bg-black/5 sm:mx-0 sm:max-w-[226px]">
                                            {poster && (
                                              <Image
                                                src={poster}
                                                alt=""
                                                fill
                                                className="object-cover"
                                                sizes="(min-width:1536px) 226px, (min-width:1024px) 226px, 60vw"
                                                unoptimized
                                              />
                                            )}

                                        {review.videoId && (
                                          <button
                                            type="button"
                                            aria-label={`Play review by ${review.name}`}
                                            onClick={() => setActiveVideoId(review.videoId ?? null)}
                                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                          >
                                            <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:scale-105">
                                              <Play className="h-5 w-5" />
                                            </span>
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {item.reviews.length > 1 && (
                              <div className="mt-[16px] flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    aria-label="Previous review"
                                    onClick={() =>
                                      scrollToReview(
                                        itemIdx,
                                        ((reviewState[itemIdx] ?? 0) - 1 + item.reviews.length) % item.reviews.length,
                                        item.reviews.length
                                      )
                                    }
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-brand-dark/60 shadow-sm transition hover:text-brand-dark hover:border-brand-dark/20"
                                  >
                                    <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="Next review"
                                    onClick={() =>
                                      scrollToReview(
                                        itemIdx,
                                        ((reviewState[itemIdx] ?? 0) + 1) % item.reviews.length,
                                        item.reviews.length
                                      )
                                    }
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-brand-dark/60 shadow-sm transition hover:text-brand-dark hover:border-brand-dark/20"
                                  >
                                    <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                                  </button>
                                </div>

                                <div className="flex items-center gap-2">
                                  {item.reviews.map((_, dotIdx) => (
                                    <button
                                      key={`dot-${dotIdx}`}
                                      onClick={() => scrollToReview(itemIdx, dotIdx, item.reviews.length)}
                                      className={cn(
                                        "h-[10px] w-[10px] rounded-full transition-all duration-300",
                                        activeReview === dotIdx ? "bg-brand-dark" : "bg-ui-dot"
                                      )}
                                      aria-label={`Go to review ${dotIdx + 1}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {renderVideoModal()}

      <QuoteModal
        isOpen={Boolean(quoteState)}
        onClose={() => setQuoteState(null)}
        formCode={quoteState?.formCode ?? null}
        formTitle={quoteState?.formTitle ?? null}
        topic={quoteState?.topic ?? null}
      />
    </section>
  );
};

export default InteractiveEquipment;

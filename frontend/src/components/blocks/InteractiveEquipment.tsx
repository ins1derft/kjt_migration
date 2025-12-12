'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import QuoteModal from './QuoteModal';
import RichText from '../RichText';
import { cn, resolveMediaUrl } from '@/lib/utils';
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
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
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
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [quoteState, setQuoteState] = useState<{ formCode: string; formTitle?: string | null; topic?: string | null } | null>(null);

  useEffect(() => {
    const shouldLock = Boolean(activeVideoId) || Boolean(quoteState);
    document.body.style.overflow = shouldLock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeVideoId, quoteState]);

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
            src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
          <div className="mx-auto max-w-[974px] text-center">
            {title && (
              <h2 className="font-heading font-bold text-[38px] md:text-[64px] leading-none text-brand-dark mb-[45px]">
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
            const currentReview = item.reviews[activeReview] ?? null;

            const specialistsLeft = item.specialistsLeft;
            const specialistsRight = item.specialistsRight;

            const primaryCta = item.primaryCta;
            const secondaryCta = item.secondaryCta;

            const videoPoster = resolveYouTubePoster(item.videoId);
            const reviewPoster = currentReview ? resolveYouTubePoster(currentReview.videoId) : null;

            return (
              <div
                key={`${item.title}-${itemIdx}`}
                className={cn('py-[50px]', itemIdx === 0 && 'pt-0', itemIdx === normalizedItems.length - 1 && 'pb-0')}
              >
                <div className="grid gap-[20px] lg:grid-cols-2 lg:items-start">
                  {/* Left card */}
                  <div className="rounded-[10px] bg-white shadow-[0_2px_20.6px_rgba(0,0,0,0.05)] px-[18px] py-[22px] sm:px-[24px] sm:py-[26px] lg:px-[30px] lg:pt-[40px] lg:pb-[30px]">
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
                      <div className="mt-[44px] rounded-[10px] bg-brand-gray px-[20px] pt-[16px] pb-[20px] -mx-[20px] lg:-mx-[20px]">
                        <div className="flex flex-wrap gap-[20px]">
                          {tabs.map((tab, tabIdx) => {
                            const isActive = tabIdx === activeTab;
                            const iconSrc = resolveMediaUrl(tab.icon ?? null);

                            return (
                              <button
                                key={`${tab.label}-${tabIdx}`}
                                type="button"
                                onClick={() => setTabState((prev) => ({ ...prev, [itemIdx]: tabIdx }))}
                                className={cn(
                                  'relative flex h-[41px] w-[179px] items-center justify-center rounded-full text-[16px] font-heading font-extrabold leading-[normal] text-table-text shadow-[0_1px_10px_rgba(0,0,0,0.05)] transition',
                                  isActive ? 'bg-white' : 'border border-table-text bg-transparent hover:bg-white/70'
                                )}
                              >
                                <span className="px-[17px]">{tab.label}</span>
                                {iconSrc && (
                                  <span className="absolute right-[17px] top-1/2 -translate-y-1/2">
                                    <Image src={iconSrc} alt="" width={16} height={16} className="h-4 w-4 object-contain" unoptimized />
                                  </span>
                                )}
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
                  <div className="flex flex-col">
                    <div className="relative h-[245px] w-full overflow-hidden rounded-[10px] bg-black/5">
                      {videoPoster && (
                        <Image
                          src={videoPoster}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(min-width:1536px) 650px, (min-width:1024px) 50vw, 100vw"
                          unoptimized
                        />
                      )}

                      {item.videoId && (
                        <button
                          type="button"
                          aria-label={`Play ${item.title}`}
                          onClick={() => setActiveVideoId(item.videoId ?? null)}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:scale-105">
                            <Play className="h-7 w-7" />
                          </span>
                        </button>
                      )}
                    </div>

                    {item.videoCaption && (
                      <RichText
                        html={item.videoCaption}
                        className="mt-[20px] font-heading text-[16px] leading-[1.4] text-brand-dark/70 max-w-[590px] prose-p:my-0 prose-p:font-heading prose-p:text-brand-dark/70 prose-p:leading-[1.4] prose-strong:font-extrabold prose-strong:text-brand-dark"
                      />
                    )}

                    <div className="mt-[25px] flex flex-wrap gap-[20px]">
                      {primaryCta && (
                        <button
                          type="button"
                          onClick={() => openForm(primaryCta, item.title)}
                          className="inline-flex h-[41px] w-[179px] items-center justify-center gap-[10px] rounded-full bg-brand-sky text-white shadow-[0_1px_10px_rgba(0,0,0,0.05)] transition hover:shadow-md hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
                        >
                          <span className="font-heading font-extrabold text-[16px] leading-[normal]">{primaryCta.label}</span>
                        </button>
                      )}
                      {secondaryCta && (
                        <button
                          type="button"
                          onClick={() => openForm(secondaryCta, item.title)}
                          className="inline-flex h-[41px] w-[179px] items-center justify-center gap-[10px] rounded-full bg-gradient-cta text-white shadow-[0_1px_10px_rgba(0,0,0,0.05)] transition hover:shadow-md hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
                        >
                          <span className="font-heading font-bold text-[16px] leading-[normal]">{secondaryCta.label}</span>
                        </button>
                      )}
                    </div>

                    {(item.specialistsTitle || specialistsLeft.length > 0 || specialistsRight.length > 0) && (
                      <div className="mt-[27px] rounded-[10px] bg-white shadow-[0_2px_20.6px_rgba(0,0,0,0.05)] px-[30px] pt-[29px] pb-[28px]">
                        {item.specialistsTitle && (
                          <p className="font-heading font-extrabold text-[16px] leading-[1.4] text-brand-dark">
                            {item.specialistsTitle}
                          </p>
                        )}

                        <div className="mt-[12px] grid gap-x-[10px] gap-y-[10px] sm:grid-cols-2">
                          {specialistsLeft.length > 0 && (
                            <ul className="list-disc pl-[24px] font-heading text-[16px] leading-[1.8] text-brand-dark/70">
                              {specialistsLeft.map((entry, idx) => (
                                <li key={`left-${idx}`}>{entry}</li>
                              ))}
                            </ul>
                          )}
                          {specialistsRight.length > 0 && (
                            <ul className="list-disc pl-[24px] font-heading text-[16px] leading-[1.8] text-brand-dark/70">
                              {specialistsRight.map((entry, idx) => (
                                <li key={`right-${idx}`}>{entry}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}

                    {(item.reviewsTitle || item.reviews.length > 0) && (
                      <div className="mt-[25px] rounded-[10px] bg-white shadow-[0_2px_20.6px_rgba(0,0,0,0.05)] px-[30px] pt-[27px] pb-[23px] flex flex-col gap-[18px]">
                        {item.reviewsTitle && (
                          <p className="font-heading font-extrabold text-[16px] leading-[1.4] text-brand-dark">
                            {item.reviewsTitle}
                          </p>
                        )}

                        {item.reviews.length > 0 && (
                          <div className="relative">
                            <div className="overflow-hidden">
                              <div
                                className="flex w-full transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${activeReview * 100}%)` }}
                              >
                                {item.reviews.map((review, idx) => {
                                  const poster = resolveYouTubePoster(review.videoId);
                                  return (
                                    <div key={`${review.name}-${idx}`} className="w-full flex-shrink-0">
                                      <div className="flex flex-col gap-[16px] sm:flex-row sm:items-start sm:gap-[24px]">
                                        <div className="w-full sm:max-w-[287px]">
                                          <p className="font-heading font-extrabold text-[16px] leading-[1.4] text-brand-dark">
                                            {review.name}
                                          </p>
                                          {review.meta && (
                                            <p className="mt-0 font-heading text-[16px] leading-[1.4] text-brand-dark/70">
                                              {review.meta}
                                            </p>
                                          )}
                                          {review.text && (
                                            <RichText
                                              html={review.text}
                                              className="mt-[10px] font-heading text-[16px] leading-[1.6] text-brand-dark/70 prose-p:my-0 prose-p:font-heading prose-p:text-brand-dark/70 prose-p:leading-[1.6]"
                                            />
                                          )}
                                        </div>

                                        <div className="relative w-full sm:max-w-[279px] overflow-hidden rounded-[10px] bg-black/5 aspect-[279/160]">
                                          {poster && (
                                            <Image
                                              src={poster}
                                              alt=""
                                              fill
                                              className="object-cover"
                                              sizes="(min-width:1536px) 279px, (min-width:1024px) 24vw, 60vw"
                                              unoptimized
                                            />
                                          )}

                                          {review.videoId && (
                                            <button
                                              type="button"
                                              aria-label={`Play review by ${review.name}`}
                                              onClick={() => setActiveVideoId(review.videoId ?? null)}
                                              className="absolute inset-0 flex items-center justify-center"
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
                            </div>

                            {item.reviews.length > 1 && (
                              <div className="mt-[16px] flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  {item.reviews.map((_, dotIdx) => (
                                    <button
                                      key={`dot-${dotIdx}`}
                                      onClick={() =>
                                        setReviewState((prev) => ({ ...prev, [itemIdx]: dotIdx }))
                                      }
                                      className={cn(
                                        "h-[10px] w-[10px] rounded-full transition-all duration-300",
                                        activeReview === dotIdx ? "bg-brand-dark" : "bg-ui-dot"
                                      )}
                                      aria-label={`Go to review ${dotIdx + 1}`}
                                    />
                                  ))}
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    aria-label="Previous review"
                                    onClick={() =>
                                      setReviewState((prev) => ({
                                        ...prev,
                                        [itemIdx]:
                                          ((prev[itemIdx] ?? 0) - 1 + item.reviews.length) % item.reviews.length,
                                      }))
                                    }
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-brand-dark/60 shadow-sm transition hover:text-brand-dark hover:border-brand-dark/20"
                                  >
                                    <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="Next review"
                                    onClick={() =>
                                      setReviewState((prev) => ({
                                        ...prev,
                                        [itemIdx]: ((prev[itemIdx] ?? 0) + 1) % item.reviews.length,
                                      }))
                                    }
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-brand-dark/60 shadow-sm transition hover:text-brand-dark hover:border-brand-dark/20"
                                  >
                                    <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                                  </button>
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

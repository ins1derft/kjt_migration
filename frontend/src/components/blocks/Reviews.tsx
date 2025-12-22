'use client';
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";
import { getGoogleReviews, getReviews } from "@/lib/api";
import type { Review } from "@/lib/blocks/types";
import RichText from "../RichText";
import ClickSpark from "@/components/bits/ClickSpark";

export interface ReviewsProps {
  query?: {
    limit?: number;
    fields?: string[];
    ids?: Array<number | string>;
    onlyActive?: boolean;
  };
  ctaHref?: string;
  ctaLabel?: string;
  title?: string;
  description?: string;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
  /**
   * Template selector for MoonShine layout editor.
   * - "featured" → large cards with big photos.
   * - "compact"  → mini cards with concise info.
   */
  template?: "featured" | "compact";
}

const formatDate = (value?: string | null) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(parsed);
  }
  return value;
};

const normalizeReviews = (items?: Review[]): Review[] =>
  (items ?? [])
    .map((t) => ({
      ...t,
      rating: Number.isFinite(Number(t.rating)) ? Number(t.rating) : 5,
      date: formatDate(t.date ?? t.review_date),
      avatar: resolveMediaUrl(t.avatar) || '/images/placeholders/no-image.jpg',
    }))
    .filter((t) => Boolean(t.name) && Boolean(t.text));

const clampRating = (rating?: number | null) =>
  Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const safeTextToHtml = (value: string) => `<p>${escapeHtml(value).replace(/\r?\n/g, '<br />')}</p>`;

const resolveYouTubePoster = (videoId: string, variant: 'maxresdefault' | 'hqdefault' = 'maxresdefault') =>
  `https://img.youtube.com/vi/${videoId}/${variant}.jpg`;

const resolveYouTubeEmbedSrc = (videoId: string) =>
  `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1&playsinline=1`;

const GoogleGlyph = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const CARD_SHADOW = "shadow-[0px_2px_20.6px_0px_rgba(0,0,0,0.1)]";

const StarRow = ({ value, size = 24, className = "" }: { value: number; size?: number; className?: string }) => (
  <div className={cn("flex items-center gap-1 text-ui-star", className)}>
    {Array.from({ length: clampRating(value) }).map((_, idx) => (
      <Star key={idx} size={size} strokeWidth={0} fill="currentColor" />
    ))}
  </div>
);

const FeaturedCard: React.FC<{ review: Review; onPlayVideo?: (videoId: string) => void }> = ({
  review,
  onPlayVideo,
}) => {
  const videoId = typeof review.video_id === 'string' ? review.video_id.trim() : '';
  const hasVideo = Boolean(videoId);
  const [posterVariant, setPosterVariant] = useState<'maxresdefault' | 'hqdefault'>('maxresdefault');
  const poster = hasVideo ? resolveYouTubePoster(videoId, posterVariant) : null;

  return (
    <div className={cn("flex h-full min-h-[468px] rounded-[10px] bg-white md:min-h-[360px] xl:min-h-[434px]", CARD_SHADOW)}>
      <div className="grid h-full w-full grid-cols-1 gap-4 px-5 py-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-[18px] md:px-6 lg:gap-5 lg:px-7">
        <div className="order-2 flex flex-col md:order-1">
          <h3 className="font-heading text-[22px] leading-[1.2] text-brand-dark">{review.name}</h3>
          {review.text && (
            <div className="mt-3 max-h-[120px] overflow-y-auto pr-1 text-[16px] leading-[1.4] text-brand-dark/70 md:max-h-[150px] xl:max-h-[176px]">
              <RichText
                html={review.text}
                className="prose-p:my-0 prose-ul:my-1 prose-ol:my-1"
              />
            </div>
          )}
          <StarRow value={review.rating} size={24} className="mt-auto pt-6" />
        </div>

        <div className="order-1 flex items-center justify-center md:order-2">
          {hasVideo && poster ? (
            <button
              type="button"
              aria-label="Play review video"
              onClick={() => onPlayVideo?.(videoId)}
              className="relative h-[220px] w-[290px] overflow-hidden rounded-[10px] bg-brand-gray md:h-[319px] md:w-[231px] xl:h-[385px] xl:w-[279px]"
            >
              <Image
                src={poster}
                alt={review.name}
                fill
                sizes="(min-width: 1280px) 279px, (min-width: 768px) 231px, 290px"
                className="object-cover"
                onError={() => setPosterVariant('hqdefault')}
                unoptimized
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
                  <Play className="h-7 w-7" />
                </span>
              </span>
            </button>
          ) : (
            <Image
              src={review.avatar || '/images/placeholders/no-image.jpg'}
              alt={review.name}
              width={279}
              height={385}
              sizes="(min-width: 1280px) 279px, (min-width: 768px) 231px, 290px"
              className="h-[220px] w-[290px] rounded-[10px] object-cover bg-brand-gray md:h-[319px] md:w-[231px] xl:h-[385px] xl:w-[279px]"
              unoptimized
            />
          )}
        </div>
      </div>
    </div>
  );
};

const CompactCard = ({ review }: { review: Review }) => {
  const textRef = React.useRef<HTMLDivElement | null>(null);
  const safeText = useMemo(() => (review.text ? safeTextToHtml(review.text) : ''), [review.text]);

  return (
    <div className={cn("relative h-full rounded-[10px] bg-white p-4 md:p-5", CARD_SHADOW)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-brand-gray">
            <Image
              src={review.avatar || '/images/placeholders/no-image.jpg'}
              alt={review.name}
              width={40}
              height={40}
              sizes="40px"
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
          <div className="leading-tight">
            <p className="font-heading text-[15px] font-semibold text-brand-dark">{review.name}</p>
            {review.date && <span className="text-xs text-brand-dark/60">{review.date}</span>}
          </div>
        </div>
        <GoogleGlyph className="h-5 w-5 flex-shrink-0" />
      </div>

      <StarRow value={review.rating} size={16} className="mt-3" />

      {review.text && (
        <div
          ref={textRef}
          className="relative mt-2 max-h-[90px] overflow-y-auto pr-1 text-[13px] leading-[18px] text-brand-dark/70"
        >
          <RichText html={safeText} className="prose-p:my-0 prose-ul:my-1 prose-ol:my-1" />
        </div>
      )}
    </div>
  );
};

const Reviews: React.FC<ReviewsProps> = ({
  query,
  ctaHref = "#",
  ctaLabel = "Leave a review",
  title,
  description,
  padding,
  template = "featured",
  backgroundClass,
  backgroundColor,
}) => {
  const hasTitle = Boolean(title?.trim());
  const hasDescription = Boolean(description?.trim());
  const hasHeader = hasTitle || hasDescription;
  const [featuredReviews, setFeaturedReviews] = useState<Review[]>([]);
  const [googleReviews, setGoogleReviewsState] = useState<Review[]>([]);
  const [googleMeta, setGoogleMeta] = useState<{ average: number; count: number } | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(typeof window === "undefined" ? 0 : window.innerWidth);
  const [heroPage, setHeroPage] = useState(0);
  const [compactPage, setCompactPage] = useState(0);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const showHero = template === "featured";
  const showCompact = template === "compact" || template === "featured";

  useEffect(() => {
    const update = () => setViewportWidth(typeof window !== "undefined" ? window.innerWidth : 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const shouldLock = activeVideoId !== null;
    document.body.style.overflow = shouldLock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeVideoId]);

  useEffect(() => {
    if (!activeVideoId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveVideoId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeVideoId]);

  const queryKey = useMemo(
    () =>
      [
        query?.limit ?? '',
        (query?.fields ?? []).join(','),
        (query?.ids ?? []).join(','),
        query?.onlyActive ?? true,
      ].join('|'),
    [query?.fields, query?.ids, query?.limit, query?.onlyActive]
  );

  const featuredFields = useMemo(() => {
    const baseFields = (query?.fields ?? []).filter(Boolean);
    if (!baseFields.length) return undefined;

    // Even when the block requests a limited field set, we still need `video_id`
    // to render video previews (otherwise API selects omit it and it comes back null).
    if (baseFields.includes('video_id')) return baseFields;
    return [...baseFields, 'video_id'];
  }, [query?.fields]);

  useEffect(() => {
    if (!showHero) return;
    let cancelled = false;

    (async () => {
      try {
        const fetched = await getReviews({
          limit: query?.limit ?? 12,
          fields: featuredFields,
          filter: {
            ids: query?.ids?.length ? query.ids.join(',') : undefined,
            is_active: query?.onlyActive ?? true,
          },
        });
        if (!cancelled) {
          setFeaturedReviews(normalizeReviews(fetched));
          setHeroPage(0);
        }
      } catch (error) {
        console.error('Failed to load reviews', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [queryKey, showHero, featuredFields, query?.ids, query?.limit, query?.onlyActive]);

  useEffect(() => {
    if (!showCompact) return;
    let cancelled = false;

    (async () => {
      try {
        const limit = query?.limit ?? 12;
        const payload = await getGoogleReviews({
          limit,
        });

        if (!cancelled) {
          setGoogleReviewsState(normalizeReviews(payload?.data ?? []));
          setGoogleMeta({
            average: Number(payload?.meta?.average ?? 5),
            count: Number(payload?.meta?.count ?? 0),
          });
          setCompactPage(0);
        }
      } catch (error) {
        console.error('Failed to load Google reviews', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [query?.limit, showCompact]);

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "py-[85px]");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-brand-gray");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const heroData = useMemo(() => (featuredReviews.length ? featuredReviews : []), [featuredReviews]);
  const compactData = useMemo(() => (googleReviews.length ? googleReviews : []), [googleReviews]);

  const heroPerPage = viewportWidth >= 1024 ? 2 : 1;
  const compactPerPage = viewportWidth >= 1280 ? 3 : viewportWidth >= 1024 ? 2 : 1;
  const heroGap = viewportWidth >= 1024 ? 20 : 16; // px (gap-5 or gap-4)
  const compactGap = viewportWidth >= 768 ? 20 : 16; // md:gap-5 else gap-4

  const heroPageCount = Math.max(1, Math.ceil(heroData.length / Math.max(heroPerPage, 1)));
  const compactPageCount = Math.max(1, Math.ceil(compactData.length / Math.max(compactPerPage, 1)));

  const averageRating = useMemo(
    () =>
      googleMeta?.average ??
      (compactData.length
        ? compactData.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / compactData.length
        : 5),
    [compactData, googleMeta?.average],
  );

  const googleCount = googleMeta?.count ?? compactData.length;
  const ratingLabel = googleCount
    ? `${googleCount} Review${googleCount === 1 ? '' : 's'}`
    : 'Reviews';

  const renderVideoModal = () => {
    if (!activeVideoId) return null;
    const videoSrc = resolveYouTubeEmbedSrc(activeVideoId);

    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <button
          aria-label="Close video"
          onClick={() => setActiveVideoId(null)}
          className="absolute right-6 top-6 z-10 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <X size={32} />
        </button>

        <div className="absolute inset-0" onClick={() => setActiveVideoId(null)} />

        <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl">
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={videoSrc}
              title="Review video"
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

  return (
    <section className={cn(paddingClass, sectionBackground)} style={sectionStyle}>
      <div className="container mx-auto w-full max-w-[1339px] px-5 sm:px-6 lg:px-10">
        {hasHeader && (
          <header className="text-center">
            {hasTitle && (
              <h2 className="mx-auto w-full max-w-[992px] font-heading text-[38px] leading-[1.05] text-brand-dark md:text-[48px] 2xl:text-[64px]">
                {title}
              </h2>
            )}
            {hasDescription && (
              <RichText
                html={description}
                className="mt-3 text-[16px] leading-[1.4] text-brand-dark/70 md:text-[18px] 2xl:text-[20px] prose-p:my-0 prose-ul:my-1 prose-ol:my-1"
              />
            )}
          </header>
        )}

        {showHero && heroData.length > 0 && (
          <>
            <div className={cn("relative", hasHeader ? "mt-10 md:mt-12" : "mt-0")}>
              {heroPageCount > 1 && (
                <button
                  aria-label="Previous reviews"
                  onClick={() => setHeroPage((prev) => (prev > 0 ? prev - 1 : heroPageCount - 1))}
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full p-3 text-brand-dark/30 transition-colors hover:text-brand-dark"
                >
                  <ChevronLeft size={28} />
                </button>
              )}

              <div className="overflow-hidden px-3 md:px-4 pt-2 pb-3">
                <div
                  className="flex transition-transform duration-500 ease-in-out gap-4 lg:gap-5"
                  style={{
                    transform: `translateX(-${Math.min(heroPage, heroPageCount - 1) * 100}%)`,
                  }}
                >
                  {heroData.map((review, idx) => (
                    <div
                      key={`hero-slide-${review.id ?? review.name}-${idx}`}
                      className="shrink-0"
                      style={{
                        width: `calc((100% - ${heroGap * (heroPerPage - 1)}px)/${heroPerPage})`,
                      }}
                    >
                      <FeaturedCard review={review} onPlayVideo={(videoId) => setActiveVideoId(videoId)} />
                    </div>
                  ))}
                </div>
              </div>

              {heroPageCount > 1 && (
                <button
                  aria-label="Next reviews"
                  onClick={() => setHeroPage((prev) => (prev + 1) % heroPageCount)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-3 text-brand-dark/30 transition-colors hover:text-brand-dark"
                >
                  <ChevronRight size={28} />
                </button>
              )}

              {heroPageCount > 1 && (
                <div className="mt-6 flex justify-center gap-3">
                  {Array.from({ length: heroPageCount }).map((_, idx) => (
                    <button
                      key={`hero-dot-${idx}`}
                      aria-label={`Go to slide ${idx + 1}`}
                      onClick={() => setHeroPage(idx)}
                      className={cn(
                        "h-[10px] w-[10px] rounded-full transition-colors",
                        idx === heroPage ? "bg-brand-dark" : "bg-[#d0d3db]"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Rating shown whenever the compact slider is enabled */}
        {showCompact && compactData.length > 0 && (
          <div className={cn("flex justify-center", hasHeader ? "mt-10 md:mt-12" : "mt-0")}>
            <div className="flex flex-col items-center gap-5">
              <div className="flex items-center gap-2 text-brand-dark">
                <GoogleGlyph className="h-6 w-6 md:h-7 md:w-7" />
                <span className="font-heading text-[18px] font-bold md:text-[20px] 2xl:text-[22px]">
                  {averageRating.toFixed(1)}
                </span>
                <Star className="text-ui-star" fill="currentColor" strokeWidth={0} size={22} />
              </div>
              <div className="text-[12px] font-bold text-brand-dark/60 md:text-[13px]">{ratingLabel}</div>
            </div>
          </div>
        )}

        {showCompact && compactData.length > 0 && (
          <div className={cn("relative", hasHeader ? "mt-2" : "mt-0")}>
            {compactPageCount > 1 && (
              <button
                aria-label="Previous reviews"
                onClick={() => setCompactPage((prev) => (prev > 0 ? prev - 1 : compactPageCount - 1))}
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full p-2 text-brand-dark/30 transition-colors hover:text-brand-dark"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div className="overflow-hidden px-3 md:px-4 pt-2 pb-3">
              <div
                className="flex transition-transform duration-500 ease-in-out gap-4 md:gap-5"
                style={{
                  transform: `translateX(-${Math.min(compactPage, compactPageCount - 1) * 100}%)`,
                }}
              >
                {compactData.map((review, idx) => (
                  <div
                    key={`compact-slide-${review.id ?? review.name}-${idx}`}
                    className="shrink-0"
                    style={{
                      width: `calc((100% - ${compactGap * (compactPerPage - 1)}px)/${compactPerPage})`,
                    }}
                  >
                    <CompactCard review={review} />
                  </div>
                ))}
              </div>
            </div>

            {compactPageCount > 1 && (
              <button
                aria-label="Next reviews"
                onClick={() => setCompactPage((prev) => (prev + 1) % compactPageCount)}
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 text-brand-dark/30 transition-colors hover:text-brand-dark"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-2 text-center">
          <ClickSpark sparkColor="#FFE4F0" sparkRadius={16} sparkCount={10} duration={220} easing="linear" className="inline-block">
            <a
              href={ctaHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[53px] w-[179px] items-center justify-center rounded-full bg-brand-gradient text-[16px] font-heading font-bold text-white transition-transform duration-150 animate-gradient-hover hover:shadow-lg hover:scale-[1.02]"
            >
              {ctaLabel}
            </a>
          </ClickSpark>
        </div>
      </div>

      {renderVideoModal()}
    </section>
  );
};

export default Reviews;

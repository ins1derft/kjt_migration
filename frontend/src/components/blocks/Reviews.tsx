'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";
import { getReviews } from "@/lib/api";
import type { Review } from "@/lib/blocks/types";
import RichText from "../RichText";

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
      avatar: resolveMediaUrl(t.avatar) ?? '/file.svg',
    }))
    .filter((t) => Boolean(t.name) && Boolean(t.text));

const clampRating = (rating?: number | null) =>
  Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

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

const FeaturedCard = ({ review }: { review: Review }) => (
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
        <img
          src={review.avatar ?? '/file.svg'}
          alt={review.name}
          className="h-[220px] w-[290px] rounded-[10px] object-cover bg-brand-gray md:h-[319px] md:w-[231px] xl:h-[385px] xl:w-[279px]"
        />
      </div>
    </div>
  </div>
);

const CompactCard = ({ review }: { review: Review }) => {
  const textRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className={cn("relative h-full rounded-[10px] bg-white p-4 md:p-5", CARD_SHADOW)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-brand-gray">
            <img src={review.avatar ?? '/file.svg'} alt={review.name} className="h-full w-full object-cover" />
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
          <RichText html={review.text} className="prose-p:my-0 prose-ul:my-1 prose-ol:my-1" />
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
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [viewportWidth, setViewportWidth] = useState<number>(typeof window === "undefined" ? 0 : window.innerWidth);
  const [heroPage, setHeroPage] = useState(0);
  const [compactPage, setCompactPage] = useState(0);

  const showHero = template === "featured";
  const showCompact = template === "compact" || template === "featured";

  useEffect(() => {
    const update = () => setViewportWidth(typeof window !== "undefined" ? window.innerWidth : 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const fetched = await getReviews({
          limit: query?.limit ?? 12,
          fields: query?.fields,
          filter: {
            ids: query?.ids?.length ? query.ids.join(',') : undefined,
            is_active: query?.onlyActive ?? true,
          },
        });
        if (!cancelled) {
          setReviews(normalizeReviews(fetched));
          setHeroPage(0);
          setCompactPage(0);
        }
      } catch (error) {
        console.error('Failed to load reviews', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [queryKey, query?.fields, query?.ids, query?.limit, query?.onlyActive]);

  const paddingClass = resolveSectionPadding(padding, "py-[85px]");
  const data = useMemo(() => (reviews.length ? reviews : []), [reviews]);

  const heroPerPage = viewportWidth >= 1024 ? 2 : 1;
  const compactPerPage = viewportWidth >= 1280 ? 3 : viewportWidth >= 1024 ? 2 : 1;
  const heroGap = viewportWidth >= 1024 ? 20 : 16; // px (gap-5 or gap-4)
  const compactGap = viewportWidth >= 768 ? 20 : 16; // md:gap-5 else gap-4

  const heroPageCount = Math.max(1, Math.ceil(data.length / Math.max(heroPerPage, 1)));
  const compactPageCount = Math.max(1, Math.ceil(data.length / Math.max(compactPerPage, 1)));

  const averageRating = useMemo(
    () => (data.length ? data.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / data.length : 5),
    [data],
  );

  const ratingLabel = data.length
    ? `${data.length} Review${data.length === 1 ? '' : 's'}`
    : 'Reviews';

  return (
    <section className={cn(paddingClass, "bg-brand-gray")}>
      <div className="container mx-auto w-full max-w-[1339px] px-5 sm:px-6 lg:px-10">
        <header className="text-center">
          <h2 className="font-heading text-[38px] leading-[1.05] text-brand-dark md:text-[48px] 2xl:text-[64px]">
            {title}
          </h2>
          <p className="mt-3 text-[16px] leading-[1.4] text-brand-dark/70 md:text-[18px] 2xl:text-[20px]">
            {description}
          </p>
        </header>

        {showHero && data.length > 0 && (
          <>
            <div className="relative mt-10 md:mt-12">
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
                  {data.map((review, idx) => (
                    <div
                      key={`hero-slide-${review.id ?? review.name}-${idx}`}
                      className="shrink-0"
                      style={{
                        width: `calc((100% - ${heroGap * (heroPerPage - 1)}px)/${heroPerPage})`,
                      }}
                    >
                      <FeaturedCard review={review} />
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
        {showCompact && data.length > 0 && (
          <div className="mt-10 flex justify-center md:mt-12">
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

        {showCompact && data.length > 0 && (
          <div className="relative mt-2">
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
                {data.map((review, idx) => (
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
          <a
            href={ctaHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-[53px] w-[179px] items-center justify-center rounded-full bg-brand-gradient animate-gradient text-[16px] font-heading font-bold text-white transition-all hover:shadow-lg"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Reviews;

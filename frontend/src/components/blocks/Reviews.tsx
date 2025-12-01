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
      rating: Number.isFinite(Number(t.rating)) ? Number(t.rating) : 0,
      date: formatDate(t.date ?? t.review_date),
      avatar: resolveMediaUrl(t.avatar) ?? '/file.svg',
    }))
    .filter((t) => Boolean(t.name) && Boolean(t.text));

const Reviews: React.FC<ReviewsProps> = ({
  query,
  ctaHref = "#",
  ctaLabel = "Leave a review",
  title,
  description,
  padding,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      if (typeof window !== "undefined") {
        setItemsPerView(window.innerWidth >= 768 ? 3 : 1);
      }
    };
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
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error('Failed to load reviews', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [queryKey]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [reviews.length, itemsPerView]);

  const reviewsDoubled = reviews.length ? [...reviews, ...reviews] : [];
  const totalItems = reviewsDoubled.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);
  const hasItems = totalItems > 0;

  const nextSlide = () => {
    if (!hasItems) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (!hasItems) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const paddingClass = resolveSectionPadding(padding, "py-20");

  return (
    <section className={cn(paddingClass, "bg-brand-gray border-t border-gray-100")}>
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight text-center text-brand-dark mb-4">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-center text-gray-600 text-lg md:text-xl mb-8 max-w-4xl mx-auto">
            {description}
          </p>
        )}

        {/* Google Rating Widget */}
        <div className="flex flex-col items-center mb-16">
          <div className="bg-white px-6 py-3 rounded-full shadow-sm flex flex-col items-center">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="w-8 h-8">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-heading font-bold text-2xl text-brand-dark">5.0</span>
              <Star className="text-ui-star" fill="currentColor" strokeWidth={0} size={28} />
            </div>
            <div className="text-gray-500 font-bold text-sm mt-1">104 Reviews</div>
          </div>
        </div>

        {hasItems && (
          <div className="relative max-w-[1300px] mx-auto group/slider">
            <button
              onClick={prevSlide}
              className="hidden md:flex absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center text-gray-300 hover:text-brand-dark transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={40} />
            </button>

            <button
              onClick={nextSlide}
              className="hidden md:flex absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center text-gray-300 hover:text-brand-dark transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={40} />
            </button>

            <div className="overflow-hidden px-2 py-4">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                }}
              >
                {reviewsDoubled.map((t, idx) => {
                  const stars = Math.max(0, Math.min(5, Math.round(t.rating ?? 0)));
                  return (
                    <div
                      key={`${t.id ?? idx}-${idx}`}
                      className="shrink-0 w-full md:w-1/3 px-3"
                    >
                      <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 h-full relative group cursor-default">
                        <div className="absolute top-8 right-8">
                          <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-80">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          </svg>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <img src={t.avatar ?? '/file.svg'} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                          <div className="flex flex-col">
                            <h4 className="font-heading font-bold text-brand-dark text-base leading-tight">{t.name}</h4>
                            {t.date && <span className="text-[13px] text-gray-400 font-sans">{t.date}</span>}
                          </div>
                        </div>

                        <div className="flex text-ui-star mb-4">
                          {Array.from({ length: stars }).map((_, i) => (
                            <Star key={i} fill="currentColor" strokeWidth={0} size={16} className="mr-0.5" />
                          ))}
                        </div>

                        <div className="relative">
                          <div className="max-h-44 overflow-y-auto pr-2 custom-scrollbar">
                            <RichText
                              html={t.text}
                              className="text-gray-600 text-[15px] leading-relaxed prose-p:my-0 prose-ul:my-1 prose-ol:my-1 prose-headings:my-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <a
            href={ctaHref}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-brand-gradient animate-gradient text-white font-heading font-bold text-lg py-4 px-12 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Reviews;

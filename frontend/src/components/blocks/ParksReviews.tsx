'use client';

import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import RichText from '../RichText';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';

export type ParksReviewItem = {
  author: string;
  timeAgo?: string | null;
  rating?: number | string | null;
  text?: string | null;
  label?: string | null;
  labelMeta?: string | null;
  linkHref?: string | null;
  linkLabel?: string | null;
};

export type ParksReviewsProps = {
  title?: string | null;
  description?: string | null;
  rating?: number | string | null;
  items?: ParksReviewItem[] | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const GoogleGlyph = ({ className = 'h-10 w-10' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const clampRating = (value?: number | string | null) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return 5;
  return Math.max(0, Math.min(5, num));
};

const formatRating = (value?: number | string | null) => clampRating(value).toFixed(1);

const StarRow = ({ value, size = 20 }: { value: number | string | null; size?: number }) => {
  const count = clampRating(value);
  return (
    <div className="flex items-center gap-1 text-ui-star">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Star
          key={idx}
          size={size}
          strokeWidth={0}
          fill={idx < count ? 'currentColor' : 'rgba(217,217,217,0.5)'}
          className="shrink-0"
        />
      ))}
    </div>
  );
};

const looksLikeHtml = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const safeTextToHtml = (value: string) => `<p>${escapeHtml(value).replace(/\r?\n/g, '<br />')}</p>`;

const clampTextStyle: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 7,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const ParksReviews: React.FC<ParksReviewsProps> = ({
  title,
  description,
  rating = 5,
  items,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const normalizedItems = useMemo(() => {
    const raw = Array.isArray(items) ? items : [];
    return raw
      .map((item) => ({
        author: typeof item?.author === 'string' ? item.author.trim() : '',
        timeAgo: typeof item?.timeAgo === 'string' ? item.timeAgo.trim() : null,
        rating: Number.isFinite(Number(item?.rating)) ? Number(item?.rating) : rating,
        text: typeof item?.text === 'string' ? item.text.trim() : null,
        label: typeof item?.label === 'string' ? item.label.trim() : null,
        labelMeta: typeof item?.labelMeta === 'string' ? item.labelMeta.trim() : null,
        linkHref: typeof item?.linkHref === 'string' ? item.linkHref.trim() : null,
        linkLabel: typeof item?.linkLabel === 'string' ? item.linkLabel.trim() : null,
      }))
      .filter((item) => item.author.length > 0 && Boolean(item.text));
  }, [items, rating]);

  if (!title && !description && normalizedItems.length === 0) return null;

  const hasCustomPadding = Boolean(
    (typeof padding === 'string' && padding.trim()) ||
      (padding && typeof padding === 'object' && ('top' in padding || 'bottom' in padding)),
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? '' : 'pt-[88px] pb-[88px]');
  const sectionBackground = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn(paddingClass, sectionBackground)} style={sectionStyle}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-[15px] 2xl:max-w-[1230px] 2xl:px-[15px]">
        <div className="flex flex-col gap-[20px] lg:flex-row lg:items-start lg:justify-between lg:gap-[32px]">
          <div className="max-w-[693px]">
            {title ? (
              <h2 className="font-heading font-bold text-brand-dark text-[32px] leading-[1.1] md:text-[48px] md:leading-[1.08] 2xl:text-[54px]">
                {title}
              </h2>
            ) : null}
            {description ? (
              <RichText
                html={description}
                className={cn(
                  'mt-2 font-heading text-[16px] leading-[1.5] text-brand-dark/70',
                  'prose-p:my-0 prose-p:font-heading prose-p:text-brand-dark/70 prose-p:leading-[1.5]',
                )}
              />
            ) : null}
          </div>

          <div className="flex items-center gap-[16px]">
            <div className="bg-brand-gradient bg-clip-text font-heading font-bold leading-none text-transparent text-[54px]">
              {formatRating(rating)}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <GoogleGlyph className="h-[34px] w-[34px] md:h-[40px] md:w-[40px]" />
                <StarRow value={rating} size={20} />
              </div>
            </div>
          </div>
        </div>

        {normalizedItems.length > 0 ? (
          <div className="mt-[32px] flex flex-wrap gap-[20px]">
            {normalizedItems.map((item, idx) => {
              const textHtml = item.text
                ? looksLikeHtml(item.text)
                  ? item.text
                  : safeTextToHtml(item.text)
                : null;

              return (
                <article
                  key={`${item.author}-${idx}`}
                  className="flex grow flex-[1_1_100%] min-w-0 rounded-[16px] bg-white px-[16px] py-[32px] shadow-[0px_2px_20.6px_0px_rgba(0,0,0,0.1)] sm:min-w-[350px] sm:flex-[1_1_calc(50%-10px)]"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-[16px]">
                      <div className="flex flex-col gap-1">
                        <p className="font-heading text-[18px] font-bold leading-[normal] text-brand-dark">
                          {item.author}
                        </p>
                        {item.timeAgo ? (
                          <span className="font-heading text-[14px] leading-[normal] text-table-text">
                            {item.timeAgo}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-2">
                      <StarRow value={item.rating ?? rating} size={18} />
                    </div>

                    {textHtml ? (
                      <div className="mt-2">
                        <div style={clampTextStyle}>
                          <RichText
                            html={textHtml}
                            className={cn(
                              'font-heading text-[14px] leading-[normal] text-table-text',
                              'prose-p:my-0 prose-p:font-heading prose-p:text-table-text prose-p:leading-[normal]',
                            )}
                          />
                        </div>
                        <div className="mt-4 font-heading text-[14px] leading-[normal] text-brand-dark">
                          <span className="font-normal text-brand-dark">Review from </span>
                          {item.label ? <span className="font-semibold">{item.label}</span> : null}
                          {item.labelMeta ? (
                            <span className="block font-normal text-brand-dark">{item.labelMeta}</span>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    {item.linkHref ? (
                      <a
                        href={item.linkHref}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block font-heading text-[14px] font-normal leading-[normal] text-[#0062F3] underline"
                      >
                        {item.linkLabel || 'Read the full version on Google'}
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ParksReviews;

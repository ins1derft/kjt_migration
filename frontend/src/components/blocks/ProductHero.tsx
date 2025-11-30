'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import * as Icons from 'lucide-react';
import QuoteModal from './QuoteModal';
import type { ProductBadge } from '@/lib/blocks/types';
import type { FormConfig } from '@/lib/api';
import { cn } from '@/lib/utils';
import RichText from '../RichText';

export interface ProductHeroProps {
  title: string;
  slogan?: string | null;
  description?: string | null;
  rating?: string | number | null;
  reviewCount?: string | null;
  badges?: ProductBadge[];
  formCode?: string | null;
  formTitle?: string | null;
  formConfig?: FormConfig | null;
  ctaLabel?: string | null;
}

const BADGE_MAP: Record<string, string> = {
  Gamepad2: '/icons/products/90-games.svg',
  CheckCircle: '/icons/products/no-subscriptions.svg',
  ShieldCheck: '/icons/products/2Y-warranty.svg',
  Flag: '/icons/products/Made-in-USA.svg',
  RefreshCw: '/icons/products/Free-update.svg',
};

const ProductHero: React.FC<ProductHeroProps> = ({
  title,
  slogan,
  description,
  rating,
  reviewCount,
  badges = [],
  formCode,
  formTitle,
  formConfig,
  ctaLabel,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resolvedRating = rating ?? 5.0;
  const resolvedReviewCount = reviewCount ?? '100+ reviews';

  const filledStars = useMemo(() => {
    const numeric = Number(resolvedRating);
    if (Number.isFinite(numeric)) {
      return Math.min(5, Math.max(0, Math.round(numeric)));
    }
    return 5;
  }, [resolvedRating]);

  const defaultBadges: ProductBadge[] = Object.keys(BADGE_MAP).map((icon) => ({
    icon,
    image: BADGE_MAP[icon],
  }));

  const badgeList = (badges && badges.length ? badges : defaultBadges) ?? defaultBadges;

  const renderBadgeIcon = (iconName: string) => {
    if (BADGE_MAP[iconName]) {
      return (
        <img
          src={BADGE_MAP[iconName]}
          alt={iconName}
          className="h-full w-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-110"
        />
      );
    }

    const IconComponent = (Icons[iconName as keyof typeof Icons] || Icons.Star) as React.ElementType;
    return <IconComponent className="h-[60px] w-[60px] text-brand-dark opacity-80" />;
  };

  const renderBadge = (badge: ProductBadge, idx: number) => {
    if (badge.image) {
      return (
        <div key={`${badge.image}-${idx}`} className="relative flex h-[80px] w-[80px] items-center justify-center">
          <img
            src={badge.image}
            alt={badge.icon ?? `badge-${idx}`}
            className="h-full w-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-110"
          />
        </div>
      );
    }

    const iconKey = badge.icon ?? 'Star';
    return (
      <div key={`${iconKey}-${idx}`} className="relative flex h-[80px] w-[80px] items-center justify-center">
        {renderBadgeIcon(iconKey)}
      </div>
    );
  };

  return (
    <>
      <section className="relative overflow-hidden bg-brand-gray pb-16 pt-[140px]">
        <div className="container relative mx-auto px-4">
          <div className="flex max-w-[1040px] flex-col items-start text-left">
            {slogan && (
              <RichText
                html={slogan}
                className="mb-4 font-sans text-[20px] font-normal leading-[1.4] text-brand-dark"
              />
            )}

            <h1 className="mb-3 bg-brand-gradient bg-clip-text font-heading text-[48px] font-bold leading-none text-transparent md:text-[84px] tracking-tight animate-gradient">
              {title}
            </h1>

            <div className="mb-6 flex items-center gap-6">
              <div className="flex items-center gap-2">
                {resolvedRating && (
                  <span className="font-heading text-[24px] font-bold text-brand-dark">
                    {typeof resolvedRating === 'number' ? Number(resolvedRating).toFixed(1) : resolvedRating}
                  </span>
                )}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={24}
                      className={cn('text-ui-star', i <= filledStars ? 'fill-current' : 'fill-transparent')}
                      stroke="none"
                    />
                  ))}
                </div>
              </div>
              {(resolvedRating || resolvedReviewCount) && <div className="h-6 w-px bg-gray-300" />}
              {resolvedReviewCount && (
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-[27px] w-[27px]" aria-hidden>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="font-heading text-[16px] font-bold text-brand-dark opacity-70">{resolvedReviewCount}</span>
                </div>
              )}
            </div>

            {description && (
              <RichText
                html={description}
                className="mb-10 max-w-[834px] text-[18px] md:text-[22px]"
              />
            )}

            {badgeList.length > 0 && (
              <div className="mb-12 flex flex-wrap justify-start gap-8 md:gap-14">
                {badgeList.map((badge, idx) => renderBadge(badge, idx))}
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex min-h-[57px] items-center justify-center rounded-[129px] bg-gradient-cta px-10 py-[18px] font-heading text-[16px] font-bold text-white shadow-lg transition-all hover:-translate-y-[1px] hover:shadow-cta active:translate-y-0"
            >
              {ctaLabel ?? 'Get a Quote'}
            </button>
          </div>
        </div>
      </section>

      <QuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formTitle ?? 'Get a Quote'}
        submitLabel="Submit"
        formCode={formCode ?? undefined}
        formTitle={formTitle ?? undefined}
        formConfig={formConfig ?? null}
      />
    </>
  );
};

export default ProductHero;

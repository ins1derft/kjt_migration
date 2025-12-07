'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useState } from 'react';
import { Star, type LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import QuoteModal from './QuoteModal';
import ClickSpark from '@/components/bits/ClickSpark';
import type { ProductBadge } from '@/lib/blocks/types';
import type { FormConfig } from '@/lib/api';
import { cn, resolveMediaUrl } from '@/lib/utils';
import RichText from '../RichText';

export interface ProductHeroProps {
  title: string;
  slogan?: string | null;
  description?: string | null;
  rating?: string | number | null;
  reviewCount?: string | null;
  badges?: ProductBadge[];
  badgeVariant?: 'image' | 'card';
  formCode?: string | null;
  formTitle?: string | null;
  formConfig?: FormConfig | null;
  ctaLabel?: string | null;
  hasProduct?: boolean;
}

const BADGE_MAP: Record<string, string> = {
  Gamepad2: '/icons/products/90-games.svg',
  CheckCircle: '/icons/products/no-subscriptions.svg',
  ShieldCheck: '/icons/products/2Y-warranty.svg',
  Flag: '/icons/products/Made-in-USA.svg',
  RefreshCw: '/icons/products/Free-update.svg',
};

const BADGE_LABELS: Record<string, string> = {
  Gamepad2: '90+ Games',
  CheckCircle: 'No Subscriptions',
  ShieldCheck: '2-Year Warranty',
  Flag: 'Made in USA',
  RefreshCw: 'Free Updates',
};

const normalizeBadgeIconSrc = (src: string) => src.replace(/^\/storage\//, '/');

const ProductHero: React.FC<ProductHeroProps> = ({
  title,
  slogan,
  description,
  rating,
  reviewCount,
  badges = [],
  badgeVariant = 'image',
  formCode,
  formTitle,
  formConfig,
  ctaLabel,
  hasProduct = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const effectiveFormCode = formCode ?? formConfig?.code ?? null;
  const showCta = Boolean(hasProduct && effectiveFormCode);

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
    label: BADGE_LABELS[icon] ?? null,
  }));

  const badgeList = (badges && badges.length ? badges : defaultBadges) ?? defaultBadges;

  const renderBadgeIcon = (iconName?: string | null, hoverClass?: string) => {
    if (iconName && BADGE_MAP[iconName]) {
      const iconSrc = normalizeBadgeIconSrc(BADGE_MAP[iconName]);
      return (
        <img
          src={iconSrc}
          alt={iconName}
          className={cn(
            'h-full w-full object-contain drop-shadow-sm transition-transform duration-300',
            hoverClass ?? 'hover:scale-110'
          )}
        />
      );
    }

    const IconComponent = (iconName && Icons[iconName as keyof typeof Icons]) as LucideIcon | undefined;
    const ResolvedIcon: LucideIcon = IconComponent ?? Icons.Star;
    return <ResolvedIcon className="h-[60px] w-[60px] text-brand-dark opacity-80" />;
  };

  const renderBadge = (badge: ProductBadge, idx: number) => {
    const iconKey = badge.icon ?? undefined;
    const imageSrc =
      (badge.image?.startsWith('/icons/') ? badge.image : resolveMediaUrl(badge.image))
      ?? (iconKey ? BADGE_MAP[iconKey] : undefined);

    if (badgeVariant === 'card') {
      return (
        <div
          key={imageSrc ? `${imageSrc}-${idx}` : `badge-card-${idx}`}
          className="bg-white rounded-[14px] p-4 min-w-[120px] md:min-w-[130px] flex flex-col items-start justify-start text-left shadow-[0_2px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-transparent hover:border-brand-sky/20 transition-all duration-300"
        >
          <div className="w-[32px] h-[32px] mb-3 relative flex items-center justify-center">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={badge.label ?? badge.icon ?? `badge-${idx}`}
                className="h-full w-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
              />
            ) : (
              renderBadgeIcon(iconKey, 'hover:scale-105')
            )}
          </div>
          {badge.label && (
            <span className="font-heading font-bold text-[16px] leading-[1.4] text-brand-dark whitespace-pre-line">
              {badge.label}
            </span>
          )}
        </div>
      );
    }

    return (
      <div key={imageSrc ? `${imageSrc}-${idx}` : `badge-${idx}`} className="flex flex-col items-center">
        <div className="relative flex h-[49px] w-[49px] items-center justify-center sm:h-[60px] sm:w-[60px] lg:h-[80px] lg:w-[80px]">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={badge.label ?? badge.icon ?? `badge-${idx}`}
              className="h-full w-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-110"
            />
          ) : (
            renderBadgeIcon(iconKey)
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="relative overflow-hidden bg-brand-gray">
        <div className="container relative mx-auto px-5 sm:px-6 lg:px-10">
          <div className="flex max-w-[1100px] flex-col items-start text-left pt-[128px] pb-14 lg:max-w-[1100px] lg:pb-20 lg:pt-[190px] 2xl:max-w-[1320px]">
            {slogan && (
              <RichText
                html={slogan}
                className="mb-5 font-sans text-[16px] font-normal leading-[1.4] text-brand-dark sm:mb-6 lg:mb-7 lg:text-[24px]"
              />
            )}

            <h1 className="mb-5 bg-brand-gradient bg-clip-text font-heading text-[34px] font-bold leading-none tracking-tight text-transparent sm:mb-6 sm:text-[48px] lg:mb-7 lg:text-[84px]">
              {title}
            </h1>

            <div className="mb-7 flex items-center gap-4 sm:gap-5 lg:mb-8 lg:gap-6">
              <div className="flex items-center gap-2 sm:gap-3">
                {resolvedRating && (
                  <span className="font-heading text-[17px] font-bold leading-[1.4] text-brand-dark/70 lg:text-[20px]">
                    {typeof resolvedRating === 'number' ? Number(resolvedRating).toFixed(1) : resolvedRating}
                  </span>
                )}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      stroke="none"
                      className={cn(
                        'h-[20.8px] w-[20.8px] text-ui-star sm:h-[22px] sm:w-[22px] lg:h-6 lg:w-6',
                        i <= filledStars ? 'fill-current' : 'fill-transparent'
                      )}
                    />
                  ))}
                </div>
              </div>
              {(resolvedRating || resolvedReviewCount) && <div className="hidden h-[26px] w-px bg-gray-300 sm:block lg:h-[30px]" />}
              {resolvedReviewCount && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <svg viewBox="0 0 24 24" className="h-[23px] w-[23px] lg:h-[27px] lg:w-[27px]" aria-hidden>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="font-heading text-[17px] font-bold text-brand-dark/70 lg:text-[20px]">{resolvedReviewCount}</span>
                </div>
              )}
            </div>

            {description && (
              <RichText
                html={description}
                className="mt-1.5 mb-[16px] max-w-[834px] text-[16px] leading-[1.4] text-brand-dark/80 sm:text-[17px] lg:mt-3 lg:mb-[32px] lg:text-[22px]"
              />
            )}

            {badgeList.length > 0 && (
              badgeVariant === 'card' ? (
                <div className="mb-10 flex flex-wrap gap-4 lg:mb-12">
                  {badgeList.map((badge, idx) => renderBadge(badge, idx))}
                </div>
              ) : (
                <div className="mb-[46px] flex flex-wrap justify-start gap-6 sm:gap-7 lg:gap-8">
                  {badgeList.map((badge, idx) => renderBadge(badge, idx))}
                </div>
              )
            )}

            {showCta && (
              <ClickSpark sparkColor="#FFE4F0" sparkCount={10} sparkRadius={18} duration={220} easing="linear" className="inline-block">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex min-h-[57px] min-w-[178px] items-center justify-center rounded-[100px] bg-gradient-cta px-8 py-[18px] font-heading text-[16px] font-bold text-white shadow-lg transition-transform duration-150 hover:shadow-cta hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
                >
                  {ctaLabel ?? 'Get a Quote'}
                </button>
              </ClickSpark>
            )}
          </div>
        </div>
      </section>

      {showCta && (
        <QuoteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={formTitle ?? 'Get a Quote'}
          submitLabel="Submit"
          formCode={effectiveFormCode ?? undefined}
          formTitle={formTitle ?? undefined}
          formConfig={formConfig ?? null}
          topic={formTitle ?? title}
        />
      )}
    </>
  );
};

export default ProductHero;

'use client';

import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, resolveMediaUrl } from '@/lib/utils';
import { getTeamMember, getTeamMembers } from '@/lib/api';
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from '@/lib/blocks/padding';
import type { TeamMember } from '@/lib/blocks/types';
import RichText from '../RichText';

export type TeamGridQuery = {
  limit?: number | null;
  filters?: Record<string, string | number | boolean | null | undefined> | null;
  filter?: { field?: string | null; value?: string | number | boolean | null }[] | null;
  items?: string[] | null;
};

export type TeamGridProps = {
  title?: string | null;
  query?: TeamGridQuery | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

type LoadState = {
  items: TeamMember[];
  loading: boolean;
  error?: string | null;
};

const DEFAULT_LIMIT = 15;

const normalizeItems = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter(Boolean) as string[];
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
  }
  return [];
};

const buildFilters = (
  filters?: Record<string, string | number | boolean | null | undefined> | null,
  filterArray?: { field?: string | null; value?: string | number | boolean | null }[] | null
) => {
  const base: Record<string, string | number | boolean> = {};
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      base[key] = value as string | number | boolean;
    });
  }
  if (Array.isArray(filterArray)) {
    filterArray.forEach((entry) => {
      if (!entry?.field) return;
      const value = entry.value;
      if (value === undefined || value === null || value === '') return;
      base[entry.field] = value as string | number | boolean;
    });
  }
  return base;
};

const MemberCard: React.FC<{ member: TeamMember; variant: 'desktop' | 'tablet' | 'mobile' }> = ({
  member,
  variant,
}) => {
  const isDesktop = variant === 'desktop';
  const isTablet = variant === 'tablet';

  const aspectClass =
    variant === 'desktop'
      ? 'aspect-[315/337]'
      : variant === 'tablet'
        ? 'aspect-[259.875/278.025]'
        : 'aspect-[320/342]';

  const radius = variant === 'desktop' ? 'rounded-[10px]' : 'rounded-[8.25px]';
  const radiusTop = variant === 'desktop' ? 'rounded-t-[10px]' : 'rounded-t-[8.25px]';
  const shadow =
    variant === 'desktop'
      ? 'shadow-[0px_2px_20.6px_rgba(0,0,0,0.1)]'
      : 'shadow-[0px_1.65px_16.995px_rgba(0,0,0,0.1)]';

  return (
    <div
      className={cn(
        'bg-white overflow-hidden',
        radius,
        shadow,
        variant === 'mobile' ? 'w-[320px]' : 'w-full'
      )}
    >
      <div className={cn('relative w-full', radius)}>
        <div className={cn('relative w-full', aspectClass)}>
          <Image
            src={resolveMediaUrl(member.photo) ?? '/images/placeholders/no-image.jpg'}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 25vw, 315px"
            className={cn('object-cover', radiusTop)}
            unoptimized
          />
        </div>
      </div>
      <div
        className={cn(
          'font-heading text-brand-dark',
          isDesktop ? 'px-[20px] pt-[21px] pb-[20px]' : 'px-[17px] pt-[18px] pb-[18px]'
        )}
      >
        <p
          className={cn(
            'font-bold leading-[1.2] text-brand-dark',
            isDesktop ? 'text-[22px]' : isTablet ? 'text-[18.15px]' : 'text-[20px]'
          )}
        >
          {member.name}
        </p>
        {member.role ? (
          <RichText
            html={member.role}
            className={cn(
              'mt-[8px] font-heading leading-[1.4] text-brand-dark/70 prose-p:my-0 prose-headings:my-0 prose-strong:font-semibold',
              isDesktop ? 'text-[14px]' : isTablet ? 'text-[11.55px]' : 'text-[14px]'
            )}
          />
        ) : null}
      </div>
    </div>
  );
};

const SkeletonCard: React.FC<{ variant: 'desktop' | 'tablet' | 'mobile' }> = ({ variant }) => {
  const isDesktop = variant === 'desktop';
  const isTablet = variant === 'tablet';
  const aspectClass =
    variant === 'desktop'
      ? 'aspect-[315/337]'
      : variant === 'tablet'
        ? 'aspect-[259.875/278.025]'
        : 'aspect-[320/342]';
  const radius = variant === 'desktop' ? 'rounded-[10px]' : 'rounded-[8.25px]';
  const shadow =
    variant === 'desktop'
      ? 'shadow-[0px_2px_20.6px_rgba(0,0,0,0.1)]'
      : 'shadow-[0px_1.65px_16.995px_rgba(0,0,0,0.1)]';

  return (
    <div className={cn('bg-white overflow-hidden', radius, shadow, variant === 'mobile' ? 'w-[320px]' : 'w-full')}>
      <div className={cn('relative w-full animate-pulse bg-brand-gray', radius, aspectClass)} />
      <div className={cn(isDesktop ? 'px-[20px] pt-[21px] pb-[20px]' : 'px-[17px] pt-[18px] pb-[18px]')}>
        <div className="h-[26px] w-[160px] rounded bg-brand-gray" />
        <div className="mt-[8px] h-[18px] w-[120px] rounded bg-brand-gray" />
      </div>
    </div>
  );
};

const TeamGrid: React.FC<TeamGridProps> = ({
  title = 'Leadership',
  query,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const [state, setState] = useState<LoadState>({ items: [], loading: true });
  const sectionPadding = resolveSectionPadding(padding, 'pt-[120px] pb-[120px]');
  const sectionBg = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const orderedSlugs = useMemo(() => normalizeItems(query?.items), [query?.items]);
  const filters = useMemo(() => buildFilters(query?.filters, query?.filter), [query?.filters, query?.filter]);
  const limit = query?.limit ?? DEFAULT_LIMIT;

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const items = orderedSlugs.length
          ? (
              await Promise.all(
                orderedSlugs.map(async (slug) => getTeamMember(slug, { fields: ['slug', 'name', 'role', 'department', 'photo', 'bio', 'position'] }))
              )
            ).filter(Boolean) as TeamMember[]
          : await getTeamMembers({
              limit: limit ?? DEFAULT_LIMIT,
              fields: ['slug', 'name', 'role', 'department', 'photo', 'bio', 'position'],
              filter: filters,
            });

        if (!mounted) return;
        setState({ items, loading: false });
      } catch (error) {
        if (!mounted) return;
        setState({ items: [], loading: false, error: error instanceof Error ? error.message : 'Failed to load team' });
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [filters, limit, orderedSlugs]);

  const items = state.items;
  const isLoading = state.loading;
  const activeItems = items.length ? items : isLoading ? Array.from({ length: 8 }) : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length && index >= items.length) {
      setIndex(0);
    }
  }, [items.length, index]);

  const showMobileSlider = items.length > 0 || isLoading;

  return (
    <section className={cn('overflow-hidden', sectionBg, sectionPadding)} style={sectionStyle}>
      <div className="mx-auto container px-5 sm:px-6 md:px-10">
        {title ? (
          <RichText
            html={title}
            className="text-center font-heading font-bold leading-[1.05] text-brand-dark text-[32px] md:text-[64px] prose-headings:font-heading prose-headings:my-0 prose-p:my-0 prose-strong:font-semibold"
          />
        ) : null}

        {/* Desktop / Tablet grid */}
        <div className="hidden md:block">
          <div className="mt-[80px] lg:mt-[96px]">
            <div className="grid grid-cols-2 gap-[16px] md:grid-cols-3 lg:grid-cols-4 lg:gap-[20px]">
              {activeItems.map((item, idx) => {
                const member = item as TeamMember;
                const key = (member && member.slug) || `skeleton-${idx}`;
                const variant = 'desktop';
                return isLoading ? (
                  <SkeletonCard key={key} variant={variant} />
                ) : (
                  <MemberCard key={key} member={member} variant={variant} />
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden mt-[109px] flex justify-center">
          {showMobileSlider ? (
            <div className="relative">
              {isLoading ? (
                <SkeletonCard variant="mobile" />
              ) : items.length ? (
                <>
                  <MemberCard member={items[index]} variant="mobile" />
                  {items.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIndex((prev) => (prev - 1 + items.length) % items.length)}
                        className="absolute left-[-18px] top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white/90 text-brand-dark shadow-xl backdrop-blur-sm transition-all hover:scale-110 hover:bg-brand-sky hover:text-white hover:border-brand-sky"
                        aria-label="Previous member"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIndex((prev) => (prev + 1) % items.length)}
                        className="absolute right-[-18px] top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white/90 text-brand-dark shadow-xl backdrop-blur-sm transition-all hover:scale-110 hover:bg-brand-sky hover:text-white hover:border-brand-sky"
                        aria-label="Next member"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  ) : null}
                </>
              ) : null}
            </div>
          ) : (
            <div className="text-center text-sm text-brand-dark/70">No team members found.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamGrid;

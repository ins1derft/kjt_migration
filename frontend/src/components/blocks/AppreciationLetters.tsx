'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { cn, resolveMediaUrl } from '@/lib/utils';
import { getArticles } from '@/lib/api';
import type { ArticleSummary } from '@/lib/blocks/types';
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from '@/lib/blocks/padding';

export type LettersFilterEntry = {
  key: string;
  value?: string | number | boolean | null;
};

export type LettersTab = {
  key: string;
  label: string;
  limit?: number | null;
  filters?: LettersFilterEntry[] | null;
  items?: string[] | null;
};

export type AppreciationLettersProps = {
  title?: string | null;
  tabs?: LettersTab[] | null;
  query?: {
    limit?: number | null;
    fields?: string[];
    filter?: Record<string, string | number | boolean | null | undefined>;
  } | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

type TabState = {
  items: ArticleSummary[];
  loading: boolean;
  error?: string | null;
  loaded?: boolean;
};

const DEFAULT_FIELDS = ['slug', 'title', 'excerpt', 'featured_image', 'video_id', 'published_at', 'categories'];
const DEFAULT_LIMIT = 3;

const normalizeItems = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter(Boolean) as string[];
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  return [];
};

const buildFilterObject = (entries?: LettersFilterEntry[] | null) => {
  if (!entries || entries.length === 0) return {} as Record<string, string | number | boolean>;
  return entries
    .filter((entry) => entry.key && entry.value !== undefined && entry.value !== null && entry.value !== '')
    .reduce<Record<string, string | number | boolean>>((acc, entry) => {
      acc[entry.key] = entry.value as string | number | boolean;
      return acc;
    }, {});
};

const formatDate = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const resolveCover = (article: ArticleSummary) => {
  if (article.featured_image) {
    return resolveMediaUrl(article.featured_image);
  }
  if (article.video_id) {
    return `https://img.youtube.com/vi/${article.video_id}/maxresdefault.jpg`;
  }
  return '/images/placeholders/no-image.jpg';
};

const resolveArticleLink = (article: ArticleSummary) => {
  if (!article?.slug) return null;
  const categorySlug = article.categories?.[0]?.slug;
  return categorySlug ? `/news/${categorySlug}/${article.slug}` : `/news/${article.slug}`;
};

const AppreciationLetters: React.FC<AppreciationLettersProps> = ({
  title = 'Letters of Appreciation',
  tabs,
  query,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const tabsSafe = useMemo(
    () => (tabs?.length ? tabs : [{ key: 'all', label: 'All', limit: DEFAULT_LIMIT }]),
    [tabs]
  );
  const [activeKey, setActiveKey] = useState<string>(tabsSafe[0].key);
  const [tabData, setTabData] = useState<Record<string, TabState>>(() =>
    Object.fromEntries(tabsSafe.map((tab) => [tab.key, { items: [], loading: false, loaded: false }]))
  );

  const resolvedActiveKey = useMemo(() => {
    if (tabsSafe.some((tab) => tab.key === activeKey)) return activeKey;
    return tabsSafe[0]?.key ?? null;
  }, [activeKey, tabsSafe]);

  const fetchTab = useCallback(
    async (tabKey: string, tab?: LettersTab, current?: TabState) => {
      const explicitSlugs = normalizeItems(tab?.items);
      const limit = tab?.limit ?? query?.limit ?? DEFAULT_LIMIT;
      const filters = {
        ...(query?.filter ?? {}),
        ...buildFilterObject(tab?.filters),
      };

      setTabData((prev) => ({
        ...prev,
        [tabKey]: { items: current?.items ?? [], loading: true, error: null, loaded: current?.loaded ?? false },
      }));

      try {
        const items =
          explicitSlugs.length > 0
            ? await Promise.all(
                explicitSlugs.map(async (slug) => {
                  const res = await getArticles({
                    limit: 1,
                    fields: query?.fields ?? DEFAULT_FIELDS,
                    filter: { slug },
                  });
                  return res[0];
                })
              ).then((list) => list.filter(Boolean) as ArticleSummary[])
            : await getArticles({
                limit: limit ?? DEFAULT_LIMIT,
                fields: query?.fields ?? DEFAULT_FIELDS,
                filter: filters,
              });

        setTabData((prev) => ({
          ...prev,
          [tabKey]: { items, loading: false, error: null, loaded: true },
        }));
      } catch (error) {
        setTabData((prev) => ({
          ...prev,
          [tabKey]: {
            items: current?.items ?? [],
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to load articles',
            loaded: true,
          },
        }));
      }
    },
    [query?.fields, query?.filter, query?.limit]
  );

  useEffect(() => {
    if (!resolvedActiveKey) return;

    const current = tabData[resolvedActiveKey];
    if (current && (current.loaded || current.loading)) return;

    const tab = tabsSafe.find((t) => t.key === resolvedActiveKey);
    void fetchTab(resolvedActiveKey, tab, current);
  }, [resolvedActiveKey, tabData, tabsSafe, fetchTab]);

  const activeTab = resolvedActiveKey
    ? tabsSafe.find((t) => t.key === resolvedActiveKey) ?? tabsSafe[0]
    : null;
  const activeState = resolvedActiveKey ? tabData[resolvedActiveKey] : undefined;
  const hasTitle = Boolean(title?.trim());

  if (!activeTab) return null;

  const paddingClass = resolveSectionPadding(padding, 'pt-[108px] pb-[140px]');
  const sectionBackground = resolveSectionBackground(backgroundClass, 'bg-white');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const hasTabs = tabsSafe.length > 1;
  const cards = activeState?.items ?? [];
  const isLoading = activeState?.loading;

  const activeTabClass = 'bg-white text-table-text shadow-[0px_1px_10px_rgba(0,0,0,0.05)]';
  const inactiveTabClass = 'bg-transparent text-table-text hover:text-brand-dark';

  return (
    <section className={cn('overflow-hidden', sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-10">
        {hasTitle ? (
          <h2 className="mx-auto w-full max-w-[992px] text-center font-heading text-[38px] font-bold leading-[1.05] text-brand-dark md:text-[64px]">
            {title}
          </h2>
        ) : null}
      </div>

      <div className="container mx-auto px-5 sm:px-6 lg:px-10">
        <div className={cn("relative", hasTitle ? "mt-[72px] md:mt-[96px]" : "mt-0")}>
          {hasTabs ? (
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[44px]">
              <div className="flex flex-wrap items-center justify-center gap-x-[8px] gap-y-[10px] rounded-[100px] bg-brand-gray px-[13px] py-[11px]">
                {tabsSafe.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveKey(tab.key)}
                    className={cn(
                      'h-[48px] min-w-[138px] rounded-[100px] px-[20px] text-[14px] font-heading font-extrabold leading-[normal] transition-colors duration-200 md:h-[65px] md:min-w-[161px] md:px-[28px] md:text-[20px] whitespace-nowrap',
                      resolvedActiveKey === tab.key ? activeTabClass : inactiveTabClass
                    )}
                    aria-pressed={resolvedActiveKey === tab.key}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-[20px] bg-brand-gray px-[20px] pb-[72px] pt-[88px] sm:px-[28px] md:px-[46px] md:pt-[104px] md:pb-[92px]">
            <div className="space-y-[50px]">
              {(isLoading ? Array.from({ length: 3 }) : cards).map((rawItem, idx) => {
                const article = (rawItem as ArticleSummary) ?? ({} as ArticleSummary);
                const link = isLoading ? null : resolveArticleLink(article);
                const key = isLoading ? `skeleton-${idx}` : article.slug ?? idx;
                const isImageLeft = idx % 2 === 0;
                const imagePriority = !isLoading && idx < 2;

                const content = (
                  <div className="grid grid-cols-1 gap-y-[24px] md:grid-cols-2 md:items-start md:gap-x-[54px]">
                    {isImageLeft ? (
                      <MediaBlock article={article} loading={Boolean(isLoading)} priority={imagePriority} link={link} />
                    ) : (
                      <TextBlock article={article} loading={Boolean(isLoading)} link={link} />
                    )}

                    {isImageLeft ? (
                      <TextBlock article={article} loading={Boolean(isLoading)} link={link} />
                    ) : (
                      <MediaBlock article={article} loading={Boolean(isLoading)} priority={imagePriority} link={link} />
                    )}
                  </div>
                );

                const isLast = isLoading ? idx === 2 : idx === cards.length - 1;

                return (
                  <div key={key}>
                    {content}
                    {!isLast ? (
                      <div className="mt-[50px] border-t border-[#e1e4eb]" />
                    ) : null}
                  </div>
                );
              })}

              {!isLoading && cards.length === 0 ? (
                <div className="text-center text-[16px] font-sans text-brand-dark/70">No articles found for this filter.</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

type BlockProps = {
  article: ArticleSummary;
  loading: boolean;
  priority?: boolean;
  link?: string | null;
};

const MediaBlock: React.FC<BlockProps> = ({ article, loading, priority = false, link }) => {
  const cover = resolveCover(article) || '/images/placeholders/no-image.jpg';
  const [loadedCover, setLoadedCover] = useState<string | null>(null);
  const showSkeleton = loading || loadedCover !== cover;

  return (
    <div className="relative w-full overflow-hidden rounded-[10px] bg-brand-gray md:min-h-[326px]">
      <div className="relative aspect-[1.835] w-full md:h-[326px] md:aspect-[598/326]">
        {link ? (
          <a href={link} className="block h-full w-full">
              <Image
                src={cover}
                alt={article.title ?? 'Article cover'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                className="object-cover transition-opacity duration-300"
                priority={priority}
                loading={priority ? 'eager' : 'lazy'}
                onLoad={() => setLoadedCover(cover)}
                unoptimized
              />
              {showSkeleton ? <div className="absolute inset-0 animate-pulse bg-brand-gray/60" aria-hidden /> : null}
          </a>
        ) : (
          <>
            <Image
              src={cover}
              alt={article.title ?? 'Article cover'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
              className="object-cover transition-opacity duration-300"
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              onLoad={() => setLoadedCover(cover)}
              unoptimized
            />
            {showSkeleton ? <div className="absolute inset-0 animate-pulse bg-brand-gray/60" aria-hidden /> : null}
          </>
        )}
      </div>
    </div>
  );
};

const TextBlock: React.FC<BlockProps> = ({ article, loading, link }) => {
  return (
    <div className="md:pt-[42px] md:max-w-[538px]">
      <p className={cn('font-heading text-[14px] font-bold leading-[1.2] text-brand-dark/50 md:text-[16px]', loading && 'animate-pulse bg-brand-gray text-transparent')}>
        {loading ? 'March 28, 2024' : formatDate(article.published_at)}
      </p>
      <h3
        className={cn(
          'mt-[16px] font-heading text-[20px] font-bold leading-[1.2] text-brand-dark md:text-[24px]',
          loading && 'animate-pulse bg-brand-gray text-transparent'
        )}
      >
        {loading ? (
          'Loading title placeholder text'
        ) : link ? (
          <a href={link} className="hover:text-brand-sky transition-colors">
            {article.title}
          </a>
        ) : (
          article.title
        )}
      </h3>
      <p
        className={cn(
          'mt-[20px] font-sans text-[16px] font-normal leading-[1.4] text-brand-dark/70 md:text-[20px] md:max-w-[502px]',
          loading && 'animate-pulse bg-brand-gray text-transparent'
        )}
      >
        {loading
          ? 'Loading excerpt placeholder text will appear here while data fetches.'
          : article.excerpt ?? ''}
      </p>
    </div>
  );
};

export default AppreciationLetters;

'use client';

import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import RichText from '@/components/RichText';
import { getArticles } from '@/lib/api';
import { cn, resolveMediaUrl } from '@/lib/utils';
import type { ArticleSummary } from '@/lib/blocks/types';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';

export type NewsListQuery = {
  limit?: number;
  fields?: string[];
  filter?: Record<string, string | number | boolean | null | undefined> | Array<{ field?: string; key?: string; value?: string | number | boolean | null }>;
  items?: string[];
};

export type NewsListProps = {
  query?: NewsListQuery;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

type ArticleCard = {
  id: string;
  title: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  image?: string | null;
  link: string | null;
  categories: { slug: string; name: string }[];
};

type CategoryOption = {
  key: string;
  label: string;
  value: string;
};

const DEFAULT_LIMIT = 6;

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

const normalizeFilters = (
  value?: NewsListQuery['filter']
): Record<string, string | number | boolean | null | undefined> => {
  if (!value) return {};
  if (Array.isArray(value)) {
    return value.reduce<Record<string, string | number | boolean | null | undefined>>((acc, entry) => {
      const key = entry.field ?? entry.key;
      if (!key) return acc;
      acc[key] = entry.value ?? null;
      return acc;
    }, {});
  }
  return value;
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

const NewsList: React.FC<NewsListProps> = ({ query, padding, backgroundClass, backgroundColor }) => {
  const pageSize = query?.limit ?? DEFAULT_LIMIT;
  const [articles, setArticles] = useState<ArticleCard[]>([]);
  const [allArticles, setAllArticles] = useState<ArticleCard[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const baseFilters = useMemo(() => normalizeFilters(query?.filter), [query?.filter]);
  const fields = query?.fields;

  const categoryOptions = useMemo(
    () => [{ key: 'all', label: 'All', value: 'all' }, ...categories],
    [categories]
  );

  const resolveCategory = (key: string): { value: string | null } => {
    if (key === 'all') return { value: null };
    const match = categories.find((c) => c.key === key);
    return { value: match?.value ?? null };
  };

  const mapArticle = (article: ArticleSummary): ArticleCard => {
    return {
      id: article.slug,
      title: article.title,
      excerpt: article.excerpt ?? null,
      publishedAt: article.published_at ?? null,
      image: resolveCover(article),
      link: resolveArticleLink(article),
      categories: (article.categories ?? []).filter((c) => Boolean(c?.slug && c?.name)),
    };
  };

  const collectCategories = (mapped: ArticleCard[]) => {
    const map = new Map<string, CategoryOption>();
    mapped.forEach((article) => {
      article.categories.forEach((category) => {
        const slug = category.slug?.trim();
        const name = category.name?.trim();
        if (!slug || !name) return;
        if (!map.has(slug)) {
          map.set(slug, { key: slug, label: name, value: slug });
        }
      });
    });
    return Array.from(map.values());
  };

  const buildOptions = (options: { limit?: number; page?: number; filter?: NewsListQuery['filter'] }) => {
    return {
      ...options,
      ...(fields && fields.length ? { fields } : {}),
    };
  };

  const fetchExplicit = async () => {
    const explicitSlugs = normalizeItems(query?.items);
    if (explicitSlugs.length === 0) return false;
    setLoading(true);
    try {
      const items = (
        await Promise.all(
          explicitSlugs.map(async (slug) => {
            const res = await getArticles(
              buildOptions({
                limit: 1,
                filter: { slug },
              })
            );
            return res[0];
          })
        )
      ).filter(Boolean) as ArticleSummary[];

      const mapped = items.map(mapArticle);
      setAllArticles(mapped);
      setArticles(mapped);
      setCategories(collectCategories(mapped));
      setHasMore(false);
      setPage(1);
      return true;
    } finally {
      setLoading(false);
    }
  };

  const fetchPage = async (pageNumber: number, category: { value: string | null }) => {
    setLoading(true);
    try {
      const filter = {
        ...baseFilters,
        ...(category.value ? { category: category.value } : {}),
      } as Record<string, string | number | boolean | null | undefined>;

      const items = await getArticles(
        buildOptions({
          limit: pageSize,
          page: pageNumber,
          filter,
        })
      );

      const mapped = items.map(mapArticle);

      setArticles((prev) => (pageNumber === 1 ? mapped : [...prev, ...mapped]));
      setCategories((prev) => {
        const collected = collectCategories(mapped);
        const map = new Map(prev.map((item) => [item.key, item] as const));
        collected.forEach((item) => {
          if (!map.has(item.key)) {
            map.set(item.key, item);
          }
        });
        return Array.from(map.values());
      });
      setHasMore(mapped.length === pageSize);
      setPage(pageNumber);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      const handled = await fetchExplicit();
      if (!handled) {
        fetchPage(1, resolveCategory(activeCategoryKey));
      }
    };
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, JSON.stringify(baseFilters), fields, JSON.stringify(query?.items ?? [])]);

  const handleCategoryChange = (catKey: string) => {
    setActiveCategoryKey(catKey);
    if (allArticles.length > 0) {
      if (catKey === 'all') {
        setArticles(allArticles);
        return;
      }
      setArticles(
        allArticles.filter((article) =>
          article.categories.some((category) => category.slug === catKey)
        )
      );
      return;
    }
    fetchPage(1, resolveCategory(catKey));
  };

  const handleLoadMore = () => {
    if (allArticles.length > 0) return;
    if (loading || !hasMore) return;
    fetchPage(page + 1, resolveCategory(activeCategoryKey));
  };

  const paddingClass = resolveSectionPadding(padding, 'pt-[70px] pb-[120px]');
  const sectionBackground = resolveSectionBackground(backgroundClass, 'bg-white');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn('w-full', sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto w-full px-5 sm:px-6 lg:px-10 2xl:max-w-[1320px] 2xl:px-0">
        <div className="mb-12">
          <div className="flex flex-wrap gap-[15px]">
            {categoryOptions.map((cat) => {
              const isActive = activeCategoryKey === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className={cn(
                    'h-[65px] px-[32px] rounded-full font-heading text-[20px] font-[800] transition-all duration-200 border',
                    isActive
                      ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-md'
                      : 'bg-transparent text-[#4f5459] border-[#4f5459] hover:bg-[#4f5459]/5'
                  )}
                  disabled={loading && isActive}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading && articles.length === 0 ? (
          <p className="font-heading text-[18px] text-brand-dark/60">Loading news...</p>
        ) : null}

        {!loading && articles.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-sans text-lg">
            No news found in this category.
          </div>
        ) : null}

        {articles.length > 0 ? (
          <div className="divide-y divide-ui-dot">
            {articles.map((article, index) => {
              const dateLabel = formatDate(article.publishedAt) || 'Published soon';

              return (
                <article key={`${article.id}-${index}`} className="py-[36px] md:py-[42px]">
                  <div
                    className={cn(
                      'flex flex-col gap-[24px] lg:flex-row lg:items-start lg:gap-[60px]',
                      index % 2 === 1 && 'lg:flex-row-reverse'
                    )}
                  >
                    <div className="relative w-full overflow-hidden rounded-[10px] bg-white/30 h-[240px] sm:h-[280px] md:h-[300px] lg:h-[326px] lg:w-[598px]">
                      {article.link ? (
                        <a href={article.link} className="block h-full w-full">
                          <Image
                            src={article.image ?? '/images/placeholders/no-image.jpg'}
                            alt={article.title}
                            fill
                            sizes="(min-width: 1024px) 598px, 100vw"
                            className="object-cover"
                            unoptimized
                          />
                        </a>
                      ) : (
                        <Image
                          src={article.image ?? '/images/placeholders/no-image.jpg'}
                          alt={article.title}
                          fill
                          sizes="(min-width: 1024px) 598px, 100vw"
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>

                    <div className="flex max-w-[538px] flex-1 flex-col">
                      <p className="font-heading text-[16px] font-bold leading-[1.2] text-brand-dark/50">
                        {dateLabel}
                      </p>
                      <h3 className="mt-[18px] font-heading text-[22px] md:text-[24px] font-bold leading-[1.2] text-brand-dark">
                        {article.link ? (
                          <a href={article.link} className="transition-opacity hover:opacity-80">
                            {article.title}
                          </a>
                        ) : (
                          article.title
                        )}
                      </h3>
                      {article.excerpt ? (
                        <RichText
                          html={article.excerpt}
                          className="mt-[28px] max-w-[502px] font-heading text-[18px] md:text-[20px] leading-[1.4] text-brand-dark/70 prose-p:my-0"
                        />
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}

        {hasMore ? (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              className="bg-[#1a1a1a] text-white font-heading font-bold text-[16px] py-[16px] px-[48px] rounded-[100px] min-w-[179px] min-h-[53px] shadow-lg hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default NewsList;

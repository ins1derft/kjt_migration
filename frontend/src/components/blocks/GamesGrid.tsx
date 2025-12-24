'use client';
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { Play, ChevronRight, X } from "lucide-react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { getGameCategories, getGames } from "@/lib/api";
import { withYouTubeOrigin } from "@/lib/youtube";
import RichText from "../RichText";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";
import type { GameSummary } from "@/lib/blocks/types";

export interface GamesGridQuery {
  limit?: number;
  fields?: string[];
  filter?: Record<string, string | number | boolean | null | undefined>;
  items?: string[];
}

export interface GamesGridProps {
  title?: string;
  description?: string;
  query?: GamesGridQuery;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

type GameCard = {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  category?: string | null;
  categoryField?: CategoryOption['field'];
  link: string;
  videoId?: string | null;
};

type CategoryOption = {
  key: string;
  label: string;
  value: string;
  field: 'genre' | 'game_type' | 'category';
};

const DEFAULT_LIMIT = 9;
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

const resolveYouTubeEmbedSrc = (videoId: string) =>
  withYouTubeOrigin(
    `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1&playsinline=1`
  );

const GamesGrid: React.FC<GamesGridProps> = ({ title, description, query, padding, backgroundClass, backgroundColor }) => {
  const pageSize = query?.limit ?? DEFAULT_LIMIT;
  const [games, setGames] = useState<GameCard[]>([]);
  const [allGames, setAllGames] = useState<GameCard[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [catalogCategories, setCatalogCategories] = useState<CategoryOption[]>([]);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalVideoId, setModalVideoId] = useState<string | null>(null);

  const baseFilters = useMemo(() => query?.filter ?? {}, [query?.filter]);
  const fields = query?.fields;
  const explicitSlugs = useMemo(() => normalizeItems(query?.items), [query?.items]);
  const hasBaseFilters = useMemo(
    () => Object.values(baseFilters).some((value) => value !== undefined && value !== null && value !== ''),
    [baseFilters]
  );
  const canUseCatalogCategories = !hasBaseFilters && explicitSlugs.length === 0;

  const effectiveCategories = useMemo(
    () => (catalogCategories.length ? catalogCategories : categories),
    [catalogCategories, categories]
  );

  const categoryOptions = useMemo(
    () => [{ key: 'all', label: 'All', value: 'All', field: 'category' as const }, ...effectiveCategories],
    [effectiveCategories]
  );

  const resolveCategory = (key: string): { value: string | null; field: CategoryOption['field'] | null } => {
    if (key === 'all') return { value: null, field: null };
    const match = effectiveCategories.find((c) => c.key === key);
    return { value: match?.value ?? null, field: match?.field ?? null };
  };

  const mapGame = (game: GameSummary): GameCard => {
    const categoryName =
      game.genre ||
      game.game_type ||
      (game.categories && game.categories[0]?.name) ||
      null;
    const categoryField: CategoryOption['field'] = game.genre
      ? 'genre'
      : (game.game_type ? 'game_type' : 'category');

    return {
      id: game.slug,
      title: game.title,
      description: game.excerpt ?? null,
      image: resolveMediaUrl(game.hero_image) ?? "/images/placeholders/no-image.jpg",
      category: categoryName,
      categoryField,
      link: `/games/${game.slug}`,
      videoId: game.video_id ?? null,
    };
  };

  const collectCategories = (mapped: GameCard[]) => {
    const map = new Map<string, CategoryOption>();
    mapped
      .filter((g) => g.category)
      .forEach((g) => {
        const key = g.category!.trim().toLowerCase();
        if (!key) return;
        const label = g.category!.charAt(0).toUpperCase() + g.category!.slice(1);
        const existing = map.get(key);
        if (!existing) {
          map.set(key, { key, label, value: g.category!, field: g.categoryField ?? 'category' });
          return;
        }
        if (existing.field !== 'genre' && g.categoryField === 'genre') {
          map.set(key, { key, label, value: g.category!, field: g.categoryField ?? 'category' });
        }
      });
    return Array.from(map.values());
  };

  const fetchExplicit = async () => {
    if (explicitSlugs.length === 0) return false;
    setLoading(true);
    try {
      const items = (
        await Promise.all(
          explicitSlugs.map(async (slug) => {
            const res = await getGames({
              limit: 1,
              fields,
              filter: { slug },
            });
            return res[0];
          })
        )
      ).filter(Boolean) as GameSummary[];

      const mapped = items.map(mapGame);
      setAllGames(mapped);
      setGames(mapped);
      setCategories(collectCategories(mapped));
      setHasMore(false);
      setPage(1);
      return true;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    if (!canUseCatalogCategories) {
      setCatalogCategories([]);
      return;
    }

    getGameCategories({ includeEmpty: false })
      .then((items) => {
        if (cancelled) return;
        setCatalogCategories(
          items.map((category) => ({
            key: category.slug,
            label: category.name,
            value: category.slug,
            field: 'category',
          }))
        );
      })
      .catch(() => {
        if (!cancelled) setCatalogCategories([]);
      });

    return () => {
      cancelled = true;
    };
  }, [canUseCatalogCategories]);

  const fetchPage = async (pageNumber: number, category: { value: string | null; field: CategoryOption['field'] | null }) => {
    setLoading(true);
    try {
      const filter = {
        ...baseFilters,
        ...(category.value && category.field === 'game_type' ? { game_type: category.value } : {}),
        ...(category.value && category.field === 'genre' ? { genre: category.value } : {}),
        ...(category.value && category.field === 'category' ? { category: category.value } : {}),
      } as Record<string, string | number | boolean | null | undefined>;

      const items = await getGames({
        limit: pageSize,
        page: pageNumber,
        fields,
        filter,
      });

      const mapped: GameCard[] = items.map(mapGame);

      setGames((prev) => (pageNumber === 1 ? mapped : [...prev, ...mapped]));
      setCategories((prev) => {
        const collected = collectCategories(mapped);
        const map = new Map(prev.map((item) => [item.key, item] as const));
        collected.forEach((c) => {
          const existing = map.get(c.key);
          if (!existing || (existing.field !== 'genre' && c.field === 'genre')) {
            map.set(c.key, c);
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
    if (allGames.length > 0) {
      const { value } = resolveCategory(catKey);
      if (!value) {
        setGames(allGames);
      } else {
        setGames(allGames.filter((g) => (g.category ?? '').toLowerCase() === value.toLowerCase()));
      }
      return;
    }
    fetchPage(1, resolveCategory(catKey));
  };

  const handleLoadMore = () => {
    if (allGames.length > 0) return;
    if (loading || !hasMore) return;
    fetchPage(page + 1, resolveCategory(activeCategoryKey));
  };

  useEffect(() => {
    if (modalVideoId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalVideoId]);

  useEffect(() => {
    if (!modalVideoId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModalVideoId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalVideoId]);

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "py-20");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-white");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const modalEmbed = modalVideoId ? resolveYouTubeEmbedSrc(modalVideoId) : null;

  return (
    <section className={cn(sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-10">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="mx-auto w-full max-w-[992px] font-heading font-bold text-[40px] md:text-[64px] leading-tight text-brand-dark mb-4">
                {title}
              </h2>
            )}
            {description && (
              <RichText
                html={description}
                className="font-sans text-lg md:text-[20px] text-gray-600 max-w-6xl mx-auto"
              />
            )}
          </div>
        )}

        {/* Filter Chips */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-[15px]">
            {categoryOptions.map((cat) => {
              const isActive = activeCategoryKey === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className={cn(
                    "h-[65px] px-[32px] rounded-full font-heading text-[20px] font-[800] transition-all duration-200 border",
                    isActive
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-md"
                      : "bg-transparent text-[#4f5459] border-[#4f5459] hover:bg-[#4f5459]/5"
                  )}
                  disabled={loading && isActive}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[21px] mb-16">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-[10px] p-[25px_29px_24px_29px] shadow-[0px_2px_20.6px_0px_rgba(0,0,0,0.10)] flex flex-col group h-full hover:-translate-y-1 transition-transform duration-300"
            >
              {game.videoId ? (
                <button
                  type="button"
                  onClick={() => setModalVideoId(game.videoId?.trim() || null)}
                  aria-label="Play game video"
                  className="relative mb-6 block w-full overflow-hidden rounded-[10px] bg-gray-100 aspect-[368/160] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
                >
                  <Image
                    src={game.image ?? "/images/placeholders/no-image.jpg"}
                    alt={game.title}
                    fill
                    sizes="(min-width: 1024px) 368px, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:scale-105">
                      <Play className="h-7 w-7" />
                    </span>
                  </span>
                </button>
              ) : (
                <a
                  href={game.link}
                  className="relative mb-6 block overflow-hidden rounded-[10px] bg-gray-100 aspect-[368/160]"
                >
                  <Image
                    src={game.image ?? "/images/placeholders/no-image.jpg"}
                    alt={game.title}
                    fill
                    sizes="(min-width: 1024px) 368px, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:scale-105">
                      <Play className="h-7 w-7" />
                    </span>
                  </span>
                </a>
              )}

              <div className="flex flex-col flex-grow">
                <a href={game.link} className="inline-block hover:text-brand-sky transition-colors">
                  <h3 className="font-heading text-[24px] font-[400] text-[#1a1a1a] mb-2 leading-[1.2]">
                    {game.title}
                  </h3>
                </a>
                <RichText
                  html={game.description ?? ''}
                  className="font-sans text-[16px] text-[#1a1a1a] opacity-70 leading-[1.4] mb-6 flex-grow line-clamp-4 prose prose-p:my-0 prose-ul:my-0 prose-li:my-0"
                />
                <a
                  href={game.link}
                  className="flex items-center gap-1 font-sans text-[16px] font-bold text-[#1a1a1a] hover:text-brand-sky transition-colors self-start mt-auto"
                >
                  Learn More <ChevronRight size={16} strokeWidth={3} className="mt-[2px]" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && games.length === 0 && (
          <div className="text-center py-20 text-gray-500 font-sans text-lg">
            No games found in this category.
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              className="bg-[#1a1a1a] text-white font-heading font-bold text-[16px] py-[16px] px-[48px] rounded-[100px] min-w-[179px] min-h-[53px] shadow-lg hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        {modalVideoId && modalEmbed && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <button
              aria-label="Close video"
              onClick={() => setModalVideoId(null)}
              className="absolute right-6 top-6 z-10 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <X size={32} />
            </button>

            <div className="absolute inset-0" onClick={() => setModalVideoId(null)} />

            <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl">
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src={modalEmbed}
                  title="Game video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GamesGrid;

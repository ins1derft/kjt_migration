import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { getGames } from "@/lib/api";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";
import RichText from "../RichText";

export interface GalleryGame {
  slug: string;
  title: string;
  img: string;
}

export interface GamesGalleryQuery {
  limit?: number;
  fields?: string[];
  filter?: Record<string, string | number | boolean | null | undefined>;
  items?: string[];
}

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

export interface GamesGalleryProps {
  title: string;
  description: string;
  query?: GamesGalleryQuery;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

const distribute = (games: GalleryGame[]) => {
  const rows: [GalleryGame[], GalleryGame[], GalleryGame[]] = [[], [], []];

  if (games.length === 0) {
    return { row1: [], row2: [], row3: [] };
  }

  // Round-robin seed
  games.forEach((game, idx) => {
    rows[idx % 3].push(game);
  });

  // Pad rows to avoid sparse marquee: aim for at least minPerRow items per row.
  const minPerRow = Math.min(6, Math.max(3, Math.ceil(games.length / 2)));
  rows.forEach((row) => {
    let i = 0;
    while (row.length < minPerRow) {
      row.push(games[i % games.length]);
      i += 1;
      // Safety break in extreme edge cases
      if (i > games.length * 3) break;
    }
  });

  return { row1: rows[0], row2: rows[1], row3: rows[2] };
};

const GameCard = ({ game }: { game: GalleryGame }) => (
  <Link
    href={`/games/${game.slug}`}
    className="relative w-[235px] sm:w-[260px] md:w-[300px] lg:w-[340px] xl:w-[360px] 2xl:w-[384px] aspect-[16/9] group overflow-hidden rounded-[15px] cursor-pointer shrink-0"
  >
    <Image
      src={game.img}
      alt={game.title || game.slug || 'Game image'}
      fill
      sizes="(max-width: 640px) 235px, (max-width: 768px) 260px, (max-width: 1024px) 300px, (max-width: 1280px) 340px, 384px"
      className="object-cover transition-transform duration-500 group-hover:scale-110"
      draggable={false}
      unoptimized
    />
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 px-4 text-center">
      <span className="font-heading font-bold text-white text-[16px] md:text-[18px] leading-[1.1] line-clamp-2 drop-shadow">
        {game.title}
      </span>
      <span className="bg-white text-brand-dark font-bold py-2 px-5 rounded-full text-sm md:text-base leading-none shadow-sm">
        Learn More
      </span>
    </div>
  </Link>
);

interface MarqueeRowProps {
  items: GalleryGame[];
  baseDurationSeconds: number;
  reverse?: boolean;
}

const MARQUEE_BASELINE_ITEM_COUNT = 24;

const MarqueeRow: React.FC<MarqueeRowProps> = ({ items, baseDurationSeconds, reverse = false }) => {
  // Repeat items enough times to fill a wide screen and create a loop buffer
  const repeatedItems = [...items, ...items, ...items, ...items];
  const resolvedDurationSeconds =
    repeatedItems.length > 0
      ? baseDurationSeconds * (repeatedItems.length / MARQUEE_BASELINE_ITEM_COUNT)
      : baseDurationSeconds;
  const resolvedDuration = `${resolvedDurationSeconds.toFixed(2)}s`;

  return (
    <div className="flex overflow-hidden gap-5 select-none group/row">
      <div
        className={cn(
          "flex shrink-0 gap-5 items-center min-w-full",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
        style={{ animationDuration: resolvedDuration }}
      >
        {repeatedItems.map((game, i) => (
          <GameCard key={`${i}-a`} game={game} />
        ))}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 gap-5 items-center min-w-full",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
        style={{ animationDuration: resolvedDuration }}
      >
        {repeatedItems.map((game, i) => (
          <GameCard key={`${i}-b`} game={game} />
        ))}
      </div>
    </div>
  );
};

const GamesGallery = async ({ title, description, query, padding, backgroundClass, backgroundColor }: GamesGalleryProps) => {
  const explicitSlugs = normalizeItems(query?.items);
  const gamesData = explicitSlugs.length
    ? (
        await Promise.all(
          explicitSlugs.map(async (slug) => {
            const res = await getGames({
              limit: 1,
              fields: query?.fields,
              filter: { slug },
            });
            return res[0];
          })
        )
      ).filter(Boolean)
    : await getGames({
        limit: query?.limit ?? 12,
        fields: query?.fields,
        filter: query?.filter,
      });
  const games: GalleryGame[] = gamesData.map((game) => ({
    slug: game.slug,
    title: game.title,
    img: resolveMediaUrl(game.hero_image) ?? "/images/placeholders/no-image.jpg",
  }));

  const { row1, row2, row3 } = distribute(games);
  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "pt-[140px] pb-[85px]");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-white");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const hasTitle = Boolean(title?.trim());
  const hasDescription = Boolean(description?.trim());
  const hasHeader = hasTitle || hasDescription;

  return (
    <section className={cn(paddingClass, sectionBackground, "overflow-hidden")} style={sectionStyle}>
        {/* Inject CSS for Marquee Animations within the component to avoid global pollution */}
        <style>{`
            @keyframes marquee {
                from { transform: translateX(0); }
                to { transform: translateX(calc(-100% - 20px)); } /* 20px matches gap-5 */
            }
            @keyframes marquee-reverse {
                from { transform: translateX(calc(-100% - 20px)); }
                to { transform: translateX(0); }
            }
            .animate-marquee {
                animation: marquee linear infinite;
            }
            .animate-marquee-reverse {
                animation: marquee-reverse linear infinite;
            }
            /* Pause only the specific row being hovered */
            .group\\/row:hover .animate-marquee,
            .group\\/row:hover .animate-marquee-reverse {
                animation-play-state: paused;
            }
        `}</style>

        {hasHeader && (
          <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 xl:px-0 text-center mb-12 sm:mb-14 lg:mb-16 flex flex-col items-center gap-4 lg:gap-[15px]">
            {hasTitle && (
              <h2 className="mx-auto max-w-[1320px] font-heading font-bold text-[38px] leading-[42px] sm:text-[48px] sm:leading-[52px] lg:text-[64px] lg:leading-[68px] text-brand-dark">
                {title}
              </h2>
            )}
            {hasDescription && (
              <RichText
                html={description}
                className="font-heading text-[16px] leading-[22.4px] sm:text-[18px] sm:leading-[25px] lg:text-[20px] lg:leading-[28px] text-brand-dark/70 max-w-[711px] mx-auto text-center prose-p:my-0 prose-headings:font-heading prose-headings:text-brand-dark prose-headings:mb-3 prose-ul:text-left prose-ol:text-left prose-ul:pl-6 prose-ol:pl-6"
              />
            )}
          </div>
        )}

        <div className="w-full pb-20 lg:pb-24">
          <div className="flex flex-col gap-5 w-full">
              <MarqueeRow items={row1} baseDurationSeconds={80} />
              <MarqueeRow items={row2} baseDurationSeconds={70} reverse />
              <MarqueeRow items={row3} baseDurationSeconds={90} />
          </div>
        </div>
        
    </section>
  );
};

export default GamesGallery;

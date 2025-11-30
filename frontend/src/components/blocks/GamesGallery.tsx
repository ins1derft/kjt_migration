
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { cn } from "@/lib/utils";
import { getGames } from "@/lib/api";

export interface GalleryGame {
  title: string;
  img: string;
}

export interface GamesGalleryQuery {
  limit?: number;
  fields?: string[];
  filter?: Record<string, string | number | boolean | null | undefined>;
}

export interface GamesGalleryProps {
  title: string;
  description: string;
  query?: GamesGalleryQuery;
}

const distribute = (games: GalleryGame[]) => {
  const row1 = games.slice(0, 3);
  const row2 = games.slice(3, 6);
  const row3 = [...games.slice(6, 8), games[0]].filter(Boolean);
  return { row1, row2, row3 };
};

const GameCard = ({ game }: { game: GalleryGame }) => (
    <div className="relative w-[300px] md:w-[400px] aspect-video group overflow-hidden rounded-xl cursor-pointer shrink-0">
        <img 
            src={game.img} 
            alt={game.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            draggable={false}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white text-brand-dark font-bold py-2 px-6 rounded-full text-sm">
                Learn More
            </span>
        </div>
    </div>
);

interface MarqueeRowProps {
    items: GalleryGame[];
    duration: string;
    reverse?: boolean;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({ items, duration, reverse = false }) => {
    // Repeat items enough times to fill a wide screen and create a loop buffer
    const repeatedItems = [...items, ...items, ...items, ...items]; 

    return (
        <div className="flex overflow-hidden gap-6 select-none group/row py-2">
            <div 
                className={cn(
                    "flex shrink-0 gap-6 items-center min-w-full",
                    reverse ? "animate-marquee-reverse" : "animate-marquee"
                )}
                style={{ animationDuration: duration }}
            >
                {repeatedItems.map((game, i) => (
                    <GameCard key={`${i}-a`} game={game} />
                ))}
            </div>
            <div 
                aria-hidden="true"
                className={cn(
                    "flex shrink-0 gap-6 items-center min-w-full",
                    reverse ? "animate-marquee-reverse" : "animate-marquee"
                )}
                style={{ animationDuration: duration }}
            >
                {repeatedItems.map((game, i) => (
                    <GameCard key={`${i}-b`} game={game} />
                ))}
            </div>
        </div>
    );
};

const GamesGallery = async ({ title, description, query }: GamesGalleryProps) => {
  const gamesData = await getGames({
    limit: query?.limit ?? 12,
    fields: query?.fields,
    filter: query?.filter,
  });
  const games: GalleryGame[] = gamesData.map((game) => ({
    title: game.title,
    img: game.hero_image ?? "/file.svg",
  }));

  const { row1, row2, row3 } = distribute(games);
  return (
    <section className="py-16 bg-white overflow-hidden">
        {/* Inject CSS for Marquee Animations within the component to avoid global pollution */}
        <style>{`
            @keyframes marquee {
                from { transform: translateX(0); }
                to { transform: translateX(calc(-100% - 24px)); } /* 24px is the gap-6 */
            }
            @keyframes marquee-reverse {
                from { transform: translateX(calc(-100% - 24px)); }
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

        <div className="container mx-auto px-4 text-center mb-16">
            <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight text-brand-dark mb-6">
                {title}
            </h2>
            <p className="font-sans text-lg md:text-[20px] text-gray-600 max-w-7xl mx-auto leading-relaxed">
                {description}
            </p>
        </div>

        <div className="flex flex-col gap-6 w-full">
            <MarqueeRow items={row1} duration="80s" />
            <MarqueeRow items={row2} duration="70s" reverse />
            <MarqueeRow items={row3} duration="90s" />
        </div>
        
    </section>
  );
};

export default GamesGallery;

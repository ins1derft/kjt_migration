'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RichText from "../RichText";
import { resolveMediaUrl } from "@/lib/utils";
import { getGame, getGames } from "@/lib/api";

type Neighbor = { slug: string; title: string };

type GameState = {
  title: string;
  poster: string;
  genre: string | null;
  targetAge: string | null;
  description: string | null;
  products: Neighbor[];
  videoId: string | null;
};

export interface GameDetailProps {
  slug?: string;
}

const GameDetail: React.FC<GameDetailProps> = ({ slug }) => {
  const [state, setState] = useState<GameState | null>(null);
  const [neighbors, setNeighbors] = useState<{ prev: Neighbor | null; next: Neighbor | null }>({
    prev: null,
    next: null,
  });

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const currentSlug = slug; // narrow to string for type safety

    async function load() {
      const game = await getGame(currentSlug);
      if (!game || cancelled) return;

      const poster = resolveMediaUrl(game.hero_image) ?? "/images/placeholders/no-image.jpg";
      const description = game.body ?? game.excerpt ?? null;
      const genre = game.genre ?? game.game_type ?? null;
      const products = (game.products_used ?? []).map((p) => ({ slug: p.slug, title: p.name ?? p.slug }));

      setState({
        title: game.title ?? slug,
        poster,
        genre,
        targetAge: game.target_age ?? null,
        description,
        products,
        videoId: game.video_id ?? null,
      });

      const list = await getGames({
        filter: genre ? { genre } : undefined,
        fields: ['slug', 'title'],
        limit: 200,
      });
      if (cancelled) return;
      const idx = list.findIndex((g) => g.slug === currentSlug);
      const prev = idx > 0 ? { slug: list[idx - 1].slug, title: list[idx - 1].title } : null;
      const next = idx >= 0 && idx < list.length - 1 ? { slug: list[idx + 1].slug, title: list[idx + 1].title } : null;
      setNeighbors({ prev, next });
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (!slug || !state) return null;

  return (
    <div className="bg-white pb-20">
      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-10 -mt-24 md:-mt-32">
        <div className="w-full max-w-[1320px] mx-auto aspect-video rounded-[17px] overflow-hidden shadow-xl bg-black relative mb-12">
          {state.videoId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${state.videoId}?rel=0&showinfo=0&iv_load_policy=3&playsinline=1`}
              title={state.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ border: 'none' }}
            />
          ) : (
            <img src={state.poster} alt={state.title} className="w-full h-full object-cover" />
          )}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 mb-8">
          {state.genre && (
            <span className="inline-block bg-[#1a1a1a] text-white px-[26px] py-[10px] rounded-full font-heading font-bold text-[16px]">
              {state.genre}
            </span>
          )}

          {state.targetAge && (
            <div className="font-sans text-[18px] text-[#1a1a1a]">
              Target Age: <span className="font-semibold">{state.targetAge}</span>
            </div>
          )}

          {state.products.length > 0 && (
            <div className="md:ml-auto flex flex-col items-end gap-1">
              {state.products.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="font-sans text-[16px] text-gray-500 hover:text-[#f22f5b] underline decoration-gray-300 underline-offset-4 transition-colors"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {state.description && (
          <div className="max-w-4xl">
            <RichText
              html={state.description}
              className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-[#1a1a1a] opacity-70 mb-16"
            />
          </div>
        )}

        {(neighbors.prev || neighbors.next) && (
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            {neighbors.prev ? (
              <Link href={`/games/${neighbors.prev.slug}`} className="group flex items-center gap-4 text-left w-full md:w-auto">
                <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 group-hover:border-[#f22f5b] group-hover:text-[#f22f5b] transition-colors">
                  <ChevronLeft size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">Previous Post</span>
                  <span className="font-heading font-bold text-[#1a1a1a] group-hover:text-[#f22f5b] transition-colors">{neighbors.prev.title}</span>
                </div>
              </Link>
            ) : <span />}

            <div className="hidden md:block h-8 w-px bg-gray-200" />

            {neighbors.next ? (
              <Link href={`/games/${neighbors.next.slug}`} className="group flex items-center gap-4 text-right justify-end w-full md:w-auto">
                <div className="flex flex-col items-end">
                  <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">Next Post</span>
                  <span className="font-heading font-bold text-[#1a1a1a] group-hover:text-[#f22f5b] transition-colors">{neighbors.next.title}</span>
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 group-hover:border-[#f22f5b] group-hover:text-[#f22f5b] transition-colors">
                  <ChevronRight size={20} />
                </div>
              </Link>
            ) : <span />}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDetail;

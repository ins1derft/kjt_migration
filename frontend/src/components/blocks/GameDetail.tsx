'use client';
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
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

function NavChevron({ direction }: { direction: "left" | "right" }) {
  const rotationClass = direction === "left" ? "rotate-90" : "-rotate-90";
  return (
    <span className="flex h-[9px] w-[4.428px] items-center justify-center text-brand-dark">
      <span className={rotationClass}>
        <svg
          width="9"
          height="4.428"
          viewBox="0 0 11 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-[4.428px] w-[9px]"
          aria-hidden="true"
        >
          <path d="M0.999949 1.0002L5.4279 5.42814" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9.99995 1.0002L5.572 5.42814" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    </span>
  );
}

function VideoCard({
  title,
  poster,
  videoId,
}: {
  title: string;
  poster: string;
  videoId: string | null;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-[17.23px] bg-black aspect-[320/178] lg:aspect-[1088/604] 2xl:aspect-[1320/604]">
      {videoId ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&showinfo=0&iv_load_policy=3&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          style={{ border: "none" }}
        />
      ) : (
        <Image
          src={poster}
          alt={title}
          fill
          sizes="(min-width: 1536px) 1320px, (min-width: 1024px) 1088px, 100vw"
          className="object-cover"
          unoptimized
        />
      )}
    </div>
  );
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
    const currentSlug = slug;

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
        fields: ["slug", "title"],
        limit: 200,
      });
      if (cancelled) return;
      const idx = list.findIndex((g) => g.slug === currentSlug);
      const prev = idx > 0 ? { slug: list[idx - 1].slug, title: list[idx - 1].title } : null;
      const next = idx >= 0 && idx < list.length - 1 ? { slug: list[idx + 1].slug, title: list[idx + 1].title } : null;
      setNeighbors({ prev, next });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!slug || !state) return null;

  return (
    <div className="flow-root bg-white pb-[99px] lg:pb-[75px]">
      <div className="container max-w-none mx-auto w-full px-5 md:px-6 lg:max-w-[1088px] lg:px-0 2xl:max-w-[1320px] -mt-[41px]">
        <VideoCard title={state.title} poster={state.poster} videoId={state.videoId} />

        <div className="mt-[28px] lg:mt-[46px] flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-[30px]">
            {state.genre ? (
              <div className="h-[57px] w-[178px] rounded-[100px] bg-gradient-cta flex items-center justify-center">
                <span className="font-heading font-bold text-[16px] leading-[normal] text-white">
                  {state.genre}
                </span>
              </div>
            ) : null}

            <p className="mt-[26px] lg:mt-[16px] font-sans text-[16px] lg:text-[18px] leading-[1.4] text-brand-dark/70">
              Target Age:{state.targetAge ? ` ${state.targetAge}` : ""}
            </p>
          </div>

          {state.products.length > 0 ? (
            <ul className="mt-[7px] lg:mt-[2px] list-disc list-outside pl-[24px] lg:pl-[27px] font-sans text-[16px] lg:text-[18px] leading-[1.4] text-brand-dark/70">
              {state.products.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    className="underline decoration-solid [text-underline-position:from-font] hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-[4px]"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {state.description ? (
          <RichText
            html={state.description}
            className="mt-[27px] lg:mt-[43px] font-sans text-[16px] lg:text-[20px] leading-[1.4] text-brand-dark/70 prose prose-p:font-sans prose-p:text-brand-dark/70 prose-p:leading-[1.4] prose-p:text-[16px] lg:prose-p:text-[20px]"
          />
        ) : null}

        {(neighbors.prev || neighbors.next) ? (
          <div className="mt-[86px] lg:mt-[50px] flex flex-col gap-[18px] lg:flex-row lg:justify-between lg:gap-0">
            {neighbors.prev ? (
              <Link
                href={`/games/${neighbors.prev.slug}`}
                className="h-[73px] w-full lg:w-[432px] border-y border-brand-dark/30 hover:border-brand-dark/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-[4px]"
              >
                <div className="grid h-full grid-cols-[4.428px_1fr] items-center gap-x-[34.572px] px-[28px]">
                  <NavChevron direction="left" />
                  <div className="w-[310px] font-sans text-[16px] leading-[1.2] text-brand-dark/70">
                    <div className="font-light">Previous Post</div>
                    <div>{neighbors.prev.title}</div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="hidden lg:block h-[73px] w-[432px]" />
            )}

            {neighbors.next ? (
              <Link
                href={`/games/${neighbors.next.slug}`}
                className="h-[73px] w-full lg:w-[432px] border-y border-brand-dark/30 hover:border-brand-dark/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-[4px]"
              >
                <div className="grid h-full grid-cols-[1fr_4.428px] items-center gap-x-[34.572px] px-[28px]">
                  <div className="w-[310px] justify-self-end text-right font-sans text-[16px] leading-[1.2] text-brand-dark/70">
                    <div className="font-light">Previous Post</div>
                    <div>{neighbors.next.title}</div>
                  </div>
                  <NavChevron direction="right" />
                </div>
              </Link>
            ) : (
              <div className="hidden lg:block h-[73px] w-[432px]" />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GameDetail;

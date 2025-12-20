'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useMemo, useState } from 'react';
import { Play, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';

export type VideoRowsItem = {
  videoId?: string | null;
};

export type VideoRowsProps = {
  videos?: VideoRowsItem[] | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
  className?: string;
};

const normalizeVideos = (videos?: VideoRowsItem[] | null) =>
  (Array.isArray(videos) ? videos : [])
    .map((item) => ({
      videoId: typeof item?.videoId === 'string' ? item.videoId.trim() : '',
    }))
    .filter((item) => item.videoId.length > 0);

const resolvePoster = (videoId?: string | null) =>
  videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

const resolveEmbed = (videoId?: string | null) =>
  videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1&playsinline=1`
    : null;

const VideoRows: React.FC<VideoRowsProps> = ({
  videos,
  padding,
  backgroundClass,
  backgroundColor,
  className,
}) => {
  const items = useMemo(() => normalizeVideos(videos), [videos]);
  const mainVideoId = items[0]?.videoId ?? null;
  const gridItems = items.slice(1);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    const shouldLock = Boolean(activeVideoId);
    document.body.style.overflow = shouldLock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeVideoId]);

  if (!mainVideoId && gridItems.length === 0) {
    return null;
  }

  const paddingClass = resolveSectionPadding(padding, 'pt-[0px] pb-[0px]');
  const sectionBg = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const mainPoster = resolvePoster(mainVideoId);
  const activeEmbed = resolveEmbed(activeVideoId);

  return (
    <section className={cn(sectionBg, paddingClass, className)} style={sectionStyle}>
      <div className="container mx-auto w-full px-5 md:px-6 2xl:px-0">
        <div className="flex w-full flex-col gap-[37px]">
          <div className="relative w-full overflow-hidden rounded-[17.23px] bg-brand-gray aspect-[1320/604]">
            {mainPoster ? (
              <img
                src={mainPoster}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-form-border" />
            )}

            {mainVideoId ? (
              <button
                type="button"
                onClick={() => setActiveVideoId(mainVideoId)}
                aria-label="Play video"
                className="absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
              >
                <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:scale-105">
                  <Play className="h-7 w-7" />
                </span>
              </button>
            ) : null}
          </div>

          {gridItems.length > 0 ? (
            <div className="grid w-full grid-cols-1 gap-x-[15px] gap-y-[17px] sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {gridItems.map((item, idx) => {
                const poster = resolvePoster(item.videoId);

                return (
                  <div
                    key={`${item.videoId ?? 'video'}-${idx}`}
                    className="relative w-full overflow-hidden rounded-[17.23px] bg-brand-gray aspect-[319/146]"
                  >
                    {poster ? (
                      <img
                        src={poster}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-form-border" />
                    )}

                    {item.videoId ? (
                      <button
                        type="button"
                        onClick={() => setActiveVideoId(item.videoId ?? null)}
                        aria-label="Play video"
                        className="absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
                      >
                        <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:scale-105">
                          <Play className="h-7 w-7" />
                        </span>
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {activeVideoId && activeEmbed ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <button
            aria-label="Close video"
            onClick={() => setActiveVideoId(null)}
            className="absolute right-6 top-6 z-10 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <X size={36} />
          </button>

          <div className="absolute inset-0" onClick={() => setActiveVideoId(null)} />

          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl">
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={activeEmbed}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default VideoRows;

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Play, X } from 'lucide-react';
import RichText from '../RichText';
import { cn, resolveMediaUrl } from '@/lib/utils';
import { withYouTubeOrigin } from '@/lib/youtube';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';

type MediaInput = string | { src?: string | null; alt?: string | null } | null;

export type GameDistributionProps = {
  title?: string | null;
  description?: string | null;
  media?: MediaInput;
  videoId?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const normalizeMedia = (media: MediaInput) => {
  if (!media) return { src: null, alt: '' };
  if (typeof media === 'string') return { src: resolveMediaUrl(media), alt: '' };
  return { src: resolveMediaUrl(media.src ?? null), alt: media.alt ?? '' };
};

const resolveVideoPoster = (videoId?: string | null, fallback?: string | null) => {
  if (fallback) return fallback;
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

const GameDistribution: React.FC<GameDistributionProps> = ({
  title,
  description,
  media,
  videoId,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const { src: mediaSrc, alt: mediaAlt } = useMemo(() => normalizeMedia(media ?? null), [media]);
  const poster = useMemo(() => resolveVideoPoster(videoId, mediaSrc), [mediaSrc, videoId]);

  useEffect(() => {
    document.body.style.overflow = isVideoOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVideoOpen]);

  const hasContent = Boolean(title?.trim() || description?.trim() || poster);
  if (!hasContent) {
    return null;
  }

  const paddingClass = resolveSectionPadding(
    padding,
    'pt-[98px] pb-[98px] md:pt-[126px] md:pb-[126px]'
  );
  const sectionBg = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn('overflow-hidden', sectionBg, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-8 2xl:px-0">
        <div className="mx-auto flex w-full flex-col items-start lg:flex-row lg:items-start lg:gap-[93px]">
          <div className="order-2 mt-[35px] flex w-full flex-col items-start lg:order-1 lg:mt-0">
            {title ? (
              <h2 className="max-w-[992px] font-heading text-[38px] font-bold leading-none tracking-[-0.01em] text-brand-dark lg:text-[64px]">
                {title}
              </h2>
            ) : null}

            {description ? (
              <RichText
                html={description}
                className="mt-[24px] font-sans text-[16px] leading-[1.4] text-brand-dark/70 prose-p:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0 lg:mt-[13px] lg:text-[20px]"
              />
            ) : null}
          </div>

          <div className="order-1 flex w-full justify-center lg:order-2 lg:justify-end">
            <div className="relative w-full aspect-[320/227] overflow-hidden rounded-[17.23px] bg-black/5 lg:aspect-[428/486] 2xl:aspect-[659/486]">
              {poster ? (
                <Image
                  src={poster}
                  alt={mediaAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 660px"
                  priority
                  unoptimized
                />
              ) : (
                <div className="h-full w-full bg-[#dfe3ec]" />
              )}

              {videoId ? (
                <button
                  type="button"
                  aria-label="Play video"
                  onClick={() => setIsVideoOpen(true)}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
                    <Play className="h-7 w-7" />
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {videoId && isVideoOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <button
            aria-label="Close video"
            onClick={() => setIsVideoOpen(false)}
            className="absolute right-6 top-6 z-10 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <X size={32} />
          </button>

          <div className="absolute inset-0" onClick={() => setIsVideoOpen(false)} />

          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl">
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={withYouTubeOrigin(
                  `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1&playsinline=1`,
                )}
                title={mediaAlt || title || 'Video'}
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

export default GameDistribution;

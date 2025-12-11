'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Play, X } from 'lucide-react';
import RichText from '../RichText';
import { cn, resolveMediaUrl } from '@/lib/utils';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';

type MediaInput = string | { src?: string | null; alt?: string | null } | null;

export type PracticeShowcaseProps = {
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

const resolvePoster = (videoId?: string | null, fallback?: string | null) => {
  if (fallback) return fallback;
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

const PracticeShowcase: React.FC<PracticeShowcaseProps> = ({
  title,
  description,
  media,
  videoId,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { src: mediaSrc, alt: mediaAlt } = useMemo(() => normalizeMedia(media), [media]);
  const poster = useMemo(() => resolvePoster(videoId, mediaSrc), [mediaSrc, videoId]);

  useEffect(() => {
    document.body.style.overflow = isVideoOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVideoOpen]);

  if (!title && !description && !poster) return null;

  const paddingClass = resolveSectionPadding(
    padding,
    'pt-[80px] pb-[80px] md:pt-[90px] md:pb-[90px]'
  );
  const sectionBg = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn('overflow-hidden', sectionBg, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-8 2xl:px-0">
        <div className="mx-auto flex w-full flex-col items-start gap-[32px] lg:flex-row lg:items-center lg:gap-[60px]">
          <div className="order-2 flex w-full flex-col lg:order-1 lg:max-w-[663px]">
            {title ? (
              <h2 className="font-heading text-[24px] font-bold leading-[1.2] text-brand-dark">
                {title}
              </h2>
            ) : null}

            {description ? (
              <RichText
                html={description}
                className="mt-[20px] font-sans text-[20px] leading-[1.4] text-brand-dark/70 prose-p:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0"
              />
            ) : null}
          </div>

          <div className="order-1 flex w-full justify-center lg:order-2 lg:justify-end">
            <div className="relative w-full max-w-[768px] aspect-[299/163] overflow-hidden rounded-[10px] bg-black/5">
              {poster ? (
                <Image
                  src={poster}
                  alt={mediaAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 600px"
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
                  className="absolute inset-0 flex items-center justify-center"
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
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1&playsinline=1`}
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

export default PracticeShowcase;

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

export type ResearchProps = {
  title?: string | null;
  leftTitle?: string | null;
  leftText?: string | null;
  personName?: string | null;
  personText?: string | null;
  personImage?: MediaInput;
  personAlt?: string | null;
  description?: string | null;
  videoId?: string | null;
  learnMoreHref?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const normalizeMedia = (media: MediaInput) => {
  if (!media) return { src: null, alt: '' };
  if (typeof media === 'string') return { src: resolveMediaUrl(media), alt: '' };
  return { src: resolveMediaUrl(media.src ?? null), alt: media.alt ?? '' };
};

const resolvePoster = (videoId?: string | null) => {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

const Research: React.FC<ResearchProps> = ({
  title,
  leftTitle,
  leftText,
  personName,
  personText,
  personImage,
  personAlt,
  description,
  videoId,
  learnMoreHref,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { src: personSrc, alt: personImageAlt } = useMemo(() => {
    const base = normalizeMedia(personImage ?? null);
    if (personAlt) return { ...base, alt: personAlt };
    return base;
  }, [personAlt, personImage]);
  const poster = useMemo(() => resolvePoster(videoId), [videoId]);

  useEffect(() => {
    document.body.style.overflow = isVideoOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVideoOpen]);

  const hasTopRow = Boolean(leftTitle || leftText || personName || personText || personSrc);
  const hasVideo = Boolean(videoId || poster);
  if (!title && !hasTopRow && !description && !hasVideo) {
    return null;
  }

  const handleVideoPreviewClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!videoId) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('a,button')) return;
    setIsVideoOpen(true);
  };

  const paddingClass = resolveSectionPadding(
    padding,
    'pt-[96px] pb-[120px]'
  );
  const sectionBg = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn('overflow-hidden', sectionBg, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-10 2xl:px-0">
        <div className="mx-auto w-full">
          {title ? (
            <h2 className="max-w-[992px] font-heading text-[38px] font-bold leading-[1] tracking-[-0.01em] text-brand-dark md:text-[64px]">
              {title}
            </h2>
          ) : null}

          {hasTopRow ? (
            <div className="mt-[47px] flex w-full flex-col gap-y-[24px] lg:flex-row lg:items-start lg:justify-between lg:gap-x-[80px] xl:gap-x-[120px]">
              <div className="flex w-full max-w-[568px] lg:max-w-[100%] flex-col gap-[20px] lg:w-auto">
                {leftTitle ? (
                  <h3 className="font-heading text-[20px] font-semibold leading-[1.4] text-brand-dark">
                    {leftTitle}
                  </h3>
                ) : null}

                {leftText ? (
                  <RichText
                    html={leftText}
                    className="my-0 text-[20px] leading-[1.4] text-brand-dark/70 prose-strong:font-semibold prose-strong:text-brand-dark"
                  />
                ) : null}
              </div>

              <div className="flex w-full max-w-[660px] flex-col gap-[20px] sm:flex-row sm:items-start sm:gap-[24px] lg:w-auto">
                <div className="flex-shrink-0 self-start">
                  <div className="relative h-[216px] w-[173px] overflow-hidden rounded-[17.23px] bg-[#dfe3ec]">
                    {personSrc ? (
                      <Image src={personSrc} alt={personImageAlt} fill className="object-cover" sizes="173px" priority unoptimized/>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col gap-[14px]">
                  {personName ? (
                    <p className="font-heading text-[20px] font-semibold leading-[1.4] text-brand-dark">
                      {personName}
                    </p>
                  ) : null}

                  {personText ? (
                    <RichText
                      html={personText}
                      className="my-0 text-[20px] leading-[1.4] text-brand-dark/70 prose-strong:font-semibold prose-strong:text-brand-dark"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-[58px] h-px w-full bg-[#D9D9D9]" />

          {description ? (
            <RichText
              html={description}
              className="mt-[50px] max-w-[833px] text-[20px] leading-[1.4] text-brand-dark/70 prose-strong:font-semibold prose-strong:text-brand-dark"
            />
          ) : null}

          {hasVideo ? (
            <div
              className={cn(
                "relative mt-[50px] w-full overflow-hidden rounded-[17.23px] bg-[#dfe3ec]",
                videoId ? "cursor-pointer" : "",
              )}
              onClick={handleVideoPreviewClick}
            >
              <div className="relative aspect-[330/151] w-full">
                {poster ? (
                  <Image
                    src={poster}
                    alt={title ?? 'Research video'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1536px) 100vw, 1320px"
                    priority
                    unoptimized
                  />
                ) : null}
              </div>

              {videoId ? (
                <div className="pointer-events-none absolute inset-0">
                  <div className="pointer-events-auto absolute left-1/2 bottom-[22px] flex w-full -translate-x-1/2 flex-col items-center gap-3 px-6 md:left-[44px] md:bottom-[42px] md:w-auto md:translate-x-0 md:flex-row md:items-center md:gap-6 md:px-0">
                    {learnMoreHref ? (
                      <a
                        href={learnMoreHref}
                        className="order-1 text-center font-heading font-bold text-[16px] leading-[1.1] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 md:order-2"
                      >
                        Learn More
                      </a>
                    ) : null}
                    <button
                      type="button"
                      aria-label="Play"
                      onClick={() => setIsVideoOpen(true)}
                      className="order-2 inline-flex h-[50px] min-w-[149px] items-center justify-between rounded-full bg-white px-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99] md:order-1"
                    >
                      <span className="font-heading font-extrabold text-[16px] leading-none text-brand-dark">Play</span>
                      <span className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-brand-dark text-white">
                        <Play size={14} fill="white" className="ml-[1px]" />
                      </span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
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
                title={title ?? 'Research video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

export default Research;

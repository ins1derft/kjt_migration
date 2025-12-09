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

export type SpecialNeedsVideo = {
  videoId?: string | null;
  alt?: string | null;
};

export type SpecialNeedsProps = {
  title?: string | null;
  description?: string | null;
  videos?: SpecialNeedsVideo[] | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const resolveVideoSrc = (video: SpecialNeedsVideo) => {
  if (video.videoId) {
    return `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1`;
  }

  return null;
};

const resolvePoster = (video: SpecialNeedsVideo) => {
  if (!video.videoId) return null;
  return `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;
};

const VideoCard: React.FC<{
  video: SpecialNeedsVideo;
  onPlay?: () => void;
}> = ({ video, onPlay }) => {
  const poster = resolvePoster(video);
  const isPlayable = Boolean(video.videoId);

  return (
    <div className="relative w-full overflow-hidden rounded-[10px] bg-black/5 h-[163px] md:h-[326px]">
      {poster ? (
        <Image
          src={poster}
          alt={video.alt ?? ''}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 640px"
          priority
          unoptimized
        />
      ) : (
        <div className="h-full w-full bg-brand-gray" />
      )}

      {isPlayable ? (
        <button
          type="button"
          aria-label="Play video"
          onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
            <Play className="h-7 w-7" />
          </span>
        </button>
      ) : null}
    </div>
  );
};

const SpecialNeeds: React.FC<SpecialNeedsProps> = ({
  title,
  description,
  videos = [],
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const items = useMemo(
    () => (Array.isArray(videos) ? videos.filter((item) => item && item.videoId) : []),
    [videos],
  );

  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  useEffect(() => {
    const shouldLock = activeVideo !== null;
    document.body.style.overflow = shouldLock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeVideo]);

  if (!title && !description && items.length === 0) {
    return null;
  }

  const paddingClass = resolveSectionPadding(
    padding,
    'pt-[65px] pb-[83px] md:pt-[88px] md:pb-[165px] 2xl:pt-[184px] 2xl:pb-[258px]',
  );
  const sectionBackground = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const renderVideoModal = () => {
    if (activeVideo === null) return null;
    const current = items[activeVideo];
    if (!current) return null;

    const videoSrc = resolveVideoSrc(current);
    if (!videoSrc) return null;

    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <button
          aria-label="Close video"
          onClick={() => setActiveVideo(null)}
          className="absolute right-6 top-6 z-10 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <X size={32} />
        </button>

        <div className="absolute inset-0" onClick={() => setActiveVideo(null)} />

        <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl">
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={videoSrc}
              title={current.alt ?? current.videoId ?? 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={cn('overflow-hidden', sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto flex w-full flex-col items-center px-5 sm:px-6 lg:px-10">
        {title ? (
          <h2 className="max-w-[320px] text-center font-heading text-[38px] font-bold leading-[1] text-brand-dark md:max-w-[974px] md:text-[64px] md:leading-[1] tracking-[-0.01em]">
            {title}
          </h2>
        ) : null}

        {description ? (
          <RichText
            html={description}
            className="mt-[12px] max-w-[320px] text-center font-sans text-[16px] leading-[1.4] text-brand-dark/70 md:mt-[15px] md:max-w-[934px] md:text-[20px]"
          />
        ) : null}

        {items.length > 0 ? (
          <div className="mt-[35px] w-full md:mt-[38px]">
            <div className="mx-auto grid max-w-[320px] grid-cols-1 gap-y-[12px] md:max-w-[1089px] md:grid-cols-2 md:gap-x-[42px] md:gap-y-[12px] 2xl:max-w-[1320px]">
              {items.map((video, idx) => (
                <VideoCard key={`${video.videoId ?? idx}-${idx}`} video={video} onPlay={() => setActiveVideo(idx)} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {renderVideoModal()}
    </section>
  );
};

export default SpecialNeeds;

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Play, X } from 'lucide-react';
import RichText from '@/components/RichText';
import { cn, resolveMediaUrl } from '@/lib/utils';
import { withYouTubeOrigin } from '@/lib/youtube';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';

export type LargeBannersCommitmentProps = {
  slogan?: string | null;
  title?: string | null;
  backgroundImage?: string | null;
  videoId?: string | null;
  contentTitle?: string | null;
  contentText?: string | null;
  buttonLabel?: string | null;
  buttonHref?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const resolvePoster = (videoId?: string | null) => {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

const LargeBannersCommitment: React.FC<LargeBannersCommitmentProps> = ({
  slogan,
  title,
  backgroundImage,
  videoId,
  contentTitle,
  contentText,
  buttonLabel,
  buttonHref,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const trimmedVideoId = videoId?.trim() ?? '';
  const poster = useMemo(() => resolvePoster(trimmedVideoId), [trimmedVideoId]);
  const backgroundUrl = resolveMediaUrl(backgroundImage);

  useEffect(() => {
    document.body.style.overflow = isVideoOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVideoOpen]);

  const hasButton = Boolean(buttonLabel?.trim() && buttonHref?.trim());
  const hasTopContent = Boolean(slogan?.trim() || title?.trim() || trimmedVideoId || backgroundUrl);
  const hasBottomContent = Boolean(contentTitle?.trim() || contentText?.trim() || hasButton);

  if (!hasTopContent && !hasBottomContent) {
    return null;
  }

  const paddingClass = resolveSectionPadding(padding, 'py-0');
  const sectionBackground = resolveSectionBackground(backgroundClass, 'bg-brand-dark');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const bottomOverlapClass = hasTopContent
    ? '-mt-[96px] md:-mt-[132px] 2xl:-mt-[172px]'
    : '';

  const bottomPaddingClass = hasTopContent
    ? 'pt-[160px] md:pt-[220px] 2xl:pt-[272px] pb-[80px] md:pb-[110px] 2xl:pb-[138px]'
    : 'py-[80px] md:py-[110px]';

  return (
    <section className={cn('relative overflow-hidden', sectionBackground, paddingClass)} style={sectionStyle}>
      {backgroundUrl ? (
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-fixed bg-cover bg-center"
            style={{ backgroundImage: `url("${backgroundUrl}")` }}
          />
          <div className="absolute inset-0 bg-[#000265]/80" />
        </div>
      ) : null}

      <div className="relative z-10">
        {hasTopContent ? (
          <div className="container mx-auto px-5 sm:px-6 lg:px-10 2xl:px-0">
            <div className="relative z-10 flex flex-col items-center text-center pt-[168px] md:pt-[180px] 2xl:pt-[192px]">
              {slogan ? (
                <p className="max-w-full font-heading text-[14px] leading-[1.4] text-white uppercase sm:text-[16px] md:text-[18px] 2xl:text-[22px] 2xl:max-w-[1101px]">
                  {slogan}
                </p>
              ) : null}

              {title ? (
                <h2 className="mt-[24px] max-w-full whitespace-pre-line bg-brand-gradient bg-clip-text font-heading text-[38px] font-bold leading-none text-transparent sm:text-[48px] lg:text-[64px] 2xl:mt-[42px] 2xl:text-[84px] md:max-w-[712px]">
                  {title}
                </h2>
              ) : null}

              {trimmedVideoId ? (
                <div className="mt-[40px] w-full max-w-[949px] overflow-hidden rounded-[17.23px] bg-brand-gray md:mt-[52px] 2xl:mt-[66px]">
                  <div className="relative aspect-[949/494] w-full">
                    {poster ? (
                      <Image
                        src={poster}
                        alt={title ?? 'Video'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 949px"
                        priority
                        unoptimized
                      />
                    ) : null}
                    <button
                      type="button"
                      aria-label="Play video"
                      onClick={() => setIsVideoOpen(true)}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    >
                      <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:scale-105">
                        <Play className="h-7 w-7" />
                      </span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {hasBottomContent ? (
          <div
            className={cn('relative z-0 bg-white', bottomOverlapClass)}
            style={{
              clipPath:
                'polygon(0 0, 50% 56px, 100% 0, 100% 100%, 0 100%)',
            }}
          >
            <div
              className={cn(
                'container mx-auto flex flex-col items-center text-center px-5 sm:px-6 lg:px-10 2xl:px-0',
                bottomPaddingClass
              )}
            >
              {contentTitle ? (
                <h3 className="max-w-full font-heading text-[32px] font-bold leading-none text-brand-dark sm:text-[40px] lg:text-[48px] 2xl:text-[64px] 2xl:max-w-[974px]">
                  {contentTitle}
                </h3>
              ) : null}

              {contentText ? (
                <RichText
                  html={contentText}
                  className="mt-[12px] max-w-full text-center font-heading text-[16px] leading-[1.4] text-brand-dark/70 prose-p:my-0 sm:text-[18px] lg:text-[20px] 2xl:mt-[15px] 2xl:text-[20px] 2xl:max-w-[964px]"
                />
              ) : null}

              {hasButton ? (
                <a
                  href={buttonHref ?? '#'}
                  className="mt-[24px] inline-flex h-[48px] w-[160px] items-center justify-center rounded-[100px] bg-gradient-cta font-heading text-[14px] font-bold leading-none text-white transition-transform duration-150 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 md:mt-[30px] md:h-[50px] md:w-[170px] md:text-[15px] 2xl:mt-[37px] 2xl:h-[53px] 2xl:w-[179px] 2xl:text-[16px]"
                >
                  {buttonLabel}
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {trimmedVideoId && isVideoOpen ? (
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
                  `https://www.youtube-nocookie.com/embed/${trimmedVideoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1&playsinline=1`,
                )}
                title={title ?? 'Video'}
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

export default LargeBannersCommitment;

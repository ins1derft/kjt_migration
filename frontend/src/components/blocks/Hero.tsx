'use client';
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { withYouTubeOrigin } from "@/lib/youtube";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

export type HeroSlide = {
  id?: number | string;
  videoId?: string | null;
  image?: string | null;
  alt?: string | null;
};

type Props = {
  title?: string;
  slides?: HeroSlide[];
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

export type HeroProps = Props;

const Hero: React.FC<Props> = ({ title, slides, padding, backgroundClass, backgroundColor }) => {
  const slideList = (slides ?? []).filter((slide) => {
    const hasVideo = typeof slide?.videoId === 'string' && slide.videoId.trim() !== '';
    const hasImage = typeof slide?.image === 'string' && slide.image.trim() !== '';
    return hasVideo || hasImage;
  });
  const slidesLength = slideList.length;
  const [currentSlide, setCurrentSlide] = useState(0);
  const activeSlide = slidesLength > 0 ? currentSlide % slidesLength : 0;
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    if (slidesLength <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slidesLength);
  }, [slidesLength]);

  const goToSlide = (index: number) => {
    if (index < 0 || index >= slidesLength) return;
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (slidesLength <= 1) return;
    if (isAutoPlaying && !isModalOpen) {
      timeoutRef.current = window.setTimeout(nextSlide, 8000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeSlide, isAutoPlaying, isModalOpen, slidesLength, nextSlide]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const getSlideTranslateX = (dist: number) => {
    if (dist === 0) return "translateX(-50%)";
    const steps = Math.min(Math.abs(dist), 2);
    const shiftExpr = Array.from({ length: steps })
      .map(() => "var(--hero-slide-shift)")
      .join(" + ");
    const sign = dist > 0 ? "+" : "-";
    return `translateX(calc(-50% ${sign} (${shiftExpr})))`;
  };

  const getSlideStyles = (index: number) => {
    // Standard distance calculation with wrapping
    let dist = index - activeSlide;
    if (dist > slidesLength / 2) dist -= slidesLength;
    else if (dist < -slidesLength / 2) dist += slidesLength;

    const translateX = getSlideTranslateX(dist);
    let opacity = 0;
    let zIndex = 0;
    let pointerEvents: 'auto' | 'none' = 'none';

    if (dist === 0) {
      opacity = 1;
      zIndex = 20;
      pointerEvents = 'auto';
    } else if (Math.abs(dist) === 1) {
      opacity = 1;
      zIndex = 10;
      pointerEvents = 'auto';
    } else {
      opacity = 0;
      zIndex = 0;
    }

    return {
      style: {
        transform: translateX,
        opacity,
        zIndex,
        pointerEvents,
      },
      className: cn(
        "absolute top-0 left-1/2 rounded-[18px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_16px_32px_rgba(0,0,0,0.16)]",
        dist === 0 ? "bg-black" : "bg-black/40 cursor-pointer"
      ),
    };
  };

  const paddingClass = resolveSectionPadding(
    padding,
    typeof padding === "string" && padding.trim() ? "" : "pt-[156px] pb-[76px]"
  );
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-brand-gray");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  if (slidesLength === 0) {
    return null;
  }

  const getCoverSrc = (slide: HeroSlide) => {
    if (slide.videoId) {
      return `https://img.youtube.com/vi/${slide.videoId}/maxresdefault.jpg`;
    }
    return resolveMediaUrl(slide.image ?? undefined);
  };

  return (
    <section className={cn("relative overflow-x-hidden", sectionBackground, paddingClass)} style={sectionStyle}>
      {/* 1. Main Title Section */}
      {title && (
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 xl:px-0 text-center mb-[32px] sm:mb-[40px] md:mb-[49px]">
          <h1 className="mx-auto max-w-[320px] sm:max-w-[520px] md:max-w-none font-heading font-bold text-[38px] md:text-[84px] leading-[1] tracking-[-0.01em] text-transparent bg-clip-text bg-brand-gradient">
            {title}
          </h1>
        </div>
      )}

      {/* 2. Carousel Section */}
      <div className="relative flex w-full flex-col items-center">
        <div
          className="relative mx-auto overflow-visible pb-6 hero-carousel"
          style={{
            width: "var(--hero-container-width)",
            height: "var(--hero-slide-height)",
          }}
        >
          {/* Nav arrows (desktop/tablet) - reused styling from ProductCarousel */}
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => { setIsAutoPlaying(false); setCurrentSlide((prev) => (prev - 1 + slidesLength) % slidesLength); }}
            className="flex absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 items-center justify-center shadow-xl text-brand-dark transition-all hover:scale-110 hover:bg-brand-sky hover:text-white hover:border-brand-sky"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => { setIsAutoPlaying(false); setCurrentSlide((prev) => (prev + 1) % slidesLength); }}
            className="flex absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 items-center justify-center shadow-xl text-brand-dark transition-all hover:scale-110 hover:bg-brand-sky hover:text-white hover:border-brand-sky"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </button>

          {slideList.map((slide, index) => {
            const { style, className } = getSlideStyles(index);
            const isActive = index === activeSlide;
            const isVideo = Boolean(slide.videoId);
            const coverSrc = getCoverSrc(slide);

            return (
              <div
                key={slide.id ?? index}
                onClick={() => {
                  if (!isActive) {
                    goToSlide(index);
                    return;
                  }

                  if (isVideo) {
                    setIsAutoPlaying(false);
                    setIsModalOpen(true);
                  }
                }}
                className={cn(className, isVideo && isActive ? "cursor-pointer" : "")}
                style={{
                  ...style,
                  width: "var(--hero-slide-width)",
                  height: "var(--hero-slide-height)",
                }}
                data-hero-slide
              >
                {/* Thumbnail */}
                {coverSrc && (
                  <Image
                    src={coverSrc}
                    alt={slide.alt ?? ''}
                    fill
                    sizes="(min-width: 1280px) 1000px, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                )}

                {/* Light overlay for inactive slides */}
                {!isActive && <div className="absolute inset-0 bg-white/60" />}

                {/* Active video */}
                {isVideo && isActive && !isModalOpen && (
                  <div className="absolute inset-0 animate-in fade-in duration-700">
                    <iframe
                      className="h-full w-full pointer-events-none"
                      src={`https://www.youtube-nocookie.com/embed/${slide.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${slide.videoId}&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1`}
                      title={slide.alt || undefined}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{ border: "none" }}
                    />
                  </div>
                )}

                {/* Controls on active slide */}
                {isVideo && (
                  <div
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500",
                      isActive ? "bg-transparent" : "bg-transparent"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute left-1/2 bottom-[22px] flex w-full -translate-x-1/2 flex-col items-center gap-3 px-6 transition-all duration-500 md:left-[44px] md:bottom-[42px] md:w-auto md:translate-x-0 md:flex-row md:items-center md:gap-6 md:px-0",
                        isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                      )}
                    >
                      <p className="order-1 text-center font-heading font-bold text-[16px] leading-[1.1] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] md:order-2">
                        Learn More
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAutoPlaying(false);
                          if (isVideo) {
                            setIsModalOpen(true);
                          }
                        }}
                        className="order-2 inline-flex h-[50px] min-w-[149px] items-center justify-between rounded-full bg-white px-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99] md:order-1"
                      >
                        <span className="font-heading font-extrabold text-[16px] leading-none text-brand-dark">
                          Play
                        </span>
                        <span className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-brand-dark text-white">
                          <Play size={14} fill="white" className="ml-[1px]" />
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="mt-6 flex justify-center gap-[15px] relative z-20">
        {slideList.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              goToSlide(index);
            }}
            className={cn(
              "h-[10px] w-[10px] rounded-full transition-all duration-300",
              activeSlide === index
                ? "bg-brand-dark"
                : "bg-ui-dot hover:bg-gray-400"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Video Modal */}
      {isModalOpen && slideList[activeSlide]?.videoId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           {/* Close Button */}
           <button 
             onClick={() => setIsModalOpen(false)}
             className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-10"
           >
             <X size={40} />
           </button>
           
           {/* Click backdrop to close */}
           <div className="absolute inset-0 z-0" onClick={() => setIsModalOpen(false)} />

           {/* Video Container */}
           <div className="w-full max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black relative z-10">
              <iframe 
                width="100%" 
                height="100%" 
                src={withYouTubeOrigin(
                  `https://www.youtube-nocookie.com/embed/${slideList[activeSlide].videoId}?autoplay=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`
                )}
                title={slideList[activeSlide].alt || undefined}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full"
              ></iframe>
           </div>
        </div>
      )}
    </section>
  );
};

export default Hero;

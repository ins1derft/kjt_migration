'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

export type HeroSlide = { id?: number | string; videoId: string; alt?: string };

type Props = {
  title?: string;
  slides?: HeroSlide[];
  padding?: SectionPadding | null;
};

export type HeroProps = Props;

const Hero: React.FC<Props> = ({ title, slides, padding }) => {
  const slideList = slides ?? [];
  const slidesLength = slideList.length;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slideWidth, setSlideWidth] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(1024);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slidesLength);
  }, [slidesLength]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slidesLength) % slidesLength);
  }, [slidesLength]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isModalOpen) {
      timeoutRef.current = window.setTimeout(nextSlide, 8000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlide, isAutoPlaying, isModalOpen, slidesLength, nextSlide]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const getSlideStyles = (index: number, widthPx: number, gapPx: number) => {
    // Standard distance calculation with wrapping
    let dist = index - currentSlide;
    if (dist > slidesLength / 2) dist -= slidesLength;
    else if (dist < -slidesLength / 2) dist += slidesLength;

    const baseShift = widthPx + gapPx;

    let translateX = dist * baseShift;
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
        transform: `translateX(calc(-50% + ${translateX}px))`,
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

  if (slidesLength === 0) {
    return null;
  }

  const paddingClass = resolveSectionPadding(
    padding,
    "pt-[162px] sm:pt-[172px] md:pt-[198px] xl:pt-[190px] 2xl:pt-[181px] pb-[64px] sm:pb-[80px] md:pb-[110px] 2xl:pb-[152px]"
  );

  const runtimeWidth = viewportWidth;
  const isMobile = runtimeWidth <= 640;
  const gapPx = isMobile ? 5 : 20;
  const horizontalPadding = isMobile ? 24 : 32;
  const slideWidthPx = Math.max(
    320,
    Math.min(1064, runtimeWidth - horizontalPadding)
  );
  const slideHeightPx = isMobile ? 500 : 604;

  useEffect(() => {
    setCurrentSlide(0);
  }, [slidesLength]);

  useLayoutEffect(() => {
    const measure = () => {
      setViewportWidth(window.innerWidth);
      if (measureRef.current) {
        const rect = measureRef.current.getBoundingClientRect();
        setSlideWidth(rect.width);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section className={cn("relative bg-brand-gray overflow-x-hidden", paddingClass)}>
      {/* 1. Main Title Section */}
      {title && (
        <div className="container mx-auto px-4 text-center mb-[32px] sm:mb-[40px] md:mb-[49px]">
          <h1 className="mx-auto max-w-[320px] md:max-w-[833px] font-heading font-bold text-[38px] md:text-[84px] leading-[1] tracking-[-0.01em] text-transparent bg-clip-text bg-brand-gradient">
            {title}
          </h1>
        </div>
      )}

      {/* 2. Carousel Section */}
      <div className="relative flex w-full flex-col items-center">
        <div
          className="relative mx-auto overflow-visible pb-6"
          style={{
            width: `${Math.min(1064, runtimeWidth - horizontalPadding)}px`,
            height: `${slideHeightPx}px`,
          }}
        >
          {slideList.map((slide, index) => {
            const { style, className } = getSlideStyles(index, slideWidthPx, gapPx);
            const isActive = index === currentSlide;

            return (
              <div
                key={slide.id ?? index}
                onClick={() => !isActive && goToSlide(index)}
                className={className}
                style={{
                  ...style,
                  width: isMobile
                    ? "320px"
                    : `${Math.min(1064, runtimeWidth - horizontalPadding)}px`,
                  height: `${slideHeightPx}px`,
                }}
                data-hero-slide
                ref={index === 0 ? measureRef : undefined}
              >
                {/* Thumbnail */}
                <img
                  src={`https://img.youtube.com/vi/${slide.videoId}/maxresdefault.jpg`}
                  alt={slide.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Light overlay for inactive slides */}
                {!isActive && <div className="absolute inset-0 bg-white/60" />}

                {/* Active video */}
                {isActive && !isModalOpen && (
                  <div className="absolute inset-0 animate-in fade-in duration-700">
                    <iframe
                      className="h-full w-full pointer-events-none"
                      src={`https://www.youtube-nocookie.com/embed/${slide.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${slide.videoId}&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1`}
                      title={slide.alt}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{ border: "none" }}
                    />
                  </div>
                )}

                {/* Controls on active slide */}
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-500",
                    isActive ? "bg-transparent" : "bg-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "absolute left-1/2 bottom-[74px] flex w-full -translate-x-1/2 flex-col items-center gap-3 px-6 transition-all duration-500 md:left-[44px] md:bottom-[94px] md:w-auto md:translate-x-0 md:flex-row md:items-center md:gap-6 md:px-0",
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
                        setIsModalOpen(true);
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
              currentSlide === index
                ? "bg-brand-dark"
                : "bg-ui-dot hover:bg-gray-400"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Video Modal */}
      {isModalOpen && (
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
                src={`https://www.youtube-nocookie.com/embed/${slideList[currentSlide].videoId}?autoplay=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`}
                title={slideList[currentSlide].alt}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
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

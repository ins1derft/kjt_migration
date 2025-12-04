'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { getTrustedLogos } from "@/lib/api";
import type { TrustedLogo } from "@/lib/blocks/types";
import { resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";
import RichText from "../RichText";

export interface LogoItem {
  image: string;
  alt?: string;
}

export interface TrustedByProps {
  logos?: LogoItem[];
  title?: string;
  description?: string;
  footerText?: string;
  query?: {
    fields?: string[];
  };
  padding?: SectionPadding | null;
}

const normalizeLogos = (items?: (LogoItem | TrustedLogo)[] | null): LogoItem[] =>
  (items ?? []).map((l) => ({
    image: resolveMediaUrl(l.image) ?? "/file.svg",
    alt: l.alt ?? undefined,
  }));

const TrustedBy: React.FC<TrustedByProps> = ({ logos, title, description, footerText, query, padding }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [items, setItems] = useState<LogoItem[]>(normalizeLogos(logos));
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef<number>(0);
  
  const intervalRef = useRef<number | null>(null);

  const startAutoPlay = () => {
    if (!items || items.length === 0) return;
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % items.length);
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
  };

  const goToSlide = (index: number) => {
    stopAutoPlay();
    setCurrentSlide(index);
    startAutoPlay();
  };

  // Drag Handlers
  const handleDragStart = (clientX: number) => {
    stopAutoPlay();
    setIsDragging(true);
    startXRef.current = clientX;
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const currentX = clientX;
    const diff = currentX - startXRef.current;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const threshold = 100; // Minimum pixels to trigger slide change

    const total = items?.length ?? 0;
    if (total === 0) return;

    if (dragOffset > threshold) {
        // Swipe Right -> Prev Slide
        setCurrentSlide((prev) => (prev - 1 + total) % total);
    } else if (dragOffset < -threshold) {
        // Swipe Left -> Next Slide
        setCurrentSlide((prev) => (prev + 1) % total);
    }
    
    // Reset offset to animate back to zero (snapping to the new current slide)
    setDragOffset(0);
    startAutoPlay();
  };

  // Mouse Events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => {
      if (isDragging) handleDragEnd();
  };

  // Touch Events
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  useEffect(() => {
    async function loadIfNeeded() {
      if (items && items.length) return;
      const fetched = await getTrustedLogos({
        fields: query?.fields,
      });
      setItems(normalizeLogos(fetched));
    }

    loadIfNeeded();
    startAutoPlay();
    return () => stopAutoPlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items?.length, query?.fields]);

  const paddingClass = resolveSectionPadding(
    padding,
    "pt-[35px] pb-[128px]"
  );

  return (
    <section className={cn(paddingClass, "bg-white")}>
        <div className="mx-auto flex w-full max-w-[1920px] flex-col items-center px-5 text-center sm:px-6 md:px-8 lg:px-10 2xl:px-0">
            {(title || description) && (
              <div className="flex flex-col items-center text-center">
                  {title && (
                    <h2 className="font-heading font-bold text-[38px] leading-[44px] text-brand-dark max-w-[320px] md:max-w-none md:text-[64px] md:leading-[64px]">
                        {title}
                    </h2>
                  )}
                  {description && (
                    <RichText
                      html={description}
                      className="mt-4 max-w-[320px] text-center font-heading text-[16px] leading-[22.4px] text-brand-dark/70 prose-p:my-0 prose-p:text-inherit prose-headings:font-heading prose-headings:text-brand-dark prose-headings:mb-3 prose-ul:text-left prose-ol:text-left prose-ul:pl-6 prose-ol:pl-6 md:max-w-[711px] md:text-[20px] md:leading-[28px]"
                    />
                  )}
              </div>
            )}

            {/* Slider Wrapper */}
            <div 
                className="relative mx-auto mt-[100px] flex w-full max-w-[320px] select-none flex-col items-center group cursor-grab active:cursor-grabbing md:mt-[90px] md:max-w-[760px] lg:mt-[90px] lg:max-w-[1089px] 2xl:mt-[72px] 2xl:max-w-[1197px]"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Slider Window */}
                <div className="h-[282px] w-full overflow-hidden md:h-[277px] 2xl:h-[305px]">
                    <div 
                        className={cn(
                            "flex h-full w-full",
                            // Disable transition during dragging to make it follow cursor instantly
                            // Enable transition when releasing to snap smoothly
                            !isDragging ? "transition-transform duration-500 ease-in-out" : ""
                        )}
                        style={{ transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))` }}
                    >
                        {items.map((logo, index) => (
                            <div key={index} className="flex h-full w-full flex-shrink-0">
                                <img
                                    src={logo.image}
                                    alt={logo.alt || `Client Logos Slide ${index + 1}`}
                                    className="pointer-events-none h-full w-full object-cover md:object-contain"
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="mt-8 flex justify-center gap-2.5 md:mt-8">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                            "h-[10px] w-[10px] rounded-full transition-all duration-300",
                            currentSlide === index 
                                ? "bg-brand-dark" 
                                : "bg-ui-dot"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Descriptive Text - Moved below pagination */}
            {footerText && (
              <p className="mx-auto mt-[60px] max-w-[318px] text-center font-heading font-extrabold text-[16px] leading-[22.4px] text-brand-dark/70 md:mt-[60px] md:max-w-[711px] md:text-[20px] md:leading-[28px]">
                  {footerText}
              </p>
            )}
        </div>
    </section>
  );
};

export default TrustedBy;

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

  const paddingClass = resolveSectionPadding(padding, "py-16");

  return (
    <section className={cn(paddingClass, "bg-white")}>
        <div className="container mx-auto px-4">
            {(title || description) && (
              <div className="text-center mb-16">
                  {title && (
                    <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight text-brand-dark mb-6">
                        {title}
                    </h2>
                  )}
                  {description && (
                    <RichText
                      html={description}
                      className="max-w-7xl mx-auto text-center font-sans text-lg md:text-[20px] leading-relaxed text-gray-600 prose-p:my-0 prose-headings:font-heading prose-headings:text-brand-dark prose-headings:mb-3 prose-ul:text-left prose-ol:text-left prose-ul:pl-6 prose-ol:pl-6"
                    />
                  )}
              </div>
            )}

            {/* Slider Wrapper */}
            <div 
                className="relative w-full max-w-7xl mx-auto group cursor-grab active:cursor-grabbing select-none"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Slider Window */}
                <div className="overflow-hidden">
                    <div 
                        className={cn(
                            "flex w-full",
                            // Disable transition during dragging to make it follow cursor instantly
                            // Enable transition when releasing to snap smoothly
                            !isDragging ? "transition-transform duration-500 ease-in-out" : ""
                        )}
                        style={{ transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))` }}
                    >
                        {items.map((logo, index) => (
                            <div key={index} className="w-full flex-shrink-0 px-4">
                                <img 
                                    src={logo.image} 
                                    alt={logo.alt || `Client Logos Slide ${index + 1}`} 
                                    className="w-full h-auto object-contain pointer-events-none mx-auto max-w-7xl" 
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-3 mt-10">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                            "w-3 h-3 rounded-full transition-all duration-300",
                            currentSlide === index 
                                ? "bg-brand-dark scale-110" 
                                : "bg-ui-dot hover:bg-gray-400"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Descriptive Text - Moved below pagination */}
            {footerText && (
              <p className="text-center font-heading font-bold text-[20px] text-brand-dark opacity-70 mt-10 max-w-7xl mx-auto leading-relaxed">
                  {footerText}
              </p>
            )}
        </div>
    </section>
  );
};

export default TrustedBy;

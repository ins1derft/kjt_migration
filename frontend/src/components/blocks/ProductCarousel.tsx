
'use client';
import Image from "next/image";
import React, { useRef, useState, MouseEvent, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { getProducts } from "@/lib/api";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";
import RichText from "../RichText";

export interface ProductCard {
  title: string;
  tagline: string;
  image: string;
  link: string | null;
  category: string;
}

export interface ProductCarouselQuery {
  limit?: number;
  fields?: string[];
  filter?: Record<string, string | number | boolean | null | undefined>;
  items?: string[];
}

const normalizeItems = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter(Boolean) as string[];
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  return [];
};

export interface ProductCarouselProps {
  title: string;
  description: string;
  query?: ProductCarouselQuery;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, description, query, padding, backgroundClass, backgroundColor }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<ProductCard[]>([]);
  
  // State for drag functionality
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Refs for momentum/inertia calculation
  const velocityRef = useRef(0);
  const rafId = useRef<number | null>(null);
  const lastPageX = useRef(0);
  const lastTime = useRef(0);
  const autoplayIntervalRef = useRef<number | null>(null);

  // Fetch products + cleanup animation on unmount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const requiredFields = ['slug', 'name', 'slogan', 'hero_image', 'landing_page_slug'];
      const effectiveFields =
        query?.fields && query.fields.length
          ? Array.from(new Set([...query.fields, ...requiredFields]))
          : requiredFields;
      const explicitSlugs = normalizeItems(query?.items);
      const products = explicitSlugs.length
        ? (
            await Promise.all(
              explicitSlugs.map(async (slug) => {
                const res = await getProducts({
                  limit: 1,
                  fields: effectiveFields,
                  filter: { slug },
                });
                return res[0];
              })
            )
          ).filter(Boolean)
        : await getProducts({
            limit: query?.limit ?? 12,
            fields: effectiveFields,
            filter: query?.filter,
          });

      if (cancelled) return;

      const mapped = products.map((product) => ({
        title: product.name,
        tagline: product.slogan ?? "",
        image: resolveMediaUrl(product.hero_image) ?? "/images/placeholders/no-image.jpg",
        link: product.landing_page_slug ? `/${product.landing_page_slug}/` : null,
        category: "Product",
      }));

      setItems(mapped);
    }

    load();

    return () => {
      cancelled = true;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (autoplayIntervalRef.current) window.clearInterval(autoplayIntervalRef.current);
    };
  }, [query?.limit, query?.fields, query?.filter, query?.items]);

  // Custom Smooth Scroll Animation
  const scrollToPosition = useCallback((target: number) => {
      if (!scrollRef.current) return;
      
      const start = scrollRef.current.scrollLeft;
      const distance = target - start;
      const duration = 800; // ms - adjustable for smoothness
      const startTime = performance.now();

      // Easing function: easeOutQuart
      const easeOutQuart = (x: number): number => {
          return 1 - Math.pow(1 - x, 4);
      };

      const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = easeOutQuart(progress);
          
          if (scrollRef.current) {
              scrollRef.current.scrollLeft = start + (distance * ease);
          }

          if (progress < 1) {
              rafId.current = requestAnimationFrame(animate);
          } else {
              rafId.current = null;
          }
      };

      // Cancel any existing animation loop (drag momentum or previous click)
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(animate);
  }, []);

  const resetAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      window.clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (!scrollRef.current) return;
    if (items.length <= 1) return;

    resetAutoplay();

    // Legacy site carousel autoplayTimeout = 6000ms
    autoplayIntervalRef.current = window.setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;
      if (isDown || isDragging) return;
      if (rafId.current) return; // don't fight momentum/smooth scrolling

      const firstCard = container.querySelector("[data-product-card]");
      const cardWidth = firstCard ? (firstCard as HTMLElement).getBoundingClientRect().width : 360;
      const gap = 20; // matches gap-5
      const scrollAmount = cardWidth + gap;

      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const atEnd = currentScroll >= maxScroll - scrollAmount * 0.6;

      const targetScroll = atEnd ? 0 : currentScroll + scrollAmount;
      scrollToPosition(targetScroll);
    }, 6000);
  }, [isDown, isDragging, items.length, resetAutoplay, scrollToPosition]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const firstCard = scrollRef.current.querySelector("[data-product-card]");
    const cardWidth = firstCard ? (firstCard as HTMLElement).getBoundingClientRect().width : 360;
    const gap = 20;
    const scrollAmount = cardWidth + gap;

    const currentScroll = scrollRef.current.scrollLeft;
    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

    let targetScroll = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

    scrollToPosition(targetScroll);
    startAutoplay();
  };

  // Start momentum loop
  const startMomentum = (onEnd?: () => void) => {
    // Only start if there's significant velocity
    // Cap max velocity to prevent excessively fast scrolling
    const maxVelocity = 3; 
    if (Math.abs(velocityRef.current) > maxVelocity) {
        velocityRef.current = Math.sign(velocityRef.current) * maxVelocity;
    }

    // If there is no momentum to animate (e.g. click without drag), resume autoplay immediately.
    if (Math.abs(velocityRef.current) < 0.01) {
        onEnd?.();
        return;
    }

    let lastRafTime = Date.now();

    const loop = () => {
        if (!scrollRef.current) return;
        
        const now = Date.now();
        const dt = Math.min(now - lastRafTime, 50); // Limit dt to prevent huge jumps on lag
        lastRafTime = now;

        // Apply Friction (Decay)
        velocityRef.current *= 0.96; 

        // Apply velocity to scroll
        const move = velocityRef.current * dt;
        scrollRef.current.scrollLeft += move;

        // Continue if velocity is still significant
        if (Math.abs(velocityRef.current) > 0.05) {
            rafId.current = requestAnimationFrame(loop);
        } else {
            rafId.current = null;
            onEnd?.();
        }
    };

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(loop);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    resetAutoplay();
    
    // Stop existing momentum or scroll animation
    if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
    }

    setIsDown(true);
    setIsDragging(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setInitialScrollLeft(scrollRef.current.scrollLeft);
    
    // Reset velocity tracking
    lastPageX.current = e.pageX;
    lastTime.current = Date.now();
    velocityRef.current = 0;
  };

  const handleMouseLeave = () => {
    if (isDown) {
        setIsDown(false);
        startMomentum(startAutoplay);
    }
  };

  const handleMouseUp = () => {
    setIsDown(false);
    // Short delay to prevent click firing on drag release
    setTimeout(() => setIsDragging(false), 50);
    startMomentum(startAutoplay);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.0; 
    scrollRef.current.scrollLeft = initialScrollLeft - walk;

    // Calculate Velocity (pixels per ms)
    const now = Date.now();
    const dt = now - lastTime.current;
    
    if (dt > 0) {
        const deltaX = lastPageX.current - e.pageX; 
        const instantaneousVelocity = deltaX / dt;

        // Apply smoothing/low-pass filter
        velocityRef.current = instantaneousVelocity * 0.2 + velocityRef.current * 0.8;
    }
    
    lastPageX.current = e.pageX;
    lastTime.current = now;
  };

  useEffect(() => {
    // Start autoplay when products are ready and user is not interacting.
    if (items.length <= 1) return;
    if (isDown || isDragging) return;
    startAutoplay();
    return () => resetAutoplay();
  }, [isDown, isDragging, items.length, resetAutoplay, startAutoplay]);

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "pt-[115px] pb-[50px]");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-white");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);
  const hasTitle = Boolean(title?.trim());
  const hasDescription = Boolean(description?.trim());
  const hasHeader = hasTitle || hasDescription;
  const displayItems =
    items.length === 0
      ? []
      : items.length >= 5
        ? items
        : Array.from({ length: 5 }, (_, i) => items[i % items.length]);

  return (
    <section className={cn(paddingClass, sectionBackground, "overflow-hidden relative group/carousel")} style={sectionStyle}>
      {hasHeader && (
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 text-center mb-12 md:mb-[96px]">
          {hasTitle && (
            <h2 className="mx-auto w-full max-w-[992px] font-heading font-bold text-[38px] md:text-[64px] leading-[1] text-brand-dark mb-3 md:mb-4">
              {title}
            </h2>
          )}
          {hasDescription && (
            <RichText
              html={description}
              className="font-sans text-[16px] md:text-[20px] text-[#1A1A1A]/70 leading-[1.4] max-w-[711px] md:max-w-[992px] mx-auto md:leading-[1.4] mb-[61px] md:mb-[96px] xl:mb-[72px] prose-p:my-0 prose-headings:font-heading prose-headings:text-brand-dark prose-ul:pl-6 prose-ol:pl-6 prose-ul:my-2 prose-ol:my-2"
            />
          )}
        </div>
      )}

      <div className="relative w-full mx-auto">
        {/* Navigation buttons (match Hero, responsive sizing) */}
        <button
          onClick={() => scroll("left")}
          className="flex absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 items-center justify-center shadow-xl text-brand-dark transition-all hover:scale-110 hover:bg-brand-sky hover:text-white hover:border-brand-sky"
          aria-label="Previous items"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="flex absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 items-center justify-center shadow-xl text-brand-dark transition-all hover:scale-110 hover:bg-brand-sky hover:text-white hover:border-brand-sky"
          aria-label="Next items"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className={cn(
            "w-full overflow-x-auto pb-10 hide-scroll cursor-grab active:cursor-grabbing select-none",
            isDown && "cursor-grabbing"
          )}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div
            className={cn(
              "flex gap-5 md:gap-5 w-max min-w-full px-4 sm:px-6 md:px-10 lg:px-[calc((100vw-1600px)/2+32px)]",
              "snap-x snap-mandatory justify-center"
            )}
          >
            {displayItems.map((product, index) => (
              <div
                key={index}
                className={cn(
                  "relative w-[320px] sm:w-[340px] md:w-[348px] lg:w-[384px] aspect-[384/527] rounded-[20px] overflow-hidden group/card",
                  "shadow-[0_18px_40px_rgba(0,0,0,0.14)] transition-transform duration-500",
                  isDragging ? "pointer-events-none" : product.link ? "cursor-pointer" : "cursor-default"
                )}
                style={{ scrollSnapAlign: "start" }}
                data-product-card
              >
                {product.link ? (
                  <a href={product.link} className="absolute inset-0 z-10" aria-label={product.title} tabIndex={isDragging ? -1 : 0} />
                ) : null}
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(min-width: 1024px) 384px, 100vw"
                  draggable={false}
                  className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                  unoptimized
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-transparent" />

                <div className="absolute inset-x-0 top-0 px-5 sm:px-6 md:px-7 pt-5 sm:pt-6 md:pt-7 text-white text-left">
                  <p className="font-sans text-[15px] font-medium tracking-[0.08em] uppercase text-white/85 leading-[1.2] mb-3">
                    {product.tagline}
                  </p>
                  <h3 className="font-heading font-extrabold text-[24px] md:text-[24px] leading-[1.1] drop-shadow-md">
                    {product.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;

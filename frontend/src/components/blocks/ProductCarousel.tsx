
'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState, MouseEvent, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProducts } from "@/lib/api";

export interface ProductCard {
  title: string;
  tagline: string;
  image: string;
  link: string;
  category: string;
}

export interface ProductCarouselQuery {
  limit?: number;
  fields?: string[];
  filter?: Record<string, string | number | boolean | null | undefined>;
}

export interface ProductCarouselProps {
  title: string;
  description: string;
  query?: ProductCarouselQuery;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, description, query }) => {
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

  // Fetch products + cleanup animation on unmount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const products = await getProducts({
        limit: query?.limit ?? 12,
        fields: query?.fields,
        filter: query?.filter,
      });

      if (cancelled) return;

      const mapped = products.map((product) => ({
        title: product.name,
        tagline: product.slogan ?? "",
        image: product.hero_image ?? "/file.svg",
        link: product.slug ? `/${product.slug}/` : "#",
        category: "Product",
      }));

      setItems(mapped);
    }

    load();

    return () => {
      cancelled = true;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [query?.limit, query?.fields, query?.filter]);

  // Custom Smooth Scroll Animation
  const scrollToPosition = (target: number) => {
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
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 450; // Slightly more than card width + gap
      const currentScroll = scrollRef.current.scrollLeft;
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      
      let targetScroll = direction === 'left' 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount;

      // Clamp target
      targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
      
      scrollToPosition(targetScroll);
    }
  };

  // Start momentum loop
  const startMomentum = () => {
    // Only start if there's significant velocity
    // Cap max velocity to prevent excessively fast scrolling
    const maxVelocity = 3; 
    if (Math.abs(velocityRef.current) > maxVelocity) {
        velocityRef.current = Math.sign(velocityRef.current) * maxVelocity;
    }

    if (Math.abs(velocityRef.current) < 0.01) return;

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
        }
    };

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(loop);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    
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
        startMomentum();
    }
  };

  const handleMouseUp = () => {
    setIsDown(false);
    // Short delay to prevent click firing on drag release
    setTimeout(() => setIsDragging(false), 50);
    startMomentum();
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

  return (
    // Updated Padding: py-16
    <section className="py-16 bg-white overflow-hidden relative group/carousel">
        <div className="container mx-auto px-4 mb-16 text-center">
          <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight text-brand-dark mb-6">
            {title}
          </h2>
          <p className="font-sans text-lg md:text-[20px] text-gray-600 max-w-7xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="relative w-full">
         
         {/* Navigation Buttons */}
         <button 
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 items-center justify-center shadow-xl text-brand-dark transition-all hover:scale-110 hover:bg-brand-sky hover:text-white hover:border-brand-sky opacity-0 group-hover/carousel:opacity-100"
            aria-label="Previous items"
         >
            <ChevronLeft size={28} />
         </button>
         <button 
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 items-center justify-center shadow-xl text-brand-dark transition-all hover:scale-110 hover:bg-brand-sky hover:text-white hover:border-brand-sky opacity-0 group-hover/carousel:opacity-100"
            aria-label="Next items"
         >
            <ChevronRight size={28} />
         </button>

        {/* Scrollable Container */}
        <div 
            ref={scrollRef}
            className={cn(
                "w-full overflow-x-auto pb-12 hide-scroll cursor-grab active:cursor-grabbing select-none",
                isDown && "cursor-grabbing"
            )}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            <div className="flex gap-6 px-4 md:px-8 w-max lg:pl-[max(2rem,calc((100vw-1280px)/2+1rem))] lg:pr-[max(2rem,calc((100vw-1280px)/2+1rem))]">
                {items.map((product, index) => (
                <a
                    key={index}
                    href={product.link || "#"}
                    className={cn(
                        "relative w-[280px] md:w-[380px] h-[380px] md:h-[500px] rounded-[20px] overflow-hidden group/card shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100",
                        isDragging ? "pointer-events-none" : "cursor-pointer"
                    )}
                >
                    <img 
                        src={product.image} 
                        alt={product.title} 
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />
                    
                    {/* Dark gradient from TOP downwards to make top text readable */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity duration-300"></div>
                    
                    {/* Text Content at the TOP */}
                    <div className="absolute top-0 left-0 p-8 w-full text-white text-left">
                        <p className="font-sans text-[12px] font-bold tracking-[0.15em] uppercase text-white/90 mb-3 leading-relaxed">
                            {product.tagline}
                        </p>
                        <h3 className="font-heading font-bold text-[32px] md:text-[36px] leading-tight drop-shadow-md">
                            {product.title}
                        </h3>
                    </div>
                    
                    {/* Action Button at Bottom Right */}
                    <div className="absolute bottom-8 right-8">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover/card:bg-brand-sky group-hover/card:text-white transition-all duration-300 hover:scale-110">
                            <ChevronRight size={24} />
                        </div>
                    </div>
                </a>
            ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;

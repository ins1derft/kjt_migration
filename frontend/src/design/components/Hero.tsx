'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import { Play, ChevronRight, ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    id: 1,
    videoId: "QNT7l1TT7_0",
    alt: "Interactive Floor"
  },
  {
    id: 2,
    videoId: "Ktkh_mW2ADg",
    alt: "Interactive Wall"
  },
  {
    id: 3,
    videoId: "nJSXQ9uxvO0",
    alt: "Alive Sketches"
  },
  {
    id: 4,
    videoId: "ojKgw68k1Qk",
    alt: "Interactive Climbing"
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

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
  }, [currentSlide, isAutoPlaying, isModalOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const getSlideStyles = (index: number) => {
    // Standard distance calculation with wrapping
    let dist = index - currentSlide;
    if (dist > SLIDES.length / 2) dist -= SLIDES.length;
    else if (dist < -SLIDES.length / 2) dist += SLIDES.length;

    // Config
    const GAP_PERCENT = 105; // Gap between slides
    
    let translateX = 0;
    let scale = 1;
    let opacity = 0;
    let zIndex = 0;
    let pointerEvents: 'auto' | 'none' = 'none';

    if (dist === 0) {
        // Active Slide
        translateX = 0;
        scale = 1;
        opacity = 1;
        zIndex = 20;
        pointerEvents = 'auto';
    } else if (dist === 1 || dist === -(SLIDES.length - 1)) {
        // Right Slide
        translateX = GAP_PERCENT;
        scale = 1;
        opacity = 0.5;
        zIndex = 10;
        pointerEvents = 'auto';
    } else if (dist === -1 || dist === (SLIDES.length - 1)) {
        // Left Slide
        translateX = -GAP_PERCENT;
        scale = 1;
        opacity = 0.5;
        zIndex = 10;
        pointerEvents = 'auto';
    } else {
        // Hidden Slides (dist 2, -2, etc)
        // We position them at 0 (center) but scaled down and invisible.
        // This creates a "stack" effect where they emerge from center or disappear into it,
        // preventing the "fly across screen" glitch on wrap-around.
        translateX = 0;
        scale = 0.8; 
        opacity = 0;
        zIndex = 0;
    }

    return {
        style: {
            transform: `translateX(${translateX}%) scale(${scale})`,
            opacity: opacity,
            zIndex: zIndex,
            pointerEvents,
        },
        className: cn(
            "absolute top-0 w-full h-full rounded-[24px] md:rounded-[40px] overflow-hidden transition-all duration-700 ease-in-out bg-black shadow-xl",
            dist === 0 ? "shadow-2xl ring-4 ring-white/50" : "cursor-pointer hover:opacity-80"
        )
    };
  };

  return (
    // Updated Padding: pt-[120px] to clear header, pb-6 to sit close to HeroContent
    <section className="relative pt-[120px] pb-6 bg-brand-gray overflow-hidden">
      
      {/* 1. Main Title Section */}
      <div className="container mx-auto px-4 text-center mb-12">
        <h1 className="font-heading font-bold text-[42px] md:text-[64px] leading-[1.1] text-brand-dark">
          <span className="text-transparent bg-clip-text bg-brand-gradient animate-gradient">
            Interactive
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-brand-gradient animate-gradient">
            Equipment For Kids
          </span>
        </h1>
      </div>

      {/* 2. Carousel Section */}
      <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] flex items-center justify-center mb-10 perspective-[1000px]">
        {/* Adjusted width to allow neighbors to be visible while maintaining same size */}
        <div className="relative w-[85%] md:w-[60%] h-full flex items-center justify-center">
             {SLIDES.map((slide, index) => {
                 const { style, className } = getSlideStyles(index);
                 const isActive = index === currentSlide;
                 
                 return (
                    <div 
                        key={slide.id}
                        onClick={() => !isActive && goToSlide(index)}
                        className={className}
                        style={style}
                    >
                        {/* 1. Thumbnail Background (Always visible as fallback/placeholder) */}
                        <img 
                            src={`https://img.youtube.com/vi/${slide.videoId}/maxresdefault.jpg`}
                            alt={slide.alt} 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        {/* 2. YouTube Iframe (Only if active and modal is NOT open) */}
                        {isActive && !isModalOpen && (
                            <div className="absolute inset-0 w-full h-full overflow-hidden animate-in fade-in duration-1000">
                                <iframe 
                                    className="w-full h-full scale-[1.35] pointer-events-none"
                                    src={`https://www.youtube-nocookie.com/embed/${slide.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${slide.videoId}&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1`}
                                    title={slide.alt}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    style={{ border: 'none' }}
                                />
                            </div>
                        )}

                        {/* 3. Overlay & Controls */}
                         <div className={cn(
                             "absolute inset-0 transition-opacity duration-500",
                             isActive ? "bg-black/0" : "bg-black/20"
                         )}>
                             {/* Controls Container - visible only on active slide */}
                             <div className={cn(
                                 "absolute bottom-6 left-6 md:bottom-12 md:left-12 flex items-center gap-4 transition-all duration-500 delay-100",
                                 isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
                             )}>
                                 {/* Play Button */}
                                 <button 
                                     onClick={(e) => {
                                         e.stopPropagation();
                                         setIsAutoPlaying(false);
                                         setIsModalOpen(true);
                                     }}
                                     className="group flex items-center bg-white rounded-full py-2 pl-2 pr-6 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                                 >
                                     <div className="w-10 h-10 bg-brand-dark rounded-full flex items-center justify-center group-hover:bg-brand-sky transition-colors">
                                         <Play size={14} fill="white" className="text-white ml-0.5" />
                                     </div>
                                     <span className="font-heading font-bold text-[15px] text-brand-dark uppercase tracking-wide ml-3">
                                         Play
                                     </span>
                                 </button>
                                 
                                 {/* Learn More Button */}
                                 <button className="flex items-center px-6 py-3 rounded-full bg-black/20 backdrop-blur-md border border-white/30 text-white font-heading font-bold text-[15px] uppercase tracking-wide hover:bg-black/40 transition-colors">
                                     Learn More
                                 </button>
                             </div>
                         </div>
                    </div>
                 );
             })}
        </div>
        
        {/* Navigation Arrows (Desktop) */}
        <button 
            onClick={() => { setIsAutoPlaying(false); prevSlide(); }}
            className="hidden md:flex absolute left-4 lg:left-12 z-30 w-12 h-12 rounded-full bg-white/80 hover:bg-white items-center justify-center shadow-lg text-brand-dark transition-all hover:scale-110"
        >
            <ChevronLeft size={24} />
        </button>
        <button 
            onClick={() => { setIsAutoPlaying(false); nextSlide(); }}
            className="hidden md:flex absolute right-4 lg:right-12 z-30 w-12 h-12 rounded-full bg-white/80 hover:bg-white items-center justify-center shadow-lg text-brand-dark transition-all hover:scale-110"
        >
            <ChevronRight size={24} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-3 mb-6">
        {SLIDES.map((_, index) => (
            <button
                key={index}
                onClick={() => { setIsAutoPlaying(false); goToSlide(index); }}
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
                src={`https://www.youtube-nocookie.com/embed/${SLIDES[currentSlide].videoId}?autoplay=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`}
                title={SLIDES[currentSlide].alt}
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

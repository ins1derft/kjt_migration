import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

const LOGO_SLIDES = [
  "https://kidsjumptech.com/wp-content/uploads/2023/04/Untitled-3-scaled.jpg",
  "https://kidsjumptech.com/wp-content/uploads/2023/04/Untitled-3-scaled.jpg" 
];

const TrustedBy: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef<number>(0);
  
  const intervalRef = useRef<number | null>(null);

  const startAutoPlay = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % LOGO_SLIDES.length);
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

    if (dragOffset > threshold) {
        // Swipe Right -> Prev Slide
        setCurrentSlide((prev) => (prev - 1 + LOGO_SLIDES.length) % LOGO_SLIDES.length);
    } else if (dragOffset < -threshold) {
        // Swipe Left -> Next Slide
        setCurrentSlide((prev) => (prev + 1) % LOGO_SLIDES.length);
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
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  return (
    <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight text-brand-dark mb-6">
                    Tested. Trusted. Implemented.
                </h2>
                <p className="font-sans text-lg md:text-[20px] text-gray-600 max-w-7xl mx-auto leading-relaxed">
                    Our products have been implemented by leading local and national brands in the entertainment, fitness, and education industry.
                </p>
            </div>

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
                        {LOGO_SLIDES.map((src, index) => (
                            <div key={index} className="w-full flex-shrink-0 px-4">
                                <img 
                                    src={src} 
                                    alt={`Client Logos Slide ${index + 1}`} 
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
                {LOGO_SLIDES.map((_, index) => (
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
            <p className="text-center font-heading font-bold text-[20px] text-brand-dark opacity-70 mt-10 max-w-7xl mx-auto leading-relaxed">
                We manufacture equipment for schools, libraries, museums, development centers, hospitals and home use.
            </p>
        </div>
    </section>
  );
};

export default TrustedBy;
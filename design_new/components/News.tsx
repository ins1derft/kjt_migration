import React, { useState, useEffect, useRef } from 'react';
import { NEWS_DATA } from '../data';
import { cn } from '../lib/utils';

const News: React.FC = () => {
  // Duplicate data to create enough items for the carousel logic to feel full
  const allNews = [...NEWS_DATA, ...NEWS_DATA];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  
  // Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(allNews.length / itemsPerView);

  const goToPage = (pageIndex: number) => {
    setCurrentIndex(pageIndex * itemsPerView);
  };

  // Drag Handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startXRef.current;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const threshold = 50; // Minimum drag to change slide
    
    // Bounds check to prevent sliding past ends
    const maxIndex = allNews.length - itemsPerView;

    if (dragOffset < -threshold) {
        // Dragging Left -> Next Item
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
        }
    } else if (dragOffset > threshold) {
        // Dragging Right -> Prev Item
        if (currentIndex > 0) {
             setCurrentIndex(prev => Math.max(prev - 1, 0));
        }
    }
    
    setDragOffset(0);
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

  // Determine active page index for dots
  const activePageIndex = Math.floor(currentIndex / itemsPerView);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight text-brand-dark mb-4">
                News & Insights
            </h2>
            <p className="font-sans text-lg md:text-[20px] text-gray-600 max-w-7xl mx-auto">
                See How Interactive Technologies are Shaping the Future of Education
            </p>
        </div>

        {/* Carousel Container */}
        <div 
            className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div 
                className={cn(
                    "flex gap-8 pb-10",
                    !isDragging ? "transition-transform duration-500 ease-out" : ""
                )}
                style={{ 
                    // Calculate translation + drag offset
                    transform: `translateX(calc(-${(currentIndex * (100 / itemsPerView))}% + ${dragOffset}px))`
                }}
            >
                {allNews.map((news, idx) => (
                    <div 
                        key={idx} 
                        className="shrink-0 transition-all duration-300"
                        style={{ width: `calc(${100 / itemsPerView}% - ${(32 * (itemsPerView - 1)) / itemsPerView}px)` }}
                    >
                        <div className="bg-white rounded-[10px] shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col group overflow-hidden border border-gray-50 pointer-events-none">
                            {/* Image Container */}
                            <div className="h-[200px] overflow-hidden">
                                <img 
                                    src={news.image} 
                                    alt={news.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            
                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                {/* Date */}
                                <div className="text-[14px] text-brand-dark/70 font-sans mb-3">
                                    {news.date}
                                </div>
                                
                                {/* Tags */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {news.tags.map((tag, i) => (
                                        <span key={i} className="text-[14px] font-bold text-brand-sky uppercase font-sans">
                                            {tag}{i < news.tags.length - 1 ? ',' : ''}
                                        </span>
                                    ))}
                                </div>

                                {/* Title */}
                                <h3 className="font-heading font-bold text-[22px] text-brand-dark leading-tight group-hover:text-brand-sky transition-colors line-clamp-3">
                                    {news.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-4">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => goToPage(idx)}
                    className={cn(
                        "w-3 h-3 rounded-full transition-all duration-300",
                        activePageIndex === idx 
                            ? "bg-brand-dark scale-110" 
                            : "bg-ui-dot hover:bg-gray-400"
                    )}
                    aria-label={`Go to page ${idx + 1}`}
                />
            ))}
        </div>

      </div>
    </section>
  );
};

export default News;
'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { getArticles } from "@/lib/api";
import RichText from "../RichText";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

const CARD_GAP = 20; // px, matches 20px spacing in Figma desktop/tablet

type BlogPost = {
  title: string;
  tags: { slug: string; name: string }[];
  date: string;
  image: string;
  link: string;
};

export interface NewsQuery {
  limit?: number;
  fields?: string[];
  filter?: Record<string, string | number | boolean | null | undefined>;
}

export interface NewsProps {
  title: string;
  description: string;
  query?: NewsQuery;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

const News: React.FC<NewsProps> = ({ title, description, query, padding, backgroundClass, backgroundColor }) => {
  const [items, setItems] = useState<BlogPost[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const renderItems =
    items.length < itemsPerView && items.length > 0
      ? [...items, ...items].slice(0, itemsPerView)
      : items;
  
  // Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const articles = await getArticles({
        limit: query?.limit ?? 8,
        fields: query?.fields,
        filter: query?.filter,
      });

      if (cancelled) return;

      const mapped: BlogPost[] = articles.map((article) => ({
        title: article.title,
        date: article.published_at ? new Date(article.published_at).toLocaleDateString() : "",
        image: resolveMediaUrl(article.featured_image) ?? "/file.svg",
        tags: (article.categories ?? []).map((c) => ({
          slug: c.slug ?? "",
          name: c.name ?? "",
        })).filter((c) => c.slug || c.name),
        link: (() => {
          const categorySlug = article.categories?.[0]?.slug;
          return categorySlug ? `/news/${categorySlug}/${article.slug}` : `/news/${article.slug}`;
        })(),
      }));

      setItems(mapped);
    }

    load();

    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
        return;
      }

      if (window.innerWidth < 1024) {
        setItemsPerView(2);
        return;
      }

      if (window.innerWidth < 1536) {
        setItemsPerView(3);
        return;
      }

      setItemsPerView(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', handleResize);
    };
  }, [query?.limit, query?.fields, query?.filter]);

  const maxIndex = Math.max(0, items.length - itemsPerView);
  const clampedIndex = Math.min(currentIndex, maxIndex);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerView));

  const goToPage = (pageIndex: number) => {
    setCurrentIndex(Math.min(pageIndex * itemsPerView, maxIndex));
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
    if (dragOffset < -threshold) {
        // Dragging Left -> Next Item
        if (clampedIndex < maxIndex) {
            setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
        }
    } else if (dragOffset > threshold) {
        // Dragging Right -> Prev Item
        if (clampedIndex > 0) {
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

  const goPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  // Determine active page index for dots
  const activePageIndex = Math.floor(clampedIndex / itemsPerView);

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "py-[70px]");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-brand-gray");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn(paddingClass, sectionBackground)} style={sectionStyle}>
      <div className="container mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
            <h2 className="font-heading font-bold text-[38px] md:text-[64px] leading-[1.05] md:leading-none text-brand-dark mb-3 tracking-tight">
                {title}
            </h2>
            {description && (
              <RichText
                html={description}
                className="font-sans text-[16px] md:text-[20px] leading-[1.4] text-brand-dark/70 max-w-[463px] mx-auto"
              />
            )}
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
                    "flex pb-10 gap-5 lg:gap-[22px] 2xl:gap-5",
                    !isDragging ? "transition-transform duration-500 ease-out" : ""
                )}
                style={{ 
                    // Calculate translation + drag offset
                    transform: `translateX(calc(-${(clampedIndex * (100 / itemsPerView))}% + ${dragOffset}px))`
                }}
            >
                {renderItems.map((news, idx) => (
                    <div
                        key={idx}
                        className="shrink-0 transition-all duration-300"
                        style={{ width: `calc(${100 / itemsPerView}% - ${(CARD_GAP * (itemsPerView - 1)) / itemsPerView}px)` }}
                    >
                        <div className="bg-white rounded-[10px] shadow-[0px_2px_20.6px_rgba(0,0,0,0.1)] hover:shadow-[0px_6px_26px_rgba(0,0,0,0.12)] transition-shadow h-full min-h-[440px] md:min-h-[434px] flex flex-col group overflow-hidden">
                            {/* Image Container */}
                            <div className="relative">
                              <a href={news.link} className="block h-[213px] md:h-[210px] overflow-hidden">
                                  <img 
                                      src={news.image} 
                                      alt={news.title} 
                                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                              </a>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                {/* Date */}
                                <div className="text-[14px] text-brand-dark/70 font-sans mb-2">
                                    {news.date}
                                </div>
                                
                                {/* Tags */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {news.tags.map((tag, i) => (
                                        <a
                                            key={i}
                                            href={`/news/${tag.slug}`}
                                            className="text-[14px] font-bold text-brand-sky uppercase font-sans hover:underline"
                                        >
                                            {tag.name}{i < news.tags.length - 1 ? ',' : ''}
                                        </a>
                                    ))}
                                </div>

                                {/* Title */}
                                <a href={news.link} className="block">
                                    <h3 className="font-heading font-bold text-[22px] leading-[1.2] text-brand-dark group-hover:text-brand-sky transition-colors line-clamp-3">
                                        {news.title}
                                    </h3>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Mobile arrows overlay (single instance) */}
            {items.length > 1 && (
              <div className="md:hidden absolute inset-y-1/2 left-0 right-0 -translate-y-1/2 flex items-center justify-between px-3 pointer-events-none">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="pointer-events-auto flex w-9 h-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-xl text-brand-dark transition-all hover:scale-110 hover:bg-brand-sky hover:text-white hover:border-brand-sky"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="pointer-events-auto flex w-9 h-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-xl text-brand-dark transition-all hover:scale-110 hover:bg-brand-sky hover:text-white hover:border-brand-sky"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-6 md:mt-8">
            {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => goToPage(idx)}
                    className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-300",
                        activePageIndex === idx 
                            ? "bg-brand-dark" 
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

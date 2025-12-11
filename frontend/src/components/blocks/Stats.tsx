'use client';
import React, { useEffect, useState, useRef } from "react";
import RichText from "../RichText";
import { cn } from "@/lib/utils";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsProps {
  items: StatItem[];
  title?: string;
  description?: string;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

// Component to handle the counting animation
const AnimatedCounter = ({ value, className }: { value: string; className?: string }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  // Parse numeric part and suffix (e.g., "100%" -> 100 and "%")
  const match = value.match(/^(\d+)(.*)$/);
  const targetNumber = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          let startTime: number | null = null;
          const duration = 2000; // 2 seconds animation

          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Ease out cubic function for smooth deceleration
            const ease = 1 - Math.pow(1 - progress, 3);
            
            setCount(Math.floor(ease * targetNumber));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(targetNumber); // Ensure it lands exactly on target
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 } // Trigger when 50% visible
    );

    const node = elementRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [targetNumber]);

  return (
    <span ref={elementRef} className={className}>
      {count}{suffix}
    </span>
  );
};

const Stats: React.FC<StatsProps> = ({ items, title, description, padding, backgroundClass, backgroundColor }) => {
  const hasTitle = Boolean(title?.trim());
  const hasDescription = Boolean(description?.trim());
  const hasHeader = hasTitle || hasDescription;
  // Base layout spacing matches Figma: mobile height 678px, desktop/tablet 535px.
  // Default section padding is fully controlled inside the component to keep pixel alignment.
  const hasCustomPadding = Boolean(
    (typeof padding === 'string' && padding.trim()) ||
    (padding && typeof padding === 'object' && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "py-0");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-brand-dark");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn("relative overflow-hidden", sectionBackground, paddingClass, "min-h-[678px] md:min-h-[535px]")} style={sectionStyle}>
      {/* Parallax Background with 30% dark overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://www.figma.com/api/mcp/asset/8753f6fa-22cc-4d88-b159-511387ee185a")',
          }}
        />
        <div className="absolute inset-0 bg-[rgba(26,26,26,0.3)]" />
      </div>

      <div
        className={cn(
          "relative z-10 mx-auto flex max-w-screen-2xl flex-col items-center px-4",
          "pt-[111px] pb-[104px] md:pt-[150px] md:pb-[150px]"
        )}
      >
        {title && (
          <h2 className="max-w-[906px] text-center font-heading font-bold text-[38px] leading-none text-white md:text-[64px]">
            {title}
          </h2>
        )}

        {description && (
          <RichText
            html={description}
            className="mt-4 max-w-5xl text-center font-sans text-lg text-white/80 md:text-[20px]"
          />
        )}

        <div
          className={cn(
            "w-full max-w-[962px] grid grid-cols-1 gap-y-8 text-center md:grid-cols-3 md:gap-x-10 md:gap-y-0",
            hasHeader ? "mt-8 md:mt-[74px]" : "mt-0"
          )}
        >
          {items.map((stat, index) => {
            const numberColor =
              index === 1 ? "text-white" : "text-brand-sky";

            return (
              <div key={index} className="mx-auto flex w-full flex-col items-center md:w-[294px]">
                <AnimatedCounter
                  value={stat.value}
                  className={cn(
                    "font-heading font-bold text-[64px] leading-none",
                    numberColor
                  )}
                />
                <span className="mt-[7px] w-[294px] text-center font-heading text-[20px] font-normal leading-[26px] text-white">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;

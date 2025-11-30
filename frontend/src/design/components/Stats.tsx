'use client';
import React, { useEffect, useState, useRef } from "react";
import type { StatItem, StatsProps } from "@/design/types";

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

type StatsProps = {
  items: StatItem[];
  title?: string;
  description?: string;
};

const Stats: React.FC<StatsProps> = ({ items, title, description }) => {
  return (
    <section className="relative min-h-[535px] flex items-center bg-brand-dark overflow-hidden">
        {/* Parallax Background with 70% Opacity */}
        <div 
            className="absolute inset-0 z-0 bg-fixed bg-cover bg-center opacity-70 pointer-events-none"
            style={{ 
                backgroundImage: 'url("https://kidsjumptech.com/wp-content/uploads/2023/12/Screenshot-2023-11-29-at-8.05.34%E2%80%AFPM.png")' 
            }}
        />

        <div className="container mx-auto px-4 relative z-10 py-16">
            {/* Heading: 64px on desktop */}
            {title && (
              <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight text-center mb-6 text-white">
                  {title}
              </h2>
            )}
            {description && (
              <p className="font-sans text-lg md:text-[20px] text-white/80 max-w-5xl mx-auto text-center mb-10">
                {description}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {items.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center">
                        {/* Numbers: 64px on desktop */}
                        <AnimatedCounter 
                            value={stat.value}
                            className={`font-heading font-bold text-[48px] md:text-[64px] mb-2 ${
                                index === 1 
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-brand-start via-brand-mid to-brand-end animate-gradient' 
                                : 'text-brand-sky'
                            }`}
                        />
                        {/* Label: 20px on desktop */}
                        <span className="font-heading font-bold text-[18px] md:text-[20px] text-white/90">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default Stats;

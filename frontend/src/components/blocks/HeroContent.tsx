
import React from "react";
import RichText from "../RichText";
import { cn } from "@/lib/utils";
import { resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

export type HeroContentProps = {
  title?: string;
  subtitle?: string;
  text?: string;
  ctaLabel?: string;
  ctaHref?: string;
  padding?: SectionPadding | null;
};

const HeroContent: React.FC<HeroContentProps> = ({ title, subtitle, text, ctaLabel = "Live Demo", ctaHref = "mailto:info@kidsjumptech.com?subject=Live%20Demo", padding }) => {
  const paddingClass = resolveSectionPadding(padding, "pt-6 pb-16");
  return (
    // Updated Padding: pt-6 (small top) to connect to Hero, pb-16 (standard)
    <section className={cn(paddingClass, "bg-brand-gray text-center relative z-10")}> 
        <div className="container mx-auto px-4">
            {/* Updated Size to match standard typography */}
            <h2 className="font-heading font-bold text-[40px] md:text-[64px] text-brand-dark leading-tight mb-6">
                {subtitle ?? title ?? ""}
            </h2>
            {/* Updated Size to match standard typography */}
            {text && (
              <RichText
                html={text}
                className="font-sans text-lg md:text-[20px] text-gray-600 mb-10 leading-relaxed max-w-7xl mx-auto"
              />
            )}
            <a
                href={ctaHref}
                className="inline-block bg-brand-gradient animate-gradient text-white font-heading font-bold text-[15px] uppercase tracking-wide py-[18px] px-10 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
                {ctaLabel}
            </a>
        </div>
    </section>
  );
};

export default HeroContent;

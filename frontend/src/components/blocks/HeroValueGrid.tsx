import React from "react";
import * as Icons from "lucide-react";
import RichText from "../RichText";
import { cn } from "@/lib/utils";
import { resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";
import type { FeatureItem } from "./FeatureGrid";

export type HeroValueGridProps = {
  title?: string;
  subtitle?: string;
  text?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items?: FeatureItem[];
  columns?: 2 | 3 | 4;
  padding?: SectionPadding | null;
};

const HeroValueGrid: React.FC<HeroValueGridProps> = ({
  title,
  subtitle,
  text,
  ctaLabel = "Live Demo",
  ctaHref = "mailto:info@kidsjumptech.com?subject=Live%20Demo",
  items = [],
  columns = 4,
  padding,
}) => {
  const heading = subtitle ?? title ?? "";
  const paddingClass = resolveSectionPadding(padding, "pt-10 pb-20");

  const gridClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  const getIcon = (name: string, className: string) => {
    const iconKey = name as keyof typeof Icons;
    const IconComponent = (Icons[iconKey] || Icons.Star) as React.ElementType;
    return <IconComponent className={className} strokeWidth={1.5} />;
  };

  return (
    <section className={cn(paddingClass, "bg-brand-gray text-center text-brand-dark")}>
      <div className="container mx-auto px-4">
        {heading && (
          <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight mb-4">
            {heading}
          </h2>
        )}

        {text && (
          <RichText
            html={text}
            className="font-sans text-lg md:text-[20px] text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
          />
        )}

        {ctaLabel && ctaHref && (
          <a
            href={ctaHref}
            className="inline-block bg-brand-gradient animate-gradient text-white font-heading font-bold text-[15px] uppercase tracking-wide py-[18px] px-10 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            {ctaLabel}
          </a>
        )}

        {items.length > 0 && (
          <div className={cn("mt-14 grid grid-cols-1 gap-x-12 gap-y-16 text-left", gridClass)}>
            {items.map((item, index) => (
              <div key={index} className="flex flex-col items-start group">
                <div
                  className="shrink-0 transition-transform duration-300 group-hover:scale-110 mb-6 text-brand-sky"
                >
                  {getIcon(item.icon, "w-14 h-14")}
                </div>

                <div>
                  <h3 className="font-heading font-bold text-[22px] md:text-[24px] text-brand-dark mb-4">
                    {item.title}
                  </h3>
                  <RichText
                    html={item.description}
                    className="font-sans leading-relaxed text-gray-600 text-[18px] md:text-[20px]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroValueGrid;

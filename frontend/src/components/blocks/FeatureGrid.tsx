import React from "react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import RichText from "../RichText";
import { resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string | null;
  iconImage?: string | null;
}

export interface FeatureGridProps {
  items: FeatureItem[];
  title?: string;
  description?: string;
  columns?: 2 | 3 | 4;
  iconColor?: 'brand' | 'sky' | 'orange';
  variant?: 'values' | 'features' | 'centered';
  padding?: SectionPadding | null;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ 
    items, 
    title, 
    description,
    columns = 4, 
    iconColor = 'brand',
    variant = 'features',
    padding
}) => {
  
  // Icon mapping helper
  const getIcon = (name: string | null | undefined, className: string) => {
    const iconKey = (name ?? 'Star') as keyof typeof Icons;
    // Ensure the selected property is treated as a React Component
    const IconComponent = (Icons[iconKey] || Icons.Star) as React.ElementType;
    return <IconComponent className={className} strokeWidth={1.5} />;
  };

  const gridClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }[columns];

  const paddingClass = resolveSectionPadding(padding, "py-16");

  return (
    <section className={cn(paddingClass, variant === 'values' ? "bg-brand-gray" : "bg-white")}> 
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight text-center text-brand-dark mb-20">
            {title}
          </h2>
        )}

        {description && (
          <RichText
            html={description}
            className="font-sans text-lg md:text-[20px] text-gray-600 max-w-5xl mx-auto text-center leading-relaxed mb-12 prose-p:my-0 prose-headings:font-heading prose-headings:text-brand-dark prose-headings:mb-3 prose-ul:text-left prose-ol:text-left prose-ul:pl-6 prose-ol:pl-6"
          />
        )}

        {variant === 'centered' ? (
          <div className="flex flex-wrap justify-center md:justify-around gap-8 md:gap-10 lg:gap-12">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center group max-w-xs md:max-w-sm"
              >
                <div
                  className={cn(
                    "shrink-0 transition-transform duration-300 group-hover:scale-110 mb-6",
                    iconColor === 'sky' ? "text-brand-sky" : "text-brand-start"
                  )}
                >
                  {getIcon(item.icon, "w-12 h-12")}
                </div>

                <h3
                  className={cn(
                    "font-heading font-bold transition-colors text-[22px] md:text-[24px] mb-3",
                    "text-brand-dark"
                  )}
                >
                  {item.title}
                </h3>
                <RichText
                  html={item.description}
                  className="font-sans leading-relaxed text-gray-600 text-[18px] md:text-[20px]"
                />
              </div>
            ))}
          </div>
        ) : (
          /* Increased gap-y to 16 for better vertical spacing like the design */
          <div className={`grid grid-cols-1 ${gridClass} gap-x-12 gap-y-16`}>
            {items.map((item, index) => (
              <div key={index} className="flex flex-col items-start text-left group">
                
                {/* Icon Container */}
                <div className={cn(
                    "shrink-0 transition-transform duration-300 group-hover:scale-110 mb-6",
                    iconColor === 'sky' ? "text-brand-sky" : "text-brand-start" 
                )}>
                   {variant === 'values' ? (
                       // Values section icons
                       getIcon(item.icon, "w-14 h-14")
                   ) : (
                      // Features section icons (Design Match)
                       getIcon(item.icon, "w-12 h-12")
                   )}
                </div>

                <div>
                  <h3 className={cn(
                      "font-heading font-bold transition-colors",
                      "text-[22px] md:text-[24px]",
                      variant === 'features' ? "mb-3" : "mb-4", // Margin adjustment: 12px (mb-3) for features
                      variant === 'features' 
                          ? "text-brand-dark" 
                          : "text-brand-dark group-hover:text-brand-sky"
                  )}>
                      {item.title}
                  </h3>
                  <RichText
                    html={item.description}
                    className={cn(
                      "font-sans leading-relaxed",
                      variant === 'features'
                          ? "text-brand-dark/70 text-[18px] md:text-[20px]" 
                          : "text-gray-600 text-[18px] md:text-[20px]"
                    )}
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

export default FeatureGrid;

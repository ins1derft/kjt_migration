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
  padding?: SectionPadding | null;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ 
    items, 
    title, 
    description,
    columns = 3, 
    padding
}) => {
  
  // Icon mapping helper — used as a fallback when no admin-uploaded iconImage is provided
  const getIcon = (name: string | null | undefined, className: string) => {
    const iconKey = (name ?? 'Star') as keyof typeof Icons;
    // Ensure the selected property is treated as a React Component
    const IconComponent = (Icons[iconKey] || Icons.Star) as React.ElementType;
    return <IconComponent className={className} strokeWidth={1.5} />;
  };

  const gridClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  const paddingClass = resolveSectionPadding(padding, "py-16");

  return (
    <section
      className={cn(
        paddingClass,
        "bg-white",
        // Figma-aligned vertical rhythm
        "pt-[100px] pb-[120px] md:pt-[110px] md:pb-[130px] lg:pt-[120px] lg:pb-[140px]"
      )}
    > 
      <div className="mx-auto w-full max-w-[1320px] px-[19px] md:px-[50px] 2xl:px-0">
        {title && (
          <h2 className="font-heading font-bold text-[38px] md:text-[64px] leading-none text-center text-brand-dark mb-[60px] md:mb-[64px]">
            {title}
          </h2>
        )}

        {description && (
          <RichText
            html={description}
            className="font-sans text-lg md:text-[20px] text-gray-600 max-w-5xl mx-auto text-center leading-relaxed mb-12 prose-p:my-0 prose-headings:font-heading prose-headings:text-brand-dark prose-headings:mb-3 prose-ul:text-left prose-ol:text-left prose-ul:pl-6 prose-ol:pl-6"
          />
        )}

        <div className={cn(
          "grid grid-cols-1",
          gridClass,
          "gap-y-12 md:gap-y-12 lg:gap-y-14 2xl:gap-y-16",
          "gap-x-10 md:gap-x-16 lg:gap-x-24"
        )}>
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-start text-left group">
              
              {/* Icon Container */}
              <div className={cn(
                  "shrink-0 transition-transform duration-300 group-hover:scale-110 mb-4",
                  "text-brand-orange"
              )}>
                 {item.iconImage ? (
                    <img
                      src={item.iconImage}
                      alt={item.title}
                      className="w-[46px] h-[46px] md:w-[52px] md:h-[52px] 2xl:w-[60px] 2xl:h-[60px] object-contain"
                      loading="lazy"
                    />
                 ) : (
                    getIcon(item.icon, "w-[46px] h-[46px] md:w-[52px] md:h-[52px] 2xl:w-[60px] 2xl:h-[60px]")
                 )}
              </div>

              <div>
                <h3 className="font-heading font-bold text-brand-dark text-[24px] leading-[30px] md:leading-[32px] mb-[14px]">
                    {item.title}
                </h3>
                <RichText
                  html={item.description}
                  className="font-sans text-brand-dark/70 text-[16px] leading-[22px] md:text-[20px] md:leading-[28px] max-w-[335px] lg:max-w-[371px]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;

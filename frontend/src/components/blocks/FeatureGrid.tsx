import React from "react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import RichText from "../RichText";
import { resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string | null; // URL to uploaded file (storage), same contract as hero_values
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
  
  const gridClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  const paddingClass = resolveSectionPadding(padding, "py-16");

  const renderIcon = (icon: string | undefined | null, className: string, alt?: string) => {
    const imageSrc = icon?.startsWith('/icons/') ? icon : resolveMediaUrl(icon);
    if (!imageSrc) return null;
    return <img src={imageSrc} alt={alt ?? ""} className={cn(className, "object-contain")} />;
  };

  return (
    <section
    className={cn(
      paddingClass,
      "bg-white",
      // Figma-aligned vertical rhythm
      "pt-[148px] md:pt-[110px] pb-[225px] md:pb-[130px]"
    )}
    > 
      <div className="container mx-auto w-full px-5 sm:px-6 lg:px-10 2xl:max-w-[1320px]">
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
                 {renderIcon(item.icon, "w-[46px] h-[46px] md:w-[52px] md:h-[52px] 2xl:w-[60px] 2xl:h-[60px]", item.title)}
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

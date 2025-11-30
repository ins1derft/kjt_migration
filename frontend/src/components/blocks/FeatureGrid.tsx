import React from "react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface FeatureGridProps {
  items: FeatureItem[];
  title?: string;
  columns?: 2 | 3 | 4;
  iconColor?: 'brand' | 'sky' | 'orange';
  variant?: 'values' | 'features';
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ 
    items, 
    title, 
    columns = 4, 
    iconColor = 'brand',
    variant = 'features'
}) => {
  
  // Icon mapping helper
  const getIcon = (name: string, className: string) => {
    const iconKey = name as keyof typeof Icons;
    // Ensure the selected property is treated as a React Component
    const IconComponent = (Icons[iconKey] || Icons.Star) as React.ElementType;
    return <IconComponent className={className} strokeWidth={1.5} />;
  };

  const gridClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }[columns];

  return (
    <section className={cn("py-16", variant === 'values' ? "bg-brand-gray" : "bg-white")}>
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight text-center text-brand-dark mb-20">
            {title}
          </h2>
        )}

        {/* Increased gap-y to 16 for better vertical spacing like the design */}
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
                    variant === 'features' ? "mb-3" : "mb-4", // Margin adjustment: 12px (mb-3) for features
                    variant === 'features' 
                        ? "text-brand-dark" 
                        : "text-brand-dark group-hover:text-brand-sky"
                )}>
                    {item.title}
                </h3>
                <p className={cn(
                    "font-sans leading-relaxed",
                    variant === 'features'
                        ? "text-brand-dark/70 text-base" 
                        : "text-[17px] text-gray-600"
                )}>
                    {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;

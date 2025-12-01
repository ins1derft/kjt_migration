
'use client';

import React, { useState } from "react";
import RichText from "../RichText";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";
import QuoteModal from "./QuoteModal";
import type { FormConfig } from "@/lib/api";
export interface CTASectionProps {
  title?: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImage?: string;
  backgroundMode?: 'image' | 'class' | null;
  backgroundClass?: string | null;
  ctaMode?: 'link' | 'form' | null;
  formCode?: string | null;
  formTitle?: string | null;
  formConfig?: FormConfig | null;
  textColorClass?: string | null;
  padding?: SectionPadding | null;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  ctaLabel,
  ctaHref,
  backgroundImage,
  backgroundMode,
  backgroundClass,
  ctaMode,
  formCode,
  formTitle,
  formConfig,
  textColorClass,
  padding,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const paddingClass = resolveSectionPadding(padding, "py-24 md:py-32");
  const mode: 'image' | 'class' =
    backgroundMode ?? (backgroundClass ? 'class' : backgroundImage ? 'image' : 'class');
  const isFormMode = (ctaMode ?? 'link') === 'form';
  const textColor = textColorClass ?? (mode === 'image' ? 'text-white' : 'text-brand-dark');

  const sectionClass = cn(
    paddingClass,
    "relative overflow-hidden",
    mode === 'class' ? backgroundClass : "bg-brand-dark"
  );

  const handleCtaClick = (event: React.MouseEvent) => {
    if (!isFormMode) return;
    event.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <section className={sectionClass}>
        {/* Background Image */}
        {mode === 'image' && backgroundImage && (
          <div 
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ 
                  backgroundImage: `url("${resolveMediaUrl(backgroundImage) ?? ""}")` 
              }}
          ></div>
        )}
        
        {/* Dark Overlay for text readability */}
        {mode === 'image' && backgroundImage && <div className="absolute inset-0 z-10 bg-black/60"></div>}

        <div className="container mx-auto px-4 relative z-20">
            <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10">
                
                {/* Text Content */}
                <div className="max-w-3xl text-center lg:text-left">
                    {title && (
                      <h2 className={cn("font-heading font-bold text-[40px] md:text-[56px] leading-[1.1] mb-6", textColor)}>
                          {title}
                      </h2>
                    )}
                    {description && (
                      <RichText
                        html={description}
                        className={cn("font-sans text-lg md:text-xl leading-relaxed font-light", textColor)}
                      />
                    )}
                </div>

                {/* CTA Button */}
                <div className="shrink-0">
                    {isFormMode ? (
                      <button
                        type="button"
                        onClick={handleCtaClick}
                        className="inline-block bg-white text-brand-dark font-heading font-bold text-[18px] py-5 px-10 rounded-full hover:bg-brand-sky hover:text-white transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                      >
                        {ctaLabel}
                      </button>
                    ) : (
                      <a
                          href={ctaHref}
                          className="inline-block bg-white text-brand-dark font-heading font-bold text-[18px] py-5 px-10 rounded-full hover:bg-brand-sky hover:text-white transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                      >
                          {ctaLabel}
                      </a>
                    )}
                </div>

            </div>
        </div>

        {isFormMode && (
          <QuoteModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={formTitle ?? title ?? undefined}
            formTitle={formTitle ?? title ?? undefined}
            formCode={formCode ?? formConfig?.code ?? null}
            formConfig={formConfig ?? null}
          />
        )}
    </section>
  );
};

export default CTASection;

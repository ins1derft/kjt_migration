import React from "react";
import RichText from "../RichText";

export interface HighlightCTAProps {
  title?: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
}

const HighlightCTA: React.FC<HighlightCTAProps> = ({ title, description, ctaLabel, ctaHref }) => {
  return (
    <section className="py-20 bg-brand-dark">
        <div className="container mx-auto px-4">
            <div className="rounded-[20px] p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl bg-brand-orange">
                 <div className="flex-1 text-center lg:text-left text-white">
                    {title && (
                      <h2 className="font-heading font-bold text-[36px] md:text-[50px] leading-tight mb-4">
                          {title}
                      </h2>
                    )}
                    {description && (
                      <RichText
                        html={description}
                        className="font-sans text-lg md:text-[20px] leading-relaxed opacity-95 max-w-4xl text-white"
                      />
                    )}
                 </div>
                 <div className="shrink-0">
                     <a
                        href={ctaHref}
                        className="inline-block bg-white text-brand-dark font-heading font-bold text-[16px] py-4 px-10 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all whitespace-nowrap"
                     >
                        {ctaLabel}
                     </a>
                 </div>
            </div>
        </div>
    </section>
  );
};

export default HighlightCTA;

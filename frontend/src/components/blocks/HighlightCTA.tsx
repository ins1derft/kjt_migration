import React from "react";
import RichText from "../RichText";
import { cn } from "@/lib/utils";
import { resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

export interface HighlightCTAProps {
  title?: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  padding?: SectionPadding | null;
}

const HighlightCTA: React.FC<HighlightCTAProps> = ({ title, description, ctaLabel, ctaHref, padding }) => {
  const paddingClass = resolveSectionPadding(
    padding,
    "py-[100px] md:py-[102px] 2xl:py-[150px]"
  );

  return (
    <section className={cn("bg-brand-dark", paddingClass)}>
      <div className="w-full px-5 md:px-6 lg:px-10 flex justify-center">
        <div className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[711px] lg:max-w-[1089px] 2xl:max-w-[1320px] overflow-hidden rounded-[20px] bg-brand-gradient animate-gradient min-h-[440px] md:min-h-[335px]">
          <div className="relative flex flex-col items-start text-white px-6 md:px-10 lg:px-14 2xl:px-[58px] pt-10 md:pt-[54px] lg:pt-[72px] pb-12 md:pb-10 lg:pb-[42px] gap-4 md:gap-3 lg:gap-4">
            {title && (
              <div className="flex items-start gap-2 md:gap-3">
                <h2 className="font-heading font-bold text-[38px] leading-none tracking-[-0.01em] md:text-[64px] max-w-[260px] md:max-w-[992px]">
                  {title}
                </h2>
              </div>
            )}

            {description && (
              <RichText
                html={description}
                className="prose prose-invert prose-p:my-0 prose-p:leading-[1.4] prose-p:text-[16px] md:prose-p:text-[20px] prose-strong:font-extrabold prose-strong:!text-white !text-white max-w-[260px] md:max-w-[960px]"
              />
            )}

            <div className="flex items-center gap-2 md:gap-3">
              <a
                href={ctaHref}
                className="inline-flex h-[53px] w-[158px] items-center justify-center rounded-full bg-brand-dark text-white font-heading font-bold text-[16px] leading-none transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                {ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightCTA;

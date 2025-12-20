import React from "react";
import RichText from "../RichText";
import { cn } from "@/lib/utils";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

export interface ProductDescriptionProps {
  title?: string;
  description?: string;
  useGradientTitle?: boolean;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  title,
  description,
  useGradientTitle,
  padding,
  backgroundClass,
  backgroundColor,
}) => {
  if (!title && !description) {
    return null;
  }

  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "pt-20 pb-24");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-white");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn(paddingClass, sectionBackground)} style={sectionStyle}>
      <div className="container mx-auto w-full px-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1101px] flex-col items-center text-center">
          {title && (
            <h2
              className={cn(
                "mb-[68px] max-w-[992px] font-heading font-bold text-[38px] md:mb-[38px] md:text-[64px] leading-none md:leading-none",
                useGradientTitle
                  ? "text-transparent bg-clip-text bg-brand-gradient"
                  : "text-brand-dark"
              )}
            >
              {title}
            </h2>
          )}

          {description && (
            <RichText
              html={description}
              className="max-w-[320px] font-sans font-normal text-brand-dark/70 text-[16px] leading-[22.4px] md:max-w-[1101px] md:text-[20px] md:leading-[28px] prose-p:mt-0 prose-p:mb-0 prose-p:text-[16px] md:prose-p:text-[20px] prose-p:leading-[22.4px] md:prose-p:leading-[28px] prose-p:text-brand-dark/70 prose-strong:text-brand-dark prose-a:text-brand-start text-center"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDescription;

import React from "react";
import RichText from "../RichText";
import { cn } from "@/lib/utils";
import { resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

export interface ProductDescriptionProps {
  title?: string;
  description?: string;
  padding?: SectionPadding | null;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ title, description, padding }) => {
  if (!title && !description) {
    return null;
  }

  const paddingClass = resolveSectionPadding(padding, "py-16 md:py-24");

  return (
    <section className={cn(paddingClass, "bg-white")}> 
      <div className="container mx-auto px-4">
        <div className="max-w-[900px] mx-auto text-center">
          {title && (
            <h2 className="font-heading font-bold text-[36px] md:text-[56px] leading-[1.15] text-brand-dark mb-6">
              {title}
            </h2>
          )}

          {description && (
            <RichText
              html={description}
              className="font-sans text-[16px] md:text-[18px] leading-[1.7] text-gray-600 font-normal"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDescription;

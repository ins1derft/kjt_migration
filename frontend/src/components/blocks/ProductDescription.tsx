import React from "react";
import RichText from "../RichText";

export interface ProductDescriptionProps {
  title?: string;
  description?: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ title, description }) => {
  if (!title && !description) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-white">
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

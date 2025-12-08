'use client';

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import RichText from "../RichText";
import { cn } from "@/lib/utils";
import { resolveSectionPadding, resolveSectionBackground, resolveSectionBackgroundStyle, type SectionPadding } from "@/lib/blocks/padding";

export interface FAQItem {
  question?: string | null;
  answer?: string | null;
}

export interface FAQProps {
  title?: string | null;
  items: FAQItem[];
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

const FAQRow: React.FC<FAQItem> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!question) return null;

  return (
    <div className="border-t border-[rgba(26,26,26,0.3)] last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-start justify-between text-left group gap-4"
        aria-expanded={isOpen}
      >
        <span className="font-sans text-[18px] text-brand-dark/70 group-hover:text-brand-dark transition-colors font-normal leading-tight">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "shrink-0 text-brand-dark/70 transition-transform duration-300 mt-1",
            isOpen ? "rotate-180" : ""
          )}
          size={18}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out", 
          isOpen ? "max-h-[500px] opacity-100 pb-6" : "max-h-0 opacity-0"
        )}
      >
        <RichText
          html={answer ?? ""}
          className="font-sans text-[16px] text-gray-500 leading-relaxed pr-8"
        />
      </div>
    </div>
  );
};

const FAQ: React.FC<FAQProps> = ({ title, items = [], padding, backgroundClass, backgroundColor }) => {
  if (!items?.length) return null;

  const midPoint = Math.ceil(items.length / 2);
  const leftCol = items.slice(0, midPoint);
  const rightCol = items.slice(midPoint);
  const hasCustomPadding = Boolean(
    (typeof padding === "string" && padding.trim()) ||
    (padding && typeof padding === "object" && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(padding, hasCustomPadding ? "" : "py-20");
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-white");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section className={cn(paddingClass, sectionBackground)} style={sectionStyle}> 
      <div className="container mx-auto px-5 sm:px-6 lg:px-10">
        {title && (
          <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight text-center text-brand-dark mb-16">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-0">
          <div className="flex flex-col">
            {leftCol.map((item, idx) => (
              <FAQRow key={`left-${idx}`} {...item} />
            ))}
            <div className="hidden md:block border-t border-[rgba(26,26,26,0.3)]"></div>
          </div>
          <div className="flex flex-col">
            {rightCol.map((item, idx) => (
              <FAQRow key={`right-${idx}`} {...item} />
            ))}
            <div className="border-t border-[rgba(26,26,26,0.3)]"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

import React from "react";
import { Gamepad2, Laptop, Users, Settings } from "lucide-react";
import type { WhyUsProps } from "@/design/types";

const WhyUs: React.FC<WhyUsProps> = ({ title, description }) => {
  return (
    <section className="py-20 bg-brand-gray">
        <div className="container mx-auto px-4">
            {title && (
              <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight text-center text-brand-dark mb-4">
                  {title}
              </h2>
            )}
            {description && (
              <p className="font-sans text-lg md:text-[20px] text-gray-600 text-center max-w-4xl mx-auto mb-10">
                {description}
              </p>
            )}

            {/* SVG Defs for Gradient Icons - Using CSS Variables from Config */}
            <svg width="0" height="0" className="absolute">
                <defs>
                    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--brand-start)" />
                        <stop offset="100%" stopColor="var(--brand-end)" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto">
                {/* Row 1: Large Text Cards */}
                
                {/* Card 1 */}
                <div className="bg-white rounded-[24px] p-10 h-[240px] flex flex-col justify-center items-start shadow-sm border border-transparent hover:border-gray-100 transition-all">
                    <span className="font-heading font-bold text-[80px] leading-none mb-2 text-transparent bg-clip-text bg-brand-gradient animate-gradient">
                        2
                    </span>
                    <span className="font-heading font-bold text-[22px] text-brand-dark">Year Warranty</span>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-[24px] p-10 h-[240px] flex flex-col justify-center items-start shadow-sm border border-transparent hover:border-gray-100 transition-all">
                    <span className="font-heading font-bold text-[80px] leading-none mb-2 text-transparent bg-clip-text bg-brand-gradient animate-gradient">
                        No
                    </span>
                    <span className="font-heading font-bold text-[22px] text-brand-dark">Subscriptions</span>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-[24px] p-10 h-[240px] flex flex-col justify-center items-start shadow-sm border border-transparent hover:border-gray-100 transition-all">
                    <span className="font-heading font-bold text-[80px] leading-none mb-2 text-transparent bg-clip-text bg-brand-gradient animate-gradient">
                        24/7
                    </span>
                    <span className="font-heading font-bold text-[22px] text-brand-dark">Tech Support</span>
                </div>

                {/* Row 2: Icon Cards */}

                {/* Card 4 */}
                <div className="bg-white rounded-[24px] p-10 h-[240px] flex flex-col justify-center items-start shadow-sm border border-transparent hover:border-gray-100 transition-all">
                    <div className="mb-6">
                        <Gamepad2 size={64} style={{ stroke: "url(#icon-gradient)" }} strokeWidth={1.5} className="animate-gradient" />
                    </div>
                    <span className="font-heading font-bold text-[22px] text-brand-dark">Free new game releases</span>
                </div>

                {/* Card 5 */}
                <div className="bg-white rounded-[24px] p-10 h-[240px] flex flex-col justify-center items-start shadow-sm border border-transparent hover:border-gray-100 transition-all">
                    <div className="mb-6">
                         <Laptop size={64} style={{ stroke: "url(#icon-gradient)" }} strokeWidth={1.5} className="animate-gradient" />
                    </div>
                    <span className="font-heading font-bold text-[22px] text-brand-dark">Free software updates</span>
                </div>

                {/* Card 6 */}
                <div className="bg-white rounded-[24px] p-10 h-[240px] flex flex-col justify-center items-start shadow-sm border border-transparent hover:border-gray-100 transition-all">
                    <div className="mb-6">
                         <div className="relative w-16 h-16">
                            <Users size={64} style={{ stroke: "url(#icon-gradient)" }} strokeWidth={1.5} className="absolute top-0 left-0 animate-gradient" />
                            <Settings size={28} style={{ stroke: "url(#icon-gradient)", fill: "white" }} strokeWidth={2} className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 animate-gradient" />
                         </div>
                    </div>
                    <span className="font-heading font-bold text-[22px] text-brand-dark">Growing software team</span>
                </div>
            </div>
        </div>
    </section>
  );
};

export default WhyUs;

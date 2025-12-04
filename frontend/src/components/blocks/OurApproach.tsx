import React from 'react';
import { Eye, Hand, Ear, Footprints } from 'lucide-react';
import RichText from '../RichText';
import { cn } from '@/lib/utils';
import { resolveSectionPadding, type SectionPadding } from '@/lib/blocks/padding';

export interface OurApproachProps {
  title?: string;
  description?: string;
  padding?: SectionPadding | null;
}

const OurApproach: React.FC<OurApproachProps> = ({ title = 'Our Approach', description, padding }) => {
  if (!title && !description) return null;

  const paddingClass = resolveSectionPadding(padding, 'py-24');

  return (
    <section className={cn(paddingClass, 'bg-[#F4F5FA] overflow-hidden relative')}>
      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-10 text-center">
        {title && (
          <h2 className="font-heading font-bold text-[40px] md:text-[64px] text-brand-dark mb-6">
            {title}
          </h2>
        )}

        {description && (
          <RichText
            html={description}
            className="font-sans text-[18px] text-gray-600 max-w-2xl mx-auto mb-20 leading-relaxed"
          />
        )}

        {/* Diagram Container */}
        {/* Increased min-height for mobile to accommodate larger ring spread */}
        <div className="relative w-full max-w-[1000px] mx-auto min-h-[550px] md:min-h-[600px] md:aspect-[1.6/1] flex items-center justify-center">
          {/* Concentric Circles Background - 5 Rings */}
          {/*
             Rings expanded on mobile to push icons further out.
             Mobile Ring 3 (Icons) diameter increased from 310px to 380px.
          */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Ring 1 (Smallest) */}
            <div className="absolute w-[230px] h-[230px] md:w-[400px] md:h-[400px] rounded-full border border-gray-300" />
            {/* Ring 2 */}
            <div className="absolute w-[305px] h-[305px] md:w-[500px] md:h-[500px] rounded-full border border-gray-300" />
            {/* Ring 3 (Icons sit here) - Radius 190px on mobile */}
            <div className="absolute w-[380px] h-[380px] md:w-[600px] md:h-[600px] rounded-full border border-gray-300" />
            {/* Ring 4 */}
            <div className="absolute w-[455px] h-[455px] md:w-[700px] md:h-[700px] rounded-full border border-gray-300/80" />
            {/* Ring 5 (Largest) */}
            <div className="absolute w-[530px] h-[530px] md:w-[800px] md:h-[800px] rounded-full border border-gray-300/60" />
          </div>

          {/* Central Controller Graphic */}
          <div className="relative z-10 w-[190px] md:w-[360px] mt-12 md:mt-16">
            {/* Connecting Lines & Text (DESKTOP) */}
            <div className="hidden md:block absolute -top-[80px] left-1/2 -translate-x-1/2 w-[480px] h-[100px] pointer-events-none">
              <svg width="480" height="110" viewBox="0 0 480 110" className="absolute top-0 left-0 overflow-visible">
                {/* Center is 240 */}

                {/* Left Line */}
                <path
                  d="M 240 115 L 240 75 Q 240 30 190 30 L 100 30"
                  fill="none"
                  stroke="#8CBDF9"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="30" r="4" fill="#8CBDF9" />

                {/* Right Line */}
                <path
                  d="M 240 115 L 240 75 Q 240 30 290 30 L 380 30"
                  fill="none"
                  stroke="#C2DEFA"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="380" cy="30" r="4" fill="#C2DEFA" />
              </svg>

              <div className="absolute top-0 left-0 w-full h-full">
                <span className="text-[#4f5459] font-heading font-bold text-[18px] absolute left-[100px] top-[18px] -translate-x-1/2 -translate-y-full whitespace-nowrap">Equipment</span>
                <span className="text-[#4f5459] font-heading font-bold text-[18px] absolute left-[380px] top-[18px] -translate-x-1/2 -translate-y-full whitespace-nowrap">Software</span>
              </div>
            </div>

            {/* Connecting Lines & Text (MOBILE) */}
            {/* Made even more compact (width 220px) to pull text closer to center, away from icons */}
            <div className="md:hidden absolute -top-[65px] left-1/2 -translate-x-1/2 w-[220px] h-[75px] pointer-events-none">
              <svg width="220" height="75" viewBox="0 0 220 75" className="absolute top-0 left-0 overflow-visible">
                {/* Center X is 110 */}
                {/* Endpoints pulled in to X=55 and X=165 (55px from center) */}

                {/* Left Line */}
                <path
                  d="M 110 85 L 110 50 Q 110 25 85 25 L 55 25"
                  fill="none"
                  stroke="#8CBDF9"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="55" cy="25" r="3" fill="#8CBDF9" />

                {/* Right Line */}
                <path
                  d="M 110 85 L 110 50 Q 110 25 135 25 L 165 25"
                  fill="none"
                  stroke="#C2DEFA"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="165" cy="25" r="3" fill="#C2DEFA" />
              </svg>

              <div className="absolute top-0 left-0 w-full h-full">
                <span className="text-[#4f5459] font-heading font-bold text-[12px] absolute left-[55px] top-[18px] -translate-x-1/2 -translate-y-full whitespace-nowrap">Equipment</span>
                <span className="text-[#4f5459] font-heading font-bold text-[12px] absolute left-[165px] top-[18px] -translate-x-1/2 -translate-y-full whitespace-nowrap">Software</span>
              </div>
            </div>

            {/* Controller SVG */}
            <svg
              viewBox="0 0 300 180"
              className="w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-500 relative z-20"
            >
              <defs>
                <linearGradient id="gradLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#8CBDF9', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#6B9FE0', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="gradRight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#C2DEFA', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#A8CBE8', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              {/* Left Half */}
              <path
                d="M 148 20 L 80 20 C 30 20 20 60 20 90 C 20 140 50 160 80 160 C 120 160 130 130 148 130 Z"
                fill="url(#gradLeft)"
              />

              {/* Right Half */}
              <path
                d="M 152 20 L 220 20 C 270 20 280 60 280 90 C 280 140 250 160 220 160 C 180 160 170 130 152 130 Z"
                fill="url(#gradRight)"
              />

              {/* D-Pad (Left) */}
              <path d="M 65 79 L 95 79" stroke="white" strokeWidth="8" strokeLinecap="round" />
              <path d="M 80 64 L 80 94" stroke="white" strokeWidth="8" strokeLinecap="round" />

              {/* Buttons (Right) */}
              <circle cx="215" cy="65" r="8" fill="white" />
              <circle cx="235" cy="85" r="8" fill="white" />
            </svg>
          </div>

          {/* Orbiting Icons - Positioned using center-based translation to stay on rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            {/*
               Math for positioning:
               Ring 3 Mobile diameter: 380px -> Radius 190px. Offset ~134px (0.707 * 190)
               Ring 3 Desktop diameter: 600px -> Radius 300px. Offset ~212px (0.707 * 300)
            */}

            {/* Hearing: Top Left */}
            {/* Offset increased from 110 to 134 on mobile */}
            <div className="absolute w-20 h-20 md:w-32 md:h-32 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center border border-gray-100 hover:border-brand-sky/30 hover:shadow-lg transition-all duration-300 group cursor-default pointer-events-auto transform -translate-x-[134px] -translate-y-[134px] md:-translate-x-[242px] md:-translate-y-[242px]">
              <Ear size={28} strokeWidth={1.5} className="text-brand-dark mb-1 group-hover:text-brand-sky transition-colors md:w-[36px] md:h-[36px]" />
              <span className="font-heading font-bold text-[10px] md:text-base text-brand-dark">Hearing</span>
            </div>

            {/* Touch: Top Right */}
            <div className="absolute w-20 h-20 md:w-32 md:h-32 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center border border-gray-100 hover:border-brand-sky/30 hover:shadow-lg transition-all duration-300 group cursor-default pointer-events-auto transform translate-x-[134px] -translate-y-[134px] md:translate-x-[242px] md:-translate-y-[242px]">
              <Hand size={28} strokeWidth={1.5} className="text-brand-dark mb-1 group-hover:text-brand-sky transition-colors md:w-[36px] md:h-[36px]" />
              <span className="font-heading font-bold text-[10px] md:text-base text-brand-dark">Touch</span>
            </div>

            {/* Movement: Bottom Left */}
            <div className="absolute w-20 h-20 md:w-32 md:h-32 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center border border-gray-100 hover:border-brand-sky/30 hover:shadow-lg transition-all duration-300 group cursor-default pointer-events-auto transform -translate-x-[134px] translate-y-[134px] md:-translate-x-[242px] md:translate-y-[242px]">
              <Footprints size={28} strokeWidth={1.5} className="text-brand-dark mb-1 group-hover:text-brand-sky transition-colors md:w-[36px] md:h-[36px]" />
              <span className="font-heading font-bold text-[10px] md:text-base text-brand-dark">Movement</span>
            </div>

            {/* Vision: Bottom Right */}
            <div className="absolute w-20 h-20 md:w-32 md:h-32 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center border border-gray-100 hover:border-brand-sky/30 hover:shadow-lg transition-all duration-300 group cursor-default pointer-events-auto transform translate-x-[134px] translate-y-[134px] md:translate-x-[212px] md:translate-y-[212px]">
              <Eye size={28} strokeWidth={1.5} className="text-brand-dark mb-1 group-hover:text-brand-sky transition-colors md:w-[36px] md:h-[36px]" />
              <span className="font-heading font-bold text-[10px] md:text-base text-brand-dark">Vision</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurApproach;

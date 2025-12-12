import React from 'react';
import Image from 'next/image';
import { Eye, Hand, Ear, Footprints } from 'lucide-react';
import RichText from '../RichText';
import { cn, resolveMediaUrl } from '@/lib/utils';
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from '@/lib/blocks/padding';

export type OrbitIconItem = {
  title: string;
  icon?: string | null;
};

export interface OurApproachProps {
  title?: string;
  description?: string;
  items?: OrbitIconItem[] | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

const FALLBACK_ORBIT_ICONS = [Ear, Hand, Footprints, Eye] as const;
const OurApproach: React.FC<OurApproachProps> = ({ title, description, items, padding, backgroundClass, backgroundColor }) => {
  if (!title && !description) return null;

  const normalizedItems = (Array.isArray(items) ? items : [])
    .map((item) => ({
      title: typeof item?.title === 'string' ? item.title : '',
      icon: typeof item?.icon === 'string' ? item.icon : null,
    }))
    .filter((item) => item.title.trim().length > 0)
    .slice(0, 5);
  const orbitItems = normalizedItems;
  const orbitCount = Math.min(5, orbitItems.length);
  const isFive = orbitCount === 5;

  const hasCustomPadding = Boolean(
    (typeof padding === 'string' && padding.trim()) ||
    (padding && typeof padding === 'object' && ('top' in padding || 'bottom' in padding))
  );
  const paddingClass = resolveSectionPadding(
    padding,
    hasCustomPadding ? '' : 'pt-[84px] pb-[250px] md:pt-[150px] md:pb-[160px]'
  );
  const sectionBackground = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const resolveOrbitStyle = (mobileX: number, mobileY: number, mdX: number, mdY: number) => {
    const safeMdHalf = 'calc(50vw - 108px)'; // 100px radius + 8px safe margin (prevents overflow ~800px)
    const abs = Math.abs(mdX);
    const mdMagnitude = `min(${abs}px,${safeMdHalf})`;
    const mdXValue = mdX < 0 ? `calc(-1 * ${mdMagnitude})` : mdMagnitude;

    return {
      ['--orbit-x' as never]: `${mobileX}px`,
      ['--orbit-y' as never]: `${mobileY}px`,
      ['--orbit-x-md' as never]: mdX === 0 ? '0px' : mdXValue,
      ['--orbit-y-md' as never]: `${mdY}px`,
    } as React.CSSProperties;
  };

  const orbitPositionsMobile = isFive
    ? ([
        { x: -80, y: 175 },
        { x: 80, y: 175 },
        { x: -115, y: 309.4 },
        { x: 0, y: 330 },
        { x: 115, y: 309.4 },
      ] as const)
    : ([
        { x: -89.6, y: 179.4 },
        { x: 89.4, y: 179.4 },
        { x: -89.6, y: 337.4 },
        { x: 89.68, y: 337.4 },
      ] as const);

  const orbitPositionsMd = isFive
    ? ([
        { x: -300, y: -147 },
        { x: 301, y: -147 },
        { x: -370, y: 100 },
        { x: 0, y: 260 },
        { x: 371, y: 100 },
      ] as const)
    : ([
        { x: -300, y: -147 },
        { x: 301, y: -147 },
        { x: -370, y: 100 },
        { x: 371, y: 100 },
      ] as const);

  const circleClass = cn(
    isFive ? 'w-[110px] h-[110px]' : 'w-[140.8px] h-[140.8px]',
    'md:w-[200px] md:h-[200px]',
    '-translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center gap-[8px] border border-gray-100 hover:border-brand-sky/30 hover:shadow-lg transition-all duration-300 group cursor-default pointer-events-auto'
  );
  const iconClass = cn(
    isFive ? 'w-[55px] h-[55px]' : 'w-[70.4px] h-[70.4px]',
    'md:w-[100px] md:h-[100px]',
    'text-brand-dark group-hover:text-brand-sky transition-colors'
  );
  const labelClass = cn(
    'font-heading font-bold leading-[1.2] text-brand-dark',
    isFive ? 'text-[11px] md:text-base' : 'text-[11.25px] md:text-base'
  );

  const renderOrbitIcon = (item: OrbitIconItem, idx: number) => {
    const iconSrc = resolveMediaUrl(item.icon ?? null);
    if (iconSrc) {
      return (
        <Image
          src={iconSrc}
          alt=""
          width={isFive ? 55 : 70}
          height={isFive ? 55 : 70}
          className={cn(iconClass, 'object-contain')}
          unoptimized
        />
      );
    }

    const FallbackIcon = FALLBACK_ORBIT_ICONS[idx % FALLBACK_ORBIT_ICONS.length] ?? null;
    if (!FallbackIcon) return null;
    return <FallbackIcon strokeWidth={1.5} className={iconClass} />;
  };

  return (
    <section className={cn(paddingClass, sectionBackground, 'overflow-hidden relative')} style={sectionStyle}>
      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-10 text-center">
        {(title || description) && (
          <div className="relative z-20">
            {title && (
              <h2 className="font-heading font-bold text-[38px] md:text-[64px] leading-none text-brand-dark mb-[17px] md:mb-[15px]">
                {title}
              </h2>
            )}

            {description && (
              <RichText
                html={description}
                className="font-heading font-normal text-[16px] md:text-[20px] leading-[1.4] text-brand-dark/70 max-w-[320px] md:max-w-[602px] mx-auto mb-[-24.2px] md:mb-[42px]"
              />
            )}
          </div>
        )}

        {/* Diagram Container */}
        <div className="relative z-0 w-full max-w-[1000px] mx-auto min-h-[422.4px] md:min-h-[600px] flex items-center justify-center">
          {/* Concentric Circles Background - 5 Rings */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Ring 1 (Smallest) */}
            <div className="absolute left-1/2 top-1/2 w-[422.4px] h-[422.4px] md:w-[600px] md:h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ui-dot" />
            {/* Ring 2 */}
            <div className="absolute left-1/2 top-1/2 w-[492.8px] h-[492.8px] md:w-[700px] md:h-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ui-dot" />
            {/* Ring 3 */}
            <div className="absolute left-1/2 top-1/2 w-[563.2px] h-[563.2px] md:w-[800px] md:h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ui-dot" />
            {/* Ring 4 */}
            <div className="absolute left-1/2 top-1/2 w-[633.6px] h-[633.6px] md:w-[900px] md:h-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ui-dot/80" />
            {/* Ring 5 (Largest) */}
            <div className="absolute left-1/2 top-1/2 w-[704px] h-[704px] md:w-[1000px] md:h-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ui-dot/60" />
          </div>

          {/* Central Controller Graphic */}
          <div className="relative z-10 w-[223.168px] md:w-[317px]">
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
                <span className="text-[#4f5459] font-heading font-bold text-base leading-[1.2] absolute left-[100px] top-[18px] -translate-x-1/2 -translate-y-full whitespace-nowrap">Equipment</span>
                <span className="text-[#4f5459] font-heading font-bold text-base leading-[1.2] absolute left-[380px] top-[18px] -translate-x-1/2 -translate-y-full whitespace-nowrap">Software</span>
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
                <span className="text-[#4f5459] font-heading font-bold text-[11.25px] leading-[1.2] absolute left-[55px] top-[18px] -translate-x-1/2 -translate-y-full whitespace-nowrap">Equipment</span>
                <span className="text-[#4f5459] font-heading font-bold text-[11.25px] leading-[1.2] absolute left-[165px] top-[18px] -translate-x-1/2 -translate-y-full whitespace-nowrap">Software</span>
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
          <div className="absolute inset-0 pointer-events-none z-30">
            {orbitItems.slice(0, orbitCount).map((item, idx) => {
              const mobilePos = orbitPositionsMobile[idx] ?? orbitPositionsMobile[orbitPositionsMobile.length - 1]!;
              const mdPos = orbitPositionsMd[idx] ?? orbitPositionsMd[orbitPositionsMd.length - 1]!;

              return (
                <div
                  key={`${item.title}-${idx}`}
                  className="absolute left-1/2 top-1/2"
                  style={resolveOrbitStyle(mobilePos.x, mobilePos.y, mdPos.x, mdPos.y)}
                >
                  <div className="transform translate-x-[var(--orbit-x)] translate-y-[var(--orbit-y)] md:translate-x-[var(--orbit-x-md)] md:translate-y-[var(--orbit-y-md)]">
                    <div className={circleClass}>
                      {renderOrbitIcon(item, idx)}
                      <span className={labelClass}>{item.title}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurApproach;

'use client';

import Image from 'next/image';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SensoryRoomBundleSummary } from '@/lib/blocks/types';
import QuoteModal from '@/components/blocks/QuoteModal';
import RichText from '@/components/RichText';

type Props = {
  bundles: SensoryRoomBundleSummary[];
};

const GallerySlider = ({
  images,
  altFallback,
}: {
  images: { src: string; alt?: string | null }[];
  altFallback: string;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef<number>(0);

  const goPrev = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    setDragOffset(0);
  }, [images.length]);

  const goNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % images.length);
    setDragOffset(0);
  }, [images.length]);

  const handleDragStart = (clientX: number) => {
    if (images.length <= 1) return;
    setIsDragging(true);
    startXRef.current = clientX;
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startXRef.current;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    if (dragOffset > threshold) {
      goPrev();
    } else if (dragOffset < -threshold) {
      goNext();
    } else {
      setDragOffset(0);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => {
    if (isDragging) handleDragEnd();
  };

  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  if (!images.length) {
    return <div className="h-full w-full rounded-[10px] bg-white" aria-hidden />;
  }
  const slideIndexSafe = ((currentSlide % images.length) + images.length) % images.length;

  return (
    <div
      className={cn(
        'group/gallery relative h-full w-full select-none overflow-hidden rounded-[10px] bg-white lg:rounded-none',
        'cursor-grab active:cursor-grabbing'
      )}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={cn(
          'flex h-full w-full',
          !isDragging ? 'transition-transform duration-500 ease-in-out' : ''
        )}
        style={{
          transform: `translateX(calc(-${slideIndexSafe * 100}% + ${dragOffset}px))`,
        }}
      >
        {images.map((img, idx) => (
          <div key={`${img.src}-${idx}`} className="relative h-full w-full shrink-0">
            <Image
              src={img.src}
              alt={img.alt ?? altFallback}
              fill
              className="object-contain"
              sizes="(max-width: 1023px) 320px, (max-width: 1535px) 500px, 582px"
              unoptimized
              draggable={false}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div
          className={cn(
            'absolute inset-y-1/2 left-0 right-0 -translate-y-1/2 flex items-center justify-between px-3',
            'pointer-events-none'
          )}
        >
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goPrev();
            }}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white/90 text-brand-dark shadow-xl backdrop-blur-sm transition-all hover:scale-110 hover:bg-brand-sky hover:text-white hover:border-brand-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goNext();
            }}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white/90 text-brand-dark shadow-xl backdrop-blur-sm transition-all hover:scale-110 hover:bg-brand-sky hover:text-white hover:border-brand-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

const BundlesCard = ({ bundle, onLiveDemo }: { bundle: SensoryRoomBundleSummary; onLiveDemo: () => void }) => {
  const gallery = useMemo(() => bundle.gallery ?? [], [bundle.gallery]);
  const products = useMemo(() => bundle.products ?? [], [bundle.products]);
  const customBundleHref = bundle.custom_bundle_url?.trim() || null;

  return (
    <article
      className={cn(
        'w-full overflow-hidden rounded-[10px] bg-white',
        'shadow-[0px_2px_20.6px_rgba(0,0,0,0.05)]',
        'lg:min-h-[484px]',
        'flex'
      )}
    >
      <div
        className={cn(
          'flex w-full flex-1 flex-col',
          'lg:flex-row lg:items-stretch lg:gap-[40px] lg:pl-[35px] lg:pr-[20px]',
          '2xl:gap-[60px] 2xl:pr-[53px]'
        )}
      >
        <div
          className={cn(
            'order-1 mx-auto mt-[24px] h-[320px] w-full max-w-[320px]',
            'lg:order-2 lg:mx-0 lg:mt-0 lg:h-full lg:w-[500px] lg:max-w-none lg:self-stretch',
            '2xl:w-[582px]'
          )}
        >
          <GallerySlider images={gallery} altFallback={bundle.title} />
        </div>

        <div
          className={cn(
            'order-2 mt-[18px] flex w-full flex-col px-[12px] pb-[17px]',
            'lg:order-1 lg:mt-0 lg:w-[494px] lg:justify-between lg:px-0 lg:pb-[29px] lg:pt-[38px]',
            '2xl:w-[590px]'
          )}
        >
          <div>
            <a
              href={`/sensory-room/${bundle.slug}/`}
              className={cn(
                'inline-flex font-heading text-[24px] font-bold leading-[normal] text-brand-sky lg:text-[34px]',
                'transition-colors hover:underline [text-underline-position:from-font]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-[6px]'
              )}
            >
              {bundle.title}
            </a>

            {bundle.excerpt ? (
              <RichText
                html={bundle.excerpt}
                className={cn(
                  'mt-[19px] font-heading text-[16px] leading-[1.6] text-brand-dark/70 lg:mt-[15px]',
                  'prose-p:my-0 prose-p:font-heading prose-ul:my-0 prose-ol:my-0 prose-li:my-0'
                )}
              />
            ) : null}

            {products.length ? (
              <div className="mt-[19px] lg:mt-[20px]">
                <p className="font-heading text-[16px] leading-[1.2] text-brand-dark lg:text-[18px]">Includes:</p>
                <ul className="mt-[13px] list-disc pl-[24px] font-heading text-[16px] leading-[1.6] text-brand-dark/70 lg:mt-[10px]">
                  {products.map((product) => (
                    <li key={product.slug}>
                      <a
                        href={`/${product.slug}/`}
                        className={cn(
                          'underline [text-underline-position:from-font]',
                          'transition-colors hover:text-brand-sky',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-[4px]'
                        )}
                      >
                        {product.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className={cn('mt-[32px] flex flex-col gap-[13px]', 'lg:mt-0 lg:flex-row lg:gap-[10px]')}>
            {customBundleHref ? (
                  <a
                    href={customBundleHref}
                    className={cn(
                      'inline-flex h-[41px] w-[172px] items-center justify-center',
                      'rounded-[129.091px] border-[1.291px] border-[#ff7770]',
                      'font-heading text-[16px] font-bold leading-[normal] text-[#ff7770] text-center',
                      'transition-transform transition-colors duration-150 hover:scale-[1.02] active:scale-[0.99] hover:bg-[#ff7770] hover:text-white',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
                    )}
                  >
                    Custom Bundle
                  </a>
                ) : null}

                {bundle.form_code ? (
                  <button
                    type="button"
                    onClick={onLiveDemo}
                    className={cn(
                      'inline-flex h-[41px] w-[135px] items-center justify-center',
                      'rounded-[129.091px] bg-gradient-cta',
                      'font-heading text-[16px] font-bold leading-[normal] text-white text-center',
                      'transition-transform duration-150 hover:scale-[1.02] active:scale-[0.99] hover:shadow-cta',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
                    )}
                  >
                    Live Demo
                  </button>
                ) : null}
              </div>
        </div>
      </div>
    </article>
  );
};

const SensoryRoomBundlesListClient: React.FC<Props> = ({ bundles }) => {
  const [activeBundle, setActiveBundle] = useState<SensoryRoomBundleSummary | null>(null);

  if (!bundles.length) return null;

  return (
    <>
      <div className="divide-y divide-ui-dot">
        {bundles.map((bundle, idx) => (
          <div
            key={bundle.slug}
            className={cn(
              idx !== 0 && 'pt-[50px]',
              idx !== bundles.length - 1 && 'pb-[50px]'
            )}
          >
            <BundlesCard bundle={bundle} onLiveDemo={() => setActiveBundle(bundle)} />
          </div>
        ))}
      </div>

      <QuoteModal
        isOpen={Boolean(activeBundle)}
        onClose={() => setActiveBundle(null)}
        formCode={activeBundle?.form_code ?? undefined}
        formTitle={activeBundle?.title ?? undefined}
        title={activeBundle?.title ?? undefined}
        topic={activeBundle?.title ?? undefined}
      />
    </>
  );
};

export default SensoryRoomBundlesListClient;

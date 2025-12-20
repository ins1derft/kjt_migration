'use client';

import Image from 'next/image';
import React, { useCallback, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SensoryRoomBundleDetail } from '@/lib/blocks/types';
import QuoteModal from '@/components/blocks/QuoteModal';
import RichText from '@/components/RichText';
import ClickSpark from '@/components/bits/ClickSpark';

type Props = {
  bundle: SensoryRoomBundleDetail;
};

const extractLeadingStrongTitle = (html?: string | null) => {
  const raw = html?.trim() ?? '';
  if (!raw) return { title: null as string | null, bodyHtml: null as string | null };

  const match = raw.match(/^\s*<p>\s*<strong>([^<]+)<\/strong>\s*<\/p>/i);
  if (!match) return { title: null as string | null, bodyHtml: raw };

  const title = match[1]?.trim() ?? '';
  const bodyHtml = raw.replace(match[0], '').trim();

  return {
    title: title || null,
    bodyHtml: bodyHtml || null,
  };
};

const Gallery = ({ images, altFallback }: { images: { src: string; alt?: string | null }[]; altFallback: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex = useMemo(() => {
    if (!images.length) return 0;
    return ((activeIndex % images.length) + images.length) % images.length;
  }, [activeIndex, images.length]);

  const goPrev = useCallback(() => {
    if (images.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    if (images.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const active = images[safeIndex] ?? null;

  return (
    <div className="w-full lg:max-w-[557px] 2xl:w-[557px]">
      <div className="relative h-[260px] w-full overflow-hidden rounded-[20px] bg-brand-gray sm:h-[320px] lg:h-[437px]">
        {active?.src ? (
          <Image
            src={active.src}
            alt={active.alt ?? altFallback}
            fill
            className="object-cover"
            sizes="(max-width: 1023px) 100vw, 557px"
            priority
            unoptimized
          />
        ) : null}

        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={goPrev}
              className={cn(
                'absolute left-[15px] top-1/2 -translate-y-1/2',
                'flex h-[35px] w-[35px] items-center justify-center rounded-full',
                'border border-gray-100 bg-white/90 text-brand-dark shadow-xl backdrop-blur-sm',
                'transition-all duration-150 hover:scale-[1.05] hover:bg-brand-sky hover:text-white hover:border-brand-sky active:scale-[0.98]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white/70'
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={goNext}
              className={cn(
                'absolute right-[15px] top-1/2 -translate-y-1/2',
                'flex h-[35px] w-[35px] items-center justify-center rounded-full',
                'border border-gray-100 bg-white/90 text-brand-dark shadow-xl backdrop-blur-sm',
                'transition-all duration-150 hover:scale-[1.05] hover:bg-brand-sky hover:text-white hover:border-brand-sky active:scale-[0.98]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white/70'
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-[19px] w-full overflow-x-auto px-[6px] py-[4px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full justify-center gap-[10px]">
            {images.map((img, idx) => {
              const isActive = idx === safeIndex;
              return (
                <button
                  key={`${img.src}-${idx}`}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    'relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[5px] bg-brand-gray',
                    'sm:h-[90px] sm:w-[90px] lg:h-[100px] lg:w-[100px]',
                    'transition',
                    isActive ? 'ring-2 ring-brand-sky ring-offset-2 ring-offset-white' : 'hover:ring-2 hover:ring-brand-sky/50 hover:ring-offset-2 hover:ring-offset-white',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt ?? altFallback}
                    fill
                    className="object-cover"
                    sizes="100px"
                    unoptimized
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const SensoryRoomBundleDetailClient: React.FC<Props> = ({ bundle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const gallery = useMemo(() => bundle.gallery ?? [], [bundle.gallery]);
  const products = useMemo(() => bundle.products ?? [], [bundle.products]);
  const specs = useMemo(() => bundle.specs ?? [], [bundle.specs]);
  const blockAItems = useMemo(() => bundle.block_a_items ?? [], [bundle.block_a_items]);

  return (
    <>
      <section className="bg-white pt-[53px] pb-[120px]">
        <div className="container mx-auto w-full px-5 sm:px-6 lg:px-10 2xl:max-w-[1320px] 2xl:px-0">
          <div className={cn('flex flex-col gap-[40px]', 'lg:flex-row lg:items-start lg:gap-[60px]', '2xl:gap-[103px]')}>
            <Gallery images={gallery} altFallback={bundle.title} />

            <div
              className={cn(
                'w-full rounded-[20px] bg-[#F2F4FA]',
                'px-[20px] py-[28px] sm:px-[28px] sm:py-[34px]',
                'lg:flex-1',
                '2xl:w-[660px] 2xl:flex-none 2xl:pl-[37px] 2xl:pr-[35px] 2xl:pt-[44px] 2xl:pb-[44px]'
              )}
            >
              <div>
                <p className="font-heading text-[24px] font-bold leading-none text-table-text">In Package:</p>
                {products.length ? (
                  <ul className="mt-[20px] flex flex-col gap-[12px]">
                    {products.map((p) => (
                      <li key={p.slug}>
                        <a
                          href={`/${p.slug}/`}
                          className={cn(
                            'inline-flex items-center gap-[18px]',
                            'font-heading text-[18px] leading-[1.4] text-brand-sky',
                            'transition-opacity hover:opacity-80',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2F4FA] rounded-[6px]'
                          )}
                        >
                          <span className="flex h-[34px] w-[34px] items-center justify-center text-[#ff7770]">
                            <Check className="h-[24px] w-[24px]" strokeWidth={3} />
                          </span>
                          {p.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-[20px] font-heading text-[18px] leading-[1.4] text-brand-dark/70">
                    No products selected.
                  </p>
                )}
              </div>

              <div className="mt-[30px] h-px w-full bg-[#ff7770]" />

              <div className="mt-[30px]">
                <p className="font-heading text-[24px] font-bold leading-none text-table-text">Tech Parameters:</p>
                {specs.length ? (
                  <ul className="mt-[20px] list-disc pl-[27px] font-heading text-[18px] leading-[1.4] text-brand-dark/70">
                    {specs.map((spec, idx) => (
                      <li key={`${spec}-${idx}`}>{spec}</li>
                    ))}
                  </ul>
                ) : null}

                {bundle.form_code ? (
                  <ClickSpark sparkColor="#FFE4F0" sparkRadius={16} sparkCount={10} duration={220} easing="linear" className="mt-[21px] inline-block">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className={cn(
                        'inline-flex h-[57px] w-[178px] items-center justify-center rounded-[100px] bg-gradient-cta',
                        'font-heading text-[16px] font-bold leading-[normal] text-white text-center',
                        'transition-transform duration-150 hover:scale-[1.02] active:scale-[0.99] hover:shadow-cta',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2F4FA]'
                      )}
                    >
                      Get a Quote
                    </button>
                  </ClickSpark>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-[100px] h-px w-full bg-ui-dot" />

          <div className="mt-[80px]">
            {bundle.block_a_title ? (
              <h2 className="mx-auto max-w-[992px] text-center font-heading text-[32px] font-bold leading-none text-brand-dark md:text-[44px]">
                {bundle.block_a_title}
              </h2>
            ) : null}

            {blockAItems.length ? (
              <div className={cn('mx-auto mt-[68px] flex w-full flex-col gap-[30px]')}>
                {blockAItems.map((item, idx) => {
                  const iconSrc = item.icon?.trim() || null;
                  const parsed = extractLeadingStrongTitle(item.text);

                  return (
                    <div key={`${idx}`} className="flex gap-[25px]">
                      <div className="h-[29px] w-[29px] shrink-0">
                        {iconSrc ? (
                          <Image src={iconSrc} alt="" width={29} height={29} className="h-[29px] w-[29px] object-contain" unoptimized />
                        ) : null}
                      </div>

                      <div className="flex-1">
                        {parsed.title ? (
                          <p className="font-heading text-[20px] font-bold leading-[1.2] text-brand-dark md:text-[24px]">
                            {parsed.title}
                          </p>
                        ) : null}

                        {parsed.bodyHtml ? (
                          <RichText
                            html={parsed.bodyHtml}
                            className={cn(
                              'mt-[20px] font-heading text-[18px] leading-[1.4] text-brand-dark/70 md:text-[20px]',
                              'prose-p:my-0 prose-p:font-heading prose-p:text-brand-dark/70 prose-p:leading-[1.4]'
                            )}
                          />
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {bundle.block_b_title ? (
              <h2 className="mx-auto mt-[50px] max-w-[992px] text-center font-heading text-[32px] font-bold leading-none text-brand-dark md:text-[44px]">
                {bundle.block_b_title}
              </h2>
            ) : null}

            {bundle.block_b_text ? (
              <RichText
                html={bundle.block_b_text}
                className={cn(
                  'mx-auto mt-[30px] max-w-[1320px] text-center font-heading text-[18px] leading-[1.4] text-brand-dark/70 md:text-[20px]',
                  'prose-p:my-0 prose-p:font-heading prose-p:text-inherit prose-p:leading-[1.4]'
                )}
              />
            ) : null}

            <div className="mt-[50px] h-px w-full bg-ui-dot" />
          </div>
        </div>
      </section>

      {bundle.form_code ? (
        <QuoteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formCode={bundle.form_code ?? undefined}
          formTitle={bundle.title ?? undefined}
          title={bundle.title ?? undefined}
          topic={bundle.title ?? undefined}
        />
      ) : null}
    </>
  );
};

export default SensoryRoomBundleDetailClient;

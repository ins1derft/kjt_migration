'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import RichText from '../RichText';
import { cn } from '@/lib/utils';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';
import ClickSpark from '@/components/bits/ClickSpark';
import QuoteModal from '@/components/blocks/QuoteModal';
import type { FormConfig } from '@/lib/api';

export type CounterShowcaseProps = {
  title?: string | null;
  description?: string | null;
  value?: string | number | null; // e.g. "20+"
  label?: string | null;
  ctaLabel?: string | null;
  formCode?: string | null;
  formTitle?: string | null;
  formConfig?: FormConfig | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
  className?: string;
};

const AnimatedCounter = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        let startTime: number | null = null;
        const duration = 2000;

        const animate = (currentTime: number) => {
          if (!startTime) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);

          setCount(Math.floor(ease * value));

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(value);
          }
        };

        requestAnimationFrame(animate);
      },
      { threshold: 0.5 }
    );

    const node = elementRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [value]);

  return (
    <span ref={elementRef} className={className}>
      {count}
    </span>
  );
};

const CounterShowcase: React.FC<CounterShowcaseProps> = ({
  title,
  description,
  value,
  label,
  ctaLabel,
  formCode,
  formTitle,
  formConfig,
  padding,
  backgroundClass,
  backgroundColor,
  className,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const parsed = useMemo(() => {
    const rawValue =
      typeof value === 'number' ? String(value) : (value ?? '').trim();
    const match = rawValue.match(/^(\d+)(.*)$/);
    const numeric = match ? parseInt(match[1] ?? '0', 10) : 0;
    const suffix = match ? (match[2] ?? '').trim() : '';
    const hasPlus = suffix.includes('+');

    return { numeric, hasPlus };
  }, [value]);

  const effectiveFormCode = formCode ?? formConfig?.code ?? null;
  const hasForm = Boolean(effectiveFormCode);

  const hasCustomPadding = Boolean(
    (typeof padding === 'string' && padding.trim()) ||
      (padding && typeof padding === 'object' && ('top' in padding || 'bottom' in padding))
  );
  const sectionPadding = resolveSectionPadding(
    padding,
    hasCustomPadding
      ? ''
      : 'pt-[104px] pb-[124px] md:pt-[181px] md:pb-[180px]'
  );
  const sectionBg = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  if (!title && !description && !label && !value) return null;

  return (
    <section className={cn(sectionPadding, sectionBg, className)} style={sectionStyle}>
      <div className="container mx-auto w-full px-5 md:px-6 2xl:px-0">
        <div className="mx-auto flex w-full flex-col items-center text-center gap-[22px] md:gap-[20px]">
          {title ? (
            <h2 className="w-full max-w-[320px] font-heading text-[38px] font-bold leading-none text-brand-dark md:max-w-[974px] md:text-[64px]">
              {title}
            </h2>
          ) : null}

          {description ? (
            <RichText
              html={description}
              className={cn(
                'w-full max-w-[320px] font-heading text-[16px] font-normal leading-[1.4] text-brand-dark/70 md:max-w-[1051px] md:text-[20px]',
                'prose-p:my-0 prose-p:font-heading prose-p:text-[16px] prose-p:leading-[1.4] md:prose-p:text-[20px]'
              )}
            />
          ) : null}

          <div className="flex flex-col items-center">
            <div className="relative w-fit">
              <AnimatedCounter
                value={parsed.numeric}
                className="bg-brand-gradient bg-clip-text font-heading text-[207.267px] font-extrabold leading-none text-transparent md:text-[384.495px]"
              />

              {parsed.hasPlus ? (
                <span className="absolute left-[calc(100%+7.8125px)] top-[80.859375px] bg-brand-gradient bg-clip-text font-heading text-[45.281px] font-extrabold leading-none text-transparent md:left-[calc(100%+14px)] md:top-[150px] md:text-[84px]">
                  +
                </span>
              ) : null}

              {label ? (
                <span className="absolute left-1/2 top-[188.671875px] -translate-x-1/2 inline-block whitespace-nowrap text-center font-heading text-[18.328px] font-bold leading-none text-[#656565] md:top-[350px] md:text-[34px]">
                  {label}
                </span>
              ) : null}
            </div>

            {hasForm ? (
              <>
                <ClickSpark
                  sparkColor="#FFE4F0"
                  sparkRadius={14}
                  sparkCount={9}
                  duration={220}
                  easing="linear"
                  className="mt-[76px] w-full max-w-[334px]"
                >
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className={cn(
                      'inline-flex h-[53px] w-full items-center justify-center',
                      'rounded-[100px] bg-gradient-cta shadow-cta',
                      'px-[26px] font-heading text-[16px] font-bold leading-[normal] text-white text-center',
                      'transition-transform duration-150 hover:scale-[1.02] active:scale-[0.99] hover:shadow-lg',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-gray'
                    )}
                  >
                    {(ctaLabel?.trim() || 'Get a Quote')}
                  </button>
                </ClickSpark>

                <QuoteModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  formCode={effectiveFormCode ?? undefined}
                  formTitle={formTitle ?? undefined}
                  formConfig={formConfig ?? null}
                  topic={title ?? label ?? undefined}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CounterShowcase;

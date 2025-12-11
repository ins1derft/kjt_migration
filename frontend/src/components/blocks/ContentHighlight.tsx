import { cn, resolveMediaUrl } from '@/lib/utils';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';
import Image from 'next/image';
import RichText from '../RichText';

type MediaInput = string | { src?: string | null; alt?: string | null } | null;

export type ContentHighlightProps = {
  /** Section title (TinyMCE) */
  title?: string | null;
  /** Section description (TinyMCE). Kept `intro` as legacy alias. */
  description?: string | null;
  intro?: string | null;
  /** Main image on the left */
  image?: MediaInput;
  /** Card title (TinyMCE) */
  cardTitle?: string | null;
  /** Card description (TinyMCE) */
  cardDescription?: string | null;
  /** Footer title (TinyMCE) */
  footerTitle?: string | null;
  /** Footer text (TinyMCE) */
  footerText?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const normalizeMedia = (media: MediaInput) => {
  if (!media) return { src: null, alt: '' };
  if (typeof media === 'string') return { src: resolveMediaUrl(media), alt: '' };
  return { src: resolveMediaUrl(media.src ?? null), alt: media.alt ?? '' };
};

export default function ContentHighlight({
  title,
  description,
  intro,
  image,
  cardTitle,
  cardDescription,
  footerTitle,
  footerText,
  padding,
  backgroundClass,
  backgroundColor,
}: ContentHighlightProps) {
  const paddingClass = resolveSectionPadding(padding, 'pt-[96px] pb-[96px]');
  const sectionBackground = resolveSectionBackground(backgroundClass, 'bg-white');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const headerDescription = description ?? intro ?? null;
  const { src: imageSrc, alt: imageAlt } = normalizeMedia(image);

  const hasContent =
    Boolean(title?.trim()) ||
    Boolean(headerDescription?.trim()) ||
    Boolean(imageSrc) ||
    Boolean(cardTitle?.trim()) ||
    Boolean(cardDescription?.trim()) ||
    Boolean(footerTitle?.trim()) ||
    Boolean(footerText?.trim());

  if (!hasContent) return null;

  const cardPaddingLeft = imageSrc ? 'md:pl-[124px]' : 'md:pl-[48px]';

  return (
    <section className={cn('overflow-hidden', sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto flex flex-col items-center px-5 sm:px-6 md:px-10 text-center">
        {title ? (
          <RichText
            html={title}
            className="text-center font-heading font-bold leading-[1.05] text-brand-dark text-[32px] md:text-[64px] prose-headings:font-heading prose-headings:my-0 prose-p:my-0 prose-strong:font-semibold"
          />
        ) : null}

        {headerDescription ? (
          <RichText
            html={headerDescription}
            className="mt-[15px] max-w-[934px] text-[16px] font-heading leading-[1.4] text-brand-dark/70 md:text-[20px] mx-auto prose-p:my-0 prose-headings:my-0 prose-strong:font-semibold"
          />
        ) : null}

        {(imageSrc || cardTitle || cardDescription) ? (
          <div className="mt-[64px] flex w-full flex-col items-center gap-[32px] md:flex-row md:items-center md:justify-center md:gap-[32px]">
            {imageSrc ? (
              <div className="h-auto w-[274px] overflow-hidden rounded-[20px] shadow-[0px_2px_20.6px_rgba(0,0,0,0.1)] md:z-10 md:-mr-[76px]">
                <div className="relative aspect-[274/343] w-full">
                  <Image
                    src={imageSrc}
                    alt={imageAlt || ''}
                    fill
                    sizes="(max-width: 768px) 80vw, 274px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            ) : null}

            <div
              className={cn(
                'flex-1 rounded-[20px] bg-brand-gray px-[48px] py-[40px] text-left md:min-h-[279px] md:pr-[48px]',
                cardPaddingLeft
              )}
            >
              <div className="max-w-[893px]">
                {cardTitle ? (
                  <RichText
                    html={cardTitle}
                    className="font-heading text-[24px] font-bold leading-[1.2] text-brand-dark prose-p:font-heading prose-headings:font-heading prose-p:my-0 prose-headings:my-0 prose-strong:font-semibold"
                  />
                ) : null}
                {cardDescription ? (
                  <RichText
                    html={cardDescription}
                    className={cn(
                      cardTitle ? 'mt-[20px]' : null,
                      'font-heading text-[20px] leading-[1.4] text-brand-dark/70 prose-p:my-0 prose-headings:my-0 prose-strong:font-semibold'
                    )}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {footerTitle || footerText ? (
          <div className="mt-[38px] w-full">
            {footerTitle ? (
              <RichText
                html={footerTitle}
                className="text-center font-heading font-bold leading-[1.05] text-brand-dark text-[32px] md:text-[64px] prose-headings:font-heading prose-headings:my-0 prose-p:my-0 prose-strong:font-semibold"
              />
            ) : null}
            {footerText ? (
              <RichText
                html={footerText}
                className={cn(
                  footerTitle ? 'mt-[15px]' : null,
                  'max-w-[934px] text-[16px] font-heading leading-[1.4] text-brand-dark/70 md:text-[20px] mx-auto prose-p:my-0 prose-headings:my-0 prose-strong:font-semibold'
                )}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

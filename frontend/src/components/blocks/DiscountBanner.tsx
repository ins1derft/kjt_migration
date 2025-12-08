import Image from "next/image";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";
import ClickSpark from "@/components/bits/ClickSpark";

export interface DiscountBannerProps {
  title: string;
  ctaLabel: string;
  ctaHref: string;
  icon?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
}

const headingClasses = [
  "font-heading font-bold text-brand-dark tracking-[0px]",
  "text-[38px] leading-[45.6px]",
  "lg:text-[44px] lg:leading-[52.8px]",
].join(" ");

const buttonClasses = [
  "inline-flex h-[53px] w-[158px] items-center justify-center",
  "rounded-[100px] bg-brand-dark text-white font-heading font-bold",
  "text-[16px] leading-[20px]",
  "transition-transform transition-colors duration-150 hover:bg-brand-dark/90 hover:scale-[1.02]",
  "focus-visible:outline-none",
  "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-dark/60",
].join(" ");

export default function DiscountBanner({
  title,
  ctaLabel,
  ctaHref,
  icon,
  padding,
  backgroundClass,
  backgroundColor,
}: DiscountBannerProps) {
  const paddingClass = resolveSectionPadding(padding, "");
  const iconSrc = resolveMediaUrl(icon);
  const sectionBackground = resolveSectionBackground(
    backgroundClass,
    "bg-gradient-to-r from-[#ff6c1c] to-[#a2b4ff]"
  );
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        sectionBackground,
        paddingClass,
      )}
      style={sectionStyle}
    >
      <div className="container mx-auto flex w-full flex-col items-start gap-[27px] px-5 py-16 lg:flex-row lg:gap-[26px] lg:py-20 2xl:py-24">
        {iconSrc && (
          <div className="flex h-[93.751px] w-[83.336px] flex-shrink-0 lg:h-[212px] lg:w-[212px]">
            <Image
              src={iconSrc}
              alt=""
              width={212}
              height={212}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        )}

        <div className="flex flex-col gap-[37px] lg:mt-[14px] md:gap-[24px]">
          <h2 className={headingClasses}>{title}</h2>

          <div>
            <ClickSpark sparkColor="#FFE4F0" sparkRadius={14} sparkCount={9} duration={220} easing="linear" className="inline-block">
              <a href={ctaHref} className={buttonClasses}>
                {ctaLabel}
              </a>
            </ClickSpark>
          </div>
        </div>
      </div>
    </section>
  );
}

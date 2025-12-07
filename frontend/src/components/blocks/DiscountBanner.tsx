import Image from "next/image";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { resolveSectionPadding, type SectionPadding } from "@/lib/blocks/padding";

export interface DiscountBannerProps {
  title: string;
  ctaLabel: string;
  ctaHref: string;
  icon?: string | null;
  padding?: SectionPadding | null;
}

const headingClasses = [
  "font-heading font-bold text-brand-dark tracking-[0px]",
  "text-[38px] leading-[45.6px] max-w-[320px]",
  "lg:text-[44px] lg:leading-[52.8px] lg:max-w-[785px]",
].join(" ");

const buttonClasses = [
  "inline-flex h-[53px] w-[158px] items-center justify-center",
  "rounded-[100px] bg-brand-dark text-white font-heading font-bold",
  "text-[16px] leading-[20px]",
  "transition-colors duration-200 hover:bg-brand-dark/90 focus-visible:outline-none",
  "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-dark/60",
].join(" ");

export default function DiscountBanner({
  title,
  ctaLabel,
  ctaHref,
  icon,
  padding,
}: DiscountBannerProps) {
  const paddingClass = resolveSectionPadding(padding, "");
  const iconSrc = resolveMediaUrl(icon);

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-[#ff6c1c] to-[#a2b4ff]",
        paddingClass,
      )}
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

        <div className="flex flex-col gap-[85px] lg:mt-[14px] lg:gap-[77px]">
          <h2 className={headingClasses}>{title}</h2>

          <div>
            <a href={ctaHref} className={buttonClasses}>
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

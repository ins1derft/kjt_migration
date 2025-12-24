import React from "react";
import Image from "next/image";
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from "@/lib/blocks/padding";

export type HowWeWorkCard = {
  text: string;
};

export type HowWeWorkOption = {
  title: string;
  cards: HowWeWorkCard[];
};

export type HowWeWorkProps = {
  title?: string | null;
  options: HowWeWorkOption[];
  padding?: SectionPadding | null;
  decoration?: string | null;
  decorationLeft?: string | null;
  decorationRight?: string | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const DEFAULT_PADDING =
  "pt-[92px] pb-[92px] lg:pt-[223px] lg:pb-[222px] 2xl:pt-[129px] 2xl:pb-28";

const formatStepNumber = (index: number) => String(index + 1).padStart(2, "0");

const HowWeWork: React.FC<HowWeWorkProps> = ({
  title,
  options,
  padding,
  decoration,
  decorationLeft,
  decorationRight,
  backgroundClass,
  backgroundColor,
}) => {
  const paddingClass = resolveSectionPadding(padding, DEFAULT_PADDING);
  const sectionBackground = resolveSectionBackground(backgroundClass, "bg-brand-gray");
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const decorationSrc = resolveMediaUrl(decoration);
  const decorationLeftSrc = resolveMediaUrl(decorationLeft);
  const decorationRightSrc = resolveMediaUrl(decorationRight);

  const safeOptions = Array.isArray(options) ? options.filter(Boolean) : [];

  const renderCard = (option: HowWeWorkOption, card: HowWeWorkCard, index: number) => {
    const isSixCards = option.cards.length === 6;
    const textSizeAtLg = isSixCards ? "lg:text-2xl" : "lg:text-xl";

    return (
      <div
        key={`${option.title}-${index}`}
        className={cn(
          "rounded-[20px] bg-white",
          "h-full min-h-[153px] lg:min-h-[153.33px] 2xl:min-h-[186px]"
        )}
      >
        <div className="px-[16.49px] py-[18.96px] 2xl:px-[20px] 2xl:py-[23px]">
          <div
            className={cn(
              "font-heading font-bold leading-[1.2] text-brand-orange text-[34px]",
              "w-full"
            )}
          >
            {formatStepNumber(index)}
          </div>
          <div
            className={cn(
              "mt-[32.15px] 2xl:mt-[39px]",
              "font-heading font-bold leading-[1.2] text-brand-dark",
              "text-xl",
              textSizeAtLg,
              "2xl:text-2xl",
              "w-full whitespace-pre-line break-words"
            )}
          >
            {card.text}
          </div>
        </div>
      </div>
    );
  };

  const renderOption = (option: HowWeWorkOption, optionIndex: number) => {
    const cards = Array.isArray(option.cards) ? option.cards.filter(Boolean) : [];
    const isSixCards = cards.length === 6;
    const hasSideDecorations = Boolean(isSixCards && decorationLeftSrc && decorationRightSrc);

    const optionGapTop =
      optionIndex === 0
        ? ""
        : "mt-[52px] lg:mt-[87.38px] 2xl:mt-[106px]";

    const optionTitleMt =
      optionIndex === 0 ? "mt-[10.31px]" : "mt-[14.31px]";

    const cardsMt =
      optionIndex === 0 ? "mt-[12px]" : "mt-[34px]";

    return (
      <div key={`${option.title}-${optionIndex}`} className={optionGapTop}>
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "flex items-center justify-center",
              "bg-brand-orange text-white",
              "font-heading font-extrabold leading-[normal] text-[20px]",
              "rounded-[100px]",
              "h-[43.69px] w-[147.56px] 2xl:h-[53px] 2xl:w-[179px]"
            )}
          >
            {`Option ${optionIndex + 1}`}
          </div>

          <h3
            className={cn(
              optionTitleMt,
              "lg:mt-[16.49px] 2xl:mt-[20px]",
              "text-center font-heading font-bold leading-none text-brand-dark whitespace-pre-line",
              "text-[20px] lg:text-[34px]"
            )}
          >
            {option.title}
          </h3>
        </div>

        {/* Mobile: stacked cards */}
        <div className={cn(cardsMt, "lg:mt-[64.3px] 2xl:mt-[78px]")}>
          <div className="grid grid-cols-1 gap-y-[9px] lg:hidden">
            {cards.map((card, index) => renderCard(option, card, index))}
          </div>

          {/* Tablet/Desktop: grid */}
          <div className="hidden lg:block">
            {hasSideDecorations ? (
              <div className="relative mx-auto w-fit">
                {/* Left decoration */}
                <div
                  className={cn(
                    "pointer-events-none absolute select-none",
                    "left-[39.57px] top-[-124.48px] h-[277.81px] w-[237.42px]",
                    "2xl:left-[48px] 2xl:top-[-151px] 2xl:h-[337px] 2xl:w-[288px]"
                  )}
                >
                  <Image
                    src={decorationLeftSrc!}
                    alt=""
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                {/* Right decoration */}
                <div
                  className={cn(
                    "pointer-events-none absolute select-none",
                    "right-[28.85px] top-[53.59px] h-[277.81px] w-[236.6px]",
                    "2xl:right-[35px] 2xl:top-[65px] 2xl:h-[337px] 2xl:w-[287px]"
                  )}
                >
                  <Image
                    src={decorationRightSrc!}
                    alt=""
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                <div
                  className={cn(
                    "relative z-10 grid",
                    "grid-cols-[repeat(4,260.5px)] 2xl:grid-cols-[repeat(4,316px)]",
                    "auto-rows-[minmax(153.33px,auto)] 2xl:auto-rows-[minmax(186px,auto)]",
                    "gap-x-[15.66px] gap-y-[20.61px] 2xl:gap-x-[19px] 2xl:gap-y-[25px]"
                  )}
                >
                  {cards.slice(0, 6).map((card, index) => {
                    const positionClass = [
                      "col-start-2 row-start-1",
                      "col-start-3 row-start-1",
                      "col-start-4 row-start-1",
                      "col-start-1 row-start-2",
                      "col-start-2 row-start-2",
                      "col-start-3 row-start-2",
                    ][index];

                    return (
                      <div key={`${option.title}-${index}`} className={positionClass}>
                        {renderCard(option, card, index)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "mx-auto w-fit grid",
                  "grid-cols-[repeat(4,260.5px)] 2xl:grid-cols-[repeat(4,316px)]",
                  "auto-rows-[minmax(153.33px,auto)] 2xl:auto-rows-[minmax(186px,auto)]",
                  "gap-x-[15.66px] gap-y-[20.61px] 2xl:gap-x-[19px] 2xl:gap-y-[25px]"
                )}
              >
                {cards.map((card, index) => renderCard(option, card, index))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={cn(paddingClass, sectionBackground, "relative overflow-hidden")} style={sectionStyle}>
      {decorationSrc ? (
        <Image
          src={decorationSrc}
          alt=""
          width={2222}
          height={1973}
          className="pointer-events-none absolute left-[-238px] top-[42.25px] hidden max-w-none lg:block"
          unoptimized
        />
      ) : null}

      <div
        className={cn(
          "container mx-auto w-full",
          "px-5 md:px-8 lg:px-[50px] 2xl:px-0",
          "lg:max-w-none 2xl:max-w-[1321px]",
          "relative z-10"
        )}
      >
        {title ? (
          <h2 className="mx-auto w-full max-w-[992px] text-center font-heading font-bold leading-none text-brand-dark text-[38px] lg:text-[64px] whitespace-pre-line">
            {title}
          </h2>
        ) : null}

        <div className="mt-[41px] lg:mt-[73px] 2xl:mt-[42px]">
          {safeOptions.map(renderOption)}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;

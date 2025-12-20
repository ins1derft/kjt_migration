import React from "react";
import type { BlockInput, ProductSummary, ProductVariant } from "./types";
import Hero, { type HeroProps } from "@/components/blocks/Hero";
import FeatureGrid, {
  type FeatureGridProps,
} from "@/components/blocks/FeatureGrid";
import HowWeWork, { type HowWeWorkProps } from "@/components/blocks/HowWeWork";
import HeroValueGrid, {
  type HeroValueGridProps,
} from "@/components/blocks/HeroValueGrid";
import ProductCarousel, {
  type ProductCarouselProps,
} from "@/components/blocks/ProductCarousel";
import GamesGallery, {
  type GamesGalleryProps,
} from "@/components/blocks/GamesGallery";
import GameDetail, {
  type GameDetailProps,
} from "@/components/blocks/GameDetail";
import GamesGrid, { type GamesGridProps } from "@/components/blocks/GamesGrid";
import News, { type NewsProps } from "@/components/blocks/News";
import Stats, { type StatsProps } from "@/components/blocks/Stats";
import WhyUs, { type WhyUsProps } from "@/components/blocks/WhyUs";
import FAQ, { type FAQProps } from "@/components/blocks/FAQ";
import CTASection, {
  type CTASectionProps,
} from "@/components/blocks/CTASection";
import HighlightCTA, {
  type HighlightCTAProps,
} from "@/components/blocks/HighlightCTA";
import Reviews, { type ReviewsProps } from "@/components/blocks/Reviews";
import TrustedBy, { type TrustedByProps } from "@/components/blocks/TrustedBy";
import ProductDescription, {
  type ProductDescriptionProps,
} from "@/components/blocks/ProductDescription";
import DiscountBanner, {
  type DiscountBannerProps,
} from "@/components/blocks/DiscountBanner";
import GradientFormBanner, {
  type GradientFormBannerProps,
} from "@/components/blocks/GradientFormBanner";
import SpecialNeeds, {
  type SpecialNeedsProps,
} from "@/components/blocks/SpecialNeeds";
import ProductSpecs, {
  type ProductSpecsProps,
} from "@/components/blocks/ProductSpecs";
import CompareModels, {
  type CompareModelsProps,
} from "@/components/blocks/CompareModels";
import ProductHero, {
  type ProductHeroProps,
} from "@/components/blocks/ProductHero";
import ProductNav, {
  type ProductNavProps,
} from "@/components/blocks/ProductNav";
import OurApproach, {
  type OurApproachProps,
} from "@/components/blocks/OurApproach";
import PageHeader, {
  type PageHeaderProps,
} from "@/components/blocks/PageHeader";
import LargeBanners, {
  type LargeBannersProps,
} from "@/components/blocks/LargeBanners";
import LargeBannersCommitment, {
  type LargeBannersCommitmentProps,
} from "@/components/blocks/LargeBannersCommitment";
import RichTextBlock, {
  type RichTextBlockProps,
} from "@/components/blocks/RichTextBlock";
import InteractiveShowcase, {
  type InteractiveShowcaseProps,
} from "@/components/blocks/InteractiveShowcase";
import InteractiveEquipment, {
  type InteractiveEquipmentProps,
} from "@/components/blocks/InteractiveEquipment";
import HospitalEquipment, {
  type HospitalEquipmentProps,
} from "@/components/blocks/HospitalEquipment";
import PotentialUses, {
  type PotentialUsesProps,
} from "@/components/blocks/PotentialUses";
import AppreciationLetters, {
  type AppreciationLettersProps,
} from "@/components/blocks/AppreciationLetters";
import TeamGrid, { type TeamGridProps } from "@/components/blocks/TeamGrid";
import ContentHighlight, {
  type ContentHighlightProps,
} from "@/components/blocks/ContentHighlight";
import CustomSoftware, {
  type CustomSoftwareProps,
} from "@/components/blocks/CustomSoftware";
import CustomSoftwareDevelopmentIntro, {
  type CustomSoftwareDevelopmentIntroProps,
} from "@/components/blocks/CustomSoftwareDevelopmentIntro";
import FeatureGridIntro, {
  type FeatureGridIntroProps,
} from "@/components/blocks/FeatureGridIntro";
import SoftwareEquipment, {
  type SoftwareEquipmentProps,
} from "@/components/blocks/SoftwareEquipment";
import GameDistribution, {
  type GameDistributionProps,
} from "@/components/blocks/GameDistribution";
import PracticeShowcase, {
  type PracticeShowcaseProps,
} from "@/components/blocks/PracticeShowcase";
import Research, { type ResearchProps } from "@/components/blocks/Research";
import ResearchResults, {
  type ResearchResultsProps,
} from "@/components/blocks/ResearchResults";
import ExclusiveOffer, {
  type ExclusiveOfferProps,
} from "@/components/blocks/ExclusiveOffer";
import SummerCamp, {
  type SummerCampProps,
} from "@/components/blocks/SummerCamp";
import RatingSummary, {
  type RatingSummaryProps,
} from "@/components/blocks/RatingSummary";
import ContactForm, {
  type ContactFormProps,
} from "@/components/blocks/ContactForm";
import MultiStepContactForm, {
  type MultiStepContactFormProps,
} from "@/components/blocks/MultiStepContactForm";
import ContactInfoMap, {
  type ContactInfoMapProps,
} from "@/components/blocks/ContactInfoMap";
import GuideIntro, {
  type GuideIntroProps,
} from "@/components/blocks/GuideIntro";
import IconTitleText, {
  type IconTitleTextProps,
} from "@/components/blocks/IconTitleText";
import CounterShowcase, {
  type CounterShowcaseProps,
} from "@/components/blocks/CounterShowcase";
import SensoryRoomBundles, {
  type SensoryRoomBundlesProps,
} from "@/components/blocks/SensoryRoomBundles";
import type { FormConfig, SiteSettings } from "@/lib/api";
import { resolveBlockAnchor } from "./anchors";

export type BlockContext = {
  product?: ProductSummary | null;
  variants?: ProductVariant[] | null;
  formConfig?: FormConfig | null;
  formsByCode?: Record<string, FormConfig | null>;
  siteSettings?: SiteSettings | null;
};

type ProductHeroBlockValues = ProductHeroProps & {
  useProductData?: boolean | null;
};

const resolveBackgroundClass = (
  values?: { backgroundClass?: unknown } | null,
) =>
  typeof values?.backgroundClass === "string" ? values.backgroundClass : null;
const resolveBackgroundColor = (
  values?: { backgroundColor?: unknown } | null,
) =>
  typeof values?.backgroundColor === "string" ? values.backgroundColor : null;

export function renderBlocks(blocks: BlockInput[], context: BlockContext = {}) {
  const usedAnchors = new Set<string>();

  return blocks.map((block, index) => {
    const layout = block.name;
    const { product, variants, formConfig, formsByCode, siteSettings } = context;

    const anchor = resolveBlockAnchor(block, index, usedAnchors);
    let content: React.ReactNode = null;

    switch (layout) {
      case "appreciation_letters": {
        const raw = (block.values ?? {}) as Partial<AppreciationLettersProps>;
        const props: AppreciationLettersProps = {
          title: raw.title,
          tabs: raw.tabs ?? [],
          query: raw.query,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <AppreciationLetters {...props} />;
        break;
      }
      case "team_grid": {
        const raw = (block.values ?? {}) as Partial<TeamGridProps>;
        const props: TeamGridProps = {
          title: raw.title,
          query: raw.query,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <TeamGrid {...props} />;
        break;
      }
      case "team_highlight": {
        const raw = (block.values ?? {}) as Partial<
          ContentHighlightProps & { image?: unknown; alt?: unknown }
        >;
        const props: ContentHighlightProps = {
          title: raw.title,
          description: raw.description ?? raw.intro,
          intro: raw.intro,
          image: raw.image
            ? { src: raw.image as string, alt: (raw as { alt?: string }).alt }
            : raw.image ?? null,
          cardTitle: raw.cardTitle,
          cardDescription: raw.cardDescription,
          footerTitle: raw.footerTitle,
          footerText: raw.footerText,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <ContentHighlight {...props} />;
        break;
      }
      case "game_distribution": {
        const raw = (block.values ?? {}) as Partial<
          GameDistributionProps & { image?: unknown; alt?: unknown }
        >;
        const props: GameDistributionProps = {
          title: raw.title,
          description: raw.description,
          media:
            raw.media ??
            (raw.image
              ? { src: raw.image as string, alt: (raw as { alt?: string }).alt }
              : null),
          videoId: raw.videoId,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <GameDistribution {...props} />;
        break;
      }
      case "practice_showcase": {
        const raw = (block.values ?? {}) as Partial<
          PracticeShowcaseProps & { image?: unknown; alt?: unknown }
        >;
        const props: PracticeShowcaseProps = {
          title: raw.title,
          description: raw.description,
          media:
            raw.media ??
            (raw.image
              ? { src: raw.image as string, alt: (raw as { alt?: string }).alt }
              : null),
          videoId: raw.videoId,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <PracticeShowcase {...props} />;
        break;
      }
      case "research": {
        const raw = (block.values ?? {}) as Partial<
          ResearchProps & { personImage?: unknown; personAlt?: string | null }
        >;
        const props: ResearchProps = {
          title: raw.title,
          leftTitle: raw.leftTitle,
          leftText: raw.leftText,
          personName: raw.personName,
          personText: raw.personText,
          personImage:
            typeof raw.personImage === "object" && raw.personImage !== null
              ? raw.personImage
              : raw.personImage
                ? {
                    src: raw.personImage as string,
                    alt: raw.personAlt ?? undefined,
                  }
                : null,
          personAlt: raw.personAlt,
          description: raw.description,
          videoId: raw.videoId,
          learnMoreHref: raw.learnMoreHref,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <Research {...props} />;
        break;
      }
      case "research_results": {
        const raw = (block.values ?? {}) as Partial<ResearchResultsProps>;
        const props: ResearchResultsProps = {
          title: raw.title,
          description: raw.description,
          items: raw.items ?? [],
          decoration: raw.decoration,
          decorationMobile: raw.decorationMobile,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <ResearchResults {...props} />;
        break;
      }
      case "exclusive_offer": {
        const raw = (block.values ?? {}) as Partial<ExclusiveOfferProps>;
        const props: ExclusiveOfferProps = {
          title: raw.title,
          description: raw.description,
          items: raw.items ?? [],
          defaultFormCode: (raw as { defaultFormCode?: string | null })
            ?.defaultFormCode,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
          formsByCode,
        };
        content = <ExclusiveOffer {...props} />;
        break;
      }
      case "rating_summary": {
        const raw = (block.values ?? {}) as Partial<RatingSummaryProps>;
        const props: RatingSummaryProps = {
          title: raw.title,
          rating: raw.rating,
          ctaLabel: raw.ctaLabel,
          ctaHref: raw.ctaHref,
          footerText: raw.footerText,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <RatingSummary {...props} />;
        break;
      }
      case "summer_camp": {
        const raw = (block.values ?? {}) as Partial<SummerCampProps>;
        const props: SummerCampProps = {
          title: raw.title,
          description: raw.description,
          features: raw.features ?? [],
          videoId: raw.videoId ?? null,
          learnMoreHref: raw.learnMoreHref ?? null,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <SummerCamp {...props} />;
        break;
      }
      case "custom_software": {
        const raw = (block.values ?? {}) as Partial<CustomSoftwareProps>;
        const props: CustomSoftwareProps = {
          title: raw.title,
          description: raw.description,
          gridTitle: raw.gridTitle,
          items: raw.items,
          footerText: raw.footerText,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <CustomSoftware {...props} />;
        break;
      }
      case "custom_software_development_intro": {
        const raw = (block.values ?? {}) as Partial<CustomSoftwareDevelopmentIntroProps>;
        const props: CustomSoftwareDevelopmentIntroProps = {
          title: raw.title,
          description: raw.description,
          gridTitle: raw.gridTitle,
          items: raw.items,
          decorationLeft: raw.decorationLeft,
          decorationRight: raw.decorationRight,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <CustomSoftwareDevelopmentIntro {...props} />;
        break;
      }
      case "feature_grid_intro": {
        const raw = (block.values ?? {}) as Partial<FeatureGridIntroProps>;
        const props: FeatureGridIntroProps = {
          title: raw.title,
          description: raw.description,
          gridTitle: raw.gridTitle,
          items: raw.items,
          secondaryDescription: raw.secondaryDescription,
          secondaryItems: raw.secondaryItems,
          footerText: raw.footerText,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
          siteSettings,
        };
        content = <FeatureGridIntro {...props} />;
        break;
      }
      case "software_equipment": {
        const raw = (block.values ?? {}) as Partial<SoftwareEquipmentProps>;
        const props: SoftwareEquipmentProps = {
          title: raw.title,
          description: raw.description,
          label: raw.label,
          items: raw.items ?? [],
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <SoftwareEquipment {...props} />;
        break;
      }
      case "potential_uses": {
        const raw = (block.values ?? {}) as Partial<PotentialUsesProps>;
        const props: PotentialUsesProps = {
          title: raw.title,
          tabs: raw.tabs ?? [],
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <PotentialUses {...props} />;
        break;
      }
      case "hero": {
        const raw = (block.values ?? {}) as Partial<HeroProps>;
        content = (
          <Hero
            {...raw}
            backgroundClass={resolveBackgroundClass(raw)}
            backgroundColor={resolveBackgroundColor(raw)}
          />
        );
        break;
      }
      case "page_header": {
        const raw = (block.values ?? {}) as Partial<PageHeaderProps>;
        content = (
          <PageHeader
            {...raw}
            backgroundClass={resolveBackgroundClass(raw)}
            backgroundColor={resolveBackgroundColor(raw)}
          />
        );
        break;
      }
      case "large_banners": {
        const raw = (block.values ?? {}) as Partial<LargeBannersProps>;
        const props: LargeBannersProps = {
          title: raw.title ?? null,
          backgroundImage: raw.backgroundImage ?? null,
          arrowHref: raw.arrowHref ?? null,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <LargeBanners {...props} />;
        break;
      }
      case "large_banners_commitment": {
        const raw = (block.values ?? {}) as Partial<LargeBannersCommitmentProps>;
        const props: LargeBannersCommitmentProps = {
          slogan: raw.slogan ?? null,
          title: raw.title ?? null,
          backgroundImage: raw.backgroundImage ?? null,
          videoId: raw.videoId ?? null,
          contentTitle: raw.contentTitle ?? null,
          contentText: raw.contentText ?? null,
          buttonLabel: raw.buttonLabel ?? null,
          buttonHref: raw.buttonHref ?? null,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <LargeBannersCommitment {...props} />;
        break;
      }
      case "rich_text": {
        const raw = (block.values ?? {}) as Partial<RichTextBlockProps>;
        const props: RichTextBlockProps = {
          text: raw.text ?? null,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <RichTextBlock {...props} />;
        break;
      }
      case "interactive_header": {
        const raw = (block.values ?? {}) as Partial<InteractiveShowcaseProps>;
        const props: InteractiveShowcaseProps = {
          title: raw.title,
          items: raw.items ?? [],
          padding: raw.padding,
          defaultFormCode: raw.defaultFormCode ?? formConfig?.code ?? null,
          formConfig: raw.formConfig ?? formConfig ?? null,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <InteractiveShowcase {...props} />;
        break;
      }
      case "interactive_equipment": {
        const raw = (block.values ?? {}) as Partial<InteractiveEquipmentProps>;
        const props: InteractiveEquipmentProps = {
          title: raw.title ?? null,
          description: raw.description ?? null,
          items: raw.items ?? [],
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <InteractiveEquipment {...props} />;
        break;
      }
      case "hero_values": {
        const raw = (block.values ?? {}) as Partial<HeroValueGridProps>;
        const props: HeroValueGridProps = {
          title: raw.title,
          subtitle: raw.subtitle,
          text: raw.text,
          ctaLabel: raw.ctaLabel,
          ctaHref: raw.ctaHref,
          items: raw.items ?? [],
          columns: raw.columns,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <HeroValueGrid {...props} />;
        break;
      }
      case "feature_grid": {
        const raw = (block.values ?? {}) as Partial<FeatureGridProps>;
        const featureProps: FeatureGridProps = {
          items: raw.items ?? [],
          title: raw.title,
          description: raw.description,
          ctaLabel: raw.ctaLabel ?? null,
          ctaHref: raw.ctaHref ?? null,
          columns: raw.columns,
          variant: raw.variant ?? "plain",
          decoration: raw.decoration,
          decorationLeft: raw.decorationLeft,
          decorationRight: raw.decorationRight,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <FeatureGrid {...featureProps} />;
        break;
      }
      case "how_we_work": {
        const raw = (block.values ?? {}) as Partial<HowWeWorkProps>;
        const props: HowWeWorkProps = {
          title: raw.title ?? null,
          options: raw.options ?? [],
          decoration: raw.decoration ?? null,
          decorationLeft: raw.decorationLeft ?? null,
          decorationRight: raw.decorationRight ?? null,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <HowWeWork {...props} />;
        break;
      }
      case "product_carousel": {
        const raw = (block.values ?? {}) as Partial<ProductCarouselProps>;
        const props: ProductCarouselProps = {
          title: raw.title ?? "",
          description: raw.description ?? "",
          query: raw.query,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <ProductCarousel {...props} />;
        break;
      }
      case "games_gallery": {
        const raw = (block.values ?? {}) as Partial<GamesGalleryProps>;
        const props: GamesGalleryProps = {
          title: raw.title ?? "",
          description: raw.description ?? "",
          query: raw.query,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <GamesGallery {...props} />;
        break;
      }
      case "game_detail": {
        const raw = (block.values ?? {}) as Partial<GameDetailProps>;
        content = <GameDetail slug={raw.slug} />;
        break;
      }
      case "games_grid": {
        const raw = (block.values ?? {}) as Partial<GamesGridProps>;
        content = (
          <GamesGrid
            title={raw.title}
            description={raw.description}
            query={raw.query}
            padding={raw.padding}
            backgroundClass={resolveBackgroundClass(raw)}
            backgroundColor={resolveBackgroundColor(raw)}
          />
        );
        break;
      }
      case "news":
      case "news_list": {
        const raw = (block.values ?? {}) as Partial<NewsProps>;
        const props: NewsProps = {
          title: raw.title ?? "",
          description: raw.description ?? "",
          query: raw.query,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <News {...props} />;
        break;
      }
      case "stats": {
        const raw = (block.values ?? {}) as Partial<StatsProps>;
        const props: StatsProps = {
          items: raw.items ?? [],
          title: raw.title,
          description: raw.description,
          padding: raw.padding,
          backgroundImage: raw.backgroundImage ?? null,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <Stats {...props} />;
        break;
      }
      case "discount_banner": {
        const raw = (block.values ?? {}) as Partial<DiscountBannerProps>;
        content = (
          <DiscountBanner
            title={raw.title ?? ""}
            ctaLabel={raw.ctaLabel ?? ""}
            ctaHref={raw.ctaHref ?? "#"}
            icon={raw.icon}
            padding={raw.padding}
            backgroundClass={resolveBackgroundClass(raw)}
            backgroundColor={resolveBackgroundColor(raw)}
          />
        );
        break;
      }
      case "gradient_form_banner": {
        const raw = (block.values ?? {}) as Partial<GradientFormBannerProps>;
        const resolvedFormCode = raw.formCode ?? null;
        const resolvedFormConfig = resolvedFormCode
          ? formsByCode?.[resolvedFormCode] ?? null
          : null;
        content = (
          <GradientFormBanner
            title={raw.title ?? ""}
            description={raw.description}
            ctaLabel={raw.ctaLabel ?? "Get a Quote"}
            formCode={resolvedFormCode}
            formTitle={raw.formTitle}
            formConfig={resolvedFormConfig}
            icon={raw.icon}
            padding={raw.padding}
            backgroundClass={resolveBackgroundClass(raw)}
            backgroundColor={resolveBackgroundColor(raw)}
            template={
              (raw.template as GradientFormBannerProps["template"]) ?? "classic"
            }
          />
        );
        break;
      }
      case "faq": {
        const raw = (block.values ?? {}) as Partial<FAQProps>;
        const props: FAQProps = {
          title: raw.title,
          items: raw.items ?? [],
          variant: raw.variant ?? "columns",
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <FAQ {...props} />;
        break;
      }
      case "why_us": {
        const raw = (block.values ?? {}) as Partial<WhyUsProps>;
        content = (
          <WhyUs
            title={raw.title}
            description={raw.description}
            padding={raw.padding}
            backgroundClass={resolveBackgroundClass(raw)}
            backgroundColor={resolveBackgroundColor(raw)}
          />
        );
        break;
      }
      case "product_description": {
        const raw = (block.values ?? {}) as Partial<ProductDescriptionProps>;
        content = (
          <ProductDescription
            title={raw.title}
            description={raw.description}
            useGradientTitle={raw.useGradientTitle}
            variant={raw.variant ?? "plain"}
            padding={raw.padding}
            backgroundClass={resolveBackgroundClass(raw)}
            backgroundColor={resolveBackgroundColor(raw)}
          />
        );
        break;
      }
      case "product_nav": {
        const raw = (block.values ?? {}) as Partial<ProductNavProps>;
        content = <ProductNav items={raw.items ?? []} variant={raw.variant} />;
        break;
      }
      case "product_hero": {
        const { useProductData = false, ...values } = (block.values ??
          {}) as Partial<ProductHeroBlockValues>;

        const productSource =
          useProductData && product
            ? {
                title: product?.name ?? "",
                slogan: product?.excerpt ?? product?.slogan ?? null,
                description: product?.description ?? product?.excerpt ?? null,
                rating: product?.rating ?? null,
                reviewCount: product?.review_count_label ?? null,
                badges: product?.badges ?? [],
                formCode: product?.form?.code ?? null,
                formTitle: product?.form?.title ?? null,
                ctaLabel: product?.default_cta_label ?? null,
                formConfig: formConfig ?? null,
              }
            : null;

        const hasProductForCta = useProductData ? Boolean(productSource) : true;

        const explicitFormCode = values.formCode ?? null;
        const resolvedFormCode =
          explicitFormCode ?? productSource?.formCode ?? null;
        const resolvedFormConfig =
          (resolvedFormCode ? formsByCode?.[resolvedFormCode] ?? null : null) ??
          values.formConfig ??
          productSource?.formConfig ??
          null;

        content = (
          <ProductHero
            title={values.title ?? productSource?.title ?? ""}
            slogan={values.slogan ?? productSource?.slogan ?? null}
            description={
              values.description ?? productSource?.description ?? null
            }
            rating={values.rating ?? productSource?.rating ?? null}
            reviewCount={
              values.reviewCount ?? productSource?.reviewCount ?? null
            }
            badges={values.badges ?? productSource?.badges ?? []}
            badgeVariant={values.badgeVariant ?? "image"}
            formCode={resolvedFormCode}
            formTitle={values.formTitle ?? productSource?.formTitle ?? null}
            ctaLabel={values.ctaLabel ?? productSource?.ctaLabel ?? null}
            formConfig={resolvedFormConfig}
            hasProduct={hasProductForCta}
            backgroundClass={resolveBackgroundClass(values)}
            backgroundColor={resolveBackgroundColor(values)}
          />
        );
        break;
      }
      case "our_approach": {
        const raw = (block.values ?? {}) as Partial<OurApproachProps>;
        content = (
          <OurApproach
            title={raw.title}
            description={raw.description}
            items={raw.items}
            padding={raw.padding}
            backgroundClass={resolveBackgroundClass(raw)}
            backgroundColor={resolveBackgroundColor(raw)}
          />
        );
        break;
      }
      case "product_specs": {
        const raw = (block.values ?? {}) as Partial<ProductSpecsProps>;
        const props: ProductSpecsProps = {
          tabs: raw.tabs ?? [],
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <ProductSpecs {...props} />;
        break;
      }
      case "compare_models": {
        const raw = (block.values ?? {}) as Partial<CompareModelsProps>;
        content = (
          <CompareModels
            title={raw.title}
            description={raw.description}
            product={product}
            variants={variants ?? []}
            formConfig={formConfig}
            padding={raw.padding}
            backgroundClass={resolveBackgroundClass(raw)}
          />
        );
        break;
      }
      case "cta_section": {
        const {
          title,
          description,
          ctaLabel = "Contact us",
          ctaHref = "#",
          ctaHrefLabel,
          formCode,
          formTitle,
          backgroundImage,
          textColor,
          textColorClass,
          padding,
        } = (block.values ?? {}) as Partial<CTASectionProps>;
        const backgroundClass = resolveBackgroundClass(
          block.values as Partial<CTASectionProps> | undefined,
        );
        const backgroundColor = resolveBackgroundColor(
          block.values as Partial<CTASectionProps> | undefined,
        );
        content = (
          <CTASection
            title={title}
            description={description}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            ctaHrefLabel={ctaHrefLabel}
            formCode={formCode}
            formTitle={formTitle}
            formConfig={formCode ? formsByCode?.[formCode] ?? null : null}
            backgroundImage={backgroundImage}
            textColor={textColor}
            textColorClass={textColorClass}
            padding={padding}
            backgroundClass={backgroundClass}
            backgroundColor={backgroundColor}
          />
        );
        break;
      }
      case "sensory_room_bundles": {
        const raw = (block.values ?? {}) as Partial<SensoryRoomBundlesProps>;
        const props: SensoryRoomBundlesProps = {
          title: raw.title,
          description: raw.description,
          padding: raw.padding,
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <SensoryRoomBundles {...props} />;
        break;
      }
      case "contact_form": {
        const raw = (block.values ?? {}) as Partial<ContactFormProps>;
        const props: ContactFormProps = {
          title: raw.title,
          description: raw.description,
          formCode: raw.formCode,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
          formConfig: raw.formCode ? formsByCode?.[raw.formCode] ?? null : null,
        };
        content = <ContactForm {...props} />;
        break;
      }
      case "multi_step_form": {
        const raw = (block.values ?? {}) as Partial<MultiStepContactFormProps> & {
          formCode?: string | null;
        };
        const props: MultiStepContactFormProps = {
          formCode: raw.formCode ?? null,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
          formConfig: raw.formCode ? formsByCode?.[raw.formCode] ?? null : null,
        };
        content = <MultiStepContactForm {...props} />;
        break;
      }
      case "contact_info_map": {
        const raw = (block.values ?? {}) as Partial<ContactInfoMapProps>;
        const props: ContactInfoMapProps = {
          title: raw.title,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
          mapEmbedUrl: raw.mapEmbedUrl,
          siteSettings,
        };
        content = <ContactInfoMap {...props} />;
        break;
      }
      case "guide_intro": {
        const raw = (block.values ?? {}) as Partial<
          GuideIntroProps & { image?: unknown; imageAlt?: unknown }
        >;
        const props: GuideIntroProps = {
          text: raw.text,
          image: raw.image
            ? { src: raw.image as string, alt: (raw as { imageAlt?: string }).imageAlt }
            : raw.image ?? null,
          imageAlt: (raw as { imageAlt?: string }).imageAlt,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <GuideIntro {...props} />;
        break;
      }
      case "icon_title_text": {
        const raw = (block.values ?? {}) as Partial<IconTitleTextProps>;
        const props: IconTitleTextProps = {
          icon: raw.icon,
          iconAlt: raw.iconAlt,
          title: raw.title,
          description: raw.description,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <IconTitleText {...props} />;
        break;
      }
      case "counter_showcase": {
        const raw = (block.values ?? {}) as Partial<CounterShowcaseProps>;
        const props: CounterShowcaseProps = {
          title: raw.title,
          description: raw.description,
          value: raw.value,
          label: raw.label,
          ctaLabel: raw.ctaLabel,
          formCode: raw.formCode,
          formTitle: raw.formTitle,
          formConfig: raw.formCode ? formsByCode?.[raw.formCode] ?? null : null,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <CounterShowcase {...props} />;
        break;
      }
      case "highlight_cta": {
        const {
          title,
          description,
          ctaLabel = "Learn more",
          ctaHref = "#",
          padding,
        } = (block.values ?? {}) as Partial<HighlightCTAProps>;
        const backgroundClass = resolveBackgroundClass(
          block.values as Partial<HighlightCTAProps> | undefined,
        );
        const backgroundColor = resolveBackgroundColor(
          block.values as Partial<HighlightCTAProps> | undefined,
        );
        content = (
          <HighlightCTA
            title={title}
            description={description}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            padding={padding}
            backgroundClass={backgroundClass}
            backgroundColor={backgroundColor}
          />
        );
        break;
      }
      case "hospital_equipment": {
        const props = (block.values ?? {}) as Partial<HospitalEquipmentProps>;
        content = (
          <HospitalEquipment
            {...props}
            backgroundClass={resolveBackgroundClass(props)}
            backgroundColor={resolveBackgroundColor(props)}
          />
        );
        break;
      }
      case "special_needs": {
        const raw = (block.values ?? {}) as Partial<SpecialNeedsProps>;
        const props: SpecialNeedsProps = {
          title: raw.title,
          description: raw.description,
          videos: raw.videos ?? [],
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <SpecialNeeds {...props} />;
        break;
      }
      case "reviews": {
        const {
          query,
          ctaHref,
          ctaLabel,
          title,
          description,
          padding,
          template,
        } = (block.values ?? {}) as Partial<ReviewsProps>;
        const backgroundClass = resolveBackgroundClass(
          block.values as Partial<ReviewsProps> | undefined,
        );
        const backgroundColor = resolveBackgroundColor(
          block.values as Partial<ReviewsProps> | undefined,
        );
        content = (
          <Reviews
            query={query}
            ctaHref={ctaHref}
            ctaLabel={ctaLabel}
            title={title}
            description={description}
            padding={padding}
            template={template}
            backgroundClass={backgroundClass}
            backgroundColor={backgroundColor}
          />
        );
        break;
      }
      case "trusted_by": {
        const { logos, title, description, footerText, query, padding } =
          (block.values ?? {}) as Partial<TrustedByProps>;
        const backgroundClass = resolveBackgroundClass(
          block.values as Partial<TrustedByProps> | undefined,
        );
        const backgroundColor = resolveBackgroundColor(
          block.values as Partial<TrustedByProps> | undefined,
        );
        content = (
          <TrustedBy
            logos={logos}
            title={title}
            description={description}
            footerText={footerText}
            query={query}
            padding={padding}
            backgroundClass={backgroundClass}
            backgroundColor={backgroundColor}
          />
        );
        break;
      }
      default:
        content = null;
    }

    if (!content) return null;

    return (
      <div key={`block-${index}-${anchor}`} id={anchor} data-block={layout}>
        {content}
      </div>
    );
  });
}

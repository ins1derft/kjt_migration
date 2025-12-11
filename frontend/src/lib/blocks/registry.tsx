import React from 'react';
import type { BlockInput, ProductSummary, ProductVariant } from './types';
import Hero, { type HeroProps } from '@/components/blocks/Hero';
import FeatureGrid, { type FeatureGridProps } from '@/components/blocks/FeatureGrid';
import HeroValueGrid, { type HeroValueGridProps } from '@/components/blocks/HeroValueGrid';
import ProductCarousel, { type ProductCarouselProps } from '@/components/blocks/ProductCarousel';
import GamesGallery, { type GamesGalleryProps } from '@/components/blocks/GamesGallery';
import GameDetail, { type GameDetailProps } from '@/components/blocks/GameDetail';
import GamesGrid, { type GamesGridProps } from '@/components/blocks/GamesGrid';
import News, { type NewsProps } from '@/components/blocks/News';
import Stats, { type StatsProps } from '@/components/blocks/Stats';
import WhyUs, { type WhyUsProps } from '@/components/blocks/WhyUs';
import FAQ, { type FAQProps } from '@/components/blocks/FAQ';
import CTASection, { type CTASectionProps } from '@/components/blocks/CTASection';
import HighlightCTA, { type HighlightCTAProps } from '@/components/blocks/HighlightCTA';
import Reviews, { type ReviewsProps } from '@/components/blocks/Reviews';
import TrustedBy, { type TrustedByProps } from '@/components/blocks/TrustedBy';
import ProductDescription, { type ProductDescriptionProps } from '@/components/blocks/ProductDescription';
import DiscountBanner, { type DiscountBannerProps } from '@/components/blocks/DiscountBanner';
import SpecialNeeds, { type SpecialNeedsProps } from '@/components/blocks/SpecialNeeds';
import ProductSpecs, { type ProductSpecsProps } from '@/components/blocks/ProductSpecs';
import CompareModels, { type CompareModelsProps } from '@/components/blocks/CompareModels';
import ProductHero, { type ProductHeroProps } from '@/components/blocks/ProductHero';
import ProductNav, { type ProductNavProps } from '@/components/blocks/ProductNav';
import OurApproach, { type OurApproachProps } from '@/components/blocks/OurApproach';
import PageHeader, { type PageHeaderProps } from '@/components/blocks/PageHeader';
import InteractiveShowcase, { type InteractiveShowcaseProps } from '@/components/blocks/InteractiveShowcase';
import HospitalEquipment, { type HospitalEquipmentProps } from '@/components/blocks/HospitalEquipment';
import PotentialUses, { type PotentialUsesProps } from '@/components/blocks/PotentialUses';
import AppreciationLetters, { type AppreciationLettersProps } from '@/components/blocks/AppreciationLetters';
import TeamGrid, { type TeamGridProps } from '@/components/blocks/TeamGrid';
import TeamHighlight, { type TeamHighlightProps } from '@/components/blocks/TeamHighlight';
import type { FormConfig } from '@/lib/api';
import { resolveBlockAnchor } from './anchors';

export type BlockContext = {
  product?: ProductSummary | null;
  variants?: ProductVariant[] | null;
  formConfig?: FormConfig | null;
  formsByCode?: Record<string, FormConfig | null>;
};

type ProductHeroBlockValues = ProductHeroProps & {
  useProductData?: boolean | null;
};

const resolveBackgroundClass = (values?: { backgroundClass?: unknown } | null) =>
  typeof values?.backgroundClass === 'string' ? values.backgroundClass : null;
const resolveBackgroundColor = (values?: { backgroundColor?: unknown } | null) =>
  typeof values?.backgroundColor === 'string' ? values.backgroundColor : null;

export function renderBlocks(blocks: BlockInput[], context: BlockContext = {}) {
  const usedAnchors = new Set<string>();

  return blocks.map((block, index) => {
    const layout = block.name;
    const { product, variants, formConfig, formsByCode } = context;

    const anchor = resolveBlockAnchor(block, index, usedAnchors);
    let content: React.ReactNode = null;

    switch (layout) {
      case 'appreciation_letters': {
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
      case 'team_grid': {
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
      case 'team_highlight': {
        const raw = (block.values ?? {}) as Partial<TeamHighlightProps>;
        const props: TeamHighlightProps = {
          title: raw.title,
          intro: raw.intro,
          footerText: raw.footerText,
          memberSlug: raw.memberSlug,
          member: raw.member,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <TeamHighlight {...props} />;
        break;
      }
      case 'potential_uses': {
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
      case 'hero': {
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
      case 'page_header': {
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
      case 'interactive_header': {
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
      case 'hero_values': {
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
      case 'feature_grid': {
        const raw = (block.values ?? {}) as Partial<FeatureGridProps>;
        const featureProps: FeatureGridProps = {
          items: raw.items ?? [],
          title: raw.title,
          description: raw.description,
          columns: raw.columns,
          variant: raw.variant ?? 'plain',
          decoration: raw.decoration,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <FeatureGrid {...featureProps} />;
        break;
      }
      case 'product_carousel': {
        const raw = (block.values ?? {}) as Partial<ProductCarouselProps>;
        const props: ProductCarouselProps = {
          title: raw.title ?? '',
          description: raw.description ?? '',
          query: raw.query,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <ProductCarousel {...props} />;
        break;
      }
      case 'games_gallery': {
        const raw = (block.values ?? {}) as Partial<GamesGalleryProps>;
        const props: GamesGalleryProps = {
          title: raw.title ?? '',
          description: raw.description ?? '',
          query: raw.query,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <GamesGallery {...props} />;
        break;
      }
      case 'game_detail': {
        const raw = (block.values ?? {}) as Partial<GameDetailProps>;
        content = <GameDetail slug={raw.slug} />;
        break;
      }
      case 'games_grid': {
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
      case 'news':
      case 'news_list': {
        const raw = (block.values ?? {}) as Partial<NewsProps>;
        const props: NewsProps = {
          title: raw.title ?? '',
          description: raw.description ?? '',
          query: raw.query,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <News {...props} />;
        break;
      }
      case 'stats': {
        const raw = (block.values ?? {}) as Partial<StatsProps>;
        const props: StatsProps = {
          items: raw.items ?? [],
          title: raw.title,
          description: raw.description,
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <Stats {...props} />;
        break;
      }
      case 'discount_banner': {
        const raw = (block.values ?? {}) as Partial<DiscountBannerProps>;
        content = (
          <DiscountBanner
            title={raw.title ?? ''}
            ctaLabel={raw.ctaLabel ?? ''}
            ctaHref={raw.ctaHref ?? '#'}
            icon={raw.icon}
            padding={raw.padding}
            backgroundClass={resolveBackgroundClass(raw)}
            backgroundColor={resolveBackgroundColor(raw)}
          />
        );
        break;
      }
      case 'faq': {
        const raw = (block.values ?? {}) as Partial<FAQProps>;
        const props: FAQProps = {
          title: raw.title,
          items: raw.items ?? [],
          padding: raw.padding,
          backgroundClass: resolveBackgroundClass(raw),
          backgroundColor: resolveBackgroundColor(raw),
        };
        content = <FAQ {...props} />;
        break;
      }
      case 'why_us': {
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
      case 'product_description': {
        const raw = (block.values ?? {}) as Partial<ProductDescriptionProps>;
        content = (
          <ProductDescription
            title={raw.title}
            description={raw.description}
            padding={raw.padding}
            backgroundClass={resolveBackgroundClass(raw)}
            backgroundColor={resolveBackgroundColor(raw)}
          />
        );
        break;
      }
      case 'product_nav': {
        const raw = (block.values ?? {}) as Partial<ProductNavProps>;
        content = <ProductNav items={raw.items ?? []} />;
        break;
      }
      case 'product_hero': {
        const { useProductData = false, ...values } = (block.values ?? {}) as Partial<ProductHeroBlockValues>;

        const productSource = useProductData && product
          ? {
              title: product?.name ?? '',
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
        const resolvedFormCode = explicitFormCode ?? productSource?.formCode ?? null;
        const resolvedFormConfig = (resolvedFormCode ? formsByCode?.[resolvedFormCode] ?? null : null)
          ?? values.formConfig
          ?? productSource?.formConfig
          ?? null;

        content = (
          <ProductHero
            title={values.title ?? productSource?.title ?? ''}
            slogan={values.slogan ?? productSource?.slogan ?? null}
            description={values.description ?? productSource?.description ?? null}
            rating={values.rating ?? productSource?.rating ?? null}
            reviewCount={values.reviewCount ?? productSource?.reviewCount ?? null}
            badges={values.badges ?? productSource?.badges ?? []}
            badgeVariant={values.badgeVariant ?? 'image'}
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
      case 'our_approach': {
        const raw = (block.values ?? {}) as Partial<OurApproachProps>;
        content = (
          <OurApproach
            title={raw.title}
            description={raw.description}
            padding={raw.padding}
            backgroundClass={resolveBackgroundClass(raw)}
            backgroundColor={resolveBackgroundColor(raw)}
          />
        );
        break;
      }
      case 'product_specs': {
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
      case 'compare_models': {
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
      case 'cta_section': {
        const {
          title,
          description,
          ctaLabel = 'Contact us',
          ctaHref = '#',
          backgroundImage,
          textColor,
          textColorClass,
          padding,
        } = (block.values ?? {}) as Partial<CTASectionProps>;
        const backgroundClass = resolveBackgroundClass(block.values as Partial<CTASectionProps> | undefined);
        const backgroundColor = resolveBackgroundColor(block.values as Partial<CTASectionProps> | undefined);
        content = (
          <CTASection
            title={title}
            description={description}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
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
      case 'highlight_cta': {
        const {
          title,
          description,
          ctaLabel = 'Learn more',
          ctaHref = '#',
          padding,
        } = (block.values ?? {}) as Partial<HighlightCTAProps>;
        const backgroundClass = resolveBackgroundClass(block.values as Partial<HighlightCTAProps> | undefined);
        const backgroundColor = resolveBackgroundColor(block.values as Partial<HighlightCTAProps> | undefined);
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
      case 'hospital_equipment': {
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
      case 'special_needs': {
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
      case 'reviews': {
        const { query, ctaHref, ctaLabel, title, description, padding, template } =
          (block.values ?? {}) as Partial<ReviewsProps>;
        const backgroundClass = resolveBackgroundClass(block.values as Partial<ReviewsProps> | undefined);
        const backgroundColor = resolveBackgroundColor(block.values as Partial<ReviewsProps> | undefined);
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
      case 'trusted_by': {
        const { logos, title, description, footerText, query, padding } =
          (block.values ?? {}) as Partial<TrustedByProps>;
        const backgroundClass = resolveBackgroundClass(block.values as Partial<TrustedByProps> | undefined);
        const backgroundColor = resolveBackgroundColor(block.values as Partial<TrustedByProps> | undefined);
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

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
import ProductSpecs, { type ProductSpecsProps } from '@/components/blocks/ProductSpecs';
import CompareModels, { type CompareModelsProps } from '@/components/blocks/CompareModels';
import ProductHero, { type ProductHeroProps } from '@/components/blocks/ProductHero';
import ProductNav, { type ProductNavProps } from '@/components/blocks/ProductNav';
import OurApproach, { type OurApproachProps } from '@/components/blocks/OurApproach';
import PageHeader, { type PageHeaderProps } from '@/components/blocks/PageHeader';
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

export function renderBlocks(blocks: BlockInput[], context: BlockContext = {}) {
  const usedAnchors = new Set<string>();

  return blocks.map((block, index) => {
    const layout = block.name;
    const { product, variants, formConfig, formsByCode } = context;

    const anchor = resolveBlockAnchor(block, index, usedAnchors);
    let content: React.ReactNode = null;

    switch (layout) {
      case 'hero':
        content = <Hero {...((block.values ?? {}) as Partial<HeroProps>)} />;
        break;
      case 'page_header':
        content = <PageHeader {...((block.values ?? {}) as Partial<PageHeaderProps>)} />;
        break;
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
          padding: raw.padding,
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
        };
        content = <Stats {...props} />;
        break;
      }
      case 'faq': {
        const raw = (block.values ?? {}) as Partial<FAQProps>;
        const props: FAQProps = {
          title: raw.title,
          items: raw.items ?? [],
          padding: raw.padding,
        };
        content = <FAQ {...props} />;
        break;
      }
      case 'why_us': {
        const raw = (block.values ?? {}) as Partial<WhyUsProps>;
        content = <WhyUs title={raw.title} description={raw.description} padding={raw.padding} />;
        break;
      }
      case 'product_description': {
        const raw = (block.values ?? {}) as Partial<ProductDescriptionProps>;
        content = (
          <ProductDescription
            title={raw.title}
            description={raw.description}
            padding={raw.padding}
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
            hasProduct={Boolean(productSource)}
          />
        );
        break;
      }
      case 'our_approach': {
        const raw = (block.values ?? {}) as Partial<OurApproachProps>;
        content = <OurApproach title={raw.title} description={raw.description} padding={raw.padding} />;
        break;
      }
      case 'product_specs': {
        const raw = (block.values ?? {}) as Partial<ProductSpecsProps>;
        const props: ProductSpecsProps = {
          tabs: raw.tabs ?? [],
          padding: raw.padding,
        };
        content = <ProductSpecs {...props} />;
        break;
      }
      case 'compare_models': {
        const { title, description, padding } = (block.values ?? {}) as Partial<CompareModelsProps>;
        content = (
          <CompareModels
            title={title}
            description={description}
            product={product}
            variants={variants ?? []}
            formConfig={formConfig}
            padding={padding}
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
          textColorClass,
          padding,
        } = (block.values ?? {}) as Partial<CTASectionProps>;
        content = (
          <CTASection
            title={title}
            description={description}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            backgroundImage={backgroundImage}
            textColorClass={textColorClass}
            padding={padding}
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
        content = (
          <HighlightCTA
            title={title}
            description={description}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            padding={padding}
          />
        );
        break;
      }
      case 'reviews': {
        const { query, ctaHref, ctaLabel, title, description, padding, template } =
          (block.values ?? {}) as Partial<ReviewsProps>;
        content = (
          <Reviews
            query={query}
            ctaHref={ctaHref}
            ctaLabel={ctaLabel}
            title={title}
            description={description}
            padding={padding}
            template={template}
          />
        );
        break;
      }
      case 'trusted_by': {
        const { logos, title, description, footerText, query, padding } =
          (block.values ?? {}) as Partial<TrustedByProps>;
        content = (
          <TrustedBy
            logos={logos}
            title={title}
            description={description}
            footerText={footerText}
            query={query}
            padding={padding}
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

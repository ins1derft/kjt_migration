import React from 'react';
import type { BlockInput, ProductSummary, ProductVariant } from './types';
import Hero, { type HeroProps } from '@/components/blocks/Hero';
import HeroContent, { type HeroContentProps } from '@/components/blocks/HeroContent';
import FeatureGrid, { type FeatureGridProps } from '@/components/blocks/FeatureGrid';
import ProductCarousel, { type ProductCarouselProps } from '@/components/blocks/ProductCarousel';
import GamesGallery, { type GamesGalleryProps } from '@/components/blocks/GamesGallery';
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
  form_code?: string | null;
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
        content = <Hero {...((block.values ?? {}) as HeroProps)} />;
        break;
      case 'hero_content':
        content = <HeroContent {...((block.values ?? {}) as HeroContentProps)} />;
        break;
      case 'feature_grid': {
        const { items = [], title, description, columns, iconColor, variant, padding } =
          (block.values ?? {}) as FeatureGridProps;
        content = (
          <FeatureGrid
            items={items}
            title={title}
            description={description}
            columns={columns}
            iconColor={iconColor}
            variant={variant}
            padding={padding}
          />
        );
        break;
      }
      case 'product_carousel': {
        const { title = '', description = '', query, padding } =
          (block.values ?? {}) as ProductCarouselProps;
        content = (
          <ProductCarousel
            title={title}
            description={description}
            query={query}
            padding={padding}
          />
        );
        break;
      }
      case 'games_gallery': {
        const { title = '', description = '', query, padding } =
          (block.values ?? {}) as GamesGalleryProps;
        content = (
          <GamesGallery
            title={title}
            description={description}
            query={query}
            padding={padding}
          />
        );
        break;
      }
      case 'news':
      case 'news_list': {
        const { title = '', description = '', query, padding } = (block.values ?? {}) as NewsProps;
        content = (
          <News
            title={title}
            description={description}
            query={query}
            padding={padding}
          />
        );
        break;
      }
      case 'stats': {
        const { items = [], title, description, padding } = (block.values ?? {}) as StatsProps;
        content = <Stats items={items} title={title} description={description} padding={padding} />;
        break;
      }
      case 'faq': {
        const { title, items = [], padding } = (block.values ?? {}) as FAQProps;
        content = <FAQ title={title} items={items} padding={padding} />;
        break;
      }
      case 'why_us': {
        const { title, description, padding } = (block.values ?? {}) as WhyUsProps;
        content = <WhyUs title={title} description={description} padding={padding} />;
        break;
      }
      case 'product_description': {
        const { title, description, padding } = (block.values ?? {}) as ProductDescriptionProps;
        content = <ProductDescription title={title} description={description} padding={padding} />;
        break;
      }
      case 'product_nav': {
        const { items } = (block.values ?? {}) as ProductNavProps;
        content = <ProductNav items={items} />;
        break;
      }
      case 'product_hero': {
        const { useProductData = false, form_code, ...values } = (block.values ?? {}) as ProductHeroBlockValues;

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

        const explicitFormCode = values.formCode ?? form_code ?? null;
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
        const { title, description, padding } = (block.values ?? {}) as OurApproachProps;
        content = <OurApproach title={title} description={description} padding={padding} />;
        break;
      }
      case 'product_specs': {
        const { tabs = [], padding } = (block.values ?? {}) as ProductSpecsProps;
        content = <ProductSpecs tabs={tabs} padding={padding} />;
        break;
      }
      case 'compare_models': {
        const { title, description, padding } = (block.values ?? {}) as CompareModelsProps;
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
        const { title, description, ctaLabel = 'Contact us', ctaHref = '#', backgroundImage, padding } =
          (block.values ?? {}) as CTASectionProps;
        content = (
          <CTASection
            title={title}
            description={description}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            backgroundImage={backgroundImage}
            padding={padding}
          />
        );
        break;
      }
      case 'highlight_cta': {
        const { title, description, ctaLabel = 'Learn more', ctaHref = '#', imageUrl, padding } =
          (block.values ?? {}) as HighlightCTAProps;
        content = (
          <HighlightCTA
            title={title}
            description={description}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            imageUrl={imageUrl}
            padding={padding}
          />
        );
        break;
      }
      case 'reviews': {
        const { query, ctaHref, ctaLabel, title, description, padding } =
          (block.values ?? {}) as ReviewsProps;
        content = (
          <Reviews
            query={query}
            ctaHref={ctaHref}
            ctaLabel={ctaLabel}
            title={title}
            description={description}
            padding={padding}
          />
        );
        break;
      }
      case 'trusted_by': {
        const { logos, title, description, footerText, query, padding } =
          (block.values ?? {}) as TrustedByProps;
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

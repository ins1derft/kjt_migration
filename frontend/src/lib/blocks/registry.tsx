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
import type { FormConfig } from '@/lib/api';

export type BlockContext = {
  product?: ProductSummary | null;
  variants?: ProductVariant[] | null;
  formConfig?: FormConfig | null;
};

export function renderBlocks(blocks: BlockInput[], context: BlockContext = {}) {
  return blocks.map((block, index) => {
    const layout = block.name;
    const { product, variants, formConfig } = context;

    switch (layout) {
      case 'hero':
        return (
          <Hero
            key={`hero-${index}`}
            {...((block.values ?? {}) as HeroProps)}
          />
        );
      case 'hero_content':
        return (
          <HeroContent
            key={`hero-content-${index}`}
            {...((block.values ?? {}) as HeroContentProps)}
          />
        );
      case 'feature_grid': {
        const { items = [], title, description, columns, iconColor, variant, padding } =
          (block.values ?? {}) as FeatureGridProps;
        return (
          <FeatureGrid
            key={`features-${index}`}
            items={items}
            title={title}
            description={description}
            columns={columns}
            iconColor={iconColor}
            variant={variant}
            padding={padding}
          />
        );
      }
      case 'product_carousel': {
        const { title = '', description = '', query, padding } =
          (block.values ?? {}) as ProductCarouselProps;
        return (
          <ProductCarousel
            key={`products-${index}`}
            title={title}
            description={description}
            query={query}
            padding={padding}
          />
        );
      }
      case 'games_gallery': {
        const { title = '', description = '', query, padding } =
          (block.values ?? {}) as GamesGalleryProps;
        return (
          <GamesGallery
            key={`gallery-${index}`}
            title={title}
            description={description}
            query={query}
            padding={padding}
          />
        );
      }
      case 'news':
      case 'news_list': {
        const { title = '', description = '', query, padding } = (block.values ?? {}) as NewsProps;
        return (
          <News
            key={`news-${index}`}
            title={title}
            description={description}
            query={query}
            padding={padding}
          />
        );
      }
      case 'stats': {
        const { items = [], title, description, padding } = (block.values ?? {}) as StatsProps;
        return <Stats key={`stats-${index}`} items={items} title={title} description={description} padding={padding} />;
      }
      case 'faq': {
        const { title, items = [], padding } = (block.values ?? {}) as FAQProps;
        return <FAQ key={`faq-${index}`} title={title} items={items} padding={padding} />;
      }
      case 'why_us': {
        const { title, description, padding } = (block.values ?? {}) as WhyUsProps;
        return <WhyUs key={`why-${index}`} title={title} description={description} padding={padding} />;
      }
      case 'product_description': {
        const { title, description, padding } = (block.values ?? {}) as ProductDescriptionProps;
        return <ProductDescription key={`product-description-${index}`} title={title} description={description} padding={padding} />;
      }
      case 'product_specs': {
        const { tabs = [], padding } = (block.values ?? {}) as ProductSpecsProps;
        return <ProductSpecs key={`product-specs-${index}`} tabs={tabs} padding={padding} />;
      }
      case 'compare_models': {
        const { title, description, padding } = (block.values ?? {}) as CompareModelsProps;
        return (
          <CompareModels
            key={`compare-models-${index}`}
            title={title}
            description={description}
            product={product}
            variants={variants ?? []}
            formConfig={formConfig}
            padding={padding}
          />
        );
      }
      case 'cta_section': {
        const { title, description, ctaLabel = 'Contact us', ctaHref = '#', backgroundImage, padding } =
          (block.values ?? {}) as CTASectionProps;
        return (
          <CTASection
            key={`cta-${index}`}
            title={title}
            description={description}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            backgroundImage={backgroundImage}
            padding={padding}
          />
        );
      }
      case 'highlight_cta': {
        const { title, description, ctaLabel = 'Learn more', ctaHref = '#', imageUrl, padding } =
          (block.values ?? {}) as HighlightCTAProps;
        return (
          <HighlightCTA
            key={`hcta-${index}`}
            title={title}
            description={description}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            imageUrl={imageUrl}
            padding={padding}
          />
        );
      }
      case 'reviews': {
        const { items = [], query, ctaHref, ctaLabel, title, description, padding } =
          (block.values ?? {}) as ReviewsProps;
        return (
          <Reviews
            key={`reviews-${index}`}
            items={items}
            query={query}
            ctaHref={ctaHref}
            ctaLabel={ctaLabel}
            title={title}
            description={description}
            padding={padding}
          />
        );
      }
      case 'trusted_by': {
        const { logos, title, description, footerText, query, padding } =
          (block.values ?? {}) as TrustedByProps;
        return (
          <TrustedBy
            key={`trusted-${index}`}
            logos={logos}
            title={title}
            description={description}
            footerText={footerText}
            query={query}
            padding={padding}
          />
        );
      }
      default:
        return null;
    }
  });
}

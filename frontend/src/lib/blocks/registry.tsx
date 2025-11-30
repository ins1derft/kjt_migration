import React from 'react';
import type { BlockInput } from './types';
import Hero, { type HeroProps } from '@/components/blocks/Hero';
import HeroContent, { type HeroContentProps } from '@/components/blocks/HeroContent';
import FeatureGrid, { type FeatureGridProps } from '@/components/blocks/FeatureGrid';
import ProductCarousel, { type ProductCarouselProps } from '@/components/blocks/ProductCarousel';
import GamesGallery, { type GamesGalleryProps } from '@/components/blocks/GamesGallery';
import News, { type NewsProps } from '@/components/blocks/News';
import Stats, { type StatsProps } from '@/components/blocks/Stats';
import WhyUs, { type WhyUsProps } from '@/components/blocks/WhyUs';
import CTASection, { type CTASectionProps } from '@/components/blocks/CTASection';
import HighlightCTA, { type HighlightCTAProps } from '@/components/blocks/HighlightCTA';
import Testimonials, { type TestimonialsProps } from '@/components/blocks/Testimonials';
import TrustedBy, { type TrustedByProps } from '@/components/blocks/TrustedBy';

export type BlockContext = Record<string, unknown>;

export function renderBlocks(blocks: BlockInput[]) {
  return blocks.map((block, index) => {
    const layout = block.name;

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
        const { items = [], title, description, columns, iconColor, variant } =
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
          />
        );
      }
      case 'product_carousel': {
        const { title = '', description = '', query } =
          (block.values ?? {}) as ProductCarouselProps;
        return (
          <ProductCarousel
            key={`products-${index}`}
            title={title}
            description={description}
            query={query}
          />
        );
      }
      case 'games_gallery': {
        const { title = '', description = '', query } =
          (block.values ?? {}) as GamesGalleryProps;
        return (
          <GamesGallery
            key={`gallery-${index}`}
            title={title}
            description={description}
            query={query}
          />
        );
      }
      case 'news':
      case 'news_list': {
        const { title = '', description = '', query } = (block.values ?? {}) as NewsProps;
        return (
          <News
            key={`news-${index}`}
            title={title}
            description={description}
            query={query}
          />
        );
      }
      case 'stats': {
        const { items = [], title, description } = (block.values ?? {}) as StatsProps;
        return <Stats key={`stats-${index}`} items={items} title={title} description={description} />;
      }
      case 'why_us': {
        const { title, description } = (block.values ?? {}) as WhyUsProps;
        return <WhyUs key={`why-${index}`} title={title} description={description} />;
      }
      case 'cta_section': {
        const { title, description, ctaLabel = 'Contact us', ctaHref = '#', backgroundImage } =
          (block.values ?? {}) as CTASectionProps;
        return (
          <CTASection
            key={`cta-${index}`}
            title={title}
            description={description}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            backgroundImage={backgroundImage}
          />
        );
      }
      case 'highlight_cta': {
        const { title, description, ctaLabel = 'Learn more', ctaHref = '#', imageUrl } =
          (block.values ?? {}) as HighlightCTAProps;
        return (
          <HighlightCTA
            key={`hcta-${index}`}
            title={title}
            description={description}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            imageUrl={imageUrl}
          />
        );
      }
      case 'testimonials': {
        const { items = [], ctaHref, ctaLabel, title, description } =
          (block.values ?? {}) as TestimonialsProps;
        return (
          <Testimonials
            key={`testimonials-${index}`}
            items={items}
            ctaHref={ctaHref}
            ctaLabel={ctaLabel}
            title={title}
            description={description}
          />
        );
      }
      case 'trusted_by': {
        const { logos, title, description, footerText, query } =
          (block.values ?? {}) as TrustedByProps;
        return (
          <TrustedBy
            key={`trusted-${index}`}
            logos={logos}
            title={title}
            description={description}
            footerText={footerText}
            query={query}
          />
        );
      }
      default:
        return null;
    }
  });
}

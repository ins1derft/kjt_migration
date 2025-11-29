import React from 'react';
import type { BlockInput, ProductSummary, ProductVariantSummary } from './types';
import HeroSection from '@/components/blocks/HeroSection';
import FeaturesGrid from '@/components/blocks/FeaturesGrid';
import GamesList from '@/components/blocks/GamesList';
import QuoteForm from '@/components/blocks/QuoteForm';
import IconBullets from '@/components/blocks/IconBullets';
import StatsBlock from '@/components/blocks/StatsBlock';
import LogosStrip from '@/components/blocks/LogosStrip';
import ComparisonTable from '@/components/blocks/ComparisonTable';
import GamesGallery from '@/components/blocks/GamesGallery';
import UseCases from '@/components/blocks/UseCases';
import FAQBlock from '@/components/blocks/FAQBlock';
import ReviewsFeed from '@/components/blocks/ReviewsFeed';
import ProductCards from '@/components/blocks/ProductCards';
import NewsListBlock from '@/components/blocks/NewsListBlock';

export type BlockContext = {
  product?: ProductSummary | null;
  variants?: ProductVariantSummary[];
};

export function renderBlocks(blocks: BlockInput[], ctx?: BlockContext) {
  return blocks.map((block, index) => {
    const layout = block.name;
    const fields = block.values ?? {};

    switch (layout) {
      case 'hero':
        return <HeroSection key={`hero-${index}`} {...fields} product={ctx?.product ?? undefined} />;
      case 'features_grid':
        return <FeaturesGrid key={`features-${index}`} {...fields} />;
      case 'games_list':
        return <GamesList key={`games-${index}`} {...fields} />;
      case 'quote_form':
        return <QuoteForm key={`form-${index}`} {...fields} />;
      case 'icon_bullets':
        return <IconBullets key={`icon-${index}`} {...fields} />;
      case 'stats':
        return <StatsBlock key={`stats-${index}`} {...fields} />;
      case 'logos':
        return <LogosStrip key={`logos-${index}`} {...fields} />;
      case 'comparison_table':
        return <ComparisonTable key={`compare-${index}`} {...fields} productVariants={ctx?.variants} />;
      case 'games_gallery':
        return <GamesGallery key={`gallery-${index}`} {...fields} />;
      case 'use_cases':
        return <UseCases key={`use-${index}`} {...fields} />;
      case 'faq':
        return <FAQBlock key={`faq-${index}`} {...fields} />;
      case 'reviews_feed':
        return <ReviewsFeed key={`reviews-${index}`} {...fields} />;
      case 'product_cards':
        return <ProductCards key={`prod-${index}`} {...fields} />;
      case 'news_list':
        return <NewsListBlock key={`news-${index}`} {...fields} />;
      default:
        return null;
    }
  });
}

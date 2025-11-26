import React from 'react';
import type { PageBlock } from './types';
import HeroSection from '@/components/blocks/HeroSection';
import FeaturesGrid from '@/components/blocks/FeaturesGrid';
import GamesList from '@/components/blocks/GamesList';
import QuoteForm from '@/components/blocks/QuoteForm';

export function renderBlocks(blocks: PageBlock[]) {
  return blocks.map((block, index) => {
    switch (block.layout) {
      case 'hero':
        return <HeroSection key={`hero-${index}`} {...block.fields} />;
      case 'features_grid':
        return <FeaturesGrid key={`features-${index}`} {...block.fields} />;
      case 'games_list':
        return <GamesList key={`games-${index}`} {...block.fields} />;
      case 'quote_form':
        return <QuoteForm key={`form-${index}`} {...block.fields} />;
      default:
        return null;
    }
  });
}

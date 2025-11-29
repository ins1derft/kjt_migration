import { renderBlocks } from '@/lib/blocks/registry';
import type { PageBlock } from '@/lib/blocks/types';

const homeBlocks: PageBlock[] = [
  {
    name: 'hero',
    values: {
      badge: 'Interactive equipment',
      title: 'Turn-key interactive systems for kids',
      subtitle:
        'Bring any room to life with motion-driven games, sensory experiences, and active learning built for schools, museums, therapy centers, and family venues.',
      primary_cta_label: 'Book a live demo',
      primary_cta_url: 'mailto:info@kidsjumptech.com?subject=Live%20Demo',
      secondary_cta_label: 'View games',
      secondary_cta_url: '/games',
      background: 'https://kidsjumptech.com/wp-content/uploads/2025/01/whack-the-cactus.webp',
    },
  },
  {
    name: 'features_grid',
    values: {
      title: 'Why teams pick Kids Jump Tech',
      items: [
        {
          title: '2–5 year warranty',
          text: 'Factory-made in the USA with long-life components and included updates.',
        },
        {
          title: '24/7 remote support',
          text: 'Engineers resolve software issues fast; onsite help available if needed.',
        },
        {
          title: 'No subscriptions',
          text: 'Pay once for equipment, games, and future software updates—no recurring fees.',
        },
        {
          title: 'Built for all abilities',
          text: 'Games encourage movement, cognition, and sensory engagement; compatible with special needs programs.',
        },
      ],
    },
  },
  {
    name: 'stats',
    values: {
      title: 'Proven in the field',
      items: [
        { value: '3000+', label: 'Projects delivered' },
        { value: '90+', label: '5-star reviews' },
        { value: '24/7', label: 'Technical support' },
        { value: '0', suffix: ' subscriptions', label: 'Recurring fees' },
      ],
    },
  },
  {
    name: 'games_gallery',
    values: {
      title: 'Flagship games & activities',
      limit: 6,
    },
  },
  {
    name: 'use_cases',
    values: {
      title: 'Where it fits best',
      items: [
        {
          heading: 'Schools & therapy centers',
          body: 'Sensory rooms, OT/PT, and special education programs use motion-driven play to keep kids engaged.',
          cta_label: 'See case studies',
          cta_url: '/case-studies',
        },
        {
          heading: 'Museums & family venues',
          body: 'Immersive exhibits and party rooms stay fresh with regularly released games and themed content.',
          cta_label: 'Explore products',
          cta_url: '/interactive-digital-parks',
        },
        {
          heading: 'Hospitality & fitness',
          body: 'Add an active play zone that is easy to reset, mobile, and ready to deploy without ceiling mounts.',
          cta_label: 'Talk to us',
          cta_url: 'mailto:info@kidsjumptech.com',
        },
      ],
    },
  },
  {
    name: 'product_cards',
    values: {
      title: 'Signature systems',
      items: [
        {
          title: 'Interactive Floor (mobile)',
          subtitle: 'Projector + motion sensors in a portable cart; perfect for multipurpose rooms.',
          image: 'https://kidsjumptech.com/wp-content/uploads/2025/01/unknown-planet.webp',
          url: '/interactive-floor-mobil',
        },
        {
          title: 'Interactive Sandbox',
          subtitle: 'AR topography, dinosaurs, oceans—kids sculpt and the visuals react in real time.',
          image: 'https://kidsjumptech.com/wp-content/uploads/2025/01/space-war-400x225.webp',
          url: '/interactive-sandbox',
        },
        {
          title: 'Interactive Digital Parks',
          subtitle: 'Custom turnkey zones combining slides, swings, walls, and multi-touch tables.',
          image: 'https://kidsjumptech.com/wp-content/uploads/2025/01/space-throw-400x225.webp',
          url: '/interactive-digital-parks',
        },
      ],
    },
  },
  {
    name: 'news_list',
    values: {
      title: 'Latest wins & press',
      filters: { types: 'news', limit: '3' },
    },
  },
  {
    name: 'quote_form',
    values: {
      title: 'Ready to see it live?',
      body: 'Tell us about your space and goals—our team will tailor a live demo with the right games and hardware.',
      form_code: 'live_demo',
    },
  },
];

export default async function Home() {
  return <main>{renderBlocks(homeBlocks)}</main>;
}

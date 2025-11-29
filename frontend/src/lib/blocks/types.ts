export type HeroBlock = {
  name: 'hero';
  key?: number;
  values: {
    title: string;
    subtitle?: string;
    badge?: string;
    background?: string;
    primary_cta_label?: string;
    primary_cta_url?: string;
    secondary_cta_label?: string;
    secondary_cta_url?: string;
  };
};

export type FeaturesGridBlock = {
  name: 'features_grid';
  key?: number;
  values: {
    title?: string;
    items: {
      title: string;
      text: string;
      icon?: string;
    }[];
  };
};

export type GamesListBlock = {
  name: 'games_list';
  key?: number;
  values: {
    title?: string;
    device_type?: string;
    game_slugs?: { slug: string }[] | string[];
    auto_fill?: boolean;
  };
};

export type QuoteFormBlock = {
  name: 'quote_form';
  key?: number;
  values: {
    title?: string;
    body?: string;
    form_code: 'quote' | 'live_demo' | 'contact';
  };
};

export type IconBulletsBlock = {
  name: 'icon_bullets';
  key?: number;
  values: {
    title?: string;
    items?: { icon?: string; heading?: string; text?: string }[];
  };
};

export type StatsBlock = {
  name: 'stats';
  key?: number;
  values: {
    title?: string;
    items?: { value: string; label: string; suffix?: string }[];
  };
};

export type LogosBlock = {
  name: 'logos';
  key?: number;
  values: {
    title?: string;
    logos?: { image?: string; alt?: string }[];
  };
};

export type ComparisonTableBlock = {
  name: 'comparison_table';
  key?: number;
  values: {
    title?: string;
    auto_fill?: boolean; // kept for compatibility; product variants are always used
  };
};

export type ProductVariantSummary = {
  id?: number;
  name: string;
  label?: string | null;
  price?: string | number | null;
  position?: number | null;
  specs?: Record<string, string | number | boolean>;
};

export type GamesGalleryBlock = {
  name: 'games_gallery';
  key?: number;
  values: {
    title?: string;
    game_slugs?: { slug: string }[] | string[];
    limit?: number | string;
    auto_fill?: boolean;
  };
};

export type UseCasesBlock = {
  name: 'use_cases';
  key?: number;
  values: {
    title?: string;
    items?: { heading?: string; body?: string; cta_label?: string; cta_url?: string }[];
  };
};

export type FAQBlock = {
  name: 'faq';
  key?: number;
  values: {
    title?: string;
    items?: { question: string; answer: string }[];
  };
};

export type ReviewsFeedBlock = {
  name: 'reviews_feed';
  key?: number;
  values: {
    title?: string;
    rating?: string;
    count?: string;
    provider?: string;
    embed_code?: string;
  };
};

export type ProductCardsBlock = {
  name: 'product_cards';
  key?: number;
  values: {
    title?: string;
    items?: { title: string; subtitle?: string; image?: string; url?: string }[];
  };
};

export type NewsListBlock = {
  name: 'news_list';
  key?: number;
  values: {
    title?: string;
    filters?: {
      types?: string;
      category_slugs?: string;
      limit?: string;
    };
  };
};

export type PageBlock =
  | HeroBlock
  | FeaturesGridBlock
  | GamesListBlock
  | QuoteFormBlock
  | IconBulletsBlock
  | StatsBlock
  | LogosBlock
  | ComparisonTableBlock
  | GamesGalleryBlock
  | UseCasesBlock
  | FAQBlock
  | ReviewsFeedBlock
  | ProductCardsBlock
  | NewsListBlock;

export type BlockInput = PageBlock;

export type ProductSummary = {
  id?: number;
  slug: string;
  name: string;
  subtitle?: string | null;
  excerpt?: string | null;
  description?: string | null;
  hero_image?: string | null;
  default_cta_label?: string | null;
  seo?: {
    title?: string | null;
    description?: string | null;
    canonical?: string | null;
    og_image?: string | null;
  } | null;
};

export type GameSummary = {
  slug: string;
  title: string;
  excerpt?: string | null;
  hero_image?: string | null;
  genre?: string | null;
  target_age?: string | null;
};

export type PagePayload = {
  slug: string;
  title: string;
  type?: string | null;
  seo?: ProductSummary['seo'];
  blocks?: BlockInput[];
  product?: ProductSummary | null;
  variants?: ProductVariantSummary[];
  games?: GameSummary[];
};

export type HeroBlock = {
  layout: 'hero';
  fields: {
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
  layout: 'features_grid';
  fields: {
    title?: string;
    items: {
      title: string;
      text: string;
      icon?: string;
    }[];
  };
};

export type GamesListBlock = {
  layout: 'games_list';
  fields: {
    title?: string;
    device_type?: string;
    game_slugs?: { slug: string }[] | string[];
  };
};

export type QuoteFormBlock = {
  layout: 'quote_form';
  fields: {
    title?: string;
    body?: string;
    form_code: 'quote' | 'live_demo' | 'contact';
  };
};

export type PageBlock =
  | HeroBlock
  | FeaturesGridBlock
  | GamesListBlock
  | QuoteFormBlock;

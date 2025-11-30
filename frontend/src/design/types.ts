export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface ProductCard {
  title: string;
  tagline: string;
  image: string;
  link: string;
  category: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface Testimonial {
  name: string;
  date: string;
  rating: number;
  text: string;
  avatar?: string;
}

export interface BlogPost {
  title: string;
  tags: { slug: string; name: string }[];
  date: string;
  image: string;
  link: string;
}

export interface ArticleSummary {
  slug: string;
  title: string;
  featured_image?: string | null;
  published_at?: string | null;
  categories?: { slug: string; name: string }[];
}

export interface LogoItem {
  image: string;
  alt?: string;
}

export interface GalleryGame {
  title: string;
  img: string;
}

export interface ProductCarouselQuery {
  limit?: number;
  fields?: string[];
  filter?: Record<string, string | number | boolean | null | undefined>;
}

export interface ProductCarouselProps {
  title: string;
  description: string;
  query?: ProductCarouselQuery;
}

export interface GamesGalleryQuery {
  limit?: number;
  fields?: string[];
  filter?: Record<string, string | number | boolean | null | undefined>;
}

export interface GamesGalleryProps {
  title: string;
  description: string;
  query?: GamesGalleryQuery;
}

export interface NewsQuery {
  limit?: number;
  fields?: string[];
  filter?: Record<string, string | number | boolean | null | undefined>;
}

export interface NewsProps {
  title: string;
  description: string;
  query?: NewsQuery;
}

export interface CTASectionProps {
  title?: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImage?: string;
}

export interface HighlightCTAProps {
  title?: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl?: string;
}

export interface StatsProps {
  items: StatItem[];
  title?: string;
  description?: string;
}

export interface WhyUsProps {
  title?: string;
  description?: string;
}

export interface TrustedByProps {
  logos?: LogoItem[];
  title?: string;
  description?: string;
  footerText?: string;
  query?: {
    fields?: string[];
  };
}

export interface TrustedLogo {
  image: string;
  alt?: string | null;
  position?: number | null;
  is_active?: boolean;
}

export interface TestimonialsProps {
  items: Testimonial[];
  ctaHref?: string;
  ctaLabel?: string;
  title?: string;
  description?: string;
}

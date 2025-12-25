// Shared domain types that are actually reused across modules (API + block registry).

export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt?: string | null;
  featured_image?: string | null;
  video_id?: string | null;
  published_at?: string | null;
  categories?: { slug: string; name: string }[];
  seo?: {
    title?: string | null;
    description?: string | null;
    canonical?: string | null;
    og_image?: string | null;
  } | null;
};

export type ArticleCategorySummary = {
  slug: string;
  name: string;
  parent_id?: number | null;
  position?: number | null;
  articles_count?: number | null;
};

export type GameCategorySummary = {
  slug: string;
  name: string;
  description?: string | null;
  games_count?: number | null;
};

export type TrustedLogo = {
  image: string;
  alt?: string | null;
  position?: number | null;
  is_active?: boolean;
};

export type Review = {
  id?: number | string;
  name: string;
  review_date?: string | null;
  date?: string | null;
  rating: number;
  text: string;
  avatar?: string | null;
  video_id?: string | null;
  source_url?: string | null;
  position?: number | null;
  is_active?: boolean;
};

export type ProductSummary = {
  id?: number;
  slug: string;
  landing_page_slug?: string | null;
  name: string;
  slogan?: string | null;
  excerpt?: string | null;
  description?: string | null;
  hero_image?: string | null;
  default_cta_label?: string | null;
  compare_models_attribute_codes?: string[] | null;
  rating?: number | string | null;
  review_count_label?: string | null;
   badges?: ProductBadge[] | null;
   form?: ProductFormRef | null;
  seo?: {
    title?: string | null;
    description?: string | null;
    canonical?: string | null;
    og_image?: string | null;
  } | null;
};

export type ProductBadge = {
  icon?: string | null;
  image?: string | null;
  label?: string | null;
};

export type ProductFormRef = {
  id?: number | null;
  code?: string | null;
  title?: string | null;
};

export type ProductVariant = {
  id?: number;
  name?: string;
  image?: string | null;
  price?: string | number | null;
  label?: string | null;
  specs?: Record<string, unknown> | null;
  spec_labels?: Record<string, string> | null;
  position?: number | null;
  is_highlighted?: boolean | null;
};

export type GameSummary = {
  slug: string;
  title: string;
  excerpt?: string | null;
  body?: string | null;
  hero_image?: string | null;
  genre?: string | null;
  target_age?: string | null;
  game_type?: string | null;
  video_id?: string | null;
  categories?: { slug: string; name: string }[];
  products_used?: { slug: string; name: string }[];
};

export type TeamMember = {
  id?: number;
  name: string;
  slug: string;
  role?: string | null;
  department?: string | null;
  photo?: string | null;
  bio?: string | null;
  position?: number | null;
  is_active?: boolean | null;
};

export type BreadcrumbItem = {
  label: string;
  href?: string | null;
};

export type SensoryRoomBundleSummary = {
  slug: string;
  title: string;
  excerpt?: string | null;
  gallery?: { src: string; alt?: string | null }[];
  form_code?: string | null;
  custom_bundle_url?: string | null;
  products?: { slug: string; name: string }[];
};

export type SensoryRoomBundleDetail = SensoryRoomBundleSummary & {
  breadcrumbs?: BreadcrumbItem[];
  specs?: string[];
  block_a_title?: string | null;
  block_a_items?: { icon?: string | null; text?: string | null }[];
  block_b_title?: string | null;
  block_b_text?: string | null;
  seo?: {
    title?: string | null;
    description?: string | null;
    canonical?: string | null;
    og_image?: string | null;
  } | null;
};

export type PaddingPreset = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type SectionPadding = string | null | undefined;

// Generic block payload from API (MoonShine Layouts).
export type BlockInput = {
  name: string;
  key?: number | string | null;
  values?: Record<string, unknown> | null;
};

export type PagePayload = {
  slug: string;
  title: string;
  type?: string | null;
  seo?: {
    title?: string | null;
    description?: string | null;
    canonical?: string | null;
    og_image?: string | null;
  } | null;
  blocks?: BlockInput[];
  product?: ProductSummary | null;
  variants?: ProductVariant[] | null;
};

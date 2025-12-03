import type { BlockInput } from './types';

const ANCHOR_PRESETS: Record<string, string> = {
  hero: 'hero',
  hero_values: 'intro',
  feature_grid: 'features',
  product_description: 'description',
  product_nav: 'nav',
  product_specs: 'specs',
  compare_models: 'compare',
  page_header: 'page-header',
  games_gallery: 'games',
  game_detail: 'game',
  games_grid: 'games',
  news: 'news',
  news_list: 'news',
  stats: 'stats',
  faq: 'faq',
  why_us: 'why-us',
  product_hero: 'product-hero',
  product_carousel: 'products',
  our_approach: 'approach',
  cta_section: 'cta',
  highlight_cta: 'highlight',
  reviews: 'reviews',
  trusted_by: 'trusted-by',
};

const TRANSLIT_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
};

export const slugifyAnchor = (value?: string | null): string => {
  if (!value) return '';

  const lower = value.trim().toLowerCase();

  const transliterated = lower
    .split('')
    .map((ch) => TRANSLIT_MAP[ch] ?? ch)
    .join('')
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '');

  return transliterated
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const makeUnique = (base: string, used: Set<string>): string => {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }

  let i = 2;
  let candidate = `${base}-${i}`;
  while (used.has(candidate)) {
    i += 1;
    candidate = `${base}-${i}`;
  }

  used.add(candidate);
  return candidate;
};

export const resolveBlockAnchor = (block: BlockInput, index: number, used: Set<string>): string => {
  const values = (block.values ?? {}) as Record<string, unknown>;
  const explicit = slugifyAnchor((values.anchor as string | undefined) ?? null);
  const preset = ANCHOR_PRESETS[block.name];
  const titleCandidate = slugifyAnchor((values.title as string | undefined) ?? null);
  const fallbackPreset = slugifyAnchor(block.name);

  const base = explicit || preset || titleCandidate || fallbackPreset || `section-${index + 1}`;

  return makeUnique(base, used);
};

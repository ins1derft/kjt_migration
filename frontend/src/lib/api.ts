import type { GameSummary, ProductSummary, ArticleSummary, TrustedLogo, Review } from '@/lib/blocks/types';

export type FormField =
  | { name: string; label?: string; type?: 'text' | 'email' | 'phone'; required?: boolean }
  | { name: string; label?: string; type: 'textarea'; required?: boolean }
  | { name: string; label?: string; type: 'select'; options?: Record<string, string>; required?: boolean }
  | { name: string; label?: string; type: 'checkbox'; required?: boolean; options?: Record<string, string> };

export type FormConfig = {
  code: string;
  title?: string | null;
  topic?: string | null;
  fields: FormField[];
  submit_label?: string | null;
  success_message?: string | null;
};

const serverApiBase = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api').replace(/\/+$/, '');

export const apiBase = serverApiBase;

export function apiUrl(path: string) {
  // On the client, always hit same-origin /api to avoid container hostnames leaking to the browser.
  if (typeof window !== 'undefined') {
    return path.startsWith('/api') ? path : `/api${path}`;
  }
  return `${serverApiBase}${path}`;
}

export type PaginatedResponse<T> = {
  data: T[];
  meta?: unknown;
  links?: unknown;
};

export function extractData<T>(payload: PaginatedResponse<T> | T[] | null | undefined): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

export async function fetchJson<T>(
  path: string,
  init?: RequestInit & { revalidate?: number }
): Promise<T | null> {
  const { revalidate, ...rest } = init ?? {};
  const res = await fetch(apiUrl(path), {
    ...rest,
    next: revalidate !== undefined ? { revalidate } : undefined,
  });

  if (res.status === 404) return null as T;
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with ${res.status}`);
  }

  return (await res.json()) as T;
}

type FetchListOptions = {
  limit?: number;
  init?: RequestInit & { revalidate?: number };
  filter?: Record<string, string | number | boolean | null | undefined>;
  fields?: string[];
  page?: number;
};

function buildQuery(path: string, options: FetchListOptions): string {
  const params = new URLSearchParams();
  if (options.limit) params.set('limit', String(options.limit));
  if (options.page) params.set('page', String(options.page));
  if (options.fields && options.fields.length) {
    params.set('fields', options.fields.join(','));
  }
  if (options.filter) {
    Object.entries(options.filter).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      params.set(`filter[${key}]`, String(value));
    });
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export async function getProducts(options: FetchListOptions = {}): Promise<ProductSummary[]> {
  const { init, ...rest } = options;
  const path = buildQuery('/products', rest);
  const payload = await fetchJson<PaginatedResponse<ProductSummary>>(
    path,
    init ?? { cache: 'no-store' }
  );
  return extractData<ProductSummary>(payload);
}

export async function getGames(options: FetchListOptions = {}): Promise<GameSummary[]> {
  const { init, ...rest } = options;
  const path = buildQuery('/games', rest);
  const payload = await fetchJson<PaginatedResponse<GameSummary>>(
    path,
    init ?? { cache: 'no-store' }
  );
  return extractData<GameSummary>(payload);
}

export async function getGame(slug: string, options: { fields?: string[]; init?: RequestInit & { revalidate?: number } } = {}): Promise<GameSummary | null> {
  const { fields, init } = options;
  const params = new URLSearchParams();
  if (fields && fields.length) {
    params.set('fields', fields.join(','));
  }
  const qs = params.toString();
  const path = `/games/${slug}${qs ? `?${qs}` : ''}`;
  const res = await fetchJson<GameSummary | { data: GameSummary }>(path, init ?? { cache: 'no-store' });
  if (!res) return null;
  return (res as { data: GameSummary }).data ?? (res as GameSummary);
}

export async function getArticles(options: FetchListOptions = {}): Promise<ArticleSummary[]> {
  const { init, ...rest } = options;
  const path = buildQuery('/articles', rest);
  const payload = await fetchJson<PaginatedResponse<ArticleSummary>>(
    path,
    init ?? { cache: 'no-store' }
  );
  return extractData<ArticleSummary>(payload);
}

export async function getTrustedLogos(options: FetchListOptions = {}): Promise<TrustedLogo[]> {
  const { init, ...rest } = options;
  const path = buildQuery('/trusted-logos', rest);
  const payload = await fetchJson<PaginatedResponse<TrustedLogo>>(
    path,
    init ?? { cache: 'no-store' }
  );
  return extractData<TrustedLogo>(payload);
}

export async function getReviews(options: FetchListOptions = {}): Promise<Review[]> {
  const { init, ...rest } = options;
  const path = buildQuery('/reviews', rest);
  const payload = await fetchJson<PaginatedResponse<Review>>(
    path,
    init ?? { cache: 'no-store' }
  );
  return extractData<Review>(payload);
}

type FormOptions = {
  fields?: string[];
  init?: RequestInit & { revalidate?: number };
};

export async function getForm(code: string, options: FormOptions = {}): Promise<FormConfig | null> {
  const { fields, init } = options;
  const params = new URLSearchParams();
  if (fields && fields.length) {
    params.set('fields', fields.join(','));
  }

  const qs = params.toString();
  const path = `/forms/${code}${qs ? `?${qs}` : ''}`;
  return fetchJson<FormConfig>(path, init ?? { cache: 'no-store' });
}

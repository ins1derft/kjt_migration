import type { Metadata } from 'next';
import type { NextSeoProps, DefaultSeoProps } from 'next-seo';
import defaultSeoConfig from '../../next-seo.config';

const rawSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? defaultSeoConfig.canonical ?? 'https://kidsjumptech.com').replace(/\/+$/, '');
export const SITE_URL = rawSiteUrl || 'https://kidsjumptech.com';

export function absoluteUrl(path?: string | null): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

type OgImage = { url: string; width?: number; height?: number; alt?: string };
type OgLike = { url?: string | null; width?: number | null; height?: number | null; alt?: string | null };

function normalizeImages(images?: readonly OgLike[] | null): OgImage[] {
  if (!images) return [];
  return Array.from(images).map((img) => ({
    url: absoluteUrl(img.url ?? SITE_URL),
    width: typeof img.width === 'number' ? img.width : undefined,
    height: typeof img.height === 'number' ? img.height : undefined,
    alt: img.alt ?? undefined,
  }));
}

export function mergeSeo(base: DefaultSeoProps | NextSeoProps, override: NextSeoProps): NextSeoProps {
  return {
    ...base,
    ...override,
    openGraph: {
      ...base.openGraph,
      ...override.openGraph,
      images: override.openGraph?.images ?? base.openGraph?.images,
    },
    twitter: {
      ...base.twitter,
      ...override.twitter,
    },
  };
}

export function nextSeoToMetadata(seo: NextSeoProps): Metadata {
  const title = seo.title ?? defaultSeoConfig.defaultTitle ?? defaultSeoConfig.title;
  const description = seo.description ?? defaultSeoConfig.description;
  const canonical = absoluteUrl(seo.canonical ?? '/');

  const og = seo.openGraph ?? defaultSeoConfig.openGraph ?? {};
  const ogImages = normalizeImages(og.images ?? defaultSeoConfig.openGraph?.images ?? []);

  const twitter = (seo.twitter ?? defaultSeoConfig.twitter ?? {}) as { site?: string; handle?: string; cardType?: 'summary' | 'summary_large_image' };
  const twitterImages = ogImages.length ? [ogImages[0].url] : undefined;

  const shouldIndex = seo.noindex ? false : true;
  const shouldFollow = seo.nofollow ? false : true;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: description ?? undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description: description ?? undefined,
      url: canonical,
      siteName: og.siteName ?? defaultSeoConfig.openGraph?.siteName,
      type: (og.type ?? defaultSeoConfig.openGraph?.type ?? 'website') as 'website' | 'article',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description ?? undefined,
      images: twitterImages,
      site: twitter.site,
      creator: twitter.handle,
    },
    robots: {
      index: shouldIndex,
      follow: shouldFollow,
    },
  };
}

export const defaultSeo = defaultSeoConfig satisfies DefaultSeoProps;

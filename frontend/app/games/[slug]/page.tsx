import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GameDetail from '@/components/blocks/GameDetail';
import PageHeader from '@/components/blocks/PageHeader';
import { fetchJson } from '@/lib/api';
import type { GameSummary } from '@/lib/blocks/types';
import { absoluteUrl, defaultSeo, mergeSeo, nextSeoToMetadata, SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type GameResponse = GameSummary & {
  seo?: {
    title?: string | null;
    description?: string | null;
    canonical?: string | null;
    og_image?: string | null;
  } | null;
};

async function fetchGame(slug: string) {
  const res = await fetchJson<GameResponse | { data: GameResponse }>(`/games/${slug}`, { cache: 'no-store' });
  if (!res) return null;
  return (res as { data: GameResponse }).data ?? (res as GameResponse);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchGame(slug);

  if (!data) {
    return { title: 'Game not found' };
  }

  const canonical = absoluteUrl(`/games/${slug}`);

  const seoConfig = mergeSeo(defaultSeo, {
    title: data.seo?.title ?? data.title,
    description: data.seo?.description ?? data.excerpt ?? defaultSeo.description,
    canonical,
    openGraph: {
      title: data.seo?.title ?? data.title,
      description: data.seo?.description ?? data.excerpt ?? defaultSeo.description,
      url: canonical,
      images: data.seo?.og_image ? [{ url: data.seo.og_image }] : defaultSeo.openGraph?.images,
    },
  });

  return nextSeoToMetadata(seoConfig);
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await fetchGame(slug);

  if (!game) {
    notFound();
  }

  const canonicalUrl = absoluteUrl(`/games/${slug}`);
  const gameJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.excerpt ?? undefined,
    genre: game.genre ?? undefined,
    url: canonicalUrl,
    image: [absoluteUrl(game.hero_image ?? defaultSeo.openGraph?.images?.[0]?.url ?? `${SITE_URL}/images/KJT-OG-Image-New.png`)],
    author: {
      '@type': 'Organization',
      name: 'Kids Jump Tech',
    },
  };

  return (
    <main className="bg-brand-gray text-brand-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
      />
      <PageHeader
        title={game.title}
        titleVariant="gradient"
        padding="pt-[144px] lg:pt-[175px] pb-[69px] lg:pb-[88px]"
        containerClassName="max-w-none lg:max-w-[1088px] lg:px-0 2xl:max-w-[1320px]"
        titleClassName="text-[38px] md:text-[38px] lg:text-[84px] text-center lg:text-left"
      />
      <GameDetail slug={slug} />
    </main>
  );
}

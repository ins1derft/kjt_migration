import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GameDetail from '@/components/blocks/GameDetail';
import PageHeader from '@/components/blocks/PageHeader';
import { fetchJson } from '@/lib/api';
import type { GameSummary } from '@/lib/blocks/types';

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

  const seo = data.seo ?? {};
  const url = seo.canonical || `https://kidsjumptech.com/games/${slug}/`;

  return {
    title: seo.title || data.title,
    description: seo.description || data.excerpt || undefined,
    alternates: { canonical: url },
    openGraph: {
      title: seo.title || data.title,
      description: seo.description || data.excerpt || undefined,
      url,
      images: seo.og_image ? [seo.og_image] : [],
    },
  };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await fetchGame(slug);

  if (!game) {
    notFound();
  }

  return (
    <main className="bg-brand-gray text-brand-dark">
      <PageHeader
        title={game.title}
        className="pb-32 md:pb-48 bg-[#F6F7FA]"
        titleClassName="text-[#ff4cc9] drop-shadow-sm"
      />
      <GameDetail slug={slug} />
    </main>
  );
}

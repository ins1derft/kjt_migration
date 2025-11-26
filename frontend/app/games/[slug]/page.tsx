import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchJson } from '@/lib/api';

type Game = {
  slug: string;
  title: string;
  genre?: string | null;
  target_age?: string | null;
  excerpt?: string | null;
  body?: string | null;
  hero_image?: string | null;
  seo?: {
    title?: string | null;
    description?: string | null;
    canonical?: string | null;
    og_image?: string | null;
  } | null;
};

export const dynamic = 'force-dynamic';

async function fetchGame(slug: string) {
  return fetchJson<Game>(`/games/${slug}`, { cache: 'no-store' });
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
    <main className="page-shell">
      <p className="muted small">Interactive game</p>
      <h1>{game?.title}</h1>
      {(game?.genre || game?.target_age) && (
        <p className="muted">
          {[game.genre, game.target_age].filter(Boolean).join(' • ')}
        </p>
      )}
      {game?.hero_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={game.hero_image} alt={game.title} className="hero-image" />
      )}
      {game?.excerpt && <p className="muted">{game.excerpt}</p>}
      {game?.body && <article className="rich-text" dangerouslySetInnerHTML={{ __html: game.body }} />}
      <Link className="inline-link" href="/games">
        ← All games
      </Link>
    </main>
  );
}

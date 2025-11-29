import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchJson } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <main className="section-shell space-y-6">
      <div className="space-y-2">
        <Badge variant="secondary" className="uppercase tracking-wide">Interactive game</Badge>
        <h1 className="text-3xl font-bold text-foreground">{game?.title}</h1>
        {(game?.genre || game?.target_age) && (
          <p className="text-sm text-muted-foreground">
            {[game.genre, game.target_age].filter(Boolean).join(' • ')}
          </p>
        )}
      </div>

      {game?.hero_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={game.hero_image} alt={game.title} className="w-full rounded-2xl border border-border object-cover" />
      )}

      {game?.excerpt && <p className="text-base text-muted-foreground">{game.excerpt}</p>}

      {game?.body && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <article className="prose max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: game.body }} />
          </CardContent>
        </Card>
      )}

      <Link className="text-sm font-semibold text-primary hover:underline" href="/games">
        ← All games
      </Link>
    </main>
  );
}

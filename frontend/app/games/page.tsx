import Link from 'next/link';
import { extractData, fetchJson, type PaginatedResponse } from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Game = {
  slug: string;
  title: string;
  genre?: string | null;
  target_age?: string | null;
  excerpt?: string | null;
};

export const dynamic = 'force-dynamic';

async function fetchGames() {
  return fetchJson<PaginatedResponse<Game>>('/games?limit=50', { revalidate: 180 });
}

export default async function GamesPage() {
  const payload = await fetchGames();
  const games = extractData<Game>(payload);

  return (
    <main className="section-shell space-y-8">
      <header className="space-y-2">
        <Badge variant="secondary" className="uppercase tracking-wide">
          Games
        </Badge>
        <h1 className="text-3xl font-bold text-foreground">Interactive experiences</h1>
        <p className="text-muted-foreground">Browse the catalogue of games across devices.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <Card key={game.slug} className="flex h-full flex-col">
            <CardHeader>
              <CardTitle className="text-xl">{game.title}</CardTitle>
              {(game.genre || game.target_age) && (
                <p className="text-sm text-muted-foreground">
                  {[game.genre, game.target_age].filter(Boolean).join(' • ')}
                </p>
              )}
            </CardHeader>
            {game.excerpt && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{game.excerpt}</p>
              </CardContent>
            )}
            <CardFooter className="mt-auto">
              <Link className="text-sm font-semibold text-primary hover:underline" href={`/games/${game.slug}`}>
                View game →
              </Link>
            </CardFooter>
          </Card>
        ))}
        {games.length === 0 && <p className="text-muted-foreground">No games published yet.</p>}
      </section>
    </main>
  );
}

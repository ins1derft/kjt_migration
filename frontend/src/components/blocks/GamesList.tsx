import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { GamesListBlock } from "@/lib/blocks/types";
import { extractData, fetchJson, type PaginatedResponse } from "@/lib/api";

type Game = {
  slug: string;
  title: string;
  genre?: string | null;
  target_age?: string | null;
  excerpt?: string | null;
};

async function loadGames() {
  return fetchJson<PaginatedResponse<Game>>('/games', { revalidate: 300 });
}

export default async function GamesList({ title, game_slugs }: GamesListBlock['fields']) {
  const payload = await loadGames();
  const games = extractData<Game>(payload);

  const slugs = Array.isArray(game_slugs)
    ? game_slugs.map((item) => (typeof item === 'string' ? item : item.slug)).filter(Boolean)
    : [];

  const filtered = slugs.length > 0 ? games.filter((game) => slugs.includes(game.slug)) : games;

  if (filtered.length === 0) {
    return null;
  }

  return (
    <section className="section-shell space-y-6">
      <div className="section-heading">
        {title ? <h2>{title}</h2> : <h2>Games</h2>}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {filtered.map((game) => (
          <Card key={game.slug} className="flex h-full flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{game.title}</CardTitle>
              {(game.genre || game.target_age) && (
                <p className="text-sm text-slate-200/80">{[game.genre, game.target_age].filter(Boolean).join(' • ')}</p>
              )}
            </CardHeader>
            {game.excerpt && (
              <CardContent>
                <p className="text-sm text-slate-200/90">{game.excerpt}</p>
              </CardContent>
            )}
            <CardFooter className="mt-auto">
              <Link href={`/games/${game.slug}`} className="text-sm font-semibold text-cyan-300 hover:underline">
                View game
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

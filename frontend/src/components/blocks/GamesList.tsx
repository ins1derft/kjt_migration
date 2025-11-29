import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { GameSummary, GamesListBlock } from "@/lib/blocks/types";
import { extractData, fetchJson, type PaginatedResponse } from "@/lib/api";

type Props = GamesListBlock['fields'];

async function loadGames() {
  // Avoid stale covers after uploads; always fetch fresh
  return fetchJson<PaginatedResponse<GameSummary>>('/games', { cache: 'no-store' });
}

export default async function GamesList({ title, game_slugs, auto_fill }: Props) {
  const games = extractData<GameSummary>(await loadGames());

  const slugs = Array.isArray(game_slugs)
    ? game_slugs.map((item) => (typeof item === 'string' ? item : item.slug)).filter(Boolean)
    : [];

  const shouldAuto = !!auto_fill;

  const filtered = shouldAuto
    ? games
    : slugs.length > 0
      ? games.filter((game) => slugs.includes(game.slug))
      : [];

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

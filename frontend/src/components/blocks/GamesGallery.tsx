import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { GameSummary, GamesGalleryBlock } from "@/lib/blocks/types";
import { extractData, fetchJson, type PaginatedResponse } from "@/lib/api";

type Props = GamesGalleryBlock['fields'];

async function fetchGames(limit?: number) {
  const query = limit ? `/games?limit=${limit}` : '/games';
  // Use fresh data to reflect latest media uploads immediately
  return fetchJson<PaginatedResponse<GameSummary>>(query, { cache: 'no-store' });
}

export default async function GamesGallery({ title, game_slugs, limit, auto_fill }: Props) {
  const requestedLimit = limit ? Number(limit) : undefined;

  const payload = await fetchGames(requestedLimit);
  const games = extractData<GameSummary>(payload);

  const slugs = Array.isArray(game_slugs)
    ? game_slugs.map((g) => (typeof g === 'string' ? g : g.slug)).filter(Boolean)
    : [];

  const shouldAuto = !!auto_fill;

  let list = (() => {
    if (shouldAuto) {
      return games;
    }
    if (slugs.length === 0) {
      return [];
    }
    return games.filter((g) => slugs.includes(g.slug));
  })();

  if (requestedLimit && list.length > requestedLimit) {
    list = list.slice(0, requestedLimit);
  }

  if (list.length === 0) return null;

  return (
    <section className="section-shell space-y-6">
      <div className="section-heading">
        <h2>{title ?? 'Games'}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((game) => (
          <Card key={game.slug} className="flex h-full flex-col">
            {game.hero_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={game.hero_image}
                alt={game.title}
                className="h-40 w-full rounded-t-xl object-cover"
              />
            )}
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
            </CardHeader>
            {game.excerpt && (
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground">{game.excerpt}</CardDescription>
              </CardContent>
            )}
            <CardFooter className="mt-auto">
              <Link href={`/games/${game.slug}`} className="text-sm font-semibold text-primary hover:underline">
                View game →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

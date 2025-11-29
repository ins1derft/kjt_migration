import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { GamesGalleryBlock } from "@/lib/blocks/types";
import { extractData, fetchJson, type PaginatedResponse } from "@/lib/api";

type Game = {
  slug: string;
  title: string;
  excerpt?: string | null;
  hero_image?: string | null;
};

async function fetchGames(limit?: number) {
  const query = limit ? `/games?limit=${limit}` : '/games';
  return fetchJson<PaginatedResponse<Game>>(query, { revalidate: 300 });
}

export default async function GamesGallery({ title, game_slugs, limit }: GamesGalleryBlock['fields']) {
  const payload = await fetchGames(limit ? Number(limit) : undefined);
  const games = extractData<Game>(payload);

  const slugs = Array.isArray(game_slugs)
    ? game_slugs.map((g) => (typeof g === 'string' ? g : g.slug)).filter(Boolean)
    : [];

  const list = slugs.length > 0 ? games.filter((g) => slugs.includes(g.slug)) : games;

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

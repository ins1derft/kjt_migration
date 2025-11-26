import Link from 'next/link';
import { extractData, fetchJson, type PaginatedResponse } from '@/lib/api';

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
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Games</p>
        <h1>Interactive experiences</h1>
        <p className="muted">Browse the catalogue of games across devices.</p>
      </header>

      <section className="card-grid">
        {games.map((game) => (
          <article key={game.slug} className="card">
            <h3>
              <Link href={`/games/${game.slug}`}>{game.title}</Link>
            </h3>
            {(game.genre || game.target_age) && (
              <p className="muted small">{[game.genre, game.target_age].filter(Boolean).join(' • ')}</p>
            )}
            {game.excerpt && <p className="muted">{game.excerpt}</p>}
            <Link className="inline-link" href={`/games/${game.slug}`}>
              View game →
            </Link>
          </article>
        ))}

        {games.length === 0 && <p className="muted">No games published yet.</p>}
      </section>
    </main>
  );
}

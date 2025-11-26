import Link from 'next/link';
import styles from './blocks.module.css';
import type { GamesListBlock } from '@/lib/blocks/types';
import { extractData, fetchJson, type PaginatedResponse } from '@/lib/api';

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

export default async function GamesList({
  title,
  game_slugs,
}: GamesListBlock['fields']) {
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
    <section className={styles.section}>
      <div className={styles.sectionHeading}>
        {title && <h2>{title}</h2>}
        {!title && <h2>Games</h2>}
      </div>
      <div className={styles.gamesGrid}>
        {filtered.map((game) => (
          <article key={game.slug} className={styles.gameCard}>
            <div className={styles.gameTitle}>{game.title}</div>
            {(game.genre || game.target_age) && (
              <p className={styles.gameMeta}>
                {[game.genre, game.target_age].filter(Boolean).join(' • ')}
              </p>
            )}
            {game.excerpt && <p className={styles.cardText}>{game.excerpt}</p>}
            <Link href={`/games/${game.slug}`} className={styles.ctaSecondary}>
              View game
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

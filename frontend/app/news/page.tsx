import Link from 'next/link';
import { extractData, fetchJson, type PaginatedResponse } from '@/lib/api';

type Article = {
  slug: string;
  title: string;
  excerpt?: string | null;
  featured_image?: string | null;
  published_at?: string | null;
};

export const dynamic = 'force-dynamic';

async function fetchArticles() {
  return fetchJson<PaginatedResponse<Article>>('/articles?type=news&limit=20', {
    revalidate: 180,
  });
}

export default async function NewsPage() {
  const payload = await fetchArticles();
  const articles = extractData<Article>(payload);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 xl:px-12 py-12 lg:py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Company updates & announcements</h1>
        <p className="text-muted-foreground">Fresh stories from Kids Jump Tech.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {article.published_at
              ? new Date(article.published_at).toLocaleDateString()
              : 'Published soon'}
          </p>
        ))}

        {articles.length === 0 && <p className="text-muted-foreground">No news yet.</p>}
      </section>
    </main>
  );
}

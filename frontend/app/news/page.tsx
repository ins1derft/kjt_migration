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
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">News</p>
        <h1>Company updates & announcements</h1>
        <p className="muted">Fresh stories from Kids Jump Tech.</p>
      </header>

      <section className="card-grid">
        {articles.map((article) => (
          <article key={article.slug} className="card">
            <p className="muted small">
              {article.published_at
                ? new Date(article.published_at).toLocaleDateString()
                : 'Published soon'}
            </p>
            <h3>
              <Link href={`/news/${article.slug}`}>{article.title}</Link>
            </h3>
            {article.excerpt && <p className="muted">{article.excerpt}</p>}
            <Link className="inline-link" href={`/news/${article.slug}`}>
              Read story →
            </Link>
          </article>
        ))}

        {articles.length === 0 && <p className="muted">No news yet.</p>}
      </section>
    </main>
  );
}

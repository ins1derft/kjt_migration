import Link from 'next/link';
import { extractData, fetchJson, type PaginatedResponse } from '@/lib/api';

type Article = {
  slug: string;
  title: string;
  excerpt?: string | null;
  published_at?: string | null;
};

export const dynamic = 'force-dynamic';

async function fetchCaseStudies() {
  return fetchJson<PaginatedResponse<Article>>('/articles?type=case_study&limit=20', {
    revalidate: 300,
  });
}

export default async function CaseStudiesPage() {
  const payload = await fetchCaseStudies();
  const articles = extractData<Article>(payload);

  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Case studies</p>
        <h1>Projects and success stories</h1>
        <p className="muted">
          Real-world examples of custom installs, sensory rooms, and interactive experiences.
        </p>
      </header>

      <section className="card-grid">
        {articles.map((article) => (
          <article key={article.slug} className="card">
            <p className="muted small">
              {article.published_at
                ? new Date(article.published_at).toLocaleDateString()
                : 'Publishing soon'}
            </p>
            <h3>
              <Link href={`/news/${article.slug}`}>{article.title}</Link>
            </h3>
            {article.excerpt && <p className="muted">{article.excerpt}</p>}
            <Link className="inline-link" href={`/news/${article.slug}`}>
              Read case →
            </Link>
          </article>
        ))}

        {articles.length === 0 && <p className="muted">No case studies yet.</p>}
      </section>
    </main>
  );
}

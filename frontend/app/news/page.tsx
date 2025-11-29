import Link from 'next/link';
import { extractData, fetchJson, type PaginatedResponse } from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <main className="section-shell space-y-8">
      <header className="space-y-2">
        <Badge variant="secondary" className="uppercase tracking-wide">News</Badge>
        <h1 className="text-3xl font-bold text-foreground">Company updates & announcements</h1>
        <p className="text-muted-foreground">Fresh stories from Kids Jump Tech.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.slug} className="flex h-full flex-col">
            <CardHeader className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString()
                  : 'Published soon'}
              </p>
              <CardTitle className="text-lg">{article.title}</CardTitle>
            </CardHeader>
            {article.excerpt && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{article.excerpt}</p>
              </CardContent>
            )}
            <CardFooter className="mt-auto">
              <Link className="text-sm font-semibold text-primary hover:underline" href={`/news/${article.slug}`}>
                Read story →
              </Link>
            </CardFooter>
          </Card>
        ))}

        {articles.length === 0 && <p className="text-muted-foreground">No news yet.</p>}
      </section>
    </main>
  );
}

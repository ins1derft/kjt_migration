import Link from 'next/link';
import { extractData, fetchJson, type PaginatedResponse } from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <main className="section-shell space-y-8">
      <header className="space-y-2">
        <Badge variant="secondary" className="uppercase tracking-wide">Case studies</Badge>
        <h1 className="text-3xl font-bold text-foreground">Projects and success stories</h1>
        <p className="text-muted-foreground">
          Real-world examples of custom installs, sensory rooms, and interactive experiences.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.slug} className="flex h-full flex-col">
            <CardHeader className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString()
                  : 'Publishing soon'}
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
                Read case →
              </Link>
            </CardFooter>
          </Card>
        ))}

        {articles.length === 0 && <p className="text-muted-foreground">No case studies yet.</p>}
      </section>
    </main>
  );
}

import Link from "next/link";
import type { NewsListBlock } from "@/lib/blocks/types";
import { extractData, fetchJson, type PaginatedResponse } from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Article = {
  slug: string;
  title: string;
  excerpt?: string | null;
  published_at?: string | null;
  type?: string | null;
  categories?: { slug: string; name: string }[];
};

async function fetchArticles(query: string) {
  return fetchJson<PaginatedResponse<Article>>(`/articles${query}`, { revalidate: 180 });
}

export default async function NewsListBlockComponent({ title, filters }: NewsListBlock['fields']) {
  const params = new URLSearchParams();
  if (filters?.types) params.set('type', filters.types);
  if (filters?.category_slugs) params.set('category', filters.category_slugs);
  if (filters?.limit) params.set('limit', filters.limit);

  const payload = await fetchArticles(params.toString() ? `?${params.toString()}` : '');
  const articles = extractData<Article>(payload);

  if (articles.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 xl:px-12 py-12 lg:py-16 space-y-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-foreground">{title ?? 'News'}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.slug} className="flex h-full flex-col">
            <CardHeader className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString()
                  : article.type ?? 'News'}
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
                Read more →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

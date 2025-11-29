import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchJson } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Article = {
  slug: string;
  title: string;
  excerpt?: string | null;
  body?: string | null;
  featured_image?: string | null;
  published_at?: string | null;
  seo?: {
    title?: string | null;
    description?: string | null;
    canonical?: string | null;
    og_image?: string | null;
  } | null;
};

export const dynamic = 'force-dynamic';

async function fetchArticle(slug: string) {
  return fetchJson<Article>(`/articles/${slug}`, { cache: 'no-store' });
}

const slugFromParams = (params: { slug: string[] }) => params.slug[params.slug.length - 1];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug: slugParts } = await params;
  const slug = slugFromParams({ slug: slugParts });
  const article = await fetchArticle(slug);

  if (!article) {
    return { title: 'Article not found' };
  }

  const seo = article.seo ?? {};
  const url = seo.canonical || `https://kidsjumptech.com/news/${slug}/`;

  return {
    title: seo.title || article.title,
    description: seo.description || article.excerpt || undefined,
    alternates: { canonical: url },
    openGraph: {
      title: seo.title || article.title,
      description: seo.description || article.excerpt || undefined,
      url,
      images: seo.og_image ? [seo.og_image] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await params;
  const slug = slugFromParams({ slug: slugParts });
  const article = await fetchArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="section-shell space-y-6">
      <div className="space-y-2">
        <Badge variant="secondary" className="uppercase tracking-wide">
          {article?.published_at
            ? new Date(article.published_at).toLocaleDateString()
            : 'Unpublished'}
        </Badge>
        <h1 className="text-3xl font-bold text-foreground">{article?.title}</h1>
      </div>
      {article?.featured_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.featured_image} alt={article.title} className="w-full rounded-2xl border border-border object-cover" />
      )}
      {article?.body && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Article</CardTitle>
          </CardHeader>
          <CardContent>
            <article className="prose max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: article.body }} />
          </CardContent>
        </Card>
      )}
      <Link href="/news" className="text-sm font-semibold text-primary hover:underline">
        ← Back to news
      </Link>
    </main>
  );
}

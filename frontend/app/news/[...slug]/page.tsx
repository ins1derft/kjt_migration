import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchJson, extractData, type PaginatedResponse } from '@/lib/api';
import { absoluteUrl, defaultSeo, mergeSeo, nextSeoToMetadata, SITE_URL } from '@/lib/seo';

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

async function fetchCategoryArticles(categorySlug: string) {
  return fetchJson<PaginatedResponse<Article>>(
    `/articles?filter[category]=${categorySlug}&limit=24`,
    { cache: 'no-store' }
  );
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
    if (slugParts.length === 1) {
      const categorySlug = slugParts[0];
      return {
        title: `News: ${categorySlug}`,
        description: `Articles in category ${categorySlug}`,
        alternates: { canonical: `/news/${categorySlug}` },
      };
    }
    return { title: 'Article not found' };
  }

  const canonical = absoluteUrl(`/news/${slug}`);

  const seoConfig = mergeSeo(defaultSeo, {
    title: article.seo?.title ?? article.title,
    description: article.seo?.description ?? article.excerpt ?? defaultSeo.description,
    canonical,
    openGraph: {
      title: article.seo?.title ?? article.title,
      description: article.seo?.description ?? article.excerpt ?? defaultSeo.description,
      url: canonical,
      images: article.seo?.og_image ? [{ url: article.seo.og_image }] : defaultSeo.openGraph?.images,
    },
  });

  return nextSeoToMetadata(seoConfig);
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await params;
  const slug = slugFromParams({ slug: slugParts });
  const article = await fetchArticle(slug);

  // If article found — render article, regardless of slug depth
  if (article) {
    const canonicalUrl = absoluteUrl(`/news/${slug}`);
    const imageUrl = absoluteUrl(article.featured_image ?? article.seo?.og_image ?? defaultSeo.openGraph?.images?.[0]?.url ?? `${SITE_URL}/images/interactive-header/hero-desktop.jpg`);
    const publishedAt = article.published_at ?? new Date().toISOString();
    const logoUrl = absoluteUrl(defaultSeo.openGraph?.images?.[0]?.url ?? `${SITE_URL}/images/interactive-header/hero-desktop.jpg`);
    const articleJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.excerpt ?? undefined,
      datePublished: publishedAt,
      dateModified: publishedAt,
      mainEntityOfPage: canonicalUrl,
      image: [imageUrl],
      author: {
        '@type': 'Organization',
        name: 'Kids Jump Tech',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Kids Jump Tech',
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
        },
      },
    };

    return (
      <main className="mx-auto w-full max-w-6xl px-4 xl:px-12 py-12 lg:py-16 space-y-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <div className="space-y-2">
          <div className="uppercase tracking-wide">
            {article?.published_at
              ? new Date(article.published_at).toLocaleDateString()
              : 'Unpublished'}
          </div>
          <h1 className="text-3xl font-bold text-foreground">{article?.title}</h1>
        </div>
        {article?.featured_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.featured_image} alt={article.title} className="w-full rounded-2xl border border-border object-cover" />
        )}
        {article?.body && (
          <article className="prose max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: article.body }} />
        )}
        <Link href="/news" className="text-sm font-semibold text-primary hover:underline">
          ← Back to news
        </Link>
      </main>
    );
  }

  // Category listing only when no article found and single segment
  if (slugParts.length === 1) {
    const categorySlug = slugParts[0];
    const payload = await fetchCategoryArticles(categorySlug);
    const articles = extractData<Article>(payload);

    if (!articles.length) {
      notFound();
    }

    return (
      <main className="mx-auto w-full max-w-6xl px-4 xl:px-12 py-12 lg:py-16 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">News in “{categorySlug}”</h1>
          <p className="text-muted-foreground">Latest stories for this category.</p>
        </div>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <p key={article.slug} className="text-xs uppercase tracking-wide text-muted-foreground">
              {article.published_at
                ? new Date(article.published_at).toLocaleDateString()
                : 'Published soon'}
            </p>
          ))}
        </section>
      </main>
    );
  }

  notFound();
}

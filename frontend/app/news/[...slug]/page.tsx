import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/blocks/PageHeader';
import NewsList from '@/components/blocks/NewsList';
import ArticleBody from '@/components/ArticleBody';
import { fetchJson, getArticleCategories, getArticles } from '@/lib/api';
import type { ArticleCategorySummary } from '@/lib/blocks/types';
import { absoluteUrl, defaultSeo, mergeSeo, nextSeoToMetadata, SITE_URL } from '@/lib/seo';
import { resolveMediaUrl } from '@/lib/utils';

const DEFAULT_FIELDS = [
  'slug',
  'title',
  'excerpt',
  'featured_image',
  'video_id',
  'published_at',
  'categories',
];

type Article = {
  slug: string;
  title: string;
  excerpt?: string | null;
  body?: string | null;
  featured_image?: string | null;
  video_id?: string | null;
  published_at?: string | null;
  categories?: { slug: string; name: string }[];
  seo?: {
    title?: string | null;
    description?: string | null;
    canonical?: string | null;
    og_image?: string | null;
  } | null;
};

type Neighbor = { slug: string; title: string };

type SidebarPost = {
  slug: string;
  title: string;
  published_at?: string | null;
  categories?: { slug: string; name: string }[];
};

export const dynamic = 'force-dynamic';

type ArticleApiResponse = { data: Article };

async function fetchArticle(slug: string) {
  const payload = await fetchJson<Article | ArticleApiResponse>(`/articles/${slug}`, { cache: 'no-store' });
  if (!payload) return null;
  return 'data' in payload ? payload.data : payload;
}

async function fetchRecentPosts(currentSlug?: string | null) {
  const list = await getArticles({
    limit: 6,
    fields: DEFAULT_FIELDS,
  });
  const filtered = currentSlug ? list.filter((item) => item.slug !== currentSlug) : list;
  return filtered.slice(0, 5) as SidebarPost[];
}

async function fetchArticleCategories() {
  const categories = await getArticleCategories();
  return categories as ArticleCategorySummary[];
}

async function fetchNeighbors(article: Article) {
  const primaryCategory = article.categories?.[0]?.slug ?? null;
  const filter = {
    ...(primaryCategory ? { category: primaryCategory } : {}),
  };

  const list = await getArticles({
    limit: 200,
    fields: ['slug', 'title', 'categories'],
    filter,
  });
  const idx = list.findIndex((item) => item.slug === article.slug);
  const prev = idx > 0 ? { slug: list[idx - 1].slug, title: list[idx - 1].title } : null;
  const next = idx >= 0 && idx < list.length - 1 ? { slug: list[idx + 1].slug, title: list[idx + 1].title } : null;

  return { prev, next } as { prev: Neighbor | null; next: Neighbor | null };
}

const slugFromParams = (params: { slug: string[] }) => params.slug[params.slug.length - 1];

const formatDate = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const resolveCover = (article: Article): string => {
  if (article.featured_image) {
    return resolveMediaUrl(article.featured_image) ?? '/images/placeholders/no-image.jpg';
  }
  if (article.video_id) return `https://img.youtube.com/vi/${article.video_id}/maxresdefault.jpg`;
  return '/images/placeholders/no-image.jpg';
};

function NavChevron({ direction }: { direction: 'left' | 'right' }) {
  const rotationClass = direction === 'left' ? 'rotate-90' : '-rotate-90';
  return (
    <span className="flex h-[9px] w-[4.428px] items-center justify-center text-brand-dark">
      <span className={rotationClass}>
        <svg
          width="9"
          height="4.428"
          viewBox="0 0 11 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-[4.428px] w-[9px]"
          aria-hidden="true"
        >
          <path d="M0.999949 1.0002L5.4279 5.42814" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9.99995 1.0002L5.572 5.42814" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    </span>
  );
}

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

  const canonical = absoluteUrl(article.seo?.canonical ?? `/news/${slug}`);

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

  if (article) {
    const canonicalUrl = absoluteUrl(article.seo?.canonical ?? `/news/${slug}`);
    const imageUrl = absoluteUrl(
      resolveMediaUrl(
        article.featured_image ??
          article.seo?.og_image ??
          defaultSeo.openGraph?.images?.[0]?.url ??
          `${SITE_URL}/images/KJT-OG-Image-New.png`
      )
    );
    const publishedAt = article.published_at ?? new Date().toISOString();
    const logoUrl = absoluteUrl(
      defaultSeo.openGraph?.images?.[0]?.url ?? `${SITE_URL}/images/KJT-OG-Image-New.png`
    );
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

    const [recentPosts, categories, neighbors] = await Promise.all([
      fetchRecentPosts(article.slug),
      fetchArticleCategories(),
      fetchNeighbors(article),
    ]);

    const primaryCategory = article.categories?.[0];
    const breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: 'News', href: '/news' },
      ...(primaryCategory?.slug && primaryCategory?.name
        ? [{ label: primaryCategory.name, href: `/news/${primaryCategory.slug}` }]
        : []),
    ];

    const heroImage = resolveCover(article);

    return (
      <main className="bg-white text-brand-dark">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <PageHeader
          title={article.title}
          breadcrumbs={breadcrumbs}
          padding="pt-[150px] lg:pt-[178px] pb-[40px]"
          backgroundClass="bg-brand-gray"
        />

        <section className="bg-white pt-[80px] pb-[120px] lg:pb-[150px]">
          <div className="container mx-auto w-full px-5 sm:px-6 lg:px-10 2xl:max-w-[1320px] 2xl:px-0">
            <div className="grid gap-[50px] lg:grid-cols-[minmax(0,866px)_minmax(0,377px)] lg:gap-[77px]">
              <article>
                <div className="relative w-full overflow-hidden rounded-[17.23px] bg-black h-[240px] sm:h-[320px] lg:h-[418px]">
                  {article.video_id ? (
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${article.video_id}?rel=0&showinfo=0&iv_load_policy=3&playsinline=1`}
                      title={article.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{ border: 'none' }}
                    />
                  ) : (
                    <Image
                      src={heroImage}
                      alt={article.title}
                      fill
                      sizes="(min-width: 1024px) 866px, 100vw"
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>

                {article.body ? (
                  <ArticleBody html={article.body} className="mt-[40px]" />
                ) : null}

                {(neighbors.prev || neighbors.next) ? (
                  <div className="mt-[86px] flex flex-col gap-[18px] lg:flex-row lg:justify-between lg:gap-0">
                    {neighbors.prev ? (
                      <Link
                        href={`/news/${neighbors.prev.slug}`}
                        className="h-[73px] w-full lg:w-[432px] border-y border-brand-dark/30 hover:border-brand-dark/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-[4px]"
                      >
                        <div className="grid h-full grid-cols-[4.428px_1fr] items-center gap-x-[34.572px] px-[28px]">
                          <NavChevron direction="left" />
                          <div className="w-[310px] font-sans text-[16px] leading-[1.2] text-brand-dark/70">
                            <div className="font-light">Previous Post</div>
                            <div>{neighbors.prev.title}</div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="hidden lg:block h-[73px] w-[432px]" />
                    )}

                    {neighbors.next ? (
                      <Link
                        href={`/news/${neighbors.next.slug}`}
                        className="h-[73px] w-full lg:w-[432px] border-y border-brand-dark/30 hover:border-brand-dark/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-[4px]"
                      >
                        <div className="grid h-full grid-cols-[1fr_4.428px] items-center gap-x-[34.572px] px-[28px]">
                          <div className="w-[310px] justify-self-end text-right font-sans text-[16px] leading-[1.2] text-brand-dark/70">
                            <div className="font-light">Next Post</div>
                            <div>{neighbors.next.title}</div>
                          </div>
                          <NavChevron direction="right" />
                        </div>
                      </Link>
                    ) : (
                      <div className="hidden lg:block h-[73px] w-[432px]" />
                    )}
                  </div>
                ) : null}
              </article>

              <aside className="space-y-[40px] lg:pt-[20px]">
                <div>
                  <h2 className="font-heading text-[32px] lg:text-[44px] font-bold leading-none text-brand-dark">
                    Recent Posts
                  </h2>
                  <div className="mt-[24px] space-y-[18px]">
                    {recentPosts.map((post) => (
                      <div key={post.slug}>
                        <Link
                          href={`/news/${post.slug}`}
                          className="block font-heading text-[18px] font-bold leading-[1.2] text-brand-sky hover:opacity-80"
                        >
                          {post.title}
                        </Link>
                        <div className="mt-[6px] font-heading text-[16px] font-light text-brand-dark/60">
                          {formatDate(post.published_at) || 'Published soon'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-heading text-[32px] lg:text-[44px] font-bold leading-none text-brand-dark">
                    Categories
                  </h2>
                  <ul className="mt-[24px] space-y-[6px] font-heading text-[18px] leading-[1.8] text-brand-dark">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={`/news/${category.slug}`}
                          className="text-brand-sky hover:opacity-80"
                        >
                          {category.name}
                        </Link>
                        {typeof category.articles_count === 'number' ? (
                          <span className="text-brand-dark"> ({category.articles_count})</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (slugParts.length === 1) {
    const categorySlug = slugParts[0];
    const categories = await getArticleCategories({ includeEmpty: true });
    const category = categories.find((item) => item.slug === categorySlug);

    if (!category) {
      notFound();
    }

    return (
      <main className="bg-brand-gray text-brand-dark">
        <PageHeader
          title={category.name}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'News', href: '/news' },
          ]}
          padding="pt-[160px] lg:pt-[198px] pb-[38px]"
        />
        <NewsList
          query={{
            limit: 20,
            filter: { category: categorySlug },
          }}
        />
      </main>
    );
  }

  notFound();
}

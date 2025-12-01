import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductHero from '@/components/blocks/ProductHero';
import { renderBlocks } from '@/lib/blocks/registry';
import type { BlockInput, PagePayload, ProductSummary } from '@/lib/blocks/types';
import { fetchJson, getForm } from '@/lib/api';

export const dynamic = 'force-dynamic';

type PageApiResponse = { data: PagePayload };

function isPageResource(payload: PagePayload | PageApiResponse): payload is PageApiResponse {
  return typeof (payload as PageApiResponse).data === "object";
}

async function fetchPage(slug: string) {
  const res = await fetchJson<PageApiResponse | PagePayload>(`/pages/${slug}`, {
    cache: 'no-store',
  });
  if (!res) return null;
  // unwrap Laravel resource { data: ... }
  return isPageResource(res) ? res.data : res;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchPage(slug);
  if (!data) {
    return { title: 'Page not found' };
  }

  const seo = data.seo ?? {};
  const url = seo.canonical || `https://kidsjumptech.com/${slug}/`;

  return {
    title: seo.title || data.title,
    description: seo.description || undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: seo.title || data.title,
      description: seo.description || undefined,
      url,
      images: seo.og_image ? [seo.og_image] : [],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await fetchPage(slug);

  if (!data) notFound();

  const blocks = (data?.blocks ?? []) as BlockInput[];
  const product = (data?.product ?? null) as ProductSummary | null;
  const formConfig = product?.form?.code
    ? await getForm(product.form.code, { init: { cache: 'no-store' } })
    : null;
  const pageCtx = {
    product: data?.product,
    variants: data?.variants,
    formConfig,
  };

  const showProductHero = data?.type === 'product_landing' && product;
  const heroProps = showProductHero
    ? {
        title: product?.name ?? '',
        slogan: product?.excerpt ?? product?.slogan ?? undefined,
        description: product?.description ?? product?.excerpt ?? undefined,
        rating: product?.rating ?? undefined,
        reviewCount: product?.review_count_label ?? undefined,
        badges: product?.badges ?? [],
        formCode: product?.form?.code ?? undefined,
        formTitle: product?.form?.title ?? undefined,
        formConfig,
        ctaLabel: product?.default_cta_label ?? undefined,
      }
    : null;

  return (
    <main>
      {showProductHero && heroProps && <ProductHero {...heroProps} />}
      {renderBlocks(blocks, pageCtx)}
      {blocks.length === 0 && (
        <p className="mx-auto w-full max-w-6xl px-4 xl:px-12 py-8 text-muted-foreground">Content will appear here soon.</p>
      )}
    </main>
  );
}

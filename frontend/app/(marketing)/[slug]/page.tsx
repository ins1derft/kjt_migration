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
  const productFormCode = product?.form?.code ?? null;

  const blockFormCodes = blocks
    .map((block) => {
      if (block.name !== 'product_hero' && block.name !== 'cta_section') return null;
      const values = (block.values ?? {}) as { formCode?: string | null };
      return values.formCode ?? null;
    })
    .filter(Boolean) as string[];

  const uniqueFormCodes = Array.from(new Set([productFormCode, ...blockFormCodes].filter(Boolean))) as string[];

  const formsByCodeEntries = await Promise.all(
    uniqueFormCodes.map(async (code) => [code, await getForm(code, { init: { cache: 'no-store' } })] as const)
  );

  const formsByCode = Object.fromEntries(formsByCodeEntries) as Record<string, Awaited<ReturnType<typeof getForm>>>;
  const formConfig = productFormCode ? formsByCode[productFormCode] ?? null : null;

  const pageCtx = {
    product: data?.product,
    variants: data?.variants,
    formConfig,
    formsByCode,
  };

  // Normalize blocks: make sure Reviews always has a query and no legacy items payload.
  const normalizedBlocks = blocks.map((block) => {
    if (block.name !== 'reviews') return block;
    const values = { ...(block.values ?? {}) } as Record<string, unknown>;
    const { items: _omitItems, ...rest } = values;
    const query = (values as { query?: Record<string, unknown> }).query ?? { limit: 12, onlyActive: true };
    return { ...block, values: { ...rest, query } } as BlockInput;
  });

  const hasProductHeroBlock = normalizedBlocks.some((block) => block.name === 'product_hero');
  const showProductHero = data?.type === 'product_landing' && product && !hasProductHeroBlock;

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
        hasProduct: true,
      }
    : null;

  return (
    <main>
      {showProductHero && heroProps && <ProductHero {...heroProps} />}
      {renderBlocks(normalizedBlocks, pageCtx)}
      {normalizedBlocks.length === 0 && (
        <p className="mx-auto w-full max-w-6xl px-4 xl:px-12 py-8 text-muted-foreground">Content will appear here soon.</p>
      )}
    </main>
  );
}

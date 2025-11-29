import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { renderBlocks } from '@/lib/blocks/registry';
import type { BlockInput, PagePayload } from '@/lib/blocks/types';
import { fetchJson } from '@/lib/api';

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
  const pageCtx = {
    product: data?.product,
    variants: data?.variants,
  };

  return (
    <main>
      {renderBlocks(blocks, pageCtx)}
      {blocks.length === 0 && <p className="container-shell py-8 text-muted-foreground">Content will appear here soon.</p>}
    </main>
  );
}

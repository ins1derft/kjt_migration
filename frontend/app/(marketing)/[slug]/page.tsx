import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { renderBlocks } from '@/lib/blocks/registry';
import type { PageBlock } from '@/lib/blocks/types';
import { fetchJson } from '@/lib/api';

export const dynamic = 'force-dynamic';

type PageResponse = {
  slug: string;
  title: string;
  type?: string | null;
  seo?: {
    title?: string | null;
    description?: string | null;
    canonical?: string | null;
    og_image?: string | null;
  } | null;
  blocks?: PageBlock[];
};

async function fetchPage(slug: string) {
  return fetchJson<PageResponse>(`/pages/${slug}`, { revalidate: 300 });
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

  if (!data) {
    notFound();
  }

  const blocks = (data?.blocks ?? []) as PageBlock[];

  return (
    <main className="page-shell">
      {renderBlocks(blocks)}
      {blocks.length === 0 && <p className="muted">Content will appear here soon.</p>}
    </main>
  );
}

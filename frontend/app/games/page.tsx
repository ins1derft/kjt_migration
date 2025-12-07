import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { renderBlocks } from '@/lib/blocks/registry';
import type { BlockInput, PagePayload } from '@/lib/blocks/types';
import { fetchJson } from '@/lib/api';
import { absoluteUrl, defaultSeo, mergeSeo, nextSeoToMetadata } from '@/lib/seo';
import PageHeader from '@/components/blocks/PageHeader';
import GamesGrid from '@/components/blocks/GamesGrid';

export const dynamic = 'force-dynamic';

type PageApiResponse = { data: PagePayload };

function isPageResource(payload: PagePayload | PageApiResponse): payload is PageApiResponse {
  return typeof (payload as PageApiResponse).data === 'object';
}

async function fetchPage() {
  const res = await fetchJson<PageApiResponse | PagePayload>('/pages/games', {
    cache: 'no-store',
  });
  if (!res) return null;
  return isPageResource(res) ? res.data : res;
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchPage();
  if (!data) {
    return { title: 'Games not found' };
  }

  const canonical = absoluteUrl('/games');

  const seoConfig = mergeSeo(defaultSeo, {
    title: data.seo?.title ?? data.title,
    description: data.seo?.description ?? defaultSeo.description,
    canonical,
    openGraph: {
      title: data.seo?.title ?? data.title,
      description: data.seo?.description ?? defaultSeo.description,
      url: canonical,
      images: data.seo?.og_image ? [{ url: data.seo.og_image }] : defaultSeo.openGraph?.images,
    },
  });

  return nextSeoToMetadata(seoConfig);
}

export default async function GamesPage() {
  const data = await fetchPage();
  if (!data) notFound();

  const blocks = (data?.blocks ?? []) as BlockInput[];

  // Normalize Reviews block to rely on query and drop inline items payloads.
  const normalizedBlocks = blocks.map((block) => {
    if (block.name !== 'reviews') return block;
    const values = { ...(block.values ?? {}) } as Record<string, unknown>;
    const { items: _omitItems, ...rest } = values;
    void _omitItems;
    const query = (values as { query?: Record<string, unknown> }).query ?? { limit: 12, onlyActive: true };
    return { ...block, values: { ...rest, query } } as BlockInput;
  });

  const content = normalizedBlocks.length
    ? renderBlocks(normalizedBlocks, {})
    : (
      <>
        <PageHeader title={data.title} />
        <GamesGrid
          title="Meet the A-list of Games and Activities."
          description="Are you ready for a game-changer? Our collection of move-worthy games and activities (and growing) is the ultimate solution to combining fun, exercise, and learning!"
          query={{
            limit: 9,
            fields: ['slug', 'title', 'excerpt', 'hero_image', 'video_id', 'game_type', 'genre', 'target_age'],
          }}
        />
      </>
    );

  return (
    <main className="bg-brand-gray text-brand-dark">
      {content}
    </main>
  );
}

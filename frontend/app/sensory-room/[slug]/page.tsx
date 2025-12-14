import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/blocks/PageHeader';
import SensoryRoomBundleDetailClient from '@/components/blocks/SensoryRoomBundleDetailClient';
import { getSensoryRoomBundle } from '@/lib/api';
import { absoluteUrl, defaultSeo, mergeSeo, nextSeoToMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getSensoryRoomBundle(slug, { init: { cache: 'no-store' } });

  if (!bundle) {
    return { title: 'Sensory Room bundle not found' };
  }

  const canonical = absoluteUrl(`/sensory-room/${slug}`);

  const seoConfig = mergeSeo(defaultSeo, {
    title: bundle.seo?.title ?? bundle.title,
    description: bundle.seo?.description ?? bundle.excerpt ?? defaultSeo.description,
    canonical,
    openGraph: {
      title: bundle.seo?.title ?? bundle.title,
      description: bundle.seo?.description ?? bundle.excerpt ?? defaultSeo.description,
      url: canonical,
      images: bundle.seo?.og_image ? [{ url: bundle.seo.og_image }] : defaultSeo.openGraph?.images,
    },
  });

  return nextSeoToMetadata(seoConfig);
}

export default async function SensoryRoomBundlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bundle = await getSensoryRoomBundle(slug, { init: { cache: 'no-store' } });

  if (!bundle) {
    notFound();
  }

  return (
    <main className="bg-brand-gray text-brand-dark">
      <PageHeader
        title={bundle.title}
        breadcrumbs={bundle.breadcrumbs ?? null}
        padding="pt-[160px] lg:pt-[198px] pb-[38px]"
      />
      <SensoryRoomBundleDetailClient bundle={bundle} />
    </main>
  );
}

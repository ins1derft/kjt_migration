import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchJson } from '@/lib/api';
import { absoluteUrl, defaultSeo, mergeSeo, nextSeoToMetadata, SITE_URL } from '@/lib/seo';

type StoreProduct = {
  slug: string;
  name: string;
  excerpt?: string | null;
  description?: string | null;
  image?: string | null;
  price?: number | null;
  is_available: boolean;
  seo?: {
    title?: string | null;
    description?: string | null;
    canonical?: string | null;
    og_image?: string | null;
  } | null;
};

export const dynamic = 'force-dynamic';

async function fetchStoreProduct(slug: string) {
  return fetchJson<StoreProduct>(`/store/products/${slug}`, { cache: 'no-store' });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchStoreProduct(slug);

  if (!product) {
    return { title: 'Product not found' };
  }

  const canonical = absoluteUrl(`/store/${slug}`);

  const seoConfig = mergeSeo(defaultSeo, {
    title: product.seo?.title ?? product.name,
    description: product.seo?.description ?? product.excerpt ?? defaultSeo.description,
    canonical,
    openGraph: {
      title: product.seo?.title ?? product.name,
      description: product.seo?.description ?? product.excerpt ?? defaultSeo.description,
      url: canonical,
      images: product.seo?.og_image ? [{ url: product.seo.og_image }] : defaultSeo.openGraph?.images,
    },
  });

  return nextSeoToMetadata(seoConfig);
}

export default async function StoreProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchStoreProduct(slug);

  if (!product) {
    notFound();
  }

  const canonicalUrl = absoluteUrl(`/store/${product.slug}`);
  const productImage = absoluteUrl(product.image ?? product.seo?.og_image ?? defaultSeo.openGraph?.images?.[0]?.url ?? `${SITE_URL}/images/KJT-OG-Image-New.png`);
  const priceValue = product.price ? Number(product.price).toFixed(2) : null;
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.excerpt ?? undefined,
    image: [productImage],
    url: canonicalUrl,
    offers: priceValue
      ? {
          '@type': 'Offer',
          price: priceValue,
          priceCurrency: 'USD',
          availability: product.is_available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: canonicalUrl,
        }
      : undefined,
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 xl:px-12 py-12 lg:py-16 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{product?.name}</h1>
        <p className="text-sm text-muted-foreground">
          {product?.is_available ? 'Available' : 'Out of stock'}
          {product?.price ? ` • $${Number(product.price).toLocaleString()}` : ''}
        </p>
      </div>
      {product?.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image} alt={product.name} className="w-full rounded-2xl border border-border object-cover" />
      )}
      {product?.description && (
        <article className="prose max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: product.description }} />
      )}
      <Link className="text-sm font-semibold text-primary hover:underline" href="/store">
        ← Back to store
      </Link>
    </main>
  );
}

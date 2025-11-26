import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchJson } from '@/lib/api';

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

  const seo = product.seo ?? {};
  const url = seo.canonical || `https://kidsjumptech.com/store/${slug}/`;

  return {
    title: seo.title || product.name,
    description: seo.description || product.excerpt || undefined,
    alternates: { canonical: url },
    openGraph: {
      title: seo.title || product.name,
      description: seo.description || product.excerpt || undefined,
      url,
      images: seo.og_image ? [seo.og_image] : [],
    },
  };
}

export default async function StoreProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchStoreProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="page-shell">
      <p className="muted small">Store product</p>
      <h1>{product?.name}</h1>
      {product?.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image} alt={product.name} className="hero-image" />
      )}
      {product?.price && <p className="muted">Price: ${Number(product.price).toLocaleString()}</p>}
      <p className="muted small">{product?.is_available ? 'Available' : 'Out of stock'}</p>
      {product?.description && (
        <article className="rich-text" dangerouslySetInnerHTML={{ __html: product.description }} />
      )}
      <Link className="inline-link" href="/store">
        ← Back to store
      </Link>
    </main>
  );
}

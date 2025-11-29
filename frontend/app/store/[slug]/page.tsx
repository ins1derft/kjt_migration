import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchJson } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <main className="section-shell space-y-6">
      <div className="space-y-2">
        <Badge variant="secondary" className="uppercase tracking-wide">Store product</Badge>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <article className="prose max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: product.description }} />
          </CardContent>
        </Card>
      )}
      <Link className="text-sm font-semibold text-primary hover:underline" href="/store">
        ← Back to store
      </Link>
    </main>
  );
}

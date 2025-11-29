import Link from 'next/link';
import { extractData, fetchJson, type PaginatedResponse } from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type StoreProduct = {
  slug: string;
  name: string;
  excerpt?: string | null;
  price?: number | null;
  is_available: boolean;
};

export const dynamic = 'force-dynamic';

async function fetchStoreProducts() {
  return fetchJson<PaginatedResponse<StoreProduct>>('/store/products?limit=30', {
    revalidate: 180,
  });
}

export default async function StorePage() {
  const payload = await fetchStoreProducts();
  const products = extractData<StoreProduct>(payload);

  return (
    <main className="section-shell space-y-8">
      <header className="space-y-2">
        <Badge variant="secondary" className="uppercase tracking-wide">Store</Badge>
        <h1 className="text-3xl font-bold text-foreground">Equipment & add-ons</h1>
        <p className="text-muted-foreground">Hardware and accessories tailored for installations.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.slug} className="flex h-full flex-col">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">{product.name}</CardTitle>
              {product.excerpt && <p className="text-sm text-muted-foreground">{product.excerpt}</p>}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {product.is_available ? 'Available' : 'Out of stock'}
                {product.price ? ` • $${Number(product.price).toLocaleString()}` : ''}
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link className="text-sm font-semibold text-primary hover:underline" href={`/store/${product.slug}`}>
                View details →
              </Link>
            </CardFooter>
          </Card>
        ))}

        {products.length === 0 && <p className="text-muted-foreground">No products yet.</p>}
      </section>
    </main>
  );
}

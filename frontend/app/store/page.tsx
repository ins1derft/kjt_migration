import Link from 'next/link';
import { extractData, fetchJson, type PaginatedResponse } from '@/lib/api';

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
    <main className="mx-auto w-full max-w-6xl px-4 xl:px-12 py-12 lg:py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Equipment & add-ons</h1>
        <p className="text-muted-foreground">Hardware and accessories tailored for installations.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <p className="text-sm text-muted-foreground">{product.excerpt}</p>
        ))}

        {products.length === 0 && <p className="text-muted-foreground">No products yet.</p>}
      </section>
    </main>
  );
}

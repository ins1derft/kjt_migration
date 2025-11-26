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
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Store</p>
        <h1>Equipment & add-ons</h1>
        <p className="muted">Hardware and accessories tailored for installations.</p>
      </header>

      <section className="card-grid">
        {products.map((product) => (
          <article key={product.slug} className="card">
            <h3>
              <Link href={`/store/${product.slug}`}>{product.name}</Link>
            </h3>
            {product.excerpt && <p className="muted">{product.excerpt}</p>}
            <p className="muted small">
              {product.is_available ? 'Available' : 'Out of stock'}
              {product.price ? ` • $${Number(product.price).toLocaleString()}` : ''}
            </p>
            <Link className="inline-link" href={`/store/${product.slug}`}>
              View details →
            </Link>
          </article>
        ))}

        {products.length === 0 && <p className="muted">No products yet.</p>}
      </section>
    </main>
  );
}
